import axios from 'axios';
import { AuthResponse, Url, UrlAnalytics } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getShortUrl = (shortCode: string): string => {
  const base = API_BASE_URL.replace(/\/api$/, '');
  return `${base}/${shortCode}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthenticated requests
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signup(data: any): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/signup', data);
    return response.data.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },
};

export interface CreateUrlPayload {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
  password?: string;
  maxClicks?: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  folderId?: string;
  tags?: string[];
}

export const urlService = {
  async createUrl(payload: CreateUrlPayload): Promise<Url> {
    const response = await apiClient.post('/urls', payload);
    return response.data.data;
  },

  async listUrls(search?: string, folderId?: string, tag?: string): Promise<Url[]> {
    const response = await apiClient.get('/urls', {
      params: { search, folderId, tag },
    });
    return response.data.data;
  },

  async checkAlias(alias: string): Promise<boolean> {
    const response = await apiClient.get('/urls/check-alias', {
      params: { alias },
    });
    return response.data.available;
  },

  async deleteUrl(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/urls/${id}`);
    return response.data.data;
  },

  async getUrlAnalytics(id: string): Promise<UrlAnalytics> {
    const response = await apiClient.get(`/urls/${id}/analytics`);
    return response.data.data;
  },

  async verifyPassword(shortCode: string, passwordInput: string): Promise<string> {
    const response = await apiClient.post(`/urls/${shortCode}/verify`, { password: passwordInput });
    return response.data.originalUrl;
  },

  async bulkShorten(csvText: string, folderId?: string, tags?: string[]): Promise<string> {
    const response = await apiClient.post('/urls/bulk', { csvText, folderId, tags });
    return response.data.csv;
  },

  async exportAnalyticsCsv(id: string): Promise<string> {
    const response = await apiClient.get(`/urls/${id}/analytics/export`);
    return response.data.csv;
  },
};

export const foldersService = {
  async createFolder(name: string) {
    const response = await apiClient.post('/folders', { name });
    return response.data.data;
  },

  async listFolders() {
    const response = await apiClient.get('/folders');
    return response.data.data;
  },

  async deleteFolder(id: string) {
    const response = await apiClient.delete(`/folders/${id}`);
    return response.data.data;
  },
};

export const apiKeysService = {
  async createKey(name: string) {
    const response = await apiClient.post('/keys', { name });
    return response.data.data;
  },

  async listKeys() {
    const response = await apiClient.get('/keys');
    return response.data.data;
  },

  async deleteKey(id: string) {
    const response = await apiClient.delete(`/keys/${id}`);
    return response.data.data;
  },
};
