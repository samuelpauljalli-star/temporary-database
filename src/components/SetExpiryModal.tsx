import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle, Timer, Trash2, Check } from 'lucide-react';
import { Experiment, TTL_PRESETS } from '../data/databaseData';

interface SetExpiryModalProps {
  isOpen: boolean;
  experiment: Experiment | null;
  onClose: () => void;
  onUpdateExpiry: (id: string, expiresAt: number | undefined, isTemporary: boolean) => void;
}

export const SetExpiryModal: React.FC<SetExpiryModalProps> = ({
  isOpen,
  experiment,
  onClose,
  onUpdateExpiry,
}) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(1); // 5 min
  const [customDateTime, setCustomDateTime] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  if (!isOpen || !experiment) return null;

  const handleApplyPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    const preset = TTL_PRESETS[idx];
    if (!preset.isCustom) {
      const expiresAt = Date.now() + preset.durationMs;
      onUpdateExpiry(experiment.id, expiresAt, true);
      onClose();
    }
  };

  const handleApplyCustom = () => {
    const expiresAt = new Date(customDateTime).getTime();
    if (isNaN(expiresAt) || expiresAt <= Date.now()) {
      alert('Please select a future date and time.');
      return;
    }
    onUpdateExpiry(experiment.id, expiresAt, true);
    onClose();
  };

  const handleMakePermanent = () => {
    onUpdateExpiry(experiment.id, undefined, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Set File Expiration Timer</h3>
              <p className="text-xs text-slate-400 truncate max-w-[260px]">
                {experiment.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-300">
            Set how much time this file will be stored and visible. Once the timer completes, it will automatically disappear from the page.
          </p>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Preset Durations:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {TTL_PRESETS.filter((p) => !p.isCustom).map((preset, idx) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className="px-3 py-2 bg-slate-950 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 border border-slate-800 rounded-lg text-slate-300 transition-colors text-left font-medium cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Or Set Exact Date &amp; Time Till Disappearance:</span>
            </label>
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleApplyCustom}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Set Custom Expiry Date &amp; Time
            </button>
          </div>

          {/* Permanent button if currently temporary */}
          {experiment.isTemporary && (
            <button
              type="button"
              onClick={handleMakePermanent}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer text-center"
            >
              Remove Timer (Keep Permanently)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
