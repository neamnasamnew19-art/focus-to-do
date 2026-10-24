import React, { useState } from 'react';
import { AppData } from '../../types';
import { EXP_CATS, formatDuration, getLastNDays, parseDateStr } from '../../constants';

interface AnalyticsViewProps {
  data: AppData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  const [range, setRange] = useState<'week' | 'month'>('week');

  const daysCount = range === 'week' ? 7 : 30;
  const daysList = getLastNDays(daysCount);
  const daySet = new Set(daysList);

  // Focus calculations
  let totalPomos = 0;
  daysList.forEach((d) => {
    totalPomos += data.pomoLog[d] || 0;
  });
  const focusMinutes = totalPomos * 25;

  // Tasks in range
  const tasksInRange = data.tasks.filter((t) => daySet.has(t.date));
  const doneTasks = tasksInRange.filter((t) => t.done).length;
  const taskCompletionRate = tasksInRange.length > 0 ? Math.round((doneTasks / tasksInRange.length) * 100) : 0;

  // Expenses in range
  const expInRange = data.expenses.filter((e) => daySet.has(e.date));
  const totalSpent = expInRange.reduce((acc, e) => acc + e.amount, 0);

  // CGPA calculation
  let totalGpt = 0;
  let totalCredits = 0;
  data.courses.forEach((c) => {
    totalGpt += c.gpt || 0;
    totalCredits += c.credits || 0;
  });
  const cgpa = totalCredits > 0 ? (totalGpt / totalCredits).toFixed(2) : '0.00';

  // Daily focus chart values
  const dailyPomoValues = daysList.map((d) => data.pomoLog[d] || 0);
  const maxPomos = Math.max(...dailyPomoValues, 1);
  const step = range === 'week' ? 1 : 5;
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Expense categories breakdown
  const categoryTotals: Record<string, number> = {};
  Object.keys(EXP_CATS).forEach((cat) => {
    categoryTotals[cat] = 0;
  });
  expInRange.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryRows = Object.keys(EXP_CATS)
    .map((cat) => ({ cat, amount: categoryTotals[cat] }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">📊 Reports</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Focus, tasks, spending &amp; academics</p>
        </div>

        {/* Range Selector */}
        <div className="inline-flex p-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
          <button
            onClick={() => setRange('week')}
            className={`px-3 py-1 text-xs font-semibold rounded transition ${
              range === 'week'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setRange('month')}
            className={`px-3 py-1 text-xs font-semibold rounded transition ${
              range === 'month'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            30D
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            ⏱️ Focus time
          </p>
          <p className="text-2xl font-extrabold tracking-tight mt-1 tabular">
            {formatDuration(focusMinutes)}
          </p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            {totalPomos} pomodoro{totalPomos === 1 ? '' : 's'}
          </p>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            ✅ Tasks
          </p>
          <p className="text-2xl font-extrabold tracking-tight mt-1 tabular">
            {taskCompletionRate}%
          </p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            {doneTasks} of {tasksInRange.length}
          </p>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            💰 Spending
          </p>
          <p className="text-2xl font-extrabold tracking-tight mt-1 tabular">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">In range</p>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            🎓 CGPA
          </p>
          <p className="text-2xl font-extrabold tracking-tight mt-1 tabular text-[var(--primary)]">
            {cgpa}
          </p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Cumulative</p>
        </div>
      </div>

      {/* Daily Focus Chart */}
      <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-3)] mb-3">
          🔥 Daily Focus
        </h3>
        <div className="flex items-end gap-1 h-32 pt-3">
          {daysList.map((dStr, idx) => {
            const count = dailyPomoValues[idx];
            const heightPercent = count > 0 ? Math.max(8, (count / maxPomos) * 100) : 3;
            const dateObj = parseDateStr(dStr);
            const showLabel = range === 'week' || idx % step === 0 || idx === daysList.length - 1;
            const label = range === 'week' ? dayLetters[dateObj.getDay()] : showLabel ? String(dateObj.getDate()) : '';

            return (
              <div
                key={dStr}
                className="flex-1 flex flex-col items-center justify-end h-full min-w-0 group"
                title={`${dStr}: ${count} pomodoros (${count * 25}m)`}
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xs transition-all ${
                    count > 0 ? 'bg-[var(--primary)] group-hover:opacity-85' : 'bg-[var(--surface-3)]'
                  }`}
                />
                <span className="text-[9.5px] font-semibold text-[var(--text-3)] mt-1.5 h-3 truncate">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-3)] mb-3">
          💸 Spending by Category
        </h3>

        {categoryRows.length > 0 ? (
          <div className="space-y-3">
            {categoryRows.map(({ cat, amount }) => {
              const catInfo = EXP_CATS[cat] || EXP_CATS.Other;
              const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-sm">{catInfo.emoji}</span>
                      <span>{cat}</span>
                    </span>
                    <span className="text-[var(--text-2)] font-semibold tabular">
                      ${amount.toFixed(2)} · {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: catInfo.color }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-center text-[var(--text-3)] py-4">No expenses recorded in this period.</p>
        )}
      </div>
    </section>
  );
};
