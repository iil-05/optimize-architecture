import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BarChart3,
  Users,
  Globe,
  Eye,
  MousePointer,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Firefox,
  Safari,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Share2,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  Database,
  Shield,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Timer,
  Target,
  Award,
  Star,
  Heart,
  MessageSquare,
  Search,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Layers,
  Palette,
  Layout,
  Edit,
  Trash2,
  Plus,
  Copy,
  Save,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  Flag,
  Bookmark,
  Tag,
  Link,
  Maximize,
  Minimize,
  RotateCcw,
  Power,
  PlayCircle,
  PauseCircle,
  StopCircle,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { optimizedStorage } from '../utils/optimizedStorage';
import { analyticsStorage } from '../utils/analyticsStorage';
import CommonHeader from '../components/CommonHeader';

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topCountries: { country: string; visitors: number; percentage: number }[];
  topCities: { city: string; visitors: number; percentage: number }[];
  deviceTypes: { device: string; visitors: number; percentage: number }[];
  browsers: { browser: string; visitors: number; percentage: number }[];
  operatingSystems: { os: string; visitors: number; percentage: number }[];
  referrers: { referrer: string; visitors: number; percentage: number }[];
  topPages: { page: string; views: number; avgTime: number }[];
  hourlyViews: { hour: number; views: number; visitors: number }[];
  dailyViews: { date: string; views: number; visitors: number }[];
  conversions: { type: string; count: number; value: number }[];
  realTimeVisitors: number;
  performanceMetrics: {
    averageLoadTime: number;
    averageFirstContentfulPaint: number;
    totalResourceSize: number;
    averageEngagementScore: number;
  };
}

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, currentProject, setCurrentProject, updateProject } = useProject();

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'visitors' | 'performance' | 'content' | 'settings'>('overview');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '90days' | 'all'>('7days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('visitors');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        loadAnalyticsData(project.id);
      } else {
        console.log('Project not found for admin:', id);
        navigate('/dashboard');
      }
    }
  }, [id, projects, setCurrentProject, navigate]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !currentProject) return;

    const interval = setInterval(() => {
      loadAnalyticsData(currentProject.id);
      loadRealTimeData(currentProject.id);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, currentProject]);

  const loadAnalyticsData = async (projectId: string) => {
    setIsLoading(true);
    try {
      // Get analytics events from optimized storage
      const analyticsEvents = optimizedStorage.getAnalyticsForProject(projectId);
      
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'all':
          startDate = new Date(0);
          break;
      }

      // Filter events by date range
      const filteredEvents = analyticsEvents.filter(event => 
        new Date(event.timestamp) >= startDate
      );

      // Process analytics data
      const processedData = processAnalyticsEvents(filteredEvents);
      setAnalyticsData(processedData);
      
      console.log('📊 Analytics data loaded:', processedData);
    } catch (error) {
      console.error('❌ Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealTimeData = (projectId: string) => {
    // Get real-time data (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentEvents = optimizedStorage.getAnalyticsForProject(projectId)
      .filter(event => new Date(event.timestamp) >= fiveMinutesAgo);

    const realTime = {
      activeVisitors: new Set(recentEvents.filter(e => e.type === 'page_visit').map(e => e.data.visitorId)).size,
      recentEvents: recentEvents.slice(-10).reverse(),
      currentPages: recentEvents
        .filter(e => e.type === 'page_visit')
        .reduce((acc, event) => {
          const page = event.data.url || '/';
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
    };

    setRealTimeData(realTime);
  };

  const processAnalyticsEvents = (events: any[]): AnalyticsData => {
    // Group events by type
    const eventsByType = events.reduce((acc, event) => {
      if (!acc[event.type]) acc[event.type] = [];
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate basic metrics
    const pageVisits = eventsByType.page_visit || [];
    const uniqueVisitors = new Set(pageVisits.map(e => e.data.visitorId)).size;
    const totalVisitors = pageVisits.length;
    const pageViews = pageVisits.length;

    // Calculate session durations
    const sessionDurations = eventsByType.time_spent || [];
    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, e) => sum + (e.data.totalTime || 0), 0) / sessionDurations.length / 1000
      : 0;

    // Calculate bounce rate
    const engagementEvents = eventsByType.engagement_signal || [];
    const engagedSessions = new Set(engagementEvents.map(e => e.data.sessionId || e.data.visitorId)).size;
    const bounceRate = totalVisitors > 0 ? ((totalVisitors - engagedSessions) / totalVisitors) * 100 : 0;

    // Calculate conversion rate
    const conversions = eventsByType.conversion || [];
    const conversionRate = totalVisitors > 0 ? (conversions.length / totalVisitors) * 100 : 0;

    // Process geographic data
    const geoEvents = eventsByType.geographic_info || [];
    const countryStats = processCountryStats(geoEvents);
    const cityStats = processCityStats(geoEvents);

    // Process device data
    const deviceEvents = eventsByType.device_info || [];
    const deviceStats = processDeviceStats(deviceEvents);
    const browserStats = processBrowserStats(deviceEvents);
    const osStats = processOSStats(deviceEvents);

    // Process referrer data
    const referrerEvents = eventsByType.referrer_info || [];
    const referrerStats = processReferrerStats(referrerEvents);

    // Process page data
    const pageStats = processPageStats(pageVisits);

    // Process hourly/daily views
    const hourlyViews = processHourlyViews(pageVisits);
    const dailyViews = processDailyViews(pageVisits);

    // Process conversions
    const conversionStats = processConversions(conversions);

    // Process performance metrics
    const performanceEvents = eventsByType.page_performance || [];
    const performanceMetrics = processPerformanceMetrics(performanceEvents, engagementEvents);

    return {
      totalVisitors,
      uniqueVisitors,
      pageViews,
      averageSessionDuration,
      bounceRate,
      conversionRate,
      topCountries: countryStats,
      topCities: cityStats,
      deviceTypes: deviceStats,
      browsers: browserStats,
      operatingSystems: osStats,
      referrers: referrerStats,
      topPages: pageStats,
      hourlyViews,
      dailyViews,
      conversions: conversionStats,
      realTimeVisitors: realTimeData?.activeVisitors || 0,
      performanceMetrics,
    };
  };

  const processCountryStats = (events: any[]) => {
    const countryCount = events.reduce((acc, event) => {
      const country = event.data.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(countryCount)
      .map(([country, count]) => ({
        country,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  };

  const processCityStats = (events: any[]) => {
    const cityCount = events.reduce((acc, event) => {
      const city = `${event.data.city || 'Unknown'}, ${event.data.country || 'Unknown'}`;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(cityCount)
      .map(([city, count]) => ({
        city,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  };

  const processDeviceStats = (events: any[]) => {
    const deviceCount = events.reduce((acc, event) => {
      const device = event.data.deviceType || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(deviceCount)
      .map(([device, count]) => ({
        device,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  };

  const processBrowserStats = (events: any[]) => {
    const browserCount = events.reduce((acc, event) => {
      const browser = event.data.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(browserCount)
      .map(([browser, count]) => ({
        browser,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  };

  const processOSStats = (events: any[]) => {
    const osCount = events.reduce((acc, event) => {
      const os = event.data.os || 'Unknown';
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(osCount)
      .map(([os, count]) => ({
        os,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  };

  const processReferrerStats = (events: any[]) => {
    const referrerCount = events.reduce((acc, event) => {
      const referrer = event.data.referrerType === 'direct' ? 'Direct' : 
                     event.data.referrerDomain || event.data.referrer || 'Unknown';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = events.length;
    return Object.entries(referrerCount)
      .map(([referrer, count]) => ({
        referrer,
        visitors: count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  };

  const processPageStats = (events: any[]) => {
    const pageStats = events.reduce((acc, event) => {
      const page = event.data.url || '/';
      if (!acc[page]) {
        acc[page] = { views: 0, totalTime: 0 };
      }
      acc[page].views++;
      acc[page].totalTime += event.data.timeOnPage || 0;
      return acc;
    }, {} as Record<string, { views: number; totalTime: number }>);

    return Object.entries(pageStats)
      .map(([page, stats]) => ({
        page,
        views: stats.views,
        avgTime: Math.round(stats.totalTime / stats.views / 1000),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  };

  const processHourlyViews = (events: any[]) => {
    const hourlyData: Record<number, { views: number; visitors: Set<string> }> = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { views: 0, visitors: new Set() };
    }

    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyData[hour].views++;
      hourlyData[hour].visitors.add(event.data.visitorId);
    });

    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      views: data.views,
      visitors: data.visitors.size,
    }));
  };

  const processDailyViews = (events: any[]) => {
    const dailyData: Record<string, { views: number; visitors: Set<string> }> = {};

    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { views: 0, visitors: new Set() };
      }
      dailyData[date].views++;
      dailyData[date].visitors.add(event.data.visitorId);
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const processConversions = (events: any[]) => {
    const conversionStats = events.reduce((acc, event) => {
      const type = event.data.type || 'unknown';
      if (!acc[type]) {
        acc[type] = { count: 0, value: 0 };
      }
      acc[type].count++;
      acc[type].value += event.data.value || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return Object.entries(conversionStats)
      .map(([type, stats]) => ({
        type,
        count: stats.count,
        value: stats.value,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const processPerformanceMetrics = (performanceEvents: any[], engagementEvents: any[]) => {
    const avgLoadTime = performanceEvents.length > 0
      ? performanceEvents.reduce((sum, e) => sum + (e.data.totalLoadTime || 0), 0) / performanceEvents.length
      : 0;

    const avgFCP = performanceEvents.length > 0
      ? performanceEvents.reduce((sum, e) => sum + (e.data.firstContentfulPaint || 0), 0) / performanceEvents.length
      : 0;

    const totalResourceSize = performanceEvents.length > 0
      ? performanceEvents.reduce((sum, e) => sum + (e.data.totalResourceSize || 0), 0) / performanceEvents.length
      : 0;

    const avgEngagementScore = engagementEvents.length > 0
      ? engagementEvents.reduce((sum, e) => sum + (e.data.totalScore || 0), 0) / engagementEvents.length
      : 0;

    return {
      averageLoadTime: Math.round(avgLoadTime),
      averageFirstContentfulPaint: Math.round(avgFCP),
      totalResourceSize: Math.round(totalResourceSize / 1024), // Convert to KB
      averageEngagementScore: Math.round(avgEngagementScore),
    };
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      case 'desktop': return Monitor;
      default: return Monitor;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return Chrome;
      case 'firefox': return Firefox;
      case 'safari': return Safari;
      default: return Globe;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (previous === 0) return { icon: TrendingUp, color: 'text-green-600', text: 'New' };
    
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return { icon: TrendingUp, color: 'text-green-600', text: `+${change.toFixed(1)}%` };
    } else if (change < 0) {
      return { icon: TrendingDown, color: 'text-red-600', text: `${change.toFixed(1)}%` };
    } else {
      return { icon: Activity, color: 'text-gray-600', text: '0%' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'visitors', label: 'Visitors', icon: Users },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <CommonHeader />

      {/* Admin Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-heading">
                    {currentProject.name} - Admin Panel
                  </h1>
                  <p className="text-gray-600 font-primary">
                    Comprehensive website analytics and management
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium font-primary text-sm">
                  {realTimeData?.activeVisitors || 0} Active
                </span>
              </div>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-xl transition-colors ${
                  autoRefresh ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
              >
                <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => loadAnalyticsData(currentProject.id)}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mt-6">
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
                <span className="font-primary hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-primary"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="all">All time</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="text-sm text-gray-500 font-primary">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-heading">
                  {formatNumber(analyticsData.totalVisitors)}
                </div>
                <div className="text-gray-600 font-primary">Total Visitors</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+8.3%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-heading">
                  {formatNumber(analyticsData.pageViews)}
                </div>
                <div className="text-gray-600 font-primary">Page Views</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">-2.1%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-heading">
                  {formatDuration(analyticsData.averageSessionDuration)}
                </div>
                <div className="text-gray-600 font-primary">Avg. Session</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+5.7%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 font-heading">
                  {analyticsData.conversionRate.toFixed(1)}%
                </div>
                <div className="text-gray-600 font-primary">Conversion Rate</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visitors Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 font-heading">Visitors Over Time</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 font-primary">Visitors</span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
                    <span className="text-sm text-gray-600 font-primary">Page Views</span>
                  </div>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData.dailyViews.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col gap-1">
                        <div 
                          className="bg-primary-500 rounded-t"
                          style={{ 
                            height: `${Math.max(4, (day.visitors / Math.max(...analyticsData.dailyViews.map(d => d.visitors))) * 200)}px` 
                          }}
                        ></div>
                        <div 
                          className="bg-blue-500 rounded-b"
                          style={{ 
                            height: `${Math.max(4, (day.views / Math.max(...analyticsData.dailyViews.map(d => d.views))) * 100)}px` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 font-primary">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Device Breakdown</h3>
                
                <div className="space-y-4">
                  {analyticsData.deviceTypes.map((device, index) => {
                    const DeviceIcon = getDeviceIcon(device.device);
                    return (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            index === 0 ? 'bg-primary-100' : index === 1 ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <DeviceIcon className={`w-5 h-5 ${
                              index === 0 ? 'text-primary-600' : index === 1 ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 font-primary capitalize">{device.device}</div>
                            <div className="text-sm text-gray-600 font-primary">{device.visitors} visitors</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 font-primary w-12 text-right">
                            {device.percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Geographic Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Countries */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Top Countries</h3>
                
                <div className="space-y-4">
                  {analyticsData.topCountries.slice(0, 5).map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{country.country}</div>
                          <div className="text-sm text-gray-600 font-primary">{country.visitors} visitors</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 font-primary w-10 text-right">
                          {country.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Traffic Sources</h3>
                
                <div className="space-y-4">
                  {analyticsData.referrers.slice(0, 5).map((referrer, index) => (
                    <div key={referrer.referrer} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{referrer.referrer}</div>
                          <div className="text-sm text-gray-600 font-primary">{referrer.visitors} visitors</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${referrer.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 font-primary w-10 text-right">
                          {referrer.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hourly Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">24-Hour Activity</h3>
              
              <div className="h-64 flex items-end justify-between gap-1">
                {analyticsData.hourlyViews.map((hour) => (
                  <div key={hour.hour} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-t w-full"
                      style={{ 
                        height: `${Math.max(4, (hour.views / Math.max(...analyticsData.hourlyViews.map(h => h.views))) * 200)}px` 
                      }}
                      title={`${hour.hour}:00 - ${hour.views} views, ${hour.visitors} visitors`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 font-primary">
                      {hour.hour.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Conversion Funnel</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900 font-primary">Total Visitors</span>
                  </div>
                  <span className="text-lg font-bold text-primary-600 font-heading">
                    {analyticsData.totalVisitors}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 font-primary">Engaged Visitors</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 font-heading">
                    {Math.round(analyticsData.totalVisitors * (100 - analyticsData.bounceRate) / 100)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 font-primary">Conversions</span>
                  </div>
                  <span className="text-lg font-bold text-green-600 font-heading">
                    {analyticsData.conversions.reduce((sum, c) => sum + c.count, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Types */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Conversion Types</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.conversions.map((conversion, index) => {
                  const getConversionIcon = (type: string) => {
                    switch (type) {
                      case 'email_click': return Mail;
                      case 'phone_click': return Phone;
                      case 'form_submission': return FileText;
                      case 'download': return Download;
                      case 'external_link': return ExternalLink;
                      case 'social_click': return Share2;
                      default: return Target;
                    }
                  };

                  const ConversionIcon = getConversionIcon(conversion.type);

                  return (
                    <div key={conversion.type} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <ConversionIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary capitalize">
                            {conversion.type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-600 font-primary">
                            {conversion.count} conversions
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 font-heading">
                        {conversion.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Real-time Visitors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Real-time Activity</h3>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium font-primary">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2 font-heading">
                    {realTimeData?.activeVisitors || 0}
                  </div>
                  <div className="text-gray-600 font-primary">Active Visitors</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2 font-heading">
                    {Object.keys(realTimeData?.currentPages || {}).length}
                  </div>
                  <div className="text-gray-600 font-primary">Active Pages</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2 font-heading">
                    {realTimeData?.recentEvents?.length || 0}
                  </div>
                  <div className="text-gray-600 font-primary">Recent Events</div>
                </div>
              </div>

              {/* Recent Events */}
              {realTimeData?.recentEvents && realTimeData.recentEvents.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 font-heading">Recent Activity</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {realTimeData.recentEvents.map((event: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 font-primary">
                            {event.type.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600 font-primary">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 font-primary">
                          {event.data?.country || 'Unknown'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Browser Statistics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Browser Statistics</h3>
              
              <div className="space-y-4">
                {analyticsData.browsers.map((browser, index) => {
                  const BrowserIcon = getBrowserIcon(browser.browser);
                  return (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <BrowserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{browser.browser}</div>
                          <div className="text-sm text-gray-600 font-primary">{browser.visitors} visitors</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${browser.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 font-primary w-12 text-right">
                          {browser.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating Systems */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Operating Systems</h3>
              
              <div className="space-y-4">
                {analyticsData.operatingSystems.map((os, index) => (
                  <div key={os.os} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 font-primary">{os.os}</div>
                        <div className="text-sm text-gray-600 font-primary">{os.visitors} visitors</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${os.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 font-primary w-12 text-right">
                        {os.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Timer className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsData.performanceMetrics.averageLoadTime}ms
                    </div>
                    <div className="text-gray-600 font-primary">Load Time</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (3000 - analyticsData.performanceMetrics.averageLoadTime) / 30)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsData.performanceMetrics.averageFirstContentfulPaint}ms
                    </div>
                    <div className="text-gray-600 font-primary">First Paint</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (2000 - analyticsData.performanceMetrics.averageFirstContentfulPaint) / 20)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsData.performanceMetrics.totalResourceSize}KB
                    </div>
                    <div className="text-gray-600 font-primary">Page Size</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, analyticsData.performanceMetrics.totalResourceSize / 10)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsData.performanceMetrics.averageEngagementScore}
                    </div>
                    <div className="text-gray-600 font-primary">Engagement</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, analyticsData.performanceMetrics.averageEngagementScore)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Performance Recommendations</h3>
              
              <div className="space-y-4">
                {analyticsData.performanceMetrics.averageLoadTime > 3000 && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-900 font-primary">Slow Load Time</div>
                      <div className="text-sm text-red-700 font-primary">
                        Your page takes {analyticsData.performanceMetrics.averageLoadTime}ms to load. Consider optimizing images and reducing resource size.
                      </div>
                    </div>
                  </div>
                )}

                {analyticsData.performanceMetrics.totalResourceSize > 1000 && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-900 font-primary">Large Page Size</div>
                      <div className="text-sm text-yellow-700 font-primary">
                        Your page size is {analyticsData.performanceMetrics.totalResourceSize}KB. Consider compressing images and minifying code.
                      </div>
                    </div>
                  </div>
                )}

                {analyticsData.performanceMetrics.averageEngagementScore < 50 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 font-primary">Low Engagement</div>
                      <div className="text-sm text-blue-700 font-primary">
                        User engagement is below average. Consider improving content and user experience.
                      </div>
                    </div>
                  </div>
                )}

                {analyticsData.performanceMetrics.averageLoadTime <= 3000 && 
                 analyticsData.performanceMetrics.totalResourceSize <= 1000 && 
                 analyticsData.performanceMetrics.averageEngagementScore >= 50 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900 font-primary">Excellent Performance</div>
                      <div className="text-sm text-green-700 font-primary">
                        Your website is performing well across all metrics. Keep up the great work!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Content Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-heading">Content Management</h3>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary">
                    <Copy className="w-4 h-4 mr-2" />
                    Backup
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    {currentProject.sections.length}
                  </div>
                  <div className="text-gray-600 font-primary">Total Sections</div>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    {currentProject.sections.filter(s => s.data?.title || s.data?.name).length}
                  </div>
                  <div className="text-gray-600 font-primary">Content Blocks</div>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    {currentProject.sections.filter(s => s.data?.image || s.data?.backgroundImage).length}
                  </div>
                  <div className="text-gray-600 font-primary">Images</div>
                </div>
              </div>
            </div>

            {/* Page Performance by Section */}
            {analyticsData && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Page Performance</h3>
                
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{page.page}</div>
                          <div className="text-sm text-gray-600 font-primary">
                            {page.views} views • {formatDuration(page.avgTime)} avg. time
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 font-heading">{page.views}</div>
                          <div className="text-sm text-gray-600 font-primary">Views</div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Website Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website Name</label>
                    <input
                      type="text"
                      value={currentProject.name}
                      onChange={(e) => updateProject(currentProject.id, { name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website URL</label>
                    <div className="flex items-center">
                      <span className="px-3 py-3 bg-gray-100 text-gray-600 rounded-l-xl border border-r-0 border-gray-300 text-sm font-mono">
                        /site/
                      </span>
                      <input
                        type="text"
                        value={currentProject.websiteUrl}
                        onChange={(e) => updateProject(currentProject.id, { websiteUrl: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Description</label>
                  <textarea
                    value={currentProject.description || ''}
                    onChange={(e) => updateProject(currentProject.id, { description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-primary"
                    placeholder="Enter website description..."
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Published Status</div>
                    <div className="text-sm text-gray-600 font-primary">
                      {currentProject.isPublished ? 'Your website is live and accessible to visitors' : 'Your website is in draft mode'}
                    </div>
                  </div>
                  <button
                    onClick={() => updateProject(currentProject.id, { isPublished: !currentProject.isPublished })}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                      currentProject.isPublished
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {currentProject.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Analytics Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Analytics Tracking</div>
                    <div className="text-sm text-gray-600 font-primary">Collect visitor data and website performance metrics</div>
                  </div>
                  <button className="w-12 h-6 bg-primary-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Real-time Monitoring</div>
                    <div className="text-sm text-gray-600 font-primary">Monitor visitor activity in real-time</div>
                  </div>
                  <button className="w-12 h-6 bg-primary-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Performance Monitoring</div>
                    <div className="text-sm text-gray-600 font-primary">Track page load times and performance metrics</div>
                  </div>
                  <button className="w-12 h-6 bg-primary-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-primary-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">Export Analytics Data</div>
                    <div className="text-sm text-gray-600 font-primary">Download all analytics data as CSV</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">Clear Analytics Data</div>
                    <div className="text-sm text-gray-600 font-primary">Remove all collected analytics data</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Save className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">Backup Website</div>
                    <div className="text-sm text-gray-600 font-primary">Create a complete backup of your website</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">Restore Backup</div>
                    <div className="text-sm text-gray-600 font-primary">Restore website from a backup file</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SiteAdmin;