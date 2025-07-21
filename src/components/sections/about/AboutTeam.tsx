import React from 'react';
import { motion } from 'framer-motion';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface AboutTeamProps {
  content: {
    title: string;
    subtitle: string;
    teamMembers: TeamMember[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const AboutTeam: React.FC<AboutTeamProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...content.teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    handleChange('teamMembers', updatedMembers);
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
          {content.teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
              style={{ 
                backgroundColor: theme?.colors?.surface || '#ffffff',
                boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                borderRadius: theme?.borderRadius?.xl || '16px'
              }}
            >
              {isEditing ? (
                <>
                  <input
                    type="url"
                    value={member.image}
                    onChange={(e) => handleMemberChange(index, 'image', e.target.value)}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-dashed p-2 text-center text-xs"
                    style={{ 
                      borderColor: theme?.colors?.border || '#d1d5db',
                      color: theme?.colors?.textSecondary || '#6b7280',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      borderRadius: theme?.borderRadius?.full || '50%'
                    }}
                    placeholder="Image URL"
                  />
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className="mb-2 bg-transparent border-2 border-dashed rounded-lg p-1 w-full text-center"
                    style={{ 
                      color: theme?.colors?.text || '#111827',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.h3 || '1.25rem',
                      fontWeight: theme?.typography?.headingWeight || 700,
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                    className="mb-3 bg-transparent border-2 border-dashed rounded-lg p-1 w-full text-center"
                    style={{ 
                      color: theme?.colors?.primary || '#3b82f6',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400,
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="Role"
                  />
                  <textarea
                    value={member.bio}
                    onChange={(e) => handleMemberChange(index, 'bio', e.target.value)}
                    className="bg-transparent border-2 border-dashed rounded-lg p-2 w-full resize-none"
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.small || '0.875rem',
                      fontWeight: theme?.typography?.bodyWeight || 400,
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="Bio"
                    rows={3}
                  />
                </>
              ) : (
                <>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 mx-auto mb-4 object-cover"
                    style={{ 
                      borderRadius: theme?.borderRadius?.full || '50%',
                      border: `2px solid ${theme?.colors?.border || '#d1d5db'}`
                    }}
                  />
                  <h3 
                    className="mb-2"
                    style={{ 
                      color: theme?.colors?.text || '#111827',
                      fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.h3 || '1.25rem',
                      fontWeight: theme?.typography?.headingWeight || 700
                    }}
                  >
                    {member.name}
                  </h3>
                  <p 
                    className="mb-3"
                    style={{ 
                      color: theme?.colors?.primary || '#3b82f6',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.body || '1rem',
                      fontWeight: theme?.typography?.bodyWeight || 400
                    }}
                  >
                    {member.role}
                  </p>
                  <p 
                    style={{ 
                      color: theme?.colors?.textSecondary || '#6b7280',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.small || '0.875rem',
                      fontWeight: theme?.typography?.bodyWeight || 400,
                      lineHeight: theme?.typography?.bodyLineHeight || 1.6
                    }}
                  >
                    {member.bio}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;