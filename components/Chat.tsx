"use client";
import { useState } from "react";
import { useDocument } from "../context/DocumentContext";
import DiffViewer from "./DiffViewer";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [diff, setDiff] = useState<any>(null);

  const { markdown, setMarkdown } = useDocument();

  async function send() {
    const res = await fetch("/api/edit", {
      method: "POST",
      body: JSON.stringify({ markdown, instruction: input }),
    });

    const data = await res.json();
    setDiff(data);
  }

  function accept() {
    setMarkdown(diff.after);
    setDiff(null);
  }

  function discard() {
    setDiff(null);
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <textarea
        className="border p-2 w-full h-32"
        placeholder="Ask something like: convert section 2 to a checklist..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2" onClick={send}>
        Apply Edit
      </button>

      {diff && (
        <div className="border p-3 bg-white">
          <DiffViewer before={diff.before} after={diff.after} />

          <div className="flex gap-2 mt-3">
            <button
              className="bg-green-600 text-white px-4 py-2"
              onClick={accept}
            >
              Accept
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2"
              onClick={discard}
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
