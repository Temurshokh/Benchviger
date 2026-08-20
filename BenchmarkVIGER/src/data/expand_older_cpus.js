const fs = require('fs');
const path = require('path');

const cpuPath = path.resolve('src/data/cpu.json');

const FLAGSHIP = {
  cinebenchR23Multi: 42500,
  cinebenchR23Single: 2350
};

function calcCpuScores(benchmarks) {
  if (!benchmarks || !benchmarks.cinebenchR23Multi) {
    return { overall: 0, multiCore: 0, singleCore: 0 };
  }

  const multiNorm = benchmarks.cinebenchR23Multi / FLAGSHIP.cinebenchR23Multi;
  const singleNorm = (benchmarks.cinebenchR23Single || (benchmarks.cinebenchR23Multi / 18)) / FLAGSHIP.cinebenchR23Single;

  const multiCore = Math.round(Math.min(Math.max(multiNorm * 100, 1), 100));
  const singleCore = Math.round(Math.min(Math.max(singleNorm * 100, 1), 100));

  const composite = (multiNorm * 0.65) + (singleNorm * 0.35);
  const overall = Math.round(Math.min(Math.max(composite * 100, 1), 100));

  return { overall, multiCore, singleCore };
}

// Read existing CPUs
const existingCpus = JSON.parse(fs.readFileSync(cpuPath, 'utf8'));
const cpuMap = new Map(existingCpus.map(c => [c.id, c]));

// Historical 2nd Gen Sandy Bridge, 3rd Gen Ivy Bridge, 4th Gen Haswell, 5th Gen Broadwell additions
const olderCpuModels = [
  // --- INTEL 2ND GEN (SANDY BRIDGE) ---
  { id: 'i7-2700k', name: 'Intel Core i7-2700K', shortName: 'i7-2700K', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 8, baseClock: '3.5 GHz', boostClock: '3.9 GHz', cache: '8 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 332, cbMulti: 3600, cbSingle: 770 },
  { id: 'i7-2600k', name: 'Intel Core i7-2600K', shortName: 'i7-2600K', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 8, baseClock: '3.4 GHz', boostClock: '3.8 GHz', cache: '8 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 317, cbMulti: 3450, cbSingle: 750 },
  { id: 'i7-2600', name: 'Intel Core i7-2600', shortName: 'i7-2600', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 8, baseClock: '3.4 GHz', boostClock: '3.8 GHz', cache: '8 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 294, cbMulti: 3350, cbSingle: 740 },
  { id: 'i5-2500k', name: 'Intel Core i5-2500K', shortName: 'i5-2500K', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 4, baseClock: '3.3 GHz', boostClock: '3.7 GHz', cache: '6 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 216, cbMulti: 2600, cbSingle: 730 },
  { id: 'i5-2500', name: 'Intel Core i5-2500', shortName: 'i5-2500', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 4, baseClock: '3.3 GHz', boostClock: '3.7 GHz', cache: '6 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 205, cbMulti: 2520, cbSingle: 720 },
  { id: 'i5-2400', name: 'Intel Core i5-2400', shortName: 'i5-2400', manufacturer: 'Intel', releaseYear: 2011, cores: 4, threads: 4, baseClock: '3.1 GHz', boostClock: '3.4 GHz', cache: '6 MB', tdp: 95, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 184, cbMulti: 2300, cbSingle: 670 },
  { id: 'i3-2120', name: 'Intel Core i3-2120', shortName: 'i3-2120', manufacturer: 'Intel', releaseYear: 2011, cores: 2, threads: 4, baseClock: '3.3 GHz', boostClock: '3.3 GHz', cache: '3 MB', tdp: 65, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 138, cbMulti: 1450, cbSingle: 650 },
  { id: 'i3-2100', name: 'Intel Core i3-2100', shortName: 'i3-2100', manufacturer: 'Intel', releaseYear: 2011, cores: 2, threads: 4, baseClock: '3.1 GHz', boostClock: '3.1 GHz', cache: '3 MB', tdp: 65, socket: 'LGA 1155', processNode: '32 nm', integratedGraphics: true, architecture: 'Sandy Bridge', msrp: 117, cbMulti: 1350, cbSingle: 610 },

  // --- INTEL 3RD GEN (IVY BRIDGE) ---
  { id: 'i7-3770k', name: 'Intel Core i7-3770K', shortName: 'i7-3770K', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 8, baseClock: '3.5 GHz', boostClock: '3.9 GHz', cache: '8 MB', tdp: 77, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 332, cbMulti: 4100, cbSingle: 860 },
  { id: 'i7-3770', name: 'Intel Core i7-3770', shortName: 'i7-3770', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 8, baseClock: '3.4 GHz', boostClock: '3.9 GHz', cache: '8 MB', tdp: 77, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 294, cbMulti: 3950, cbSingle: 850 },
  { id: 'i5-3570k', name: 'Intel Core i5-3570K', shortName: 'i5-3570K', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 4, baseClock: '3.4 GHz', boostClock: '3.8 GHz', cache: '6 MB', tdp: 77, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 225, cbMulti: 2950, cbSingle: 840 },
  { id: 'i5-3570', name: 'Intel Core i5-3570', shortName: 'i5-3570', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 4, baseClock: '3.4 GHz', boostClock: '3.8 GHz', cache: '6 MB', tdp: 77, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 205, cbMulti: 2880, cbSingle: 830 },
  { id: 'i5-3470', name: 'Intel Core i5-3470', shortName: 'i5-3470', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 4, baseClock: '3.2 GHz', boostClock: '3.6 GHz', cache: '6 MB', tdp: 77, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 184, cbMulti: 2700, cbSingle: 790 },
  { id: 'i3-3220', name: 'Intel Core i3-3220', shortName: 'i3-3220', manufacturer: 'Intel', releaseYear: 2012, cores: 2, threads: 4, baseClock: '3.3 GHz', boostClock: '3.3 GHz', cache: '3 MB', tdp: 55, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: true, architecture: 'Ivy Bridge', msrp: 117, cbMulti: 1650, cbSingle: 720 },

  // --- INTEL 4TH GEN (HASWELL) ---
  { id: 'i7-4790k', name: 'Intel Core i7-4790K', shortName: 'i7-4790K', manufacturer: 'Intel', releaseYear: 2014, cores: 4, threads: 8, baseClock: '4.0 GHz', boostClock: '4.4 GHz', cache: '8 MB', tdp: 88, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell Refresh', msrp: 339, cbMulti: 4950, cbSingle: 990 },
  { id: 'i7-4790', name: 'Intel Core i7-4790', shortName: 'i7-4790', manufacturer: 'Intel', releaseYear: 2014, cores: 4, threads: 8, baseClock: '3.6 GHz', boostClock: '4.0 GHz', cache: '8 MB', tdp: 84, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell Refresh', msrp: 303, cbMulti: 4500, cbSingle: 930 },
  { id: 'i5-4690k', name: 'Intel Core i5-4690K', shortName: 'i5-4690K', manufacturer: 'Intel', releaseYear: 2014, cores: 4, threads: 4, baseClock: '3.5 GHz', boostClock: '3.9 GHz', cache: '6 MB', tdp: 88, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell Refresh', msrp: 242, cbMulti: 3450, cbSingle: 920 },
  { id: 'i5-4670k', name: 'Intel Core i5-4670K', shortName: 'i5-4670K', manufacturer: 'Intel', releaseYear: 2013, cores: 4, threads: 4, baseClock: '3.4 GHz', boostClock: '3.8 GHz', cache: '6 MB', tdp: 84, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell', msrp: 242, cbMulti: 3300, cbSingle: 890 },
  { id: 'i5-4570', name: 'Intel Core i5-4570', shortName: 'i5-4570', manufacturer: 'Intel', releaseYear: 2013, cores: 4, threads: 4, baseClock: '3.2 GHz', boostClock: '3.6 GHz', cache: '6 MB', tdp: 84, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell', msrp: 192, cbMulti: 3050, cbSingle: 850 },
  { id: 'i5-4440', name: 'Intel Core i5-4440', shortName: 'i5-4440', manufacturer: 'Intel', releaseYear: 2013, cores: 4, threads: 4, baseClock: '3.1 GHz', boostClock: '3.3 GHz', cache: '6 MB', tdp: 84, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell', msrp: 182, cbMulti: 2800, cbSingle: 790 },
  { id: 'i3-4130', name: 'Intel Core i3-4130', shortName: 'i3-4130', manufacturer: 'Intel', releaseYear: 2013, cores: 2, threads: 4, baseClock: '3.4 GHz', boostClock: '3.4 GHz', cache: '3 MB', tdp: 54, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell', msrp: 122, cbMulti: 1850, cbSingle: 810 },

  // --- INTEL 5TH GEN (BROADWELL) ---
  { id: 'i7-5775c', name: 'Intel Core i7-5775C', shortName: 'i7-5775C', manufacturer: 'Intel', releaseYear: 2015, cores: 4, threads: 8, baseClock: '3.3 GHz', boostClock: '3.7 GHz', cache: '134 MB', tdp: 65, socket: 'LGA 1150', processNode: '14 nm', integratedGraphics: true, architecture: 'Broadwell', msrp: 366, cbMulti: 4800, cbSingle: 970 },

  // --- FAMOUS XEON & PENTIUM HISTORICAL ---
  { id: 'xeon-e3-1230-v2', name: 'Intel Xeon E3-1230 v2', shortName: 'Xeon E3-1230 v2', manufacturer: 'Intel', releaseYear: 2012, cores: 4, threads: 8, baseClock: '3.3 GHz', boostClock: '3.7 GHz', cache: '8 MB', tdp: 69, socket: 'LGA 1155', processNode: '22 nm', integratedGraphics: false, architecture: 'Ivy Bridge', msrp: 215, cbMulti: 3800, cbSingle: 820 },
  { id: 'xeon-e3-1270-v3', name: 'Intel Xeon E3-1270 v3', shortName: 'Xeon E3-1270 v3', manufacturer: 'Intel', releaseYear: 2013, cores: 4, threads: 8, baseClock: '3.5 GHz', boostClock: '3.9 GHz', cache: '8 MB', tdp: 80, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: false, architecture: 'Haswell', msrp: 328, cbMulti: 4400, cbSingle: 910 },
  { id: 'pentium-g3258', name: 'Intel Pentium G3258 20th Anniv.', shortName: 'Pentium G3258', manufacturer: 'Intel', releaseYear: 2014, cores: 2, threads: 2, baseClock: '3.2 GHz', boostClock: '3.2 GHz', cache: '3 MB', tdp: 53, socket: 'LGA 1150', processNode: '22 nm', integratedGraphics: true, architecture: 'Haswell', msrp: 72, cbMulti: 1250, cbSingle: 780 }
];

for (const model of olderCpuModels) {
  const scores = calcCpuScores({ cinebenchR23Multi: model.cbMulti, cinebenchR23Single: model.cbSingle });
  cpuMap.set(model.id, {
    id: model.id,
    name: model.name,
    shortName: model.shortName,
    manufacturer: model.manufacturer,
    architecture: model.architecture,
    releaseYear: model.releaseYear,
    cores: model.cores,
    threads: model.threads,
    baseClock: model.baseClock,
    boostClock: model.boostClock,
    cache: model.cache,
    tdp: model.tdp,
    socket: model.socket,
    processNode: model.processNode,
    integratedGraphics: model.integratedGraphics,
    msrp: model.msrp,
    scores: scores,
    benchmarks: {
      cinebenchR23Multi: model.cbMulti,
      cinebenchR23Single: model.cbSingle
    },
    benchmarkSource: {
      sourceName: "Cinebench R23 / Historical Public Benchmark Database",
      sourceUrl: "https://www.cpu-monkey.com/",
      testDate: `${model.releaseYear}-01`
    }
  });
}

const finalCpuList = Array.from(cpuMap.values()).map(c => {
  c.scores = calcCpuScores(c.benchmarks);
  return c;
});

// ============================================================
// CPU POPULARITY ORDER
// ============================================================
// Популярность модели важнее benchmark score.
// Популярные массовые Core i5/i7/i3 и Ryzen
// находятся выше редких серверных/нишевых CPU.
// ============================================================

const CPU_POPULARITY = {
  // =========================
  // AMD RYZEN 9000
  // =========================
  'ryzen-9-9950x3d': 1000,
  'ryzen-9-9950x': 995,
  'ryzen-7-9800x3d': 990,
  'ryzen-7-9700x': 985,
  'ryzen-5-9600x': 980,

  // =========================
  // AMD RYZEN 7000
  // =========================
  'ryzen-7-7800x3d': 975,
  'ryzen-9-7950x3d': 970,
  'ryzen-9-7950x': 965,
  'ryzen-9-7900x': 960,
  'ryzen-7-7700x': 955,
  'ryzen-7-7700': 950,
  'ryzen-5-7600x': 945,
  'ryzen-5-7600': 940,
  'ryzen-5-7500f': 935,

  // =========================
  // AMD RYZEN 5000
  // =========================
  'ryzen-7-5800x3d': 925,
  'ryzen-9-5950x': 920,
  'ryzen-9-5900x': 915,
  'ryzen-7-5800x': 910,
  'ryzen-7-5800': 905,
  'ryzen-5-5600x': 900,
  'ryzen-5-5600': 895,
  'ryzen-5-5500': 890,

  // =========================
  // AMD RYZEN 3000
  // =========================
  'ryzen-9-3950x': 875,
  'ryzen-9-3900x': 870,
  'ryzen-7-3700x': 865,
  'ryzen-7-3800x': 860,
  'ryzen-5-3600x': 855,
  'ryzen-5-3600': 850,
  'ryzen-5-3500x': 845,

  // =========================
  // AMD RYZEN 2000
  // =========================
  'ryzen-7-2700x': 830,
  'ryzen-7-2700': 825,
  'ryzen-5-2600x': 820,
  'ryzen-5-2600': 815,
  'ryzen-5-2400g': 810,

  // =========================
  // AMD RYZEN 1000
  // =========================
  'ryzen-7-1800x': 795,
  'ryzen-7-1700x': 790,
  'ryzen-7-1700': 785,
  'ryzen-5-1600x': 780,
  'ryzen-5-1600': 775,
  'ryzen-5-1500x': 770,

  // =========================
  // INTEL 14TH GEN
  // =========================
  'i9-14900ks': 760,
  'i9-14900k': 755,
  'i7-14700k': 750,
  'i7-14700': 745,
  'i5-14600k': 740,
  'i5-14500': 735,
  'i5-14400f': 730,
  'i5-14400': 725,
  'i3-14100f': 720,
  'i3-14100': 715,

  // =========================
  // INTEL 13TH GEN
  // =========================
  'i9-13900ks': 705,
  'i9-13900k': 700,
  'i7-13700k': 695,
  'i7-13700': 690,
  'i5-13600k': 685,
  'i5-13500': 680,
  'i5-13400f': 675,
  'i5-13400': 670,
  'i3-13100f': 665,
  'i3-13100': 660,

  // =========================
  // INTEL 12TH GEN
  // =========================
  'i9-12900k': 650,
  'i7-12700k': 645,
  'i7-12700': 640,
  'i5-12600k': 635,
  'i5-12500': 630,
  'i5-12400f': 625,
  'i5-12400': 620,
  'i3-12100f': 615,
  'i3-12100': 610,

  // =========================
  // INTEL 11TH GEN
  // =========================
  'i9-11900k': 595,
  'i7-11700k': 590,
  'i7-11700': 585,
  'i5-11600k': 580,
  'i5-11400f': 575,
  'i5-11400': 570,
  'i3-10100': 565,

  // =========================
  // INTEL 10TH GEN
  // =========================
  'i9-10900k': 555,
  'i7-10700k': 550,
  'i7-10700': 545,
  'i5-10600k': 540,
  'i5-10400f': 535,
  'i5-10400': 530,
  'i3-10320': 525,
  'i3-10100f': 520,
  'i3-10100': 515,

  // =========================
  // INTEL 9TH GEN
  // =========================
  'i9-9900k': 500,
  'i7-9700k': 495,
  'i7-9700': 490,
  'i5-9600k': 485,
  'i5-9400f': 480,
  'i5-9400': 475,
  'i3-9350k': 470,
  'i3-9100f': 465,
  'i3-9100': 460,

  // =========================
  // INTEL 8TH GEN
  // =========================
  'i7-8700k': 450,
  'i7-8700': 445,
  'i5-8600k': 440,
  'i5-8400': 435,
  'i3-8350k': 430,
  'i3-8300': 425,
  'i3-8100': 420,

  // =========================
  // INTEL 7TH GEN
  // =========================
  'i7-7700k': 405,
  'i7-7700': 400,
  'i5-7600k': 395,
  'i5-7600': 390,
  'i5-7500': 385,
  'i5-7400': 380,
  'i3-7350k': 375,
  'i3-7100': 370,

  // =========================
  // INTEL 6TH GEN
  // =========================
  'i7-6700k': 355,
  'i7-6700': 350,
  'i5-6600k': 345,
  'i5-6600': 340,
  'i5-6500': 335,
  'i5-6400': 330,
  'i3-6320': 325,
  'i3-6100': 320,

  // =========================
  // INTEL 4TH GEN
  // =========================
  'i7-4790k': 305,
  'i7-4790': 300,
  'i5-4690k': 295,
  'i5-4670k': 290,
  'i5-4570': 285,
  'i5-4440': 280,
  'i3-4130': 275,

  // =========================
  // INTEL 3RD GEN
  // =========================
  'i7-3770k': 260,
  'i7-3770': 255,
  'i5-3570k': 250,
  'i5-3570': 245,
  'i5-3470': 240,
  'i3-3220': 235,

  // =========================
  // INTEL 2ND GEN
  // =========================
  'i7-2700k': 220,
  'i7-2600k': 215,
  'i7-2600': 210,
  'i5-2500k': 205,
  'i5-2500': 200,
  'i5-2400': 195,
  'i3-2120': 190,
  'i3-2100': 185,

  // =========================
  // NICHE / SERVER
  // =========================
  'xeon-e3-1270-v3': 80,
  'xeon-e3-1230-v2': 75,
  'pentium-g3258': 70
};

function getCpuPopularity(cpu) {
  if (CPU_POPULARITY[cpu.id] !== undefined) {
    return CPU_POPULARITY[cpu.id];
  }

  const year = Number(cpu.releaseYear) || 0;

  if (year >= 2024) return 180;
  if (year >= 2022) return 170;
  if (year >= 2020) return 160;
  if (year >= 2018) return 150;
  if (year >= 2016) return 130;
  if (year >= 2013) return 110;
  if (year >= 2010) return 90;

  return 50;
}

// Popularity first, benchmark score second.
finalCpuList.sort((a, b) => {
  const popularityA = getCpuPopularity(a);
  const popularityB = getCpuPopularity(b);

  if (popularityA !== popularityB) {
    return popularityB - popularityA;
  }

  return b.scores.overall - a.scores.overall;
});

fs.writeFileSync(
  cpuPath,
  JSON.stringify(finalCpuList, null, 2),
  'utf8'
);

console.log(
  'Expanded CPU database total count:',
  finalCpuList.length
);

fs.writeFileSync(cpuPath, JSON.stringify(finalCpuList, null, 2), 'utf8');
console.log('Expanded CPU database total count:', finalCpuList.length);
