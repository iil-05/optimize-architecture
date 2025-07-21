/**
 * Icon Registry - Central icon management system
 * Stores icons once and provides efficient access
 */

import * as LucideIcons from 'lucide-react';

export interface IconDefinition {
  id: string;
  name: string;
  category: 'general' | 'business' | 'technology' | 'communication' | 'media' | 'navigation' | 'actions' | 'weather' | 'food' | 'security';
  component: React.ComponentType<any>;
  keywords: string[];
  isBuiltIn: boolean;
  isPremium: boolean;
  usage: number;
  createdAt: Date;
}

export class IconRegistry {
  private static instance: IconRegistry;
  private icons: Map<string, IconDefinition> = new Map();
  private categories: Map<string, string[]> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): IconRegistry {
    if (!IconRegistry.instance) {
      IconRegistry.instance = new IconRegistry();
    }
    return IconRegistry.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    
    this.loadBuiltInIcons();
    this.loadCustomIcons();
    this.buildCategories();
    this.initialized = true;
  }

  private loadBuiltInIcons(): void {
    const iconCategories = {
      general: [
        'Star', 'Heart', 'Shield', 'Lock', 'Eye', 'Home', 'User', 'Settings',
        'Search', 'Filter', 'Bookmark', 'Tag', 'Flag', 'Bell', 'Clock', 'Calendar'
      ],
      business: [
        'Briefcase', 'Building', 'TrendingUp', 'BarChart3', 'PieChart', 'Target',
        'Award', 'Trophy', 'Medal', 'Crown', 'Gem', 'DollarSign', 'CreditCard'
      ],
      technology: [
        'Smartphone', 'Laptop', 'Monitor', 'Tablet', 'Watch', 'Gamepad2', 'Wifi',
        'Bluetooth', 'Database', 'Server', 'Cloud', 'Code', 'Terminal', 'Cpu'
      ],
      communication: [
        'MessageSquare', 'MessageCircle', 'Send', 'Bell', 'Phone', 'Mail',
        'Users', 'UserCheck', 'UserPlus', 'Share', 'Link', 'ExternalLink'
      ],
      navigation: [
        'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp',
        'ChevronDown', 'ChevronLeft', 'ChevronRight', 'Menu', 'MoreVertical'
      ],
      media: [
        'Play', 'Pause', 'Square', 'SkipForward', 'SkipBack', 'Repeat',
        'Volume2', 'VolumeX', 'Camera', 'Image', 'Video', 'Music', 'Headphones'
      ],
      actions: [
        'Plus', 'Minus', 'Check', 'X', 'Edit', 'Trash2', 'Copy', 'Download',
        'Upload', 'Save', 'Search', 'Filter', 'Maximize', 'Minimize'
      ],
      weather: [
        'Sun', 'Moon', 'Cloud', 'CloudRain', 'Snowflake', 'Thermometer',
        'Wind', 'Umbrella', 'Rainbow', 'Sunrise', 'Sunset'
      ],
      food: [
        'Coffee', 'Pizza', 'Utensils', 'Wine', 'Apple', 'Cherry', 'Cake',
        'IceCream', 'Cookie', 'Sandwich', 'Soup', 'Salad'
      ],
      security: [
        'Shield', 'Lock', 'Unlock', 'Key', 'ShieldCheck', 'ShieldAlert',
        'Eye', 'EyeOff', 'Fingerprint', 'Scan', 'AlertTriangle'
      ]
    };

    Object.entries(iconCategories).forEach(([category, iconNames]) => {
      iconNames.forEach(iconName => {
        const IconComponent = (LucideIcons as any)[iconName];
        if (IconComponent) {
          const iconDef: IconDefinition = {
            id: iconName, // Keep original case for Lucide icon names
            name: iconName,
            category: category as any,
            component: IconComponent,
            keywords: this.generateKeywords(iconName, category),
            isBuiltIn: true,
            isPremium: false,
            usage: 0,
            createdAt: new Date(),
          };
          this.icons.set(iconDef.id, iconDef);
        }
      });
    });
  }

  private generateKeywords(iconName: string, category: string): string[] {
    const baseKeywords = [iconName.toLowerCase(), category];
    
    // Add contextual keywords based on icon name
    const keywordMap: { [key: string]: string[] } = {
      'star': ['favorite', 'rating', 'bookmark'],
      'heart': ['love', 'like', 'favorite'],
      'home': ['house', 'main', 'dashboard'],
      'user': ['person', 'profile', 'account'],
      'mail': ['email', 'message', 'contact'],
      'phone': ['call', 'contact', 'mobile'],
      'search': ['find', 'look', 'magnify'],
      'edit': ['modify', 'change', 'update'],
      'delete': ['remove', 'trash', 'clear'],
      'save': ['store', 'keep', 'preserve'],
    };

    const additionalKeywords = keywordMap[iconName.toLowerCase()] || [];
    return [...baseKeywords, ...additionalKeywords];
  }

  private loadCustomIcons(): void {
    // Load custom icons from localStorage
    const customIcons = this.getStoredIcons();
    customIcons.forEach(icon => {
      this.icons.set(icon.id, icon);
    });
  }

  private buildCategories(): void {
    this.categories.clear();
    this.icons.forEach(icon => {
      if (!this.categories.has(icon.category)) {
        this.categories.set(icon.category, []);
      }
      this.categories.get(icon.category)!.push(icon.id);
    });
  }

  public getAllIcons(): IconDefinition[] {
    return Array.from(this.icons.values());
  }

  public getIcon(id: string): IconDefinition | null {
    return this.icons.get(id) || null;
  }

  public getIconsByCategory(category: string): IconDefinition[] {
    return Array.from(this.icons.values()).filter(icon => icon.category === category);
  }

  public searchIcons(query: string): IconDefinition[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.icons.values()).filter(icon => 
      icon.name.toLowerCase().includes(searchTerm) ||
      icon.keywords.some(keyword => keyword.includes(searchTerm))
    );
  }

  public getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  public getCategoryCount(category: string): number {
    return this.categories.get(category)?.length || 0;
  }

  public incrementUsage(iconId: string): void {
    const icon = this.icons.get(iconId);
    if (icon) {
      icon.usage++;
      this.saveIconUsage();
    }
  }

  public getPopularIcons(limit: number = 20): IconDefinition[] {
    return Array.from(this.icons.values())
      .sort((a, b) => b.usage - a.usage)
      .slice(0, limit);
  }

  public addCustomIcon(icon: Omit<IconDefinition, 'isBuiltIn' | 'createdAt'>): void {
    const customIcon: IconDefinition = {
      ...icon,
      isBuiltIn: false,
      createdAt: new Date(),
    };
    this.icons.set(icon.id, customIcon);
    this.buildCategories();
    this.saveCustomIcons();
  }

  private saveCustomIcons(): void {
    const customIcons = Array.from(this.icons.values()).filter(icon => !icon.isBuiltIn);
    localStorage.setItem('templates_uz_custom_icons', JSON.stringify(customIcons));
  }

  private saveIconUsage(): void {
    const usage = Array.from(this.icons.entries()).reduce((acc, [id, icon]) => {
      if (icon.usage > 0) {
        acc[id] = icon.usage;
      }
      return acc;
    }, {} as { [key: string]: number });
    
    localStorage.setItem('templates_uz_icon_usage', JSON.stringify(usage));
  }

  private getStoredIcons(): IconDefinition[] {
    try {
      const stored = localStorage.getItem('templates_uz_custom_icons');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public getIconComponent(iconId: string): React.ComponentType<any> | null {
    const icon = this.getIcon(iconId);
    return icon?.component || null;
  }
}

export const iconRegistry = IconRegistry.getInstance();