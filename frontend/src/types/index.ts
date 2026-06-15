export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Url {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
  maxClicks?: number | null;
  tags?: string[];
  folderId?: string | null;
}

export interface Visit {
  id: string;
  urlId: string;
  visitedAt: string;
  browser: string;
  device: string;
  referrer?: string;
}

export interface TimelineData {
  date: string;
  count: number;
}

export interface DistributionData {
  name: string;
  value: number;
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface UrlAnalytics {
  url: {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    createdAt: string;
    expiresAt?: string;
    maxClicks?: number | null;
    clickCount: number;
    tags?: string[];
  };
  analytics: {
    totalClicks: number;
    lastVisited: string | null;
    recentVisits: Visit[];
    clickHistory: TimelineData[];
    browserBreakdown: DistributionData[];
    deviceBreakdown: DistributionData[];
    referrerBreakdown: DistributionData[];
    hourlyBreakdown: HourlyData[];
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
