import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface LoginGateProps {
  onUnlock: () => void;
}

const REQUIRED_PASS = '20082007';

export const LoginGate: React.FC<LoginGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [shake, setShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setError(true);
      setErrorMessage('Please enter the access password');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      if (password === REQUIRED_PASS) {
        if (rememberMe) {
          localStorage.setItem('devvault_auth', 'authenticated_20082007');
        }
        setError(false);
        onUnlock();
      } else {
        setError(true);
        setErrorMessage('Incorrect password. Access denied.');
        triggerShake();
        setIsVerifying(false);
      }
    }, 300);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleKeypadPress = (val: string) => {
    setError(false);
    if (val === 'backspace') {
      setPassword(prev => prev.slice(0, -1));
    } else if (val === 'clear') {
      setPassword('');
    } else {
      if (password.length < 16) {
        setPassword(prev => prev + val);
      }
    }
  };

  const handleFillDemo = () => {
    setPassword(REQUIRED_PASS);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative transition-all duration-300 ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Open Database Access
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Protected repository for FSD-2 &amp; Flutter lab experiments
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Security Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password (e.g. 20082007)"
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono text-center tracking-widest text-lg ${
                  error
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Keypad */}
          <div className="pt-2">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'C') handleKeypadPress('clear');
                    else if (item === '⌫') handleKeypadPress('backspace');
                    else handleKeypadPress(item);
                  }}
                  className="py-2.5 bg-slate-800/60 hover:bg-slate-800 active:bg-blue-600/30 text-slate-200 font-medium rounded-lg text-sm transition-colors border border-slate-800/80 hover:border-slate-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-0"
              />
              <span>Remember login</span>
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fill 20082007</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Unlocking Database...
              </span>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Open Database</span>
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Passcode Protected</span>
          </div>
          <span className="font-mono text-slate-400">Password: 20082007</span>
        </div>
      </div>
    </div>
  );
};
