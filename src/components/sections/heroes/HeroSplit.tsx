import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface HeroSplitProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    features: string[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const HeroSplit: React.FC<HeroSplitProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...content.features];
    updatedFeatures[index] = value;
    handleChange('features', updatedFeatures);
  };

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: theme?.colors?.background || '#f9fafb',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="mb-6 bg-transparent border-2 border-dashed rounded-lg p-2 w-full"
                  style={{ 
                    color: theme?.colors?.primary || '#3b82f6',
                    borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: theme?.typography?.headingWeight || 700,
                    borderRadius: theme?.borderRadius?.lg || '12px'
                  }}
                  placeholder="Enter title"
                />
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="mb-4 bg-transparent border-2 border-dashed rounded-lg p-2 w-full"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.subtitle || '1.25rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    borderRadius: theme?.borderRadius?.lg || '12px'
                  }}
                  placeholder="Enter subtitle"
                />
                <textarea
                  value={content.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mb-6 bg-transparent border-2 border-dashed rounded-lg p-2 w-full resize-none"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    borderRadius: theme?.borderRadius?.lg || '12px'
                  }}
                  placeholder="Enter description"
                  rows={3}
                />
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: theme?.colors?.success || '#10b981',
                        borderRadius: theme?.borderRadius?.full || '50%'
                      }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 bg-transparent border-2 border-dashed rounded-lg p-1"
                      style={{ 
                        color: theme?.colors?.text || '#111827',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Feature"
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6"
                  style={{ 
                    color: theme?.colors?.primary || '#3b82f6',
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: theme?.typography?.headingWeight || 700,
                    lineHeight: theme?.typography?.headingLineHeight || 1.2
                  }}
                >
                  {content.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.subtitle || '1.25rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    lineHeight: theme?.typography?.bodyLineHeight || 1.6
                  }}
                >
                  {content.subtitle}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-6"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    lineHeight: theme?.typography?.bodyLineHeight || 1.6
                  }}
                >
                  {content.description}
                </motion.p>
                {content.features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 mb-3"
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: theme?.colors?.success || '#10b981',
                        borderRadius: theme?.borderRadius?.full || '50%'
                      }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span 
                      style={{ 
                        color: theme?.colors?.text || '#111827',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.bodyWeight || 400
                      }}
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-8"
                >
                  <a 
                    href={content.ctaLink}
                    className="inline-block px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
                      color: '#ffffff',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.button || '1rem',
                      fontWeight: theme?.typography?.buttonWeight || 600,
                      borderRadius: theme?.borderRadius?.md || '8px',
                      boxShadow: theme?.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      textDecoration: 'none'
                    }}
                  >
                    {content.ctaText}
                  </a>
                </motion.div>
              </>
            )}
          </div>
          
          <div className="relative">
            {isEditing ? (
              <input
                type="url"
                value={content.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full h-96 border-2 border-dashed p-4 text-center"
                style={{ 
                  borderColor: theme?.colors?.border || '#d1d5db',
                  backgroundColor: theme?.colors?.surface || '#ffffff',
                  color: theme?.colors?.textSecondary || '#6b7280',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  borderRadius: theme?.borderRadius?.xl || '16px'
                }}
                placeholder="Image URL"
              />
            ) : (
              <motion.img 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                src={content.image} 
                alt={content.title} 
                className="w-full"
                style={{ 
                  boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  borderRadius: theme?.borderRadius?.xl || '16px'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSplit;