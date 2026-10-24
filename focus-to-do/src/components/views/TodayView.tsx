import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { TaskCard } from '../TaskCard';
import { getTodayStr } from '../../constants';

interface TodayViewProps {
  tasks: Task[];
  activeFocusId: number | null;
  onOpenNewTask: () => void;
  onToggleDone: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onFocusTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  activeFocusId,
  onOpenNewTask,
  onToggleDone,
  onEditTask,
  onFocusTask,
  onDeleteTask
}) => {
  const todayStr = getTodayStr();
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const doneCount = todayTasks.filter((t) => t.done).length;
  const pomosLogged = todayTasks.reduce((acc, t) => acc + (t.act || 0), 0);

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">☀️ Today</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            {todayTasks.length > 0
              ? `${doneCount} of ${todayTasks.length} done · ${pomosLogged} pomodoro${pomosLogged === 1 ? '' : 's'} logged`
              : 'No tasks scheduled'}
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Task List or Empty State */}
      {todayTasks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {todayTasks.map((task) => (
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
          <div className="text-4xl mb-2.5">☕</div>
          <p className="text-sm font-semibold text-[var(--text)]">No tasks for today</p>
          <p className="text-xs text-[var(--text-3)] mt-1">Add one to get started on your focus streak.</p>
        </div>
      )}
    </section>
  );
};
