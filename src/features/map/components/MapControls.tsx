import { 
  Box,
  ChevronLeft,
  ChevronRight,
  Crosshair, 
  Globe, 
  Hand, 
  Layers, 
  LassoSelect, 
  Map as MapIcon, 
  Moon, 
  Mountain, 
  Octagon, 
  Route, 
  Ruler, 
  Sun
} from 'lucide-react';
import React, { useState } from 'react';
import { MapLayerType, MapTool, useMapStore } from '../store/useMapStore';
import { Button } from '../../../components/ui';

const TOOLS: { id: MapTool; label: string; icon: React.ElementType }[] = [
  { id: 'pan', label: 'Pan / Navigate', icon: Hand },
  { id: 'lasso', label: 'Swarm Lasso', icon: LassoSelect },
  { id: 'target', label: 'Target Designator', icon: Crosshair },
  { id: 'route', label: 'Draw Route', icon: Route },
  { id: 'geofence', label: 'Exclusion Zone', icon: Octagon },
  { id: 'ruler', label: 'Distance', icon: Ruler },
];

const LAYERS: { id: MapLayerType; label: string; icon: React.ElementType }[] = [
  { id: 'dark', label: 'TAC-NIGHT', icon: Moon },
  { id: 'satellite', label: 'OPTICAL', icon: Globe },
  { id: 'terrain', label: 'TOPO', icon: Mountain },
  { id: 'light', label: 'TAC-DAY', icon: Sun },
];

export const MapControls: React.FC = () => {
  const { activeTool, setActiveTool, activeLayer, setActiveLayer, is3DMode, toggle3DMode } = useMapStore();
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`absolute top-0 bottom-0 left-0 z-[100] pointer-events-none transition-all duration-300 ease-in-out flex flex-col justify-center ${isExpanded ? 'w-16' : 'w-0'}`}>
      <div className={`absolute top-0 bottom-0 left-0 pointer-events-auto bg-tactical-backdrop backdrop-blur-md border-r border-tactical-border/50 w-16 flex flex-col items-center justify-center gap-1.5 shadow-2xl transition-transform duration-300 ease-in-out z-10 ${isExpanded ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Toggle Button Inside / Next to Sidebar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute top-1/2 -translate-y-1/2 left-full bg-tactical-backdrop backdrop-blur-md border border-l-0 border-tactical-border/50 text-tactical-text-muted hover:text-tactical-primary transition-all duration-300 shadow-xl py-6 px-1 flex items-center justify-center rounded-r-md cursor-pointer ${!isExpanded ? 'border-tactical-primary/50 text-tactical-primary hover:bg-tactical-primary/20' : 'opacity-0 hover:opacity-100'}`}
        >
          <div className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>
            <ChevronLeft size={16} />
          </div>
        </button>

        {/* Main Tools */}
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`relative p-3 rounded-sm transition-all duration-200 group outline-none
                ${isActive 
                  ? 'bg-tactical-primary text-black shadow-[0_0_10px_var(--color-tactical-primary)] scale-105' 
                  : 'text-tactical-text-muted hover:text-tactical-text hover:bg-tactical-surface/50 border border-transparent'
                }
              `}
              title={tool.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip */}
              <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-tactical-surface-dark border border-tactical-border/50 text-tactical-text text-[11px] font-mono whitespace-nowrap pointer-events-none transition-opacity rounded-sm shadow-xl z-20 ${isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hidden'}`}>
                {tool.label}
              </div>
            </button>
          );
        })}

        <div className="w-full h-[1px] bg-tactical-border/50 my-1" />

        <button
          onClick={() => {
            const state = useMapStore.getState();
            state.setTargetPoint(null);
            state.clearRoute();
            state.clearGeofences();
            state.setRulerPoints([]);
            state.setSelectedDrones([]);
          }}
          className={`relative p-3 rounded-sm transition-all duration-200 group outline-none text-tactical-text-muted hover:text-tactical-red hover:bg-tactical-surface/50 border border-transparent`}
          title="Clear Overlays"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-tactical-surface-dark border border-tactical-border/50 text-tactical-text text-[11px] font-mono whitespace-nowrap pointer-events-none transition-opacity rounded-sm shadow-xl z-20 ${isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hidden'}`}>
            Clear Overlays
          </div>
        </button>

        {/* 3D Mode Toggle */}
        <button
          onClick={toggle3DMode}
          className={`relative p-3 rounded-sm transition-all duration-200 group outline-none
            ${is3DMode 
              ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary/50' 
              : 'text-tactical-text-muted hover:text-tactical-text hover:bg-tactical-surface/50 border border-transparent'
            }
          `}
          title="3D/Isometric View"
        >
          <Box size={20} />
          <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-tactical-surface-dark border border-tactical-border/50 text-tactical-text text-[11px] font-mono whitespace-nowrap pointer-events-none transition-opacity rounded-sm shadow-xl z-20 ${isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hidden'}`}>
            3D / Isometric
          </div>
        </button>

        {/* Layer Controls */}
        <div className="relative w-full px-1.5">
          <button
            onClick={() => {
              setIsExpanded(true);
              setIsLayerMenuOpen(!isLayerMenuOpen);
            }}
            className={`relative w-full p-3 flex justify-center rounded-sm transition-all duration-200 group outline-none
              ${isLayerMenuOpen
                ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary/50'
                : 'text-tactical-text-muted hover:text-tactical-text hover:bg-tactical-surface/50 border border-transparent'
              }
            `}
            title="Map Layers"
          >
            <Layers size={20} />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-tactical-primary/50" />
            
            <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-tactical-surface-dark border border-tactical-border/50 text-tactical-text text-[11px] font-mono whitespace-nowrap pointer-events-none transition-opacity rounded-sm shadow-xl z-20 ${isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 hidden'}`}>
              Map Layers
            </div>
          </button>

          {isLayerMenuOpen && (
            <div className={`absolute left-full bottom-0 ml-3 bg-tactical-backdrop backdrop-blur-md border border-tactical-border/50 p-2 flex flex-col gap-1 shadow-2xl min-w-[160px] rounded-sm z-20 ${isExpanded ? '' : 'hidden'}`}>
              <div className="text-[10px] text-tactical-text-muted font-bold px-2 uppercase tracking-widest border-b border-tactical-border/30 pb-2 mb-2">
                Visual Feed
              </div>
              {LAYERS.map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button 
                    key={layer.id}
                    onClick={() => {
                      setActiveLayer(layer.id);
                      setIsLayerMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-2 text-[11px] font-mono transition-colors outline-none rounded-sm w-full text-left
                      ${isActive 
                        ? 'bg-tactical-primary/10 text-tactical-primary border border-tactical-primary/30' 
                        : 'text-tactical-text-muted hover:bg-tactical-surface hover:text-tactical-text border border-transparent'
                      }
                    `}
                  >
                    <Icon size={14} />
                    {layer.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
