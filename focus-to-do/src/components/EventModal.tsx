import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventCategory } from '../types';
import { EVENT_CATS, POMO_CATS, getTodayStr } from '../constants';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: CalendarEvent | null;
  selectedDate: string;
  isGoogleConnected: boolean;
  onSave: (eventData: {
    id?: number;
    title: string;
    date: string;
    category: EventCategory;
    linkToPomo: boolean;
    est: number;
    syncToGoogle?: boolean;
  }) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  selectedDate,
  isGoogleConnected,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || getTodayStr());
  const [category, setCategory] = useState<EventCategory>('Study');
  const [linkToPomo, setLinkToPomo] = useState(true);
  const [syncToGoogle, setSyncToGoogle] = useState(isGoogleConnected);
  const [est, setEst] = useState(2);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDate(eventToEdit.date);
      setCategory(eventToEdit.category);
      setLinkToPomo(Boolean(eventToEdit.linkedTaskId));
      setEst(eventToEdit.est || 2);
      setSyncToGoogle(Boolean(eventToEdit.isGoogleEvent));
    } else {
      setTitle('');
      setDate(selectedDate || getTodayStr());
      setCategory('Study');
      setLinkToPomo(true);
      setEst(2);
      setSyncToGoogle(isGoogleConnected);
    }
  }, [eventToEdit, selectedDate, isGoogleConnected, isOpen]);

  if (!isOpen) return null;

  const isLinkable = POMO_CATS.includes(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: eventToEdit?.id,
      title: title.trim(),
      date,
      category,
      linkToPomo: isLinkable && linkToPomo,
      est: Math.min(20, Math.max(1, Number(est) || 1)),
      syncToGoogle: isGoogleConnected && syncToGoogle
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)] max-h-[92vh] overflow-y-auto">
        <h3 className="text-base font-bold mb-4">
          {eventToEdit ? 'Edit Event' : 'New Event'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics midterm revision"
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(EVENT_CATS) as EventCategory[]).map((catName) => {
                const catInfo = EVENT_CATS[catName];
                const isSelected = category === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setCategory(catName)}
                    style={{
                      borderColor: isSelected ? catInfo.color : 'transparent',
                      color: isSelected ? catInfo.color : 'var(--text-2)',
                      backgroundColor: isSelected ? `${catInfo.color}15` : 'var(--surface-2)'
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded border text-xs font-semibold transition hover:bg-[var(--hover)] active:scale-95"
                  >
                    <span className="text-lg leading-none">{catInfo.emoji}</span>
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Google Calendar Sync Option */}
          {isGoogleConnected && (
            <div className="p-2.5 rounded bg-blue-500/5 border border-blue-500/20">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={syncToGoogle}
                  onChange={(e) => setSyncToGoogle(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Sync with Google Calendar</span>
              </label>
            </div>
          )}

          {/* Pomodoro link option for Study / Assignment */}
          {isLinkable && (
            <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkToPomo}
                  onChange={(e) => setLinkToPomo(e.target.checked)}
                  className="mt-0.5 rounded text-[var(--primary)] focus:ring-0"
                />
                <span className="text-xs font-semibold text-[var(--text)]">
                  Link to Pomodoro
                  <span className="block text-[11px] font-normal text-[var(--text-2)] mt-0.5">
                    Creates a focus task on the same date so you can run focus sessions against it.
                  </span>
                </span>
              </label>

              {linkToPomo && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                    Estimated Pomodoros
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={est}
                    onChange={(e) => setEst(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] tabular focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-1.5 text-xs font-semibold rounded text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
