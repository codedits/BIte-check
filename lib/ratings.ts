// Central helpers for consistent rating logic with minimal overhead.
export const CATEGORY_KEYS = ['taste','presentation','service','ambiance','value'] as const;
export type CategoryKey = typeof CATEGORY_KEYS[number];

// Weights chosen to emphasize taste while keeping total = 100.
const WEIGHTS: Record<CategoryKey, number> = { taste: 40, presentation: 15, service: 15, ambiance: 15, value: 15 };
const TOTAL_WEIGHT = 100; // invariant for quick math

export function computeWeightedRating(values: Partial<Record<CategoryKey, number>>): number {
  let sum = 0;
  for (const k of CATEGORY_KEYS) sum += (values[k] || 0) * WEIGHTS[k];
  return sum ? Math.round((sum / TOTAL_WEIGHT) * 10) / 10 : 0;
}

export function allCategoriesRated(values: Partial<Record<CategoryKey, number>>): boolean {
  for (const k of CATEGORY_KEYS) {
    const v = values[k];
    if (typeof v !== 'number' || v <= 0) return false;
  }
  return true;
}
