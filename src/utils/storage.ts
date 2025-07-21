import { Project, SectionTemplate, SectionInstance, StorageData } from '../types';

const STORAGE_KEY = 'templates-uz-data';
const PROJECTS_KEY = 'templates-uz-projects';
const TEMPLATES_KEY = 'templates-uz-section-templates';

export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Save complete data structure
  saveData(data: StorageData): void {
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(STORAGE_KEY, serializedData);
      console.log('✅ Data saved to localStorage:', data);
    } catch (error) {
      console.error('❌ Error saving data to localStorage:', error);
    }
  }

  // Load complete data structure
  loadData(): StorageData | null {
    try {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      if (!serializedData) return null;

      const data = JSON.parse(serializedData, (key, value) => {
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        // Also parse ISO date strings directly
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      console.log('✅ Data loaded from localStorage:', data);
      return data;
    } catch (error) {
      console.error('❌ Error loading data from localStorage:', error);
      return null;
    }
  }

  // Save projects only
  saveProjects(projects: Project[]): void {
    try {
      const serializedProjects = JSON.stringify(projects, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(PROJECTS_KEY, serializedProjects);
      
      // Also update in main data structure
      const existingData = this.loadData();
      if (existingData) {
        existingData.projects = projects;
        existingData.lastUpdated = new Date();
        this.saveData(existingData);
      }
      
      console.log('✅ Projects saved:', projects);
    } catch (error) {
      console.error('❌ Error saving projects:', error);
    }
  }

  // Load projects only
  loadProjects(): Project[] {
    try {
      const serializedProjects = localStorage.getItem(PROJECTS_KEY);
      if (!serializedProjects) return [];

      const projects = JSON.parse(serializedProjects, (key, value) => {
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        // Also parse ISO date strings directly
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      console.log('✅ Projects loaded:', projects);
      return projects;
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      return [];
    }
  }

  // Save section templates
  saveSectionTemplates(templates: SectionTemplate[]): void {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      
      // Also update in main data structure
      const existingData = this.loadData();
      if (existingData) {
        existingData.sectionTemplates = templates;
        existingData.lastUpdated = new Date();
        this.saveData(existingData);
      }
      
      console.log('✅ Section templates saved:', templates);
    } catch (error) {
      console.error('❌ Error saving section templates:', error);
    }
  }

  // Load section templates
  loadSectionTemplates(): SectionTemplate[] {
    try {
      const serializedTemplates = localStorage.getItem(TEMPLATES_KEY);
      if (!serializedTemplates) return [];

      const templates = JSON.parse(serializedTemplates);
      console.log('✅ Section templates loaded:', templates);
      return templates;
    } catch (error) {
      console.error('❌ Error loading section templates:', error);
      return [];
    }
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(TEMPLATES_KEY);
    console.log('✅ All data cleared from localStorage');
  }

  // Export data as JSON
  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; total: number; percentage: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  }
}

export const storage = StorageManager.getInstance();