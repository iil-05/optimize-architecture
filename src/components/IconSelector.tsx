import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { iconRegistry, IconDefinition } from '../core/IconRegistry';
import { optimizedStorage } from '../core/OptimizedStorage';

interface IconSelectorProps {
  currentIcon: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ currentIcon, onSelect, onClose }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recent');
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  // Get icons from registry
  const allIcons = useMemo(() => iconRegistry.getAllIcons(), []);
  const recentIcons = useMemo(() => optimizedStorage.getRecentlyUsedIcons(), []);
  const favoriteIcons = useMemo(() => optimizedStorage.getFavoriteIcons(), []);
  const popularIcons = useMemo(() => iconRegistry.getPopularIcons(), []);
  const categories = useMemo(() => iconRegistry.getCategories(), []);

  // Get icons for selected category
  const getCategoryIcons = (category: string): IconDefinition[] => {
    switch (category) {
      case 'recent':
        return recentIcons;
      case 'favorites':
        return favoriteIcons;
      case 'popular':
        return popularIcons;
      case 'all':
        return allIcons;
      default:
        return iconRegistry.getIconsByCategory(category);
    }
  };

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = getCategoryIcons(selectedCategory);

    if (searchTerm) {
      icons = iconRegistry.searchIcons(searchTerm);
    }

    return icons;
  }, [searchTerm, selectedCategory]);

  // Handle icon selection
  const handleIconClick = (icon: IconDefinition) => {
    setSelectedIcon(icon.id);
    optimizedStorage.addToRecentlyUsedIcons(icon.id);
    onSelect(icon.name); // Use icon.name instead of icon.id for Lucide icons
  };

  const handleToggleFavorite = (iconId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    optimizedStorage.toggleFavoriteIcon(iconId);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-elegant-lg border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Live Preview */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Live Preview */}
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIcon}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {React.createElement(iconRegistry.getIconComponent(selectedIcon) || (() => null), {
                      className: "w-6 h-6 sm:w-8 sm:h-8 text-white"
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 font-display">{t('iconSelector.title')}</h2>
                <p className="text-sm sm:text-base text-gray-600 font-sans">
                  {t('iconSelector.currentlySelected')}: <span className="font-semibold text-primary-600">{selectedIcon}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 sm:p-3 hover:bg-white/90 rounded-2xl transition-colors group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('iconSelector.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-base sm:text-lg font-sans placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => setSelectedCategory('recent')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${selectedCategory === 'recent'
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                Recent ({recentIcons.length})
              </button>
              <button
                onClick={() => setSelectedCategory('favorites')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${selectedCategory === 'favorites'
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                Favorites ({favoriteIcons.length})
              </button>
              <button
                onClick={() => setSelectedCategory('popular')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${selectedCategory === 'popular'
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                Popular ({popularIcons.length})
              </button>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                All ({allIcons.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-xs sm:text-sm font-sans ${selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({iconRegistry.getCategoryCount(category)})
                </button>
              ))}
            </div>
          </div>

          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {filteredIcons.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 sm:py-16"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 font-display">{t('iconSelector.noIconsFound')}</h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto font-sans">
                    {t('iconSelector.tryAdjustingSearch')}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2 sm:gap-3">
                  <AnimatePresence>
                    {filteredIcons.map((icon, index) => {
                      const IconComponent = icon.component;
                      const isSelected = selectedIcon === icon.id;
                      const isFavorite = favoriteIcons.some(fav => fav.id === icon.id);

                      return (
                        <motion.button
                          key={icon.id}
                          onClick={() => handleIconClick(icon)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.01, duration: 0.2 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative p-4 rounded-2xl transition-all duration-200 group ${isSelected
                            ? 'bg-primary-600 text-white shadow-glow ring-2 ring-primary-300 scale-110'
                            : 'bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-600 hover:shadow-elegant'
                            }`}
                          title={icon.name}
                        >
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mx-auto transition-transform duration-200" />

                          {/* Favorite button */}
                          <button
                            onClick={(e) => handleToggleFavorite(icon.id, e)}
                            className={`absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all ${
                              isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <span className="text-xs">♥</span>
                          </button>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-glow"
                            >
                              <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </motion.div>
                          )}

                          {/* Hover tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-sans hidden sm:block">
                            {icon.name}
                          </div>

                          {/* Ripple effect on click */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl"
                            initial={{ scale: 0, opacity: 0.5 }}
                            animate={{ scale: 0, opacity: 0 }}
                            whileTap={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              background: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(239, 68, 68, 0.3)'
                            }}
                          />
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 font-sans">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <span className="font-medium">
                {filteredIcons.length} {t('iconSelector.iconsAvailable')}
              </span>
              {searchTerm && (
                <span className="text-primary-600 hidden sm:inline">
                  • {t('iconSelector.filteredBy')} "{searchTerm}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium font-sans text-sm sm:text-base"
              >
                {t('iconSelector.cancel')}
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-glow font-display text-sm sm:text-base"
              >
                {t('iconSelector.done')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IconSelector;