# OurTextScores Web Editor (Phase 0)

Browser-based music score editor using MuseScore’s engraving engine (`libmscore`) compiled to WebAssembly (via a `webmscore` fork).

## Git LFS Required

This repo stores large WASM/soundfont assets in Git LFS. If you clone without LFS, you’ll get pointer files and the app won’t run.

```bash
git lfs install
git clone https://github.com/OurTextScores/OTS_Web.git
cd OTS_Web
git lfs pull
```

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
