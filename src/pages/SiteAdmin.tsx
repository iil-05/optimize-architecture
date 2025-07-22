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
        
        // Load real analytics data
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
        {/* Interactive Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {/* Total Visits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              {analytics && analytics.totalVisits > 0 ? (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-pulse" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 font-heading mb-1">{analytics?.totalVisits || 0}</h3>
            <p className="text-xs sm:text-sm text-blue-700 font-medium font-primary">Total Visits</p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
            </div>
          </motion.div>

          {/* Unique Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              {analytics && analytics.uniqueVisitors > 0 ? (
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 animate-pulse" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-900 font-heading mb-1">{analytics?.uniqueVisitors || 0}</h3>
            <p className="text-xs sm:text-sm text-green-700 font-medium font-primary">Unique Visitors</p>
            <div className="mt-2 w-full bg-green-200 rounded-full h-1">
              <div className="bg-green-500 h-1 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
            </div>
          </motion.div>

          {/* Likes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-red-200 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              {analytics && analytics.totalLikes > 0 ? (
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-red-900 font-heading mb-1">{analytics?.totalLikes || 0}</h3>
            <p className="text-xs sm:text-sm text-red-700 font-medium font-primary">Likes</p>
            <div className="mt-2 w-full bg-red-200 rounded-full h-1">
              <div className="bg-red-500 h-1 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
            </div>
          </motion.div>

          {/* Coins Donated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-yellow-200 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              {analytics && analytics.totalCoins > 0 ? (
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 animate-pulse" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-900 font-heading mb-1">{analytics?.totalCoins || 0}</h3>
            <p className="text-xs sm:text-sm text-yellow-700 font-medium font-primary">Coins Donated</p>
            <div className="mt-2 w-full bg-yellow-200 rounded-full h-1">
              <div className="bg-yellow-500 h-1 rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
            </div>
          </motion.div>

          {/* Average Session Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              {analytics && analytics.averageSessionDuration > 0 ? (
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-pulse" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 font-heading mb-1">
              {formatDuration(analytics?.averageSessionDuration || 0)}
            </h3>
            <p className="text-xs sm:text-sm text-purple-700 font-medium font-primary">Avg. Session</p>
            <div className="mt-2 w-full bg-purple-200 rounded-full h-1">
              <div className="bg-purple-500 h-1 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>
          </motion.div>

        </div>

        {/* Interactive Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Daily Visits Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Daily Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
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
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Hourly Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
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

        {/* Interactive Device, Browser, and OS Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Device Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Devices</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
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
            <div className="space-y-2 sm:space-y-3">
              {deviceChartData.map((stat, index) => {
                const IconComponent = deviceIcons[stat.name as keyof typeof deviceIcons] || Monitor;
                return (
                  <motion.div 
                    key={stat.name} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      <span className="text-sm sm:text-base font-medium text-gray-900 font-primary">{stat.name}</span>
                    </div>
                    <span className="text-sm sm:text-base text-gray-600 font-primary font-semibold">{stat.percentage}%</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Browser Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Browsers</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
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
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Operating Systems</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {osChartData.map((os, index) => {
                const percentage = os.percentage || 0;
                return (
                  <motion.div 
                    key={os.name} 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium text-gray-900 font-primary">{os.name}</span>
                      <span className="text-sm sm:text-base text-gray-600 font-primary font-semibold">{os.value} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
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
        </div>

        {/* Interactive Language Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Language Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Languages</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
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

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Performance Metrics</h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
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
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-medium text-gray-900 font-primary">{metric.label}</span>
                    <span className="text-sm sm:text-base text-gray-600 font-primary font-semibold">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
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

        {/* Interactive Bounce Rate and Page Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Bounce Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-orange-900 font-heading">Bounce Rate</h3>
                <p className="text-xs sm:text-sm text-orange-700 font-primary">Single page sessions</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-900 font-heading mb-2">
                {formatPercentage(analytics?.bounceRate || 0)}
              </div>
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
            </div>
          </motion.div>

          {/* Total Page Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 font-heading">Total Page Views</h3>
                <p className="text-xs sm:text-sm text-blue-700 font-primary">All page interactions</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-900 font-heading mb-2">
                {analytics?.totalPageViews || 0}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: '80%' }}
                />
              </div>
              <p className="text-sm text-blue-700 font-primary">
                {(analytics?.pagesPerSession || 0).toFixed(1)} pages per session
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interactive Load Time and Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Average Load Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-emerald-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-emerald-900 font-heading">Average Load Time</h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-primary">Page loading speed</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-900 font-heading mb-2">
                {analytics?.averageLoadTime ? `${analytics.averageLoadTime}ms` : '0ms'}
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: analytics?.averageLoadTime ? Math.min((3000 - (analytics.averageLoadTime || 0)) / 3000 * 100, 100) : 0 }}
                />
              </div>
              <p className="text-sm text-emerald-700 font-primary">
                {analytics?.averageLoadTime && analytics.averageLoadTime < 1000 ? 'Excellent speed!' : 
                 analytics?.averageLoadTime && analytics.averageLoadTime < 3000 ? 'Good performance' : 
                 'Could be faster'}
              </p>
            </div>
          </motion.div>

          {/* Pages Per Session */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-indigo-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-indigo-900 font-heading">Pages Per Session</h3>
                <p className="text-xs sm:text-sm text-indigo-700 font-primary">User engagement depth</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900 font-heading mb-2">
                {(analytics?.pagesPerSession || 0).toFixed(1)}
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((analytics?.pagesPerSession || 0) * 20, 100)}%` }}
                />
              </div>
              <p className="text-sm text-indigo-700 font-primary">
                {analytics?.pagesPerSession && analytics.pagesPerSession > 3 ? 'Highly engaged users!' : 
                 analytics?.pagesPerSession && analytics.pagesPerSession > 1.5 ? 'Good engagement' : 
                 'Users need more engagement'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {analytics?.dailyStats.slice(-5).map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base font-medium text-gray-900 font-primary">{day.date}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-primary">{day.visits} visits</span>
                  <span className="font-primary">{day.uniqueVisitors} unique</span>
                  <span className="font-primary">{day.likes} likes</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-pink-900 font-heading mb-2">
              {((analytics?.totalLikes || 0) / Math.max(analytics?.uniqueVisitors || 1, 1) * 100).toFixed(1)}%
            </h3>
            <p className="text-sm sm:text-base text-pink-700 font-primary">Like Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-cyan-200 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-900 font-heading mb-2">
              {((analytics?.uniqueVisitors || 0) / Math.max(analytics?.totalVisits || 1, 1) * 100).toFixed(1)}%
            </h3>
            <p className="text-sm sm:text-base text-cyan-700 font-primary">Return Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.9 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-violet-200 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-violet-900 font-heading mb-2">
              {((analytics?.totalCoins || 0) / Math.max(analytics?.uniqueVisitors || 1, 1)).toFixed(1)}
            </h3>
            <p className="text-sm sm:text-base text-violet-700 font-primary">Coins per Visitor</p>
          </motion.div>
        </div>

        {/* Removed sections: Top Section Interactions and Screen Resolution Statistics */}
        {/* These sections have been removed as requested */}

        {/* Enhanced Language Statistics with Interactive Elements */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-heading">Visitor Languages</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languageChartData.map((lang, index) => {
                const total = languageChartData.reduce((sum, item) => sum + item.value, 0);
                const percentage = total > 0 ? Math.round((lang.value / total) * 100) : 0;
                return (
                  <motion.div 
                    key={lang.name} 
                    className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium text-gray-900 font-primary">{lang.name}</span>
                      <span className="text-sm sm:text-base text-gray-600 font-primary font-semibold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: [colors.teal, colors.indigo, colors.emerald, colors.orange, colors.violet][index % 5]
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-heading">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate(`/editor/${project.id}`)}
              className="flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-all hover:scale-105"
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
                className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all hover:scale-105"
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
              className="flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all hover:scale-105"
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