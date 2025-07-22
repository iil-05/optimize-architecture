import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Heart, 
  Coins, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Chrome, 
  Eye, 
  Activity,
  Clock,
  Calendar,
  TrendingUp,
  MousePointer,
  Zap,
  Target,
  Timer,
  Maximize,
  Wifi,
  Settings,
  Edit,
  Save,
  Trash2,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Download,
  Share2,
  Tag,
  Search,
  FileText,
  Image,
  Link as LinkIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';
import { useProject } from '../contexts/ProjectContext';
import { optimizedStorage, AnalyticsSummary } from '../utils/optimizedStorage';

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProject();
  const [project, setProject] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30>(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'engagement' | 'settings'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings form state
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    category: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    isPublished: false
  });

  useEffect(() => {
    if (id) {
      // Find project
      let foundProject = projects.find(p => p.id === id);
      
      if (!foundProject) {
        const allStoredProjects = optimizedStorage.getAllProjects();
        foundProject = allStoredProjects.find(p => p.id === id);
      }

      if (foundProject) {
        setProject(foundProject);
        setSettings({
          name: foundProject.name,
          description: foundProject.description || '',
          websiteUrl: foundProject.websiteUrl,
          category: foundProject.category,
          seoTitle: foundProject.seo?.title || foundProject.name,
          seoDescription: foundProject.seo?.description || foundProject.description || '',
          seoKeywords: foundProject.seoKeywords?.join(', ') || '',
          isPublished: foundProject.isPublished
        });
        
        // Load real analytics data
        const analyticsData = optimizedStorage.getAnalyticsSummary(id, timeRange);
        setAnalytics(analyticsData);
      }
      
      setIsLoading(false);
    }
  }, [id, projects, timeRange]);

  const handleSaveSettings = async () => {
    if (!project) return;
    
    setIsSaving(true);
    try {
      const updatedProject = {
        ...project,
        name: settings.name,
        description: settings.description,
        websiteUrl: settings.websiteUrl,
        category: settings.category,
        seoKeywords: settings.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
        isPublished: settings.isPublished,
        seo: {
          ...project.seo,
          title: settings.seoTitle,
          description: settings.seoDescription
        }
      };

      updateProject(project.id, updatedProject);
      setProject(updatedProject);
      setIsEditing(false);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = () => {
    if (!project) return;
    
    deleteProject(project.id);
    navigate('/dashboard');
  };

  const handleUnpublish = () => {
    if (!project) return;
    
    updateProject(project.id, { isPublished: false });
    setProject({ ...project, isPublished: false });
    setSettings({ ...settings, isPublished: false });
  };

  const handleCopyUrl = () => {
    const url = `${import.meta.env.VITE_USER_SITE_BASE_URL}/${project.websiteUrl}`;
    navigator.clipboard.writeText(url);
    alert('Website URL copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Chart colors
  const colors = {
    primary: '#ef4444',
    secondary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    orange: '#f97316',
    emerald: '#059669',
    violet: '#7c3aed',
    teal: '#14b8a6'
  };

  // Device icons mapping
  const deviceIcons = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet
  };

  // Browser icons mapping
  const browserIcons = {
    Chrome: Chrome,
    Firefox: Wifi,
    Safari: Globe,
    Edge: Globe,
    Opera: Globe,
    Other: Globe
  };

  // Prepare chart data
  const deviceChartData = analytics?.deviceStats.map(stat => ({
    name: stat.device,
    value: stat.count,
    percentage: stat.percentage
  })) || [];

  const browserChartData = analytics?.browserStats.map(stat => ({
    name: stat.browser,
    value: stat.count,
    percentage: stat.percentage
  })) || [];

  const osChartData = analytics?.osStats.map(stat => ({
    name: stat.os,
    value: stat.count,
    percentage: stat.percentage
  })) || [];

  const hourlyChartData = analytics?.hourlyStats.map(stat => ({
    hour: `${stat.hour}:00`,
    visits: stat.visits,
    uniqueVisitors: stat.uniqueVisitors
  })) || [];

  const dailyChartData = analytics?.dailyStats.slice(-7).map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: stat.visits,
    uniqueVisitors: stat.uniqueVisitors,
    likes: stat.likes
  })) || [];

  const resolutionChartData = analytics?.screenResolutionStats.slice(0, 5).map(stat => ({
    name: stat.resolution,
    value: stat.count
  })) || [];

  // Performance metrics for radial chart
  const performanceData = [
    {
      name: 'Load Time',
      value: analytics?.averageLoadTime ? Math.max(0, 100 - (analytics.averageLoadTime / 50)) : 0,
      fill: colors.success
    },
    {
      name: 'Bounce Rate',
      value: analytics?.bounceRate ? 100 - analytics.bounceRate : 100,
      fill: colors.warning
    },
    {
      name: 'Engagement',
      value: analytics?.pagesPerSession ? Math.min(100, analytics.pagesPerSession * 25) : 0,
      fill: colors.purple
    }
  ];

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'traffic', label: 'Traffic', icon: TrendingUp },
    { id: 'engagement', label: 'Engagement', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 font-heading">{project.name} - Admin Panel</h1>
                  <p className="text-sm text-gray-600 font-primary">Manage your website and view analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeTab !== 'settings' && (
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
              )}

              {project.isPublished && (
                <a
                  href={`/site/${project.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
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
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === id
                  ? 'bg-white text-primary-600 shadow-sm'
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
            className="space-y-8"
          >
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-blue-900 font-heading mb-1">{analytics?.totalVisits || 0}</h3>
                <p className="text-sm text-blue-700 font-medium font-primary">Total Visits</p>
                <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Users className="w-5 h-5 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-green-900 font-heading mb-1">{analytics?.uniqueVisitors || 0}</h3>
                <p className="text-sm text-green-700 font-medium font-primary">Unique Visitors</p>
                <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg border border-red-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-red-900 font-heading mb-1">{analytics?.totalLikes || 0}</h3>
                <p className="text-sm text-red-700 font-medium font-primary">Likes</p>
                <div className="mt-3 w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <Coins className="w-5 h-5 text-yellow-600 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-yellow-900 font-heading mb-1">{analytics?.totalCoins || 0}</h3>
                <p className="text-sm text-yellow-700 font-medium font-primary">Coins Donated</p>
                <div className="mt-3 w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
                </div>
              </motion.div>
            </div>

            {/* Daily Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Daily Activity Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    fill={colors.primary}
                    fillOpacity={0.3}
                    stroke={colors.primary}
                    strokeWidth={3}
                    name="Total Visits"
                  />
                  <Bar dataKey="uniqueVisitors" fill={colors.secondary} radius={[4, 4, 0, 0]} name="Unique Visitors" />
                  <Line type="monotone" dataKey="likes" stroke={colors.success} strokeWidth={3} name="Likes" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Performance Metrics</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Key Performance Indicators</h3>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Average Load Time', value: `${analytics?.averageLoadTime || 0}ms`, percentage: 85, color: 'emerald' },
                    { label: 'Total Page Views', value: analytics?.totalPageViews || 0, percentage: 70, color: 'blue' },
                    { label: 'Pages Per Session', value: (analytics?.pagesPerSession || 0).toFixed(1), percentage: 60, color: 'purple' },
                    { label: 'Bounce Rate', value: formatPercentage(analytics?.bounceRate || 0), percentage: 40, color: 'orange' },
                  ].map((metric, index) => (
                    <motion.div 
                      key={metric.label} 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-900 font-primary">{metric.label}</span>
                        <span className="text-base text-gray-600 font-primary font-semibold">{metric.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${metric.percentage}%`,
                            backgroundColor: metric.color === 'emerald' ? colors.emerald : 
                                           metric.color === 'blue' ? colors.secondary :
                                           metric.color === 'purple' ? colors.purple : colors.orange
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hourly Traffic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Hourly Traffic Pattern</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stackId="1"
                    stroke={colors.primary} 
                    fill={colors.primary}
                    fillOpacity={0.6}
                    strokeWidth={2}
                    name="Total Visits"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stackId="2"
                    stroke={colors.secondary} 
                    fill={colors.secondary}
                    fillOpacity={0.6}
                    strokeWidth={2}
                    name="Unique Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Device and Browser Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Device Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[colors.primary, colors.secondary, colors.success][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Browser Usage</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={browserChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Bar dataKey="value" fill={colors.purple} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Operating Systems */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Operating Systems</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osChartData.map((os, index) => {
                  const percentage = os.percentage || 0;
                  return (
                    <motion.div 
                      key={os.name} 
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-medium text-gray-900 font-primary">{os.name}</span>
                        <span className="text-base text-gray-600 font-primary font-semibold">{os.value} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.purple][index % 5]
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200 text-center"
              >
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-orange-900 font-heading mb-2">
                  {formatPercentage(analytics?.bounceRate || 0)}
                </h3>
                <p className="text-base text-orange-700 font-primary mb-4">Bounce Rate</p>
                <div className="w-full bg-orange-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${analytics?.bounceRate || 0}%` }}
                  />
                </div>
                <p className="text-sm text-orange-700 font-primary">
                  {analytics?.bounceRate && analytics.bounceRate < 40 ? 'Excellent engagement!' : 
                   analytics?.bounceRate && analytics.bounceRate < 60 ? 'Good engagement' : 
                   'Room for improvement'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 text-center"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-blue-900 font-heading mb-2">
                  {analytics?.totalPageViews || 0}
                </h3>
                <p className="text-base text-blue-700 font-primary mb-4">Total Page Views</p>
                <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: '80%' }}
                  />
                </div>
                <p className="text-sm text-blue-700 font-primary">
                  {(analytics?.pagesPerSession || 0).toFixed(1)} pages per session
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 text-center"
              >
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-purple-900 font-heading mb-2">
                  {formatDuration(analytics?.averageSessionDuration || 0)}
                </h3>
                <p className="text-base text-purple-700 font-primary mb-4">Avg. Session Duration</p>
                <div className="w-full bg-purple-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-sm text-purple-700 font-primary">
                  {analytics?.averageSessionDuration && analytics.averageSessionDuration > 180 ? 'Highly engaged users!' : 
                   analytics?.averageSessionDuration && analytics.averageSessionDuration > 60 ? 'Good engagement' : 
                   'Users need more engagement'}
                </p>
              </motion.div>
            </div>

            {/* Screen Resolution Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Maximize className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Screen Resolutions</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resolutionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="value" fill={colors.teal} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Most Interacted Sections</h3>
              </div>
              <div className="space-y-4">
                {analytics?.topSections.map((section, index) => (
                  <motion.div
                    key={section.sectionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900 font-primary">{section.sectionId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-primary">{section.interactions} interactions</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (section.interactions / Math.max(...analytics.topSections.map(s => s.interactions))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Website Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Website Settings</h3>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium font-primary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Settings
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 font-heading">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Description</label>
                    <textarea
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none font-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website URL</label>
                    <div className="flex items-center">
                      <span className="px-3 py-3 bg-gray-100 text-gray-600 rounded-l-xl border border-r-0 border-gray-300 text-sm font-mono">
                        {import.meta.env.VITE_USER_SITE_BASE_URL?.replace(/^https?:\/\//, '') || 'localhost:5173/site'}/
                      </span>
                      <input
                        type="text"
                        value={settings.websiteUrl}
                        onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                        disabled={!isEditing}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category</label>
                    <select
                      value={settings.category}
                      onChange={(e) => setSettings({ ...settings, category: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
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
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 font-heading">SEO Settings</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">SEO Title</label>
                    <input
                      type="text"
                      value={settings.seoTitle}
                      onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                      placeholder="Enter SEO title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">SEO Description</label>
                    <textarea
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none font-primary"
                      placeholder="Enter SEO description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">SEO Keywords</label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-sm text-gray-500 mt-1 font-primary">Separate keywords with commas</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 font-primary">Published Status</div>
                      <div className="text-sm text-gray-600 font-primary">Make your website visible to the public</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, isPublished: !settings.isPublished })}
                      disabled={!isEditing}
                      className={`w-12 h-6 rounded-full transition-colors ${settings.isPublished ? 'bg-primary-600' : 'bg-gray-300'} ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.isPublished ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium font-primary">Edit Website</div>
                    <div className="text-sm font-primary">Make changes to your site</div>
                  </div>
                </button>

                {project.isPublished && (
                  <>
                    <a
                      href={`/site/${project.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium font-primary">View Live Site</div>
                        <div className="text-sm font-primary">See your published website</div>
                      </div>
                    </a>

                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Copy className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium font-primary">Copy URL</div>
                        <div className="text-sm font-primary">Share your website link</div>
                      </div>
                    </button>

                    <button
                      onClick={handleUnpublish}
                      className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium font-primary">Unpublish</div>
                        <div className="text-sm font-primary">Make site private</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-6 font-heading">Danger Zone</h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    optimizedStorage.clearAnalyticsForProject(project.id);
                    window.location.reload();
                  }}
                  className="flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 w-full"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium font-primary">Reset Analytics</div>
                    <div className="text-sm font-primary">Clear all analytics data for this website</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all hover:scale-105 w-full"
                >
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium font-primary">Delete Website</div>
                    <div className="text-sm font-primary">Permanently delete this website and all its data</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">Delete Website</h3>
              <p className="text-gray-600 font-primary">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently delete all website data and analytics.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                Delete Website
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SiteAdmin;