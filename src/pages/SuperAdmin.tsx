import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Shield,
  Users,
  Globe,
  BarChart3,
  Settings,
  Database,
  Palette,
  Search,
  Filter,
  Eye,
  Heart,
  Coins,
  Star,
  Edit3,
  Trash2,
  Plus,
  X,
  Check,
  Crown,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Building,
  User,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Camera,
  Music,
  Gamepad2,
  Utensils,
  Car,
  Home,
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
import CommonHeader from '../components/CommonHeader';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLoginAt: Date;
  projectsCount: number;
  storageUsed: number;
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
  coinsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  publishedProjects: number;
  totalTemplates: number;
  totalViews: number;
  totalLikes: number;
  totalCoins: number;
  storageUsed: number;
  dailyStats: Array<{ date: string; users: number; projects: number; views: number }>;
}

const SuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { updateProject } = useProject();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'analytics' | 'settings' | 'database' | 'templates'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminProject | null>(null);

  // Check if user is superadmin
  const isAuthorized = optimizedStorage.isSuperAdmin();

  useEffect(() => {
    if (!isAuthorized) {
      console.log('🔒 Access denied: SuperAdmin privileges required');
      navigate('/dashboard');
      return;
    }
  }, [isAuthorized, navigate]);

  // Load data
  const [users] = useState<AdminUser[]>(optimizedStorage.getAllUsersAdmin());
  const [projects, setProjects] = useState<AdminProject[]>(optimizedStorage.getAllProjectsAdmin());
  const [platformStats] = useState<PlatformStats>({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalProjects: projects.length,
    publishedProjects: projects.filter(p => p.isPublished).length,
    totalTemplates: projects.filter(p => p.isTemplate).length,
    totalViews: projects.reduce((sum, p) => sum + p.viewsCount, 0),
    totalLikes: projects.reduce((sum, p) => sum + p.likesCount, 0),
    totalCoins: projects.reduce((sum, p) => sum + p.coinsCount, 0),
    storageUsed: 2.4,
    dailyStats: [
      { date: '2024-01-15', users: 45, projects: 12, views: 234 },
      { date: '2024-01-16', users: 52, projects: 15, views: 289 },
      { date: '2024-01-17', users: 48, projects: 18, views: 312 },
      { date: '2024-01-18', users: 61, projects: 22, views: 387 },
      { date: '2024-01-19', users: 58, projects: 19, views: 356 },
      { date: '2024-01-20', users: 67, projects: 25, views: 423 },
      { date: '2024-01-21', users: 72, projects: 28, views: 467 },
    ]
  });

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'templates', label: 'Templates', icon: Palette },
  ];

  const handleToggleTemplate = async (project: AdminProject) => {
    try {
      const updatedProject = {
        ...project,
        isTemplate: !project.isTemplate,
        updatedAt: new Date()
      };

      await updateProject(project.id, { isTemplate: updatedProject.isTemplate });
      
      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === project.id ? updatedProject : p
      ));

      toast.success(
        updatedProject.isTemplate 
          ? 'Project added to template gallery!' 
          : 'Project removed from template gallery!'
      );
    } catch (error) {
      console.error('Error updating template status:', error);
      toast.error('Failed to update template status');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real app, this would call the API
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'published' && project.isPublished) ||
      (filterStatus === 'templates' && project.isTemplate) ||
      (filterStatus === 'drafts' && !project.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      suspended: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
      active: CheckCircle,
      inactive: Clock,
      suspended: AlertCircle,
    };

    const IconComponent = icons[status as keyof typeof icons];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-700',
      pro: 'bg-blue-100 text-blue-700',
      enterprise: 'bg-purple-100 text-purple-700',
    };

    const icons = {
      free: Star,
      pro: Crown,
      enterprise: Crown,
    };

    const IconComponent = icons[plan as keyof typeof icons];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors]}`}>
        <IconComponent className="w-3 h-3" />
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
    );
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the SuperAdmin panel.</p>
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
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading">SuperAdmin Panel</h1>
              <p className="text-gray-600 font-primary">Manage the entire Templates.uz platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: platformStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
                { label: 'Active Projects', value: platformStats.totalProjects.toLocaleString(), icon: Globe, color: 'bg-green-100 text-green-600' },
                { label: 'Templates', value: platformStats.totalTemplates.toLocaleString(), icon: Palette, color: 'bg-purple-100 text-purple-600' },
                { label: 'Total Views', value: platformStats.totalViews.toLocaleString(), icon: Eye, color: 'bg-orange-100 text-orange-600' },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-primary">{stat.label}</p>
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

            {/* Platform Activity Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Platform Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={platformStats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="projects" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Plan</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Projects</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Storage</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Last Login</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
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
                        <td className="px-6 py-4">{getPlanBadge(user.plan)}</td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-primary">{user.projectsCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-primary">{user.storageUsed} MB</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-primary">{user.lastLoginAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                >
                  <option value="all">All Projects</option>
                  <option value="published">Published</option>
                  <option value="templates">Templates</option>
                  <option value="drafts">Drafts</option>
                </select>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 font-heading">{project.name}</h3>
                      <p className="text-sm text-gray-600 font-primary">by {project.userName}</p>
                      <p className="text-xs text-gray-500 font-primary">{project.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.isPublished && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Published" />
                      )}
                      {project.isTemplate && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="Template" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-primary">Category:</span>
                      <span className="font-medium text-gray-900 font-primary capitalize">{project.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-primary">Sections:</span>
                      <span className="font-medium text-gray-900 font-primary">{project.sectionsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-primary">Views:</span>
                      <span className="font-medium text-gray-900 font-primary">{project.viewsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-primary">Likes:</span>
                      <span className="font-medium text-gray-900 font-primary">{project.likesCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-primary">Coins:</span>
                      <span className="font-medium text-gray-900 font-primary">{project.coinsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTemplate(project)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors font-primary ${
                        project.isTemplate
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {project.isTemplate ? 'Remove from Templates' : 'Add to Templates'}
                    </button>
                    <button
                      onClick={() => window.open(`/site/${project.websiteUrl}`, '_blank')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Site"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 font-heading">Template Gallery Management</h2>
                  <p className="text-gray-600 font-primary">Manage templates that appear in the public gallery</p>
                </div>
                <div className="text-sm text-gray-600 font-primary">
                  {projects.filter(p => p.isTemplate).length} templates active
                </div>
              </div>

              {/* Template Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(p => p.isTemplate)
                  .filter(project => {
                    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCategory = filterStatus === 'all' || project.category === filterStatus;
                    return matchesSearch && matchesCategory;
                  })
                  .map((template) => {
                    const categoryData = categories.find(c => c.id === template.category);
                    const CategoryIcon = categoryData?.icon || Building;

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 font-heading">{template.name}</h3>
                              <p className="text-sm text-gray-600 font-primary">by {template.userName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Palette className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600 font-primary">TEMPLATE</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900 font-primary">
                              <Eye className="w-4 h-4 text-gray-600" />
                              {template.viewsCount}
                            </div>
                            <div className="text-xs text-gray-600 font-primary">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900 font-primary">
                              <Heart className="w-4 h-4 text-red-500" />
                              {template.likesCount}
                            </div>
                            <div className="text-xs text-gray-600 font-primary">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900 font-primary">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              {template.coinsCount}
                            </div>
                            <div className="text-xs text-gray-600 font-primary">Coins</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/site/${template.websiteUrl}`, '_blank')}
                            className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium font-primary"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleToggleTemplate(template)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium font-primary"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              {projects.filter(p => p.isTemplate).length === 0 && (
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">No Templates</h3>
                  <p className="text-gray-600 font-primary">No projects have been marked as templates yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">Platform Analytics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={platformStats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="views" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Platform Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">Maintenance Mode</div>
                    <div className="text-sm text-gray-600 font-primary">Temporarily disable the platform</div>
                  </div>
                  <button className="w-12 h-6 bg-gray-300 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">New User Registration</div>
                    <div className="text-sm text-gray-600 font-primary">Allow new users to register</div>
                  </div>
                  <button className="w-12 h-6 bg-green-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Database Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-900 mb-2 font-primary">Storage Usage</div>
                  <div className="text-2xl font-bold text-gray-900 font-heading">{platformStats.storageUsed} GB</div>
                  <div className="text-sm text-gray-600 font-primary">of 100 GB used</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-900 mb-2 font-primary">Database Size</div>
                  <div className="text-2xl font-bold text-gray-900 font-heading">1.2 GB</div>
                  <div className="text-sm text-gray-600 font-primary">Total database size</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;