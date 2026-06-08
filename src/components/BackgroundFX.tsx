export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />
      {/* Radial primary glow */}
      <div className="absolute inset-0 bg-radial-primary opacity-60" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Light streak */}
      <div className="absolute -inset-[20%] animate-scan opacity-30">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-primary/70"
            style={{
              left: `${(i * 53) % 100}%`,
              animation: `float-up ${8 + (i % 7)}s linear ${(i % 5) * 1.2}s infinite`,
            }}
          />
        ))}
      </div>
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.1_0.02_245/0.85)_100%)]" />
    </div>
  );
}
