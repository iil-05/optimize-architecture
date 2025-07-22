import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Loader2
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const navigate = useNavigate();
  const { projects } = useProject();
  const { updateTheme } = useTheme();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (websiteUrl) {
      // Find project by websiteUrl
      const foundProject = projects.find(p => p.websiteUrl === websiteUrl && p.isPublished);
      
      if (foundProject) {
        setProject(foundProject);
        
        // Apply project's theme
        if (foundProject.themeId) {
          const theme = themeRegistry.getTheme(foundProject.themeId);
          if (theme) {
            updateTheme(foundProject.themeId);
          }
        }
        
        // Simulate view count increment
        setViewCount(Math.floor(Math.random() * 1000) + 100);
        
        setError(null);
      } else {
        setError('Website not found or not published');
      }
      
      setIsLoading(false);
    }
  }, [websiteUrl, projects, updateTheme]);

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
    // In a real app, this would update the like count in the database
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Website...</h2>
          <p className="text-gray-600">Please wait while we load the website</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || `The website "${websiteUrl}" doesn't exist or hasn't been published yet.`}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Create Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header - Only visible on scroll */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{project.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CategoryIcon className="w-4 h-4" />
                  <span>{project.category}</span>
                  <span>•</span>
                  <span>{project.sections.length} sections</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`p-2 rounded-xl transition-colors ${
                isLiked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <a
              href={`/dashboard`}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Create Your Own
            </a>
          </div>
        </div>
      </motion.div>

      {/* Website Content */}
      <div className="pt-24">
        {project.sections.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-lg px-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Under Construction</h2>
              <p className="text-gray-600 mb-8">
                This website is currently being built. Check back soon!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Create Your Own Website
              </button>
            </div>
          </div>
        ) : (
          project.sections
            .sort((a: any, b: any) => a.order - b.order)
            .map((section: any) => (
              <SectionRenderer
                key={section.id}
                section={section}
                isSelected={false}
                onSelect={() => {}}
                isPreview={true}
                isEditing={false}
                onEdit={() => {}}
              />
            ))
        )}
      </div>

      {/* Footer Attribution */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Templates.uz</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            This website was created with Templates.uz - The easiest way to build professional websites
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Create Your Website
            </a>
            <a
              href="/templates"
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Browse Templates
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteViewer;