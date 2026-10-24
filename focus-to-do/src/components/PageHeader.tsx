import React, { useState } from 'react';
import { Image as ImageIcon, X, Smile } from 'lucide-react';
import { PageState } from '../types';

interface PageHeaderProps {
  page: PageState;
  onOpenEmoji: () => void;
  onOpenCover: () => void;
  onRemoveCover: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  page,
  onOpenEmoji,
  onOpenCover,
  onRemoveCover
}) => {
  const [coverHover, setCoverHover] = useState(false);
  const [iconHover, setIconHover] = useState(false);

  return (
    <div className="relative w-full">
      {/* Cover Banner */}
      {page.cover && (
        <div
          className="relative h-44 w-full overflow-hidden transition-all duration-200"
          onMouseEnter={() => setCoverHover(true)}
          onMouseLeave={() => setCoverHover(false)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ background: page.cover }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* Cover Controls (Hover) */}
          <div
            className={`absolute right-4 top-4 flex items-center gap-1.5 transition-opacity duration-150 ${
              coverHover ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={onOpenCover}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-sm transition"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Change cover</span>
            </button>
            <button
              onClick={onRemoveCover}
              title="Remove cover"
              className="w-7 h-7 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-sm transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Icon & Cover Add Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className={`flex items-center gap-2 transition-all duration-200 ${
            page.cover ? '-mt-12' : 'mt-5'
          }`}
          onMouseEnter={() => setIconHover(true)}
          onMouseLeave={() => setIconHover(false)}
        >
          <button
            onClick={onOpenEmoji}
            title="Change icon"
            className={`rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${
              page.icon
                ? 'text-5xl sm:text-6xl p-1 -ml-1 leading-none drop-shadow-sm select-none'
                : 'text-xs font-semibold px-2.5 py-1.5 border border-dashed border-[var(--border-strong)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--primary)]'
            }`}
          >
            {page.icon || '+ Add icon'}
          </button>

          <div
            className={`flex items-center gap-1 transition-opacity duration-150 ${
              iconHover ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={onOpenEmoji}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Change icon</span>
            </button>

            {!page.cover && (
              <button
                onClick={onOpenCover}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Add cover</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
