import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Shield,
  BarChart3,
  Users,
  Palette,
  Star,
  Globe,
  Tag,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Download,
  Eye,
  Settings,
  Crown,
  Activity,
  TrendingUp,
  UserCheck,
  Layout,
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
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import { themeRegistry, ThemeDefinition } from '../core/ThemeRegistry';
import { iconRegistry, IconDefinition } from '../core/IconRegistry';
import CommonHeader from '../components/CommonHeader';
import { authStorage } from '../utils/authStorage';

interface SuperAdminStats {
  totalUsers: number;
  totalProjects: number;
  totalTemplates: number;
  totalThemes: number;
  totalIcons: number;
  activeUsers: number;
  publishedWebsites: number;
  premiumUsers: number;
}

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
  storageUsed: number;
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
  sectionsCount: number;
  viewsCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'statistics' | 'themes' | 'icons' | 'users' | 'categories' | 'websites'>('statistics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState<SuperAdminStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalTemplates: 0,
    totalThemes: 0,
    totalIcons: 0,
    activeUsers: 0,
    publishedWebsites: 0,
    premiumUsers: 0,
  });

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [icons, setIcons] = useState<IconDefinition[]>([]);
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);

  // Form states
  const [themeForm, setThemeForm] = useState({
    id: '',
    name: '',
    category: 'modern' as 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant',
    colors: {
      primary: '#ef4444',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter',
      accent: 'Inter',
    },
  });

  const [userForm, setUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: 'user' as 'user' | 'pro' | 'enterprise' | 'admin' | 'superadmin',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    plan: 'free' as 'free' | 'pro' | 'enterprise',
  });

  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'Building',
    color: '#ef4444',
    isActive: true,
  });

  // Check if user is superadmin
  useEffect(() => {
    const user = authStorage.getUser();
    if (!user || user.role !== 'superadmin') {
      toast.error('❌ Ruxsat yo‘q. Faqat SuperAdmin kirishi mumkin.');
      navigate('/dashboard');
    }

    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load statistics
      const allProjects = optimizedStorage.getAllProjects();
      const allThemes = themeRegistry.getAllThemes();
      const allIcons = iconRegistry.getAllIcons();

      setStats({
        totalUsers: 150, // Mock data - in real app, fetch from API
        totalProjects: allProjects.length,
        totalTemplates: 25,
        totalThemes: allThemes.length,
        totalIcons: allIcons.length,
        activeUsers: 120,
        publishedWebsites: allProjects.filter(p => p.isPublished).length,
        premiumUsers: 45,
      });

      // Load themes
      setThemes(allThemes);

      // Load icons
      setIcons(allIcons);

      // Load mock users
      setUsers(generateMockUsers());

      // Load categories
      setCategories(generateMockCategories());

      // Load projects with user info
      setProjects(generateMockProjects(allProjects));

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockUsers = (): AdminUser[] => {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
        role: 'pro',
        status: 'active',
        plan: 'pro',
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(),
        projectsCount: 5,
        storageUsed: 250,
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
        role: 'enterprise',
        status: 'active',
        plan: 'enterprise',
        createdAt: new Date('2024-01-10'),
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        projectsCount: 12,
        storageUsed: 850,
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'user',
        status: 'active',
        plan: 'free',
        createdAt: new Date('2024-02-01'),
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        projectsCount: 2,
        storageUsed: 45,
      },
    ];
  };

  const generateMockCategories = (): WebsiteCategory[] => {
    return [
      {
        id: 'business',
        name: 'Business',
        description: 'Professional business websites',
        icon: 'Building',
        color: '#3b82f6',
        isActive: true,
        projectsCount: 45,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Personal and creative portfolios',
        icon: 'Briefcase',
        color: '#8b5cf6',
        isActive: true,
        projectsCount: 32,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Online stores and shops',
        icon: 'ShoppingBag',
        color: '#10b981',
        isActive: true,
        projectsCount: 28,
        createdAt: new Date('2024-01-01'),
      },
    ];
  };

  const generateMockProjects = (realProjects: any[]): AdminProject[] => {
    const mockProjects = realProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      websiteUrl: project.websiteUrl,
      category: project.category,
      userId: project.userId || 'user-1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      themeId: project.themeId,
      isPublished: project.isPublished,
      sectionsCount: project.sections.length,
      viewsCount: Math.floor(Math.random() * 1000),
      likesCount: Math.floor(Math.random() * 100),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return mockProjects;
  };

  // Theme management
  const handleSaveTheme = () => {
    try {
      const theme: ThemeDefinition = {
        ...themeForm,
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '3rem',
        },
        typography: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.5rem',
          h4: '1.25rem',
          body: '1rem',
          small: '0.875rem',
          button: '1rem',
          headingWeight: 700,
          bodyWeight: 400,
          buttonWeight: 600,
          headingLineHeight: 1.2,
          bodyLineHeight: 1.6,
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
        animations: {
          duration: '0.3s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        isBuiltIn: false,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingItem) {
        themeRegistry.updateTheme(theme.id, theme);
        setThemes(prev => prev.map(t => t.id === theme.id ? theme : t));
        toast.success('Theme updated successfully');
      } else {
        themeRegistry.addTheme(theme);
        setThemes(prev => [...prev, theme]);
        toast.success('Theme created successfully');
      }

      setShowModal(false);
      setEditingItem(null);
      resetThemeForm();
    } catch (error) {
      toast.error('Failed to save theme');
    }
  };

  const handleDeleteTheme = (themeId: string) => {
    if (window.confirm('Are you sure you want to delete this theme?')) {
      themeRegistry.deleteTheme(themeId);
      setThemes(prev => prev.filter(t => t.id !== themeId));
      toast.success('Theme deleted successfully');
    }
  };

  const resetThemeForm = () => {
    setThemeForm({
      id: '',
      name: '',
      category: 'modern',
      colors: {
        primary: '#ef4444',
        secondary: '#64748b',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Inter',
        accent: 'Inter',
      },
    });
  };

  // User management
  const handleSaveUser = () => {
    try {
      const user: AdminUser = {
        ...userForm,
        id: editingItem?.id || `user-${Date.now()}`,
        avatar: editingItem?.avatar,
        createdAt: editingItem?.createdAt || new Date(),
        lastLoginAt: editingItem?.lastLoginAt || new Date(),
        projectsCount: editingItem?.projectsCount || 0,
        storageUsed: editingItem?.storageUsed || 0,
      };

      if (editingItem) {
        setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        toast.success('User updated successfully');
      } else {
        setUsers(prev => [...prev, user]);
        toast.success('User created successfully');
      }

      setShowModal(false);
      setEditingItem(null);
      resetUserForm();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their projects.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      id: '',
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      plan: 'free',
    });
  };

  // Category management
  const handleSaveCategory = () => {
    try {
      const category: WebsiteCategory = {
        ...categoryForm,
        id: editingItem?.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        projectsCount: editingItem?.projectsCount || 0,
        createdAt: editingItem?.createdAt || new Date(),
      };

      if (editingItem) {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        toast.success('Category updated successfully');
      } else {
        setCategories(prev => [...prev, category]);
        toast.success('Category created successfully');
      }

      setShowModal(false);
      setEditingItem(null);
      resetCategoryForm();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      id: '',
      name: '',
      description: '',
      icon: 'Building',
      color: '#ef4444',
      isActive: true,
    });
  };

  // Project management
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      optimizedStorage.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    }
  };

  const tabs = [
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'icons', label: 'Icons', icon: Star },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'websites', label: 'Websites', icon: Globe },
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      user: 'bg-gray-100 text-gray-700',
      pro: 'bg-blue-100 text-blue-700',
      enterprise: 'bg-purple-100 text-purple-700',
      admin: 'bg-orange-100 text-orange-700',
      superadmin: 'bg-red-100 text-red-700',
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading SuperAdmin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">SuperAdmin Dashboard</h1>
                <p className="text-gray-600 font-primary">Complete system administration and management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-xl border border-red-200">
                <Crown className="w-4 h-4" />
                <span className="font-medium font-primary">SuperAdmin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === id
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
                { title: 'Total Projects', value: stats.totalProjects, icon: Globe, color: 'bg-green-100 text-green-600' },
                { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'bg-purple-100 text-purple-600' },
                { title: 'Premium Users', value: stats.premiumUsers, icon: Crown, color: 'bg-yellow-100 text-yellow-600' },
                { title: 'Published Sites', value: stats.publishedWebsites, icon: Activity, color: 'bg-red-100 text-red-600' },
                { title: 'Total Themes', value: stats.totalThemes, icon: Palette, color: 'bg-indigo-100 text-indigo-600' },
                { title: 'Total Icons', value: stats.totalIcons, icon: Star, color: 'bg-pink-100 text-pink-600' },
                { title: 'Templates', value: stats.totalTemplates, icon: Layout, color: 'bg-cyan-100 text-cyan-600' },
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
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-primary">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 font-heading">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Add New Theme', icon: Palette, action: () => { setActiveTab('themes'); setShowModal(true); } },
                  { label: 'Add New User', icon: Users, action: () => { setActiveTab('users'); setShowModal(true); } },
                  { label: 'Add Category', icon: Tag, action: () => { setActiveTab('categories'); setShowModal(true); } },
                  { label: 'Export Data', icon: Download, action: () => toast.info('Export functionality') },
                  { label: 'System Settings', icon: Settings, action: () => toast.info('System settings') },
                  { label: 'View Analytics', icon: TrendingUp, action: () => toast.info('Analytics dashboard') },
                ].map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900 font-primary">{action.label}</span>
                    </button>
                  );
                })}
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
              <h2 className="text-2xl font-bold text-gray-900 font-heading">Theme Management</h2>
              <button
                onClick={() => {
                  resetThemeForm();
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                <Plus className="w-4 h-4" />
                Add Theme
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div key={theme.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 font-heading">{theme.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setThemeForm({
                            id: theme.id,
                            name: theme.name,
                            category: theme.category,
                            colors: theme.colors,
                            fonts: theme.fonts,
                          });
                          setEditingItem(theme);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      {!theme.isBuiltIn && (
                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-primary">Category: {theme.category}</p>
                    <p className="font-primary">Font: {theme.fonts.primary}</p>
                    {theme.isPremium && (
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3 mr-1" />
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
              <h2 className="text-2xl font-bold text-gray-900 font-heading">Icon Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>
                <button
                  onClick={() => toast.info('Add icon functionality')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add Icon
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-4">
                {icons
                  .filter(icon =>
                    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .slice(0, 96)
                  .map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <div
                        key={icon.id}
                        className="group relative p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <IconComponent className="w-6 h-6 text-gray-700 mx-auto" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {icon.name}
                        </div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toast.info(`Edit ${icon.name}`)}
                            className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                          </button>
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
              <h2 className="text-2xl font-bold text-gray-900 font-heading">User Management</h2>
              <button
                onClick={() => {
                  resetUserForm();
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Plan</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Projects</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Storage</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 font-primary">{user.name}</div>
                              <div className="text-sm text-gray-600 font-primary">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-primary capitalize">{user.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-primary">{user.projectsCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-primary">{user.storageUsed} MB</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setUserForm({
                                  id: user.id,
                                  name: user.name,
                                  email: user.email,
                                  role: user.role,
                                  status: user.status,
                                  plan: user.plan,
                                });
                                setEditingItem(user);
                                setShowModal(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
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
              <h2 className="text-2xl font-bold text-gray-900 font-heading">Website Categories</h2>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const iconMap: Record<string, any> = {
                  Building, Briefcase, ShoppingBag, Camera, Music, Utensils,
                  GraduationCap, Car, Home, Gamepad2, User
                };
                const IconComponent = iconMap[category.icon] || Building;

                return (
                  <div key={category.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 font-heading">{category.name}</h3>
                          <p className="text-sm text-gray-600 font-primary">{category.projectsCount} projects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCategoryForm({
                              id: category.id,
                              name: category.name,
                              description: category.description,
                              icon: category.icon,
                              color: category.color,
                              isActive: category.isActive,
                            });
                            setEditingItem(category);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 font-primary">{category.description}</p>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500 font-primary">
                        Created {category.createdAt.toLocaleDateString()}
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
              <h2 className="text-2xl font-bold text-gray-900 font-heading">Website Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Website</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Owner</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Sections</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Views</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects
                      .filter(project =>
                        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.userName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 font-primary">{project.name}</div>
                              <div className="text-sm text-gray-600 font-primary">/{project.websiteUrl}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 font-primary">{project.userName}</div>
                              <div className="text-sm text-gray-600 font-primary">{project.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900 font-primary capitalize">{project.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                              {project.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900 font-primary">{project.sectionsCount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900 font-primary">{project.viewsCount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/site/${project.websiteUrl}`, '_blank')}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="View Website"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => navigate(`/editor/${project.id}`)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Edit Website"
                              >
                                <Edit3 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Delete Website"
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
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 font-heading">
                  {editingItem ? 'Edit' : 'Add'} {
                    activeTab === 'themes' ? 'Theme' :
                      activeTab === 'users' ? 'User' :
                        activeTab === 'categories' ? 'Category' : 'Item'
                  }
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Theme Form */}
              {activeTab === 'themes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Theme Name</label>
                      <input
                        type="text"
                        value={themeForm.name}
                        onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                        placeholder="Enter theme name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category</label>
                      <select
                        value={themeForm.category}
                        onChange={(e) => setThemeForm({ ...themeForm, category: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="minimal">Minimal</option>
                        <option value="bold">Bold</option>
                        <option value="elegant">Elegant</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 font-primary">Colors</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(themeForm.colors).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-gray-600 mb-1 font-primary capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => setThemeForm({
                                ...themeForm,
                                colors: { ...themeForm.colors, [key]: e.target.value }
                              })}
                              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setThemeForm({
                                ...themeForm,
                                colors: { ...themeForm.colors, [key]: e.target.value }
                              })}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 font-primary">Fonts</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(themeForm.fonts).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-gray-600 mb-1 font-primary capitalize">{key}</label>
                          <select
                            value={value}
                            onChange={(e) => setThemeForm({
                              ...themeForm,
                              fonts: { ...themeForm.fonts, [key]: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Merriweather">Merriweather</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTheme}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                    >
                      {editingItem ? 'Update' : 'Create'} Theme
                    </button>
                  </div>
                </div>
              )}

              {/* User Form */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Full Name</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="user">User</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Status</label>
                      <select
                        value={userForm.status}
                        onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Plan</label>
                      <select
                        value={userForm.plan}
                        onChange={(e) => setUserForm({ ...userForm, plan: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUser}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                    >
                      {editingItem ? 'Update' : 'Create'} User
                    </button>
                  </div>
                </div>
              )}

              {/* Category Form */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Category Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Icon</label>
                      <select
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                      >
                        <option value="Building">Building</option>
                        <option value="Briefcase">Briefcase</option>
                        <option value="ShoppingBag">Shopping Bag</option>
                        <option value="Camera">Camera</option>
                        <option value="Music">Music</option>
                        <option value="Utensils">Utensils</option>
                        <option value="GraduationCap">Graduation Cap</option>
                        <option value="Car">Car</option>
                        <option value="Home">Home</option>
                        <option value="Gamepad2">Gamepad</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                      placeholder="Enter category description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                          className="w-12 h-12 border border-gray-300 rounded-xl cursor-pointer"
                        />
                        <input
                          type="text"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">Status</label>
                      <div className="flex items-center gap-4 pt-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isActive"
                            checked={categoryForm.isActive}
                            onChange={() => setCategoryForm({ ...categoryForm, isActive: true })}
                            className="mr-2"
                          />
                          <span className="font-primary">Active</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isActive"
                            checked={!categoryForm.isActive}
                            onChange={() => setCategoryForm({ ...categoryForm, isActive: false })}
                            className="mr-2"
                          />
                          <span className="font-primary">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCategory}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                    >
                      {editingItem ? 'Update' : 'Create'} Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;