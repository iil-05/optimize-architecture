import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Eye,
  Heart,
  Crown,
  Briefcase,
  ShoppingBag,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  User,
  Building,
  Plus,
  Palette,
  Layout,
  X,
} from 'lucide-react';
import { optimizedStorage, TemplateGalleryItem } from '../utils/optimizedStorage';
import { useProject } from '../contexts/ProjectContext';
import CommonHeader from '../components/CommonHeader';

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateGalleryItem | null>(null);

  // Load templates
  const allTemplates = optimizedStorage.getTemplateGallery();

  const categories = [
    { id: 'all', name: t('templates.categories.all'), icon: Grid, count: allTemplates.length },
    { id: 'business', name: t('templates.categories.business'), icon: Building, count: allTemplates.filter(t => t.category === 'business').length },
    { id: 'portfolio', name: t('templates.categories.portfolio'), icon: Briefcase, count: allTemplates.filter(t => t.category === 'portfolio').length },
    { id: 'ecommerce', name: t('templates.categories.ecommerce'), icon: ShoppingBag, count: allTemplates.filter(t => t.category === 'ecommerce').length },
    { id: 'personal', name: t('templates.categories.personal'), icon: User, count: allTemplates.filter(t => t.category === 'personal').length },
    { id: 'photography', name: t('templates.categories.photography'), icon: Camera, count: allTemplates.filter(t => t.category === 'photography').length },
    { id: 'music', name: t('templates.categories.music'), icon: Music, count: allTemplates.filter(t => t.category === 'music').length },
    { id: 'restaurant', name: t('templates.categories.restaurant'), icon: Utensils, count: allTemplates.filter(t => t.category === 'restaurant').length },
    { id: 'education', name: t('templates.categories.education'), icon: GraduationCap, count: allTemplates.filter(t => t.category === 'education').length },
    { id: 'automotive', name: t('templates.categories.automotive'), icon: Car, count: allTemplates.filter(t => t.category === 'automotive').length },
    { id: 'realestate', name: t('templates.categories.realestate'), icon: Home, count: allTemplates.filter(t => t.category === 'realestate').length },
    { id: 'gaming', name: t('templates.categories.gaming'), icon: Gamepad2, count: allTemplates.filter(t => t.category === 'gaming').length },
  ];

  // Filter and sort templates
  const filteredTemplates = optimizedStorage.searchTemplates(
    searchTerm,
    selectedCategory === 'all' ? undefined : selectedCategory
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.downloads - a.downloads;
    }
  });

  const handleUseTemplate = (template: TemplateGalleryItem) => {
    // Create a new project based on the template
    const project = createProject(
      `${template.name} Website`,
      template.description,
      `${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      template.category
    );

    // Navigate to editor
    navigate(`/editor/${project.websiteUrl}`);
  };

  const handlePreviewTemplate = (template: TemplateGalleryItem) => {
    setSelectedTemplate(template);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('templates.title')}</h1>
                <p className="text-gray-600 font-primary">{t('templates.subtitle', { count: allTemplates.length })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                <Filter className="w-4 h-4" />
                {t('templates.filters')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('templates.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-lg font-primary"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-lg font-primary"
            >
              <option value="popular">{t('templates.sortMostPopular')}</option>
              <option value="newest">{t('templates.sortNewest')}</option>
              <option value="rating">{t('templates.sortHighestRated')}</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(({ id, name, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${selectedCategory === id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-primary">{name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mt-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">{t('templates.noTemplatesFound')}</h3>
              <p className="text-gray-600 max-w-md mx-auto font-primary">
                {t('templates.noTemplatesFoundDesc')}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
              }`}>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group ${viewMode === 'list' ? 'flex' : ''
                    }`}
                >
                  {/* Template Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'
                    }`}>
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <button
                          onClick={() => handlePreviewTemplate(template)}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        {t('templates.pro')}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {template.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors font-heading">
                        {template.name}
                      </h3>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed font-primary">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium font-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium font-primary">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span className="font-primary">{template.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRatingStars(template.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-primary">
                        {template.sections.length} {t('templates.sections').toLowerCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreviewTemplate(template)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                      >
                        {t('templates.preview')}
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                      >
                        {t('templates.useTemplate')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 font-heading">{selectedTemplate.name}</h3>
                  <p className="text-gray-600 font-primary">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-heading">{t('templates.category')} {t('templates.sections')}</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-primary">{t('templates.category')}:</span>
                      <span className="font-medium text-gray-900 font-primary">{t(`templates.categories.${selectedTemplate.category}`)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-primary">{t('templates.sections')}:</span>
                      <span className="font-medium text-gray-900 font-primary">{selectedTemplate.sections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-primary">{t('templates.downloads')}:</span>
                      <span className="font-medium text-gray-900 font-primary">{selectedTemplate.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-primary">{t('templates.rating')}:</span>
                      <div className="flex items-center gap-1">
                        {getRatingStars(selectedTemplate.rating)}
                        <span className="font-medium text-gray-900 font-primary ml-1">
                          {selectedTemplate.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3 mt-6 font-heading">{t('templates.includedSections')}</h4>
                  <div className="space-y-2">
                    {selectedTemplate.sections.map((sectionId) => (
                      <div key={sectionId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Layout className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700 font-primary">{sectionId}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-heading">{t('templates.tags')}</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-3 font-heading">{t('templates.readyToStart')}</h4>
                    <p className="text-gray-600 mb-4 font-primary">
                      {t('templates.readyToStartDesc')}
                    </p>
                    <button
                      onClick={() => {
                        handleUseTemplate(selectedTemplate);
                        setSelectedTemplate(null);
                      }}
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold font-heading"
                    >
                      {t('templates.useThisTemplate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Coin Donation Modal */}
      {showCoinModal && selectedTemplateForCoins && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support Template Creator</h3>
              <p className="text-gray-600">
                Show your appreciation for "{selectedTemplateForCoins.name}" by {(selectedTemplateForCoins as any).userName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 5, 10].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCoinDonation(amount)}
                  className="p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors text-center"
                >
                  <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <span className="font-bold text-gray-900">{amount}</span>
                  <div className="text-xs text-gray-600">coin{amount > 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
    </div>
  );
};

            <div className="flex gap-3">
              <button
                onClick={() => setShowCoinModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCoinDonation(25)}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
              >
                Donate 25 Coins
              </button>
            </div>
          </motion.div>
        </div>
      )}
export default TemplateGallery;