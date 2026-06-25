import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents, Polyline, Polygon, Marker, Tooltip, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useMapStore } from '../store/useMapStore';
import { useDroneStore } from '../../drones/store/useDroneStore';
import * as turf from '@turf/turf';

export const MapInteractions: React.FC = () => {
  const map = useMap();
  const { 
    activeTool, 
    targetPoint, setTargetPoint,
    routePoints, addRoutePoint,
    geofences, addGeofence,
    rulerPoints, setRulerPoints,
    setSelectedDrones
  } = useMapStore();
  
  const drones = useDroneStore(state => state.drones);

  const [lassoPoints, setLassoPoints] = useState<[number, number][]>([]);
  const [tempGeofence, setTempGeofence] = useState<[number, number][]>([]);

  const isDrawingLassoRef = React.useRef(false);
  const lassoPointsRef = React.useRef<[number, number][]>([]);
  
  const tempGeofenceRef = React.useRef<[number, number][]>([]);

  // Update map options based on tool
  useEffect(() => {
    if (activeTool === 'pan') {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
    
    // Cleanup temporary drawing states when tool changes
    setLassoPoints([]);
    lassoPointsRef.current = [];
    isDrawingLassoRef.current = false;

    setTempGeofence([]);
    tempGeofenceRef.current = [];
    
    if (activeTool !== 'ruler') {
      setRulerPoints([]);
    }
  }, [activeTool, map, setRulerPoints]);

  const handlers = React.useMemo(() => ({
    mousedown(e: L.LeafletMouseEvent) {
      const state = useMapStore.getState();
      const currentTool = state.activeTool;
      if (currentTool === 'lasso') {
        isDrawingLassoRef.current = true;
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        lassoPointsRef.current = [pt];
        setLassoPoints([pt]);
      } else if (currentTool === 'geofence') {
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        tempGeofenceRef.current = [pt];
        setTempGeofence([pt]);
      }
    },
    mousemove(e: L.LeafletMouseEvent) {
      const state = useMapStore.getState();
      const currentTool = state.activeTool;
      if (currentTool === 'lasso' && isDrawingLassoRef.current) {
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        lassoPointsRef.current.push(pt);
        setLassoPoints([...lassoPointsRef.current]);
      } else if (currentTool === 'geofence' && tempGeofenceRef.current.length > 0) {
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        tempGeofenceRef.current.push(pt);
        setTempGeofence([...tempGeofenceRef.current]);
      }
    },
    mouseup(e: L.LeafletMouseEvent) {
      const state = useMapStore.getState();
      const currentTool = state.activeTool;
      if (currentTool === 'lasso' && isDrawingLassoRef.current) {
        isDrawingLassoRef.current = false;
        const pts = lassoPointsRef.current;
        if (pts.length > 2) {
          try {
            const currentDrones = useDroneStore.getState().drones;
            const poly = turf.polygon([[...pts.map(p => [p[1], p[0]]), [pts[0][1], pts[0][0]]]]);
            const selected = currentDrones.filter(d => {
              const pt = turf.point([d.lng, d.lat]);
              return turf.booleanPointInPolygon(pt, poly);
            }).map(d => d.id);
            state.setSelectedDrones(selected);
          } catch (err) {
            console.error("Lasso polygon error:", err);
          }
        }
        setLassoPoints([]);
        lassoPointsRef.current = [];
      } else if (currentTool === 'geofence' && tempGeofenceRef.current.length > 2) {
        state.addGeofence([...tempGeofenceRef.current]);
        setTempGeofence([]);
        tempGeofenceRef.current = [];
      }
    },
    click(e: L.LeafletMouseEvent) {
      const state = useMapStore.getState();
      const currentTool = state.activeTool;
      if (currentTool === 'target') {
        state.setTargetPoint([e.latlng.lat, e.latlng.lng]);
      } else if (currentTool === 'route') {
        state.addRoutePoint([e.latlng.lat, e.latlng.lng]);
      } else if (currentTool === 'ruler') {
        if (state.rulerPoints.length >= 2) {
          state.setRulerPoints([[e.latlng.lat, e.latlng.lng]]);
        } else {
          state.setRulerPoints([...state.rulerPoints, [e.latlng.lat, e.latlng.lng]]);
        }
      }
    }
  }), []);

  useMapEvents(handlers);

  const getDistance = (pts: [number, number][]) => {
    if (pts.length < 2) return 0;
    const from = turf.point([pts[0][1], pts[0][0]]);
    const to = turf.point([pts[1][1], pts[1][0]]);
    const options = { units: 'kilometers' as const };
    return turf.distance(from, to, options).toFixed(2);
  };

  // Custom icon for target
  const targetIcon = L.divIcon({
    className: 'target-marker',
    html: `<div style="color: var(--color-tactical-red); font-size: 24px; line-height: 1; text-shadow: 0 0 10px red; display:flex; justify-content:center; align-items:center;">⌖</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <>
      {/* Lasso Layer */}
      {lassoPoints.length > 0 && (
        <Polyline positions={lassoPoints} pathOptions={{ color: 'var(--color-tactical-primary)', dashArray: '5, 5', weight: 2 }} />
      )}
      
      {/* Target Marker */}
      {targetPoint && (
        <Marker position={targetPoint} icon={targetIcon}>
          <Tooltip direction="top" offset={[0, -10]} className="tactical-tooltip" permanent>
            TARGET DESIGNATED
          </Tooltip>
        </Marker>
      )}

      {/* Route */}
      {routePoints.length > 0 && (
        <Polyline positions={routePoints} pathOptions={{ color: 'var(--color-tactical-green)', weight: 3, opacity: 0.8 }} />
      )}
      {routePoints.map((pt, i) => (
        <CircleMarker key={i} center={pt} radius={4} pathOptions={{ color: 'var(--color-tactical-green)', fillColor: 'var(--color-tactical-bg)', fillOpacity: 1 }} />
      ))}

      {/* Geofences */}
      {geofences.map((fence, i) => (
        <Polygon key={i} positions={fence} pathOptions={{ color: 'var(--color-tactical-red)', fillColor: 'var(--color-tactical-red)', fillOpacity: 0.2, dashArray: '10, 10' }} />
      ))}
      {tempGeofence.length > 0 && (
        <Polyline positions={tempGeofence} pathOptions={{ color: 'var(--color-tactical-red)', dashArray: '10, 10', weight: 2 }} />
      )}

      {/* Ruler */}
      {rulerPoints.length > 0 && (
        <>
          <Polyline positions={rulerPoints} pathOptions={{ color: 'var(--color-tactical-orange)', weight: 2, dashArray: '4, 8' }} />
          {rulerPoints.map((pt, i) => (
            <CircleMarker key={i} center={pt} radius={3} pathOptions={{ color: 'var(--color-tactical-orange)', fillColor: 'var(--color-tactical-orange)', fillOpacity: 1 }} />
          ))}
          {rulerPoints.length === 2 && (
            <Marker position={rulerPoints[1]} opacity={0}>
              <Tooltip direction="right" permanent className="tactical-tooltip text-tactical-orange border-tactical-orange">
                DIST: {getDistance(rulerPoints)} KM
              </Tooltip>
            </Marker>
          )}
        </>
      )}
    </>
  );
};
