import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  AlertCircle,
  Home,
  Zap
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';
import { Project } from '../types';
import { optimizedStorage } from '../utils/optimizedStorage';
import { analyticsStorage } from '../utils/analyticsStorage';

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const { projects } = useProject();
  const { updateTheme, currentTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    const loadWebsite = async () => {
      if (!websiteUrl) {
        setError('No website URL provided');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Looking for website with URL:', websiteUrl);

      // First try to find in current projects
      let foundProject = projects.find(p => p.websiteUrl === websiteUrl);

      // If not found in current projects, try to load from optimized storage
      if (!foundProject) {
        const allStoredProjects = optimizedStorage.getAllProjects();
        foundProject = allStoredProjects.find(p => p.websiteUrl === websiteUrl);
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

          // Track visit analytics in background
          trackVisit(foundProject.id);

          // Initialize analytics tracking
          initializeAnalytics(foundProject.id);

          setError(null);
        } else {
          console.log('❌ Website found but not published. isPublished:', foundProject.isPublished);
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

  // Initialize comprehensive analytics tracking
  const initializeAnalytics = (projectId: string) => {
    if (analyticsInitialized) return;
    
    try {
      // Start analytics session
      analyticsStorage.startSession(projectId);
      
      // Track initial page view
      analyticsStorage.trackPageView(projectId, '/', document.title);
      
      // Track scroll interactions
      let scrollTimeout: NodeJS.Timeout;
      const trackScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          analyticsStorage.trackInteraction(projectId, 'scroll', 'page', {
            value: `${Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)}%`
          });
        }, 1000);
      };
      window.addEventListener('scroll', trackScroll, { passive: true });
      
      // Track clicks on important elements
      const trackClicks = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        
        // Track clicks on links, buttons, and interactive elements
        if (['a', 'button'].includes(tagName) || target.onclick || target.getAttribute('role') === 'button') {
          const elementText = target.textContent?.trim().substring(0, 50) || '';
          const elementId = target.id || target.className || tagName;
          
          analyticsStorage.trackInteraction(projectId, 'click', elementId, {
            elementText,
            elementPosition: { x: event.clientX, y: event.clientY }
          });
          
          // Track conversions for specific elements
          if (tagName === 'a') {
            const href = target.getAttribute('href');
            if (href) {
              if (href.includes('mailto:')) {
                analyticsStorage.trackConversion(projectId, 'email_click', 1);
              } else if (href.includes('tel:')) {
                analyticsStorage.trackConversion(projectId, 'phone_click', 1);
              } else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                analyticsStorage.trackConversion(projectId, 'external_link', 1);
              }
            }
          }
          
          // Track social media clicks
          if (elementText.toLowerCase().includes('facebook') || target.className.includes('facebook')) {
            analyticsStorage.trackConversion(projectId, 'social_share', 1, { platform: 'facebook' });
          } else if (elementText.toLowerCase().includes('twitter') || target.className.includes('twitter')) {
            analyticsStorage.trackConversion(projectId, 'social_share', 1, { platform: 'twitter' });
          } else if (elementText.toLowerCase().includes('linkedin') || target.className.includes('linkedin')) {
            analyticsStorage.trackConversion(projectId, 'social_share', 1, { platform: 'linkedin' });
          } else if (elementText.toLowerCase().includes('instagram') || target.className.includes('instagram')) {
            analyticsStorage.trackConversion(projectId, 'social_share', 1, { platform: 'instagram' });
          }
        }
      };
      document.addEventListener('click', trackClicks);
      
      // Track form submissions
      const trackFormSubmissions = (event: Event) => {
        const form = event.target as HTMLFormElement;
        const formId = form.id || form.className || 'contact-form';
        
        analyticsStorage.trackInteraction(projectId, 'form_submit', formId);
        analyticsStorage.trackConversion(projectId, 'contact_form', 1, {
          formId,
          formAction: form.action || 'unknown'
        });
      };
      document.addEventListener('submit', trackFormSubmissions);
      
      // Track time spent on page
      const startTime = Date.now();
      const trackTimeSpent = () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent > 10) { // Only track if user spent more than 10 seconds
          analyticsStorage.trackInteraction(projectId, 'scroll', 'time_spent', {
            value: `${timeSpent}s`
          });
        }
      };
      
      // Track when user leaves the page
      window.addEventListener('beforeunload', trackTimeSpent);
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          trackTimeSpent();
        }
      });
      
      // Track hover interactions on important elements
      const trackHovers = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        
        if (['a', 'button'].includes(tagName)) {
          const elementText = target.textContent?.trim().substring(0, 30) || '';
          const elementId = target.id || target.className || tagName;
          
          analyticsStorage.trackInteraction(projectId, 'hover', elementId, {
            elementText
          });
        }
      };
      
      // Throttle hover tracking to avoid too many events
      let hoverTimeout: NodeJS.Timeout;
      document.addEventListener('mouseover', (event) => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => trackHovers(event), 500);
      });
      
      // Track downloads
      const trackDownloads = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'a') {
          const href = target.getAttribute('href');
          if (href && (href.includes('.pdf') || href.includes('.doc') || href.includes('.zip') || href.includes('download'))) {
            analyticsStorage.trackConversion(projectId, 'download', 1, {
              fileName: href.split('/').pop() || 'unknown',
              fileType: href.split('.').pop() || 'unknown'
            });
          }
        }
      };
      document.addEventListener('click', trackDownloads);
      
      setAnalyticsInitialized(true);
      console.log('📊 Advanced analytics tracking initialized for project:', projectId);
      
      // Cleanup function
      return () => {
        window.removeEventListener('scroll', trackScroll);
        document.removeEventListener('click', trackClicks);
        document.removeEventListener('submit', trackFormSubmissions);
        document.removeEventListener('beforeunload', trackTimeSpent);
        document.removeEventListener('click', trackDownloads);
        clearTimeout(scrollTimeout);
        clearTimeout(hoverTimeout);
        
        // End analytics session
        analyticsStorage.endSession();
      };
    } catch (error) {
      console.error('❌ Error initializing analytics:', error);
    }
  };

  // Track visit analytics in background
  const trackVisit = (projectId: string) => {
    try {
      // Update project view count
      const project = optimizedStorage.getProject(projectId);
      if (project) {
        if (!project.analytics) {
          project.analytics = { views: 0, performance: {} };
        }
        project.analytics.views = project.analytics.views + 1;
        project.analytics.lastViewed = new Date();
        optimizedStorage.saveProject(project);
      }
      
      console.log('📊 Visit tracked for project:', projectId);
    } catch (error) {
      console.error('❌ Error tracking visit:', error);
    }
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
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Go Home
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Create Your Website
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Website Content */}
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
              onClick={() => window.location.href = '/dashboard'}
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
                  onSelect={() => { }}
                  isPreview={true}
                  theme={activeTheme}
                  isEditing={false}
                  onEdit={() => { }}
                />
              </motion.div>
            ))}
        </div>
      )}

      {/* Powered By Templates.uz */}
      <section
        id="powered-by-templates"
        className="bg-gray-900 text-white h-[120px] flex items-center justify-center px-4"
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
          >
            {/* Left: Logo + Text */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading">Templates.uz</h3>
                <p className="text-sm text-gray-400 font-primary">
                  Build websites without coding — it's that easy!
                </p>
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
              <a
                href="/dashboard"
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary text-sm"
              >
                Create Website
              </a>
              <a
                href="/templates"
                className="px-5 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium font-primary text-sm"
              >
                Browse Templates
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SiteViewer;