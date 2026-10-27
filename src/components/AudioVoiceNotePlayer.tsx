import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface AudioVoiceNotePlayerProps {
  scriptText: string;
  language: string;
  audioUrl: string | null;
  onRefreshAudio?: () => void;
  isLoadingAudio?: boolean;
}

export const AudioVoiceNotePlayer: React.FC<AudioVoiceNotePlayerProps> = ({
  scriptText,
  language,
  audioUrl,
  isLoadingAudio = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:30');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio element
  useEffect(() => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        audioRef.current.src = audioUrl;
      }

      const audio = audioRef.current;
      audio.playbackRate = playbackRate;

      const handleTimeUpdate = () => {
        if (audio.duration) {
          const current = audio.currentTime;
          const dur = audio.duration;
          setProgress((current / dur) * 100);
          const mins = Math.floor(current / 60);
          const secs = Math.floor(current % 60);
          setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };

      const handleLoadedMetadata = () => {
        if (audio.duration) {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);
          setDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [audioUrl, playbackRate]);

  // Fallback to browser SpeechSynthesis if no backend audio stream
  const speakWithBrowser = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick English or Nigerian accent if available
    const voices = window.speechSynthesis.getVoices();
    const ngVoice = voices.find((v) => v.lang.includes('NG') || v.lang.includes('GB') || v.name.includes('Nigeria'));
    if (ngVoice) utterance.voice = ngVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsSynthesizing(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsSynthesizing(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsSynthesizing(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Audio play failed, falling back to speech synthesis:', err);
          speakWithBrowser();
        });
      }
    } else {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsSynthesizing(false);
      } else {
        speakWithBrowser();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  const changeRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const resetPlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime('0:00');
    }
    if (isSynthesizing) {
      window.speechSynthesis.cancel();
      speakWithBrowser();
    }
  };

  return (
    <div className="bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/60">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight uppercase text-emerald-400">
              Audio Voice Note
            </h4>
            <p className="text-[11px] text-emerald-200/80">
              Listen to explanation in {language}
            </p>
          </div>
        </div>

        {/* Speed button */}
        <button
          onClick={changeRate}
          type="button"
          className="text-xs font-semibold px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 rounded-lg text-emerald-200 transition border border-emerald-700/50"
          title="Change playback speed"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Main Playback Bar & Waveform */}
      <div className="flex items-center gap-3 my-2">
        {/* Big play button with safe touch target */}
        <button
          onClick={togglePlay}
          disabled={isLoadingAudio}
          type="button"
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
          className="w-12 h-12 shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 flex items-center justify-center font-bold transition shadow-md disabled:opacity-50"
        >
          {isLoadingAudio ? (
            <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Dynamic Waveform & Progress */}
        <div className="flex-1">
          {/* Animated Waveform Bars */}
          <div className="flex items-center gap-1 h-8 px-1 mb-1">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 35, 85, 75, 40, 90, 55, 70, 30, 60].map(
              (height, idx) => {
                const isActive = (idx / 20) * 100 <= progress;
                const animatedHeight = isPlaying ? Math.max(15, (height * (0.6 + Math.sin((idx + Date.now() / 200) * 0.5) * 0.4))) : height * 0.45;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isActive ? 'bg-emerald-400' : 'bg-emerald-800/80'
                    }`}
                    style={{ height: `${animatedHeight}%` }}
                  />
                );
              }
            )}
          </div>

          {/* Time & Scrubber */}
          <div className="flex items-center justify-between text-[11px] text-emerald-300/80 font-mono">
            <span>{currentTime}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 mx-3 accent-emerald-400 h-1 bg-emerald-900 rounded-lg cursor-pointer"
            />
            <span>{duration}</span>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={resetPlay}
          type="button"
          aria-label="Replay from start"
          className="w-8 h-8 shrink-0 rounded-lg hover:bg-emerald-900 text-emerald-300 flex items-center justify-center transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Spoken Script Transcription */}
      <div className="mt-3 pt-2.5 border-t border-emerald-900/80 text-xs text-emerald-100/90 leading-relaxed italic bg-emerald-900/30 p-2.5 rounded-xl">
        "{scriptText}"
      </div>
    </div>
  );
};
