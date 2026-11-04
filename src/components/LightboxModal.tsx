/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Bookmark, 
  ShoppingBag, 
  Maximize, 
  Minimize, 
  Camera, 
  MapPin, 
  Calendar,
  Share2,
  Check
} from 'lucide-react';
import { Photograph } from '../types/portfolio';
import { formatINR } from '../utils/currency';

interface LightboxModalProps {
  currentPhoto: Photograph;
  allPhotos: Photograph[];
  onClose: () => void;
  onNavigate: (photo: Photograph) => void;
  isSavedInReel: boolean;
  onToggleReel: (id: string) => void;
  onOpenPrintModal: (photo: Photograph) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  currentPhoto,
  allPhotos,
  onClose,
  onNavigate,
  isSavedInReel,
  onToggleReel,
  onOpenPrintModal,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when photograph changes
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [currentPhoto.id]);

  const currentIndex = allPhotos.findIndex((p) => p.id === currentPhoto.id);
  const prevPhoto = allPhotos[(currentIndex - 1 + allPhotos.length) % allPhotos.length];
  const nextPhoto = allPhotos[(currentIndex + 1) % allPhotos.length];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(prevPhoto);
      } else if (e.key === 'ArrowRight') {
        onNavigate(nextPhoto);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key.toLowerCase() === 'i') {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allPhotos, prevPhoto, nextPhoto, onClose, onNavigate]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Share link copy
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#${currentPhoto.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060608]/98 backdrop-blur-xl flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar Control Strip */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-900/80 bg-neutral-950/60 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-neutral-400">
            <span className="text-neutral-200 font-semibold">{currentIndex + 1}</span>
            <span className="text-neutral-600"> / {allPhotos.length}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span>{currentPhoto.series}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-300 font-sans">{currentPhoto.title}</span>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-md">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-neutral-400 hover:text-white disabled:text-neutral-700 transition-colors"
              title="Zoom out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-neutral-300 tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 text-neutral-400 hover:text-white disabled:text-neutral-700 transition-colors"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 text-neutral-400 hover:text-white border-l border-neutral-800 ml-1 transition-colors"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Info toggle */}
          <button
            type="button"
            onClick={() => setShowInfo((prev) => !prev)}
            className={`p-2 rounded-md border transition-colors ${
              showInfo
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
            title="Toggle EXIF & Dossier (I)"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-md bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-md bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Copy Plate Reference"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Close Lightbox */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors ml-2"
            title="Close Lightbox (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Inspection Canvas */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left / Right Nav Arrows */}
        <button
          type="button"
          onClick={() => onNavigate(prevPhoto)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 backdrop-blur-md transition-all shadow-xl"
          title="Previous plate (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(nextPhoto)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 backdrop-blur-md transition-all shadow-xl"
          title="Next plate (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Center Stage for Image */}
        <div
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden ${
            zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          <div
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="max-h-full max-w-full flex items-center justify-center"
          >
            <img
              src={currentPhoto.imageSrc}
              alt={currentPhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-[85vw] object-contain shadow-2xl rounded-sm select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Collapsible Curatorial Dossier & EXIF Panel */}
        {showInfo && (
          <aside className="w-full sm:w-96 border-l border-neutral-900 bg-neutral-950/95 backdrop-blur-xl p-6 overflow-y-auto space-y-6 shrink-0 transition-all">
            {/* Header Lockup */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                <span>{currentPhoto.category}</span>
                <span>{currentPhoto.year}</span>
              </div>
              <h2 className="text-2xl font-serif text-white tracking-tight leading-snug">
                {currentPhoto.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{currentPhoto.location}</span>
              </div>
              {currentPhoto.architecturalStyle && (
                <div className="pt-0.5">
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-900/50 px-2.5 py-0.5 rounded-md inline-block">
                    {currentPhoto.architecturalStyle}
                  </span>
                </div>
              )}
            </div>

            {/* Curatorial Statement */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Curatorial Note
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {currentPhoto.curatorStatement}
              </p>
            </div>

            {/* Technical EXIF Metadata Dossier */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-sans font-medium text-xs border-b border-neutral-800 pb-2">
                <Camera className="w-3.5 h-3.5 text-neutral-400" />
                <span>Camera &amp; Exposure Dossier</span>
              </div>

              <div className="space-y-1.5 text-neutral-400 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Body</span>
                  <span className="text-neutral-200">{currentPhoto.exif.camera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Optic</span>
                  <span className="text-neutral-200">{currentPhoto.exif.lens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Focal Length</span>
                  <span className="text-neutral-200">{currentPhoto.exif.focalLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Aperture</span>
                  <span className="text-neutral-200">{currentPhoto.exif.aperture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shutter Speed</span>
                  <span className="text-neutral-200">{currentPhoto.exif.shutterSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Sensitivity</span>
                  <span className="text-neutral-200">{currentPhoto.exif.iso}</span>
                </div>
                {currentPhoto.exif.filmSimulation && (
                  <div className="flex justify-between pt-1 border-t border-neutral-800/80">
                    <span className="text-neutral-500">Tonal Profile</span>
                    <span className="text-neutral-300 text-right">{currentPhoto.exif.filmSimulation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Archival Print Edition Availability */}
            <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase text-neutral-500 text-[10px] tracking-wider">
                  Archival Limited Edition
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {currentPhoto.editionInfo.available} of {currentPhoto.editionInfo.total} available
                </span>
              </div>
              <div className="text-neutral-300 text-[11px]">
                Pigment print on {currentPhoto.editionInfo.archivalPaper}. Signed and numbered with Certificate of Authenticity.
              </div>
              <div className="text-neutral-100 font-mono text-sm pt-1">
                From {formatINR(currentPhoto.editionInfo.startingPrice)}
              </div>
            </div>

            {/* Actions: Bookmark to Curator Reel & Order Print */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onOpenPrintModal(currentPhoto)}
                className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Configure Archival Print</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleReel(currentPhoto.id)}
                className={`w-full py-2.5 px-4 rounded-md text-xs font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isSavedInReel
                    ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSavedInReel ? 'fill-current text-white' : ''}`} />
                <span>{isSavedInReel ? 'Saved to Curator Reel' : 'Add to Curator Reel'}</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
