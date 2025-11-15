"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DiffViewer from "react-diff-viewer-continued";

export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [proposedEdit, setProposedEdit] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("document");
    if (saved) {
      setMarkdown(saved);
      setLoading(false);
      return;
    }

    fetch("/manual.mmd")
      .then((res) => res.text())
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (markdown.trim().length > 0) {
      localStorage.setItem("document", markdown);
    }
  }, [markdown]);

  const sendRequest = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setShowDiff(false);
    setProposedEdit("");

    const res = await fetch("/api/diff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        left: markdown,
        right: prompt,
      }),
    });

    const data = await res.json();

    setProposedEdit(data.diff || "");
    setShowDiff(true);
    setLoading(false);
  };


  const acceptEdit = () => {
    if (!proposedEdit.trim()) return;

    setUndoStack((prev) => [...prev, markdown]);
    setMarkdown(proposedEdit);

    setRedoStack([]);
    setShowDiff(false);
    setProposedEdit("");
    setPrompt("");
  };

  // Reject
  const rejectEdit = () => {
    setShowDiff(false);
    setProposedEdit("");
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, markdown]);
    setMarkdown(prev);
    setUndoStack((u) => u.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, markdown]);
    setMarkdown(next);
    setRedoStack((r) => r.slice(0, -1));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-600">
        Loading document...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-1/2 border-r overflow-auto p-6 bg-white">
        <div className="flex gap-2 mb-4">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            Undo
          </button>

          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            Redo
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">📄 Document</h2>

        <div className="prose max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>

      {/*Right*/}
      <div className="w-1/2 p-6 bg-gray-50 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">💬 Edit Assistant</h2>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border p-3 rounded-md w-full mb-3"
          rows={3}
          placeholder="Ask something like: 'Turn section 2 into a checklist'"
        />

        <button
          onClick={sendRequest}
          disabled={loading}
          className="bg-black text-white rounded-md px-4 py-2"
        >
          {loading ? "Thinking..." : "Send Request"}
        </button>

        {showDiff && (
          <div className="mt-6 border rounded-md bg-white p-4 overflow-auto">
            <h3 className="font-semibold mb-3">🔍 Proposed Changes</h3>

            <DiffViewer oldValue={markdown} newValue={proposedEdit} splitView />

            <div className="flex gap-3 mt-4">
              <button
                onClick={acceptEdit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Accept
              </button>

              <button
                onClick={rejectEdit}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
