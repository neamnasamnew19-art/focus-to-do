import React, { useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Target, Volume2, VolumeX, CloudRain, Coffee, Waves, Activity } from 'lucide-react';
import { Task, TimerMode, TimerState } from '../../types';
import { MODES, RING_CIRCUMFERENCE } from '../../constants';
import { ambientAudio } from '../../services/ambientAudio';

interface PomodoroViewProps {
  timer: TimerState;
  activeTask: Task | null;
  todayPomosCount: number;
  onSetMode: (mode: TimerMode) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onSelectTaskClick: () => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  timer,
  activeTask,
  todayPomosCount,
  onSetMode,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onSelectTaskClick
}) => {
  const currentModeConfig = MODES[timer.mode];
  const progressFraction = timer.total > 0 ? timer.remaining / timer.total : 0;
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progressFraction);

  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentRound = todayPomosCount > 0 ? (todayPomosCount % 4) + 1 : 1;

  // Ambient sound state
  const [ambientType, setAmbientType] = useState<'off' | 'rain' | 'coffee' | 'brown' | 'binaural'>('off');
  const [ambientVolume, setAmbientVolume] = useState(0.25);

  const handleAmbientChange = (type: 'off' | 'rain' | 'coffee' | 'brown' | 'binaural') => {
    setAmbientType(type);
    if (type === 'off') {
      ambientAudio.stop();
    } else {
      ambientAudio.play(type, ambientVolume);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    ambientAudio.setVolume(vol);
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">🍅 Pomodoro</h2>
        <p className="text-xs text-[var(--text-2)] mt-0.5">Focus in 25-minute blocks</p>
      </div>

      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-center shadow-2xs">
        {/* Active Task Selector Pill */}
        <div className="mb-5 flex justify-center">
          <button
            onClick={onSelectTaskClick}
            className={`inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
              activeTask
                ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-xs">
              {activeTask
                ? `${activeTask.title} · ${activeTask.act}/${activeTask.est}`
                : 'No task selected — click to choose'}
            </span>
          </button>
        </div>

        {/* Mode Segmented Controls */}
        <div className="inline-flex p-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] mb-7">
          {(['pomo', 'short', 'long'] as TimerMode[]).map((modeKey) => {
            const isActive = timer.mode === modeKey;
            return (
              <button
                key={modeKey}
                onClick={() => onSetMode(modeKey)}
                className={`px-3.5 py-1 text-xs font-semibold rounded transition ${
                  isActive
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {MODES[modeKey].label}
              </button>
            );
          })}
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-60 h-60 mx-auto mb-7">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="4"
            />
            {/* Dynamic Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={currentModeConfig.stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.35s linear, stroke 0.2s ease'
              }}
            />
          </svg>

          {/* Time & Mode Label Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="font-mono-numbers text-5xl font-bold tracking-tight text-[var(--text)]">
              {timeString}
            </div>
            <div className="text-[10.5px] font-bold text-[var(--text-2)] mt-2 uppercase tracking-widest">
              {currentModeConfig.label}
            </div>
            {todayPomosCount > 0 && (
              <div className="text-[11px] text-[var(--text-3)] mt-1 font-medium">
                Round {currentRound} of 4
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={onResetTimer}
            title="Reset timer"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTimer}
            className="h-9 px-6 rounded-full inline-flex items-center justify-center gap-2 text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition active:scale-95 min-w-[120px]"
          >
            {timer.running ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={onSkipTimer}
            title="Skip session"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] transition active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Summary */}
        <p className="text-xs text-[var(--text-2)] mt-5">
          <span className="font-semibold text-[var(--text)] tabular">{todayPomosCount}</span>{' '}
          pomodoro{todayPomosCount === 1 ? '' : 's'} today ·{' '}
          <span className="font-semibold text-[var(--text)] tabular">{todayPomosCount * 25}</span>{' '}
          min focused
        </p>

        {/* Ambient Study Sounds Drawer */}
        <div className="mt-6 pt-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Ambient Study Sounds (Web Audio)</span>
            </span>

            {ambientType !== 'off' && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-[var(--surface-3)] rounded appearance-none cursor-pointer accent-[var(--primary)]"
                />
                <button
                  onClick={() => handleAmbientChange('off')}
                  className="text-[10px] text-[var(--text-3)] hover:text-red-500 font-semibold"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              onClick={() => handleAmbientChange(ambientType === 'rain' ? 'off' : 'rain')}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                ambientType === 'rain'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold'
                  : 'border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-2)]'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span className="text-[10.5px]">Campus Rain</span>
            </button>

            <button
              onClick={() => handleAmbientChange(ambientType === 'coffee' ? 'off' : 'coffee')}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                ambientType === 'coffee'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                  : 'border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-2)]'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span className="text-[10.5px]">Coffee Shop</span>
            </button>

            <button
              onClick={() => handleAmbientChange(ambientType === 'brown' ? 'off' : 'brown')}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                ambientType === 'brown'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-500 font-bold'
                  : 'border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-2)]'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span className="text-[10.5px]">Brown Noise</span>
            </button>

            <button
              onClick={() => handleAmbientChange(ambientType === 'binaural' ? 'off' : 'binaural')}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                ambientType === 'binaural'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                  : 'border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-2)]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-[10.5px]">40Hz Binaural</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
