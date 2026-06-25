import React from 'react';
import { useDroneStore } from '../store/useDroneStore';
import { useMapStore } from '../../map/store/useMapStore';
import { Crosshair, Navigation, Battery, Signal, Video } from 'lucide-react';

export const VideoFeedsPanel: React.FC = () => {
  const drones = useDroneStore(state => state.drones);
  const selectedDrones = useMapStore(state => state.selectedDrones);
  
  // Show selected drones or the first active one
  const displayDrones = selectedDrones.length > 0 
    ? drones.filter(d => selectedDrones.includes(d.id))
    : drones.filter(d => d.status !== 'offline').slice(0, 1);

  if (displayDrones.length === 0) {
    return (
      <div className="flex-1 bg-transparent flex flex-col items-center justify-center text-tactical-red opacity-50 border border-slate-800">
        <Video size={32} className="mb-2" />
        <span className="font-mono text-xs tracking-widest">NO SIGNAL / NO DRONE SELECTED</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-transparent overflow-y-auto no-scrollbar grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-1 p-1">
      {displayDrones.map(drone => (
        <div key={drone.id} className="relative w-full aspect-video min-h-[180px] bg-tactical-surface-dark overflow-hidden border border-tactical-border group">
          {/* Simulated Video Noise Background */}
          <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
          </div>
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>

          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <Crosshair size={120} className={drone.status === 'patrol' ? 'text-tactical-green' : 'text-tactical-red'} strokeWidth={1} />
          </div>

          {/* OSD Overlay */}
          <div className="absolute inset-0 p-3 flex flex-col justify-between font-mono text-[10px] text-white shadow-sm pointer-events-none">
            {/* Top Bar */}
            <div className="flex justify-between items-start text-tactical-green drop-shadow-md">
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-white mb-1">{drone.id}</span>
                <span>LAT: {drone.lat.toFixed(6)}</span>
                <span>LNG: {drone.lng.toFixed(6)}</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="bg-tactical-red/80 text-white px-1 mb-1 font-bold animate-pulse">REC</span>
                <span className="flex items-center gap-1"><Signal size={10} /> 98% (5.8GHz)</span>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end text-tactical-green drop-shadow-md">
              <div className="flex flex-col">
                <span className="flex items-center gap-1">ALT: {(Math.random() * 10 + 100).toFixed(1)}m <Navigation size={10} /></span>
                <span>SPD: {(Math.random() * 5 + 15).toFixed(1)}m/s</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`flex items-center gap-1 ${drone.battery < 20 ? 'text-tactical-red animate-pulse' : ''}`}>
                  <Battery size={10} /> {drone.battery.toFixed(0)}%
                </span>
                <span>HDG: {(Math.random() * 360).toFixed(0)}°</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
