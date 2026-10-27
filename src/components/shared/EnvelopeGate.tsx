"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type EnvelopeGateProps = {
  children: React.ReactNode;
  names?: string;
  accentColor?: string;
};

type Phase = "loading" | "ready" | "opening" | "done";

const MIN_VISIBLE_MS = 1000;
const MAX_WAIT_MS = 6000;
const OPEN_DURATION_MS = 1500;

const BODY = "#efe6d8";
const POCKET = "#f7f0e4";
const FLAP = "#e6d9c3";

export default function EnvelopeGate({ children, names, accentColor }: EnvelopeGateProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const contentRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const accent = accentColor || "#b08d57";
  const initial = (names || "").trim().charAt(0).toUpperCase();

  // Ready once the visible images and fonts have loaded (or the timeout hits)
  useEffect(() => {
    if (phase !== "loading") return;

    const start = performance.now();
    let fontsReady = false;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    document.fonts?.ready.then(() => {
      fontsReady = true;
    });
    if (!document.fonts) fontsReady = true;

    const check = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const images = Array.from(contentRef.current?.querySelectorAll("img") ?? []).filter(
        (img) => img.getBoundingClientRect().top < window.innerHeight
      );
      const imagesReady = images.every((img) => img.complete);

      if (elapsed >= MAX_WAIT_MS || (elapsed >= MIN_VISIBLE_MS && fontsReady && imagesReady)) {
        setPhase("ready");
      } else {
        timer = setTimeout(check, 120);
      }
    };
    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "ready") sealRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => setPhase("done"), reduceMotion ? 500 : OPEN_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  const isOpen = phase === "opening";
  const isReady = phase === "ready";

  return (
    <>
      <div ref={contentRef}>{children}</div>

      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="envelope-gate"
            role="dialog"
            aria-modal="true"
            aria-label="Invitación"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex h-dvh flex-col items-center justify-center gap-10 px-6"
            style={{ background: "radial-gradient(circle at 50% 40%, #fbf7f0 0%, #efe6d8 100%)" }}
          >
            <div className="relative aspect-[4/3] w-[min(82vw,380px)]" style={{ perspective: 1200 }}>
              {/* Back of the envelope */}
              <div className="absolute inset-0 rounded-md shadow-xl" style={{ background: BODY }} />

              {/* Letter */}
              <motion.div
                className="absolute inset-x-[7%] top-[8%] z-10 flex h-[78%] flex-col items-center justify-center rounded-sm bg-white px-4 text-center shadow-md"
                animate={isOpen && !reduceMotion ? { y: "-38%" } : { y: 0 }}
                transition={{ duration: 0.7, delay: isOpen ? 0.55 : 0, ease: "easeInOut" }}
              >
                <p className="font-serif text-[11px] uppercase tracking-[0.35em] text-neutral-500">
                  Estás invitado
                </p>
                {names && (
                  <p className="mt-3 line-clamp-2 font-serif text-xl italic text-neutral-800">{names}</p>
                )}
              </motion.div>

              {/* Front pocket */}
              <div
                className="absolute inset-0 z-20 rounded-md"
                style={{
                  background: POCKET,
                  clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)",
                  filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.08))",
                }}
              />

              {/* Flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[56%]"
                style={{ transformOrigin: "top center", background: FLAP, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                animate={
                  isOpen && !reduceMotion
                    ? { rotateX: 180, zIndex: [30, 30, 5] }
                    : { rotateX: 0, zIndex: 30 }
                }
                transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.5, 1] }}
              />

              {/* Seal */}
              <motion.button
                ref={sealRef}
                type="button"
                onClick={() => isReady && setPhase("opening")}
                disabled={!isReady}
                aria-label="Abrir invitación"
                className="absolute left-1/2 top-[56%] z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-serif text-2xl text-white shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-white/70 disabled:cursor-default"
                style={{ background: `radial-gradient(circle at 35% 30%, ${accent}, ${accent}cc 70%, #00000040)` }}
                animate={
                  isOpen
                    ? { opacity: 0, scale: 0.6 }
                    : isReady && !reduceMotion
                      ? { opacity: 1, scale: [1, 1.08, 1] }
                      : { opacity: 1, scale: 1 }
                }
                transition={
                  isReady && !isOpen
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                {initial}
              </motion.button>
            </div>

            <p
              className="h-5 font-serif text-xs uppercase tracking-[0.3em] text-neutral-600"
              role="status"
              aria-live="polite"
            >
              {phase === "loading" ? "Preparando tu invitación…" : isReady ? "Toca para abrir" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
