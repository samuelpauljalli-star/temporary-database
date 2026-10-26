import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Search,
  Sparkles,
  Download,
  Trash2,
  Sliders
} from 'lucide-react';
import { Experiment } from '../data/databaseData';

interface VoiceStudioProps {
  currentExperiment?: Experiment | null;
  onVoiceSearchQuery?: (query: string) => void;
  onInsertNote?: (text: string) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  currentExperiment,
  onVoiceSearchQuery,
  onInsertNote,
}) => {
  // Speech-to-Text (Voice -> Text Format)
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [textFormatType, setTextFormatType] = useState<'plain' | 'code-comment' | 'markdown' | 'numbered'>('plain');
  const [copiedText, setCopiedText] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Text-to-Speech (Text Format -> Voice Audio Reader)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Saved Transcripts
  const [savedTranscripts, setSavedTranscripts] = useState<
    Array<{ id: string; text: string; time: string; format: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('devvault_voice_transcripts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscribedText(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setRecognitionSupported(false);
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type directly in the box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const getFormattedText = (raw: string) => {
    if (!raw) return '';
    switch (textFormatType) {
      case 'code-comment':
        return raw
          .split('. ')
          .map((sentence) => `// ${sentence.trim()}`)
          .join('\n');
      case 'markdown':
        return `### 🎙️ Voice Notes\n\n> "${raw}"\n\n*Captured on: ${new Date().toLocaleTimeString()}*`;
      case 'numbered':
        return raw
          .split('. ')
          .filter(Boolean)
          .map((item, idx) => `${idx + 1}. ${item.trim()}`)
          .join('\n');
      case 'plain':
      default:
        return raw;
    }
  };

  const handleCopyFormatted = async () => {
    const formatted = getFormattedText(transcribedText);
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSaveTranscript = () => {
    const formatted = getFormattedText(transcribedText);
    if (!formatted) return;
    const newEntry = {
      id: Date.now().toString(),
      text: formatted,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      format: textFormatType,
    };
    const updated = [newEntry, ...savedTranscripts];
    setSavedTranscripts(updated);
    localStorage.setItem('devvault_voice_transcripts', JSON.stringify(updated));
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedTranscripts.filter((t) => t.id !== id);
    setSavedTranscripts(updated);
    localStorage.setItem('devvault_voice_transcripts', JSON.stringify(updated));
  };

  const handleDownloadTranscript = () => {
    const formatted = getFormattedText(transcribedText);
    if (!formatted) return;
    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Text-To-Speech Reader for Experiment
  const handleReadExperimentAloud = () => {
    if (!synthRef.current) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = currentExperiment
      ? `${currentExperiment.title}. Category: ${currentExperiment.category}. Description: ${
          currentExperiment.description
        }. ${
          currentExperiment.voiceExplanation || ''
        }. Step by step procedure: ${currentExperiment.steps ? currentExperiment.steps.join('. ') : ''}`
      : 'Select an experiment from the database to listen to its explanation and code commentary.';

    setActiveSpeechText(textToRead);

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    synthRef.current.cancel();
    synthRef.current.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Voice &amp; Text Studio
            </h2>
            <p className="text-xs text-slate-400">
              Convert spoken voice into text format, search with voice, or listen to audio readout
            </p>
          </div>
        </div>

        {/* Experiment Audio Reader Control */}
        {currentExperiment && (
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <button
              onClick={handleReadExperimentAloud}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Pause Voice' : 'Read Code Aloud'}</span>
            </button>

            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-1.5 py-1 focus:outline-none"
              title="Voice Speed"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Main: Live Voice-to-Text Dictation */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Recording Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-red-600/40 ring-4 ring-red-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
                title={isListening ? 'Stop recording voice' : 'Start speaking'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isListening ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    {isListening ? 'Listening... Speak into your microphone' : 'Microphone Ready'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Speeches are transcribed immediately into formatted text
                </p>
              </div>
            </div>

            {/* Format Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold px-1.5 uppercase">
                Format:
              </span>
              {(['plain', 'code-comment', 'markdown', 'numbered'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTextFormatType(fmt)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    textFormatType === fmt
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt === 'code-comment'
                    ? '// Comment'
                    : fmt === 'markdown'
                    ? 'Markdown'
                    : fmt === 'numbered'
                    ? '1. List'
                    : 'Plain'}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea displaying Transcribed Voice Text in Chosen Format */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl flex flex-col min-h-[220px]">
            <div className="bg-slate-900/60 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Transcribed Voice (Text Format):</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {transcribedText ? `${transcribedText.split(/\s+/).filter(Boolean).length} words` : '0 words'}
              </span>
            </div>

            <textarea
              value={getFormattedText(transcribedText)}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="Your spoken words will appear here in text format. Click the blue microphone button above to start speaking, or paste text directly..."
              className="flex-1 w-full p-4 bg-transparent font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
              rows={8}
            />

            {/* Action Bar for Transcribed Text */}
            <div className="bg-slate-900/80 border-t border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyFormatted}
                  disabled={!transcribedText}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied Text!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleSaveTranscript}
                  disabled={!transcribedText}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  Save Note
                </button>

                <button
                  onClick={handleDownloadTranscript}
                  disabled={!transcribedText}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg border border-slate-700 transition-colors"
                  title="Download as .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onVoiceSearchQuery && (
                  <button
                    onClick={() => {
                      if (transcribedText.trim()) {
                        onVoiceSearchQuery(transcribedText.trim());
                      }
                    }}
                    disabled={!transcribedText}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 font-medium cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Database with This</span>
                  </button>
                )}

                <button
                  onClick={() => setTranscribedText('')}
                  disabled={!transcribedText}
                  className="text-slate-500 hover:text-red-400 text-xs px-2 py-1 disabled:opacity-30"
                  title="Clear text"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Try saying:</span>
            {[
              'Express routing',
              'React hooks useState',
              'Flutter animations',
              'MongoDB aggregate',
              'Row and Column layouts',
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setTranscribedText(sample);
                  if (onVoiceSearchQuery) onVoiceSearchQuery(sample);
                }}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-md text-[11px] text-slate-300 shrink-0 hover:text-white"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Audio Transcript & Saved Notes */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Audio Readout Live Transcript */}
          {isPlayingAudio && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>Now Speaking:</span>
                </span>
                <span className="text-[10px] uppercase font-mono">{speechRate}x Speed</span>
              </div>
              <p className="text-xs text-slate-300 font-mono line-clamp-4 leading-relaxed bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                {activeSpeechText}
              </p>
            </div>
          )}

          {/* Saved Voice Transcripts History */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Saved Voice Notes ({savedTranscripts.length})
              </span>
            </div>

            {savedTranscripts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
                <p>No saved notes yet.</p>
                <p className="text-[11px] mt-1 text-slate-600">
                  Speak and tap &quot;Save Note&quot; to keep voice notes here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
                {savedTranscripts.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{item.time}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(item.text);
                            alert('Copied voice note!');
                          }}
                          className="hover:text-white p-0.5"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSaved(item.id)}
                          className="hover:text-red-400 p-0.5"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-slate-200 line-clamp-3 whitespace-pre-wrap text-[11px]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
