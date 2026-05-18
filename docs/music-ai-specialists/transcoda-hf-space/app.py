import json
import threading
import time
import traceback

import gradio as gr
import numpy as np
import torch
from PIL import Image
from transformers import AutoModelForCausalLM, PreTrainedTokenizerFast

MODEL_ID = "btrkeks/transcoda-59M-zeroshot-v1"
MODEL_REVISION = "b529f8aa5d996d9224df3395b5b92d0867343c91"
TARGET_W = 1050
TARGET_H = 1485

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
_load_lock = threading.Lock()
_model = None
_tokenizer = None
_load_error = None


def _log(message: str) -> None:
    print(f"[transcoda-space] {message}", flush=True)


def get_model_and_tokenizer():
    global _load_error, _model, _tokenizer

    if _model is not None and _tokenizer is not None:
        return _model, _tokenizer
    if _load_error is not None:
        raise RuntimeError(_load_error)

    with _load_lock:
        if _model is not None and _tokenizer is not None:
            return _model, _tokenizer
        if _load_error is not None:
            raise RuntimeError(_load_error)

        started = time.time()
        try:
            _log(f"Loading {MODEL_ID}@{MODEL_REVISION} on {DEVICE}")
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_ID,
                revision=MODEL_REVISION,
                trust_remote_code=True,
            ).to(DEVICE)
            model.eval()
            tokenizer = PreTrainedTokenizerFast.from_pretrained(
                MODEL_ID,
                revision=MODEL_REVISION,
            )
            _model = model
            _tokenizer = tokenizer
            _log(f"Model loaded in {time.time() - started:.1f}s")
            return _model, _tokenizer
        except Exception:
            _load_error = traceback.format_exc()
            _log("Model load failed:\n" + _load_error)
            raise RuntimeError(_load_error)


def preload_model() -> None:
    try:
        get_model_and_tokenizer()
    except Exception:
        pass


def preprocess_pil_image(image: Image.Image) -> torch.Tensor:
    img = image.convert("RGB")
    new_h = max(1, int(img.height * (TARGET_W / img.width)))
    img = img.resize((TARGET_W, new_h), Image.BILINEAR)
    arr = np.array(img)

    if arr.shape[0] > TARGET_H:
        arr = arr[:TARGET_H]
    elif arr.shape[0] < TARGET_H:
        pad = np.full((TARGET_H - arr.shape[0], TARGET_W, 3), 255, dtype=arr.dtype)
        arr = np.concatenate([arr, pad], axis=0)

    tensor = torch.from_numpy(arr).permute(2, 0, 1).float() / 255.0
    tensor = (tensor - 0.5) / 0.5
    return tensor.unsqueeze(0)


def transcribe(image, decoding, max_length, num_beams, repetition_penalty):
    if image is None:
        raise gr.Error("Upload a score page image.")

    started = time.time()
    try:
        model, tokenizer = get_model_and_tokenizer()
    except Exception as exc:
        raise gr.Error(f"Transcoda failed to load. Check container logs.\n\n{exc}") from exc

    pil_image = image if isinstance(image, Image.Image) else Image.fromarray(image)
    pixel_values = preprocess_pil_image(pil_image).to(DEVICE)
    image_sizes = torch.tensor([[TARGET_H, TARGET_W]], device=DEVICE)

    beams = 1 if decoding == "greedy" else int(num_beams or 3)
    input_ids = torch.full(
        (1, 1),
        int(model.config.bos_token_id),
        dtype=torch.long,
        device=DEVICE,
    )
    with torch.no_grad():
        output = model.generate(
            input_ids=input_ids,
            pixel_values=pixel_values,
            image_sizes=image_sizes,
            max_length=int(max_length or 2048),
            do_sample=False,
            num_beams=beams,
            repetition_penalty=float(repetition_penalty or 1.1),
        )

    kern = tokenizer.decode(output[0], skip_special_tokens=True)
    metadata = {
        "model": MODEL_ID,
        "revision": MODEL_REVISION,
        "device": DEVICE,
        "decoding": decoding,
        "num_beams": beams,
        "max_length": int(max_length or 2048),
        "repetition_penalty": float(repetition_penalty or 1.1),
        "elapsed_ms": int((time.time() - started) * 1000),
        "output_chars": len(kern),
    }
    return kern, json.dumps(metadata, indent=2)


threading.Thread(target=preload_model, daemon=True).start()

with gr.Blocks() as demo:
    gr.Markdown("# Transcoda OMR")
    with gr.Row():
        image = gr.Image(type="pil", label="Score page image")
        with gr.Column():
            decoding = gr.Radio(["greedy", "beam"], value="greedy", label="Decoding")
            max_length = gr.Number(value=2048, precision=0, label="Max length")
            num_beams = gr.Number(value=3, precision=0, label="Beam count")
            repetition_penalty = gr.Number(value=1.1, label="Repetition penalty")
            run = gr.Button("Transcribe")
    kern = gr.Textbox(label="Generated **kern", lines=24)
    metadata = gr.Code(label="Metadata", language="json")

    run.click(
        transcribe,
        inputs=[image, decoding, max_length, num_beams, repetition_penalty],
        outputs=[kern, metadata],
        api_name="transcribe",
    )

demo.queue().launch()
