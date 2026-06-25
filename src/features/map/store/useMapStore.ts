import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MapLayerType = 'dark' | 'satellite' | 'terrain' | 'light';
export type MapTool = 'pan' | 'lasso' | 'target' | 'route' | 'geofence' | 'ruler';

interface MapStore {
  activeLayer: MapLayerType;
  setActiveLayer: (layer: MapLayerType) => void;
  is3DMode: boolean;
  toggle3DMode: () => void;
  activeTool: MapTool;
  setActiveTool: (tool: MapTool) => void;

  // Tool Data
  selectedDrones: string[];
  setSelectedDrones: (ids: string[]) => void;
  
  targetPoint: [number, number] | null;
  setTargetPoint: (pt: [number, number] | null) => void;

  routePoints: [number, number][];
  addRoutePoint: (pt: [number, number]) => void;
  clearRoute: () => void;

  geofences: [number, number][][];
  addGeofence: (fence: [number, number][]) => void;
  clearGeofences: () => void;

  rulerPoints: [number, number][];
  setRulerPoints: (pts: [number, number][]) => void;
}

export const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      activeLayer: 'dark',
      setActiveLayer: (layer) => set({ activeLayer: layer }),
      is3DMode: false,
      toggle3DMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
      activeTool: 'pan',
      setActiveTool: (tool) => set({ activeTool: tool }),

      selectedDrones: [],
      setSelectedDrones: (ids) => set({ selectedDrones: ids }),

      targetPoint: null,
      setTargetPoint: (pt) => set({ targetPoint: pt }),

      routePoints: [],
      addRoutePoint: (pt) => set((state) => ({ routePoints: [...state.routePoints, pt] })),
      clearRoute: () => set({ routePoints: [] }),

      geofences: [],
      addGeofence: (fence) => set((state) => ({ geofences: [...state.geofences, fence] })),
      clearGeofences: () => set({ geofences: [] }),

      rulerPoints: [],
      setRulerPoints: (pts) => set({ rulerPoints: pts }),
    }),
    {
      name: 'tactical-map-storage',
      partialize: (state) => ({
        activeLayer: state.activeLayer,
        is3DMode: state.is3DMode,
        targetPoint: state.targetPoint,
        routePoints: state.routePoints,
        geofences: state.geofences,
        rulerPoints: state.rulerPoints,
        // We probably don't want to persist activeTool or selectedDrones 
        // to avoid confusion on fresh reload, but we'll persist the drawn tools
      }),
    }
  )
);
