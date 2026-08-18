import React from 'react';
import { cn } from '../utils';

export default function AppBackground({ className = 'fixed inset-0' }) {
  return (
    <div className={cn("brightness-50 pointer-events-none overflow-hidden z-0 select-none", className)}>
      {/* Top-Right Motif with edge radial fade */}
      <div
        className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-160  lg:w-280 aspect-square opacity-15 bg-contain bg-no-repeat bg-top-right"
        style={{
          backgroundImage: "url('/images/bg-motif.svg')",
          WebkitMaskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 72%)',
          maskImage: 'radial-gradient(circle at 150% -40%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 72%)'
        }}
      />

      {/* Bottom-Left Motif with edge radial fade */}
      <div
        className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-120 sm:w-160 opacity-15  aspect-square bg-contain bg-no-repeat bg-bottom-left rotate-180"
        style={{
          backgroundImage: "url('/images/bg-motif.svg')",
          WebkitMaskImage: 'radial-gradient(circle at 85% 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)',
          maskImage: 'radial-gradient(circle at 180% -100%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 82%)'
        }}
      />

      {/* Soft edge gradient overlay */}
    </div>
  );
}
