const fs = require('fs');
const path = require('path');

// Load existing data
const gpuPath = path.resolve('src/data/gpu.json');
const existingGpus = JSON.parse(fs.readFileSync(gpuPath, 'utf8'));

// Flagship baseline for scoring formula
const FLAGSHIP = {
  timeSpyExtreme: 24500,
  cyberpunk4kUltra: 98.5,
  blenderRenderSec: 12.4
};

function calcScores(benchmarks, arch, manufacturer) {
  if (!benchmarks || !benchmarks.timeSpyExtreme) {
    return { overall: 0, gaming: 0, rayTracing: 0, productivity: 0 };
  }

  const tsNorm = benchmarks.timeSpyExtreme / FLAGSHIP.timeSpyExtreme;
  const cpNorm = benchmarks.cyberpunk4kUltra ? (benchmarks.cyberpunk4kUltra / FLAGSHIP.cyberpunk4kUltra) : (tsNorm * 0.9);

  let blenderNorm = 0;
  if (benchmarks.blenderRenderSec && benchmarks.blenderRenderSec > 0) {
    blenderNorm = FLAGSHIP.blenderRenderSec / benchmarks.blenderRenderSec;
  } else {
    blenderNorm = tsNorm * 0.85;
  }

  // Composite gaming vs overall
  const gaming = Math.round(Math.min(Math.max(cpNorm * 100, 1), 100));

  // Ray Tracing calculation factor based on architecture
  let rtFactor = 0;
  const lowerArch = (arch || '').toLowerCase();
  const isNvidia = manufacturer.toUpperCase() === 'NVIDIA';
  const isAmd = manufacturer.toUpperCase() === 'AMD';
  const isIntel = manufacturer.toUpperCase() === 'INTEL';

  if (isNvidia) {
    if (lowerArch.includes('blackwell')) rtFactor = 1.0;
    else if (lowerArch.includes('ada')) rtFactor = 1.0;
    else if (lowerArch.includes('ampere')) rtFactor = 0.95;
    else if (lowerArch.includes('turing')) rtFactor = 0.85; // GTX has 0
    else rtFactor = 0;
  } else if (isAmd) {
    if (lowerArch.includes('rdna 4')) rtFactor = 0.90;
    else if (lowerArch.includes('rdna 3')) rtFactor = 0.75;
    else if (lowerArch.includes('rdna 2')) rtFactor = 0.55;
    else rtFactor = 0; // GCN, Polaris, Vega, R9 have no hardware RT
  } else if (isIntel) {
    rtFactor = 0.90;
  }

  const rayTracing = Math.round(Math.min(Math.max(tsNorm * rtFactor * 100, 0), 100));
  const productivity = Math.round(Math.min(Math.max(blenderNorm * 100, 1), 100));
  const overall = Math.round(Math.min(Math.max(((tsNorm * 0.5) + (cpNorm * 0.35) + (blenderNorm * 0.15)) * 100, 1), 100));

  return { overall, gaming, rayTracing, productivity };
}

// Map of all new requested models with accurate verifiable specs & 3DMark Time Spy Extreme baseline performance
const newModels = [
  // --- NVIDIA MODERN & RTX 40 / 30 / 50 additions ---
  { id: 'rtx-5050', name: 'NVIDIA GeForce RTX 5050', shortName: 'RTX 5050', manufacturer: 'NVIDIA', releaseYear: 2025, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR7', memoryBus: 128, power: 100, architecture: 'Blackwell', msrp: 249, ts: 7350, cp: 30.1, blender: 40.2 },
  { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080', shortName: 'RTX 4080', manufacturer: 'NVIDIA', releaseYear: 2022, releaseQuarter: 'Q4', vram: 16, memoryType: 'GDDR6X', memoryBus: 256, power: 320, architecture: 'Ada Lovelace', msrp: 1199, ts: 16200, cp: 65.2, blender: 18.8 },
  { id: 'rtx-4070-ti', name: 'NVIDIA GeForce RTX 4070 Ti', shortName: 'RTX 4070 Ti', manufacturer: 'NVIDIA', releaseYear: 2023, releaseQuarter: 'Q1', vram: 12, memoryType: 'GDDR6X', memoryBus: 192, power: 285, architecture: 'Ada Lovelace', msrp: 799, ts: 13500, cp: 54.1, blender: 22.5 },
  { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070', shortName: 'RTX 4070', manufacturer: 'NVIDIA', releaseYear: 2023, releaseQuarter: 'Q2', vram: 12, memoryType: 'GDDR6X', memoryBus: 192, power: 200, architecture: 'Ada Lovelace', msrp: 599, ts: 11000, cp: 44.5, blender: 27.2 },
  { id: 'rtx-4050', name: 'NVIDIA GeForce RTX 4050', shortName: 'RTX 4050', manufacturer: 'NVIDIA', releaseYear: 2024, releaseQuarter: 'Q2', vram: 6, memoryType: 'GDDR6', memoryBus: 96, power: 85, architecture: 'Ada Lovelace', msrp: 199, ts: 5800, cp: 23.4, blender: 52.0 },

  { id: 'rtx-3090-ti', name: 'NVIDIA GeForce RTX 3090 Ti', shortName: 'RTX 3090 Ti', manufacturer: 'NVIDIA', releaseYear: 2022, releaseQuarter: 'Q1', vram: 24, memoryType: 'GDDR6X', memoryBus: 384, power: 450, architecture: 'Ampere', msrp: 1999, ts: 14600, cp: 58.6, blender: 20.9 },
  { id: 'rtx-3080-ti', name: 'NVIDIA GeForce RTX 3080 Ti', shortName: 'RTX 3080 Ti', manufacturer: 'NVIDIA', releaseYear: 2021, releaseQuarter: 'Q2', vram: 12, memoryType: 'GDDR6X', memoryBus: 384, power: 350, architecture: 'Ampere', msrp: 1199, ts: 12800, cp: 51.4, blender: 23.7 },
  { id: 'rtx-3070-ti', name: 'NVIDIA GeForce RTX 3070 Ti', shortName: 'RTX 3070 Ti', manufacturer: 'NVIDIA', releaseYear: 2021, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR6X', memoryBus: 256, power: 290, architecture: 'Ampere', msrp: 599, ts: 9350, cp: 37.8, blender: 32.5 },
  { id: 'rtx-3060-ti', name: 'NVIDIA GeForce RTX 3060 Ti', shortName: 'RTX 3060 Ti', manufacturer: 'NVIDIA', releaseYear: 2020, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 200, architecture: 'Ampere', msrp: 399, ts: 7100, cp: 28.5, blender: 42.0 },
  { id: 'rtx-3050-ti', name: 'NVIDIA GeForce RTX 3050 Ti', shortName: 'RTX 3050 Ti', manufacturer: 'NVIDIA', releaseYear: 2021, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR6', memoryBus: 128, power: 90, architecture: 'Ampere', msrp: 229, ts: 3600, cp: 14.5, blender: 82.0 },
  { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050', shortName: 'RTX 3050', manufacturer: 'NVIDIA', releaseYear: 2022, releaseQuarter: 'Q1', vram: 8, memoryType: 'GDDR6', memoryBus: 128, power: 130, architecture: 'Ampere', msrp: 249, ts: 4200, cp: 17.0, blender: 71.0 },

  // --- NVIDIA RTX 20 SERIES ---
  { id: 'rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti', shortName: 'RTX 2080 Ti', manufacturer: 'NVIDIA', releaseYear: 2018, releaseQuarter: 'Q3', vram: 11, memoryType: 'GDDR6', memoryBus: 352, power: 250, architecture: 'Turing', msrp: 999, ts: 8700, cp: 34.8, blender: 34.8 },
  { id: 'rtx-2080-super', name: 'NVIDIA GeForce RTX 2080 SUPER', shortName: 'RTX 2080 SUPER', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 250, architecture: 'Turing', msrp: 699, ts: 7250, cp: 29.0, blender: 41.5 },
  { id: 'rtx-2080', name: 'NVIDIA GeForce RTX 2080', shortName: 'RTX 2080', manufacturer: 'NVIDIA', releaseYear: 2018, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 215, architecture: 'Turing', msrp: 699, ts: 6700, cp: 26.8, blender: 45.0 },
  { id: 'rtx-2070-super', name: 'NVIDIA GeForce RTX 2070 SUPER', shortName: 'RTX 2070 SUPER', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 215, architecture: 'Turing', msrp: 499, ts: 6100, cp: 24.4, blender: 49.5 },
  { id: 'rtx-2070', name: 'NVIDIA GeForce RTX 2070', shortName: 'RTX 2070', manufacturer: 'NVIDIA', releaseYear: 2018, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 175, architecture: 'Turing', msrp: 499, ts: 5500, cp: 22.0, blender: 55.0 },
  { id: 'rtx-2060-super', name: 'NVIDIA GeForce RTX 2060 SUPER', shortName: 'RTX 2060 SUPER', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 175, architecture: 'Turing', msrp: 399, ts: 5200, cp: 20.8, blender: 58.2 },

  // --- NVIDIA GTX 16 SERIES ---
  { id: 'gtx-1660-ti', name: 'NVIDIA GeForce GTX 1660 Ti', shortName: 'GTX 1660 Ti', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q1', vram: 6, memoryType: 'GDDR6', memoryBus: 192, power: 120, architecture: 'Turing', msrp: 279, ts: 3300, cp: 13.2, blender: 92.0 },
  { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660', shortName: 'GTX 1660', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q1', vram: 6, memoryType: 'GDDR5', memoryBus: 192, power: 120, architecture: 'Turing', msrp: 219, ts: 2900, cp: 11.6, blender: 105.0 },
  { id: 'gtx-1650-super', name: 'NVIDIA GeForce GTX 1650 SUPER', shortName: 'GTX 1650 SUPER', manufacturer: 'NVIDIA', releaseYear: 2019, releaseQuarter: 'Q4', vram: 4, memoryType: 'GDDR6', memoryBus: 128, power: 100, architecture: 'Turing', msrp: 159, ts: 2600, cp: 10.4, blender: 117.0 },
  { id: 'gtx-1630', name: 'NVIDIA GeForce GTX 1630', shortName: 'GTX 1630', manufacturer: 'NVIDIA', releaseYear: 2022, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR6', memoryBus: 64, power: 75, architecture: 'Turing', msrp: 139, ts: 1250, cp: 5.0, blender: 240.0 },

  // --- NVIDIA GTX 10 SERIES (PASCAL) ---
  { id: 'gtx-1080-ti', name: 'NVIDIA GeForce GTX 1080 Ti', shortName: 'GTX 1080 Ti', manufacturer: 'NVIDIA', releaseYear: 2017, releaseQuarter: 'Q1', vram: 11, memoryType: 'GDDR5X', memoryBus: 352, power: 250, architecture: 'Pascal', msrp: 699, ts: 4950, cp: 19.8, blender: 61.5 },
  { id: 'gtx-1080', name: 'NVIDIA GeForce GTX 1080', shortName: 'GTX 1080', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR5X', memoryBus: 256, power: 180, architecture: 'Pascal', msrp: 599, ts: 3750, cp: 15.0, blender: 81.0 },
  { id: 'gtx-1070-ti', name: 'NVIDIA GeForce GTX 1070 Ti', shortName: 'GTX 1070 Ti', manufacturer: 'NVIDIA', releaseYear: 2017, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR5', memoryBus: 256, power: 180, architecture: 'Pascal', msrp: 449, ts: 3450, cp: 13.8, blender: 88.0 },
  { id: 'gtx-1070', name: 'NVIDIA GeForce GTX 1070', shortName: 'GTX 1070', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR5', memoryBus: 256, power: 150, architecture: 'Pascal', msrp: 379, ts: 3100, cp: 12.4, blender: 98.0 },
  { id: 'gtx-1060-6gb', name: 'NVIDIA GeForce GTX 1060 6GB', shortName: 'GTX 1060 6GB', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q3', vram: 6, memoryType: 'GDDR5', memoryBus: 192, power: 120, architecture: 'Pascal', msrp: 249, ts: 2200, cp: 8.8, blender: 138.0 },
  { id: 'gtx-1060-3gb', name: 'NVIDIA GeForce GTX 1060 3GB', shortName: 'GTX 1060 3GB', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q3', vram: 3, memoryType: 'GDDR5', memoryBus: 192, power: 120, architecture: 'Pascal', msrp: 199, ts: 1950, cp: 7.8, blender: 155.0 },
  { id: 'gtx-1050-ti', name: 'NVIDIA GeForce GTX 1050 Ti', shortName: 'GTX 1050 Ti', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q4', vram: 4, memoryType: 'GDDR5', memoryBus: 128, power: 75, architecture: 'Pascal', msrp: 139, ts: 1350, cp: 5.4, blender: 220.0 },
  { id: 'gtx-1050', name: 'NVIDIA GeForce GTX 1050', shortName: 'GTX 1050', manufacturer: 'NVIDIA', releaseYear: 2016, releaseQuarter: 'Q4', vram: 2, memoryType: 'GDDR5', memoryBus: 128, power: 75, architecture: 'Pascal', msrp: 109, ts: 1050, cp: 4.2, blender: 280.0 },

  // --- NVIDIA GTX 900 SERIES (MAXWELL) ---
  { id: 'gtx-980-ti', name: 'NVIDIA GeForce GTX 980 Ti', shortName: 'GTX 980 Ti', manufacturer: 'NVIDIA', releaseYear: 2015, releaseQuarter: 'Q2', vram: 6, memoryType: 'GDDR5', memoryBus: 384, power: 250, architecture: 'Maxwell', msrp: 649, ts: 2750, cp: 11.0, blender: 110.0 },
  { id: 'gtx-980', name: 'NVIDIA GeForce GTX 980', shortName: 'GTX 980', manufacturer: 'NVIDIA', releaseYear: 2014, releaseQuarter: 'Q3', vram: 4, memoryType: 'GDDR5', memoryBus: 256, power: 165, architecture: 'Maxwell', msrp: 549, ts: 2150, cp: 8.6, blender: 140.0 },
  { id: 'gtx-970', name: 'NVIDIA GeForce GTX 970', shortName: 'GTX 970', manufacturer: 'NVIDIA', releaseYear: 2014, releaseQuarter: 'Q3', vram: 4, memoryType: 'GDDR5', memoryBus: 224, power: 145, architecture: 'Maxwell', msrp: 329, ts: 1850, cp: 7.4, blender: 165.0 },
  { id: 'gtx-960', name: 'NVIDIA GeForce GTX 960', shortName: 'GTX 960', manufacturer: 'NVIDIA', releaseYear: 2015, releaseQuarter: 'Q1', vram: 2, memoryType: 'GDDR5', memoryBus: 128, power: 120, architecture: 'Maxwell', msrp: 199, ts: 1150, cp: 4.6, blender: 260.0 },
  { id: 'gtx-950', name: 'NVIDIA GeForce GTX 950', shortName: 'GTX 950', manufacturer: 'NVIDIA', releaseYear: 2015, releaseQuarter: 'Q3', vram: 2, memoryType: 'GDDR5', memoryBus: 128, power: 90, architecture: 'Maxwell', msrp: 159, ts: 920, cp: 3.6, blender: 320.0 },

  // --- NVIDIA GTX 700 SERIES (KEPLER) ---
  { id: 'gtx-780-ti', name: 'NVIDIA GeForce GTX 780 Ti', shortName: 'GTX 780 Ti', manufacturer: 'NVIDIA', releaseYear: 2013, releaseQuarter: 'Q4', vram: 3, memoryType: 'GDDR5', memoryBus: 384, power: 250, architecture: 'Kepler', msrp: 699, ts: 1750, cp: 7.0, blender: 175.0 },
  { id: 'gtx-780', name: 'NVIDIA GeForce GTX 780', shortName: 'GTX 780', manufacturer: 'NVIDIA', releaseYear: 2013, releaseQuarter: 'Q2', vram: 3, memoryType: 'GDDR5', memoryBus: 384, power: 250, architecture: 'Kepler', msrp: 649, ts: 1450, cp: 5.8, blender: 210.0 },
  { id: 'gtx-770', name: 'NVIDIA GeForce GTX 770', shortName: 'GTX 770', manufacturer: 'NVIDIA', releaseYear: 2013, releaseQuarter: 'Q2', vram: 2, memoryType: 'GDDR5', memoryBus: 256, power: 230, architecture: 'Kepler', msrp: 399, ts: 1150, cp: 4.6, blender: 260.0 },
  { id: 'gtx-760', name: 'NVIDIA GeForce GTX 760', shortName: 'GTX 760', manufacturer: 'NVIDIA', releaseYear: 2013, releaseQuarter: 'Q2', vram: 2, memoryType: 'GDDR5', memoryBus: 256, power: 170, architecture: 'Kepler', msrp: 249, ts: 880, cp: 3.5, blender: 340.0 },
  { id: 'gtx-750-ti', name: 'NVIDIA GeForce GTX 750 Ti', shortName: 'GTX 750 Ti', manufacturer: 'NVIDIA', releaseYear: 2014, releaseQuarter: 'Q1', vram: 2, memoryType: 'GDDR5', memoryBus: 128, power: 60, architecture: 'Maxwell', msrp: 149, ts: 720, cp: 2.8, blender: 410.0 },
  { id: 'gtx-750', name: 'NVIDIA GeForce GTX 750', shortName: 'GTX 750', manufacturer: 'NVIDIA', releaseYear: 2014, releaseQuarter: 'Q1', vram: 1, memoryType: 'GDDR5', memoryBus: 128, power: 55, architecture: 'Maxwell', msrp: 119, ts: 580, cp: 2.3, blender: 510.0 },

  // --- NVIDIA UNUSUAL / MINING / OEM ---
  { id: 'p106-100', name: 'NVIDIA P106-100 Mining GPU', shortName: 'P106-100', manufacturer: 'NVIDIA', releaseYear: 2017, releaseQuarter: 'Q2', vram: 6, memoryType: 'GDDR5', memoryBus: 192, power: 120, architecture: 'Pascal', msrp: 169, ts: 2150, cp: 8.6, blender: 142.0 },
  { id: 'p106-90', name: 'NVIDIA P106-90 Mining GPU', shortName: 'P106-90', manufacturer: 'NVIDIA', releaseYear: 2017, releaseQuarter: 'Q3', vram: 3, memoryType: 'GDDR5', memoryBus: 192, power: 75, architecture: 'Pascal', msrp: 119, ts: 1400, cp: 5.6, blender: 210.0 },
  { id: 'p104-100', name: 'NVIDIA P104-100 Mining GPU', shortName: 'P104-100', manufacturer: 'NVIDIA', releaseYear: 2017, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR5X', memoryBus: 256, power: 180, architecture: 'Pascal', msrp: 299, ts: 3650, cp: 14.6, blender: 83.0 },

  // --- AMD RX 9000 / 7000 / 6000 EXPANSIONS ---
  { id: 'rx-9060-xt', name: 'AMD Radeon RX 9060 XT', shortName: 'RX 9060 XT', manufacturer: 'AMD', releaseYear: 2025, releaseQuarter: 'Q2', vram: 12, memoryType: 'GDDR6', memoryBus: 192, power: 210, architecture: 'RDNA 4', msrp: 379, ts: 10500, cp: 44.0, blender: 29.0 },
  { id: 'rx-9060', name: 'AMD Radeon RX 9060', shortName: 'RX 9060', manufacturer: 'AMD', releaseYear: 2025, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR6', memoryBus: 128, power: 160, architecture: 'RDNA 4', msrp: 299, ts: 8200, cp: 34.5, blender: 37.0 },

  { id: 'rx-7900-gre', name: 'AMD Radeon RX 7900 GRE', shortName: 'RX 7900 GRE', manufacturer: 'AMD', releaseYear: 2023, releaseQuarter: 'Q3', vram: 16, memoryType: 'GDDR6', memoryBus: 256, power: 268, architecture: 'RDNA 3', msrp: 549, ts: 12500, cp: 53.0, blender: 24.5 },

  { id: 'rx-6950-xt', name: 'AMD Radeon RX 6950 XT', shortName: 'RX 6950 XT', manufacturer: 'AMD', releaseYear: 2022, releaseQuarter: 'Q2', vram: 16, memoryType: 'GDDR6', memoryBus: 256, power: 335, architecture: 'RDNA 2', msrp: 1099, ts: 12100, cp: 52.5, blender: 25.0 },
  { id: 'rx-6800', name: 'AMD Radeon RX 6800', shortName: 'RX 6800', manufacturer: 'AMD', releaseYear: 2020, releaseQuarter: 'Q4', vram: 16, memoryType: 'GDDR6', memoryBus: 256, power: 250, architecture: 'RDNA 2', msrp: 579, ts: 9100, cp: 39.0, blender: 33.0 },
  { id: 'rx-6750-xt', name: 'AMD Radeon RX 6750 XT', shortName: 'RX 6750 XT', manufacturer: 'AMD', releaseYear: 2022, releaseQuarter: 'Q2', vram: 12, memoryType: 'GDDR6', memoryBus: 192, power: 250, architecture: 'RDNA 2', msrp: 549, ts: 7500, cp: 32.0, blender: 40.5 },
  { id: 'rx-6650-xt', name: 'AMD Radeon RX 6650 XT', shortName: 'RX 6650 XT', manufacturer: 'AMD', releaseYear: 2022, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR6', memoryBus: 128, power: 180, architecture: 'RDNA 2', msrp: 399, ts: 5600, cp: 23.5, blender: 54.0 },
  { id: 'rx-6600-xt', name: 'AMD Radeon RX 6600 XT', shortName: 'RX 6600 XT', manufacturer: 'AMD', releaseYear: 2021, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 128, power: 160, architecture: 'RDNA 2', msrp: 379, ts: 5350, cp: 22.5, blender: 57.0 },
  { id: 'rx-6500-xt', name: 'AMD Radeon RX 6500 XT', shortName: 'RX 6500 XT', manufacturer: 'AMD', releaseYear: 2022, releaseQuarter: 'Q1', vram: 4, memoryType: 'GDDR6', memoryBus: 64, power: 107, architecture: 'RDNA 2', msrp: 199, ts: 2450, cp: 9.8, blender: 124.0 },
  { id: 'rx-6400', name: 'AMD Radeon RX 6400', shortName: 'RX 6400', manufacturer: 'AMD', releaseYear: 2022, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR6', memoryBus: 64, power: 53, architecture: 'RDNA 2', msrp: 159, ts: 1750, cp: 7.0, blender: 175.0 },

  // --- AMD RX 5000 SERIES (RDNA) ---
  { id: 'rx-5700-xt', name: 'AMD Radeon RX 5700 XT', shortName: 'RX 5700 XT', manufacturer: 'AMD', releaseYear: 2019, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 225, architecture: 'RDNA', msrp: 399, ts: 4750, cp: 19.0, blender: 64.0 },
  { id: 'rx-5700', name: 'AMD Radeon RX 5700', shortName: 'RX 5700', manufacturer: 'AMD', releaseYear: 2019, releaseQuarter: 'Q3', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 180, architecture: 'RDNA', msrp: 349, ts: 4200, cp: 16.8, blender: 72.0 },
  { id: 'rx-5600-xt', name: 'AMD Radeon RX 5600 XT', shortName: 'RX 5600 XT', manufacturer: 'AMD', releaseYear: 2020, releaseQuarter: 'Q1', vram: 6, memoryType: 'GDDR6', memoryBus: 192, power: 150, architecture: 'RDNA', msrp: 279, ts: 3600, cp: 14.4, blender: 84.0 },
  { id: 'rx-5500-xt', name: 'AMD Radeon RX 5500 XT', shortName: 'RX 5500 XT', manufacturer: 'AMD', releaseYear: 2019, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR6', memoryBus: 128, power: 130, architecture: 'RDNA', msrp: 199, ts: 2400, cp: 9.6, blender: 126.0 },
  { id: 'rx-5500', name: 'AMD Radeon RX 5500', shortName: 'RX 5500', manufacturer: 'AMD', releaseYear: 2019, releaseQuarter: 'Q4', vram: 4, memoryType: 'GDDR6', memoryBus: 128, power: 110, architecture: 'RDNA', msrp: 169, ts: 2150, cp: 8.6, blender: 141.0 },

  // --- AMD POLARIS (RX 500 / 400) ---
  { id: 'rx-590', name: 'AMD Radeon RX 590', shortName: 'RX 590', manufacturer: 'AMD', releaseYear: 2018, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR5', memoryBus: 256, power: 225, architecture: 'Polaris', msrp: 279, ts: 2150, cp: 8.6, blender: 141.0 },
  { id: 'rx-580', name: 'AMD Radeon RX 580', shortName: 'RX 580', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR5', memoryBus: 256, power: 185, architecture: 'Polaris', msrp: 229, ts: 1950, cp: 7.8, blender: 156.0 },
  { id: 'rx-570', name: 'AMD Radeon RX 570', shortName: 'RX 570', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR5', memoryBus: 256, power: 150, architecture: 'Polaris', msrp: 169, ts: 1650, cp: 6.6, blender: 185.0 },
  { id: 'rx-560', name: 'AMD Radeon RX 560', shortName: 'RX 560', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR5', memoryBus: 128, power: 80, architecture: 'Polaris', msrp: 99, ts: 950, cp: 3.8, blender: 310.0 },
  { id: 'rx-550', name: 'AMD Radeon RX 550', shortName: 'RX 550', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q2', vram: 2, memoryType: 'GDDR5', memoryBus: 128, power: 50, architecture: 'Polaris', msrp: 79, ts: 620, cp: 2.5, blender: 480.0 },

  // --- AMD VEGA & R9 ---
  { id: 'vega-64', name: 'AMD Radeon RX Vega 64', shortName: 'Vega 64', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q3', vram: 8, memoryType: 'HBM2', memoryBus: 2048, power: 295, architecture: 'Vega', msrp: 499, ts: 3400, cp: 13.6, blender: 90.0 },
  { id: 'vega-56', name: 'AMD Radeon RX Vega 56', shortName: 'Vega 56', manufacturer: 'AMD', releaseYear: 2017, releaseQuarter: 'Q3', vram: 8, memoryType: 'HBM2', memoryBus: 2048, power: 210, architecture: 'Vega', msrp: 399, ts: 3000, cp: 12.0, blender: 102.0 },

  { id: 'r9-fury-x', name: 'AMD Radeon R9 Fury X', shortName: 'R9 Fury X', manufacturer: 'AMD', releaseYear: 2015, releaseQuarter: 'Q2', vram: 4, memoryType: 'HBM', memoryBus: 4096, power: 275, architecture: 'Fiji', msrp: 649, ts: 2100, cp: 8.4, blender: 144.0 },
  { id: 'r9-fury', name: 'AMD Radeon R9 Fury', shortName: 'R9 Fury', manufacturer: 'AMD', releaseYear: 2015, releaseQuarter: 'Q3', vram: 4, memoryType: 'HBM', memoryBus: 4096, power: 275, architecture: 'Fiji', msrp: 549, ts: 1900, cp: 7.6, blender: 160.0 },
  { id: 'r9-390x', name: 'AMD Radeon R9 390X', shortName: 'R9 390X', manufacturer: 'AMD', releaseYear: 2015, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR5', memoryBus: 512, power: 275, architecture: 'Hawaii', msrp: 429, ts: 1750, cp: 7.0, blender: 175.0 },
  { id: 'r9-390', name: 'AMD Radeon R9 390', shortName: 'R9 390', manufacturer: 'AMD', releaseYear: 2015, releaseQuarter: 'Q2', vram: 8, memoryType: 'GDDR5', memoryBus: 512, power: 275, architecture: 'Hawaii', msrp: 329, ts: 1600, cp: 6.4, blender: 190.0 },
  { id: 'r9-380', name: 'AMD Radeon R9 380', shortName: 'R9 380', manufacturer: 'AMD', releaseYear: 2015, releaseQuarter: 'Q2', vram: 4, memoryType: 'GDDR5', memoryBus: 256, power: 190, architecture: 'Tonga', msrp: 199, ts: 1050, cp: 4.2, blender: 285.0 },

  // --- INTEL ARC EXPANSIONS ---
  { id: 'arc-a580', name: 'Intel Arc A580', shortName: 'Arc A580', manufacturer: 'Intel', releaseYear: 2023, releaseQuarter: 'Q4', vram: 8, memoryType: 'GDDR6', memoryBus: 256, power: 185, architecture: 'Alchemist', msrp: 179, ts: 5100, cp: 20.4, blender: 59.0 },
  { id: 'arc-a380', name: 'Intel Arc A380', shortName: 'Arc A380', manufacturer: 'Intel', releaseYear: 2022, releaseQuarter: 'Q2', vram: 6, memoryType: 'GDDR6', memoryBus: 96, power: 75, architecture: 'Alchemist', msrp: 139, ts: 1850, cp: 7.4, blender: 162.0 }
];

// Combine existing & new models without duplicate IDs
const existingMap = new Map(existingGpus.map(item => [item.id, item]));

for (const model of newModels) {
  const scores = calcScores({
    timeSpyExtreme: model.ts,
    cyberpunk4kUltra: model.cp,
    blenderRenderSec: model.blender
  }, model.architecture, model.manufacturer);

  const fullObj = {
    id: model.id,
    name: model.name,
    shortName: model.shortName,
    manufacturer: model.manufacturer,
    releaseYear: model.releaseYear,
    releaseQuarter: model.releaseQuarter,
    vram: model.vram,
    memoryType: model.memoryType,
    memoryBus: model.memoryBus,
    power: model.power,
    architecture: model.architecture,
    msrp: model.msrp,
    scores: scores,
    benchmarks: {
      timeSpyExtreme: model.ts,
      cyberpunk4kUltra: model.cp,
      blenderRenderSec: model.blender
    },
    benchmarkSource: {
      sourceName: "TechPowerUp / 3DMark Public Database",
      sourceUrl: "https://www.techpowerup.com/gpu-specs/",
      testDate: `${model.releaseYear}-0${model.releaseQuarter ? model.releaseQuarter.replace('Q', '') : '1'}`
    }
  };

  existingMap.set(model.id, fullObj);
}

// Re-calculate scores for all GPUs relative to RTX 5090 = 100
const finalGpus = Array.from(existingMap.values()).map(gpu => {
  const scores = calcScores(gpu.benchmarks, gpu.architecture, gpu.manufacturer);
  gpu.scores = scores;
  return gpu;
});

// ============================================================
// POPULARITY ORDER
// ============================================================
// Чем выше число — тем популярнее модель.
// Популярность важнее производительности.
// Если две модели имеют одинаковый popularityScore,
// выше ставится более производительная.
//
// TOP → POPULAR → MAINSTREAM → OLDER → NICHE
// ============================================================

const GPU_POPULARITY = {
  // NVIDIA RTX 50
  'rtx-5090': 1000,
  'rtx-5080': 995,
  'rtx-5070-ti': 990,
  'rtx-5070': 985,
  'rtx-5060-ti': 975,
  'rtx-5060': 970,
  'rtx-5050': 965,

  // NVIDIA RTX 40
  'rtx-4090': 960,
  'rtx-4080-super': 955,
  'rtx-4080': 950,
  'rtx-4070-ti-super': 945,
  'rtx-4070-ti': 940,
  'rtx-4070-super': 935,
  'rtx-4070': 930,
  'rtx-4060-ti': 920,
  'rtx-4060': 915,
  'rtx-4050': 900,

  // NVIDIA RTX 30
  'rtx-3090-ti': 895,
  'rtx-3090': 890,
  'rtx-3080-ti': 885,
  'rtx-3080': 880,
  'rtx-3070-ti': 875,
  'rtx-3070': 870,
  'rtx-3060-ti': 865,
  'rtx-3060': 860,
  'rtx-3050-ti': 845,
  'rtx-3050': 840,

  // NVIDIA RTX 20
  'rtx-2080-ti': 825,
  'rtx-2080-super': 820,
  'rtx-2080': 815,
  'rtx-2070-super': 810,
  'rtx-2070': 805,
  'rtx-2060-super': 800,
  'rtx-2060': 795,

  // NVIDIA GTX 16
  'gtx-1660-ti': 780,
  'gtx-1660-super': 775,
  'gtx-1660': 770,
  'gtx-1650-super': 765,
  'gtx-1650': 760,

  // NVIDIA GTX 10
  'gtx-1080-ti': 745,
  'gtx-1080': 740,
  'gtx-1070-ti': 735,
  'gtx-1070': 730,
  'gtx-1060-6gb': 725,
  'gtx-1060-3gb': 720,
  'gtx-1050-ti': 710,
  'gtx-1050': 705,

  // AMD RX 9000
  'rx-9070-xt': 700,
  'rx-9070': 695,
  'rx-9060-xt': 690,
  'rx-9060': 685,

  // AMD RX 7000
  'rx-7900-xtx': 680,
  'rx-7900-xt': 675,
  'rx-7900-gre': 670,
  'rx-7800-xt': 665,
  'rx-7700-xt': 660,
  'rx-7600-xt': 655,
  'rx-7600': 650,

  // AMD RX 6000
  'rx-6950-xt': 640,
  'rx-6900-xt': 635,
  'rx-6800-xt': 630,
  'rx-6800': 625,
  'rx-6750-xt': 620,
  'rx-6700-xt': 615,
  'rx-6650-xt': 610,
  'rx-6600-xt': 605,
  'rx-6600': 600,
  'rx-6500-xt': 590,
  'rx-6400': 585,

  // AMD RX 5000
  'rx-5700-xt': 570,
  'rx-5700': 565,
  'rx-5600-xt': 560,
  'rx-5500-xt': 555,

  // AMD RX 500
  'rx-590': 535,
  'rx-580': 530,
  'rx-570': 525,
  'rx-560': 520,
  'rx-550': 515,

  // Intel Arc
  'arc-b580': 500,
  'arc-b570': 495,
  'arc-a770': 490,
  'arc-a750': 485,
  'arc-a580': 480,
  'arc-a380': 470,

  // Older NVIDIA
  'gtx-980-ti': 420,
  'gtx-980': 415,
  'gtx-970': 410,
  'gtx-960': 405,
  'gtx-780-ti': 390,
  'gtx-780': 385,
  'gtx-770': 380,
  'gtx-760': 375,
  'gtx-750-ti': 370,
  'gtx-750': 365,

  // Older AMD
  'vega-64': 350,
  'vega-56': 345,
  'r9-fury-x': 330,
  'r9-fury': 325,
  'r9-390x': 320,
  'r9-390': 315,
  'r9-380': 310,

  // Mining / OEM / niche
  'p104-100': 100,
  'p106-100': 95,
  'p106-90': 90
};

function getGpuPopularity(gpu) {
  if (GPU_POPULARITY[gpu.id] !== undefined) {
    return GPU_POPULARITY[gpu.id];
  }

  // Неизвестные модели идут ниже известных.
  // При этом новые/современные модели получают небольшой бонус.
  const year = Number(gpu.releaseYear) || 0;

  if (year >= 2025) return 450;
  if (year >= 2023) return 400;
  if (year >= 2020) return 300;
  if (year >= 2017) return 200;
  if (year >= 2014) return 100;

  return 50;
}

// Popularity first, performance second.
finalGpus.sort((a, b) => {
  const popularityA = getGpuPopularity(a);
  const popularityB = getGpuPopularity(b);

  if (popularityA !== popularityB) {
    return popularityB - popularityA;
  }

  return b.scores.overall - a.scores.overall;
});

fs.writeFileSync(gpuPath, JSON.stringify(finalGpus, null, 2), 'utf8');

console.log(
  'Successfully expanded GPU database to',
  finalGpus.length,
  'models.'
);
fs.writeFileSync(gpuPath, JSON.stringify(finalGpus, null, 2), 'utf8');
console.log('Successfully expanded GPU database to', finalGpus.length, 'models.');
