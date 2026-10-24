import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  ExternalLink,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CalendarEvent, Task } from '../../types';
import { EVENT_CATS, getTodayStr, parseDateStr } from '../../constants';
import { User } from 'firebase/auth';

interface CalendarViewProps {
  events: CalendarEvent[];
  tasks: Task[];
  activeFocusId: number | null;
  googleUser: User | null;
  isGoogleConnected: boolean;
  isSyncingGoogle: boolean;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onSyncGoogleCalendar: () => void;
  onOpenNewEvent: (dateStr: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: number) => void;
  onFocusTask: (taskId: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  tasks,
  activeFocusId,
  googleUser,
  isGoogleConnected,
  isSyncingGoogle,
  onConnectGoogle,
  onDisconnectGoogle,
  onSyncGoogleCalendar,
  onOpenNewEvent,
  onEditEvent,
  onDeleteEvent,
  onFocusTask
}) => {
  const [calCursor, setCalCursor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => getTodayStr());

  const year = calCursor.getFullYear();
  const month = calCursor.getMonth();
  const monthName = calCursor.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDow = new Date(year, month, 1).getDay();
  const leadDays = firstDow === 0 ? 6 : firstDow - 1; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getTodayStr();

  // Navigation
  const prevMonth = () => setCalCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCalCursor(new Date(year, month + 1, 1));

  // Selected date agenda items
  const dayEvents = events.filter((e) => e.date === selectedDate);
  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const totalAgendaItems = dayEvents.length + dayTasks.length;

  const selectedDateFormatted = parseDateStr(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">🗓️ Google Calendar</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            Synced university schedule, lectures &amp; study sessions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isGoogleConnected ? (
            <button
              onClick={onSyncGoogleCalendar}
              disabled={isSyncingGoogle}
              title="Sync with Google Calendar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
              <span>{isSyncingGoogle ? 'Syncing...' : 'Sync Google Cal'}</span>
            </button>
          ) : (
            <button
              onClick={onConnectGoogle}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Connect Google</span>
            </button>
          )}

          <button
            onClick={() => onOpenNewEvent(selectedDate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Event</span>
          </button>
        </div>
      </div>

      {/* Google Calendar Connection Status Banner */}
      <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between gap-3 text-xs">
        {isGoogleConnected ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text)]">Google Calendar Connected</span>
              <p className="text-[11px] text-[var(--text-2)] truncate">
                {googleUser?.displayName || googleUser?.email} · Primary Calendar
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text)]">Google Calendar Sync</span>
              <p className="text-[11px] text-[var(--text-2)] truncate">
                Connect your Google account to sync live university events and study tasks
              </p>
            </div>
          </div>
        )}

        {isGoogleConnected ? (
          <button
            onClick={onDisconnectGoogle}
            className="text-[11px] font-semibold text-[var(--text-3)] hover:text-red-500 transition shrink-0"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnectGoogle}
            className="text-xs font-bold text-[var(--primary)] hover:underline shrink-0"
          >
            Sign In →
          </button>
        )}
      </div>

      {/* Month Card */}
      <div className="p-4 sm:p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">{monthName}</h3>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              title="Previous month"
              className="w-7 h-7 rounded flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextMonth}
              title="Next month"
              className="w-7 h-7 rounded flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold text-center text-[var(--text-3)] mb-2">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadDays }).map((_, i) => (
            <div key={`lead-${i}`} className="h-14 opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dStr === todayStr;
            const isSelected = dStr === selectedDate;
            const cellEvents = events.filter((e) => e.date === dStr);
            const cellTasks = tasks.filter((t) => t.date === dStr);
            const count = cellEvents.length + cellTasks.length;

            const primaryEvent = cellEvents[0];
            const primaryTask = cellTasks[0];

            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                className={`h-14 p-1.5 rounded flex flex-col justify-between text-left transition border ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                    : isToday
                    ? 'border-[var(--primary)] border-l-4 bg-transparent'
                    : 'border-[var(--border)] hover:bg-[var(--hover)]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] tabular ${
                      isToday
                        ? 'font-bold text-[var(--primary)]'
                        : isSelected
                        ? 'font-bold text-[var(--primary)]'
                        : 'font-semibold text-[var(--text)]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {count > 0 && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[var(--primary)]' : 'bg-[var(--text-3)]'
                      }`}
                    />
                  )}
                </div>

                <div className="w-full overflow-hidden text-[9px] leading-tight">
                  {primaryEvent ? (
                    <span
                      style={{
                        backgroundColor: `${EVENT_CATS[primaryEvent.category]?.color || '#787774'}20`,
                        color: EVENT_CATS[primaryEvent.category]?.color || '#787774'
                      }}
                      className="block truncate px-1 py-0.5 rounded font-semibold"
                    >
                      {primaryEvent.isGoogleEvent ? '📅 ' : ''}
                      {primaryEvent.title}
                    </span>
                  ) : primaryTask ? (
                    <span className="block truncate px-1 py-0.5 rounded font-medium bg-[var(--surface-3)] text-[var(--text-2)]">
                      {primaryTask.title}
                    </span>
                  ) : null}

                  {count > 1 && (
                    <span className="text-[8.5px] text-[var(--text-3)] font-semibold tabular pl-0.5 block">
                      +{count - 1}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 mt-3 border-t border-[var(--border)] justify-center text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] self-center">
            Categories:
          </span>
          {Object.entries(EVENT_CATS).map(([name, catInfo]) => (
            <span key={name} className="flex items-center gap-1 font-semibold text-[var(--text-2)]">
              <span>{catInfo.emoji}</span>
              <span>{name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Agenda for Selected Day */}
      <div className="p-4 sm:p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{selectedDateFormatted}</h3>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] tabular">
            {totalAgendaItems} item{totalAgendaItems === 1 ? '' : 's'}
          </span>
        </div>

        {totalAgendaItems > 0 ? (
          <div className="space-y-3">
            {/* Events section */}
            {dayEvents.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mb-1.5">
                  Events &amp; Deadlines
                </p>
                <div className="space-y-1.5">
                  {dayEvents.map((ev) => {
                    const catInfo = EVENT_CATS[ev.category] || EVENT_CATS.Other;
                    const linkedTask = ev.linkedTaskId
                      ? tasks.find((t) => t.id === ev.linkedTaskId)
                      : null;
                    const isFocused = linkedTask && activeFocusId === linkedTask.id;

                    return (
                      <div
                        key={ev.id}
                        className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            style={{ backgroundColor: `${catInfo.color}20` }}
                            className="w-6 h-6 rounded flex items-center justify-center shrink-0 text-sm"
                          >
                            {catInfo.emoji}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[13px] font-semibold text-[var(--text)] truncate">
                                {ev.title}
                              </p>
                              {ev.isGoogleEvent && (
                                <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
                                  Google Cal
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span
                                style={{
                                  backgroundColor: `${catInfo.color}15`,
                                  color: catInfo.color
                                }}
                                className="text-[10.5px] font-semibold px-1.5 py-0.2 rounded"
                              >
                                {ev.category}
                              </span>
                              {linkedTask && (
                                <span className="text-[10.5px] text-[var(--text-2)] tabular">
                                  🍅 {linkedTask.act}/{linkedTask.est} · linked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {linkedTask && (
                            <button
                              onClick={() => onFocusTask(linkedTask.id)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                                isFocused
                                  ? 'bg-[var(--primary)] text-white'
                                  : 'text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)]'
                              }`}
                            >
                              Focus
                            </button>
                          )}
                          <button
                            onClick={() => onEditEvent(ev)}
                            title="Edit event"
                            className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(ev.id)}
                            title="Delete event"
                            className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--danger)] transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tasks section */}
            {dayTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mb-1.5">
                  Tasks
                </p>
                <div className="space-y-1.5">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full border border-[var(--primary)] shrink-0 ${
                            t.done ? 'bg-[var(--primary)]' : 'bg-transparent'
                          }`}
                        />
                        <span
                          className={`text-[13px] font-semibold truncate ${
                            t.done ? 'line-through text-[var(--text-2)]' : 'text-[var(--text)]'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <button
                        onClick={() => onFocusTask(t.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition shrink-0"
                      >
                        Focus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-center text-[var(--text-3)] py-4">Nothing scheduled for this day.</p>
        )}
      </div>
    </section>
  );
};
