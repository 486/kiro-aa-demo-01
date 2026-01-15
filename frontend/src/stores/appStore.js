import { writable, derived } from 'svelte/store';

// User ID store (in a real app, this would come from authentication)
function createUserStore() {
  const { subscribe, set, update } = writable(localStorage.getItem('userId') || '');

  return {
    subscribe,
    set: (value) => {
      localStorage.setItem('userId', value);
      set(value);
    },
    clear: () => {
      localStorage.removeItem('userId');
      set('');
    }
  };
}

export const userId = createUserStore();

// Schedule store
function createScheduleStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    add: (session) => update(sessions => [...sessions, session]),
    remove: (scheduleId) => update(sessions => sessions.filter(s => s.schedule_id !== scheduleId)),
    clear: () => set([]),
    isInSchedule: (sessionId) => {
      let inSchedule = false;
      subscribe(sessions => {
        inSchedule = sessions.some(s => s.session_id === sessionId);
      })();
      return inSchedule;
    }
  };
}

export const userSchedule = createScheduleStore();

// Metadata store
export const metadata = writable({
  sessionTypes: [],
  tracks: [],
  levels: []
});

// Search filters store
export const searchFilters = writable({
  session_type: '',
  track: '',
  level: '',
  date: '',
  speaker: '',
  keywords: '',
  page: 1,
  limit: 12
});

// Derived store to check for schedule conflicts
export const scheduleConflicts = derived(userSchedule, ($userSchedule) => {
  const conflicts = [];
  
  for (let i = 0; i < $userSchedule.length; i++) {
    for (let j = i + 1; j < $userSchedule.length; j++) {
      const session1 = $userSchedule[i];
      const session2 = $userSchedule[j];
      
      // Check if sessions are on the same date
      if (session1.date === session2.date) {
        const start1 = session1.start_time;
        const end1 = session1.end_time;
        const start2 = session2.start_time;
        const end2 = session2.end_time;
        
        // Check for time overlap
        if ((start1 < end2 && end1 > start2)) {
          conflicts.push({
            session1: session1.session_id,
            session2: session2.session_id,
            date: session1.date,
            time: `${session1.start_time} - ${session1.end_time}`
          });
        }
      }
    }
  }
  
  return conflicts;
});

// Toast notifications store
function createToastStore() {
  const { subscribe, set, update } = writable([]);
  let nextId = 0;

  return {
    subscribe,
    show: (message, type = 'info', duration = 3000) => {
      const id = nextId++;
      const toast = { id, message, type };
      
      update(toasts => [...toasts, toast]);
      
      if (duration > 0) {
        setTimeout(() => {
          update(toasts => toasts.filter(t => t.id !== id));
        }, duration);
      }
      
      return id;
    },
    remove: (id) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    clear: () => set([])
  };
}

export const toasts = createToastStore();
