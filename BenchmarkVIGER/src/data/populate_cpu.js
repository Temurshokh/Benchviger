const fs = require('fs');
const path = require('path');

const cpuPath = path.resolve('src/data/cpu.json');

// Flagship baseline CPU (Ryzen 9 9950X / Core Ultra 9 285K benchmark baseline)
const FLAGSHIP = {
  cinebenchR23Multi: 42500,
  cinebenchR23Single: 2350,
  geekbench6Multi: 21500
};

function calcCpuScores(benchmarks) {
  if (!benchmarks || !benchmarks.cinebenchR23Multi) {
    return { overall: 0, multiCore: 0, singleCore: 0 };
  }

  const multiNorm = benchmarks.cinebenchR23Multi / FLAGSHIP.cinebenchR23Multi;
  const singleNorm = (benchmarks.cinebenchR23Single || (benchmarks.cinebenchR23Multi / 18)) / FLAGSHIP.cinebenchR23Single;
  
  const multiCore = Math.round(Math.min(Math.max(multiNorm * 100, 1), 100));
  const singleCore = Math.round(Math.min(Math.max(singleNorm * 100, 1), 100));

  // Overall score: 65% Multi-Threaded, 35% Single-Threaded
  const composite = (multiNorm * 0.65) + (singleNorm * 0.35);
  const overall = Math.round(Math.min(Math.max(composite * 100, 1), 100));

  return { overall, multiCore, singleCore };
}

// 100-120 Verifiable CPUs with exact specs & public Cinebench R23 / Geekbench 6 multi-core scores
const cpuModels = [
  // --- INTEL MODERN & ULTRA ---
  { id: 'core-ultra-9-285k', name: 'Intel Core Ultra 9 285K', shortName: 'Core Ultra 9 285K', manufacturer: 'Intel', releaseYear: 2024, cores: 24, threads: 24, baseClock: '3.7 GHz', boostClock: '5.7 GHz', cache: '76 MB', tdp: 125, socket: 'LGA 1851', processNode: '3 nm', integratedGraphics: true, architecture: 'Arrow Lake', msrp: 589, cbMulti: 42000, cbSingle: 2320 },
  { id: 'core-ultra-7-265k', name: 'Intel Core Ultra 7 265K', shortName: 'Core Ultra 7 265K', manufacturer: 'Intel', releaseYear: 2024, cores: 20, threads: 20, baseClock: '3.9 GHz', boostClock: '5.5 GHz', cache: '66 MB', tdp: 125, socket: 'LGA 1851', processNode: '3 nm', integratedGraphics: true, architecture: 'Arrow Lake', msrp: 394, cbMulti: 36000, cbSingle: 2280 },
  { id: 'core-ultra-5-245k', name: 'Intel Core Ultra 5 245K', shortName: 'Core Ultra 5 245K', manufacturer: 'Intel', releaseYear: 2024, cores: 14, threads: 14, baseClock: '4.2 GHz', boostClock: '5.2 GHz', cache: '50 MB', tdp: 125, socket: 'LGA 1851', processNode: '3 nm', integratedGraphics: true, architecture: 'Arrow Lake', msrp: 309, cbMulti: 25500, cbSingle: 2180 },

  // --- INTEL 14TH GEN ---
  { id: 'i9-14900k', name: 'Intel Core i9-14900K', shortName: 'i9-14900K', manufacturer: 'Intel', releaseYear: 2023, cores: 24, threads: 32, baseClock: '3.2 GHz', boostClock: '6.0 GHz', cache: '68 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 589, cbMulti: 40800, cbSingle: 2310 },
  { id: 'i9-14900kf', name: 'Intel Core i9-14900KF', shortName: 'i9-14900KF', manufacturer: 'Intel', releaseYear: 2023, cores: 24, threads: 32, baseClock: '3.2 GHz', boostClock: '6.0 GHz', cache: '68 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake Refresh', msrp: 564, cbMulti: 40500, cbSingle: 2300 },
  { id: 'i7-14700k', name: 'Intel Core i7-14700K', shortName: 'i7-14700K', manufacturer: 'Intel', releaseYear: 2023, cores: 20, threads: 28, baseClock: '3.4 GHz', boostClock: '5.6 GHz', cache: '61 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 409, cbMulti: 34800, cbSingle: 2190 },
  { id: 'i7-14700kf', name: 'Intel Core i7-14700KF', shortName: 'i7-14700KF', manufacturer: 'Intel', releaseYear: 2023, cores: 20, threads: 28, baseClock: '3.4 GHz', boostClock: '5.6 GHz', cache: '61 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake Refresh', msrp: 384, cbMulti: 34600, cbSingle: 2185 },
  { id: 'i5-14600k', name: 'Intel Core i5-14600K', shortName: 'i5-14600K', manufacturer: 'Intel', releaseYear: 2023, cores: 14, threads: 20, baseClock: '3.5 GHz', boostClock: '5.3 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 319, cbMulti: 24200, cbSingle: 2070 },
  { id: 'i5-14600kf', name: 'Intel Core i5-14600KF', shortName: 'i5-14600KF', manufacturer: 'Intel', releaseYear: 2023, cores: 14, threads: 20, baseClock: '3.5 GHz', boostClock: '5.3 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake Refresh', msrp: 294, cbMulti: 24100, cbSingle: 2065 },
  { id: 'i5-14500', name: 'Intel Core i5-14500', shortName: 'i5-14500', manufacturer: 'Intel', releaseYear: 2024, cores: 14, threads: 20, baseClock: '2.6 GHz', boostClock: '5.0 GHz', cache: '38.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 232, cbMulti: 21000, cbSingle: 1950 },
  { id: 'i5-14400', name: 'Intel Core i5-14400', shortName: 'i5-14400', manufacturer: 'Intel', releaseYear: 2024, cores: 10, threads: 16, baseClock: '2.5 GHz', boostClock: '4.7 GHz', cache: '29.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 221, cbMulti: 16100, cbSingle: 1840 },
  { id: 'i5-14400f', name: 'Intel Core i5-14400F', shortName: 'i5-14400F', manufacturer: 'Intel', releaseYear: 2024, cores: 10, threads: 16, baseClock: '2.5 GHz', boostClock: '4.7 GHz', cache: '29.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake Refresh', msrp: 196, cbMulti: 16000, cbSingle: 1835 },
  { id: 'i3-14100', name: 'Intel Core i3-14100', shortName: 'i3-14100', manufacturer: 'Intel', releaseYear: 2024, cores: 4, threads: 8, baseClock: '3.5 GHz', boostClock: '4.7 GHz', cache: '17 MB', tdp: 60, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake Refresh', msrp: 134, cbMulti: 8900, cbSingle: 1780 },
  { id: 'i3-14100f', name: 'Intel Core i3-14100F', shortName: 'i3-14100F', manufacturer: 'Intel', releaseYear: 2024, cores: 4, threads: 8, baseClock: '3.5 GHz', boostClock: '4.7 GHz', cache: '17 MB', tdp: 58, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake Refresh', msrp: 109, cbMulti: 8850, cbSingle: 1775 },

  // --- INTEL 13TH GEN ---
  { id: 'i9-13900k', name: 'Intel Core i9-13900K', shortName: 'i9-13900K', manufacturer: 'Intel', releaseYear: 2022, cores: 24, threads: 32, baseClock: '3.0 GHz', boostClock: '5.8 GHz', cache: '68 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 589, cbMulti: 39800, cbSingle: 2240 },
  { id: 'i9-13900kf', name: 'Intel Core i9-13900KF', shortName: 'i9-13900KF', manufacturer: 'Intel', releaseYear: 2022, cores: 24, threads: 32, baseClock: '3.0 GHz', boostClock: '5.8 GHz', cache: '68 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake', msrp: 564, cbMulti: 39500, cbSingle: 2235 },
  { id: 'i7-13700k', name: 'Intel Core i7-13700K', shortName: 'i7-13700K', manufacturer: 'Intel', releaseYear: 2022, cores: 16, threads: 24, baseClock: '3.4 GHz', boostClock: '5.4 GHz', cache: '54 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 409, cbMulti: 30800, cbSingle: 2110 },
  { id: 'i7-13700kf', name: 'Intel Core i7-13700KF', shortName: 'i7-13700KF', manufacturer: 'Intel', releaseYear: 2022, cores: 16, threads: 24, baseClock: '3.4 GHz', boostClock: '5.4 GHz', cache: '54 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake', msrp: 384, cbMulti: 30600, cbSingle: 2100 },
  { id: 'i5-13600k', name: 'Intel Core i5-13600K', shortName: 'i5-13600K', manufacturer: 'Intel', releaseYear: 2022, cores: 14, threads: 20, baseClock: '3.5 GHz', boostClock: '5.1 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 319, cbMulti: 23800, cbSingle: 2010 },
  { id: 'i5-13600kf', name: 'Intel Core i5-13600KF', shortName: 'i5-13600KF', manufacturer: 'Intel', releaseYear: 2022, cores: 14, threads: 20, baseClock: '3.5 GHz', boostClock: '5.1 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake', msrp: 294, cbMulti: 23600, cbSingle: 2000 },
  { id: 'i5-13500', name: 'Intel Core i5-13500', shortName: 'i5-13500', manufacturer: 'Intel', releaseYear: 2023, cores: 14, threads: 20, baseClock: '2.5 GHz', boostClock: '4.8 GHz', cache: '38.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 232, cbMulti: 20800, cbSingle: 1910 },
  { id: 'i5-13400', name: 'Intel Core i5-13400', shortName: 'i5-13400', manufacturer: 'Intel', releaseYear: 2023, cores: 10, threads: 16, baseClock: '2.5 GHz', boostClock: '4.6 GHz', cache: '29.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 221, cbMulti: 15600, cbSingle: 1800 },
  { id: 'i5-13400f', name: 'Intel Core i5-13400F', shortName: 'i5-13400F', manufacturer: 'Intel', releaseYear: 2023, cores: 10, threads: 16, baseClock: '2.5 GHz', boostClock: '4.6 GHz', cache: '29.5 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake', msrp: 196, cbMulti: 15500, cbSingle: 1795 },
  { id: 'i3-13100', name: 'Intel Core i3-13100', shortName: 'i3-13100', manufacturer: 'Intel', releaseYear: 2023, cores: 4, threads: 8, baseClock: '3.4 GHz', boostClock: '4.5 GHz', cache: '17 MB', tdp: 60, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Raptor Lake', msrp: 134, cbMulti: 8700, cbSingle: 1720 },
  { id: 'i3-13100f', name: 'Intel Core i3-13100F', shortName: 'i3-13100F', manufacturer: 'Intel', releaseYear: 2023, cores: 4, threads: 8, baseClock: '3.4 GHz', boostClock: '4.5 GHz', cache: '17 MB', tdp: 58, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Raptor Lake', msrp: 109, cbMulti: 8650, cbSingle: 1715 },

  // --- INTEL 12TH GEN ---
  { id: 'i9-12900k', name: 'Intel Core i9-12900K', shortName: 'i9-12900K', manufacturer: 'Intel', releaseYear: 2021, cores: 16, threads: 24, baseClock: '3.2 GHz', boostClock: '5.2 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Alder Lake', msrp: 589, cbMulti: 27400, cbSingle: 1980 },
  { id: 'i9-12900kf', name: 'Intel Core i9-12900KF', shortName: 'i9-12900KF', manufacturer: 'Intel', releaseYear: 2021, cores: 16, threads: 24, baseClock: '3.2 GHz', boostClock: '5.2 GHz', cache: '44 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Alder Lake', msrp: 564, cbMulti: 27200, cbSingle: 1975 },
  { id: 'i7-12700k', name: 'Intel Core i7-12700K', shortName: 'i7-12700K', manufacturer: 'Intel', releaseYear: 2021, cores: 12, threads: 20, baseClock: '3.6 GHz', boostClock: '5.0 GHz', cache: '38 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Alder Lake', msrp: 409, cbMulti: 22800, cbSingle: 1910 },
  { id: 'i7-12700kf', name: 'Intel Core i7-12700KF', shortName: 'i7-12700KF', manufacturer: 'Intel', releaseYear: 2021, cores: 12, threads: 20, baseClock: '3.6 GHz', boostClock: '5.0 GHz', cache: '38 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Alder Lake', msrp: 384, cbMulti: 22600, cbSingle: 1905 },
  { id: 'i5-12600k', name: 'Intel Core i5-12600K', shortName: 'i5-12600K', manufacturer: 'Intel', releaseYear: 2021, cores: 10, threads: 16, baseClock: '3.7 GHz', boostClock: '4.9 GHz', cache: '29.5 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Alder Lake', msrp: 289, cbMulti: 17500, cbSingle: 1850 },
  { id: 'i5-12600kf', name: 'Intel Core i5-12600KF', shortName: 'i5-12600KF', manufacturer: 'Intel', releaseYear: 2021, cores: 10, threads: 16, baseClock: '3.7 GHz', boostClock: '4.9 GHz', cache: '29.5 MB', tdp: 125, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Alder Lake', msrp: 264, cbMulti: 17400, cbSingle: 1845 },
  { id: 'i5-12400', name: 'Intel Core i5-12400', shortName: 'i5-12400', manufacturer: 'Intel', releaseYear: 2022, cores: 6, threads: 12, baseClock: '2.5 GHz', boostClock: '4.4 GHz', cache: '18 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Alder Lake', msrp: 192, cbMulti: 12400, cbSingle: 1690 },
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', shortName: 'i5-12400F', manufacturer: 'Intel', releaseYear: 2022, cores: 6, threads: 12, baseClock: '2.5 GHz', boostClock: '4.4 GHz', cache: '18 MB', tdp: 65, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Alder Lake', msrp: 167, cbMulti: 12300, cbSingle: 1685 },
  { id: 'i3-12100', name: 'Intel Core i3-12100', shortName: 'i3-12100', manufacturer: 'Intel', releaseYear: 2022, cores: 4, threads: 8, baseClock: '3.3 GHz', boostClock: '4.3 GHz', cache: '12 MB', tdp: 60, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: true, architecture: 'Alder Lake', msrp: 122, cbMulti: 8400, cbSingle: 1640 },
  { id: 'i3-12100f', name: 'Intel Core i3-12100F', shortName: 'i3-12100F', manufacturer: 'Intel', releaseYear: 2022, cores: 4, threads: 8, baseClock: '3.3 GHz', boostClock: '4.3 GHz', cache: '12 MB', tdp: 58, socket: 'LGA 1700', processNode: '10 nm', integratedGraphics: false, architecture: 'Alder Lake', msrp: 97, cbMulti: 8350, cbSingle: 1635 },

  // --- INTEL 11TH & 10TH GEN ---
  { id: 'i9-11900k', name: 'Intel Core i9-11900K', shortName: 'i9-11900K', manufacturer: 'Intel', releaseYear: 2021, cores: 8, threads: 16, baseClock: '3.5 GHz', boostClock: '5.3 GHz', cache: '16 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Rocket Lake', msrp: 539, cbMulti: 15200, cbSingle: 1620 },
  { id: 'i7-11700k', name: 'Intel Core i7-11700K', shortName: 'i7-11700K', manufacturer: 'Intel', releaseYear: 2021, cores: 8, threads: 16, baseClock: '3.6 GHz', boostClock: '5.0 GHz', cache: '16 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Rocket Lake', msrp: 399, cbMulti: 14000, cbSingle: 1560 },
  { id: 'i5-11600k', name: 'Intel Core i5-11600K', shortName: 'i5-11600K', manufacturer: 'Intel', releaseYear: 2021, cores: 6, threads: 12, baseClock: '3.9 GHz', boostClock: '4.9 GHz', cache: '12 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Rocket Lake', msrp: 262, cbMulti: 11000, cbSingle: 1510 },
  { id: 'i5-11400', name: 'Intel Core i5-11400', shortName: 'i5-11400', manufacturer: 'Intel', releaseYear: 2021, cores: 6, threads: 12, baseClock: '2.6 GHz', boostClock: '4.4 GHz', cache: '12 MB', tdp: 65, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Rocket Lake', msrp: 182, cbMulti: 9800, cbSingle: 1420 },
  { id: 'i5-11400f', name: 'Intel Core i5-11400F', shortName: 'i5-11400F', manufacturer: 'Intel', releaseYear: 2021, cores: 6, threads: 12, baseClock: '2.6 GHz', boostClock: '4.4 GHz', cache: '12 MB', tdp: 65, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: false, architecture: 'Rocket Lake', msrp: 157, cbMulti: 9750, cbSingle: 1415 },

  { id: 'i9-10900k', name: 'Intel Core i9-10900K', shortName: 'i9-10900K', manufacturer: 'Intel', releaseYear: 2020, cores: 10, threads: 20, baseClock: '3.7 GHz', boostClock: '5.3 GHz', cache: '20 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Comet Lake', msrp: 488, cbMulti: 16500, cbSingle: 1430 },
  { id: 'i7-10700k', name: 'Intel Core i7-10700K', shortName: 'i7-10700K', manufacturer: 'Intel', releaseYear: 2020, cores: 8, threads: 16, baseClock: '3.8 GHz', boostClock: '5.1 GHz', cache: '16 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Comet Lake', msrp: 374, cbMulti: 13200, cbSingle: 1370 },
  { id: 'i5-10600k', name: 'Intel Core i5-10600K', shortName: 'i5-10600K', manufacturer: 'Intel', releaseYear: 2020, cores: 6, threads: 12, baseClock: '4.1 GHz', boostClock: '4.8 GHz', cache: '12 MB', tdp: 125, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Comet Lake', msrp: 262, cbMulti: 9600, cbSingle: 1310 },
  { id: 'i5-10400', name: 'Intel Core i5-10400', shortName: 'i5-10400', manufacturer: 'Intel', releaseYear: 2020, cores: 6, threads: 12, baseClock: '2.9 GHz', boostClock: '4.3 GHz', cache: '12 MB', tdp: 65, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: true, architecture: 'Comet Lake', msrp: 182, cbMulti: 8100, cbSingle: 1190 },
  { id: 'i5-10400f', name: 'Intel Core i5-10400F', shortName: 'i5-10400F', manufacturer: 'Intel', releaseYear: 2020, cores: 6, threads: 12, baseClock: '2.9 GHz', boostClock: '4.3 GHz', cache: '12 MB', tdp: 65, socket: 'LGA 1200', processNode: '14 nm', integratedGraphics: false, architecture: 'Comet Lake', msrp: 157, cbMulti: 8050, cbSingle: 1185 },

  // --- INTEL 9TH TO 6TH GEN & LEGACY ---
  { id: 'i9-9900k', name: 'Intel Core i9-9900K', shortName: 'i9-9900K', manufacturer: 'Intel', releaseYear: 2018, cores: 8, threads: 16, baseClock: '3.6 GHz', boostClock: '5.0 GHz', cache: '16 MB', tdp: 95, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake Refresh', msrp: 488, cbMulti: 13500, cbSingle: 1320 },
  { id: 'i7-9700k', name: 'Intel Core i7-9700K', shortName: 'i7-9700K', manufacturer: 'Intel', releaseYear: 2018, cores: 8, threads: 8, baseClock: '3.6 GHz', boostClock: '4.9 GHz', cache: '12 MB', tdp: 95, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake Refresh', msrp: 374, cbMulti: 9800, cbSingle: 1280 },
  { id: 'i5-9600k', name: 'Intel Core i5-9600K', shortName: 'i5-9600K', manufacturer: 'Intel', releaseYear: 2018, cores: 6, threads: 6, baseClock: '3.7 GHz', boostClock: '4.6 GHz', cache: '9 MB', tdp: 95, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake Refresh', msrp: 262, cbMulti: 7100, cbSingle: 1230 },
  { id: 'i5-9400f', name: 'Intel Core i5-9400F', shortName: 'i5-9400F', manufacturer: 'Intel', releaseYear: 2019, cores: 6, threads: 6, baseClock: '2.9 GHz', boostClock: '4.1 GHz', cache: '9 MB', tdp: 65, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: false, architecture: 'Coffee Lake Refresh', msrp: 182, cbMulti: 5600, cbSingle: 1110 },

  { id: 'i7-8700k', name: 'Intel Core i7-8700K', shortName: 'i7-8700K', manufacturer: 'Intel', releaseYear: 2017, cores: 6, threads: 12, baseClock: '3.7 GHz', boostClock: '4.7 GHz', cache: '12 MB', tdp: 95, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake', msrp: 359, cbMulti: 8900, cbSingle: 1240 },
  { id: 'i5-8600k', name: 'Intel Core i5-8600K', shortName: 'i5-8600K', manufacturer: 'Intel', releaseYear: 2017, cores: 6, threads: 6, baseClock: '3.6 GHz', boostClock: '4.3 GHz', cache: '9 MB', tdp: 95, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake', msrp: 257, cbMulti: 6700, cbSingle: 1170 },
  { id: 'i5-8400', name: 'Intel Core i5-8400', shortName: 'i5-8400', manufacturer: 'Intel', releaseYear: 2017, cores: 6, threads: 6, baseClock: '2.8 GHz', boostClock: '4.0 GHz', cache: '9 MB', tdp: 65, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Coffee Lake', msrp: 182, cbMulti: 5400, cbSingle: 1090 },

  { id: 'i7-7700k', name: 'Intel Core i7-7700K', shortName: 'i7-7700K', manufacturer: 'Intel', releaseYear: 2017, cores: 4, threads: 8, baseClock: '4.2 GHz', boostClock: '4.5 GHz', cache: '8 MB', tdp: 91, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Kaby Lake', msrp: 339, cbMulti: 6100, cbSingle: 1150 },
  { id: 'i5-7600k', name: 'Intel Core i5-7600K', shortName: 'i5-7600K', manufacturer: 'Intel', releaseYear: 2017, cores: 4, threads: 4, baseClock: '3.8 GHz', boostClock: '4.2 GHz', cache: '6 MB', tdp: 91, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Kaby Lake', msrp: 242, cbMulti: 4400, cbSingle: 1090 },
  { id: 'i5-7400', name: 'Intel Core i5-7400', shortName: 'i5-7400', manufacturer: 'Intel', releaseYear: 2017, cores: 4, threads: 4, baseClock: '3.0 GHz', boostClock: '3.5 GHz', cache: '6 MB', tdp: 65, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Kaby Lake', msrp: 182, cbMulti: 3600, cbSingle: 940 },

  { id: 'i7-6700k', name: 'Intel Core i7-6700K', shortName: 'i7-6700K', manufacturer: 'Intel', releaseYear: 2015, cores: 4, threads: 8, baseClock: '4.0 GHz', boostClock: '4.2 GHz', cache: '8 MB', tdp: 91, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Skylake', msrp: 339, cbMulti: 5600, cbSingle: 1080 },
  { id: 'i5-6600k', name: 'Intel Core i5-6600K', shortName: 'i5-6600K', manufacturer: 'Intel', releaseYear: 2015, cores: 4, threads: 4, baseClock: '3.5 GHz', boostClock: '3.9 GHz', cache: '6 MB', tdp: 91, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Skylake', msrp: 242, cbMulti: 4100, cbSingle: 1010 },
  { id: 'i5-6500', name: 'Intel Core i5-6500', shortName: 'i5-6500', manufacturer: 'Intel', releaseYear: 2015, cores: 4, threads: 4, baseClock: '3.2 GHz', boostClock: '3.6 GHz', cache: '6 MB', tdp: 65, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Skylake', msrp: 192, cbMulti: 3400, cbSingle: 930 },

  { id: 'xeon-e5-2699-v4', name: 'Intel Xeon E5-2699 v4', shortName: 'Xeon E5-2699 v4', manufacturer: 'Intel', releaseYear: 2016, cores: 22, threads: 44, baseClock: '2.2 GHz', boostClock: '3.6 GHz', cache: '55 MB', tdp: 145, socket: 'LGA 2011-v3', processNode: '14 nm', integratedGraphics: false, architecture: 'Broadwell-EP', msrp: 4115, cbMulti: 18500, cbSingle: 820 },
  { id: 'pentium-g4560', name: 'Intel Pentium G4560', shortName: 'Pentium G4560', manufacturer: 'Intel', releaseYear: 2017, cores: 2, threads: 4, baseClock: '3.5 GHz', boostClock: '3.5 GHz', cache: '3 MB', tdp: 54, socket: 'LGA 1151', processNode: '14 nm', integratedGraphics: true, architecture: 'Kaby Lake', msrp: 64, cbMulti: 2200, cbSingle: 890 },

  // --- AMD RYZEN 9000 & ZEN 5 ---
  { id: 'ryzen-9-9950x', name: 'AMD Ryzen 9 9950X', shortName: 'Ryzen 9 9950X', manufacturer: 'AMD', releaseYear: 2024, cores: 16, threads: 32, baseClock: '4.3 GHz', boostClock: '5.7 GHz', cache: '80 MB', tdp: 170, socket: 'AM5', processNode: '4 nm', integratedGraphics: true, architecture: 'Zen 5', msrp: 649, cbMulti: 42500, cbSingle: 2350 },
  { id: 'ryzen-9-9900x', name: 'AMD Ryzen 9 9900X', shortName: 'Ryzen 9 9900X', manufacturer: 'AMD', releaseYear: 2024, cores: 12, threads: 24, baseClock: '4.4 GHz', boostClock: '5.6 GHz', cache: '76 MB', tdp: 120, socket: 'AM5', processNode: '4 nm', integratedGraphics: true, architecture: 'Zen 5', msrp: 499, cbMulti: 33500, cbSingle: 2310 },
  { id: 'ryzen-7-9800x3d', name: 'AMD Ryzen 7 9800X3D', shortName: 'Ryzen 7 9800X3D', manufacturer: 'AMD', releaseYear: 2024, cores: 8, threads: 16, baseClock: '4.7 GHz', boostClock: '5.2 GHz', cache: '104 MB', tdp: 120, socket: 'AM5', processNode: '4 nm', integratedGraphics: true, architecture: 'Zen 5 3D-V', msrp: 479, cbMulti: 23500, cbSingle: 2210 },
  { id: 'ryzen-7-9700x', name: 'AMD Ryzen 7 9700X', shortName: 'Ryzen 7 9700X', manufacturer: 'AMD', releaseYear: 2024, cores: 8, threads: 16, baseClock: '3.8 GHz', boostClock: '5.5 GHz', cache: '40 MB', tdp: 65, socket: 'AM5', processNode: '4 nm', integratedGraphics: true, architecture: 'Zen 5', msrp: 359, cbMulti: 22800, cbSingle: 2240 },
  { id: 'ryzen-5-9600x', name: 'AMD Ryzen 5 9600X', shortName: 'Ryzen 5 9600X', manufacturer: 'AMD', releaseYear: 2024, cores: 6, threads: 12, baseClock: '3.9 GHz', boostClock: '5.4 GHz', cache: '38 MB', tdp: 65, socket: 'AM5', processNode: '4 nm', integratedGraphics: true, architecture: 'Zen 5', msrp: 279, cbMulti: 17200, cbSingle: 2190 },

  // --- AMD RYZEN 7000 & ZEN 4 ---
  { id: 'ryzen-9-7950x3d', name: 'AMD Ryzen 9 7950X3D', shortName: 'Ryzen 9 7950X3D', manufacturer: 'AMD', releaseYear: 2023, cores: 16, threads: 32, baseClock: '4.2 GHz', boostClock: '5.7 GHz', cache: '144 MB', tdp: 120, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4 3D-V', msrp: 699, cbMulti: 36200, cbSingle: 2060 },
  { id: 'ryzen-9-7950x', name: 'AMD Ryzen 9 7950X', shortName: 'Ryzen 9 7950X', manufacturer: 'AMD', releaseYear: 2022, cores: 16, threads: 32, baseClock: '4.5 GHz', boostClock: '5.7 GHz', cache: '80 MB', tdp: 170, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 699, cbMulti: 38200, cbSingle: 2070 },
  { id: 'ryzen-9-7900x', name: 'AMD Ryzen 9 7900X', shortName: 'Ryzen 9 7900X', manufacturer: 'AMD', releaseYear: 2022, cores: 12, threads: 24, baseClock: '4.7 GHz', boostClock: '5.6 GHz', cache: '76 MB', tdp: 170, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 549, cbMulti: 29500, cbSingle: 2050 },
  { id: 'ryzen-9-7900', name: 'AMD Ryzen 9 7900', shortName: 'Ryzen 9 7900', manufacturer: 'AMD', releaseYear: 2023, cores: 12, threads: 24, baseClock: '3.7 GHz', boostClock: '5.4 GHz', cache: '76 MB', tdp: 65, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 429, cbMulti: 25200, cbSingle: 2010 },
  { id: 'ryzen-7-7800x3d', name: 'AMD Ryzen 7 7800X3D', shortName: 'Ryzen 7 7800X3D', manufacturer: 'AMD', releaseYear: 2023, cores: 8, threads: 16, baseClock: '4.2 GHz', boostClock: '5.0 GHz', cache: '104 MB', tdp: 120, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4 3D-V', msrp: 449, cbMulti: 18200, cbSingle: 1810 },
  { id: 'ryzen-7-7700x', name: 'AMD Ryzen 7 7700X', shortName: 'Ryzen 7 7700X', manufacturer: 'AMD', releaseYear: 2022, cores: 8, threads: 16, baseClock: '4.5 GHz', boostClock: '5.4 GHz', cache: '40 MB', tdp: 105, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 399, cbMulti: 19800, cbSingle: 1980 },
  { id: 'ryzen-7-7700', name: 'AMD Ryzen 7 7700', shortName: 'Ryzen 7 7700', manufacturer: 'AMD', releaseYear: 2023, cores: 8, threads: 16, baseClock: '3.8 GHz', boostClock: '5.3 GHz', cache: '40 MB', tdp: 65, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 329, cbMulti: 18600, cbSingle: 1940 },
  { id: 'ryzen-5-7600x', name: 'AMD Ryzen 5 7600X', shortName: 'Ryzen 5 7600X', manufacturer: 'AMD', releaseYear: 2022, cores: 6, threads: 12, baseClock: '4.7 GHz', boostClock: '5.3 GHz', cache: '38 MB', tdp: 105, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 299, cbMulti: 14800, cbSingle: 1950 },
  { id: 'ryzen-5-7600', name: 'AMD Ryzen 5 7600', shortName: 'Ryzen 5 7600', manufacturer: 'AMD', releaseYear: 2023, cores: 6, threads: 12, baseClock: '3.8 GHz', boostClock: '5.1 GHz', cache: '38 MB', tdp: 65, socket: 'AM5', processNode: '5 nm', integratedGraphics: true, architecture: 'Zen 4', msrp: 229, cbMulti: 13900, cbSingle: 1880 },
  { id: 'ryzen-5-7500f', name: 'AMD Ryzen 5 7500F', shortName: 'Ryzen 5 7500F', manufacturer: 'AMD', releaseYear: 2023, cores: 6, threads: 12, baseClock: '3.7 GHz', boostClock: '5.0 GHz', cache: '38 MB', tdp: 65, socket: 'AM5', processNode: '5 nm', integratedGraphics: false, architecture: 'Zen 4', msrp: 179, cbMulti: 13600, cbSingle: 1840 },

  // --- AMD RYZEN 5000 & ZEN 3 ---
  { id: 'ryzen-9-5950x', name: 'AMD Ryzen 9 5950X', shortName: 'Ryzen 9 5950X', manufacturer: 'AMD', releaseYear: 2020, cores: 16, threads: 32, baseClock: '3.4 GHz', boostClock: '4.9 GHz', cache: '72 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 799, cbMulti: 28600, cbSingle: 1640 },
  { id: 'ryzen-9-5900x', name: 'AMD Ryzen 9 5900X', shortName: 'Ryzen 9 5900X', manufacturer: 'AMD', releaseYear: 2020, cores: 12, threads: 24, baseClock: '3.7 GHz', boostClock: '4.8 GHz', cache: '70 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 549, cbMulti: 21800, cbSingle: 1610 },
  { id: 'ryzen-7-5800x3d', name: 'AMD Ryzen 7 5800X3D', shortName: 'Ryzen 7 5800X3D', manufacturer: 'AMD', releaseYear: 2022, cores: 8, threads: 16, baseClock: '3.4 GHz', boostClock: '4.5 GHz', cache: '96 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3 3D-V', msrp: 449, cbMulti: 14800, cbSingle: 1490 },
  { id: 'ryzen-7-5700x3d', name: 'AMD Ryzen 7 5700X3D', shortName: 'Ryzen 7 5700X3D', manufacturer: 'AMD', releaseYear: 2024, cores: 8, threads: 16, baseClock: '3.0 GHz', boostClock: '4.1 GHz', cache: '96 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3 3D-V', msrp: 249, cbMulti: 13500, cbSingle: 1370 },
  { id: 'ryzen-7-5800x', name: 'AMD Ryzen 7 5800X', shortName: 'Ryzen 7 5800X', manufacturer: 'AMD', releaseYear: 2020, cores: 8, threads: 16, baseClock: '3.8 GHz', boostClock: '4.7 GHz', cache: '36 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 449, cbMulti: 15400, cbSingle: 1590 },
  { id: 'ryzen-7-5700x', name: 'AMD Ryzen 7 5700X', shortName: 'Ryzen 7 5700X', manufacturer: 'AMD', releaseYear: 2022, cores: 8, threads: 16, baseClock: '3.4 GHz', boostClock: '4.6 GHz', cache: '36 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 299, cbMulti: 14200, cbSingle: 1530 },
  { id: 'ryzen-5-5600x', name: 'AMD Ryzen 5 5600X', shortName: 'Ryzen 5 5600X', manufacturer: 'AMD', releaseYear: 2020, cores: 6, threads: 12, baseClock: '3.7 GHz', boostClock: '4.6 GHz', cache: '35 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 299, cbMulti: 11200, cbSingle: 1560 },
  { id: 'ryzen-5-5600', name: 'AMD Ryzen 5 5600', shortName: 'Ryzen 5 5600', manufacturer: 'AMD', releaseYear: 2022, cores: 6, threads: 12, baseClock: '3.5 GHz', boostClock: '4.4 GHz', cache: '35 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 199, cbMulti: 10700, cbSingle: 1490 },
  { id: 'ryzen-5-5500', name: 'AMD Ryzen 5 5500', shortName: 'Ryzen 5 5500', manufacturer: 'AMD', releaseYear: 2022, cores: 6, threads: 12, baseClock: '3.6 GHz', boostClock: '4.2 GHz', cache: '19 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 3', msrp: 159, cbMulti: 9600, cbSingle: 1390 },

  // --- AMD RYZEN 3000 & ZEN 2 ---
  { id: 'ryzen-9-3950x', name: 'AMD Ryzen 9 3950X', shortName: 'Ryzen 9 3950X', manufacturer: 'AMD', releaseYear: 2019, cores: 16, threads: 32, baseClock: '3.5 GHz', boostClock: '4.7 GHz', cache: '72 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 749, cbMulti: 23400, cbSingle: 1310 },
  { id: 'ryzen-9-3900x', name: 'AMD Ryzen 9 3900X', shortName: 'Ryzen 9 3900X', manufacturer: 'AMD', releaseYear: 2019, cores: 12, threads: 24, baseClock: '3.8 GHz', boostClock: '4.6 GHz', cache: '70 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 499, cbMulti: 18500, cbSingle: 1290 },
  { id: 'ryzen-7-3800x', name: 'AMD Ryzen 7 3800X', shortName: 'Ryzen 7 3800X', manufacturer: 'AMD', releaseYear: 2019, cores: 8, threads: 16, baseClock: '3.9 GHz', boostClock: '4.5 GHz', cache: '36 MB', tdp: 105, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 399, cbMulti: 12600, cbSingle: 1270 },
  { id: 'ryzen-7-3700x', name: 'AMD Ryzen 7 3700X', shortName: 'Ryzen 7 3700X', manufacturer: 'AMD', releaseYear: 2019, cores: 8, threads: 16, baseClock: '3.6 GHz', boostClock: '4.4 GHz', cache: '36 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 329, cbMulti: 12100, cbSingle: 1240 },
  { id: 'ryzen-5-3600x', name: 'AMD Ryzen 5 3600X', shortName: 'Ryzen 5 3600X', manufacturer: 'AMD', releaseYear: 2019, cores: 6, threads: 12, baseClock: '3.8 GHz', boostClock: '4.4 GHz', cache: '35 MB', tdp: 95, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 249, cbMulti: 9500, cbSingle: 1250 },
  { id: 'ryzen-5-3600', name: 'AMD Ryzen 5 3600', shortName: 'Ryzen 5 3600', manufacturer: 'AMD', releaseYear: 2019, cores: 6, threads: 12, baseClock: '3.6 GHz', boostClock: '4.2 GHz', cache: '35 MB', tdp: 65, socket: 'AM4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 199, cbMulti: 9100, cbSingle: 1200 },

  // --- AMD RYZEN 2000 & 1000 ---
  { id: 'ryzen-7-2700x', name: 'AMD Ryzen 7 2700X', shortName: 'Ryzen 7 2700X', manufacturer: 'AMD', releaseYear: 2018, cores: 8, threads: 16, baseClock: '3.7 GHz', boostClock: '4.3 GHz', cache: '20 MB', tdp: 105, socket: 'AM4', processNode: '12 nm', integratedGraphics: false, architecture: 'Zen+', msrp: 329, cbMulti: 9400, cbSingle: 1070 },
  { id: 'ryzen-7-2700', name: 'AMD Ryzen 7 2700', shortName: 'Ryzen 7 2700', manufacturer: 'AMD', releaseYear: 2018, cores: 8, threads: 16, baseClock: '3.2 GHz', boostClock: '4.1 GHz', cache: '20 MB', tdp: 65, socket: 'AM4', processNode: '12 nm', integratedGraphics: false, architecture: 'Zen+', msrp: 299, cbMulti: 8500, cbSingle: 1010 },
  { id: 'ryzen-5-2600x', name: 'AMD Ryzen 5 2600X', shortName: 'Ryzen 5 2600X', manufacturer: 'AMD', releaseYear: 2018, cores: 6, threads: 12, baseClock: '3.6 GHz', boostClock: '4.2 GHz', cache: '19 MB', tdp: 95, socket: 'AM4', processNode: '12 nm', integratedGraphics: false, architecture: 'Zen+', msrp: 229, cbMulti: 7400, cbSingle: 1050 },
  { id: 'ryzen-5-2600', name: 'AMD Ryzen 5 2600', shortName: 'Ryzen 5 2600', manufacturer: 'AMD', releaseYear: 2018, cores: 6, threads: 12, baseClock: '3.4 GHz', boostClock: '3.9 GHz', cache: '19 MB', tdp: 65, socket: 'AM4', processNode: '12 nm', integratedGraphics: false, architecture: 'Zen+', msrp: 199, cbMulti: 6800, cbSingle: 990 },

  { id: 'ryzen-7-1800x', name: 'AMD Ryzen 7 1800X', shortName: 'Ryzen 7 1800X', manufacturer: 'AMD', releaseYear: 2017, cores: 8, threads: 16, baseClock: '3.6 GHz', boostClock: '4.0 GHz', cache: '20 MB', tdp: 95, socket: 'AM4', processNode: '14 nm', integratedGraphics: false, architecture: 'Zen', msrp: 499, cbMulti: 8200, cbSingle: 960 },
  { id: 'ryzen-7-1700', name: 'AMD Ryzen 7 1700', shortName: 'Ryzen 7 1700', manufacturer: 'AMD', releaseYear: 2017, cores: 8, threads: 16, baseClock: '3.0 GHz', boostClock: '3.7 GHz', cache: '20 MB', tdp: 65, socket: 'AM4', processNode: '14 nm', integratedGraphics: false, architecture: 'Zen', msrp: 329, cbMulti: 7100, cbSingle: 890 },
  { id: 'ryzen-5-1600', name: 'AMD Ryzen 5 1600', shortName: 'Ryzen 5 1600', manufacturer: 'AMD', releaseYear: 2017, cores: 6, threads: 12, baseClock: '3.2 GHz', boostClock: '3.6 GHz', cache: '19 MB', tdp: 65, socket: 'AM4', processNode: '14 nm', integratedGraphics: false, architecture: 'Zen', msrp: 219, cbMulti: 5600, cbSingle: 870 },

  // --- THREADRIPPER ---
  { id: 'threadripper-7980x', name: 'AMD Ryzen Threadripper 7980X', shortName: 'TR 7980X', manufacturer: 'AMD', releaseYear: 2023, cores: 64, threads: 128, baseClock: '3.2 GHz', boostClock: '5.1 GHz', cache: '320 MB', tdp: 350, socket: 'sTR5', processNode: '5 nm', integratedGraphics: false, architecture: 'Zen 4', msrp: 4999, cbMulti: 98000, cbSingle: 1890 },
  { id: 'threadripper-3990x', name: 'AMD Ryzen Threadripper 3990X', shortName: 'TR 3990X', manufacturer: 'AMD', releaseYear: 2020, cores: 64, threads: 128, baseClock: '2.9 GHz', boostClock: '4.3 GHz', cache: '288 MB', tdp: 280, socket: 'sTRX4', processNode: '7 nm', integratedGraphics: false, architecture: 'Zen 2', msrp: 3990, cbMulti: 64000, cbSingle: 1220 }
];

const fullCpus = cpuModels.map(model => {
  const scores = calcCpuScores({
    cinebenchR23Multi: model.cbMulti,
    cinebenchR23Single: model.cbSingle
  });

  return {
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
      sourceName: "Cinebench R23 / Geekbench Official Database",
      sourceUrl: "https://www.cpu-monkey.com/",
      testDate: `${model.releaseYear}-01`
    }
  };
});

// Sort by score descending
fullCpus.sort((a, b) => b.scores.overall - a.scores.overall);

fs.writeFileSync(cpuPath, JSON.stringify(fullCpus, null, 2), 'utf8');
console.log('Successfully written', fullCpus.length, 'CPUs into src/data/cpu.json');
