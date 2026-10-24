import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { TaskCard } from '../TaskCard';
import { getTodayStr } from '../../constants';

interface UpcomingViewProps {
  tasks: Task[];
  activeFocusId: number | null;
  onOpenNewTask: () => void;
  onToggleDone: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onFocusTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const UpcomingView: React.FC<UpcomingViewProps> = ({
  tasks,
  activeFocusId,
  onOpenNewTask,
  onToggleDone,
  onEditTask,
  onFocusTask,
  onDeleteTask
}) => {
  const todayStr = getTodayStr();
  const upcomingTasks = tasks
    .filter((t) => t.date !== todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">📅 Upcoming</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Tasks scheduled ahead</p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {upcomingTasks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isFocused={activeFocusId === task.id}
              onToggleDone={onToggleDone}
              onEdit={onEditTask}
              onFocus={onFocusTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
          <div className="text-4xl mb-2.5">📅</div>
          <p className="text-sm font-semibold text-[var(--text)]">Nothing upcoming</p>
          <p className="text-xs text-[var(--text-3)] mt-1">Your future tasks and deadlines will appear here.</p>
        </div>
      )}
    </section>
  );
};
