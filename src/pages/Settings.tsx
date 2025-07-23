import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Monitor,
  Sun,
  Moon,
  Globe,
  Clock,
  Calendar,
  Save,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Keyboard,
  Grid,
  Zap,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'advanced'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load user settings
  const userSettings = optimizedStorage.getUserSettings();
  
  const [settings, setSettings] = useState({
    general: {
      language: userSettings.preferences.language || 'en',
      timezone: userSettings.preferences.timezone || 'UTC',
      theme: 'light',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12hour',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      projectUpdates: true,
      teamInvites: true,
      systemAlerts: true,
      weeklyDigest: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowIndexing: true,
      dataCollection: true,
    },
    advanced: {
      autoSave: userSettings.preferences.autoSave ?? true,
      autoSaveInterval: 30,
      showGrid: userSettings.preferences.showGrid ?? false,
      snapToGrid: userSettings.preferences.snapToGrid ?? true,
      keyboardShortcuts: true,
      debugMode: false,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Update user settings in optimized storage
      const updatedSettings = {
        ...userSettings,
        preferences: {
          ...userSettings.preferences,
          language: settings.general.language,
          timezone: settings.general.timezone,
          autoSave: settings.advanced.autoSave,
          showGrid: settings.advanced.showGrid,
          snapToGrid: settings.advanced.snapToGrid,
        }
      };

      optimizedStorage.saveUserSettings(updatedSettings);
      
      toast.success(t('settings.saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'templates-uz-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    setSettings({
      general: {
        language: 'en',
        timezone: 'UTC',
        theme: 'light',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12hour',
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        projectUpdates: true,
        teamInvites: true,
        systemAlerts: true,
        weeklyDigest: false,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        allowIndexing: true,
        dataCollection: true,
      },
      advanced: {
        autoSave: true,
        autoSaveInterval: 30,
        showGrid: false,
        snapToGrid: true,
        keyboardShortcuts: true,
        debugMode: false,
      },
    });
    setShowResetConfirm(false);
    toast.success('Settings reset to defaults');
  };

  const tabs = [
    { id: 'general', label: t('settings.tabs.general'), icon: SettingsIcon },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'privacy', label: t('settings.tabs.privacy'), icon: Shield },
    { id: 'advanced', label: t('settings.tabs.advanced'), icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('settings.title')}</h1>
                <p className="text-gray-600 font-primary">{t('settings.subtitle')}</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg disabled:opacity-50 font-heading"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? t('settings.saving') : t('settings.saveChanges')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
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

        {/* General Settings */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.general.title')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('settings.general.language')}</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="uz">O'zbek</option>
                    <option value="tj">Тоҷикӣ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('settings.general.timezone')}</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Tashkent">Asia/Tashkent</option>
                    <option value="Asia/Dushanbe">Asia/Dushanbe</option>
                    <option value="Europe/Moscow">Europe/Moscow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('settings.general.theme')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: t('settings.general.light'), icon: Sun },
                      { value: 'dark', label: t('settings.general.dark'), icon: Moon },
                      { value: 'auto', label: t('settings.general.auto'), icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleSettingChange('general', 'theme', value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          settings.general.theme === value
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium font-primary">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('settings.general.dateFormat')}</label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('settings.general.timeFormat')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '12hour', label: t('settings.general.12hour') },
                      { value: '24hour', label: t('settings.general.24hour') },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleSettingChange('general', 'timeFormat', value)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          settings.general.timeFormat === value
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium font-primary">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.notifications.title')}</h3>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: t('settings.notifications.emailNotifications'), description: t('settings.notifications.emailNotificationsDesc') },
                  { key: 'pushNotifications', label: t('settings.notifications.pushNotifications'), description: t('settings.notifications.pushNotificationsDesc') },
                  { key: 'marketingEmails', label: t('settings.notifications.marketingEmails'), description: t('settings.notifications.marketingEmailsDesc') },
                  { key: 'projectUpdates', label: t('settings.notifications.projectUpdates'), description: t('settings.notifications.projectUpdatesDesc') },
                  { key: 'teamInvites', label: t('settings.notifications.teamInvites'), description: t('settings.notifications.teamInvitesDesc') },
                  { key: 'systemAlerts', label: t('settings.notifications.systemAlerts'), description: t('settings.notifications.systemAlertsDesc') },
                  { key: 'weeklyDigest', label: t('settings.notifications.weeklyDigest'), description: t('settings.notifications.weeklyDigestDesc') },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 font-primary">{label}</div>
                      <div className="text-sm text-gray-600 font-primary">{description}</div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('notifications', key, !settings.notifications[key as keyof typeof settings.notifications])}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notifications[key as keyof typeof settings.notifications]
                          ? 'bg-red-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications[key as keyof typeof settings.notifications]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.privacy.title')}</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-primary">{t('settings.privacy.profileVisibility')}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'public', label: t('settings.privacy.public'), description: t('settings.privacy.publicDesc') },
                      { value: 'private', label: t('settings.privacy.private'), description: t('settings.privacy.privateDesc') },
                      { value: 'team', label: t('settings.privacy.teamOnly'), description: t('settings.privacy.teamOnlyDesc') },
                    ].map(({ value, label, description }) => (
                      <button
                        key={value}
                        onClick={() => handleSettingChange('privacy', 'profileVisibility', value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          settings.privacy.profileVisibility === value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 font-primary">{label}</div>
                        <div className="text-sm text-gray-600 font-primary">{description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'showEmail', label: t('settings.privacy.showEmail'), description: t('settings.privacy.showEmailDesc') },
                    { key: 'allowIndexing', label: t('settings.privacy.allowIndexing'), description: t('settings.privacy.allowIndexingDesc') },
                    { key: 'dataCollection', label: t('settings.privacy.dataCollection'), description: t('settings.privacy.dataCollectionDesc') },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900 font-primary">{label}</div>
                        <div className="text-sm text-gray-600 font-primary">{description}</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('privacy', key, !settings.privacy[key as keyof typeof settings.privacy])}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.privacy[key as keyof typeof settings.privacy]
                            ? 'bg-red-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.privacy[key as keyof typeof settings.privacy]
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
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Editor Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.advanced.editorSettings')}</h3>

              <div className="space-y-4">
                {[
                  { key: 'autoSave', label: t('settings.advanced.autoSave'), description: t('settings.advanced.autoSaveDesc') },
                  { key: 'showGrid', label: t('settings.advanced.showGrid'), description: t('settings.advanced.showGridDesc') },
                  { key: 'snapToGrid', label: t('settings.advanced.snapToGrid'), description: t('settings.advanced.snapToGridDesc') },
                  { key: 'keyboardShortcuts', label: t('settings.advanced.keyboardShortcuts'), description: t('settings.advanced.keyboardShortcutsDesc') },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 font-primary">{label}</div>
                      <div className="text-sm text-gray-600 font-primary">{description}</div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('advanced', key, !settings.advanced[key as keyof typeof settings.advanced])}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.advanced[key as keyof typeof settings.advanced]
                          ? 'bg-red-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.advanced[key as keyof typeof settings.advanced]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-primary">{t('settings.advanced.autoSaveInterval')}</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.advanced.autoSaveInterval}
                    onChange={(e) => handleSettingChange('advanced', 'autoSaveInterval', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-primary"
                  />
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.advanced.dataManagement')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportSettings}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">{t('settings.advanced.exportSettings')}</div>
                    <div className="text-sm text-gray-600 font-primary">{t('settings.advanced.exportSettingsDesc')}</div>
                  </div>
                </button>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">{t('settings.advanced.importSettings')}</div>
                    <div className="text-sm text-gray-600 font-primary">{t('settings.advanced.importSettingsDesc')}</div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-red-900 font-primary">{t('settings.advanced.resetToDefaults')}</div>
                    <div className="text-sm text-red-600 font-primary">{t('settings.advanced.resetToDefaultsDesc')}</div>
                  </div>
                </button>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 font-primary">Storage Usage</div>
                    <div className="text-sm text-gray-600 font-primary">2.4 MB used</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t('settings.advanced.developerOptions')}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 font-primary">{t('settings.advanced.debugMode')}</div>
                    <div className="text-sm text-gray-600 font-primary">{t('settings.advanced.debugModeDesc')}</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('advanced', 'debugMode', !settings.advanced.debugMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.advanced.debugMode ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.advanced.debugMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">Reset Settings</h3>
              <p className="text-gray-600 font-primary">
                {t('settings.advanced.resetConfirm')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleResetToDefaults}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;