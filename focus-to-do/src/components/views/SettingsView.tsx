import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';
import { AppData } from '../../types';
import { getTodayStr } from '../../constants';

interface SettingsViewProps {
  data: AppData;
  onImportData: (data: AppData) => void;
  onResetAllData: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  data,
  onImportData,
  onResetAllData,
  onShowToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-todo-${getTodayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Backup downloaded successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid format');
        }
        onImportData(parsed as AppData);
      } catch (err) {
        onShowToast('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">⚙️ Settings</h2>
        <p className="text-xs text-[var(--text-2)] mt-0.5">Backup, restore &amp; data management</p>
      </div>

      {/* Backup & Restore */}
      <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <span>📤 Backup &amp; restore</span>
        </h3>
        <p className="text-xs text-[var(--text-2)] leading-relaxed mb-4">
          Your tasks, expenses, GPA courses, calendar events, and pomodoros are saved securely in your browser&apos;s localStorage. Export a backup anytime to transfer across devices.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={handleExport}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Where is my data? */}
      <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-[var(--primary)]" />
          <span>Where is my data stored?</span>
        </h3>
        <p className="text-xs text-[var(--text-2)] font-mono leading-relaxed break-all bg-[var(--surface-2)] p-2.5 rounded border border-[var(--border)]">
          Browser localStorage (Storage key: focus_todo_v4)
        </p>
        <p className="text-[11px] text-[var(--text-3)] mt-2">
          Total items: {data.tasks.length} tasks · {data.expenses.length} expenses · {data.courses.length} courses · {data.events.length} events · {data.energy}⚡ energy
        </p>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-lg border border-[var(--danger-soft)] bg-[var(--surface)]">
        <h3 className="text-sm font-bold text-[var(--danger)] flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-xs text-[var(--text-2)] leading-relaxed mb-4">
          Wipes all tasks, expenses, course grades, calendar events, and pomodoro history. This cannot be undone.
        </p>
        <button
          onClick={onResetAllData}
          className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded bg-[var(--danger-soft)] hover:bg-[var(--danger)] text-[var(--danger)] hover:text-white border border-[var(--danger-soft)] transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Erase all data</span>
        </button>
      </div>
    </section>
  );
};
