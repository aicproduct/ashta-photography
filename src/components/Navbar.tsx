/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bookmark, 
  Menu, 
  X, 
  ArrowRight, 
  Layers, 
  Compass, 
  ShoppingBag, 
  Award, 
  User, 
  Mail, 
  ExternalLink,
  Camera,
  Grid3X3,
  LogOut,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Page } from '../types/portfolio';

interface NavbarProps {
  activePage: Page;
  onNavigatePage: (page: Page) => void;
  curatorReelCount: number;
  onOpenCuratorReel: () => void;
  onOpenStudioManager?: () => void;
  isSessionAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigatePage,
  curatorReelCount,
  onOpenCuratorReel,
  isSessionAuthenticated = false,
  onLogout,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onNavigatePage(page);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { page: Page; label: string; icon: React.ReactNode; desc: string }[] = [
    { page: 'home', label: 'Landing & Feeds', icon: <Grid3X3 className="w-4 h-4" />, desc: 'Instagram-style visual grid & latest works' },
    { page: 'galleries', label: 'Galleries', icon: <Camera className="w-4 h-4" />, desc: 'All 100MP plates, series & architectural themes' },
    { page: 'series', label: 'Monographs', icon: <Compass className="w-4 h-4" />, desc: 'Geometry of Devotion, Sacred Waters & Modernism' },
    { page: 'editions', label: 'Print Editions', icon: <ShoppingBag className="w-4 h-4" />, desc: 'Limited edition museum prints with wall simulator' },
    { page: 'exhibitions', label: 'Exhibitions & CV', icon: <Award className="w-4 h-4" />, desc: 'Museum acquisitions, V&A, Venice Biennale' },
    { page: 'about', label: 'About & Method', icon: <User className="w-4 h-4" />, desc: 'Artist manifesto, technical gear & darkroom optics' },
    { page: 'inquire', label: 'Inquiries & Commissions', icon: <Mail className="w-4 h-4" />, desc: 'Curatorial dispatch and representation liaisons' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left Zone: Hamburger Drawer Button + Brand Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-lg text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all cursor-pointer flex items-center gap-2 group shadow-sm active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-xs font-mono uppercase tracking-widest hidden md:inline text-neutral-400 group-hover:text-white">
                Menu
              </span>
            </button>

            <button 
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-lg sm:text-xl font-serif tracking-[0.2em] uppercase text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
            >
              Ashta Gupta
            </button>
          </div>

          {/* Center Zone: Quick Instagram/Media style Gallery Shortcuts */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium font-sans">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`py-1 transition-colors relative cursor-pointer ${
                activePage === 'home' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Feed
              {activePage === 'home' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-100 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('galleries')}
              className={`py-1 transition-colors relative cursor-pointer ${
                activePage === 'galleries' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Galleries
              {activePage === 'galleries' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-100 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('editions')}
              className={`py-1 transition-colors relative cursor-pointer ${
                activePage === 'editions' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Prints (₹)
              {activePage === 'editions' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-100 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('series')}
              className={`py-1 transition-colors relative cursor-pointer ${
                activePage === 'series' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monographs
              {activePage === 'series' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-100 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Zone: Curator Reel + Instant Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenCuratorReel}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              title="View saved curator reel"
            >
              <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Saved</span>
              <span className="tabular-nums font-mono text-neutral-400 text-xs">
                [{curatorReelCount}]
              </span>
            </button>

            {/* Functional Logout button displayed when authenticated in active session */}
            {isSessionAuthenticated && onLogout && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setDrawerOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/70 rounded-md transition-all whitespace-nowrap cursor-pointer shadow-xs active:scale-95"
                title="Logout current session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleNavClick('inquire')}
              className={`px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'inquire'
                  ? 'text-neutral-950 bg-white ring-2 ring-neutral-400'
                  : 'text-neutral-950 bg-neutral-100 hover:bg-white'
              }`}
            >
              Inquire
            </button>
          </div>
        </div>
      </header>

      {/* Full-Featured Slide-Over Hamburger Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-sm sm:max-w-md bg-[#09090b] border-r border-neutral-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250">
              
              {/* Drawer Top Header */}
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    Portfolio Navigation
                  </div>
                  <h3 className="text-lg font-serif text-white tracking-wider uppercase mt-0.5">
                    Ashta Gupta
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 pb-2">
                  Destinations &amp; Portfolios
                </div>

                {navLinks.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      type="button"
                      onClick={() => handleNavClick(item.page)}
                      className={`w-full p-3.5 rounded-xl text-left transition-all flex items-start gap-4 group cursor-pointer border ${
                        isActive
                          ? 'bg-neutral-900 border-neutral-700 text-white shadow-sm'
                          : 'border-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/60 hover:border-neutral-800/80'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 transition-colors ${
                        isActive 
                          ? 'bg-white text-neutral-950' 
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-white'
                      }`}>
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${isActive ? 'text-white font-semibold' : 'text-neutral-200'}`}>
                            {item.label}
                          </span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                            isActive ? 'text-white translate-x-1' : 'text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-0.5'
                          }`} />
                        </div>
                        <p className="text-xs text-neutral-400 font-light truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Information */}
              <div className="p-6 border-t border-neutral-800 bg-[#070709] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Location</span>
                  <span className="text-neutral-200">New Delhi &amp; London</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Medium</span>
                  <span className="text-neutral-200">100MP Archival Monograph</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Standard</span>
                  <span className="text-neutral-200">ISO 9706 Pigment</span>
                </div>

                {isSessionAuthenticated && onLogout ? (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setDrawerOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/70 text-rose-300 hover:text-white rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Logout Session &amp; Return to Home</span>
                  </button>
                ) : (
                  <div className="pt-2 text-[11px] font-mono text-neutral-600 text-center">
                    Press <kbd className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-400">Shift + A</kbd> for Studio Console
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
