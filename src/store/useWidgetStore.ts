import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetId = 'uav-fleet' | 'installations' | 'video-feed' | 'design-system' | 'fire-support';

export interface WidgetGroupState {
  id: string;
  tabs: WidgetId[];
  activeTab: WidgetId;
  x: number;
  y: number;
  z: number;
  width: number | string;
  height: number | string;
  isMinimized: boolean;
}

interface WidgetStore {
  groups: WidgetGroupState[];
  
  toggleWidget: (id: WidgetId) => void;
  openWidget: (id: WidgetId) => void;
  closeWidget: (id: WidgetId) => void;
  
  bringGroupToFront: (groupId: string) => void;
  updateGroupPosition: (groupId: string, x: number, y: number) => void;
  updateGroupSize: (groupId: string, width: number | string, height: number | string) => void;
  toggleMinimizeGroup: (groupId: string) => void;
  
  setActiveTab: (groupId: string, tabId: WidgetId) => void;
  moveTabToGroup: (tabId: WidgetId, sourceGroupId: string, targetGroupId: string) => void;
  detachTab: (tabId: WidgetId, sourceGroupId: string, x: number, y: number) => void;
}

const INITIAL_GROUPS: WidgetGroupState[] = [
  { id: 'g-uav', tabs: ['uav-fleet'], activeTab: 'uav-fleet', x: 20, y: 80, z: 10, width: 350, height: 500, isMinimized: false },
];

export const WIDGET_CONFIGS: Record<WidgetId, { title: string, defaultWidth: number, defaultHeight: number }> = {
  'uav-fleet': { title: 'UAV Fleet Control', defaultWidth: 350, defaultHeight: 500 },
  'installations': { title: 'Installations', defaultWidth: 350, defaultHeight: 400 },
  'video-feed': { title: 'Live Video Feed', defaultWidth: 480, defaultHeight: 360 },
  'design-system': { title: 'Design System', defaultWidth: 400, defaultHeight: 500 },
  'fire-support': { title: 'Fire Support', defaultWidth: 380, defaultHeight: 650 },
};

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      groups: INITIAL_GROUPS,
      
      toggleWidget: (id) => {
        const { groups, openWidget, closeWidget } = get();
        const isWidgetOpen = groups.some(g => g.tabs.includes(id));
        if (isWidgetOpen) {
          closeWidget(id);
        } else {
          openWidget(id);
        }
      },
      
      openWidget: (id) => set((state) => {
        if (state.groups.some(g => g.tabs.includes(id))) {
          return state;
        }
        const config = WIDGET_CONFIGS[id];
        const highestZ = Math.max(...state.groups.map(g => g.z), 0);
        const newGroup: WidgetGroupState = {
          id: `g-${Date.now()}-${id}`,
          tabs: [id],
          activeTab: id,
          x: 50,
          y: 100,
          z: highestZ + 1,
          width: config.defaultWidth,
          height: config.defaultHeight,
          isMinimized: false
        };
        return { groups: [...state.groups, newGroup] };
      }),
      
      closeWidget: (id) => set((state) => {
        return {
          groups: state.groups.map(g => {
            if (!g.tabs.includes(id)) return g;
            const newTabs = g.tabs.filter(t => t !== id);
            return {
              ...g,
              tabs: newTabs,
              activeTab: g.activeTab === id ? (newTabs[0] || null as any) : g.activeTab
            };
          }).filter(g => g.tabs.length > 0)
        };
      }),

      bringGroupToFront: (groupId) => set((state) => {
        const highestZ = Math.max(...state.groups.map(g => g.z), 0);
        return {
          groups: state.groups.map(g => 
            g.id === groupId ? { ...g, z: highestZ + 1 } : g
          )
        };
      }),

      updateGroupPosition: (groupId, x, y) => set((state) => ({
        groups: state.groups.map(g => g.id === groupId ? { ...g, x, y } : g)
      })),

      updateGroupSize: (groupId, width, height) => set((state) => ({
        groups: state.groups.map(g => g.id === groupId ? { ...g, width, height } : g)
      })),

      toggleMinimizeGroup: (groupId) => set((state) => ({
        groups: state.groups.map(g => g.id === groupId ? { ...g, isMinimized: !g.isMinimized } : g)
      })),

      setActiveTab: (groupId, tabId) => set((state) => ({
        groups: state.groups.map(g => g.id === groupId ? { ...g, activeTab: tabId } : g)
      })),

      moveTabToGroup: (tabId, sourceGroupId, targetGroupId) => set((state) => {
        if (sourceGroupId === targetGroupId) return state;
        
        let updatedGroups = state.groups.map(g => {
          if (g.id === sourceGroupId) {
            const newTabs = g.tabs.filter(t => t !== tabId);
            return {
              ...g,
              tabs: newTabs,
              activeTab: g.activeTab === tabId ? (newTabs[0] || null as any) : g.activeTab
            };
          }
          if (g.id === targetGroupId) {
             const newTabs = [...g.tabs, tabId];
             return {
               ...g,
               tabs: newTabs,
               activeTab: tabId,
               isMinimized: false
             }
          }
          return g;
        }).filter(g => g.tabs.length > 0);
        
        const highestZ = Math.max(...updatedGroups.map(g => g.z), 0);
        
        updatedGroups = updatedGroups.map(g => 
          g.id === targetGroupId ? { ...g, z: highestZ + 1 } : g
        );

        return { groups: updatedGroups };
      }),

      detachTab: (tabId, sourceGroupId, x, y) => set((state) => {
        const sourceGroup = state.groups.find(g => g.id === sourceGroupId);
        if (!sourceGroup || sourceGroup.tabs.length <= 1) return state;
        
        const config = WIDGET_CONFIGS[tabId];
        const highestZ = Math.max(...state.groups.map(g => g.z), 0);
        
        const newGroup: WidgetGroupState = {
          id: `g-${Date.now()}-${tabId}`,
          tabs: [tabId],
          activeTab: tabId,
          x: x,
          y: y,
          z: highestZ + 1,
          width: sourceGroup.width,
          height: sourceGroup.height,
          isMinimized: false
        };
        
        const updatedGroups = state.groups.map(g => {
          if (g.id === sourceGroupId) {
            const newTabs = g.tabs.filter(t => t !== tabId);
            return {
              ...g,
              tabs: newTabs,
              activeTab: g.activeTab === tabId ? (newTabs[0] || null as any) : g.activeTab
            };
          }
          return g;
        });

        return { groups: [...updatedGroups, newGroup] };
      }),
    }),
    {
      name: 'tactical-widget-storage',
    }
  )
);
