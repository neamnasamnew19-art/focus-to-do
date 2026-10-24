import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTodayStr } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
  onSave: (taskData: { id?: number; title: string; est: number; date: string }) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [est, setEst] = useState(2);
  const [date, setDate] = useState(getTodayStr());

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setEst(taskToEdit.est || 2);
      setDate(taskToEdit.date || getTodayStr());
    } else {
      setTitle('');
      setEst(2);
      setDate(getTodayStr());
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      est: Math.min(20, Math.max(1, Number(est) || 1)),
      date: date || getTodayStr()
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
      <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)]">
        <h3 className="text-base font-bold mb-4">
          {taskToEdit ? 'Edit Task' : 'New Task'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Task name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read Physics Chapter 4"
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Est. Pomodoros
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={est}
                onChange={(e) => setEst(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] tabular focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
