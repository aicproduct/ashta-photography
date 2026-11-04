/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { GalleryFilterBar, SearchScope, ViewMode } from '../components/GalleryFilterBar';
import { GalleryGrid } from '../components/GalleryGrid';
import { Photograph, Category, LayoutMode } from '../types/portfolio';

interface GalleriesPageProps {
  photographs: Photograph[];
  onSelectPhoto: (photo: Photograph) => void;
  curatorReelIds: Set<string>;
  onToggleCuratorReel: (id: string, e: React.MouseEvent) => void;
  onOpenPrintModal: (photo: Photograph, e: React.MouseEvent) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Architecture',
  'Landscapes',
  'Street & Nocturne',
  'Editorial & Portraiture',
];

export const GalleriesPage: React.FC<GalleriesPageProps> = ({
  photographs,
  onSelectPhoto,
  curatorReelIds,
  onToggleCuratorReel,
  onOpenPrintModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('original');

  // Filter photographs by series name, location, and architectural style
  const filteredPhotographs = useMemo(() => {
    return photographs.filter((photo) => {
      // 1. Category Filter
      const matchesCategory =
        activeCategory === 'All' || photo.category === activeCategory;

      if (!matchesCategory) return false;

      // If no search query, match all within the category
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();

      // 2. Specific Search Fields
      const matchesSeries = photo.series.toLowerCase().includes(q);
      const matchesLocation = photo.location.toLowerCase().includes(q);
      const matchesArchitecture = Boolean(
        (photo.architecturalStyle && photo.architecturalStyle.toLowerCase().includes(q)) ||
        photo.curatorStatement.toLowerCase().includes(q)
      );
      const matchesTitle = photo.title.toLowerCase().includes(q);

      // Check scoped filter
      if (searchScope === 'series') {
        return matchesSeries;
      }
      if (searchScope === 'location') {
        return matchesLocation;
      }
      if (searchScope === 'architecture') {
        return matchesArchitecture;
      }

      // Default 'all' scope: matches series, location, architectural style, or title
      return matchesSeries || matchesLocation || matchesArchitecture || matchesTitle;
    });
  }, [photographs, activeCategory, searchQuery, searchScope]);

  const handleQuickTagSelect = (term: string, scope?: SearchScope) => {
    setSearchQuery(term);
    if (scope) {
      setSearchScope(scope);
    } else {
      setSearchScope('all');
    }
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setSearchScope('all');
    setActiveCategory('All');
  };

  return (
    <div className="py-12 sm:py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Dedicated Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <span>Archive Index</span>
            <span aria-hidden="true">·</span>
            <span>All Formats</span>
            <span aria-hidden="true">·</span>
            <span>100MP Resolution</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Curated Photographic Galleries
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            High-resolution plates spanning subterranean Hindu and Jain stepwells, Gangetic dawn landscapes, post-independence modernist concrete, and heritage silk artisan studios. Search and filter plates across series names, geographic locations, and architectural styles.
          </p>
        </div>

        {/* Filter Controls, Search Bar, Scope Switcher & Layout Modes */}
        <GalleryFilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          layoutMode={layoutMode}
          onChangeLayoutMode={(mode) => setLayoutMode(mode)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          searchScope={searchScope}
          onSearchScopeChange={(s) => setSearchScope(s)}
          viewMode={viewMode}
          onViewModeChange={(vm) => setViewMode(vm)}
          totalFilteredCount={filteredPhotographs.length}
          totalAvailableCount={photographs.length}
          onQuickTagSelect={handleQuickTagSelect}
          onResetAll={handleResetAll}
        />

        {/* Gallery Grid */}
        <GalleryGrid
          photographs={filteredPhotographs}
          layoutMode={layoutMode}
          viewMode={viewMode}
          curatorReelIds={curatorReelIds}
          onSelectPhoto={onSelectPhoto}
          onToggleCuratorReel={onToggleCuratorReel}
          onOpenPrintModal={onOpenPrintModal}
          searchQuery={searchQuery}
          onResetFilters={(term) => {
            if (term) {
              setSearchQuery(term);
              setSearchScope('all');
            } else {
              handleResetAll();
            }
          }}
        />
      </div>
    </div>
  );
};
