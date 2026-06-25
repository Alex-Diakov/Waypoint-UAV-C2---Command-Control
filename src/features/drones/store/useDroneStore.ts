import { create } from 'zustand';

export type DroneStatus = 'patrol' | 'return' | 'low_battery' | 'offline' | 'intercept';

export interface Drone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  battery: number;
  status: DroneStatus;
  targetId?: string;
}

interface DroneStore {
  drones: Drone[];
  setDrones: (drones: Drone[]) => void;
  updateDrone: (id: string, updates: Partial<Drone>) => void;
  tick: () => void;
  hoveredDroneId: string | null;
  setHoveredDrone: (id: string | null) => void;
}

// Center coordinates for Ocotillo Wells
const CENTER_LAT = 33.1192;
const CENTER_LNG = -116.3046;

const generateInitialDrones = (): Drone[] => {
  const drones: Drone[] = [];
  
  for (let i = 1; i <= 10; i++) {
    // Spread them slightly apart (roughly within a ~5km radius)
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    // Battery between 40 and 100
    const battery = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
    
    let status: DroneStatus = 'patrol';
    if (battery < 50) status = 'low_battery';
    if (i % 8 === 0) status = 'offline';
    if (i % 5 === 0) status = 'return';

    drones.push({
      id: `UAV-${String(i).padStart(3, '0')}`,
      name: `Drone ${i}`,
      lat: CENTER_LAT + latOffset,
      lng: CENTER_LNG + lngOffset,
      battery,
      status,
    });
  }
  
  return drones;
};

export const useDroneStore = create<DroneStore>((set) => ({
  drones: generateInitialDrones(),
  setDrones: (drones) => set({ drones }),
  updateDrone: (id, updates) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone.id === id ? { ...drone, ...updates } : drone
      ),
    })),
  tick: () => {
    set((state) => {
      let updatedDrones = state.drones.map((drone) => {
        if (drone.status === 'offline') return drone; // Skip offline drones

        let newBattery = Math.max(0, drone.battery - 0.2);
        let newStatus = drone.status;

        if (newBattery <= 20) {
          newStatus = 'low_battery';
        }

        // Move towards target if intercepting
        let latDelta = (Math.random() - 0.5) * 0.0002;
        let lngDelta = (Math.random() - 0.5) * 0.0002;

        if (newStatus === 'intercept' && drone.targetId) {
          const target = state.drones.find(d => d.id === drone.targetId);
          if (target) {
            latDelta = (target.lat - drone.lat) * 0.05;
            lngDelta = (target.lng - drone.lng) * 0.05;
          } else {
            newStatus = 'patrol';
            drone.targetId = undefined;
          }
        }

        return {
          ...drone,
          battery: newBattery,
          status: newStatus,
          lat: drone.lat + latDelta,
          lng: drone.lng + lngDelta,
        };
      });

      // Auto-Handoff Logic
      // Find drones that are critical (< 20%) and not already being intercepted
      const criticalDrones = updatedDrones.filter(d => d.battery <= 20 && d.status !== 'offline');
      criticalDrones.forEach(critical => {
        const isBeingIntercepted = updatedDrones.some(d => d.targetId === critical.id);
        if (!isBeingIntercepted) {
          // Find closest healthy drone
          const available = updatedDrones.filter(d => d.status === 'patrol' && d.battery > 50 && d.id !== critical.id);
          if (available.length > 0) {
            let closest = available[0];
            let minDist = Math.hypot(closest.lat - critical.lat, closest.lng - critical.lng);
            for (let i = 1; i < available.length; i++) {
              const dist = Math.hypot(available[i].lat - critical.lat, available[i].lng - critical.lng);
              if (dist < minDist) {
                closest = available[i];
                minDist = dist;
              }
            }
            // Assign closest to intercept
            closest.status = 'intercept';
            closest.targetId = critical.id;
            critical.status = 'return'; // Critical drone returns to base
          }
        }
      });

      return { drones: updatedDrones };
    });
  },
  hoveredDroneId: null,
  setHoveredDrone: (id) => set({ hoveredDroneId: id }),
}));
