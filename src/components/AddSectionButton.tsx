import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeDefinition } from '../core/ThemeRegistry';

interface AddSectionButtonProps {
  onAdd: () => void;
  position: 'above' | 'below' | 'between';
  theme?: ThemeDefinition;
  index?: number;
  isVisible?: boolean;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({
  onAdd,
  position,
  index,
  isVisible = true
}) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="relative group py-2 sm:py-4 font-sans">
      {/* Animated line */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 sm:px-6">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Add button */}
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: position === 'above' ? -10 : 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-dashed border-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-primary-500 hover:bg-primary-50 shadow-elegant hover:shadow-glow z-10"
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary-500" />
        </motion.div>
      </motion.button>

      {/* Enhanced Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-elegant-lg font-sans z-20"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{t('sectionControls.addAbove').replace('section ', '')} {position === 'above' ? t('sectionControls.addAbove').split(' ')[2] : position === 'below' ? t('sectionControls.addBelow').split(' ')[2] : t('common.add')}</span>
          {typeof index === 'number' && (
            <span className="text-primary-300">#{index + 1}</span>
          )}
        </div>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 hidden sm:block"></div>
      </motion.div>

      {/* Hover area for better UX */}
      <div className="absolute inset-0 -my-1 sm:-my-2 cursor-pointer" onClick={onAdd} />
    </div>
  );
};

export default AddSectionButton;