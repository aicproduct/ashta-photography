/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Search, 
  LayoutGrid, 
  Rows, 
  Film, 
  X, 
  SlidersHorizontal, 
  Compass, 
  MapPin, 
  Building2, 
  Sparkles,
  RotateCcw,
  Palette
} from 'lucide-react';
import { Category, LayoutMode } from '../types/portfolio';

export type SearchScope = 'all' | 'series' | 'location' | 'architecture';
export type ViewMode = 'original' | 'monochrome' | 'high-contrast';

interface GalleryFilterBarProps {
  categories: Category[];
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchScope: SearchScope;
  onSearchScopeChange: (scope: SearchScope) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  totalAvailableCount?: number;
  onQuickTagSelect: (term: string, scope?: SearchScope) => void;
  onResetAll: () => void;
}

export const GalleryFilterBar: React.FC<GalleryFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  layoutMode,
  onChangeLayoutMode,
  searchQuery,
  onSearchChange,
  searchScope,
  onSearchScopeChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalAvailableCount = 5,
  onQuickTagSelect,
  onResetAll,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick curator tag suggestions for the 3 requested criteria
  const QUICK_TAGS = [
    { label: 'Chand Baori', category: 'architecture', tag: 'Stepped Baori' },
    { label: 'Geometry of Devotion', category: 'series', tag: 'Geometry of Devotion' },
    { label: 'Tropical Modernism', category: 'series', tag: 'Tropical Modernism' },
    { label: 'Brutalist Concrete', category: 'architecture', tag: 'Brutalist' },
    { label: 'Rajasthan', category: 'location', tag: 'Rajasthan' },
    { label: 'Varanasi', category: 'location', tag: 'Varanasi' },
    { label: 'Chandigarh', category: 'location', tag: 'Chandigarh' },
    { label: 'Haveli & Jali', category: 'architecture', tag: 'Haveli' },
  ];

  return (
    <div className="space-y-4 pt-4 pb-4">
      
      {/* Top Controls Row: Category Switcher & Search Bar & View Mode & Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Search Bar + Scope Switcher + View Mode Switcher + Layout Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Main Comprehensive Search Input */}
          <div className="relative flex-1 sm:w-72 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by series, location, style..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-neutral-900/90 text-neutral-100 placeholder:text-neutral-500 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                title="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Scope Filter Selector */}
          <div className="relative shrink-0">
            <select
              value={searchScope}
              onChange={(e) => onSearchScopeChange(e.target.value as SearchScope)}
              className="py-1.5 pl-2.5 pr-6 text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-md focus:outline-none focus:border-neutral-600 cursor-pointer appearance-none"
              title="Target search by series, location, or architectural style"
            >
              <option value="all" className="bg-neutral-950 text-neutral-200">All Attributes</option>
              <option value="series" className="bg-neutral-950 text-neutral-200">Series Name Only</option>
              <option value="location" className="bg-neutral-950 text-neutral-200">Location Only</option>
              <option value="architecture" className="bg-neutral-950 text-neutral-200">Architectural Style Only</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[9px]">
              ▼
            </div>
          </div>

          {/* View Mode Toggle: Original, Monochrome, High Contrast */}
          <div className="flex items-center gap-0.5 p-1 bg-neutral-900 border border-neutral-800 rounded-md shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('original')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'original'
                  ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Original Color Spectrum"
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('monochrome')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'monochrome'
                  ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Archival Monochrome Black & White"
            >
              Monochrome
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('high-contrast')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'high-contrast'
                  ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="High Contrast Deep Chiaroscuro"
            >
              High Contrast
            </button>
          </div>

          {/* Layout Mode Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-md shrink-0">
            <button
              type="button"
              onClick={() => onChangeLayoutMode('masonry')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                layoutMode === 'masonry'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Masonry Bento View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('editorial')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                layoutMode === 'editorial'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Editorial Single Plate View"
            >
              <Rows className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('contact-sheet')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                layoutMode === 'contact-sheet'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Analog Contact Sheet View"
            >
              <Film className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Quick Search Tags for Series, Location, and Architectural Style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs text-neutral-400">
        <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Filters:</span>
        </span>

        {QUICK_TAGS.map((item) => {
          const isCurrentlyActive = searchQuery.toLowerCase() === item.tag.toLowerCase();
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onQuickTagSelect(item.tag, item.category as SearchScope)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                isCurrentlyActive
                  ? 'bg-neutral-100 text-neutral-950 font-semibold border-white shadow-xs'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800/90 hover:text-white hover:border-neutral-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Active Search / Filter Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 border-t border-neutral-900 pt-3 font-mono">
        <div className="flex items-center gap-2">
          <span>
            Showing <span className="text-neutral-200 font-semibold tabular-nums">{totalFilteredCount}</span> of <span className="tabular-nums">{totalAvailableCount}</span> plates
          </span>

          {activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px]">
              Category: {activeCategory}
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px]">
              {searchScope === 'series' && 'Series: '}
              {searchScope === 'location' && 'Location: '}
              {searchScope === 'architecture' && 'Architecture: '}
              {searchScope === 'all' && 'Query: '}
              "{searchQuery}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {(activeCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={onResetAll}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer ml-1"
            >
              Reset all
            </button>
          )}
        </div>

        <div className="text-[11px] text-neutral-400 hidden sm:block">
          Filterable by: <span className="text-neutral-400">Series Name</span> · <span className="text-neutral-400">Location</span> · <span className="text-neutral-400">Architectural Style</span>
        </div>
      </div>

    </div>
  );
};
