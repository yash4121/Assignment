"use client";

import { createContext, useContext, useState } from "react";

interface DocCtx {
  markdown: string;
  setMarkdown: (v: string) => void;
}

const Context = createContext<DocCtx | null>(null);

export function DocumentProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial: string;
}) {
  const [markdown, setMarkdown] = useState(initial);

  return (
    <Context.Provider value={{ markdown, setMarkdown }}>
      {children}
    </Context.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("DocumentContext missing");
  return ctx;
}
