import type { EnergyLevel } from '../types/common.js';

const ENERGY_RANK: Record<EnergyLevel, number> = { low: 1, medium: 2, high: 3 };

export function energyCompatibilityScore(required: EnergyLevel, available: EnergyLevel): number {
  const requiredRank = ENERGY_RANK[required];
  const availableRank = ENERGY_RANK[available];
  if (requiredRank === availableRank) return 3;
  if (requiredRank < availableRank) return 2;
  return 1;
}
