import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Plus, X } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  url: string;
}

interface BlogGridProps {
  content: {
    title: string;
    subtitle: string;
    posts: BlogPost[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const BlogGrid: React.FC<BlogGridProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handlePostChange = (index: number, field: string, value: string) => {
    const updatedPosts = [...content.posts];
    updatedPosts[index] = { ...updatedPosts[index], [field]: value };
    handleChange('posts', updatedPosts);
  };

  const addPost = () => {
    const newPost: BlogPost = {
      title: 'New Blog Post',
      excerpt: 'This is a brief excerpt of the blog post...',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      author: 'Author Name',
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      url: '#',
    };
    handleChange('posts', [...content.posts, newPost]);
  };

  const removePost = (index: number) => {
    const updatedPosts = content.posts.filter((_, i) => i !== index);
    handleChange('posts', updatedPosts);
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
          {content.posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden transition-shadow duration-300 relative group"
              style={{ 
                backgroundColor: theme?.colors?.surface || '#ffffff',
                boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                borderRadius: theme?.borderRadius?.xl || '16px',
                border: `1px solid ${theme?.colors?.border || '#e5e7eb'}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = theme?.shadows?.xl || '0 20px 25px -5px rgb(0 0 0 / 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isEditing && (
                <button
                  onClick={() => removePost(index)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    backgroundColor: theme?.colors?.error || '#ef4444',
                    borderRadius: theme?.borderRadius?.full || '50%'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isEditing ? (
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ backgroundColor: theme?.colors?.background || '#f9fafb' }}
                >
                  <input
                    type="url"
                    value={post.image}
                    onChange={(e) => handlePostChange(index, 'image', e.target.value)}
                    className="w-full h-full px-4 py-2 text-center text-sm"
                    style={{
                      backgroundColor: 'transparent',
                      color: theme?.colors?.text || '#111827',
                      border: `2px dashed ${theme?.colors?.primary || '#3b82f6'}50`,
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      borderRadius: theme?.borderRadius?.md || '8px'
                    }}
                    placeholder="Image URL"
                  />
                </div>
              ) : (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  style={{ borderRadius: `${theme?.borderRadius?.xl || '16px'} ${theme?.borderRadius?.xl || '16px'} 0 0` }}
                />
              )}

              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" style={{ color: theme?.colors?.textSecondary || '#6b7280' }} />
                    {isEditing ? (
                      <input
                        type="date"
                        value={post.date}
                        onChange={(e) => handlePostChange(index, 'date', e.target.value)}
                        className="bg-transparent border rounded px-1 text-xs"
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          borderColor: theme?.colors?.border || '#d1d5db',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          borderRadius: theme?.borderRadius?.sm || '4px'
                        }}
                      />
                    ) : (
                      <span style={{ 
                        color: theme?.colors?.textSecondary || '#6b7280',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.small || '0.875rem'
                      }}>
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" style={{ color: theme?.colors?.textSecondary || '#6b7280' }} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={post.author}
                        onChange={(e) => handlePostChange(index, 'author', e.target.value)}
                        className="bg-transparent border rounded px-1 text-xs w-20"
                        style={{ 
                          color: theme?.colors?.textSecondary || '#6b7280',
                          borderColor: theme?.colors?.border || '#d1d5db',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          borderRadius: theme?.borderRadius?.sm || '4px'
                        }}
                        placeholder="Author"
                      />
                    ) : (
                      <span style={{ 
                        color: theme?.colors?.textSecondary || '#6b7280',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.small || '0.875rem'
                      }}>
                        {post.author}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Tag className="w-4 h-4" style={{ color: theme?.colors?.primary || '#3b82f6' }} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={post.category}
                        onChange={(e) => handlePostChange(index, 'category', e.target.value)}
                        className="text-sm font-medium bg-transparent border rounded px-2 py-1"
                        style={{ 
                          color: theme?.colors?.primary || '#3b82f6',
                          borderColor: theme?.colors?.border || '#d1d5db',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.small || '0.875rem',
                          fontWeight: theme?.typography?.buttonWeight || 600,
                          borderRadius: theme?.borderRadius?.md || '8px'
                        }}
                        placeholder="Category"
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium"
                        style={{ 
                          color: theme?.colors?.primary || '#3b82f6',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.small || '0.875rem',
                          fontWeight: theme?.typography?.buttonWeight || 600
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => handlePostChange(index, 'title', e.target.value)}
                      className="mb-3 bg-transparent border-2 border-dashed rounded-lg p-2 w-full"
                      style={{ 
                        color: theme?.colors?.text || '#111827',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h3 || '1.25rem',
                        fontWeight: theme?.typography?.headingWeight || 700,
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Post title"
                    />
                    <textarea
                      value={post.excerpt}
                      onChange={(e) => handlePostChange(index, 'excerpt', e.target.value)}
                      className="leading-relaxed mb-4 bg-transparent border-2 border-dashed rounded-lg p-2 w-full h-20 resize-none text-sm"
                      style={{ 
                        color: theme?.colors?.textSecondary || '#6b7280',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.bodyWeight || 400,
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Post excerpt"
                    />
                    <input
                      type="url"
                      value={post.url}
                      onChange={(e) => handlePostChange(index, 'url', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      style={{ 
                        borderColor: theme?.colors?.border || '#d1d5db',
                        color: theme?.colors?.text || '#111827',
                        backgroundColor: theme?.colors?.background || '#f9fafb',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.small || '0.875rem',
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Post URL"
                    />
                  </>
                ) : (
                  <>
                    <h3 
                      className="mb-3"
                      style={{ 
                        color: theme?.colors?.text || '#111827',
                        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h3 || '1.25rem',
                        fontWeight: theme?.typography?.headingWeight || 700,
                        lineHeight: theme?.typography?.headingLineHeight || 1.2
                      }}
                    >
                      {post.title}
                    </h3>
                    <p 
                      className="leading-relaxed mb-4 text-sm"
                      style={{ 
                        color: theme?.colors?.textSecondary || '#6b7280',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.bodyWeight || 400,
                        lineHeight: theme?.typography?.bodyLineHeight || 1.6
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <a
                      href={post.url}
                      className="inline-block font-medium hover:underline"
                      style={{ 
                        color: theme?.colors?.primary || '#3b82f6',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.buttonWeight || 600,
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Read More →
                    </a>
                  </>
                )}
              </div>
            </motion.article>
          ))}

          {isEditing && (
            <motion.button
              onClick={addPost}
              className="border-2 border-dashed p-8 transition-all duration-200 flex items-center justify-center min-h-[400px]"
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
                  Add Blog Post
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;