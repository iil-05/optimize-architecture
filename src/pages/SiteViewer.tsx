import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Heart,
  Eye,
  Clock,
  User,
  Building,
  AlertCircle,
  Loader2,
  Star,
  Calendar,
  Layers,
  Palette,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Home,
  Zap
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';
import { Project } from '../types';
import { optimizedStorage } from '../utils/optimizedStorage';

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects } = useProject();
  const { updateTheme, currentTheme } = useTheme();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [activeTheme, setActiveTheme] = useState(currentTheme);

  useEffect(() => {
    const loadWebsite = async () => {
      if (!websiteUrl) {
        setError('No website URL provided');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Looking for website with URL:', websiteUrl);
      console.log('📋 Available projects:', projects.map(p => ({ 
        id: p.id, 
        name: p.name, 
        websiteUrl: p.websiteUrl, 
        isPublished: p.isPublished 
      })));

      // First try to find in current projects
      let foundProject = projects.find(p => 
        p.websiteUrl === websiteUrl
      );

      // If not found in current projects, try to load from optimized storage
      if (!foundProject) {
        const allStoredProjects = optimizedStorage.getAllProjects();
        foundProject = allStoredProjects.find(p => 
          p.websiteUrl === websiteUrl
        );
      }
      
      if (foundProject) {
        console.log('✅ Found project:', foundProject);
        
        // Check if project is published or if we're in development mode
        const isDevelopment = import.meta.env.DEV;
        
        if (foundProject.isPublished || isDevelopment) {
          setProject(foundProject);
          
          // Apply project's theme
          if (foundProject.themeId) {
            const theme = themeRegistry.getTheme(foundProject.themeId);
            if (theme) {
              console.log('🎨 Applying theme:', theme.name);
              setActiveTheme(theme);
              updateTheme(foundProject.themeId);
            }
          }
          
          // Simulate view count increment
          const storedViews = localStorage.getItem(`site_views_${foundProject.id}`);
          const currentViews = storedViews ? parseInt(storedViews) : Math.floor(Math.random() * 500) + 50;
          setViewCount(currentViews + 1);
          localStorage.setItem(`site_views_${foundProject.id}`, (currentViews + 1).toString());
          
          // Update project analytics
          if (foundProject.analytics) {
            foundProject.analytics.views = currentViews + 1;
            foundProject.analytics.lastViewed = new Date();
            optimizedStorage.saveProject(foundProject);
          }
          
          setError(null);
        } else {
          console.log('❌ Website found but not published');
          setError('This website is not published yet');
        }
      } else {
        console.log('❌ Website not found');
        setError('Website not found');
      }
      
      setIsLoading(false);
    };

    loadWebsite();
  }, [websiteUrl, projects, updateTheme]);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = project?.name || 'Check out this website';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${project?.name} - Created with Templates.uz`,
          url
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Store like status in localStorage
    if (project) {
      localStorage.setItem(`site_liked_${project.id}`, (!isLiked).toString());
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      business: Building,
      personal: User,
      portfolio: User,
      ecommerce: Building,
      education: Building,
      photography: Eye,
      music: Heart,
      restaurant: Building,
      automotive: Building,
      realestate: Building,
      gaming: Building,
    };
    return icons[category] || Globe;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Loading Website...</h2>
          <p className="text-gray-600 font-primary">Please wait while we load {websiteUrl}</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-12 h-12 text-red-600" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-4 font-heading"
          >
            Website Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-8 font-primary leading-relaxed"
          >
            {error === 'This website is not published yet' 
              ? `The website "${websiteUrl}" exists but hasn't been published yet.`
              : `The website "${websiteUrl}" doesn't exist or has been removed.`
            }
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Go Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Create Your Website
            </button>
          </motion.div>

          {/* Show available websites for debugging in development */}
          {import.meta.env.DEV && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Available Websites (Dev Mode):</h3>
              <div className="space-y-1">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/site/${p.websiteUrl}`)}
                    className="block text-xs text-blue-700 hover:text-blue-900 underline"
                  >
                    {p.websiteUrl} - {p.name} {p.isPublished ? '(Published)' : '(Draft)'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm sm:text-base font-heading">{project.name}</h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-primary">{project.category}</span>
                  <span>•</span>
                  <span className="font-primary">{project.sections.length} sections</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="font-primary">{viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-primary">Updated {formatDate(project.updatedAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-xl transition-colors ${
                isLiked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <a
              href="/dashboard"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium font-primary"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create Your Own</span>
              <span className="sm:hidden">Create</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Website Content */}
      <div className="pt-16 sm:pt-20">
        {project.sections.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-lg px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Globe className="w-10 h-10 text-gray-400" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-4 font-heading"
              >
                Website Under Construction
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-8 font-primary"
              >
                This website is currently being built. Check back soon!
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Create Your Own Website
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {project.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <SectionRenderer
                    section={section}
                    isSelected={false}
                    onSelect={() => {}}
                    isPreview={true}
                    theme={activeTheme}
                    isEditing={false}
                    onEdit={() => {}}
                  />
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Website Info Sidebar - Only visible on larger screens */}
      <div className="hidden xl:block fixed top-24 right-6 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6 z-40">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 font-heading">{project.name}</h3>
              <p className="text-sm text-gray-600 font-primary">{project.category}</p>
            </div>
          </div>

          {project.description && (
            <p className="text-sm text-gray-700 leading-relaxed font-primary">
              {project.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{project.sections.length} sections</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{viewCount} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{formatDate(project.updatedAt)}</span>
            </div>
          </div>

          {project.seoKeywords && project.seoKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 font-heading">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {project.seoKeywords.slice(0, 6).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium font-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              Create Your Own Website
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stats Bar */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-primary">{project.sections.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
              <span className="text-gray-600 font-primary">{isLiked ? '1' : '0'}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium font-primary"
          >
            Create Yours
          </button>
        </div>
      </div>

      {/* Footer Attribution */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Templates.uz</span>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-2xl mx-auto font-primary">
              This website was created with Templates.uz - The easiest way to build professional websites without coding
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/dashboard"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Create Your Website
              </a>
              <a
                href="/templates"
                className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium font-primary"
              >
                Browse Templates
              </a>
            </div>
            
            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm font-primary">
                © 2024 Templates.uz. All rights reserved. | 
                <a href="/privacy" className="hover:text-white transition-colors ml-1">Privacy Policy</a> | 
                <a href="/terms" className="hover:text-white transition-colors ml-1">Terms of Service</a>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default SiteViewer;