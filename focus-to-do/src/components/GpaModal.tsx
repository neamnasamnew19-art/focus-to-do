import React, { useState } from 'react';
import { Course } from '../types';
import { COURSE_PRESETS, getGradeFor } from '../constants';

interface GpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id'>) => void;
}

export const GpaModal: React.FC<GpaModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [quickPick, setQuickPick] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [continuous, setContinuous] = useState(35);
  const [finalExam, setFinalExam] = useState(30);

  if (!isOpen) return null;

  const handleQuickPickChange = (val: string) => {
    setQuickPick(val);
    if (!val) return;
    const [cName, cCredits] = val.split('|');
    setTitle(cName);
    setCredits(parseInt(cCredits) || 3);
  };

  const totalMark = continuous + finalExam;
  const grade = getGradeFor(totalMark, finalExam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      credits: Math.min(10, Math.max(1, Number(credits) || 1)),
      continuous: Math.min(50, Math.max(0, Number(continuous) || 0)),
      finalExam: Math.min(50, Math.max(0, Number(finalExam) || 0)),
      totalMark,
      letter: grade.letter,
      vlg: grade.vlg,
      status: grade.status,
      gpt: grade.vlg * credits
    });

    // Reset & close
    setTitle('');
    setQuickPick('');
    setCredits(3);
    setContinuous(35);
    setFinalExam(30);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)] max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-bold mb-4">Add Course</h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Quick Pick (Curriculum Presets)
            </label>
            <select
              value={quickPick}
              onChange={(e) => handleQuickPickChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">— Custom course —</option>
              {COURSE_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Course Name &amp; Code
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Applied Mathematics IA (Math 1014)"
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] tabular text-center focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Continuous /50
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={continuous}
                onChange={(e) => setContinuous(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] tabular text-center focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Final /50
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={finalExam}
                onChange={(e) => setFinalExam(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] tabular text-center focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Real-time Calculation Badge */}
          <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[var(--text)]">Total: {totalMark}%</span>
              <span className="text-[var(--text-2)] ml-2">({grade.status})</span>
              <p className="text-[11px] text-[var(--text-3)] mt-0.5">Final exam must be ≥ 20/50 (40%) to pass.</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-[var(--primary)]">{grade.letter}</span>
              <span className="block text-[10px] text-[var(--text-2)] tabular">{grade.vlg.toFixed(2)} pts</span>
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
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
