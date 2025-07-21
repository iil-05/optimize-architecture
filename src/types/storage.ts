// Enhanced type definitions for optimized storage
export interface DatabaseMigrationSchema {
  // Users table
  users: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    company?: string;
    website?: string;
    bio?: string;
    preferences: UserPreferences;
    subscription: UserSubscription;
    created_at: Date;
    updated_at: Date;
    last_login_at: Date;
  };

  // Projects table
  projects: {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    website_url: string;
    theme_id: string;
    is_published: boolean;
    published_url?: string;
    custom_domain?: string;
    ssl_enabled: boolean;
    
    // Metadata
    version: string;
    category: string;
    tags: string[]; // JSON array
    is_template: boolean;
    
    // SEO
    seo_title?: string;
    seo_description?: string;
    seo_keywords: string[]; // JSON array
    og_image?: string;
    custom_meta: Record<string, string>; // JSON object
    
    // Analytics
    view_count: number;
    last_viewed_at?: Date;
    performance_score?: number;
    load_time_ms?: number;
    size_kb?: number;
    
    // Timestamps
    created_at: Date;
    updated_at: Date;
    published_at?: Date;
    last_backup_at?: Date;
  };

  // Sections table
  sections: {
    id: string;
    project_id: string;
    template_id: string;
    order_index: number;
    data: Record<string, any>; // JSON object
    created_at: Date;
    updated_at: Date;
  };

  // Section templates table
  section_templates: {
    id: string;
    name: string;
    category: string;
    type: string;
    description: string;
    thumbnail: string;
    icon: string;
    tags: string[]; // JSON array
    default_content: Record<string, any>; // JSON object
    is_premium: boolean;
    created_at: Date;
    updated_at: Date;
  };

  // Themes table
  themes: {
    id: string;
    name: string;
    colors: Record<string, string>; // JSON object
    fonts: Record<string, string>; // JSON object
    shadows: Record<string, string>; // JSON object
    is_premium: boolean;
    created_at: Date;
    updated_at: Date;
  };

  // Project collaborators table
  project_collaborators: {
    id: string;
    project_id: string;
    user_id: string;
    role: 'owner' | 'editor' | 'viewer';
    permissions: string[]; // JSON array
    invited_at: Date;
    accepted_at?: Date;
  };

  // Deployment history table
  deployment_history: {
    id: string;
    project_id: string;
    version: string;
    status: 'success' | 'failed' | 'pending';
    url?: string;
    notes?: string;
    deployed_at: Date;
  };

  // Analytics table
  analytics: {
    id: string;
    project_id: string;
    metric_type: string;
    metric_value: number;
    metadata: Record<string, any>; // JSON object
    recorded_at: Date;
  };

  // User sessions table
  user_sessions: {
    id: string;
    user_id: string;
    session_start: Date;
    session_end?: Date;
    duration_minutes?: number;
    pages_visited: string[]; // JSON array
    actions_performed: Record<string, any>[]; // JSON array
  };
}

// Migration utilities
export interface MigrationPlan {
  tables: {
    name: string;
    schema: string;
    indexes: string[];
    constraints: string[];
  }[];
  
  dataTransformation: {
    source: string;
    target: string;
    transformer: (data: any) => any;
  }[];
  
  validationRules: {
    table: string;
    rules: ValidationRule[];
  }[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'unique' | 'format' | 'range';
  constraint: any;
  message: string;
}

// Storage performance metrics
export interface StoragePerformanceMetrics {
  readLatency: number; // ms
  writeLatency: number; // ms
  storageSize: number; // bytes
  compressionRatio: number;
  cacheHitRate: number; // percentage
  errorRate: number; // percentage
}