// Mirrors the closed envelope from EnvelopeGate so the handoff is seamless
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex h-dvh flex-col items-center justify-center gap-10 px-6"
      style={{ background: "radial-gradient(circle at 50% 40%, #fbf7f0 0%, #efe6d8 100%)" }}
      role="status"
      aria-live="polite"
    >
      <div className="relative aspect-[4/3] w-[min(82vw,380px)] animate-pulse">
        <div className="absolute inset-0 rounded-md shadow-xl" style={{ background: "#efe6d8" }} />
        <div
          className="absolute inset-0 rounded-md"
          style={{ background: "#f7f0e4", clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[56%]"
          style={{ background: "#e6d9c3", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
        <div
          className="absolute left-1/2 top-[56%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
          style={{ background: "radial-gradient(circle at 35% 30%, #b08d57, #b08d57cc 70%, #00000040)" }}
        />
      </div>
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-neutral-600">
        Preparando tu invitación…
      </p>
    </div>
  );
}
