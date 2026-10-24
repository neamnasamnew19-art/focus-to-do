import React from 'react';
import { CheckSquare, Timer, Calendar as CalendarIcon, Smartphone, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as ActiveTab, label: 'Today', icon: CheckSquare },
    { id: 'pomo' as ActiveTab, label: 'Timer', icon: Timer },
    { id: 'events' as ActiveTab, label: 'Google Cal', icon: CalendarIcon },
    { id: 'timetable' as ActiveTab, label: 'Schedule', icon: BookOpen },
    { id: 'widget' as ActiveTab, label: 'A32 Widget', icon: Smartphone }
  ];

  return (
    <nav className="md:hidden shrink-0 flex items-center bg-[var(--bg)] border-t border-[var(--border)] z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
              isActive ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="truncate max-w-[64px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
