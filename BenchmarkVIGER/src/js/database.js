import gpu from '../data/gpu.json';
import cpu from '../data/cpu.json';
import phones from '../data/phones.json';
import ram from '../data/ram.json';
import ssd from '../data/ssd.json';
import psu from '../data/psu.json';

const datasets = {
  gpu,
  cpu,
  phones,
  ram,
  ssd,
  psu
};

export class Database {
  constructor() {
    this.cache = new Map();
  }

  async loadCategory(category = 'gpu') {
    if (this.cache.has(category)) {
      return this.cache.get(category);
    }

    const data = datasets[category];

    if (!data) {
      throw new Error(`Unknown database category: ${category}`);
    }

    if (!Array.isArray(data)) {
      throw new Error(`Database category "${category}" is not a valid array`);
    }

    this.cache.set(category, data);
    return data;
  }

  async getItemById(category, id) {
    const items = await this.loadCategory(category);
    return items.find(item => item.id === id) || null;
  }
}

export const db = new Database();