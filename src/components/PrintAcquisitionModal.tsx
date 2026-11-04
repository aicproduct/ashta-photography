/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  Frame, 
  Sparkles, 
  Send, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  FileText 
} from 'lucide-react';
import { Photograph } from '../types/portfolio';
import { ClientAddress, OrderRecord } from '../types/checkout';
import { formatINR, normalizeToINR, CURRENCIES } from '../utils/currency';
import { PayPalPaymentGateway } from './PayPalPaymentGateway';
import { getSavedClientAddress, saveClientAddress, saveOrder } from '../utils/orderStorage';

interface PrintAcquisitionModalProps {
  photo: Photograph;
  onClose: () => void;
  onOrderCompleted?: (order: OrderRecord) => void;
}

type CheckoutStep = 'specs' | 'address' | 'payment' | 'confirmed';

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Switzerland',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Italy',
  'Netherlands',
  'Hong Kong',
  'Austria',
  'Belgium',
  'Sweden',
  'Denmark',
  'Norway',
  'South Korea',
  'Spain',
  'Other / International'
];

export const PrintAcquisitionModal: React.FC<PrintAcquisitionModalProps> = ({
  photo,
  onClose,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<CheckoutStep>('specs');

  // Specification state
  const [selectedSize, setSelectedSize] = useState<'30x45cm' | '50x75cm' | '70x105cm'>('50x75cm');
  const [selectedPaper, setSelectedPaper] = useState<string>('Hahnemühle Photo Rag 308gsm');
  const [selectedFrame, setSelectedFrame] = useState<'unframed' | 'black-aluminum' | 'walnut-float'>('walnut-float');

  // Client Address State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [saveAddressPref, setSaveAddressPref] = useState(true);
  const [addressFormErrors, setAddressFormErrors] = useState<Record<string, string>>({});

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [copiedTxnId, setCopiedTxnId] = useState(false);

  // Load saved client address on initial mount if available
  useEffect(() => {
    const saved = getSavedClientAddress();
    if (saved) {
      if (saved.fullName) setFullName(saved.fullName);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
      if (saved.addressLine1) setAddressLine1(saved.addressLine1);
      if (saved.addressLine2) setAddressLine2(saved.addressLine2);
      if (saved.city) setCity(saved.city);
      if (saved.state) setState(saved.state);
      if (saved.postalCode) setPostalCode(saved.postalCode);
      if (saved.country) setCountry(saved.country);
      if (saved.deliveryNotes) setDeliveryNotes(saved.deliveryNotes);
    }
  }, []);

  // Price calculations in INR (default currency)
  const basePrice = normalizeToINR(photo.editionInfo.startingPrice);
  const sizeMultiplier = selectedSize === '30x45cm' ? 1 : selectedSize === '50x75cm' ? 1.45 : 2.1;
  const frameCost = selectedFrame === 'unframed' ? 0 : selectedFrame === 'black-aluminum' ? 32000 : 46000;
  const paperPremium = selectedPaper.includes('Awagami') ? 8500 : 0;
  const calculatedTotalInr = Math.round(basePrice * sizeMultiplier + frameCost + paperPremium);
  const calculatedTotalUsd = Math.round(calculatedTotalInr / CURRENCIES.USD.rateToInr);

  // Validate Client Address
  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Collector / recipient name is required.';
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!phone.trim()) errors.phone = 'Contact telephone is required for customs courier.';
    if (!addressLine1.trim()) errors.addressLine1 = 'Street address line 1 is required.';
    if (!city.trim()) errors.city = 'City or district is required.';
    if (!state.trim()) errors.state = 'State / province / region is required.';
    if (!postalCode.trim()) errors.postalCode = 'Postal / PIN / ZIP code is required.';
    if (!country.trim()) errors.country = 'Country destination is required.';

    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;

    if (saveAddressPref) {
      saveClientAddress({
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        deliveryNotes,
      });
    }

    setStep('payment');
  };

  const handlePaymentSuccess = (details: {
    transactionId: string;
    orderId: string;
    payerEmail: string;
    paymentMethod: 'PAYPAL_WALLET' | 'PAYPAL_PAY_LATER' | 'PAYPAL_CARD';
  }) => {
    const newOrder: OrderRecord = {
      id: `AG-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      paypalTransactionId: details.transactionId,
      paypalOrderId: details.orderId,
      paypalPayerEmail: details.payerEmail,
      paymentMethod: details.paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'PAID',
      photoId: photo.id,
      photoTitle: photo.title,
      photoImageSrc: photo.imageSrc,
      series: photo.series,
      editionNumber: Math.max(1, photo.editionInfo.total - photo.editionInfo.available + 1),
      totalEditions: photo.editionInfo.total,
      size: selectedSize,
      substrate: selectedPaper,
      frame: selectedFrame,
      totalInr: calculatedTotalInr,
      totalUsd: calculatedTotalUsd,
      clientAddress: {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        deliveryNotes,
      },
      trackingNumber: `DHL-EXP-ART-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    saveOrder(newOrder);
    setCompletedOrder(newOrder);
    if (onOrderCompleted) {
      onOrderCompleted(newOrder);
    }
    setStep('confirmed');
  };

  const handleCopyTxn = () => {
    if (completedOrder) {
      navigator.clipboard?.writeText(completedOrder.paypalTransactionId);
      setCopiedTxnId(true);
      setTimeout(() => setCopiedTxnId(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0b0e] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col font-sans">
        
        {/* Modal Top Header with Stepper */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#0e0e12]">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <span>Archival Fine Art Acquisition</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-400">PayPal Gateway</span>
              </div>
              <h2 className="text-base sm:text-lg font-serif text-white tracking-wide mt-0.5 truncate max-w-xs sm:max-w-md">
                {photo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded ${step === 'specs' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500'}`}>
                1. Specification
              </span>
              <span className="text-neutral-700">/</span>
              <span className={`px-2 py-0.5 rounded ${step === 'address' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500'}`}>
                2. Client Address
              </span>
              <span className="text-neutral-700">/</span>
              <span className={`px-2 py-0.5 rounded ${step === 'payment' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-500'}`}>
                3. PayPal Checkout
              </span>
              <span className="text-neutral-700">/</span>
              <span className={`px-2 py-0.5 rounded ${step === 'confirmed' ? 'bg-emerald-950 text-emerald-400 font-semibold' : 'text-neutral-500'}`}>
                4. Receipt
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        {step === 'confirmed' && completedOrder ? (
          /* STEP 4: ORDER CONFIRMATION & RECEIPT */
          <div className="p-6 sm:p-10 space-y-8 bg-[#09090b]">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-600/60 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <Check className="w-8 h-8" />
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Payment Authorized &amp; Capture Complete
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white">
                Archival Plate Acquisition Registered
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Thank you, <span className="text-neutral-200 font-medium">{completedOrder.clientAddress.fullName}</span>. Your payment of <span className="text-neutral-200 font-medium">{formatINR(completedOrder.totalInr)}</span> (${completedOrder.totalUsd.toLocaleString()} USD) has been verified via the PayPal Payment Gateway.
              </p>
            </div>

            {/* Official Collector Receipt Card */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 shadow-2xl text-xs font-mono">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="text-neutral-200 font-serif text-sm font-medium">ASHTA GUPTA PHOTOGRAPHY ARCHIVE</div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">Order Ref: {completedOrder.id}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold">
                    STATUS: PAID / RESERVED
                  </span>
                </div>
              </div>

              {/* PayPal Payment Details */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                <div className="text-sky-400 font-semibold flex items-center justify-between text-[11px]">
                  <span>PAYPAL GATEWAY TRANSACTION</span>
                  <span className="text-neutral-400">Verified via SSL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Transaction ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-bold">{completedOrder.paypalTransactionId}</span>
                    <button
                      type="button"
                      onClick={handleCopyTxn}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      title="Copy PayPal Transaction ID"
                    >
                      {copiedTxnId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Payer Account:</span>
                  <span className="text-neutral-300">{completedOrder.paypalPayerEmail}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Method:</span>
                  <span className="text-neutral-300">
                    {completedOrder.paymentMethod === 'PAYPAL_WALLET' ? 'PayPal Wallet' : completedOrder.paymentMethod === 'PAYPAL_PAY_LATER' ? 'PayPal Pay in 4' : 'Credit / Debit Card (PayPal)'}
                  </span>
                </div>
              </div>

              {/* Plate Specification & Edition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="text-neutral-500 text-[10px] uppercase">Edition Specification</div>
                  <div className="text-neutral-200 font-sans font-medium text-sm">{completedOrder.photoTitle}</div>
                  <div className="text-neutral-400">Series: {completedOrder.series}</div>
                  <div className="text-emerald-400">Edition #{completedOrder.editionNumber} of {completedOrder.totalEditions}</div>
                  <div className="text-neutral-400">Dimensions: {completedOrder.size}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-neutral-500 text-[10px] uppercase">Materials &amp; Glazing</div>
                  <div className="text-neutral-300 truncate">{completedOrder.substrate}</div>
                  <div className="text-neutral-300 capitalize">{completedOrder.frame.replace('-', ' ')}</div>
                  <div className="text-neutral-400">ISO 9706 Pigment Permanence</div>
                  <div className="text-neutral-400">Embossed Seal &amp; Artist Signature</div>
                </div>
              </div>

              {/* Client Shipping Dossier */}
              <div className="pt-3 border-t border-neutral-800 space-y-1.5">
                <div className="text-neutral-500 text-[10px] uppercase flex items-center justify-between">
                  <span>Registered Client Address &amp; Delivery Destination</span>
                  <span className="text-neutral-400">Tracking: {completedOrder.trackingNumber}</span>
                </div>
                <div className="text-neutral-200 font-sans font-medium">{completedOrder.clientAddress.fullName}</div>
                <div className="text-neutral-400">
                  {completedOrder.clientAddress.addressLine1}
                  {completedOrder.clientAddress.addressLine2 ? `, ${completedOrder.clientAddress.addressLine2}` : ''}
                </div>
                <div className="text-neutral-400">
                  {completedOrder.clientAddress.city}, {completedOrder.clientAddress.state} {completedOrder.clientAddress.postalCode}, {completedOrder.clientAddress.country}
                </div>
                <div className="text-neutral-400">
                  Tel: {completedOrder.clientAddress.phone} · Email: {completedOrder.clientAddress.email}
                </div>
                {completedOrder.clientAddress.deliveryNotes && (
                  <div className="text-[11px] text-amber-300/80 pt-1">
                    Courier Notes: "{completedOrder.clientAddress.deliveryNotes}"
                  </div>
                )}
              </div>

              {/* Total Paid */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-sm">
                <span className="text-neutral-300 font-semibold">Total Paid via PayPal:</span>
                <span className="text-lg font-serif text-white font-bold">{formatINR(completedOrder.totalInr)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-5 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Collector Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Return to Gallery
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1, 2, 3: SPECIFICATION, ADDRESS, PAYPAL CHECKOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Virtual Wall Simulation & Selected Specs */}
            <div className="lg:col-span-5 bg-[#070709] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
                  <span>Gallery Wall Simulation</span>
                  <span>{selectedSize}</span>
                </div>

                {/* Simulated Wall with Frame */}
                <div className="relative aspect-square w-full rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-center p-8 overflow-hidden shadow-inner">
                  {/* Subtle gallery downlight cone */}
                  <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                  {/* Framed Artwork Container */}
                  <div
                    className={`transition-all duration-300 shadow-2xl relative ${
                      selectedSize === '30x45cm'
                        ? 'w-44'
                        : selectedSize === '50x75cm'
                        ? 'w-56'
                        : 'w-64'
                    } ${
                      selectedFrame === 'black-aluminum'
                        ? 'p-2 bg-neutral-950 ring-2 ring-neutral-800'
                        : selectedFrame === 'walnut-float'
                        ? 'p-3 bg-[#3a271d] ring-1 ring-[#5c3e2f]'
                        : 'p-0 shadow-lg'
                    }`}
                  >
                    {/* White Archival Passepartout border */}
                    <div className={`${selectedFrame !== 'unframed' ? 'p-3 bg-[#f7f6f2]' : ''}`}>
                      <img
                        src={photo.imageSrc}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full object-cover shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Frame description note */}
                <div className="text-[11px] text-neutral-400 font-mono space-y-1">
                  <div>
                    {selectedFrame === 'walnut-float' && 'European Solid Walnut with 30mm spacer depth and Tru-Vue UltraVue UV-blocking glass.'}
                    {selectedFrame === 'black-aluminum' && 'Anodized matte black 10mm gallery profile with museum conservation backing.'}
                    {selectedFrame === 'unframed' && 'Archival float print rolled with acid-free glassine sheets in reinforced shipping cylinder.'}
                  </div>
                </div>
              </div>

              {/* Authenticity and Courier badges */}
              <div className="pt-6 space-y-2 border-t border-neutral-800/80 text-xs text-neutral-400 font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Embossed Certificate of Authenticity &amp; Artist Signature</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-300 shrink-0" />
                  <span>Insured white-glove DHL Express Fine Art Courier worldwide</span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Step Views */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              
              {/* STEP 1: SPECIFICATION VIEW */}
              {step === 'specs' && (
                <div className="space-y-6">
                  {/* Size Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                      Select Edition Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['30x45cm', '50x75cm', '70x105cm'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'bg-neutral-100 text-neutral-950 font-semibold border-neutral-100 shadow-sm'
                              : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800'
                          }`}
                        >
                          <div className="text-xs font-mono">{size}</div>
                          <div className="text-[10px] opacity-75">
                            {size === '30x45cm' ? 'A3+ Exhibition' : size === '50x75cm' ? 'Large Folio' : 'Museum Scale'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Substrate / Paper Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                      Archival Fine Art Substrate
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'Hahnemühle Photo Rag 308gsm', desc: '100% Cotton, smooth matte texture, archival museum standard' },
                        { id: 'Canson Infinity Baryta Prestige II 340gsm', desc: 'Barium sulphate coating reproducing classic darkroom silver halide' },
                        { id: 'Awagami Washi Kozo 110gsm', desc: 'Handmade Japanese mulberry fiber with organic raw deckled edge (+₹8,500)' },
                      ].map((paper) => (
                        <label
                          key={paper.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaper === paper.id
                              ? 'bg-neutral-900 border-neutral-600 text-neutral-100'
                              : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paper"
                            checked={selectedPaper === paper.id}
                            onChange={() => setSelectedPaper(paper.id)}
                            className="mt-0.5 accent-white cursor-pointer"
                          />
                          <div className="text-xs">
                            <div className="font-medium text-neutral-200">{paper.id}</div>
                            <div className="text-neutral-500 font-light text-[11px] mt-0.5">{paper.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Framing Options */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                      Framing &amp; Glazing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'unframed', name: 'Unframed Roll', fee: 'Included' },
                        { id: 'black-aluminum', name: 'Matte Black Metal', fee: '+₹32,000' },
                        { id: 'walnut-float', name: 'Natural Walnut', fee: '+₹46,000' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFrame(f.id as any)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            selectedFrame === f.id
                              ? 'bg-neutral-100 text-neutral-950 font-semibold border-neutral-100 shadow-sm'
                              : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800'
                          }`}
                        >
                          <div className="text-xs font-medium">{f.name}</div>
                          <div className="text-[10px] font-mono opacity-80">{f.fee}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price calculation bar */}
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-neutral-400">Total Investment (INR)</div>
                      <div className="text-2xl font-serif text-white tabular-nums font-medium">
                        {formatINR(calculatedTotalInr)}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        ≈ ${calculatedTotalUsd.toLocaleString()} USD via PayPal
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-emerald-400">
                      <div>Limited Edition</div>
                      <div>{photo.editionInfo.available} of {photo.editionInfo.total} impressions remain</div>
                    </div>
                  </div>

                  {/* Button to proceed to Client Address */}
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="w-full py-3 px-4 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-99"
                  >
                    <span>Proceed to Client Address Specification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: CLIENT ADDRESS SPECIFICATION FORM */}
              {step === 'address' && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-base font-serif text-white font-medium">
                        Client Delivery Address
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Specify client contact and destination address for white-glove art courier shipment.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">Step 2 of 3</span>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        Collector Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Julian Hayes"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.fullName ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.fullName && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="julian@example.com"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.email && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        Contact Telephone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210 or +1 (555) 019-2834"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.phone && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        Destination Country <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600 cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900 text-neutral-200">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Street Address Line 1 */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                      Street Address (Line 1) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. 42 Shanti Path, Chanakyapuri or 100 Fifth Avenue"
                      className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                        addressFormErrors.addressLine1 ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                      }`}
                    />
                    {addressFormErrors.addressLine1 && (
                      <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.addressLine1}</p>
                    )}
                  </div>

                  {/* Street Address Line 2 (Apartment / Suite) */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Apartment, Suite, Studio, Floor (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="e.g. Suite 7B, Floor 3, Private Gallery Reception"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        City / District <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New Delhi or New York"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.city ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.city && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        State / Province <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Delhi or NY"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.state ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.state && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1">
                        Postal / PIN Code <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="110021 or 10011"
                        className={`w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border rounded-md focus:outline-none ${
                          addressFormErrors.postalCode ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-800 focus:border-neutral-600'
                        }`}
                      />
                      {addressFormErrors.postalCode && (
                        <p className="text-[10px] text-rose-400 mt-1">{addressFormErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery / White Glove Courier Notes */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Courier &amp; Handling Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Call 30 minutes before arrival. Gate code #4021. High-value artwork delivery."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-100 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  {/* Save address checkbox */}
                  <label className="flex items-center gap-2 pt-1 text-xs text-neutral-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddressPref}
                      onChange={(e) => setSaveAddressPref(e.target.checked)}
                      className="accent-white rounded cursor-pointer"
                    />
                    <span>Save client delivery address for future fine art acquisitions</span>
                  </label>

                  {/* Actions: Back & Proceed to PayPal */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('specs')}
                      className="px-4 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Specs</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-99"
                    >
                      <span>Continue to PayPal Gateway</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: PAYPAL PAYMENT GATEWAY VIEW */}
              {step === 'payment' && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="text-base font-serif text-white font-medium">
                      PayPal Payment Gateway
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Authorize payment for limited archival print #{Math.max(1, photo.editionInfo.total - photo.editionInfo.available + 1)} of {photo.editionInfo.total}.
                    </p>
                  </div>

                  <PayPalPaymentGateway
                    photoTitle={photo.title}
                    totalInr={calculatedTotalInr}
                    totalUsd={calculatedTotalUsd}
                    clientAddress={{
                      fullName,
                      email,
                      phone,
                      addressLine1,
                      addressLine2,
                      city,
                      state,
                      postalCode,
                      country,
                      deliveryNotes,
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setStep('address')}
                  />
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
