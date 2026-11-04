/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { PrintAcquisitionModal } from './components/PrintAcquisitionModal';
import { CuratorReelDrawer } from './components/CuratorReelDrawer';

// Separate Page Views
import { HomePage } from './pages/HomePage';
import { GalleriesPage } from './pages/GalleriesPage';
import { MonographsPage } from './pages/MonographsPage';
import { EditionsPage } from './pages/EditionsPage';
import { ExhibitionsPage } from './pages/ExhibitionsPage';
import { AboutPage } from './pages/AboutPage';
import { InquirePage } from './pages/InquirePage';
import { StudioConsolePage } from './pages/StudioConsolePage';

import { PHOTOGRAPHS } from './data/portfolioData';
import { Page, Photograph } from './types/portfolio';
import { OrderRecord } from './types/checkout';
import { normalizeToINR } from './utils/currency';
import { useStudioSecurity } from './hooks/useStudioSecurity';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const security = useStudioSecurity();
  
  // State for photographs with localStorage persistence and INR normalization
  const [photographs, setPhotographs] = useState<Photograph[]>(() => {
    try {
      const saved = localStorage.getItem('ashta_gupta_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Photograph) => ({
            ...p,
            editionInfo: {
              ...p.editionInfo,
              startingPrice: normalizeToINR(p.editionInfo.startingPrice),
            },
          }));
        }
      }
    } catch (e) {
      console.warn('Could not read saved photographs', e);
    }
    return PHOTOGRAPHS;
  });

  // Handle Complete Secure Logout: purges session tokens and immediately redirects to website's Home Page
  const handleSecureLogout = () => {
    security.logout();
    setActivePage('home');
    window.location.hash = '#/home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals & Drawers state
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photograph | null>(null);
  const [activePrintModalPhoto, setActivePrintModalPhoto] = useState<Photograph | null>(null);
  const [isCuratorReelOpen, setIsCuratorReelOpen] = useState<boolean>(false);
  const [curatorReelIds, setCuratorReelIds] = useState<Set<string>>(() => new Set(['plate-01', 'plate-02']));

  // Pre-filled notes for Inquire page
  const [inquiryNotes, setInquiryNotes] = useState<string>('');

  // Synchronize active page from URL hash & support back/forward browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim().toLowerCase();
      
      // Aliases for secret studio console
      if (rawHash === 'studio' || rawHash === 'admin' || rawHash === 'console') {
        setActivePage('studio');
        return;
      }

      const validPages: Page[] = ['home', 'galleries', 'series', 'editions', 'exhibitions', 'about', 'inquire', 'studio'];
      
      if (validPages.includes(rawHash as Page)) {
        setActivePage(rawHash as Page);
      } else if (rawHash.startsWith('plate-')) {
        const matched = photographs.find((p) => p.id === rawHash);
        if (matched) {
          setActiveLightboxPhoto(matched);
        }
      } else if (!rawHash) {
        setActivePage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [photographs]);

  // Secret keyboard shortcut: Shift + A toggles the Studio Console from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleNavigatePage(activePage === 'studio' ? 'home' : 'studio');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage]);

  const handleNavigatePage = (page: Page) => {
    setActivePage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save updated photographs to state & localStorage
  const handleSavePhotographs = (updated: Photograph[]) => {
    setPhotographs(updated);
    try {
      localStorage.setItem('ashta_gupta_photos', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist photographs', e);
    }
  };

  // Reset to original studio default plates
  const handleResetDefaults = () => {
    setPhotographs(PHOTOGRAPHS);
    try {
      localStorage.removeItem('ashta_gupta_photos');
    } catch (e) {
      console.warn('Could not reset photographs', e);
    }
  };

  // Curator Reel handlers
  const handleToggleCuratorReel = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCuratorReelIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearReel = () => {
    setCuratorReelIds(new Set());
  };

  const savedPhotographs = useMemo(() => {
    return photographs.filter((p) => curatorReelIds.has(p.id));
  }, [photographs, curatorReelIds]);

  const handleBatchInquire = (photos: Photograph[]) => {
    const list = photos.map((p) => `"${p.title}" (${p.series}, ${p.year})`).join(', ');
    setInquiryNotes(`Interested in acquiring or exhibiting the following plates from my Curator Reel: ${list}.`);
    handleNavigatePage('inquire');
  };

  const handleOpenPrintModal = (photo: Photograph, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePrintModalPhoto(photo);
  };

  // When a collector acquires a print via PayPal checkout, update available edition count
  const handleOrderCompleted = (order: OrderRecord) => {
    setPhotographs((prev) => {
      const updated = prev.map((p) => {
        if (p.id === order.photoId && p.editionInfo.available > 0) {
          return {
            ...p,
            editionInfo: {
              ...p.editionInfo,
              available: Math.max(0, p.editionInfo.available - 1),
            },
          };
        }
        return p;
      });
      try {
        localStorage.setItem('ashta_gupta_photos', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist updated editions', e);
      }
      return updated;
    });
  };

  // FULL PAGE STUDIO CONSOLE VIEW (WITHOUT PUBLIC HEADER OR FOOTER)
  if (activePage === 'studio') {
    return (
      <StudioConsolePage
        photographs={photographs}
        onSavePhotographs={handleSavePhotographs}
        onResetDefaults={handleResetDefaults}
        onExit={() => handleNavigatePage('home')}
        onLogout={handleSecureLogout}
      />
    );
  }

  // PUBLIC PORTFOLIO SITE (WITH TOP BAR CONTRACT AND FOOTER)
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-neutral-800 selection:text-white flex flex-col justify-between">
      <div>
        {/* Strict 3-zone Top Bar Contract with Page Routing */}
        <Navbar
          activePage={activePage}
          onNavigatePage={handleNavigatePage}
          curatorReelCount={curatorReelIds.size}
          onOpenCuratorReel={() => setIsCuratorReelOpen(true)}
          isSessionAuthenticated={!security.isLocked}
          onLogout={handleSecureLogout}
        />

        {/* Separate Page Views Router with subtle fade-in & slide-up animation */}
        <main className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activePage === 'home' && (
                <HomePage
                  photographs={photographs}
                  onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
                  onNavigatePage={handleNavigatePage}
                  curatorReelIds={curatorReelIds}
                  onToggleCuratorReel={handleToggleCuratorReel}
                />
              )}

              {activePage === 'galleries' && (
                <GalleriesPage
                  photographs={photographs}
                  onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
                  curatorReelIds={curatorReelIds}
                  onToggleCuratorReel={handleToggleCuratorReel}
                  onOpenPrintModal={handleOpenPrintModal}
                />
              )}

              {activePage === 'series' && (
                <MonographsPage
                  onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
                  onNavigatePage={handleNavigatePage}
                />
              )}

              {activePage === 'editions' && (
                <EditionsPage
                  photographs={photographs}
                  onOpenPrintModal={handleOpenPrintModal}
                  onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
                  onNavigatePage={handleNavigatePage}
                />
              )}

              {activePage === 'exhibitions' && (
                <ExhibitionsPage />
              )}

              {activePage === 'about' && (
                <AboutPage
                  onNavigatePage={handleNavigatePage}
                />
              )}

              {activePage === 'inquire' && (
                <InquirePage
                  initialNotes={inquiryNotes}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer with Page Navigation & Stealth Copyright Console Trigger */}
      <Footer
        onNavigatePage={handleNavigatePage}
        onOpenStudioManager={() => handleNavigatePage('studio')}
      />

      {/* Global Interactive Fullscreen High-Resolution Lightbox Modal */}
      {activeLightboxPhoto && (
        <LightboxModal
          currentPhoto={activeLightboxPhoto}
          allPhotos={photographs}
          onClose={() => setActiveLightboxPhoto(null)}
          onNavigate={(photo) => setActiveLightboxPhoto(photo)}
          isSavedInReel={curatorReelIds.has(activeLightboxPhoto.id)}
          onToggleReel={(id) => handleToggleCuratorReel(id)}
          onOpenPrintModal={(photo) => handleOpenPrintModal(photo)}
        />
      )}

      {/* Global Interactive Fine Art Print Customizer & Wall Simulator Modal */}
      {activePrintModalPhoto && (
        <PrintAcquisitionModal
          photo={activePrintModalPhoto}
          onClose={() => setActivePrintModalPhoto(null)}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* Global Curator Reel Selection Drawer */}
      <CuratorReelDrawer
        isOpen={isCuratorReelOpen}
        onClose={() => setIsCuratorReelOpen(false)}
        savedPhotos={savedPhotographs}
        onRemove={(id) => handleToggleCuratorReel(id)}
        onClearAll={handleClearReel}
        onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
        onBatchInquire={handleBatchInquire}
        onOpenPrintModal={(photo) => handleOpenPrintModal(photo)}
      />
    </div>
  );
}
