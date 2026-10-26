import React, { useState } from 'react';
import {
  X,
  Github,
  Cloud,
  Check,
  Copy,
  ExternalLink,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'render' | 'github'>('render');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Deploy to GitHub &amp; Render Guide</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Fixed for Production
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Fix for blank screen / missing output when deploying on GitHub or Render
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

        {/* Tab Selector */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-5 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('render')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'render'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Deploy to Render.com</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Deploy to GitHub Pages</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1">
          {/* Explanation Alert: Why did the previous deployment fail? */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-900/50 rounded-xl space-y-1.5 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Why your previous deployment didn&apos;t show the website:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
              <li>
                <strong>Missing Relative Base Path:</strong> Vite builds default to root <code className="text-amber-300">/</code>, which causes 404 &quot;Failed to load resource&quot; on subpaths like GitHub Pages. We added <code className="text-amber-300">base: &apos;./&apos;</code> to <code className="text-slate-200">vite.config.ts</code>.
              </li>
              <li>
                <strong>Missing Production Start Script on Render:</strong> If deployed on Render as a Web Service, Render runs <code className="text-amber-300">npm start</code>. We added <code className="text-slate-200">server.js</code> and configured <code className="text-amber-300">&quot;start&quot;: &quot;node server.js&quot;</code> in <code className="text-slate-200">package.json</code>!
              </li>
            </ul>
          </div>

          {activeTab === 'render' ? (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Option A: Deploy to Render as a Static Site (Recommended &amp; Free)</span>
              </h4>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300 block">Step 1: Go to Render Dashboard</span>
                  <p className="text-slate-400 text-[11px]">
                    Log in to <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">dashboard.render.com</a> and click <strong>New +</strong> &rarr; <strong>Static Site</strong>. Connect your GitHub repository.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Build Command:</span>
                    <div className="flex items-center justify-between mt-1 font-mono text-emerald-400">
                      <span>npm run build</span>
                      <button
                        onClick={() => copyToClipboard('npm run build', 'render-build')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedKey === 'render-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Publish Directory:</span>
                    <div className="flex items-center justify-between mt-1 font-mono text-emerald-400">
                      <span>dist</span>
                      <button
                        onClick={() => copyToClipboard('dist', 'render-dist')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedKey === 'render-dist' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-sm text-white pt-2">
                <span>Option B: Deploy to Render as a Web Service (Node.js)</span>
              </h4>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">
                  If you selected <strong>Web Service</strong> instead of Static Site on Render:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Build Command:</span>
                    <div className="flex items-center justify-between mt-1 font-mono text-emerald-400">
                      <span>npm install && npm run build</span>
                      <button
                        onClick={() => copyToClipboard('npm install && npm run build', 'render-ws-build')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedKey === 'render-ws-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Start Command:</span>
                    <div className="flex items-center justify-between mt-1 font-mono text-emerald-400">
                      <span>npm start</span>
                      <button
                        onClick={() => copyToClipboard('npm start', 'render-ws-start')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedKey === 'render-ws-start' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Our <code className="text-blue-400">server.js</code> is already configured and will automatically serve the built site on port 3000!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">
                Deploying to GitHub Pages (2 Simple Methods)
              </h4>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block text-xs">
                  Method 1: Automatic via GitHub Actions (We already generated the workflow!)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                  <li>Push your code to your GitHub repository.</li>
                  <li>In your GitHub repo, go to <strong>Settings</strong> &rarr; <strong>Pages</strong>.</li>
                  <li>Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.</li>
                  <li>GitHub Actions will automatically run <code className="text-blue-400">.github/workflows/deploy.yml</code> and publish your website!</li>
                </ol>
              </div>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block text-xs">
                  Method 2: Quick Local Build &amp; Push to gh-pages Branch
                </span>
                <p className="text-slate-400 text-[11px]">
                  Run these commands in your project terminal:
                </p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>npm run build &amp;&amp; npx gh-pages -d dist</span>
                  <button
                    onClick={() => copyToClipboard('npm run build && npx gh-pages -d dist', 'gh-cmd')}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    {copiedKey === 'gh-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Build Verification */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Project builds successfully with <code className="text-blue-400 font-mono">npm run build</code> into <code className="text-blue-400 font-mono">dist/</code></span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Vite + React 19</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Remember: Website passcode is <strong>20082007</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
