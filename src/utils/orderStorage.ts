/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientAddress, OrderRecord } from '../types/checkout';

const ORDERS_KEY = 'ashta_gupta_orders';
const CLIENT_ADDRESS_KEY = 'ashta_gupta_client_address';

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'AG-ORD-92841',
    paypalTransactionId: 'PP-TXN-773920194GUPTA',
    paypalPayerEmail: 'curator.vermeer@modernart.ch',
    paypalOrderId: '98K92817349120',
    paymentMethod: 'PAYPAL_WALLET',
    createdAt: '2026-10-28T14:32:00Z',
    status: 'PAID',
    photoId: 'plate-01',
    photoTitle: 'Stepwell of Chand Baori: Geometric Ascent',
    photoImageSrc: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=85',
    series: 'Geometry of Devotion',
    editionNumber: 2,
    totalEditions: 10,
    size: '70x105cm',
    substrate: 'Hahnemühle Photo Rag 308gsm',
    frame: 'walnut-float',
    totalInr: 295000,
    totalUsd: 3410,
    clientAddress: {
      fullName: 'Marc van der Meer',
      email: 'curator.vermeer@modernart.ch',
      phone: '+41 22 819 4022',
      addressLine1: 'Quai du Mont-Blanc 19',
      addressLine2: 'Private Collector Suite 4B',
      city: 'Geneva',
      state: 'Geneva',
      postalCode: '1201',
      country: 'Switzerland',
      deliveryNotes: 'White-glove delivery, please phone ahead. High-value artwork clearance pre-arranged.',
    },
    trackingNumber: 'DHL-ART-CH-8829104',
  },
  {
    id: 'AG-ORD-91730',
    paypalTransactionId: 'PP-TXN-492018471GUPTA',
    paypalPayerEmail: 'elena.rostova@rothschildart.co.uk',
    paypalOrderId: '74L81920491028',
    paymentMethod: 'PAYPAL_CARD',
    createdAt: '2026-10-15T09:18:00Z',
    status: 'DISPATCHED',
    photoId: 'plate-04',
    photoTitle: 'Ghats of Varanasi: Dawn Oblation',
    photoImageSrc: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85',
    series: 'Sacred Waters',
    editionNumber: 4,
    totalEditions: 12,
    size: '50x75cm',
    substrate: 'Awagami Washi Kozo 110gsm',
    frame: 'black-aluminum',
    totalInr: 215000,
    totalUsd: 2485,
    clientAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@rothschildart.co.uk',
      phone: '+44 20 7946 0912',
      addressLine1: '38 Berkeley Square',
      addressLine2: 'Floor 3',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W1J 5AE',
      country: 'United Kingdom',
      deliveryNotes: 'Concierge desk accepted for fine art reception.',
    },
    trackingNumber: 'DHL-EXP-UK-9182049',
  },
];

export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read orders from storage', e);
  }
  return INITIAL_ORDERS;
}

export function saveOrder(newOrder: OrderRecord): OrderRecord[] {
  try {
    const current = getStoredOrders();
    const updated = [newOrder, ...current];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not save order', e);
    return [newOrder];
  }
}

export function getSavedClientAddress(): Partial<ClientAddress> | null {
  try {
    const raw = localStorage.getItem(CLIENT_ADDRESS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveClientAddress(address: ClientAddress): void {
  try {
    localStorage.setItem(CLIENT_ADDRESS_KEY, JSON.stringify(address));
  } catch {
    // ignore
  }
}
