import React, { useState } from 'react';
import { X, Shuffle } from 'lucide-react';
import { EMOJIS } from '../constants';

interface EmojiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onRemoveEmoji: () => void;
}

export const EmojiModal: React.FC<EmojiModalProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  onRemoveEmoji
}) => {
  const [activeTab, setActiveTab] = useState('⭐');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const tabs = Object.keys(EMOJIS);
  const currentList = EMOJIS[activeTab] || [];

  // If searching:
  let displayedEmojis = currentList;
  if (search.trim()) {
    const q = search.trim();
    // check if user typed an actual emoji directly
    const directMatches = [...q].filter(ch => /\p{Extended_Pictographic}/u.test(ch));
    const all = Array.from(new Set(Object.values(EMOJIS).flat()));
    displayedEmojis = [...directMatches, ...all.slice(0, 160)];
  }

  const handleRandom = () => {
    const all = Object.values(EMOJIS).flat();
    const pick = all[Math.floor(Math.random() * all.length)];
    onSelectEmoji(pick);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 shadow-xl text-[var(--text)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base">Pick an icon</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRandom}
              title="Random icon"
              className="p-1.5 rounded hover:bg-[var(--hover)] text-[var(--text-2)] hover:text-[var(--text)] transition"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onRemoveEmoji();
                onClose();
              }}
              className="text-xs font-semibold px-2 py-1 rounded text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
            >
              Remove
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[var(--hover)] text-[var(--text-2)] hover:text-[var(--text)] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter or paste any emoji..."
          className="w-full px-3 py-1.5 mb-3 text-sm rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition placeholder:text-[var(--text-3)]"
        />

        {/* Category Tabs */}
        {!search && (
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-[var(--border)]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg px-2.5 py-1 rounded transition ${
                  activeTab === tab
                    ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'hover:bg-[var(--hover)] text-[var(--text-2)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Emojis Grid */}
        <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto p-1">
          {displayedEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => {
                onSelectEmoji(emoji);
                onClose();
              }}
              className="aspect-square flex items-center justify-center text-xl rounded hover:bg-[var(--hover)] hover:scale-115 active:scale-95 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
