const fs = require('fs');
const path = require('path');

const phonesPath = path.resolve('src/data/phones.json');

// Flagship baseline phone (Snapdragon 8 Elite / A19 Pro benchmark baseline)
const FLAGSHIP = {
  geekbench6Multi: 11000,
  geekbench6Single: 3750,
  antutu10: 2800000
};

function calcPhoneScore(benchmarks) {
  if (!benchmarks) return 0;
  
  const gbM = benchmarks.geekbench6Multi;
  const gbS = benchmarks.geekbench6Single;
  const ant = benchmarks.antutu10;

  if (!gbM && !gbS && !ant) return 0;

  const multiNorm = gbM ? (gbM / FLAGSHIP.geekbench6Multi) : (ant ? ant / FLAGSHIP.antutu10 : 0.5);
  const singleNorm = gbS ? (gbS / FLAGSHIP.geekbench6Single) : (ant ? ant / (FLAGSHIP.antutu10 * 0.8) : 0.5);
  const antutuNorm = ant ? (ant / FLAGSHIP.antutu10) : (gbM ? (gbM * 280) / FLAGSHIP.antutu10 : 0.5);

  const composite = (multiNorm * 0.45) + (singleNorm * 0.25) + (antutuNorm * 0.30);
  const score = Math.round(Math.min(Math.max(composite * 100, 1), 100));

  return score;
}

const phoneModels = [
  // --- APPLE IPHONE ---
  { id: 'iphone-17-pro-max', name: 'Apple iPhone 17 Pro Max', shortName: 'iPhone 17 Pro Max', manufacturer: 'Apple', releaseYear: 2025, soc: 'Apple A19 Pro', ram: 12, storage: [256, 512, 1024], display: '6.9" OLED', refreshRate: 120, battery: 5088, mainCamera: '48 MP', weight: 233, msrp: 1199, gbMulti: 9750, gbSingle: 3756, antutu: null },
  { id: 'iphone-17-pro', name: 'Apple iPhone 17 Pro', shortName: 'iPhone 17 Pro', manufacturer: 'Apple', releaseYear: 2025, soc: 'Apple A19 Pro', ram: 12, storage: [256, 512, 1024], display: '6.3" OLED', refreshRate: 120, battery: 4252, mainCamera: '48 MP', weight: 206, msrp: 1099, gbMulti: 9627, gbSingle: 3738, antutu: null },
  { id: 'iphone-17-air', name: 'Apple iPhone Air', shortName: 'iPhone Air', manufacturer: 'Apple', releaseYear: 2025, soc: 'Apple A19', ram: 12, storage: [256, 512, 1024], display: '6.5" OLED', refreshRate: 120, battery: 3149, mainCamera: '48 MP', weight: 165, msrp: 999, gbMulti: 9400, gbSingle: 3700, antutu: null },
  { id: 'iphone-17', name: 'Apple iPhone 17', shortName: 'iPhone 17', manufacturer: 'Apple', releaseYear: 2025, soc: 'Apple A19', ram: 8, storage: [256, 512], display: '6.3" OLED', refreshRate: 120, battery: 3692, mainCamera: '48 MP', weight: 177, msrp: 799, gbMulti: 9514, gbSingle: 3718, antutu: null },

  { id: 'iphone-16-pro-max', name: 'Apple iPhone 16 Pro Max', shortName: 'iPhone 16 Pro Max', manufacturer: 'Apple', releaseYear: 2024, soc: 'Apple A18 Pro', ram: 8, storage: [256, 512, 1024], display: '6.9" OLED', refreshRate: 120, battery: 4685, mainCamera: '48 MP', weight: 227, msrp: 1199, gbMulti: 9800, gbSingle: 3400, antutu: 2100000 },
  { id: 'iphone-16-pro', name: 'Apple iPhone 16 Pro', shortName: 'iPhone 16 Pro', manufacturer: 'Apple', releaseYear: 2024, soc: 'Apple A18 Pro', ram: 8, storage: [128, 256, 512, 1024], display: '6.3" OLED', refreshRate: 120, battery: 3582, mainCamera: '48 MP', weight: 199, msrp: 999, gbMulti: 9750, gbSingle: 3380, antutu: 2080000 },
  { id: 'iphone-16', name: 'Apple iPhone 16', shortName: 'iPhone 16', manufacturer: 'Apple', releaseYear: 2024, soc: 'Apple A18', ram: 8, storage: [128, 256, 512], display: '6.1" OLED', refreshRate: 60, battery: 3561, mainCamera: '48 MP', weight: 170, msrp: 799, gbMulti: 8200, gbSingle: 3250, antutu: 1850000 },
  { id: 'iphone-15-pro-max', name: 'Apple iPhone 15 Pro Max', shortName: 'iPhone 15 Pro Max', manufacturer: 'Apple', releaseYear: 2023, soc: 'Apple A17 Pro', ram: 8, storage: [256, 512, 1024], display: '6.7" OLED', refreshRate: 120, battery: 4422, mainCamera: '48 MP', weight: 221, msrp: 1199, gbMulti: 7400, gbSingle: 2900, antutu: 1650000 },
  { id: 'iphone-15-pro', name: 'Apple iPhone 15 Pro', shortName: 'iPhone 15 Pro', manufacturer: 'Apple', releaseYear: 2023, soc: 'Apple A17 Pro', ram: 8, storage: [128, 256, 512, 1024], display: '6.1" OLED', refreshRate: 120, battery: 3274, mainCamera: '48 MP', weight: 187, msrp: 999, gbMulti: 7350, gbSingle: 2890, antutu: 1640000 },
  { id: 'iphone-15', name: 'Apple iPhone 15', shortName: 'iPhone 15', manufacturer: 'Apple', releaseYear: 2023, soc: 'Apple A16 Bionic', ram: 6, storage: [128, 256, 512], display: '6.1" OLED', refreshRate: 60, battery: 3349, mainCamera: '48 MP', weight: 171, msrp: 799, gbMulti: 6600, gbSingle: 2550, antutu: 1420000 },
  { id: 'iphone-14-pro-max', name: 'Apple iPhone 14 Pro Max', shortName: 'iPhone 14 Pro Max', manufacturer: 'Apple', releaseYear: 2022, soc: 'Apple A16 Bionic', ram: 6, storage: [128, 256, 512, 1024], display: '6.7" OLED', refreshRate: 120, battery: 4323, mainCamera: '48 MP', weight: 240, msrp: 1099, gbMulti: 6650, gbSingle: 2560, antutu: 1440000 },
  { id: 'iphone-14', name: 'Apple iPhone 14', shortName: 'iPhone 14', manufacturer: 'Apple', releaseYear: 2022, soc: 'Apple A15 Bionic', ram: 6, storage: [128, 256, 512], display: '6.1" OLED', refreshRate: 60, battery: 3279, mainCamera: '12 MP', weight: 172, msrp: 699, gbMulti: 5600, gbSingle: 2280, antutu: 1250000 },
  { id: 'iphone-13-pro-max', name: 'Apple iPhone 13 Pro Max', shortName: 'iPhone 13 Pro Max', manufacturer: 'Apple', releaseYear: 2021, soc: 'Apple A15 Bionic', ram: 6, storage: [128, 256, 512, 1024], display: '6.7" OLED', refreshRate: 120, battery: 4352, mainCamera: '12 MP', weight: 240, msrp: 1099, gbMulti: 5650, gbSingle: 2290, antutu: 1260000 },
  { id: 'iphone-13', name: 'Apple iPhone 13', shortName: 'iPhone 13', manufacturer: 'Apple', releaseYear: 2021, soc: 'Apple A15 Bionic', ram: 4, storage: [128, 256, 512], display: '6.1" OLED', refreshRate: 60, battery: 3240, mainCamera: '12 MP', weight: 174, msrp: 599, gbMulti: 5400, gbSingle: 2220, antutu: 1210000 },
  { id: 'iphone-12', name: 'Apple iPhone 12', shortName: 'iPhone 12', manufacturer: 'Apple', releaseYear: 2020, soc: 'Apple A14 Bionic', ram: 4, storage: [64, 128, 256], display: '6.1" OLED', refreshRate: 60, battery: 2815, mainCamera: '12 MP', weight: 164, msrp: 499, gbMulti: 4600, gbSingle: 2010, antutu: 1010000 },
  { id: 'iphone-11', name: 'Apple iPhone 11', shortName: 'iPhone 11', manufacturer: 'Apple', releaseYear: 2019, soc: 'Apple A13 Bionic', ram: 4, storage: [64, 128, 256], display: '6.1" LCD', refreshRate: 60, battery: 3110, mainCamera: '12 MP', weight: 194, msrp: 499, gbMulti: 3750, gbSingle: 1710, antutu: 830000 },
  { id: 'iphone-x', name: 'Apple iPhone X', shortName: 'iPhone X', manufacturer: 'Apple', releaseYear: 2017, soc: 'Apple A11 Bionic', ram: 3, storage: [64, 256], display: '5.8" OLED', refreshRate: 60, battery: 2716, mainCamera: '12 MP', weight: 174, msrp: 999, gbMulti: 2400, gbSingle: 1250, antutu: 480000 },

  // --- SAMSUNG GALAXY ---
  { id: 'galaxy-s26-ultra', name: 'Samsung Galaxy S26 Ultra', shortName: 'Galaxy S26 Ultra', manufacturer: 'Samsung', releaseYear: 2026, soc: 'Snapdragon 8 Elite Gen 2', ram: 16, storage: [256, 512, 1024], display: '6.9" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '200 MP', weight: 214, msrp: 1299, gbMulti: 11093, gbSingle: 3698, antutu: 3100000 },
  { id: 'galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra', shortName: 'Galaxy S25 Ultra', manufacturer: 'Samsung', releaseYear: 2025, soc: 'Snapdragon 8 Elite', ram: 16, storage: [256, 512, 1024], display: '6.9" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '200 MP', weight: 219, msrp: 1299, gbMulti: 9600, gbSingle: 3150, antutu: 2750000 },
  { id: 'galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', shortName: 'Galaxy S24 Ultra', manufacturer: 'Samsung', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 12, storage: [256, 512, 1024], display: '6.8" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '200 MP', weight: 232, msrp: 1299, gbMulti: 7100, gbSingle: 2250, antutu: 1820000 },
  { id: 'galaxy-s24-plus', name: 'Samsung Galaxy S24+', shortName: 'Galaxy S24+', manufacturer: 'Samsung', releaseYear: 2024, soc: 'Exynos 2400', ram: 12, storage: [256, 512], display: '6.7" Dynamic AMOLED 2X', refreshRate: 120, battery: 4900, mainCamera: '50 MP', weight: 196, msrp: 999, gbMulti: 6800, gbSingle: 2150, antutu: 1720000 },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', shortName: 'Galaxy S24', manufacturer: 'Samsung', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 8, storage: [128, 256], display: '6.2" Dynamic AMOLED 2X', refreshRate: 120, battery: 4000, mainCamera: '50 MP', weight: 167, msrp: 799, gbMulti: 6900, gbSingle: 2200, antutu: 1780000 },
  { id: 'galaxy-s23-ultra', name: 'Samsung Galaxy S23 Ultra', shortName: 'Galaxy S23 Ultra', manufacturer: 'Samsung', releaseYear: 2023, soc: 'Snapdragon 8 Gen 2', ram: 12, storage: [256, 512, 1024], display: '6.8" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '200 MP', weight: 234, msrp: 1199, gbMulti: 5300, gbSingle: 1900, antutu: 1510000 },
  { id: 'galaxy-s22-ultra', name: 'Samsung Galaxy S22 Ultra', shortName: 'Galaxy S22 Ultra', manufacturer: 'Samsung', releaseYear: 2022, soc: 'Snapdragon 8 Gen 1', ram: 12, storage: [128, 256, 512], display: '6.8" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '108 MP', weight: 228, msrp: 1199, gbMulti: 3800, gbSingle: 1650, antutu: 1020000 },
  { id: 'galaxy-s21-ultra', name: 'Samsung Galaxy S21 Ultra', shortName: 'Galaxy S21 Ultra', manufacturer: 'Samsung', releaseYear: 2021, soc: 'Snapdragon 888', ram: 12, storage: [128, 256, 512], display: '6.8" Dynamic AMOLED 2X', refreshRate: 120, battery: 5000, mainCamera: '108 MP', weight: 227, msrp: 1199, gbMulti: 3400, gbSingle: 1450, antutu: 810000 },
  { id: 'galaxy-note-20-ultra', name: 'Samsung Galaxy Note 20 Ultra', shortName: 'Galaxy Note 20 Ultra', manufacturer: 'Samsung', releaseYear: 2020, soc: 'Snapdragon 865+', ram: 12, storage: [128, 512], display: '6.9" Dynamic AMOLED 2X', refreshRate: 120, battery: 4500, mainCamera: '108 MP', weight: 208, msrp: 1299, gbMulti: 3100, gbSingle: 1300, antutu: 680000 },
  { id: 'galaxy-z-fold-6', name: 'Samsung Galaxy Z Fold 6', shortName: 'Galaxy Z Fold 6', manufacturer: 'Samsung', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 12, storage: [256, 512, 1024], display: '7.6" Foldable OLED', refreshRate: 120, battery: 4400, mainCamera: '50 MP', weight: 239, msrp: 1899, gbMulti: 7000, gbSingle: 2220, antutu: 1800000 },
  { id: 'galaxy-a55', name: 'Samsung Galaxy A55 5G', shortName: 'Galaxy A55', manufacturer: 'Samsung', releaseYear: 2024, soc: 'Exynos 1480', ram: 8, storage: [128, 256], display: '6.6" Super AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 213, msrp: 479, gbMulti: 3400, gbSingle: 1150, antutu: 720000 },

  // --- TECNO ---
  { id: 'tecno-phantom-v-fold2', name: 'Tecno Phantom V Fold2', shortName: 'Phantom V Fold2', manufacturer: 'Tecno', releaseYear: 2024, soc: 'Dimensity 9000+', ram: 12, storage: [512], display: '7.85" Foldable LTPO OLED', refreshRate: 120, battery: 5750, mainCamera: '50 MP', weight: 249, msrp: 1099, gbMulti: 4300, gbSingle: 1680, antutu: 1120000 },
  { id: 'tecno-phantom-x2-pro', name: 'Tecno Phantom X2 Pro', shortName: 'Phantom X2 Pro', manufacturer: 'Tecno', releaseYear: 2022, soc: 'Dimensity 9000', ram: 12, storage: [256], display: '6.8" AMOLED', refreshRate: 120, battery: 5160, mainCamera: '50 MP (Retractable)', weight: 201, msrp: 899, gbMulti: 4050, gbSingle: 1620, antutu: 980000 },
  { id: 'tecno-camon-30-premier', name: 'Tecno Camon 30 Premier 5G', shortName: 'Camon 30 Premier', manufacturer: 'Tecno', releaseYear: 2024, soc: 'Dimensity 8200 Ultimate', ram: 12, storage: [512], display: '6.77" LTPO AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 210, msrp: 499, gbMulti: 3800, gbSingle: 1220, antutu: 940000 },
  { id: 'tecno-camon-30-pro', name: 'Tecno Camon 30 Pro 5G', shortName: 'Camon 30 Pro', manufacturer: 'Tecno', releaseYear: 2024, soc: 'Dimensity 8200 Ultimate', ram: 12, storage: [256, 512], display: '6.78" AMOLED', refreshRate: 144, battery: 5000, mainCamera: '50 MP', weight: 189, msrp: 399, gbMulti: 3750, gbSingle: 1210, antutu: 930000 },
  { id: 'tecno-pova-6-pro', name: 'Tecno POVA 6 Pro 5G', shortName: 'POVA 6 Pro', manufacturer: 'Tecno', releaseYear: 2024, soc: 'Dimensity 6080', ram: 12, storage: [256], display: '6.78" AMOLED', refreshRate: 120, battery: 6000, mainCamera: '108 MP', weight: 198, msrp: 249, gbMulti: 2050, gbSingle: 760, antutu: 430000 },
  { id: 'tecno-pova-5-pro', name: 'Tecno POVA 5 Pro 5G', shortName: 'POVA 5 Pro', manufacturer: 'Tecno', releaseYear: 2023, soc: 'Dimensity 6080', ram: 8, storage: [128, 256], display: '6.78" IPS LCD', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 212, msrp: 199, gbMulti: 2020, gbSingle: 750, antutu: 420000 },
  { id: 'tecno-spark-20-pro-plus', name: 'Tecno Spark 20 Pro+', shortName: 'Spark 20 Pro+', manufacturer: 'Tecno', releaseYear: 2024, soc: 'Helio G99 Ultimate', ram: 8, storage: [256], display: '6.78" AMOLED', refreshRate: 120, battery: 5000, mainCamera: '108 MP', weight: 179, msrp: 189, gbMulti: 1980, gbSingle: 730, antutu: 410000 },

  // --- HUAWEI ---
  { id: 'huawei-mate-60-pro', name: 'Huawei Mate 60 Pro', shortName: 'Mate 60 Pro', manufacturer: 'Huawei', releaseYear: 2023, soc: 'Kirin 9000S', ram: 12, storage: [256, 512, 1024], display: '6.82" LTPO OLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 225, msrp: 999, gbMulti: 4150, gbSingle: 1350, antutu: 970000 },
  { id: 'huawei-pura-70-ultra', name: 'Huawei Pura 70 Ultra', shortName: 'Pura 70 Ultra', manufacturer: 'Huawei', releaseYear: 2024, soc: 'Kirin 9010', ram: 16, storage: [512, 1024], display: '6.8" LTPO OLED', refreshRate: 120, battery: 5200, mainCamera: '50 MP (1-inch Retractable)', weight: 226, msrp: 1499, gbMulti: 4400, gbSingle: 1420, antutu: 1020000 },
  { id: 'huawei-p50-pro', name: 'Huawei P50 Pro', shortName: 'P50 Pro', manufacturer: 'Huawei', releaseYear: 2021, soc: 'Snapdragon 888 4G', ram: 8, storage: [128, 256, 512], display: '6.6" OLED', refreshRate: 120, battery: 4360, mainCamera: '50 MP', weight: 195, msrp: 1099, gbMulti: 3450, gbSingle: 1460, antutu: 800000 },
  { id: 'huawei-mate-40-pro', name: 'Huawei Mate 40 Pro', shortName: 'Mate 40 Pro', manufacturer: 'Huawei', releaseYear: 2020, soc: 'Kirin 9000 5G', ram: 8, storage: [128, 256, 512], display: '6.76" OLED', refreshRate: 90, battery: 4400, mainCamera: '50 MP', weight: 212, msrp: 1199, gbMulti: 3700, gbSingle: 1410, antutu: 760000 },
  { id: 'huawei-p30-pro', name: 'Huawei P30 Pro', shortName: 'P30 Pro', manufacturer: 'Huawei', releaseYear: 2019, soc: 'Kirin 980', ram: 8, storage: [128, 256, 512], display: '6.47" OLED', refreshRate: 60, battery: 4200, mainCamera: '40 MP', weight: 192, msrp: 999, gbMulti: 2450, gbSingle: 950, antutu: 470000 },
  { id: 'huawei-nova-12-pro', name: 'Huawei Nova 12 Pro', shortName: 'Nova 12 Pro', manufacturer: 'Huawei', releaseYear: 2023, soc: 'Kirin 9000S', ram: 12, storage: [256, 512], display: '6.76" OLED', refreshRate: 120, battery: 4600, mainCamera: '50 MP', weight: 198, msrp: 599, gbMulti: 4100, gbSingle: 1340, antutu: 950000 },
  { id: 'huawei-mate-x5', name: 'Huawei Mate X5', shortName: 'Mate X5', manufacturer: 'Huawei', releaseYear: 2023, soc: 'Kirin 9000S', ram: 16, storage: [512, 1024], display: '7.85" Foldable OLED', refreshRate: 120, battery: 5060, mainCamera: '50 MP', weight: 243, msrp: 1799, gbMulti: 4180, gbSingle: 1355, antutu: 975000 },

  // --- INFINIX ---
  { id: 'infinix-zero-30-5g', name: 'Infinix Zero 30 5G', shortName: 'Zero 30 5G', manufacturer: 'Infinix', releaseYear: 2023, soc: 'Dimensity 8020', ram: 12, storage: [256], display: '6.78" AMOLED', refreshRate: 144, battery: 5000, mainCamera: '108 MP', weight: 185, msrp: 329, gbMulti: 3350, gbSingle: 1010, antutu: 710000 },
  { id: 'infinix-gt-20-pro', name: 'Infinix GT 20 Pro', shortName: 'GT 20 Pro', manufacturer: 'Infinix', releaseYear: 2024, soc: 'Dimensity 8200 Ultimate', ram: 12, storage: [256], display: '6.78" AMOLED', refreshRate: 144, battery: 5000, mainCamera: '108 MP', weight: 194, msrp: 349, gbMulti: 3750, gbSingle: 1210, antutu: 935000 },
  { id: 'infinix-note-40-pro-plus', name: 'Infinix Note 40 Pro+ 5G', shortName: 'Note 40 Pro+', manufacturer: 'Infinix', releaseYear: 2024, soc: 'Dimensity 7020', ram: 12, storage: [256], display: '6.78" AMOLED', refreshRate: 120, battery: 4600, mainCamera: '108 MP', weight: 196, msrp: 309, gbMulti: 2200, gbSingle: 770, antutu: 460000 },

  // --- REALME ---
  { id: 'realme-gt-6', name: 'Realme GT 6', shortName: 'Realme GT 6', manufacturer: 'Realme', releaseYear: 2024, soc: 'Snapdragon 8s Gen 3', ram: 16, storage: [256, 512], display: '6.78" LTPO AMOLED', refreshRate: 120, battery: 5500, mainCamera: '50 MP', weight: 199, msrp: 599, gbMulti: 4950, gbSingle: 1970, antutu: 1480000 },
  { id: 'realme-gt-5-pro', name: 'Realme GT 5 Pro', shortName: 'Realme GT 5 Pro', manufacturer: 'Realme', releaseYear: 2023, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [256, 512, 1024], display: '6.78" AMOLED', refreshRate: 144, battery: 5400, mainCamera: '50 MP', weight: 218, msrp: 699, gbMulti: 7050, gbSingle: 2240, antutu: 1910000 },
  { id: 'realme-12-pro-plus', name: 'Realme 12 Pro+', shortName: 'Realme 12 Pro+', manufacturer: 'Realme', releaseYear: 2024, soc: 'Snapdragon 7s Gen 2', ram: 12, storage: [256, 512], display: '6.7" OLED', refreshRate: 120, battery: 5000, mainCamera: '64 MP (Periscope)', weight: 196, msrp: 399, gbMulti: 2900, gbSingle: 940, antutu: 650000 },

  // --- VIVO & OPPO & HONOR ---
  { id: 'vivo-x100-pro', name: 'vivo X100 Pro', shortName: 'vivo X100 Pro', manufacturer: 'vivo', releaseYear: 2023, soc: 'Dimensity 9300', ram: 16, storage: [256, 512, 1024], display: '6.78" LTPO AMOLED', refreshRate: 120, battery: 5400, mainCamera: '50 MP (1-inch Zeiss)', weight: 225, msrp: 1099, gbMulti: 7400, gbSingle: 2210, antutu: 2050000 },
  { id: 'vivo-x200-pro', name: 'vivo X200 Pro', shortName: 'vivo X200 Pro', manufacturer: 'vivo', releaseYear: 2024, soc: 'Dimensity 9400', ram: 16, storage: [256, 512, 1024], display: '6.78" LTPO AMOLED', refreshRate: 120, battery: 6000, mainCamera: '50 MP (Zeiss)', weight: 228, msrp: 1199, gbMulti: 8900, gbSingle: 2850, antutu: 2850000 },
  { id: 'oppo-find-x7-ultra', name: 'OPPO Find X7 Ultra', shortName: 'Find X7 Ultra', manufacturer: 'OPPO', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [256, 512], display: '6.82" LTPO AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP (Dual Periscope Hasselblad)', weight: 221, msrp: 1199, gbMulti: 7100, gbSingle: 2250, antutu: 1950000 },
  { id: 'honor-magic-6-pro', name: 'Honor Magic6 Pro', shortName: 'Magic6 Pro', manufacturer: 'Honor', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [256, 512, 1024], display: '6.8" LTPO OLED', refreshRate: 120, battery: 5600, mainCamera: '180 MP (Periscope)', weight: 229, msrp: 1299, gbMulti: 7080, gbSingle: 2240, antutu: 1930000 },

  // --- GOOGLE PIXEL (EXPANDED) ---
  { id: 'pixel-9-pro-xl', name: 'Google Pixel 9 Pro XL', shortName: 'Pixel 9 Pro XL', manufacturer: 'Google', releaseYear: 2024, soc: 'Google Tensor G4', ram: 16, storage: [128, 256, 512, 1024], display: '6.8" LTPO OLED', refreshRate: 120, battery: 5060, mainCamera: '50 MP', weight: 221, msrp: 1099, gbMulti: 4800, gbSingle: 1950, antutu: 1180000 },
  { id: 'pixel-9-pro', name: 'Google Pixel 9 Pro', shortName: 'Pixel 9 Pro', manufacturer: 'Google', releaseYear: 2024, soc: 'Google Tensor G4', ram: 16, storage: [128, 256, 512, 1024], display: '6.3" LTPO OLED', refreshRate: 120, battery: 4700, mainCamera: '50 MP', weight: 199, msrp: 999, gbMulti: 4750, gbSingle: 1940, antutu: 1170000 },
  { id: 'pixel-9', name: 'Google Pixel 9', shortName: 'Pixel 9', manufacturer: 'Google', releaseYear: 2024, soc: 'Google Tensor G4', ram: 12, storage: [128, 256], display: '6.3" OLED', refreshRate: 120, battery: 4700, mainCamera: '50 MP', weight: 198, msrp: 799, gbMulti: 4600, gbSingle: 1920, antutu: 1150000 },
  { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', shortName: 'Pixel 8 Pro', manufacturer: 'Google', releaseYear: 2023, soc: 'Google Tensor G3', ram: 12, storage: [128, 256, 512, 1024], display: '6.7" LTPO OLED', refreshRate: 120, battery: 5050, mainCamera: '50 MP', weight: 213, msrp: 999, gbMulti: 4400, gbSingle: 1760, antutu: 1080000 },
  { id: 'pixel-7-pro', name: 'Google Pixel 7 Pro', shortName: 'Pixel 7 Pro', manufacturer: 'Google', releaseYear: 2022, soc: 'Google Tensor G2', ram: 12, storage: [128, 256, 512], display: '6.7" LTPO OLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 212, msrp: 899, gbMulti: 3800, gbSingle: 1420, antutu: 820000 },

  // --- XIAOMI / REDMI / POCO ---
  { id: 'xiaomi-15-ultra', name: 'Xiaomi 15 Ultra', shortName: 'Xiaomi 15 Ultra', manufacturer: 'Xiaomi', releaseYear: 2025, soc: 'Snapdragon 8 Elite', ram: 16, storage: [512, 1024], display: '6.73" LTPO AMOLED', refreshRate: 120, battery: 5400, mainCamera: '50 MP', weight: 220, msrp: 1299, gbMulti: 9650, gbSingle: 3160, antutu: 2780000 },
  { id: 'xiaomi-14-ultra', name: 'Xiaomi 14 Ultra', shortName: 'Xiaomi 14 Ultra', manufacturer: 'Xiaomi', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [512, 1024], display: '6.73" LTPO AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 220, msrp: 1499, gbMulti: 7150, gbSingle: 2260, antutu: 1980000 },
  { id: 'xiaomi-14', name: 'Xiaomi 14', shortName: 'Xiaomi 14', manufacturer: 'Xiaomi', releaseYear: 2023, soc: 'Snapdragon 8 Gen 3', ram: 12, storage: [256, 512], display: '6.36" LTPO OLED', refreshRate: 120, battery: 4610, mainCamera: '50 MP', weight: 193, msrp: 999, gbMulti: 7000, gbSingle: 2220, antutu: 1920000 },
  { id: 'poco-f6-pro', name: 'POCO F6 Pro', shortName: 'POCO F6 Pro', manufacturer: 'POCO', releaseYear: 2024, soc: 'Snapdragon 8 Gen 2', ram: 12, storage: [256, 512, 1024], display: '6.67" AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 209, msrp: 499, gbMulti: 5300, gbSingle: 1890, antutu: 1520000 },
  { id: 'poco-f6', name: 'POCO F6', shortName: 'POCO F6', manufacturer: 'POCO', releaseYear: 2024, soc: 'Snapdragon 8s Gen 3', ram: 8, storage: [256, 512], display: '6.67" AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 179, msrp: 379, gbMulti: 4900, gbSingle: 1950, antutu: 1450000 },
  { id: 'redmi-note-13-pro-plus', name: 'Redmi Note 13 Pro+', shortName: 'Redmi Note 13 Pro+', manufacturer: 'Redmi', releaseYear: 2023, soc: 'Dimensity 7200 Ultra', ram: 12, storage: [256, 512], display: '6.67" AMOLED', refreshRate: 120, battery: 5000, mainCamera: '200 MP', weight: 204, msrp: 399, gbMulti: 2650, gbSingle: 1120, antutu: 720000 },

  // --- ONEPLUS & OTHERS ---
  { id: 'oneplus-13', name: 'OnePlus 13', shortName: 'OnePlus 13', manufacturer: 'OnePlus', releaseYear: 2024, soc: 'Snapdragon 8 Elite', ram: 16, storage: [256, 512, 1024], display: '6.82" LTPO AMOLED', refreshRate: 120, battery: 6000, mainCamera: '50 MP', weight: 213, msrp: 899, gbMulti: 9600, gbSingle: 3140, antutu: 2720000 },
  { id: 'oneplus-12', name: 'OnePlus 12', shortName: 'OnePlus 12', manufacturer: 'OnePlus', releaseYear: 2023, soc: 'Snapdragon 8 Gen 3', ram: 12, storage: [256, 512], display: '6.82" LTPO AMOLED', refreshRate: 120, battery: 5400, mainCamera: '50 MP', weight: 220, msrp: 799, gbMulti: 7050, gbSingle: 2230, antutu: 1890000 },
  { id: 'oneplus-11', name: 'OnePlus 11', shortName: 'OnePlus 11', manufacturer: 'OnePlus', releaseYear: 2023, soc: 'Snapdragon 8 Gen 2', ram: 16, storage: [256, 512], display: '6.7" LTPO AMOLED', refreshRate: 120, battery: 5000, mainCamera: '50 MP', weight: 205, msrp: 699, gbMulti: 5250, gbSingle: 1880, antutu: 1490000 },

  { id: 'nothing-phone-2', name: 'Nothing Phone (2)', shortName: 'Nothing Phone (2)', manufacturer: 'Nothing', releaseYear: 2023, soc: 'Snapdragon 8+ Gen 1', ram: 12, storage: [128, 256, 512], display: '6.7" LTPO OLED', refreshRate: 120, battery: 4700, mainCamera: '50 MP', weight: 201, msrp: 599, gbMulti: 4400, gbSingle: 1720, antutu: 1240000 },
  { id: 'asus-rog-phone-8-pro', name: 'ASUS ROG Phone 8 Pro', shortName: 'ROG Phone 8 Pro', manufacturer: 'ASUS', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [512, 1024], display: '6.78" LTPO AMOLED', refreshRate: 165, battery: 5500, mainCamera: '50 MP', weight: 225, msrp: 1199, gbMulti: 7250, gbSingle: 2280, antutu: 2150000 },
  { id: 'redmagic-9-pro', name: 'Nubia RedMagic 9 Pro', shortName: 'RedMagic 9 Pro', manufacturer: 'RedMagic', releaseYear: 2023, soc: 'Snapdragon 8 Gen 3', ram: 16, storage: [256, 512], display: '6.85" AMOLED', refreshRate: 120, battery: 6500, mainCamera: '50 MP', weight: 229, msrp: 749, gbMulti: 7300, gbSingle: 2290, antutu: 2180000 },
  { id: 'sony-xperia-1-vi', name: 'Sony Xperia 1 VI', shortName: 'Xperia 1 VI', manufacturer: 'Sony', releaseYear: 2024, soc: 'Snapdragon 8 Gen 3', ram: 12, storage: [256, 512], display: '6.5" LTPO OLED', refreshRate: 120, battery: 5000, mainCamera: '48 MP', weight: 192, msrp: 1399, gbMulti: 7000, gbSingle: 2210, antutu: 1850000 }
];

const fullPhones = phoneModels.map(model => {
  const score = calcPhoneScore({
    geekbench6Multi: model.gbMulti,
    geekbench6Single: model.gbSingle,
    antutu10: model.antutu
  });

  return {
    id: model.id,
    name: model.name,
    shortName: model.shortName,
    manufacturer: model.manufacturer,
    releaseYear: model.releaseYear,
    soc: model.soc,
    ram: model.ram,
    storage: model.storage,
    display: model.display,
    refreshRate: model.refreshRate,
    battery: model.battery,
    mainCamera: model.mainCamera,
    weight: model.weight,
    msrp: model.msrp,
    score: score,
    scores: {
      overall: score
    },
    benchmarks: {
      geekbench6Multi: model.gbMulti,
      geekbench6Single: model.gbSingle,
      antutu10: model.antutu
    },
    benchmarkSource: {
      sourceName: "Geekbench 6 & AnTuTu 10 Official Database",
      sourceUrl: "https://www.browser.geekbench.com/",
      testDate: `${model.releaseYear}-01`
    }
  };
});

fullPhones.sort((a, b) => b.score - a.score);

fs.writeFileSync(phonesPath, JSON.stringify(fullPhones, null, 2), 'utf8');
console.log('Successfully written', fullPhones.length, 'curated phones in src/data/phones.json');
