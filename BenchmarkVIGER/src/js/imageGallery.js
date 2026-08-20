const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
const MAX_IMAGES = 4;

function isOnline() {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function getRotationKey(category, id) {
  return `benchly_image_variant_${category}_${id}`;
}

function getRotationIndex(category, id) {
  try {
    return Number.parseInt(localStorage.getItem(getRotationKey(category, id)) || '0', 10) || 0;
  } catch {
    return 0;
  }
}

function advanceRotation(category, id, count) {
  if (!count) return;
  try {
    localStorage.setItem(getRotationKey(category, id), String((getRotationIndex(category, id) + 1) % count));
  } catch {
    // Storage is optional; the gallery still works without rotation persistence.
  }
}

function normaliseTitle(title) {
  return title
    .replace(/\b(geforce|radeon|graphics|processor|desktop|laptop|smartphone)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function imageMatchesModel(image, modelName) {
  const title = (image.title || '').toLowerCase();
  const terms = normaliseTitle(modelName).toLowerCase().split(/\s+/).filter(term => term.length > 2);
  return terms.filter(term => title.includes(term)).length >= Math.min(2, terms.length);
}

async function searchWikimedia(modelName) {
  const query = `${normaliseTitle(modelName)} filetype:bitmap`;
  const url = `${WIKIMEDIA_API}?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900&format=json&origin=*`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Image search failed (${response.status})`);

  const payload = await response.json();
  return Object.values(payload.query?.pages || {})
    .filter(page => imageMatchesModel(page, modelName))
    .map(page => ({
      id: page.pageid,
      title: page.title.replace(/^File:/i, ''),
      url: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url,
      source: `https://commons.wikimedia.org/?curid=${page.pageid}`
    }))
    .filter(image => image.url)
    .slice(0, MAX_IMAGES);
}

function renderGallery(container, images, category, id) {
  if (!images.length) {
    container.remove();
    return;
  }

  const offset = getRotationIndex(category, id) % images.length;
  const rotated = images.slice(offset).concat(images.slice(0, offset));
  container.innerHTML = `
    <div class="image-gallery-header">
      <div>
        <div class="chart-header">Device Images</div>
        <div class="image-gallery-source">Open images from Wikimedia Commons</div>
      </div>
      <button class="image-gallery-next" type="button" title="Show another image">Next image</button>
    </div>
    <div class="image-gallery-grid">
      ${rotated.map(image => `
        <a class="device-image-link" href="${image.source}" target="_blank" rel="noopener noreferrer">
          <img class="device-image" src="${image.url}" alt="${image.title}" loading="lazy">
        </a>
      `).join('')}
    </div>
  `;

  container.querySelector('.image-gallery-next')?.addEventListener('click', () => {
    advanceRotation(category, id, images.length);
    renderGallery(container, images, category, id);
  });

  container.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => {
      image.closest('.device-image-link')?.remove();
      if (!container.querySelector('.device-image-link')) container.remove();
    }, { once: true });
  });
}

export async function loadDeviceImageGallery(container, item, category) {
  if (!container || !item || !isOnline()) {
    container?.remove();
    return;
  }

  try {
    const images = await searchWikimedia(item.name || item.shortName || item.id);
    renderGallery(container, images, category, item.id);
  } catch {
    container.remove();
  }
}
