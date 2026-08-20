/**
 * Scoring Module for Hardware Benchmark Database
 * Fully decoupled formula for calculating relative scores and price-performance metrics.
 */

// Baseline parameters
const FLAGSHIP_SCORES = {
  timeSpyExtreme: 24500,
  cyberpunk4kUltra: 98.5,
  blenderRenderSec: 12.4
};

/**
 * Calculates Performance Score (0 - 1100) based on benchmark metrics.
 */
export function calculatePerformanceScore(benchmarks) {
  if (!benchmarks) return 0;

  // Normalized individual metrics relative to RTX 5090 baseline
  const tsNorm = (benchmarks.timeSpyExtreme || 0) / FLAGSHIP_SCORES.timeSpyExtreme;
  const cpNorm = (benchmarks.cyberpunk4kUltra || 0) / FLAGSHIP_SCORES.cyberpunk4kUltra;
  
  // Blender render time (lower is better)
  const blenderTime = benchmarks.blenderRenderSec || 999;
  const blenderNorm = FLAGSHIP_SCORES.blenderRenderSec / blenderTime;

  // Weighted composite score (50% Synthetic/3D, 35% Gaming 4K, 15% Productivity)
  const composite = (tsNorm * 0.50) + (cpNorm * 0.35) + (blenderNorm * 0.15);
  
  // Scaled 0 to 100
  const score = Math.round(Math.min(Math.max(composite * 100, 1), 1100));
  return score;
}

/**
 * Calculates Price to Performance Value Rating (1 to 5 stars)
 * @param {number} score Overall Performance Score (0-100)
 * @param {number} msrp Price in USD
 * @returns {object} { ratingStars: string, ratio: number, tier: string }
 */
export function calculateValueRating(score, msrp) {
  if (!msrp || msrp <= 0 || !score) {
    return { stars: '☆☆☆☆☆', starCount: 0, ratio: 0, label: 'N/A' };
  }

  // Ratio of Performance Score per $100 MSRP
  const ratio = (score / msrp) * 100;

  // Scaled Star thresholds (e.g. RX 9070 XT @ $599 (score 69) = ratio ~11.5 -> 5 stars)
  let starCount = 1;
  let label = 'Low Value';

  if (ratio >= 11.0) {
    starCount = 5;
    label = 'Exceptional Value';
  } else if (ratio >= 8.5) {
    starCount = 4;
    label = 'Great Value';
  } else if (ratio >= 6.5) {
    starCount = 3;
    label = 'Fair Value';
  } else if (ratio >= 4.5) {
    starCount = 2;
    label = 'Premium Price';
  } else {
    starCount = 1;
    label = 'Enthusiast Flagship';
  }

  const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

  return {
    stars,
    starCount,
    ratio: parseFloat(ratio.toFixed(2)),
    label
  };
}

/**
 * Determines score color class for CSS rendering
 */
export function getScoreBadgeColorClass(score) {
  if (score >= 75) return 'badge-ultra';
  if (score >= 50) return 'badge-high';
  if (score >= 15) return 'badge-mid';
  if (score >= 5) return 'badge-neutral';
  return 'badge-entry';
}
