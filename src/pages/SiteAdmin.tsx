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
  Settings
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
  const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');

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
                  <h1 className="text-xl font-bold text-gray-900">{project.name} - Analytics</h1>
                  <p className="text-sm text-gray-600">Website performance dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d')}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        {/* Website Info */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Website Information</h3>
            <Settings className="w-5 h-5 text-primary-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Website URL</p>
              <p className="text-gray-900 font-mono text-sm">{project.websiteUrl}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
              <p className="text-gray-900 capitalize">{project.category}</p>
            </div>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                project.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SiteAdmin);