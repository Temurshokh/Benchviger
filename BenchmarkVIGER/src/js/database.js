export class Database {
  constructor() {
    this.cache = new Map();
  }

  async loadCategory(category = 'gpu') {
    if (this.cache.has(category)) {
      return this.cache.get(category);
    }

    try {
      // Dynamic local fetch for PWA/Capacitor bundle compatibility
      const response = await fetch(`./src/data/${category}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(category, data);
      return data;
    } catch (err) {
      console.warn(`Failed to fetch category '${category}' relative to root. Attempting fallback...`, err);
      try {
        const response = await fetch(`../src/data/${category}.json`);
        const data = await response.json();
        this.cache.set(category, data);
        return data;
      } catch (fallbackErr) {
        console.error(`Database error loading ${category}:`, fallbackErr);
        return [];
      }
    }
  }

  async getItemById(category, id) {
    const items = await this.loadCategory(category);
    return items.find(item => item.id === id) || null;
  }
}

export const db = new Database();
