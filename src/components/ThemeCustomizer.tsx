import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Sparkles, Check, Eye, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { themeRegistry, ThemeDefinition } from '../core/ThemeRegistry';
import { optimizedStorage } from '../core/OptimizedStorage';
import { useProject } from '../contexts/ProjectContext';

interface ThemeCustomizerProps {
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { currentProject, updateProject } = useProject();
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition | null>(
    currentProject ? themeRegistry.getTheme(currentProject.themeId) : optimizedStorage.getSelectedTheme()
  );
  const [availableThemes] = useState<ThemeDefinition[]>(themeRegistry.getAllThemes());

  const handleThemeSelect = (themeId: string) => {
    const theme = themeRegistry.getTheme(themeId);
    if (theme) {
      setCurrentTheme(theme);
      
      // Update current project's theme
      if (currentProject) {
        updateProject(currentProject.id, { themeId });
      }
      
      // Also save as default theme
      optimizedStorage.setSelectedTheme(themeId);
      
      // Apply theme CSS variables
      const css = themeRegistry.generateCSS(themeId);
      const styleElement = document.getElementById('dynamic-theme-styles') || document.createElement('style');
      styleElement.id = 'dynamic-theme-styles';
      styleElement.textContent = css;
      if (!document.getElementById('dynamic-theme-styles')) {
        document.head.appendChild(styleElement);
      }
    }
  };

  const getThemesByCategory = (category: string) => {
    return themeRegistry.getThemesByCategory(category);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-elegant-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-display">{t('themeCustomizer.title')}</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-sans">{t('themeCustomizer.description')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-display">Theme & Typography</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-sans">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{t('themeCustomizer.previewChanges')}</span>
                  </div>
                </div>
                
                {/* Theme Categories */}
                {['modern', 'elegant', 'minimal', 'bold', 'classic'].map(category => {
                  const categoryThemes = getThemesByCategory(category);
                  if (categoryThemes.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 capitalize font-display flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        {category} Themes
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {categoryThemes.map((theme) => (
                          <motion.div
                            key={theme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-elegant ${
                              currentTheme?.id === theme.id
                                ? 'border-primary-500 bg-primary-50 shadow-glow ring-2 ring-primary-300 scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleThemeSelect(theme.id)}
                            whileHover={{ scale: currentTheme?.id === theme.id ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {currentTheme?.id === theme.id && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-glow"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}

                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2 font-display">{theme.name}</h4>
                              <p className="text-sm text-gray-600 font-sans">Complete design system with colors & typography</p>
                            </div>

                            {/* Color Preview */}
                            <div className="flex gap-2 mb-4">
                              <div
                                className="w-8 h-8 rounded-lg shadow-elegant border border-gray-200"
                                style={{ backgroundColor: theme.colors.primary }}
                                title="Primary"
                              ></div>
                              <div
                                className="w-8 h-8 rounded-lg shadow-elegant border border-gray-200"
                                style={{ backgroundColor: theme.colors.secondary }}
                                title="Secondary"
                              ></div>
                              <div
                                className="w-8 h-8 rounded-lg shadow-elegant border border-gray-200"
                                style={{ backgroundColor: theme.colors.accent }}
                                title="Accent"
                              ></div>
                              <div
                                className="w-8 h-8 rounded-lg shadow-elegant border border-gray-200"
                                style={{ backgroundColor: theme.colors.surface }}
                                title="Surface"
                              ></div>
                            </div>

                            {/* Font Preview */}
                            <div className="space-y-3 mb-4">
                              <div style={{ fontFamily: theme.fonts.primary }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Type className="w-3 h-3 text-primary-600" />
                                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded font-sans">PRIMARY</span>
                                  <span className="text-xs text-gray-500 font-sans">{theme.fonts.primary}</span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">Beautiful Heading</div>
                              </div>

                              <div style={{ fontFamily: theme.fonts.secondary }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded font-sans">BODY</span>
                                  <span className="text-xs text-gray-500 font-sans">{theme.fonts.secondary}</span>
                                </div>
                                <div className="text-sm text-gray-700">This is body text that flows naturally and is easy to read.</div>
                              </div>

                              <div style={{ fontFamily: theme.fonts.accent }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded font-sans">ACCENT</span>
                                  <span className="text-xs text-gray-500 font-sans">{theme.fonts.accent}</span>
                                </div>
                                <div className="text-sm text-gray-600 font-mono">Code & Special Text</div>
                              </div>
                            </div>

                            {/* Theme Info */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-sans">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </span>
                              {theme.isPremium && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded font-sans">
                                  Premium
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-sans">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('themeCustomizer.currentTheme')}: <span className="font-medium">{currentTheme?.name || 'None'}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-glow font-display text-sm sm:text-base"
            >
              {t('themeCustomizer.done')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeCustomizer;
                      <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-elegant ${currentTheme?.id === theme.id
                            ? 'border-primary-500 bg-primary-50 shadow-glow ring-2 ring-primary-300'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => handleThemeSelect(theme.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentTheme?.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-glow"
                          >
                            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                          </motion.div>
                        )}

                        <div className="mb-3 sm:mb-4">
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 font-display">{theme.name}</h4>
                          <p className="text-sm text-gray-600 font-sans">Font combination preview</p>
                        </div>

                        {/* Font Preview */}
                        <div className="space-y-2 sm:space-y-3">
                          <div style={{ fontFamily: theme.fonts.primary }}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-xs font-medium text-primary-600 bg-primary-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-sans">PRIMARY</span>
                              <span className="text-xs text-gray-500 font-sans">{theme.fonts.primary}</span>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-gray-900">The quick brown fox</div>
                          </div>

                          <div style={{ fontFamily: theme.fonts.secondary }}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-xs font-medium text-secondary-600 bg-secondary-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-sans">SECONDARY</span>
                              <span className="text-xs text-gray-500 font-sans">{theme.fonts.secondary}</span>
                            </div>
                            <div className="text-sm sm:text-base text-gray-700">jumps over the lazy dog</div>
                          </div>

                          <div style={{ fontFamily: theme.fonts.accent }}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-sans">ACCENT</span>
                              <span className="text-xs text-gray-500 font-sans">{theme.fonts.accent}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 italic">1234567890</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-sans">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('themeCustomizer.currentTheme')}: <span className="font-medium">{currentTheme?.name || 'None'}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-glow font-display text-sm sm:text-base"
            >
              {t('themeCustomizer.done')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeCustomizer;