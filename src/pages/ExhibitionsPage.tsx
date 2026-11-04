/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building, BookOpen, Award, MapPin, Landmark } from 'lucide-react';
import { EXHIBITIONS } from '../data/portfolioData';

export const ExhibitionsPage: React.FC = () => {
  const museumCollections = [
    { museum: 'Victoria and Albert Museum (V&A)', location: 'London, United Kingdom', acquired: '2026' },
    { museum: 'National Gallery of Modern Art (NGMA)', location: 'New Delhi, India', acquired: '2025' },
    { museum: 'Kiran Nadar Museum of Art (KNMA)', location: 'New Delhi, India', acquired: '2024' },
    { museum: 'Foam Fotografiemuseum Amsterdam', location: 'Amsterdam, Netherlands', acquired: '2025' },
    { museum: 'Tokyo Photographic Art Museum (TOP)', location: 'Tokyo, Japan', acquired: '2024' },
    { museum: 'Kunsthaus Zürich, Graphic Cabinet', location: 'Zurich, Switzerland', acquired: '2023' },
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <Building className="w-3.5 h-3.5 text-neutral-400" />
            <span>Institutional CV</span>
            <span aria-hidden="true">·</span>
            <span>Museum &amp; Curatorial Record</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Exhibitions, Collections &amp; Monograph Volumes
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            Ashta Gupta’s work is held in major permanent museum collections across Europe and Asia, and has been exhibited in international biennales, national galleries, and academic symposiums.
          </p>
        </div>

        {/* 2-Column CV: Exhibitions & Publications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Exhibitions Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-2xl font-serif text-white tracking-wide border-b border-neutral-800 pb-3">
              Solo &amp; Biennial Exhibitions
            </h2>

            <div className="space-y-6">
              {EXHIBITIONS.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-neutral-950 border border-neutral-800/90 rounded-xl space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 font-semibold">{item.year}</span>
                    <span className="text-neutral-500 uppercase tracking-wider">{item.type}</span>
                  </div>

                  <h3 className="text-lg font-serif text-neutral-100 font-medium">
                    {item.title}
                  </h3>

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

            {/* Permanent Museum Collections */}
            <div className="pt-8 space-y-4">
              <h2 className="text-2xl font-serif text-white tracking-wide border-b border-neutral-800 pb-3 flex items-center justify-between">
                <span>Permanent Museum Collections</span>
                <Landmark className="w-4 h-4 text-neutral-400" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {museumCollections.map((col, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1">
                    <div className="text-xs font-medium text-neutral-200">{col.museum}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">{col.location}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Acquired {col.acquired}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Monographs & Honors */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Monographs */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-white tracking-wide border-b border-neutral-800 pb-3 flex items-center justify-between">
                <span>Published Monographs</span>
                <BookOpen className="w-4 h-4 text-neutral-400" />
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <div className="font-serif text-base text-neutral-200">"Geometry of Devotion: Stepwells of Western India"</div>
                  <div className="text-neutral-400 font-mono">Thames &amp; Hudson, London · 2025</div>
                  <div className="text-neutral-500 text-[11px] leading-relaxed">
                    Clothbound hardcover with foil stamping, 192 pages, duotone and tritone plates, edition of 2,000. Foreword by William Dalrymple.
                  </div>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <div className="font-serif text-base text-neutral-200">"Chandigarh: The Poured Monument"</div>
                  <div className="text-neutral-400 font-mono">Lars Müller Publishers, Zurich · 2024</div>
                  <div className="text-neutral-500 text-[11px] leading-relaxed">
                    Monograph survey documenting Le Corbusier's Capitol Complex through 100MP medium-format studies of tropical brutalism.
                  </div>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <div className="font-serif text-base text-neutral-200">"Ghats of Varanasi: The Dawn Archive"</div>
                  <div className="text-neutral-400 font-mono">Mapin Publishing, Ahmedabad · 2023</div>
                  <div className="text-neutral-500 text-[11px] leading-relaxed">
                    Awarded Best Asian Heritage Photobook of the Year. 144 pages in natural cotton slipcase.
                  </div>
                </div>
              </div>
            </div>

            {/* Honors & Awards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-white tracking-wide border-b border-neutral-800 pb-3 flex items-center justify-between">
                <span>Honors &amp; Citations</span>
                <Award className="w-4 h-4 text-neutral-400" />
              </h2>

              <div className="space-y-3 text-xs text-neutral-400 font-light">
                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-lg flex items-start gap-3">
                  <span className="font-mono text-neutral-300 font-semibold shrink-0">2025</span>
                  <div>
                    <div className="text-neutral-200 font-medium">Hasselblad Masters Finalist</div>
                    <div className="text-neutral-500 text-[11px]">Architectural Heritage Category</div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-lg flex items-start gap-3">
                  <span className="font-mono text-neutral-300 font-semibold shrink-0">2024</span>
                  <div>
                    <div className="text-neutral-200 font-medium">Royal Photographic Society Award</div>
                    <div className="text-neutral-500 text-[11px]">Excellence in Heritage Documentary &amp; Architectural Conservation</div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-lg flex items-start gap-3">
                  <span className="font-mono text-neutral-300 font-semibold shrink-0">2023</span>
                  <div>
                    <div className="text-neutral-200 font-medium">World Architecture Photography Awards</div>
                    <div className="text-neutral-500 text-[11px]">Historic Monoliths &amp; Vernacular Geometry 1st Prize</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
