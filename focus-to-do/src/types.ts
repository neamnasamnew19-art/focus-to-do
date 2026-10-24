export interface Task {
  id: number;
  title: string;
  est: number; // estimated pomodoros
  act: number; // completed pomodoros
  date: string; // YYYY-MM-DD
  done: boolean;
  log?: Record<string, number>; // date -> count
  eventId?: number;
  cat?: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: 'Food' | 'Books' | 'Transport' | 'Housing' | 'Entertainment' | 'Other';
  date: string; // YYYY-MM-DD
}

export interface Course {
  id: number;
  title: string;
  credits: number;
  continuous: number; // out of 50
  finalExam: number;  // out of 50
  totalMark: number;  // continuous + finalExam
  letter: string;     // A+, A, A-, B+, B, B-, C+, C, C-, D, F
  vlg: number;        // grade point: 4.0, 3.75, 3.5, 3.0, 2.75, 2.5, 2.0, 1.75, 1.0, 0
  status: string;
  gpt: number;        // vlg * credits
}

export type EventCategory = 'Study' | 'Assignment' | 'Class' | 'Exam' | 'Personal' | 'Other';

export interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: EventCategory;
  linkedTaskId?: number | null;
  est?: number | null;
  isGoogleEvent?: boolean;
  googleEventId?: string;
}

export interface TimetableSlot {
  id: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string; // "08:30"
  endTime: string;   // "10:30"
  courseTitle: string;
  room: string;
  instructor?: string;
  color?: string;
}

export interface Flashcard {
  id: number;
  subject: string;
  front: string;
  back: string;
  mastery: 'learning' | 'review' | 'mastered';
}

export interface PageState {
  icon: string | null;
  cover: string | null;
}

export interface AppData {
  tasks: Task[];
  expenses: Expense[];
  courses: Course[];
  events: CalendarEvent[];
  timetable: TimetableSlot[];
  flashcards: Flashcard[];
  pomoLog: Record<string, number>; // date -> count
  energy: number;
  page: PageState;
}

export type TimerMode = 'pomo' | 'short' | 'long';

export interface TimerState {
  mode: TimerMode;
  running: boolean;
  endAt: number | null;
  remaining: number; // seconds
  total: number;
  taskId: number | null;
}

export type ActiveTab =
  | 'today'
  | 'upcoming'
  | 'pomo'
  | 'analytics'
  | 'expenses'
  | 'gpa'
  | 'events'
  | 'timetable'
  | 'flashcards'
  | 'widget'
  | 'settings';
