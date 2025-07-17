import { User, Job, Application } from '../types';

// Sample data for demonstration - now handled by backend
export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our team building next-generation web applications using React, TypeScript, and modern development practices.',
    requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
    salary: { min: 120000, max: 160000 },
    posted: new Date('2024-01-20'),
    remote: true,
    industry: 'Technology',
    experienceLevel: 'Senior',
    matchScore: 92
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Build beautiful, responsive user interfaces for our fintech platform.',
    requirements: ['React', 'JavaScript', 'CSS', '3+ years experience'],
    salary: { min: 90000, max: 130000 },
    posted: new Date('2024-01-18'),
    remote: false,
    industry: 'Finance',
    experienceLevel: 'Mid-level',
    matchScore: 85
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'HealthTech Solutions',
    location: 'Remote',
    type: 'Contract',
    description: 'Develop healthcare applications using React frontend and Node.js backend.',
    requirements: ['React', 'Node.js', 'TypeScript', 'AWS', '4+ years experience'],
    salary: { min: 100000, max: 140000 },
    posted: new Date('2024-01-22'),
    remote: true,
    industry: 'Healthcare',
    experienceLevel: 'Mid-level',
    matchScore: 88
  },
  {
    id: '4',
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Create stunning user interfaces and experiences for web applications.',
    requirements: ['React', 'CSS', 'JavaScript', 'Design skills', '3+ years experience'],
    salary: { min: 80000, max: 120000 },
    posted: new Date('2024-01-19'),
    remote: false,
    industry: 'Design',
    experienceLevel: 'Mid-level',
    matchScore: 75
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    job: mockJobs[0],
    status: 'submitted',
    appliedAt: new Date('2024-01-21'),
    lastUpdated: new Date('2024-01-21'),
    coverLetter: 'I am excited to apply for the Senior React Developer position...',
    notes: 'Applied through AI system'
  },
  {
    id: '2',
    jobId: '3',
    job: mockJobs[2],
    status: 'interview',
    appliedAt: new Date('2024-01-20'),
    lastUpdated: new Date('2024-01-23'),
    coverLetter: 'I am interested in the Full Stack Developer role...',
    notes: 'Interview scheduled for next week'
  }
];