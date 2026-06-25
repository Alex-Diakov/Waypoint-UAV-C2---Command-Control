import { Signal, WifiOff, AlertTriangle } from 'lucide-react';
import React from 'react';
import { useDroneStore } from '../store/useDroneStore';
import { useMapStore } from '../../map/store/useMapStore';

export const UAVFleetPanel: React.FC = () => {
  const { drones, updateDrone, setHoveredDrone } = useDroneStore();
  const selectedDrones = useMapStore(state => state.selectedDrones);

  const handleRecallAll = () => {
    drones.forEach(drone => {
      if (drone.status !== 'offline') {
        updateDrone(drone.id, { status: 'return' });
      }
    });
  };
  
  const handleHandoff = (id: string) => {
    // In a real app this would assign a reserve drone. For now, mark as returning.
    updateDrone(id, { status: 'return' });
  };

  const total = drones.length;
  const airborne = drones.filter(d => d.status === 'patrol' || d.status === 'return').length;
  const critical = drones.filter(d => d.battery < 20 || d.status === 'offline').length;

  const sortedDrones = [...drones].sort((a, b) => {
    // Selected drones float to top
    const aSelected = selectedDrones.includes(a.id) ? 1 : 0;
    const bSelected = selectedDrones.includes(b.id) ? 1 : 0;
    if (aSelected !== bSelected) return bSelected - aSelected;

    const aCrit = a.battery < 20 || a.status === 'offline' ? 1 : 0;
    const bCrit = b.battery < 20 || b.status === 'offline' ? 1 : 0;
    if (aCrit !== bCrit) return bCrit - aCrit;
    
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-transparent">
      {/* Fleet Summary Header */}
      <div className="p-3 border-b border-tactical-border bg-transparent flex flex-col gap-3 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col border border-tactical-border bg-tactical-surface-dark p-2">
            <span className="text-[10px] text-tactical-text-muted font-bold tracking-widest uppercase">Total</span>
            <span className="text-xl font-bold text-white">{total}</span>
          </div>
          <div className="flex flex-col border border-tactical-border bg-tactical-surface-dark p-2">
            <span className="text-[10px] text-tactical-text-muted font-bold tracking-widest uppercase">Airborne</span>
            <span className="text-xl font-bold text-emerald-500">{airborne}</span>
          </div>
          <div className="flex flex-col border border-tactical-border bg-tactical-surface-dark p-2">
            <span className="text-[10px] text-tactical-text-muted font-bold tracking-widest uppercase">Critical</span>
            <span className="text-xl font-bold text-red-500">{critical}</span>
          </div>
        </div>
        <button 
          onClick={handleRecallAll}
          className="w-full h-8 bg-transparent border border-tactical-border text-tactical-text-muted font-mono text-[10px] uppercase tracking-widest hover:border-tactical-text hover:text-white transition-colors"
        >
          RECALL ALL (RTB)
        </button>
      </div>

      {/* Dynamic List View */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {sortedDrones.map(drone => {
          const isCritical = drone.battery < 20;
          const isWarning = drone.battery >= 20 && drone.battery <= 40;
          const isOffline = drone.status === 'offline';
          const isSelected = selectedDrones.includes(drone.id);
          const isExpanded = isCritical || isOffline || isSelected;
          
          let rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-tactical-border';
          let textColor = 'text-emerald-500';
          let rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-tactical-surface-dark';
          let label = drone.status.toUpperCase();
          let barColor = 'bg-emerald-500';
          let badgeBorder = 'border-emerald-500/30';
          let badgeBg = 'bg-emerald-500/10';
          
          if (isOffline) {
            rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-red-500/50';
            textColor = 'text-red-500';
            rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-red-500/5';
            label = 'OFFLINE';
            barColor = 'bg-red-500';
            badgeBorder = 'border-red-500/30';
            badgeBg = 'bg-red-500/10';
          } else if (isCritical) {
            rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-red-500/50';
            textColor = 'text-red-500';
            rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-red-500/10';
            label = 'LOW BATT';
            barColor = 'bg-red-500';
            badgeBorder = 'border-red-500/30';
            badgeBg = 'bg-red-500/10';
          } else if (isWarning) {
            rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-amber-500/50';
            textColor = 'text-amber-500';
            rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-amber-500/10';
            label = 'WARNING';
            barColor = 'bg-amber-500';
            badgeBorder = 'border-amber-500/30';
            badgeBg = 'bg-amber-500/10';
          } else if (drone.status === 'return') {
            textColor = 'text-amber-500';
            label = 'RTB';
            barColor = 'bg-amber-500';
            badgeBorder = 'border-amber-500/30';
            badgeBg = 'bg-amber-500/10';
          } else {
            textColor = 'text-emerald-500';
            label = 'PATROL';
            barColor = 'bg-emerald-500';
            badgeBorder = 'border-emerald-500/30';
            badgeBg = 'bg-emerald-500/10';
          }

          if (isExpanded) {
            return (
              <div 
                key={drone.id} 
                className={`border ${rowBorderColor} ${rowBg} flex flex-col font-mono p-3 gap-3 transition-colors`}
                onMouseEnter={() => setHoveredDrone(drone.id)}
                onMouseLeave={() => setHoveredDrone(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[13px] text-white tracking-widest w-[70px]">{drone.id}</span>
                    <div className={`px-2 py-0.5 border ${badgeBorder} ${badgeBg} ${textColor} tracking-widest text-[9px] uppercase`}>
                      {label}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1.5 w-24">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-tactical-text-muted text-[10px]">BATT</span>
                        <span className="text-white text-[11px] font-bold">{String(Math.floor(drone.battery)).padStart(3, '0')}%</span>
                      </div>
                      <div className="w-full h-1 bg-tactical-border/50 rounded-sm overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${Math.max(0, drone.battery)}%` }} />
                      </div>
                    </div>
                    {isOffline ? <WifiOff size={14} className="text-red-500" /> : (isCritical ? <AlertTriangle size={14} className="text-red-500 animate-pulse" /> : <Signal size={14} className={`${textColor}`} />)}
                  </div>
                </div>
                
                {(isCritical || isOffline) && (
                  <button 
                    onClick={() => handleHandoff(drone.id)}
                    className="w-full h-10 mt-1 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-[11px] font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    [ INITIATE HANDOFF ]
                  </button>
                )}
              </div>
            );
          }

          return (
            <div 
              key={drone.id} 
              className={`border border-tactical-border bg-tactical-surface-dark flex items-center justify-between font-mono px-3 py-2.5 hover:bg-tactical-surface-hover transition-colors`}
              onMouseEnter={() => setHoveredDrone(drone.id)}
              onMouseLeave={() => setHoveredDrone(null)}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-[11px] text-white tracking-widest w-[70px]">{drone.id}</span>
                <div className={`px-2 py-0.5 border ${badgeBorder} ${badgeBg} ${textColor} tracking-widest text-[9px] uppercase`}>
                  {label}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1.5 w-24">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-tactical-text-muted text-[9px]">BATT</span>
                    <span className="text-white text-[10px] font-bold">{String(Math.floor(drone.battery)).padStart(3, '0')}%</span>
                  </div>
                  <div className="w-full h-1 bg-tactical-border/50 rounded-sm overflow-hidden">
                    <div className={`h-full ${barColor}`} style={{ width: `${Math.max(0, drone.battery)}%` }} />
                  </div>
                </div>
                <Signal size={12} className={`${textColor}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


