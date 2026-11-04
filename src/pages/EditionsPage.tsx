/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Truck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Photograph, Page } from '../types/portfolio';
import { PHOTOGRAPHS } from '../data/portfolioData';
import { formatINR } from '../utils/currency';

interface EditionsPageProps {
  photographs: Photograph[];
  onOpenPrintModal: (photo: Photograph) => void;
  onSelectPhoto: (photo: Photograph) => void;
  onNavigatePage: (page: Page) => void;
}

export const EditionsPage: React.FC<EditionsPageProps> = ({
  photographs,
  onOpenPrintModal,
  onSelectPhoto,
  onNavigatePage,
}) => {
  const [selectedPreviewPhoto, setSelectedPreviewPhoto] = useState<Photograph>(photographs[0] || PHOTOGRAPHS[0]);
  const [activeFrameView, setActiveFrameView] = useState<'walnut' | 'black' | 'unframed'>('walnut');

  return (
    <div className="py-12 sm:py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
            <span>Collector Studio</span>
            <span aria-hidden="true">·</span>
            <span>Archival Pigment Standard ISO 9706</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Limited Edition Archival Prints
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            Every impression is personally proofed, hand-signed, and numbered in strictly limited editions of 8 to 15 impressions. Printed on heavyweight mould-made cotton and Japanese mulberry washi, accompanied by a registered Certificate of Authenticity.
          </p>
        </div>

        {/* Interactive Gallery Wall Studio Simulator */}
        <section className="rounded-2xl border border-neutral-800 bg-[#070709] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                Interactive Studio Preview
              </div>
              <h2 className="text-xl font-serif text-white mt-0.5">
                Collector Wall Visualizer
              </h2>
            </div>

            {/* Frame Style Switcher */}
            <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveFrameView('walnut')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeFrameView === 'walnut' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Solid Natural Walnut
              </button>
              <button
                type="button"
                onClick={() => setActiveFrameView('black')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeFrameView === 'black' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Matte Black Metal
              </button>
              <button
                type="button"
                onClick={() => setActiveFrameView('unframed')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeFrameView === 'unframed' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Float Roll (Unframed)
              </button>
            </div>
          </div>

          {/* Wall Simulation Stage */}
          <div className="relative w-full aspect-[16/9] max-h-[460px] rounded-xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-[#070709] border border-neutral-800 flex items-center justify-center p-8 overflow-hidden shadow-inner">
            {/* Gallery Downlight */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Simulated Artwork in Selected Frame */}
            <div
              className={`transition-all duration-500 shadow-2xl relative max-h-[80%] ${
                activeFrameView === 'black'
                  ? 'p-2.5 bg-neutral-950 ring-2 ring-neutral-800'
                  : activeFrameView === 'walnut'
                  ? 'p-3.5 bg-[#3a271d] ring-1 ring-[#5c3e2f]'
                  : 'p-0 shadow-lg'
              }`}
            >
              <div className={`${activeFrameView !== 'unframed' ? 'p-3 bg-[#f7f6f2]' : ''}`}>
                <img
                  src={selectedPreviewPhoto.imageSrc}
                  alt={selectedPreviewPhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[280px] w-auto object-cover shadow-sm"
                />
              </div>
            </div>

            {/* Bottom Plate Indicator */}
            <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-xs font-mono text-neutral-400">
              <div className="truncate max-w-md">
                Viewing: <span className="text-white font-serif">{selectedPreviewPhoto.title}</span> ({selectedPreviewPhoto.year})
              </div>
              <button
                type="button"
                onClick={() => onOpenPrintModal(selectedPreviewPhoto)}
                className="px-3.5 py-1.5 bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Configure Edition
              </button>
            </div>
          </div>

          {/* Thumbnails to Switch Visualizer */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              Select Plate to Test Wall Hanging
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {photographs.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPreviewPhoto(photo)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedPreviewPhoto.id === photo.id
                      ? 'bg-neutral-900 border-neutral-600 ring-1 ring-neutral-500'
                      : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-serif text-neutral-200 truncate">{photo.title}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">${photo.editionInfo.startingPrice}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Complete Catalog of Limited Editions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-2xl font-serif text-white">
              Limited Edition Catalog
            </h2>
            <div className="text-xs font-mono text-neutral-400">
              Strict edition caps · No secondary runs
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photographs.map((photo) => (
              <div
                key={photo.id}
                className="bg-neutral-950 border border-neutral-800/90 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div
                  className="aspect-[4/3] bg-neutral-900 cursor-pointer overflow-hidden group relative"
                  onClick={() => onSelectPhoto(photo)}
                >
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-neutral-800">
                    {photo.editionInfo.available} of {photo.editionInfo.total} Available
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
                      {photo.series} · {photo.location}
                    </div>
                    <h3
                      onClick={() => onSelectPhoto(photo)}
                      className="text-lg font-serif text-neutral-100 hover:text-white cursor-pointer"
                    >
                      {photo.title}
                    </h3>
                    <div className="text-xs text-neutral-400 font-light">
                      Substrate: {photo.editionInfo.archivalPaper}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Starting at</div>
                      <div className="text-base font-serif text-white font-medium">
                        {formatINR(photo.editionInfo.startingPrice)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenPrintModal(photo)}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-neutral-100 hover:bg-white rounded transition-colors cursor-pointer"
                    >
                      Configure Edition
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Substrate & Conservation Rigor */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-neutral-400 font-serif text-base">Hahnemühle German Etching</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              310gsm mould-made copperplate printing paper. Provides velvety tactile depth with exceptional shadow micro-contrast and archival permanence exceeding 100 years.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-neutral-400 font-serif text-base">Awagami Washi Kozo</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              110gsm traditional Japanese mulberry fiber with organic raw deckled edges, floating gently inside deep spacers for an ethereal sculptural presentation.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-neutral-400 font-serif text-base">Museum Glazing &amp; Shipping</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Tru-Vue UltraVue antireflective UV-blocking glass. Every framed commission is packaged in custom museum timber crates and dispatched via DHL Express Fine Art.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
