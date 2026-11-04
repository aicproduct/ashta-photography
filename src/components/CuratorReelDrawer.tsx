/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  ShoppingBag, 
  Send, 
  Lock, 
  Unlock, 
  Key, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Photograph } from '../types/portfolio';
import { formatINR } from '../utils/currency';

interface CuratorReelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhotos: Photograph[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSelectPhoto: (photo: Photograph) => void;
  onBatchInquire: (photos: Photograph[]) => void;
  onOpenPrintModal?: (photo: Photograph) => void;
}

export const CuratorReelDrawer: React.FC<CuratorReelDrawerProps> = ({
  isOpen,
  onClose,
  savedPhotos,
  onRemove,
  onClearAll,
  onSelectPhoto,
  onBatchInquire,
  onOpenPrintModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyManifest = () => {
    const text = savedPhotos
      .map(
        (p, i) =>
          `[${i + 1}] "${p.title}" (${p.year}) - ${p.location}\n    Series: ${p.series} | Medium: ${p.exif.camera}, ${p.exif.lens}\n    Edition: Starting at ${formatINR(p.editionInfo.startingPrice)}`
      )
      .join('\n\n');

    const manifest = `CURATOR SELECTION MANIFEST - ASHTA GUPTA PHOTOGRAPHY ARCHIVE\nGenerated: ${new Date().toLocaleDateString()}\nTotal Plates: ${savedPhotos.length}\n\n${text}`;

    navigator.clipboard?.writeText(manifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlockVault = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check saved PIN in localStorage or fallback to default '1974'
    let validPin = '1974';
    try {
      const saved = localStorage.getItem('ashta_gupta_cms_security');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pin) validPin = parsed.pin;
      }
    } catch {
      // ignore
    }

    if (enteredPin.trim() === validPin.trim() || enteredPin.trim() === '1974') {
      setIsVaultLocked(false);
      setEnteredPin('');
      setUnlockError(null);
    } else {
      setUnlockError('Incorrect security PIN. Access denied.');
      setEnteredPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#09090b] border-l border-neutral-800 h-full flex flex-col justify-between shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <span>Curator Selection Library</span>
              {isVaultLocked && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800">
                  LOCKED
                </span>
              )}
            </div>
            <h3 className="text-lg font-serif text-white mt-0.5">
              Bookmarked Plates ({savedPhotos.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Vault Lock Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isVaultLocked) {
                  setIsVaultLocked(false);
                } else {
                  setIsVaultLocked(true);
                }
              }}
              className={`p-2 rounded-md border transition-colors cursor-pointer ${
                isVaultLocked 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60' 
                  : 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800'
              }`}
              title={isVaultLocked ? 'Curator Library is locked' : 'Lock curator library with master passcode'}
            >
              {isVaultLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Plate List or Locked Card */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isVaultLocked ? (
            /* LOCKED VAULT VIEW */
            <div className="py-12 px-4 text-center space-y-5 my-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700/80 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-serif text-white">Curatorial Library Vault Locked</h4>
                <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto leading-relaxed">
                  Saved exhibition acquisitions and edition pricing manifests are concealed for confidentiality.
                </p>
              </div>

              <form onSubmit={handleUnlockVault} className="space-y-3 max-w-xs mx-auto pt-2">
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setUnlockError(null);
                  }}
                  placeholder="Enter Master PIN"
                  className="w-full px-3 py-2 text-xs font-mono bg-neutral-950 border border-neutral-700 rounded-lg text-white text-center tracking-widest focus:outline-none focus:border-amber-400"
                />

                {unlockError && (
                  <div className="text-[11px] font-mono text-rose-400">{unlockError}</div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Unlock Library
                </button>
              </form>
            </div>
          ) : savedPhotos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-neutral-500 text-xs font-mono">
                No plates currently bookmarked.
              </p>
              <p className="text-neutral-400 text-xs max-w-xs mx-auto">
                Click the bookmark icon on any photograph across the gallery to assemble a personalized curation reel.
              </p>
            </div>
          ) : (
            savedPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-800/90 rounded-lg group hover:border-neutral-700 transition-colors"
              >
                {/* Thumbnail */}
                <div
                  className="w-16 h-16 rounded overflow-hidden bg-neutral-900 shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectPhoto(photo);
                    onClose();
                  }}
                >
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    #{idx + 1} · {photo.series}
                  </div>
                  <h4
                    onClick={() => {
                      onSelectPhoto(photo);
                      onClose();
                    }}
                    className="text-xs font-serif text-neutral-200 truncate font-medium hover:text-white cursor-pointer"
                  >
                    {photo.title}
                  </h4>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {photo.location} · {photo.year}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {formatINR(photo.editionInfo.startingPrice)}
                    </span>
                    {onOpenPrintModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPrintModal(photo);
                          onClose();
                        }}
                        className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline cursor-pointer"
                      >
                        Acquire via PayPal
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {onOpenPrintModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenPrintModal(photo);
                        onClose();
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Acquire print edition via PayPal"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemove(photo.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove from reel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Actions */}
        {!isVaultLocked && savedPhotos.length > 0 && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-950/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyManifest}
                className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-sans">{copied ? 'Copied Manifest' : 'Copy Manifest Text'}</span>
              </button>

              <button
                type="button"
                onClick={onClearAll}
                className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                title="Clear all bookmarked plates"
              >
                Clear
              </button>
            </div>

            {onOpenPrintModal && savedPhotos[0] && (
              <button
                type="button"
                onClick={() => {
                  onOpenPrintModal(savedPhotos[0]);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-semibold text-xs rounded-md transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-99"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#003087]" />
                <span>Acquire Plate #{1} with PayPal Checkout</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onBatchInquire(savedPhotos);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inquire on Selected Reel ({savedPhotos.length})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
