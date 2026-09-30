/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storage } from '../services/storage';

export type UnitSystem = 'imperial' | 'metric';

/**
 * Detects whether the current user is located in the United States
 * based on browser locale, timezone, and Intl API.
 */
export function detectUserIsUS(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    // 1. Timezone heuristic (US timezones strictly)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (timeZone) {
      if (
        timeZone.startsWith('America/New_York') ||
        timeZone.startsWith('America/Detroit') ||
        timeZone.startsWith('America/Kentucky') ||
        timeZone.startsWith('America/Indiana') ||
        timeZone.startsWith('America/Chicago') ||
        timeZone.startsWith('America/Menominee') ||
        timeZone.startsWith('America/North_Dakota') ||
        timeZone.startsWith('America/Denver') ||
        timeZone.startsWith('America/Boise') ||
        timeZone.startsWith('America/Phoenix') ||
        timeZone.startsWith('America/Los_Angeles') ||
        timeZone.startsWith('America/Anchorage') ||
        timeZone.startsWith('America/Juneau') ||
        timeZone.startsWith('America/Sitka') ||
        timeZone.startsWith('America/Yakutat') ||
        timeZone.startsWith('America/Nome') ||
        timeZone.startsWith('America/Adak') ||
        timeZone.startsWith('America/Metlakatla') ||
        timeZone.startsWith('Pacific/Honolulu') ||
        timeZone === 'US/Eastern' ||
        timeZone === 'US/Central' ||
        timeZone === 'US/Mountain' ||
        timeZone === 'US/Pacific' ||
        timeZone === 'US/Alaska' ||
        timeZone === 'US/Hawaii'
      ) {
        return true;
      }
    }

    // 2. Browser Locale Heuristic
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const lang of languages) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower === 'en-us' || lower.endsWith('-us') || lower.endsWith('_us')) {
        return true;
      }
    }

    // Default everywhere else across the world to metric
    return false;
  } catch (e) {
    console.warn('Unit system detection fallback error:', e);
    return true;
  }
}

/**
 * Resolves the active unit system, respecting any manual user preference
 * stored in local storage, otherwise automatically falling back to geo-detection.
 */
export function getInitialUnitSystem(): UnitSystem {
  const saved = storage.getString('hbw_unit_system');
  if (saved === 'imperial' || saved === 'metric') {
    return saved;
  }
  return detectUserIsUS() ? 'imperial' : 'metric';
}

/**
 * Converts miles to kilometres with rounding.
 * 1 mile = 1.609344 km
 */
export function milesToKm(miles: number): number {
  return Math.round(miles * 1.609344);
}

/**
 * Formats a metric value with appropriate units and compact symbols
 * based on the active unit system (imperial for US, metric for rest of world).
 */
export function formatImpactMetric(
  unit: string,
  value: number,
  system: UnitSystem
): { value: number; unit: string; display: string } {
  const isMetric = system === 'metric';

  // Distance / Driving miles
  if (unit === 'mi' || unit.toLowerCase().includes('mile')) {
    if (isMetric) {
      const kmVal = milesToKm(value);
      return {
        value: kmVal,
        unit: 'km',
        display: `+${kmVal.toLocaleString()} km`
      };
    }
    return {
      value,
      unit: 'mi',
      display: `+${value.toLocaleString()} mi`
    };
  }

  // Currency / Grocery money
  if (unit === 'dollars' || unit === '$') {
    return {
      value,
      unit: '$',
      display: `+$${value.toLocaleString()}`
    };
  }

  // Time / Sleep / Power
  if (unit === 'hrs' || unit === 'hours' || unit === 'h') {
    return {
      value,
      unit: 'hrs',
      display: `+${value.toLocaleString()} hrs`
    };
  }

  // Energy
  if (unit === 'kWh') {
    return {
      value,
      unit: 'kWh',
      display: `+${value.toLocaleString()} kWh`
    };
  }

  // Percentage
  if (unit === '%') {
    return {
      value,
      unit: '%',
      display: `+${value}%`
    };
  }

  // People / Community
  if (unit === 'people') {
    return {
      value,
      unit: 'people',
      display: `+${value.toLocaleString()} people`
    };
  }

  // Default fallback
  return {
    value,
    unit,
    display: `+${value.toLocaleString()} ${unit}`
  };
}

/**
 * Formats streak-based driving mileage for the progress tab and dashboard
 */
export function formatDrivingStreak(streak: number, system: UnitSystem): { value: string; unit: string } {
  if (system === 'metric') {
    return {
      value: `${(streak * 8.2).toFixed(0)} km`,
      unit: 'km'
    };
  }
  return {
    value: `${(streak * 5.1).toFixed(0)} mi`,
    unit: 'mi'
  };
}
