import React from 'react';
import { Menu, Check, Moon, Sun, Zap } from 'lucide-react';

interface HeaderProps {
  energy: number;
  darkMode: boolean;
  onToggleMenu: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  energy,
  darkMode,
  onToggleMenu,
  onToggleTheme
}) => {
  return (
    <header className="h-11 shrink-0 flex items-center justify-between px-3 bg-[var(--bg)] border-b border-[var(--border)] z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMenu}
          className="md:hidden w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="w-6 h-6 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>

        <span className="font-extrabold text-[14.5px] tracking-tight">Focus To-Do</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Energy Pill */}
        <div
          title="Focus energy points earned from pomodoros"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] tabular"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{energy}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
