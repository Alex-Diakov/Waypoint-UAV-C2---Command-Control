import { Signal, WifiOff, AlertTriangle } from 'lucide-react';
import React, { useMemo, useCallback } from 'react';
import { useDroneStore, Drone } from '../store/useDroneStore';
import { useMapStore } from '../../map/store/useMapStore';

interface DroneRowProps {
  drone: Drone;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onHandoff: (id: string) => void;
}

const DroneRow = React.memo<DroneRowProps>(({ drone, isSelected, onHover, onHandoff }) => {
  const isCritical = drone.battery < 20;
  const isWarning = drone.battery >= 20 && drone.battery <= 40;
  const isOffline = drone.status === 'offline';
  const isExpanded = isCritical || isOffline || isSelected;

  let rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-tactical-border';
  let textColor = 'text-tactical-green';
  let rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-tactical-surface-dark';
  let label = drone.status.toUpperCase();
  let barColor = 'bg-tactical-green';
  let badgeBorder = 'border-tactical-green/30';
  let badgeBg = 'bg-tactical-green/10';

  if (isOffline) {
    rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-tactical-red/50';
    textColor = 'text-tactical-red';
    rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-tactical-red/5';
    label = 'OFFLINE';
    barColor = 'bg-tactical-red';
    badgeBorder = 'border-tactical-red/30';
    badgeBg = 'bg-tactical-red/10';
  } else if (isCritical) {
    rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-tactical-red/50';
    textColor = 'text-tactical-red';
    rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-tactical-red/10';
    label = 'LOW BATT';
    barColor = 'bg-tactical-red';
    badgeBorder = 'border-tactical-red/30';
    badgeBg = 'bg-tactical-red/10';
  } else if (isWarning) {
    rowBorderColor = isSelected ? 'border-tactical-primary' : 'border-tactical-orange/50';
    textColor = 'text-tactical-orange';
    rowBg = isSelected ? 'bg-tactical-primary/10' : 'bg-tactical-orange/10';
    label = 'WARNING';
    barColor = 'bg-tactical-orange';
    badgeBorder = 'border-tactical-orange/30';
    badgeBg = 'bg-tactical-orange/10';
  } else if (drone.status === 'return') {
    textColor = 'text-tactical-orange';
    label = 'RTB';
    barColor = 'bg-tactical-orange';
    badgeBorder = 'border-tactical-orange/30';
    badgeBg = 'bg-tactical-orange/10';
  } else {
    textColor = 'text-tactical-green';
    label = 'PATROL';
    barColor = 'bg-tactical-green';
    badgeBorder = 'border-tactical-green/30';
    badgeBg = 'bg-tactical-green/10';
  }

  const handleMouseEnter = useCallback(() => onHover(drone.id), [onHover, drone.id]);
  const handleMouseLeave = useCallback(() => onHover(null), [onHover]);
  const handleBtnClick = useCallback(() => onHandoff(drone.id), [onHandoff, drone.id]);

  if (isExpanded) {
    return (
      <div 
        className={`border ${rowBorderColor} ${rowBg} flex flex-col font-mono p-3 gap-3 transition-colors`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
            {isOffline ? <WifiOff size={14} className="text-tactical-red" /> : (isCritical ? <AlertTriangle size={14} className="text-tactical-red animate-pulse" /> : <Signal size={14} className={`${textColor}`} />)}
          </div>
        </div>
        
        {(isCritical || isOffline) && (
          <button 
            onClick={handleBtnClick}
            className="w-full h-10 mt-1 bg-tactical-red/20 border border-tactical-red text-tactical-red hover:bg-tactical-red hover:text-white text-[11px] font-bold tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            [ INITIATE HANDOFF ]
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`border border-tactical-border bg-tactical-surface-dark flex items-center justify-between font-mono px-3 py-2.5 hover:bg-tactical-surface-hover transition-colors`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
});

DroneRow.displayName = 'DroneRow';

export const UAVFleetPanel: React.FC = React.memo(() => {
  const drones = useDroneStore(state => state.drones);
  const updateDrone = useDroneStore(state => state.updateDrone);
  const setHoveredDrone = useDroneStore(state => state.setHoveredDrone);
  const selectedDrones = useMapStore(state => state.selectedDrones);

  const handleRecallAll = useCallback(() => {
    drones.forEach(drone => {
      if (drone.status !== 'offline') {
        updateDrone(drone.id, { status: 'return' });
      }
    });
  }, [drones, updateDrone]);
  
  const handleHandoff = useCallback((id: string) => {
    updateDrone(id, { status: 'return' });
  }, [updateDrone]);

  const total = drones.length;
  const airborne = useMemo(() => drones.filter(d => d.status === 'patrol' || d.status === 'return').length, [drones]);
  const critical = useMemo(() => drones.filter(d => d.battery < 20 || d.status === 'offline').length, [drones]);

  const sortedDrones = useMemo(() => {
    return [...drones].sort((a, b) => {
      const aSelected = selectedDrones.includes(a.id) ? 1 : 0;
      const bSelected = selectedDrones.includes(b.id) ? 1 : 0;
      if (aSelected !== bSelected) return bSelected - aSelected;

      const aCrit = a.battery < 20 || a.status === 'offline' ? 1 : 0;
      const bCrit = b.battery < 20 || b.status === 'offline' ? 1 : 0;
      if (aCrit !== bCrit) return bCrit - aCrit;
      
      return a.id.localeCompare(b.id);
    });
  }, [drones, selectedDrones]);

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
            <span className="text-xl font-bold text-tactical-green">{airborne}</span>
          </div>
          <div className="flex flex-col border border-tactical-border bg-tactical-surface-dark p-2">
            <span className="text-[10px] text-tactical-text-muted font-bold tracking-widest uppercase">Critical</span>
            <span className="text-xl font-bold text-tactical-red">{critical}</span>
          </div>
        </div>
        <button 
          onClick={handleRecallAll}
          className="w-full h-8 bg-transparent border border-tactical-border text-tactical-text-muted font-mono text-[10px] uppercase tracking-widest hover:border-tactical-text hover:text-white transition-colors cursor-pointer"
        >
          RECALL ALL (RTB)
        </button>
      </div>

      {/* Dynamic List View */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {sortedDrones.map(drone => (
          <DroneRow 
            key={drone.id} 
            drone={drone}
            isSelected={selectedDrones.includes(drone.id)}
            onHover={setHoveredDrone}
            onHandoff={handleHandoff}
          />
        ))}
      </div>
    </div>
  );
});

UAVFleetPanel.displayName = 'UAVFleetPanel';



