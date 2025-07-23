import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Coins,
  Eye,
  Star,
  Download,
  ExternalLink,
  Building,
  User,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Camera,
  Music,
  Gamepad2,
  Utensils,
  Car,
  Home,
  Palette,
  Crown,
  TrendingUp,
  Clock,
  Plus,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import { useProject } from '../contexts/ProjectContext';
import CommonHeader from '../components/CommonHeader';

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  websiteUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  sectionsCount: number;
  viewsCount: number;
  likesCount: number;
  coinsCount: number;
  rating: number;
  downloads: number;
  isPremium: boolean;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProject();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedTemplates, setLikedTemplates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Palette },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'automotive', name: 'Automotive', icon: Car },
    { id: 'realestate', name: 'Real Estate', icon: Home },
  ];

  useEffect(() => {
    loadTemplates();
    loadLikedTemplates();
  }, []);

  const loadTemplates = () => {
    setIsLoading(true);
    try {
      // Get all projects marked as templates
      const allProjects = optimizedStorage.getAllProjectsAdmin();
      const templateProjects = allProjects
        .filter(project => project.isTemplate && project.isPublished)
        .map(project => ({
          id: project.id,
          name: project.name,
          description: project.description || 'No description available',
          category: project.category,
          thumbnail: `https://images.pexels.com/photos/318${Math.floor(Math.random() * 10) + 4290}/pexels-photo-318${Math.floor(Math.random() * 10) + 4290}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`,
          websiteUrl: project.websiteUrl,
          userId: project.userId,
          userName: project.userName,
          userEmail: project.userEmail,
          sectionsCount: project.sectionsCount,
          viewsCount: project.viewsCount,
          likesCount: project.likesCount,
          coinsCount: project.coinsCount,
          rating: 4.5 + Math.random() * 0.5, // Mock rating
          downloads: Math.floor(Math.random() * 1000) + 100,
          isPremium: Math.random() > 0.7,
          isTemplate: project.isTemplate,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        }));

      setTemplates(templateProjects);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLikedTemplates = () => {
    try {
      const liked = JSON.parse(localStorage.getItem('liked_templates') || '[]');
      setLikedTemplates(liked);
    } catch (error) {
      console.error('Error loading liked templates:', error);
    }
  };

  const handleLikeTemplate = (templateId: string) => {
    const isLiked = likedTemplates.includes(templateId);
    let updatedLikes: string[];

    if (isLiked) {
      updatedLikes = likedTemplates.filter(id => id !== templateId);
      toast.info('Template removed from favorites');
    } else {
      updatedLikes = [...likedTemplates, templateId];
      toast.success('Template added to favorites!');
      
      // Track template like
      const template = templates.find(t => t.id === templateId);
      if (template) {
        optimizedStorage.trackTemplateLike(template.userId, templateId);
      }
    }

    setLikedTemplates(updatedLikes);
    localStorage.setItem('liked_templates', JSON.stringify(updatedLikes));

    // Update template likes count
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, likesCount: template.likesCount + (isLiked ? -1 : 1) }
        : template
    ));
  };

  const handleCoinDonation = (templateId: string, amount: number) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Track coin donation
    optimizedStorage.trackTemplateCoinDonation(template.userId, templateId, amount);

    // Update template coins count
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, coinsCount: t.coinsCount + amount }
        : t
    ));

    toast.success(`Donated ${amount} coin${amount > 1 ? 's' : ''} to ${template.userName}! 🪙`);
  };

  const handleUseTemplate = async (template: TemplateItem) => {
    try {
      // Track template download
      optimizedStorage.trackTemplateDownload(template.userId, template.id);

      // Create new project based on template
      const newProject = createProject(
        `${template.name} Copy`,
        `Based on ${template.name} template by ${template.userName}`,
        undefined,
        template.category
      );

      // Update downloads count
      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, downloads: t.downloads + 1 }
          : t
      ));

      toast.success('Template added to your projects!');
      navigate(`/editor/${newProject.id}`);
    } catch (error) {
      console.error('Error using template:', error);
      toast.error('Failed to use template');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likesCount + b.downloads) - (a.likesCount + a.downloads);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">Template Gallery</h1>
                <p className="text-gray-600 font-primary">
                  Choose from {templates.length} professional templates created by our community
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-primary">{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {templates.filter(t => t.category === category.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-primary">Loading templates...</p>
          </div>
        )}

        {/* Templates Grid/List */}
        {!isLoading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {sortedTemplates.map((template) => {
              const isLiked = likedTemplates.includes(template.id);
              const categoryData = categories.find(c => c.id === template.category);
              const CategoryIcon = categoryData?.icon || Building;

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Template Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'}`}>
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    
                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        Pro
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => window.open(`/site/${template.websiteUrl}`, '_blank')}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                      <CategoryIcon className="w-3 h-3 text-gray-600" />
                      <span className="text-gray-700 font-primary">{categoryData?.name}</span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 font-heading">{template.name}</h3>
                        <p className="text-sm text-gray-600 font-primary">by {template.userName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(template.rating)}
                        <span className="text-sm text-gray-600 ml-1 font-primary">({template.rating.toFixed(1)})</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed font-primary">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-primary">{template.viewsCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                        <span className="font-primary">{template.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span className="font-primary">{template.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-primary">{template.coinsCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium font-primary"
                      >
                        Use Template
                      </button>
                      
                      <button
                        onClick={() => handleLikeTemplate(template.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          isLiked 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                        title={isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      <div className="relative group">
                        <button className="p-2 bg-yellow-100 text-yellow-600 rounded-xl hover:bg-yellow-200 transition-colors">
                          <Coins className="w-4 h-4" />
                        </button>
                        
                        {/* Coin Donation Dropdown */}
                        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[120px]">
                            <div className="text-xs text-gray-600 mb-2 font-primary">Donate coins</div>
                            <div className="flex gap-1">
                              {[1, 5, 10].map(amount => (
                                <button
                                  key={amount}
                                  onClick={() => handleCoinDonation(template.id, amount)}
                                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 transition-colors font-primary"
                                >
                                  {amount}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!isLoading && sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">No templates found</h3>
            <p className="text-gray-600 mb-6 font-primary">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium font-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        {!isLoading && templates.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4 font-heading">Want to share your design?</h2>
            <p className="text-purple-100 mb-6 font-primary">
              Create amazing websites and get featured in our template gallery. Earn coins and recognition from the community!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold font-heading"
            >
              Start Creating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;