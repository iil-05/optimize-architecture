import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X,
  Search,
  Plus,
  Sparkles,
  Heart,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { getSectionTemplateById, improvedSectionTemplates } from '../data/improvedSectionTemplates';

interface SectionSelectorProps {
  onClose: () => void;
  onSelect: () => void;
  insertPosition?: { index: number; position: 'above' | 'below' } | null;
}

// Category color schemes
const categoryColors: Record<string, { bg: string; border: string; text: string; icon: string; gradient: string }> = {
  headers: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    icon: 'text-primary-600',
    gradient: 'from-primary-500 to-primary-600'
  },
  heroes: {
    bg: 'bg-secondary-50',
    border: 'border-secondary-200',
    text: 'text-secondary-700',
    icon: 'text-secondary-600',
    gradient: 'from-secondary-500 to-secondary-600'
  },
  about: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  services: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  features: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  pricing: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  testimonials: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    icon: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600'
  },
  portfolio: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  contact: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    icon: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  footers: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    icon: 'text-gray-600',
    gradient: 'from-gray-500 to-gray-600'
  },
  cta: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    icon: 'text-primary-600',
    gradient: 'from-primary-500 to-primary-600'
  },
  blog: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    icon: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600'
  }
};

const SectionSelector: React.FC<SectionSelectorProps> = ({ onClose, onSelect, insertPosition }) => {
  const { t } = useTranslation();
  const { addSectionFromTemplate } = useProject();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get sections from templates
  const allSections = improvedSectionTemplates;
  const categories = [...new Set(allSections.map(section => section.category))];

  // Get sections for selected category
  const getCategorySections = (category: string) => {
    if (category === 'all') {
      return allSections;
    }
    return allSections.filter(section => section.category === category);
  };

  const filteredSections = (() => {
    let sections = getCategorySections(selectedCategory);
    
    if (searchTerm) {
      sections = sections.filter(section => 
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return sections;
  })();

  const handleAddSection = (section: any) => {
    // Add section to project
    addSectionFromTemplate(section.id, section.defaultContent, insertPosition);
    onSelect();
  };

  const buildCategoryList = () => {
    const categoryList = [
      { id: 'all', name: t('common.all') || 'All', count: allSections.length, icon: Plus },
    ];

    categories.forEach(category => {
      const count = allSections.filter(s => s.category === category).length;
      if (count > 0) {
        categoryList.push({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          count,
          icon: Plus, // Default icon, could be enhanced
        });
      }
    });

    return categoryList;
  };

  const categoryList = buildCategoryList();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] overflow-y-auto shadow-elegant-lg border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 font-display">
                  {insertPosition
                    ? `${t('sectionSelector.title')} ${insertPosition.position === 'above' ? 'Above' : 'Below'} #${insertPosition.index + 1}`
                    : t('sectionSelector.title')
                  }
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-sans">
                  {insertPosition
                    ? `Insert a new section ${insertPosition.position} the current position`
                    : t('sectionSelector.description')
                  }
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-3 hover:bg-white/90 rounded-2xl transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </motion.button>
          </div>

          {/* Categories */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {categoryList.map((category) => {
                const colors = categoryColors[category.id] || categoryColors.headers;
                const isSelected = selectedCategory === category.id;
                const IconComponent = category.icon;

                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${isSelected
                        ? `${colors.bg} ${colors.text} ${colors.border} border-2 shadow-glow`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                    <span className="hidden sm:inline">({category.count})</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('sectionSelector.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-base sm:text-lg font-sans"
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1">
            <div className="p-4 sm:p-6">
              {filteredSections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 sm:py-16"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 font-display">{t('sectionSelector.noSectionsFound')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto font-sans">
                    {t('sectionSelector.tryAdjusting')}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredSections.map((section, index) => {
                    const colors = categoryColors[section.category] || categoryColors.headers;

                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group cursor-pointer bg-white rounded-3xl border-2 hover:shadow-elegant-lg transition-all duration-300 ${colors.border} hover:border-opacity-50`}
                        onClick={() => handleAddSection(section)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden">
                          <img
                            src={section.thumbnail}
                            alt={section.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                          {/* Category Badge */}
                          <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} font-sans`}>
                            {section.category}
                          </div>

                          {/* Add Button */}
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-glow">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-base sm:text-lg mb-2 font-display">
                            {section.name}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3 sm:mb-4 font-sans">{section.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                            {section.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-lg font-sans">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action */}
                          <div className={`flex items-center justify-between p-2 sm:p-3 rounded-xl ${colors.bg} group-hover:bg-opacity-80 transition-all`}>
                            <span className={`text-xs sm:text-sm font-medium ${colors.text} font-sans`}>
                              {t('sectionSelector.addToWebsite')}
                            </span>
                            <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.icon} group-hover:translate-x-1 transition-transform`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 font-sans">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <span className="font-medium">
                {filteredSections.length} {t('sectionSelector.sectionsAvailable')}
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium font-sans text-sm sm:text-base"
            >
              {t('sectionSelector.cancel')}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionSelector;