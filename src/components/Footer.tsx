/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Page } from '../types/portfolio';

interface FooterProps {
  onNavigatePage?: (page: Page) => void;
  onOpenStudioManager?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage, onOpenStudioManager }) => {
  const handleNav = (page: Page) => {
    if (onNavigatePage) {
      onNavigatePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-neutral-900 bg-[#060608] py-16 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Studio Address */}
          <div className="space-y-3">
            <button 
              type="button"
              onClick={() => handleNav('home')}
              className="text-lg font-serif tracking-[0.25em] uppercase text-neutral-200 hover:text-white transition-colors cursor-pointer text-left"
            >
              Ashta Gupta
            </button>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-light">
              Fine art, architectural heritage, and documentary photography monographs. Preserving sacred stone, shadow, and modernist geometry.
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              Offices in New Delhi &amp; London
            </div>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            <div className="space-y-2">
              <div className="text-neutral-300 uppercase tracking-widest text-[10px]">Galleries</div>
              <ul className="space-y-1.5 text-neutral-400">
                <li><button type="button" onClick={() => handleNav('galleries')} className="hover:text-white transition-colors cursor-pointer text-left">All Works</button></li>
                <li><button type="button" onClick={() => handleNav('galleries')} className="hover:text-white transition-colors cursor-pointer text-left">Stepwell Architecture</button></li>
                <li><button type="button" onClick={() => handleNav('galleries')} className="hover:text-white transition-colors cursor-pointer text-left">Varanasi Waters</button></li>
                <li><button type="button" onClick={() => handleNav('galleries')} className="hover:text-white transition-colors cursor-pointer text-left">Master Weavers</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-neutral-300 uppercase tracking-widest text-[10px]">Monographs</div>
              <ul className="space-y-1.5 text-neutral-400">
                <li><button type="button" onClick={() => handleNav('series')} className="hover:text-white transition-colors cursor-pointer text-left">Geometry of Devotion</button></li>
                <li><button type="button" onClick={() => handleNav('series')} className="hover:text-white transition-colors cursor-pointer text-left">Sacred Waters</button></li>
                <li><button type="button" onClick={() => handleNav('series')} className="hover:text-white transition-colors cursor-pointer text-left">Tropical Modernism</button></li>
                <li><button type="button" onClick={() => handleNav('editions')} className="hover:text-white transition-colors cursor-pointer text-left">Collector Prints</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-neutral-300 uppercase tracking-widest text-[10px]">Institutional</div>
              <ul className="space-y-1.5 text-neutral-400">
                <li><button type="button" onClick={() => handleNav('exhibitions')} className="hover:text-white transition-colors cursor-pointer text-left">Exhibitions CV</button></li>
                <li><button type="button" onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer text-left">Optics &amp; Method</button></li>
                <li><button type="button" onClick={() => handleNav('inquire')} className="hover:text-white transition-colors cursor-pointer text-left">Curatorial Inquiries</button></li>
                <li><button type="button" onClick={() => handleNav('editions')} className="hover:text-white transition-colors cursor-pointer text-left">Certificate Registry</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiet copyright row with stealth copyright trigger */}
        <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
          <div>
            <button
              type="button"
              onClick={onOpenStudioManager}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Studio Console (Shortcut: Shift + A or #/studio)"
            >
              &copy;
            </button>{' '}
            {new Date().getFullYear()} Ashta Gupta Photography Archive. All rights reserved.
          </div>
          <div className="flex items-center gap-4 font-sans">
            <span>Archival Pigment Standard ISO 9706</span>
            <span aria-hidden="true">·</span>
            <span className="font-sans">All Plates 100MP Native</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
