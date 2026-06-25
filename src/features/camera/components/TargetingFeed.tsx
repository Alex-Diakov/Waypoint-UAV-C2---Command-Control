import React from 'react';

export const TargetingFeed: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 w-[320px] h-[240px] border border-tactical-border bg-tactical-backdrop backdrop-blur-md z-20 overflow-hidden flex items-center justify-center pointer-events-none shadow-xl">
      {/* Static / Grid overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Scanning line simulation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20 shadow-[0_0_5px_#ffffff]" 
           style={{ animation: 'scan 2.5s linear infinite' }} />

      {/* HUD Text Overlays */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-tactical-text font-bold tracking-widest uppercase">
        UAV-07 | FLIR WHT-HOT <span className="animate-pulse text-tactical-red ml-1">REC</span>
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-tactical-text tracking-widest uppercase">
        ZOOM 4X
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-tactical-text tracking-widest uppercase">
        N 33.1192 W 116.3046
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-tactical-text tracking-widest uppercase">
        ALT: 450M
      </div>

      {/* AI Bounding Box */}
      <div className="relative w-[140px] h-[80px] animate-pulse">
        {/* Label */}
        <div className="absolute -top-5 left-0 text-[9px] font-mono font-bold text-tactical-red bg-tactical-red/20 border border-tactical-red px-1 whitespace-nowrap tracking-wider">
          T-72 DETECTED - 98% MATCH
        </div>
        
        {/* Corners (Red) */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-tactical-red" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-tactical-red" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-tactical-red" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-tactical-red" />
        
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-tactical-red rounded-full" />
      </div>
    </div>
  );
};
