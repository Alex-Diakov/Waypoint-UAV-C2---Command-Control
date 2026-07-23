import React from 'react';
import { useDroneStore } from '../store/useDroneStore';

export const DroneFleetStatus: React.FC = () => {
  const drones = useDroneStore(state => state.drones);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-tactical-surface border-b border-tactical-border p-2 text-tactical-text-muted font-bold tracking-widest uppercase text-[10px]">
        Fleet Status / Telemetry
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {drones.map(drone => {
              const isCritical = drone.battery < 20;
              const isWarning = drone.battery >= 20 && drone.battery < 40;
              
              const colorClass = isCritical ? 'bg-tactical-red' : isWarning ? 'bg-tactical-orange' : 'bg-tactical-green';
              const textClass = isCritical ? 'text-tactical-red' : isWarning ? 'text-tactical-orange' : 'text-tactical-green';

              return (
                <tr key={drone.id} className="border-b border-tactical-border/50 hover:bg-tactical-surface-hover transition-colors text-[11px] font-mono tracking-widest">
                  <td className="p-3 w-1/4">
                    <span className={`font-bold ${textClass}`}>{drone.name}</span>
                  </td>
                  <td className="p-3 w-1/4 text-[10px] uppercase tracking-wider text-tactical-text-muted">
                    {drone.status}
                  </td>
                  <td className="p-3 w-1/2">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 text-right font-bold ${textClass}`}>
                        {Math.floor(drone.battery)}%
                      </span>
                      <div className="flex-1 h-1 bg-tactical-border/50">
                        <div 
                          className={`h-full ${colorClass}`} 
                          style={{ width: `${Math.floor(drone.battery)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
