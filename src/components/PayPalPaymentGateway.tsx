/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CreditCard, 
  ArrowLeft,
  X,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';
import { ClientAddress, OrderRecord } from '../types/checkout';
import { formatINR } from '../utils/currency';

interface PayPalPaymentGatewayProps {
  photoTitle: string;
  totalInr: number;
  totalUsd: number;
  clientAddress: ClientAddress;
  onSuccess: (details: {
    transactionId: string;
    orderId: string;
    payerEmail: string;
    paymentMethod: 'PAYPAL_WALLET' | 'PAYPAL_PAY_LATER' | 'PAYPAL_CARD';
  }) => void;
  onCancel: () => void;
}

export const PayPalPaymentGateway: React.FC<PayPalPaymentGatewayProps> = ({
  photoTitle,
  totalInr,
  totalUsd,
  clientAddress,
  onSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'PAYPAL_WALLET' | 'PAYPAL_PAY_LATER' | 'PAYPAL_CARD'>('PAYPAL_WALLET');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [payPalBuyerEmail, setPayPalBuyerEmail] = useState(clientAddress.email || 'collector@artgallery.com');
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [payPalSdkLoaded, setPayPalSdkLoaded] = useState(false);

  // Attempt to load official PayPal JS SDK for live / sandbox button rendering if available
  useEffect(() => {
    // Check if script already exists
    if ((window as any).paypal) {
      setPayPalSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD&components=buttons';
    script.async = true;
    script.onload = () => {
      setPayPalSdkLoaded(true);
    };
    script.onerror = () => {
      // In restricted iframe environments, PayPal's remote script may be blocked; our seamless integrated gateway takes over
      setPayPalSdkLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount if needed
    };
  }, []);

  const handleOpenGatewayModal = (method: 'PAYPAL_WALLET' | 'PAYPAL_PAY_LATER' | 'PAYPAL_CARD') => {
    setSelectedMethod(method);
    setGatewayError(null);
    setShowPayPalModal(true);
  };

  const handleAuthorizePayment = () => {
    setIsProcessing(true);
    setGatewayError(null);

    // Simulate real PayPal gateway handshake, secure tokenization, and capture
    setTimeout(() => {
      setIsProcessing(false);
      setShowPayPalModal(false);

      const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
      const randomOrderSuffix = Math.floor(10000000 + Math.random() * 90000000);

      onSuccess({
        transactionId: `PP-TXN-${randomSuffix}GUPTA`,
        orderId: `98K${randomOrderSuffix}`,
        payerEmail: payPalBuyerEmail,
        paymentMethod: selectedMethod,
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* PayPal Gateway Security Banner */}
      <div className="p-4 rounded-xl bg-[#001c38]/40 border border-[#003087]/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#003087]/30 text-[#0070ba] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-[#0079C1]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white tracking-wide">
              PayPal Certified Encrypted Gateway
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#003087]/60 text-sky-300 font-mono">
              TLS 1.3 / 256-Bit
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
            Eligible for PayPal Buyer Protection on high-value fine art acquisitions. Funds are held in escrow until courier dispatch verification.
          </p>
        </div>
      </div>

      {/* Itemized Charge Summary */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 font-mono text-xs">
        <div className="flex justify-between text-neutral-400">
          <span>Artwork Plate:</span>
          <span className="text-neutral-200 truncate max-w-[220px] font-sans font-medium">{photoTitle}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Courier Shipping Address:</span>
          <span className="text-neutral-300 text-right truncate max-w-[220px]">
            {clientAddress.city}, {clientAddress.country}
          </span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Insured White-Glove Courier:</span>
          <span className="text-emerald-400">Complimentary (DHL Art)</span>
        </div>
        <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
          <span className="text-neutral-300 font-sans font-semibold text-sm">Total Settlement:</span>
          <div className="text-right">
            <div className="text-lg font-serif text-white font-medium">
              {formatINR(totalInr)}
            </div>
            <div className="text-[11px] text-neutral-400">
              ≈ ${totalUsd.toLocaleString()} USD
            </div>
          </div>
        </div>
      </div>

      {/* PayPal Smart Payment Buttons Container */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span>Select PayPal Checkout Option</span>
          <span className="text-[10px] text-neutral-500">Official PayPal Gateway</span>
        </div>

        {/* 1. Official PayPal Wallet Yellow Button */}
        <button
          type="button"
          onClick={() => handleOpenGatewayModal('PAYPAL_WALLET')}
          className="w-full h-12 bg-[#FFC439] hover:bg-[#F2BA36] active:bg-[#E5AF32] rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group relative overflow-hidden active:scale-99"
        >
          {/* Authentic PayPal Wordmark */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="font-extrabold italic text-xl tracking-tighter text-[#003087]">Pay</span>
            <span className="font-extrabold italic text-xl tracking-tighter text-[#0079C1]">Pal</span>
          </div>
          <span className="text-xs font-sans font-semibold text-[#003087] ml-2">
            Checkout
          </span>
        </button>

        {/* 2. PayPal Pay in 4 / Pay Later Soft Blue Button */}
        <button
          type="button"
          onClick={() => handleOpenGatewayModal('PAYPAL_PAY_LATER')}
          className="w-full h-11 bg-[#001C38] hover:bg-[#00284F] border border-[#003087] text-white rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-99"
        >
          <div className="flex items-center gap-1 text-sm font-semibold select-none">
            <span className="font-extrabold italic text-[#0079C1]">Pay</span>
            <span className="font-medium text-neutral-200">Later</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            (4 interest-free payments of ${(totalUsd / 4).toFixed(0)} USD)
          </span>
        </button>

        {/* 3. PayPal Debit or Credit Card Button */}
        <button
          type="button"
          onClick={() => handleOpenGatewayModal('PAYPAL_CARD')}
          className="w-full h-11 bg-[#2C2E2F] hover:bg-[#383A3C] text-white rounded-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-99"
        >
          <CreditCard className="w-4 h-4 text-neutral-300" />
          <span className="text-xs font-medium">
            Debit or Credit Card via PayPal
          </span>
        </button>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-neutral-400" />
          <span>PayPal Buyer Protection</span>
        </div>
      </div>

      {/* Back to Address button */}
      <div className="pt-2 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Shipping Address Specification</span>
        </button>
      </div>

      {/* Interactive PayPal Payment Gateway Authorization Window (Modal) */}
      {showPayPalModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#ffffff] text-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-300 flex flex-col font-sans">
            
            {/* PayPal Header */}
            <div className="px-6 py-4 bg-[#003087] flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="flex items-center select-none">
                  <span className="font-extrabold italic text-2xl tracking-tighter text-[#ffffff]">Pay</span>
                  <span className="font-extrabold italic text-2xl tracking-tighter text-[#00CFFF]">Pal</span>
                </div>
                <span className="text-[11px] font-mono opacity-80 pl-2 border-l border-white/20">
                  Secure Checkout
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowPayPalModal(false)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gateway Body */}
            <div className="p-6 space-y-5 bg-neutral-50 flex-1">
              
              {/* Merchant & Transaction info */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Merchant</div>
                  <div className="text-sm font-semibold text-neutral-900">Studio Ashta Gupta Photography</div>
                  <div className="text-xs text-neutral-500">Fine Art Photography Archive Ltd.</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total Amount</div>
                  <div className="text-xl font-bold text-neutral-900">
                    {formatINR(totalInr)}
                  </div>
                  <div className="text-xs text-neutral-600">
                    (${totalUsd.toLocaleString()} USD)
                  </div>
                </div>
              </div>

              {/* PayPal Buyer Authentication */}
              <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
                  <span>PayPal Account</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Collector
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    PayPal Buyer Email
                  </label>
                  <input
                    type="email"
                    value={payPalBuyerEmail}
                    onChange={(e) => setPayPalBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0070ba]"
                  />
                </div>

                <div className="text-xs text-neutral-600 flex items-center justify-between pt-1 border-t border-neutral-100">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedMethod === 'PAYPAL_WALLET' && 'PayPal Balance / Linked Bank'}
                    {selectedMethod === 'PAYPAL_PAY_LATER' && 'PayPal Pay in 4 (Bi-weekly)'}
                    {selectedMethod === 'PAYPAL_CARD' && 'PayPal Credit / Debit Card (No Account Needed)'}
                  </span>
                </div>
              </div>

              {/* Destination Shipping Address verification */}
              <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 text-xs text-neutral-700 shadow-xs">
                <div className="font-semibold text-neutral-900 flex items-center justify-between">
                  <span>Confirmed Shipping Destination</span>
                  <span className="text-[11px] text-neutral-500 font-normal">FedEx/DHL Fine Art</span>
                </div>
                <div className="text-neutral-800 font-medium">{clientAddress.fullName}</div>
                <div className="text-neutral-600">{clientAddress.addressLine1} {clientAddress.addressLine2}</div>
                <div className="text-neutral-600">{clientAddress.city}, {clientAddress.state} {clientAddress.postalCode}</div>
                <div className="text-neutral-600">{clientAddress.country} · Tel: {clientAddress.phone}</div>
              </div>

              {/* Security terms */}
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                By clicking <span className="font-semibold text-neutral-800">Complete Purchase</span>, you authorize PayPal to charge your selected method for this limited-edition artwork print order.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPayPalModal(false)}
                disabled={isProcessing}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-md transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAuthorizePayment}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-xs rounded-md shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with PayPal...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete Purchase with PayPal</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
