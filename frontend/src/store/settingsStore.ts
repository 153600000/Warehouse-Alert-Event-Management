import { create } from 'zustand';

export interface AlertThresholds {
  maxAmbientTemp: number;
  maxColdChainTemp: number;
  maxConveyorLoad: number;
  minAgvBattery: number;
}

interface SettingsState {
  streamingIntervalMs: number;
  pollingIntervalMs: number;
  thresholds: AlertThresholds;
  audioNotifications: boolean;
  autoRefreshAnalytics: boolean;
  setStreamingInterval: (ms: number) => void;
  setPollingInterval: (ms: number) => void;
  setThresholds: (thresholds: Partial<AlertThresholds>) => void;
  toggleAudio: () => void;
  toggleAutoRefresh: () => void;
  resetDefaults: () => void;
}

const DEFAULT_THRESHOLDS: AlertThresholds = {
  maxAmbientTemp: 28.0,
  maxColdChainTemp: -14.0,
  maxConveyorLoad: 600,
  minAgvBattery: 25,
};

const savedSettings = () => {
  try {
    const raw = localStorage.getItem('warehouse_settings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return null;
};

const initial = savedSettings();

export const useSettingsStore = create<SettingsState>((set) => ({
  streamingIntervalMs: initial?.streamingIntervalMs ?? 1000,
  pollingIntervalMs: initial?.pollingIntervalMs ?? 10000,
  thresholds: initial?.thresholds ?? DEFAULT_THRESHOLDS,
  audioNotifications: initial?.audioNotifications ?? false,
  autoRefreshAnalytics: initial?.autoRefreshAnalytics ?? true,

  setStreamingInterval: (ms: number) => {
    set((state) => {
      const updated = { ...state, streamingIntervalMs: ms };
      localStorage.setItem('warehouse_settings', JSON.stringify(updated));
      return { streamingIntervalMs: ms };
    });
  },

  setPollingInterval: (ms: number) => {
    set((state) => {
      const updated = { ...state, pollingIntervalMs: ms };
      localStorage.setItem('warehouse_settings', JSON.stringify(updated));
      return { pollingIntervalMs: ms };
    });
  },

  setThresholds: (partial: Partial<AlertThresholds>) => {
    set((state) => {
      const newThresholds = { ...state.thresholds, ...partial };
      const updated = { ...state, thresholds: newThresholds };
      localStorage.setItem('warehouse_settings', JSON.stringify(updated));
      return { thresholds: newThresholds };
    });
  },

  toggleAudio: () => {
    set((state) => {
      const updated = { ...state, audioNotifications: !state.audioNotifications };
      localStorage.setItem('warehouse_settings', JSON.stringify(updated));
      return { audioNotifications: !state.audioNotifications };
    });
  },

  toggleAutoRefresh: () => {
    set((state) => {
      const updated = { ...state, autoRefreshAnalytics: !state.autoRefreshAnalytics };
      localStorage.setItem('warehouse_settings', JSON.stringify(updated));
      return { autoRefreshAnalytics: !state.autoRefreshAnalytics };
    });
  },

  resetDefaults: () => {
    const defaults = {
      streamingIntervalMs: 1000,
      pollingIntervalMs: 10000,
      thresholds: DEFAULT_THRESHOLDS,
      audioNotifications: false,
      autoRefreshAnalytics: true,
    };
    localStorage.setItem('warehouse_settings', JSON.stringify(defaults));
    set(defaults);
  },
}));
