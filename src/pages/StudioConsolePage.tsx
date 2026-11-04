/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  Eye, 
  Key, 
  Lock, 
  Unlock,
  LogOut,
  ShieldCheck, 
  ShieldAlert,
  FileText, 
  Mail, 
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  Search,
  Filter,
  Layers,
  DollarSign,
  Clock,
  Shield,
  Save,
  RefreshCw,
  Sliders,
  FolderLock,
  ShoppingBag,
  MapPin,
  Truck
} from 'lucide-react';
import { Photograph, Category } from '../types/portfolio';
import { OrderRecord } from '../types/checkout';
import { useStudioSecurity } from '../hooks/useStudioSecurity';
import { SecurityLockGate } from '../components/SecurityLockGate';
import { formatINR, normalizeToINR } from '../utils/currency';
import { getStoredOrders } from '../utils/orderStorage';

interface StudioConsolePageProps {
  photographs: Photograph[];
  onSavePhotographs: (photos: Photograph[]) => void;
  onResetDefaults: () => void;
  onExit: () => void;
  onLogout?: () => void;
}

export const StudioConsolePage: React.FC<StudioConsolePageProps> = ({
  photographs,
  onSavePhotographs,
  onResetDefaults,
  onExit,
  onLogout,
}) => {
  // Master Studio Security Hook
  const security = useStudioSecurity();

  // Perform secure complete logout and redirect to public home
  const handleSecureLogout = () => {
    security.logout();
    if (onLogout) {
      onLogout();
    } else {
      onExit();
    }
  };

  // Tab navigation: dashboard | orders | photos (library) | add | security | code
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'photos' | 'add' | 'security' | 'code'>('dashboard');
  const [orders, setOrders] = useState<OrderRecord[]>(() => getStoredOrders());
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Refresh orders when switching to orders or dashboard
  React.useEffect(() => {
    setOrders(getStoredOrders());
  }, [activeTab]);

  // Library Vault Lock State (Independent or sub-lock for media library)
  const [isLibraryVaultLocked, setIsLibraryVaultLocked] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState('All');

  // Change PIN Form State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state for adding new plate
  const [newTitle, setNewTitle] = useState('');
  const [newSeries, setNewSeries] = useState('Geometry of Devotion');
  const [newCategory, setNewCategory] = useState<Exclude<Category, 'All'>>('Architecture');
  const [newYear, setNewYear] = useState<number>(2025);
  const [newLocation, setNewLocation] = useState('');
  const [newArchitecturalStyle, setNewArchitecturalStyle] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('');
  const [newCamera, setNewCamera] = useState('Hasselblad H6D-100c');
  const [newLens, setNewLens] = useState('Hasselblad HC 28mm f/4');
  const [newFocalLength, setNewFocalLength] = useState('28mm');
  const [newAperture, setNewAperture] = useState('f/8.0');
  const [newShutterSpeed, setNewShutterSpeed] = useState('1/125s');
  const [newIso, setNewIso] = useState('ISO 100');
  const [newCuratorStatement, setNewCuratorStatement] = useState('');
  const [newTotalEditions, setNewTotalEditions] = useState<number>(10);
  const [newPrice, setNewPrice] = useState<number>(125000);

  // IF SECURITY GATE IS LOCKED, SHOW THE RESTRICTED SECURITY LOCK SCREEN
  if (security.isLocked) {
    return (
      <SecurityLockGate
        onUnlock={security.unlock}
        onExit={onExit}
        onResetDefaultPin={security.resetToDefaultPin}
        title="Studio Console & Library Locked"
        subtitle="Restricted curatorial management system. Enter studio master PIN to proceed."
      />
    );
  }

  // Library search and filter logic
  const filteredPhotographs = photographs.filter((photo) => {
    const matchesSearch = 
      photo.title.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
      photo.location.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
      photo.series.toLowerCase().includes(librarySearchQuery.toLowerCase());
    const matchesSeries = selectedSeriesFilter === 'All' || photo.series === selectedSeriesFilter;
    return matchesSearch && matchesSeries;
  });

  // Calculate high-level studio analytics for Dashboard
  const totalEditions = photographs.reduce((acc, p) => acc + p.editionInfo.total, 0);
  const availableEditions = photographs.reduce((acc, p) => acc + p.editionInfo.available, 0);
  const totalCatalogValue = photographs.reduce((acc, p) => acc + (p.editionInfo.total * normalizeToINR(p.editionInfo.startingPrice)), 0);
  const uniqueSeries = Array.from(new Set(photographs.map((p) => p.series)));

  // Image file upload handler
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
      architecturalStyle: newArchitecturalStyle || 'Heritage Architecture & Geometric Form',
      editionInfo: {
        total: Number(newTotalEditions),
        available: Number(newTotalEditions),
        startingPrice: Number(newPrice),
        archivalPaper: 'Hahnemühle German Etching 310gsm'
      }
    };

    onSavePhotographs([newPlate, ...photographs]);
    setActiveTab('photos');
    setNewTitle('');
    setNewLocation('');
    setNewArchitecturalStyle('');
    setNewImageSrc('');
    setNewCuratorStatement('');
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('Remove this plate from the active exhibition archive?')) {
      onSavePhotographs(photographs.filter((p) => p.id !== id));
    }
  };

  const handleUpdatePrice = (id: string, newPriceVal: number) => {
    const updated = photographs.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          editionInfo: {
            ...p.editionInfo,
            startingPrice: newPriceVal
          }
        };
      }
      return p;
    });
    onSavePhotographs(updated);
  };

  const handleCopyCode = () => {
    const code = JSON.stringify(photographs, null, 2);
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Change PIN handler
  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeStatus(null);

    if (newPinInput !== confirmPinInput) {
      setPinChangeStatus({ type: 'error', message: 'New PIN and confirmation PIN do not match.' });
      return;
    }

    const res = security.changePin(currentPinInput, newPinInput);
    if (res.success) {
      setPinChangeStatus({ type: 'success', message: 'Master PIN successfully updated and saved!' });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      setPinChangeStatus({ type: 'error', message: res.error || 'Failed to update PIN.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans">
      
      {/* Console Dedicated Top Header (NO PUBLIC NAVBAR) */}
      <header className="h-18 px-6 sm:px-8 border-b border-neutral-800 bg-[#0c0c0f] flex items-center justify-between shrink-0 sticky top-0 z-30">
        
        {/* Left identity & Exit link */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Public Portfolio</span>
          </button>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
              <span>Studio CMS &amp; Media Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-sm font-serif text-white font-medium">
              Ashta Gupta Photography Console
            </div>
          </div>
        </div>

        {/* Center / Right Security & Status Actions */}
        <div className="flex items-center gap-3">
          
          {/* Security status badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unlocked</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-500 text-[11px]">
              {security.autoLockMinutes > 0 ? `Auto-locks in ${security.autoLockMinutes}m` : 'Manual lock'}
            </span>
          </div>

          {/* Quick Lock Button */}
          <button
            type="button"
            onClick={security.lock}
            className="px-3 py-1.5 text-xs font-mono text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Lock Studio Console session"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Lock</span>
          </button>

          {/* Secure Logout & Redirect Button */}
          <button
            type="button"
            onClick={handleSecureLogout}
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/70 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Securely Logout, purge session tokens and return to Home"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Logout</span>
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-2.5 py-1.5 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors hidden xl:flex items-center gap-1.5 cursor-pointer"
            title="Restore original portfolio plates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          {/* View Live Site */}
          <button
            type="button"
            onClick={onExit}
            className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Public Site</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar Navigation (Sticky) */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-[#0a0a0d] p-4 sm:p-6 space-y-6 shrink-0 md:sticky md:top-18 md:h-[calc(100vh-4.5rem)] md:overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Console Menu
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
              SECURE
            </span>
          </div>

          <nav className="space-y-1.5">
            {/* TAB: DASHBOARD */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-neutral-300" />
              <span>Studio Dashboard</span>
            </button>

            {/* TAB: ACQUISITIONS & PAYPAL ORDERS */}
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-sky-400" />
                <span>Orders &amp; PayPal</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-900/60">
                {orders.length}
              </span>
            </button>

            {/* TAB: PHOTOGRAPHS & MEDIA LIBRARY */}
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Media Library</span>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">[{photographs.length}]</span>
            </button>

            {/* TAB: ADD PLATE */}
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Plate</span>
            </button>

            {/* TAB: SECURITY & LOCKING SYSTEM */}
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Locking System</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            {/* TAB: CODE & CONTENT */}
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-neutral-800 text-white font-semibold shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Content Architecture</span>
            </button>
          </nav>

          {/* Quick Security Status Box */}
          <div className="pt-6 border-t border-neutral-800/80 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Security State</span>
              <span className="text-emerald-400">ENCRYPTED</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1.5 text-[11px] font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Master PIN:</span>
                <span className="text-neutral-200">****</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Lock:</span>
                <span className="text-neutral-200">{security.autoLockMinutes > 0 ? `${security.autoLockMinutes} mins` : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span>Library Vault:</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-500">
              Press <kbd className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-300">Shift + A</kbd> anywhere on the site to return to this console.
            </div>

            {/* Sidebar Logout button */}
            <button
              type="button"
              onClick={handleSecureLogout}
              className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-rose-950/40 text-neutral-300 hover:text-rose-300 border border-neutral-800 hover:border-rose-900/60 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Terminate Session (Logout)</span>
            </button>
          </div>
        </aside>

        {/* Right Content Canvas */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          {/* ======================================================== */}
          {/* TAB 1: STUDIO OVERVIEW DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                    Museum &amp; Collector Operations
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                    Studio Overview &amp; Catalog Dashboard
                  </h1>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Real-time catalog metrics, edition inventory valuation, and security locks for Ashta Gupta.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Plate</span>
                  </button>

                  <button
                    type="button"
                    onClick={security.lock}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-700 text-xs font-mono rounded-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Now</span>
                  </button>
                </div>
              </div>

              {/* Key Metric Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Plates */}
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-mono uppercase tracking-wider">Archival Plates</span>
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-serif text-white font-normal">
                    {photographs.length}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    100MP Master Plates in Active Archive
                  </div>
                </div>

                {/* Metric 2: Editions Total */}
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-mono uppercase tracking-wider">Prints Available</span>
                    <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-serif text-white font-normal">
                    {availableEditions} <span className="text-sm font-sans text-neutral-500 font-light">/ {totalEditions}</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    {Math.round((availableEditions / (totalEditions || 1)) * 100)}% Inventory Cap Remaining
                  </div>
                </div>

                {/* Metric 3: Portfolio Valuation */}
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-mono uppercase tracking-wider">Edition Valuation</span>
                    <span className="text-amber-400 font-serif font-bold text-sm">₹</span>
                  </div>
                  <div className="text-3xl font-serif text-white font-normal">
                    ₹{(totalCatalogValue / 100000).toFixed(1)}L
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    Gross Archival Print Valuation (INR)
                  </div>
                </div>

                {/* Metric 4: Security Status */}
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-2">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-mono uppercase tracking-wider">Lock Protection</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-serif text-white font-normal flex items-center gap-2">
                    <span>Active</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    Master PIN: {security.securityHint ? 'Configured' : 'Default'}
                  </div>
                </div>

              </div>

              {/* Series & Monograph Distribution */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif text-white">Monograph Series Distribution</h3>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">
                      Breakdown of fine art works published across curatorial thematic volumes.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{uniqueSeries.length} Active Series</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {uniqueSeries.map((seriesName) => {
                    const count = photographs.filter((p) => p.series === seriesName).length;
                    const pct = Math.round((count / photographs.length) * 100);
                    return (
                      <div key={seriesName} className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                        <div className="text-xs font-serif text-neutral-200 truncate">{seriesName}</div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-mono text-white">{count} <span className="text-xs text-neutral-500">plates</span></span>
                          <span className="text-xs font-mono text-emerald-400">{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Security Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel 1: Security Quick Actions */}
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif text-white">Locking System Status</h4>
                      <p className="text-xs text-neutral-400">Manage dashboard &amp; library credentials</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Your Studio Console is protected by a master passcode gate with auto-lock timer. Gallery visitors cannot access or view your management tools.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Configure Master PIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={security.lock}
                      className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/60 text-xs font-mono text-rose-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Now</span>
                    </button>
                  </div>
                </div>

                {/* Panel 2: Media Library Controls */}
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif text-white">Media Library Vault</h4>
                      <p className="text-xs text-neutral-400">High-resolution plates &amp; print runs</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Manage the {photographs.length} photographs currently live in the archive. Edit print prices, upload new medium format captures, or export JSON.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('photos')}
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Browse Library ({photographs.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('add')}
                      className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photograph</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1.5: ACQUISITIONS & PAYPAL CLIENT ORDERS */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-serif text-white font-normal">
                      Acquisitions &amp; PayPal Checkout Orders
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-900/60">
                      {orders.length} REGISTERED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Client shipping addresses, PayPal transaction tokens, and fine art courier dispatch statuses.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
                    <span className="text-neutral-500">Gross Sales: </span>
                    <span className="text-emerald-400 font-semibold">
                      {formatINR(orders.reduce((sum, o) => sum + o.totalInr, 0))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 space-y-4 shadow-lg hover:border-neutral-700 transition-colors"
                  >
                    {/* Top Bar of Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="font-mono text-xs text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="text-neutral-600">·</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-900/60">
                          {order.status}
                        </span>
                      </div>

                      {/* PayPal Transaction Badge */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-sky-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          PayPal:
                        </span>
                        <span className="text-neutral-300 font-mono text-[11px]">{order.paypalTransactionId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(order.paypalTransactionId);
                            setCopiedOrderId(order.id);
                            setTimeout(() => setCopiedOrderId(null), 2000);
                          }}
                          className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy PayPal Transaction ID"
                        >
                          {copiedOrderId === order.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Middle Grid: Artwork Specs + Client Shipping Address */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Artwork Summary */}
                      <div className="md:col-span-5 flex items-start gap-4">
                        <img
                          src={order.photoImageSrc}
                          alt={order.photoTitle}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-lg object-cover border border-neutral-800 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                            {order.series}
                          </div>
                          <h4 className="text-sm font-serif text-white font-medium truncate">
                            {order.photoTitle}
                          </h4>
                          <div className="text-xs text-emerald-400 font-mono">
                            Edition #{order.editionNumber} of {order.totalEditions}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Format: {order.size} · {order.frame.replace('-', ' ')}
                          </div>
                          <div className="text-xs font-serif text-white font-semibold pt-1">
                            {formatINR(order.totalInr)} <span className="text-[11px] font-mono text-neutral-400">(${order.totalUsd} USD)</span>
                          </div>
                        </div>
                      </div>

                      {/* Client Shipping Destination Address */}
                      <div className="md:col-span-7 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-800/60 pb-1.5">
                          <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            <span>Client Shipping Destination</span>
                          </div>
                          <span className="text-sky-300">Courier: {order.trackingNumber || 'DHL Express Fine Art'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
                          <div>
                            <div className="text-neutral-400 font-mono text-[10px]">RECIPIENT &amp; CONTACT</div>
                            <div className="font-sans font-medium text-white">{order.clientAddress.fullName}</div>
                            <div className="text-neutral-400 truncate">{order.clientAddress.email}</div>
                            <div className="text-neutral-400">{order.clientAddress.phone}</div>
                          </div>

                          <div>
                            <div className="text-neutral-400 font-mono text-[10px]">PHYSICAL ADDRESS</div>
                            <div className="text-neutral-200">
                              {order.clientAddress.addressLine1}
                              {order.clientAddress.addressLine2 ? `, ${order.clientAddress.addressLine2}` : ''}
                            </div>
                            <div className="text-neutral-300">
                              {order.clientAddress.city}, {order.clientAddress.state} {order.clientAddress.postalCode}
                            </div>
                            <div className="text-white font-medium">{order.clientAddress.country}</div>
                          </div>
                        </div>

                        {order.clientAddress.deliveryNotes && (
                          <div className="pt-2 border-t border-neutral-800/60 text-[11px] text-amber-300/80">
                            <span className="font-mono text-neutral-400">Courier Notes:</span> "{order.clientAddress.deliveryNotes}"
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: PHOTOGRAPHS & MEDIA LIBRARY */}
          {/* ======================================================== */}
          {activeTab === 'photos' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-serif text-white font-normal">Photographs &amp; Media Library</h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                      VAULT PROTECTED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Central repository of archival plates, exposure dossiers, and print edition pricing.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsLibraryVaultLocked(!isLibraryVaultLocked)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isLibraryVaultLocked 
                        ? 'bg-amber-950/50 border-amber-800 text-amber-300' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {isLibraryVaultLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isLibraryVaultLocked ? 'Library Locked' : 'Lock Library'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Plate</span>
                  </button>
                </div>
              </div>

              {/* If Library Vault is locked independently */}
              {isLibraryVaultLocked ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-950 border border-amber-900/40 space-y-4 max-w-md mx-auto my-12">
                  <div className="w-12 h-12 rounded-full bg-amber-950/50 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif text-white">Media Library Vault Locked</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    The photographic asset archive is temporarily concealed for privacy. Unlock to inspect high-resolution plates and modify pricing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLibraryVaultLocked(false)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Unlock Media Vault
                  </button>
                </div>
              ) : (
                <>
                  {/* Search & Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-neutral-950 border border-neutral-800/90 rounded-xl">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search plates, locations, series..."
                        value={librarySearchQuery}
                        onChange={(e) => setLibrarySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-neutral-500" />
                      <select
                        value={selectedSeriesFilter}
                        onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 px-3 py-1.5 focus:outline-none font-mono cursor-pointer"
                      >
                        <option value="All">All Series ({photographs.length})</option>
                        {uniqueSeries.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Photographs List */}
                  <div className="space-y-4">
                    {filteredPhotographs.length === 0 ? (
                      <div className="p-12 text-center rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-500 font-mono text-xs">
                        No plates match the selected search or filter criteria.
                      </div>
                    ) : (
                      filteredPhotographs.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/90 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center gap-5 min-w-0">
                            <img
                              src={photo.imageSrc}
                              alt={photo.title}
                              referrerPolicy="no-referrer"
                              className="w-24 h-18 rounded-lg object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                            />
                            <div className="min-w-0 space-y-1">
                              <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <span>Plate 0{idx + 1}</span>
                                <span>·</span>
                                <span className="text-neutral-400">{photo.series}</span>
                                <span>·</span>
                                <span className="text-neutral-500">{photo.category}</span>
                              </div>
                              <h3 className="text-base font-serif text-neutral-100 font-medium truncate">
                                {photo.title}
                              </h3>
                              <div className="text-xs text-neutral-400 font-mono">
                                {photo.location} · {photo.year}
                              </div>
                              <div className="text-[11px] text-neutral-500 font-mono">
                                {photo.exif.camera} · {photo.exif.lens} · {photo.exif.aperture} · {photo.exif.iso}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-900">
                            
                            {/* Price and Edition inline editor */}
                            <div className="text-left md:text-right font-mono text-xs space-y-1">
                              <div className="text-emerald-400">
                                {photo.editionInfo.available} of {photo.editionInfo.total} available
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <span className="text-neutral-400 font-medium">₹</span>
                                <input
                                  type="number"
                                  defaultValue={normalizeToINR(photo.editionInfo.startingPrice)}
                                  onBlur={(e) => handleUpdatePrice(photo.id, Number(e.target.value))}
                                  className="w-24 px-2 py-0.5 text-xs font-mono bg-neutral-900 text-neutral-200 border border-neutral-700 rounded text-right focus:outline-none focus:border-neutral-400"
                                  title="Click to edit starting price in INR"
                                />
                                <span className="text-[10px] text-neutral-500 font-mono">INR</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-2 text-neutral-500 hover:text-rose-400 rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
                              title="Delete photograph from archive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ADD NEW PHOTOGRAPH FORM */}
          {/* ======================================================== */}
          {activeTab === 'add' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-neutral-800 pb-5">
                <h1 className="text-2xl font-serif text-white font-normal">Add New Photograph to Archive</h1>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Upload an image file directly or specify a local file path, along with camera exposure and print edition details.
                </p>
              </div>

              <form onSubmit={handleAddPhotograph} className="space-y-6">
                
                {/* Upload or URL source */}
                <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Image Source (Upload from computer or specify path) *
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-auto px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                      <Upload className="w-4 h-4 text-neutral-400" />
                      <span>Upload Local Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-neutral-500 font-mono">or enter URL / path:</span>

                    <input
                      type="text"
                      placeholder="e.g. /src/assets/images/plate_name.jpg"
                      value={newImageSrc}
                      onChange={(e) => setNewImageSrc(e.target.value)}
                      className="flex-1 w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-500 font-mono"
                    />
                  </div>

                  {newImageSrc && (
                    <div className="mt-4 p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center gap-4">
                      <img
                        src={newImageSrc}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded bg-black"
                      />
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Image loaded and ready for archive</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Artwork Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chand Baori at Twilight"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Series / Monograph Volume
                    </label>
                    <input
                      type="text"
                      value={newSeries}
                      onChange={(e) => setNewSeries(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Exclude<Category, 'All'>)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Landscapes">Landscapes</option>
                      <option value="Street &amp; Nocturne">Street &amp; Nocturne</option>
                      <option value="Editorial &amp; Portraiture">Editorial &amp; Portraiture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Abhaneri, Rajasthan"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Architectural Style / Heritage Theme
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Subterranean Stepped Baori, Brutalist Concrete, Rajput Haveli"
                      value={newArchitecturalStyle}
                      onChange={(e) => setNewArchitecturalStyle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                {/* Technical EXIF Dossier */}
                <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Camera &amp; Optical Exposure Dossier
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">Camera Body</span>
                      <input
                        type="text"
                        value={newCamera}
                        onChange={(e) => setNewCamera(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">Lens</span>
                      <input
                        type="text"
                        value={newLens}
                        onChange={(e) => setNewLens(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">Aperture</span>
                      <input
                        type="text"
                        value={newAperture}
                        onChange={(e) => setNewAperture(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">Focal Length</span>
                      <input
                        type="text"
                        value={newFocalLength}
                        onChange={(e) => setNewFocalLength(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">Shutter Speed</span>
                      <input
                        type="text"
                        value={newShutterSpeed}
                        onChange={(e) => setNewShutterSpeed(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 font-mono mb-1">ISO Sensitivity</span>
                      <input
                        type="text"
                        value={newIso}
                        onChange={(e) => setNewIso(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
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
                    placeholder="Description of the light, stone texture, architectural geometry, and method..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600 resize-none"
                  />
                </div>

                {/* Print Editions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Edition Cap (Total Prints in Edition)
                    </label>
                    <input
                      type="number"
                      value={newTotalEditions}
                      onChange={(e) => setNewTotalEditions(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Starting Price (INR - ₹)
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-md cursor-pointer"
                  >
                    Save &amp; Publish Plate to Live Gallery Archive
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: LOCKING SYSTEM & ACCESS CONTROL */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Header */}
              <div className="border-b border-neutral-800 pb-5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif text-white font-normal">Dashboard &amp; Library Locking System</h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-900/60">
                    PROTECTED
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Configure passcodes, automated session locking, and stealth routes to ensure your CMS and library remain completely secure.
                </p>
              </div>

              {/* Action: Lock Console & Complete Logout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-serif text-white font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Instant Session Lock</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light">
                      Lock the Studio Console and Media Library immediately. Anyone attempting to view this page will face the PIN keypad gate.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={security.lock}
                    className="self-start px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 shadow-md flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Console</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-serif text-white font-medium flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Complete Secure Logout</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light">
                      Terminates administrator session, deletes local verification keys and session cache, and securely redirects to Home.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSecureLogout}
                    className="self-start px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 shadow-md flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout &amp; Return to Home</span>
                  </button>
                </div>
              </div>

              {/* Grid: Change PIN & Auto-Lock Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel 1: Change Master PIN */}
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-serif text-white">Change Master Passcode / PIN</h3>
                      <p className="text-[11px] font-mono text-neutral-500">Configure custom studio security passcode</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePinSubmit} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Current PIN</label>
                      <input
                        type="password"
                        required
                        value={currentPinInput}
                        onChange={(e) => setCurrentPinInput(e.target.value)}
                        placeholder="Enter current PIN"
                        className="w-full px-3 py-2 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">New PIN (4+ digits)</label>
                      <input
                        type="password"
                        required
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="Enter new PIN"
                        className="w-full px-3 py-2 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">Confirm New PIN</label>
                      <input
                        type="password"
                        required
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Re-enter new PIN"
                        className="w-full px-3 py-2 text-xs bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 font-mono"
                      />
                    </div>

                    {pinChangeStatus && (
                      <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                        pinChangeStatus.type === 'success' 
                          ? 'bg-emerald-950/60 border border-emerald-900/60 text-emerald-300' 
                          : 'bg-rose-950/60 border border-rose-900/60 text-rose-300'
                      }`}>
                        {pinChangeStatus.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0" /> : <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
                        <span>{pinChangeStatus.message}</span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Update PIN
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          security.resetToDefaultPin();
                          setPinChangeStatus({ type: 'success', message: 'Restored studio default PIN' });
                        }}
                        className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
                      >
                        Restore Default PIN
                      </button>
                    </div>
                  </form>
                </div>

                {/* Panel 2: Auto-Lock & Session Settings */}
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-serif text-white">Auto-Lock Inactivity Timer</h3>
                      <p className="text-[11px] font-mono text-neutral-500">Locks automatically when idle</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Choose how quickly your session automatically locks if you step away from your workstation.
                  </p>

                  <div className="space-y-2 pt-1">
                    {[
                      { val: 0, label: 'Immediate (Locks upon closing tab or page exit)' },
                      { val: 5, label: '5 Minutes of inactivity' },
                      { val: 15, label: '15 Minutes of inactivity (Recommended)' },
                      { val: 30, label: '30 Minutes of inactivity' },
                      { val: -1, label: 'Manual Only (Never auto-lock during session)' }
                    ].map((option) => (
                      <label
                        key={option.val}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors text-xs font-mono ${
                          security.autoLockMinutes === option.val
                            ? 'bg-neutral-900 border-neutral-600 text-white'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="autoLockTimeout"
                          checked={security.autoLockMinutes === option.val}
                          onChange={() => security.setAutoLockMinutes(option.val)}
                          className="accent-white"
                        />
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Stealth & Concealment Reference */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-white">How the Console is Hidden from Visitors</h3>
                    <p className="text-[11px] font-mono text-neutral-500">Stealth access methods</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                    <div className="font-mono text-emerald-400 uppercase text-[10px]">Method 1</div>
                    <div className="font-serif text-white text-sm">Keyboard Shortcut</div>
                    <p className="text-neutral-400 font-light text-[11px] leading-relaxed">
                      Press <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-200">Shift + A</kbd> anywhere on your site to open the console.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                    <div className="font-mono text-amber-400 uppercase text-[10px]">Method 2</div>
                    <div className="font-serif text-white text-sm">Secret URL Route</div>
                    <p className="text-neutral-400 font-light text-[11px] leading-relaxed">
                      Navigate to <code className="text-neutral-200 bg-neutral-800 px-1 rounded">#/studio</code> or <code className="text-neutral-200 bg-neutral-800 px-1 rounded">#/admin</code> in the address bar.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                    <div className="font-mono text-blue-400 uppercase text-[10px]">Method 3</div>
                    <div className="font-serif text-white text-sm">Stealth Footer Click</div>
                    <p className="text-neutral-400 font-light text-[11px] leading-relaxed">
                      Click directly on the small <code className="text-neutral-200 bg-neutral-800 px-1 rounded">&copy;</code> copyright glyph in the footer.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CODE FILE ARCHITECTURE & CONTENT MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'code' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-neutral-800 pb-5">
                <h1 className="text-2xl font-serif text-white font-normal">Content Management &amp; Code Architecture</h1>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Complete guide to where About, Inquiries, Monographs, and Photographs live in the repository.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">1. Photographs &amp; Curatorial Metadata</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-2 py-0.5 rounded">/src/data/portfolioData.ts</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Contains the <code className="text-neutral-300">PHOTOGRAPHS</code> array. Add or edit any plate directly here.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">2. Image Asset Files</div>
                  <div className="text-neutral-300">Directory: <span className="text-white bg-neutral-900 px-2 py-0.5 rounded">/src/assets/images/</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Save your full-resolution photograph files in this folder and reference them as <code className="text-neutral-300">/src/assets/images/filename.jpg</code>.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">3. About &amp; Artist Manifesto</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-2 py-0.5 rounded">/src/pages/AboutPage.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Controls the biography, manifesto quote, darkroom specifications, and studio addresses in New Delhi and London.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">4. Curatorial Inquiries &amp; Representation</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-2 py-0.5 rounded">/src/pages/InquirePage.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Controls the contact dispatch form, studio email addresses, and gallery representation.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">5. Exhibitions &amp; Monograph Volumes</div>
                  <div className="text-neutral-300">File: <span className="text-white bg-neutral-900 px-2 py-0.5 rounded">/src/pages/ExhibitionsPage.tsx</span></div>
                  <div className="text-neutral-500 font-sans text-xs">
                    Controls the institutional exhibitions timeline, museum permanent collections list, and published books.
                  </div>
                </div>
              </div>

              {/* Copy data button */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Copy current active plates as formatted JSON:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-mono rounded-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied JSON!' : 'Copy Plates JSON'}</span>
                </button>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
