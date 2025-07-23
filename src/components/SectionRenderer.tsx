import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { SectionInstance } from '../types';
import { useProject } from '../contexts/ProjectContext';
import SectionControls from './SectionControls';
import IconSelector from './IconSelector';
import HeroModern from './sections/heroes/HeroModern';
import HeroSplit from './sections/heroes/HeroSplit';
import AboutSimple from './sections/about/AboutSimple';
import AboutTeam from './sections/about/AboutTeam';
import ServicesGrid from './sections/services/ServicesGrid';
import FeaturesList from './sections/features/FeaturesList';
import PricingCards from './sections/pricing/PricingCards';
import TestimonialsGrid from './sections/testimonials/TestimonialsGrid';
import PortfolioGrid from './sections/portfolio/PortfolioGrid';
import ContactForm from './sections/contact/ContactForm';
import FooterSimple from './sections/footers/FooterSimple';
import FooterDetailed from './sections/footers/FooterDetailed';
import CTASimple from './sections/cta/CTASimple';
import BlogGrid from './sections/blog/BlogGrid';
import HeaderSimple from './sections/headers/HeaderSimple';
import HeaderModern from './sections/headers/HeaderModern';
import { ThemeDefinition } from '../core/ThemeRegistry';

// Icon mapping for template icons
import * as LucideIcons from 'lucide-react';

const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.File;
};

interface SectionRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  onSelect: () => void;
  theme?: ThemeDefinition;
  isPreview?: boolean;
  isEditing: boolean;
  onEdit: (editing: boolean) => void;
  onAddAbove?: () => void;
  onAddBelow?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  isSelected,
  onSelect,
  theme,
  isPreview = false,
  isEditing,
  onEdit,
  onAddAbove,
  onAddBelow,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
}) => {
  const { updateSectionData, deleteSection, duplicateSection, getSectionTemplate } = useProject();
  const [showIconSelector, setShowIconSelector] = React.useState(false);
  const [iconField, setIconField] = React.useState<string>('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const template = getSectionTemplate(section.templateId);

  if (!template) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg m-4">
        <p className="text-red-600">Template not found: {section.templateId}</p>
      </div>
    );
  }

  const handleContentChange = (newData: any) => {
    updateSectionData(section.id, newData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(section.id);
    }
  };

  const handleDuplicate = () => {
    duplicateSection(section.id);
  };

  const handleMoveUp = () => {
    if (onMoveUp) onMoveUp();
  };

  const handleMoveDown = () => {
    if (onMoveDown) onMoveDown();
  };

  const handleIconClick = (field: string) => {
    console.log('🎯 Icon click handler called with field:', field);
    setIconField(field);
    setShowIconSelector(true);
  };

  const handleIconSelect = (iconName: string) => {
    console.log('🔄 Icon selected:', { iconField, iconName });

    if (iconField) {
      const updatedData = { ...section.data };

      // Handle nested field paths like "services.0.icon" or "features.1.icon"
      const fieldParts = iconField.split('.');

      if (fieldParts.length === 3) {
        // Handle array fields like services.0.icon or features.1.icon
        const arrayName = fieldParts[0]; // 'services' or 'features'
        const index = parseInt(fieldParts[1]); // array index
        const fieldName = fieldParts[2]; // 'icon'

        if (updatedData[arrayName] && Array.isArray(updatedData[arrayName]) && updatedData[arrayName][index]) {
          updatedData[arrayName][index][fieldName] = iconName;
          console.log('✅ Updated nested array field:', { arrayName, index, fieldName, iconName });
        }
      } else if (fieldParts.length === 1) {
        // Handle simple fields like just "icon"
        updatedData[iconField] = iconName;
        console.log('✅ Updated simple field:', { iconField, iconName });
      }

      handleContentChange(updatedData);
      console.log('📝 Section data updated:', updatedData);
    }

    setShowIconSelector(false);
    setIconField('');
  };

  const renderSection = () => {
    const commonProps = {
      content: section.data,
      isEditing,
      onChange: handleContentChange,
      theme,
      onIconClick: handleIconClick,
    };

    try {
      switch (template.type) {
        case 'header-simple':
          return <HeaderSimple {...commonProps} />;
        case 'header-modern':
          return <HeaderModern {...commonProps} />;
        case 'hero-modern':
          return <HeroModern {...commonProps} />;
        case 'hero-split':
          return <HeroSplit {...commonProps} />;
        case 'about-simple':
          return <AboutSimple {...commonProps} />;
        case 'about-team':
          return <AboutTeam {...commonProps} />;
        case 'services-grid':
          return <ServicesGrid {...commonProps} />;
        case 'features-list':
          return <FeaturesList {...commonProps} />;
        case 'pricing-cards':
          return <PricingCards {...commonProps} />;
        case 'testimonials-grid':
          return <TestimonialsGrid {...commonProps} />;
        case 'portfolio-grid':
          return <PortfolioGrid {...commonProps} />;
        case 'contact-form':
          return <ContactForm {...commonProps} />;
        case 'footer-simple':
          return <FooterSimple {...commonProps} />;
        case 'footer-detailed':
          return <FooterDetailed {...commonProps} />;
        case 'cta-simple':
          return <CTASimple {...commonProps} />;
        case 'blog-grid':
          return <BlogGrid {...commonProps} />;
        default:
          return (
            <div className="p-8 text-center bg-gray-100 rounded-lg">
              <p className="text-gray-600">Unknown section type: {template.type}</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering section:', error);
      return (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error rendering section. Please try refreshing the page.</p>
        </div>
      );
    }
  };

  if (isPreview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderSection()}
      </motion.div>
    );
  }

  const IconComponent = getIconComponent(template.icon);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-300 ${isDragging ? 'opacity-50 scale-95 z-50' : ''
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-4 shadow-2xl' : ''}`}
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Section Controls */}
      <SectionControls
        section={section}
        template={template}
        isSelected={isSelected}
        isEditing={isEditing}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onEdit={onEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onAddAbove={onAddAbove || (() => { })}
        onAddBelow={onAddBelow || (() => { })}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      {/* Edit Mode Controls */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl px-6 py-3"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Editing Mode</span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all"
          >
            Done
          </motion.button>
        </motion.div>
      )}

      {/* Section Content */}
      <div className={`${isSelected && !isEditing ? 'pointer-events-none' : ''} ${isEditing ? 'ring-2 ring-blue-400 ring-offset-2' : ''
        }`}>
        {renderSection()}
      </div>

      {/* Selection Overlay */}
      {isSelected && !isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded-lg"
        />
      )}

      {/* Hover Indicator */}
      {!isSelected && !isEditing && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/5 rounded-lg"></div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <IconComponent className="w-4 h-4" />
              <span className="font-medium text-gray-700">{template.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Icon Selector Modal */}
      {showIconSelector && (
        <IconSelector
          currentIcon={(() => {
            const fieldParts = iconField.split('.');
            if (fieldParts.length === 3 && (fieldParts[0] === 'services' || fieldParts[0] === 'features')) {
              const arrayName = fieldParts[0];
              const index = parseInt(fieldParts[1]);
              const fieldName = fieldParts[2];
              const array = section.data[arrayName];
              return array && array[index] ? array[index][fieldName] || 'Zap' : 'Zap';
            }
            return section.data[iconField] || 'Zap';
          })()}
          onSelect={handleIconSelect}
          onClose={() => {
            setShowIconSelector(false);
            setIconField('');
          }}
        />
      )}
    </motion.div>
  );
};

export default SectionRenderer;