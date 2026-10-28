export interface VolunteerParticipant {
  id: string;
  fullName: string;
  age: number;
  className: string;
  phone?: string;
  rolePreference: 'cleanup' | 'sorting' | 'logistics' | 'media';
  message?: string;
  registeredAt: string;
  checkInStatus?: boolean;
}

export interface ScheduleStep {
  time: string;
  activity: string;
  leader: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  type: 'schedule' | 'announcement' | 'urgent';
  date: string;
  time?: string;
  gatheringLocation: string;
  targetArea: string;
  equipmentPrepared: string[];
  reminders: string[];
  content: string;
  scheduleTimeline?: ScheduleStep[];
  author: string;
  pinned?: boolean;
  createdAt: string;
}

export interface ActivityPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  metrics: {
    wasteCollectedKg: number;
    participantsCount: number;
    areaCleanedMeters: number;
    recycledKg: number;
  };
  author: string;
  tags: string[];
}

export interface CampaignStats {
  volunteerCountMode: 'auto' | 'custom';
  customVolunteerCount: number;
  wasteCollected: string;
  roadCleaned: string;
  campaignsCompleted: string;
}

