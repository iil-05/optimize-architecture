import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface ContactFormProps {
  content: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    address: string;
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const ContactForm: React.FC<ContactFormProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: theme?.colors?.background || '#f9fafb',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 flex items-center justify-center"
                style={{ 
                  backgroundColor: `${theme?.colors?.primary || '#3b82f6'}20`,
                  borderRadius: theme?.borderRadius?.lg || '12px'
                }}
              >
                <Mail className="w-6 h-6" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
              </div>
              <div>
                <h3 
                  className="mb-1"
                  style={{ 
                    color: theme?.colors?.text || '#111827',
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.h4 || '1.125rem',
                    fontWeight: theme?.typography?.headingWeight || 700
                  }}
                >
                  Email
                </h3>
                {isEditing ? (
                  <input
                    type="email"
                    value={content.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-transparent border-2 border-dashed rounded-lg p-1"
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="email@example.com"
                  />
                ) : (
                  <p 
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400
                    }}
                  >
                    {content.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 flex items-center justify-center"
                style={{ 
                  backgroundColor: `${theme?.colors?.primary || '#3b82f6'}20`,
                  borderRadius: theme?.borderRadius?.lg || '12px'
                }}
              >
                <Phone className="w-6 h-6" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
              </div>
              <div>
                <h3 
                  className="mb-1"
                  style={{ 
                    color: theme?.colors?.text || '#111827',
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.h4 || '1.125rem',
                    fontWeight: theme?.typography?.headingWeight || 700
                  }}
                >
                  Phone
                </h3>
                {isEditing ? (
                  <input
                    type="tel"
                    value={content.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-transparent border-2 border-dashed rounded-lg p-1"
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <p 
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400
                    }}
                  >
                    {content.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 flex items-center justify-center"
                style={{ 
                  backgroundColor: `${theme?.colors?.primary || '#3b82f6'}20`,
                  borderRadius: theme?.borderRadius?.lg || '12px'
                }}
              >
                <MapPin className="w-6 h-6" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
              </div>
              <div>
                <h3 
                  className="mb-1"
                  style={{ 
                    color: theme?.colors?.text || '#111827',
                    fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.h4 || '1.125rem',
                    fontWeight: theme?.typography?.headingWeight || 700
                  }}
                >
                  Address
                </h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={content.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="bg-transparent border-2 border-dashed rounded-lg p-1 w-full"
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="123 Business St, City, State 12345"
                  />
                ) : (
                  <p 
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400
                    }}
                  >
                    {content.address}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-8"
            style={{ 
              backgroundColor: theme?.colors?.surface || '#ffffff',
              boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              borderRadius: theme?.borderRadius?.xl || '16px',
              border: `1px solid ${theme?.colors?.border || '#e5e7eb'}`
            }}
          >
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: theme?.colors?.border || '#d1d5db',
                    backgroundColor: theme?.colors?.background || '#f9fafb',
                    color: theme?.colors?.text || '#111827',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme?.colors?.primary || '#3b82f6';
                    e.target.style.boxShadow = `0 0 0 3px ${theme?.colors?.primary || '#3b82f6'}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme?.colors?.border || '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: theme?.colors?.border || '#d1d5db',
                    backgroundColor: theme?.colors?.background || '#f9fafb',
                    color: theme?.colors?.text || '#111827',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme?.colors?.primary || '#3b82f6';
                    e.target.style.boxShadow = `0 0 0 3px ${theme?.colors?.primary || '#3b82f6'}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme?.colors?.border || '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border mb-6 focus:outline-none focus:ring-2 transition-colors"
                style={{ 
                  borderColor: theme?.colors?.border || '#d1d5db',
                  backgroundColor: theme?.colors?.background || '#f9fafb',
                  color: theme?.colors?.text || '#111827',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme?.colors?.primary || '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 3px ${theme?.colors?.primary || '#3b82f6'}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme?.colors?.border || '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <textarea
                placeholder="Your Message"
                rows={6}
                className="w-full px-4 py-3 border mb-6 focus:outline-none focus:ring-2 transition-colors resize-none"
                style={{ 
                  borderColor: theme?.colors?.border || '#d1d5db',
                  backgroundColor: theme?.colors?.background || '#f9fafb',
                  color: theme?.colors?.text || '#111827',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.body || '1rem',
                  borderRadius: theme?.borderRadius?.md || '8px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme?.colors?.primary || '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 3px ${theme?.colors?.primary || '#3b82f6'}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme?.colors?.border || '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 px-6 font-semibold transition-colors"
                style={{ 
                  backgroundColor: theme?.colors?.primary || '#3b82f6',
                  color: '#ffffff',
                  fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: theme?.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.colors?.secondary || '#06b6d4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#3b82f6';
                }}
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;