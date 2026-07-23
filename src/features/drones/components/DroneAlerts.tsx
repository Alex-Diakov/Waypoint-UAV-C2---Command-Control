import React from 'react';
import { useDroneStore } from '../store/useDroneStore';

export const DroneAlerts: React.FC = () => {
  const { drones, updateDrone } = useDroneStore();
  const criticalDrones = drones.filter(d => d.battery < 20 && d.status !== 'offline');

  const handleHandoff = (id: string) => {
    updateDrone(id, { battery: 100, status: 'patrol' });
  };

  return (
    <div className="flex-1 flex flex-col border-b border-zinc-800 overflow-hidden">
      <div className="bg-tactical-surface border-b border-tactical-border p-2 text-tactical-text-muted font-bold tracking-widest uppercase text-[10px]">
        AI Alerts / Action Required
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {criticalDrones.length === 0 ? (
          <div className="text-zinc-600 uppercase tracking-widest">
            &gt; No critical alerts.<br/>&gt; Fleet operating nominally.
          </div>
        ) : (
          criticalDrones.map(drone => (
            <div key={drone.id} className="border border-red-600 bg-red-950/20 p-4 flex flex-col gap-4">
              <div className="text-red-500 font-bold text-sm tracking-wide">
                CRITICAL: {drone.name} BATTERY DEPLETED. REQUIRE AUTONOMOUS HANDOFF.
              </div>
              <button
                onClick={() => handleHandoff(drone.id)}
                className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-4 text-sm uppercase tracking-widest transition-colors border border-red-500 cursor-pointer"
              >
                [ CONFIRM HANDOFF ]
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
