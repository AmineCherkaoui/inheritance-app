import React from 'react';

export default function AppBackground() {
  return (
    <div className="fixed inset-0 brightness-50 pointer-events-none overflow-hidden z-0 select-none">
      {/* Top-Right Motif with edge radial fade */}
      <div
        className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-160  lg:w-280 aspect-square opacity-5 bg-contain bg-no-repeat bg-top-right"
        style={{
          backgroundImage: "url('/images/bg-motif.svg')",
          WebkitMaskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 72%)',
          maskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 72%)'
        }}
      />

      {/* Bottom-Left Motif with edge radial fade */}
      <div
        className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-120 sm:w-160  aspect-square opacity-5 bg-contain bg-no-repeat bg-bottom-left rotate-180"
        style={{
          backgroundImage: "url('/images/bg-motif.svg')",
          WebkitMaskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)',
          maskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)'
        }}
      />

      {/* Soft edge gradient overlay */}
    </div>
  );
}
