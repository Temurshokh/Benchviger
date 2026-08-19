/**
 * Shared Multi-Category Comparison State Manager
 */

export class ComparisonManager {
  constructor() {
    this.category = 'gpu';
    this.selectedIdsMap = new Map(); // Category -> Set(ids)
    this.loadFromStorage();
  }

  setCategory(cat = 'gpu') {
    this.category = cat;
  }

  getSet(cat = this.category) {
    if (!this.selectedIdsMap.has(cat)) {
      this.selectedIdsMap.set(cat, new Set());
    }
    return this.selectedIdsMap.get(cat);
  }

  loadFromStorage() {
    try {
      ['gpu', 'cpu', 'phones', 'ssd', 'ram', 'psu'].forEach(cat => {
        const stored = localStorage.getItem(`compare_${cat}_ids`);
        if (stored) {
          const ids = JSON.parse(stored);
          this.selectedIdsMap.set(cat, new Set(ids));
        }
      });
    } catch (e) {
      console.error('Failed to load comparison state', e);
    }
  }

  clearAll() {
    ['gpu', 'cpu', 'phones', 'ssd', 'ram', 'psu'].forEach(cat => {
      this.clear(cat);
    });
  }

  saveToStorage(cat = this.category) {
    try {
      const set = this.getSet(cat);
      localStorage.setItem(`compare_${cat}_ids`, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.error('Failed to save comparison state', e);
    }
  }

  toggle(id, cat = this.category) {
    const set = this.getSet(cat);
    if (set.has(id)) {
      set.delete(id);
    } else {
      if (set.size >= 4) {
        alert('You can compare up to 4 devices simultaneously.');
        return false;
      }
      set.add(id);
    }
    this.saveToStorage(cat);
    return true;
  }

  has(id, cat = this.category) {
    return this.getSet(cat).has(id);
  }

  remove(id, cat = this.category) {
    this.getSet(cat).delete(id);
    this.saveToStorage(cat);
  }

  clear(cat = this.category) {
    this.getSet(cat).clear();
    this.saveToStorage(cat);
  }

  getIds(cat = this.category) {
    return Array.from(this.getSet(cat));
  }

  getCount(cat = this.category) {
    return this.getSet(cat).size;
  }
}

export const comparisonManager = new ComparisonManager();
