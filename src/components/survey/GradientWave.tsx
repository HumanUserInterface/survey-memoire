"use client";

export function GradientWave() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-black">
      {/* Large blurred gradient blob — moves slowly from top-left to bottom-right */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15] animate-[drift_25s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, #B5A895 0%, #87603F 40%, transparent 70%)",
          filter: "blur(120px)",
          top: "-10%",
          left: "-10%",
        }}
      />

      {/* Secondary smaller blob — offset timing */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] animate-[drift2_30s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(circle, #87603F 0%, #B5A895 50%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "0%",
          right: "-5%",
        }}
      />

      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translate(0%, 0%);
          }
          50% {
            transform: translate(60vw, 50vh) scale(1.1);
          }
          100% {
            transform: translate(0%, 0%);
          }
        }
        @keyframes drift2 {
          0% {
            transform: translate(0%, 0%);
          }
          50% {
            transform: translate(-40vw, -30vh) scale(0.9);
          }
          100% {
            transform: translate(0%, 0%);
          }
        }
      `}</style>
    </div>
  );
}
