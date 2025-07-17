export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  title: string;
  bio: string;
  skills: string[];
  experience: number;
  cvUrl?: string;
  preferences: JobPreferences;
  createdAt: Date;
}

export interface JobPreferences {
  jobTypes: string[];
  industries: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  locations: string[];
  remoteWork: boolean;
  experienceLevel: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
  };
  posted: Date;
  remote: boolean;
  industry: string;
  experienceLevel: string;
  matchScore?: number;
  applied?: boolean;
  applicationDate?: Date;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: 'pending' | 'submitted' | 'viewed' | 'interview' | 'rejected' | 'accepted';
  appliedAt: Date;
  lastUpdated: Date;
  coverLetter: string;
  notes?: string;
}