import { optimizedStorage } from './optimizedStorage';
import { DatabaseMigrationSchema, MigrationPlan } from '../types/storage';

export class DatabaseMigrationHelper {
  private static instance: DatabaseMigrationHelper;

  private constructor() {}

  public static getInstance(): DatabaseMigrationHelper {
    if (!DatabaseMigrationHelper.instance) {
      DatabaseMigrationHelper.instance = new DatabaseMigrationHelper();
    }
    return DatabaseMigrationHelper.instance;
  }

  // Generate SQL schema for database creation
  public generateDatabaseSchema(): string {
    return `
-- Templates.uz Database Schema
-- Generated on ${new Date().toISOString()}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    company VARCHAR(255),
    website VARCHAR(255),
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    subscription JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website_url VARCHAR(255) UNIQUE NOT NULL,
    theme_id VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_url TEXT,
    custom_domain VARCHAR(255),
    ssl_enabled BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    version VARCHAR(50) DEFAULT '1.0.0',
    category VARCHAR(100) DEFAULT 'general',
    tags JSONB DEFAULT '[]',
    is_template BOOLEAN DEFAULT FALSE,
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords JSONB DEFAULT '[]',
    og_image TEXT,
    custom_meta JSONB DEFAULT '{}',
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    performance_score DECIMAL(3,2),
    load_time_ms INTEGER,
    size_kb INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    last_backup_at TIMESTAMP WITH TIME ZONE
);

-- Sections table
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    template_id VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Section templates table
CREATE TABLE section_templates (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    icon VARCHAR(50),
    tags JSONB DEFAULT '[]',
    default_content JSONB DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    colors JSONB DEFAULT '{}',
    fonts JSONB DEFAULT '{}',
    shadows JSONB DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project collaborators table
CREATE TABLE project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    permissions JSONB DEFAULT '[]',
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(project_id, user_id)
);

-- Deployment history table
CREATE TABLE deployment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    url TEXT,
    notes TEXT,
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    pages_visited JSONB DEFAULT '[]',
    actions_performed JSONB DEFAULT '[]'
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_website_url ON projects(website_url);
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_sections_project_id ON sections(project_id);
CREATE INDEX idx_sections_order_index ON sections(project_id, order_index);

CREATE INDEX idx_section_templates_category ON section_templates(category);
CREATE INDEX idx_section_templates_type ON section_templates(type);

CREATE INDEX idx_deployment_history_project_id ON deployment_history(project_id);
CREATE INDEX idx_deployment_history_deployed_at ON deployment_history(deployed_at);

CREATE INDEX idx_analytics_project_id ON analytics(project_id);
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX idx_analytics_recorded_at ON analytics(recorded_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_start ON user_sessions(session_start);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_templates_updated_at BEFORE UPDATE ON section_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;
  }

  // Generate migration plan
  public generateMigrationPlan(): MigrationPlan {
    return {
      tables: [
        {
          name: 'users',
          schema: 'users table schema',
          indexes: ['idx_users_email', 'idx_users_created_at'],
          constraints: ['unique_email', 'check_email_format']
        },
        {
          name: 'projects',
          schema: 'projects table schema',
          indexes: ['idx_projects_user_id', 'idx_projects_website_url'],
          constraints: ['fk_projects_user_id', 'unique_website_url']
        },
        // ... more tables
      ],
      dataTransformation: [
        {
          source: 'localStorage.projects',
          target: 'database.projects',
          transformer: this.transformProjectData
        },
        {
          source: 'localStorage.user',
          target: 'database.users',
          transformer: this.transformUserData
        }
      ],
      validationRules: [
        {
          table: 'users',
          rules: [
            { field: 'email', type: 'required', constraint: true, message: 'Email is required' },
            { field: 'email', type: 'format', constraint: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
          ]
        },
        {
          table: 'projects',
          rules: [
            { field: 'name', type: 'required', constraint: true, message: 'Project name is required' },
            { field: 'website_url', type: 'unique', constraint: true, message: 'Website URL must be unique' }
          ]
        }
      ]
    };
  }

  // Transform localStorage data for database insertion
  public transformForDatabase(): DatabaseMigrationSchema {
    const migrationData = optimizedStorage.prepareDatabaseMigration();
    
    return {
      users: migrationData.users.map(this.transformUserData),
      projects: migrationData.projects.map(this.transformProjectData),
      sections: this.extractSectionsFromProjects(migrationData.projects),
      section_templates: migrationData.templates.filter(t => t.type !== undefined),
      themes: migrationData.templates.filter(t => t.colors !== undefined),
      project_collaborators: [], // Will be populated when collaboration feature is added
      deployment_history: this.extractDeploymentHistory(migrationData.projects),
      analytics: this.extractAnalytics(migrationData.analytics),
      user_sessions: [] // Will be populated when session tracking is added
    };
  }

  // Generate data validation report
  public validateMigrationData(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    summary: {
      totalRecords: number;
      validRecords: number;
      invalidRecords: number;
    };
  } {
    const data = this.transformForDatabase();
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalRecords = 0;
    let validRecords = 0;

    // Validate users
    data.users.forEach((user, index) => {
      totalRecords++;
      if (!user.email || !user.name) {
        errors.push(`User ${index}: Missing required fields (email, name)`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push(`User ${index}: Invalid email format`);
      } else {
        validRecords++;
      }
    });

    // Validate projects
    data.projects.forEach((project, index) => {
      totalRecords++;
      if (!project.name || !project.website_url || !project.user_id) {
        errors.push(`Project ${index}: Missing required fields`);
      } else if (!/^[a-zA-Z0-9-_]+$/.test(project.website_url)) {
        errors.push(`Project ${index}: Invalid website URL format`);
      } else {
        validRecords++;
      }
    });

    // Check for duplicate website URLs
    const websiteUrls = data.projects.map(p => p.website_url);
    const duplicateUrls = websiteUrls.filter((url, index) => websiteUrls.indexOf(url) !== index);
    if (duplicateUrls.length > 0) {
      errors.push(`Duplicate website URLs found: ${duplicateUrls.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalRecords,
        validRecords,
        invalidRecords: totalRecords - validRecords
      }
    };
  }

  // Export migration-ready data
  public exportMigrationData(): string {
    const data = this.transformForDatabase();
    const validation = this.validateMigrationData();
    
    return JSON.stringify({
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        validation,
        schema: this.generateDatabaseSchema()
      },
      data
    }, null, 2);
  }

  // Private transformation methods
  private transformUserData = (userData: any) => ({
    id: userData.id || this.generateUUID(),
    email: userData.profile?.email || 'user@templates.uz',
    name: userData.profile?.name || 'User',
    avatar: userData.profile?.avatar,
    company: userData.profile?.company,
    website: userData.profile?.website,
    bio: userData.profile?.bio,
    preferences: userData.preferences || {},
    subscription: userData.subscription || {},
    created_at: userData.createdAt || new Date(),
    updated_at: new Date(),
    last_login_at: userData.lastLoginAt || new Date()
  });

  private transformProjectData = (projectData: any) => ({
    id: projectData.id,
    user_id: this.getUserIdForProject(projectData),
    name: projectData.name,
    description: projectData.description,
    website_url: projectData.websiteUrl,
    theme_id: projectData.themeId,
    is_published: projectData.isPublished || false,
    published_url: projectData.publishUrl,
    custom_domain: projectData.deployment?.customDomain,
    ssl_enabled: projectData.deployment?.ssl || false,
    
    version: projectData.metadata?.version || '1.0.0',
    category: projectData.metadata?.category || 'general',
    tags: projectData.metadata?.tags || [],
    is_template: projectData.metadata?.isTemplate || false,
    
    seo_title: projectData.seo?.title,
    seo_description: projectData.seo?.description,
    seo_keywords: projectData.seo?.keywords || [],
    og_image: projectData.seo?.ogImage,
    custom_meta: projectData.seo?.customMeta || {},
    
    view_count: projectData.analytics?.views || 0,
    last_viewed_at: projectData.analytics?.lastViewed,
    performance_score: projectData.analytics?.performance?.lighthouse?.performance,
    load_time_ms: projectData.analytics?.performance?.loadTime,
    size_kb: projectData.analytics?.performance?.sizeKB,
    
    created_at: projectData.createdAt,
    updated_at: projectData.updatedAt,
    published_at: projectData.deployment?.lastDeployed,
    last_backup_at: projectData.metadata?.lastBackup
  });

  private extractSectionsFromProjects(projects: any[]) {
    const sections: any[] = [];
    
    projects.forEach(project => {
      if (project.sections) {
        project.sections.forEach((section: any) => {
          sections.push({
            id: section.id,
            project_id: project.id,
            template_id: section.templateId,
            order_index: section.order,
            data: section.data,
            created_at: section.createdAt,
            updated_at: section.updatedAt
          });
        });
      }
    });
    
    return sections;
  }

  private extractDeploymentHistory(projects: any[]) {
    const deployments: any[] = [];
    
    projects.forEach(project => {
      if (project.deployment?.deploymentHistory) {
        project.deployment.deploymentHistory.forEach((deployment: any) => {
          deployments.push({
            id: deployment.id,
            project_id: project.id,
            version: deployment.version,
            status: deployment.status,
            url: deployment.url,
            notes: deployment.notes,
            deployed_at: deployment.timestamp
          });
        });
      }
    });
    
    return deployments;
  }

  private extractAnalytics(analyticsData: any[]) {
    const analytics: any[] = [];
    
    analyticsData.forEach(stat => {
      analytics.push({
        id: this.generateUUID(),
        project_id: stat.projectId,
        metric_type: 'sections_count',
        metric_value: stat.sectionsCount,
        metadata: { timeSpent: stat.timeSpent, versions: stat.versions },
        recorded_at: stat.lastModified
      });
    });
    
    return analytics;
  }

  private getUserIdForProject(project: any): string {
    // In a real scenario, this would map to actual user IDs
    // For now, we'll use a default user ID or generate one
    return optimizedStorage.getUser()?.id || this.generateUUID();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const migrationHelper = DatabaseMigrationHelper.getInstance();