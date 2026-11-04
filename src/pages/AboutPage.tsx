/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, MapPin, Mail, Layers, Compass, Quote } from 'lucide-react';
import { GEAR_DOSSIER } from '../data/portfolioData';
import { Page } from '../types/portfolio';

interface AboutPageProps {
  onNavigatePage: (page: Page) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigatePage }) => {
  return (
    <div className="py-12 sm:py-16 bg-[#070709]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <Camera className="w-3.5 h-3.5 text-neutral-400" />
            <span>Monograph Dossier</span>
            <span aria-hidden="true">·</span>
            <span>Optics &amp; Method</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Ashta Gupta: Artist Manifesto &amp; Technical Method
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            Working between New Delhi and London, Ashta Gupta captures the intersection of subcontinental sacred geometry, medieval hydraulic architecture, and post-independence modernist concrete.
          </p>
        </div>

        {/* 2-Column Section: Biography & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Biography & Manifesto (Sticky) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Artistic Ethos
              </div>

              <blockquote className="text-xl font-serif italic text-neutral-200 leading-relaxed border-l-2 border-neutral-600 pl-4">
                "Photography is the patient measurement of shadow against ancient stone, revealing how sacred human ritual endures within architectural space."
              </blockquote>

              <div className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed space-y-3">
                <p>
                  Ashta Gupta (b. 1986, New Delhi) studied architecture and classical printmaking before turning fully to large-format and medium-format documentary photography.
                </p>
                <p>
                  His fieldwork explores sites where geometry is treated not as ornament, but as a spiritual and climatic instrument: subterranean stepwells that harvest desert monsoon water, riverfront ghats that frame perpetual ritual, and Corbusian concrete monoliths built for a newly sovereign republic.
                </p>
                <p>
                  Rejecting hyper-saturated commercial color treatments, Gupta calibrates his exposures for tactile sandstone tonality, rich shadow separation, and mineral permanency.
                </p>
              </div>

              {/* Studios */}
              <div className="pt-6 border-t border-neutral-800 space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="text-neutral-500 uppercase tracking-widest text-[10px]">Studio New Delhi</div>
                  <div className="text-neutral-200">Hauz Khas Village, New Delhi 110016</div>
                  <div className="text-neutral-500 text-[11px]">Darkroom &amp; Archival Print Atelier</div>
                </div>

                <div className="space-y-1">
                  <div className="text-neutral-500 uppercase tracking-widest text-[10px]">Studio London</div>
                  <div className="text-neutral-200">Museum Street, Bloomsbury, London WC1A</div>
                  <div className="text-neutral-500 text-[11px]">Curatorial Liaison &amp; European Archive</div>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-serif text-white">Curatorial Inquiries</div>
                <div className="text-xs text-neutral-400 font-light">Commissions &amp; Museum Loans</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigatePage('inquire');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-200 rounded transition-colors cursor-pointer"
              >
                Inquire
              </button>
            </div>
          </div>

          {/* Right Column: Technical Dossier & Optical Systems */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-serif text-white tracking-wide border-b border-neutral-800 pb-3">
              The Instrument &amp; Darkroom Calibration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GEAR_DOSSIER.map((gear, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
                >
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                    {gear.category}
                  </div>
                  <h3 className="text-base font-serif text-neutral-100 font-medium">
                    {gear.item}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {gear.rationale}
                  </p>
                </div>
              ))}
            </div>

            {/* Darkroom & Archival Standards */}
            <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <h3 className="text-lg font-serif text-neutral-100">
                Archival Pigment Printing Protocol
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                All limited edition plates are produced using UltraChrome PRO12 archival pigment ink on 100% alpha-cellulose and cotton rag substrates meeting the ISO 9706 permanence criteria. Each impression exhibits zero optical brighteners (OBA-free), guaranteeing color fidelity and tonal depth for over a century without degradation.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-900">
                <span>D-Max Black Density: 2.82</span>
                <span aria-hidden="true">·</span>
                <span>OBA-Free 100% Cotton</span>
                <span aria-hidden="true">·</span>
                <span>16-Bit Precision</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
