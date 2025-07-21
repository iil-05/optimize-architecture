/**
 * Theme Registry - Central theme management system
 * Stores themes once and provides efficient access
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    [key: string]: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    small: string;
    button: string;
    headingWeight: number;
    bodyWeight: number;
    buttonWeight: number;
    headingLineHeight: number;
    bodyLineHeight: number;
  };
  animations: {
    duration: string;
    easing: string;
  };
  isBuiltIn: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ThemeRegistry {
  private static instance: ThemeRegistry;
  private themes: Map<string, ThemeDefinition> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): ThemeRegistry {
    if (!ThemeRegistry.instance) {
      ThemeRegistry.instance = new ThemeRegistry();
    }
    return ThemeRegistry.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    
    this.loadBuiltInThemes();
    this.loadCustomThemes();
    this.initialized = true;
  }

  private loadBuiltInThemes(): void {
    const builtInThemes: ThemeDefinition[] = [
      {
        id: 'modern-blue',
        name: 'Modern Blue',
        category: 'modern',
        colors: {
          primary: '#3b82f6',
          secondary: '#06b6d4',
          accent: '#8b5cf6',
          background: '#ffffff',
          surface: '#ffffff',
          text: '#111827',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          primary100: '#dbeafe',
          primary200: '#bfdbfe',
          primary300: '#93c5fd',
          secondary100: '#cffafe',
          secondary200: '#a5f3fc',
          accent100: '#f3e8ff',
          accent200: '#e9d5ff',
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Inter',
          accent: 'Inter',
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '3rem',
        },
        typography: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.5rem',
          h4: '1.25rem',
          body: '1rem',
          small: '0.875rem',
          button: '1rem',
          headingWeight: 700,
          bodyWeight: 400,
          buttonWeight: 600,
          headingLineHeight: 1.2,
          bodyLineHeight: 1.6,
        },
        animations: {
          duration: '0.3s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        isBuiltIn: true,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'dark-elegant',
        name: 'Dark Elegant',
        category: 'elegant',
        colors: {
          primary: '#f59e0b',
          secondary: '#10b981',
          accent: '#8b5cf6',
          background: '#111827',
          surface: '#1f2937',
          text: '#f9fafb',
          textSecondary: '#d1d5db',
          border: '#374151',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          primary100: '#fef3c7',
          primary200: '#fde68a',
          primary300: '#fcd34d',
          secondary100: '#d1fae5',
          secondary200: '#a7f3d0',
          accent100: '#f3e8ff',
          accent200: '#e9d5ff',
        },
        fonts: {
          primary: 'Playfair Display',
          secondary: 'Inter',
          accent: 'Inter',
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '3rem',
        },
        typography: {
          h1: '3rem',
          h2: '2.25rem',
          h3: '1.75rem',
          h4: '1.5rem',
          body: '1.125rem',
          small: '1rem',
          button: '1.125rem',
          headingWeight: 700,
          bodyWeight: 400,
          buttonWeight: 600,
          headingLineHeight: 1.1,
          bodyLineHeight: 1.7,
        },
        animations: {
          duration: '0.4s',
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        isBuiltIn: true,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        category: 'minimal',
        colors: {
          primary: '#000000',
          secondary: '#6b7280',
          accent: '#ef4444',
          background: '#ffffff',
          surface: '#f9fafb',
          text: '#111827',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          primary100: '#f3f4f6',
          primary200: '#e5e7eb',
          primary300: '#d1d5db',
          secondary100: '#f9fafb',
          secondary200: '#f3f4f6',
          accent100: '#fef2f2',
          accent200: '#fee2e2',
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Inter',
          accent: 'JetBrains Mono',
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
          md: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
          lg: '0 4px 8px 0 rgb(0 0 0 / 0.08)',
          xl: '0 8px 16px 0 rgb(0 0 0 / 0.1)',
        },
        borderRadius: {
          sm: '0.125rem',
          md: '0.25rem',
          lg: '0.5rem',
          xl: '0.75rem',
          full: '9999px',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.75rem',
          md: '1.25rem',
          lg: '1.75rem',
          xl: '2.5rem',
        },
        typography: {
          h1: '2.25rem',
          h2: '1.875rem',
          h3: '1.5rem',
          h4: '1.25rem',
          body: '1rem',
          small: '0.875rem',
          button: '0.875rem',
          headingWeight: 600,
          bodyWeight: 400,
          buttonWeight: 500,
          headingLineHeight: 1.3,
          bodyLineHeight: 1.5,
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
        },
        isBuiltIn: true,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    builtInThemes.forEach(theme => {
      this.themes.set(theme.id, theme);
    });
  }

  private loadCustomThemes(): void {
    // Load custom themes from localStorage
    const customThemes = this.getStoredThemes();
    customThemes.forEach(theme => {
      this.themes.set(theme.id, theme);
    });
  }

  public getAllThemes(): ThemeDefinition[] {
    return Array.from(this.themes.values());
  }

  public getTheme(id: string): ThemeDefinition | null {
    return this.themes.get(id) || null;
  }

  public getThemesByCategory(category: string): ThemeDefinition[] {
    return Array.from(this.themes.values()).filter(theme => theme.category === category);
  }

  public addTheme(theme: ThemeDefinition): void {
    this.themes.set(theme.id, theme);
    this.saveCustomThemes();
  }

  public updateTheme(id: string, updates: Partial<ThemeDefinition>): void {
    const theme = this.themes.get(id);
    if (theme && !theme.isBuiltIn) {
      const updatedTheme = { ...theme, ...updates, updatedAt: new Date() };
      this.themes.set(id, updatedTheme);
      this.saveCustomThemes();
    }
  }

  public deleteTheme(id: string): void {
    const theme = this.themes.get(id);
    if (theme && !theme.isBuiltIn) {
      this.themes.delete(id);
      this.saveCustomThemes();
    }
  }

  private saveCustomThemes(): void {
    const customThemes = Array.from(this.themes.values()).filter(theme => !theme.isBuiltIn);
    localStorage.setItem('templates_uz_custom_themes', JSON.stringify(customThemes));
  }

  private getStoredThemes(): ThemeDefinition[] {
    try {
      const stored = localStorage.getItem('templates_uz_custom_themes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public generateCSS(themeId: string): string {
    const theme = this.getTheme(themeId);
    if (!theme) return '';

    return `
      :root {
        /* Colors */
        ${Object.entries(theme.colors).map(([key, value]) => 
          `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
        ).join('\n        ')}
        
        /* Fonts */
        --font-primary: '${theme.fonts.primary}', sans-serif;
        --font-secondary: '${theme.fonts.secondary}', sans-serif;
        --font-accent: '${theme.fonts.accent}', monospace;
        
        /* Shadows */
        ${Object.entries(theme.shadows).map(([key, value]) => 
          `--shadow-${key}: ${value};`
        ).join('\n        ')}
        
        /* Border Radius */
        ${Object.entries(theme.borderRadius).map(([key, value]) => 
          `--radius-${key}: ${value};`
        ).join('\n        ')}
        
        /* Spacing */
        ${Object.entries(theme.spacing).map(([key, value]) => 
          `--spacing-${key}: ${value};`
        ).join('\n        ')}
        
        /* Typography */
        ${Object.entries(theme.typography).map(([key, value]) => 
          `--typography-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
        ).join('\n        ')}
        
        /* Animations */
        --animation-duration: ${theme.animations.duration};
        --animation-easing: ${theme.animations.easing};
      }
    `;
  }
}

export const themeRegistry = ThemeRegistry.getInstance();