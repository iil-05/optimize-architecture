import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  BarChart3,
  Users,
  Globe,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
  ExternalLink,
  Activity,
  MousePointer,
  Timer,
  Zap,
  Target,
  Award,
  Star,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Info,
  Wifi,
  WifiOff,
  Database,
  Server,
  Shield,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Navigation,
  Layers,
  Image,
  FileText,
  Video,
  Music,
  Camera,
  Code,
  Palette,
  Layout,
  Grid,
  List,
  Plus,
  Minus,
  X,
  Check,
  Edit,
  Trash2,
  Copy,
  Save,
  Upload,
  Flag,
  Bookmark,
  Tag,
  Link as LinkIcon,
  Home,
  Building,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Car,
  Utensils,
  Gamepad2,
  Music2,
  Headphones,
  Mic,
  Radio,
  Tv,
  Film,
  Book,
  Newspaper,
  PenTool,
  Brush,
  Scissors,
  Ruler,
  Compass,
  Calculator,
  Clock3,
  Calendar as CalendarIcon,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Aperture,
  Focus,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Sunrise,
  Sunset,
  Mountain,
  Trees,
  Flower,
  Leaf,
  Feather,
  Flame,
  Droplets,
  Waves,
  Sparkles,
  Gem,
  Crown,
  Medal,
  Trophy,
  Gift,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  Banknote,
  Wallet,
  PiggyBank,
  TrendingUpIcon,
  LineChart,
  PieChart,
  BarChart,
  ScatterChart,
  Map,
  MapPin2,
  Navigation2,
  Compass2,
  Route,
  Car2,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Scooter,
  Fuel,
  Battery,
  BatteryLow,
  Plug,
  Power,
  PowerOff,
  Cpu,
  HardDrive,
  MemoryStick,
  Usb,
  Bluetooth,
  Wifi2,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Antenna,
  Radio2,
  Satellite,
  Router,
  Ethernet,
  Cable,
  Headset,
  Microphone,
  Speaker,
  Volume,
  VolumeDown,
  VolumeUp,
  Mute,
  Unmute,
  Record,
  StopCircle,
  PlayCircle,
  PauseCircle,
  FastForward,
  Rewind,
  SkipForward2,
  SkipBack2,
  Repeat1,
  Repeat2,
  Shuffle2,
  List2,
  Grid2,
  Columns,
  Rows,
  Table,
  Database2,
  Server2,
  Cloud2,
  CloudDownload,
  CloudUpload,
  CloudOff,
  HardDriveDownload,
  HardDriveUpload,
  FolderOpen,
  Folder,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText2,
  FilePdf,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileX,
  FileCheck,
  FilePlus,
  FileMinus,
  FileEdit,
  FileCopy,
  FileSearch,
  Archive,
  Package2,
  Inbox,
  Outbox,
  Send,
  SendHorizontal,
  Reply,
  ReplyAll,
  Forward,
  Paperclip,
  AtSign,
  Hash,
  Percent,
  Ampersand,
  Asterisk,
  Slash,
  Backslash,
  Pipe,
  Equal,
  NotEqual,
  LessThan,
  LessThanEqual,
  GreaterThan,
  GreaterThanEqual,
  Plus2,
  Minus2,
  Multiply,
  Divide,
  Modulo,
  Exponent,
  SquareRoot,
  Infinity,
  Pi,
  Sigma,
  Delta,
  Alpha,
  Beta,
  Gamma,
  Lambda,
  Omega,
  Phi,
  Psi,
  Chi,
  Theta,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Tau,
  Upsilon,
  Zeta,
  Eta,
  Iota,
  Kappa
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

// Analytics interfaces
interface AnalyticsData {
  id: string;
  projectId: string;
  timestamp: Date;
  type: 'page_view' | 'section_view' | 'interaction' | 'performance' | 'error' | 'conversion';
  data: {
    // Page view data
    page?: string;
    referrer?: string;
    userAgent?: string;
    sessionId?: string;
    userId?: string;
    
    // Section view data
    sectionId?: string;
    sectionType?: string;
    timeSpent?: number;
    
    // Interaction data
    element?: string;
    action?: string;
    value?: string;
    
    // Performance data
    loadTime?: number;
    renderTime?: number;
    resourceSize?: number;
    
    // Error data
    errorType?: string;
    errorMessage?: string;
    stackTrace?: string;
    
    // Conversion data
    conversionType?: string;
    conversionValue?: number;
    
    // Device and location data
    device?: 'desktop' | 'tablet' | 'mobile';
    browser?: string;
    os?: string;
    country?: string;
    city?: string;
    ip?: string;
  };
}

interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  browserBreakdown: { browser: string; percentage: number }[];
  countryBreakdown: { country: string; views: number }[];
  hourlyViews: { hour: number; views: number }[];
  dailyViews: { date: string; views: number }[];
  conversionRate: number;
  performanceMetrics: {
    averageLoadTime: number;
    averageRenderTime: number;
    errorRate: number;
  };
}

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, setCurrentProject } = useProject();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'content' | 'settings'>('overview');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize analytics storage
  useEffect(() => {
    initializeAnalyticsStorage();
  }, []);

  // Load project data
  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id, projects]);

  // Load analytics when project changes
  useEffect(() => {
    if (project) {
      loadAnalyticsData();
    }
  }, [project, dateRange]);

  const initializeAnalyticsStorage = () => {
    try {
      // Check if analytics table exists
      const existingAnalytics = localStorage.getItem('templates_uz_analytics_data');
      if (!existingAnalytics) {
        // Create analytics table structure
        const analyticsTable = {
          data: [],
          indexes: {
            projectId: {},
            timestamp: {},
            type: {}
          },
          metadata: {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          }
        };
        localStorage.setItem('templates_uz_analytics_data', JSON.stringify(analyticsTable));
        console.log('✅ Analytics table created in localStorage');
      }

      // Generate sample analytics data if none exists
      if (id) {
        generateSampleAnalytics(id);
      }
    } catch (error) {
      console.error('❌ Error initializing analytics storage:', error);
    }
  };

  const loadProjectData = () => {
    setLoading(true);
    try {
      // First try to find in current projects
      let foundProject = projects.find(p => p.id === id);
      
      // If not found, try optimized storage
      if (!foundProject) {
        foundProject = optimizedStorage.getProject(id!);
      }
      
      // If still not found, try all stored projects
      if (!foundProject) {
        const allProjects = optimizedStorage.getAllProjects();
        foundProject = allProjects.find(p => p.id === id);
      }

      if (foundProject) {
        setProject(foundProject);
        setCurrentProject(foundProject);
        console.log('✅ Project loaded for admin:', foundProject);
      } else {
        console.log('❌ Project not found:', id);
        // Don't redirect, show error state instead
      }
    } catch (error) {
      console.error('❌ Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleAnalytics = (projectId: string) => {
    try {
      const analyticsTable = JSON.parse(localStorage.getItem('templates_uz_analytics_data') || '{"data": []}');
      
      // Check if we already have data for this project
      const existingData = analyticsTable.data.filter((item: any) => item.projectId === projectId);
      if (existingData.length > 0) {
        return; // Already has data
      }

      const sampleData: AnalyticsData[] = [];
      const now = new Date();
      
      // Generate data for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dailyViews = Math.floor(Math.random() * 50) + 10;
        
        for (let j = 0; j < dailyViews; j++) {
          const timestamp = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000);
          
          // Page views
          sampleData.push({
            id: `analytics_${Date.now()}_${Math.random()}`,
            projectId,
            timestamp,
            type: 'page_view',
            data: {
              page: '/',
              referrer: ['google.com', 'facebook.com', 'direct', 'twitter.com'][Math.floor(Math.random() * 4)],
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              sessionId: `session_${Math.random()}`,
              device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)] as any,
              browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
              os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
              country: ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia'][Math.floor(Math.random() * 6)],
              city: ['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 6)]
            }
          });

          // Performance data
          if (Math.random() > 0.7) {
            sampleData.push({
              id: `perf_${Date.now()}_${Math.random()}`,
              projectId,
              timestamp,
              type: 'performance',
              data: {
                loadTime: Math.floor(Math.random() * 3000) + 500,
                renderTime: Math.floor(Math.random() * 1000) + 100,
                resourceSize: Math.floor(Math.random() * 2000) + 500
              }
            });
          }

          // Interactions
          if (Math.random() > 0.5) {
            sampleData.push({
              id: `interaction_${Date.now()}_${Math.random()}`,
              projectId,
              timestamp,
              type: 'interaction',
              data: {
                element: ['button', 'link', 'form', 'image'][Math.floor(Math.random() * 4)],
                action: ['click', 'hover', 'scroll', 'submit'][Math.floor(Math.random() * 4)],
                value: `section_${Math.floor(Math.random() * 10)}`
              }
            });
          }

          // Conversions
          if (Math.random() > 0.9) {
            sampleData.push({
              id: `conversion_${Date.now()}_${Math.random()}`,
              projectId,
              timestamp,
              type: 'conversion',
              data: {
                conversionType: ['contact_form', 'newsletter', 'download', 'purchase'][Math.floor(Math.random() * 4)],
                conversionValue: Math.floor(Math.random() * 100) + 1
              }
            });
          }
        }
      }

      // Save to analytics table
      analyticsTable.data.push(...sampleData);
      analyticsTable.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem('templates_uz_analytics_data', JSON.stringify(analyticsTable));
      
      console.log('✅ Sample analytics data generated:', sampleData.length, 'records');
    } catch (error) {
      console.error('❌ Error generating sample analytics:', error);
    }
  };

  const loadAnalyticsData = () => {
    try {
      const analyticsTable = JSON.parse(localStorage.getItem('templates_uz_analytics_data') || '{"data": []}');
      const projectAnalytics = analyticsTable.data
        .filter((item: any) => item.projectId === project.id)
        .map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));

      // Filter by date range
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      const filteredData = projectAnalytics.filter((item: AnalyticsData) => 
        item.timestamp >= startDate
      );

      setAnalyticsData(filteredData);
      generateAnalyticsSummary(filteredData);
      
      console.log('✅ Analytics data loaded:', filteredData.length, 'records');
    } catch (error) {
      console.error('❌ Error loading analytics data:', error);
    }
  };

  const generateAnalyticsSummary = (data: AnalyticsData[]) => {
    try {
      const pageViews = data.filter(item => item.type === 'page_view');
      const interactions = data.filter(item => item.type === 'interaction');
      const conversions = data.filter(item => item.type === 'conversion');
      const performance = data.filter(item => item.type === 'performance');

      // Calculate unique visitors (simplified)
      const uniqueVisitors = new Set(pageViews.map(item => item.data.sessionId)).size;

      // Calculate session times (simplified)
      const sessions = pageViews.reduce((acc: any, item) => {
        const sessionId = item.data.sessionId!;
        if (!acc[sessionId]) {
          acc[sessionId] = { start: item.timestamp, end: item.timestamp };
        } else {
          if (item.timestamp < acc[sessionId].start) acc[sessionId].start = item.timestamp;
          if (item.timestamp > acc[sessionId].end) acc[sessionId].end = item.timestamp;
        }
        return acc;
      }, {});

      const sessionTimes = Object.values(sessions).map((session: any) => 
        (session.end.getTime() - session.start.getTime()) / 1000 / 60
      );
      const averageSessionTime = sessionTimes.length > 0 
        ? sessionTimes.reduce((a: number, b: number) => a + b, 0) / sessionTimes.length 
        : 0;

      // Top pages
      const pageCount = pageViews.reduce((acc: any, item) => {
        const page = item.data.page || '/';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {});
      const topPages = Object.entries(pageCount)
        .map(([page, views]) => ({ page, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      const topReferrers = Object.entries(referrerCount)
        .map(([referrer, views]) => ({ referrer, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Device breakdown
      const deviceCount = pageViews.reduce((acc: any, item) => {
        const device = item.data.device || 'desktop';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});
      const totalDeviceViews = Object.values(deviceCount).reduce((a: any, b: any) => a + b, 0);
      const deviceBreakdown = Object.entries(deviceCount)
        .map(([device, count]) => ({ 
          device, 
          percentage: Math.round((count as number / totalDeviceViews) * 100) 
        }));

      // Browser breakdown
      const browserCount = pageViews.reduce((acc: any, item) => {
        const browser = item.data.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {});
      const totalBrowserViews = Object.values(browserCount).reduce((a: any, b: any) => a + b, 0);
      const browserBreakdown = Object.entries(browserCount)
        .map(([browser, count]) => ({ 
          browser, 
          percentage: Math.round((count as number / totalBrowserViews) * 100) 
        }));

      // Country breakdown
      const countryCount = pageViews.reduce((acc: any, item) => {
        const country = item.data.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});
      const countryBreakdown = Object.entries(countryCount)
        .map(([country, views]) => ({ country, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Hourly views
      const hourlyCount = pageViews.reduce((acc: any, item) => {
        const hour = item.timestamp.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      const hourlyViews = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        views: hourlyCount[hour] || 0
      }));

      // Daily views
      const dailyCount = pageViews.reduce((acc: any, item) => {
        const date = item.timestamp.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const dailyViews = Object.entries(dailyCount)
        .map(([date, views]) => ({ date, views: views as number }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Performance metrics
      const loadTimes = performance.map(item => item.data.loadTime || 0).filter(time => time > 0);
      const renderTimes = performance.map(item => item.data.renderTime || 0).filter(time => time > 0);
      const errors = data.filter(item => item.type === 'error');

      const summary: AnalyticsSummary = {
        totalViews: pageViews.length,
        uniqueVisitors,
        averageSessionTime,
        bounceRate: Math.round((uniqueVisitors / pageViews.length) * 100),
        topPages,
        topReferrers,
        deviceBreakdown,
        browserBreakdown,
        countryBreakdown,
        hourlyViews,
        dailyViews,
        conversionRate: pageViews.length > 0 ? Math.round((conversions.length / pageViews.length) * 100) : 0,
        performanceMetrics: {
          averageLoadTime: loadTimes.length > 0 ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length) : 0,
          averageRenderTime: renderTimes.length > 0 ? Math.round(renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length) : 0,
          errorRate: pageViews.length > 0 ? Math.round((errors.length / pageViews.length) * 100) : 0
        }
      };

      setAnalyticsSummary(summary);
      console.log('✅ Analytics summary generated:', summary);
    } catch (error) {
      console.error('❌ Error generating analytics summary:', error);
    }
  };

  const handleRefreshAnalytics = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadAnalyticsData();
    setIsRefreshing(false);
  };

  const handleExportAnalytics = () => {
    try {
      const exportData = {
        project: {
          id: project.id,
          name: project.name,
          websiteUrl: project.websiteUrl
        },
        summary: analyticsSummary,
        rawData: analyticsData,
        exportedAt: new Date().toISOString(),
        dateRange
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Error exporting analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-heading">Loading Admin Panel</h2>
          <p className="text-gray-600 font-primary">Please wait while we load your website data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Website Not Found</h2>
          <p className="text-gray-600 mb-6 font-primary">
            The website with ID "{id}" doesn't exist or you don't have permission to access it.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-elegant font-display"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-glow font-display"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
                  <h1 className="text-3xl font-bold text-gray-900 font-heading">Admin Panel</h1>
                  <p className="text-gray-600 font-primary">{project.name} - {project.websiteUrl}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-xl border border-green-200">
                <Globe className="w-4 h-4" />
                <span className="font-medium font-primary">Live</span>
              </div>
              
              <button
                onClick={() => window.open(`/site/${project.websiteUrl}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
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
        {activeTab === 'overview' && analyticsSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-primary">Total Views</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.uniqueVisitors.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-primary">Unique Visitors</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{Math.round(analyticsSummary.averageSessionTime)}m</div>
                <div className="text-sm text-gray-600 font-primary">Avg. Session Time</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.conversionRate}%</div>
                <div className="text-sm text-gray-600 font-primary">Conversion Rate</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Views Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Daily Views</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsSummary.dailyViews.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                        style={{
                          height: `${Math.max((day.views / Math.max(...analyticsSummary.dailyViews.map(d => d.views))) * 200, 10)}px`
                        }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2 font-primary">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs font-semibold text-gray-900 font-primary">{day.views}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Device Breakdown</h3>
                <div className="space-y-4">
                  {analyticsSummary.deviceBreakdown.map((device) => {
                    const Icon = device.device === 'desktop' ? Monitor : 
                                device.device === 'mobile' ? Smartphone : Tablet;
                    return (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900 capitalize font-primary">{device.device}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all"
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right font-primary">
                            {device.percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Pages and Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Top Pages</h3>
                <div className="space-y-3">
                  {analyticsSummary.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-600 font-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 font-primary">{page.page}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 font-primary">{page.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analytics Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 font-heading">Advanced Analytics</h2>
                  <p className="text-gray-600 font-primary">Detailed insights into your website performance</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last year</option>
                  </select>
                  
                  <button
                    onClick={handleRefreshAnalytics}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  
                  <button
                    onClick={handleExportAnalytics}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      {analyticsSummary.performanceMetrics.averageLoadTime}ms
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Avg. Load Time</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min((3000 - analyticsSummary.performanceMetrics.averageLoadTime) / 3000 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      {analyticsSummary.performanceMetrics.averageRenderTime}ms
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Avg. Render Time</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min((1000 - analyticsSummary.performanceMetrics.averageRenderTime) / 1000 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      {analyticsSummary.performanceMetrics.errorRate}%
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Error Rate</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${analyticsSummary.performanceMetrics.errorRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hourly Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Hourly Activity</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {analyticsSummary.hourlyViews.map((hour) => (
                  <div key={hour.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                      style={{
                        height: `${Math.max((hour.views / Math.max(...analyticsSummary.hourlyViews.map(h => h.views))) * 200, 2)}px`
                      }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2 font-primary">
                      {hour.hour.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Data */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Geographic Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsSummary.countryBreakdown.slice(0, 10).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-600 font-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900 font-primary">{country.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 font-primary">{country.views} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Content Management</h2>
              <p className="text-gray-600 mb-6 font-primary">Manage your website content and sections</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900 font-primary">Sections</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-heading">{project.sections.length}</div>
                  <div className="text-sm text-gray-600 font-primary">Total sections</div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Image className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 font-primary">Images</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-heading">
                    {project.sections.reduce((count: number, section: any) => {
                      const imageFields = JSON.stringify(section.data).match(/https?:\/\/[^\s"]+\.(jpg|jpeg|png|gif|webp)/gi);
                      return count + (imageFields ? imageFields.length : 0);
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-600 font-primary">Total images</div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 font-primary">Text Content</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 font-heading">
                    {Math.round(JSON.stringify(project.sections).length / 1024)}KB
                  </div>
                  <div className="text-sm text-gray-600 font-primary">Content size</div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/editor/${project.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                >
                  <Edit className="w-4 h-4" />
                  Edit Content
                </button>
                
                <button
                  onClick={() => navigate(`/preview/${project.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Website Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website Name</label>
                    <input
                      type="text"
                      value={project.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
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
                        value={project.websiteUrl}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl bg-gray-50 text-gray-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Description</label>
                  <textarea
                    value={project.description || 'No description provided'}
                    readOnly
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 resize-none font-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category</label>
                    <input
                      type="text"
                      value={project.category || 'General'}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Theme</label>
                    <input
                      type="text"
                      value={project.themeId || 'Default'}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Published Status</div>
                    <div className="text-sm text-gray-600 font-primary">Website is currently {project.isPublished ? 'live' : 'draft'}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.isPublished 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-primary">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="font-primary">Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SiteAdmin;