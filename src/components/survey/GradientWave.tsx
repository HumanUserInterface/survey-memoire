"use client";

export function GradientWave() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a]" />

      {/* Animated wave layers */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[60vh] opacity-30"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87603F" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#B5A895" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#87603F" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B5A895" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#87603F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B5A895" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87603F" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B5A895" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Wave 1 — slowest, back */}
        <path fill="url(#wave3)" opacity="0.5">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="
              M0,400 C360,300 720,500 1080,350 C1260,300 1440,400 1440,400 L1440,600 L0,600 Z;
              M0,350 C360,450 720,300 1080,400 C1260,450 1440,350 1440,350 L1440,600 L0,600 Z;
              M0,400 C360,300 720,500 1080,350 C1260,300 1440,400 1440,400 L1440,600 L0,600 Z
            "
          />
        </path>

        {/* Wave 2 — middle */}
        <path fill="url(#wave2)" opacity="0.6">
          <animate
            attributeName="d"
            dur="14s"
            repeatCount="indefinite"
            values="
              M0,450 C240,380 480,520 720,430 C960,340 1200,480 1440,420 L1440,600 L0,600 Z;
              M0,420 C240,500 480,380 720,460 C960,520 1200,380 1440,450 L1440,600 L0,600 Z;
              M0,450 C240,380 480,520 720,430 C960,340 1200,480 1440,420 L1440,600 L0,600 Z
            "
          />
        </path>

        {/* Wave 3 — fastest, front */}
        <path fill="url(#wave1)" opacity="0.4">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,480 C180,440 360,520 540,470 C720,420 900,500 1080,460 C1260,420 1440,480 1440,480 L1440,600 L0,600 Z;
              M0,460 C180,510 360,440 540,490 C720,530 900,450 1080,490 C1260,520 1440,460 1440,460 L1440,600 L0,600 Z;
              M0,480 C180,440 360,520 540,470 C720,420 900,500 1080,460 C1260,420 1440,480 1440,480 L1440,600 L0,600 Z
            "
          />
        </path>
      </svg>

      {/* Top subtle glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse, #B5A895 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
