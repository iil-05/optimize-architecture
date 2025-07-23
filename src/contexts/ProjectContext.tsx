import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, SectionInstance, SectionTemplate } from '../types';
import { generateId } from '../utils/helpers';
import { optimizedStorage } from '../utils/optimizedStorage';
import { improvedSectionTemplates, getSectionTemplateById } from '../data/improvedSectionTemplates';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  sectionTemplates: SectionTemplate[];
  createProject: (name: string, description?: string, websiteUrl?: string, category?: string, seoKeywords?: string[], logo?: string, favicon?: string) => Project;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addSectionFromTemplate: (templateId: string, customData?: any, insertPosition?: { index: number; position: 'above' | 'below' } | null) => void;
  updateSectionData: (sectionId: string, data: any) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sections: SectionInstance[]) => void;
  duplicateSection: (sectionId: string) => void;
  getSectionTemplate: (templateId: string) => SectionTemplate | undefined;
  clearAllData: () => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
import { themeRegistry } from '../core/ThemeRegistry';
import { useTheme } from '../contexts/ThemeContext';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sectionTemplates] = useState<SectionTemplate[]>(improvedSectionTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const { updateTheme } = useTheme();

  // Load data from optimized storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔄 Loading projects from optimized storage...');
        
        // Load projects from optimized storage
        const savedProjects = optimizedStorage.getAllProjects();
        
        console.log('✅ Loaded projects:', savedProjects);
        setProjects(savedProjects);

      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Start with empty projects array on error
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save projects whenever they change (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      console.log('💾 Auto-saving projects to optimized storage...');
      // The optimized storage handles individual project saves automatically
    }
  }, [projects, isLoading]);

  const createProject = (
    name: string, 
    description?: string, 
    websiteUrl?: string, 
    category?: string, 
    seoKeywords?: string[], 
    logo?: string, 
    favicon?: string
  ): Project => {
    // Get current user ID from auth storage
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      throw new Error('🔒 Cannot create project: No authenticated user');
    }
    
    const projectId = generateId();
    const cleanWebsiteUrl = websiteUrl || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    
    const newProject: Project = {
      id: projectId,
      userId: currentUserId, // Add user ID to project
      name: name.trim(),
      description: description?.trim(),
      websiteUrl: cleanWebsiteUrl,
      category: category || 'business',
      seoKeywords: seoKeywords || [],
      logo: logo || '',
      favicon: favicon || '',
      sections: [],
      themeId: 'modern-blue', // Use the default theme from ThemeContext
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      thumbnail: generateProjectThumbnail(),
    };

    console.log('🆕 Creating new project:', newProject);

    // Save to optimized storage immediately
    optimizedStorage.saveProject(newProject);
    
    // Update local state
    setProjects(prev => [newProject, ...prev]);
    
    console.log('✅ Project created and saved:', newProject);
    return newProject;
  };

  // Helper function to get current user ID
  const getCurrentUserId = (): string | null => {
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
  };

  const deleteProject = (id: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot delete project: No authenticated user');
      return;
    }
    
    // Check if user owns this project
    const project = projects.find(p => p.id === id);
    if (!project) {
      console.error('🔒 Project not found');
      return;
    }
    
    if (project.userId !== currentUserId) {
      console.error('🔒 Cannot delete project: Access denied');
      return;
    }
    
    console.log('🗑️ Deleting project:', id);
    
    // Remove from optimized storage
    optimizedStorage.deleteProject(id);
    
    // Update local state
    setProjects(prev => prev.filter(p => p.id !== id));
    
    // Clear current project if it's the one being deleted
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    
    console.log('✅ Project deleted successfully');
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot update project: No authenticated user');
      return;
    }
    
    console.log('📝 Updating project:', projectId, updates);
    
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && project.userId === currentUserId) {
        const updatedProject = { 
          ...project, 
          ...updates, 
          updatedAt: new Date() 
        };
        
        // Save to optimized storage
        optimizedStorage.saveProject(updatedProject);
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProject);
          
          // If theme was updated, apply it immediately
          if (updates.themeId) {
            updateTheme(updates.themeId);
          }
        }
        
        // If publishing status changed, log the site URL
        if (updates.isPublished && !project.isPublished) {
          console.log('🌐 Website published:', {
            name: updatedProject.name,
            url: `${import.meta.env.VITE_USER_SITE_BASE_URL || window.location.origin + '/site'}/${updatedProject.websiteUrl}`,
            websiteUrl: updatedProject.websiteUrl
          });
          
          // Also save to optimized storage for SiteViewer
          optimizedStorage.saveProject(updatedProject);
        }
        
        console.log('✅ Project updated:', updatedProject);
        return updatedProject;
      }
      return project;
    }));
  };

  const addSectionFromTemplate = (templateId: string, customData?: any, insertPosition?: { index: number; position: 'above' | 'below' } | null) => {
    if (!currentProject) {
      console.warn('⚠️ No current project selected');
      return;
    }

    const currentUserId = getCurrentUserId();
    if (!currentUserId || currentProject.userId !== currentUserId) {
      console.error('🔒 Cannot add section: Access denied');
      return;
    }

    const template = getSectionTemplateById(templateId);
    if (!template) {
      console.error('❌ Template not found:', templateId);
      return;
    }

    let newOrder: number;
    let updatedSections = [...currentProject.sections];

    if (insertPosition) {
      // Insert at specific position
      const targetIndex = insertPosition.position === 'above' ? insertPosition.index : insertPosition.index + 1;
      newOrder = targetIndex;
      
      // Update order of existing sections
      updatedSections = updatedSections.map(section => ({
        ...section,
        order: section.order >= targetIndex ? section.order + 1 : section.order
      }));
    } else {
      // Add at the end
      newOrder = currentProject.sections.length;
    }

    const newSection: SectionInstance = {
      id: generateId(),
      templateId,
      data: customData || template.defaultContent,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updatedSections.push(newSection);
    updateProject(currentProject.id, { sections: updatedSections });
    
    console.log('✅ Added section from template:', { 
      templateId, 
      section: newSection, 
      insertPosition: insertPosition || 'end' 
    });
  };

  const updateSectionData = (sectionId: string, data: any) => {
    if (!currentProject) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId || currentProject.userId !== currentUserId) {
      console.error('🔒 Cannot update section: Access denied');
      return;
    }

    const updatedSections = currentProject.sections.map(section => {
      if (section.id === sectionId) {
        const updatedSection = { ...section, data, updatedAt: new Date() };
        console.log('📝 Updated section data:', { sectionId, data });
        return updatedSection;
      }
      return section;
    });

    updateProject(currentProject.id, { sections: updatedSections });
  };

  const deleteSection = (sectionId: string) => {
    if (!currentProject) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId || currentProject.userId !== currentUserId) {
      console.error('🔒 Cannot delete section: Access denied');
      return;
    }

    const updatedSections = currentProject.sections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    updateProject(currentProject.id, { sections: updatedSections });
    console.log('🗑️ Deleted section:', sectionId);
  };

  const reorderSections = (sections: SectionInstance[]) => {
    if (!currentProject) return;
    
    const currentUserId = getCurrentUserId();
    if (!currentUserId || currentProject.userId !== currentUserId) {
      console.error('🔒 Cannot reorder sections: Access denied');
      return;
    }
    
    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index,
      updatedAt: new Date(),
    }));
    
    updateProject(currentProject.id, { sections: reorderedSections });
    console.log('🔄 Reordered sections');
  };

  const duplicateSection = (sectionId: string) => {
    if (!currentProject) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId || currentProject.userId !== currentUserId) {
      console.error('🔒 Cannot duplicate section: Access denied');
      return;
    }

    const sectionToDuplicate = currentProject.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: SectionInstance = {
      ...sectionToDuplicate,
      id: generateId(),
      order: sectionToDuplicate.order + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSections = [
      ...currentProject.sections.slice(0, sectionToDuplicate.order + 1),
      newSection,
      ...currentProject.sections.slice(sectionToDuplicate.order + 1).map(s => ({ ...s, order: s.order + 1 })),
    ];

    updateProject(currentProject.id, { sections: updatedSections });
    console.log('📋 Duplicated section:', sectionId);
  };

  const getSectionTemplate = (templateId: string): SectionTemplate | undefined => {
    return getSectionTemplateById(templateId);
  };

  const clearAllData = () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.error('🔒 Cannot clear data: No authenticated user');
      toast.error('Cannot clear data: Please log in');
      return;
    }
    
    console.log('🧹 Clearing all data...');
    
    // Clear only current user's data from optimized storage
    optimizedStorage.clearUserData(currentUserId);
    
    // Clear local state
    setProjects([]);
    setCurrentProject(null);
    
    console.log('✅ User data cleared successfully');
    toast.success('User data cleared successfully');
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      sectionTemplates,
      createProject,
      deleteProject,
      setCurrentProject,
      updateProject,
      addSectionFromTemplate,
      updateSectionData,
      deleteSection,
      reorderSections,
      duplicateSection,
      getSectionTemplate,
      clearAllData,
      isLoading,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

const generateProjectThumbnail = (): string => {
  const thumbnails = [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
  ];
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};