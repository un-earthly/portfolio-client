"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
}

export default function MermaidRenderer({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const hasMermaid = el.querySelector(".mermaid");
    if (!hasMermaid) return;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#0f172a",
          primaryColor: "#1e3a5f",
          primaryTextColor: "#e2e8f0",
          primaryBorderColor: "#378ADD",
          lineColor: "#64748b",
          secondaryColor: "#1e293b",
          tertiaryColor: "#0f172a",
          edgeLabelBackground: "#1e293b",
          clusterBkg: "#1e293b",
          titleColor: "#94a3b8",
          fontFamily: "ui-monospace, monospace",
        },
      });
      mermaid.run({ nodes: el.querySelectorAll(".mermaid") as NodeListOf<HTMLElement> });
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
