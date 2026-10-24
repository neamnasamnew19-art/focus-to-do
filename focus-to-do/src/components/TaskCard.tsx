import React from 'react';
import { Check, Play, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { EVENT_CATS, getTodayStr } from '../constants';

interface TaskCardProps {
  task: Task;
  isFocused: boolean;
  onToggleDone: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onFocus: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isFocused,
  onToggleDone,
  onEdit,
  onFocus,
  onDelete
}) => {
  const isToday = task.date === getTodayStr();
  const maxShown = Math.min(task.est, 6);

  return (
    <div
      className={`p-3 rounded-md border transition-all duration-150 flex items-start gap-3 ${
        isFocused
          ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleDone(task.id)}
        aria-label="Toggle task"
        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition shrink-0 ${
          task.done
            ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
            : 'border-[var(--border-strong)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]'
        }`}
      >
        {task.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <p
          onClick={() => onEdit(task)}
          className={`text-[13.5px] font-semibold leading-snug cursor-pointer hover:text-[var(--primary)] transition ${
            task.done ? 'line-through text-[var(--text-2)]' : 'text-[var(--text)]'
          }`}
        >
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {/* Tomato Dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxShown }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full border border-[var(--primary)] ${
                  i < task.act ? 'bg-[var(--primary)]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {task.est > 6 && (
            <span className="text-[10px] text-[var(--text-2)] tabular font-mono">
              +{task.est - 6}
            </span>
          )}

          <span className="text-[11px] font-semibold tabular text-[var(--text-2)]">
            {task.act}/{task.est}
          </span>

          <span className="text-[11px] text-[var(--text-3)]">·</span>

          <span className="text-[11px] text-[var(--text-2)]">
            {isToday ? 'Today' : task.date}
          </span>

          {task.cat && EVENT_CATS[task.cat as keyof typeof EVENT_CATS] && (
            <span
              style={{
                backgroundColor: `${EVENT_CATS[task.cat as keyof typeof EVENT_CATS].color}1a`,
                color: EVENT_CATS[task.cat as keyof typeof EVENT_CATS].color
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded"
            >
              <span>{EVENT_CATS[task.cat as keyof typeof EVENT_CATS].emoji}</span>
              <span>{task.cat}</span>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onFocus(task.id)}
          title="Focus this task"
          className={`w-7 h-7 rounded flex items-center justify-center transition ${
            isFocused
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)]'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          title="Delete task"
          className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--danger)] transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
