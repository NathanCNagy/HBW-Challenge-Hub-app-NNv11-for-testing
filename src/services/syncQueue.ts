/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from '../firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export interface SyncEvent {
  timestamp: string;
  type: string;
  payload: any;
}

// In-memory queue of sync events to keep cloud writes batched & save transmission compute
let syncQueue: SyncEvent[] = [];

export function getPendingSyncCount(): number {
  return syncQueue.length;
}

export function queueSyncEvent(type: string, payload: any): void {
  syncQueue.push({
    timestamp: new Date().toISOString(),
    type,
    payload
  });
}

export async function uploadSyncQueue(userId: string): Promise<void> {
  if (syncQueue.length === 0) return;

  try {
    const batch = writeBatch(db);
    const userSyncCol = collection(db, 'users', userId, 'sync_events');

    syncQueue.forEach((event) => {
      const docRef = doc(userSyncCol);
      batch.set(docRef, event);
    });

    await batch.commit();
    syncQueue = []; // Clear queue on successful commit
  } catch (error) {
    console.error('Failed to commit batch sync payload:', error);
  }
}

/**
 * Smart synchronization checking tool.
 * Ensures data is only pushed to Firestore under environment-friendly constraints:
 * - Network is online (wifi/ethernet preferred)
 * - Battery is charging or above 20%
 */
export async function checkAndProcessSyncQueue(userId: string): Promise<void> {
  let isOnline = true;
  let isBatteryOk = true;

  if (typeof navigator !== 'undefined') {
    isOnline = navigator.onLine;

    // Check Network Information API if available
    const navAny = navigator as any;
    if (navAny.connection) {
      const type = navAny.connection.type;
      if (type && type !== 'wifi' && type !== 'ethernet' && type !== 'none') {
        // Cellular connection - still permit if online
        isOnline = true;
      }
    }

    // Check Battery API if available
    if (navAny.getBattery) {
      try {
        const battery = await navAny.getBattery();
        isBatteryOk = battery.charging || battery.level > 0.2;
      } catch {
        isBatteryOk = true;
      }
    }
  }

  if (isOnline && isBatteryOk) {
    await uploadSyncQueue(userId);
  }
}
