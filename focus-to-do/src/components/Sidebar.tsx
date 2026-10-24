import React from 'react';
import {
  CheckSquare,
  CalendarDays,
  Timer,
  BarChart2,
  Wallet,
  GraduationCap,
  Calendar as CalendarIcon,
  Settings,
  Check,
  Smartphone,
  BookOpen,
  Brain
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isGoogleConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isGoogleConnected
}) => {
  const navItems = [
    {
      group: 'Tasks & Focus',
      items: [
        { id: 'today' as ActiveTab, label: 'Today', icon: CheckSquare },
        { id: 'upcoming' as ActiveTab, label: 'Upcoming', icon: CalendarDays },
        { id: 'pomo' as ActiveTab, label: 'Pomodoro', icon: Timer }
      ]
    },
    {
      group: 'Student Hub',
      items: [
        {
          id: 'events' as ActiveTab,
          label: isGoogleConnected ? 'Google Calendar' : 'Calendar',
          icon: CalendarIcon,
          badge: isGoogleConnected ? 'Synced' : undefined
        },
        { id: 'timetable' as ActiveTab, label: 'Class Timetable', icon: BookOpen },
        { id: 'flashcards' as ActiveTab, label: 'Revision Cards', icon: Brain },
        { id: 'gpa' as ActiveTab, label: 'GPA Tracker', icon: GraduationCap },
        { id: 'expenses' as ActiveTab, label: 'Expenses', icon: Wallet },
        { id: 'analytics' as ActiveTab, label: 'Reports', icon: BarChart2 }
      ]
    },
    {
      group: 'Mobile & Widget',
      items: [
        { id: 'widget' as ActiveTab, label: 'Samsung A32 Widgets', icon: Smartphone }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Scrim / Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Aside Container */}
      <aside
        className={`w-60 shrink-0 p-2.5 bg-[var(--surface-2)] border-r border-[var(--border)] z-40 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpenMobile
            ? 'fixed top-0 bottom-0 left-0 translate-x-0 shadow-2xl'
            : 'fixed top-0 bottom-0 left-0 -translate-x-full md:relative md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Top Brand Item */}
          <button
            onClick={() => {
              onSelectTab('today');
              onCloseMobile();
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded font-bold text-sm text-[var(--text)] w-full text-left hover:bg-[var(--hover)] transition"
          >
            <span className="w-5 h-5 rounded bg-[var(--primary)] text-white flex items-center justify-center text-xs shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span>Focus To-Do</span>
          </button>

          {/* Navigation Groups */}
          {navItems.map((group) => (
            <div key={group.group}>
              <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--text-3)] uppercase tracking-wider">
                {group.group}
              </div>
              <div className="space-y-0.5 mt-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] font-medium w-full text-left transition ${
                        isActive
                          ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-semibold'
                          : 'text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Settings Link */}
        <div className="pt-2 border-t border-[var(--border)]">
          <button
            onClick={() => {
              onSelectTab('settings');
              onCloseMobile();
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] font-medium w-full text-left transition ${
              activeTab === 'settings'
                ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-semibold'
                : 'text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
