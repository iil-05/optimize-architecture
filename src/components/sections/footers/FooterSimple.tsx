import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterSimpleProps {
  content: {
    companyName: string;
    description: string;
    socialLinks: SocialLink[];
    copyright: string;
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const iconMap: Record<string, any> = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Facebook;
};

const FooterSimple: React.FC<FooterSimpleProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...content.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    handleChange('socialLinks', updatedLinks);
  };

  return (
    <footer 
      className="py-12 text-white"
      style={{ 
        background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          {isEditing ? (
            <>
              <input
                type="text"
                value={content.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="mb-4 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 text-center text-white placeholder-white/70"
                style={{ 
                  fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.h2 || '1.5rem',
                  fontWeight: theme?.typography?.headingWeight || 700,
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                placeholder="Company Name"
              />
              <textarea
                value={content.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mb-6 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 text-center w-full max-w-md mx-auto text-white placeholder-white/70 resize-none"
                style={{ 
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  fontWeight: theme?.typography?.bodyWeight || 400,
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                placeholder="Company description"
                rows={2}
              />
            </>
          ) : (
            <>
              <h3 
                className="mb-4"
                style={{ 
                  fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.h2 || '1.5rem',
                  fontWeight: theme?.typography?.headingWeight || 700,
                  color: '#ffffff',
                  margin: '0 0 1rem 0'
                }}
              >
                {content.companyName}
              </h3>
              <p 
                className="mb-6"
                style={{ 
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  fontWeight: theme?.typography?.bodyWeight || 400,
                  color: '#ffffff',
                  lineHeight: theme?.typography?.bodyLineHeight || 1.6,
                  margin: '0 0 1.5rem 0'
                }}
              >
                {content.description}
              </p>
            </>
          )}

          <div className="flex justify-center space-x-6 mb-6">
            {content.socialLinks.map((link, index) => {
              const IconComponent = getIconComponent(link.icon);
              
              return (
                <div key={index} className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <select
                        value={link.icon}
                        onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                        className="w-8 h-8 text-center bg-transparent border border-white/50 rounded text-white text-xs"
                        style={{ 
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                      >
                        <option value="Facebook" style={{ color: '#111827' }}>FB</option>
                        <option value="Twitter" style={{ color: '#111827' }}>TW</option>
                        <option value="Linkedin" style={{ color: '#111827' }}>LI</option>
                        <option value="Instagram" style={{ color: '#111827' }}>IG</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                        className="px-2 py-1 bg-transparent border border-white/50 rounded text-white placeholder-white/70 text-sm"
                        style={{ 
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="URL"
                      />
                    </>
                  ) : (
                    <a
                      href={link.url}
                      className="hover:opacity-70 transition-opacity"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: theme?.borderRadius?.lg || '12px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={content.copyright}
              onChange={(e) => handleChange('copyright', e.target.value)}
              className="text-sm opacity-70 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 text-center w-full max-w-md mx-auto text-white placeholder-white/70"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.small || '0.875rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                borderRadius: theme?.borderRadius?.md || '8px'
              }}
              placeholder="© 2024 Your Company. All rights reserved."
            />
          ) : (
            <p 
              className="text-sm opacity-70"
              style={{ 
                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                fontSize: theme?.typography?.small || '0.875rem',
                fontWeight: theme?.typography?.bodyWeight || 400,
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}
            >
              {content.copyright}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;