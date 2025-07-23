import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth';
import {
  Layout,
  ChevronDown,
  User,
  LogOut,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  Palette,
  Menu,
  X,
  Shield
} from 'lucide-react'

interface Language {
  code: string
  name: string
  flag: string
  flagIcon: string
}

const CommonHeader: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { logout: authLogout, user } = useAuth()
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Check if user is superadmin
  const isSuperAdmin = user?.role === 'superadmin'

  const languages: Language[] = [
    { code: 'en', name: t('header.language.english'), flag: '🇬🇧', flagIcon: '/images/flags/gb.svg' },
    { code: 'ru', name: t('header.language.russian'), flag: '🇷🇺', flagIcon: '/images/flags/ru.svg' },
    { code: 'uz', name: t('header.language.uzbek'), flag: '🇺🇿', flagIcon: '/images/flags/uz.svg' },
    { code: 'tj', name: t('header.language.tajik'), flag: '🇹🇯', flagIcon: '/images/flags/tj.svg' }
  ]

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'uz'
    return languages.find((lang) => lang.code === savedLang) || languages[0]
  })

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'uz'
    const foundLang = languages.find((lang) => lang.code === savedLang)
    if (foundLang) setSelectedLanguage(foundLang)
  }, [i18n.language])

  const navItems = [
    { label: t('header.nav.dashboard'), href: '/dashboard', icon: Layout },
    { label: t('header.nav.templates'), href: '/templates', icon: Palette },
    { label: t('header.nav.billing'), href: '/billing', icon: CreditCard },
    { label: t('header.nav.team'), href: '/team', icon: Users }
  ]

  const isActive = (path: string) => location.pathname === path

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language.code)
    setSelectedLanguage(language)
    setIsLanguageDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Logout function
  const handleLogout = async () => {
    await authLogout();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-elegant border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <img
                  src="/images/logo_2.png"
                  className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 rounded-xl shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-105"
                  alt="Logo"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="font-display font-bold text-base sm:text-lg lg:text-2xl">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Templates</span>
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">.uz</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-6 xl:ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl group flex items-center gap-2 font-sans ${isActive(item.href)
                      ? 'text-primary-600 bg-primary-50 shadow-inner-glow'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-3/4 ${isActive(item.href) ? 'w-3/4' : ''
                      }`}></span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-2 xl:px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50 font-sans"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <img
                  src={selectedLanguage.flagIcon}
                  alt={selectedLanguage.name}
                  className="w-4 xl:w-5 h-3 xl:h-4 rounded-sm shadow-sm"
                />
                <span className="text-xs xl:text-sm font-medium hidden xl:inline">{selectedLanguage.name}</span>
                <ChevronDown className={`w-3 xl:w-4 h-3 xl:h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 xl:w-48 bg-white rounded-xl shadow-elegant-lg border border-gray-200 py-2 z-50 backdrop-blur-lg">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className="flex items-center px-3 xl:px-4 py-2 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 w-full text-left transition-colors font-sans"
                      onClick={() => handleLanguageChange(language)}
                    >
                      <img
                        src={language.flagIcon}
                        alt={language.name}
                        className="w-4 xl:w-5 h-3 xl:h-4 mr-2 xl:mr-3 rounded-sm shadow-sm"
                      />
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 px-2 xl:px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50 font-sans"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-glow">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="hidden xl:inline text-sm font-medium">{user?.name || 'User'}</span>
                <ChevronDown className={`w-3 xl:w-4 h-3 xl:h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elegant-lg border border-gray-200 py-2 z-50 backdrop-blur-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-600">{user?.email || 'user@templates.uz'}</div>
                  </div>
                  <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-sans" onClick={() => setIsProfileDropdownOpen(false)}>
                    <User className="w-4 h-4 mr-3" />
                    {t('header.profile.profile')}
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-sans" onClick={() => setIsProfileDropdownOpen(false)}>
                    <Settings className="w-4 h-4 mr-3" />
                    {t('header.profile.settings')}
                  </Link>
                  <Link to="/support" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-sans" onClick={() => setIsProfileDropdownOpen(false)}>
                    <HelpCircle className="w-4 h-4 mr-3" />
                    {t('header.profile.support')}
                  </Link>
                  {isSuperAdmin && (
                    <Link to="/superadmin" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-sans" onClick={() => setIsProfileDropdownOpen(false)}>
                      <Shield className="w-4 h-4 mr-3" />
                      SuperAdmin
                    </Link>
                  )}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button onClick={handleLogout} className="flex items-center px-4 py-3 text-sm text-primary-600 hover:bg-primary-50 w-full text-left transition-colors font-sans">
                    <LogOut className="w-4 h-4 mr-3" />
                    {t('header.profile.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Language Selector */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 px-2 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50 font-sans"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <img
                  src={selectedLanguage.flagIcon}
                  alt={selectedLanguage.name}
                  className="w-4 h-3 rounded-sm shadow-sm"
                />
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-elegant-lg border border-gray-200 py-2 z-50 backdrop-blur-lg">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-600 w-full text-left transition-colors font-sans"
                      onClick={() => handleLanguageChange(language)}
                    >
                      <img
                        src={language.flagIcon}
                        alt={language.name}
                        className="w-4 h-3 mr-2 rounded-sm shadow-sm"
                      />
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-2 text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2 bg-white/95 backdrop-blur-xl">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl mx-2 ${isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}

            {isSuperAdmin && (
              <Link to="/superadmin" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-xl mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Shield className="w-5 h-5" />
                SuperAdmin
              </Link>
            )}

            <div className="border-t border-gray-200 mt-4 pt-4 mx-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                {t('header.profile.profile')}
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                {t('header.profile.settings')}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors rounded-xl w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                {t('header.profile.logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default CommonHeader