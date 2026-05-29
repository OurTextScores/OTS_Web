# Transcoda Hugging Face Space Runbook

This runbook describes how to deploy `btrkeks/transcoda-59M-zeroshot-v1` behind a Hugging Face Space and how it should fit into OTS_Web.

## Summary

Do create a Hugging Face Space for Transcoda, but do not wire it into the existing NotaGen Space path as-is.

The current OTS_Web NotaGen integration is a Gradio Space adapter for symbolic generation. It expects a Space that:

- exposes `/update_components`, `/update_components_1`, and `/generate_music`;
- accepts `period`, `composer`, and `instrumentation`;
- returns generated ABC in the second Gradio output slot;
- lets OTS_Web convert ABC to MusicXML before applying it to the score.

Transcoda is a different class of model. It is an Optical Music Recognition model that accepts a page image and emits `**kern` / Humdrum text. The Space should expose an image-to-kern transcription endpoint, then OTS_Web needs a new OMR route that calls that endpoint and converts `**kern` to MusicXML if/when we add that conversion path.

## Source Facts

- Model: `btrkeks/transcoda-59M-zeroshot-v1`
- Task: image-to-text Optical Music Recognition.
- Output format: `**kern` / Humdrum symbolic transcription.
- Library: Transformers with `trust_remote_code=True`.
- Size: 58.8M parameters, stored as safetensors plus a Lightning `.ckpt`.
- License: CC BY 4.0.
- Current model revision observed: `b529f8aa5d996d9224df3395b5b92d0867343c91`.
- Required preprocessing: one RGB page image resized/padded/cropped to `(height=1485, width=1050)`, normalized to `[-1, 1]`, passed as `pixel_values` with `image_sizes=[[1485, 1050]]`.

## Current OTS_Web Integration Points

Read these files before changing the app:

- `components/ScoreEditor.tsx`
  - Loads the NotaGen sidebar tab.
  - Calls `/api/music/notagen-space/options` to read `prompts.txt` from a Space.
  - Calls `/api/music/generate/stream` with `backend: "huggingface-space"`.
- `app/api/music/notagen-space/options/route.ts`
  - Fetches `https://huggingface.co/spaces/{owner}/{repo}/raw/{revision}/prompts.txt`.
  - Parses prompt option names as `period_composer_instrumentation`.
- `app/api/music/generate/stream/route.ts`
  - Connects to a Gradio Space with `@gradio/client`.
  - Calls `/update_components`, `/update_components_1`, and `/generate_music`.
  - Treats the Space output as ABC, validates it, converts it to MusicXML, and creates score artifacts.
- `lib/music-services/generate-service.ts`
  - Contains the non-streaming version of the same NotaGen backend logic.

The Transcoda Space should not pretend to be NotaGen unless you also build a compatibility layer that turns a score image into MusicXML and returns ABC/MusicXML in the exact existing shape. A separate OMR route is cleaner.

## Space Design

Use a Gradio Space first. Docker is only necessary if dependency resolution or system packages become painful.

Recommended public API:

- Gradio endpoint name: `/transcribe`
- Inputs:
  - `image`: uploaded page image.
  - `decoding`: one of `greedy`, `beam`.
  - `max_length`: default `2048`.
  - `num_beams`: default `1` for greedy, `3` for beam.
  - `repetition_penalty`: default `1.1`.
- Outputs:
  - `kern`: generated `**kern` text.
  - `metadata`: JSON with model id, revision, decoding settings, elapsed time, device, and warnings.

Keep grammar-constrained decoding out of the first Space unless you also vendor the Transcoda repo code and grammar assets. The model card says grammar-constrained decoding requires the project repository. Start with greedy/beam generation from the Hugging Face model package.

## Create The Space

1. In Hugging Face, create a new Space.
2. Choose:
   - SDK: `Gradio`
   - Visibility: `Public` while prototyping, or `Private` if you do not want source visible.
   - Suggested name: `transcoda`
   - License: match model usage expectations; include attribution for CC BY 4.0.
3. Select hardware:
   - Start with CPU only for boot testing.
   - Move to a small GPU if inference is too slow or memory is tight. The model is only 58.8M parameters, but the fixed 1485 x 1050 image tensor and custom vision stack can still be slow on CPU.
4. Clone the Space repository locally:

```bash
git clone https://huggingface.co/spaces/<owner>/transcoda
cd transcoda
```

## Space Files

Create `requirements.txt`:

```txt
gradio
transformers
torch
torchvision
pillow
numpy
accelerate
safetensors
loguru
torchtune
```

`loguru` and `torchtune` are required by the model repository's remote Python code when
`trust_remote_code=True` is used.

Create `app.py`:

```python
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
```

Create `README.md`:

```md
---
title: Transcoda OMR
sdk: gradio
python_version: "3.11"
app_file: app.py
models:
- btrkeks/transcoda-59M-zeroshot-v1
---

# Transcoda OMR

Gradio wrapper for `btrkeks/transcoda-59M-zeroshot-v1`.
```

Prefer Python 3.11 for the first Space deployment. It keeps the PyTorch, Transformers,
and Torchtune dependency set on the most common Hugging Face Spaces path.

Push:

```bash
git add app.py requirements.txt README.md
git commit -m "Create Transcoda OMR Space"
git push
```

## Validate The Space

After the Space builds, test it locally from OTS_Web or any Node/Python shell with the Gradio client.

Python smoke test:

```python
from gradio_client import Client, handle_file

client = Client("<owner>/transcoda")
result = client.predict(
    image=handle_file("./sample-page.png"),
    decoding="greedy",
    max_length=2048,
    num_beams=3,
    repetition_penalty=1.1,
    api_name="/transcribe",
)
print(result[0])
print(result[1])
```

Acceptance criteria:

- Space cold-starts and loads the pinned model revision.
- `/transcribe` returns non-empty `**kern` text for a simple page image.
- Metadata reports the expected model id and revision.
- A bad or missing image returns a clear Gradio error.
- Beam mode works or is deliberately disabled if it is too slow for the chosen hardware.

## Configure OTS_Web

Once the Space exists, add separate Transcoda environment variables instead of reusing the NotaGen ones:

```bash
MUSIC_TRANSCODA_SPACE_ID=<owner>/transcoda
MUSIC_TRANSCODA_SPACE_TOKEN=
MUSIC_TRANSCODA_MODEL_ID=btrkeks/transcoda-59M-zeroshot-v1
MUSIC_TRANSCODA_REVISION=b529f8aa5d996d9224df3395b5b92d0867343c91
```

Use `MUSIC_TRANSCODA_SPACE_TOKEN` only if the Space is private or protected.

## OTS_Web Follow-On Work

Add a new OMR service rather than extending `music.generate`:

- `app/api/music/omr/transcribe/route.ts`
  - Accepts an uploaded image or artifact id.
  - Connects to the Gradio Space.
  - Calls `/transcribe`.
  - Returns `kern`, metadata, and optionally a converted MusicXML artifact.
- `lib/music-services/omr-service.ts`
  - Owns Space calling, timeout handling, validation, and artifact creation.
- `lib/music-services/contracts/music-omr-transcribe-contract.ts`
  - Documents request/response shape.
- `components/ScoreEditor.tsx`
  - Adds a separate OMR UI, probably near import/apply workflows rather than inside the NotaGen generation controls.

The unresolved dependency is conversion from `**kern` to MusicXML. Options:

- Add a Humdrum/Verovio conversion step in the backend if a reliable CLI/library is available in deployment.
- Return `**kern` only in v1 and let the UI display/download it without applying to the score.
- Build a Space-side conversion endpoint if the conversion dependencies are easier to package there.

Do not mark this feature as "apply to score" until the `**kern -> MusicXML` path is validated on representative Transcoda output.

## Operational Notes

- Pin the model revision. The model uses custom remote code, so reproducibility matters more than usual.
- Keep `trust_remote_code=True` scoped to this isolated Space. Avoid loading this custom model directly inside the OTS_Web Next.js process.
- Use persistent storage only if cold starts become painful from repeated model downloads.
- If using persistent storage, set cache paths such as `HF_HOME=/data/.huggingface` in the Space settings.
- Public Spaces expose their source. Use a private or protected Space if you need to hide implementation details.
- If the Space sleeps, the first OTS_Web request may time out. Either raise OTS_Web timeout for cold starts or keep the Space warm with paid hardware/sleep settings.
- Add attribution for the CC BY 4.0 model in any public UI or docs.

## Rollback

If the Space is unstable:

1. Remove or unset `MUSIC_TRANSCODA_SPACE_ID` in OTS_Web deployment.
2. Hide the Transcoda/OMR UI behind a feature flag until the Space is healthy.
3. Revert to returning `**kern` only if conversion is the failure point.
4. In Hugging Face, pause or downgrade the Space hardware to stop spend.
