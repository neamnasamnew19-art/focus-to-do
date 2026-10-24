import React, { useState } from 'react';
import {
  Smartphone,
  Play,
  Pause,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Task, TimerState, CalendarEvent } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface SamsungWidgetViewProps {
  timer: TimerState;
  tasks: Task[];
  events: CalendarEvent[];
  energy: number;
  floatingWidgetEnabled: boolean;
  onToggleFloatingWidget: () => void;
  onToggleTimer: () => void;
  onFocusTab: (tab: any) => void;
  onShowToast: (msg: string) => void;
}

export const SamsungWidgetView: React.FC<SamsungWidgetViewProps> = ({
  timer,
  tasks,
  events,
  energy,
  floatingWidgetEnabled,
  onToggleFloatingWidget,
  onToggleTimer,
  onFocusTab,
  onShowToast
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [selectedWidgetTab, setSelectedWidgetTab] = useState<'2x2' | '4x2' | '4x1'>('2x2');

  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const todayTasks = tasks.slice(0, 3);
  const nextEvent = events[0];

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onShowToast('Added to your Samsung Galaxy A32 home screen!');
    }
  };

  return (
    <section className="space-y-5 animate-in fade-in duration-150">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">📱 Samsung A32 Widgets</h2>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-500 uppercase tracking-wide">
              One UI
            </span>
          </div>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            Interactive widgets and home screen shortcuts for your Samsung Galaxy A32
          </p>
        </div>

        {/* Floating Mini-Widget Button */}
        <button
          onClick={onToggleFloatingWidget}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition ${
            floatingWidgetEnabled
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
              : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-3)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{floatingWidgetEnabled ? 'Hide Floating Widget' : 'Pin Floating Widget'}</span>
        </button>
      </div>

      {/* Samsung One UI Widget Live Preview Card */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Samsung Galaxy A32 Wallpaper Glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Samsung Galaxy A32 Widget Preview
            </span>
          </div>

          {/* Widget Size Selector */}
          <div className="inline-flex p-0.5 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
            {(['2x2', '4x2', '4x1'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedWidgetTab(size)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                  selectedWidgetTab === size
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Widget Display */}
        <div className="py-2 flex justify-center relative z-10">
          {selectedWidgetTab === '2x2' && (
            /* 2x2 Focus Squircle Widget */
            <div className="w-64 h-64 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {timer.mode === 'pomo' ? 'Focus' : 'Break'}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-xs font-semibold text-amber-300">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{energy}</span>
                </div>
              </div>

              <div className="text-center my-auto">
                <div className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {timeString}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">25-min Block</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={onToggleTimer}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
                >
                  {timer.running ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{timer.running ? 'Pause' : 'Start'}</span>
                </button>
              </div>
            </div>
          )}

          {selectedWidgetTab === '4x2' && (
            /* 4x2 Student Day Agenda Widget */
            <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Today&apos;s Focus &amp; Lectures
                  </span>
                  <h4 className="text-base font-extrabold text-white">Daily Academic Stack</h4>
                </div>
                <button
                  onClick={() => onFocusTab('pomo')}
                  className="px-3 py-1 rounded-full bg-blue-600 text-xs font-bold hover:bg-blue-500 transition"
                >
                  {timeString}
                </button>
              </div>

              {/* Tasks preview in widget */}
              <div className="space-y-1.5 pt-1">
                {todayTasks.length > 0 ? (
                  todayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            t.done ? 'text-green-400' : 'text-slate-400'
                          }`}
                        />
                        <span className={`truncate ${t.done ? 'line-through text-slate-400' : 'text-white'}`}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-300 font-mono shrink-0">
                        🍅 {t.act}/{t.est}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2 text-center">No tasks for today</p>
                )}
              </div>

              {nextEvent && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">Upcoming: {nextEvent.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{nextEvent.date}</span>
                </div>
              )}
            </div>
          )}

          {selectedWidgetTab === '4x1' && (
            /* 4x1 Quick Glance Widget */
            <div className="w-full max-w-md h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🍅
                </div>
                <div>
                  <div className="font-mono text-xl font-extrabold text-white leading-none">
                    {timeString}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                    {timer.mode === 'pomo' ? 'Pomodoro Session' : 'Rest Break'}
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleTimer}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                {timer.running ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{timer.running ? 'Pause' : 'Focus'}</span>
              </button>
            </div>
          )}
        </div>

        {/* PWA Install Button for Samsung A32 */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="text-xs text-slate-300">
            {isInstalled ? (
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Installed as Standalone App on Samsung Galaxy A32
              </span>
            ) : (
              <span>Install to unlock real Android One UI home screen widgets</span>
            )}
          </div>

          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Samsung A32</span>
            </button>
          )}
        </div>
      </div>

      {/* Guide: How to add widget & shortcuts on Samsung Galaxy A32 */}
      <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>How to use Widgets on Samsung Galaxy A32 (One UI)</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <span className="font-bold text-[var(--primary)]">1. Pin App to Home Screen</span>
            <p className="text-[var(--text-2)] leading-relaxed">
              Open Chrome or Samsung Internet, tap the <strong>3 dots (⋮)</strong>, and select <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install App&quot;</strong>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <span className="font-bold text-[var(--primary)]">2. Long-Press App Icon</span>
            <p className="text-[var(--text-2)] leading-relaxed">
              On your Samsung A32 home screen, long-press the <strong>Focus To-Do</strong> icon to open instant quick shortcuts (25m Focus, Expense, Calendar).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <span className="font-bold text-[var(--primary)]">3. Floating Study Pill</span>
            <p className="text-[var(--text-2)] leading-relaxed">
              Use the <strong>&quot;Pin Floating Widget&quot;</strong> button above to keep an always-visible countdown timer floating on screen while taking notes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
