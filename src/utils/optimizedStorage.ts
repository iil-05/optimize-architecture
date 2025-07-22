/**
 * Optimized Storage System for Templates.uz
 * High-performance storage with efficient caching and minimal overhead
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

// Lightweight analytics event
export interface AnalyticsEvent {
  id: string;
  projectId: string;
  type: 'visit' | 'like' | 'coin_donation';
  timestamp: number;
  sessionId: string;
  visitorId: string;
  data: {
    device: string;
    browser: string;
    referrer?: string;
    amount?: number;
  };
}

// Optimized analytics summary
export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalLikes: number;
  totalCoins: number;
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  browserStats: Array<{ browser: string; count: number; percentage: number }>;
  dailyStats: Array<{ date: string; visits: number; uniqueVisitors: number; likes: number }>;
  hourlyStats: Array<{ hour: number; visits: number }>;
}

export class OptimizedStorage {
  private static instance: OptimizedStorage;
  private readonly STORAGE_KEYS = {
    PROJECTS: 'templates_uz_projects',
    USER_SETTINGS: 'templates_uz_user_settings',
    ANALYTICS: 'templates_uz_analytics',
  };

  // Cache for frequently accessed data
  private projectsCache: Map<string, StoredProject> = new Map();
  private urlToProjectCache: Map<string, string> = new Map();
  private analyticsCache: Map<string, AnalyticsSummary> = new Map();
  private lastCacheUpdate = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // 30-day retention in milliseconds
  private readonly RETENTION_PERIOD = 30 * 24 * 60 * 60 * 1000;

  // Debounce timers
  private saveTimers: Map<string, NodeJS.Timeout> = new Map();
  private visitDebounce: Map<string, number> = new Map();

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
    this.loadProjectsToCache();
    this.scheduleCleanup();
  }

  // Optimized project management with caching
  public getAllProjects(): StoredProject[] {
    if (this.isCacheValid()) {
      return Array.from(this.projectsCache.values());
    }
    
    const projects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    this.updateProjectsCache(projects);
    return projects;
  }

  public getProject(projectId: string): StoredProject | null {
    if (this.projectsCache.has(projectId)) {
      return this.projectsCache.get(projectId) || null;
    }
    
    const projects = this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  // Fast URL-based project lookup
  public getProjectByUrl(websiteUrl: string): StoredProject | null {
    if (this.urlToProjectCache.has(websiteUrl)) {
      const projectId = this.urlToProjectCache.get(websiteUrl);
      return projectId ? this.getProject(projectId) : null;
    }
    
    const projects = this.getAllProjects();
    const project = projects.find(p => p.websiteUrl === websiteUrl);
    
    if (project) {
      this.urlToProjectCache.set(websiteUrl, project.id);
    }
    
    return project || null;
  }

  public saveProject(project: StoredProject): void {
    // Update cache immediately
    this.projectsCache.set(project.id, { ...project, updatedAt: new Date() });
    this.urlToProjectCache.set(project.websiteUrl, project.id);
    
    // Debounced save to localStorage
    this.debouncedSave(this.STORAGE_KEYS.PROJECTS, () => {
      const projects = Array.from(this.projectsCache.values());
      this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
    });
  }

  public deleteProject(projectId: string): void {
    this.projectsCache.delete(projectId);
    
    // Remove from URL cache
    for (const [url, id] of this.urlToProjectCache.entries()) {
      if (id === projectId) {
        this.urlToProjectCache.delete(url);
        break;
      }
    }
    
    // Clear analytics cache
    this.analyticsCache.delete(projectId);
    
    // Save changes
    const projects = Array.from(this.projectsCache.values());
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
    this.clearAnalyticsForProject(projectId);
  }

  // Optimized analytics with debouncing and caching
  public trackVisit(projectId: string): void {
    const now = Date.now();
    const lastVisit = this.visitDebounce.get(projectId) || 0;
    
    // Debounce visits within 30 seconds
    if (now - lastVisit < 30000) {
      return;
    }
    
    this.visitDebounce.set(projectId, now);
    this.trackEvent(projectId, 'visit');
  }

  public trackLike(projectId: string): void {
    this.trackEvent(projectId, 'like');
    
    // Update liked projects list
    const likedSites = this.getLikedProjects();
    if (!likedSites.includes(projectId)) {
      likedSites.push(projectId);
      localStorage.setItem('liked_sites', JSON.stringify(likedSites));
    }
  }

  public trackCoinDonation(projectId: string, amount: number): void {
    this.trackEvent(projectId, 'coin_donation', { amount });
  }

  public isProjectLiked(projectId: string): boolean {
    const likedSites = this.getLikedProjects();
    return likedSites.includes(projectId);
  }

  private getLikedProjects(): string[] {
    try {
      return JSON.parse(localStorage.getItem('liked_sites') || '[]');
    } catch {
      return [];
    }
  }

  private trackEvent(projectId: string, type: 'visit' | 'like' | 'coin_donation', data: any = {}): void {
    try {
      const now = Date.now();
      const sessionId = this.getSessionId();
      const visitorId = this.getVisitorId();

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

      // Add to analytics efficiently
      const analytics = this.getAnalytics();
      analytics.push(event);
      
      // Keep only recent events (last 30 days, max 1000 events)
      const cutoff = now - this.RETENTION_PERIOD;
      const filtered = analytics
        .filter(e => e.timestamp > cutoff)
        .slice(-1000);
      
      this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, filtered);
      
      // Clear analytics cache for this project
      this.analyticsCache.delete(projectId);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  public getAnalyticsSummary(projectId: string): AnalyticsSummary {
    // Check cache first
    if (this.analyticsCache.has(projectId)) {
      return this.analyticsCache.get(projectId)!;
    }

    const events = this.getAnalytics().filter(e => e.projectId === projectId);
    const visits = events.filter(e => e.type === 'visit');
    const likes = events.filter(e => e.type === 'like');
    const coins = events.filter(e => e.type === 'coin_donation');

    // Calculate unique visitors efficiently
    const uniqueVisitorIds = new Set(visits.map(v => v.visitorId));

    // Device stats
    const deviceCount = this.countBy(visits, e => e.data.device);
    const browserCount = this.countBy(visits, e => e.data.browser);

    // Daily stats (last 30 days)
    const dailyCount: Record<string, { visits: number; uniqueVisitors: Set<string>; likes: number }> = {};
    const now = Date.now();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      dailyCount[date] = { visits: 0, uniqueVisitors: new Set(), likes: 0 };
    }

    // Populate daily stats
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
    const hourlyCount = Array.from({ length: 24 }, (_, i) => ({ hour: i, visits: 0 }));
    visits.forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      hourlyCount[hour].visits++;
    });

    const summary: AnalyticsSummary = {
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
      hourlyStats: hourlyCount
    };

    // Cache the result
    this.analyticsCache.set(projectId, summary);
    return summary;
  }

  // User Settings (optimized)
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

  // Icon Management (optimized)
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
  private loadProjectsToCache(): void {
    const projects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    this.updateProjectsCache(projects);
  }

  private updateProjectsCache(projects: StoredProject[]): void {
    this.projectsCache.clear();
    this.urlToProjectCache.clear();
    
    projects.forEach(project => {
      this.projectsCache.set(project.id, project);
      this.urlToProjectCache.set(project.websiteUrl, project.id);
    });
    
    this.lastCacheUpdate = Date.now();
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_TTL;
  }

  private debouncedSave(key: string, saveFunction: () => void): void {
    const existingTimer = this.saveTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    const timer = setTimeout(() => {
      saveFunction();
      this.saveTimers.delete(key);
    }, 1000);
    
    this.saveTimers.set(key, timer);
  }

  private getAnalytics(): AnalyticsEvent[] {
    return this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || [];
  }

  private clearAnalyticsForProject(projectId: string): void {
    const analytics = this.getAnalytics().filter(e => e.projectId !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analytics);
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

  private countBy<T>(array: T[], keyFn: (item: T) => string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private scheduleCleanup(): void {
    // Clean up old data every hour
    setInterval(() => {
      this.cleanupOldData();
    }, 60 * 60 * 1000);
  }

  private cleanupOldData(): void {
    try {
      const now = Date.now();
      const cutoff = now - this.RETENTION_PERIOD;
      
      // Clean analytics
      const analytics = this.getAnalytics().filter(e => e.timestamp > cutoff);
      this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analytics);
      
      // Clear analytics cache
      this.analyticsCache.clear();
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
    
    // Clear caches
    this.projectsCache.clear();
    this.urlToProjectCache.clear();
    this.analyticsCache.clear();
    this.visitDebounce.clear();
    
    // Clear timers
    this.saveTimers.forEach(timer => clearTimeout(timer));
    this.saveTimers.clear();
  }

  // Storage health monitoring
  public getStorageHealth(): { totalSize: number; projectCount: number; analyticsCount: number } {
    try {
      const projects = this.getAllProjects();
      const analytics = this.getAnalytics();
      
      let totalSize = 0;
      Object.values(this.STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      });

      return {
        totalSize,
        projectCount: projects.length,
        analyticsCount: analytics.length
      };
    } catch (error) {
      console.error('Storage health check error:', error);
      return { totalSize: 0, projectCount: 0, analyticsCount: 0 };
    }
  }
}

export const optimizedStorage = OptimizedStorage.getInstance();