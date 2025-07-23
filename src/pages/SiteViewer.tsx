import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Globe,
  AlertCircle,
  Home,
  Zap,
  Heart,
  Coins
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';
import { Project } from '../types';
import { optimizedStorage } from '../utils/optimizedStorage';

// Memoized components for better performance
const MemoizedSectionRenderer = React.memo(SectionRenderer);

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const { updateTheme, currentTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [showCoinDonation, setShowCoinDonation] = useState(false);

  // Memoize theme to prevent unnecessary re-renders
  const activeTheme = useMemo(() => {
    if (project?.themeId) {
      const theme = themeRegistry.getTheme(project.themeId);
      return theme || currentTheme;
    }
    return currentTheme;
  }, [project?.themeId, currentTheme]);

  // Memoize sorted sections to prevent re-sorting on every render
  const sortedSections = useMemo(() => {
    if (!project?.sections) return [];
    return [...project.sections].sort((a, b) => a.order - b.order);
  }, [project?.sections]);

  // Optimized load function with error boundaries
  const loadWebsite = useCallback(async () => {
    if (!websiteUrl) {
      setError('No website URL provided');
      setIsLoading(false);
      return;
    }

    try {
      // Use optimized project lookup
      const foundProject = optimizedStorage.getProjectByUrl(websiteUrl);

      if (foundProject && foundProject.isPublished) {
        setProject(foundProject);

        // Apply theme efficiently
        if (foundProject.themeId && foundProject.themeId !== currentTheme.id) {
          updateTheme(foundProject.themeId);
        }

        // Track visit efficiently (debounced)
        optimizedStorage.trackVisit(foundProject.id);

        // Check if liked (optimized)
        setHasLiked(optimizedStorage.isProjectLiked(foundProject.id));

        setError(null);
      } else {
        setError('Website not found, not published, or access denied');
      }
    } catch (err) {
      console.error('Error loading website:', err);
      setError('Failed to load website');
    } finally {
      setIsLoading(false);
    }
  }, [websiteUrl, updateTheme, currentTheme.id]);

  useEffect(() => {
    loadWebsite();
  }, [loadWebsite]);

  // Optimized like handler
  const handleLike = useCallback(() => {
    if (!project || hasLiked) return;

    optimizedStorage.trackLike(project.id);
    setHasLiked(true);
  }, [project, hasLiked]);

  // Optimized coin donation handler
  const handleCoinDonation = useCallback((amount: number) => {
    if (!project) return;

    optimizedStorage.trackCoinDonation(project.id, amount);
    setShowCoinDonation(false);
    
    toast.success(`Thank you for donating ${amount} coin${amount > 1 ? 's' : ''}! 🪙`, {
      position: "top-right",
      autoClose: 3000,
    });
  }, [project]);

  // Loading state with minimal animations
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h2>
          <p className="text-gray-600 mb-6">
            The website "{websiteUrl}" doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Go Home
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Create Your Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Action Buttons - Optimized */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            hasLiked 
              ? 'bg-red-500 text-white cursor-not-allowed' 
              : 'bg-white text-red-500 hover:bg-red-50 border-2 border-red-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={() => setShowCoinDonation(true)}
          className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-colors"
        >
          <Coins className="w-5 h-5" />
        </button>
      </div>

      {/* Coin Donation Modal - Simplified */}
      {showCoinDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <Coins className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support This Website</h3>
              <p className="text-gray-600">Show your appreciation with a coin donation</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 5, 10].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCoinDonation(amount)}
                  className="p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors text-center"
                >
                  <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <span className="font-bold text-gray-900">{amount}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCoinDonation(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Website Content - Optimized rendering */}
      {sortedSections.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-lg px-4">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Under Construction</h2>
            <p className="text-gray-600 mb-8">This website is currently being built. Check back soon!</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Create Your Own Website
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {sortedSections.map((section, index) => (
            <MemoizedSectionRenderer
              key={section.id}
              section={section}
              isSelected={false}
              onSelect={() => {}}
              isPreview={true}
              theme={activeTheme}
              isEditing={false}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}

      {/* Powered By Templates.uz - Simplified */}
      <section className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <Globe className="w-8 h-8 text-primary-500" />
              <div>
                <h3 className="text-lg font-bold">Templates.uz</h3>
                <p className="text-sm text-gray-400">Build websites without coding</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                Create Website
              </a>
              <a
                href="/templates"
                className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm"
              >
                Browse Templates
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(SiteViewer);