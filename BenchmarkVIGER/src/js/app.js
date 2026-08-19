import { db } from './database.js';
import { filterEngine } from './filters.js';
import { comparisonManager } from './comparison.js';
import { Router } from './router.js';
import { 
  renderHardwareCard, 
  renderGpuDetails, 
  renderCpuDetails, 
  renderComparisonPage, 
  renderComingSoon 
} from './ui.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app-content');
    this.floatingBar = document.getElementById('floating-compare');
    this.compareCountBadge = document.getElementById('compare-badge-count');
    this.floatingCountBadge = document.getElementById('floating-count');

    this.currentCategory = 'gpu';
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('benchviger_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    
    this.initRouter();
    this.bindGlobalEvents();
  }

  initRouter() {
    this.router = new Router({
      'gpu': (id) => {
        this.currentCategory = 'gpu';
        comparisonManager.setCategory('gpu');
        if (id) {
          this.renderGpuDetailPage(id);
        } else {
          this.renderGpuListPage();
        }
      },
      'cpu': (id) => {
        this.currentCategory = 'cpu';
        comparisonManager.setCategory('cpu');
        if (id) {
          this.renderCpuDetailPage(id);
        } else {
          this.renderCpuListPage();
        }
      },
      'phones': (id) => {
        this.currentCategory = 'phones';
        comparisonManager.setCategory('phones');
        if (id) {
          this.renderPhoneDetailPage(id);
        } else {
          this.renderPhoneListPage();
        }
      },
      'ram': () => {
        this.currentCategory = 'ram';
        comparisonManager.setCategory('ram');
        this.renderRamListPage();
      },
      'ssd': () => {
        this.currentCategory = 'ssd';
        comparisonManager.setCategory('ssd');
        this.renderSsdListPage();
      },
      'psu': () => {
        this.currentCategory = 'psu';
        comparisonManager.setCategory('psu');
        this.renderPsuListPage();
      },
      'settings': () => this.renderSettingsPage(),
      'compare': () => this.renderComparePage(),
      'category': (cat, id) => {
        if (['gpu', 'cpu', 'phones', 'ram', 'ssd', 'psu'].includes(cat)) {
          this.currentCategory = cat;
          comparisonManager.setCategory(cat);
          if (cat === 'gpu') this.renderGpuListPage();
          else if (cat === 'cpu') this.renderCpuListPage();
          else if (cat === 'phones') this.renderPhoneListPage();
          else if (cat === 'ram') this.renderRamListPage();
          else if (cat === 'ssd') this.renderSsdListPage();
          else if (cat === 'psu') this.renderPsuListPage();
        } else {
          this.currentCategory = cat;
          this.renderCategoryPage(cat);
        }
      }
    });

    this.router.init();
  }

  updateCompareBadge() {
    const count = comparisonManager.getCount(this.currentCategory);
    
    if (this.compareCountBadge) {
      this.compareCountBadge.textContent = count;
      this.compareCountBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (this.floatingCountBadge) {
      this.floatingCountBadge.textContent = count;
    }

    if (this.floatingBar) {
      this.floatingBar.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  async renderGpuListPage() {
    this.updateActiveNav('gpu');
    filterEngine.reset();
    const items = await db.loadCategory('gpu');

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search GPUs (e.g. 5090, 9070, B580, 3060, 1070)..." value="${filterEngine.searchQuery}">
        </div>

        <!-- Filter Controls -->
        <div class="filter-bar">
          <select id="filter-vendor" class="select-input">
            <option value="ALL">All Vendors</option>
            <option value="NVIDIA">NVIDIA</option>
            <option value="AMD">AMD</option>
            <option value="Intel">Intel</option>
          </select>

          <select id="filter-vram" class="select-input">
            <option value="0">All VRAM</option>
            <option value="8">8 GB+</option>
            <option value="12">12 GB+</option>
            <option value="16">16 GB+</option>
            <option value="24">24 GB+</option>
          </select>

          <select id="filter-score" class="select-input">
            <option value="ALL">All Scores</option>
            <option value="75-100">75 - 100 (Flagship)</option>
            <option value="50-75">50 - 75 (High)</option>
            <option value="25-50">25 - 50 (Mid)</option>
            <option value="0-25">0 - 25 (Entry)</option>
          </select>

          <select id="filter-sort" class="select-input">
            <option value="score-desc">Score ↓</option>
            <option value="score-asc">Score ↑</option>
            <option value="vram-desc">VRAM ↓</option>
            <option value="vram-asc">VRAM ↑</option>
            <option value="year-desc">Year ↓</option>
            <option value="price-asc">Price ↑</option>
          </select>
        </div>

        <div class="section-title">
          <span>Popular GPUs</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(items, 'gpu');
    this.renderFilteredList(items, 'gpu');
    this.updateCompareBadge();
  }

  async renderCpuListPage() {
    this.updateActiveNav('cpu');
    filterEngine.reset();
    const items = await db.loadCategory('cpu');

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search CPUs (e.g. 7800X3D, 14900K, 12400F, 5700X3D)..." value="${filterEngine.searchQuery}">
        </div>

        <!-- CPU Filter Controls -->
        <div class="filter-bar">
          <select id="filter-vendor" class="select-input">
            <option value="ALL">All Vendors</option>
            <option value="AMD">AMD</option>
            <option value="Intel">Intel</option>
          </select>

          <select id="filter-cores" class="select-input">
            <option value="0">All Cores</option>
            <option value="4">4+ Cores</option>
            <option value="6">6+ Cores</option>
            <option value="8">8+ Cores</option>
            <option value="12">12+ Cores</option>
            <option value="16">16+ Cores</option>
            <option value="24">24+ Cores</option>
          </select>

          <select id="filter-socket" class="select-input">
            <option value="ALL">All Sockets</option>
            <option value="AM5">AM5</option>
            <option value="AM4">AM4</option>
            <option value="LGA 1700">LGA 1700</option>
            <option value="LGA 1851">LGA 1851</option>
            <option value="LGA 1200">LGA 1200</option>
            <option value="LGA 1151">LGA 1151</option>
          </select>

          <select id="filter-sort" class="select-input">
            <option value="score-desc">Score ↓</option>
            <option value="score-asc">Score ↑</option>
            <option value="cores-desc">Cores ↓</option>
            <option value="year-desc">Year ↓</option>
            <option value="price-asc">Price ↑</option>
          </select>
        </div>

        <div class="section-title">
          <span>Processors (CPUs)</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(items, 'cpu');
    this.renderFilteredList(items, 'cpu');
    this.updateCompareBadge();
  }

  renderFilteredList(allItems, category = 'gpu') {
    const grid = document.getElementById('gpu-grid-container');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    const filtered = filterEngine.apply(allItems);
    if (countEl) countEl.textContent = `${filtered.length} devices`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 32px 0; color: var(--text-muted);">
          No matching hardware found for your search criteria.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => renderHardwareCard(item, category)).join('');
    this.bindCompareButtons(category);
  }

  bindFilterEvents(allItems, category = 'gpu') {
    const searchInput = document.getElementById('search-input');
    const vendorSelect = document.getElementById('filter-vendor');
    const vramSelect = document.getElementById('filter-vram');
    const coresSelect = document.getElementById('filter-cores');
    const socketSelect = document.getElementById('filter-socket');
    const scoreSelect = document.getElementById('filter-score');
    const sortSelect = document.getElementById('filter-sort');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterEngine.setSearchQuery(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (vendorSelect) {
      vendorSelect.addEventListener('change', (e) => {
        filterEngine.setManufacturer(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (vramSelect) {
      vramSelect.addEventListener('change', (e) => {
        filterEngine.setVramMin(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (coresSelect) {
      coresSelect.addEventListener('change', (e) => {
        filterEngine.setCoresMin(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (socketSelect) {
      socketSelect.addEventListener('change', (e) => {
        filterEngine.setSocket(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (scoreSelect) {
      scoreSelect.addEventListener('change', (e) => {
        filterEngine.setScoreRange(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        filterEngine.setSortBy(e.target.value);
        this.renderFilteredList(allItems, category);
      });
    }
  }

  bindCompareButtons(category = this.currentCategory) {
    document.querySelectorAll('.compare-check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const btnCat = btn.getAttribute('data-cat') || category;
        comparisonManager.toggle(id, btnCat);
        
        const isSelected = comparisonManager.has(id, btnCat);
        btn.classList.toggle('selected', isSelected);
        btn.textContent = isSelected ? '✓ Added' : '+ Compare';
        this.updateCompareBadge();
      });
    });
  }

  async renderGpuDetailPage(id) {
    this.updateActiveNav('gpu');
    const item = await db.getItemById('gpu', id);

    if (!item) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>GPU Device not found</h2>
          <a href="#/gpu" style="color:#60a5fa; text-decoration:none;">Back to GPUs</a>
        </div>
      `;
      return;
    }

    this.appElement.innerHTML = renderGpuDetails(item);
    this.bindCompareButtons('gpu');
    this.updateCompareBadge();
  }

  async renderCpuDetailPage(id) {
    this.updateActiveNav('cpu');
    const item = await db.getItemById('cpu', id);

    if (!item) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>CPU Processor not found</h2>
          <a href="#/category/cpu" style="color:#60a5fa; text-decoration:none;">Back to CPUs</a>
        </div>
      `;
      return;
    }

    this.appElement.innerHTML = renderCpuDetails(item);
    this.bindCompareButtons('cpu');
    this.updateCompareBadge();
  }

  async renderPhoneListPage() {
    this.updateActiveNav('phones');
    filterEngine.reset();
    const items = await db.loadCategory('phones');

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search Phones (e.g. iPhone 16, S24 Ultra, Pixel 9, OnePlus 13)..." value="${filterEngine.searchQuery}">
        </div>

        <!-- Phone Filter Controls -->
        <div class="filter-bar">
          <select id="filter-vendor" class="select-input">
            <option value="ALL">All Brands</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Google">Google</option>
            <option value="Tecno">Tecno</option>
            <option value="Huawei">Huawei</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="POCO">POCO</option>
            <option value="Redmi">Redmi</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Infinix">Infinix</option>
            <option value="Realme">Realme</option>
            <option value="vivo">vivo</option>
            <option value="OPPO">OPPO</option>
            <option value="Honor">Honor</option>
            <option value="Nothing">Nothing</option>
            <option value="ASUS">ASUS</option>
            <option value="Sony">Sony</option>
          </select>

          <select id="filter-vram" class="select-input">
            <option value="0">All RAM</option>
            <option value="6">6 GB+</option>
            <option value="8">8 GB+</option>
            <option value="12">12 GB+</option>
            <option value="16">16 GB+</option>
          </select>

          <select id="filter-score" class="select-input">
            <option value="ALL">All Scores</option>
            <option value="75-100">75 - 100 (Flagship)</option>
            <option value="50-75">50 - 75 (High)</option>
            <option value="25-50">25 - 50 (Mid)</option>
            <option value="0-25">0 - 25 (Entry)</option>
          </select>

          <select id="filter-sort" class="select-input">
            <option value="score-desc">Score ↓</option>
            <option value="score-asc">Score ↑</option>
            <option value="vram-desc">RAM ↓</option>
            <option value="year-desc">Year ↓</option>
            <option value="price-asc">Price ↑</option>
          </select>
        </div>

        <div class="section-title">
          <span>Smartphones</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(items, 'phones');
    this.renderFilteredList(items, 'phones');
    this.updateCompareBadge();
  }

  async renderPhoneDetailPage(id) {
    this.updateActiveNav('phones');
    const item = await db.getItemById('phones', id);

    if (!item) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>Phone not found</h2>
          <a href="#/category/phones" style="color:#60a5fa; text-decoration:none;">Back to Phones</a>
        </div>
      `;
      return;
    }

    const { renderPhoneDetails } = await import('./ui.js');
    this.appElement.innerHTML = renderPhoneDetails(item);
    this.bindCompareButtons('phones');
    this.updateCompareBadge();
  }

  async renderRamListPage() {
    this.updateActiveNav('ram');
    filterEngine.reset();
    const items = await db.loadCategory('ram');

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search RAM (e.g. DDR5, 32GB, 6000MHz)..." value="${filterEngine.searchQuery}">
        </div>

        <!-- Custom RAM Estimator Card -->
        <div class="chart-card" style="margin-bottom: 20px;">
          <div class="chart-header">⚡ Custom RAM Score Estimator</div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 10px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Capacity</label>
              <select id="custom-ram-cap" class="select-input" style="width:100%;">
                <option value="8">8 GB</option>
                <option value="16" selected>16 GB</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Generation</label>
              <select id="custom-ram-gen" class="select-input" style="width:100%;">
                <option value="DDR4">DDR4</option>
                <option value="DDR5" selected>DDR5</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Speed (MHz)</label>
              <input type="number" id="custom-ram-speed" class="search-input" style="padding:6px 10px; font-size:0.85rem;" value="6000" step="100">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Modules</label>
              <select id="custom-ram-mods" class="select-input" style="width:100%;">
                <option value="1">1 Stick (Single)</option>
                <option value="2" selected>2 Sticks (Dual)</option>
                <option value="4">4 Sticks (Quad)</option>
              </select>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 14px; background: var(--card-bg); padding: 10px 14px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:0.85rem; color:var(--text-secondary);">Calculated Estimated Score:</div>
            <div id="custom-ram-result" style="font-size:1.3rem; font-weight:800; color:#60a5fa;">92 / 100</div>
          </div>
        </div>

        <div class="section-title">
          <span>Curated RAM Configurations</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(items, 'ram');
    this.renderFilteredList(items, 'ram');
    this.bindCustomRamEvents();
    this.updateCompareBadge();
  }

  bindCustomRamEvents() {
    const capEl = document.getElementById('custom-ram-cap');
    const genEl = document.getElementById('custom-ram-gen');
    const speedEl = document.getElementById('custom-ram-speed');
    const modsEl = document.getElementById('custom-ram-mods');
    const resEl = document.getElementById('custom-ram-result');

    const updateScore = () => {
      if (!resEl) return;
      const cap = parseInt(capEl?.value || 16, 10);
      const gen = genEl?.value || 'DDR5';
      const speed = parseInt(speedEl?.value || 5600, 10);
      const mods = parseInt(modsEl?.value || 2, 10);

      let base = (gen === 'DDR5') ? (speed / 75) : (speed / 90);
      let capBonus = Math.min(cap / 2, 25);
      let channelMult = (mods >= 2) ? 1.15 : 0.9;
      let score = Math.round(Math.min(100, Math.max(1, (base + capBonus) * channelMult)));

      resEl.textContent = `${score} / 100`;
    };

    [capEl, genEl, speedEl, modsEl].forEach(el => el?.addEventListener('input', updateScore));
  }

  async renderSsdListPage() {
    this.updateActiveNav('ssd');
    filterEngine.reset();
    const items = await db.loadCategory('ssd');

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search SSDs (e.g. 990 PRO, SN850X, PCIe 4.0, 2TB)..." value="${filterEngine.searchQuery}">
        </div>

        <div class="section-title">
          <span>Solid State Drives (SSDs)</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(items, 'ssd');
    this.renderFilteredList(items, 'ssd');
    this.updateCompareBadge();
  }

  async renderPsuListPage() {
    this.updateActiveNav('psu');
    filterEngine.reset();
    const [psus, cpus, gpus] = await Promise.all([
      db.loadCategory('psu'),
      db.loadCategory('cpu'),
      db.loadCategory('gpu')
    ]);

    this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search Power Supplies (e.g. RM1000x, 850W, Gold, Seasonic)..." value="${filterEngine.searchQuery}">
        </div>

        <!-- PSU System Power Checker -->
        <div class="chart-card" style="margin-bottom: 20px;">
          <div class="chart-header">⚡ PC Power Compatibility Checker</div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 10px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select CPU</label>
              <select id="pc-cpu-select" class="select-input" style="width:100%;">
                ${cpus.slice(0, 30).map(c => `<option value="${c.tdp || 65}">${c.shortName || c.name} (${c.tdp || 65}W)</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select GPU</label>
              <select id="pc-gpu-select" class="select-input" style="width:100%;">
                ${gpus.slice(0, 30).map(g => `<option value="${g.power || 200}">${g.shortName || g.name} (${g.power || 200}W)</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select PSU</label>
              <select id="pc-psu-select" class="select-input" style="width:100%;">
                ${psus.map(p => `<option value="${p.wattage}">${p.shortName || p.name} (${p.wattage}W)</option>`).join('')}
              </select>
            </div>
          </div>

          <div id="psu-check-result" style="margin-top: 14px; background: var(--card-bg); padding: 12px 14px; border-radius:8px; border:1px solid var(--border-color); font-size: 0.88rem;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <div class="section-title">
          <span>Power Supply Units (PSUs)</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `;

    this.bindFilterEvents(psus, 'psu');
    this.renderFilteredList(psus, 'psu');
    this.bindPsuCheckerEvents();
    this.updateCompareBadge();
  }

  bindPsuCheckerEvents() {
    const cpuEl = document.getElementById('pc-cpu-select');
    const gpuEl = document.getElementById('pc-gpu-select');
    const psuEl = document.getElementById('pc-psu-select');
    const resEl = document.getElementById('psu-check-result');

    const updateCheck = () => {
      if (!resEl) return;
      const cpuPower = parseInt(cpuEl?.value || 105, 10);
      const gpuPower = parseInt(gpuEl?.value || 250, 10);
      const psuWattage = parseInt(psuEl?.value || 650, 10);

      const systemEst = cpuPower + gpuPower + 80; // 80W overhead for motherboard, fans, RAM, SSD
      const recommended = Math.ceil((systemEst * 1.3) / 50) * 50;
      const isSuitable = psuWattage >= recommended;

      resEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
          <span>Estimated System Power: <strong>${systemEst} W</strong></span>
          <span>Recommended PSU: <strong>${recommended} W+</strong></span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top: 8px; font-weight: 700;">
          <span>PSU Status:</span>
          <span style="color:${isSuitable ? '#4ade80' : '#ef4444'};">
            ${isSuitable ? '✅ Suitable (' + psuWattage + 'W provided)' : '❌ Insufficient (' + psuWattage + 'W provided, need ' + recommended + 'W+)'}
          </span>
        </div>
      `;
    };

    [cpuEl, gpuEl, psuEl].forEach(el => el?.addEventListener('change', updateCheck));
    updateCheck();
  }

  async renderComparePage() {
    this.updateActiveNav('compare');
    const cat = this.currentCategory || 'gpu';
    const ids = comparisonManager.getIds(cat);
    const allHardware = await db.loadCategory(cat);
    const items = allHardware.filter(g => ids.includes(g.id));

    this.appElement.innerHTML = renderComparisonPage(items, cat);
    this.updateCompareBadge();

    const clearBtn = document.getElementById('clear-compare-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        comparisonManager.clear(cat);
        this.renderComparePage();
      });
    }
  }

  renderSettingsPage() {
    this.updateActiveNav('settings');
    const isDark = localStorage.getItem('benchviger_theme') !== 'light';

    this.appElement.innerHTML = `
      <div class="container" style="padding-top: 16px;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px;">App Settings & Preferences</h1>

        <div class="chart-card" style="margin-bottom: 16px;">
          <div class="chart-header">Appearance Theme</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 10px;">
            <span>Theme Mode</span>
            <button id="toggle-theme-btn" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-primary); padding:6px 14px; border-radius:6px; font-weight:600; cursor:pointer; transition:all 0.2s;">
              ${isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            </button>
          </div>
        </div>

        <div class="chart-card" style="margin-bottom: 16px;">
          <div class="chart-header">Storage & Data Reset</div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top: 10px;">
            <button id="reset-compare-all-btn" style="background:transparent; border:1px solid #ef4444; color:#ef4444; padding:8px 12px; border-radius:6px; font-weight:600; cursor:pointer; text-align:left;">
              🗑️ Clear All Comparison Queues
            </button>
            <button id="reset-prefs-btn" style="background:transparent; border:1px solid var(--border-color); color:var(--text-muted); padding:8px 12px; border-radius:6px; font-weight:600; cursor:pointer; text-align:left;">
              🔄 Reset Local Preferences & Cache
            </button>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">BenchVIGER Info</div>
          <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; margin-top: 6px;">
            <div>Version: <strong>1.5.0-offline</strong></div>
            <div>Mode: <strong>100% Offline Capable (PWA / Android Ready)</strong></div>
            <div>Databases: <strong>GPU (107), CPU (124), Phones (70), RAM (7), SSD (7), PSU (7)</strong></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('toggle-theme-btn')?.addEventListener('click', () => {
      const newTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('benchviger_theme', newTheme);
      document.body.classList.toggle('light-theme', newTheme === 'light');
      this.renderSettingsPage();
    });

    document.getElementById('reset-compare-all-btn')?.addEventListener('click', () => {
      comparisonManager.clearAll();
      this.updateCompareBadge();
      alert('All comparison queues cleared.');
    });

    document.getElementById('reset-prefs-btn')?.addEventListener('click', () => {
      localStorage.clear();
      alert('Local preferences reset to default.');
      window.location.reload();
    });
  }

  renderCategoryPage(categoryName) {
    this.updateActiveNav(categoryName);
    this.appElement.innerHTML = renderComingSoon(categoryName.toUpperCase());
    this.updateCompareBadge();
  }

  updateActiveNav(navId) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === navId);
    });

    document.querySelectorAll('.cat-chip').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-cat') === navId);
    });
  }

  bindGlobalEvents() {
    document.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-cat');
        if (cat === 'gpu') {
          window.location.hash = '#/gpu';
        } else {
          window.location.hash = `#/category/${cat}`;
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
