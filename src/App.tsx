import React from 'react';
import { WidgetGroup } from './components/ui/WidgetGroup';
import { WidgetId, useWidgetStore } from './store/useWidgetStore';
import { UAVFleetPanel } from './features/drones/components/UAVFleetPanel';
import { useSimulation } from './features/drones/hooks/useSimulation';
import { InstallationsPanel } from './features/installations/components/InstallationsPanel';
import { TacticalMap } from './features/map/components/TacticalMap';
import { MapControls } from './features/map/components/MapControls';
import { TopBar } from './layout/TopBar';
import { VideoFeedsPanel } from './features/drones/components/VideoFeedsPanel';
import { DesignSystemPanel } from './features/settings/components/DesignSystemPanel';
import { FireSupportPanel } from './features/fire-support/components/FireSupportPanel';
import { useHotkeys } from './hooks/useHotkeys';

const WIDGET_COMPONENTS: Record<WidgetId, React.ReactNode> = {
  'uav-fleet': <UAVFleetPanel />,
  'installations': <InstallationsPanel />,
  'video-feed': <VideoFeedsPanel />,
  'design-system': <DesignSystemPanel />,
  'fire-support': <FireSupportPanel />,
};

export default function App() {
  useSimulation();
  useHotkeys();
  const groups = useWidgetStore(state => state.groups);

  return (
    <div className="h-screen w-screen flex flex-col bg-tactical-bg text-tactical-text font-sans selection:bg-tactical-primary selection:text-black overflow-hidden relative">
      <TopBar />
      <main className="flex-1 relative overflow-hidden bg-tactical-bg">
        {/* Full Screen Map */}
        <div className="absolute inset-0 z-0">
          <TacticalMap />
        </div>

        {/* Map Controls Overlay */}
        <MapControls />

        {/* Dynamic Widget Groups */}
        {groups.map(group => (
          <WidgetGroup 
            key={group.id} 
            group={group} 
            components={WIDGET_COMPONENTS} 
          />
        ))}
      </main>
    </div>
  );
}


