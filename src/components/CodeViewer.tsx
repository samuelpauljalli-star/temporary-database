import React, { useState } from 'react';
import { Check, Copy, Download, Maximize2, Minimize2, FileCode, Terminal, ZoomIn, ZoomOut } from 'lucide-react';
import { CodeFile } from '../data/databaseData';

interface CodeViewerProps {
  files: CodeFile[];
  title: string;
  commands?: string[];
  steps?: string[];
  outputDescription?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  files,
  title,
  commands,
  steps,
  outputDescription
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentFile = files[activeFileIndex] || files[0];

  const handleCopyCode = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = currentFile.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Extract base filename if path exists
    const cleanName = currentFile.filename.replace(/^[\\/]+/, '').replace(/[/\\]/g, '_');
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = currentFile ? currentFile.code.split('\n') : [];

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all flex flex-col ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl bg-slate-900/98 backdrop-blur-md'
          : 'relative my-3'
      }`}
    >
      {/* Top File Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {files.map((file, idx) => (
            <button
              key={file.filename}
              onClick={() => setActiveFileIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                idx === activeFileIndex
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{file.filename}</span>
              <span className="text-[10px] text-slate-500 uppercase">({file.language})</span>
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Font Resizer */}
          <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900/60 p-0.5 text-slate-400">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="p-1 hover:text-white rounded"
              title="Decrease font size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(18, s + 1))}
              className="p-1 hover:text-white rounded"
              title="Increase font size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download File */}
          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
            title="Download source file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* 1-Click Copy Code Button */}
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-95'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="relative flex-1 overflow-auto max-h-[480px] bg-slate-950 font-mono text-slate-200">
        <div className="flex text-xs leading-relaxed">
          {/* Line Numbers Column */}
          <div className="select-none py-3 pl-3 pr-3 text-right text-slate-600 bg-slate-950/90 border-r border-slate-800/80 shrink-0 font-mono text-[11px]">
            {lines.map((_, i) => (
              <div key={i} style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Body */}
          <pre
            className="p-3 overflow-x-auto flex-1 font-mono text-slate-200 selection:bg-blue-600 selection:text-white"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
          >
            <code>{currentFile ? currentFile.code : '// No code available'}</code>
          </pre>
        </div>
      </div>

      {/* Commands / Execution Bar if available */}
      {commands && commands.length > 0 && (
        <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono overflow-x-auto scrollbar-none py-0.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-500 font-sans text-[11px] uppercase tracking-wider font-semibold shrink-0">
              Run:
            </span>
            {commands.map((cmd, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 select-all"
              >
                {cmd}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(commands.join(' && '));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-mono shrink-0 hover:underline"
          >
            Copy commands
          </button>
        </div>
      )}

      {/* Output preview footer if provided */}
      {outputDescription && (
        <div className="bg-slate-900/60 border-t border-slate-800/50 px-4 py-2 text-xs text-slate-400 flex items-start gap-2">
          <span className="font-semibold text-emerald-400 shrink-0 font-mono">Output:</span>
          <span className="line-clamp-2">{outputDescription}</span>
        </div>
      )}
    </div>
  );
};
