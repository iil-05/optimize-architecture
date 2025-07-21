import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, X } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface Project {
    title: string;
    description: string;
    image: string;
    category: string;
    url?: string;
}

interface PortfolioGridProps {
    content: {
        title: string;
        subtitle?: string;
        projects: Project[];
        categories: string[];
    };
    isEditing: boolean;
    onChange: (content: any) => void;
    theme?: ThemeDefinition;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({
    content,
    isEditing,
    onChange,
    theme,
}) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleChange = (field: string, value: any) => {
        onChange({ ...content, [field]: value });
    };

    const handleProjectChange = (index: number, field: string, value: string) => {
        const updatedProjects = [...content.projects];
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
        handleChange('projects', updatedProjects);
    };

    const addProject = () => {
        const newProject: Project = {
            title: 'New Project',
            description: 'Project description',
            image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
            category: 'Web Design',
            url: '#',
        };
        handleChange('projects', [...content.projects, newProject]);
    };

    const removeProject = (index: number) => {
        const updatedProjects = content.projects.filter((_, i) => i !== index);
        handleChange('projects', updatedProjects);
    };

    const filteredProjects = selectedCategory === 'All'
        ? content.projects
        : content.projects.filter((project) => project.category === selectedCategory);

    const allCategories = ['All', ...content.categories];

    return (
        <section
            className="py-12 sm:py-20"
            style={{
                backgroundColor: theme?.colors?.background || '#f9fafb',
                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-16">
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
                                placeholder="Enter section title"
                            />
                            <input
                                type="text"
                                value={content.subtitle || ''}
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
                                placeholder="Enter subtitle (optional)"
                            />
                        </>
                    ) : (
                        <>
                            <h2
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
                            </h2>
                            {content.subtitle && (
                                <p
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
                                </p>
                            )}
                        </>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
                        {allCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className="px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors"
                                style={{
                                    backgroundColor: selectedCategory === category ? theme?.colors?.primary || '#3b82f6' : theme?.colors?.surface || '#ffffff',
                                    color: selectedCategory === category ? '#ffffff' : theme?.colors?.text || '#111827',
                                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                                    fontSize: theme?.typography?.body || '1rem',
                                    fontWeight: theme?.typography?.buttonWeight || 600,
                                    borderRadius: theme?.borderRadius?.full || '50px',
                                    border: `1px solid ${theme?.colors?.border || '#e5e7eb'}`,
                                    cursor: 'pointer',
                                    boxShadow: selectedCategory === category ? theme?.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCategory !== category) {
                                        e.currentTarget.style.backgroundColor = `${theme?.colors?.primary || '#3b82f6'}20`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCategory !== category) {
                                        e.currentTarget.style.backgroundColor = theme?.colors?.surface || '#ffffff';
                                    }
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {(isEditing ? content.projects : filteredProjects).map((project, index) => (
                        <motion.div
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
                                    onClick={() => removeProject(index)}
                                    className="absolute top-2 right-2 z-10 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ 
                                        backgroundColor: theme?.colors?.error || '#ef4444',
                                        borderRadius: theme?.borderRadius?.full || '50%'
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            <div className="relative overflow-hidden">
                                {isEditing ? (
                                    <div
                                        className="h-48 flex items-center justify-center"
                                        style={{ backgroundColor: theme?.colors?.background || '#f9fafb' }}
                                    >
                                        <input
                                            type="url"
                                            value={project.image}
                                            onChange={(e) => handleProjectChange(index, 'image', e.target.value)}
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
                                    <>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                            style={{ borderRadius: `${theme?.borderRadius?.xl || '16px'} ${theme?.borderRadius?.xl || '16px'} 0 0` }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <a
                                                href={project.url}
                                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
                                                style={{ 
                                                    boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                    borderRadius: theme?.borderRadius?.full || '50%'
                                                }}
                                            >
                                                <ExternalLink className="w-5 h-5" style={{ color: theme?.colors?.text || '#111827' }} />
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="mb-3">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={project.category}
                                            onChange={(e) => handleProjectChange(index, 'category', e.target.value)}
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
                                            {project.category}
                                        </span>
                                    )}
                                </div>

                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                            className="mb-3 bg-transparent border-2 border-dashed rounded-lg p-2 w-full"
                                            style={{
                                                color: theme?.colors?.text || '#111827',
                                                borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                                                fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                                                fontSize: theme?.typography?.h3 || '1.25rem',
                                                fontWeight: theme?.typography?.headingWeight || 700,
                                                borderRadius: theme?.borderRadius?.md || '8px'
                                            }}
                                            placeholder="Project title"
                                        />
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                            className="leading-relaxed bg-transparent border-2 border-dashed rounded-lg p-2 w-full h-20 resize-none text-sm"
                                            style={{
                                                color: theme?.colors?.textSecondary || '#6b7280',
                                                borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                                                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                                                fontSize: theme?.typography?.body || '1rem',
                                                fontWeight: theme?.typography?.bodyWeight || 400,
                                                borderRadius: theme?.borderRadius?.md || '8px'
                                            }}
                                            placeholder="Project description"
                                        />
                                        <input
                                            type="url"
                                            value={project.url || ''}
                                            onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                                            className="mt-2 w-full px-2 py-1 border rounded text-sm"
                                            style={{
                                                borderColor: theme?.colors?.border || '#d1d5db',
                                                color: theme?.colors?.text || '#111827',
                                                backgroundColor: theme?.colors?.surface || '#ffffff',
                                                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                                                fontSize: theme?.typography?.small || '0.875rem',
                                                borderRadius: theme?.borderRadius?.md || '8px'
                                            }}
                                            placeholder="Project URL"
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
                                            {project.title}
                                        </h3>
                                        <p
                                            className="leading-relaxed text-sm"
                                            style={{
                                                color: theme?.colors?.textSecondary || '#6b7280',
                                                fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                                                fontSize: theme?.typography?.body || '1rem',
                                                fontWeight: theme?.typography?.bodyWeight || 400,
                                                lineHeight: theme?.typography?.bodyLineHeight || 1.6
                                            }}
                                        >
                                            {project.description}
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isEditing && (
                        <motion.button
                            onClick={addProject}
                            className="border-2 border-dashed p-8 transition-all duration-200 flex items-center justify-center min-h-[300px]"
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
                                    Add Project
                                </span>
                            </div>
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioGrid;