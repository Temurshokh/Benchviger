import { calculateValueRating, getScoreBadgeColorClass } from './scoring.js';
import { comparisonManager } from './comparison.js';

/**
 * Universal Card Renderer for GPU & CPU hardware
 */
export function renderHardwareCard(item, category = 'gpu') {
  const isSelected = comparisonManager.has(item.id, category);
  
  // Extract numerical score safely
  const scoreNum = (item && item.scores && typeof item.scores.overall === 'number') 
    ? item.scores.overall 
    : (typeof item.score === 'number' ? item.score : 0);

  const barWidthPct = Math.max(0, Math.min(100, scoreNum));
  const isCompact = scoreNum < 15;
  const valueInfo = calculateValueRating(scoreNum, item.msrp);
  const badgeClass = getScoreBadgeColorClass(scoreNum);
  const fillClass = badgeClass.replace('badge-', 'fill-');
  
  let vendorClass = 'vendor-nvidia';
  const vendorLower = (item.manufacturer || '').toLowerCase();
  if (vendorLower.includes('amd')) vendorClass = 'vendor-amd';
  if (vendorLower.includes('intel')) vendorClass = 'vendor-intel';

  const detailHash = `#/${category}/${item.id}`;

  if (category === 'ram') {
    return `
      <div class="gpu-card ${isCompact ? 'gpu-card-compact' : ''}" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper">
            <div class="gpu-vendor-tag vendor-intel">${item.generation} Memory</div>
            <div class="gpu-name">${item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.capacity} GB</span>
          <span class="spec-chip">${item.speed} MHz</span>
          <span class="spec-chip">${item.modules}x Module${item.modules > 1 ? 's' : ''}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${valueInfo.label}">
            <span style="color:var(--text-muted)">Speed Tier:</span>
            <span class="star-rating">${valueInfo.stars}</span>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="ram">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  if (category === 'ssd') {
    return `
      <div class="gpu-card ${isCompact ? 'gpu-card-compact' : ''}" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer} • ${item.pcieGen}</div>
            <div class="gpu-name">${item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.capacity}</span>
          <span class="spec-chip">Read: ${item.readSpeed} MB/s</span>
          <span class="spec-chip">Write: ${item.writeSpeed} MB/s</span>
          <span class="spec-chip">$${item.msrp || 'N/A'}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${valueInfo.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${valueInfo.stars}</span>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="ssd">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  if (category === 'psu') {
    return `
      <div class="gpu-card ${isCompact ? 'gpu-card-compact' : ''}" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer} • ${item.efficiency}</div>
            <div class="gpu-name">${item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.wattage} W</span>
          <span class="spec-chip">${item.modularity}</span>
          <span class="spec-chip">${item.atxVersion}</span>
          <span class="spec-chip">$${item.msrp || 'N/A'}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${valueInfo.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${valueInfo.stars}</span>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="psu">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  if (category === 'phones') {
    return `
      <div class="gpu-card ${isCompact ? 'gpu-card-compact' : ''}" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer} • ${item.soc}</div>
            <div class="gpu-name">${item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.ram} GB RAM</span>
          <span class="spec-chip">${item.display}</span>
          <span class="spec-chip">${item.refreshRate} Hz</span>
          <span class="spec-chip">$${item.msrp || 'N/A'}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${valueInfo.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${valueInfo.stars}</span>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="phones">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  if (category === 'cpu') {
    return `
      <div class="gpu-card ${isCompact ? 'gpu-card-compact' : ''}" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer} • ${item.architecture || ''}</div>
            <div class="gpu-name">${item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.cores}C / ${item.threads}T</span>
          <span class="spec-chip">${item.boostClock}</span>
          <span class="spec-chip">${item.socket}</span>
          <span class="spec-chip">$${item.msrp || 'N/A'}</span>
        </div>

        <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>

        <div class="card-actions">
          <div class="value-box" title="${valueInfo.label}">
            <span style="color:var(--text-muted)">Value:</span>
            <span class="star-rating">${valueInfo.stars}</span>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="cpu">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  // GPU default rendering
  if (isCompact) {
    return `
      <div class="gpu-card gpu-card-compact" id="card-${item.id}">
        <div class="gpu-card-header">
          <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
            <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer}</div>
            <div class="gpu-name">${item.shortName || item.name}</div>
          </div>
          <div class="score-pill ${badgeClass}">${scoreNum}</div>
        </div>
        <div class="gpu-spec-row">
          <span class="spec-chip">${item.vram} GB ${item.memoryType}</span>
          <span class="spec-chip">${item.releaseYear}</span>
        </div>
        <div class="chart-bar-track" style="margin: 4px 0 8px 0;">
          <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
        </div>
        <div class="card-actions">
          <span class="value-box" title="${valueInfo.label}">
            <span class="star-rating">${valueInfo.stars}</span>
          </span>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="gpu">
            ${isSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="gpu-card" id="card-${item.id}">
      <div class="gpu-card-header">
        <div class="gpu-name-wrapper" onclick="window.location.hash='${detailHash}'" style="cursor:pointer;">
          <div class="gpu-vendor-tag ${vendorClass}">${item.manufacturer} • ${item.architecture}</div>
          <div class="gpu-name">${item.name}</div>
        </div>
        <div class="score-pill ${badgeClass}">${scoreNum}</div>
      </div>
      
      <div class="gpu-spec-row">
        <span class="spec-chip">${item.vram} GB ${item.memoryType}</span>
        <span class="spec-chip">${item.memoryBus}-bit</span>
        <span class="spec-chip">${item.power}W</span>
        <span class="spec-chip">$${item.msrp || 'N/A'}</span>
      </div>

      <div class="chart-bar-track" style="margin: 6px 0 10px 0;">
        <div class="chart-bar-fill ${fillClass}" style="width: ${barWidthPct}%"></div>
      </div>

      <div class="card-actions">
        <div class="value-box" title="${valueInfo.label}">
          <span style="color:var(--text-muted)">Value:</span>
          <span class="star-rating">${valueInfo.stars}</span>
        </div>
        <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="gpu">
          ${isSelected ? '✓ Added' : '+ Compare'}
        </button>
      </div>
    </div>
  `;
}

// Backward compatibility alias for cards
export const renderGpuCard = (item) => renderHardwareCard(item, 'gpu');
export const renderCpuCard = (item) => renderHardwareCard(item, 'cpu');
export const renderPhoneCard = (item) => renderHardwareCard(item, 'phones');

export function renderPhoneDetails(item) {
  const scoreNum = item.scores?.overall || item.score || 0;
  const valueInfo = calculateValueRating(scoreNum, item.msrp);
  const badgeClass = getScoreBadgeColorClass(scoreNum);
  const isSelected = comparisonManager.has(item.id, 'phones');

  let vendorClass = 'vendor-nvidia';
  const vendorLower = (item.manufacturer || '').toLowerCase();
  if (vendorLower.includes('apple')) vendorClass = 'vendor-intel';
  if (vendorLower.includes('samsung')) vendorClass = 'vendor-amd';

  return `
    <div class="container" style="padding-top: 16px;">
      <a href="#/category/phones" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to Phones
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${vendorClass}" style="font-size: 0.85rem;">${item.manufacturer} • ${item.soc}</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${item.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Hardware Performance Index</div>
            <div class="huge-score" style="color: var(--text-primary);">${scoreNum} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="phones" style="padding: 8px 16px; font-size: 0.85rem;">
            ${isSelected ? '✓ In Comparison' : '+ Compare Device'}
          </button>
        </div>
      </div>

      <h3 class="section-title">Device Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">Chipset (SoC)</div>
          <div class="spec-tile-value">${item.soc}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">RAM</div>
          <div class="spec-tile-value">${item.ram} GB</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Storage Options</div>
          <div class="spec-tile-value">${Array.isArray(item.storage) ? item.storage.join(' / ') + ' GB' : item.storage}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Display</div>
          <div class="spec-tile-value">${item.display}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Refresh Rate</div>
          <div class="spec-tile-value">${item.refreshRate} Hz</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Battery</div>
          <div class="spec-tile-value">${item.battery} mAh</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Main Camera</div>
          <div class="spec-tile-value">${item.mainCamera}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Weight</div>
          <div class="spec-tile-value">${item.weight} g</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${item.releaseYear}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Launch MSRP</div>
          <div class="spec-tile-value">$${item.msrp || 'N/A'}</div>
        </div>
      </div>

      ${item.msrp ? `
        <div class="chart-card">
          <div class="chart-header">
            <span>Price / Performance Rating</span>
            <span class="star-rating" style="font-size: 1rem;">${valueInfo.stars}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            Value Index: <strong>${valueInfo.ratio}</strong> pts / $100 — <em>${valueInfo.label}</em>
          </div>
        </div>
      ` : ''}

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Geekbench 6 Multi-Core</span>
            <strong style="color:var(--text-primary)">${item.benchmarks?.geekbench6Multi ? item.benchmarks.geekbench6Multi.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Geekbench 6 Single-Core</span>
            <strong style="color:var(--text-primary)">${item.benchmarks?.geekbench6Single ? item.benchmarks.geekbench6Single.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">AnTuTu 10 Score</span>
            <strong style="color:var(--text-primary)">${item.benchmarks?.antutu10 ? item.benchmarks.antutu10.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
        </div>
      </div>

      ${item.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${item.benchmarkSource.sourceName}</strong> (${item.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${item.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderCpuDetails(item) {
  const scoreNum = item.scores?.overall || item.score || 0;
  const valueInfo = calculateValueRating(scoreNum, item.msrp);
  const badgeClass = getScoreBadgeColorClass(scoreNum);
  const isSelected = comparisonManager.has(item.id, 'cpu');

  let vendorClass = 'vendor-intel';
  if ((item.manufacturer || '').toLowerCase().includes('amd')) vendorClass = 'vendor-amd';

  return `
    <div class="container" style="padding-top: 16px;">
      <a href="#/category/cpu" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to CPUs
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${vendorClass}" style="font-size: 0.85rem;">${item.manufacturer} • ${item.architecture || ''} Architecture</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${item.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">CPU Performance Index</div>
            <div class="huge-score" style="color: var(--text-primary);">${scoreNum} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="cpu" style="padding: 8px 16px; font-size: 0.85rem;">
            ${isSelected ? '✓ In Comparison' : '+ Compare Processor'}
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
            <span>${item.scores?.multiCore || scoreNum} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-high" style="width: ${item.scores?.multiCore || scoreNum}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Single-Core Performance</span>
            <span>${item.scores?.singleCore || scoreNum} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-ultra" style="width: ${item.scores?.singleCore || scoreNum}%"></div>
          </div>
        </div>
      </div>

      <h3 class="section-title">Processor Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">Cores / Threads</div>
          <div class="spec-tile-value">${item.cores}C / ${item.threads}T</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Base Clock</div>
          <div class="spec-tile-value">${item.baseClock}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Boost Clock</div>
          <div class="spec-tile-value">${item.boostClock}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Total Cache</div>
          <div class="spec-tile-value">${item.cache}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">TDP (Power)</div>
          <div class="spec-tile-value">${item.tdp} W</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Socket</div>
          <div class="spec-tile-value">${item.socket}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Process Node</div>
          <div class="spec-tile-value">${item.processNode}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">iGPU Included</div>
          <div class="spec-tile-value">${item.integratedGraphics ? 'Yes' : 'No (F-series)'}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${item.releaseYear}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">MSRP Price</div>
          <div class="spec-tile-value">$${item.msrp || 'N/A'}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Price / Performance Rating</span>
          <span class="star-rating" style="font-size: 1rem;">${valueInfo.stars}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Value Index: <strong>${valueInfo.ratio}</strong> pts / $100 — <em>${valueInfo.label}</em>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Cinebench R23 (Multi-Core)</span>
            <strong style="color:var(--text-primary)">${item.benchmarks?.cinebenchR23Multi ? item.benchmarks.cinebenchR23Multi.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">Cinebench R23 (Single-Core)</span>
            <strong style="color:var(--text-primary)">${item.benchmarks?.cinebenchR23Single ? item.benchmarks.cinebenchR23Single.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
        </div>
      </div>

      ${item.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${item.benchmarkSource.sourceName}</strong> (${item.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${item.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderGpuDetails(item) {
  const valueInfo = calculateValueRating(item.scores.overall, item.msrp);
  const badgeClass = getScoreBadgeColorClass(item.scores.overall);
  const isSelected = comparisonManager.has(item.id, 'gpu');

  let vendorClass = 'vendor-nvidia';
  if (item.manufacturer.toLowerCase().includes('amd')) vendorClass = 'vendor-amd';
  if (item.manufacturer.toLowerCase().includes('intel')) vendorClass = 'vendor-intel';

  return `
    <div class="container" style="padding-top: 16px;">
      <a href="#/gpu" style="color: #60a5fa; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;">
        ← Back to GPUs
      </a>

      <div class="detail-hero">
        <div class="gpu-vendor-tag ${vendorClass}" style="font-size: 0.85rem;">${item.manufacturer} • ${item.architecture} Architecture</div>
        <h1 style="font-size: 1.6rem; font-weight: 800; margin: 4px 0 12px 0;">${item.name}</h1>
        
        <div class="detail-score-box">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Performance Score</div>
            <div class="huge-score" style="color: var(--text-primary);">${item.scores.overall} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">/ 100</span></div>
          </div>
          <button class="compare-check-btn ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-cat="gpu" style="padding: 8px 16px; font-size: 0.85rem;">
            ${isSelected ? '✓ In Comparison' : '+ Compare Device'}
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
            <span>${item.scores.gaming} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-high" style="width: ${item.scores.gaming}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Ray Tracing</span>
            <span>${item.scores.rayTracing} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-ultra" style="width: ${item.scores.rayTracing}%"></div>
          </div>
        </div>

        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>Productivity & Compute</span>
            <span>${item.scores.productivity} / 100</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill fill-mid" style="width: ${item.scores.productivity}%"></div>
          </div>
        </div>
      </div>

      <h3 class="section-title">Hardware Specifications</h3>
      <div class="spec-grid">
        <div class="spec-tile">
          <div class="spec-tile-label">VRAM Capacity</div>
          <div class="spec-tile-value">${item.vram} GB</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Memory Type</div>
          <div class="spec-tile-value">${item.memoryType}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Memory Bus</div>
          <div class="spec-tile-value">${item.memoryBus}-bit</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Power (TDP)</div>
          <div class="spec-tile-value">${item.power} W</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">Release Year</div>
          <div class="spec-tile-value">${item.releaseYear} ${item.releaseQuarter || ''}</div>
        </div>
        <div class="spec-tile">
          <div class="spec-tile-label">MSRP Price</div>
          <div class="spec-tile-value">$${item.msrp || 'N/A'}</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <span>Price / Performance Rating</span>
          <span class="star-rating" style="font-size: 1rem;">${valueInfo.stars}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Value Index: <strong>${valueInfo.ratio}</strong> pts / $100 — <em>${valueInfo.label}</em>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">Verifiable Benchmark Metrics</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size: 0.85rem;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">3DMark Time Spy Extreme</span>
            <strong style="color:var(--text-primary)">${item.benchmarks.timeSpyExtreme ? item.benchmarks.timeSpyExtreme.toLocaleString() + ' pts' : 'N/A'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span style="color:var(--text-secondary)">Cyberpunk 2077 (4K Ultra FPS)</span>
            <strong style="color:var(--text-primary)">${item.benchmarks.cyberpunk4kUltra ? item.benchmarks.cyberpunk4kUltra + ' FPS' : 'N/A'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary)">Blender Render Time</span>
            <strong style="color:var(--text-primary)">${item.benchmarks.blenderRenderSec ? item.benchmarks.blenderRenderSec + ' sec' : 'N/A'}</strong>
          </div>
        </div>
      </div>

      ${item.benchmarkSource ? `
        <div class="source-box">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">Benchmark Source</div>
          <div>Provided by: <strong>${item.benchmarkSource.sourceName}</strong> (${item.benchmarkSource.testDate})</div>
          <div style="margin-top: 4px;">
            <a href="${item.benchmarkSource.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.benchmarkSource.sourceUrl}</a>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderComparisonPage(items, category = 'gpu') {
  const catTitle = category.toUpperCase();
  if (!items || items.length === 0) {
    return `
      <div class="container" style="padding-top: 32px; text-align: center;">
        <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:8px;">No ${catTitle}s Selected</h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:20px;">
          Select 2 or more ${catTitle} devices from the database list to perform side-by-side spec and benchmark comparisons.
        </p>
        <a href="#/${category === 'gpu' ? 'gpu' : 'category/' + category}" class="compare-btn-primary" style="display:inline-block; text-decoration:none;">
          Browse ${catTitle} Database
        </a>
      </div>
    `;
  }

  const isCpu = category === 'cpu';

  return `
    <div class="container" style="padding-top: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h1 style="font-size: 1.4rem; font-weight: 800;">${catTitle} Hardware Comparison</h1>
        <button id="clear-compare-btn" data-cat="${category}" style="background:transparent; border:1px solid #ef4444; color:#ef4444; padding:4px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer;">
          Clear All
        </button>
      </div>

      <!-- Overall Performance Chart -->
      <div class="chart-card">
        <div class="chart-header">Overall Performance Score</div>
        ${items.map(item => {
          const score = item.scores?.overall || item.score || 0;
          const pct = Math.max(0, Math.min(100, score));
          return `
            <div class="compare-chart-row">
              <div class="compare-item-name">${item.shortName || item.name} (${item.manufacturer})</div>
              <div class="compare-bar-container">
                <div class="chart-bar-track" style="flex:1;">
                  <div class="chart-bar-fill fill-high" style="width: ${pct}%"></div>
                </div>
                <div class="compare-value-num">${score}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Specifications Table -->
      <div class="chart-card" style="overflow-x: auto;">
        <div class="chart-header">Detailed Specs</div>
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
              <th style="padding:8px 4px; color:var(--text-muted);">Spec</th>
              ${items.map(item => `<th style="padding:8px 4px; color:var(--text-primary);">${item.shortName || item.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:8px 4px; color:var(--text-secondary);">Score</td>
              ${items.map(item => `<td style="padding:8px 4px; font-weight:bold;">${item.scores?.overall || item.score || 0} / 100</td>`).join('')}
            </tr>
            ${category === 'ram' ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Capacity</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.capacity} GB</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Generation</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.generation}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Speed</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.speed} MHz</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Modules</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.modules}x Stick</td>`).join('')}
              </tr>
            ` : category === 'ssd' ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Capacity</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.capacity}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Interface / Gen</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.pcieGen}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Read Speed</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.readSpeed} MB/s</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Write Speed</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.writeSpeed} MB/s</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Endurance</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.endurance}</td>`).join('')}
              </tr>
            ` : category === 'psu' ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Wattage</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.wattage} W</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Efficiency</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.efficiency}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Modularity</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.modularity}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">ATX Spec</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.atxVersion}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Protections</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.protections}</td>`).join('')}
              </tr>
            ` : category === 'phones' ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Chipset (SoC)</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.soc}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">RAM</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.ram} GB</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Display</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.display} @ ${item.refreshRate}Hz</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Battery</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.battery} mAh</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Camera</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.mainCamera}</td>`).join('')}
              </tr>
            ` : isCpu ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Cores / Threads</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.cores}C / ${item.threads}T</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Base Clock</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.baseClock}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Boost Clock</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.boostClock}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Cache</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.cache}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Socket</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.socket}</td>`).join('')}
              </tr>
            ` : `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">VRAM</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.vram} GB</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Memory Type</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.memoryType}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Bus Width</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.memoryBus}-bit</td>`).join('')}
              </tr>
            `}
            ${(category === 'gpu' || category === 'cpu') ? `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">TDP (Power)</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.power || item.tdp} W</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px 4px; color:var(--text-secondary);">Architecture</td>
                ${items.map(item => `<td style="padding:8px 4px;">${item.architecture}</td>`).join('')}
              </tr>
            ` : ''}
            <tr>
              <td style="padding:8px 4px; color:var(--text-secondary);">MSRP</td>
              ${items.map(item => `<td style="padding:8px 4px; color:#60a5fa;">$${item.msrp || 'N/A'}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderComingSoon(categoryName) {
  return `
    <div class="container" style="padding-top: 40px; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px;">🚀</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">${categoryName} Database</h2>
      <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px auto; font-size: 0.9rem;">
        The offline architecture is fully prepared for ${categoryName}. Verified hardware specs and benchmark metrics will be enabled in the upcoming dataset sync!
      </p>
      <a href="#/gpu" class="compare-btn-primary" style="display:inline-block; text-decoration:none;">
        Explore GPU Benchmarks
      </a>
    </div>
  `;
}
