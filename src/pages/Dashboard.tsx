import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Globe,
  Layout,
  Calendar,
  Clock,
  BarChart3,
  Users,
  Zap,
  X,
  Check,
  AlertCircle,
  Building,
  User,
  Briefcase,
  ShoppingBag,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  Image,
  Link as LinkIcon,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { optimizedStorage } from '../utils/optimizedStorage';
import { formatRelativeTime } from '../utils/helpers';
import CommonHeader from '../components/CommonHeader';

interface CreateProjectForm {
  name: string;
  description: string;
  websiteUrl: string;
  category: string;
  seoKeywords: string;
  logo: File | null;
  favicon: File | null;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, createProject, deleteProject, isLoading } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'lastUpdated' | 'dateCreated' | 'name'>('lastUpdated');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [createForm, setCreateForm] = useState<CreateProjectForm>({
    name: '',
    description: '',
    websiteUrl: '',
    category: 'business',
    seoKeywords: '',
    logo: null,
    favicon: null,
  });

  // Website categories
  const categories = [
    { id: 'business', name: 'Business', icon: Building },
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'automotive', name: 'Automotive', icon: Car },
    { id: 'realestate', name: 'Real Estate', icon: Home },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  ];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dateCreated':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'lastUpdated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const handleCreateProject = async () => {
    if (!createForm.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsCreating(true);
    try {
      // Process SEO keywords
      const seoKeywords = createForm.seoKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Process logo and favicon (convert to base64 or URL)
      let logoUrl = '';
      let faviconUrl = '';

      if (createForm.logo) {
        logoUrl = await fileToBase64(createForm.logo);
      }

      if (createForm.favicon) {
        faviconUrl = await fileToBase64(createForm.favicon);
      }

      // Generate website URL if not provided
      const websiteUrl = createForm.websiteUrl || 
        createForm.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

      const project = createProject(
        createForm.name,
        createForm.description,
        websiteUrl,
        createForm.category,
        seoKeywords,
        logoUrl,
        faviconUrl
      );

      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        websiteUrl: '',
        category: 'business',
        seoKeywords: '',
        logo: null,
        favicon: null,
      });

      toast.success('Project created successfully!');
      navigate(`/editor/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setShowDeleteConfirm(null);
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    }
  };

  const handleDuplicateProject = (project: any) => {
    const duplicatedProject = createProject(
      `${project.name} (Copy)`,
      project.description,
      `${project.websiteUrl}-copy-${Date.now()}`,
      project.category,
      project.seoKeywords,
      project.logo,
      project.favicon
    );

    toast.success('Project duplicated successfully!');
    navigate(`/editor/${duplicatedProject.id}`);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFormChange = (field: keyof CreateProjectForm, value: any) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate website URL from name
    if (field === 'name' && !createForm.websiteUrl) {
      const generatedUrl = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setCreateForm(prev => ({
        ...prev,
        websiteUrl: generatedUrl
      }));
    }
  };

  // Get dashboard stats
  const stats = {
    totalSites: projects.length,
    published: projects.filter(p => p.isPublished).length,
    sections: projects.reduce((total, project) => total + project.sections.length, 0),
    storage: '2.4 MB', // Mock data
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('dashboard.title')}</h1>
                <p className="text-gray-600 font-primary">{t('dashboard.subtitle')}</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg font-heading"
            >
              <Plus className="w-5 h-5" />
              {t('dashboard.projects.newWebsite')}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: t('dashboard.stats.totalSites'), value: stats.totalSites, icon: Layout, color: 'bg-blue-100 text-blue-600' },
            { label: t('dashboard.stats.published'), value: stats.published, icon: Globe, color: 'bg-green-100 text-green-600' },
            { label: t('dashboard.stats.sections'), value: stats.sections, icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
            { label: t('dashboard.stats.storage'), value: stats.storage, icon: Users, color: 'bg-orange-100 text-orange-600' },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-primary">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 font-heading">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 font-heading">{t('dashboard.projects.title')}</h2>
                <p className="text-gray-600 font-primary">{t('dashboard.projects.subtitle')}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('dashboard.projects.searchProjects')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                >
                  <option value="lastUpdated">{t('dashboard.projects.sortLastUpdated')}</option>
                  <option value="dateCreated">{t('dashboard.projects.sortDateCreated')}</option>
                  <option value="name">{t('dashboard.projects.sortName')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                {projects.length === 0 ? (
                  <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Layout className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">{t('dashboard.projects.createFirst')}</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6 font-primary">
                      {t('dashboard.projects.createFirstDesc')}
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold font-heading"
                    >
                      {t('dashboard.projects.createFirstButton')}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">{t('dashboard.projects.noWebsitesFound')}</h3>
                    <p className="text-gray-600 max-w-md mx-auto font-primary">
                      {t('dashboard.projects.noMatch', { searchTerm })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                  >
                    {/* Project Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layout className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.isPublished 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.isPublished ? t('dashboard.projects.live') : t('dashboard.projects.draft')}
                        </span>
                      </div>

                      {/* Actions Menu */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors font-heading">
                          {project.name}
                        </h3>
                      </div>

                      {project.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-primary">
                          {project.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-primary">{formatRelativeTime(project.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span className="font-primary">{t('dashboard.projects.sectionsCount', { count: project.sections.length })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editor/${project.id}`)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium font-primary"
                        >
                          <Edit3 className="w-4 h-4 inline mr-1" />
                          {t('dashboard.projects.edit')}
                        </button>
                        <button
                          onClick={() => navigate(`/preview/${project.id}`)}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium font-primary"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          {t('dashboard.projects.preview')}
                        </button>
                        <button
                          onClick={() => handleDuplicateProject(project)}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 font-heading">{t('dashboard.createModal.title')}</h3>
                  <p className="text-gray-600 font-primary">{t('dashboard.createModal.subtitle')}</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Website Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                  {t('dashboard.createModal.websiteName')} *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder={t('dashboard.createModal.websiteNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                  {t('dashboard.createModal.websiteUrl')} *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-3 bg-gray-100 text-gray-600 rounded-l-xl border border-r-0 border-gray-300 text-sm font-primary">
                    /site/
                  </span>
                  <input
                    type="text"
                    value={createForm.websiteUrl}
                    onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
                    placeholder={t('dashboard.createModal.websiteUrlPlaceholder')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 font-primary">{t('dashboard.createModal.urlRules')}</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                  {t('dashboard.createModal.websiteCategory')}
                </label>
                <select
                  value={createForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief description of your website..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                />
              </div>

              {/* SEO Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                  {t('dashboard.createModal.seoKeywords')}
                </label>
                <input
                  type="text"
                  value={createForm.seoKeywords}
                  onChange={(e) => handleFormChange('seoKeywords', e.target.value)}
                  placeholder={t('dashboard.createModal.seoKeywordsPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                />
                <p className="text-xs text-gray-500 mt-1 font-primary">{t('dashboard.createModal.seoKeywordsDesc')}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!createForm.name.trim() || isCreating}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 font-heading"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('dashboard.createModal.creating')}
                    </div>
                  ) : (
                    t('dashboard.createModal.createWebsite')
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">Delete Project</h3>
              <p className="text-gray-600 font-primary">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                {t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;