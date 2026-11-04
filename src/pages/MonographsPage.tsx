/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Quote, ArrowRight, BookOpen, MapPin, Calendar } from 'lucide-react';
import { Photograph, Page } from '../types/portfolio';
import { SERIES_STORIES, PHOTOGRAPHS } from '../data/portfolioData';

interface MonographsPageProps {
  onSelectPhoto: (photo: Photograph) => void;
  onNavigatePage: (page: Page) => void;
}

export const MonographsPage: React.FC<MonographsPageProps> = ({
  onSelectPhoto,
  onNavigatePage,
}) => {
  const [activeSeriesId, setActiveSeriesId] = useState<string>(SERIES_STORIES[0].id);
  const activeSeries = SERIES_STORIES.find((s) => s.id === activeSeriesId) || SERIES_STORIES[0];

  const seriesPhotos = PHOTOGRAPHS.filter((p) => p.series === activeSeries.title);

  return (
    <div className="py-12 sm:py-16 bg-[#070709]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Monograph Archive</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Year Fieldwork Surveys</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Published Monograph Chapters
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            In-depth photographic surveys documenting architectural, sacred, and post-colonial landscapes across the Indian subcontinent. Each volume reflects dedicated medium-format fieldwork and historical documentation.
          </p>
        </div>

        {/* Chapter Selection Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERIES_STORIES.map((item, idx) => {
            const isSelected = item.id === activeSeriesId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSeriesId(item.id)}
                className={`text-left p-6 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-600 shadow-xl'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
                }`}
              >
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                  Chapter 0{idx + 1}
                </div>
                <h2 className="text-xl font-serif text-white tracking-wide mb-1">
                  {item.title}
                </h2>
                <div className="text-xs text-neutral-400 font-light truncate">
                  {item.subtitle}
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{item.location}</span>
                  <span>{item.year}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Monograph Deep-Dive Showcase */}
        {activeSeries && (
          <div className="border border-neutral-800 rounded-2xl bg-neutral-950 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              
              {/* Left Column: Monograph Narrative & Philosophy */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    <span>Field Survey</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeSeries.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeSeries.year}</span>
                  </div>

                  <h3 className="text-3xl font-serif text-neutral-100 font-light leading-snug">
                    {activeSeries.title}
                  </h3>
                  <div className="text-sm font-sans text-neutral-400 font-normal">
                    {activeSeries.subtitle}
                  </div>

                  <p className="text-sm text-neutral-300 font-light leading-relaxed">
                    {activeSeries.statement}
                  </p>

                  {/* Curatorial Quote */}
                  <div className="p-4 bg-neutral-900/70 border-l border-neutral-700 rounded-r-md space-y-2">
                    <Quote className="w-4 h-4 text-neutral-400" />
                    <p className="text-xs sm:text-sm font-serif italic text-neutral-200 leading-relaxed">
                      "{activeSeries.keyQuote}"
                    </p>
                  </div>
                </div>

                {/* Series Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-neutral-900">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigatePage('galleries');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-neutral-100 hover:bg-white rounded-md transition-all shadow-sm cursor-pointer"
                  >
                    <span>View in Full Gallery Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Plates from this Monograph Chapter */}
              <div className="lg:col-span-7 bg-neutral-900/60 p-6 sm:p-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Documented Plates</span>
                    <span>{seriesPhotos.length} Plates in Collection</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {seriesPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => onSelectPhoto(photo)}
                        className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all shadow-md"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={photo.imageSrc}
                            alt={photo.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3.5 bg-neutral-950">
                          <div className="font-serif text-neutral-200 text-sm truncate group-hover:text-white transition-colors">
                            {photo.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-1">
                            <span>{photo.location}</span>
                            <span aria-hidden="true">·</span>
                            <span>{photo.exif.focalLength}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
