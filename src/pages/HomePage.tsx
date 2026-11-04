/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Photograph, Page, Category, LayoutMode } from '../types/portfolio';
import { PHOTOGRAPHS, SERIES_STORIES } from '../data/portfolioData';
import { formatINR } from '../utils/currency';
import { 
  Grid3X3, 
  Rows, 
  LayoutGrid, 
  Bookmark, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Compass, 
  Maximize2,
  SlidersHorizontal,
  Flame,
  Award,
  Filter
} from 'lucide-react';

interface HomePageProps {
  photographs: Photograph[];
  onSelectPhoto: (photo: Photograph) => void;
  onNavigatePage: (page: Page) => void;
  curatorReelIds: Set<string>;
  onToggleCuratorReel: (id: string, e: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  photographs,
  onSelectPhoto,
  onNavigatePage,
  curatorReelIds,
  onToggleCuratorReel,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [viewStyle, setViewStyle] = useState<'square-grid' | 'masonry' | 'feed-cards'>('square-grid');

  const categories: Category[] = [
    'All',
    'Architecture',
    'Landscapes',
    'Street & Nocturne',
    'Editorial & Portraiture',
  ];

  const filteredPlates = photographs.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const heroPhoto = photographs[0] || PHOTOGRAPHS[0];

  return (
    <div className="pb-24 space-y-12 sm:space-y-16">
      
      {/* 1. INSTAGRAM/MEDIA-STYLE ARTIST PROFILE STRIP & STORY REELS */}
      <section className="border-b border-neutral-800/80 bg-[#070709] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Creator Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Profile Avatar / Lens aperture icon */}
              <div className="relative">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-xl">
                  <div className="w-full h-full rounded-full bg-neutral-950 p-1 overflow-hidden">
                    <img
                      src={heroPhoto.imageSrc}
                      alt="Ashta Gupta"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-neutral-950" title="Studio Active" />
              </div>

              {/* Bio & Credentials */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
                    Ashta Gupta
                  </h1>
                  <span className="p-0.5 rounded-full bg-neutral-800 text-neutral-300" title="Verified Fine Art Photographer">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
                    · Photographer
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl leading-relaxed">
                  Subcontinental sacred geometry, stepwell hydraulics &amp; Corbusian modernist forms. Hasselblad 100MP archival plates.
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                  <span><strong className="text-white font-semibold">{photographs.length}</strong> masterworks</span>
                  <span><strong className="text-white font-semibold">3</strong> monographs</span>
                  <span><strong className="text-white font-semibold">ISO 9706</strong> prints</span>
                  <span className="text-neutral-500 hidden sm:inline">New Delhi &bull; London</span>
                </div>
              </div>
            </div>

            {/* Quick Instagram-style Action CTAs */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  onNavigatePage('galleries');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Explore All Works</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigatePage('editions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Acquire (₹)</span>
              </button>
            </div>
          </div>

          {/* Story Highlights Reels Strip (Instagram Style) */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1.5">
              <span>Monograph Highlights</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
              {SERIES_STORIES.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    onNavigatePage('series');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-neutral-700 via-neutral-500 to-neutral-800 group-hover:from-amber-400 group-hover:to-rose-400 transition-all duration-300 shadow-md">
                    <div className="w-full h-full rounded-full bg-neutral-950 p-0.5 overflow-hidden">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-300 group-hover:text-white truncate max-w-[80px] text-center">
                    {story.title}
                  </span>
                </div>
              ))}

              {/* Highlight: Editions */}
              <div
                onClick={() => {
                  onNavigatePage('editions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-neutral-700 to-neutral-800 group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300 shadow-md">
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-emerald-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-neutral-300 group-hover:text-white truncate max-w-[80px] text-center">
                  Editions (₹)
                </span>
              </div>

              {/* Highlight: Exhibitions */}
              <div
                onClick={() => {
                  onNavigatePage('exhibitions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-neutral-700 to-neutral-800 group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 shadow-md">
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-indigo-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-neutral-300 group-hover:text-white truncate max-w-[80px] text-center">
                  Museum CV
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. IMMEDIATE GALLERY GRID SECTION WITH INSTAGRAM-STYLE VIEW SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Gallery Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Instagram-style Layout Toggle (3x3 Square Grid vs Masonry vs Feed Cards) */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewStyle('square-grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                viewStyle === 'square-grid'
                  ? 'bg-neutral-800 text-white shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="3-Column Instagram Square Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewStyle('masonry')}
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                viewStyle === 'masonry'
                  ? 'bg-neutral-800 text-white shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Editorial Masonry Bento View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Bento</span>
            </button>

            <button
              type="button"
              onClick={() => setViewStyle('feed-cards')}
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                viewStyle === 'feed-cards'
                  ? 'bg-neutral-800 text-white shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Social Media Feed Cards"
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Feed</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW MODE 1: INSTAGRAM 3-COLUMN SQUARE TILES */}
        {/* ======================================================== */}
        {viewStyle === 'square-grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {filteredPlates.map((photo, idx) => {
              const isSaved = curatorReelIds.has(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className="group relative aspect-square bg-neutral-900 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-neutral-600 transition-all shadow-md"
                >
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 sm:p-5 backdrop-blur-[1px]">
                    {/* Top strip */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                        Plate #{String(idx + 1).padStart(2, '0')}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCuratorReel(photo.id, e);
                        }}
                        className={`p-1.5 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
                          isSaved ? 'bg-white text-neutral-950' : 'bg-neutral-900/80 text-white hover:bg-neutral-800'
                        }`}
                        title={isSaved ? 'Remove from reel' : 'Save to reel'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Center hover icon */}
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom title & price in INR */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-serif text-white truncate font-medium">
                        {photo.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400">
                        <span>{photo.location.split(',')[0]}</span>
                        <span className="text-emerald-400 font-semibold">{formatINR(photo.editionInfo.startingPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW MODE 2: MASONRY BENTO SPREAD */}
        {/* ======================================================== */}
        {viewStyle === 'masonry' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
            {filteredPlates.map((photo, index) => {
              const isSaved = curatorReelIds.has(photo.id);
              let colSpan = 'md:col-span-6 lg:col-span-6';
              let rowSpan = 'row-span-1';

              if (index === 0) {
                colSpan = 'md:col-span-12 lg:col-span-8';
                rowSpan = 'row-span-1 lg:row-span-2';
              } else if (index === 3) {
                colSpan = 'md:col-span-6 lg:col-span-4';
                rowSpan = 'row-span-1 lg:row-span-2';
              } else {
                colSpan = 'md:col-span-6 lg:col-span-4';
                rowSpan = 'row-span-1';
              }

              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className={`group relative overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800/90 shadow-md transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl cursor-pointer ${colSpan} ${rowSpan}`}
                >
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Actions & info */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCuratorReel(photo.id, e);
                      }}
                      className={`p-2 rounded-md backdrop-blur-md transition-colors ${
                        isSaved ? 'bg-white text-neutral-950' : 'bg-neutral-900/80 text-white border border-neutral-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                    <div className="space-y-1 pr-4 max-w-[85%]">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                        {photo.series}
                      </div>
                      <h3 className="text-base sm:text-lg font-serif text-white truncate font-medium">
                        {photo.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                        <span>{photo.location}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-400">{formatINR(photo.editionInfo.startingPrice)}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 group-hover:text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW MODE 3: SOCIAL MEDIA FEED CARDS (INSTAGRAM TIMELINE) */}
        {/* ======================================================== */}
        {viewStyle === 'feed-cards' && (
          <div className="max-w-2xl mx-auto space-y-10">
            {filteredPlates.map((photo, index) => {
              const isSaved = curatorReelIds.has(photo.id);
              return (
                <article
                  key={photo.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl"
                >
                  {/* Card Header */}
                  <div className="p-4 flex items-center justify-between border-b border-neutral-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-800 p-0.5 border border-neutral-700 overflow-hidden">
                        <img
                          src={photo.imageSrc}
                          alt="Thumbnail"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white flex items-center gap-1.5">
                          <span>Ashta Gupta</span>
                          <span className="text-[10px] text-neutral-500 font-mono">· Plate 0{index + 1}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">{photo.location}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onToggleCuratorReel(photo.id, e)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Card Image */}
                  <div
                    onClick={() => onSelectPhoto(photo)}
                    className="aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer group relative"
                  >
                    <img
                      src={photo.imageSrc}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-800">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Deep Zoom 100MP</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif text-white font-medium">
                        {photo.title}
                      </h3>
                      <div className="text-sm font-mono text-emerald-400 font-semibold">
                        {formatINR(photo.editionInfo.startingPrice)}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {photo.curatorStatement}
                    </p>

                    <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>{photo.exif.camera} &bull; {photo.exif.lens}</span>
                      <button
                        type="button"
                        onClick={() => onSelectPhoto(photo)}
                        className="text-white hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Inspect Plate Dossier &rarr;</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* 3. QUICK NAVIGATOR CALLOUT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-[#0d0d12] to-neutral-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Fine Art Print Studio
            </div>
            <h3 className="text-2xl font-serif text-white">
              Limited Edition Archival Impressions in INR (₹)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Experience the virtual wall simulator to preview solid walnut, matte black metal framing, and custom dimensions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onNavigatePage('editions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            <span>Open Print Studio Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
