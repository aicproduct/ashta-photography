/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClientAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
}

export interface OrderRecord {
  id: string; // e.g. AG-ORD-74921
  paypalTransactionId: string; // e.g. PP-TXN-938210384
  paypalPayerEmail?: string;
  paypalOrderId?: string;
  paymentMethod: 'PAYPAL_WALLET' | 'PAYPAL_PAY_LATER' | 'PAYPAL_CARD';
  createdAt: string;
  status: 'PAID' | 'DISPATCHED' | 'AUTHENTICATED';
  photoId: string;
  photoTitle: string;
  photoImageSrc: string;
  series: string;
  editionNumber: number;
  totalEditions: number;
  size: string;
  substrate: string;
  frame: string;
  totalInr: number;
  totalUsd: number;
  clientAddress: ClientAddress;
  trackingNumber?: string;
}
