/**
 * Optimized Storage System for Templates.uz
 * Efficient storage with minimal data duplication
 */

import { themeRegistry, ThemeDefinition } from './ThemeRegistry';
import { iconRegistry, IconDefinition } from './IconRegistry';
import { sectionRegistry, SectionDefinition, SectionInstance } from './SectionRegistry';

export interface StoredProject {
  id: string;
  name: string;
  description?: string;
  websiteUrl: string;
  category: string;
  seoKeywords: string[];
  logo?: string;
  favicon?: string;
  themeId: string; // Reference to theme registry
  sections: SectionInstance[]; // Contains section references
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

export class OptimizedStorage {
  private static instance: OptimizedStorage;
  private readonly STORAGE_KEYS = {
    PROJECTS: 'templates_uz_projects',
    USER_SETTINGS: 'templates_uz_user_settings',
    THEME_SELECTIONS: 'templates_uz_theme_selections',
    ICON_SELECTIONS: 'templates_uz_icon_selections',
    SECTION_SELECTIONS: 'templates_uz_section_selections',
    CACHE: 'templates_uz_cache',
  };

  private constructor() {}

  public static getInstance(): OptimizedStorage {
    if (!OptimizedStorage.instance) {
      OptimizedStorage.instance = new OptimizedStorage();
    }
    return OptimizedStorage.instance;
  }

  public initialize(): void {
    // Initialize registries
    themeRegistry.initialize();
    iconRegistry.initialize();
    sectionRegistry.initialize();

    // Load user selections
    this.loadUserSelections();
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
    this.updateRecentlyUsed(project);
  }

  public deleteProject(projectId: string): void {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, filteredProjects);
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
    
    // Track theme selection
    this.trackThemeSelection(themeId);
  }

  public updateProjectTheme(projectId: string, themeId: string): void {
    // This method can be used to update a specific project's theme
    // For now, we'll use the project update mechanism
    console.log('🎨 Updating project theme:', { projectId, themeId });
  }

  public getThemeSelections(): { [themeId: string]: number } {
    return this.loadFromStorage(this.STORAGE_KEYS.THEME_SELECTIONS) || {};
  }

  private trackThemeSelection(themeId: string): void {
    const selections = this.getThemeSelections();
    selections[themeId] = (selections[themeId] || 0) + 1;
    this.saveToStorage(this.STORAGE_KEYS.THEME_SELECTIONS, selections);
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
    settings.recentlyUsedIcons = recent.slice(0, 20); // Keep only 20 recent
    this.saveUserSettings(settings);
    
    // Track icon usage
    iconRegistry.incrementUsage(iconId);
    this.trackIconSelection(iconId);
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

  public getIconSelections(): { [iconId: string]: number } {
    return this.loadFromStorage(this.STORAGE_KEYS.ICON_SELECTIONS) || {};
  }

  private trackIconSelection(iconId: string): void {
    const selections = this.getIconSelections();
    selections[iconId] = (selections[iconId] || 0) + 1;
    this.saveToStorage(this.STORAGE_KEYS.ICON_SELECTIONS, selections);
  }

  // Section Management
  public getRecentlyUsedSections(): SectionDefinition[] {
    const settings = this.getUserSettings();
    return settings.recentlyUsedSections
      .map(id => sectionRegistry.getSection(id))
      .filter(Boolean) as SectionDefinition[];
  }

  public getFavoriteSections(): SectionDefinition[] {
    const settings = this.getUserSettings();
    return settings.favoriteSections
      .map(id => sectionRegistry.getSection(id))
      .filter(Boolean) as SectionDefinition[];
  }

  public addToRecentlyUsedSections(sectionId: string): void {
    const settings = this.getUserSettings();
    const recent = settings.recentlyUsedSections.filter(id => id !== sectionId);
    recent.unshift(sectionId);
    settings.recentlyUsedSections = recent.slice(0, 20); // Keep only 20 recent
    this.saveUserSettings(settings);
    
    // Track section usage
    sectionRegistry.incrementUsage(sectionId);
    this.trackSectionSelection(sectionId);
  }

  public toggleFavoriteSection(sectionId: string): void {
    const settings = this.getUserSettings();
    const index = settings.favoriteSections.indexOf(sectionId);
    
    if (index >= 0) {
      settings.favoriteSections.splice(index, 1);
    } else {
      settings.favoriteSections.push(sectionId);
    }
    
    this.saveUserSettings(settings);
  }

  public getSectionSelections(): { [sectionId: string]: number } {
    return this.loadFromStorage(this.STORAGE_KEYS.SECTION_SELECTIONS) || {};
  }

  private trackSectionSelection(sectionId: string): void {
    const selections = this.getSectionSelections();
    selections[sectionId] = (selections[sectionId] || 0) + 1;
    this.saveToStorage(this.STORAGE_KEYS.SECTION_SELECTIONS, selections);
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

  private updateRecentlyUsed(project: StoredProject): void {
    // Update recently used sections and icons based on project content
    project.sections.forEach(sectionInstance => {
      this.addToRecentlyUsedSections(sectionInstance.sectionId);
      
      // Extract icons from section data
      if (sectionInstance.data) {
        this.extractAndTrackIcons(sectionInstance.data);
      }
    });
  }

  private extractAndTrackIcons(data: any): void {
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        if (key.includes('icon') && typeof value === 'string') {
          this.addToRecentlyUsedIcons(value);
        } else if (Array.isArray(value)) {
          value.forEach(item => this.extractAndTrackIcons(item));
        } else if (typeof value === 'object') {
          this.extractAndTrackIcons(value);
        }
      });
    }
  }

  private loadUserSelections(): void {
    // Load usage data into registries
    const iconUsage = this.loadFromStorage('templates_uz_icon_usage') || {};
    Object.entries(iconUsage).forEach(([iconId, usage]) => {
      const icon = iconRegistry.getIcon(iconId);
      if (icon) {
        icon.usage = usage as number;
      }
    });

    const sectionUsage = this.loadFromStorage('templates_uz_section_usage') || {};
    Object.entries(sectionUsage).forEach(([sectionId, data]) => {
      const section = sectionRegistry.getSection(sectionId);
      if (section && typeof data === 'object') {
        section.usage = (data as any).usage || 0;
        section.downloads = (data as any).downloads || 0;
      }
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

  // Analytics and Insights
  public getUsageAnalytics(): {
    totalProjects: number;
    totalSections: number;
    mostUsedTheme: string;
    mostUsedIcons: string[];
    mostUsedSections: string[];
    storageUsage: number;
  } {
    const projects = this.getAllProjects();
    const themeSelections = this.getThemeSelections();
    const iconSelections = this.getIconSelections();
    const sectionSelections = this.getSectionSelections();

    const mostUsedTheme = Object.entries(themeSelections)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'modern-blue';

    const mostUsedIcons = Object.entries(iconSelections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id]) => id);

    const mostUsedSections = Object.entries(sectionSelections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id]) => id);

    return {
      totalProjects: projects.length,
      totalSections: projects.reduce((total, project) => total + project.sections.length, 0),
      mostUsedTheme,
      mostUsedIcons,
      mostUsedSections,
      storageUsage: this.calculateStorageUsage(),
    };
  }

  // Export/Import
  public exportData(): string {
    const data = {
      projects: this.getAllProjects(),
      userSettings: this.getUserSettings(),
      themeSelections: this.getThemeSelections(),
      iconSelections: this.getIconSelections(),
      sectionSelections: this.getSectionSelections(),
      exportedAt: new Date(),
      version: '2.0.0',
    };

    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.projects) {
        this.saveToStorage(this.STORAGE_KEYS.PROJECTS, data.projects);
      }
      if (data.userSettings) {
        this.saveToStorage(this.STORAGE_KEYS.USER_SETTINGS, data.userSettings);
      }
      if (data.themeSelections) {
        this.saveToStorage(this.STORAGE_KEYS.THEME_SELECTIONS, data.themeSelections);
      }
      if (data.iconSelections) {
        this.saveToStorage(this.STORAGE_KEYS.ICON_SELECTIONS, data.iconSelections);
      }
      if (data.sectionSelections) {
        this.saveToStorage(this.STORAGE_KEYS.SECTION_SELECTIONS, data.sectionSelections);
      }

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

  public clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear registry data
    localStorage.removeItem('templates_uz_custom_themes');
    localStorage.removeItem('templates_uz_custom_icons');
    localStorage.removeItem('templates_uz_custom_sections');
    localStorage.removeItem('templates_uz_icon_usage');
    localStorage.removeItem('templates_uz_section_usage');
  }
}

export const optimizedStorage = OptimizedStorage.getInstance();