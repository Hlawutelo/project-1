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

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();