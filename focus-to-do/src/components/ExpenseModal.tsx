import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { EXP_CATS, getTodayStr } from '../constants';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit: Expense | null;
  onSave: (expenseData: { id?: number; title: string; amount: number; category: Expense['category']; date: string }) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Food');
  const [date, setDate] = useState(getTodayStr());

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(String(expenseToEdit.amount));
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayStr());
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    onSave({
      id: expenseToEdit?.id,
      title: title.trim(),
      amount: parsedAmount,
      category,
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
          {expenseToEdit ? 'Edit Expense' : 'Log Expense'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Description
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lunch at cafeteria"
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] tabular focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex-1">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Expense['category'])}
              className="w-full px-3 py-1.5 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              {Object.keys(EXP_CATS).map((cat) => (
                <option key={cat} value={cat}>
                  {EXP_CATS[cat].emoji} {cat}
                </option>
              ))}
            </select>
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
