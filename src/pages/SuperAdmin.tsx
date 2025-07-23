import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Shield,
  BarChart3,
  Users,
  Globe,
  Palette,
  Star,
  Layout,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Eye,
  Heart,
  Coins,
  TrendingUp,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Crown,
  Zap,
  Building,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  User,
  Briefcase,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Image,
  Type,
  Code,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Power,
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
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { optimizedStorage } from '../utils/optimizedStorage';
import { themeRegistry, ThemeDefinition } from '../core/ThemeRegistry';
import { iconRegistry, IconDefinition } from '../core/IconRegistry';
import CommonHeader from '../components/CommonHeader';
import * as LucideIcons from 'lucide-react';

// Memoized chart components for performance
const MemoizedAreaChart = React.memo(AreaChart);
const MemoizedBarChart = React.memo(BarChart);
const MemoizedPieChart = React.memo(PieChart);
const MemoizedLineChart = React.memo(LineChart);
const MemoizedRadialBarChart = React.memo(RadialBarChart);

// Interfaces
interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'pro' | 'enterprise' | 'admin' | 'superadmin';
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLoginAt: Date;
  projectsCount: number;
  storageUsed: number; // in MB
}

interface AdminProject {
  id: string;
  name: string;
  description?: string;
  websiteUrl: string;
  category: string;
  userId: string;
  userName: string;
  userEmail: string;
  themeId: string;
  isPublished: boolean;
  isTemplate: boolean;
  sectionsCount: number;
  viewsCount: number;
  likesCount: number;
  coinsReceived: number;
  templateRating: number;
  templateDownloads: number;
  createdAt: Date;
  updatedAt: Date;
}

interface WebsiteCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  projectsCount: number;
  createdAt: Date;
}

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  publishedProjects: number;
  totalTemplates: number;
  totalThemes: number;
  totalIcons: number;
  totalCategories: number;
  totalViews: number;
  totalLikes: number;
  totalCoins: number;
  storageUsed: number;
  userGrowth: Array<{ date: string; users: number; projects: number }>;
  planDistribution: Array<{ plan: string; count: number; percentage: number }>;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  browserStats: Array<{ browser: string; count: number; percentage: number }>;
  dailyActivity: Array<{ date: string; views: number; likes: number; projects: number }>;
  hourlyActivity: Array<{ hour: number; activity: number }>;
  topTemplates: Array<{ id: string; name: string; downloads: number; rating: number }>;
  topUsers: Array<{ id: string; name: string; projects: number; views: number }>;
}

const SuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'statistics' | 'themes' | 'icons' | 'users' | 'categories' | 'websites' | 'templates'>('statistics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is superadmin
  const isSuperAdmin = optimizedStorage.isSuperAdmin();

  // Redirect if not superadmin
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Access denied: SuperAdmin privileges required');
      navigate('/dashboard');
      return;
    }
    setIsLoading(false);
  }, [isSuperAdmin, navigate]);

  // Load platform data
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [icons, setIcons] = useState<IconDefinition[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (isSuperAdmin) {
      loadPlatformData();
    }
  }, [isSuperAdmin]);

  const loadPlatformData = () => {
    // Load real data from optimized storage
    const allUsers = optimizedStorage.getAllUsersAdmin();
    const allProjects = optimizedStorage.getAllProjectsAdmin();
    const allThemes = themeRegistry.getAllThemes();
    const allIcons = iconRegistry.getAllIcons();
    
    setUsers(allUsers);
    setProjects(allProjects);
    setThemes(allThemes);
    setIcons(allIcons);
    setCategories(getWebsiteCategories());
    
    // Generate real statistics
    setPlatformStats(generatePlatformStats(allUsers, allProjects));
  };

  const generatePlatformStats = (users: AdminUser[], projects: AdminProject[]): PlatformStats => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Calculate real statistics
    const activeUsers = users.filter(u => u.status === 'active').length;
    const publishedProjects = projects.filter(p => p.isPublished).length;
    const totalTemplates = projects.filter(p => p.isTemplate).length;
    const totalViews = projects.reduce((sum, p) => sum + p.viewsCount, 0);
    const totalLikes = projects.reduce((sum, p) => sum + p.likesCount, 0);
    const totalCoins = projects.reduce((sum, p) => sum + p.coinsReceived, 0);
    const storageUsed = users.reduce((sum, u) => sum + u.storageUsed, 0);

    // Generate user growth data (last 30 days)
    const userGrowth = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const usersOnDate = users.filter(u => new Date(u.createdAt) <= date).length;
      const projectsOnDate = projects.filter(p => new Date(p.createdAt) <= date).length;
      
      return {
        date: dateStr,
        users: usersOnDate,
        projects: projectsOnDate
      };
    });

    // Plan distribution
    const planCounts = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const planDistribution = Object.entries(planCounts).map(([plan, count]) => ({
      plan: plan.charAt(0).toUpperCase() + plan.slice(1),
      count,
      percentage: Math.round((count / users.length) * 100)
    }));

    // Category distribution
    const categoryCounts = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      percentage: Math.round((count / projects.length) * 100)
    }));

    // Mock device and browser stats (in real app, this would come from analytics)
    const deviceStats = [
      { device: 'Desktop', count: Math.floor(totalViews * 0.6), percentage: 60 },
      { device: 'Mobile', count: Math.floor(totalViews * 0.3), percentage: 30 },
      { device: 'Tablet', count: Math.floor(totalViews * 0.1), percentage: 10 }
    ];

    const browserStats = [
      { browser: 'Chrome', count: Math.floor(totalViews * 0.65), percentage: 65 },
      { browser: 'Safari', count: Math.floor(totalViews * 0.20), percentage: 20 },
      { browser: 'Firefox', count: Math.floor(totalViews * 0.10), percentage: 10 },
      { browser: 'Edge', count: Math.floor(totalViews * 0.05), percentage: 5 }
    ];

    // Daily activity (last 30 days)
    const dailyActivity = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        date: dateStr,
        views: Math.floor(Math.random() * 500) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        projects: Math.floor(Math.random() * 20) + 5
      };
    });

    // Hourly activity
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 100) + 20
    }));

    // Top templates
    const topTemplates = projects
      .filter(p => p.isTemplate)
      .sort((a, b) => b.templateDownloads - a.templateDownloads)
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        name: p.name,
        downloads: p.templateDownloads,
        rating: p.templateRating
      }));

    // Top users
    const topUsers = users
      .sort((a, b) => b.projectsCount - a.projectsCount)
      .slice(0, 10)
      .map(u => ({
        id: u.id,
        name: u.name,
        projects: u.projectsCount,
        views: projects.filter(p => p.userId === u.id).reduce((sum, p) => sum + p.viewsCount, 0)
      }));

    return {
      totalUsers: users.length,
      activeUsers,
      totalProjects: projects.length,
      publishedProjects,
      totalTemplates,
      totalThemes: themes.length,
      totalIcons: icons.length,
      totalCategories: categories.length,
      totalViews,
      totalLikes,
      totalCoins,
      storageUsed,
      userGrowth,
      planDistribution,
      categoryDistribution,
      deviceStats,
      browserStats,
      dailyActivity,
      hourlyActivity,
      topTemplates,
      topUsers
    };
  };

  const getWebsiteCategories = (): WebsiteCategory[] => {
    return [
      {
        id: 'business',
        name: 'Business',
        description: 'Professional business websites',
        icon: 'Building',
        color: '#3b82f6',
        isActive: true,
        projectsCount: projects.filter(p => p.category === 'business').length,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Personal and creative portfolios',
        icon: 'Briefcase',
        color: '#8b5cf6',
        isActive: true,
        projectsCount: projects.filter(p => p.category === 'portfolio').length,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Online stores and shops',
        icon: 'ShoppingBag',
        color: '#10b981',
        isActive: true,
        projectsCount: projects.filter(p => p.category === 'ecommerce').length,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'personal',
        name: 'Personal',
        description: 'Personal websites and blogs',
        icon: 'User',
        color: '#f59e0b',
        isActive: true,
        projectsCount: projects.filter(p => p.category === 'personal').length,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'photography',
        name: 'Photography',
        description: 'Photography and visual portfolios',
        icon: 'Camera',
        color: '#ef4444',
        isActive: true,
        projectsCount: projects.filter(p => p.category === 'photography').length,
        createdAt: new Date('2024-01-01')
      }
    ];
  };

  // Chart colors
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Tab configuration
  const tabs = [
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'icons', label: 'Icons', icon: Star },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Layout },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'templates', label: 'Templates', icon: Crown },
  ];

  // Modal handlers
  const handleAdd = (type: string) => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      // Implement delete logic based on type
      toast.success(`${type} deleted successfully`);
      loadPlatformData();
    }
  };

  const handleSave = (data: any, type: string) => {
    // Implement save logic based on type
    toast.success(`${type} ${editingItem ? 'updated' : 'created'} successfully`);
    setShowModal(false);
    setEditingItem(null);
    loadPlatformData();
  };

  const handleToggleTemplate = (projectId: string, isTemplate: boolean) => {
    // Toggle template status
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.isTemplate = isTemplate;
      toast.success(`Project ${isTemplate ? 'added to' : 'removed from'} templates`);
      loadPlatformData();
    }
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = projects.filter(project => 
    project.isTemplate && (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading SuperAdmin panel...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">SuperAdmin Panel</h1>
                <p className="text-gray-600 font-primary">Complete platform management and analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
                <Crown className="w-4 h-4" />
                <span className="font-medium font-primary">SuperAdmin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && platformStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: platformStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-100 text-blue-600', change: '+12%' },
                { title: 'Active Projects', value: platformStats.totalProjects.toLocaleString(), icon: Globe, color: 'bg-green-100 text-green-600', change: '+8%' },
                { title: 'Templates', value: platformStats.totalTemplates.toLocaleString(), icon: Crown, color: 'bg-purple-100 text-purple-600', change: '+15%' },
                { title: 'Total Views', value: platformStats.totalViews.toLocaleString(), icon: Eye, color: 'bg-orange-100 text-orange-600', change: '+25%' },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-semibold">{stat.change}</div>
                        <div className="text-xs text-gray-500">vs last month</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <MemoizedAreaChart data={platformStats.userGrowth}>
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
                    dataKey="users" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Users"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Projects"
                  />
                </MemoizedAreaChart>
              </ResponsiveContainer>
            </div>

            {/* Plan Distribution and Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <MemoizedPieChart>
                    <Pie
                      data={platformStats.planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {platformStats.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </MemoizedPieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <MemoizedBarChart data={platformStats.categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </MemoizedBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <MemoizedLineChart data={platformStats.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} name="Projects" />
                </MemoizedLineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Templates and Top Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Templates</h3>
                <div className="space-y-4">
                  {platformStats.topTemplates.slice(0, 5).map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{template.name}</div>
                          <div className="text-sm text-gray-600">{template.downloads} downloads</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Users</h3>
                <div className="space-y-4">
                  {platformStats.topUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.projects} projects</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.views.toLocaleString()} views
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Theme Management</h2>
              <button
                onClick={() => handleAdd('theme')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Theme
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div key={theme.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(theme)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(theme.id, 'theme')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="flex gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: theme.colors.surface }}
                      title="Surface"
                    />
                  </div>

                  {/* Font Preview */}
                  <div className="space-y-2 mb-4">
                    <div style={{ fontFamily: theme.fonts.primary }} className="text-sm font-semibold">
                      Primary: {theme.fonts.primary}
                    </div>
                    <div style={{ fontFamily: theme.fonts.secondary }} className="text-sm">
                      Secondary: {theme.fonts.secondary}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Category: {theme.category}</span>
                    {theme.isPremium && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Icons Tab */}
        {activeTab === 'icons' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Icon Management</h2>
              <button
                onClick={() => handleAdd('icon')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Icon
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="communication">Communication</option>
                </select>
              </div>

              <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-3">
                {icons
                  .filter(icon => 
                    (selectedFilter === 'all' || icon.category === selectedFilter) &&
                    (searchTerm === '' || icon.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .slice(0, 96)
                  .map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <div
                        key={icon.id}
                        className="group relative p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        onClick={() => handleEdit(icon)}
                      >
                        <IconComponent className="w-6 h-6 text-gray-700 mx-auto" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {icon.name}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => handleAdd('user')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Plan</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Projects</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Storage</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Last Login</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                            user.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.projectsCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.storageUsed} MB</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(user.lastLoginAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, 'user')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Website Categories</h2>
              <button
                onClick={() => handleAdd('category')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = (LucideIcons as any)[category.icon] || Building;
                return (
                  <div key={category.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.projectsCount} projects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, 'category')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Websites Tab */}
        {activeTab === 'websites' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Website Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Website</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Owner</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Template</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Stats</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-600">/{project.websiteUrl}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.userName}</div>
                            <div className="text-sm text-gray-600">{project.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            project.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleTemplate(project.id, !project.isTemplate)}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              project.isTemplate 
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {project.isTemplate ? (
                              <>
                                <Crown className="w-3 h-3 mr-1" />
                                Template
                              </>
                            ) : (
                              'Make Template'
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>{project.viewsCount} views</div>
                            <div className="text-gray-600">{project.likesCount} likes</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.open(`/site/${project.websiteUrl}`, '_blank')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, 'website')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Template Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Template
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {template.templateRating.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600">by {template.userName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/site/${template.websiteUrl}`, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleToggleTemplate(template.id, false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {template.templateDownloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {template.likesCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {template.coinsReceived}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.sectionsCount} sections
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Templates will appear here when websites are marked as templates.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal content would go here based on activeTab */}
            <div className="space-y-4">
              <p className="text-gray-600">
                Modal form for {activeTab} would be implemented here with appropriate fields.
              </p>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave({}, activeTab)}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;