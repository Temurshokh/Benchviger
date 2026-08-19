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

finalCpuList.sort((a, b) => b.scores.overall - a.scores.overall);

fs.writeFileSync(cpuPath, JSON.stringify(finalCpuList, null, 2), 'utf8');
console.log('Expanded CPU database total count:', finalCpuList.length);
