import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesListProps {
  content: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
  onIconClick?: (field: string) => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ content, isEditing, onChange, theme, onIconClick }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...content.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    handleChange('features', updatedFeatures);
  };

  const addFeature = () => {
    const newFeature: Feature = {
      icon: 'Zap',
      title: 'New Feature',
      description: 'Feature description goes here.',
    };
    handleChange('features', [...content.features, newFeature]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = content.features.filter((_, i) => i !== index);
    handleChange('features', updatedFeatures);
  };

  // Get icon component safely
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Zap;
  };

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: theme?.colors?.surface || '#ffffff',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          {isEditing ? (
            <>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mb-4 bg-transparent border-2 border-dashed rounded-lg p-2 text-center w-full max-w-2xl mx-auto"
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
                className="bg-transparent border-2 border-dashed rounded-lg p-2 text-center w-full max-w-3xl mx-auto"
                style={{ 
                  color: theme?.colors?.textSecondary || '#6b7280',
                  borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  fontWeight: theme?.typography?.bodyWeight || 400,
                  borderRadius: theme?.borderRadius?.lg || '12px'
                }}
                placeholder="Enter subtitle"
              />
            </>
          ) : (
            <>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-4"
                style={{ 
                  color: theme?.colors?.primary || '#3b82f6',
                  fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: theme?.typography?.headingWeight || 700,
                  lineHeight: theme?.typography?.headingLineHeight || 1.2
                }}
              >
                {content.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
                style={{ 
                  color: theme?.colors?.textSecondary || '#6b7280',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  fontWeight: theme?.typography?.bodyWeight || 400,
                  lineHeight: theme?.typography?.bodyLineHeight || 1.6
                }}
              >
                {content.subtitle}
              </motion.p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 relative group"
                style={{ 
                  backgroundColor: theme?.colors?.background || '#f9fafb',
                  border: `1px solid ${theme?.colors?.border || '#e5e7eb'}`,
                  borderRadius: theme?.borderRadius?.xl || '16px',
                  boxShadow: theme?.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}
              >
                {isEditing && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="absolute top-2 right-2 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      backgroundColor: theme?.colors?.error || '#ef4444',
                      borderRadius: theme?.borderRadius?.full || '50%'
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${theme?.colors?.primary || '#3b82f6'}20`,
                    borderRadius: theme?.borderRadius?.lg || '12px'
                  }}
                >
                  {isEditing ? (
                    <button
                      onClick={() => onIconClick && onIconClick(`features.${index}.icon`)}
                      className="w-full h-full text-center bg-transparent border-2 border-dashed hover:border-opacity-60 transition-colors flex items-center justify-center"
                      style={{ 
                        color: theme?.colors?.primary || '#3b82f6',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}30`,
                        borderRadius: theme?.borderRadius?.lg || '12px'
                      }}
                      title="Click to change icon"
                    >
                      <IconComponent className="w-6 h-6" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
                    </button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      key={feature.icon}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
                    </motion.div>
                  )}
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        className="mb-2 bg-transparent border-2 border-dashed rounded-lg p-1 w-full"
                        style={{ 
                          color: theme?.colors?.text || '#111827',
                          borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                          fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.h3 || '1.25rem',
                          fontWeight: theme?.typography?.headingWeight || 700,
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="Feature title"
                      />
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        className="bg-transparent border-2 border-dashed rounded-lg p-2 w-full resize-none"
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.bodyWeight || 400,
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="Feature description"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h3 
                        className="mb-2"
                        style={{ 
                          color: theme?.colors?.text || '#111827',
                          fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.h3 || '1.25rem',
                          fontWeight: theme?.typography?.headingWeight || 700,
                          lineHeight: theme?.typography?.headingLineHeight || 1.2
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p 
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.bodyWeight || 400,
                          lineHeight: theme?.typography?.bodyLineHeight || 1.6
                        }}
                      >
                        {feature.description}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isEditing && (
            <motion.button
              onClick={addFeature}
              className="border-2 border-dashed p-8 transition-all duration-200 flex items-center justify-center"
              style={{
                borderColor: theme?.colors?.border || '#d1d5db',
                backgroundColor: 'transparent',
                borderRadius: theme?.borderRadius?.xl || '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme?.colors?.primary || '#3b82f6';
                e.currentTarget.style.backgroundColor = `${theme?.colors?.primary || '#3b82f6'}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme?.colors?.border || '#d1d5db';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <Plus 
                  className="w-8 h-8 mx-auto mb-2" 
                  style={{ color: theme?.colors?.textSecondary || '#6b7280' }} 
                />
                <span 
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400
                  }}
                >
                  Add Feature
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;