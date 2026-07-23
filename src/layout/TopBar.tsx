import { Settings, Signal, Satellite, Activity, Navigation, Power, Video, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui';
import { useWidgetStore } from '../store/useWidgetStore';

export const TopBar: React.FC = () => {
  const [zuluTime, setZuluTime] = useState('');
  const [nvgMode, setNvgMode] = useState(false);
  const { groups, toggleWidget, bringGroupToFront } = useWidgetStore();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getUTCHours().toString().padStart(2, '0');
      const mins = now.getUTCMinutes().toString().padStart(2, '0');
      const secs = now.getUTCSeconds().toString().padStart(2, '0');
      setZuluTime(`${hrs}${mins}Z:${secs}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (nvgMode) {
      document.body.classList.add('nvg-theme');
    } else {
      document.body.classList.remove('nvg-theme');
    }
  }, [nvgMode]);

  const isWidgetOpen = (id: string) => {
    return groups.some(g => g.tabs.includes(id as any));
  };

  const handleWidgetToggle = (id: any) => {
    toggleWidget(id);
    const group = groups.find(g => g.tabs.includes(id));
    if (group) {
      bringGroupToFront(group.id);
    }
  };

  return (
    <header className="h-[60px] shrink-0 border-b border-tactical-border bg-tactical-backdrop backdrop-blur-md flex items-center justify-between px-4 z-[9999]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-tactical-text">
          <img src="https://cdn.prod.website-files.com/661ad025d9de9738d61d0d4d/6a3c38639e2748089d0b017d_2026-06-24%2022.49.04%201.png" alt="waypoint logo" className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
          <h1 className="text-xl font-bold tracking-widest uppercase">waypoint</h1>
        </div>
        
        <div className="h-8 w-px bg-tactical-border mx-2" />
        
        <div className="flex gap-2">
          <Button 
            variant={isWidgetOpen('uav-fleet') ? 'active' : 'default'}
            onClick={() => handleWidgetToggle('uav-fleet')}
          >
            <Navigation size={16} className="mr-1" /> Drones
          </Button>
          <Button 
            variant={isWidgetOpen('installations') ? 'active' : 'default'}
            onClick={() => handleWidgetToggle('installations')}
          >
            <Satellite size={16} className="mr-1" /> Sites
          </Button>
          <Button 
            variant={isWidgetOpen('video-feed') ? 'active' : 'default'}
            onClick={() => handleWidgetToggle('video-feed')}
          >
            <Video size={16} className="mr-1" /> Feeds
          </Button>
          <Button 
            variant={isWidgetOpen('fire-support') ? 'active' : 'default'}
            onClick={() => handleWidgetToggle('fire-support')}
          >
            <Activity size={16} className="mr-1" /> Fire Support
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-mono">
        <Button 
          variant={nvgMode ? 'active' : 'default'}
          className={nvgMode ? 'border-tactical-red text-tactical-red bg-tactical-red/20' : ''}
          onClick={() => setNvgMode(!nvgMode)}
        >
          <Eye size={16} className="mr-1" /> NVG MODE
        </Button>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-tactical-border text-tactical-text-muted">
          <span className="text-tactical-text">{zuluTime}</span>
        </div>
        <Button 
          variant={isWidgetOpen('design-system') ? 'active' : 'ghost'} 
          size="icon" 
          className={isWidgetOpen('design-system') ? '' : 'border-tactical-border bg-tactical-bg'}
          onClick={() => handleWidgetToggle('design-system')}
        >
          <Settings size={16} />
        </Button>
      </div>
    </header>
  );
};

