import { MoodEntry, AssessmentResponse, BookingRequest, ChatMessage, Counselor, DailyGoal } from '@/src/types';

const MOOD_KEY = 'manas_mitra_moods_v2';
const CHAT_KEY = 'manas_mitra_chats_v2';
const ASSESSMENT_KEY = 'manas_mitra_assessments_v2';
const BOOKINGS_KEY = 'manas_mitra_bookings_v2';
const GOALS_KEY = 'manas_mitra_goals_v2';
const SETTINGS_KEY = 'manas_mitra_settings_v2';

export const INITIAL_COUNSELORS: Counselor[] = [
  {
    id: 'c-1',
    name: 'Dr. Ananya Sharma',
    designation: 'Senior Clinical Psychologist & Student Counselor',
    experience: '8+ Years',
    languages: ['Hindi', 'English', 'Bengali'],
    specialty: ['Academic Burnout', 'Performance Anxiety', 'CBT & Mindfulness'],
    contactEmail: 'ananya.sharma@campus.edu.in',
    avatarUrl: '/src/assets/images/counselor_dr_ananya_1793210097940.jpg',
    isDemo: true,
    rating: 4.9,
    availability: 'Mon - Thu (2:00 PM - 6:00 PM)',
  },
  {
    id: 'c-2',
    name: 'Prof. Rajesh K. Varma',
    designation: 'Associate Dean of Student Welfare & Wellness Mentor',
    experience: '14+ Years',
    languages: ['Hindi', 'English', 'Punjabi'],
    specialty: ['Hostel Adjustment', 'Interpersonal Conflict', 'Career Stress'],
    contactEmail: 'rajesh.varma@campus.edu.in',
    avatarUrl: '/src/assets/images/counselor_prof_rajesh_1793210097882.jpg',
    isDemo: true,
    rating: 4.8,
    availability: 'Tue, Wed, Fri (11:00 AM - 4:00 PM)',
  },
  {
    id: 'c-3',
    name: 'Ms. Priyamvada Nair',
    designation: 'Psychological Wellness Counselor & Somatic Guide',
    experience: '6+ Years',
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
    specialty: ['Panic Attacks', 'Sleep Architecture', 'Self-Compassion'],
    contactEmail: 'priyamvada.nair@campus.edu.in',
    avatarUrl: '/src/assets/images/counselor_dr_ananya_1793210097940.jpg',
    isDemo: true,
    rating: 4.9,
    availability: 'Daily (3:00 PM - 7:00 PM)',
  },
];

const INITIAL_MOODS: MoodEntry[] = [
  {
    id: 'seed-1',
    mood: 'Happy',
    intensity: 8,
    note: 'Presented our robotics project seminar. Faculty appreciated the design and teamwork!',
    tags: ['Academics', 'Seminar', 'Friends'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'seed-2',
    mood: 'Stressed',
    intensity: 7,
    note: 'Upcoming mid-term lab submission deadlines piling up. Felt a rush of anxiety in the evening.',
    tags: ['Exams', 'Labs', 'Workload'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'seed-3',
    mood: 'Calm',
    intensity: 8,
    note: 'Practiced 10 minutes of 4-7-8 breathing followed by an evening walk around the campus sports complex.',
    tags: ['Self-Care', 'Breathing', 'Nature'],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'seed-4',
    mood: 'Okay',
    intensity: 6,
    note: 'Quiet study day in library. Energy was average but stayed consistent.',
    tags: ['Routine', 'Library'],
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

const INITIAL_GOALS: DailyGoal[] = [
  { id: 'g-1', title: '5-minute 4-7-8 diaphragmatic breathing', category: 'mindfulness', completed: true },
  { id: 'g-2', title: 'Drink 2 glasses of water before afternoon class', category: 'hydration', completed: true },
  { id: 'g-3', title: 'Step away from screens during lunch break', category: 'study', completed: false },
  { id: 'g-4', title: '5-4-3-2-1 Sensory Grounding before sleeping', category: 'sleep', completed: false },
  { id: 'g-5', title: 'Write down 1 thing that brought peace today', category: 'mindfulness', completed: false },
];

export const Storage = {
  getMoods(): MoodEntry[] {
    if (typeof window === 'undefined') return INITIAL_MOODS;
    try {
      const data = localStorage.getItem(MOOD_KEY);
      if (!data) {
        localStorage.setItem(MOOD_KEY, JSON.stringify(INITIAL_MOODS));
        return INITIAL_MOODS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOODS;
    }
  },

  saveMood(mood: Omit<MoodEntry, 'id' | 'createdAt'>): MoodEntry {
    const list = this.getMoods();
    const entry: MoodEntry = {
      ...mood,
      id: 'mood_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    list.unshift(entry);
    localStorage.setItem(MOOD_KEY, JSON.stringify(list));
    return entry;
  },

  updateMood(id: string, updated: Partial<MoodEntry>): void {
    const list = this.getMoods().map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    localStorage.setItem(MOOD_KEY, JSON.stringify(list));
  },

  deleteMood(id: string): void {
    const list = this.getMoods().filter((item) => item.id !== id);
    localStorage.setItem(MOOD_KEY, JSON.stringify(list));
  },

  getChats(): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CHAT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveChats(chats: ChatMessage[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
  },

  clearChats(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CHAT_KEY);
  },

  getAssessments(): AssessmentResponse[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ASSESSMENT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAssessment(assessment: AssessmentResponse): void {
    const list = this.getAssessments();
    list.unshift(assessment);
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(list));
  },

  getBookings(): BookingRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(BOOKINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooking(booking: BookingRequest): void {
    const list = this.getBookings();
    list.unshift(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  },

  getGoals(): DailyGoal[] {
    if (typeof window === 'undefined') return INITIAL_GOALS;
    try {
      const data = localStorage.getItem(GOALS_KEY);
      if (!data) {
        localStorage.setItem(GOALS_KEY, JSON.stringify(INITIAL_GOALS));
        return INITIAL_GOALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  },

  saveGoals(goals: DailyGoal[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  },

  getSettings(): { language: 'English' | 'Hindi'; consentGiven: boolean } {
    if (typeof window === 'undefined') return { language: 'English', consentGiven: true };
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { language: 'English', consentGiven: true };
    } catch {
      return { language: 'English', consentGiven: true };
    }
  },

  saveSettings(settings: { language: 'English' | 'Hindi'; consentGiven: boolean }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  exportAllData(): string {
    const data = {
      platform: 'MANAS MITRA (मानस मित्र)',
      version: '1.0.0 (B.Tech Capstone Edition)',
      exportTimestamp: new Date().toISOString(),
      moodEntries: this.getMoods(),
      chatHistory: this.getChats(),
      preAssessments: this.getAssessments(),
      counselorBookings: this.getBookings(),
      dailyGoals: this.getGoals(),
      note: 'All data is self-reported student wellness metrics and client-retained records.',
    };
    return JSON.stringify(data, null, 2);
  },

  wipeAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(MOOD_KEY);
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(ASSESSMENT_KEY);
    localStorage.removeItem(BOOKINGS_KEY);
    localStorage.removeItem(GOALS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  },
};
