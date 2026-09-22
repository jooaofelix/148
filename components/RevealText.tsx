"use client";

import { useEffect, useRef, useState } from "react";

interface RevealTextProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
}

/** Reveals a stack of lines one by one as they scroll into view. */
export function RevealText({ lines, className = "", lineClassName = "" }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block transition-all duration-700 ease-out ${lineClassName} ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
