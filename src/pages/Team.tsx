import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
    Users,
    Plus,
    Mail,
    Crown,
    Edit3,
    Eye,
    Settings,
    UserPlus,
    Copy,
    X,
    Clock,
    Shield,
    Star,
    CheckCircle,
    MoreVertical,
    Search,
    Globe,
    UserX,
    Calendar,
    Activity,
    Link as LinkIcon,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'editor' | 'designer' | 'viewer';
    status: 'active' | 'pending' | 'inactive';
    joinedAt: Date;
    lastActive: Date;
    permissions: string[];
    projects: string[];
}

interface TeamInvite {
    id: string;
    email: string;
    role: 'admin' | 'editor' | 'designer' | 'viewer';
    invitedBy: string;
    invitedAt: Date;
    expiresAt: Date;
    status: 'pending' | 'accepted' | 'expired' | 'cancelled';
    message?: string;
}

const Team: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'settings'>('members');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showMemberDetails, setShowMemberDetails] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Check subscription
    const userSubscription = optimizedStorage.getUserSubscription();
    const isPro = userSubscription?.plan === 'pro' || userSubscription?.plan === 'enterprise';

    // Mock data - in a real app, this would come from your backend
    const [teamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
            role: 'owner',
            status: 'active',
            joinedAt: new Date('2024-01-15'),
            lastActive: new Date(),
            permissions: ['all'],
            projects: ['project-1', 'project-2', 'project-3'],
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael@company.com',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
            role: 'admin',
            status: 'active',
            joinedAt: new Date('2024-01-20'),
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            permissions: ['manage_projects', 'invite_members', 'edit_content'],
            projects: ['project-1', 'project-2'],
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily@company.com',
            avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
            role: 'designer',
            status: 'active',
            joinedAt: new Date('2024-02-01'),
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            permissions: ['edit_design', 'view_projects'],
            projects: ['project-1'],
        },
        {
            id: '4',
            name: 'David Kim',
            email: 'david@company.com',
            role: 'editor',
            status: 'pending',
            joinedAt: new Date('2024-02-10'),
            lastActive: new Date('2024-02-10'),
            permissions: ['edit_content', 'view_projects'],
            projects: [],
        },
    ]);

    const [pendingInvites] = useState<TeamInvite[]>([
        {
            id: '1',
            email: 'john@company.com',
            role: 'editor',
            invitedBy: 'Sarah Johnson',
            invitedAt: new Date('2024-02-15'),
            expiresAt: new Date('2024-02-22'),
            status: 'pending',
            message: 'Welcome to our design team! Looking forward to collaborating with you.',
        },
        {
            id: '2',
            email: 'lisa@company.com',
            role: 'viewer',
            invitedBy: 'Michael Chen',
            invitedAt: new Date('2024-02-14'),
            expiresAt: new Date('2024-02-21'),
            status: 'pending',
        },
    ]);

    // Invite form state
    const [inviteForm, setInviteForm] = useState({
        email: '',
        role: 'editor' as 'admin' | 'editor' | 'designer' | 'viewer',
        message: '',
        projects: [] as string[],
    });

    const roles = [
        {
            id: 'owner',
            name: 'Owner',
            description: 'Full access to everything including billing and team management',
            icon: Crown,
            color: 'text-purple-600 bg-purple-100',
            permissions: ['All permissions'],
        },
        {
            id: 'admin',
            name: 'Admin',
            description: 'Manage team members, projects, and most settings',
            icon: Shield,
            color: 'text-blue-600 bg-blue-100',
            permissions: ['Manage projects', 'Invite members', 'Edit content', 'View analytics'],
        },
        {
            id: 'editor',
            name: 'Editor',
            description: 'Edit content and manage assigned projects',
            icon: Edit3,
            color: 'text-green-600 bg-green-100',
            permissions: ['Edit content', 'View projects', 'Export projects'],
        },
        {
            id: 'designer',
            name: 'Designer',
            description: 'Focus on design and visual elements',
            icon: Star,
            color: 'text-orange-600 bg-orange-100',
            permissions: ['Edit design', 'View projects', 'Access design tools'],
        },
        {
            id: 'viewer',
            name: 'Viewer',
            description: 'View projects and provide feedback',
            icon: Eye,
            color: 'text-gray-600 bg-gray-100',
            permissions: ['View projects', 'Add comments'],
        },
    ];

    const handleInviteMember = () => {
        if (!inviteForm.email) {
            alert('Please enter an email address');
            return;
        }

        // In a real app, this would send an API request
        alert(`Invitation sent to ${inviteForm.email} as ${inviteForm.role}`);
        setShowInviteModal(false);
        setInviteForm({ email: '', role: 'editor', message: '', projects: [] });
    };

    const handleCopyInviteLink = (inviteId: string) => {
        const link = `${window.location.origin}/invite/${inviteId}`;
        navigator.clipboard.writeText(link);
        alert('Invite link copied to clipboard!');
    };

    const handleRemoveMember = (memberId: string) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            // In a real app, this would send an API request
            alert('Team member removed successfully');
        }
    };

    const handleChangeRole = (memberId: string, newRole: string) => {
        // In a real app, this would send an API request
        alert(`Role changed to ${newRole}`);
    };

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            inactive: 'bg-gray-100 text-gray-700 border-gray-200',
        };

        const icons = {
            active: CheckCircle,
            pending: Clock,
            inactive: UserX,
        };

        const IconComponent = icons[status as keyof typeof icons];

        return (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
                <IconComponent className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };

    const getRoleIcon = (role: string) => {
        const roleData = roles.find(r => r.id === role);
        if (!roleData) return Users;
        return roleData.icon;
    };

    const getRoleColor = (role: string) => {
        const roleData = roles.find(r => r.id === role);
        return roleData?.color || 'text-gray-600 bg-gray-100';
    };

    const tabs = [
        { id: 'members', label: t('team.tabs.members'), icon: Users },
        { id: 'invites', label: t('team.tabs.invites'), icon: Mail },
        { id: 'settings', label: t('team.tabs.settings'), icon: Settings },
    ];

    if (!isPro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
                <CommonHeader />

                {/* Upgrade Prompt */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                                <Users className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Crown className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
                            {t('team.upgradeTitle')}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-primary">
                            {t('team.upgradeDescription')}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {[
                                {
                                    icon: UserPlus,
                                    title: t('team.upgrade.features.inviteMembers'),
                                    description: t('team.upgrade.features.inviteMembersDesc'),
                                },
                                {
                                    icon: Shield,
                                    title: t('team.upgrade.features.roleBasedAccess'),
                                    description: t('team.upgrade.features.roleBasedAccessDesc'),
                                },
                                {
                                    icon: Activity,
                                    title: t('team.upgrade.features.realTimeCollab'),
                                    description: t('team.upgrade.features.realTimeCollabDesc'),
                                },
                            ].map(({ icon: Icon, title, description }, index) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
                                >
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{title}</h3>
                                    <p className="text-gray-600 font-primary">{description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/billing')}
                                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg text-lg font-heading"
                            >
                                {t('team.upgrade.upgradeToPro')}
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold font-primary"
                            >
                                {t('team.upgrade.backToDashboard')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <CommonHeader />

            {/* Page Header */}
            <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('team.title')}</h1>
                                <p className="text-gray-600 font-primary">{t('team.subtitle', { count: teamMembers.length })}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg font-heading"
                        >
                            <UserPlus className="w-5 h-5" />
                            {t('team.inviteMember')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === id
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="font-primary">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Team Members Tab */}
                {activeTab === 'members' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('team.searchMembers')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                                    />
                                </div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                                >
                                    <option value="all">{t('team.allRoles')}</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Members Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredMembers.map((member) => {
                                const RoleIcon = getRoleIcon(member.role);

                                return (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {member.avatar ? (
                                                        <img
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                                            <Users className="w-6 h-6 text-white" />
                                                        </div>
                                                    )}
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' :
                                                        member.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 font-primary">{member.name}</h3>
                                                    <p className="text-sm text-gray-600 font-primary">{member.email}</p>
                                                </div>
                                            </div>

                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleColor(member.role)}`}>
                                                <RoleIcon className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900 font-primary">
                                                {roles.find(r => r.id === member.role)?.name}
                                            </span>
                                            {getStatusBadge(member.status)}
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-primary">{t('team.joined')} {member.joinedAt.toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4" />
                                                <span className="font-primary">
                                                    {t('team.lastActive')} {member.lastActive.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" />
                                                <span className="font-primary">{member.projects.length} {t('team.projects')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowMemberDetails(member.id)}
                                                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium font-primary"
                                            >
                                                {t('team.viewDetails')}
                                            </button>
                                            {member.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium font-primary"
                                                >
                                                    {t('team.remove')}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Pending Invites Tab */}
                {activeTab === 'invites' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 font-heading">{t('team.invites.title')}</h2>
                                        <p className="text-gray-600 font-primary">{t('team.invites.subtitle')}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowInviteModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {t('team.invites.newInvite')}
                                    </button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {pendingInvites.map((invite) => (
                                    <div key={invite.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 font-primary">{invite.email}</div>
                                                <div className="text-sm text-gray-600 font-primary">
                                                    {t('team.invites.invitedAs')} {invite.role} {t('team.invites.by')} {invite.invitedBy}
                                                </div>
                                                <div className="text-xs text-gray-500 font-primary">
                                                    {t('team.invites.expires')} {invite.expiresAt.toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${invite.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                invite.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                            </div>

                                            <button
                                                onClick={() => handleCopyInviteLink(invite.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title={t('team.invites.copyLink')}
                                            >
                                                <Copy className="w-4 h-4 text-gray-600" />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (window.confirm(t('team.invites.confirmCancel'))) {
                                                        // In a real app, this would cancel the invite
                                                        alert(t('team.invites.inviteCancelled'));
                                                    }
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                                                title={t('team.invites.cancel')}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pendingInvites.length === 0 && (
                                <div className="p-12 text-center">
                                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{t('team.invites.noInvites')}</h3>
                                    <p className="text-gray-600 font-primary">{t('team.invites.noInvitesDesc')}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Team Settings Tab */}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">{t('team.settings.title')}</h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <div className="font-medium text-gray-900 font-primary">{t('team.settings.allowInvites')}</div>
                                        <div className="text-sm text-gray-600 font-primary">{t('team.settings.allowInvitesDesc')}</div>
                                    </div>
                                    <button className="w-12 h-6 bg-red-600 rounded-full">
                                        <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <div className="font-medium text-gray-900 font-primary">{t('team.settings.requireApproval')}</div>
                                        <div className="text-sm text-gray-600 font-primary">{t('team.settings.requireApprovalDesc')}</div>
                                    </div>
                                    <button className="w-12 h-6 bg-gray-300 rounded-full">
                                        <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <div className="font-medium text-gray-900 font-primary">{t('team.settings.realTimeCollab')}</div>
                                        <div className="text-sm text-gray-600 font-primary">{t('team.settings.realTimeCollabDesc')}</div>
                                    </div>
                                    <button className="w-12 h-6 bg-red-600 rounded-full">
                                        <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">{t('team.settings.rolePermissions')}</h3>

                            <div className="space-y-4">
                                {roles.slice(1).map((role) => {
                                    const Icon = role.icon;
                                    return (
                                        <div key={role.id} className="p-4 border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 font-primary">{role.name}</div>
                                                    <div className="text-sm text-gray-600 font-primary">{role.description}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {role.permissions.map((permission) => (
                                                    <span
                                                        key={permission}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium font-primary"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 font-heading">{t('team.inviteModal.title')}</h3>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('team.inviteModal.emailAddress')}</label>
                                <input
                                    type="email"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                    placeholder={t('team.inviteModal.emailPlaceholder')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('team.inviteModal.role')}</label>
                                <select
                                    value={inviteForm.role}
                                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                                >
                                    {roles.slice(1, -1).map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} - {role.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">
                                    {t('team.inviteModal.personalMessage')} (Optional)
                                </label>
                                <textarea
                                    value={inviteForm.message}
                                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                                    placeholder={t('team.inviteModal.messagePlaceholder')}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-primary"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleInviteMember}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
                            >
                                {t('team.inviteModal.sendInvite')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Team;