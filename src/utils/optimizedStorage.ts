/**
 * Optimized Storage System for Templates.uz
 * High-performance storage with efficient caching and minimal overhead
 */

import { themeRegistry, ThemeDefinition } from '../core/ThemeRegistry';
import { iconRegistry, IconDefinition } from '../core/IconRegistry';
import { sectionRegistry, SectionDefinition, SectionInstance } from '../core/SectionRegistry';

export interface StoredProject {
  id: string;
  userId: string; // Add user_id to projects
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
  isTemplate?: boolean;
  publishUrl?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  userId: string; // Add user_id to user settings
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
  userId: string; // Add user_id to analytics
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

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  website?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User subscription interface
export interface UserSubscription {
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  features: string[];
}

// Support ticket interface
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'bug' | 'feature' | 'question' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// FAQ item interface
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
  tags: string[];
}

// Template gallery item interface
export interface TemplateGalleryItem {
  id: string;
  websiteId: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  websiteUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  tags: string[];
  sectionsCount: number;
  viewsCount: number;
  likesCount: number;
  coinsCount: number;
  rating: number;
  downloads: number;
  isPremium: boolean;
  price: number;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class OptimizedStorage {
  private static instance: OptimizedStorage;
  private readonly STORAGE_KEYS = {
    USER_PROFILE: 'templates_uz_user_profile',
    USER_SUBSCRIPTION: 'templates_uz_user_subscription',
    PROJECTS: 'templates_uz_projects',
    TEMPLATES: 'templates_uz_templates',
    USER_SETTINGS: 'templates_uz_user_settings',
    ANALYTICS: 'templates_uz_analytics',
    SUPPORT_TICKETS: 'templates_uz_support_tickets',
    FAQ: 'templates_uz_faq',
    TEMPLATE_GALLERY: 'templates_uz_template_gallery',
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
    this.initializeDefaultData();
  }

  // Get current user ID from auth storage
  private getCurrentUserId(): string | null {
    try {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user?.id || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  // Get current user role for admin checks
  private getCurrentUserRole(): string | null {
    try {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user?.role || 'user';
      }
      
      return 'user';
    } catch (error) {
      console.error('Error getting current user role:', error);
      return 'user';
    }
  }

  // Check if current user is superadmin
  public isSuperAdmin(): boolean {
    return this.getCurrentUserRole() === 'superadmin';
  }

  // SuperAdmin methods - only accessible by superadmin users
  public getAllUsersAdmin(): AdminUser[] {
    if (!this.isSuperAdmin()) {
      console.warn('🔒 Access denied: SuperAdmin privileges required');
      return [];
    }
    
    // In a real app, this would fetch from API
    // For now, return mock data
    return this.generateMockUsers();
  }

  public getAllProjectsAdmin(): AdminProject[] {
    if (!this.isSuperAdmin()) {
      console.warn('🔒 Access denied: SuperAdmin privileges required');
      return [];
    }
    
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    return allProjects.map((project: StoredProject) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      websiteUrl: project.websiteUrl,
      category: project.category,
      userId: project.userId,
      userName: 'User Name', // Would be fetched from user data
      userEmail: 'user@example.com', // Would be fetched from user data
      themeId: project.themeId,
      isPublished: project.isPublished,
      sectionsCount: project.sections.length,
      viewsCount: Math.floor(Math.random() * 1000),
      likesCount: Math.floor(Math.random() * 100),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  private generateMockUsers(): AdminUser[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
        role: 'pro',
        status: 'active',
        plan: 'pro',
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(),
        projectsCount: 5,
        storageUsed: 250,
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
        role: 'enterprise',
        status: 'active',
        plan: 'enterprise',
        createdAt: new Date('2024-01-10'),
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        projectsCount: 12,
        storageUsed: 850,
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'user',
        status: 'active',
        plan: 'free',
        createdAt: new Date('2024-02-01'),
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        projectsCount: 2,
        storageUsed: 45,
      },
    ];
  }

  // Ensure user has access to resource
  private checkUserAccess(resourceUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.warn('🔒 No authenticated user found');
      return false;
    }
    
    if (currentUserId !== resourceUserId) {
      console.warn('🔒 Access denied: User does not own this resource');
      return false;
    }
    
    return true;
  }

  // Optimized project management with caching
  public getAllProjects(): StoredProject[] {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.warn('🔒 No authenticated user, returning empty projects');
      return [];
    }
    
    if (this.isCacheValid()) {
      return Array.from(this.projectsCache.values()).filter(p => p.userId === currentUserId);
    }
    
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    const projects = allProjects.filter((p: StoredProject) => p.userId === currentUserId);
    this.updateProjectsCache(allProjects);
    return projects;
  }

  public getProject(projectId: string): StoredProject | null {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.warn('🔒 No authenticated user');
      return null;
    }
    
    if (this.projectsCache.has(projectId)) {
      const project = this.projectsCache.get(projectId);
      if (project && this.checkUserAccess(project.userId)) {
        return project;
      }
      return null;
    }
    
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    const project = allProjects.find((p: StoredProject) => p.id === projectId);
    
    if (project && this.checkUserAccess(project.userId)) {
      return project;
    }
    
    return null;
  }

  // Fast URL-based project lookup
  public getProjectByUrl(websiteUrl: string): StoredProject | null {
    const currentUserId = this.getCurrentUserId();
    
    if (this.urlToProjectCache.has(websiteUrl)) {
      const projectId = this.urlToProjectCache.get(websiteUrl);
      if (projectId) {
        const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
        const project = allProjects.find((p: StoredProject) => p.id === projectId);
        
        // For public site viewing, allow access to published projects
        if (project && project.isPublished) {
          return project;
        }
        
        // For private access, check user ownership
        if (project && currentUserId && this.checkUserAccess(project.userId)) {
          return project;
        }
      }
      return null;
    }
    
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    const project = allProjects.find((p: StoredProject) => p.websiteUrl === websiteUrl);
    
    if (project) {
      this.urlToProjectCache.set(websiteUrl, project.id);
      
      // For public site viewing, allow access to published projects
      if (project.isPublished) {
        return project;
      }
      
      // For private access, check user ownership
      if (currentUserId && this.checkUserAccess(project.userId)) {
        return project;
      }
    }
    
    return null;
  }

  public saveProject(project: StoredProject): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot save project: No authenticated user');
      return;
    }
    
    // Ensure project has user ID
    if (!project.userId) {
      project.userId = currentUserId;
    }
    
    // Check if user owns this project
    if (!this.checkUserAccess(project.userId)) {
      console.error('🔒 Cannot save project: Access denied');
      return;
    }
    
    // Update cache immediately
    this.projectsCache.set(project.id, { ...project, updatedAt: new Date() });
    this.urlToProjectCache.set(project.websiteUrl, project.id);
    
    // Debounced save to localStorage
    this.debouncedSave(this.STORAGE_KEYS.PROJECTS, () => {
      const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
      const otherUserProjects = allProjects.filter((p: StoredProject) => p.userId !== currentUserId);
      const currentUserProjects = Array.from(this.projectsCache.values()).filter(p => p.userId === currentUserId);
      const projects = [...otherUserProjects, ...currentUserProjects];
      this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
    });
  }

  public deleteProject(projectId: string): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot delete project: No authenticated user');
      return;
    }
    
    const project = this.getProject(projectId);
    if (!project || !this.checkUserAccess(project.userId)) {
      console.error('🔒 Cannot delete project: Access denied');
      return;
    }
    
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
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    const projects = allProjects.filter((p: StoredProject) => p.id !== projectId);
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
  
  // Template interaction tracking
  public trackTemplateDownload(creatorUserId: string, templateId: string): void {
    this.trackEvent(templateId, 'template_download', { creatorUserId });
  }
  
  public trackTemplateLike(creatorUserId: string, templateId: string): void {
    this.trackEvent(templateId, 'template_like', { creatorUserId });
  }
  
  public trackTemplateCoinDonation(creatorUserId: string, templateId: string, amount: number): void {
    this.trackEvent(templateId, 'template_coin_donation', { creatorUserId, amount });
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
      const currentUserId = this.getCurrentUserId() || 'anonymous';

      const event: AnalyticsEvent = {
        id: `${now}_${Math.random().toString(36).substr(2, 5)}`,
        userId: currentUserId,
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
    // Check if user has access to this project's analytics
    const project = this.getProject(projectId);
    if (!project) {
      console.warn('🔒 Cannot access analytics: Project not found or access denied');
      return this.getEmptyAnalyticsSummary();
    }
    
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

  private getEmptyAnalyticsSummary(): AnalyticsSummary {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      totalLikes: 0,
      totalCoins: 0,
      deviceStats: [],
      browserStats: [],
      dailyStats: [],
      hourlyStats: Array.from({ length: 24 }, (_, i) => ({ hour: i, visits: 0 }))
    };
  }

  // User Settings (optimized)
  public getUserPreferences(): UserSettings {
    return this.getUserSettings();
  }

  public saveUserPreferences(preferences: UserSettings): void {
    this.saveUserSettings(preferences);
  }

  public getUserSettings(): UserSettings {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.warn('🔒 No authenticated user for settings');
      return this.getDefaultUserSettings();
    }
    
    const defaultSettings: UserSettings = {
      userId: currentUserId,
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

    const allSettings = this.loadFromStorage(this.STORAGE_KEYS.USER_SETTINGS) || {};
    const userSettings = allSettings[currentUserId];
    return userSettings ? { ...defaultSettings, ...userSettings } : defaultSettings;
  }

  private getDefaultUserSettings(): UserSettings {
    return {
      userId: 'anonymous',
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
  }

  public saveUserSettings(settings: UserSettings): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot save settings: No authenticated user');
      return;
    }
    
    const allSettings = this.loadFromStorage(this.STORAGE_KEYS.USER_SETTINGS) || {};
    allSettings[currentUserId] = { ...settings, userId: currentUserId };
    this.saveToStorage(this.STORAGE_KEYS.USER_SETTINGS, allSettings);
  }

  // User Profile Management
  public getUser(): UserProfile | null {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return null;
    
    const allUsers = this.loadFromStorage(this.STORAGE_KEYS.USER_PROFILE) || {};
    return allUsers[currentUserId] || null;
  }

  public saveUser(userProfile: UserProfile): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot save user profile: No authenticated user');
      return;
    }
    
    const allUsers = this.loadFromStorage(this.STORAGE_KEYS.USER_PROFILE) || {};
    allUsers[currentUserId] = { ...userProfile, id: currentUserId, updatedAt: new Date() };
    this.saveToStorage(this.STORAGE_KEYS.USER_PROFILE, allUsers);
  }

  // User Subscription Management
  public getUserSubscription(): UserSubscription | null {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return null;
    
    const allSubscriptions = this.loadFromStorage(this.STORAGE_KEYS.USER_SUBSCRIPTION) || {};
    return allSubscriptions[currentUserId] || {
      userId: currentUserId,
      plan: 'free',
      status: 'active',
      startDate: new Date(),
      features: ['basic_templates', 'drag_drop_editor']
    };
  }

  public saveUserSubscription(subscription: UserSubscription): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot save subscription: No authenticated user');
      return;
    }
    
    const allSubscriptions = this.loadFromStorage(this.STORAGE_KEYS.USER_SUBSCRIPTION) || {};
    allSubscriptions[currentUserId] = { ...subscription, userId: currentUserId };
    this.saveToStorage(this.STORAGE_KEYS.USER_SUBSCRIPTION, allSubscriptions);
  }

  // Support Tickets Management
  public getSupportTickets(): SupportTicket[] {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return [];
    
    const allTickets = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT_TICKETS) || [];
    return allTickets.filter((ticket: SupportTicket) => ticket.userId === currentUserId);
  }

  public saveSupportTicket(ticket: SupportTicket): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot save support ticket: No authenticated user');
      return;
    }
    
    const allTickets = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT_TICKETS) || [];
    const newTicket = {
      ...ticket,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: currentUserId,
      status: 'open' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    allTickets.push(newTicket);
    this.saveToStorage(this.STORAGE_KEYS.SUPPORT_TICKETS, allTickets);
  }

  // FAQ Management
  public getFAQ(): FAQItem[] {
    return this.loadFromStorage(this.STORAGE_KEYS.FAQ) || this.getDefaultFAQ();
  }

  private getDefaultFAQ(): FAQItem[] {
    return [
      {
        id: 'faq_1',
        question: 'How do I create my first website?',
        answer: 'Click on "New Website" in your dashboard, choose a template or start from scratch, and use our drag-and-drop editor to customize your site.',
        category: 'getting-started',
        views: 1250,
        helpful: 890,
        tags: ['beginner', 'website', 'creation']
      },
      {
        id: 'faq_2',
        question: 'Can I use my own domain?',
        answer: 'Yes! With our Pro plan, you can connect your custom domain. Go to your project settings and add your domain in the "Custom Domain" section.',
        category: 'domains',
        views: 980,
        helpful: 750,
        tags: ['domain', 'custom', 'pro']
      },
      {
        id: 'faq_3',
        question: 'How do I publish my website?',
        answer: 'Once you\'re happy with your design, click the "Publish" button in the preview mode. Your site will be live instantly!',
        category: 'publishing',
        views: 1100,
        helpful: 920,
        tags: ['publish', 'live', 'website']
      }
    ];
  }

  // Template Gallery Management
  public getTemplateGallery(): TemplateGalleryItem[] {
    return this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || [];
  }

  public addTemplate(template: TemplateGalleryItem): void {
    if (!this.isSuperAdmin()) {
      console.warn('🔒 Access denied: SuperAdmin privileges required');
      return;
    }
    
    const templates = this.getTemplateGallery();
    const newTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewsCount: 0,
      likesCount: 0,
      coinsCount: 0,
      downloads: 0,
      rating: 0,
    };
    
    templates.push(newTemplate);
    this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templates);
    
    console.log('✅ Template added to gallery:', newTemplate);
  }

  public updateTemplate(templateId: string, updates: Partial<TemplateGalleryItem>): void {
    const templates = this.getTemplateGallery();
    const index = templates.findIndex(t => t.id === templateId);
    
    if (index >= 0) {
      templates[index] = { ...templates[index], ...updates, updatedAt: new Date() };
      this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templates);
    }
  }

  public getTemplateById(templateId: string): TemplateGalleryItem | null {
    const templates = this.getTemplateGallery();
    return templates.find(t => t.id === templateId) || null;
  }

  public getTemplateByWebsiteId(websiteId: string): TemplateGalleryItem | null {
    const templates = this.getTemplateGallery();
    return templates.find(t => t.websiteId === websiteId) || null;
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

  // Template interaction tracking
  public trackTemplateLike(templateId: string): void {
    const template = this.getTemplateById(templateId);
    if (template) {
      this.updateTemplate(templateId, { 
        likesCount: template.likesCount + 1 
      });
      
      // Track in user's liked templates
      const likedTemplates = this.getLikedTemplates();
      if (!likedTemplates.includes(templateId)) {
        likedTemplates.push(templateId);
        localStorage.setItem('liked_templates', JSON.stringify(likedTemplates));
      }
    }
  }

  public trackTemplateCoins(templateId: string, amount: number): void {
    const template = this.getTemplateById(templateId);
    if (template) {
      this.updateTemplate(templateId, { 
        coinsCount: template.coinsCount + amount 
      });
    }
  }

  public trackTemplateDownload(templateId: string): void {
    const template = this.getTemplateById(templateId);
    if (template) {
      this.updateTemplate(templateId, { 
        downloads: template.downloads + 1,
        viewsCount: template.viewsCount + 1
      });
    }
  }

  public isTemplateLiked(templateId: string): boolean {
    const likedTemplates = this.getLikedTemplates();
    return likedTemplates.includes(templateId);
  }

  private getLikedTemplates(): string[] {
    try {
      return JSON.parse(localStorage.getItem('liked_templates') || '[]');
    } catch {
      return [];
    }
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

  // Storage Health and Analytics
  public getStorageHealth(): { totalSize: number; projectCount: number; analyticsCount: number } {
    try {
      const currentUserId = this.getCurrentUserId();
      const projects = currentUserId ? this.getAllProjects() : [];
      const analytics = this.getAnalytics().filter(e => e.userId === (currentUserId || 'anonymous'));
      
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

  // Initialize default data
  private initializeDefaultData(): void {
    // Initialize FAQ if not exists
    if (!localStorage.getItem(this.STORAGE_KEYS.FAQ)) {
      this.saveToStorage(this.STORAGE_KEYS.FAQ, this.getDefaultFAQ());
    }

    // Initialize templates storage if not exists
    if (!localStorage.getItem(this.STORAGE_KEYS.TEMPLATES)) {
      this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, []);
    }
  }

  // Data export/import with user isolation
  public exportAllData(): string {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      throw new Error('No authenticated user for data export');
    }
    
    const data = {
      userId: currentUserId,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      projects: this.getAllProjects(),
      userSettings: this.getUserSettings(),
      userProfile: this.getUser(),
      userSubscription: this.getUserSubscription(),
      supportTickets: this.getSupportTickets(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  public importAllData(jsonData: string): boolean {
    try {
      const currentUserId = this.getCurrentUserId();
      if (!currentUserId) {
        throw new Error('No authenticated user for data import');
      }
      
      const data = JSON.parse(jsonData);
      
      // Validate that import data belongs to current user
      if (data.userId && data.userId !== currentUserId) {
        throw new Error('Cannot import data from different user');
      }
      
      // Import user-specific data
      if (data.projects) {
        data.projects.forEach((project: StoredProject) => {
          project.userId = currentUserId; // Ensure user ownership
          this.saveProject(project);
        });
      }
      
      if (data.userSettings) {
        data.userSettings.userId = currentUserId;
        this.saveUserSettings(data.userSettings);
      }
      
      if (data.userProfile) {
        data.userProfile.id = currentUserId;
        this.saveUser(data.userProfile);
      }
      
      if (data.userSubscription) {
        data.userSubscription.userId = currentUserId;
        this.saveUserSubscription(data.userSubscription);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  public clearAllData(): void {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot clear data: No authenticated user');
      // Note: Don't show toast here as this is a utility function
      return;
    }
    
    // Clear only current user's data
    this.clearUserData(currentUserId);
  }

  public clearUserData(userId: string): void {
    // Remove user's projects
    const allProjects = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || [];
    const otherUserProjects = allProjects.filter((p: StoredProject) => p.userId !== userId);
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, otherUserProjects);
    
    // Remove user's settings
    const allSettings = this.loadFromStorage(this.STORAGE_KEYS.USER_SETTINGS) || {};
    delete allSettings[userId];
    this.saveToStorage(this.STORAGE_KEYS.USER_SETTINGS, allSettings);
    
    // Remove user's profile
    const allUsers = this.loadFromStorage(this.STORAGE_KEYS.USER_PROFILE) || {};
    delete allUsers[userId];
    this.saveToStorage(this.STORAGE_KEYS.USER_PROFILE, allUsers);
    
    // Remove user's subscription
    const allSubscriptions = this.loadFromStorage(this.STORAGE_KEYS.USER_SUBSCRIPTION) || {};
    delete allSubscriptions[userId];
    this.saveToStorage(this.STORAGE_KEYS.USER_SUBSCRIPTION, allSubscriptions);
    
    // Remove user's analytics
    const allAnalytics = this.getAnalytics().filter(e => e.userId !== userId);
    this.saveToStorage(this.STORAGE_KEYS.ANALYTICS, allAnalytics);
    
    // Remove user's support tickets
    const allTickets = this.loadFromStorage(this.STORAGE_KEYS.SUPPORT_TICKETS) || [];
    const otherUserTickets = allTickets.filter((t: SupportTicket) => t.userId !== userId);
    this.saveToStorage(this.STORAGE_KEYS.SUPPORT_TICKETS, otherUserTickets);
    
    // Clear caches
    this.projectsCache.clear();
    this.urlToProjectCache.clear();
    this.analyticsCache.clear();
    this.visitDebounce.clear();
    
    // Clear timers
    this.saveTimers.forEach(timer => clearTimeout(timer));
    this.saveTimers.clear();
    
    console.log(`✅ Cleared all data for user: ${userId}`);
  }

  // Clear all data (admin function)
  public clearAllDataAdmin(): void {
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
    
    console.log('✅ All data cleared (admin)');
  }

  // Prepare data for database migration
  public prepareDatabaseMigration(): any {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      throw new Error('No authenticated user for migration');
    }
    
    return {
      users: [this.getUser()].filter(Boolean),
      projects: this.getAllProjects(),
      templates: [], // Will be populated from registries
      analytics: this.getAnalytics().filter(e => e.userId === currentUserId)
    };
  }
}

export const optimizedStorage = OptimizedStorage.getInstance();