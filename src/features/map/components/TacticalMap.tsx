import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, Polyline, useMap } from 'react-leaflet';
import { useDroneStore, Drone } from '../../drones/store/useDroneStore';
import { useMapStore } from '../store/useMapStore';
import { MapInteractions } from './MapInteractions';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'patrol': return '#10b981'; // Emerald-500
    case 'return': return '#f59e0b'; // Amber-500
    case 'low_battery': return '#ef4444'; // Red-500
    case 'offline': return '#ef4444'; // Red-500
    default: return '#808080';
  }
};

// Cache for Leaflet divIcons to prevent constant DOM node re-creation
const iconCache = new Map<string, L.DivIcon>();

const getCachedDroneIcon = (status: string, isHovered: boolean, isSelected: boolean, isCritical: boolean): L.DivIcon => {
  const key = `${status}-${isHovered ? '1' : '0'}-${isSelected ? '1' : '0'}-${isCritical ? '1' : '0'}`;
  if (iconCache.has(key)) {
    return iconCache.get(key)!;
  }

  const color = getStatusColor(status);
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  `;

  const pingHtml = isCritical ? `
    <div class="absolute inset-0 rounded-full border-2 animate-radar-ping pointer-events-none" style="border-color: ${color};"></div>
  ` : '';

  let bracketHtml = '';
  if (isHovered) {
    bracketHtml = `<div class="targeting-bracket"></div>`;
  } else if (isSelected) {
    bracketHtml = `<div class="targeting-bracket" style="border-color: var(--color-tactical-primary);"></div>`;
  }

  const icon = L.divIcon({
    className: 'custom-drone-marker bg-transparent border-0',
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center" style="transform: rotate(45deg);">
        ${pingHtml}
        ${svgIcon}
        ${bracketHtml}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  iconCache.set(key, icon);
  return icon;
};

const LAYER_URLS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
};

// Component to handle map invalidation on mode switch to prevent tile gaps
const MapController = React.memo(({ is3DMode }: { is3DMode: boolean }) => {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 500); // After transition
    return () => clearTimeout(timeout);
  }, [is3DMode, map]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(map.getContainer());
    return () => resizeObserver.disconnect();
  }, [map]);

  return null;
});

MapController.displayName = 'MapController';

interface DroneMarkerProps {
  drone: Drone;
  isHovered: boolean;
  isSelected: boolean;
}

const DroneMarker = React.memo<DroneMarkerProps>(({ drone, isHovered, isSelected }) => {
  const isCritical = drone.battery < 20;
  const showTooltip = isSelected || isHovered;
  const icon = getCachedDroneIcon(drone.status, isHovered, isSelected, isCritical);

  return (
    <Marker 
      position={[drone.lat, drone.lng]} 
      icon={icon}
      zIndexOffset={isHovered ? 1000 : 0}
    >
      <Tooltip 
        direction="top" 
        offset={[0, -10]} 
        opacity={1}
        className="tactical-tooltip"
        permanent={showTooltip}
      >
        <div className="font-mono text-xs uppercase">
          <div className="font-bold border-b border-gray-700 pb-1 mb-1">{drone.id}</div>
          <div>STAT: {drone.status}</div>
          <div>BATT: {Math.floor(drone.battery)}%</div>
        </div>
      </Tooltip>
    </Marker>
  );
});

DroneMarker.displayName = 'DroneMarker';

export const TacticalMap = React.memo(() => {
  const drones = useDroneStore((state) => state.drones);
  const hoveredDroneId = useDroneStore((state) => state.hoveredDroneId);
  const selectedDrones = useMapStore((state) => state.selectedDrones);
  const activeLayer = useMapStore((state) => state.activeLayer);
  const is3DMode = useMapStore((state) => state.is3DMode);

  // Center coordinate (Ocotillo Wells)
  const center: [number, number] = useMemo(() => [33.1192, -116.3046], []);

  const mapStyle: React.CSSProperties = useMemo(() => (is3DMode ? {
    transform: 'perspective(1200px) rotateX(60deg) scale(1.8) translateY(-10%)',
    transformOrigin: 'center center',
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  } : {
    transform: 'perspective(1200px) rotateX(0deg) scale(1) translateY(0)',
    transformOrigin: 'center center',
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [is3DMode]);

  const interceptVectors = useMemo(() => {
    return drones
      .filter(d => d.status === 'intercept' && d.targetId)
      .map(drone => {
        const target = drones.find(t => t.id === drone.targetId);
        if (!target) return null;
        return {
          id: drone.id,
          positions: [[drone.lat, drone.lng], [target.lat, target.lng]] as [[number, number], [number, number]]
        };
      })
      .filter(Boolean);
  }, [drones]);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#050505', userSelect: 'none' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0, ...mapStyle }}
        zoomControl={false} // Clean tactical look
      >
        <MapController is3DMode={is3DMode} />
        <MapInteractions />
        <TileLayer
          url={LAYER_URLS[activeLayer]}
          attribution='&copy; OSM contributors &copy; CARTO'
        />
        
        {/* Draw Intercept Vectors */}
        {interceptVectors.map((vector) => vector && (
          <Polyline
            key={`intercept-${vector.id}`}
            positions={vector.positions}
            color="#f59e0b"
            dashArray="5, 10"
            weight={2}
            opacity={0.8}
          />
        ))}

        {drones.map((drone) => {
          const isHovered = hoveredDroneId === drone.id;
          const isSelected = selectedDrones.includes(drone.id);

          return (
            <DroneMarker 
              key={drone.id} 
              drone={drone}
              isHovered={isHovered}
              isSelected={isSelected}
            />
          );
        })}
      </MapContainer>
    </div>
  );
});

TacticalMap.displayName = 'TacticalMap';

