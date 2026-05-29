#!/usr/bin/env python3
"""Convert between Humdrum **kern and MusicXML using music21."""

from __future__ import annotations

import os
import subprocess
import sys


def _print_version() -> int:
    try:
        import music21  # type: ignore

        print(f"kern-musicxml-converter (music21 {getattr(music21, '__version__', 'unknown')})")
        return 0
    except Exception as exc:  # pragma: no cover - best effort version output
        print(f"kern-musicxml-converter (music21 unavailable: {exc})")
        return 0


def _usage() -> int:
    print(
        "Usage: convert_kern_musicxml.py <kern-to-musicxml|musicxml-to-kern> <input> <output>",
        file=sys.stderr,
    )
    return 2


def _parse_score(input_path: str, input_format: str):
    from music21 import converter  # type: ignore

    try:
        return converter.parse(input_path, format=input_format)
    except Exception:
        return converter.parse(input_path)


def _write_score(score, output_format: str, output_path: str) -> None:
    out_dir = os.path.dirname(os.path.abspath(output_path))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    score.write(output_format, fp=output_path)


def _ensure_music21():
    try:
        import music21  # type: ignore
        return music21
    except Exception:
        auto_install = os.environ.get("MUSIC_KERN_MUSICXML_AUTO_INSTALL", "1").strip().lower()
        if auto_install not in {"1", "true", "yes", "on"}:
            raise
        pip_args = [
            sys.executable,
            "-m",
            "pip",
            "install",
            "--break-system-packages",
            "--no-cache-dir",
            "music21>=9,<10",
        ]
        try:
            subprocess.run(pip_args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        except Exception as exc:
            raise RuntimeError(f"Failed to auto-install music21: {exc}") from exc
        import music21  # type: ignore
        return music21


def main(argv: list[str]) -> int:
    if len(argv) == 2 and argv[1] in {"--version", "-V", "-v"}:
        return _print_version()

    if len(argv) != 4:
        return _usage()

    direction, input_path, output_path = argv[1], argv[2], argv[3]
    if direction not in {"kern-to-musicxml", "musicxml-to-kern"}:
        return _usage()

    try:
        _ensure_music21()
        if direction == "kern-to-musicxml":
            score = _parse_score(input_path, "humdrum")
            _write_score(score, "musicxml", output_path)
        else:
            score = _parse_score(input_path, "musicxml")
            _write_score(score, "humdrum", output_path)
        return 0
    except Exception as exc:
        print(f"{direction} failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
