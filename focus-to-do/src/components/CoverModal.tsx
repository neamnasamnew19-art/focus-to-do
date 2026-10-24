import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { COVER_GRADIENTS, COVER_SOLIDS } from '../constants';

interface CoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCover: string | null;
  onSelectCover: (coverCss: string) => void;
}

export const CoverModal: React.FC<CoverModalProps> = ({
  isOpen,
  onClose,
  currentCover,
  onSelectCover
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setError('URL must start with http:// or https://');
      return;
    }
    setError(null);
    onSelectCover(`url("${trimmed}") center/cover no-repeat`);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setError('File size exceeds 800 KB limit');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onSelectCover(`url("${reader.result}") center/cover no-repeat`);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">Cover</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--hover)] text-[var(--text-2)] hover:text-[var(--text)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gradients */}
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-3)] mb-2">
            Gradients
          </p>
          <div className="grid grid-cols-4 gap-2">
            {COVER_GRADIENTS.map(([name, css]) => {
              const isSelected = currentCover === css;
              return (
                <button
                  key={name}
                  onClick={() => {
                    onSelectCover(css);
                    onClose();
                  }}
                  title={name}
                  style={{ background: css }}
                  className={`h-11 rounded border-2 transition-transform hover:scale-105 active:scale-95 ${
                    isSelected ? 'border-[var(--primary)] ring-2 ring-[var(--primary-soft)]' : 'border-transparent'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Solid Colors */}
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-3)] mb-2">
            Solid Colors
          </p>
          <div className="grid grid-cols-6 gap-2">
            {COVER_SOLIDS.map((color) => {
              const isSelected = currentCover === color;
              return (
                <button
                  key={color}
                  onClick={() => {
                    onSelectCover(color);
                    onClose();
                  }}
                  title={color}
                  style={{ backgroundColor: color }}
                  className={`aspect-square rounded border-2 transition-transform hover:scale-105 active:scale-95 ${
                    isSelected ? 'border-[var(--primary)] ring-2 ring-[var(--primary-soft)]' : 'border-transparent'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Custom URL & Upload */}
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-3)] mb-2">
            Custom Image
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] flex items-center gap-1 transition"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Set</span>
            </button>
          </div>

          <label className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload from device</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {error && <p className="text-xs text-[var(--danger)] mt-2 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};
