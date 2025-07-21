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
  
  // Analytics and usage data
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
    logoFileName?: string; // Store original filename for reference
    faviconFileName?: string; // Store original filename for reference
  };
  
  // SEO and performance data
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
    customMeta: { [key: string]: string };
  };
  
  // Analytics data
  analytics: {
    views: number;
    lastViewed?: Date;
    performance: {
      loadTime?: number;
      sizeKB?: number;
      lighthouse?: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
      };
    };
  };
  
  // Deployment data
  deployment: {
    status: 'draft' | 'published' | 'archived';
    publishedUrl?: string;
    customDomain?: string;
    ssl: boolean;
    lastDeployed?: Date;
    deploymentHistory: DeploymentRecord[];
  };
}

export interface DeploymentRecord {
  id: string;
  timestamp: Date;
  version: string;
  status: 'success' | 'failed';
  url?: string;
  notes?: string;
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

// Enhanced Storage Manager with optimal structure
export class OptimizedStorageManager {
  clearAll() {
    throw new Error('Method not implemented.');
  }
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
  }

  // User Management
  public getUser(): UserProfile | null {
    // Try to get user from auth storage first
    const authUser = authStorage.getUser();
    if (authUser) {
      return {
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        company: '', // These would need to be added to AuthUser if needed
        website: '',
        bio: '',
      };
    }
    
    // Fallback to old storage
    return this.loadFromStorage(this.STORAGE_KEYS.USER);
  }

  public saveUser(user: UserProfile): void {
    // Also update auth storage if user is authenticated
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

    // Initialize analytics if not present
    if (!project.analytics) {
      project.analytics = {
        views: 0,
        performance: {},
      };
    }

    // Initialize deployment if not present
    if (!project.deployment) {
      project.deployment = {
        status: 'draft',
        ssl: false,
        deploymentHistory: [],
      };
    }

    // Initialize SEO if not present
    if (!project.seo) {
      project.seo = {
        customMeta: {},
      };
    }

    projectsData[project.id] = {
      ...project,
      updatedAt: new Date(),
    };

    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projectsData);
    this.updateProjectStats(project.id);
  }

  public deleteProject(projectId: string): void {
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    delete projectsData[projectId];
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projectsData);
    this.removeProjectStats(projectId);
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

  // Database Migration Helpers
  public prepareDatabaseMigration(): {
    users: any[];
    projects: any[];
    templates: any[];
    analytics: any[];
  } {
    const userData = this.loadFromStorage(this.STORAGE_KEYS.USER);
    const projectsData = this.loadFromStorage(this.STORAGE_KEYS.PROJECTS) || {};
    const templatesData = this.loadFromStorage(this.STORAGE_KEYS.TEMPLATES) || {};
    const analyticsData = this.loadFromStorage(this.STORAGE_KEYS.ANALYTICS) || {};

    return {
      users: userData ? [userData] : [],
      projects: Object.values(projectsData),
      templates: [
        ...Object.values(templatesData.sections || {}),
        ...Object.values(templatesData.themes || {}),
      ],
      analytics: analyticsData.projectStats || [],
    };
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

        // Check for old data
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

    // Generate recommendations
    if (totalSize > 4 * 1024 * 1024) { // > 4MB
      recommendations.push('Consider cleaning up old data to free up storage space');
    }
    if (oldestData && (Date.now() - oldestData.getTime()) > 30 * 24 * 60 * 60 * 1000) { // > 30 days
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

    // Clean cache
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
      {
        id: '4',
        question: 'What file formats are supported for logos?',
        answer: 'We support PNG, SVG, JPG, and JPEG formats for logos. Maximum file size is 5MB. SVG is recommended for best quality.',
        category: 'uploads',
        helpful: 0,
        views: 0
      },
      {
        id: '5',
        question: 'How do I collaborate with my team?',
        answer: 'Team collaboration is available with Pro and Enterprise plans. Invite team members from your project settings and assign roles.',
        category: 'collaboration',
        helpful: 0,
        views: 0
      }
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
      {
        id: 'gallery-2',
        name: 'Creative Portfolio',
        description: 'Stunning portfolio showcase for designers and creatives',
        category: 'portfolio',
        thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
        previewUrl: '#',
        tags: ['portfolio', 'creative', 'design'],
        sections: ['header-simple', 'hero-split', 'portfolio-grid', 'about-simple', 'footer-detailed'],
        isPremium: false,
        downloads: 0,
        rating: 4.9,
        createdAt: new Date()
      },
      {
        id: 'gallery-3',
        name: 'E-commerce Store',
        description: 'Complete online store with product showcase and pricing',
        category: 'ecommerce',
        thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
        previewUrl: '#',
        tags: ['ecommerce', 'store', 'products'],
        sections: ['header-modern', 'hero-modern', 'features-list', 'pricing-cards', 'testimonials-grid', 'footer-detailed'],
        isPremium: true,
        downloads: 0,
        rating: 4.7,
        createdAt: new Date()
      }
    ];
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
  sections: string[]; // Array of section template IDs
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: Date;
}