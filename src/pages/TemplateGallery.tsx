import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  Download,
  Eye,
  Coins,
  Crown,
  Zap,
  TrendingUp,
  Clock,
  User,
  Globe,
  Palette,
  Layout,
  Smartphone,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  Briefcase,
  ShoppingBag,
  Building,
  ChevronDown,
  ExternalLink,
  Play,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle,
} from 'lucide-react';
import { optimizedStorage, TemplateGalleryItem } from '../utils/optimizedStorage';
import { useProject } from '../contexts/ProjectContext';
import CommonHeader from '../components/CommonHeader';

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createProject } = useProject();
  
  const [templates, setTemplates] = useState<TemplateGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'downloads'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateGalleryItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Categories with icons
  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid, count: 0 },
    { id: 'business', name: 'Business', icon: Building, count: 0 },
    { id: 'personal', name: 'Personal', icon: User, count: 0 },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, count: 0 },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, count: 0 },
    { id: 'education', name: 'Education', icon: GraduationCap, count: 0 },
    { id: 'photography', name: 'Photography', icon: Camera, count: 0 },
    { id: 'music', name: 'Music', icon: Music, count: 0 },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, count: 0 },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils, count: 0 },
    { id: 'automotive', name: 'Automotive', icon: Car, count: 0 },
    { id: 'realestate', name: 'Real Estate', icon: Home, count: 0 },
  ];

  // Load templates from storage
  useEffect(() => {
    const loadTemplates = () => {
      try {
        setIsLoading(true);
        const galleryTemplates = optimizedStorage.getTemplateGallery();
        
        console.log('📚 Loaded templates from gallery:', galleryTemplates);
        setTemplates(galleryTemplates);
      } catch (error) {
        console.error('❌ Error loading templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Update category counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    templates.forEach(template => {
      counts[template.category] = (counts[template.category] || 0) + 1;
    });

    return categories.map(category => ({
      ...category,
      count: category.id === 'all' ? templates.length : (counts[category.id] || 0)
    }));
  }, [templates]);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.viewsCount + b.likesCount + b.downloads) - (a.viewsCount + a.likesCount + a.downloads);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchTerm, selectedCategory, sortBy]);

  const handleUseTemplate = async (template: TemplateGalleryItem) => {
    try {
      // Track template download
      optimizedStorage.trackTemplateDownload(template.id);
      
      // Get the original project data
      const originalProject = optimizedStorage.getProjectByUrl(template.websiteUrl);
      
      if (!originalProject) {
        toast.error('Template project not found');
        return;
      }

      // Create a new project based on the template
      const newProject = createProject(
        `${template.name} - Copy`,
        template.description,
        undefined, // Let it generate a new URL
        template.category,
        template.tags,
        originalProject.logo,
        originalProject.favicon
      );

      // Copy sections from original project
      if (originalProject.sections && originalProject.sections.length > 0) {
        // Update the new project with the template's sections
        const updatedProject = {
          ...newProject,
          sections: originalProject.sections.map(section => ({
            ...section,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate new IDs
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          themeId: originalProject.themeId,
        };

        // Save the updated project
        optimizedStorage.saveProject(updatedProject);
      }

      toast.success(`Template "${template.name}" added to your projects!`);
      navigate(`/editor/${newProject.id}`);
    } catch (error) {
      console.error('❌ Error using template:', error);
      toast.error('Failed to use template. Please try again.');
    }
  };

  const handleLikeTemplate = (template: TemplateGalleryItem) => {
    if (optimizedStorage.isTemplateLiked(template.id)) {
      toast.info('You already liked this template!');
      return;
    }

    optimizedStorage.trackTemplateLike(template.id);
    
    // Update local state
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, likesCount: t.likesCount + 1 }
        : t
    ));
    
    toast.success('Template liked! ❤️');
  };

  const handlePreviewTemplate = (template: TemplateGalleryItem) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleVisitLiveTemplate = (template: TemplateGalleryItem) => {
    const siteUrl = `/site/${template.websiteUrl}`;
    window.open(siteUrl, '_blank');
    
    // Track view
    optimizedStorage.updateTemplate(template.id, {
      viewsCount: template.viewsCount + 1
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPopularityScore = (template: TemplateGalleryItem) => {
    return template.viewsCount + template.likesCount * 2 + template.downloads * 3;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <CommonHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-primary">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('templates.title')}</h1>
            </div>
            <p className="text-lg text-gray-600 font-primary">
              {t('templates.subtitle', { count: templates.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('templates.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary bg-white"
              >
                <option value="popular">{t('templates.sortMostPopular')}</option>
                <option value="newest">{t('templates.sortNewest')}</option>
                <option value="rating">{t('templates.sortHighestRated')}</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              <Filter className="w-5 h-5" />
              {t('templates.filters')}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categoriesWithCounts.map(({ id, name, icon: Icon, count }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedCategory(id)}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${
                        selectedCategory === id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium font-primary text-sm">{name}</div>
                        <div className="text-xs text-gray-500">{count}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
              {t('templates.noTemplatesFound')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto font-primary">
              {t('templates.noTemplatesFoundDesc')}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredTemplates.map((template, index) => {
              const CategoryIcon = categories.find(c => c.id === template.category)?.icon || Building;
              const isLiked = optimizedStorage.isTemplateLiked(template.id);

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Template Thumbnail */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'} overflow-hidden`}>
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
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          title="Preview"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleVisitLiveTemplate(template)}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          title="Visit Live Site"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium">
                      <CategoryIcon className="w-3 h-3" />
                      <span className="font-primary">{template.category}</span>
                    </div>

                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        <span className="font-primary">{t('templates.pro')}</span>
                      </div>
                    )}

                    {/* Stats Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="font-primary">{template.viewsCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span className="font-primary">{template.downloads}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        {getRatingStars(template.rating).slice(0, 1)}
                        <span className="font-primary">{template.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-heading line-clamp-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-primary line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="font-primary">by {template.userName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-primary">{template.sectionsCount} sections</span>
                    </div>

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
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                          <span className="font-primary">{template.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="font-primary">{template.coinsCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getRatingStars(template.rating)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold font-heading"
                      >
                        <Download className="w-4 h-4" />
                        {t('templates.useTemplate')}
                      </button>
                      
                      <button
                        onClick={() => handleLikeTemplate(template)}
                        disabled={isLiked}
                        className={`px-3 py-3 rounded-xl transition-colors ${
                          isLiked
                            ? 'bg-red-100 text-red-600 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Price (if premium) */}
                    {template.isPremium && template.price > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 font-primary">Price:</span>
                          <span className="text-lg font-bold text-primary-600 font-heading">
                            ${template.price}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredTemplates.length > 0 && filteredTemplates.length >= 20 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-lg font-heading">
              Load More Templates
            </button>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-gray-600 font-primary">
                    by {selectedTemplate.userName}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Template Preview */}
                <div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-4">
                    <img
                      src={selectedTemplate.thumbnail}
                      alt={selectedTemplate.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleVisitLiveTemplate(selectedTemplate)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-xl hover:bg-white transition-colors font-medium font-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Live Site
                      </button>
                    </div>
                  </div>

                  {/* Template Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Eye className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 font-heading">
                        {selectedTemplate.viewsCount}
                      </div>
                      <div className="text-xs text-gray-600 font-primary">Views</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 font-heading">
                        {selectedTemplate.likesCount}
                      </div>
                      <div className="text-xs text-gray-600 font-primary">Likes</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Download className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 font-heading">
                        {selectedTemplate.downloads}
                      </div>
                      <div className="text-xs text-gray-600 font-primary">Downloads</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900 font-heading">
                        {selectedTemplate.rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600 font-primary">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Template Details */}
                <div>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-heading">
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed font-primary">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-heading">
                        Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-primary">Category:</span>
                          <span className="font-medium text-gray-900 font-primary capitalize">
                            {selectedTemplate.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-primary">Sections:</span>
                          <span className="font-medium text-gray-900 font-primary">
                            {selectedTemplate.sectionsCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-primary">Created:</span>
                          <span className="font-medium text-gray-900 font-primary">
                            {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedTemplate.isPremium && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-primary">Price:</span>
                            <span className="font-bold text-primary-600 font-heading">
                              ${selectedTemplate.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-heading">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium font-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          handleUseTemplate(selectedTemplate);
                          setShowPreview(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-lg font-heading"
                      >
                        <Download className="w-5 h-5" />
                        {t('templates.useThisTemplate')}
                      </button>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleLikeTemplate(selectedTemplate);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium font-primary"
                        >
                          <Heart className="w-4 h-4" />
                          Like
                        </button>
                        
                        <button
                          onClick={() => handleVisitLiveTemplate(selectedTemplate)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State for No Templates */}
      {!isLoading && templates.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
              No Templates Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8 font-primary">
              Templates will appear here once they are added by administrators. Check back soon!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold font-heading"
            >
              Create Your Own Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;