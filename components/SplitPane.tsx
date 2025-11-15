import MarkdownViewer from "./MarkdownViewer";
import ChatPanel from "./Chat";

export default function SplitPane() {
  return (
    <div className="h-full flex">
      <div className="w-1/2 border-r overflow-auto bg-white">
        <MarkdownViewer />
      </div>
      <div className="w-1/2 overflow-auto bg-gray-50">
        <ChatPanel />
      </div>
    </div>
  );
}
