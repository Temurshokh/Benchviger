const fs = require('fs');
const path = require('path');

// Populate RAM dataset
const ramPath = path.resolve('src/data/ram.json');
const ramData = [
  { id: 'ram-8gb-ddr4-3200', name: '8 GB DDR4 3200 MHz', shortName: '8GB DDR4-3200', capacity: 8, generation: 'DDR4', speed: 3200, modules: 1, score: 35 },
  { id: 'ram-16gb-ddr4-3200', name: '16 GB DDR4 3200 MHz (2x8GB)', shortName: '16GB DDR4-3200 Dual', capacity: 16, generation: 'DDR4', speed: 3200, modules: 2, score: 50 },
  { id: 'ram-32gb-ddr4-3200', name: '32 GB DDR4 3200 MHz (2x16GB)', shortName: '32GB DDR4-3200 Dual', capacity: 32, generation: 'DDR4', speed: 3200, modules: 2, score: 62 },
  { id: 'ram-16gb-ddr5-5600', name: '16 GB DDR5 5600 MHz (2x8GB)', shortName: '16GB DDR5-5600 Dual', capacity: 16, generation: 'DDR5', speed: 5600, modules: 2, score: 72 },
  { id: 'ram-32gb-ddr5-5600', name: '32 GB DDR5 5600 MHz (2x16GB)', shortName: '32GB DDR5-5600 Dual', capacity: 32, generation: 'DDR5', speed: 5600, modules: 2, score: 85 },
  { id: 'ram-32gb-ddr5-6000', name: '32 GB DDR5 6000 MHz (2x16GB)', shortName: '32GB DDR5-6000 Dual', capacity: 32, generation: 'DDR5', speed: 6000, modules: 2, score: 92 },
  { id: 'ram-64gb-ddr5-6000', name: '64 GB DDR5 6000 MHz (2x32GB)', shortName: '64GB DDR5-6000 Dual', capacity: 64, generation: 'DDR5', speed: 6000, modules: 2, score: 100 }
].map(item => ({
  ...item,
  manufacturer: item.generation,
  scores: { overall: item.score }
}));

fs.writeFileSync(ramPath, JSON.stringify(ramData, null, 2), 'utf8');

// Populate SSD dataset
const ssdPath = path.resolve('src/data/ssd.json');
const ssdData = [
  { id: 'samsung-990-pro-2tb', name: 'Samsung 990 PRO 2TB', shortName: '990 PRO 2TB', manufacturer: 'Samsung', capacity: '2 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 4.0', readSpeed: 7450, writeSpeed: 6900, endurance: '1200 TBW', msrp: 179, score: 98 },
  { id: 'wd-black-sn850x-2tb', name: 'WD_BLACK SN850X 2TB', shortName: 'SN850X 2TB', manufacturer: 'WD', capacity: '2 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 4.0', readSpeed: 7300, writeSpeed: 6600, endurance: '1200 TBW', msrp: 159, score: 95 },
  { id: 'crucial-t700-2tb', name: 'Crucial T700 2TB', shortName: 'Crucial T700 2TB', manufacturer: 'Crucial', capacity: '2 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 5.0', readSpeed: 12400, writeSpeed: 11800, endurance: '1200 TBW', msrp: 279, score: 100 },
  { id: 'kingston-kc3000-1tb', name: 'Kingston KC3000 1TB', shortName: 'KC3000 1TB', manufacturer: 'Kingston', capacity: '1 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 4.0', readSpeed: 7000, writeSpeed: 6000, endurance: '800 TBW', msrp: 99, score: 88 },
  { id: 'lexar-nm790-1tb', name: 'Lexar NM790 1TB', shortName: 'Lexar NM790 1TB', manufacturer: 'Lexar', capacity: '1 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 4.0', readSpeed: 7400, writeSpeed: 6500, endurance: '1000 TBW', msrp: 79, score: 90 },
  { id: 'crucial-p3-1tb', name: 'Crucial P3 1TB', shortName: 'Crucial P3 1TB', manufacturer: 'Crucial', capacity: '1 TB', interface: 'M.2 NVMe', pcieGen: 'PCIe 3.0', readSpeed: 3500, writeSpeed: 3000, endurance: '220 TBW', msrp: 59, score: 55 },
  { id: 'samsung-870-evo-1tb', name: 'Samsung 870 EVO 1TB', shortName: '870 EVO 1TB', manufacturer: 'Samsung', capacity: '1 TB', interface: '2.5" SATA III', pcieGen: 'SATA 6Gb/s', readSpeed: 560, writeSpeed: 530, endurance: '600 TBW', msrp: 89, score: 32 }
].map(item => ({
  ...item,
  scores: { overall: item.score }
}));

fs.writeFileSync(ssdPath, JSON.stringify(ssdData, null, 2), 'utf8');

// Populate PSU dataset
const psuPath = path.resolve('src/data/psu.json');
const psuData = [
  { id: 'corsair-rm1000x', name: 'Corsair RM1000x 1000W', shortName: 'RM1000x', manufacturer: 'Corsair', wattage: 1000, efficiency: '80 PLUS Gold', atxVersion: 'ATX 3.0', modularity: 'Full Modular', protections: 'OVP, OCP, OPP, SCP, OTP', msrp: 189, score: 96 },
  { id: 'seasonic-prime-px-1000', name: 'Seasonic Prime PX-1000', shortName: 'Prime PX-1000', manufacturer: 'Seasonic', wattage: 1000, efficiency: '80 PLUS Platinum', atxVersion: 'ATX 3.0', modularity: 'Full Modular', protections: 'OVP, OCP, OPP, SCP, OTP, UVP', msrp: 239, score: 100 },
  { id: 'msi-mag-a850gl', name: 'MSI MAG A850GL PCIE5', shortName: 'MAG A850GL', manufacturer: 'MSI', wattage: 850, efficiency: '80 PLUS Gold', atxVersion: 'ATX 3.0', modularity: 'Full Modular', protections: 'OVP, OCP, OPP, SCP, OTP', msrp: 119, score: 85 },
  { id: 'msi-mag-a650bn', name: 'MSI MAG A650BN 650W', shortName: 'MAG A650BN', manufacturer: 'MSI', wattage: 650, efficiency: '80 PLUS Bronze', atxVersion: 'ATX 2.4', modularity: 'Non-Modular', protections: 'OVP, OCP, OPP, SCP', msrp: 59, score: 62 },
  { id: 'deepcool-pf650', name: 'DeepCool PF650 650W', shortName: 'DeepCool PF650', manufacturer: 'DeepCool', wattage: 650, efficiency: '80 PLUS Standard', atxVersion: 'ATX 2.4', modularity: 'Non-Modular', protections: 'OVP, OPP, SCP', msrp: 49, score: 50 },
  { id: 'be-quiet-pure-power-12-m-750w', name: 'be quiet! Pure Power 12 M 750W', shortName: 'Pure Power 12 M 750W', manufacturer: 'be quiet!', wattage: 750, efficiency: '80 PLUS Gold', atxVersion: 'ATX 3.0', modularity: 'Full Modular', protections: 'OVP, OCP, OPP, SCP, OTP, UVP', msrp: 119, score: 88 },
  { id: 'cooler-master-mwe-gold-850-v2', name: 'Cooler Master MWE Gold 850 V2', shortName: 'MWE Gold 850 V2', manufacturer: 'Cooler Master', wattage: 850, efficiency: '80 PLUS Gold', atxVersion: 'ATX 2.52', modularity: 'Full Modular', protections: 'OVP, OCP, OPP, SCP, OTP', msrp: 109, score: 82 }
].map(item => ({
  ...item,
  scores: { overall: item.score }
}));

fs.writeFileSync(psuPath, JSON.stringify(psuData, null, 2), 'utf8');

console.log('Successfully created ram.json, ssd.json, psu.json datasets!');
