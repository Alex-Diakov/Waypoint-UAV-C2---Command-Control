import { X } from 'lucide-react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { WIDGET_CONFIGS, WidgetGroupState, WidgetId, useWidgetStore } from '../../store/useWidgetStore';
import { ErrorBoundary } from './ErrorBoundary';

interface WidgetGroupProps {
  group: WidgetGroupState;
  components: Record<WidgetId, React.ReactNode>;
}

export const WidgetGroup: React.FC<WidgetGroupProps> = React.memo(({ group, components }) => {
  const closeWidget = useWidgetStore(s => s.closeWidget);
  const toggleMinimizeGroup = useWidgetStore(s => s.toggleMinimizeGroup);
  const updateGroupPosition = useWidgetStore(s => s.updateGroupPosition);
  const updateGroupSize = useWidgetStore(s => s.updateGroupSize);
  const bringGroupToFront = useWidgetStore(s => s.bringGroupToFront);
  const setActiveTab = useWidgetStore(s => s.setActiveTab);
  const moveTabToGroup = useWidgetStore(s => s.moveTabToGroup);
  const detachTab = useWidgetStore(s => s.detachTab);
  
  const rndRef = useRef<Rnd>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1000, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });
  const [snapZone, setSnapZone] = useState<'left' | 'right' | 'bottom' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('tabid')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const tabId = e.dataTransfer.getData('tabId') as WidgetId;
    const sourceGroupId = e.dataTransfer.getData('sourceGroupId');
    
    if (tabId && sourceGroupId && sourceGroupId !== group.id) {
      moveTabToGroup(tabId, sourceGroupId, group.id);
    }
  }, [group.id, moveTabToGroup]);

  const handleDrag = useCallback((e: any) => {
    let newSnap: 'left' | 'right' | 'bottom' | null = null;
    
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX !== undefined && clientY !== undefined) {
      if (clientX < 100) newSnap = 'left';
      else if (clientX > windowSize.width - 100) newSnap = 'right';
      else if (clientY > windowSize.height - 100) newSnap = 'bottom';
    }
    
    setSnapZone(newSnap);
  }, [windowSize.width, windowSize.height]);

  const handleDragStop = useCallback((e: any, d: any) => {
    let newX = d.x;
    let newY = d.y;
    let newWidth = typeof group.width === 'string' ? parseInt(group.width) : group.width;
    let newHeight = typeof group.height === 'string' ? parseInt(group.height) : group.height;

    let snapped = false;
    const MAIN_HEIGHT = windowSize.height - 60; // Top bar height is 60px
    const SIDEBAR_WIDTH = 64; // MapControls sidebar width is 64px (w-16)

    if (snapZone === 'left') {
      newX = SIDEBAR_WIDTH;
      newY = 0;
      newHeight = MAIN_HEIGHT;
      snapped = true;
    } else if (snapZone === 'right') {
      newX = windowSize.width - newWidth;
      newY = 0;
      newHeight = MAIN_HEIGHT;
      snapped = true;
    } else if (snapZone === 'bottom') {
      newY = MAIN_HEIGHT - newHeight;
      newX = SIDEBAR_WIDTH;
      newWidth = windowSize.width - SIDEBAR_WIDTH;
      snapped = true;
    }

    setSnapZone(null);
    updateGroupPosition(group.id, newX, newY);
    if (snapped) {
      updateGroupSize(group.id, newWidth, newHeight);
    }
  }, [group.id, group.width, group.height, snapZone, windowSize.width, windowSize.height, updateGroupPosition, updateGroupSize]);

  // Clamp position so that at least 50px of the widget header is visible and it doesn't overlap the sidebar
  const SIDEBAR_WIDTH = 64;
  const clampedX = Math.max(SIDEBAR_WIDTH, Math.min(group.x, windowSize.width - 50));
  const clampedY = Math.max(0, Math.min(group.y, windowSize.height - 60 - 36));

  const renderSnapOverlay = () => {
    if (!snapZone || typeof document === 'undefined') return null;
    
    const currentWidth = typeof group.width === 'string' ? parseInt(group.width) : group.width;
    const currentHeight = typeof group.height === 'string' ? parseInt(group.height) : group.height;

    return createPortal(
      <div 
        className="fixed pointer-events-none bg-tactical-primary/20 border-2 border-tactical-primary/60 z-[9999] transition-all duration-200"
        style={{
          top: snapZone === 'bottom' ? windowSize.height - currentHeight : 60,
          bottom: 0,
          left: snapZone === 'right' ? windowSize.width - currentWidth : SIDEBAR_WIDTH,
          right: snapZone === 'left' ? windowSize.width - currentWidth : 0,
        }}
      />,
      document.body
    );
  };

  return (
    <>
      {renderSnapOverlay()}
      <Rnd
        ref={rndRef}
        size={
          group.isMinimized 
            ? { width: group.width, height: 36 } // roughly tab bar height
            : { width: group.width, height: group.height }
        }
        position={{ x: clampedX, y: clampedY }}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateGroupSize(group.id, ref.style.width, ref.style.height);
          updateGroupPosition(group.id, position.x, position.y);
        }}
        onDragStart={() => bringGroupToFront(group.id)}
        onMouseDown={() => bringGroupToFront(group.id)}
        bounds="parent"
        dragHandleClassName="widget-drag-handle"
        enableResizing={!group.isMinimized}
        minWidth={250}
        minHeight={150}
        style={{ zIndex: group.z + 100 }}
        className={`flex flex-col shadow-2xl transition-all duration-200 ${group.isMinimized ? 'overflow-hidden' : ''}`}
        resizeHandleComponent={{
          bottomRight: (
            <div className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-end justify-end opacity-50 hover:opacity-100">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" className="text-tactical-text">
                <path d="M10 0V10H0" strokeWidth="2" />
              </svg>
            </div>
          )
        }}
      >
        <div 
          className={`w-full h-full bg-tactical-backdrop backdrop-blur-md border flex flex-col transition-colors
            ${isDragOver ? 'border-tactical-primary bg-tactical-backdrop' : 'border-tactical-border/50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Tab Bar / Header */}
          <div 
            className="flex items-center justify-between bg-tactical-surface border-b border-tactical-border/50 shrink-0 widget-drag-handle h-9"
            onDoubleClick={() => toggleMinimizeGroup(group.id)}
          >
            <div className="flex-1 flex items-end h-full overflow-hidden pt-1 px-1 gap-1">
              {group.tabs.map((tabId) => {
                const config = WIDGET_CONFIGS[tabId];
                if (!config) return null;
                return (
                  <div
                    key={tabId}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('tabId', tabId);
                      e.dataTransfer.setData('sourceGroupId', group.id);
                      e.dataTransfer.setData('tabid', tabId);
                    }}
                    onDragEnd={(e) => {
                      if (e.dataTransfer.dropEffect === 'none' && group.tabs.length > 1) {
                        detachTab(tabId, group.id, e.clientX, e.clientY);
                      }
                    }}
                    onClick={() => setActiveTab(group.id, tabId)}
                    className={`relative max-w-[160px] min-w-[60px] flex-shrink px-3 py-1.5 text-xs font-mono font-bold tracking-wider cursor-pointer border border-b-0 transition-colors
                      ${group.activeTab === tabId 
                        ? 'bg-tactical-backdrop text-tactical-text border-tactical-border/50 border-t-tactical-primary' 
                        : 'bg-transparent text-tactical-text-muted border-transparent hover:bg-tactical-surface-hover hover:text-tactical-text'
                      }
                    `}
                    style={group.activeTab === tabId ? { borderTopWidth: 2 } : {}}
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <span className="truncate">{config.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeWidget(tabId);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="opacity-50 hover:opacity-100 hover:text-tactical-red shrink-0 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className={`relative flex-1 overflow-hidden flex flex-col transition-opacity duration-200 ${group.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <ErrorBoundary fallbackName={WIDGET_CONFIGS[group.activeTab]?.title || group.activeTab}>
              {components[group.activeTab]}
            </ErrorBoundary>
          </div>
        </div>
      </Rnd>
    </>
  );
});

WidgetGroup.displayName = 'WidgetGroup';

