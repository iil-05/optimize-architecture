import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  ArrowLeft,
  Plus,
  Eye,
  Download,
  Save,
  Menu,
  X,
  Check,
  Layout,
  Palette,
  Layers,
  Code,
  Globe,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionSelector from '../components/SectionSelector';
import SectionRenderer from '../components/SectionRenderer';
import ThemeCustomizer from '../components/ThemeCustomizer';
import AddSectionButton from '../components/AddSectionButton';

const Editor: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, reorderSections, createProject, isLoading } = useProject();
  const { currentTheme, updateTheme } = useTheme();
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [insertPosition, setInsertPosition] = useState<{ index: number; position: 'above' | 'below' } | null>(null);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [projectTheme, setProjectTheme] = useState(currentTheme);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        // Additional security check - ensure user owns this project
        const currentUserId = getCurrentUserId();
        if (!currentUserId || project.userId !== currentUserId) {
          console.log('🔒 Access denied to project:', id);
          navigate('/dashboard');
          return;
        }
        
        setCurrentProject(project);
        
        // Apply project's theme
        if (project.themeId) {
          const theme = themeRegistry.getTheme(project.themeId);
          if (theme) {
            setProjectTheme(theme);
            updateTheme(project.themeId);
          }
        }
      } else {
        console.log('Project not found:', id);
      }
    }
  }, [id, projects, setCurrentProject, navigate, updateTheme]);

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

  // Use project-specific theme or fallback to current theme
  const activeTheme = projectTheme || currentTheme;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !currentProject) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const sections = [...currentProject.sections];
      const activeIndex = sections.findIndex(section => section.id === activeId);
      const overIndex = sections.findIndex(section => section.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = sections.splice(activeIndex, 1);
        sections.splice(overIndex, 0, removed);

        const updatedSections = sections.map((section, index) => ({
          ...section,
          order: index
        }));

        reorderSections(updatedSections);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEditingSection(null);
    }, 1000);
  };

  const handleAddSection = (position?: { index: number; position: 'above' | 'below' }) => {
    setInsertPosition(position || null);
    setShowSectionSelector(true);
  };

  const handleSectionAdded = () => {
    setShowSectionSelector(false);
    setInsertPosition(null);
  };

  const moveSectionUp = (sectionId: string) => {
    if (!currentProject) return;

    const sections = [...currentProject.sections].sort((a, b) => a.order - b.order);
    const currentIndex = sections.findIndex(s => s.id === sectionId);

    if (currentIndex > 0) {
      const updatedSections = [...sections];
      [updatedSections[currentIndex - 1], updatedSections[currentIndex]] =
        [updatedSections[currentIndex], updatedSections[currentIndex - 1]];

      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index
      }));

      reorderSections(reorderedSections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    if (!currentProject) return;

    const sections = [...currentProject.sections].sort((a, b) => a.order - b.order);
    const currentIndex = sections.findIndex(s => s.id === sectionId);

    if (currentIndex < sections.length - 1) {
      const updatedSections = [...sections];
      [updatedSections[currentIndex], updatedSections[currentIndex + 1]] =
        [updatedSections[currentIndex + 1], updatedSections[currentIndex]];

      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index
      }));

      reorderSections(reorderedSections);
    }
  };

  if (!currentProject) {
    const projectExists = id && projects.some(p => p.id === id);

    if (id && !projectExists && !isLoading) {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        navigate('/login');
        return null;
      }
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Layout className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project with ID "{id}" doesn't exist.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-elegant font-display"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  const project = createProject(
                    `New Project ${projects.length + 1}`,
                    undefined,
                    id,
                    'business'
                  );
                  setCurrentProject(project);
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-glow font-display"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isLoading ? t('common.loading') + ' your projects...' : t('common.loading') + ' your project...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Mobile Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 lg:hidden shadow-elegant sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 truncate max-w-32 font-display">{currentProject.name}</h1>
              <p className="text-xs text-gray-500">{currentProject.sections.length} {t('editor.sectionsCount')}</p>
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3 bg-white/95 backdrop-blur-xl"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddSection()}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-primary-600 to-primary-600 text-white rounded-lg hover:opacity-90 transition-all text-xs font-semibold shadow-glow font-display"
                >
                  <Plus className="w-3 h-3" />
                  {t('editor.addSection')}
                </button>

                <button
                  onClick={() => {
                    setShowThemeCustomizer(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-all text-xs font-semibold shadow-glow font-display"
                >
                  <Palette className="w-3 h-3" />
                  {t('editor.customize')}
                </button>

                <button
                  onClick={() => navigate(`/preview/${currentProject.id}`)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all text-xs font-semibold shadow-glow font-display"
                >
                  <Eye className="w-3 h-3" />
                  {t('editor.preview')}
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 text-xs font-semibold shadow-glow font-display"
                >
                  {isSaving ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : editingSection ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  {isSaving ? t('editor.saving') : editingSection ? t('editor.doneEditing') : t('editor.save')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/95 border-b border-gray-200 px-4 xl:px-6 py-4 xl:py-5 shadow-elegant-lg backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 xl:gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 xl:p-3 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 xl:w-5 xl:h-5 text-gray-600 group-hover:text-gray-800" />
            </button>

            <div className="flex items-center gap-3 xl:gap-4">
              <div className="relative">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
                  <Layout className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 xl:w-4 xl:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl xl:text-2xl font-bold text-gray-900 font-display">{currentProject.name}</h1>
                <p className="text-xs xl:text-sm text-gray-500 font-sans">
                  {currentProject.sections.length} {t('editor.sectionsCount')} • {t('editor.lastSaved')} {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 xl:gap-4">
            <button
              onClick={() => handleAddSection()}
              className="inline-flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 xl:py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-glow font-display text-sm xl:text-base"
            >
              <Plus className="w-3 h-3 xl:w-4 xl:h-4" />
              {t('editor.addSection')}
            </button>

            <button
              onClick={() => setShowThemeCustomizer(true)}
              className="flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 xl:py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold shadow-glow font-display text-sm xl:text-base"
            >
              <Palette className="w-3 h-3 xl:w-4 xl:h-4" />
              {t('editor.customize')}
            </button>

            <button
              onClick={() => navigate(`/preview/${currentProject.id}`)}
              className="flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 xl:py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-glow font-display text-sm xl:text-base"
            >
              <Eye className="w-3 h-3 xl:w-4 xl:h-4" />
              {t('editor.preview')}
            </button>

            {currentProject.isPublished && (
              <button
                onClick={() => {
                  const siteUrl = `/site/${currentProject.websiteUrl}`;
                  window.open(siteUrl, '_blank');
                }}
                className="flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 xl:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-glow font-display text-sm xl:text-base"
              >
                <Globe className="w-3 h-3 xl:w-4 xl:h-4" />
                View Live
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 xl:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 font-semibold shadow-glow font-display text-sm xl:text-base"
            >
              {isSaving ? (
                <div className="w-3 h-3 xl:w-4 xl:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : editingSection ? (
                <Check className="w-3 h-3 xl:w-4 xl:h-4" />
              ) : (
                <Save className="w-3 h-3 xl:w-4 xl:h-4" />
              )}
              {isSaving ? t('editor.saving') : editingSection ? t('editor.doneEditing') : t('editor.save')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 overflow-auto">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={currentProject.sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="min-h-full" style={{ fontFamily: currentTheme?.fonts?.primary }}>
                {currentProject.sections.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-4 sm:p-8">
                    <div className="text-center max-w-lg">
                      <div className="relative mb-6 sm:mb-8">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-glow">
                          <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary-400 rounded-full flex items-center justify-center animate-bounce">
                          <Layout className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-display">
                        {t('editor.readyToBuild')}
                      </h3>
                      <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed font-sans">
                        {t('editor.startDescription')}
                      </p>
                      <button
                        onClick={() => handleAddSection()}
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-glow text-base sm:text-lg font-display"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t('editor.addFirstSection')}
                      </button>
                    </div>
                  </div>
                ) : (
                  currentProject.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <React.Fragment key={section.id}>
                        <AddSectionButton
                          onAdd={() => handleAddSection({ index, position: 'above' })}
                          position="above"
                          theme={activeTheme}
                          index={index}
                          isVisible={index === 0}
                        />
                        <SectionRenderer
                          section={section}
                          isSelected={selectedSection === section.id}
                          onSelect={() => setSelectedSection(section.id)}
                          theme={activeTheme}
                          isEditing={editingSection === section.id}
                          onEdit={(editing) => {
                            if (editing) {
                              setEditingSection(section.id);
                            } else {
                              setEditingSection(null);
                            }
                          }}
                          onAddAbove={() => handleAddSection({ index, position: 'above' })}
                          onAddBelow={() => handleAddSection({ index, position: 'below' })}
                          canMoveUp={index > 0}
                          canMoveDown={index < currentProject.sections.length - 1}
                          onMoveUp={() => moveSectionUp(section.id)}
                          onMoveDown={() => moveSectionDown(section.id)}
                        />
                        <AddSectionButton
                          onAdd={() => handleAddSection({ index, position: 'below' })}
                          position="below"
                          theme={activeTheme}
                          index={index}
                        />
                      </React.Fragment>
                    ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      {showSectionSelector && (
        <SectionSelector
          onClose={() => {
            setShowSectionSelector(false);
            setInsertPosition(null);
          }}
          onSelect={handleSectionAdded}
          insertPosition={insertPosition}
        />
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}
    </div>
  );
};

export default Editor;