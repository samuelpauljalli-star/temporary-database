import React, { useState, useEffect } from 'react';
import {
  Database,
  Mic,
  FileText,
  Search,
  Lock,
  Plus,
  Code2,
  Clock,
  Timer,
  AlertCircle,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  Share2,
  Calendar,
  Sparkles,
  Trash2,
  RotateCcw,
  Cloud,
  Github
} from 'lucide-react';
import {
  INITIAL_EXPERIMENTS,
  Experiment,
  LAB_SUBJECTS,
  formatRemainingTime
} from './data/databaseData';
import { LoginGate } from './components/LoginGate';
import { CodeViewer } from './components/CodeViewer';
import { VoiceStudio } from './components/VoiceStudio';
import { RawFileViewer } from './components/RawFileViewer';
import { AddCustomExperimentModal } from './components/AddCustomExperimentModal';
import { SetExpiryModal } from './components/SetExpiryModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';

export default function App() {
  // Authentication State (Password is 20082007)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('devvault_auth') === 'authenticated_20082007';
    } catch {
      return false;
    }
  });

  // Main Navigation View: Database, Temporary Database, Voice Studio, Full Raw Files
  const [activeView, setActiveView] = useState<'database' | 'temporary' | 'voice' | 'raw'>('database');

  // Real-time ticking clock for exact countdown updates every second
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Database State
  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    try {
      const stored = localStorage.getItem('devvault_custom_experiments');
      if (stored) {
        const parsed: Experiment[] = JSON.parse(stored);
        // Filter out any already expired files on initial load
        const now = Date.now();
        const nonExpired = parsed.filter(
          (e) => !e.isTemporary || !e.expiresAt || e.expiresAt > now
        );
        return [...INITIAL_EXPERIMENTS, ...nonExpired];
      }
    } catch {}
    return INITIAL_EXPERIMENTS;
  });

  // Track disappeared files count for user feedback
  const [disappearedCount, setDisappearedCount] = useState<number>(() => {
    try {
      const cnt = localStorage.getItem('devvault_disappeared_count');
      return cnt ? Number(cnt) : 0;
    } catch {
      return 0;
    }
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedExpId, setExpandedExpId] = useState<string | null>('fsd-1a');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const favs = localStorage.getItem('devvault_favorites');
      return favs ? JSON.parse(favs) : ['fsd-1a', 'flutter-2b'];
    } catch {
      return ['fsd-1a', 'flutter-2b'];
    }
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [expiryModalExp, setExpiryModalExp] = useState<Experiment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // TICK INTERVAL: Check every second and auto-remove expired temporary files
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Check if any temporary file has reached its expiration time
      setExperiments((prevExps) => {
        let hasExpired = false;
        let countExpired = 0;

        const filtered = prevExps.filter((exp) => {
          if (exp.isTemporary && exp.expiresAt && exp.expiresAt <= now) {
            hasExpired = true;
            countExpired += 1;
            return false; // Automatically disappears from database!
          }
          return true;
        });

        if (hasExpired) {
          // Update persistent storage for custom / temporary items
          try {
            const customRemaining = filtered.filter(
              (e) => e.subject === 'custom' || e.subject === 'temporary' || e.isTemporary
            );
            localStorage.setItem('devvault_custom_experiments', JSON.stringify(customRemaining));
          } catch {}

          setDisappearedCount((c) => {
            const newC = c + countExpired;
            localStorage.setItem('devvault_disappeared_count', String(newC));
            return newC;
          });

          setToastMessage(
            `⏳ ${countExpired} temporary file(s) reached expiration time and disappeared from the page.`
          );
          setTimeout(() => setToastMessage(null), 4000);
        }

        return hasExpired ? filtered : prevExps;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('devvault_favorites', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('devvault_auth');
    setIsAuthenticated(false);
  };

  const handleAddExperiment = (newExp: Experiment) => {
    const updated = [newExp, ...experiments];
    setExperiments(updated);
    setExpandedExpId(newExp.id);

    try {
      const customExps = updated.filter(
        (e) => e.subject === 'custom' || e.subject === 'temporary' || e.isTemporary
      );
      localStorage.setItem('devvault_custom_experiments', JSON.stringify(customExps));
    } catch {}

    const expiryInfo = newExp.expiresAt
      ? `Disappears in ${formatRemainingTime(newExp.expiresAt)}`
      : 'Stored in database';

    setToastMessage(`Saved "${newExp.title}" to Temporary Database! (${expiryInfo})`);
    setTimeout(() => setToastMessage(null), 3500);

    if (newExp.isTemporary) {
      setActiveView('temporary');
    }
  };

  const handleUpdateExpiry = (
    id: string,
    expiresAt: number | undefined,
    isTemporary: boolean
  ) => {
    const updated = experiments.map((exp) => {
      if (exp.id === id) {
        return {
          ...exp,
          isTemporary,
          expiresAt,
          subject: isTemporary ? 'temporary' as const : exp.subject,
        };
      }
      return exp;
    });

    setExperiments(updated);

    try {
      const customExps = updated.filter(
        (e) => e.subject === 'custom' || e.subject === 'temporary' || e.isTemporary
      );
      localStorage.setItem('devvault_custom_experiments', JSON.stringify(customExps));
    } catch {}

    const text = isTemporary && expiresAt
      ? `Expiration timer set! Disappears at ${new Date(expiresAt).toLocaleTimeString()}`
      : 'Expiration timer removed. File will remain permanently.';
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExtendTime = (exp: Experiment, extraMs: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const base = exp.expiresAt && exp.expiresAt > currentTime ? exp.expiresAt : currentTime;
    const newExpiresAt = base + extraMs;
    handleUpdateExpiry(exp.id, newExpiresAt, true);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this file immediately?')) return;
    const updated = experiments.filter((e) => e.id !== id);
    setExperiments(updated);
    try {
      const customExps = updated.filter(
        (e) => e.subject === 'custom' || e.subject === 'temporary' || e.isTemporary
      );
      localStorage.setItem('devvault_custom_experiments', JSON.stringify(customExps));
    } catch {}
    setToastMessage('File removed from database.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter experiments based on view & search
  const displayedExperiments = experiments.filter((exp) => {
    if (activeView === 'temporary') {
      if (!exp.isTemporary && exp.subject !== 'temporary') return false;
    } else {
      if (selectedSubject === 'temporary') {
        if (!exp.isTemporary && exp.subject !== 'temporary') return false;
      } else if (selectedSubject !== 'all' && exp.subject !== selectedSubject) {
        return false;
      }
    }

    if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = exp.title.toLowerCase().includes(q);
      const inCat = exp.category.toLowerCase().includes(q);
      const inDesc = exp.description.toLowerCase().includes(q);
      const inLab = exp.labNumber.toLowerCase().includes(q);
      const inCode = exp.files.some(
        (f) => f.filename.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
      );
      return inTitle || inCat || inDesc || inLab || inCode;
    }
    return true;
  });

  const temporaryItemsCount = experiments.filter((e) => e.isTemporary || e.subject === 'temporary').length;

  // Distinct categories
  const currentCategories = Array.from(
    new Set(
      experiments
        .filter((e) => {
          if (activeView === 'temporary' || selectedSubject === 'temporary') {
            return e.isTemporary || e.subject === 'temporary';
          }
          return selectedSubject === 'all' || e.subject === selectedSubject;
        })
        .map((e) => e.category)
    )
  );

  const selectedExpForVoice = experiments.find((e) => e.id === expandedExpId) || experiments[0];

  const handleVoiceSearch = (voiceQuery: string) => {
    setSearchQuery(voiceQuery);
    setActiveView('database');
  };

  if (!isAuthenticated) {
    return <LoginGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn max-w-md">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">DevVault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>Temporary Database Active</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-Disappearing Text Files · FSD-2, Flutter &amp; CN Code · Voice in Text Format
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveView('database');
                setSelectedSubject('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'database'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>All Files</span>
              <span className="text-[10px] opacity-70">({experiments.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveView('temporary');
                setSelectedSubject('temporary');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'temporary'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Temporary Database</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                {temporaryItemsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveView('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'voice'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice &amp; Text</span>
            </button>

            <button
              onClick={() => setActiveView('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeView === 'raw'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lab Manuals</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded-lg text-xs font-medium border border-blue-500/30 transition-colors cursor-pointer"
              title="GitHub & Render Deployment Instructions"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Deploy Guide</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Temporary File</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Lock Database (Password: 20082007 required)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TEMPORARY DATABASE BANNER: Shows countdown and auto-disappearance status */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Timer className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Temporary Auto-Disappearing Database
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Add any file in text format and set how much time or exact date &amp; time it can stay in the page. Once the time is completed, the file will automatically disappear from the website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Temporary Files: <strong className="text-amber-400 font-mono">{temporaryItemsCount}</strong></span>
            </div>

            {disappearedCount > 0 && (
              <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Disappeared So Far: <strong className="text-white font-mono">{disappearedCount}</strong></span>
              </div>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              + Add Text File
            </button>
          </div>
        </div>

        {/* View Switching */}
        {activeView === 'voice' && (
          <VoiceStudio
            currentExperiment={selectedExpForVoice}
            onVoiceSearchQuery={handleVoiceSearch}
          />
        )}

        {activeView === 'raw' && <RawFileViewer />}

        {(activeView === 'database' || activeView === 'temporary') && (
          <div className="space-y-6">
            {/* Search & Subject Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by file name, code, title, or text content..."
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                  {/* Voice Search Icon */}
                  <button
                    onClick={() => setActiveView('voice')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Speak into microphone to search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add File (Text Format)</span>
                </button>
              </div>

              {/* Subject Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
                {LAB_SUBJECTS.map((sub) => {
                  let count = 0;
                  if (sub.id === 'all') count = experiments.length;
                  else if (sub.id === 'temporary') count = temporaryItemsCount;
                  else count = experiments.filter((e) => e.subject === sub.id).length;

                  const isSelected =
                    (activeView === 'temporary' && sub.id === 'temporary') ||
                    (activeView === 'database' && selectedSubject === sub.id);

                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (sub.id === 'temporary') {
                          setActiveView('temporary');
                          setSelectedSubject('temporary');
                        } else {
                          setActiveView('database');
                          setSelectedSubject(sub.id);
                        }
                        setSelectedCategory('all');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? sub.id === 'temporary'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className="ml-1.5 text-[10px] opacity-75 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Categories */}
              {currentCategories.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
                    Categories:
                  </span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-slate-800 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({displayedExperiments.length})
                  </button>
                  {currentCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-colors shrink-0 cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-slate-800 text-blue-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List Results Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing <strong className="text-white">{displayedExperiments.length}</strong> {activeView === 'temporary' ? 'temporary' : ''} files in database
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Session Password: 20082007
              </span>
            </div>

            {/* List of Files / Experiments */}
            {displayedExperiments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeView === 'temporary'
                    ? 'No temporary files active right now'
                    : 'No files found in database'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {activeView === 'temporary'
                    ? 'All previous temporary files have completed their time and automatically disappeared, or you haven\'t added any yet.'
                    : 'Try adjusting your search query or reset your filters.'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  + Add File as Text Format to Temporary Database
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedExperiments.map((exp) => {
                  const isExpanded = expandedExpId === exp.id;
                  const isFav = favorites.includes(exp.id);
                  const isExpiring = Boolean(exp.isTemporary && exp.expiresAt);
                  const remainingText = exp.expiresAt
                    ? formatRemainingTime(exp.expiresAt, currentTime)
                    : null;

                  return (
                    <article
                      key={exp.id}
                      className={`bg-slate-900 border rounded-2xl transition-all duration-200 overflow-hidden ${
                        isExpiring
                          ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/10 shadow-lg shadow-amber-950/20'
                          : isExpanded
                          ? 'border-blue-500/50 shadow-xl shadow-blue-950/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Card Header */}
                      <div
                        onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          {/* Subject & Expiration Status */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {/* Temporary Badge with Live Countdown */}
                            {isExpiring && (
                              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold animate-pulse">
                                <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{remainingText}</span>
                              </div>
                            )}

                            <span
                              className={`font-semibold font-mono text-[11px] px-2 py-0.5 rounded ${
                                exp.subject === 'fsd'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : exp.subject === 'flutter'
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                  : exp.subject === 'cn'
                                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              }`}
                            >
                              {exp.labNumber}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="font-medium text-slate-300">{exp.category}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-500">{exp.subjectTitle}</span>

                            {exp.expiresAt && (
                              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                                (Disappears: {new Date(exp.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                              </span>
                            )}
                          </div>

                          {/* File Title */}
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {exp.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                            {exp.description}
                          </p>
                        </div>

                        {/* Top-Right Action Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Set/Edit Expiry Timer Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpiryModalExp(exp);
                            }}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              exp.isTemporary
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                            }`}
                            title={exp.isTemporary ? 'Adjust expiration timer' : 'Set expiration timer on this file'}
                          >
                            <Timer className="w-4 h-4" />
                          </button>

                          {/* Star Favorite */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(exp.id, e)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isFav
                                ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                            }`}
                            title={isFav ? 'Starred' : 'Add to favorites'}
                          >
                            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Delete if custom or temporary */}
                          {(exp.subject === 'custom' || exp.subject === 'temporary' || exp.isTemporary) && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(exp.id, e)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Delete immediately"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Chevron */}
                          <div className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="border-t border-slate-800 p-4 sm:p-5 bg-slate-950/70 space-y-4 animate-fadeIn">
                          {/* Expiration Toolbar for Temporary File */}
                          {exp.isTemporary && exp.expiresAt && (
                            <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-200">
                                  Time Remaining: <strong className="font-mono text-amber-400">{formatRemainingTime(exp.expiresAt, currentTime)}</strong>
                                </span>
                                <span className="text-slate-500 hidden sm:inline">
                                  (Expires at {new Date(exp.expiresAt).toLocaleTimeString()})
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-[11px]">Extend:</span>
                                <button
                                  type="button"
                                  onClick={(e) => handleExtendTime(exp, 5 * 60 * 1000, e)}
                                  className="px-2 py-1 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 rounded text-amber-300 text-[11px] font-mono cursor-pointer"
                                >
                                  +5 Mins
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleExtendTime(exp, 60 * 60 * 1000, e)}
                                  className="px-2 py-1 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 rounded text-amber-300 text-[11px] font-mono cursor-pointer"
                                >
                                  +1 Hour
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpiryModalExp(exp);
                                  }}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[11px] cursor-pointer"
                                >
                                  Edit Timer
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Action Toolbar for Experiment */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-400">
                              <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                                Included File(s):
                              </span>
                              <span className="font-mono text-slate-300">
                                {exp.files.map((f) => f.filename).join(', ')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Open in Voice Studio */}
                              <button
                                onClick={() => setActiveView('voice')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-medium border border-indigo-500/30 transition-all cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Voice Reader</span>
                              </button>

                              {/* Copy All Code Shortcut */}
                              <button
                                onClick={async () => {
                                  const allCode = exp.files
                                    .map((f) => `// --- File: ${f.filename} ---\n${f.code}`)
                                    .join('\n\n');
                                  await navigator.clipboard.writeText(allCode);
                                  setToastMessage(`Copied all code for ${exp.title}!`);
                                  setTimeout(() => setToastMessage(null), 2500);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                              >
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </button>
                            </div>
                          </div>

                          {/* Code Viewer */}
                          <CodeViewer
                            files={exp.files}
                            title={exp.title}
                            commands={exp.commands}
                            steps={exp.steps}
                            outputDescription={exp.outputDescription}
                          />

                          {/* Objectives if present */}
                          {exp.objectives && exp.objectives.length > 0 && (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
                              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                                Key Learning Objectives:
                              </span>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                                {exp.objectives.map((obj, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-blue-400 shrink-0">✔</span>
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">DevVault Temporary &amp; Open Database</span>
            <span>·</span>
            <span>Passcode: 20082007</span>
            <span>·</span>
            <span>Auto-Disappearing Storage Active</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setActiveView('temporary');
                setSelectedSubject('temporary');
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Temporary Files ({temporaryItemsCount})
            </button>
            <button
              onClick={() => setActiveView('voice')}
              className="hover:text-white transition-colors"
            >
              Voice in Text Format
            </button>
            <button
              onClick={() => setActiveView('raw')}
              className="hover:text-white transition-colors"
            >
              Lab Manuals
            </button>
            <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
              Lock Session
            </button>
          </div>
        </div>
      </footer>

      {/* Add Custom/Temporary File Modal */}
      <AddCustomExperimentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddExperiment}
      />

      {/* Set Expiration Modal */}
      <SetExpiryModal
        isOpen={Boolean(expiryModalExp)}
        experiment={expiryModalExp}
        onClose={() => setExpiryModalExp(null)}
        onUpdateExpiry={handleUpdateExpiry}
      />

      {/* Deployment Guide Modal */}
      <DeploymentGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
