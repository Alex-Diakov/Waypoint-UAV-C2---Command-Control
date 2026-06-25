import { Activity, Power, Wifi } from 'lucide-react';
import React from 'react';

export const InstallationsPanel: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2 space-y-2">
        <div className="border border-tactical-border/50 bg-tactical-surface/40 backdrop-blur-sm p-3 cursor-pointer hover:border-tactical-border-light transition-colors group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-tactical-green rounded-sm animate-pulse shadow-[0_0_8px_var(--color-tactical-green)]" />
              <span className="font-bold text-sm tracking-wider">SITE 01 - OMEGA</span>
            </div>
            <div className="text-[10px] font-mono text-tactical-text-muted bg-tactical-surface/50 px-2 py-1">
              -18.0475 135.5570
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-tactical-border/50 bg-tactical-surface/50 p-2 flex flex-col items-center justify-center gap-1 group-hover:border-tactical-border transition-colors">
              <Wifi size={14} className="text-tactical-green" />
              <span className="text-[9px] uppercase tracking-wider text-tactical-text-muted">LINK OK</span>
            </div>
            <div className="border border-tactical-border/50 bg-tactical-surface/50 p-2 flex flex-col items-center justify-center gap-1 group-hover:border-tactical-border transition-colors">
              <Power size={14} className="text-tactical-green" />
              <span className="text-[9px] uppercase tracking-wider text-tactical-text-muted">PWR 98%</span>
            </div>
            <div className="border border-tactical-border/50 bg-tactical-surface/50 p-2 flex flex-col items-center justify-center gap-1 group-hover:border-tactical-border transition-colors">
              <Activity size={14} className="text-tactical-green" />
              <span className="text-[9px] uppercase tracking-wider text-tactical-text-muted">OPS NOM</span>
            </div>
          </div>
        </div>

        {/* Inactive Site Example */}
        <div className="border border-tactical-border/50 bg-tactical-surface/40 backdrop-blur-sm p-3 cursor-pointer hover:border-tactical-border-light transition-colors opacity-60">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-tactical-text-muted rounded-sm" />
              <span className="font-bold text-sm tracking-wider text-tactical-text-muted">SITE 02 - ALPHA</span>
            </div>
            <div className="text-[10px] font-mono text-tactical-text-muted bg-tactical-surface/50 px-2 py-1">
              -12.0475 131.5570
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
             <div className="border border-tactical-border/50 bg-tactical-surface/50 p-2 flex flex-col items-center justify-center gap-1">
              <Wifi size={14} className="text-tactical-text-muted" />
              <span className="text-[9px] uppercase tracking-wider text-tactical-text-muted">OFFLINE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
