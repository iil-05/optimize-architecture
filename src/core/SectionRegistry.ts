/**
 * Section Registry - Central section management system
 * Stores sections once and provides efficient access
 */

export interface SectionDefinition {
  id: string;
  name: string;
  category: 'headers' | 'heroes' | 'about' | 'services' | 'features' | 'pricing' | 'testimonials' | 'portfolio' | 'contact' | 'footers' | 'cta' | 'blog';
  type: string;
  description: string;
  thumbnail: string;
  iconId: string; // Reference to icon registry
  tags: string[];
  defaultContent: any;
  requiredIcons: string[]; // Icons used within this section
  isBuiltIn: boolean;
  isPremium: boolean;
  usage: number;
  rating: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionInstance {
  id: string;
  sectionId: string; // Reference to section definition
  data: any;
  order: number;
  themeId?: string; // Optional theme override
  customIcons?: { [key: string]: string }; // Custom icon mappings
  createdAt: Date;
  updatedAt: Date;
}

export class SectionRegistry {
  private static instance: SectionRegistry;
  private sections: Map<string, SectionDefinition> = new Map();
  private categories: Map<string, string[]> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): SectionRegistry {
    if (!SectionRegistry.instance) {
      SectionRegistry.instance = new SectionRegistry();
    }
    return SectionRegistry.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    
    this.loadBuiltInSections();
    this.loadCustomSections();
    this.buildCategories();
    this.initialized = true;
  }

  private loadBuiltInSections(): void {
    const builtInSections: SectionDefinition[] = [
      {
        id: 'header-simple',
        name: 'Simple Header',
        category: 'headers',
        type: 'header-simple',
        description: 'Clean navigation header with logo and menu items',
        thumbnail: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'navigation',
        tags: ['navigation', 'simple', 'clean', 'header'],
        requiredIcons: ['menu', 'x'],
        defaultContent: {
          logo: 'Your Brand',
          menuItems: ['Home', 'About', 'Services', 'Contact'],
          ctaText: 'Get Started',
          ctaLink: '#',
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.8,
        downloads: 1250,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'hero-modern',
        name: 'Modern Hero',
        category: 'heroes',
        type: 'hero-modern',
        description: 'Stunning fullscreen hero with background image and powerful CTA',
        thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'rocket',
        tags: ['hero', 'fullscreen', 'background', 'cta'],
        requiredIcons: ['play', 'arrow-right'],
        defaultContent: {
          title: 'Build Something Extraordinary',
          subtitle: 'Transform your ideas into reality',
          description: 'Create stunning websites with our powerful, intuitive platform. No coding required.',
          ctaText: 'Start Building Now',
          ctaLink: '#',
          secondaryCtaText: 'Watch Demo',
          backgroundImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1',
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.9,
        downloads: 2100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'about-simple',
        name: 'About Us Simple',
        category: 'about',
        type: 'about-simple',
        description: 'Clean about section with image and feature list',
        thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'users',
        tags: ['about', 'company', 'features', 'simple'],
        requiredIcons: ['check'],
        defaultContent: {
          title: 'About Our Mission',
          description: 'We are passionate innovators dedicated to creating exceptional digital experiences that empower businesses to thrive in the modern world.',
          image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
          features: ['15+ Years Experience', 'Award-Winning Team', 'Global Reach', 'Customer-Focused'],
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.7,
        downloads: 890,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'services-grid',
        name: 'Services Grid',
        category: 'services',
        type: 'services-grid',
        description: 'Professional services showcase in grid layout',
        thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'zap',
        tags: ['services', 'grid', 'business', 'offerings'],
        requiredIcons: ['palette', 'code', 'smartphone', 'trending-up', 'bar-chart-3', 'shield'],
        defaultContent: {
          title: 'Our Premium Services',
          subtitle: 'Comprehensive solutions for your business needs',
          services: [
            {
              iconId: 'palette',
              title: 'UI/UX Design',
              description: 'Beautiful, intuitive designs that captivate and convert your audience.',
            },
            {
              iconId: 'code',
              title: 'Web Development',
              description: 'Custom web applications built with cutting-edge technologies.',
            },
            {
              iconId: 'smartphone',
              title: 'Mobile Apps',
              description: 'Native and cross-platform mobile solutions for iOS and Android.',
            },
          ],
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.8,
        downloads: 1560,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'features-list',
        name: 'Feature Highlights',
        category: 'features',
        type: 'features-list',
        description: 'Highlight your key features with icons and descriptions',
        thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'star',
        tags: ['features', 'highlights', 'benefits', 'list'],
        requiredIcons: ['zap', 'lock', 'smartphone', 'palette'],
        defaultContent: {
          title: 'Powerful Features',
          subtitle: 'Everything you need to succeed',
          features: [
            {
              iconId: 'zap',
              title: 'Lightning Fast Performance',
              description: 'Optimized for speed with sub-second load times.',
            },
            {
              iconId: 'lock',
              title: 'Bank-Level Security',
              description: 'Your data is protected with enterprise-grade encryption.',
            },
            {
              iconId: 'smartphone',
              title: 'Mobile-First Design',
              description: 'Perfect experience across all devices and screen sizes.',
            },
            {
              iconId: 'palette',
              title: 'Fully Customizable',
              description: 'Tailor every aspect to match your unique brand identity.',
            },
          ],
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.6,
        downloads: 1120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'contact-form',
        name: 'Contact Form',
        category: 'contact',
        type: 'contact-form',
        description: 'Professional contact form with contact information',
        thumbnail: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
        iconId: 'mail',
        tags: ['contact', 'form', 'communication', 'support'],
        requiredIcons: ['mail', 'phone', 'map-pin'],
        defaultContent: {
          title: 'Get In Touch',
          subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond within 24 hours.',
          email: 'hello@yourcompany.com',
          phone: '+1 (555) 123-4567',
          address: '123 Innovation Drive, Tech City, TC 12345',
        },
        isBuiltIn: true,
        isPremium: false,
        usage: 0,
        rating: 4.7,
        downloads: 980,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    builtInSections.forEach(section => {
      this.sections.set(section.id, section);
    });
  }

  private loadCustomSections(): void {
    const customSections = this.getStoredSections();
    customSections.forEach(section => {
      this.sections.set(section.id, section);
    });
  }

  private buildCategories(): void {
    this.categories.clear();
    this.sections.forEach(section => {
      if (!this.categories.has(section.category)) {
        this.categories.set(section.category, []);
      }
      this.categories.get(section.category)!.push(section.id);
    });
  }

  public getAllSections(): SectionDefinition[] {
    return Array.from(this.sections.values());
  }

  public getSection(id: string): SectionDefinition | null {
    return this.sections.get(id) || null;
  }

  public getSectionsByCategory(category: string): SectionDefinition[] {
    return Array.from(this.sections.values()).filter(section => section.category === category);
  }

  public searchSections(query: string, category?: string): SectionDefinition[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.sections.values()).filter(section => {
      const matchesQuery = !query || 
        section.name.toLowerCase().includes(searchTerm) ||
        section.description.toLowerCase().includes(searchTerm) ||
        section.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      const matchesCategory = !category || section.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  public getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  public getCategoryCount(category: string): number {
    return this.categories.get(category)?.length || 0;
  }

  public incrementUsage(sectionId: string): void {
    const section = this.sections.get(sectionId);
    if (section) {
      section.usage++;
      section.downloads++;
      this.saveSectionUsage();
    }
  }

  public getPopularSections(limit: number = 20): SectionDefinition[] {
    return Array.from(this.sections.values())
      .sort((a, b) => b.usage - a.usage)
      .slice(0, limit);
  }

  public addCustomSection(section: Omit<SectionDefinition, 'isBuiltIn' | 'createdAt' | 'updatedAt'>): void {
    const customSection: SectionDefinition = {
      ...section,
      isBuiltIn: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sections.set(section.id, customSection);
    this.buildCategories();
    this.saveCustomSections();
  }

  public updateSection(id: string, updates: Partial<SectionDefinition>): void {
    const section = this.sections.get(id);
    if (section && !section.isBuiltIn) {
      const updatedSection = { ...section, ...updates, updatedAt: new Date() };
      this.sections.set(id, updatedSection);
      this.saveCustomSections();
    }
  }

  public deleteSection(id: string): void {
    const section = this.sections.get(id);
    if (section && !section.isBuiltIn) {
      this.sections.delete(id);
      this.buildCategories();
      this.saveCustomSections();
    }
  }

  private saveCustomSections(): void {
    const customSections = Array.from(this.sections.values()).filter(section => !section.isBuiltIn);
    localStorage.setItem('templates_uz_custom_sections', JSON.stringify(customSections));
  }

  private saveSectionUsage(): void {
    const usage = Array.from(this.sections.entries()).reduce((acc, [id, section]) => {
      if (section.usage > 0) {
        acc[id] = { usage: section.usage, downloads: section.downloads };
      }
      return acc;
    }, {} as { [key: string]: { usage: number; downloads: number } });
    
    localStorage.setItem('templates_uz_section_usage', JSON.stringify(usage));
  }

  private getStoredSections(): SectionDefinition[] {
    try {
      const stored = localStorage.getItem('templates_uz_custom_sections');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public createSectionInstance(sectionId: string, data?: any): SectionInstance {
    const section = this.getSection(sectionId);
    if (!section) {
      throw new Error(`Section with id "${sectionId}" not found`);
    }

    this.incrementUsage(sectionId);

    return {
      id: this.generateId(),
      sectionId,
      data: data || section.defaultContent,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const sectionRegistry = SectionRegistry.getInstance();