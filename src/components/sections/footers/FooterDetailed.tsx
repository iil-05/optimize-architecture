import React from 'react';
import { Plus, X, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface FooterSection {
  title: string;
  links: string[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterDetailedProps {
  content: {
    companyName: string;
    description: string;
    sections: FooterSection[];
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

const FooterDetailed: React.FC<FooterDetailedProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleSectionChange = (sectionIndex: number, field: string, value: any) => {
    const updatedSections = [...content.sections];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], [field]: value };
    handleChange('sections', updatedSections);
  };

  const handleLinkChange = (sectionIndex: number, linkIndex: number, value: string) => {
    const updatedSections = [...content.sections];
    updatedSections[sectionIndex].links[linkIndex] = value;
    handleChange('sections', updatedSections);
  };

  const addSection = () => {
    const newSection: FooterSection = {
      title: 'New Section',
      links: ['Link 1', 'Link 2', 'Link 3'],
    };
    handleChange('sections', [...content.sections, newSection]);
  };

  const removeSection = (index: number) => {
    const updatedSections = content.sections.filter((_, i) => i !== index);
    handleChange('sections', updatedSections);
  };

  const addLink = (sectionIndex: number) => {
    const updatedSections = [...content.sections];
    updatedSections[sectionIndex].links.push('New Link');
    handleChange('sections', updatedSections);
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const updatedSections = [...content.sections];
    updatedSections[sectionIndex].links = updatedSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
    handleChange('sections', updatedSections);
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...content.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    handleChange('socialLinks', updatedLinks);
  };

  return (
    <footer 
      className="py-16 text-white"
      style={{ 
        background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={content.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="mb-4 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 w-full text-white placeholder-white/70"
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
                  className="mb-6 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 w-full text-white placeholder-white/70 resize-none"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  placeholder="Company description"
                  rows={3}
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
                  className="mb-6 opacity-90"
                  style={{ 
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: theme?.typography?.bodyLineHeight || 1.6,
                    margin: '0 0 1.5rem 0'
                  }}
                >
                  {content.description}
                </p>
              </>
            )}

            <div className="flex space-x-4">
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
          </div>

          {/* Footer Sections */}
          {content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="relative group">
              {isEditing && (
                <button
                  onClick={() => removeSection(sectionIndex)}
                  className="absolute -top-2 -right-2 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    backgroundColor: theme?.colors?.error || '#ef4444',
                    borderRadius: theme?.borderRadius?.full || '50%'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                  className="mb-4 bg-transparent border-2 border-dashed border-white/50 rounded-lg p-2 w-full text-white placeholder-white/70"
                  style={{ 
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.h4 || '1.125rem',
                    fontWeight: theme?.typography?.headingWeight || 700,
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  placeholder="Section Title"
                />
              ) : (
                <h4 
                  className="mb-4"
                  style={{ 
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.h4 || '1.125rem',
                    fontWeight: theme?.typography?.headingWeight || 700,
                    color: '#ffffff',
                    margin: '0 0 1rem 0'
                  }}
                >
                  {section.title}
                </h4>
              )}

              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => handleLinkChange(sectionIndex, linkIndex, e.target.value)}
                          className="flex-1 bg-transparent border border-white/50 rounded p-1 text-white placeholder-white/70 text-sm"
                          style={{ 
                            fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                            fontSize: theme?.typography?.body || '1rem',
                            fontWeight: theme?.typography?.bodyWeight || 400,
                            borderRadius: theme?.borderRadius?.md || '8px'
                          }}
                          placeholder="Link text"
                        />
                        <button
                          onClick={() => removeLink(sectionIndex, linkIndex)}
                          className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: theme?.colors?.error || '#ef4444',
                            borderRadius: theme?.borderRadius?.full || '50%'
                          }}
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </>
                    ) : (
                      <a
                        href="#"
                        className="opacity-90 hover:opacity-100 transition-opacity"
                        style={{ 
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.bodyWeight || 400,
                          color: 'rgba(255, 255, 255, 0.9)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                        }}
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}

                {isEditing && (
                  <li>
                    <button
                      onClick={() => addLink(sectionIndex)}
                      className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                      style={{ 
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.small || '0.875rem',
                        fontWeight: theme?.typography?.bodyWeight || 400,
                        color: 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {isEditing && (
            <div 
              className="border-2 border-dashed border-white/50 rounded-lg p-4 flex items-center justify-center"
              style={{ borderRadius: theme?.borderRadius?.lg || '12px' }}
            >
              <button
                onClick={addSection}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                style={{ 
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  fontWeight: theme?.typography?.bodyWeight || 400,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus className="w-6 h-6" />
                Add Section
              </button>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div 
          className="border-t pt-8 text-center"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
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

export default FooterDetailed;