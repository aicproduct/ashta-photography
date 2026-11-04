/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Maximize2, Bookmark, ShoppingBag, Eye, SlidersHorizontal, Search, Sparkles } from 'lucide-react';
import { Photograph, LayoutMode } from '../types/portfolio';

export type ViewMode = 'original' | 'monochrome' | 'high-contrast';

interface GalleryGridProps {
  photographs: Photograph[];
  layoutMode: LayoutMode;
  viewMode?: ViewMode;
  curatorReelIds: Set<string>;
  onSelectPhoto: (photo: Photograph) => void;
  onToggleCuratorReel: (id: string, e: React.MouseEvent) => void;
  onOpenPrintModal: (photo: Photograph, e: React.MouseEvent) => void;
  searchQuery?: string;
  onResetFilters?: (term?: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  photographs,
  layoutMode,
  viewMode = 'original',
  curatorReelIds,
  onSelectPhoto,
  onToggleCuratorReel,
  onOpenPrintModal,
  searchQuery,
  onResetFilters,
}) => {
  // Helper for applying filter view modes: original, monochrome, high contrast
  const filterStyleClass = 
    viewMode === 'monochrome'
      ? 'filter grayscale contrast-110'
      : viewMode === 'high-contrast'
      ? 'filter grayscale contrast-140 brightness-95'
      : '';

  // Empty State with rich search suggestions
  if (photographs.length === 0) {
    const SUGGESTIONS = [
      'Geometry of Devotion',
      'Tropical Modernism',
      'Sacred Waters',
      'Chand Baori',
      'Rajasthan',
      'Varanasi',
      'Chandigarh',
      'Brutalist',
      'Haveli Jali',
      'Subterranean'
    ];

    return (
      <div className="py-20 px-6 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/60 space-y-5">
        <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
          <Search className="w-5 h-5 text-neutral-400" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-xl font-serif text-neutral-200">
            No photographic plates matched
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {searchQuery ? (
              <span>No plates found matching <span className="text-white font-semibold">"{searchQuery}"</span> across series, locations, or architectural styles.</span>
            ) : (
              <span>No works found for the selected category filter.</span>
            )}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Search Suggested Series, Locations &amp; Styles</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onResetFilters && onResetFilters(term)}
                className="px-2.5 py-1 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {onResetFilters && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onResetFilters()}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-sm cursor-pointer active:scale-98"
            >
              Reset Search &amp; Show All Plates
            </button>
          </div>
        )}
      </div>
    );
  }

  // Layout 1: Editorial Plate View (Full-width monograph spreads)
  if (layoutMode === 'editorial') {
    return (
      <div className="space-y-20 py-6">
        {photographs.map((photo, index) => {
          const isSaved = curatorReelIds.has(photo.id);
          const isEven = index % 2 === 0;

          return (
            <article
              key={photo.id}
              className="border border-neutral-800/80 rounded-xl bg-neutral-950 overflow-hidden hover:border-neutral-700 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visual Plate */}
                <div 
                  className={`lg:col-span-8 relative bg-neutral-900 group cursor-pointer overflow-hidden ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                  onClick={() => onSelectPhoto(photo)}
                >
                  <div className="w-full aspect-[16/10] overflow-hidden">
                    <img
                      src={photo.imageSrc}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] ${filterStyleClass}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors" />
                  
                  {/* Hover Inspect badge */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 backdrop-blur-md border border-neutral-700 px-3 py-1.5 rounded text-xs text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Deep Zoom</span>
                  </div>
                </div>

                {/* Editorial Monograph Dossier Column */}
                <div 
                  className={`lg:col-span-4 p-8 flex flex-col justify-between space-y-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest">
                      <span>Plate #{String(index + 1).padStart(2, '0')}</span>
                      <span>{photo.series}</span>
                    </div>

                    <h3 className="text-2xl font-serif text-neutral-100 tracking-tight leading-snug">
                      {photo.title}
                    </h3>

                    {/* Architectural style indicator */}
                    {photo.architecturalStyle && (
                      <div className="inline-block px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-amber-300">
                        {photo.architecturalStyle}
                      </div>
                    )}

                    {/* Unboxed clean metadata */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>{photo.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{photo.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{photo.category}</span>
                    </div>

                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {photo.curatorStatement}
                    </p>

                    {/* Technical details badge */}
                    <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/80 font-mono text-xs text-neutral-400 space-y-1">
                      <div className="text-neutral-300 flex justify-between">
                        <span>Capture System:</span>
                        <span className="text-neutral-100">{photo.exif.camera}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Optic:</span>
                        <span>{photo.exif.lens}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Settings:</span>
                        <span>{photo.exif.aperture} · {photo.exif.shutterSpeed} · {photo.exif.iso}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectPhoto(photo)}
                      className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect 100MP</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => onToggleCuratorReel(photo.id, e)}
                        className={`p-2 rounded border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-neutral-100 text-neutral-950 border-neutral-100'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 hover:bg-neutral-800'
                        }`}
                        title={isSaved ? 'Remove from Curator Reel' : 'Save to Curator Reel'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onOpenPrintModal(photo, e)}
                        className="py-2 px-3 text-xs font-semibold text-neutral-950 bg-neutral-200 hover:bg-white rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Acquire Archival Print Edition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  // Layout 2: Contact Sheet / Filmstrip Analog Reel
  if (layoutMode === 'contact-sheet') {
    return (
      <div className="py-6">
        <div className="bg-[#050505] p-6 sm:p-8 rounded-xl border border-neutral-800/80 font-mono shadow-2xl">
          {/* Film Header notation */}
          <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 font-bold">HASSELBLAD &amp; LEICA ARCHIVAL PROOF</span>
              <span aria-hidden="true">/</span>
              <span>BATCH ARCHIVE // {viewMode.toUpperCase()}</span>
            </div>
            <div>EXP DATE: 2026-10</div>
          </div>

          {/* Contact Sheet Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photographs.map((photo, index) => {
              const isSaved = curatorReelIds.has(photo.id);

              return (
                <div
                  key={photo.id}
                  className="group relative bg-neutral-950 p-2.5 border border-neutral-800 hover:border-neutral-500 transition-all cursor-pointer shadow-sm"
                  onClick={() => onSelectPhoto(photo)}
                >
                  {/* Sprocket Edge Numbers */}
                  <div className="flex justify-between text-[9px] text-neutral-500 mb-1 px-1">
                    <span>FRAME {String(index + 1).padStart(2, '0')}</span>
                    <span>100MP</span>
                  </div>

                  <div className="aspect-[4/3] bg-neutral-900 overflow-hidden relative">
                    <img
                      src={photo.imageSrc}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${filterStyleClass}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="mt-2 text-left space-y-0.5">
                    <div className="text-[10px] text-neutral-400 font-mono truncate">
                      {photo.title}
                    </div>
                    <div className="text-[9px] text-neutral-400 font-mono truncate">
                      {photo.location}
                    </div>
                    {photo.architecturalStyle && (
                      <div className="text-[9px] text-amber-400/90 font-mono truncate">
                        {photo.architecturalStyle}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Layout 3 (Default): Dynamic Masonry Bento Grid
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[340px]">
        {photographs.map((photo, index) => {
          const isSaved = curatorReelIds.has(photo.id);
          
          // Bento layout logic: Plate 1 (wide span), Plate 4 (tall span)
          let colSpan = 'md:col-span-6 lg:col-span-6';
          let rowSpan = 'row-span-1';

          if (index === 0) {
            colSpan = 'md:col-span-12 lg:col-span-8';
            rowSpan = 'row-span-1 lg:row-span-2';
          } else if (index === 3) {
            colSpan = 'md:col-span-6 lg:col-span-4';
            rowSpan = 'row-span-1 lg:row-span-2';
          } else if (index === 1 || index === 2) {
            colSpan = 'md:col-span-6 lg:col-span-4';
            rowSpan = 'row-span-1';
          } else {
            colSpan = 'md:col-span-6 lg:col-span-4';
            rowSpan = 'row-span-1';
          }

          return (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800/90 shadow-md transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl cursor-pointer ${colSpan} ${rowSpan}`}
              onClick={() => onSelectPhoto(photo)}
            >
              {/* Image asset with viewMode filter class */}
              <div className="w-full h-full bg-neutral-900 overflow-hidden">
                <img
                  src={photo.imageSrc}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${filterStyleClass}`}
                  loading="lazy"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

              {/* Top Quick Actions (Curator reel & Print) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => onToggleCuratorReel(photo.id, e)}
                  className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'bg-neutral-900/80 text-neutral-300 hover:text-white border border-neutral-700/80 hover:bg-neutral-800'
                  }`}
                  title={isSaved ? 'Bookmarked in Curator Reel' : 'Add to Curator Reel'}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={(e) => onOpenPrintModal(photo, e)}
                  className="p-2 rounded-md bg-neutral-900/80 backdrop-blur-md text-neutral-300 hover:text-white border border-neutral-700/80 hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Print Edition Details"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Editorial Metadata */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                <div className="space-y-1 pr-4 max-w-[85%]">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                    {photo.series}
                  </div>
                  <h3 className="text-lg font-serif text-neutral-100 group-hover:text-white transition-colors truncate">
                    {photo.title}
                  </h3>
                  
                  {/* Clean unboxed metadata with bullet separators & architectural style */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-light flex-wrap">
                    <span>{photo.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{photo.year}</span>
                    {photo.architecturalStyle && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400/90 font-mono text-[11px] truncate max-w-[200px]">
                          {photo.architecturalStyle}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Inspect glyph */}
                <div className="shrink-0 p-2 rounded-md bg-neutral-900/80 border border-neutral-800 text-neutral-400 group-hover:text-white group-hover:border-neutral-600 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
