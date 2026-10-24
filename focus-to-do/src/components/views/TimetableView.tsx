import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, User as UserIcon, Trash2, Share2, Check } from 'lucide-react';
import { TimetableSlot } from '../../types';

interface TimetableViewProps {
  slots: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onDeleteSlot: (slotId: number) => void;
  onSyncToGoogleCalendar: () => void;
  isGoogleConnected: boolean;
  onFocusTab: (tab: any) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  slots,
  onAddSlot,
  onDeleteSlot,
  onSyncToGoogleCalendar,
  isGoogleConnected
}) => {
  const [selectedDay, setSelectedDay] = useState<'All' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [day, setDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('Mon');
  const [courseTitle, setCourseTitle] = useState('');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');

  const daysList: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredSlots = slots
    .filter((s) => selectedDay === 'All' || s.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    onAddSlot({
      day,
      courseTitle: courseTitle.trim(),
      startTime,
      endTime,
      room: room.trim() || 'TBA',
      instructor: instructor.trim() || undefined
    });

    setCourseTitle('');
    setRoom('');
    setInstructor('');
    setModalOpen(false);
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">🎓 Class Timetable</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            Weekly lecture matrix &amp; classroom locations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isGoogleConnected && (
            <button
              onClick={onSyncToGoogleCalendar}
              title="Sync semester schedule to Google Calendar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Sync to Google Cal</span>
            </button>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {(['All', ...daysList] as const).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3 py-1 text-xs font-semibold rounded transition shrink-0 ${
              selectedDay === d
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-2)] border border-[var(--border)]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slots List */}
      {filteredSlots.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition flex flex-col justify-between space-y-2 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[var(--primary-soft)] text-[var(--primary)]">
                    {slot.day}
                  </span>
                  <h4 className="text-sm font-bold text-[var(--text)] mt-1.5">
                    {slot.courseTitle}
                  </h4>
                </div>

                <button
                  onClick={() => onDeleteSlot(slot.id)}
                  title="Remove class"
                  className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-3)] hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-[var(--text-2)] pt-1 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-3)]" />
                  <span className="tabular font-mono">
                    {slot.startTime} – {slot.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-3)]" />
                  <span>Room: {slot.room}</span>
                </div>

                {slot.instructor && (
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[var(--text-3)]" />
                    <span>Prof: {slot.instructor}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
          <div className="text-4xl mb-2.5">📅</div>
          <p className="text-sm font-semibold text-[var(--text)]">No classes on this day</p>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Tap &quot;Add Class&quot; to organize your semester lecture schedule.
          </p>
        </div>
      )}

      {/* Add Class Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)]">
            <h3 className="text-base font-bold mb-4">Add Lecture Slot</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Day of Week
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  {daysList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Course Title &amp; Code
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Applied Math IA"
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Classroom / Hall
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room 204, Engineering Block"
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Instructor (Optional)
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. Abebe"
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
