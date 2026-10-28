import { create } from 'zustand';
import { api, demo, storage } from './api.js';
import { DEMO } from './config.js';

const cached = storage.get('onsite-cache', null);

export const useStore = create((set, get) => ({
  data: cached?.data || null,
  loadedAt: cached?.at ? new Date(cached.at) : null,
  syncing: false,
  error: '',

  me: storage.get('onsite-me', null), // { name, email, station }
  device: storage.get('onsite-device', null), // 'personal' | 'shared'
  theme: storage.get('onsite-theme', 'system'), // 'system' | 'light' | 'dark'

  async sync({ manual = false } = {}) {
    if (get().syncing) return;
    set({ syncing: true, ...(manual ? { error: '' } : {}) });
    try {
      const data = await api.all();
      const at = new Date();
      if (!DEMO) storage.set('onsite-cache', { data, at: at.toISOString() });
      set({ data, loadedAt: at, error: '' });
    } catch (e) {
      // The first quiet load never shows an error; a manual sync, or a failed
      // refresh over data already on screen, reports it.
      if (manual || get().data) set({ error: e.message || 'Unknown error' });
      if (manual) throw e;
    } finally {
      set({ syncing: false });
    }
  },

  async punch(body) {
    const p = await api.punch(body);
    set((s) => ({ data: s.data ? { ...s.data, punches: [...s.data.punches, p] } : s.data }));
    return p;
  },

  async setClientHours(week, hours) {
    await api.clientHours(week, hours);
    set((s) => ({
      data: { ...s.data, client: s.data.client.filter((c) => c.week !== week).concat(hours == null ? [] : [{ week, hours }]) },
    }));
  },

  setMe(me) { storage.set('onsite-me', me); set({ me }); },
  forgetMe() { storage.remove('onsite-me'); set({ me: null }); },
  setDevice(device) { storage.set('onsite-device', device); set({ device }); },
  setTheme(theme) { storage.set('onsite-theme', theme); set({ theme }); },
  resetDemo() { demo.reset(); get().sync(); },
}));
