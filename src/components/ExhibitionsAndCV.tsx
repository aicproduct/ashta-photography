/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, BookOpen, Building, MapPin } from 'lucide-react';
import { EXHIBITIONS } from '../data/portfolioData';

export const ExhibitionsAndCV: React.FC = () => {
  return (
    <section id="exhibitions" className="py-24 border-b border-neutral-800/80 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              <Building className="w-3.5 h-3.5 text-neutral-400" />
              <span>Institutional Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
              Selected exhibitions &amp; monographs.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
            Represented in permanent institutional archives and showcased across international photography biennales, architectural symposiums, and fine art monograph publishers.
          </p>
        </div>

        {/* 2-Column CV Grid: Exhibitions & Monograph Publications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Exhibitions Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-serif text-white tracking-wide border-b border-neutral-800/80 pb-3">
              Solo &amp; Curated Exhibitions
            </h3>

            <div className="space-y-6">
              {EXHIBITIONS.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">{item.year}</span>
                    <span className="text-neutral-500 uppercase tracking-wider">{item.type}</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-serif text-neutral-100">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-light">
                    <span>{item.venue}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {item.city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Monographs & Honors */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-white tracking-wide border-b border-neutral-800/80 pb-3 flex items-center justify-between">
                <span>Published Monographs</span>
                <BookOpen className="w-4 h-4 text-neutral-400" />
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
                  <div className="font-serif text-sm text-neutral-200">"Geometry of Devotion: Stepwells of Western India"</div>
                  <div className="text-neutral-400">Thames &amp; Hudson, London · 2025</div>
                  <div className="text-neutral-500 text-[11px]">Clothbound hardcover, 192 pages, duotone tritone plates, edition of 2,000</div>
                </div>

                <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
                  <div className="font-serif text-sm text-neutral-200">"Chandigarh: The Poured Monument"</div>
                  <div className="text-neutral-400">Lars Müller Publishers, Zurich · 2024</div>
                  <div className="text-neutral-500 text-[11px]">Monograph with essays on Le Corbusier and tropical brutalism</div>
                </div>

                <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1">
                  <div className="font-serif text-sm text-neutral-200">"Ghats of Varanasi: The Dawn Archive"</div>
                  <div className="text-neutral-400">Mapin Publishing, Ahmedabad · 2023</div>
                  <div className="text-neutral-500 text-[11px]">Awarded Best Asian Heritage Photobook of the Year</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-white tracking-wide border-b border-neutral-800/80 pb-3 flex items-center justify-between">
                <span>Distinctions &amp; Awards</span>
                <Award className="w-4 h-4 text-neutral-400" />
              </h3>

              <div className="space-y-3 text-xs text-neutral-400 font-light">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-neutral-400 shrink-0">2025</span>
                  <div>
                    <span className="text-neutral-200 font-medium">Hasselblad Masters Finalist</span> — Architectural Heritage
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-neutral-400 shrink-0">2024</span>
                  <div>
                    <span className="text-neutral-200 font-medium">Royal Photographic Society Award</span> — Documentary &amp; Conservation
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-neutral-400 shrink-0">2023</span>
                  <div>
                    <span className="text-neutral-200 font-medium">World Architecture Photography Awards</span> — Heritage 1st Prize
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
