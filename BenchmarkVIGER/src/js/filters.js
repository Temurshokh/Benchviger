/**
 * Search & Filter Engine for Hardware Benchmark Database
 */

export class FilterEngine {
  constructor() {
    this.searchQuery = '';
    this.manufacturer = 'ALL';
    this.vramMin = 0;
    this.coresMin = 0;
    this.socket = 'ALL';
    this.scoreRange = 'ALL'; // ALL, 0-25, 25-50, 50-75, 75-100
    this.generation = 'ALL';
    this.sortBy = 'score-desc'; // score-desc, score-asc, vram-desc, vram-asc, year-desc, year-asc, price-asc, cores-desc
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
  }

  setManufacturer(vendor) {
    this.manufacturer = vendor;
  }

  setVramMin(vram) {
    this.vramMin = parseInt(vram, 10) || 0;
  }

  setCoresMin(cores) {
    this.coresMin = parseInt(cores, 10) || 0;
  }

  setSocket(socketName) {
    this.socket = socketName;
  }

  setScoreRange(range) {
    this.scoreRange = range;
  }

  setGeneration(gen) {
    this.generation = gen;
  }

  setSortBy(sortKey) {
    this.sortBy = sortKey;
  }

  reset() {
    this.searchQuery = '';
    this.manufacturer = 'ALL';
    this.vramMin = 0;
    this.coresMin = 0;
    this.socket = 'ALL';
    this.scoreRange = 'ALL';
    this.generation = 'ALL';
    this.sortBy = 'score-desc';
  }

  apply(items) {
    if (!Array.isArray(items)) return [];

    let filtered = items.filter(item => {
      // 1. Text Search (Matches shortName, full name, architecture, manufacturer, socket, cores, SoC)
      if (this.searchQuery) {
        const nameMatch = (item.name || '').toLowerCase().includes(this.searchQuery);
        const shortMatch = (item.shortName || '').toLowerCase().includes(this.searchQuery);
        const archMatch = (item.architecture || '').toLowerCase().includes(this.searchQuery);
        const vendorMatch = (item.manufacturer || '').toLowerCase().includes(this.searchQuery);
        const socketMatch = (item.socket || '').toLowerCase().includes(this.searchQuery);
        const socMatch = (item.soc || '').toLowerCase().includes(this.searchQuery);

        if (!nameMatch && !shortMatch && !archMatch && !vendorMatch && !socketMatch && !socMatch) {
          return false;
        }
      }

      // 2. Manufacturer Filter
      if (this.manufacturer !== 'ALL' && (item.manufacturer || '').toUpperCase() !== this.manufacturer.toUpperCase()) {
        return false;
      }

      // 3. VRAM Filter (GPU)
      if (this.vramMin > 0 && (item.vram || 0) < this.vramMin) {
        return false;
      }

      // 4. Core Count Filter (CPU)
      if (this.coresMin > 0 && (item.cores || 0) < this.coresMin) {
        return false;
      }

      // 5. Socket Filter (CPU)
      if (this.socket !== 'ALL' && item.socket !== this.socket) {
        return false;
      }

      // 6. Performance Score Range
      const score = item.scores?.overall || item.score || 0;
      if (this.scoreRange === '0-25' && !(score >= 0 && score <= 25)) return false;
      if (this.scoreRange === '25-50' && !(score > 25 && score <= 50)) return false;
      if (this.scoreRange === '50-75' && !(score > 50 && score <= 75)) return false;
      if (this.scoreRange === '75-100' && !(score > 75 && score <= 100)) return false;

      // 7. Generation / Release Year Filter
      const year = item.releaseYear || 0;
      if (this.generation === '2025+' && year < 2025) return false;
      if (this.generation === '2023-2024' && !(year >= 2023 && year <= 2024)) return false;
      if (this.generation === '2021-2022' && !(year >= 2021 && year <= 2022)) return false;
      if (this.generation === 'legacy' && year > 2020) return false;

      return true;
    });

    // Sort Results
    return filtered.sort((a, b) => {
      const scoreA = a.scores?.overall || a.score || 0;
      const scoreB = b.scores?.overall || b.score || 0;
      const vramA = a.vram || 0;
      const vramB = b.vram || 0;
      const coresA = a.cores || 0;
      const coresB = b.cores || 0;
      const yearA = a.releaseYear || 0;
      const yearB = b.releaseYear || 0;
      const priceA = a.msrp || 99999;
      const priceB = b.msrp || 99999;

      switch (this.sortBy) {
        case 'score-asc':
          return scoreA - scoreB;
        case 'vram-desc':
          return vramB - vramA;
        case 'vram-asc':
          return vramA - vramB;
        case 'cores-desc':
          return coresB - coresA;
        case 'year-desc':
          return yearB - yearA;
        case 'year-asc':
          return yearA - yearB;
        case 'price-asc':
          return priceA - priceB;
        case 'score-desc':
        default:
          return scoreB - scoreA;
      }
    });
  }
}

export const filterEngine = new FilterEngine();
