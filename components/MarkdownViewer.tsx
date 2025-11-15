import { useDocument } from "../context/DocumentContext";
import ReactMarkdown from "react-markdown";

export default function MarkdownViewer() {
  const { markdown } = useDocument();

  return (
    <div className="p-6 prose max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
