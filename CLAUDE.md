# CLAUDE.md — EDI: Neural Document QA

> This file provides context for AI assistants (Claude, Gemini, etc.) working on this project.
> **Last updated:** 2026-03-29

---

## Project Overview

**EDI** is a **Multimodal AI Document Question Answering** web application.  
Users upload a document image (JPG, PNG, WebP), type a question about it, and receive an AI-generated answer — with bounding box highlighting of the relevant region.

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Framer Motion
- **Backend (expected):** Python API exposed at `POST /ask` (not in this repo)
- **AI Model:** Donut-Base (document understanding via OCR-free transformer)

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| UI Library  | React 19                            |
| Build Tool  | Vite 8                              |
| Styling     | Tailwind CSS v4 + custom CSS        |
| Animations  | Framer Motion 12                    |
| Icons       | Lucide React                        |
| Toasts      | react-hot-toast                     |
| Linting     | ESLint 9 (with react-hooks plugin)  |

---

## Project Structure

```
EDI/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/
│   │   ├── Header.jsx           # Top navbar with branding
│   │   ├── DocumentUpload.jsx   # Drag-and-drop file upload + bounding box overlay
│   │   ├── QuestionPanel.jsx    # Text input + "Ask" button
│   │   ├── AnswerDisplay.jsx    # Renders AI answer + confidence score
│   │   └── ParticleField.jsx    # Animated canvas background particles
│   ├── App.jsx              # Root component — state, API call, layout
│   ├── App.css              # Global animation keyframes & glass styles
│   ├── index.css            # Tailwind base + design tokens
│   └── main.jsx             # React root mount
├── index.html               # HTML entry point
├── vite.config.js           # Vite + React plugin config
├── eslint.config.js         # ESLint flat config
├── package.json
└── CLAUDE.md                # ← you are here
```

---

## Key Commands

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Lint the codebase
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## API Contract

The frontend POSTs to `/ask` using `multipart/form-data`:

```
POST /ask
Content-Type: multipart/form-data

Fields:
  image     → File  (JPG | PNG | WebP)
  question  → string
```

**Expected JSON response:**

```json
{
  "answer": "string",
  "confidence": 0.87,
  "bounding_box": [x, y, width, height]   // optional, pixel coords on image
}
```

> If the backend is unavailable, the app falls back to a **demo mode** with a hardcoded response.

---

## Component Responsibilities

| Component          | Responsibility                                              |
|--------------------|-------------------------------------------------------------|
| `App.jsx`          | Global state, API call handler, layout orchestration        |
| `Header.jsx`       | Branding bar (title, subtitle, status badge)                |
| `DocumentUpload`   | File drag-and-drop, preview, bounding box SVG overlay       |
| `QuestionPanel`    | Question text area, submit button, loading state            |
| `AnswerDisplay`    | Renders answer text, confidence bar, animated entry         |
| `ParticleField`    | Canvas-based floating particle animation (decorative)       |

---

## State (App.jsx)

| State Variable  | Type      | Purpose                                    |
|-----------------|-----------|--------------------------------------------|
| `uploadedFile`  | `File`    | Current uploaded image file object         |
| `previewUrl`    | `string`  | Object URL for image preview               |
| `question`      | `string`  | User's typed question                      |
| `answer`        | `object`  | API response (answer, confidence, bbox)    |
| `loading`       | `boolean` | True while awaiting API response           |
| `boundingBox`   | `array`   | `[x, y, w, h]` from API for doc highlight |

---

## Styling Notes

- **Background:** Near-black `#050814` with animated grid + radial glow blobs
- **Glass cards:** `.glass` utility class (backdrop blur + subtle border)
- **Color palette:** Indigo/violet (`#4f46e5`, `#6366f1`, `#8b5cf6`) on dark slate
- **Animations:** `pulse-glow`, `animated-grid` defined in `App.css`; enter animations via Framer Motion

---

## Accepted File Types

- `image/jpeg`
- `image/png`  
- `image/webp`

---

## Future Work / Known Limitations

- [ ] PDF support (currently image-only)
- [ ] Multi-page document navigation
- [ ] Answer history / conversation memory
- [ ] Backend repository not included here (connect separately)
- [ ] No auth layer — open to any request

---

## Change Log

| Date       | Change                              |
|------------|-------------------------------------|
| 2026-03-29 | Initial `CLAUDE.md` created         |
