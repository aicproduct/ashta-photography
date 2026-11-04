/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, Sliders, Layers, Sparkles } from 'lucide-react';
import { GEAR_DOSSIER } from '../data/portfolioData';

export const GearAndPhilosophy: React.FC = () => {
  return (
    <section id="about" className="py-24 border-b border-neutral-800/80 bg-[#070709]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              <Camera className="w-3.5 h-3.5 text-neutral-400" />
              <span>Optics &amp; Method</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
              The medium, the instrument, and light.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
            Every exposure is guided by strict optical discipline: native medium format sensors for tectonic surfaces, manual optical rangefinders for candid intimacy, and archival cotton substrates.
          </p>
        </div>

        {/* 2-Column Philosophy & Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Artistic Manifesto & Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Artist Manifesto
              </div>

              <blockquote className="text-lg font-serif italic text-neutral-200 leading-relaxed">
                "Photography is the patient measurement of shadow against ancient stone, revealing how sacred human ritual endures within architectural space."
              </blockquote>

              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Ashta Gupta (b. 1986) works between New Delhi and London. His monographs avoid synthetic saturation in favor of calibrated sandstone chiaroscuro, natural river mist tonal gradations, and architectural heritage preservation.
              </p>

              <div className="pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-500 space-y-1">
                <div>Studio New Delhi: Hauz Khas Village, New Delhi 110016</div>
                <div>Studio London: Museum Street, Bloomsbury, London WC1A</div>
              </div>
            </div>
          </div>

          {/* Right Column: Gear Dossier Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GEAR_DOSSIER.map((gear, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-neutral-950/70 border border-neutral-800/90 space-y-3 hover:border-neutral-700 transition-colors"
              >
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  {gear.category}
                </div>
                <h4 className="text-base font-serif text-neutral-100 font-medium">
                  {gear.item}
                </h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {gear.rationale}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
