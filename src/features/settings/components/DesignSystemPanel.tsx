import React from 'react';

export const DesignSystemPanel: React.FC = () => {
  return (
    <div className="flex-1 bg-tactical-surface-dark overflow-y-auto no-scrollbar p-4 flex flex-col gap-6 text-tactical-text font-mono text-xs">
      
      <div className="flex flex-col gap-2 border-b border-tactical-border/50 pb-4">
        <h2 className="text-tactical-primary uppercase tracking-widest font-bold">Tactical Design System</h2>
        <p className="text-tactical-text-muted">Consistent hierarchy for over-map interfaces.</p>
      </div>

      {/* Layer 0 */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Layer 0 - Base Map</div>
        <div className="p-4 border border-tactical-border bg-tactical-bg flex items-center justify-between">
          <span>--color-tactical-bg</span>
          <span className="text-tactical-text-muted">#050505</span>
        </div>
        <p className="text-[10px] text-tactical-text-muted">Absolute bottom layer, contains map tiles.</p>
      </div>

      {/* Layer 1 */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Layer 1 - App Chrome</div>
        <div className="p-4 border border-tactical-border bg-tactical-backdrop backdrop-blur-md flex items-center justify-between">
          <span>--color-tactical-backdrop + blur</span>
          <span className="text-tactical-text-muted">rgba(10, 10, 10, 0.9)</span>
        </div>
        <p className="text-[10px] text-tactical-text-muted">Used for TopBar, Side Controls, and Widget outer containers.</p>
      </div>

      {/* Layer 2 */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Layer 2 - Widget Surface</div>
        <div className="p-4 border border-tactical-border bg-tactical-surface-dark flex items-center justify-between">
          <span>--color-tactical-surface-dark</span>
          <span className="text-tactical-text-muted">#0a0a0a</span>
        </div>
        <div className="p-4 border border-tactical-border bg-tactical-surface flex items-center justify-between">
          <span>--color-tactical-surface</span>
          <span className="text-tactical-text-muted">#111111</span>
        </div>
        <p className="text-[10px] text-tactical-text-muted">Used for widget bodies, panels, and inner static containers.</p>
      </div>

      {/* Layer 3 */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Layer 3 - Interactive</div>
        <div className="p-4 border border-tactical-border bg-tactical-surface-hover flex items-center justify-between">
          <span>--color-tactical-surface-hover</span>
          <span className="text-tactical-text-muted">#1a1a1a</span>
        </div>
        <p className="text-[10px] text-tactical-text-muted">Used for hover states on buttons, list items, and active elements.</p>
      </div>

      {/* Accents */}
      <div className="flex flex-col gap-2 border-b border-tactical-border/50 pb-6">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Semantic Accents</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 border border-tactical-primary bg-tactical-primary/10 text-tactical-primary flex justify-center">
            PRIMARY
          </div>
          <div className="p-3 border border-tactical-green bg-tactical-green/10 text-tactical-green flex justify-center">
            NOMINAL
          </div>
          <div className="p-3 border border-tactical-orange bg-tactical-orange/10 text-tactical-orange flex justify-center">
            WARNING
          </div>
          <div className="p-3 border border-tactical-red bg-tactical-red/10 text-tactical-red flex justify-center">
            CRITICAL
          </div>
        </div>
      </div>

      {/* Tooltips & Dropdowns */}
      <div className="flex flex-col gap-4">
        <div className="text-[10px] text-tactical-text-muted font-bold uppercase tracking-widest">Tooltips & Overlays</div>
        
        <div className="flex flex-col gap-2">
          <span className="text-tactical-text-muted">Standard Tooltip</span>
          <div className="self-start px-3 py-1.5 bg-tactical-surface-dark border border-tactical-border/50 text-tactical-text text-[11px] font-mono shadow-xl rounded-sm">
            Target Designated
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-tactical-text-muted">Dropdown Menu</span>
          <div className="relative self-start mt-1">
            <button className="flex items-center gap-2 px-3 py-2 bg-tactical-surface border border-tactical-border hover:bg-tactical-surface-hover text-tactical-text rounded-sm transition-colors">
              <span>Select Mode</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-40 bg-tactical-backdrop backdrop-blur-md border border-tactical-border/50 shadow-2xl rounded-sm overflow-hidden z-20">
              <button className="w-full text-left px-3 py-2 hover:bg-tactical-surface-hover transition-colors">
                Mode 1: Recon
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-tactical-surface-hover transition-colors">
                Mode 2: Patrol
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
