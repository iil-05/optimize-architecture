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
import { analyticsStorage } from '../utils/analyticsStorage';
import CommonHeader from '../components/CommonHeader';

const SiteAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, setCurrentProject, updateProject, deleteProject } = useProject();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'content' | 'settings' | 'realtime'>('overview');
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    seoKeywords: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      // Set up real-time updates
      const interval = setInterval(loadAnalyticsData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [project, dateRange]);

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
        
        // Initialize edit form
        setEditForm({
          name: foundProject.name,
          description: foundProject.description || '',
          category: foundProject.category || 'business',
          seoKeywords: foundProject.seoKeywords?.join(', ') || '',
        });
        
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

  const loadAnalyticsData = () => {
    try {
      if (!project) return;
      
      // Get date range
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

      // Generate sample data if none exists
      generateSampleAnalyticsIfNeeded(project.id);
      
      // Get analytics summary
      const summary = analyticsStorage.generateAnalyticsSummary(project.id, { start: startDate, end: now });
      setAnalyticsSummary(summary);
      
      console.log('✅ Analytics data loaded for project:', project.id);
    } catch (error) {
      console.error('❌ Error loading analytics data:', error);
    }
  };

  const generateSampleAnalyticsIfNeeded = (projectId: string) => {
    try {
      // Check if we already have analytics data for this project
      const existingData = analyticsStorage.getProjectAnalytics(projectId);
      if (existingData.sessions.length > 0) {
        return; // Already has data
      }
      
      console.log('🔄 Generating sample analytics data for project:', projectId);
      
      // Generate realistic sample data for the last 30 days
      const now = new Date();
      const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'Brazil', 'India', 'China'];
      const cities = ['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'Toronto', 'São Paulo', 'Mumbai', 'Shanghai'];
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
      const devices = ['desktop', 'mobile', 'tablet'] as const;
      const operatingSystems = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
      const referrers = ['google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'direct', 'bing.com', 'yahoo.com'];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dailySessions = Math.floor(Math.random() * 25) + 5; // 5-30 sessions per day
        
        for (let j = 0; j < dailySessions; j++) {
          // Create a realistic session
          const sessionStart = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000);
          const sessionDuration = Math.floor(Math.random() * 600) + 30; // 30 seconds to 10 minutes
          const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 1000);
          
          const country = countries[Math.floor(Math.random() * countries.length)];
          const city = cities[Math.floor(Math.random() * cities.length)];
          const browser = browsers[Math.floor(Math.random() * browsers.length)];
          const device = devices[Math.floor(Math.random() * devices.length)];
          const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
          const referrer = referrers[Math.floor(Math.random() * referrers.length)];
          
          // Simulate a session with the analytics storage
          const tempSession = {
            id: `sample_session_${Date.now()}_${Math.random()}`,
            projectId,
            sessionStart,
            sessionEnd,
            duration: sessionDuration,
            pageViews: Math.floor(Math.random() * 5) + 1, // 1-5 page views
            interactions: Math.floor(Math.random() * 10), // 0-10 interactions
            device,
            browser,
            os,
            country,
            city,
            referrer,
            userAgent: `Mozilla/5.0 (${os}) ${browser}`,
            screenResolution: device === 'mobile' ? '375x667' : device === 'tablet' ? '768x1024' : '1920x1080',
            language: 'en-US',
            timezone: 'America/New_York',
            isReturning: Math.random() > 0.7, // 30% returning visitors
            bounced: Math.random() > 0.6, // 40% bounce rate
            conversionEvents: [],
          };
          
          // Save session data directly to localStorage
          const sessions = JSON.parse(localStorage.getItem('templates_uz_analytics_sessions') || '[]');
          sessions.push(tempSession);
          localStorage.setItem('templates_uz_analytics_sessions', JSON.stringify(sessions, (key, value) => {
            if (value instanceof Date) {
              return { __type: 'Date', value: value.toISOString() };
            }
            return value;
          }));
          
          // Generate page views for this session
          const pages = ['/', '/about', '/services', '/contact', '/portfolio'];
          for (let k = 0; k < tempSession.pageViews; k++) {
            const page = k === 0 ? '/' : pages[Math.floor(Math.random() * pages.length)];
            const pageViewTime = new Date(sessionStart.getTime() + (k * (sessionDuration / tempSession.pageViews) * 1000));
            
            const pageView = {
              id: `sample_pageview_${Date.now()}_${Math.random()}`,
              projectId,
              sessionId: tempSession.id,
              timestamp: pageViewTime,
              page,
              title: `Page ${page}`,
              timeOnPage: Math.floor(Math.random() * 120) + 10, // 10-130 seconds
              scrollDepth: Math.floor(Math.random() * 100), // 0-100%
              exitPage: k === tempSession.pageViews - 1,
              referrer: k === 0 ? referrer : pages[Math.floor(Math.random() * pages.length)],
              device,
              browser,
              os,
              country,
              city,
              loadTime: Math.floor(Math.random() * 3000) + 500, // 500-3500ms
            };
            
            const pageViews = JSON.parse(localStorage.getItem('templates_uz_analytics_pageviews') || '[]');
            pageViews.push(pageView);
            localStorage.setItem('templates_uz_analytics_pageviews', JSON.stringify(pageViews, (key, value) => {
              if (value instanceof Date) {
                return { __type: 'Date', value: value.toISOString() };
              }
              return value;
            }));
          }
          
          // Generate interactions for this session
          for (let k = 0; k < tempSession.interactions; k++) {
            const interactionTime = new Date(sessionStart.getTime() + Math.random() * sessionDuration * 1000);
            const interactionTypes = ['click', 'scroll', 'hover', 'form_submit'] as const;
            const elements = ['button', 'link', 'form', 'image', 'nav', 'footer'];
            
            const interaction = {
              id: `sample_interaction_${Date.now()}_${Math.random()}`,
              projectId,
              sessionId: tempSession.id,
              timestamp: interactionTime,
              type: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
              element: elements[Math.floor(Math.random() * elements.length)],
              elementText: `Sample ${elements[Math.floor(Math.random() * elements.length)]}`,
              elementPosition: { x: Math.floor(Math.random() * 1920), y: Math.floor(Math.random() * 1080) },
            };
            
            const interactions = JSON.parse(localStorage.getItem('templates_uz_analytics_interactions') || '[]');
            interactions.push(interaction);
            localStorage.setItem('templates_uz_analytics_interactions', JSON.stringify(interactions, (key, value) => {
              if (value instanceof Date) {
                return { __type: 'Date', value: value.toISOString() };
              }
              return value;
            }));
          }
          
          // Generate conversions (10% of sessions convert)
          if (Math.random() > 0.9) {
            const conversionTypes = ['contact_form', 'newsletter', 'download', 'external_link', 'social_share'] as const;
            const conversionTime = new Date(sessionStart.getTime() + Math.random() * sessionDuration * 1000);
            
            const conversion = {
              id: `sample_conversion_${Date.now()}_${Math.random()}`,
              projectId,
              sessionId: tempSession.id,
              timestamp: conversionTime,
              type: conversionTypes[Math.floor(Math.random() * conversionTypes.length)],
              value: Math.floor(Math.random() * 100) + 1,
              metadata: { source: 'sample_data' },
            };
            
            const conversions = JSON.parse(localStorage.getItem('templates_uz_analytics_conversions') || '[]');
            conversions.push(conversion);
            localStorage.setItem('templates_uz_analytics_conversions', JSON.stringify(conversions, (key, value) => {
              if (value instanceof Date) {
                return { __type: 'Date', value: value.toISOString() };
              }
              return value;
            }));
          }
          
          // Generate performance metrics
          const performanceMetric = {
            id: `sample_performance_${Date.now()}_${Math.random()}`,
            projectId,
            timestamp: sessionStart,
            loadTime: Math.floor(Math.random() * 3000) + 500,
            domContentLoaded: Math.floor(Math.random() * 1000) + 200,
            firstContentfulPaint: Math.floor(Math.random() * 2000) + 300,
            largestContentfulPaint: Math.floor(Math.random() * 4000) + 1000,
            cumulativeLayoutShift: Math.random() * 0.3,
            firstInputDelay: Math.floor(Math.random() * 100) + 10,
            resourceCount: Math.floor(Math.random() * 50) + 10,
            resourceSize: Math.floor(Math.random() * 2000000) + 500000, // 500KB - 2.5MB
            cacheHitRate: Math.random() * 100,
          };
          
          const performanceMetrics = JSON.parse(localStorage.getItem('templates_uz_analytics_performance') || '[]');
          performanceMetrics.push(performanceMetric);
          localStorage.setItem('templates_uz_analytics_performance', JSON.stringify(performanceMetrics, (key, value) => {
            if (value instanceof Date) {
              return { __type: 'Date', value: value.toISOString() };
            }
            return value;
          }));
        }
      }

      console.log('✅ Sample analytics data generated for project:', projectId);
    } catch (error) {
      console.error('❌ Error generating sample analytics:', error);
    }
  };

  const handleRefreshAnalytics = async () => {
    setIsRefreshing(true);
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
        analytics: analyticsSummary,
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

  const handleSaveProject = () => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
      seoKeywords: editForm.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      updatedAt: new Date(),
    };
    
    updateProject(project.id, updatedProject);
    setProject(updatedProject);
    setIsEditing(false);
  };

  const handleUnpublishProject = () => {
    if (!project) return;
    
    if (window.confirm('Are you sure you want to unpublish this website? It will no longer be accessible to visitors.')) {
      updateProject(project.id, { isPublished: false });
      setProject({ ...project, isPublished: false });
    }
  };

  const handleDeleteProject = () => {
    if (!project) return;
    
    if (window.confirm('Are you sure you want to permanently delete this website? This action cannot be undone.')) {
      deleteProject(project.id);
      navigate('/dashboard');
    }
  };

  const handleClearAnalytics = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      analyticsStorage.clearAllAnalytics();
      loadAnalyticsData();
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
    { id: 'realtime', label: 'Real-time', icon: Activity },
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
                <span className="font-medium font-primary">{project.isPublished ? 'Live' : 'Draft'}</span>
              </div>
              
              {project.isPublished && (
                <button
                  onClick={() => window.open(`/site/${project.websiteUrl}`, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Site
                </button>
              )}
              
              <button
                onClick={() => navigate(`/editor/${project.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
              >
                <Edit className="w-4 h-4" />
                Edit
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
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.overview.totalPageViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-primary">Total Views</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.overview.uniqueVisitors.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-primary">Unique Visitors</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{Math.round(analyticsSummary.overview.averageSessionDuration / 60)}m</div>
                <div className="text-sm text-gray-600 font-primary">Avg. Session Time</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{analyticsSummary.overview.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 font-primary">Conversion Rate</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Views Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Daily Views</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsSummary.traffic.dailyViews.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                        style={{
                          height: `${Math.max((day.views / Math.max(...analyticsSummary.traffic.dailyViews.map(d => d.views))) * 200, 10)}px`
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
                  {analyticsSummary.demographics.devices.map((device) => {
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
                  {analyticsSummary.behavior.topPages.map((page, index) => (
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
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Top Referrers</h3>
                <div className="space-y-3">
                  {analyticsSummary.behavior.topReferrers.map((referrer, index) => (
                    <div key={referrer.referrer} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600 font-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 font-primary">{referrer.referrer}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 font-primary">{referrer.visitors} visitors</span>
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
                  
                  <button
                    onClick={handleClearAnalytics}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Data
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
                      {analyticsSummary.performance.averageLoadTime}ms
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Avg. Load Time</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min((3000 - analyticsSummary.performance.averageLoadTime) / 3000 * 100, 100)}%` }}
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
                      {analyticsSummary.performance.averageDOMContentLoaded}ms
                    </div>
                    <div className="text-sm text-gray-600 font-primary">DOM Content Loaded</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min((1000 - analyticsSummary.performance.averageDOMContentLoaded) / 1000 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      {analyticsSummary.overview.bounceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Bounce Rate</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${analyticsSummary.overview.bounceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hourly Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Hourly Activity</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {analyticsSummary.traffic.hourlyViews.map((hour) => (
                  <div key={hour.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                      style={{
                        height: `${Math.max((hour.views / Math.max(...analyticsSummary.traffic.hourlyViews.map(h => h.views))) * 200, 2)}px`
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
                {analyticsSummary.demographics.countries.slice(0, 10).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-600 font-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900 font-primary">{country.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 font-primary">{country.visitors} visits</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Browser and OS Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Browser Distribution</h3>
                <div className="space-y-3">
                  {analyticsSummary.demographics.browsers.map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600 font-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 font-primary">{browser.browser}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${browser.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 font-primary">{browser.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Operating Systems</h3>
                <div className="space-y-3">
                  {analyticsSummary.demographics.operatingSystems.map((os, index) => (
                    <div key={os.os} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600 font-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 font-primary">{os.os}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${os.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 font-primary">{os.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Conversion Funnel</h3>
              <div className="space-y-4">
                {analyticsSummary.conversions.conversionFunnel.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600 font-primary">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{step.step}</div>
                          <div className="text-sm text-gray-600 font-primary">{step.visitors} visitors</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 font-heading">{step.conversionRate}%</div>
                        <div className="text-sm text-gray-600 font-primary">conversion rate</div>
                      </div>
                    </div>
                    {index < analyticsSummary.conversions.conversionFunnel.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Real-time Tab */}
        {activeTab === 'realtime' && analyticsSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Real-time Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsSummary.realTime.activeVisitors}
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Active Visitors</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-primary">Live now</span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsSummary.realTime.currentPageViews.reduce((sum, page) => sum + page.viewers, 0)}
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Page Views (5 min)</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-primary">Last 5 minutes</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-heading">
                      {analyticsSummary.conversions.totalConversions}
                    </div>
                    <div className="text-sm text-gray-600 font-primary">Total Conversions</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-primary">All time</div>
              </div>
            </div>
            
            {/* Current Page Views */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Current Page Views</h3>
              <div className="space-y-3">
                {analyticsSummary.realTime.currentPageViews.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600 font-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900 font-primary">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-600 font-primary">{page.viewers} viewers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Events */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">Recent Activity</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analyticsSummary.realTime.recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      event.type === 'pageview' ? 'bg-blue-100' :
                      event.type === 'interaction' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {event.type === 'pageview' && <Eye className="w-4 h-4 text-blue-600" />}
                      {event.type === 'interaction' && <MousePointer className="w-4 h-4 text-green-600" />}
                      {event.type === 'conversion' && <Target className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 font-primary">{event.details}</div>
                      <div className="text-xs text-gray-600 font-primary">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 font-heading">Website Settings</h2>
                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProject}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium font-primary"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Website Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                      />
                    ) : (
                      <input
                        type="text"
                        value={project.name}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
                      />
                    )}
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
                  {isEditing ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-primary"
                      placeholder="Enter website description"
                    />
                  ) : (
                    <textarea
                      value={project.description || 'No description provided'}
                      readOnly
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 resize-none font-primary"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category</label>
                    {isEditing ? (
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
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
                      <input
                        type="text"
                        value={project.category || 'General'}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
                      />
                    )}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">SEO Keywords</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.seoKeywords}
                      onChange={(e) => setEditForm({ ...editForm, seoKeywords: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                      placeholder="Enter keywords separated by commas"
                    />
                  ) : (
                    <input
                      type="text"
                      value={project.seoKeywords?.join(', ') || 'No keywords set'}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-primary"
                    />
                  )}
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
                
                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    {project.isPublished && (
                      <button
                        onClick={handleUnpublishProject}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium font-primary"
                      >
                        <Globe className="w-4 h-4" />
                        Unpublish Website
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate(`/editor/${project.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Website
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Website
                    </button>
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
                Are you sure you want to permanently delete "{project.name}"? This action cannot be undone and will remove all content and analytics data.
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
                Delete Forever
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SiteAdmin;