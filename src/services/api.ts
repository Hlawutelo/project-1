const API_BASE_URL = 'http://127.0.0.1:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    localStorage.setItem('token', this.token!);
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.token;
    localStorage.setItem('token', this.token!);
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // User methods
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(userData: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadCV(file: File) {
    const formData = new FormData();
    formData.append('cv', file);
    
    return this.request('/user/upload-cv', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  // Job methods
  async getJobs(params?: { search?: string; location?: string; refresh?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.refresh) queryParams.append('refresh', 'true');
    
    const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  // Application methods
  async applyToJob(jobId: string, coverLetter?: string) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, coverLetter }),
    });
  }

  async getApplications() {
    return this.request('/applications');
  }

  async updateApplication(id: string, updates: any) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async autoApply() {
    return this.request('/auto-apply', {
      method: 'POST',
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // CV methods
  async getCV() {
    return this.request('/cv');
  }

  async saveCV(cvData: any) {
    return this.request('/cv', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
  }

  async downloadCV() {
    const response = await fetch(`${API_BASE_URL}/cv/download`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      throw new Error('Failed to download CV');
    }
  }

  // Interview methods
  async getInterviews() {
    return this.request('/interviews');
  }

  async scheduleInterview(interviewData: any) {
    return this.request('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
  }

  async updateInterview(id: string, updates: any) {
    return this.request(`/interviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Notification methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();