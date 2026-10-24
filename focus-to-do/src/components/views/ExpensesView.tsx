import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { Expense } from '../../types';
import { EXP_CATS, getTodayStr, getLastNDays, parseDateStr } from '../../constants';

interface ExpensesViewProps {
  expenses: Expense[];
  onOpenNewExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: number) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenNewExpense,
  onEditExpense,
  onDeleteExpense
}) => {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const todayStr = getTodayStr();

  // 1. Weekly view data
  if (filter === 'weekly') {
    const past7Days = getLastNDays(7);
    const daySet = new Set(past7Days);
    const weeklyExpenses = expenses.filter((e) => daySet.has(e.date));
    const totalWeekly = weeklyExpenses.reduce((acc, e) => acc + e.amount, 0);

    const buckets = past7Days.map((d) => ({
      date: d,
      cats: Object.fromEntries(Object.keys(EXP_CATS).map((k) => [k, 0])),
      total: 0
    }));
    const byDate = Object.fromEntries(buckets.map((b) => [b.date, b]));
    weeklyExpenses.forEach((e) => {
      const b = byDate[e.date];
      if (!b) return;
      b.cats[e.category] = (b.cats[e.category] || 0) + e.amount;
      b.total += e.amount;
    });

    const maxVal = Math.max(...buckets.map((b) => b.total), 1);
    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <section className="space-y-4 animate-in fade-in duration-150">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">💰 Expenses</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Track where your money goes</p>
        </div>

        {/* Overview Box */}
        <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
              Overview
            </span>
            <div className="inline-flex p-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
              {(['daily', 'weekly', 'monthly', 'all'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition capitalize ${
                    filter === mode
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                      : 'text-[var(--text-2)] hover:text-[var(--text)]'
                  }`}
                >
                  {mode === 'daily' ? 'Today' : mode === 'weekly' ? '7D' : mode}
                </button>
              ))}
            </div>
          </div>

          <p className="text-4xl font-extrabold tracking-tight tabular">${totalWeekly.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-2)] mt-1">Spent in the last 7 days</p>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Daily breakdown</h3>
          <button
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-end gap-2 h-44 pt-4">
            {buckets.map((b) => {
              const heightPercent = b.total > 0 ? Math.max((b.total / maxVal) * 100, 8) : 3;
              const dateObj = parseDateStr(b.date);
              return (
                <div key={b.date} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full flex flex-col justify-end rounded-t overflow-hidden bg-[var(--surface-2)]"
                  >
                    {Object.keys(EXP_CATS).map((cat) => {
                      const amt = b.cats[cat];
                      if (!amt || b.total === 0) return null;
                      const segPct = (amt / b.total) * 100;
                      return (
                        <div
                          key={cat}
                          style={{
                            height: `${segPct}%`,
                            backgroundColor: EXP_CATS[cat].color
                          }}
                          title={`${cat}: $${amt.toFixed(2)}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10.5px] font-semibold text-[var(--text-2)] mt-2">
                    {dayLetters[dateObj.getDay()]}
                  </span>
                  <span className="text-[9px] text-[var(--text-3)]">{dateObj.getDate()}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-3 mt-3 border-t border-[var(--border)] justify-center">
            {Object.keys(EXP_CATS).map((cat) => (
              <div key={cat} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-2)]">
                <span className="text-sm">{EXP_CATS[cat].emoji}</span>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 2. Monthly view data
  if (filter === 'monthly') {
    const monthTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const dt = parseDateStr(e.date);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      monthTotals[key] = (monthTotals[key] || 0) + e.amount;
    });

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthTotal = monthTotals[currentMonthKey] || 0;
    const currentMonthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const monthKeys = Object.keys(monthTotals).sort().reverse();
    const maxVal = Math.max(...Object.values(monthTotals), 1);

    return (
      <section className="space-y-4 animate-in fade-in duration-150">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">💰 Expenses</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Track where your money goes</p>
        </div>

        {/* Overview Box */}
        <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
              Overview
            </span>
            <div className="inline-flex p-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
              {(['daily', 'weekly', 'monthly', 'all'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition capitalize ${
                    filter === mode
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                      : 'text-[var(--text-2)] hover:text-[var(--text)]'
                  }`}
                >
                  {mode === 'daily' ? 'Today' : mode === 'weekly' ? '7D' : mode}
                </button>
              ))}
            </div>
          </div>

          <p className="text-4xl font-extrabold tracking-tight tabular">${currentMonthTotal.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-2)] mt-1">{currentMonthLabel}</p>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Month by month</h3>
          <button
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </div>

        {monthKeys.length > 0 ? (
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3.5">
            {monthKeys.map((k) => {
              const [y, m] = k.split('-');
              const label = new Date(+y, +m - 1, 1).toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              });
              const amt = monthTotals[k];
              const pct = Math.max((amt / maxVal) * 100, 4);
              return (
                <div key={k} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">{label}</span>
                    <span className="font-bold tabular">${amt.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-[var(--primary)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
            <div className="text-4xl mb-2.5">🧾</div>
            <p className="text-sm font-semibold text-[var(--text)]">No expenses yet</p>
            <p className="text-xs text-[var(--text-3)] mt-1">Log one to see monthly totals.</p>
          </div>
        )}
      </section>
    );
  }

  // 3. Daily & All views data
  const isAll = filter === 'all';
  const filteredExpenses = expenses
    .filter((e) => isAll || e.date === todayStr)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const totalAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">💰 Expenses</h2>
        <p className="text-xs text-[var(--text-2)] mt-0.5">Track where your money goes</p>
      </div>

      {/* Overview Card */}
      <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            Overview
          </span>
          <div className="inline-flex p-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
            {(['daily', 'weekly', 'monthly', 'all'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition capitalize ${
                  filter === mode
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {mode === 'daily' ? 'Today' : mode === 'weekly' ? '7D' : mode}
              </button>
            ))}
          </div>
        </div>

        <p className="text-4xl font-extrabold tracking-tight tabular">${totalAmount.toFixed(2)}</p>
        <p className="text-xs text-[var(--text-2)] mt-1">
          {isAll ? 'Total across all time' : 'Spent today'}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">{isAll ? 'All expenses' : "Today's expenses"}</h3>
        <button
          onClick={onOpenNewExpense}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filteredExpenses.map((expense) => {
            const catInfo = EXP_CATS[expense.category] || EXP_CATS.Other;
            return (
              <div
                key={expense.id}
                className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{catInfo.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--text)] truncate">
                      {expense.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-2)]">
                      {expense.category} · {expense.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[13.5px] font-bold tabular text-[var(--text)]">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onEditExpense(expense)}
                    title="Edit expense"
                    className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    title="Delete expense"
                    className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--danger)] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
          <div className="text-4xl mb-2.5">🧾</div>
          <p className="text-sm font-semibold text-[var(--text)]">No expenses logged</p>
          <p className="text-xs text-[var(--text-3)] mt-1">Tap &quot;Log&quot; above to record spending.</p>
        </div>
      )}
    </section>
  );
};
