export interface SectionTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  thumbnail: string;
  description: string;
  defaultContent: any;
  icon: string;
  tags: string[];
}

export interface SectionInstance {
  id: string;
  templateId: string;
  data: any;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string; // Add user ID to Project interface
  name: string;
  description?: string;
  websiteUrl: string; // New field for custom website URL
  category: string; // Website category (business, personal, etc.)
  seoKeywords: string[]; // SEO keywords array
  logo?: string; // Logo URL
  favicon?: string; // Favicon URL
  sections: SectionInstance[];
  themeId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  isTemplate?: boolean; // Add template flag to Project interface
  publishUrl?: string;
  thumbnail?: string;
}

export interface Section {
  id: string;
  type: string;
  category: string;
  content: any;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageData {
  projects: Project[];
  sectionTemplates: SectionTemplate[];
  lastUpdated: Date;
}