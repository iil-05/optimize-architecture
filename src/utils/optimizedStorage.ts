/**
 * Optimized Storage System for Templates.uz
 * High-performance storage with 30-day data retention
 */

import { themeRegistry, ThemeDefinition } from '../core/ThemeRegistry';
import { iconRegistry, IconDefinition } from '../core/IconRegistry';
import { sectionRegistry, SectionDefinition, SectionInstance } from '../core/SectionRegistry';

export interface StoredProject {
  id: string;
  name: string;
  description?: string;
  websiteUrl: string;
  category: string;
  seoKeywords: string[];
  logo?: string;
  favicon?: string;
  themeId: string;
  sections: SectionInstance[];
  isPublished: boolean;
  publishUrl?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  selectedThemeId: string;
  favoriteIcons: string[];
  favoriteSections: string[];
  recentlyUsedIcons: string[];
  recentlyUsedSections: string[];
  preferences: {
    autoSave: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    language: string;
    timezone: string;
  };
}

// Lightweight analytics event for 30-day retention
export interface AnalyticsEvent {
  id: string;
  projectId: string;
  type: 'visit' | 'like' | 'coin_donation';
  timestamp: number; // Unix timestamp for faster comparison
  sessionId: string;
  visitorId: string;
  data: {
    device: string;
    browser: string;
    referrer?: string;
    amount?: number; // for coin donations
  };
}

// Optimized analytics summary
export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalLikes: number;
  totalCoins: number;
  deviceStats: { device: string; count: number; percentage: number }[];
  browserStats: { browser: string; count: number; percentage: number }[];
  dailyStats: { date: string; visits: number; uniqueVisitors: number; likes: number }[];
  hourlyStats: { hour: number; visits: number }[];
}

export class OptimizedStorage {
  private static instance: OptimizedStorage;
  private readonly STORAGE_KEYS = {
    PROJECTS: 'templates_uz_projects',
    USER_SETTINGS: 'templates_uz_user_settings',
    ANALYTICS: 'templates_uz_analytics',
    SESSIONS: 'templates_uz_sessions',
  };

  // 30-day retention in milliseconds
  private readonly RETENTION_PERIOD = 30 * 24 * 60 * 60 * 1000;

  private constructor() {}

  public static getInstance(): OptimizedStorage {
    if (!OptimizedStorage.instance) {
      OptimizedStorage.instance = new OptimizedStorage();
    }
    return OptimizedStorage.instance;
  }

  public initialize(): void {
    themeRegistry.initialize();
    iconRegistry.initialize();
    sectionRegistry.initialize();
    this.cleanupOldData();
  }

  // Project Management
  public getAllProjects(): StoredProject[] {
    return this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
  }

  public getProject(projectId: string): StoredProject | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  public saveProject(project: StoredProject): void {
    const projects = this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date() };
    } else {
      projects.push(project);
    }
    
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
  }

  public deleteProject(projectId: string): void {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, filteredProjects);
    this.clearAnalyticsForProject(projectId);
  }

  // Optimized Analytics with 30-day retention
  public trackEvent(projectId: string, type: 'visit' | 'like' | 'coin_donation', data: any = {}): void {
    try {
      const now = Date.now();
      const sessionId = this.getSessionId();
      const visitorId = this.getVisitorId();
      
      // Check for duplicate visits within 30 seconds
      if (type === 'visit' && this.isDuplicateVisit(projectId, sessionId, now)) {
        return;
      }

      const event: AnalyticsEvent = {
        id: `${now}_${Math.random().toString(36).substr(2, 5)}`,
        projectId,
        type,
        timestamp: now,
        sessionId,
        visitorId,
        data: {
          device: this.getDevice(),
          browser: this.getBrowser(),
          referrer: document.referrer || undefined,
          ...data
        }
      };

      const analytics = this.getAnalytics();
      analytics.push(event);
      
      // Keep only events from last 30 days and limit to 5000 events
      const cutoff = now - this.RETENTION_PERIOD;
      const filtered = analytics
        .filter(e => e.timestamp > cutoff)
        .slice(-5000);
      
      this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, filtered);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  public getAnalyticsSummary(projectId: string): AnalyticsSummary {
    const events = this.getAnalytics().filter(e => e.projectId === projectId);
    const visits = events.filter(e => e.type === 'visit');
    const likes = events.filter(e => e.type === 'like');
    const coins = events.filter(e => e.type === 'coin_donation');

    // Unique visitors
    const uniqueVisitorIds = new Set(visits.map(v => v.visitorId));

    // Device stats
    const deviceCount: Record<string, number> = {};
    visits.forEach(e => {
      deviceCount[e.data.device] = (deviceCount[e.data.device] || 0) + 1;
    });

    // Browser stats
    const browserCount: Record<string, number> = {};
    visits.forEach(e => {
      browserCount[e.data.browser] = (browserCount[e.data.browser] || 0) + 1;
    });

    // Daily stats (last 30 days)
    const dailyCount: Record<string, { visits: number; uniqueVisitors: Set<string>; likes: number }> = {};
    const now = Date.now();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      dailyCount[date] = { visits: 0, uniqueVisitors: new Set(), likes: 0 };
    }

    visits.forEach(e => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      if (dailyCount[date]) {
        dailyCount[date].visits++;
        dailyCount[date].uniqueVisitors.add(e.visitorId);
      }
    });

    likes.forEach(e => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      if (dailyCount[date]) {
        dailyCount[date].likes++;
      }
    });

    // Hourly stats
    const hourlyCount: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourlyCount[i] = 0;
    visits.forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      hourlyCount[hour]++;
    });

    return {
      totalVisits: visits.length,
      uniqueVisitors: uniqueVisitorIds.size,
      totalLikes: likes.length,
      totalCoins: coins.reduce((sum, e) => sum + (e.data.amount || 1), 0),
      deviceStats: Object.entries(deviceCount).map(([device, count]) => ({
        device,
        count,
        percentage: visits.length > 0 ? Math.round((count / visits.length) * 100) : 0
      })),
      browserStats: Object.entries(browserCount).map(([browser, count]) => ({
        browser,
        count,
        percentage: visits.length > 0 ? Math.round((count / visits.length) * 100) : 0
      })),
      dailyStats: Object.entries(dailyCount).map(([date, data]) => ({
        date,
        visits: data.visits,
        uniqueVisitors: data.uniqueVisitors.size,
        likes: data.likes
      })),
      hourlyStats: Object.entries(hourlyCount).map(([hour, visits]) => ({
        hour: parseInt(hour),
        visits
      }))
    };
  }

  public clearAnalyticsForProject(projectId: string): void {
    const analytics = this.getAnalytics().filter(e => e.projectId !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analytics);
  }

  // User Settings
  public getUserSettings(): UserSettings {
    const defaultSettings: UserSettings = {
      selectedThemeId: 'modern-blue',
      favoriteIcons: [],
      favoriteSections: [],
      recentlyUsedIcons: [],
      recentlyUsedSections: [],
      preferences: {
        autoSave: true,
        showGrid: false,
        snapToGrid: true,
        language: 'en',
        timezone: 'UTC',
      },
    };

    const stored = this.loadFromStorage(this.STORAGE_KEYS.USER_SETTINGS);
    return stored ? { ...defaultSettings, ...stored } : defaultSettings;
  }

  public saveUserSettings(settings: UserSettings): void {
    this.saveToStorage(this.STORAGE_KEYS.USER_SETTINGS, settings);
  }

  // Theme Management
  public getSelectedTheme(): ThemeDefinition | null {
    const settings = this.getUserSettings();
    return themeRegistry.getTheme(settings.selectedThemeId);
  }

  public setSelectedTheme(themeId: string): void {
    const settings = this.getUserSettings();
    settings.selectedThemeId = themeId;
    this.saveUserSettings(settings);
  }

  // Icon Management
  public getRecentlyUsedIcons(): IconDefinition[] {
    const settings = this.getUserSettings();
    return settings.recentlyUsedIcons
      .map(id => iconRegistry.getIcon(id))
      .filter(Boolean) as IconDefinition[];
  }

  public getFavoriteIcons(): IconDefinition[] {
    const settings = this.getUserSettings();
    return settings.favoriteIcons
      .map(id => iconRegistry.getIcon(id))
      .filter(Boolean) as IconDefinition[];
  }

  public addToRecentlyUsedIcons(iconId: string): void {
    const settings = this.getUserSettings();
    const recent = settings.recentlyUsedIcons.filter(id => id !== iconId);
    recent.unshift(iconId);
    settings.recentlyUsedIcons = recent.slice(0, 20);
    this.saveUserSettings(settings);
    iconRegistry.incrementUsage(iconId);
  }

  public toggleFavoriteIcon(iconId: string): void {
    const settings = this.getUserSettings();
    const index = settings.favoriteIcons.indexOf(iconId);
    
    if (index >= 0) {
      settings.favoriteIcons.splice(index, 1);
    } else {
      settings.favoriteIcons.push(iconId);
    }
    
    this.saveUserSettings(settings);
  }

  // Private helper methods
  private getAnalytics(): AnalyticsEvent[] {
    return this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || [];
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private getVisitorId(): string {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private isDuplicateVisit(projectId: string, sessionId: string, timestamp: number): boolean {
    const analytics = this.getAnalytics();
    const recentVisit = analytics.find(e => 
      e.projectId === projectId && 
      e.sessionId === sessionId && 
      e.type === 'visit' &&
      timestamp - e.timestamp < 30000 // 30 seconds
    );
    return !!recentVisit;
  }

  private getDevice(): string {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'Tablet';
    if (/mobile|iphone|android/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    return 'Other';
  }

  private cleanupOldData(): void {
    try {
      const now = Date.now();
      const cutoff = now - this.RETENTION_PERIOD;
      
      // Clean analytics
      const analytics = this.getAnalytics().filter(e => e.timestamp > cutoff);
      this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analytics);
      
      console.log('🧹 Cleaned up old analytics data');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Storage save error (${key}):`, error);
    }
  }

  private loadFromStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Storage load error (${key}):`, error);
      return null;
    }
  }

  public clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('visitor_id');
    sessionStorage.removeItem('session_id');
  }
}

export const optimizedStorage = OptimizedStorage.getInstance();