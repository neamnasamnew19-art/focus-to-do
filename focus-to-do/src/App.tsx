import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  AppData,
  Task,
  Expense,
  Course,
  CalendarEvent,
  TimetableSlot,
  Flashcard,
  TimerState,
  TimerMode,
  ActiveTab
} from './types';
import {
  STORE_KEY,
  TIMER_KEY,
  THEME_KEY,
  DEFAULT_ICON,
  MODES,
  getTodayStr,
  playCompletionBeep
} from './constants';

import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken
} from './services/googleAuth';
import {
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent
} from './services/googleCalendar';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { PageHeader } from './components/PageHeader';
import { FocusBanner } from './components/FocusBanner';
import { FloatingWidget } from './components/FloatingWidget';

import { TodayView } from './components/views/TodayView';
import { UpcomingView } from './components/views/UpcomingView';
import { PomodoroView } from './components/views/PomodoroView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ExpensesView } from './components/views/ExpensesView';
import { GpaView } from './components/views/GpaView';
import { CalendarView } from './components/views/CalendarView';
import { TimetableView } from './components/views/TimetableView';
import { FlashcardsView } from './components/views/FlashcardsView';
import { SamsungWidgetView } from './components/views/SamsungWidgetView';
import { SettingsView } from './components/views/SettingsView';

import { TaskModal } from './components/TaskModal';
import { ExpenseModal } from './components/ExpenseModal';
import { GpaModal } from './components/GpaModal';
import { EventModal } from './components/EventModal';
import { EmojiModal } from './components/EmojiModal';
import { CoverModal } from './components/CoverModal';
import { ConfirmModal } from './components/ConfirmModal';

// Sample data with University presets
function getInitialData(): AppData {
  const today = getTodayStr();
  return {
    tasks: [
      {
        id: 101,
        title: 'Review Chapter 4: Emerging Technology Notes',
        est: 3,
        act: 1,
        date: today,
        done: false,
        log: { [today]: 1 },
        cat: 'Study'
      },
      {
        id: 102,
        title: 'Communicative English Presentation Prep',
        est: 2,
        act: 2,
        date: today,
        done: true,
        log: { [today]: 2 },
        cat: 'Assignment'
      },
      {
        id: 103,
        title: 'Complete Applied Math Problem Set 2',
        est: 4,
        act: 0,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        done: false,
        log: {}
      }
    ],
    expenses: [
      {
        id: 201,
        title: 'Lunch at Student Cafeteria',
        amount: 4.5,
        category: 'Food',
        date: today
      },
      {
        id: 202,
        title: 'Notebooks & Highlighters',
        amount: 8.2,
        category: 'Books',
        date: today
      }
    ],
    courses: [
      {
        id: 301,
        title: 'Introduction to Emerging Technology (EmTe 1008)',
        credits: 3,
        continuous: 42,
        finalExam: 45,
        totalMark: 87,
        letter: 'A',
        vlg: 4.0,
        status: 'Excellent',
        gpt: 12.0
      },
      {
        id: 302,
        title: 'Applied Mathematics IA (Math 1014)',
        credits: 4,
        continuous: 38,
        finalExam: 39,
        totalMark: 77,
        letter: 'B+',
        vlg: 3.5,
        status: 'Very Good',
        gpt: 14.0
      }
    ],
    events: [
      {
        id: 401,
        title: 'Emerging Technology Quiz Revision',
        date: today,
        category: 'Study',
        linkedTaskId: 101,
        est: 3
      }
    ],
    timetable: [
      {
        id: 501,
        day: 'Mon',
        startTime: '08:30',
        endTime: '10:30',
        courseTitle: 'Applied Math IA (Math 1014)',
        room: 'Science Hall 204',
        instructor: 'Dr. Tadesse'
      },
      {
        id: 502,
        day: 'Mon',
        startTime: '11:00',
        endTime: '12:30',
        courseTitle: 'Introduction to Emerging Tech (EmTe 1008)',
        room: 'Lab 3B',
        instructor: 'Prof. Helen'
      },
      {
        id: 503,
        day: 'Wed',
        startTime: '09:00',
        endTime: '11:00',
        courseTitle: 'Communicative English Skills I',
        room: 'Language Dept 102',
        instructor: 'Mr. Dawit'
      },
      {
        id: 504,
        day: 'Thu',
        startTime: '14:00',
        endTime: '16:00',
        courseTitle: 'Logic and Critical Thinking (Phil 1009)',
        room: 'Social Sciences Room 12',
        instructor: 'Dr. Bekele'
      }
    ],
    flashcards: [
      {
        id: 601,
        subject: 'Emerging Technology',
        front: 'What are the 3 core layers of the Internet of Things (IoT) architecture?',
        back: '1. Perception Layer (Sensors/Actuators)\n2. Network Layer (Transmission/Gateways)\n3. Application Layer (User Interfaces/Services)',
        mastery: 'learning'
      },
      {
        id: 602,
        subject: 'Applied Math',
        front: 'What is the Derivative of tan(x)?',
        back: 'sec²(x)',
        mastery: 'mastered'
      },
      {
        id: 603,
        subject: 'Logic',
        front: 'What is an Ad Hominem Fallacy?',
        back: 'Attacking the person making the argument rather than addressing the substance of the argument itself.',
        mastery: 'review'
      }
    ],
    pomoLog: { [today]: 3 },
    energy: 30,
    page: {
      icon: DEFAULT_ICON,
      cover: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'
    }
  };
}

export default function App() {
  // App Data State
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
            expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
            courses: Array.isArray(parsed.courses) ? parsed.courses : [],
            events: Array.isArray(parsed.events) ? parsed.events : [],
            timetable: Array.isArray(parsed.timetable) ? parsed.timetable : getInitialData().timetable,
            flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : getInitialData().flashcards,
            pomoLog: parsed.pomoLog && typeof parsed.pomoLog === 'object' ? parsed.pomoLog : {},
            energy: typeof parsed.energy === 'number' ? parsed.energy : 0,
            page: parsed.page && typeof parsed.page === 'object' ? parsed.page : { icon: DEFAULT_ICON, cover: null }
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored data', e);
    }
    return getInitialData();
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [data]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [floatingWidgetEnabled, setFloatingWidgetEnabled] = useState(false);

  // Active Focus Task ID
  const [activeFocusId, setActiveFocusId] = useState<number | null>(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toast System
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Google Calendar Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);

  useEffect(() => {
    initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
  }, []);

  // Handle URL shortcut actions (PWA Samsung A32 shortcuts)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const action = searchParams.get('action');
    if (action === 'timer') {
      setActiveTab('pomo');
    } else if (action === 'today') {
      setActiveTab('today');
    } else if (action === 'expense') {
      setActiveTab('expenses');
      setExpenseToEdit(null);
      setExpenseModalOpen(true);
    } else if (action === 'events') {
      setActiveTab('events');
    } else if (action === 'gpa') {
      setActiveTab('gpa');
    }
  }, []);

  // Timer State
  const [timer, setTimer] = useState<TimerState>(() => {
    try {
      const stored = localStorage.getItem(TIMER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && MODES[parsed.mode as TimerMode]) {
          let rem = parsed.remaining;
          let isRunning = parsed.running;
          if (isRunning && parsed.endAt) {
            const calculatedRem = Math.max(0, Math.round((parsed.endAt - Date.now()) / 1000));
            if (calculatedRem <= 0) {
              isRunning = false;
              rem = parsed.total;
            } else {
              rem = calculatedRem;
            }
          }
          return {
            mode: parsed.mode,
            running: isRunning,
            endAt: isRunning ? parsed.endAt : null,
            remaining: rem ?? MODES[parsed.mode as TimerMode].seconds,
            total: parsed.total ?? MODES[parsed.mode as TimerMode].seconds,
            taskId: parsed.taskId ?? null
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse timer state', e);
    }
    return {
      mode: 'pomo',
      running: false,
      endAt: null,
      remaining: 1500,
      total: 1500,
      taskId: null
    };
  });

  // Sync activeFocusId with timer.taskId
  useEffect(() => {
    if (timer.taskId && !activeFocusId) {
      setActiveFocusId(timer.taskId);
    }
  }, [timer.taskId, activeFocusId]);

  // Save Timer to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
    } catch (e) {
      console.warn('Failed to save timer', e);
    }
  }, [timer]);

  // Complete session callback
  const handleSessionComplete = useCallback((skipped: boolean) => {
    const finishedMode = timer.mode;

    setTimer((prev) => ({
      ...prev,
      running: false,
      endAt: null
    }));

    if (finishedMode === 'pomo' && !skipped) {
      const today = getTodayStr();
      playCompletionBeep();
      showToast('🍅 Session complete — +10 energy');

      setData((prev) => {
        const newPomoLog = {
          ...prev.pomoLog,
          [today]: (prev.pomoLog[today] || 0) + 1
        };
        const newEnergy = (prev.energy || 0) + 10;
        let newTasks = prev.tasks;

        if (timer.taskId) {
          newTasks = prev.tasks.map((t) => {
            if (t.id === timer.taskId) {
              return {
                ...t,
                act: (t.act || 0) + 1,
                log: {
                  ...(t.log || {}),
                  [today]: ((t.log || {})[today] || 0) + 1
                }
              };
            }
            return t;
          });
        }

        const countToday = newPomoLog[today] || 0;
        const nextMode: TimerMode = countToday % 4 === 0 ? 'long' : 'short';

        setTimer((tPrev) => ({
          ...tPrev,
          mode: nextMode,
          total: MODES[nextMode].seconds,
          remaining: MODES[nextMode].seconds,
          running: false,
          endAt: null
        }));

        return {
          ...prev,
          tasks: newTasks,
          pomoLog: newPomoLog,
          energy: newEnergy
        };
      });
    } else if (finishedMode !== 'pomo' && !skipped) {
      playCompletionBeep();
      showToast('Break over — ready to focus?');
      setTimer((prev) => ({
        ...prev,
        mode: 'pomo',
        total: MODES.pomo.seconds,
        remaining: MODES.pomo.seconds,
        running: false,
        endAt: null
      }));
    } else {
      setTimer((prev) => ({
        ...prev,
        mode: 'pomo',
        total: MODES.pomo.seconds,
        remaining: MODES.pomo.seconds,
        running: false,
        endAt: null
      }));
    }
  }, [timer.mode, timer.taskId, showToast]);

  // Timer Tick Interval
  useEffect(() => {
    if (!timer.running) return;

    const interval = setInterval(() => {
      if (!timer.endAt) return;
      const rem = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
      if (rem <= 0) {
        clearInterval(interval);
        handleSessionComplete(false);
      } else {
        setTimer((prev) => ({ ...prev, remaining: rem }));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [timer.running, timer.endAt, handleSessionComplete]);

  // Sync Document Title
  useEffect(() => {
    if (timer.running) {
      const m = Math.floor(timer.remaining / 60);
      const s = timer.remaining % 60;
      document.title = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} · ${MODES[timer.mode].label}`;
    } else {
      document.title = 'Focus To-Do';
    }
  }, [timer.running, timer.remaining, timer.mode]);

  // Timer Controls
  const setTimerMode = (mode: TimerMode) => {
    setTimer({
      ...timer,
      mode,
      running: false,
      endAt: null,
      total: MODES[mode].seconds,
      remaining: MODES[mode].seconds
    });
    showToast(`${MODES[mode].label} · ${Math.round(MODES[mode].seconds / 60)} min`);
  };

  const toggleTimer = () => {
    if (timer.running) {
      const rem = timer.endAt ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.remaining;
      setTimer({
        ...timer,
        running: false,
        endAt: null,
        remaining: rem
      });
    } else {
      const rem = timer.remaining <= 0 ? timer.total : timer.remaining;
      setTimer({
        ...timer,
        running: true,
        remaining: rem,
        endAt: Date.now() + rem * 1000
      });
    }
  };

  const resetTimer = () => {
    setTimer({
      ...timer,
      running: false,
      endAt: null,
      total: MODES[timer.mode].seconds,
      remaining: MODES[timer.mode].seconds
    });
  };

  const skipTimer = () => {
    handleSessionComplete(true);
  };

  // Google Calendar Integration Handlers
  const handleConnectGoogle = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        showToast(`Connected as ${result.user.displayName || result.user.email}`);
        // Auto sync events
        handleSyncGoogleCalendarInternal(result.accessToken);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to sign in with Google');
    }
  };

  const handleDisconnectGoogle = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
    showToast('Disconnected Google Calendar');
  };

  const handleSyncGoogleCalendarInternal = async (token: string) => {
    setIsSyncingGoogle(true);
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endRange = new Date();
      endRange.setDate(endRange.getDate() + 90);

      const items = await fetchGoogleCalendarEvents(
        token,
        startOfMonth.toISOString(),
        endRange.toISOString()
      );

      setData((prev) => {
        const existingGoogleIds = new Set(prev.events.filter((e) => e.googleEventId).map((e) => e.googleEventId));
        const newEventsFromGoogle: CalendarEvent[] = [];

        items.forEach((item) => {
          if (!existingGoogleIds.has(item.id)) {
            const dateStr = item.start?.date || (item.start?.dateTime ? item.start.dateTime.split('T')[0] : getTodayStr());
            newEventsFromGoogle.push({
              id: Date.now() + Math.floor(Math.random() * 10000),
              title: item.summary || 'Untitled Event',
              date: dateStr,
              category: 'Class',
              isGoogleEvent: true,
              googleEventId: item.id
            });
          }
        });

        return {
          ...prev,
          events: [...prev.events, ...newEventsFromGoogle]
        };
      });

      showToast(`Synced ${items.length} Google Calendar events`);
    } catch (err: any) {
      showToast(err.message || 'Google Calendar sync failed');
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  const handleSyncGoogleCalendar = async () => {
    const token = googleToken || (await getAccessToken());
    if (!token) {
      handleConnectGoogle();
      return;
    }
    handleSyncGoogleCalendarInternal(token);
  };

  // Sync Timetable slots to Google Calendar
  const handleSyncTimetableToGoogle = async () => {
    const token = googleToken || (await getAccessToken());
    if (!token) {
      handleConnectGoogle();
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Sync Timetable to Google Calendar?',
      message: `This will create calendar entries on Google Calendar for your ${data.timetable.length} weekly lecture slots.`,
      confirmLabel: 'Sync Classes',
      isDanger: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setIsSyncingGoogle(true);
        let count = 0;
        try {
          const today = new Date();
          for (const slot of data.timetable) {
            // Find next occurrence of this day of the week
            const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
            const targetDay = dayMap[slot.day] ?? 1;
            const diff = (targetDay + 7 - today.getDay()) % 7;
            const slotDate = new Date();
            slotDate.setDate(today.getDate() + diff);
            const dateStr = slotDate.toISOString().split('T')[0];

            await createGoogleCalendarEvent(token, {
              summary: `${slot.courseTitle} (${slot.room})`,
              description: `Lecture with ${slot.instructor || 'Professor'}. Scheduled from Focus To-Do timetable.`,
              date: dateStr
            });
            count++;
          }
          showToast(`Added ${count} class lectures to Google Calendar!`);
          handleSyncGoogleCalendarInternal(token);
        } catch (err: any) {
          showToast(`Error: ${err.message}`);
        } finally {
          setIsSyncingGoogle(false);
        }
      }
    });
  };

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [gpaModalOpen, setGpaModalOpen] = useState(false);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(getTodayStr());

  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  // Focus Task Handler
  const handleFocusTask = (taskId: number) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return;
    setActiveFocusId(taskId);
    setTimer((prev) => ({ ...prev, taskId }));
    setActiveTab('pomo');
    showToast(`Focusing: ${task.title}`);
  };

  const handleClearFocus = () => {
    setActiveFocusId(null);
    setTimer((prev) => ({ ...prev, taskId: null }));
  };

  // Task actions
  const handleToggleTaskDone = (taskId: number) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    }));
  };

  const handleSaveTask = (taskData: { id?: number; title: string; est: number; date: string }) => {
    if (taskData.id) {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskData.id ? { ...t, title: taskData.title, est: taskData.est, date: taskData.date } : t
        )
      }));
      showToast('Task updated');
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: taskData.title,
        est: taskData.est,
        act: 0,
        date: taskData.date,
        done: false,
        log: {}
      };
      setData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }));
      showToast('Task added');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Task?',
      message: 'This task and its pomodoro history will be permanently deleted.',
      confirmLabel: 'Delete',
      isDanger: true,
      onConfirm: () => {
        if (activeFocusId === taskId) handleClearFocus();
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== taskId)
        }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Task deleted');
      }
    });
  };

  // Expense actions
  const handleSaveExpense = (expData: {
    id?: number;
    title: string;
    amount: number;
    category: Expense['category'];
    date: string;
  }) => {
    if (expData.id) {
      setData((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) =>
          e.id === expData.id ? { ...e, ...expData } : e
        )
      }));
      showToast('Expense updated');
    } else {
      const newExp: Expense = {
        id: Date.now(),
        title: expData.title,
        amount: expData.amount,
        category: expData.category,
        date: expData.date
      };
      setData((prev) => ({
        ...prev,
        expenses: [newExp, ...prev.expenses]
      }));
      showToast('Expense logged');
    }
  };

  const handleDeleteExpense = (expenseId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Expense?',
      message: 'This expense record will be permanently deleted.',
      confirmLabel: 'Delete',
      isDanger: true,
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          expenses: prev.expenses.filter((e) => e.id !== expenseId)
        }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Expense deleted');
      }
    });
  };

  // Course actions
  const handleSaveCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now()
    };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
    showToast(`Saved · ${courseData.letter} (${courseData.vlg.toFixed(2)})`);
  };

  const handleDeleteCourse = (courseId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Course?',
      message: 'Remove this course and its credit hours from your CGPA calculation?',
      confirmLabel: 'Remove',
      isDanger: true,
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          courses: prev.courses.filter((c) => c.id !== courseId)
        }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Course removed');
      }
    });
  };

  // Event actions
  const handleSaveEvent = async (eventData: {
    id?: number;
    title: string;
    date: string;
    category: CalendarEvent['category'];
    linkToPomo: boolean;
    est: number;
    syncToGoogle?: boolean;
  }) => {
    let googleEventId: string | undefined = undefined;

    // Optional Google Calendar Creation
    if (eventData.syncToGoogle) {
      const token = googleToken || (await getAccessToken());
      if (token) {
        try {
          const gEvent = await createGoogleCalendarEvent(token, {
            summary: eventData.title,
            description: `Focus To-Do: ${eventData.category}`,
            date: eventData.date
          });
          googleEventId = gEvent.id;
        } catch (err: any) {
          showToast(`Google Calendar error: ${err.message}`);
        }
      }
    }

    if (eventData.id) {
      setData((prev) => {
        const ev = prev.events.find((e) => e.id === eventData.id);
        if (!ev) return prev;

        const linkedTask = ev.linkedTaskId
          ? prev.tasks.find((t) => t.id === ev.linkedTaskId)
          : null;

        let updatedTasks = prev.tasks;
        let newLinkedTaskId = ev.linkedTaskId;

        if (eventData.linkToPomo) {
          if (linkedTask) {
            updatedTasks = prev.tasks.map((t) =>
              t.id === linkedTask.id
                ? { ...t, title: eventData.title, date: eventData.date, est: eventData.est, cat: eventData.category }
                : t
            );
          } else {
            const newTask: Task = {
              id: Date.now(),
              title: eventData.title,
              est: eventData.est,
              act: 0,
              date: eventData.date,
              done: false,
              log: {},
              cat: eventData.category,
              eventId: ev.id
            };
            updatedTasks = [...prev.tasks, newTask];
            newLinkedTaskId = newTask.id;
          }
        } else if (linkedTask) {
          if (activeFocusId === linkedTask.id) handleClearFocus();
          updatedTasks = prev.tasks.filter((t) => t.id !== linkedTask.id);
          newLinkedTaskId = null;
        }

        const updatedEvents = prev.events.map((e) =>
          e.id === eventData.id
            ? {
                ...e,
                title: eventData.title,
                date: eventData.date,
                category: eventData.category,
                linkedTaskId: newLinkedTaskId,
                est: eventData.linkToPomo ? eventData.est : null,
                googleEventId: googleEventId || e.googleEventId,
                isGoogleEvent: Boolean(googleEventId || e.isGoogleEvent)
              }
            : e
        );

        return { ...prev, events: updatedEvents, tasks: updatedTasks };
      });
      showToast('Event updated');
    } else {
      const evId = Date.now();
      let newTaskId: number | null = null;
      let newTasks = data.tasks;

      if (eventData.linkToPomo) {
        newTaskId = Date.now() + 1;
        const newTask: Task = {
          id: newTaskId,
          title: eventData.title,
          est: eventData.est,
          act: 0,
          date: eventData.date,
          done: false,
          log: {},
          cat: eventData.category,
          eventId: evId
        };
        newTasks = [...newTasks, newTask];
      }

      const newEvent: CalendarEvent = {
        id: evId,
        title: eventData.title,
        date: eventData.date,
        category: eventData.category,
        linkedTaskId: newTaskId,
        est: eventData.linkToPomo ? eventData.est : null,
        isGoogleEvent: Boolean(googleEventId),
        googleEventId
      };

      setData((prev) => ({
        ...prev,
        events: [...prev.events, newEvent],
        tasks: newTasks
      }));

      showToast(
        googleEventId
          ? 'Event added & synced to Google Calendar'
          : eventData.linkToPomo
          ? 'Study event linked to Pomodoro'
          : 'Event added'
      );
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    const ev = data.events.find((e) => e.id === eventId);
    const hasLinkedTask = ev?.linkedTaskId && data.tasks.some((t) => t.id === ev.linkedTaskId);
    const isGoogle = ev?.isGoogleEvent && ev?.googleEventId;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Event?',
      message: isGoogle
        ? 'Delete this event from both your local calendar and Google Calendar?'
        : hasLinkedTask
        ? 'Delete this event and its linked Pomodoro study task?'
        : 'Delete this event from the calendar?',
      confirmLabel: 'Delete Event',
      isDanger: true,
      onConfirm: async () => {
        // If it was a Google Calendar event, delete from Google API with user confirmation
        if (isGoogle && ev.googleEventId) {
          const token = googleToken || (await getAccessToken());
          if (token) {
            try {
              await deleteGoogleCalendarEvent(token, ev.googleEventId);
            } catch (err: any) {
              console.warn('Could not delete from Google Calendar', err);
            }
          }
        }

        if (hasLinkedTask && ev?.linkedTaskId) {
          if (activeFocusId === ev.linkedTaskId) handleClearFocus();
        }
        setData((prev) => ({
          ...prev,
          events: prev.events.filter((e) => e.id !== eventId),
          tasks: hasLinkedTask && ev?.linkedTaskId
            ? prev.tasks.filter((t) => t.id !== ev.linkedTaskId)
            : prev.tasks
        }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Event deleted');
      }
    });
  };

  // Timetable slot actions
  const handleAddTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: Date.now()
    };
    setData((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSlot]
    }));
    showToast('Class lecture slot added');
  };

  const handleDeleteTimetableSlot = (slotId: number) => {
    setData((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((s) => s.id !== slotId)
    }));
    showToast('Class removed');
  };

  // Flashcards actions
  const handleAddFlashcard = (cardData: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: Date.now()
    };
    setData((prev) => ({
      ...prev,
      flashcards: [newCard, ...prev.flashcards]
    }));
    showToast('Flashcard added');
  };

  const handleUpdateFlashcardMastery = (cardId: number, mastery: Flashcard['mastery']) => {
    setData((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((c) => (c.id === cardId ? { ...c, mastery } : c))
    }));
    showToast(`Mastery: ${mastery}`);
  };

  const handleDeleteFlashcard = (cardId: number) => {
    setData((prev) => ({
      ...prev,
      flashcards: prev.flashcards.filter((c) => c.id !== cardId)
    }));
    showToast('Card deleted');
  };

  // Cover & Emoji customization
  const handleSelectEmoji = (emoji: string) => {
    setData((prev) => ({
      ...prev,
      page: { ...prev.page, icon: emoji }
    }));
    showToast('Page icon updated');
  };

  const handleRemoveEmoji = () => {
    setData((prev) => ({
      ...prev,
      page: { ...prev.page, icon: null }
    }));
    showToast('Page icon removed');
  };

  const handleSelectCover = (coverCss: string) => {
    setData((prev) => ({
      ...prev,
      page: { ...prev.page, cover: coverCss }
    }));
    showToast('Cover updated');
  };

  const handleRemoveCover = () => {
    setData((prev) => ({
      ...prev,
      page: { ...prev.page, cover: null }
    }));
    showToast('Cover removed');
  };

  // Reset all data
  const handleResetAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Erase All Data?',
      message: 'This will permanently remove all tasks, expenses, GPA courses, timetable slots, flashcards, and focus logs. There is no undo.',
      confirmLabel: 'Erase Everything',
      isDanger: true,
      onConfirm: () => {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem(TIMER_KEY);
        setData({
          tasks: [],
          expenses: [],
          courses: [],
          events: [],
          timetable: [],
          flashcards: [],
          pomoLog: {},
          energy: 0,
          page: { icon: DEFAULT_ICON, cover: null }
        });
        setTimer({
          mode: 'pomo',
          running: false,
          endAt: null,
          remaining: 1500,
          total: 1500,
          taskId: null
        });
        setActiveFocusId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('All data erased');
      }
    });
  };

  // Import backup data
  const handleImportData = (imported: AppData) => {
    setConfirmModal({
      isOpen: true,
      title: 'Import Backup?',
      message: 'Importing will replace your current workspace data with the backup file. Continue?',
      confirmLabel: 'Import & Overwrite',
      isDanger: false,
      onConfirm: () => {
        setData({
          tasks: Array.isArray(imported.tasks) ? imported.tasks : [],
          expenses: Array.isArray(imported.expenses) ? imported.expenses : [],
          courses: Array.isArray(imported.courses) ? imported.courses : [],
          events: Array.isArray(imported.events) ? imported.events : [],
          timetable: Array.isArray(imported.timetable) ? imported.timetable : [],
          flashcards: Array.isArray(imported.flashcards) ? imported.flashcards : [],
          pomoLog: imported.pomoLog && typeof imported.pomoLog === 'object' ? imported.pomoLog : {},
          energy: typeof imported.energy === 'number' ? imported.energy : 0,
          page: imported.page && typeof imported.page === 'object' ? imported.page : { icon: DEFAULT_ICON, cover: null }
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Backup restored successfully');
      }
    });
  };

  // Active focused task object
  const activeFocusTask = activeFocusId
    ? data.tasks.find((t) => t.id === activeFocusId) || null
    : null;

  // Main scroll container ref
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayStr = getTodayStr();
  const todayPomosCount = data.pomoLog[todayStr] || 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden select-text">
      {/* Top Header */}
      <Header
        energy={data.energy || 0}
        darkMode={darkMode}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          isGoogleConnected={Boolean(googleUser)}
        />

        {/* Main Content Area */}
        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto bg-[var(--bg)] focus:outline-none"
        >
          {/* Notion-style Cover & Page Icon Header */}
          <PageHeader
            page={data.page}
            onOpenEmoji={() => setEmojiModalOpen(true)}
            onOpenCover={() => setCoverModalOpen(true)}
            onRemoveCover={handleRemoveCover}
          />

          {/* Central Content Container */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-24">
            {/* Active Focus Alert Banner */}
            <FocusBanner
              task={activeFocusTask}
              onOpenTimer={() => handleTabChange('pomo')}
            />

            {/* View Switching */}
            {activeTab === 'today' && (
              <TodayView
                tasks={data.tasks}
                activeFocusId={activeFocusId}
                onOpenNewTask={() => {
                  setTaskToEdit(null);
                  setTaskModalOpen(true);
                }}
                onToggleDone={handleToggleTaskDone}
                onEditTask={(t) => {
                  setTaskToEdit(t);
                  setTaskModalOpen(true);
                }}
                onFocusTask={handleFocusTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'upcoming' && (
              <UpcomingView
                tasks={data.tasks}
                activeFocusId={activeFocusId}
                onOpenNewTask={() => {
                  setTaskToEdit(null);
                  setTaskModalOpen(true);
                }}
                onToggleDone={handleToggleTaskDone}
                onEditTask={(t) => {
                  setTaskToEdit(t);
                  setTaskModalOpen(true);
                }}
                onFocusTask={handleFocusTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'pomo' && (
              <PomodoroView
                timer={timer}
                activeTask={activeFocusTask}
                todayPomosCount={todayPomosCount}
                onSetMode={setTimerMode}
                onToggleTimer={toggleTimer}
                onResetTimer={resetTimer}
                onSkipTimer={skipTimer}
                onSelectTaskClick={() => handleTabChange('today')}
              />
            )}

            {activeTab === 'events' && (
              <CalendarView
                events={data.events}
                tasks={data.tasks}
                activeFocusId={activeFocusId}
                googleUser={googleUser}
                isGoogleConnected={Boolean(googleUser)}
                isSyncingGoogle={isSyncingGoogle}
                onConnectGoogle={handleConnectGoogle}
                onDisconnectGoogle={handleDisconnectGoogle}
                onSyncGoogleCalendar={handleSyncGoogleCalendar}
                onOpenNewEvent={(dateStr) => {
                  setSelectedCalendarDate(dateStr);
                  setEventToEdit(null);
                  setEventModalOpen(true);
                }}
                onEditEvent={(ev) => {
                  setEventToEdit(ev);
                  setSelectedCalendarDate(ev.date);
                  setEventModalOpen(true);
                }}
                onDeleteEvent={handleDeleteEvent}
                onFocusTask={handleFocusTask}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableView
                slots={data.timetable}
                onAddSlot={handleAddTimetableSlot}
                onDeleteSlot={handleDeleteTimetableSlot}
                onSyncToGoogleCalendar={handleSyncTimetableToGoogle}
                isGoogleConnected={Boolean(googleUser)}
                onFocusTab={handleTabChange}
              />
            )}

            {activeTab === 'flashcards' && (
              <FlashcardsView
                cards={data.flashcards}
                onAddCard={handleAddFlashcard}
                onUpdateMastery={handleUpdateFlashcardMastery}
                onDeleteCard={handleDeleteFlashcard}
              />
            )}

            {activeTab === 'widget' && (
              <SamsungWidgetView
                timer={timer}
                tasks={data.tasks}
                events={data.events}
                energy={data.energy || 0}
                floatingWidgetEnabled={floatingWidgetEnabled}
                onToggleFloatingWidget={() => setFloatingWidgetEnabled((prev) => !prev)}
                onToggleTimer={toggleTimer}
                onFocusTab={handleTabChange}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView data={data} />}

            {activeTab === 'expenses' && (
              <ExpensesView
                expenses={data.expenses}
                onOpenNewExpense={() => {
                  setExpenseToEdit(null);
                  setExpenseModalOpen(true);
                }}
                onEditExpense={(e) => {
                  setExpenseToEdit(e);
                  setExpenseModalOpen(true);
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {activeTab === 'gpa' && (
              <GpaView
                courses={data.courses}
                onOpenNewCourse={() => setGpaModalOpen(true)}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                data={data}
                onImportData={handleImportData}
                onResetAllData={handleResetAllData}
                onShowToast={showToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Floating Study Mini-Widget (Picture-in-Picture mode) */}
      {floatingWidgetEnabled && (
        <FloatingWidget
          timer={timer}
          energy={data.energy || 0}
          onToggleTimer={toggleTimer}
          onClose={() => setFloatingWidgetEnabled(false)}
          onExpand={() => handleTabChange('pomo')}
        />
      )}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150 text-center"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        onSave={handleSaveTask}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
        onSave={handleSaveExpense}
      />

      <GpaModal
        isOpen={gpaModalOpen}
        onClose={() => setGpaModalOpen(false)}
        onSave={handleSaveCourse}
      />

      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        eventToEdit={eventToEdit}
        selectedDate={selectedCalendarDate}
        isGoogleConnected={Boolean(googleUser)}
        onSave={handleSaveEvent}
      />

      <EmojiModal
        isOpen={emojiModalOpen}
        onClose={() => setEmojiModalOpen(false)}
        onSelectEmoji={handleSelectEmoji}
        onRemoveEmoji={handleRemoveEmoji}
      />

      <CoverModal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        currentCover={data.page.cover}
        onSelectCover={handleSelectCover}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
