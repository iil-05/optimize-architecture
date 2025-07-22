import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Users,
  Heart,
  Coins,
  TrendingUp,
  Monitor,
  Clock,
  Eye,
  Settings,
  Activity,
  Globe,
  Edit3,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Building,
  Tag,
  Search,
  Image,
  Link as LinkIcon,
  Smartphone,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  User,
  Briefcase,
  ShoppingBag
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { optimizedStorage } from '../utils/optimizedStorage';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types';

// Memoized chart components for better performance
const MemoizedAreaChart = React.memo(AreaChart);
const MemoizedBarChart = React.memo(BarChart);
const MemoizedPieChart = React.memo(PieChart);

interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalLikes: number;
  totalCoins: number;
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  browserStats: Array<{ browser: string; count: number; percentage: number }>;
  dailyStats: Array<{ date: string; visits: number; uniqueVisitors: number }>;
  hourlyStats: Array<{ hour: number; visits: number }>;
}

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useProject();
  const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state for settings
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    category: '',
    seoKeywords: '',
    logo: '',
    favicon: '',
    isPublished: false
  });

  // Website categories
  const categories = [
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

  // Memoized chart colors to prevent recreation
  const COLORS = useMemo(() => ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'], []);

  // Optimized data loading
  const loadData = useCallback(async () => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    try {
      const foundProject = optimizedStorage.getProject(id);
      if (!foundProject) {
        navigate('/dashboard');
        return;
      }

      setProject(foundProject);
      
      // Initialize form data
      setFormData({
        name: foundProject.name,
        description: foundProject.description || '',
        websiteUrl: foundProject.websiteUrl,
        category: foundProject.category,
        seoKeywords: foundProject.seoKeywords.join(', '),
        logo: foundProject.logo || '',
        favicon: foundProject.favicon || '',
        isPublished: foundProject.isPublished
      });
      
      // Load analytics efficiently
      const analyticsData = optimizedStorage.getAnalyticsSummary(id);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoized chart data for performance
  const chartData = useMemo(() => {
    if (!analytics) return null;

    const days = timeRange === '7d' ? 7 : 30;
    const dailyData = analytics.dailyStats.slice(-days);

    return {
      daily: dailyData,
      hourly: analytics.hourlyStats,
      devices: analytics.deviceStats,
      browsers: analytics.browserStats
    };
  }, [analytics, timeRange]);

  // Memoized stats cards data
  const statsCards = useMemo(() => [
    {
      title: 'Total Visits',
      value: analytics?.totalVisits.toLocaleString() || '0',
      icon: Eye,
      color: 'bg-primary-100 text-primary-600'
    },
    {
      title: 'Unique Visitors',
      value: analytics?.uniqueVisitors.toLocaleString() || '0',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Likes',
      value: analytics?.totalLikes.toLocaleString() || '0',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Total Coins',
      value: analytics?.totalCoins.toLocaleString() || '0',
      icon: Coins,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ], [analytics]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!project) return;

    setIsSaving(true);
    try {
      const seoKeywords = formData.seoKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      const updatedProject = {
        ...project,
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        category: formData.category,
        seoKeywords,
        logo: formData.logo,
        favicon: formData.favicon,
        isPublished: formData.isPublished,
        updatedAt: new Date()
      };

      await updateProject(project.id, updatedProject);
      setProject(updatedProject);
      setIsEditing(false);
      
      // Show success message
      alert('Website settings updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update website settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWebsite = async () => {
    if (!project) return;

    try {
      await deleteProject(project.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete website. Please try again.');
    }
  };

  const handleUnpublish = async () => {
    if (!project) return;

    try {
      const updatedProject = {
        ...project,
        isPublished: false,
        publishUrl: undefined,
        updatedAt: new Date()
      };

      await updateProject(project.id, updatedProject);
      setProject(updatedProject);
      setFormData(prev => ({ ...prev, isPublished: false }));
      
      alert('Website unpublished successfully!');
    } catch (error) {
      console.error('Error unpublishing website:', error);
      alert('Failed to unpublish website. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview Analytics', icon: BarChart3 },
    { id: 'detailed', label: 'Detailed Analytics', icon: Activity },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!project || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{project.name} - Admin Panel</h1>
                  <p className="text-sm text-gray-600">Website management dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeTab !== 'settings' && (
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d')}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              )}

              {project.isPublished && (
                <a
                  href={`/site/${project.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Analytics Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Visits Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Daily Visits</h3>
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <MemoizedAreaChart data={chartData?.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </MemoizedAreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detailed Analytics Tab */}
        {activeTab === 'detailed' && (
          <div className="space-y-8">
            {/* Hourly Traffic Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hourly Traffic</h3>
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <MemoizedBarChart data={chartData?.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    labelFormatter={(value) => `${value}:00`}
                  />
                  <Bar 
                    dataKey="visits" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                  />
                </MemoizedBarChart>
              </ResponsiveContainer>
            </div>

            {/* Device and Browser Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Device Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
                  <Monitor className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="60%" height={200}>
                    <MemoizedPieChart>
                      <Pie
                        data={chartData?.devices}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {chartData?.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </MemoizedPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {chartData?.devices.map((device, index) => (
                      <div key={device.device} className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{device.device}</p>
                          <p className="text-xs text-gray-600">{device.count} ({device.percentage}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Browser Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Browser Usage</h3>
                  <Monitor className="w-5 h-5 text-primary-600" />
                </div>
                <div className="space-y-4">
                  {chartData?.browsers.map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900">{browser.browser}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${browser.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {browser.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Website Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Website Configuration</h3>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Settings
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Website Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{formData.name}</p>
                  )}
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <span className="px-3 py-3 bg-gray-100 text-gray-600 rounded-l-xl border border-r-0 border-gray-300 text-sm">
                        /site/
                      </span>
                      <input
                        type="text"
                        value={formData.websiteUrl}
                        onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 py-3">/site/{formData.websiteUrl}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  {isEditing ? (
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3 capitalize">{formData.category}</p>
                  )}
                </div>

                {/* Publication Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Status</label>
                  {isEditing ? (
                    <div className="flex items-center gap-4 py-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={() => handleFormChange('isPublished', true)}
                          className="mr-2"
                        />
                        Published
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublished"
                          checked={!formData.isPublished}
                          onChange={() => handleFormChange('isPublished', false)}
                          className="mr-2"
                        />
                        Draft
                      </label>
                    </div>
                  ) : (
                    <div className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        formData.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formData.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Enter website description..."
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{formData.description || 'No description'}</p>
                  )}
                </div>

                {/* SEO Keywords */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.seoKeywords}
                      onChange={(e) => handleFormChange('seoKeywords', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{formData.seoKeywords || 'No keywords'}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleFormChange('logo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/logo.png"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{formData.logo || 'No logo'}</p>
                  )}
                </div>

                {/* Favicon URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.favicon}
                      onChange={(e) => handleFormChange('favicon', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/favicon.ico"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{formData.favicon || 'No favicon'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Website Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Website Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Edit Website */}
                <button
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Edit Website</div>
                    <div className="text-sm">Modify content and design</div>
                  </div>
                </button>

                {/* Unpublish Website */}
                {project.isPublished && (
                  <button
                    onClick={handleUnpublish}
                    className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Unpublish Website</div>
                      <div className="text-sm">Make website private</div>
                    </div>
                  </button>
                )}

                {/* Delete Website */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Delete Website</div>
                    <div className="text-sm">Permanently remove website</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Website Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Website Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Sections</p>
                  <p className="text-gray-900">{project.sections.length} sections</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Created</p>
                  <p className="text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
                  <p className="text-gray-900">{new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Theme</p>
                  <p className="text-gray-900">{project.themeId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Visits</p>
                  <p className="text-gray-900">{analytics.totalVisits.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Likes</p>
                  <p className="text-gray-900">{analytics.totalLikes.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Website</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently remove all data.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWebsite}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SiteAdmin);