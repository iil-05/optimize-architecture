import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  AlertCircle,
  Home,
  Zap,
  Heart,
  Coins
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';
import { Project } from '../types';
import { optimizedStorage } from '../utils/optimizedStorage';

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const { projects } = useProject();
  const { updateTheme, currentTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [hasLiked, setHasLiked] = useState(false);
  const [showCoinDonation, setShowCoinDonation] = useState(false);
  const [sessionStartTime] = useState(Date.now());

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

          // Track visit with accurate data
          trackVisit(foundProject.id);

          // Check if user has already liked this site
          const likedSites = JSON.parse(localStorage.getItem('templates_uz_liked_sites') || '[]');
          setHasLiked(likedSites.includes(foundProject.id));

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

  // Track page unload to calculate session duration
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (project) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
        optimizedStorage.trackSimpleEvent(project.id, 'visit', {
          sessionDuration,
          pageUrl: window.location.href,
          exitTime: new Date().toISOString()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [project, sessionStartTime]);

  // Track accurate visit with real user data
  const trackVisit = (projectId: string) => {
    try {
      optimizedStorage.trackSimpleEvent(projectId, 'visit', {
        pageUrl: window.location.href,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionStartTime: sessionStartTime
      });
      
      console.log('📊 Visit tracked for project:', projectId);
    } catch (error) {
      console.error('❌ Error tracking visit:', error);
    }
  };

  const handleLike = () => {
    if (!project || hasLiked) return;

    try {
      // Track like event
      optimizedStorage.trackSimpleEvent(project.id, 'like', {
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      });

      // Save to local storage to prevent multiple likes
      const likedSites = JSON.parse(localStorage.getItem('templates_uz_liked_sites') || '[]');
      likedSites.push(project.id);
      localStorage.setItem('templates_uz_liked_sites', JSON.stringify(likedSites));

      setHasLiked(true);
      console.log('❤️ Like tracked for project:', project.id);
    } catch (error) {
      console.error('❌ Error tracking like:', error);
    }
  };

  const handleCoinDonation = (amount: number) => {
    if (!project) return;

    try {
      // Track coin donation event
      optimizedStorage.trackSimpleEvent(project.id, 'coin_donation', { 
        amount,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      });

      setShowCoinDonation(false);
      console.log('🪙 Coin donation tracked:', { projectId: project.id, amount });
      
      // Show success message
      alert(`Thank you for donating ${amount} coin${amount > 1 ? 's' : ''}! 🪙`);
    } catch (error) {
      console.error('❌ Error tracking coin donation:', error);
    }
  };

  // Track section interactions
  const handleSectionInteraction = (sectionId: string, interactionType: string) => {
    if (!project) return;

    try {
      optimizedStorage.trackSimpleEvent(project.id, 'section_interaction', {
        sectionId,
        interactionType,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      });
    } catch (error) {
      console.error('❌ Error tracking section interaction:', error);
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
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={hasLiked}
          whileHover={{ scale: hasLiked ? 1 : 1.1 }}
          whileTap={{ scale: hasLiked ? 1 : 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
            hasLiked 
              ? 'bg-red-500 text-white cursor-not-allowed' 
              : 'bg-white text-red-500 hover:bg-red-50 border-2 border-red-200'
          }`}
        >
          <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Coin Donation Button */}
        <motion.button
          onClick={() => setShowCoinDonation(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-yellow-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-all"
        >
          <Coins className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Coin Donation Modal */}
      {showCoinDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Support This Website</h3>
              <p className="text-gray-600 font-primary">Show your appreciation with a coin donation</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 5, 10].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCoinDonation(amount)}
                  className="p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-center"
                >
                  <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <span className="font-bold text-gray-900 font-primary">{amount}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCoinDonation(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium font-primary"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

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
            </button>
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
                onClick={() => handleSectionInteraction(section.id, 'click')}
                onMouseEnter={() => handleSectionInteraction(section.id, 'hover')}
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