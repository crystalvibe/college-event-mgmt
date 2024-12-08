interface MediaItem {
  type?: string;
  name?: string;
  url?: string;
  data?: string;
  file?: File;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  category: string;
  eventType: string;
  department: string;
  venue?: string;
  coordinator: string;
  teamMembers: string[];
  resourcePersons: string[];
  participantsCount?: number;
  externalParticipants?: number;
  sponsoredBy?: string;
  financialAssistance?: number;
  totalExpenses?: number;
  description?: string;
  media: MediaItem[];
} 