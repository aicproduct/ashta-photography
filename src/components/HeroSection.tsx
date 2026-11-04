/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Maximize2, Compass } from 'lucide-react';
import { Photograph } from '../types/portfolio';

interface HeroSectionProps {
  heroPhotograph: Photograph;
  onSelectPhoto: (photo: Photograph) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroPhotograph,
  onSelectPhoto,
}) => {
  return (
    <section className="relative border-b border-neutral-800/80 bg-[#09090b]">
      {/* 2-Column Hero Split */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
        
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Clean unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 font-mono">
              <span>Archive 2024–2026</span>
              <span aria-hidden="true">·</span>
              <span>Monograph Editions</span>
              <span aria-hidden="true">·</span>
              <span>New Delhi &amp; London</span>
            </div>

            {/* Display Headline with text-wrap balance */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-neutral-100 leading-[1.12]" style={{ textWrap: 'balance' }}>
              Sacred stone, shadow, and modernist geometry.
            </h1>

            {/* Editorial Lead Prose */}
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
              Fine art and documentary monographs capturing the dialogue between subcontinental architectural heritage, sacred hydrology, and intimate artisanal traditions.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-neutral-100 hover:bg-white rounded-md transition-all shadow-sm"
            >
              <span>Explore Selected Works</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#series"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium tracking-wide text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>Monograph Series</span>
            </a>
          </div>

          {/* Current Featured Specimen Metadata */}
          <div className="pt-6 border-t border-neutral-800/80 text-xs text-neutral-400 space-y-1.5 font-mono">
            <div className="text-neutral-500 uppercase tracking-widest text-[11px]">Plate of Note</div>
            <div className="text-neutral-200 font-sans text-sm font-medium">{heroPhotograph.title}</div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span>{heroPhotograph.location}</span>
              <span aria-hidden="true">·</span>
              <span>{heroPhotograph.exif.camera}</span>
              <span aria-hidden="true">·</span>
              <span>{heroPhotograph.exif.focalLength}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero High-Resolution Showcase Visual */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div 
            onClick={() => onSelectPhoto(heroPhotograph)}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl transition-all duration-300 hover:border-neutral-700"
          >
            {/* Image container */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-950">
              <img
                src={heroPhotograph.imageSrc}
                alt={heroPhotograph.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>

            {/* Overlay Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Overlay Info & Click to inspect affordance */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-1">
                  {heroPhotograph.series}
                </div>
                <div className="text-lg font-serif text-white tracking-wide">
                  {heroPhotograph.title}
                </div>
                <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                  <span>{heroPhotograph.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{heroPhotograph.location}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 text-xs text-neutral-300 group-hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inspect High-Res</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full-width Metrics & Curatorial Rigor Strip below hero split */}
      <div className="border-t border-neutral-800/80 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-neutral-100 tabular-nums">16</div>
            <div className="text-xs text-neutral-400 font-light mt-1">Solo &amp; Biennial Exhibitions</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-neutral-100 tabular-nums">100MP</div>
            <div className="text-xs text-neutral-400 font-light mt-1">Medium Format Native Capture</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-neutral-100 tabular-nums">3</div>
            <div className="text-xs text-neutral-400 font-light mt-1">Published Monograph Volumes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif text-neutral-100 tabular-nums">14</div>
            <div className="text-xs text-neutral-400 font-light mt-1">Museum Permanent Collections</div>
          </div>
        </div>
      </div>
    </section>
  );
};
