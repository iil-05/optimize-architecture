import { Project, SectionTemplate, SectionInstance, ThemeConfig } from '../types';
import { authStorage } from './authStorage';

// Enhanced storage structure for optimal organization
export interface OptimizedStorageData {
  // User data
  user: {
    id: string;
    profile: UserProfile;
    preferences: UserPreferences;
    subscription: UserSubscription;
    createdAt: Date;
    lastLoginAt: Date;
  };
  
  // Website/Project data
  projects: {
    [projectId: string]: ProjectData;
  };
  
  // Templates and themes
  templates: {
    sections: { [templateId: string]: SectionTemplate };
    themes: { [themeId: string]: ThemeConfig };
  };
  
  // Application settings
  settings: {
    version: string;
    lastSync: Date;
    features: FeatureFlags;
  };
  
  // Simple analytics data
  analytics: {
    projectStats: ProjectStats[];
    usageMetrics: UsageMetrics;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  website?: string;
  bio?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  editor: {
    autoSave: boolean;
    autoSaveInterval: number; // in seconds
    showGrid: boolean;
    snapToGrid: boolean;
  };
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  features: string[];
  limits: {
    maxProjects: number;
    maxSections: number;
    storageLimit: number; // in MB
  };
}

export interface ProjectData extends Project {
  // Enhanced project data
  metadata: {
    version: string;
    lastBackup?: Date;
    collaborators: string[];
    tags: string[];
    isTemplate: boolean;
    logoFileName?: string;
    faviconFileName?: string;
  };
  
  // SEO data
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
    customMeta: { [key: string]: string };
  };
  
  // Simple analytics data
  analytics: {
    visits: number;
    uniqueVisitors: number;
    likes: number;
    coins: number;
    lastVisited?: Date;
    totalTimeSpent: number; // in seconds
    bounceRate: number; // percentage
    avgSessionDuration: number; // in seconds
  };
  
  // Deployment data
  deployment: {
    status: 'draft' | 'published' | 'archived';
    publishedUrl?: string;
    customDomain?: string;
    ssl: boolean;
    lastDeployed?: Date;
  };
}

export interface FeatureFlags {
  aiAssistant: boolean;
  collaboration: boolean;
  customCode: boolean;
  analytics: boolean;
  ecommerce: boolean;
  multiLanguage: boolean;
}

export interface ProjectStats {
  projectId: string;
  sectionsCount: number;
  lastModified: Date;
  timeSpent: number; // in minutes
  versions: number;
}

export interface UsageMetrics {
  totalProjects: number;
  totalSections: number;
  storageUsed: number; // in bytes
  lastActive: Date;
  sessionsCount: number;
  averageSessionTime: number; // in minutes
}

// Simple analytics interfaces with accurate tracking
export interface SimpleAnalyticsEvent {
  id: string;
  projectId: string;
  type: 'visit' | 'like' | 'coin_donation' | 'page_view' | 'section_interaction';
  timestamp: Date;
  sessionId: string;
  visitorId: string;
  data: {
    device: string;
    browser: string;
    os: string;
    screenResolution: string;
    language: string;
    timezone: string;
    referrer?: string;
    sessionDuration?: number; // in seconds
    pageUrl?: string;
    sectionId?: string;
    interactionType?: string;
    amount?: number; // for coin donations
  };
}

export interface AnalyticsSummary {
  // Core metrics
  totalVisits: number;
  uniqueVisitors: number;
  totalLikes: number;
  totalCoins: number;
  averageSessionDuration: number; // in seconds
  bounceRate: number; // percentage
  
  // Device and browser stats
  deviceStats: { device: string; count: number; percentage: number }[];
  browserStats: { browser: string; count: number; percentage: number }[];
  osStats: { os: string; count: number; percentage: number }[];
  
  // Time-based stats
  hourlyStats: { hour: number; visits: number; uniqueVisitors: number }[];
  dailyStats: { date: string; visits: number; uniqueVisitors: number; likes: number }[];
  
  // Engagement stats
  topSections: { sectionId: string; interactions: number }[];
  languageStats: { language: string; count: number }[];
  screenResolutionStats: { resolution: string; count: number }[];
  
  // Performance metrics
  averageLoadTime: number; // in milliseconds
  totalPageViews: number;
  pagesPerSession: number;
}

// Enhanced Storage Manager with accurate analytics
export class OptimizedStorageManager {
  private static instance: OptimizedStorageManager;
  private readonly STORAGE_PREFIX = 'templates_uz_';
  private readonly STORAGE_KEYS = {
    USER: `${this.STORAGE_PREFIX}user`,
    PROJECTS: `${this.STORAGE_PREFIX}projects`,
    TEMPLATES: `${this.STORAGE_PREFIX}templates`,
    SETTINGS: `${this.STORAGE_PREFIX}settings`,
    ANALYTICS: `${this.STORAGE_PREFIX}analytics`,
    CACHE: `${this.STORAGE_PREFIX}cache`,
    SUPPORT: `${this.STORAGE_PREFIX}support`,
    TEMPLATE_GALLERY: `${this.STORAGE_PREFIX}template_gallery`,
    SIMPLE_ANALYTICS: `${this.STORAGE_PREFIX}simple_analytics`,
    VISITOR_SESSIONS: `${this.STORAGE_PREFIX}visitor_sessions`,
  };

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): OptimizedStorageManager {
    if (!OptimizedStorageManager.instance) {
      OptimizedStorageManager.instance = new OptimizedStorageManager();
    }
    return OptimizedStorageManager.instance;
  }

  // Initialize storage with default structure
  private initializeStorage(): void {
    if (!this.getUser()) {
      this.createDefaultUser();
    }
    if (!this.getSettings()) {
      this.createDefaultSettings();
    }
    if (!this.getSimpleAnalytics()) {
      this.createSimpleAnalytics();
    }
  }

  // User Management
  public getUser(): UserProfile | null {
    const authUser = authStorage.getUser();
    if (authUser) {
      return {
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        company: '',
        website: '',
        bio: '',
      };
    }
    
    return this.loadFromStorage(this.STORAGE_KEYS.USER);
  }

  public saveUser(user: UserProfile): void {
    if (authStorage.isAuthenticated()) {
      authStorage.updateUser({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    }
    
    this.saveToStorage(this.STORAGE_KEYS.USER, {
      id: this.generateId(),
      profile: user,
      preferences: this.getUserPreferences() || this.getDefaultPreferences(),
      subscription: this.getUserSubscription() || this.getDefaultSubscription(),
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });
  }

  public getUserPreferences(): UserPreferences | null {
    const userData = this.loadFromStorage(this.STORAGE_KEYS.USER);
    return userData?.preferences || null;
  }

  public saveUserPreferences(preferences: UserPreferences): void {
    const userData = this.loadFromStorage(this.STORAGE_KEYS.USER);
    if (userData) {
      userData.preferences = preferences;
      this.saveToStorage(this.STORAGE_KEYS.USER, userData);
    }
  }

  public getUserSubscription(): UserSubscription | null {
    const userData = this.loadFromStorage(this.STORAGE_KEYS.USER);
    return userData?.subscription || null;
  }

  // Project Management
  public getAllProjects(): ProjectData[] {
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    return Object.values(projectsData);
  }

  public getProject(projectId: string): ProjectData | null {
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    return projectsData[projectId] || null;
  }

  public saveProject(project: ProjectData): void {
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    
    // Enhance project with metadata if not present
    if (!project.metadata) {
      project.metadata = {
        version: '1.0.0',
        collaborators: [],
        tags: [],
        isTemplate: false,
        logoFileName: undefined,
        faviconFileName: undefined,
      };
    }

    // Initialize enhanced analytics if not present
    if (!project.analytics) {
      project.analytics = {
        visits: 0,
        uniqueVisitors: 0,
        likes: 0,
        coins: 0,
        totalTimeSpent: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
      };
    }

    // Initialize deployment if not present
    if (!project.deployment) {
      project.deployment = {
        status: 'draft',
        ssl: false,
      };
    }

    // Initialize SEO if not present
    if (!project.seo) {
      project.seo = {
        customMeta: {},
      };
    }

    // Update deployment status based on isPublished
    if (project.isPublished && project.deployment.status === 'draft') {
      project.deployment.status = 'published';
      project.deployment.publishedUrl = `${import.meta.env.VITE_USER_SITE_BASE_URL || 'http://localhost:5173/site'}/${project.websiteUrl}`;
      project.deployment.lastDeployed = new Date();
    } else if (!project.isPublished && project.deployment.status === 'published') {
      project.deployment.status = 'draft';
    }
    
    projectsData[project.id] = {
      ...project,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projectsData);
    this.updateProjectStats(project.id);
    
    console.log('💾 Project saved to optimized storage:', {
      id: project.id,
      name: project.name,
      websiteUrl: project.websiteUrl,
      isPublished: project.isPublished,
      deploymentStatus: project.deployment.status
    });
  }

  public deleteProject(projectId: string): void {
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    delete projectsData[projectId];
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projectsData);
    this.removeProjectStats(projectId);
    this.clearAnalyticsForProject(projectId);
  }

  // Enhanced Analytics Management with accurate tracking
  public trackSimpleEvent(projectId: string, type: 'visit' | 'like' | 'coin_donation' | 'page_view' | 'section_interaction', data: any = {}): void {
    try {
      const sessionId = this.getOrCreateSessionId();
      const visitorId = this.getOrCreateVisitorId();
      
      // Check if this is a unique visitor for this project
      const isUniqueVisitor = this.isUniqueVisitor(projectId, visitorId);
      
      // For visits, check if it's within the same session to avoid duplicates
      if (type === 'visit') {
        const recentVisit = this.getRecentVisit(projectId, sessionId);
        if (recentVisit && (Date.now() - new Date(recentVisit.timestamp).getTime()) < 30000) {
          // If there's a visit within the last 30 seconds from same session, don't count it
          console.log('🚫 Duplicate visit detected, skipping');
          return;
        }
      }

      // Capture performance data for visits
      const performanceData: any = {};
      if (type === 'visit' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          performanceData.loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
          performanceData.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart);
          performanceData.firstPaint = Math.round(navigation.responseEnd - navigation.fetchStart);
        }
      }
      const event: SimpleAnalyticsEvent = {
        id: this.generateId(),
        projectId,
        type,
        timestamp: new Date(),
        sessionId,
        visitorId,
        data: {
          device: this.detectDevice(),
          browser: this.detectBrowser(),
          os: this.detectOS(),
          screenResolution: this.getScreenResolution(),
          language: this.getLanguage(),
          timezone: this.getTimezone(),
          referrer: document.referrer || undefined,
          pageUrl: window.location.href,
          ...performanceData,
          ...data
        }
      };

      const analytics = this.getSimpleAnalytics();
      analytics.events.push(event);
      
      // Keep only last 2000 events to prevent storage bloat
      if (analytics.events.length > 2000) {
        analytics.events = analytics.events.slice(-2000);
      }

      this.saveToStorage(this.STORAGE_KEYS.SIMPLE_ANALYTICS, analytics);

      // Update project analytics counters
      if (type === 'visit') {
        this.incrementProjectVisits(projectId, isUniqueVisitor);
      } else if (type === 'like') {
        this.incrementProjectLikes(projectId);
      } else if (type === 'coin_donation') {
        this.incrementProjectCoins(projectId, data.amount || 1);
      }

      // Track session data
      this.updateSessionData(sessionId, visitorId, projectId);

      console.log('📊 Analytics event tracked:', { projectId, type, isUniqueVisitor });
    } catch (error) {
      console.error('❌ Error tracking analytics event:', error);
    }
  }

  public getAnalyticsSummary(projectId: string, days: number = 30): AnalyticsSummary {
    const analytics = this.getSimpleAnalytics();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const projectEvents = analytics.events.filter(event => 
      event.projectId === projectId && 
      new Date(event.timestamp) >= cutoffDate
    );

    const visits = projectEvents.filter(e => e.type === 'visit');
    const likes = projectEvents.filter(e => e.type === 'like');
    const coins = projectEvents.filter(e => e.type === 'coin_donation');
    const pageViews = projectEvents.filter(e => e.type === 'page_view');
    const sectionInteractions = projectEvents.filter(e => e.type === 'section_interaction');

    // Calculate unique visitors
    const uniqueVisitorIds = new Set(visits.map(v => v.visitorId));
    const uniqueVisitors = uniqueVisitorIds.size;

    // Calculate session-based metrics
    const sessions = this.getSessionsForProject(projectId, days);
    const totalSessionDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageSessionDuration = sessions.length > 0 ? totalSessionDuration / sessions.length : 0;

    // Calculate bounce rate (sessions with only one page view)
    const singlePageSessions = sessions.filter(session => session.pageViews <= 1).length;
    const bounceRate = sessions.length > 0 ? (singlePageSessions / sessions.length) * 100 : 0;

    // Device statistics - calculate percentages accurately
    const deviceCount: { [key: string]: number } = {};
    visits.forEach(event => {
      const device = event.data.device || 'Unknown';
      deviceCount[device] = (deviceCount[device] || 0) + 1;
    });

    // Browser statistics - calculate percentages accurately
    const browserCount: { [key: string]: number } = {};
    visits.forEach(event => {
      const browser = event.data.browser || 'Unknown';
      browserCount[browser] = (browserCount[browser] || 0) + 1;
    });

    // OS statistics - calculate percentages accurately
    const osCount: { [key: string]: number } = {};
    visits.forEach(event => {
      const os = event.data.os || 'Unknown';
      osCount[os] = (osCount[os] || 0) + 1;
    });

    // Language statistics - calculate from actual data
    const languageCount: { [key: string]: number } = {};
    visits.forEach(event => {
      const language = event.data.language || 'Unknown';
      languageCount[language] = (languageCount[language] || 0) + 1;
    });

    // Screen resolution statistics - calculate from actual data
    const resolutionCount: { [key: string]: number } = {};
    visits.forEach(event => {
      const resolution = event.data.screenResolution || 'Unknown';
      resolutionCount[resolution] = (resolutionCount[resolution] || 0) + 1;
    });

    // Hourly statistics - accurate calculation
    const hourlyCount: { [key: number]: { visits: number; uniqueVisitors: Set<string> } } = {};
    for (let i = 0; i < 24; i++) {
      hourlyCount[i] = { visits: 0, uniqueVisitors: new Set() };
    }
    visits.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyCount[hour].visits++;
      hourlyCount[hour].uniqueVisitors.add(event.visitorId);
    });

    // Daily statistics - accurate calculation
    const dailyCount: { [key: string]: { visits: number; uniqueVisitors: Set<string>; likes: number } } = {};
    visits.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!dailyCount[date]) {
        dailyCount[date] = { visits: 0, uniqueVisitors: new Set(), likes: 0 };
      }
      dailyCount[date].visits++;
      dailyCount[date].uniqueVisitors.add(event.visitorId);
    });
    likes.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (dailyCount[date]) {
        dailyCount[date].likes++;
      }
    });

    // Top sections by interactions - accurate calculation
    const sectionInteractionCount: { [key: string]: number } = {};
    sectionInteractions.forEach(event => {
      const sectionId = event.data.sectionId || 'Unknown';
      sectionInteractionCount[sectionId] = (sectionInteractionCount[sectionId] || 0) + 1;
    });

    // Calculate pages per session accurately
    const totalPageViews = pageViews.length + visits.length; // visits count as page views too
    const pagesPerSession = sessions.length > 0 ? totalPageViews / sessions.length : 0;

    // Calculate average load time from actual performance data
    const loadTimes = visits
      .map(event => event.data.loadTime)
      .filter(time => typeof time === 'number' && time > 0);
    const averageLoadTime = loadTimes.length > 0 
      ? Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length)
      : 0;

    return {
      // Core metrics
      totalVisits: visits.length,
      uniqueVisitors,
      totalLikes: likes.length,
      totalCoins: coins.reduce((sum, event) => sum + (event.data.amount || 1), 0),
      averageSessionDuration,
      bounceRate,

      // Device and browser stats with percentages
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
      osStats: Object.entries(osCount).map(([os, count]) => ({
        os,
        count,
        percentage: visits.length > 0 ? Math.round((count / visits.length) * 100) : 0
      })),

      // Time-based stats
      hourlyStats: Object.entries(hourlyCount).map(([hour, data]) => ({
        hour: parseInt(hour),
        visits: data.visits,
        uniqueVisitors: data.uniqueVisitors.size
      })),
      dailyStats: Object.entries(dailyCount).map(([date, data]) => ({
        date,
        visits: data.visits,
        uniqueVisitors: data.uniqueVisitors.size,
        likes: data.likes
      })),

      // Engagement stats
      topSections: Object.entries(sectionInteractionCount)
        .map(([sectionId, interactions]) => ({ sectionId, interactions }))
        .sort((a, b) => b.interactions - a.interactions)
        .slice(0, 5),
      languageStats: Object.entries(languageCount).map(([language, count]) => ({ language, count })),
      screenResolutionStats: Object.entries(resolutionCount).map(([resolution, count]) => ({ resolution, count })),

      // Performance metrics
      averageLoadTime,
      totalPageViews,
      pagesPerSession
    };
  }

  public clearAnalyticsForProject(projectId: string): void {
    const analytics = this.getSimpleAnalytics();
    analytics.events = analytics.events.filter(event => event.projectId !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.SIMPLE_ANALYTICS, analytics);
    
    // Clear session data for this project
    const sessions = this.loadFromStorage(this.STORAGE_KEYS.VISITOR_SESSIONS) || {};
    Object.keys(sessions).forEach(sessionId => {
      if (sessions[sessionId].projectId === projectId) {
        delete sessions[sessionId];
      }
    });
    this.saveToStorage(this.STORAGE_KEYS.VISITOR_SESSIONS, sessions);
    
    console.log('🧹 Analytics cleared for project:', projectId);
  }

  // Private analytics helper methods
  private getSimpleAnalytics(): { events: SimpleAnalyticsEvent[] } {
    return this.loadFromStorage(this.STORAGE_KEYS.SIMPLE_ANALYTICS) || { events: [] };
  }

  private createSimpleAnalytics(): void {
    this.saveToStorage(this.STORAGE_KEYS.SIMPLE_ANALYTICS, { events: [] });
  }

  private isUniqueVisitor(projectId: string, visitorId: string): boolean {
    const analytics = this.getSimpleAnalytics();
    const existingVisit = analytics.events.find(event => 
      event.projectId === projectId && 
      event.visitorId === visitorId && 
      event.type === 'visit'
    );
    return !existingVisit;
  }

  private getRecentVisit(projectId: string, sessionId: string): SimpleAnalyticsEvent | undefined {
    const analytics = this.getSimpleAnalytics();
    return analytics.events
      .filter(event => event.projectId === projectId && event.sessionId === sessionId && event.type === 'visit')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  private incrementProjectVisits(projectId: string, isUniqueVisitor: boolean): void {
    const project = this.getProject(projectId);
    if (project) {
      project.analytics.visits = (project.analytics.visits || 0) + 1;
      if (isUniqueVisitor) {
        project.analytics.uniqueVisitors = (project.analytics.uniqueVisitors || 0) + 1;
      }
      project.analytics.lastVisited = new Date();
      this.saveProject(project);
    }
  }

  private incrementProjectLikes(projectId: string): void {
    const project = this.getProject(projectId);
    if (project) {
      project.analytics.likes = (project.analytics.likes || 0) + 1;
      this.saveProject(project);
    }
  }

  private incrementProjectCoins(projectId: string, amount: number): void {
    const project = this.getProject(projectId);
    if (project) {
      project.analytics.coins = (project.analytics.coins || 0) + amount;
      this.saveProject(project);
    }
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('templates_uz_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('templates_uz_visitor_id', visitorId);
    }
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('templates_uz_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('templates_uz_session_id', sessionId);
    }
    return sessionId;
  }

  private updateSessionData(sessionId: string, visitorId: string, projectId: string): void {
    const sessions = this.loadFromStorage(this.STORAGE_KEYS.VISITOR_SESSIONS) || {};
    
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        id: sessionId,
        visitorId,
        projectId,
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 1,
        duration: 0
      };
    } else {
      sessions[sessionId].lastActivity = new Date();
      sessions[sessionId].pageViews++;
      sessions[sessionId].duration = Math.floor((new Date().getTime() - new Date(sessions[sessionId].startTime).getTime()) / 1000);
    }
    
    this.saveToStorage(this.STORAGE_KEYS.VISITOR_SESSIONS, sessions);
  }

  private getSessionsForProject(projectId: string, days: number): any[] {
    const sessions = this.loadFromStorage(this.STORAGE_KEYS.VISITOR_SESSIONS) || {};
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return Object.values(sessions).filter((session: any) => 
      session.projectId === projectId && 
      new Date(session.startTime) >= cutoffDate
    );
  }

  private detectDevice(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'Tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows NT')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux') && !userAgent.includes('Android')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Other';
  }

  private getScreenResolution(): string {
    return `${screen.width}x${screen.height}`;
  }

  private getLanguage(): string {
    return navigator.language || 'en-US';
  }

  private getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Template Management
  public getSectionTemplates(): SectionTemplate[] {
    const templatesData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || {};
    return Object.values(templatesData.sections || {});
  }

  public saveSectionTemplate(template: SectionTemplate): void {
    const templatesData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || { sections: {}, themes: {} };
    templatesData.sections[template.id] = template;
    this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templatesData);
  }

  public getThemes(): ThemeConfig[] {
    const templatesData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || {};
    return Object.values(templatesData.themes || {});
  }

  public saveTheme(theme: ThemeConfig): void {
    const templatesData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || { sections: {}, themes: {} };
    templatesData.themes[theme.id] = theme;
    this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templatesData);
  }

  // Analytics Management
  public getAnalytics(): UsageMetrics | null {
    const analyticsData = this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS);
    return analyticsData?.usageMetrics || null;
  }

  public updateProjectStats(projectId: string): void {
    const analyticsData = this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || { projectStats: [], usageMetrics: this.getDefaultUsageMetrics() };
    
    const existingStats = analyticsData.projectStats.find((stats: ProjectStats) => stats.projectId === projectId);
    const project = this.getProject(projectId);
    
    if (project) {
      if (existingStats) {
        existingStats.sectionsCount = project.sections.length;
        existingStats.lastModified = new Date();
        existingStats.versions += 1;
      } else {
        analyticsData.projectStats.push({
          projectId,
          sectionsCount: project.sections.length,
          lastModified: new Date(),
          timeSpent: 0,
          versions: 1,
        });
      }
    }

    // Update usage metrics
    analyticsData.usageMetrics.totalProjects = this.getAllProjects().length;
    analyticsData.usageMetrics.totalSections = this.getAllProjects().reduce((total, project) => total + project.sections.length, 0);
    analyticsData.usageMetrics.lastActive = new Date();
    analyticsData.usageMetrics.storageUsed = this.calculateStorageUsage();

    this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analyticsData);
  }

  private removeProjectStats(projectId: string): void {
    const analyticsData = this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || { projectStats: [], usageMetrics: this.getDefaultUsageMetrics() };
    analyticsData.projectStats = analyticsData.projectStats.filter((stats: ProjectStats) => stats.projectId !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, analyticsData);
  }

  // Settings Management
  public getSettings(): any {
    return this.loadFromStorage(this.STORAGE_KEYS.SETTINGS);
  }

  public saveSettings(settings: any): void {
    this.saveToStorage(this.STORAGE_KEYS.SETTINGS, {
      ...settings,
      lastSync: new Date(),
    });
  }

  // Cache Management
  public getCache(key: string): any {
    const cache = this.loadFromStorage(this.STORAGE_KEYS.CACHE) || {};
    const item = cache[key];
    
    if (item && item.expiry && new Date() > new Date(item.expiry)) {
      delete cache[key];
      this.saveToStorage(this.STORAGE_KEYS.CACHE, cache);
      return null;
    }
    
    return item?.data || null;
  }

  public setCache(key: string, data: any, ttlMinutes: number = 60): void {
    const cache = this.loadFromStorage(this.STORAGE_KEYS.CACHE) || {};
    cache[key] = {
      data,
      expiry: new Date(Date.now() + ttlMinutes * 60 * 1000),
      created: new Date(),
    };
    this.saveToStorage(this.STORAGE_KEYS.CACHE, cache);
  }

  public clearCache(): void {
    this.saveToStorage(this.STORAGE_KEYS.CACHE, {});
  }

  // Backup and Export
  public exportAllData(): string {
    const data: OptimizedStorageData = {
      user: this.loadFromStorage(this.STORAGE_KEYS.USER),
      projects: this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {},
      templates: this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || { sections: {}, themes: {} },
      settings: this.loadFromStorage(this.STORAGE_KEYS.SETTINGS),
      analytics: this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || { projectStats: [], usageMetrics: this.getDefaultUsageMetrics() },
    };

    return JSON.stringify(data, null, 2);
  }

  public importAllData(jsonData: string): boolean {
    try {
      const data: OptimizedStorageData = JSON.parse(jsonData);
      
      if (data.user) this.saveToStorage(this.STORAGE_KEYS.USER, data.user);
      if (data.projects) this.saveToStorage(this.STORAGE_KEYS.PROJECTS, data.projects);
      if (data.templates) this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, data.templates);
      if (data.settings) this.saveToStorage(this.STORAGE_KEYS.SETTINGS, data.settings);
      if (data.analytics) this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, data.analytics);

      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  // Utility Methods
  private saveToStorage(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`❌ Error saving to localStorage (${key}):`, error);
    }
  }

  private loadFromStorage(key: string): any {
    try {
      const serializedData = localStorage.getItem(key);
      if (!serializedData) return null;

      return JSON.parse(serializedData, (key, value) => {
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error(`❌ Error loading from localStorage (${key}):`, error);
      return null;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateStorageUsage(): number {
    let totalSize = 0;
    for (const key of Object.values(this.STORAGE_KEYS)) {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    }
    return totalSize;
  }

  private createDefaultUser(): void {
    const defaultUser = {
      id: this.generateId(),
      profile: {
        name: 'User',
        email: 'user@templates.uz',
      },
      preferences: this.getDefaultPreferences(),
      subscription: this.getDefaultSubscription(),
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    this.saveToStorage(this.STORAGE_KEYS.USER, defaultUser);
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      editor: {
        autoSave: true,
        autoSaveInterval: 30,
        showGrid: false,
        snapToGrid: true,
      },
    };
  }

  private getDefaultSubscription(): UserSubscription {
    return {
      plan: 'free',
      status: 'active',
      startDate: new Date(),
      features: ['basic_templates', 'export_html'],
      limits: {
        maxProjects: 3,
        maxSections: 50,
        storageLimit: 100, // 100MB
      },
    };
  }

  private createDefaultSettings(): void {
    const defaultSettings = {
      version: '1.0.0',
      lastSync: new Date(),
      features: {
        aiAssistant: false,
        collaboration: false,
        customCode: false,
        analytics: true,
        ecommerce: false,
        multiLanguage: false,
      },
    };
    this.saveToStorage(this.STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  private getDefaultUsageMetrics(): UsageMetrics {
    return {
      totalProjects: 0,
      totalSections: 0,
      storageUsed: 0,
      lastActive: new Date(),
      sessionsCount: 1,
      averageSessionTime: 0,
    };
  }

  // Storage Health and Maintenance
  public getStorageHealth(): {
    totalSize: number;
    keyCount: number;
    largestKey: string;
    oldestData: Date | null;
    recommendations: string[];
  } {
    let totalSize = 0;
    let keyCount = 0;
    let largestKey = '';
    let largestSize = 0;
    let oldestData: Date | null = null;
    const recommendations: string[] = [];

    for (const [name, key] of Object.entries(this.STORAGE_KEYS)) {
      const item = localStorage.getItem(key);
      if (item) {
        keyCount++;
        const size = new Blob([item]).size;
        totalSize += size;

        if (size > largestSize) {
          largestSize = size;
          largestKey = name;
        }

        try {
          const data = JSON.parse(item);
          if (data.lastSync || data.updatedAt || data.createdAt) {
            const date = new Date(data.lastSync || data.updatedAt || data.createdAt);
            if (!oldestData || date < oldestData) {
              oldestData = date;
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }

    if (totalSize > 4 * 1024 * 1024) {
      recommendations.push('Consider cleaning up old data to free up storage space');
    }
    if (oldestData && (Date.now() - oldestData.getTime()) > 30 * 24 * 60 * 60 * 1000) {
      recommendations.push('Some data is older than 30 days, consider archiving');
    }
    if (keyCount > 10) {
      recommendations.push('Consider consolidating storage keys for better performance');
    }

    return {
      totalSize,
      keyCount,
      largestKey,
      oldestData,
      recommendations,
    };
  }

  public cleanupOldData(daysOld: number = 30): number {
    let cleanedItems = 0;
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const cache = this.loadFromStorage(this.STORAGE_KEYS.CACHE) || {};
    const cleanCache: any = {};
    
    for (const [key, item] of Object.entries(cache)) {
      if (item && typeof item === 'object' && item.created) {
        if (new Date(item.created) > cutoffDate) {
          cleanCache[key] = item;
        } else {
          cleanedItems++;
        }
      }
    }
    
    this.saveToStorage(this.STORAGE_KEYS.CACHE, cleanCache);
    return cleanedItems;
  }

  // Support System Methods
  public getSupportTickets(): SupportTicket[] {
    const supportData = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT) || { tickets: [], faq: [] };
    return supportData.tickets || [];
  }

  public saveSupportTicket(ticket: SupportTicket): void {
    const supportData = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT) || { tickets: [], faq: [] };
    supportData.tickets = supportData.tickets || [];
    supportData.tickets.push({
      ...ticket,
      id: this.generateId(),
      createdAt: new Date(),
      status: 'open'
    });
    this.saveToStorage(this.STORAGE_KEYS.SUPPORT, supportData);
  }

  public getFAQ(): FAQItem[] {
    const supportData = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT) || { tickets: [], faq: [] };
    return supportData.faq || this.getDefaultFAQ();
  }

  // Template Gallery Methods
  public getTemplateGallery(): TemplateGalleryItem[] {
    const galleryData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATE_GALLERY) || [];
    return galleryData.length > 0 ? galleryData : this.getDefaultTemplateGallery();
  }

  public saveTemplateGalleryItem(item: TemplateGalleryItem): void {
    const galleryData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATE_GALLERY) || [];
    galleryData.push({
      ...item,
      id: this.generateId(),
      createdAt: new Date()
    });
    this.saveToStorage(this.STORAGE_KEYS.TEMPLATE_GALLERY, galleryData);
  }

  public searchTemplates(query: string, category?: string): TemplateGalleryItem[] {
    const templates = this.getTemplateGallery();
    return templates.filter(template => {
      const matchesQuery = !query || 
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || template.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  private getDefaultFAQ(): FAQItem[] {
    return [
      {
        id: '1',
        question: 'How do I create my first website?',
        answer: 'Click the "Create New Website" button on your dashboard, fill in the details, and start adding sections using our drag-and-drop editor.',
        category: 'getting-started',
        helpful: 0,
        views: 0
      },
      {
        id: '2',
        question: 'Can I use my own domain?',
        answer: 'Yes! With our Pro plan, you can connect your custom domain. Go to your project settings and add your domain in the publishing section.',
        category: 'domains',
        helpful: 0,
        views: 0
      },
      {
        id: '3',
        question: 'How do I export my website?',
        answer: 'In the editor, click the "Export" button to download your website as a complete HTML file that you can host anywhere.',
        category: 'export',
        helpful: 0,
        views: 0
      },
    ];
  }

  private getDefaultTemplateGallery(): TemplateGalleryItem[] {
    return [
      {
        id: 'gallery-1',
        name: 'Modern Business',
        description: 'Professional business website with hero, services, and contact sections',
        category: 'business',
        thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
        previewUrl: '#',
        tags: ['business', 'professional', 'modern'],
        sections: ['header-modern', 'hero-modern', 'services-grid', 'contact-form', 'footer-simple'],
        isPremium: false,
        downloads: 0,
        rating: 4.8,
        createdAt: new Date()
      },
    ];
  }

  // Clear all data
  public clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear session storage as well
    sessionStorage.removeItem('templates_uz_session_id');
    localStorage.removeItem('templates_uz_visitor_id');
    
    console.log('🧹 All data cleared from storage');
  }
}

// Export singleton instance
export const optimizedStorage = OptimizedStorageManager.getInstance();

// Support System Interfaces
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'bug' | 'feature' | 'question' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userEmail: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
  tags?: string[];
}

// Template Gallery Interfaces
export interface TemplateGalleryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  tags: string[];
  sections: string[];
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: Date;
}