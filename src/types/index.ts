export type MoodType = 'Happy' | 'Calm' | 'Okay' | 'Sad' | 'Stressed';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; // 1 to 10
  note: string;
  tags: string[];
  createdAt: string; // ISO string
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isCrisis?: boolean;
  isOfflineFallback?: boolean;
}

export interface AssessmentResponse {
  id: string;
  date: string;
  scores: {
    stress: number;
    sleep: number;
    mood: number;
    energy: number;
    functioning: number;
  };
  notes: string;
  aiSummary: string;
  suggestedSteps: string[];
}

export interface Counselor {
  id: string;
  name: string;
  designation: string;
  experience: string;
  languages: string[];
  specialty: string[];
  contactEmail: string;
  avatarUrl: string;
  isDemo: boolean;
  rating: number;
  availability: string;
}

export interface BookingRequest {
  id: string;
  counselorId: string;
  counselorName: string;
  studentName: string;
  studentEmail: string;
  department: string;
  preferredSlot: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Confirmed' | 'Pending';
  notes?: string;
  createdAt: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  category: 'mindfulness' | 'hydration' | 'sleep' | 'study' | 'movement';
  completed: boolean;
}
