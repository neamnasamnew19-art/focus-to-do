import React, { useState } from 'react';
import { Play, Pause, X, Zap, Maximize2 } from 'lucide-react';
import { TimerState } from '../types';

interface FloatingWidgetProps {
  timer: TimerState;
  energy: number;
  onToggleTimer: () => void;
  onClose: () => void;
  onExpand: () => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  timer,
  energy,
  onToggleTimer,
  onClose,
  onExpand
}) => {
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 220, e.clientX - dragOffset.x)),
      y: Math.max(10, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed z-50 select-none shadow-2xl rounded-2xl bg-slate-900/90 text-white border border-white/20 backdrop-blur-xl p-3 w-52 flex flex-col gap-2 transition-shadow hover:shadow-blue-500/10 cursor-grab active:cursor-grabbing"
    >
      {/* Top drag bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-white/10"
      >
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{timer.mode === 'pomo' ? 'Focus' : 'Break'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onExpand}
            title="Open timer view"
            className="hover:text-white transition"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            title="Close widget"
            className="hover:text-red-400 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main info row */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-2xl font-bold leading-none tracking-tight">
            {timeString}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1 font-semibold">
            <Zap className="w-3 h-3 fill-current" />
            <span>{energy} pts</span>
          </div>
        </div>

        <button
          onClick={onToggleTimer}
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-xs active:scale-95"
        >
          {timer.running ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
