import React from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface HeaderModernProps {
  content: {
    logo: string;
    menuItems: string[];
    ctaText: string;
    ctaLink: string;
    hasGradient: boolean;
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const HeaderModern: React.FC<HeaderModernProps> = ({ content, isEditing, onChange, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleMenuItemChange = (index: number, value: string) => {
    const updatedItems = [...content.menuItems];
    updatedItems[index] = value;
    handleChange('menuItems', updatedItems);
  };

  const headerStyle = content.hasGradient 
    ? { 
        background: `linear-gradient(135deg, ${theme?.colors?.primary || '#3b82f6'}, ${theme?.colors?.secondary || '#06b6d4'})`,
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }
    : { 
        backgroundColor: `${theme?.colors?.surface || '#ffffff'}95`,
        borderColor: theme?.colors?.border || '#d1d5db',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      };

  const textColor = content.hasGradient ? '#ffffff' : theme?.colors?.text || '#111827';

  return (
    <header 
      className={`sticky top-0 z-50 backdrop-blur-xl ${!content.hasGradient ? 'border-b' : ''}`}
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {isEditing ? (
              <input
                type="text"
                value={content.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="bg-transparent border-2 border-dashed rounded-lg p-2"
                style={{ 
                  color: textColor,
                  borderColor: content.hasGradient ? 'rgba(255,255,255,0.5)' : `${theme?.colors?.primary || '#3b82f6'}50`,
                  fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.h3 || '1.25rem',
                  fontWeight: theme?.typography?.headingWeight || 700,
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                placeholder="Logo"
              />
            ) : (
              <h1 
                style={{ 
                  color: textColor,
                  fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.h3 || '1.25rem',
                  fontWeight: theme?.typography?.headingWeight || 700,
                  margin: 0
                }}
              >
                {content.logo}
              </h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {content.menuItems.map((item, index) => (
              <div key={index}>
                {isEditing ? (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleMenuItemChange(index, e.target.value)}
                    className="bg-transparent border rounded px-2 py-1 text-sm"
                    style={{ 
                      color: textColor,
                      borderColor: content.hasGradient ? 'rgba(255,255,255,0.3)' : theme?.colors?.border || '#d1d5db',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400,
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="Menu Item"
                  />
                ) : (
                  <a
                    href="#"
                    className="font-medium hover:opacity-70 transition-opacity"
                    style={{ 
                      color: textColor,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400,
                      textDecoration: 'none'
                    }}
                  >
                    {item}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            {isEditing ? (
              <input
                type="text"
                value={content.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-dashed font-medium"
                style={{ 
                  backgroundColor: content.hasGradient ? '#ffffff' : theme?.colors?.primary || '#3b82f6',
                  color: content.hasGradient ? theme?.colors?.primary || '#3b82f6' : '#ffffff',
                  borderColor: content.hasGradient ? 'rgba(255,255,255,0.5)' : `${theme?.colors?.primary || '#3b82f6'}50`,
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                placeholder="CTA Text"
              />
            ) : (
              <a
                href={content.ctaLink}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: content.hasGradient ? '#ffffff' : theme?.colors?.primary || '#3b82f6',
                  color: content.hasGradient ? theme?.colors?.primary || '#3b82f6' : '#ffffff',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px',
                  textDecoration: 'none',
                  boxShadow: theme?.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (content.hasGradient) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                  } else {
                    e.currentTarget.style.backgroundColor = theme?.colors?.secondary || '#06b6d4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (content.hasGradient) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  } else {
                    e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#3b82f6';
                  }
                }}
              >
                {content.ctaText}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg"
              style={{ 
                color: textColor,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            className="md:hidden py-4 border-t" 
            style={{ borderColor: content.hasGradient ? 'rgba(255,255,255,0.2)' : theme?.colors?.border || '#d1d5db' }}
          >
            <div className="space-y-4">
              {content.menuItems.map((item, index) => (
                <div key={index}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleMenuItemChange(index, e.target.value)}
                      className="block w-full bg-transparent border rounded px-2 py-1 text-sm"
                      style={{ 
                        color: textColor,
                        borderColor: content.hasGradient ? 'rgba(255,255,255,0.3)' : theme?.colors?.border || '#d1d5db',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Menu Item"
                    />
                  ) : (
                    <a
                      href="#"
                      className="block font-medium"
                      style={{ 
                        color: textColor,
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.bodyWeight || 400,
                        textDecoration: 'none'
                      }}
                    >
                      {item}
                    </a>
                  )}
                </div>
              ))}
              <div className="pt-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={content.ctaText}
                    onChange={(e) => handleChange('ctaText', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-dashed font-medium text-center"
                    style={{ 
                      backgroundColor: content.hasGradient ? '#ffffff' : theme?.colors?.primary || '#3b82f6',
                      color: content.hasGradient ? theme?.colors?.primary || '#3b82f6' : '#ffffff',
                      borderColor: content.hasGradient ? 'rgba(255,255,255,0.5)' : `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.button || '1rem',
                      fontWeight: theme?.typography?.buttonWeight || 600,
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="CTA Text"
                  />
                ) : (
                  <a
                    href={content.ctaLink}
                    className="block w-full px-4 py-2 rounded-lg font-medium text-center transition-colors"
                    style={{ 
                      backgroundColor: content.hasGradient ? '#ffffff' : theme?.colors?.primary || '#3b82f6',
                      color: content.hasGradient ? theme?.colors?.primary || '#3b82f6' : '#ffffff',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.button || '1rem',
                      fontWeight: theme?.typography?.buttonWeight || 600,
                      borderRadius: theme?.borderRadius?.md || '8px',
                      textDecoration: 'none'
                    }}
                  >
                    {content.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderModern;