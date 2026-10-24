import React from 'react';
import { Target } from 'lucide-react';
import { Task } from '../types';

interface FocusBannerProps {
  task: Task | null;
  onOpenTimer: () => void;
}

export const FocusBanner: React.FC<FocusBannerProps> = ({ task, onOpenTimer }) => {
  if (!task) return null;

  return (
    <div className="p-3 rounded-md border border-[var(--primary)] bg-[var(--primary-soft)] mb-5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Target className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Now Focusing
          </div>
          <div className="text-[13px] font-semibold text-[var(--text)] truncate">
            {task.title}
          </div>
        </div>
      </div>

      <button
        onClick={onOpenTimer}
        className="px-3 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shrink-0 shadow-xs transition active:scale-95"
      >
        Open timer
      </button>
    </div>
  );
};
