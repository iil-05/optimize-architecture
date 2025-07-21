import React from 'react';
import { motion } from 'framer-motion';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface HeroModernProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    backgroundImage: string;
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const HeroModern: React.FC<HeroModernProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center"
      style={{ 
        backgroundImage: `url('${content.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        {isEditing ? (
          <>
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-4xl md:text-6xl font-bold mb-6 bg-transparent border-2 border-dashed rounded-lg p-2 text-center w-full text-white placeholder-white/70"
              style={{ 
                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: theme?.typography?.headingWeight || 700,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: theme?.borderRadius?.lg || '12px'
              }}
              placeholder="Enter title"
            />
            <input
              type="text"
              value={content.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="text-xl md:text-2xl mb-4 bg-transparent border-2 border-dashed rounded-lg p-2 text-center w-full text-white placeholder-white/70"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.subtitle || '1.25rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: theme?.borderRadius?.lg || '12px'
              }}
              placeholder="Enter subtitle"
            />
            <textarea
              value={content.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="text-lg mb-8 max-w-2xl mx-auto bg-transparent border-2 border-dashed rounded-lg p-2 text-center w-full text-white placeholder-white/70 resize-none"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.body || '1rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: theme?.borderRadius?.lg || '12px'
              }}
              placeholder="Enter description"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="text"
                value={content.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="px-6 py-3 rounded-lg border-2 border-dashed placeholder-white/70 font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
                  color: '#ffffff',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: theme?.borderRadius?.md || '8px',
                  boxShadow: theme?.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                placeholder="CTA Text"
              />
              {content.secondaryCtaText && (
                <input
                  type="text"
                  value={content.secondaryCtaText}
                  onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                  className="px-6 py-3 border-2 text-white rounded-lg bg-transparent placeholder-white/70 font-semibold"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.button || '1rem',
                    fontWeight: theme?.typography?.buttonWeight || 600,
                    borderColor: '#ffffff',
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  placeholder="Secondary CTA"
                />
              )}
            </div>
          </>
        ) : (
          <>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-bold mb-6"
              style={{ 
                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: theme?.typography?.headingWeight || 700,
                color: '#ffffff',
                lineHeight: theme?.typography?.headingLineHeight || 1.2
              }}
            >
              {content.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.subtitle || '1.25rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                color: '#ffffff',
                lineHeight: theme?.typography?.bodyLineHeight || 1.6
              }}
            >
              {content.subtitle}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 max-w-2xl mx-auto"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.body || '1rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: theme?.typography?.bodyLineHeight || 1.6
              }}
            >
              {content.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href={content.ctaLink} 
                className="px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
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
              {content.secondaryCtaText && (
                <a 
                  href="#" 
                  className="px-6 py-3 border-2 text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.button || '1rem',
                    fontWeight: theme?.typography?.buttonWeight || 600,
                    borderColor: '#ffffff',
                    borderRadius: theme?.borderRadius?.md || '8px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = theme?.colors?.text || '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  {content.secondaryCtaText}
                </a>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroModern;