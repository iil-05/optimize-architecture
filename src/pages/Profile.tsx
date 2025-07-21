import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Moon,
  Sun,
  Monitor,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Crown,
  Star,
  AlertCircle,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data
  const userData = optimizedStorage.getUser();
  const userPreferences = optimizedStorage.getUserPreferences();
  const userSubscription = optimizedStorage.getUserSubscription();

  // Form states
  const [profile, setProfile] = useState({
    name: userData?.name || 'User',
    email: userData?.email || 'user@templates.uz',
    avatar: userData?.avatar || '',
    company: userData?.company || '',
    website: userData?.website || '',
    bio: userData?.bio || '',
  });

  const [preferences, setPreferences] = useState({
    theme: userPreferences?.theme || 'light',
    language: userPreferences?.language || 'en',
    timezone: userPreferences?.timezone || 'UTC',
    notifications: {
      email: userPreferences?.notifications?.email ?? true,
      push: userPreferences?.notifications?.push ?? true,
      marketing: userPreferences?.notifications?.marketing ?? false,
    },
    editor: {
      autoSave: userPreferences?.editor?.autoSave ?? true,
      autoSaveInterval: userPreferences?.editor?.autoSaveInterval || 30,
      showGrid: userPreferences?.editor?.showGrid ?? false,
      snapToGrid: userPreferences?.editor?.snapToGrid ?? true,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      let avatarBase64 = profile.avatar;

      if (avatarFile) {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      const updatedProfile = {
        ...profile,
        avatar: avatarBase64,
      };

      optimizedStorage.saveUser(updatedProfile);
      optimizedStorage.saveUserPreferences(preferences);

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview('');

      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // In a real app, you would validate the current password and update it
    alert('Password updated successfully!');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete all your data.')) {
      optimizedStorage.clearAll();
      alert('Account deleted successfully');
      navigate('/dashboard');
    }
  };

  const getSubscriptionBadge = () => {
    const plan = userSubscription?.plan || 'free';
    const colors = {
      free: 'bg-gray-100 text-gray-700 border-gray-200',
      pro: 'bg-primary-100 text-primary-700 border-primary-200',
      enterprise: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const icons = {
      free: Star,
      pro: Crown,
      enterprise: Crown,
    };

    const IconComponent = icons[plan as keyof typeof icons];

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colors[plan as keyof typeof colors]}`}>
        <IconComponent className="w-4 h-4" />
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('profile.title')}</h1>
                <p className="text-gray-600 font-primary">{t('profile.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getSubscriptionBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center">
                    {avatarPreview || profile.avatar ? (
                      <img
                        src={avatarPreview || profile.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>

                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1 font-heading">{profile.name}</h2>
                <p className="text-gray-600 mb-4 font-primary">{profile.email}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-primary">Member since</span>
                    <span className="font-medium font-primary">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-primary">Projects</span>
                    <span className="font-medium font-primary">{optimizedStorage.getAllProjects().length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-primary">Plan</span>
                    {getSubscriptionBadge()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-heading">{t('profile.personalInfo.title')}</h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isEditing ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  {isSaving ? t('profile.personalInfo.saving') : isEditing ? t('profile.personalInfo.save') : t('profile.personalInfo.edit')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.personalInfo.fullName')}</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.personalInfo.email')}</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.personalInfo.company')}</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing}
                    placeholder={t('profile.personalInfo.companyPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.personalInfo.website')}</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder={t('profile.personalInfo.websitePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 font-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.personalInfo.bio')}</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder={t('profile.personalInfo.bioPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none font-primary"
                  />
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('profile.preferences.title')}</h3>

              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('profile.preferences.theme')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: t('profile.preferences.light'), icon: Sun },
                      { value: 'dark', label: t('profile.preferences.dark'), icon: Moon },
                      { value: 'auto', label: t('profile.preferences.auto'), icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setPreferences({ ...preferences, theme: value as any })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${preferences.theme === value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium font-primary">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('profile.preferences.language')}</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  >
                    <option value="en">{t('profile.preferences.english')}</option>
                    <option value="es">{t('profile.preferences.spanish')}</option>
                    <option value="fr">{t('profile.preferences.french')}</option>
                    <option value="de">{t('profile.preferences.german')}</option>
                    <option value="uz">{t('profile.preferences.uzbek')}</option>
                  </select>
                </div>

                {/* Notifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('profile.preferences.notifications')}</label>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: t('profile.preferences.emailNotifications'), description: t('profile.preferences.emailNotificationsDesc') },
                      { key: 'push', label: t('profile.preferences.pushNotifications'), description: t('profile.preferences.pushNotificationsDesc') },
                      { key: 'marketing', label: t('profile.preferences.marketingEmails'), description: t('profile.preferences.marketingEmailsDesc') },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900 font-primary">{label}</div>
                          <div className="text-sm text-gray-600 font-primary">{description}</div>
                        </div>
                        <button
                          onClick={() => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              [key]: !preferences.notifications[key as keyof typeof preferences.notifications]
                            }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${preferences.notifications[key as keyof typeof preferences.notifications]
                              ? 'bg-primary-600'
                              : 'bg-gray-300'
                            }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.notifications[key as keyof typeof preferences.notifications]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                            }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('profile.security.title')}</h3>

              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 font-primary">{t('profile.security.changePassword')}</div>
                      <div className="text-sm text-gray-600 font-primary">{t('profile.security.changePasswordDesc')}</div>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium text-red-900 font-primary">{t('profile.security.deleteAccount')}</div>
                      <div className="text-sm text-red-600 font-primary">{t('profile.security.deleteAccountDesc')}</div>
                    </div>
                  </div>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-heading">{t('profile.security.changePassword')}</h3>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.security.currentPassword')}</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.security.newPassword')}</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('profile.security.confirmNewPassword')}</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                {t('profile.security.updatePassword')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Confirmation */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{t('profile.security.deleteAccount')}</h3>
              <p className="text-gray-600 font-primary">
                {t('profile.security.deleteAccountWarning')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                {t('profile.security.deleteAccount')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;