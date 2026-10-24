import React, { useState } from 'react';
import { Plus, RotateCw, CheckCircle, Brain, BookOpen, Trash2 } from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onAddCard: (card: Omit<Flashcard, 'id'>) => void;
  onUpdateMastery: (cardId: number, mastery: Flashcard['mastery']) => void;
  onDeleteCard: (cardId: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  onAddCard,
  onUpdateMastery,
  onDeleteCard
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [subject, setSubject] = useState('General');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const subjects = ['All', ...Array.from(new Set(cards.map((c) => c.subject)))];
  const activeDeck = cards.filter((c) => selectedSubject === 'All' || c.subject === selectedSubject);
  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, activeDeck.length));
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    onAddCard({
      subject: subject.trim() || 'General',
      front: front.trim(),
      back: back.trim(),
      mastery: 'learning'
    });

    setFront('');
    setBack('');
    setModalOpen(false);
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">🧠 Revision Flashcards</h2>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            Active recall &amp; spaced repetition exam study deck
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Card</span>
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSelectedSubject(s);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded transition shrink-0 ${
              selectedSubject === s
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-2)] border border-[var(--border)]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Flashcard Active Viewer */}
      {currentCard ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[220px] sm:min-h-[260px] p-6 sm:p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] cursor-pointer transition-all shadow-md flex flex-col justify-between select-none relative group"
          >
            <div className="flex items-center justify-between text-xs text-[var(--text-3)] font-semibold">
              <span className="px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary)] font-bold">
                {currentCard.subject}
              </span>
              <span>{isFlipped ? 'Answer' : 'Question (Click to flip)'}</span>
            </div>

            <div className="my-auto py-6 text-center">
              <p
                className={`text-base sm:text-lg font-bold leading-relaxed ${
                  isFlipped ? 'text-[var(--primary)]' : 'text-[var(--text)]'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-3)] pt-2 border-t border-[var(--border)]">
              <span>Card {currentIndex + 1} of {activeDeck.length}</span>
              <span className="flex items-center gap-1 text-[var(--text-2)]">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap to flip</span>
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateMastery(currentCard.id, 'learning')}
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                  currentCard.mastery === 'learning'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold'
                    : 'bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]'
                }`}
              >
                Learning
              </button>
              <button
                onClick={() => onUpdateMastery(currentCard.id, 'review')}
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                  currentCard.mastery === 'review'
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/30 font-bold'
                    : 'bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]'
                }`}
              >
                Reviewing
              </button>
              <button
                onClick={() => onUpdateMastery(currentCard.id, 'mastered')}
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                  currentCard.mastery === 'mastered'
                    ? 'bg-green-500/10 text-green-500 border-green-500/30 font-bold'
                    : 'bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]'
                }`}
              >
                Mastered
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDeleteCard(currentCard.id)}
                title="Delete this card"
                className="w-8 h-8 rounded flex items-center justify-center text-[var(--text-3)] hover:text-red-500 hover:bg-[var(--hover)] transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 text-xs font-bold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition active:scale-95"
              >
                Next Card →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
          <div className="text-4xl mb-2.5">🧠</div>
          <p className="text-sm font-semibold text-[var(--text)]">No flashcards in this deck</p>
          <p className="text-xs text-[var(--text-3)] mt-1">Tap &quot;New Card&quot; to add key terms or formulas.</p>
        </div>
      )}

      {/* New Flashcard Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl text-[var(--text)]">
            <h3 className="text-base font-bold mb-4">New Flashcard</h3>

            <form onSubmit={handleCreateCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Subject / Course
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Emerging Technology"
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Question / Concept (Front)
                </label>
                <textarea
                  rows={2}
                  required
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="e.g. What is the difference between AI, Machine Learning, and Deep Learning?"
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                  Answer / Definition (Back)
                </label>
                <textarea
                  rows={3}
                  required
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="e.g. AI is the broad concept; ML is the technique of training algorithms on data; Deep Learning uses multi-layered neural networks."
                  className="w-full px-3 py-1.5 text-xs rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--text)] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
