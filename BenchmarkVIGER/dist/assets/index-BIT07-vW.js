var e = Object.defineProperty, t = (t, n) => { let r = {}; for (var i in t) e(r, i, { get: t[i], enumerable: !0 }); return n || e(r, Symbol.toStringTag, { value: `Module` }), r }; (function () { let e = document.createElement(`link`).relList; if (e && e.supports && e.supports(`modulepreload`)) return; for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e); new MutationObserver(e => { for (let t of e) if (t.type === `childList`) for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e) }).observe(document, { childList: !0, subtree: !0 }); function t(e) { let t = {}; return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), t.credentials = e.crossOrigin === `use-credentials` ? `include` : e.crossOrigin === `anonymous` ? `omit` : `same-origin`, t } function n(e) { if (e.ep) return; e.ep = !0; let n = t(e); fetch(e.href, n) } })(); var n = new class { constructor() { this.cache = new Map } async loadCategory(e = `gpu`) { if (this.cache.has(e)) return this.cache.get(e); try { let t = await fetch(`./src/data/${e}.json`); if (!t.ok) throw Error(`HTTP error! status: ${t.status}`); let n = await t.json(); return this.cache.set(e, n), n } catch (t) { console.warn(`Failed to fetch category '${e}' relative to root. Attempting fallback...`, t); try { let t = await (await fetch(`../src/data/${e}.json`)).json(); return this.cache.set(e, t), t } catch (t) { return console.error(`Database error loading ${e}:`, t), [] } } } async getItemById(e, t) { return (await this.loadCategory(e)).find(e => e.id === t) || null } }, r = new class { constructor() { this.searchQuery = ``, this.manufacturer = `ALL`, this.vramMin = 0, this.coresMin = 0, this.socket = `ALL`, this.scoreRange = `ALL`, this.generation = `ALL`, this.sortBy = `score-desc` } setSearchQuery(e) { this.searchQuery = (e || ``).trim().toLowerCase() } setManufacturer(e) { this.manufacturer = e } setVramMin(e) { this.vramMin = parseInt(e, 10) || 0 } setCoresMin(e) { this.coresMin = parseInt(e, 10) || 0 } setSocket(e) { this.socket = e } setScoreRange(e) { this.scoreRange = e } setGeneration(e) { this.generation = e } setSortBy(e) { this.sortBy = e } reset() { this.searchQuery = ``, this.manufacturer = `ALL`, this.vramMin = 0, this.coresMin = 0, this.socket = `ALL`, this.scoreRange = `ALL`, this.generation = `ALL`, this.sortBy = `score-desc` } apply(e) { return Array.isArray(e) ? e.filter(e => { if (this.searchQuery) { let t = (e.name || ``).toLowerCase().includes(this.searchQuery), n = (e.shortName || ``).toLowerCase().includes(this.searchQuery), r = (e.architecture || ``).toLowerCase().includes(this.searchQuery), i = (e.manufacturer || ``).toLowerCase().includes(this.searchQuery), a = (e.socket || ``).toLowerCase().includes(this.searchQuery), o = (e.soc || ``).toLowerCase().includes(this.searchQuery); if (!t && !n && !r && !i && !a && !o) return !1 } if (this.manufacturer !== `ALL` && (e.manufacturer || ``).toUpperCase() !== this.manufacturer.toUpperCase() || this.vramMin > 0 && (e.vram || 0) < this.vramMin || this.coresMin > 0 && (e.cores || 0) < this.coresMin || this.socket !== `ALL` && e.socket !== this.socket) return !1; let t = e.scores?.overall || e.score || 0; if (this.scoreRange === `0-25` && !(t >= 0 && t <= 25) || this.scoreRange === `25-50` && !(t > 25 && t <= 50) || this.scoreRange === `50-75` && !(t > 50 && t <= 75) || this.scoreRange === `75-100` && !(t > 75 && t <= 100)) return !1; let n = e.releaseYear || 0; return !(this.generation === `2025+` && n < 2025 || this.generation === `2023-2024` && !(n >= 2023 && n <= 2024) || this.generation === `2021-2022` && !(n >= 2021 && n <= 2022) || this.generation === `legacy` && n > 2020) }).sort((e, t) => { let n = e.scores?.overall || e.score || 0, r = t.scores?.overall || t.score || 0, i = e.vram || 0, a = t.vram || 0, o = e.cores || 0, s = t.cores || 0, c = e.releaseYear || 0, l = t.releaseYear || 0, u = e.msrp || 99999, d = t.msrp || 99999; switch (this.sortBy) { case `score-asc`: return n - r; case `vram-desc`: return a - i; case `vram-asc`: return i - a; case `cores-desc`: return s - o; case `year-desc`: return l - c; case `year-asc`: return c - l; case `price-asc`: return u - d; default: return r - n } }) : [] } }, i = new class { constructor() { this.category = `gpu`, this.selectedIdsMap = new Map, this.loadFromStorage() } setCategory(e = `gpu`) { this.category = e } getSet(e = this.category) { return this.selectedIdsMap.has(e) || this.selectedIdsMap.set(e, new Set), this.selectedIdsMap.get(e) } loadFromStorage() { try { [`gpu`, `cpu`, `phones`, `ssd`, `ram`, `psu`].forEach(e => { let t = localStorage.getItem(`compare_${e}_ids`); if (t) { let n = JSON.parse(t); this.selectedIdsMap.set(e, new Set(n)) } }) } catch (e) { console.error(`Failed to load comparison state`, e) } } clearAll() { [`gpu`, `cpu`, `phones`, `ssd`, `ram`, `psu`].forEach(e => { this.clear(e) }) } saveToStorage(e = this.category) { try { let t = this.getSet(e); localStorage.setItem(`compare_${e}_ids`, JSON.stringify(Array.from(t))) } catch (e) { console.error(`Failed to save comparison state`, e) } } toggle(e, t = this.category) { let n = this.getSet(t); if (n.has(e)) n.delete(e); else { if (n.size >= 4) return alert(`You can compare up to 4 devices simultaneously.`), !1; n.add(e) } return this.saveToStorage(t), !0 } has(e, t = this.category) { return this.getSet(t).has(e) } remove(e, t = this.category) { this.getSet(t).delete(e), this.saveToStorage(t) } clear(e = this.category) { this.getSet(e).clear(), this.saveToStorage(e) } getIds(e = this.category) { return Array.from(this.getSet(e)) } getCount(e = this.category) { return this.getSet(e).size } }, a = class { constructor(e = {}) { this.routes = e, this.currentRoute = ``, window.addEventListener(`hashchange`, () => this.handleRoute()) } init() { this.handleRoute() } handleRoute() { let e = window.location.hash || `#/gpu`; this.currentRoute = e; let t = e.replace(`#/`, ``).split(`/`), n = t[0] || `gpu`, r = t[1] || null; this.routes[n] ? this.routes[n](r) : this.routes.gpu && this.routes.gpu() } navigate(e) { window.location.hash = e } }; function o(e, t) { if (!t || t <= 0 || !e) return { stars: `☆☆☆☆☆`, starCount: 0, ratio: 0, label: `N/A` }; let n = e / t * 100, r = 1, i = `Low Value`; return n >= 11 ? (r = 5, i = `Exceptional Value`) : n >= 8.5 ? (r = 4, i = `Great Value`) : n >= 6.5 ? (r = 3, i = `Fair Value`) : n >= 4.5 ? (r = 2, i = `Premium Price`) : (r = 1, i = `Enthusiast Flagship`), { stars: `★`.repeat(r) + `☆`.repeat(5 - r), starCount: r, ratio: parseFloat(n.toFixed(2)), label: i } } function s(e) { return e >= 75 ? `badge-ultra` : e >= 50 ? `badge-high` : e >= 25 ? `badge-mid` : `badge-entry` } var c = t({ renderComingSoon: () => m, renderComparisonPage: () => p, renderCpuDetails: () => d, renderGpuDetails: () => f, renderHardwareCard: () => l, renderPhoneDetails: () => u }); function l(e, t = `gpu`) {
  let n = i.has(e.id, t), r = e && e.scores && typeof e.scores.overall == `number` ? e.scores.overall : typeof e.score == `number` ? e.score : 0, a = Math.max(0, Math.min(100, r)), c = r < 15, l = o(r, e.msrp), u = s(r), d = u.replace(`badge-`, `fill-`), f = `vendor-nvidia`, p = (e.manufacturer || ``).toLowerCase(); p.includes(`amd`) && (f = `vendor-amd`), p.includes(`intel`) && (f = `vendor-intel`); let m = `#/${t}/${e.id}`; return t === `ram` ? `
      <div class="gpu-card ${c ? `gpu-card-compact` : ``}" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper">
            <div class="gpu-vendor-tag vendor-intel">${e.generation} Memory</div>
            <div class="gpu-name">${e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.capacity} GB</span>
          <span class="spec-chip">${e.speed} MHz</span>
          <span class="spec-chip">${e.modules}x Module${e.modules > 1 ? `s` : ``}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${l.label}">
            <span style="color:var(--text-muted)">Speed Tier:</span>
            <span class="star-rating">${l.stars}</span>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="ram">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: t === `ssd` ? `
      <div class="gpu-card ${c ? `gpu-card-compact` : ``}" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${f}">${e.manufacturer} • ${e.pcieGen}</div>
            <div class="gpu-name">${e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.capacity}</span>
          <span class="spec-chip">Read: ${e.readSpeed} MB/s</span>
          <span class="spec-chip">Write: ${e.writeSpeed} MB/s</span>
          <span class="spec-chip">$${e.msrp || `N/A`}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${l.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${l.stars}</span>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="ssd">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: t === `psu` ? `
      <div class="gpu-card ${c ? `gpu-card-compact` : ``}" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${f}">${e.manufacturer} • ${e.efficiency}</div>
            <div class="gpu-name">${e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.wattage} W</span>
          <span class="spec-chip">${e.modularity}</span>
          <span class="spec-chip">${e.atxVersion}</span>
          <span class="spec-chip">$${e.msrp || `N/A`}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${l.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${l.stars}</span>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="psu">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: t === `phones` ? `
      <div class="gpu-card ${c ? `gpu-card-compact` : ``}" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${f}">${e.manufacturer} • ${e.soc}</div>
            <div class="gpu-name">${e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.ram} GB RAM</span>
          <span class="spec-chip">${e.display}</span>
          <span class="spec-chip">${e.refreshRate} Hz</span>
          <span class="spec-chip">$${e.msrp || `N/A`}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${l.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${l.stars}</span>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="phones">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: t === `cpu` ? `
      <div class="gpu-card ${c ? `gpu-card-compact` : ``}" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${f}">${e.manufacturer} • ${e.architecture || ``}</div>
            <div class="gpu-name">${e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.cores}C / ${e.threads}T</span>
          <span class="spec-chip">${e.boostClock}</span>
          <span class="spec-chip">${e.socket}</span>
          <span class="spec-chip">$${e.msrp || `N/A`}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${l.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${l.stars}</span>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="cpu">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: c ? `
      <div class="gpu-card gpu-card-compact" id="card-${e.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${f}">${e.manufacturer}</div>
            <div class="gpu-name">${e.shortName || e.name}</div>
          </div>
          <div class="score-pill ${u}">${r}</div>
        </div>
        <div class="gpu-spec-row">
          <span class="spec-chip">${e.vram} GB ${e.memoryType}</span>
          <span class="spec-chip">${e.releaseYear}</span>
        </div>
        <div class="chart-bar-track" style="margin: 4px 0 8px 0;">
          <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
        </div>
        <div class="card-actions">
          <span class="value-box" title="${l.label}">
            <span class="star-rating">${l.stars}</span>
          </span>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="gpu">
            ${n ? `✓ Added` : `+ Compare`}
          </button>
        </div>
      </div>
    `: `
    <div class="gpu-card" id="card-${e.id}">
      <div class="gpu-card-header">
        <div class="gpu-name-wrapper" onclick="window.location.hash='${m}'" style="cursor:pointer;">
          <div class="gpu-vendor-tag ${f}">${e.manufacturer} • ${e.architecture}</div>
          <div class="gpu-name">${e.name}</div>
        </div>
        <div class="score-pill ${u}">${r}</div>
      </div>
      
      <div class="gpu-spec-row">
        <span class="spec-chip">${e.vram} GB ${e.memoryType}</span>
        <span class="spec-chip">${e.memoryBus}-bit</span>
        <span class="spec-chip">${e.power}W</span>
        <span class="spec-chip">$${e.msrp || `N/A`}</span>
      </div>

      <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
        <div class="chart-bar-fill ${d}" style="width: ${a}%"></div>
      </div>

      <div class="card-actions">
        <div class="value-box" title="${l.label}">
          <span style="color:var(--text-muted)">Value:</span>
          <span class="star-rating">${l.stars}</span>
        </div>
        <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="gpu">
          ${n ? `✓ Added` : `+ Compare`}
        </button>
      </div>
    </div>
  `} function u(e) {
  let t = e.scores?.overall || e.score || 0, n = o(t, e.msrp), r = i.has(e.id, `phones`), a = `vendor-nvidia`, s = (e.manufacturer || ``).toLowerCase(); return s.includes(`apple`) && (a = `vendor-intel`), s.includes(`samsung`) && (a = `vendor-amd`), `
    <div class="container" style="padding-top: 16px;">
      <a href="#/category/phones" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to Phones
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${a}" style="font-size: 0.85rem;">${e.manufacturer} • ${e.soc}</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${e.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Hardware Performance Index</div>
            <div class="huge-score" style="color: var(--text-primary);">${t} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${r ? `selected` : ``}" data-id="${e.id}" data-cat="phones" style="padding: 8px 16px; font-size: 0.85rem;">
            ${r ? `✓ In Comparison` : `+ Compare Device`}
          </button>
        </div>
      </div>

      <h3 class="section-title">Device Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">Chipset (SoC)</div>
          <div class="spec-tile-value">${e.soc}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">RAM</div>
          <div class="spec-tile-value">${e.ram} GB</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Storage Options</div>
          <div class="spec-tile-value">${Array.isArray(e.storage) ? e.storage.join(` / `) + ` GB` : e.storage}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Display</div>
          <div class="spec-tile-value">${e.display}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Refresh Rate</div>
          <div class="spec-tile-value">${e.refreshRate} Hz</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Battery</div>
          <div class="spec-tile-value">${e.battery} mAh</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Main Camera</div>
          <div class="spec-tile-value">${e.mainCamera}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Weight</div>
          <div class="spec-tile-value">${e.weight} g</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${e.releaseYear}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Launch MSRP</div>
          <div class="spec-tile-value">$${e.msrp || `N/A`}</div>
        </div>
      </div>

      ${e.msrp ? `
        <div class="chart-card">
          <div class="chart-header">
            <span>Price / Performance Rating</span>
            <span class="star-rating" style="font-size: 1rem;">${n.stars}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            Value Index: <strong>${n.ratio}</strong> pts / $100 — <em>${n.label}</em>
          </div>
        </div>
      `: ``}

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Geekbench 6 Multi-Core</span>
            <strong style="color:var(--text-primary)">${e.benchmarks?.geekbench6Multi ? e.benchmarks.geekbench6Multi.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Geekbench 6 Single-Core</span>
            <strong style="color:var(--text-primary)">${e.benchmarks?.geekbench6Single ? e.benchmarks.geekbench6Single.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">AnTuTu 10 Score</span>
            <strong style="color:var(--text-primary)">${e.benchmarks?.antutu10 ? e.benchmarks.antutu10.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
        </div>
      </div>

      ${e.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${e.benchmarkSource.sourceName}</strong> (${e.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${e.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${e.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      `: ``}
    </div>
  `} function d(e) {
  let t = e.scores?.overall || e.score || 0, n = o(t, e.msrp), r = i.has(e.id, `cpu`), a = `vendor-intel`; return (e.manufacturer || ``).toLowerCase().includes(`amd`) && (a = `vendor-amd`), `
    <div class="container" style="padding-top: 16px;">
      <a href="#/category/cpu" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to CPUs
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${a}" style="font-size: 0.85rem;">${e.manufacturer} • ${e.architecture || ``} Architecture</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${e.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">CPU Performance Index</div>
            <div class="huge-score" style="color: var(--text-primary);">${t} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${r ? `selected` : ``}" data-id="${e.id}" data-cat="cpu" style="padding: 8px 16px; font-size: 0.85rem;">
            ${r ? `✓ In Comparison` : `+ Compare Processor`}
          </button>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Performance Breakdown</span>
          <span style="font-size:0.75rem; color:var(--text-muted)">Relative CPU Index</span>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Multi-Core Performance</span>
            <span>${e.scores?.multiCore || t} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-high" style="width: ${e.scores?.multiCore || t}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Single-Core Performance</span>
            <span>${e.scores?.singleCore || t} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-ultra" style="width: ${e.scores?.singleCore || t}%"></div>
          </div>
        </div>
      </div>

      <h3 class="section-title">Processor Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">Cores / Threads</div>
          <div class="spec-tile-value">${e.cores}C / ${e.threads}T</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Base Clock</div>
          <div class="spec-tile-value">${e.baseClock}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Boost Clock</div>
          <div class="spec-tile-value">${e.boostClock}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Total Cache</div>
          <div class="spec-tile-value">${e.cache}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">TDP (Power)</div>
          <div class="spec-tile-value">${e.tdp} W</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Socket</div>
          <div class="spec-tile-value">${e.socket}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Process Node</div>
          <div class="spec-tile-value">${e.processNode}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">iGPU Included</div>
          <div class="spec-tile-value">${e.integratedGraphics ? `Yes` : `No (F-series)`}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${e.releaseYear}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">MSRP Price</div>
          <div class="spec-tile-value">$${e.msrp || `N/A`}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Price / Performance Rating</span>
          <span class="star-rating" style="font-size: 1rem;">${n.stars}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Value Index: <strong>${n.ratio}</strong> pts / $100 — <em>${n.label}</em>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Cinebench R23 (Multi-Core)</span>
            <strong style="color:var(--text-primary)">${e.benchmarks?.cinebenchR23Multi ? e.benchmarks.cinebenchR23Multi.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">Cinebench R23 (Single-Core)</span>
            <strong style="color:var(--text-primary)">${e.benchmarks?.cinebenchR23Single ? e.benchmarks.cinebenchR23Single.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
        </div>
      </div>

      ${e.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${e.benchmarkSource.sourceName}</strong> (${e.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${e.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${e.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      `: ``}
    </div>
  `} function f(e) {
  let t = o(e.scores.overall, e.msrp); e.scores.overall; let n = i.has(e.id, `gpu`), r = `vendor-nvidia`; return e.manufacturer.toLowerCase().includes(`amd`) && (r = `vendor-amd`), e.manufacturer.toLowerCase().includes(`intel`) && (r = `vendor-intel`), `
    <div class="container" style="padding-top: 16px;">
      <a href="#/gpu" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to GPUs
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${r}" style="font-size: 0.85rem;">${e.manufacturer} • ${e.architecture} Architecture</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${e.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Performance Score</div>
            <div class="huge-score" style="color: var(--text-primary);">${e.scores.overall} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${n ? `selected` : ``}" data-id="${e.id}" data-cat="gpu" style="padding: 8px 16px; font-size: 0.85rem;">
            ${n ? `✓ In Comparison` : `+ Compare Device`}
          </button>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Performance Breakdown</span>
          <span style="font-size:0.75rem; color:var(--text-muted)">Normalized baseline</span>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Gaming Performance</span>
            <span>${e.scores.gaming} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-high" style="width: ${e.scores.gaming}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Ray Tracing</span>
            <span>${e.scores.rayTracing} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-ultra" style="width: ${e.scores.rayTracing}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Productivity & Compute</span>
            <span>${e.scores.productivity} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-mid" style="width: ${e.scores.productivity}%"></div>
          </div>
        </div>
      </div>

      <h3 class="section-title">Hardware Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">VRAM Capacity</div>
          <div class="spec-tile-value">${e.vram} GB</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Memory Type</div>
          <div class="spec-tile-value">${e.memoryType}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Memory Bus</div>
          <div class="spec-tile-value">${e.memoryBus}-bit</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Power (TDP)</div>
          <div class="spec-tile-value">${e.power} W</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${e.releaseYear} ${e.releaseQuarter || ``}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">MSRP Price</div>
          <div class="spec-tile-value">$${e.msrp || `N/A`}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Price / Performance Rating</span>
          <span class="star-rating" style="font-size: 1rem;">${t.stars}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Value Index: <strong>${t.ratio}</strong> pts / $100 — <em>${t.label}</em>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">3DMark Time Spy Extreme</span>
            <strong style="color:var(--text-primary)">${e.benchmarks.timeSpyExtreme ? e.benchmarks.timeSpyExtreme.toLocaleString() + ` pts` : `N/A`}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Cyberpunk 2077 (4K Ultra FPS)</span>
            <strong style="color:var(--text-primary)">${e.benchmarks.cyberpunk4kUltra ? e.benchmarks.cyberpunk4kUltra + ` FPS` : `N/A`}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">Blender Render Time</span>
            <strong style="color:var(--text-primary)">${e.benchmarks.blenderRenderSec ? e.benchmarks.blenderRenderSec + ` sec` : `N/A`}</strong>
          </div>
        </div>
      </div>

      ${e.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${e.benchmarkSource.sourceName}</strong> (${e.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${e.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${e.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      `: ``}
    </div>
  `} function p(e, t = `gpu`) {
  let n = t.toUpperCase(); if (!e || e.length === 0) return `
      <div class="container" style="padding-top: 32px; text-align: center;">
        <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:8px;">No ${n}s Selected</h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:20px;">
          Select 2 or more ${n} devices from the database list to perform side-by-side spec and benchmark comparisons.
        </p>
        <a href="#/${t === `gpu` ? `gpu` : `category/` + t}" class="compare-btn-primary" style="display:inline-block; text-decoration:none;">
          Browse ${n} Database
        </a>
      </div>
    `; let r = t === `cpu`; return `
    <div class="container" style="padding-top: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h1 style="font-size: 1.4rem; font-weight: 800;">${n} Hardware Comparison</h1>
        <button id="clear-compare-btn" data-cat="${t}" style="background:transparent; border:1px solid #ef4444; color:#ef4444; padding:4px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer;">
          Clear All
        </button>
      </div>

      <!-- Overall Performance Chart -->
      <div class="chart-card">
        <div class="chart-header">Overall Performance Score</div>
        ${e.map(e => {
    let t = e.scores?.overall || e.score || 0, n = Math.max(0, Math.min(100, t)); return `
            <div class="compare-chart-row">
              <div class="compare-item-name">${e.shortName || e.name} (${e.manufacturer})</div>
              <div class="compare-bar-container">
                <div class="chart-bar-track" style="flex:1;">
                  <div class="chart-bar-fill fill-high" style="width: ${n}%"></div>
                </div>
                <div class="compare-value-num">${t}</div>
              </div>
            </div>
          `}).join(``)}
      </div>

      <!-- Specifications Table -->
      <div class="chart-card" style="overflow-x: auto;">
        <div class="chart-header">Detailed Specs</div>
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
              <th style="padding:8px 4px; color:var(--text-muted);">Spec</th>
              ${e.map(e => `<th style="padding:8px 4px; color:var(--text-primary);">${e.shortName || e.name}</th>`).join(``)}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:8px 4px; color:var(--text-secondary);">Score</td>
              ${e.map(e => `<td style="padding:8px 4px; font-weight:bold;">${e.scores?.overall || e.score || 0} / 100</td>`).join(``)}
            </tr>
            ${t === `ram` ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Capacity</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.capacity} GB</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Generation</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.generation}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Speed</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.speed} MHz</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Modules</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.modules}x Stick</td>`).join(``)}
              </tr>
            `: t === `ssd` ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Capacity</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.capacity}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Interface / Gen</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.pcieGen}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Read Speed</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.readSpeed} MB/s</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Write Speed</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.writeSpeed} MB/s</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Endurance</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.endurance}</td>`).join(``)}
              </tr>
            `: t === `psu` ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Wattage</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.wattage} W</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Efficiency</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.efficiency}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Modularity</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.modularity}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">ATX Spec</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.atxVersion}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Protections</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.protections}</td>`).join(``)}
              </tr>
            `: t === `phones` ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Chipset (SoC)</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.soc}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">RAM</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.ram} GB</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Display</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.display} @ ${e.refreshRate}Hz</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Battery</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.battery} mAh</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Camera</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.mainCamera}</td>`).join(``)}
              </tr>
            `: r ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Cores / Threads</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.cores}C / ${e.threads}T</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Base Clock</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.baseClock}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Boost Clock</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.boostClock}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Cache</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.cache}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Socket</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.socket}</td>`).join(``)}
              </tr>
            `: `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">VRAM</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.vram} GB</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Memory Type</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.memoryType}</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Bus Width</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.memoryBus}-bit</td>`).join(``)}
              </tr>
            `}
            ${t === `gpu` || t === `cpu` ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">TDP (Power)</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.power || e.tdp} W</td>`).join(``)}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Architecture</td>
                ${e.map(e => `<td style="padding:8px 4px;">${e.architecture}</td>`).join(``)}
              </tr>
            `: ``}
            <tr>
              <td style="padding:8px 4px; color:var(--text-secondary);">MSRP</td>
              ${e.map(e => `<td style="padding:8px 4px; color:#60a5fa;">$${e.msrp || `N/A`}</td>`).join(``)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `} function m(e) {
  return `
    <div class="container" style="padding-top: 40px; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">🚀</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">${e} Database</h2>
      <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px auto; font-size: 0.9rem;">
        The architecture is fully prepared for ${e}. Verified hardware specs and benchmark metrics will be enabled in the upcoming dataset sync!
      </p>
      <a href="#/gpu" class="compare-btn-primary" style="display:inline-block; text-decoration:none;">
        Explore GPU Benchmarks
      </a>
    </div>
  `} var h = `modulepreload`, g = function (e, t) { return new URL(e, t).href }, _ = {}, v = function (e, t, n) { let r = Promise.resolve(); if (t && t.length > 0) { let e = document.getElementsByTagName(`link`), i = document.querySelector(`meta[property=csp-nonce]`), a = i?.nonce || i?.getAttribute(`nonce`); function o(e) { return Promise.all(e.map(e => Promise.resolve(e).then(e => ({ status: `fulfilled`, value: e }), e => ({ status: `rejected`, reason: e })))) } function s(e) { return import.meta.resolve ? import.meta.resolve(e) : new URL(e, import.meta.url).href } r = o(t.map(t => { if (t = g(t, n), t = s(t), t in _) return; _[t] = !0; let r = t.endsWith(`.css`); for (let n = e.length - 1; n >= 0; n--) { let i = e[n]; if (i.href === t && (!r || i.rel === `stylesheet`)) return } let i = document.createElement(`link`); if (i.rel = r ? `stylesheet` : h, r || (i.as = `script`), i.crossOrigin = ``, i.href = t, a && i.setAttribute(`nonce`, a), document.head.appendChild(i), r) return new Promise((e, n) => { i.addEventListener(`load`, e), i.addEventListener(`error`, () => n(Error(`Unable to preload CSS for ${t}`))) }) })) } function i(e) { let t = new Event(`vite:preloadError`, { cancelable: !0 }); if (t.payload = e, window.dispatchEvent(t), !t.defaultPrevented) throw e } return r.then(t => { for (let e of t || []) e.status === `rejected` && i(e.reason); return e().catch(i) }) }, y = class {
  constructor() { this.appElement = document.getElementById(`app-content`), this.floatingBar = document.getElementById(`floating-compare`), this.compareCountBadge = document.getElementById(`compare-badge-count`), this.floatingCountBadge = document.getElementById(`floating-count`), this.currentCategory = `gpu`, (localStorage.getItem(`benchviger_theme`) || `dark`) === `light` ? document.body.classList.add(`light-theme`) : document.body.classList.remove(`light-theme`), this.initRouter(), this.bindGlobalEvents() } initRouter() { this.router = new a({ gpu: e => { this.currentCategory = `gpu`, i.setCategory(`gpu`), e ? this.renderGpuDetailPage(e) : this.renderGpuListPage() }, cpu: e => { this.currentCategory = `cpu`, i.setCategory(`cpu`), e ? this.renderCpuDetailPage(e) : this.renderCpuListPage() }, phones: e => { this.currentCategory = `phones`, i.setCategory(`phones`), e ? this.renderPhoneDetailPage(e) : this.renderPhoneListPage() }, ram: () => { this.currentCategory = `ram`, i.setCategory(`ram`), this.renderRamListPage() }, ssd: () => { this.currentCategory = `ssd`, i.setCategory(`ssd`), this.renderSsdListPage() }, psu: () => { this.currentCategory = `psu`, i.setCategory(`psu`), this.renderPsuListPage() }, settings: () => this.renderSettingsPage(), compare: () => this.renderComparePage(), category: (e, t) => { [`gpu`, `cpu`, `phones`, `ram`, `ssd`, `psu`].includes(e) ? (this.currentCategory = e, i.setCategory(e), e === `gpu` ? this.renderGpuListPage() : e === `cpu` ? this.renderCpuListPage() : e === `phones` ? this.renderPhoneListPage() : e === `ram` ? this.renderRamListPage() : e === `ssd` ? this.renderSsdListPage() : e === `psu` && this.renderPsuListPage()) : (this.currentCategory = e, this.renderCategoryPage(e)) } }), this.router.init() } updateCompareBadge() { let e = i.getCount(this.currentCategory); this.compareCountBadge && (this.compareCountBadge.textContent = e, this.compareCountBadge.style.display = e > 0 ? `flex` : `none`), this.floatingCountBadge && (this.floatingCountBadge.textContent = e), this.floatingBar && (this.floatingBar.style.display = e > 0 ? `flex` : `none`) } async renderGpuListPage() {
    this.updateActiveNav(`gpu`), r.reset(); let e = await n.loadCategory(`gpu`); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search GPUs (e.g. 5090, 9070, B580, 3060, 1070)..." value="${r.searchQuery}">
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
    `, this.bindFilterEvents(e, `gpu`), this.renderFilteredList(e, `gpu`), this.updateCompareBadge()
  } async renderCpuListPage() {
    this.updateActiveNav(`cpu`), r.reset(); let e = await n.loadCategory(`cpu`); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search CPUs (e.g. 7800X3D, 14900K, 12400F, 5700X3D)..." value="${r.searchQuery}">
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
    `, this.bindFilterEvents(e, `cpu`), this.renderFilteredList(e, `cpu`), this.updateCompareBadge()
  } renderFilteredList(e, t = `gpu`) {
    let n = document.getElementById(`gpu-grid-container`), i = document.getElementById(`results-count`); if (!n) return; let a = r.apply(e); if (i && (i.textContent = `${a.length} devices`), a.length === 0) {
      n.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 32px 0; color: var(--text-muted);">
          No matching hardware found for your search criteria.
        </div>
      `; return
    } n.innerHTML = a.map(e => l(e, t)).join(``), this.bindCompareButtons(t)
  } bindFilterEvents(e, t = `gpu`) { let n = document.getElementById(`search-input`), i = document.getElementById(`filter-vendor`), a = document.getElementById(`filter-vram`), o = document.getElementById(`filter-cores`), s = document.getElementById(`filter-socket`), c = document.getElementById(`filter-score`), l = document.getElementById(`filter-sort`); n && n.addEventListener(`input`, n => { r.setSearchQuery(n.target.value), this.renderFilteredList(e, t) }), i && i.addEventListener(`change`, n => { r.setManufacturer(n.target.value), this.renderFilteredList(e, t) }), a && a.addEventListener(`change`, n => { r.setVramMin(n.target.value), this.renderFilteredList(e, t) }), o && o.addEventListener(`change`, n => { r.setCoresMin(n.target.value), this.renderFilteredList(e, t) }), s && s.addEventListener(`change`, n => { r.setSocket(n.target.value), this.renderFilteredList(e, t) }), c && c.addEventListener(`change`, n => { r.setScoreRange(n.target.value), this.renderFilteredList(e, t) }), l && l.addEventListener(`change`, n => { r.setSortBy(n.target.value), this.renderFilteredList(e, t) }) } bindCompareButtons(e = this.currentCategory) { document.querySelectorAll(`.compare-check-btn`).forEach(t => { t.addEventListener(`click`, n => { n.stopPropagation(); let r = t.getAttribute(`data-id`), a = t.getAttribute(`data-cat`) || e; i.toggle(r, a); let o = i.has(r, a); t.classList.toggle(`selected`, o), t.textContent = o ? `✓ Added` : `+ Compare`, this.updateCompareBadge() }) }) } async renderGpuDetailPage(e) {
    this.updateActiveNav(`gpu`); let t = await n.getItemById(`gpu`, e); if (!t) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>GPU Device not found</h2>
          <a href="#/gpu" style="color:#60a5fa; text-decoration:none;">Back to GPUs</a>
        </div>
      `; return
    } this.appElement.innerHTML = f(t), this.bindCompareButtons(`gpu`), this.updateCompareBadge()
  } async renderCpuDetailPage(e) {
    this.updateActiveNav(`cpu`); let t = await n.getItemById(`cpu`, e); if (!t) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>CPU Processor not found</h2>
          <a href="#/category/cpu" style="color:#60a5fa; text-decoration:none;">Back to CPUs</a>
        </div>
      `; return
    } this.appElement.innerHTML = d(t), this.bindCompareButtons(`cpu`), this.updateCompareBadge()
  } async renderPhoneListPage() {
    this.updateActiveNav(`phones`), r.reset(); let e = await n.loadCategory(`phones`); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search Phones (e.g. iPhone 16, S24 Ultra, Pixel 9, OnePlus 13)..." value="${r.searchQuery}">
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
    `, this.bindFilterEvents(e, `phones`), this.renderFilteredList(e, `phones`), this.updateCompareBadge()
  } async renderPhoneDetailPage(e) {
    this.updateActiveNav(`phones`); let t = await n.getItemById(`phones`, e); if (!t) {
      this.appElement.innerHTML = `
        <div class="container" style="padding-top:32px; text-align:center;">
          <h2>Phone not found</h2>
          <a href="#/category/phones" style="color:#60a5fa; text-decoration:none;">Back to Phones</a>
        </div>
      `; return
    } let { renderPhoneDetails: r } = await v(async () => { let { renderPhoneDetails: e } = await Promise.resolve().then(() => c); return { renderPhoneDetails: e } }, void 0, import.meta.url); this.appElement.innerHTML = r(t), this.bindCompareButtons(`phones`), this.updateCompareBadge()
  } async renderRamListPage() {
    this.updateActiveNav(`ram`), r.reset(); let e = await n.loadCategory(`ram`); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search RAM (e.g. DDR5, 32GB, 6000MHz)..." value="${r.searchQuery}">
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
    `, this.bindFilterEvents(e, `ram`), this.renderFilteredList(e, `ram`), this.bindCustomRamEvents(), this.updateCompareBadge()
  } bindCustomRamEvents() { let e = document.getElementById(`custom-ram-cap`), t = document.getElementById(`custom-ram-gen`), n = document.getElementById(`custom-ram-speed`), r = document.getElementById(`custom-ram-mods`), i = document.getElementById(`custom-ram-result`), a = () => { if (!i) return; let a = parseInt(e?.value || 16, 10), o = t?.value || `DDR5`, s = parseInt(n?.value || 5600, 10), c = parseInt(r?.value || 2, 10), l = o === `DDR5` ? s / 75 : s / 90, u = Math.min(a / 2, 25), d = c >= 2 ? 1.15 : .9, f = Math.round(Math.min(100, Math.max(1, (l + u) * d))); i.textContent = `${f} / 100` };[e, t, n, r].forEach(e => e?.addEventListener(`input`, a)) } async renderSsdListPage() {
    this.updateActiveNav(`ssd`), r.reset(); let e = await n.loadCategory(`ssd`); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search SSDs (e.g. 990 PRO, SN850X, PCIe 4.0, 2TB)..." value="${r.searchQuery}">
        </div>

        <div class="section-title">
          <span>Solid State Drives (SSDs)</span>
          <span id="results-count" style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);"></span>
        </div>

        <div id="gpu-grid-container" class="gpu-grid"></div>
      </div>
    `, this.bindFilterEvents(e, `ssd`), this.renderFilteredList(e, `ssd`), this.updateCompareBadge()
  } async renderPsuListPage() {
    this.updateActiveNav(`psu`), r.reset(); let [e, t, i] = await Promise.all([n.loadCategory(`psu`), n.loadCategory(`cpu`), n.loadCategory(`gpu`)]); this.appElement.innerHTML = `
      <div class="container">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon icon-svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search Power Supplies (e.g. RM1000x, 850W, Gold, Seasonic)..." value="${r.searchQuery}">
        </div>

        <!-- PSU System Power Checker -->
        <div class="chart-card" style="margin-bottom: 20px;">
          <div class="chart-header">⚡ PC Power Compatibility Checker</div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 10px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select CPU</label>
              <select id="pc-cpu-select" class="select-input" style="width:100%;">
                ${t.slice(0, 30).map(e => `<option value="${e.tdp || 65}">${e.shortName || e.name} (${e.tdp || 65}W)</option>`).join(``)}
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select GPU</label>
              <select id="pc-gpu-select" class="select-input" style="width:100%;">
                ${i.slice(0, 30).map(e => `<option value="${e.power || 200}">${e.shortName || e.name} (${e.power || 200}W)</option>`).join(``)}
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted);">Select PSU</label>
              <select id="pc-psu-select" class="select-input" style="width:100%;">
                ${e.map(e => `<option value="${e.wattage}">${e.shortName || e.name} (${e.wattage}W)</option>`).join(``)}
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
    `, this.bindFilterEvents(e, `psu`), this.renderFilteredList(e, `psu`), this.bindPsuCheckerEvents(), this.updateCompareBadge()
  } bindPsuCheckerEvents() {
    let e = document.getElementById(`pc-cpu-select`), t = document.getElementById(`pc-gpu-select`), n = document.getElementById(`pc-psu-select`), r = document.getElementById(`psu-check-result`), i = () => {
      if (!r) return; let i = parseInt(e?.value || 105, 10), a = parseInt(t?.value || 250, 10), o = parseInt(n?.value || 650, 10), s = i + a + 80, c = Math.ceil(s * 1.3 / 50) * 50, l = o >= c; r.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
          <span>Estimated System Power: <strong>${s} W</strong></span>
          <span>Recommended PSU: <strong>${c} W+</strong></span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top: 8px; font-weight: 700;">
          <span>PSU Status:</span>
          <span style="color:${l ? `#4ade80` : `#ef4444`};">
            ${l ? `✅ Suitable (` + o + `W provided)` : `❌ Insufficient (` + o + `W provided, need ` + c + `W+)`}
          </span>
        </div>
      `};[e, t, n].forEach(e => e?.addEventListener(`change`, i)), i()
  } async renderComparePage() { this.updateActiveNav(`compare`); let e = this.currentCategory || `gpu`, t = i.getIds(e), r = (await n.loadCategory(e)).filter(e => t.includes(e.id)); this.appElement.innerHTML = p(r, e), this.updateCompareBadge(); let a = document.getElementById(`clear-compare-btn`); a && a.addEventListener(`click`, () => { i.clear(e), this.renderComparePage() }) } renderSettingsPage() {
    this.updateActiveNav(`settings`); let e = localStorage.getItem(`benchviger_theme`) !== `light`; this.appElement.innerHTML = `
      <div class="container" style="padding-top: 16px;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px;">App Settings & Preferences</h1>

        <div class="chart-card" style="margin-bottom: 16px;">
          <div class="chart-header">Appearance Theme</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 10px;">
            <span>Theme Mode</span>
            <button id="toggle-theme-btn" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-primary); padding:6px 14px; border-radius:6px; font-weight:600; cursor:pointer; transition:all 0.2s;">
              ${e ? `☀️ Switch to Light Mode` : `🌙 Switch to Dark Mode`}
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
    `, document.getElementById(`toggle-theme-btn`)?.addEventListener(`click`, () => { let t = e ? `light` : `dark`; localStorage.setItem(`benchviger_theme`, t), document.body.classList.toggle(`light-theme`, t === `light`), this.renderSettingsPage() }), document.getElementById(`reset-compare-all-btn`)?.addEventListener(`click`, () => { i.clearAll(), this.updateCompareBadge(), alert(`All comparison queues cleared.`) }), document.getElementById(`reset-prefs-btn`)?.addEventListener(`click`, () => { localStorage.clear(), alert(`Local preferences reset to default.`), window.location.reload() })
  } renderCategoryPage(e) { this.updateActiveNav(e), this.appElement.innerHTML = m(e.toUpperCase()), this.updateCompareBadge() } updateActiveNav(e) { document.querySelectorAll(`.nav-item`).forEach(t => { t.classList.toggle(`active`, t.getAttribute(`data-nav`) === e) }), document.querySelectorAll(`.cat-chip`).forEach(t => { t.classList.toggle(`active`, t.getAttribute(`data-cat`) === e) }) }
  bindGlobalEvents() { document.querySelectorAll(`.cat-chip`).forEach(e => { e.addEventListener(`click`, () => { let t = e.getAttribute(`data-cat`); t === `gpu` ? window.location.hash = `#/gpu` : window.location.hash = `#/category/${t}` }) }) }
}
document.addEventListener(`DOMContentLoaded`, () => { window.app = new y });