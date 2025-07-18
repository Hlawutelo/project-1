import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory database (replace with real database in production)
let users = [];
let jobs = [];
let applications = [];
let cvs = [];
let interviews = [];
let notifications = [];

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads');
  }
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Job scraping functions
const scrapeIndeedJobs = async (query, location) => {
  try {
    const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs = [];
    
    $('.job_seen_beacon').each((i, element) => {
      if (i >= 10) return false; // Limit to 10 jobs
      
      const title = $(element).find('[data-jk] h2 a span').text().trim();
      const company = $(element).find('[data-testid="company-name"]').text().trim();
      const location = $(element).find('[data-testid="job-location"]').text().trim();
      const description = $(element).find('.slider_container .slider_item').text().trim();
      const salary = $(element).find('.salary-snippet').text().trim();
      
      if (title && company) {
        jobs.push({
          id: uuidv4(),
          title,
          company,
          location: location || 'Not specified',
          type: 'Full-time',
          description: description || 'No description available',
          requirements: extractRequirements(description),
          salary: parseSalary(salary),
          posted: new Date(),
          remote: location.toLowerCase().includes('remote'),
          industry: 'Technology',
          experienceLevel: 'Mid-level',
          source: 'Indeed'
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error scraping Indeed:', error.message);
    return [];
  }
};

const extractRequirements = (description) => {
  const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Git'];
  const requirements = [];
  
  commonSkills.forEach(skill => {
    if (description.toLowerCase().includes(skill.toLowerCase())) {
      requirements.push(skill);
    }
  });
  
  return requirements.length > 0 ? requirements : ['Experience required'];
};

const parseSalary = (salaryText) => {
  if (!salaryText) return { min: 50000, max: 80000 };
  
  const numbers = salaryText.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    return {
      min: parseInt(numbers[0]) * 1000,
      max: parseInt(numbers[1]) * 1000
    };
  }
  
  return { min: 50000, max: 80000 };
};

// AI matching algorithm
const calculateMatchScore = (job, user) => {
  let score = 0;
  const maxScore = 100;
  
  // Skills matching (40% weight)
  const jobRequirements = job.requirements.map(r => r.toLowerCase());
  const userSkills = user.skills.map(s => s.toLowerCase());
  const skillMatches = jobRequirements.filter(req => 
    userSkills.some(skill => skill.includes(req) || req.includes(skill))
  );
  score += (skillMatches.length / Math.max(jobRequirements.length, 1)) * 40;
  
  // Location matching (20% weight)
  if (job.remote && user.preferences.remoteWork) {
    score += 20;
  } else if (user.preferences.locations.some(loc => 
    job.location.toLowerCase().includes(loc.toLowerCase())
  )) {
    score += 20;
  }
  
  // Salary matching (20% weight)
  if (job.salary.min >= user.preferences.salaryRange.min && 
      job.salary.max <= user.preferences.salaryRange.max) {
    score += 20;
  } else if (job.salary.max >= user.preferences.salaryRange.min) {
    score += 10;
  }
  
  // Job type matching (10% weight)
  if (user.preferences.jobTypes.includes(job.type)) {
    score += 10;
  }
  
  // Industry matching (10% weight)
  if (user.preferences.industries.includes(job.industry)) {
    score += 10;
  }
  
  return Math.min(Math.round(score), maxScore);
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone: '',
      location: '',
      title: '',
      bio: '',
      skills: [],
      experience: 0,
      cvUrl: '',
      preferences: {
        jobTypes: ['Full-time'],
        industries: ['Technology'],
        salaryRange: { min: 50000, max: 100000 },
        locations: ['Remote'],
        remoteWork: true,
        experienceLevel: 'Mid-level'
      },
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ ...user, password: undefined });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ ...users[userIndex], password: undefined });
});

app.post('/api/user/upload-cv', authenticateToken, upload.single('cv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex].cvUrl = `/uploads/${req.file.filename}`;
  res.json({ cvUrl: users[userIndex].cvUrl });
});

// Job routes
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { search, location, refresh } = req.query;
    
    // If refresh is requested or jobs are empty, scrape new jobs
    if (refresh === 'true' || jobs.length === 0) {
      const query = search || user.skills.join(' ') || 'software developer';
      const loc = location || user.location || 'remote';
      
      const scrapedJobs = await scrapeIndeedJobs(query, loc);
      
      // Add to jobs array (avoid duplicates)
      scrapedJobs.forEach(job => {
        if (!jobs.find(j => j.title === job.title && j.company === job.company)) {
          jobs.push(job);
        }
      });
    }
    
    // Calculate match scores
    const jobsWithScores = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, user),
      applied: applications.some(app => app.jobId === job.id && app.userId === user.id)
    }));
    
    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(jobsWithScores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/:id', authenticateToken, (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const user = users.find(u => u.id === req.user.userId);
  const jobWithScore = {
    ...job,
    matchScore: calculateMatchScore(job, user),
    applied: applications.some(app => app.jobId === job.id && app.userId === user.id)
  };
  
  res.json(jobWithScore);
});

// Application routes
app.post('/api/applications', authenticateToken, (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user.userId;
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.userId === userId
    );
    
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    // Find job and user
    const job = jobs.find(j => j.id === jobId);
    const user = users.find(u => u.id === userId);
    
    if (!job || !user) {
      return res.status(404).json({ error: 'Job or user not found' });
    }
    
    // Create application
    const application = {
      id: uuidv4(),
      jobId,
      userId,
      job,
      status: 'submitted',
      appliedAt: new Date(),
      lastUpdated: new Date(),
      coverLetter: coverLetter || generateCoverLetter(user, job),
      notes: 'Applied via AI JobMatch platform'
    };
    
    applications.push(application);
    
    // Simulate application processing
    setTimeout(() => {
      const appIndex = applications.findIndex(a => a.id === application.id);
      if (appIndex !== -1) {
        applications[appIndex].status = Math.random() > 0.7 ? 'viewed' : 'pending';
        applications[appIndex].lastUpdated = new Date();
      }
    }, 5000);
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/applications', authenticateToken, (req, res) => {
  const userApplications = applications.filter(app => app.userId === req.user.userId);
  res.json(userApplications);
});

app.put('/api/applications/:id', authenticateToken, (req, res) => {
  const appIndex = applications.findIndex(
    app => app.id === req.params.id && app.userId === req.user.userId
  );
  
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  applications[appIndex] = {
    ...applications[appIndex],
    ...req.body,
    lastUpdated: new Date()
  };
  
  res.json(applications[appIndex]);
});

// Auto-apply functionality
app.post('/api/auto-apply', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find high-match jobs that haven't been applied to
    const eligibleJobs = jobs.filter(job => {
      const matchScore = calculateMatchScore(job, user);
      const alreadyApplied = applications.some(
        app => app.jobId === job.id && app.userId === user.id
      );
      return matchScore >= 85 && !alreadyApplied;
    });
    
    const appliedJobs = [];
    
    // Apply to top 3 jobs
    for (let i = 0; i < Math.min(3, eligibleJobs.length); i++) {
      const job = eligibleJobs[i];
      const application = {
        id: uuidv4(),
        jobId: job.id,
        userId: user.id,
        job,
        status: 'submitted',
        appliedAt: new Date(),
        lastUpdated: new Date(),
        coverLetter: generateCoverLetter(user, job),
        notes: 'Auto-applied via AI system'
      };
      
      applications.push(application);
      appliedJobs.push(application);
    }
    
    res.json({ applied: appliedJobs.length, applications: appliedJobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate cover letter
const generateCoverLetter = (user, job) => {
  return `Dear Hiring Manager,

I am excited to apply for the ${job.title} position at ${job.company}. With ${user.experience} years of experience in ${user.skills.slice(0, 3).join(', ')}, I am confident that I would be a valuable addition to your team.

My background in ${user.title} has equipped me with the skills necessary to excel in this role. I am particularly drawn to this opportunity because it aligns perfectly with my career goals and expertise.

Key qualifications that make me a strong candidate:
${user.skills.slice(0, 5).map(skill => `• Proficiency in ${skill}`).join('\n')}
• ${user.experience}+ years of relevant experience
• Strong problem-solving and communication skills

I am excited about the possibility of contributing to ${job.company} and would welcome the opportunity to discuss how my skills and experience can benefit your team.

Thank you for your consideration.

Best regards,
${user.name}`;
};

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const user = users.find(u => u.id === userId);
  const userApplications = applications.filter(app => app.userId === userId);
  
  const stats = {
    totalJobs: jobs.length,
    appliedJobs: userApplications.length,
    interviewRequests: userApplications.filter(app => app.status === 'interview').length,
    averageMatchScore: jobs.length > 0 
      ? Math.round(jobs.reduce((acc, job) => acc + calculateMatchScore(job, user), 0) / jobs.length)
      : 0,
    recentApplications: userApplications
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 5),
    topMatches: jobs
      .map(job => ({ ...job, matchScore: calculateMatchScore(job, user) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
  };
  
  res.json(stats);
});

// CV routes
app.get('/api/cv', authenticateToken, (req, res) => {
  const userCV = cvs.find(cv => cv.userId === req.user.userId);
  res.json(userCV || null);
});

app.post('/api/cv', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const cvData = { ...req.body, userId, updatedAt: new Date() };
  
  const existingIndex = cvs.findIndex(cv => cv.userId === userId);
  if (existingIndex !== -1) {
    cvs[existingIndex] = cvData;
  } else {
    cvData.id = uuidv4();
    cvData.createdAt = new Date();
    cvs.push(cvData);
  }
  
  res.json(cvData);
});

app.get('/api/cv/download', authenticateToken, (req, res) => {
  // In a real app, you would generate a PDF here
  // For now, we'll simulate a PDF download
  const userCV = cvs.find(cv => cv.userId === req.user.userId);
  
  if (!userCV) {
    return res.status(404).json({ error: 'CV not found' });
  }
  
  // Simulate PDF generation
  const pdfContent = `CV for ${userCV.personalInfo.fullName}\n\nThis is a simulated PDF download.`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
  res.send(Buffer.from(pdfContent));
});

// Interview routes
app.get('/api/interviews', authenticateToken, (req, res) => {
  const userInterviews = interviews.filter(interview => interview.userId === req.user.userId);
  res.json(userInterviews);
});

app.post('/api/interviews', authenticateToken, (req, res) => {
  const interview = {
    id: uuidv4(),
    userId: req.user.userId,
    ...req.body,
    createdAt: new Date()
  };
  
  interviews.push(interview);
  
  // Create notification
  const notification = {
    id: uuidv4(),
    userId: req.user.userId,
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    message: `Interview scheduled for ${interview.job.title} at ${interview.job.company}`,
    read: false,
    createdAt: new Date(),
    actionUrl: '/interviews'
  };
  notifications.push(notification);
  
  res.json(interview);
});

app.put('/api/interviews/:id', authenticateToken, (req, res) => {
  const interviewIndex = interviews.findIndex(
    interview => interview.id === req.params.id && interview.userId === req.user.userId
  );
  
  if (interviewIndex === -1) {
    return res.status(404).json({ error: 'Interview not found' });
  }
  
  interviews[interviewIndex] = {
    ...interviews[interviewIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(interviews[interviewIndex]);
});

// Notification routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userNotifications = notifications
    .filter(notification => notification.userId === req.user.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userNotifications);
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const notificationIndex = notifications.findIndex(
    notification => notification.id === req.params.id && notification.userId === req.user.userId
  );
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
  }
  
  res.json({ success: true });
});

app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  notifications.forEach(notification => {
    if (notification.userId === req.user.userId) {
      notification.read = true;
    }
  });
  
  res.json({ success: true });
});

app.delete('/api/notifications/:id', authenticateToken, (req, res) => {
  const notificationIndex = notifications.findIndex(
    notification => notification.id === req.params.id && notification.userId === req.user.userId
  );
  
  if (notificationIndex !== -1) {
    notifications.splice(notificationIndex, 1);
  }
  
  res.json({ success: true });
});

// Helper function to create notifications
const createNotification = (userId, type, title, message, actionUrl = null) => {
  const notification = {
    id: uuidv4(),
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date(),
    actionUrl
  };
  notifications.push(notification);
  return notification;
};

// Scheduled job to update application statuses
cron.schedule('0 */6 * * *', () => {
  console.log('Updating application statuses...');
  
  applications.forEach(app => {
    if (app.status === 'submitted' && Math.random() > 0.8) {
      app.status = 'viewed';
      app.lastUpdated = new Date();
      
      // Create notification
      createNotification(
        app.userId,
        'application_update',
        'Application Viewed',
        `Your application for ${app.job.title} at ${app.job.company} has been viewed`,
        '/applications'
      );
    } else if (app.status === 'viewed' && Math.random() > 0.9) {
      app.status = Math.random() > 0.7 ? 'interview' : 'rejected';
      app.lastUpdated = new Date();
      
      // Create notification
      const status = app.status === 'interview' ? 'Interview Request' : 'Application Update';
      const message = app.status === 'interview' 
        ? `Interview requested for ${app.job.title} at ${app.job.company}`
        : `Your application for ${app.job.title} at ${app.job.company} was not selected`;
      
      createNotification(
        app.userId,
        'application_update',
        status,
        message,
        '/applications'
      );
    }
  });
  
  // Create job match notifications for new jobs
  users.forEach(user => {
    const recentJobs = jobs.filter(job => {
      const jobAge = Date.now() - new Date(job.posted).getTime();
      return jobAge < 24 * 60 * 60 * 1000; // Jobs posted in last 24 hours
    });
    
    recentJobs.forEach(job => {
      const matchScore = calculateMatchScore(job, user);
      if (matchScore >= 85) {
        createNotification(
          user.id,
          'job_match',
          'New High-Match Job',
          `${job.title} at ${job.company} - ${matchScore}% match`,
          '/jobs'
        );
      }
    });
  });
});

// Initialize server
const startServer = async () => {
  await ensureUploadsDir();
  
  // Add some sample jobs if none exist
  if (jobs.length === 0) {
    jobs.push(
      {
        id: uuidv4(),
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        description: 'Join our team building next-generation web applications using React, TypeScript, and modern development practices.',
        requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
        salary: { min: 120000, max: 160000 },
        posted: new Date(),
        remote: true,
        industry: 'Technology',
        experienceLevel: 'Senior',
        source: 'Direct'
      },
      {
        id: uuidv4(),
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Build beautiful, responsive user interfaces and robust backend systems.',
        requirements: ['React', 'Node.js', 'JavaScript', '3+ years experience'],
        salary: { min: 90000, max: 130000 },
        posted: new Date(),
        remote: false,
        industry: 'Technology',
        experienceLevel: 'Mid-level',
        source: 'Direct'
      }
    );
    
    // Add sample notifications for demo
    if (users.length > 0) {
      const sampleUser = users[0];
      createNotification(
        sampleUser.id,
        'job_match',
        'New Job Match Found',
        'Senior React Developer at TechCorp Inc. - 92% match',
        '/jobs'
      );
      createNotification(
        sampleUser.id,
        'system',
        'Welcome to AI JobMatch',
        'Complete your profile to get better job matches',
        '/settings'
      );
    }
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();