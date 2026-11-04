/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save, RotateCcw, Copy, Check, Upload, Sliders, Image as ImageIcon } from 'lucide-react';
import { Photograph, Category } from '../types/portfolio';

interface StudioManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photographs: Photograph[];
  onSavePhotographs: (photos: Photograph[]) => void;
  onResetDefaults: () => void;
}

export const StudioManagerModal: React.FC<StudioManagerModalProps> = ({
  isOpen,
  onClose,
  photographs,
  onSavePhotographs,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'add' | 'export'>('photos');
  const [copiedCode, setCopiedCode] = useState(false);

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newSeries, setNewSeries] = useState('Geometry of Devotion');
  const [newCategory, setNewCategory] = useState<Exclude<Category, 'All'>>('Architecture');
  const [newYear, setNewYear] = useState<number>(2025);
  const [newLocation, setNewLocation] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('');
  const [newCamera, setNewCamera] = useState('Hasselblad H6D-100c');
  const [newLens, setNewLens] = useState('Hasselblad HC 28mm f/4');
  const [newFocalLength, setNewFocalLength] = useState('28mm');
  const [newAperture, setNewAperture] = useState('f/8.0');
  const [newShutterSpeed, setNewShutterSpeed] = useState('1/125s');
  const [newIso, setNewIso] = useState('ISO 100');
  const [newCuratorStatement, setNewCuratorStatement] = useState('');
  const [newTotalEditions, setNewTotalEditions] = useState<number>(10);
  const [newPrice, setNewPrice] = useState<number>(1500);

  // Edit photo state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotograph = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageSrc) return;

    const newPlate: Photograph = {
      id: `plate-${Date.now()}`,
      title: newTitle,
      series: newSeries,
      category: newCategory,
      year: Number(newYear),
      location: newLocation || 'Rajasthan, India',
      imageSrc: newImageSrc,
      aspectRatio: '4:3',
      exif: {
        camera: newCamera,
        lens: newLens,
        focalLength: newFocalLength,
        aperture: newAperture,
        shutterSpeed: newShutterSpeed,
        iso: newIso,
        filmSimulation: 'Archival Neutral Monochrome'
      },
      curatorStatement: newCuratorStatement || 'Monograph archival plate study in architectural light and shadow.',
      editionInfo: {
        total: Number(newTotalEditions),
        available: Number(newTotalEditions),
        startingPrice: Number(newPrice),
        archivalPaper: 'Hahnemühle German Etching 310gsm'
      }
    };

    onSavePhotographs([newPlate, ...photographs]);
    setActiveTab('photos');
    // Reset form
    setNewTitle('');
    setNewLocation('');
    setNewImageSrc('');
    setNewCuratorStatement('');
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('Are you sure you want to remove this plate from the active archive?')) {
      onSavePhotographs(photographs.filter((p) => p.id !== id));
    }
  };

  const handleCopyCode = () => {
    const code = JSON.stringify(photographs, null, 2);
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c0c0f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Studio Archive Console
            </div>
            <h2 className="text-xl font-serif text-white tracking-wide mt-0.5">
              Manage Photographs &amp; Content
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset archive to default plates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Archive Catalog ({photographs.length} Plates)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'add'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Photograph</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'export'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Developer Code &amp; File Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Current Archive List */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Manage active plates in your high-resolution gallery.</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-white text-neutral-950 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload / Add Plate</span>
                </button>
              </div>

              <div className="space-y-3">
                {photographs.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={photo.imageSrc}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 rounded object-cover bg-neutral-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-neutral-500 uppercase">
                          #{idx + 1} · {photo.series} · {photo.category}
                        </div>
                        <div className="font-serif text-sm text-neutral-100 truncate font-medium">
                          {photo.title}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">
                          {photo.location} · {photo.year} · {photo.exif.camera}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right text-xs font-mono pr-2 hidden md:block">
                        <div className="text-emerald-400">{photo.editionInfo.available}/{photo.editionInfo.total} avail</div>
                        <div className="text-neutral-400">${photo.editionInfo.startingPrice}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-900 transition-colors cursor-pointer"
                        title="Delete Photograph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Add New Photograph Form */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddPhotograph} className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-serif text-white">Add New Photographic Plate</h3>
                <p className="text-xs text-neutral-400 font-light">
                  Upload an image file or provide a local path/URL along with EXIF and limited edition details.
                </p>
              </div>

              {/* Image Input / Upload */}
              <div className="space-y-3 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Photograph Source (File Upload or Path) *
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-neutral-400" />
                    <span>Choose Local Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-neutral-500">or enter image path / URL:</span>

                  <input
                    type="text"
                    value={newImageSrc}
                    onChange={(e) => setNewImageSrc(e.target.value)}
                    placeholder="/src/assets/images/my_photo.jpg or https://..."
                    className="flex-1 w-full px-3 py-2 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  />
                </div>

                {newImageSrc && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={newImageSrc}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded border border-neutral-700"
                    />
                    <span className="text-xs text-emerald-400 font-mono">Image attached and ready</span>
                  </div>
                )}
              </div>

              {/* Title, Series, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Plate Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Shadows of the Stepwell"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Series Chapter
                  </label>
                  <select
                    value={newSeries}
                    onChange={(e) => setNewSeries(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  >
                    <option value="Geometry of Devotion">Geometry of Devotion</option>
                    <option value="Sacred Waters">Sacred Waters</option>
                    <option value="Tropical Modernism">Tropical Modernism</option>
                    <option value="Craft of the Banaras Guilds">Craft of the Banaras Guilds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Category Genre
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Landscapes">Landscapes</option>
                    <option value="Street &amp; Nocturne">Street &amp; Nocturne</option>
                    <option value="Editorial &amp; Portraiture">Editorial &amp; Portraiture</option>
                  </select>
                </div>
              </div>

              {/* Location & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Bundi, Rajasthan, India"
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Year of Capture
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              {/* EXIF Data */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Camera EXIF &amp; Exposure Metadata
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">Camera Body</span>
                    <input
                      type="text"
                      value={newCamera}
                      onChange={(e) => setNewCamera(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">Lens</span>
                    <input
                      type="text"
                      value={newLens}
                      onChange={(e) => setNewLens(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">Focal Length</span>
                    <input
                      type="text"
                      value={newFocalLength}
                      onChange={(e) => setNewFocalLength(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">Aperture</span>
                    <input
                      type="text"
                      value={newAperture}
                      onChange={(e) => setNewAperture(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">Shutter Speed</span>
                    <input
                      type="text"
                      value={newShutterSpeed}
                      onChange={(e) => setNewShutterSpeed(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-500 font-mono mb-1">ISO Sensitivity</span>
                    <input
                      type="text"
                      value={newIso}
                      onChange={(e) => setNewIso(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Curatorial Statement */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Curatorial Statement / Description
                </label>
                <textarea
                  rows={3}
                  value={newCuratorStatement}
                  onChange={(e) => setNewCuratorStatement(e.target.value)}
                  placeholder="Describe the light, historical architecture, and optical technique..."
                  className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600 resize-none"
                />
              </div>

              {/* Print Editions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Edition Cap (Number of prints)
                  </label>
                  <input
                    type="number"
                    value={newTotalEditions}
                    onChange={(e) => setNewTotalEditions(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Starting Price (USD)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm cursor-pointer"
              >
                Save &amp; Publish Plate to Gallery Archive
              </button>
            </form>
          )}

          {/* TAB 3: Developer Code & File Guide */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-serif text-white">How Content is Managed in Code</h3>
                <p className="text-xs text-neutral-400 font-light">
                  Your portfolio uses a clean, single-source-of-truth architecture. You can update content directly in the codebase files below:
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">1. Photographs &amp; Curatorial Metadata</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/data/portfolioData.ts</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Contains the <code className="text-neutral-300">PHOTOGRAPHS</code> array. To add a photograph permanently in code, simply add a new object with title, imageSrc, exif, curatorStatement, and editionInfo.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">2. Image Asset Files</div>
                  <div className="text-neutral-300">Directory: <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/assets/images/</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Place your high-resolution JPG/PNG images in this directory and reference them as <code className="text-neutral-300">/src/assets/images/your_file.jpg</code>.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">3. About Bio, Manifesto &amp; Studio Addresses</div>
                  <div className="text-neutral-300">Files: <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/pages/AboutPage.tsx</span> &amp; <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/components/GearAndPhilosophy.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Edit the artist manifesto, biographical narrative, and studio address lines directly.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">4. Contact &amp; Curatorial Representation</div>
                  <div className="text-neutral-300">Files: <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/pages/InquirePage.tsx</span> &amp; <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/components/ContactInquirySection.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Update studio contact emails (<code className="text-neutral-300">studio@ashtagupta-photography.com</code>) and gallery representation names.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">5. Exhibitions Timeline &amp; Published Books</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/data/portfolioData.ts</span> (EXHIBITIONS array) &amp; <span className="text-white bg-neutral-900 px-1.5 py-0.5 rounded">/src/pages/ExhibitionsPage.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Add new solo/group exhibitions, dates, venues, and monograph publication details.
                  </div>
                </div>
              </div>

              {/* Export JSON button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Copy current active plates JSON to paste into code:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-mono rounded flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied JSON!' : 'Copy Plates Data'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
