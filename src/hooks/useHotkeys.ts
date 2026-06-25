import { useEffect } from 'react';
import { useMapStore } from '../features/map/store/useMapStore';
import { useDroneStore } from '../features/drones/store/useDroneStore';

export const useHotkeys = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if (isInput) return;

      const mapStore = useMapStore.getState();
      const droneStore = useDroneStore.getState();

      // Shift + L: Lasso Tool
      if (e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        mapStore.setActiveTool('lasso');
      }

      // Space: Center on lowest battery drone or offline drone
      if (e.code === 'Space') {
        e.preventDefault();
        const drones = droneStore.drones;
        let criticalDrone = drones.find(d => d.status === 'offline');
        
        if (!criticalDrone) {
           criticalDrone = [...drones].sort((a, b) => a.battery - b.battery)[0];
        }

        if (criticalDrone) {
          mapStore.setTargetPoint([criticalDrone.lat, criticalDrone.lng]);
          mapStore.setSelectedDrones([criticalDrone.id]);
        }
      }

      // Ctrl + R or Cmd + R: Return to base (RTB) selected drones
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        // Only prevent default if we actually have selected drones, so we don't block normal reload completely
        const selected = mapStore.selectedDrones;
        if (selected.length > 0) {
          e.preventDefault();
          selected.forEach(id => droneStore.updateDrone(id, { status: 'return', targetId: undefined }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
