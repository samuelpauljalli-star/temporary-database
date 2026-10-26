import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Search, ExternalLink, Loader2 } from 'lucide-react';
import { RAW_MANUAL_FILES } from '../data/databaseData';

export const RawFileViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState(RAW_MANUAL_FILES[0].id);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentMeta = RAW_MANUAL_FILES.find((f) => f.id === selectedFileId) || RAW_MANUAL_FILES[0];

  useEffect(() => {
    setLoading(true);
    const cleanPath = currentMeta.path.replace(/^\//, '');
    const fullPath = import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL}${cleanPath}` : currentMeta.path;
    fetch(fullPath)
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then((txt) => {
        setContent(txt);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching raw manual:', err);
        setContent('Error loading source manual file.');
        setLoading(false);
      });
  }, [selectedFileId, currentMeta.path]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentMeta.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLines = searchFilter
    ? content.split('\n').filter((l) => l.toLowerCase().includes(searchFilter.toLowerCase()))
    : content.split('\n');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[740px]">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Original Lab Manuals (Full Text Repository)
            </h2>
            <p className="text-xs text-slate-400">
              Complete, unedited raw manual files provided for open reference
            </p>
          </div>
        </div>

        {/* File Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {RAW_MANUAL_FILES.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFileId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFileId === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-950/70 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`Search within ${currentMeta.filename}...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Manual!' : 'Copy Entire Manual'}</span>
          </button>
        </div>
      </div>

      {/* Text Viewer */}
      <div className="flex-1 bg-slate-950 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed">
        {loading ? (
          <div className="h-full flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading manual content...</span>
          </div>
        ) : searchFilter ? (
          <div className="space-y-1">
            <div className="text-[11px] text-emerald-400 mb-3 bg-emerald-950/40 border border-emerald-900/40 p-2 rounded-lg">
              Showing {filteredLines.length} matched lines for &ldquo;{searchFilter}&rdquo;
            </div>
            {filteredLines.map((line, idx) => (
              <div key={idx} className="hover:bg-slate-900/80 px-2 py-0.5 rounded">
                <span className="text-slate-600 mr-3 select-none text-[10px]">{idx + 1}</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap select-text">{content}</pre>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px] text-slate-400">
          Source: {currentMeta.path} ({currentMeta.size})
        </span>
        <span className="text-[11px] text-slate-500">
          {content.split('\n').length} Total Lines
        </span>
      </div>
    </div>
  );
};
