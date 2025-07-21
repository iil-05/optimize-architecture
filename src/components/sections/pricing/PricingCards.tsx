import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { ThemeDefinition } from '../../../core/ThemeRegistry';

interface Plan {
  name: string;
  price: string;
  features: string[];
}

interface PricingCardsProps {
  content: {
    title: string;
    plans: Plan[];
  };
  isEditing: boolean;
  onChange: (content: any) => void;
  theme?: ThemeDefinition;
}

const PricingCards: React.FC<PricingCardsProps> = ({ content, isEditing, onChange, theme }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handlePlanChange = (index: number, field: string, value: any) => {
    const updatedPlans = [...content.plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    handleChange('plans', updatedPlans);
  };

  const addPlan = () => {
    const newPlan: Plan = {
      name: 'New Plan',
      price: '$19',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    };
    handleChange('plans', [...content.plans, newPlan]);
  };

  const removePlan = (index: number) => {
    const updatedPlans = content.plans.filter((_, i) => i !== index);
    handleChange('plans', updatedPlans);
  };

  const addFeature = (planIndex: number) => {
    const updatedPlans = [...content.plans];
    updatedPlans[planIndex].features.push('New Feature');
    handleChange('plans', updatedPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...content.plans];
    updatedPlans[planIndex].features = updatedPlans[planIndex].features.filter((_, i) => i !== featureIndex);
    handleChange('plans', updatedPlans);
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...content.plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    handleChange('plans', updatedPlans);
  };

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: theme?.colors?.surface || '#ffffff',
        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {isEditing ? (
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
            ) : (
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
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 transition-shadow duration-300 relative group border-2 ${
                index === 1 ? 'scale-105' : ''
              }`}
              style={{
                backgroundColor: theme?.colors?.surface || '#ffffff',
                borderColor: index === 1 ? theme?.colors?.primary || '#3b82f6' : theme?.colors?.border || '#e5e7eb',
                boxShadow: theme?.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                borderRadius: theme?.borderRadius?.xl || '16px'
              }}
            >
              {index === 1 && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: theme?.colors?.primary || '#3b82f6',
                    borderRadius: theme?.borderRadius?.full || '50px',
                    fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                    fontSize: theme?.typography?.small || '0.875rem',
                    fontWeight: theme?.typography?.buttonWeight || 600
                  }}
                >
                  Popular
                </div>
              )}

              {isEditing && (
                <button
                  onClick={() => removePlan(index)}
                  className="absolute top-2 right-2 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    backgroundColor: theme?.colors?.error || '#ef4444',
                    borderRadius: theme?.borderRadius?.full || '50%'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="text-center mb-8">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                      className="mb-4 bg-transparent border-2 border-dashed rounded-lg p-2 w-full text-center"
                      style={{
                        color: theme?.colors?.text || '#111827',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h2 || '1.5rem',
                        fontWeight: theme?.typography?.headingWeight || 700,
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="Plan name"
                    />
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                      className="bg-transparent border-2 border-dashed rounded-lg p-2 w-full text-center"
                      style={{
                        color: theme?.colors?.primary || '#3b82f6',
                        borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                        fontFamily: theme?.fonts?.accent || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h1 || '2rem',
                        fontWeight: theme?.typography?.headingWeight || 700,
                        borderRadius: theme?.borderRadius?.md || '8px'
                      }}
                      placeholder="$19"
                    />
                  </>
                ) : (
                  <>
                    <h3
                      className="mb-4"
                      style={{
                        color: theme?.colors?.text || '#111827',
                        fontFamily: theme?.fonts?.primary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h2 || '1.5rem',
                        fontWeight: theme?.typography?.headingWeight || 700,
                        lineHeight: theme?.typography?.headingLineHeight || 1.2
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className="mb-2"
                      style={{
                        color: theme?.colors?.primary || '#3b82f6',
                        fontFamily: theme?.fonts?.accent || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.h1 || '2rem',
                        fontWeight: theme?.typography?.headingWeight || 700
                      }}
                    >
                      {plan.price}
                    </div>
                    <p
                      style={{
                        color: theme?.colors?.textSecondary || '#6b7280',
                        fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                        fontSize: theme?.typography?.body || '1rem',
                        fontWeight: theme?.typography?.bodyWeight || 400
                      }}
                    >
                      per month
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${theme?.colors?.success || '#10b981'}20`,
                        borderRadius: theme?.borderRadius?.full || '50%'
                      }}
                    >
                      <Check className="w-3 h-3" style={{ color: theme?.colors?.success || '#10b981' }} />
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                          className="flex-1 bg-transparent border-2 border-dashed rounded-lg p-1 text-sm"
                          style={{
                            color: theme?.colors?.text || '#111827',
                            borderColor: `${theme?.colors?.primary || '#3b82f6'}50`,
                            fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                            fontSize: theme?.typography?.body || '1rem',
                            fontWeight: theme?.typography?.bodyWeight || 400,
                            borderRadius: theme?.borderRadius?.md || '8px'
                          }}
                          placeholder="Feature"
                        />
                        <button
                          onClick={() => removeFeature(index, featureIndex)}
                          className="w-4 h-4 text-white rounded-full flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: theme?.colors?.error || '#ef4444',
                            borderRadius: theme?.borderRadius?.full || '50%'
                          }}
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          color: theme?.colors?.text || '#111827',
                          fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                          fontSize: theme?.typography?.body || '1rem',
                          fontWeight: theme?.typography?.bodyWeight || 400
                        }}
                      >
                        {feature}
                      </span>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button
                    onClick={() => addFeature(index)}
                    className="flex items-center gap-2 text-sm"
                    style={{ 
                      color: theme?.colors?.primary || '#3b82f6',
                      fontFamily: theme?.fonts?.secondary || 'Inter, system-ui, sans-serif',
                      fontSize: theme?.typography?.small || '0.875rem',
                      fontWeight: theme?.typography?.bodyWeight || 400
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </button>
                )}
              </div>

              <button
                className="w-full py-3 px-6 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: index === 1 ? theme?.colors?.primary || '#3b82f6' : `${theme?.colors?.primary || '#3b82f6'}15`,
                  color: index === 1 ? '#ffffff' : theme?.colors?.primary || '#3b82f6',
                  fontFamily: theme?.fonts?.accent || 'Inter, system-ui, sans-serif',
                  fontSize: theme?.typography?.button || '1rem',
                  fontWeight: theme?.typography?.buttonWeight || 600,
                  borderRadius: theme?.borderRadius?.md || '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (index !== 1) {
                    e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#3b82f6';
                    e.currentTarget.style.color = '#ffffff';
                  } else {
                    e.currentTarget.style.backgroundColor = theme?.colors?.secondary || '#06b6d4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 1) {
                    e.currentTarget.style.backgroundColor = `${theme?.colors?.primary || '#3b82f6'}15`;
                    e.currentTarget.style.color = theme?.colors?.primary || '#3b82f6';
                  } else {
                    e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#3b82f6';
                  }
                }}
              >
                Get Started
              </button>
            </motion.div>
          ))}

          {isEditing && (
            <motion.button
              onClick={addPlan}
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
                  Add Plan
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;