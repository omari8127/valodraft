export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Radial primary glow */}
      <div className="absolute inset-0 bg-radial-primary opacity-80" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* Light streak */}
      <div className="absolute -inset-[20%] animate-scan opacity-40">
        <div 
          className="h-[2px] w-full" 
          style={{ backgroundImage: "linear-gradient(to right, transparent, var(--glow-color), transparent)" }} 
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full"
            style={{
              backgroundColor: "var(--particle-color)",
              boxShadow: "0 0 6px var(--particle-color)",
              left: `${(i * 53) % 100}%`,
              animation: `float-up ${14 + (i % 8)}s linear ${(i % 6) * 1.5}s infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,13,0.9)_100%)]" />
    </div>
  );
}
