import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Globe,
  Layers,
  Clock,
  Sparkles,
  Bookmark,
  Layout,
  BarChart3,
  Smartphone,
  X,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
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
  Check,
  AlertCircle,
  Pencil,
  Settings2,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { formatRelativeTime } from '../utils/helpers';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userSiteBaseUrl = import.meta.env.VITE_USER_SITE_BASE_URL;

  const { projects, createProject, deleteProject, isLoading } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newCategory, setNewCategory] = useState('business');
  const [newSeoKeywords, setNewSeoKeywords] = useState('');
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newFavicon, setNewFavicon] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');
  const [urlError, setUrlError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Website categories
  const categories = [
    { id: 'business', name: 'Business', icon: Building, description: 'Corporate websites, agencies, consulting' },
    { id: 'personal', name: 'Personal', icon: User, description: 'Personal blogs, portfolios, resumes' },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, description: 'Creative portfolios, showcases' },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, description: 'Online stores, marketplaces' },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Schools, courses, learning platforms' },
    { id: 'photography', name: 'Photography', icon: Camera, description: 'Photo galleries, studios' },
    { id: 'music', name: 'Music', icon: Music, description: 'Musicians, bands, music studios' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, description: 'Gaming communities, esports' },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils, description: 'Restaurants, cafes, food services' },
    { id: 'automotive', name: 'Automotive', icon: Car, description: 'Car dealerships, auto services' },
    { id: 'realestate', name: 'Real Estate', icon: Home, description: 'Property listings, real estate agencies' },
  ];

  const filteredProjects = projects
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.websiteUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const validateWebsiteUrl = (url: string) => {
    if (!url) {
      setUrlError('Website URL is required');
      return false;
    }

    const urlPattern = /^[a-zA-Z0-9-_]+$/;
    if (!urlPattern.test(url)) {
      setUrlError('URL can only contain letters, numbers, hyphens, and underscores');
      return false;
    }

    if (url.length < 3) {
      setUrlError('URL must be at least 3 characters long');
      return false;
    }

    if (url.length > 50) {
      setUrlError('URL must be less than 50 characters');
      return false;
    }

    const urlExists = projects.some(p => p.websiteUrl === url);
    if (urlExists) {
      setUrlError('This website URL is already taken. Please choose a different one.');
      return false;
    }

    setUrlError('');
    return true;
  };

  const handleWebsiteUrlChange = (url: string) => {
    const cleanUrl = url.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setNewWebsiteUrl(cleanUrl);
    if (cleanUrl) {
      validateWebsiteUrl(cleanUrl);
    } else {
      setUrlError('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the logo');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }

      setNewLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the favicon');
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('Favicon file size must be less than 1MB');
        return;
      }

      setNewFavicon(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert('🔒 Authentication required to create projects');
      return;
    }

    if (!newProjectName.trim()) {
      alert('Please enter a website name');
      return;
    }

    if (!validateWebsiteUrl(newWebsiteUrl)) {
      return;
    }

    setIsCreating(true);

    try {
      // Convert uploaded files to base64 for storage
      let logoBase64 = '';
      let faviconBase64 = '';

      if (newLogo) {
        logoBase64 = await convertFileToBase64(newLogo);
      }

      if (newFavicon) {
        faviconBase64 = await convertFileToBase64(newFavicon);
      }

      // Parse SEO keywords
      const seoKeywords = newSeoKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Create the project with proper parameters
      const project = createProject(
        newProjectName.trim(),
        undefined, // description
        newWebsiteUrl.trim(), // websiteUrl
        newCategory, // category
        seoKeywords, // seoKeywords
        logoBase64, // logo
        faviconBase64 // favicon
      );

      // Reset form
      setNewProjectName('');
      setNewWebsiteUrl('');
      setNewCategory('business');
      setNewSeoKeywords('');
      setNewLogo(null);
      setNewFavicon(null);
      setLogoPreview('');
      setFaviconPreview('');
      setUrlError('');
      setShowCreateModal(false);

      // Navigate to editor only after successful creation
      setTimeout(() => {
        navigate(`/editor/${project.id}`);
      }, 100);

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create website. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert('🔒 Authentication required');
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project || project.userId !== currentUserId) {
      alert('🔒 Access denied: You cannot delete this project');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      setSelectedProject(null); // Clear selection after delete
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert('🔒 Authentication required');
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project && project.userId === currentUserId) {
      const newUrl = `${project.websiteUrl}-copy-${Date.now()}`;
      createProject(`${project.name} (Copy)`, project.description, newUrl);
    } else {
      alert('🔒 Access denied: You cannot duplicate this project');
    }
  };


  // const handleClearAllData = () => {
  //   if (window.confirm('⚠️ WARNING: This will permanently delete ALL your websites and data. This action cannot be undone.\n\nAre you absolutely sure you want to continue?')) {
  //     if (window.confirm('🚨 FINAL CONFIRMATION: All your websites will be lost forever. Type "DELETE" in the next prompt to confirm.')) {
  //       const confirmation = window.prompt('Type "DELETE" to confirm deletion of all data:');
  //       if (confirmation === 'DELETE') {
  //         clearAllData();
  //         setSelectedProject(null);
  //         alert('✅ All data has been cleared successfully.');
  //       } else {
  //         alert('❌ Deletion cancelled - confirmation text did not match.');
  //       }
  //     }
  //   }
  // };

  const storageInfo = optimizedStorage.getStorageHealth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2 font-heading">Loading Your Projects</h2>
          <p className="text-secondary-600 font-primary">Please wait while we fetch your data...</p>
        </motion.div>
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

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white w-64 lg:w-80 font-primary text-sm"
                />
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg font-heading"
              >
                <Plus className="w-5 h-5" />
                New Website
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white font-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading">{projects.length}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium font-primary">{t('dashboard.stats.totalSites')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
                  {projects.filter(p => p.isPublished).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium font-primary">{t('dashboard.stats.published')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
                  {projects.reduce((total, project) => total + project.sections.length, 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium font-primary">{t('dashboard.stats.sections')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
                  {Math.round((storageInfo.totalSize / (5 * 1024 * 1024)) * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium font-primary">{t('dashboard.stats.storage')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-heading">{t('dashboard.projects.title')}</h2>
              <p className="text-gray-600 font-primary">{t('dashboard.projects.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'name')}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 backdrop-blur-sm font-primary text-sm"
              >
                <option value="updated">{t('dashboard.projects.sortLastUpdated')}</option>
                <option value="created">{t('dashboard.projects.sortDateCreated')}</option>
                <option value="name">{t('dashboard.projects.sortName')}</option>
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-20"
            >
              <div className="relative mb-8">
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-400 rounded-full flex items-center justify-center"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-heading">
                {searchTerm ? t('dashboard.projects.noWebsitesFound') : t('dashboard.projects.createFirst')}
              </h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-base sm:text-lg font-primary px-4">
                {searchTerm
                  ? t('dashboard.projects.noMatch', { searchTerm })
                  : t('dashboard.projects.createFirstDesc')
                }
              </p>
              {!searchTerm && (
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold shadow-md text-base sm:text-lg font-heading"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  {t('dashboard.projects.createFirstButton')}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Project Thumbnail */}
                  <div className="relative h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"
                        >
                          <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                        </motion.div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1 font-primary">
                          {t('dashboard.projects.sectionsCount', { count: project.sections.length })}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-medium ${project.isPublished
                          ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-lg'
                          : 'bg-orange-100 text-orange-800 border-2 border-orange-300 shadow-lg'
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 animate-pulse ${project.isPublished ? 'bg-green-600' : 'bg-orange-600'
                            }`}
                        ></div>

                        {/* Icon + Text */}
                        <span className="font-primary font-bold inline-flex items-center gap-1">
                          {project.isPublished ? (
                            <>
                              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              LIVE
                            </>
                          ) : (
                            <>
                              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              DRAFT
                            </>
                          )}
                        </span>
                      </motion.span>
                    </div>

                    {/* Action Menu */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <motion.button
                          onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-md"
                        >
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </motion.button>

                        <AnimatePresence>
                          {selectedProject === project.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 top-12 w-44 sm:w-48 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 py-2 z-50"
                            >
                              <button
                                onClick={() => {
                                  const currentUserId = getCurrentUserId();
                                  if (!currentUserId || project.userId !== currentUserId) {
                                    alert('🔒 Access denied');
                                    return;
                                  }
                                  navigate(`/preview/${project.id}`);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Eye className="w-4 h-4" />
                                {t('dashboard.projects.preview')}
                              </button>
                              <button
                                onClick={() => {
                                  const currentUserId = getCurrentUserId();
                                  if (!currentUserId || project.userId !== currentUserId) {
                                    alert('🔒 Access denied');
                                    return;
                                  }
                                  handleDuplicateProject(project.id);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Copy className="w-4 h-4" />
                                {t('dashboard.projects.duplicate')}
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  handleDeleteProject(project.id);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('dashboard.projects.delete')}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex-1 mr-2 group-hover:text-primary-600 transition-colors font-heading">
                        {project.name}
                      </h3>
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors flex-shrink-0" />
                    </div>

                    {/* Website URL */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
                        <span
                          className={`text-xs sm:text-sm font-mono truncate ${project.isPublished ? 'text-primary-600 font-bold' : 'text-gray-500'}`}
                        >
                          {project.isPublished
                            ? `${userSiteBaseUrl.replace(/^https?:\/\//, '')}/${project.websiteUrl}`
                            : 'Not Published Yet'}
                        </span>
                      </div>
                      {project.isPublished && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(`${userSiteBaseUrl}/${project.websiteUrl}`)
                          }
                          className="ml-2 px-2 py-1 text-xs rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 transition"
                          title="Copy URL"
                        >
                          Copy
                        </button>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed font-primary">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium font-primary">{formatRelativeTime(project.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium font-primary">{t('dashboard.projects.sectionsCount', { count: project.sections.length })}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <motion.button
                        onClick={() => {
                          const currentUserId = getCurrentUserId();
                          if (!currentUserId || project.userId !== currentUserId) {
                            alert('🔒 Access denied');
                            return;
                          }
                          navigate(`/editor/${project.id}`);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-sm shadow-md font-heading"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        {t('dashboard.projects.edit')}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          const currentUserId = getCurrentUserId();
                          if (!currentUserId || project.userId !== currentUserId) {
                            alert('🔒 Access denied');
                            return;
                          }
                          navigate(`/preview/${project.id}`);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm font-primary"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>

                      {project.isPublished && (
                        <motion.button
                          onClick={() => {
                            const siteUrl = `${userSiteBaseUrl}/${project.websiteUrl}`;
                            window.open(siteUrl, '_blank');
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-2.5 sm:px-4 sm:py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-sm font-primary shadow-lg"
                          title="View Published Site"
                        >
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      )}

                      {project.isPublished && (
                        <motion.button
                          onClick={() => {
                            const currentUserId = getCurrentUserId();
                            if (!currentUserId || project.userId !== currentUserId) {
                              alert('🔒 Access denied');
                              return;
                            }
                            navigate(`/admin/${project.id}`);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold text-sm font-primary shadow-lg"
                          title="Open Admin Panel"
                        >
                          <Settings2 className="w-4 h-4" />
                        </motion.button>
                      )}

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isCreating) {
                setShowCreateModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">{t('dashboard.createModal.title')}</h2>
                    <p className="text-sm sm:text-base text-gray-600 font-primary">{t('dashboard.createModal.subtitle')}</p>
                  </div>
                </div>
                {!isCreating && (
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                {/* Website Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.websiteName')} *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder={t('dashboard.createModal.websiteNamePlaceholder')}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg font-primary"
                    required
                    disabled={isCreating}
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.websiteUrl')} *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-3 sm:py-4 bg-gray-100 text-gray-600 rounded-l-xl border border-r-0 border-gray-300 text-sm sm:text-base font-mono">
                      {userSiteBaseUrl.replace(/^https?:\/\//, '')}/
                    </span>
                    <input
                      type="text"
                      value={newWebsiteUrl}
                      onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                      placeholder={t('dashboard.createModal.websiteUrlPlaceholder')}
                      className={`flex-1 px-4 py-3 sm:py-4 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg font-mono ${urlError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  {urlError && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-primary">{urlError}</span>
                    </div>
                  )}
                  {!urlError && newWebsiteUrl && (
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-primary">{t('dashboard.createModal.urlAvailable')}</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 font-primary">
                    {t('dashboard.createModal.urlRules')}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.websiteCategory')} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <motion.button
                          key={category.id}
                          type="button"
                          onClick={() => setNewCategory(category.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isCreating}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${newCategory === category.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                          <IconComponent className="w-5 h-5 mb-2" />
                          <div className="text-sm font-semibold font-primary">{category.name}</div>
                          <div className="text-xs text-gray-500 font-primary">{category.description}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.seoKeywords')}
                  </label>
                  <input
                    type="text"
                    value={newSeoKeywords}
                    onChange={(e) => setNewSeoKeywords(e.target.value)}
                    placeholder={t('dashboard.createModal.seoKeywordsPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-primary text-base"
                    disabled={isCreating}
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 font-primary">
                    {t('dashboard.createModal.seoKeywordsDesc')}
                  </p>
                </div>

                {/* Logo File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.logoUpload')}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={isCreating}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer font-primary text-base"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            {newLogo ? newLogo.name : t('dashboard.createModal.chooseLogoFile')}
                          </span>
                        </div>
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewLogo(null);
                            setLogoPreview('');
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 font-primary">
                    {t('dashboard.createModal.logoUploadDesc')}
                  </p>
                </div>

                {/* Favicon File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-primary">
                    {t('dashboard.createModal.faviconUpload')}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        disabled={isCreating}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="favicon-upload"
                      />
                      <label
                        htmlFor="favicon-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer font-primary text-base"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            {newFavicon ? newFavicon.name : t('dashboard.createModal.chooseFaviconFile')}
                          </span>
                        </div>
                      </label>
                    </div>
                    {faviconPreview && (
                      <div className="relative w-8 h-8 border border-gray-200 rounded overflow-hidden bg-white">
                        <img
                          src={faviconPreview}
                          alt="Favicon preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewFavicon(null);
                            setFaviconPreview('');
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 font-primary">
                    {t('dashboard.createModal.faviconUploadDesc')}
                  </p>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreating}
                    className="flex-1 px-4 py-3 sm:px-6 sm:py-4 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold font-primary text-base disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreating || !!urlError || !newProjectName.trim() || !newWebsiteUrl.trim()}
                    className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold shadow-md font-heading text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t('dashboard.createModal.creating')}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {t('dashboard.createModal.createWebsite')}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;