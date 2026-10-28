import React, { useState } from 'react';
import {
  X,
  Plus,
  Upload,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Timer,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Experiment, TTL_PRESETS } from '../data/databaseData';

interface AddCustomExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (exp: Experiment) => void;
}

export const AddCustomExperimentModal: React.FC<AddCustomExperimentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('Temporary Database');
  const [category, setCategory] = useState('Text File');
  const [description, setDescription] = useState('');
  const [filename, setFilename] = useState('notes.txt');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'dart' | 'html' | 'css' | 'json' | 'shell'>('javascript');
  const [commands, setCommands] = useState('');
  const [error, setError] = useState('');

  // Expiration / Temporary Database settings
  const [isTemporary, setIsTemporary] = useState(true);
  const [selectedTtlIdx, setSelectedTtlIdx] = useState(1); // Default to 5 minutes
  const [customDateTime, setCustomDateTime] = useState(() => {
    // Default custom to 1 hour from now
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    if (file.name.endsWith('.dart')) setLanguage('dart');
    else if (file.name.endsWith('.c') || file.name.endsWith('.cpp') || file.name.endsWith('.h')) setLanguage('c' as any);
    else if (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.ts')) setLanguage('javascript');
    else if (file.name.endsWith('.html') || file.name.endsWith('.ejs')) setLanguage('html');
    else if (file.name.endsWith('.css') || file.name.endsWith('.scss')) setLanguage('css');
    else if (file.name.endsWith('.json')) setLanguage('json');
    else setLanguage('shell');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCode(text || '');
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const calculateExpiresAt = (): number | undefined => {
    if (!isTemporary) return undefined;
    const preset = TTL_PRESETS[selectedTtlIdx];
    if (preset.isCustom) {
      const customTimestamp = new Date(customDateTime).getTime();
      return isNaN(customTimestamp) ? Date.now() + 60 * 60 * 1000 : customTimestamp;
    }
    return Date.now() + preset.durationMs;
  };

  const getExpirationSummary = () => {
    if (!isTemporary) return 'Stored permanently (until manually removed)';
    const preset = TTL_PRESETS[selectedTtlIdx];
    if (preset.isCustom) {
      const d = new Date(customDateTime);
      return `Disappears on ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    const future = new Date(Date.now() + preset.durationMs);
    return `Visible for ${preset.label} · Disappears at ${future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      setError('File title and text content are required.');
      return;
    }

    const expiresAt = calculateExpiresAt();
    if (isTemporary && expiresAt && expiresAt <= Date.now()) {
      setError('Expiration date/time must be in the future.');
      return;
    }

    const newExperiment: Experiment = {
      id: `temp-${Date.now()}`,
      subject: isTemporary ? 'temporary' : 'custom',
      subjectTitle: isTemporary ? 'Temporary Database' : (subjectTitle || 'Custom Upload'),
      labNumber: isTemporary ? 'Temporary File' : 'Custom Entry',
      title: title.trim(),
      category: category.trim() || 'Text Document',
      description: description.trim() || (isTemporary ? 'Auto-expiring temporary file' : 'Custom text file'),
      commands: commands.trim() ? commands.split('\n').map((c) => c.trim()) : [],
      files: [
        {
          filename: filename.trim() || 'file.txt',
          language,
          code: code.trim(),
        },
      ],
      outputDescription: isTemporary
        ? `Temporary file scheduled to disappear at ${expiresAt ? new Date(expiresAt).toLocaleTimeString() : 'specified time'}.`
        : 'Saved custom file in text format.',
      voiceExplanation: `Temporary file: ${title}. ${description}`,
      isTemporary,
      expiresAt,
      createdAt: Date.now(),
    };

    onAdd(newExperiment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Add Text File &amp; Store in Temporary Database</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Auto-Disappearing
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Save text files with custom storage duration or exact expiration date &amp; time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TEMPORARY DATABASE TIMER CONFIGURATION SECTION */}
          <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">Temporary Database Storage Options</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTemporary}
                  onChange={(e) => setIsTemporary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span className="text-amber-400 font-medium">Enable Auto-Disappearance</span>
              </label>
            </div>

            {isTemporary ? (
              <div className="space-y-3 pt-1">
                <p className="text-slate-400 text-[11px]">
                  Choose how much time this file will be able to store in the page. After completion of the time, the file will automatically disappear.
                </p>

                {/* Preset Duration Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {TTL_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedTtlIdx(idx)}
                      className={`px-2.5 py-2 rounded-lg font-medium text-[11px] transition-all text-left border cursor-pointer ${
                        selectedTtlIdx === idx
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date & Time Picker */}
                {TTL_PRESETS[selectedTtlIdx].isCustom && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 animate-fadeIn">
                    <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Set Exact Date &amp; Time Till File Disappears:</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={customDateTime}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                )}

                {/* Dynamic Summary Banner */}
                <div className="p-2.5 bg-amber-950/30 border border-amber-900/40 rounded-lg flex items-center gap-2 text-amber-300/90 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono">{getExpirationSummary()}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-[11px]">
                Auto-disappearance disabled. File will stay permanently in your database.
              </p>
            )}
          </div>

          {/* Quick File Import Button */}
          <div className="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Select any text file (.txt, .js, .dart, .html, .json) to import</span>
            </div>
            <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer font-medium">
              <span>Browse File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">File Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Express Lab Code / Notes"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category / Tag</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Temporary Notes, Express, React, Dart"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g. temp_program.js"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="c">C / C++</option>
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="dart">Dart / Flutter</option>
                <option value="html">HTML / EJS</option>
                <option value="css">CSS / Sass</option>
                <option value="json">JSON</option>
                <option value="shell">Shell / Text</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description / Memo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about this file..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-300">
                File Content as Text Format *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {code ? `${code.length} chars · ${code.split('\n').length} lines` : 'Empty'}
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or type your code, lab experiment, or text file content here in text format..."
              rows={8}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-blue-500 leading-relaxed text-xs"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save to {isTemporary ? 'Temporary Database' : 'Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
