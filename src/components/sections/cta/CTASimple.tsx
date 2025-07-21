import React from 'react';
import { motion } from 'framer-motion';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface CTASimpleProps {
  content: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const CTASimple: React.FC<CTASimpleProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <section 
      className="py-20 text-white"
      style={{ 
        background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        {isEditing ? (
          <>
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mb-6 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 text-center w-full text-white placeholder-white/70"
              style={{ 
                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: theme?.typography?.headingWeight || 700,
                borderRadius: theme?.borderRadius?.lg || '12px'
              }}
              placeholder="Enter title"
            />
            <textarea
              value={content.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mb-8 max-w-2xl mx-auto bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 text-center w-full text-white placeholder-white/70 resize-none"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.body || '1rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
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
                className="px-8 py-4 bg-white text-gray-900 rounded-lg border-2 border-dashed border-white/50 placeholder-gray-500 font-semibold"
                style={{ 
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px',
                  color: theme?.colors?.text || '#111827'
                }}
                placeholder="CTA Text"
              />
              {content.secondaryCtaText && (
                <input
                  type="text"
                  value={content.secondaryCtaText}
                  onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                  className="px-8 py-4 border-2 border-white text-white rounded-lg bg-transparent placeholder-white/70 font-semibold"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.button || '1rem',
                    fontWeight: theme?.typography?.buttonWeight || 600,
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  placeholder="Secondary CTA"
                />
              )}
            </div>
          </>
        ) : (
          <>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
              style={{ 
                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: theme?.typography?.headingWeight || 700,
                lineHeight: theme?.typography?.headingLineHeight || 1.2,
                color: '#ffffff'
              }}
            >
              {content.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8 max-w-2xl mx-auto opacity-90"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.body || '1rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                lineHeight: theme?.typography?.bodyLineHeight || 1.6,
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {content.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href={content.ctaLink}
                className="inline-block px-8 py-4 bg-white rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                style={{ 
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px',
                  color: theme?.colors?.text || '#111827',
                  textDecoration: 'none',
                  boxShadow: theme?.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              >
                {content.ctaText}
              </a>
              {content.secondaryCtaText && (
                <a
                  href="#"
                  className="inline-block px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.button || '1rem',
                    fontWeight: theme?.typography?.buttonWeight || 600,
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

export default CTASimple;