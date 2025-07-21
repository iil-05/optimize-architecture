import { SectionTemplate } from '../types';

export const improvedSectionTemplates: SectionTemplate[] = [
  // Headers
  {
    id: 'header-simple-001',
    name: 'Simple Navigation',
    category: 'headers',
    type: 'header-simple',
    thumbnail: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Clean navigation header with logo and menu items',
    icon: 'Navigation',
    tags: ['navigation', 'simple', 'clean'],
    defaultContent: {
      logo: 'Your Brand',
      menuItems: ['Home', 'About', 'Services', 'Contact'],
      ctaText: 'Get Started',
      ctaLink: '#',
    },
  },
  {
    id: 'header-modern-002',
    name: 'Gradient Header',
    category: 'headers',
    type: 'header-modern',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Modern header with beautiful gradient background',
    icon: 'Palette',
    tags: ['modern', 'gradient', 'colorful'],
    defaultContent: {
      logo: 'ModernBrand',
      menuItems: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
      ctaText: 'Sign Up Free',
      ctaLink: '#',
      hasGradient: true,
    },
  },

  // Heroes
  {
    id: 'hero-modern-001',
    name: 'Fullscreen Hero',
    category: 'heroes',
    type: 'hero-modern',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Stunning fullscreen hero with background image and powerful CTA',
    icon: 'Rocket',
    tags: ['hero', 'fullscreen', 'background', 'cta'],
    defaultContent: {
      title: 'Build Something Extraordinary',
      subtitle: 'Transform your ideas into reality',
      description: 'Create stunning websites with our powerful, intuitive platform. No coding required.',
      ctaText: 'Start Building Now',
      ctaLink: '#',
      secondaryCtaText: 'Watch Demo',
      backgroundImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1',
    },
  },
  {
    id: 'hero-split-002',
    name: 'Split Layout Hero',
    category: 'heroes',
    type: 'hero-split',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Two-column hero layout with content and image',
    icon: 'Smartphone',
    tags: ['hero', 'split', 'two-column', 'features'],
    defaultContent: {
      title: 'Revolutionize Your Workflow',
      subtitle: 'Next-generation productivity tools',
      description: 'Streamline your processes and boost efficiency with our cutting-edge platform.',
      ctaText: 'Get Started Free',
      ctaLink: '#',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      features: ['Real-time Collaboration', 'Advanced Analytics', 'Seamless Integration'],
    },
  },

  // About Sections
  {
    id: 'about-simple-001',
    name: 'About Us Simple',
    category: 'about',
    type: 'about-simple',
    thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Clean about section with image and feature list',
    icon: 'Users',
    tags: ['about', 'company', 'features', 'simple'],
    defaultContent: {
      title: 'About Our Mission',
      description: 'We are passionate innovators dedicated to creating exceptional digital experiences that empower businesses to thrive in the modern world.',
      image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      features: ['15+ Years Experience', 'Award-Winning Team', 'Global Reach', 'Customer-Focused'],
    },
  },
  {
    id: 'about-team-002',
    name: 'Meet the Team',
    category: 'about',
    type: 'about-team',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Showcase your team members with photos and bios',
    icon: 'UserCheck',
    tags: ['team', 'people', 'about', 'profiles'],
    defaultContent: {
      title: 'Meet Our Amazing Team',
      subtitle: 'The brilliant minds behind our success',
      teamMembers: [
        {
          name: 'Sarah Johnson',
          role: 'CEO & Founder',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Visionary leader with 20+ years of industry experience',
        },
        {
          name: 'Michael Chen',
          role: 'CTO',
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Technology innovator passionate about cutting-edge solutions',
        },
        {
          name: 'Emily Rodriguez',
          role: 'Head of Design',
          image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Creative genius crafting beautiful user experiences',
        },
      ],
    },
  },

  // Services
  {
    id: 'services-grid-001',
    name: 'Services Grid',
    category: 'services',
    type: 'services-grid',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Professional services showcase in grid layout',
    icon: 'Zap',
    tags: ['services', 'grid', 'business', 'offerings'],
    defaultContent: {
      title: 'Our Premium Services',
      subtitle: 'Comprehensive solutions for your business needs',
      services: [
        {
          icon: 'Palette',
          title: 'UI/UX Design',
          description: 'Beautiful, intuitive designs that captivate and convert your audience.',
        },
        {
          icon: 'Code',
          title: 'Web Development',
          description: 'Custom web applications built with cutting-edge technologies.',
        },
        {
          icon: 'Smartphone',
          title: 'Mobile Apps',
          description: 'Native and cross-platform mobile solutions for iOS and Android.',
        },
        {
          icon: 'TrendingUp',
          title: 'Digital Marketing',
          description: 'Strategic marketing campaigns that drive growth and engagement.',
        },
        {
          icon: 'BarChart3',
          title: 'Analytics & Insights',
          description: 'Data-driven insights to optimize your business performance.',
        },
        {
          icon: 'Shield',
          title: 'Security Solutions',
          description: 'Enterprise-grade security to protect your digital assets.',
        },
      ],
    },
  },

  // Features
  {
    id: 'features-list-001',
    name: 'Feature Highlights',
    category: 'features',
    type: 'features-list',
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Highlight your key features with icons and descriptions',
    icon: 'Star',
    tags: ['features', 'highlights', 'benefits', 'list'],
    defaultContent: {
      title: 'Powerful Features',
      subtitle: 'Everything you need to succeed',
      features: [
        {
          icon: 'Zap',
          title: 'Lightning Fast Performance',
          description: 'Optimized for speed with sub-second load times.',
        },
        {
          icon: 'Lock',
          title: 'Bank-Level Security',
          description: 'Your data is protected with enterprise-grade encryption.',
        },
        {
          icon: 'Smartphone',
          title: 'Mobile-First Design',
          description: 'Perfect experience across all devices and screen sizes.',
        },
        {
          icon: 'Palette',
          title: 'Fully Customizable',
          description: 'Tailor every aspect to match your unique brand identity.',
        },
      ],
    },
  },

  // Pricing
  {
    id: 'pricing-cards-001',
    name: 'Pricing Plans',
    category: 'pricing',
    type: 'pricing-cards',
    thumbnail: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Beautiful pricing table with multiple plan options',
    icon: 'DollarSign',
    tags: ['pricing', 'plans', 'subscription', 'business'],
    defaultContent: {
      title: 'Choose Your Perfect Plan',
      plans: [
        {
          name: 'Starter',
          price: '$19',
          features: ['5 Projects', '10GB Storage', 'Basic Support', 'SSL Certificate', 'Mobile Responsive'],
        },
        {
          name: 'Professional',
          price: '$49',
          features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Domain', 'SEO Tools'],
        },
        {
          name: 'Enterprise',
          price: '$99',
          features: ['Everything in Pro', 'Dedicated Manager', '1TB Storage', 'White Label', 'Custom Integrations', 'API Access'],
        },
      ],
    },
  },

  // Testimonials
  {
    id: 'testimonials-grid-001',
    name: 'Customer Reviews',
    category: 'testimonials',
    type: 'testimonials-grid',
    thumbnail: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Social proof with customer testimonials and ratings',
    icon: 'MessageSquare',
    tags: ['testimonials', 'reviews', 'social-proof', 'customers'],
    defaultContent: {
      title: 'What Our Customers Say',
      subtitle: 'Join thousands of satisfied customers worldwide',
      testimonials: [
        {
          name: 'Jennifer Martinez',
          role: 'Marketing Director',
          company: 'TechFlow Inc.',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'This platform completely transformed our digital presence. The results exceeded all expectations!',
          rating: 5,
        },
        {
          name: 'David Kim',
          role: 'Startup Founder',
          company: 'InnovateLab',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'Incredible ease of use and powerful features. Our team productivity increased by 300%!',
          rating: 5,
        },
        {
          name: 'Lisa Thompson',
          role: 'Creative Director',
          company: 'Design Studio Pro',
          avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'The design flexibility is amazing. We can create anything we imagine with this tool.',
          rating: 5,
        },
      ],
    },
  },

  // Portfolio
  {
    id: 'portfolio-grid-001',
    name: 'Project Showcase',
    category: 'portfolio',
    type: 'portfolio-grid',
    thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Showcase your best work with filterable portfolio grid',
    icon: 'Briefcase',
    tags: ['portfolio', 'projects', 'showcase', 'gallery'],
    defaultContent: {
      title: 'Our Latest Projects',
      subtitle: 'Discover our most recent creative work',
      categories: ['Web Design', 'Mobile Apps', 'Branding', 'E-commerce'],
      projects: [
        {
          title: 'E-commerce Revolution',
          description: 'Modern online marketplace with advanced AI recommendations',
          image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'E-commerce',
          url: '#',
        },
        {
          title: 'FinTech Mobile App',
          description: 'Secure banking application with biometric authentication',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'Mobile Apps',
          url: '#',
        },
        {
          title: 'Brand Identity System',
          description: 'Complete rebrand for innovative tech startup',
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'Branding',
          url: '#',
        },
      ],
    },
  },

  // Contact
  {
    id: 'contact-form-001',
    name: 'Contact Form',
    category: 'contact',
    type: 'contact-form',
    thumbnail: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Professional contact form with contact information',
    icon: 'Mail',
    tags: ['contact', 'form', 'communication', 'support'],
    defaultContent: {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond within 24 hours.',
      email: 'hello@yourcompany.com',
      phone: '+1 (555) 123-4567',
      address: '123 Innovation Drive, Tech City, TC 12345',
    },
  },

  // Footers
  {
    id: 'footer-simple-001',
    name: 'Simple Footer',
    category: 'footers',
    type: 'footer-simple',
    thumbnail: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Clean footer with social links and copyright',
    icon: 'Link',
    tags: ['footer', 'simple', 'social', 'links'],
    defaultContent: {
      companyName: 'Your Company',
      description: 'Creating exceptional digital experiences since 2020.',
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: 'Facebook' },
        { platform: 'Twitter', url: '#', icon: 'Twitter' },
        { platform: 'LinkedIn', url: '#', icon: 'Linkedin' },
        { platform: 'Instagram', url: '#', icon: 'Instagram' },
      ],
      copyright: '© 2024 Your Company. All rights reserved.',
    },
  },
  {
    id: 'footer-detailed-002',
    name: 'Comprehensive Footer',
    category: 'footers',
    type: 'footer-detailed',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Detailed footer with multiple sections and links',
    icon: 'Grid',
    tags: ['footer', 'detailed', 'comprehensive', 'links'],
    defaultContent: {
      companyName: 'Your Company',
      description: 'Leading the future of digital innovation with cutting-edge solutions.',
      sections: [
        {
          title: 'Products',
          links: ['Features', 'Pricing', 'Enterprise', 'API Documentation'],
        },
        {
          title: 'Company',
          links: ['About Us', 'Careers', 'Press Kit', 'Contact'],
        },
        {
          title: 'Resources',
          links: ['Blog', 'Help Center', 'Community', 'Status Page'],
        },
      ],
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: 'Facebook' },
        { platform: 'Twitter', url: '#', icon: 'Twitter' },
        { platform: 'LinkedIn', url: '#', icon: 'Linkedin' },
        { platform: 'Instagram', url: '#', icon: 'Instagram' },
      ],
      copyright: '© 2024 Your Company. All rights reserved.',
    },
  },

  // CTAs
  {
    id: 'cta-simple-001',
    name: 'Call to Action',
    category: 'cta',
    type: 'cta-simple',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Compelling call-to-action section to drive conversions',
    icon: 'Target',
    tags: ['cta', 'conversion', 'action', 'button'],
    defaultContent: {
      title: 'Ready to Transform Your Business?',
      description: 'Join over 10,000 companies that trust us to deliver exceptional results. Start your journey today.',
      ctaText: 'Get Started Free',
      ctaLink: '#',
      secondaryCtaText: 'Schedule a Demo',
    },
  },

  // Blog
  {
    id: 'blog-grid-001',
    name: 'Blog Posts',
    category: 'blog',
    type: 'blog-grid',
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Latest blog posts in an attractive grid layout',
    icon: 'FileText',
    tags: ['blog', 'content', 'articles', 'news'],
    defaultContent: {
      title: 'Latest Insights',
      subtitle: 'Stay updated with industry trends and expert insights',
      posts: [
        {
          title: 'The Future of Web Development in 2024',
          excerpt: 'Exploring the latest trends, technologies, and best practices shaping the web development landscape.',
          image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'Alex Johnson',
          date: '2024-01-15',
          category: 'Technology',
          url: '#',
        },
        {
          title: 'Building Better User Experiences',
          excerpt: 'Essential principles and strategies for creating interfaces that users love and remember.',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'Sarah Chen',
          date: '2024-01-12',
          category: 'Design',
          url: '#',
        },
        {
          title: 'Performance Optimization Secrets',
          excerpt: 'Advanced techniques to make your website lightning-fast and improve user satisfaction.',
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'Mike Rodriguez',
          date: '2024-01-10',
          category: 'Performance',
          url: '#',
        },
      ],
    },
  },
];

export const getSectionTemplateById = (id: string): SectionTemplate | undefined => {
  return improvedSectionTemplates.find(template => template.id === id);
};

export const getSectionTemplatesByCategory = (category: string): SectionTemplate[] => {
  return improvedSectionTemplates.filter(template => template.category === category);
};

export const getAllCategories = () => {
  const categories = [...new Set(improvedSectionTemplates.map(template => template.category))];
  return categories.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    count: improvedSectionTemplates.filter(template => template.category === category).length,
    icon: getCategoryIcon(category),
  }));
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    headers: 'Navigation',
    heroes: 'Rocket',
    about: 'Users',
    services: 'Zap',
    features: 'Star',
    pricing: 'DollarSign',
    testimonials: 'MessageSquare',
    portfolio: 'Briefcase',
    contact: 'Mail',
    footers: 'Link',
    cta: 'Target',
    blog: 'FileText',
  };
  return icons[category] || 'File';
};