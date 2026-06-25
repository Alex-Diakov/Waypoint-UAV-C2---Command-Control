import { useEffect } from 'react';
import { useDroneStore } from '../store/useDroneStore';

export const useSimulation = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      useDroneStore.getState().tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};
