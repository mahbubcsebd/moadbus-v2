import { create } from 'zustand';
import brandConfig from '../config/brand.config';

const useBrandStore = create((set, get) => ({
  // Store full config
  brandConfig: brandConfig,

  // Initialize app (set document title, favicon)
  initializeBrand: () => {
    const config = get().brandConfig;

    // Set page title
    document.title = config.title;

    // Set favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = config.favicon;
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }

    // Set meta description
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = `${config.name} - Digital Banking Platform`;
  },

  // Optional: Update specific config value
  updateConfig: (key, value) => {
    set((state) => ({
      brandConfig: {
        ...state.brandConfig,
        [key]: value,
      },
    }));
  },
}));

export default useBrandStore;
