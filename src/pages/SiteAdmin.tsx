import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Settings,
  BarChart3,
  Globe,
  Edit3,
  Save,
  Eye,
  Users,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Calendar,
  Monitor,
  Smartphone,
  Search,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  X,
  RefreshCw,
  Download,
  Share2,
  Trash2,
  Archive,
  Power,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Timer,
  Target,
  Award,
  Star,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  Building,
  User,
  Tag,
  FileText,
  Code,
  Palette,
  Layout,
  Layers,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import { optimizedStorage } from '../utils/optimizedStorage';
import { formatRelativeTime } from '../utils/helpers';
import CommonHeader from '../components/CommonHeader';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  trafficSources: { source: string; percentage: number }[];
  deviceTypes: { device: string; percentage: number }[];
  recentVisits: { timestamp: Date; ip: string; userAgent: string; page: string }[];
}

interface TechnicalStatus {
  uptime: number;
  responseTime: number;
  sslStatus: 'active' | 'inactive' | 'expired';
  lastChecked: Date;
  seoScore: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  errors: string[];
  warnings: string[];
}

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, currentProject, setCurrentProject, updateProject } = useProject();
  const { updateTheme, currentTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'settings' | 'technical'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectTheme, setProjectTheme] = useState(currentTheme);

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    category: '',
    seoKeywords: '',
    logo: '',
    favicon: '',
  });

  // Mock analytics data - in a real app, this would come from your analytics service
  const [analyticsData] = useState<AnalyticsData>({
    totalViews: 1247,
    uniqueVisitors: 892,
    avgSessionDuration: 245, // seconds
    bounceRate: 32.5, // percentage
    topPages: [
      { page: '/', views: 456 },
      { page: '/about', views: 234 },
      { page: '/services', views: 189 },
      { page: '/contact', views: 156 },
      { page: '/portfolio', views: 112 },
    ],
    trafficSources: [
      { source: 'Direct', percentage: 45.2 },
      { source: 'Google', percentage: 28.7 },
      { source: 'Social Media', percentage: 15.3 },
      { source: 'Referrals', percentage: 10.8 },
    ],
    deviceTypes: [
      { device: 'Desktop', percentage: 52.3 },
      { device: 'Mobile', percentage: 38.9 },
      { device: 'Tablet', percentage: 8.8 },
    ],
    recentVisits: [
      { timestamp: new Date(Date.now() - 5 * 60 * 1000), ip: '192.168.1.1', userAgent: 'Chrome/120.0', page: '/' },
      { timestamp: new Date(Date.now() - 15 * 60 * 1000), ip: '192.168.1.2', userAgent: 'Safari/17.0', page: '/about' },
      { timestamp: new Date(Date.now() - 25 * 60 * 1000), ip: '192.168.1.3', userAgent: 'Firefox/121.0', page: '/services' },
    ],
  });

  // Mock technical status - in a real app, this would come from monitoring services
  const [technicalStatus] = useState<TechnicalStatus>({
    uptime: 99.9,
    responseTime: 245, // ms
    sslStatus: 'active',
    lastChecked: new Date(),
    seoScore: {
      performance: 92,
      accessibility: 88,
      bestPractices: 95,
      seo: 89,
    },
    errors: [],
    warnings: ['Consider optimizing images for better performance'],
  });

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        
        // Apply project's theme
        if (project.themeId) {
          const theme = themeRegistry.getTheme(project.themeId);
          if (theme) {
            setProjectTheme(theme);
            updateTheme(project.themeId);
          }
        }

        // Initialize edit form
        setEditForm({
          name: project.name,
          description: project.description || '',
          websiteUrl: project.websiteUrl,
          category: project.category,
          seoKeywords: project.seoKeywords.join(', '),
          logo: project.logo || '',
          favicon: project.favicon || '',
        });
      } else {
        console.log('Project not found for admin:', id);
        navigate('/dashboard');
      }
    }
  }, [id, projects, setCurrentProject, navigate, updateTheme]);

  const handleSave = async () => {
    if (!currentProject) return;

    setIsSaving(true);

    try {
      const updatedProject = {
        ...currentProject,
        name: editForm.name,
        description: editForm.description,
        websiteUrl: editForm.websiteUrl,
        category: editForm.category,
        seoKeywords: editForm.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
        logo: editForm.logo,
        favicon: editForm.favicon,
      };

      updateProject(currentProject.id, updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = () => {
    if (!currentProject) return;

    const newStatus = !currentProject.isPublished;
    updateProject(currentProject.id, { isPublished: newStatus });

    if (newStatus) {
      alert('🎉 Website published successfully!');
    } else {
      alert('📝 Website unpublished and moved to draft.');
    }
  };

  const handleCopyUrl = () => {
    if (currentProject) {
      const url = `${import.meta.env.VITE_USER_SITE_BASE_URL}/${currentProject.websiteUrl}`;
      navigator.clipboard.writeText(url);
      alert('Website URL copied to clipboard!');
    }
  };

  const handleDeleteProject = () => {
    if (currentProject && window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // In a real app, you would call deleteProject from context
      alert('Project deleted successfully');
      navigate('/dashboard');
    }
  };

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Live
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        Draft
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'technical', label: 'Technical', icon: Monitor },
  ];

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin panel...</p>
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
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">{currentProject.name}</h1>
                    {getStatusBadge(currentProject.isPublished)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-primary">
                      {import.meta.env.VITE_USER_SITE_BASE_URL?.replace(/^https?:\/\//, '')}/{currentProject.websiteUrl}
                    </span>
                    <span className="font-primary">•</span>
                    <span className="font-primary">Created {formatRelativeTime(currentProject.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentProject.isPublished && (
                <button
                  onClick={() => window.open(`/site/${currentProject.websiteUrl}`, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                >
                  <Eye className="w-4 h-4" />
                  View Site
                </button>
              )}

              <button
                onClick={() => navigate(`/editor/${currentProject.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === id
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsData.totalViews}</div>
                    <div className="text-sm text-gray-600 font-primary">Total Views</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsData.uniqueVisitors}</div>
                    <div className="text-sm text-gray-600 font-primary">Unique Visitors</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{Math.floor(analyticsData.avgSessionDuration / 60)}m {analyticsData.avgSessionDuration % 60}s</div>
                    <div className="text-sm text-gray-600 font-primary">Avg. Session</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{currentProject.sections.length}</div>
                    <div className="text-sm text-gray-600 font-primary">Sections</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 font-heading">Site Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary">{currentProject.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Description</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary">{currentProject.description || 'No description'}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website URL</label>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.websiteUrl}
                          onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                        />
                      ) : (
                        <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl font-mono">{currentProject.websiteUrl}</div>
                      )}
                      <button
                        onClick={handleCopyUrl}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category</label>
                    {isEditing ? (
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="business">Business</option>
                        <option value="personal">Personal</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="education">Education</option>
                        <option value="photography">Photography</option>
                        <option value="music">Music</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="automotive">Automotive</option>
                        <option value="realestate">Real Estate</option>
                        <option value="gaming">Gaming</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary capitalize">{currentProject.category}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">SEO Keywords</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.seoKeywords}
                        onChange={(e) => setEditForm({ ...editForm, seoKeywords: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary">
                        {currentProject.seoKeywords.length > 0 ? currentProject.seoKeywords.join(', ') : 'No keywords set'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Created</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary text-sm">
                        {currentProject.createdAt.toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Last Updated</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl font-primary text-sm">
                        {formatRelativeTime(currentProject.updatedAt)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Status</label>
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                      {getStatusBadge(currentProject.isPublished)}
                      <button
                        onClick={handleTogglePublish}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentProject.isPublished
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                      >
                        {currentProject.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate(`/editor/${currentProject.id}`)}
                  className="flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="font-medium font-primary">Edit Website</span>
                </button>

                <button
                  onClick={() => navigate(`/preview/${currentProject.id}`)}
                  className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span className="font-medium font-primary">Preview</span>
                </button>

                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium font-primary">Share</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium font-primary">Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">+12.5%</div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 font-heading">{analyticsData.totalViews}</div>
                <div className="text-sm text-gray-600 font-primary">Total Views</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">+8.3%</div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 font-heading">{analyticsData.uniqueVisitors}</div>
                <div className="text-sm text-gray-600 font-primary">Unique Visitors</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-red-600 text-sm font-medium">-2.1%</div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 font-heading">{Math.floor(analyticsData.avgSessionDuration / 60)}m {analyticsData.avgSessionDuration % 60}s</div>
                <div className="text-sm text-gray-600 font-primary">Avg. Session</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">-5.2%</div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 font-heading">{analyticsData.bounceRate}%</div>
                <div className="text-sm text-gray-600 font-primary">Bounce Rate</div>
              </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Top Pages</h3>
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center text-xs font-bold text-primary-600">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 font-primary">{page.page}</span>
                      </div>
                      <span className="text-gray-600 font-primary">{page.views} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Traffic Sources</h3>
                <div className="space-y-3">
                  {analyticsData.trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 font-primary">{source.source}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 font-primary w-12 text-right">{source.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Types */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Device Types</h3>
                <div className="space-y-3">
                  {analyticsData.deviceTypes.map((device) => {
                    const Icon = device.device === 'Desktop' ? Monitor : device.device === 'Mobile' ? Smartphone : Tablet;
                    return (
                      <div key={device.device} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900 font-primary">{device.device}</span>
                        </div>
                        <span className="text-gray-600 font-primary">{device.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Recent Visits</h3>
                <div className="space-y-3">
                  {analyticsData.recentVisits.map((visit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900 font-primary">{visit.page}</div>
                        <div className="text-xs text-gray-600 font-primary">{visit.userAgent}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 font-primary">{formatRelativeTime(visit.timestamp)}</div>
                        <div className="text-xs text-gray-500 font-primary">{visit.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Domain Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Domain & Publishing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Current URL</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <span className="flex-1 font-mono text-gray-900">
                      {import.meta.env.VITE_USER_SITE_BASE_URL}/{currentProject.websiteUrl}
                    </span>
                    <button
                      onClick={handleCopyUrl}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Custom Domain</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="yourdomain.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                    />
                    <button className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-primary">
                    Connect your custom domain to make your site accessible at your own URL.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">SSL Certificate</div>
                    <div className="text-sm text-gray-600 font-primary">Secure your site with HTTPS</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium font-primary">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">SEO Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Meta Title</label>
                  <input
                    type="text"
                    defaultValue={currentProject.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Meta Description</label>
                  <textarea
                    defaultValue={currentProject.description}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Keywords</label>
                  <input
                    type="text"
                    defaultValue={currentProject.seoKeywords.join(', ')}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Open Graph Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                    />
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Upload className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
              <h2 className="text-xl font-semibold text-red-900 mb-6 font-heading">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <div className="font-medium text-red-900 font-primary">Archive Website</div>
                    <div className="text-sm text-red-600 font-primary">Hide this website from public view</div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium font-primary">
                    Archive
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <div className="font-medium text-red-900 font-primary">Delete Website</div>
                    <div className="text-sm text-red-600 font-primary">Permanently delete this website and all its data</div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium font-primary"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Technical Tab */}
        {activeTab === 'technical' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{technicalStatus.uptime}%</div>
                    <div className="text-sm text-gray-600 font-primary">Uptime</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">{technicalStatus.responseTime}ms</div>
                    <div className="text-sm text-gray-600 font-primary">Response Time</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">SSL</div>
                    <div className="text-sm text-green-600 font-primary">Active</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 font-heading">Last Check</div>
                    <div className="text-sm text-gray-600 font-primary">{formatRelativeTime(technicalStatus.lastChecked)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Audit Scores */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">SEO Audit Scores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(technicalStatus.seoScore).map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500'}
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={`${score}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900 font-heading">{score}</span>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900 capitalize font-primary">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">System Status</h2>
              
              <div className="space-y-4">
                {technicalStatus.errors.length === 0 && technicalStatus.warnings.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium font-primary">All systems operational</span>
                  </div>
                ) : (
                  <>
                    {technicalStatus.errors.map((error, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-primary">{error}</span>
                      </div>
                    ))}
                    
                    {technicalStatus.warnings.map((warning, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-700 font-primary">{warning}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Technical Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">Server Status</span>
                    </div>
                    <span className="text-green-600 font-medium font-primary">Online</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">Database</span>
                    </div>
                    <span className="text-green-600 font-medium font-primary">Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">CDN</span>
                    </div>
                    <span className="text-green-600 font-medium font-primary">Active</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">Storage Used</span>
                    </div>
                    <span className="text-gray-600 font-primary">2.3 MB</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">CPU Usage</span>
                    </div>
                    <span className="text-gray-600 font-primary">12%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <MemoryStick className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900 font-primary">Memory Usage</span>
                    </div>
                    <span className="text-gray-600 font-primary">45 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">Delete Website</h3>
              <p className="text-gray-600 font-primary">
                Are you sure you want to delete "{currentProject.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SiteAdmin;