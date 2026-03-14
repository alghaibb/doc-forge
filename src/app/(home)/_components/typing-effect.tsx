"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
  /** Phrases to type in sequence; cycles back to first after the last. */
  phrases: string[];
  /** Delay between typing each character (ms). */
  typingSpeed?: number;
  /** Delay after a phrase is complete before deleting (ms). */
  pauseAfter?: number;
  /** Delay between deleting each character (ms). Set 0 to skip delete and jump to next phrase. */
  deleteSpeed?: number;
  /** Whether to show a blinking cursor. */
  cursor?: boolean;
  className?: string;
}

export function TypingEffect({
  phrases,
  typingSpeed = 50,
  pauseAfter = 2000,
  deleteSpeed = 30,
  cursor = true,
  className,
}: TypingEffectProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const currentPhrase = phrases[phraseIndex] ?? "";
  const displayed = isDeleting
    ? currentPhrase.slice(0, charIndex)
    : currentPhrase.slice(0, charIndex);

  // Typing / deleting logic
  useEffect(() => {
    if (phrases.length === 0) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentPhrase.length) {
            setCharIndex((c) => c + 1);
          } else {
            setIsDeleting(true);
            setCharIndex(currentPhrase.length);
          }
        } else {
          if (charIndex > 0) {
            setCharIndex((c) => c - 1);
          } else {
            setIsDeleting(false);
            setPhraseIndex((p) => (p + 1) % phrases.length);
          }
        }
      },
      isDeleting
        ? deleteSpeed
        : charIndex === currentPhrase.length && !isDeleting
          ? pauseAfter
          : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    isDeleting,
    currentPhrase,
    phrases.length,
    phraseIndex,
    typingSpeed,
    pauseAfter,
    deleteSpeed,
  ]);

  // Blinking cursor
  useEffect(() => {
    if (!cursor) return;
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <span className={className}>
      {displayed}
      {cursor && (
        <span
          className="ml-0.5 inline-block h-[1em] w-[2px] shrink-0 bg-current align-middle"
          style={{ opacity: cursorVisible ? 1 : 0 }}
          aria-hidden
        />
      )}
    </span>
  );
}
