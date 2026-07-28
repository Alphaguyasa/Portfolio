"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 52;
const HOLD_MS = 2200;

/** Types each phrase in turn at 52ms/char, holds 2.2s, then starts the next one. */
export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [pos, setPos] = useState({ phrase: 0, chars: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const word = phrases[pos.phrase % phrases.length];
  const complete = pos.chars >= word.length;

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(
      () =>
        setPos(({ phrase, chars }) =>
          chars >= phrases[phrase % phrases.length].length
            ? { phrase: phrase + 1, chars: 0 }
            : { phrase, chars: chars + 1 },
        ),
      complete ? HOLD_MS : TYPE_MS,
    );
    return () => clearTimeout(id);
  }, [pos, complete, phrases, reduced]);

  return (
    <>
      <span>{reduced ? phrases[0] : word.slice(0, pos.chars) || " "}</span>
      <span className="inline-block h-5 w-[9px] translate-y-[2px] bg-accent animate-blink" />
    </>
  );
}
