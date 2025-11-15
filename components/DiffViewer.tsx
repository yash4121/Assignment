import { diffWords } from "diff";

export default function DiffViewer({ before, after }: any) {
  const diffs = diffWords(before, after);

  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {diffs.map((p, i) => (
        <span
          key={i}
          className={
            p.added
              ? "bg-green-200"
              : p.removed
                ? "bg-red-200 line-through"
                : ""
          }
        >
          {p.value}
        </span>
      ))}
    </div>
  );
}
