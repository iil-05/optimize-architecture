import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, X } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface TestimonialsGridProps {
  content: {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleTestimonialChange = (index: number, field: string, value: any) => {
    const updatedTestimonials = [...content.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    handleChange('testimonials', updatedTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: 'New Customer',
      role: 'Customer',
      company: 'Company',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      content: 'Great service and amazing results!',
      rating: 5,
    };
    handleChange('testimonials', [...content.testimonials, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = content.testimonials.filter((_, i) => i !== index);
    handleChange('testimonials', updatedTestimonials);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-current' : ''}`}
        style={{ color: theme?.colors?.warning || '#f59e0b' }}
      />
    ));
  };

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: theme?.colors?.background || '#f9fafb',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 relative group"
              style={{ 
                backgroundColor: theme?.colors?.surface || '#ffffff',
                boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                borderRadius: theme?.borderRadius?.xl || '16px',
                border: `1px solid ${theme?.colors?.border || '#e5e7eb'}`
              }}
            >
              {isEditing && (
                <button
                  onClick={() => removeTestimonial(index)}
                  className="absolute top-2 right-2 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    backgroundColor: theme?.colors?.error || '#ef4444',
                    borderRadius: theme?.borderRadius?.full || '50%'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-4 mb-4">
                {isEditing ? (
                  <input
                    type="url"
                    value={testimonial.avatar}
                    onChange={(e) => handleTestimonialChange(index, 'avatar', e.target.value)}
                    className="w-12 h-12 rounded-full border-2 border-dashed p-1 text-xs"
                    style={{ 
                      borderColor: theme?.colors?.border || '#d1d5db',
                      borderRadius: theme?.borderRadius?.full || '50%'
                    }}
                    placeholder="Avatar URL"
                  />
                ) : (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 object-cover"
                    style={{ 
                      borderRadius: theme?.borderRadius?.full || '50%',
                      border: `2px solid ${theme?.colors?.border || '#e5e7eb'}`
                    }}
                  />
                )}
                
                <div className="flex-1">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                        className="bg-transparent border-2 border-dashed rounded-lg p-1 w-full text-sm"
                        style={{ 
                          color: theme?.colors?.text || '#111827',
                          borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                          fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.headingWeight || 700,
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={`${testimonial.role}, ${testimonial.company}`}
                        onChange={(e) => {
                          const [role, company] = e.target.value.split(', ');
                          handleTestimonialChange(index, 'role', role || '');
                          handleTestimonialChange(index, 'company', company || '');
                        }}
                        className="bg-transparent border-2 border-dashed rounded-lg p-1 w-full"
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.small || '0.875rem',
                          fontWeight: theme?.typography?.bodyWeight || 400,
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="Role, Company"
                      />
                    </>
                  ) : (
                    <>
                      <h4 
                        style={{ 
                          color: theme?.colors?.text || '#111827',
                          fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.headingWeight || 700
                        }}
                      >
                        {testimonial.name}
                      </h4>
                      <p 
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.small || '0.875rem',
                          fontWeight: theme?.typography?.bodyWeight || 400
                        }}
                      >
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => handleTestimonialChange(index, 'rating', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm"
                    style={{ 
                      borderColor: theme?.colors?.border || '#d1d5db',
                      borderRadius: theme?.borderRadius?.md || '8px',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif'
                    }}
                  />
                ) : (
                  renderStars(testimonial.rating)
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={testimonial.content}
                  onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                  className="bg-transparent border-2 border-dashed rounded-lg p-2 w-full resize-none"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    borderRadius: theme?.borderRadius?.md || '8px'
                  }}
                  placeholder="Testimonial content"
                  rows={3}
                />
              ) : (
                <p 
                  className="italic"
                  style={{ 
                    color: theme?.colors?.textSecondary || '#6b7280',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.body || '1rem',
                    fontWeight: theme?.typography?.bodyWeight || 400,
                    lineHeight: theme?.typography?.bodyLineHeight || 1.6
                  }}
                >
                  "{testimonial.content}"
                </p>
              )}
            </motion.div>
          ))}

          {isEditing && (
            <motion.button
              onClick={addTestimonial}
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
                  Add Testimonial
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGrid;