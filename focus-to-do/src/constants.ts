import { EventCategory } from './types';

export const STORE_KEY = 'focus_todo_v4';
export const TIMER_KEY = 'focus_todo_timer';
export const THEME_KEY = 'focus_todo_theme';
export const DEFAULT_ICON = '⏱️';

export const EVENT_CATS: Record<EventCategory, { emoji: string; color: string }> = {
  Study:      { emoji: '📖', color: '#2383e2' },
  Assignment: { emoji: '✏️', color: '#d9730d' },
  Class:      { emoji: '🎓', color: '#0f7b6c' },
  Exam:       { emoji: '📝', color: '#eb5757' },
  Personal:   { emoji: '🌿', color: '#9065b0' },
  Other:      { emoji: '📌', color: '#787774' }
};

export const POMO_CATS: EventCategory[] = ['Study', 'Assignment'];

export const EXP_CATS: Record<string, { emoji: string; color: string }> = {
  Food:          { emoji: '🍔', color: '#d9730d' },
  Books:         { emoji: '📚', color: '#2383e2' },
  Transport:     { emoji: '🚌', color: '#0f7b6c' },
  Housing:       { emoji: '🏠', color: '#9065b0' },
  Entertainment: { emoji: '🎮', color: '#eb5757' },
  Other:         { emoji: '📦', color: '#787774' }
};

export const MODES = {
  pomo:  { label: 'Focus',       seconds: 1500, stroke: '#2383e2' },
  short: { label: 'Short Break', seconds: 300,  stroke: '#0f7b6c' },
  long:  { label: 'Long Break',  seconds: 900,  stroke: '#9065b0' }
};

export const RING_RADIUS = 88;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // 552.92

export const EMOJIS: Record<string, string[]> = {
  '⭐': ['⏱️','🍅','🎯','🔥','⚡','💡','✅','📝','📚','🚀','🌱','💪','🧠','🎓','🏆','⭐','💯','🎨','🎵','☕','🌙','☀️','✨','💎','🎁','🔑','🧩','🏅','🗓️','🎉'],
  '😊': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😎','🤓','🧐','🤔','😴','🤗','🤭','🤫','😢','😭','😤','😡','🥺','😳','🥶','😱','🤯','😷','🤒','🤕'],
  '🌿': ['🌸','🌺','🌻','🌷','🌹','🌾','🌿','☘️','🍀','🍃','🍂','🍁','🌱','🌲','🌳','🌴','🌵','🌈','☀️','🌙','⭐','✨','⚡','🔥','🌊','💧','☔','🌍'],
  '🍔': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🥭','🍍','🥝','🍅','🥑','🍆','🥕','🌽','🥒','🥬','🥦','🍄','🍞','🧀','🥚','🍳','🍔','🍟','🍕','🌭','🥪','🌮','🍝','🍜','🍲','🍣','🍱','🍙','🍰','🎂','🍫','🍩','🍪','☕','🍵','🥤'],
  '📚': ['⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🕹️','💾','📷','📹','🎥','📞','📺','📻','🎙️','⏱️','⏰','⌛','📡','🔋','🔌','💡','🔦','🕯️','💰','💳','💎','🔧','🔨','⚙️','🔬','🔭','💊','💉','🧬','🧪','🌡️','🔑','🗝️','🚪','🪑','🛋️','🛏️','🧸','🎁','🎈','🎀','✉️','📧','💌','📦','📜','📄','📊','📈','📉','🗓️','📅','🗑️','📋','📁','📂','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🔗','📎','📐','📏','🧮','📌','📍','✂️','🖊️','✒️','🖌️','🖍️','📝','✏️','🔍','🔎','🔒','🔓'],
  '❤️': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','❌','⭕','✅','⚠️','♻️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷'],
  '⚽': ['⚽','🏀','🏈','⚾','🎾','🏐','🎱','🏓','🏸','🏒','⛳','🏹','🎣','🥊','🥋','🎽','🛹','🎿','🏂','🏋️','🤸','🏄','🏊','🚴','🏆','🥇','🥈','🥉','🎖️','🎫','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','🎯','🎳','🎮','🎰'],
  '✈️': ['🚗','🚕','🚙','🚌','🏎️','🚓','🚑','🚒','🚐','🚚','🚲','🛵','🏍️','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🚀','🚁','⛵','🚢','⚓','🗺️','🗽','🗼','🏰','🏯','🎡','🎢','🏖️','🏝️','🌋','⛰️','🏔️','🏕️','⛺','🏠','🏡','🏢','🏬','🏥','🏦','🏨','🏪','🏫','🌅','🌄','🌆','🌃']
};

export const COVER_GRADIENTS: [string, string][] = [
  ['sunrise', 'linear-gradient(135deg,#f6d365 0%,#fda085 100%)'],
  ['peach', 'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)'],
  ['rose', 'linear-gradient(135deg,#ff9a9e 0%,#fecfef 100%)'],
  ['lavender', 'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)'],
  ['ocean', 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'],
  ['sky', 'linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%)'],
  ['mint', 'linear-gradient(135deg,#a8edea 0%,#fed6e3 100%)'],
  ['forest', 'linear-gradient(135deg,#d4fc79 0%,#96e6a1 100%)'],
  ['citrus', 'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)'],
  ['aurora', 'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)'],
  ['flamingo', 'linear-gradient(135deg,#ff9a9e 0%,#fad0c4 100%)'],
  ['dusk', 'linear-gradient(135deg,#30cfd0 0%,#330867 100%)']
];

export const COVER_SOLIDS: string[] = [
  '#e3e2e0', '#eedfd5', '#fadec9', '#fdecc8', '#dbeddb', '#d3e5ef',
  '#e8deee', '#f5e0e9', '#ffe2dd', '#eef1f3', '#f0e3dd', '#e1e7ec'
];

export const COURSE_PRESETS = [
  { label: 'Entrepreneurship · 3 cr', value: 'Entrepreneurship (Entr1006)|3' },
  { label: 'Communicative English I · 3 cr', value: 'Communicative Language Skills I (FLEn 1003)|3' },
  { label: 'Geography of Ethiopia · 3 cr', value: 'Geography of Ethiopia and the Horn (GeEs 1005)|3' },
  { label: 'Math for Natural Science · 3 cr', value: 'Mathematics for Natural Science (Math 1007)|3' },
  { label: 'Logic & Critical Thinking · 3 cr', value: 'Logic and Critical Thinking (Phil 1009)|3' },
  { label: 'General Psychology · 3 cr', value: 'General Psychology (Psyc 1011)|3' },
  { label: 'Social Anthropology · 2 cr', value: 'Social Anthropology (Anth 1002)|2' },
  { label: 'General Physics · 3 cr', value: 'General Physics (Phys 1001)|3' },
  { label: 'Communicative English II · 3 cr', value: 'Communicative English Skills II (FLEn 1004)|3' },
  { label: 'Emerging Technology · 3 cr', value: 'Introduction to Emerging Technology (EmTe 1008)|3' },
  { label: 'General Chemistry · 3 cr', value: 'General Chemistry (Chem 1006)|3' },
  { label: 'Global Trend · 2 cr', value: 'Global Trend (GLTr 2011)|2' },
  { label: 'Inclusiveness · 2 cr', value: 'Inclusiveness (Incl 1010)|2' },
  { label: 'Moral & Civic Education · 2 cr', value: 'Moral and Civic Education (MCiE 1012)|2' },
  { label: 'Economics · 3 cr', value: 'Economics (Econ 2009)|3' },
  { label: 'History of Ethiopia · 3 cr', value: 'History of Ethiopia and the Horn (Hist 2002)|3' },
  { label: 'Applied Math IA · 4 cr', value: 'Applied Mathematics IA (Math 1014)|4' },
  { label: 'Applied Math IB · 4 cr', value: 'Applied Mathematics IB (Math 1014)|4' },
  { label: 'Applied Math IIB · 4 cr', value: 'Applied Mathematics IIB (Math 2007)|4' }
];

export function getGradeFor(total: number, final: number): { letter: string; vlg: number; status: string } {
  if (final < 20) return { letter: 'F', vlg: 0, status: 'Fail — final exam below 40%' };
  if (total >= 90) return { letter: 'A+', vlg: 4.0, status: 'Excellent' };
  if (total >= 85) return { letter: 'A',  vlg: 4.0, status: 'Excellent' };
  if (total >= 80) return { letter: 'A-', vlg: 3.75, status: 'Excellent' };
  if (total >= 75) return { letter: 'B+', vlg: 3.5,  status: 'Very Good' };
  if (total >= 70) return { letter: 'B',  vlg: 3.0,  status: 'Very Good' };
  if (total >= 65) return { letter: 'B-', vlg: 2.75, status: 'Good' };
  if (total >= 60) return { letter: 'C+', vlg: 2.5,  status: 'Good' };
  if (total >= 50) return { letter: 'C',  vlg: 2.0,  status: 'Satisfactory' };
  if (total >= 45) return { letter: 'C-', vlg: 1.75, status: 'Unsatisfactory' };
  if (total >= 40) return { letter: 'D',  vlg: 1.0,  status: 'Very Poor' };
  return { letter: 'F', vlg: 0, status: 'Fail' };
}

export function playCompletionBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration + 0.05);
    };
    playNote(880, 0, 0.35);
    playNote(1174, 0.22, 0.5);
    setTimeout(() => ctx.close(), 1500);
  } catch (err) {
    console.warn('Audio playback error', err);
  }
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseDateStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const mm = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}

export function getLastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return out;
}
