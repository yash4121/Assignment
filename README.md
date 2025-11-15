##Split-Pane AI Markdown Editor

This is a full-stack assignment project implementing a two-pane markdown editor with AI-powered document editing.
#Left: renders a Markdown document

#Right: a chat panel where the user can type natural edit requests

AI applies edits → shows before/after diff → user Accept (apply) or Discard

Supports Undo / Redo, and stable AI integration

Backend uses Google Gemini 2.5 Flash via a minimal API route

Fully built with Next.js (App Router) + React + TypeScript

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js (App Router), React, TypeScript             |
| Styling    | TailwindCSS (optional)                              |
| AI Backend | Google Gemini 2.5 Flash via `@google/generative-ai` |
| Diff       | `react-diff-viewer-continued`                       |
| Markdown   | `react-markdown`                                    |

##Installation and Setup

1) git clone repo url
2) cd project folder
3) npm install
4) GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE in .env file
5) npm run dev

#App runs at http://localhost:3000

##Limitations
Even large language models may:
1) reformat certain parts
2) reorder bullets
3) modify spacing
4) revise sentences unintentionally
5) For extremely long markdown files, Gemini response may be slow.
6) Real-time multi-user editing (like Google Docs) is not implemented.

This is why diff preview + Accept/Reject is essential.