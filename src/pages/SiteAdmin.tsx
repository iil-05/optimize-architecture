import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Languages,
  Maximize,
  Wifi
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
  Legend
} from 'recharts';
import { useProject } from '../contexts/ProjectContext';
import { optimizedStorage, AnalyticsSummary } from '../utils/optimizedStorage';

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProject();
  const [project, setProject] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30>(30);

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
        
        // Load analytics
        const analyticsData = optimizedStorage.getAnalyticsSummary(id, timeRange);
        setAnalytics(analyticsData);
      }
      
      setIsLoading(false);
    }
  }, [id, projects, timeRange]);

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
    violet: '#7c3aed'
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

  const languageChartData = analytics?.languageStats.slice(0, 5).map(stat => ({
    name: stat.language,
    value: stat.count
  })) || [];

  const resolutionChartData = analytics?.screenResolutionStats.slice(0, 5).map(stat => ({
    name: stat.resolution,
    value: stat.count
  })) || [];

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
                  <h1 className="text-xl font-bold text-gray-900 font-heading">{project.name} - Analytics</h1>
                  <p className="text-sm text-gray-600 font-primary">Real-time website insights</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards - Enhanced with 10+ statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Visits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{analytics?.totalVisits || 0}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Total Visits</p>
          </motion.div>

          {/* Unique Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{analytics?.uniqueVisitors || 0}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Unique Visitors</p>
          </motion.div>

          {/* Likes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{analytics?.totalLikes || 0}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Likes</p>
          </motion.div>

          {/* Coins Donated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-600" />
              </div>
              <Coins className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{analytics?.totalCoins || 0}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Coins Donated</p>
          </motion.div>

          {/* Average Session Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <Timer className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-heading">
              {formatDuration(analytics?.averageSessionDuration || 0)}
            </h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Avg. Session</p>
          </motion.div>

          {/* Bounce Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <Activity className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{formatPercentage(analytics?.bounceRate || 0)}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Bounce Rate</p>
          </motion.div>

          {/* Total Page Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <Eye className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{analytics?.totalPageViews || 0}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Page Views</p>
          </motion.div>

          {/* Pages Per Session */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-indigo-600" />
              </div>
              <Zap className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">{(analytics?.pagesPerSession || 0).toFixed(1)}</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Pages/Session</p>
          </motion.div>

          {/* Average Load Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">{analytics?.averageLoadTime || 0}ms</h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Avg. Load Time</p>
          </motion.div>

          {/* Top Section Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-violet-600" />
              </div>
              <Target className="w-4 h-4 text-violet-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading">
              {analytics?.topSections.reduce((sum, section) => sum + section.interactions, 0) || 0}
            </h3>
            <p className="text-xs text-gray-500 font-medium font-primary">Interactions</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Visits Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Daily Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyChartData}>
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
                  stackId="1"
                  stroke={colors.primary} 
                  fill={colors.primary}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Total Visits"
                />
                <Area 
                  type="monotone" 
                  dataKey="uniqueVisitors" 
                  stackId="2"
                  stroke={colors.secondary} 
                  fill={colors.secondary}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Unique Visitors"
                />
                <Area 
                  type="monotone" 
                  dataKey="likes" 
                  stackId="3"
                  stroke={colors.success} 
                  fill={colors.success}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Likes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Hourly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Hourly Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyChartData}>
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
                <Bar dataKey="visits" fill={colors.secondary} radius={[4, 4, 0, 0]} name="Visits" />
                <Bar dataKey="uniqueVisitors" fill={colors.purple} radius={[4, 4, 0, 0]} name="Unique Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Device, Browser, and OS Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Device Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Devices</h3>
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
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {deviceChartData.map((stat, index) => {
                const IconComponent = deviceIcons[stat.name as keyof typeof deviceIcons] || Monitor;
                return (
                  <div key={stat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 font-primary">{stat.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-primary">{stat.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Browser Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Browsers</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browserChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={60} />
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

          {/* Operating System Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Operating Systems</h3>
            </div>
            <div className="space-y-4">
              {osChartData.map((os, index) => {
                const percentage = os.percentage || 0;
                return (
                  <div key={os.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 font-primary">{os.name}</span>
                      <span className="text-sm text-gray-600 font-primary">{os.value} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.purple][index % 5]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Language Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Languages className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Languages</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={languageChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[colors.indigo, colors.pink, colors.emerald, colors.orange, colors.violet][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Screen Resolution Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Maximize className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Screen Resolutions</h3>
            </div>
            <div className="space-y-4">
              {resolutionChartData.map((resolution, index) => {
                const total = resolutionChartData.reduce((sum, item) => sum + item.value, 0);
                const percentage = total > 0 ? Math.round((resolution.value / total) * 100) : 0;
                return (
                  <div key={resolution.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 font-primary">{resolution.name}</span>
                      <span className="text-sm text-gray-600 font-primary">{resolution.value} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: [colors.pink, colors.indigo, colors.emerald, colors.orange, colors.violet][index % 5]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Top Sections Interactions */}
        {analytics?.topSections && analytics.topSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MousePointer className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900 font-heading">Top Section Interactions</h3>
            </div>
            <div className="space-y-3">
              {analytics.topSections.map((section, index) => (
                <div key={section.sectionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-600">#{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900 font-primary">{section.sectionId}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-primary">{section.interactions} interactions</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate(`/editor/${project.id}`)}
              className="flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium font-primary">Edit Website</div>
                <div className="text-sm font-primary">Make changes to your site</div>
              </div>
            </button>

            {project.isPublished && (
              <a
                href={`/site/${project.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium font-primary">View Live Site</div>
                  <div className="text-sm font-primary">See your published website</div>
                </div>
              </a>
            )}

            <button
              onClick={() => {
                optimizedStorage.clearAnalyticsForProject(project.id);
                window.location.reload();
              }}
              className="flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium font-primary">Reset Analytics</div>
                <div className="text-sm font-primary">Clear all analytics data</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SiteAdmin;