import { SectionTemplate } from '../types';

export const sectionTemplates: SectionTemplate[] = [
  // Headers
  {
    id: 'header-simple',
    name: 'Simple Header',
    category: 'headers',
    type: 'header-simple',
    thumbnail: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Clean navigation header with logo and menu',
    defaultContent: {
      logo: 'Logo',
      menuItems: ['Home', 'About', 'Services', 'Contact'],
      ctaText: 'Get Started',
      ctaLink: '#',
    },
  },
  {
    id: 'header-modern',
    name: 'Modern Header',
    category: 'headers',
    type: 'header-modern',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Modern header with gradient background',
    defaultContent: {
      logo: 'Brand',
      menuItems: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
      ctaText: 'Sign Up',
      ctaLink: '#',
      hasGradient: true,
    },
  },

  // Heroes
  {
    id: 'hero-modern',
    name: 'Modern Hero',
    category: 'heroes',
    type: 'hero-modern',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Full-screen hero with background image and CTA',
    defaultContent: {
      title: 'Build Something Amazing',
      subtitle: 'Create beautiful websites with our platform',
      description: 'Turn your ideas into reality with our intuitive drag-and-drop builder. No coding required.',
      ctaText: 'Get Started Free',
      ctaLink: '#',
      secondaryCtaText: 'Watch Demo',
      backgroundImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1',
    },
  },
  {
    id: 'hero-split',
    name: 'Split Hero',
    category: 'heroes',
    type: 'hero-split',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Two-column hero with text and image',
    defaultContent: {
      title: 'Transform Your Business',
      subtitle: 'Digital solutions for modern companies',
      description: 'Streamline your workflow and boost productivity with our comprehensive suite of business tools.',
      ctaText: 'Start Free Trial',
      ctaLink: '#',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      features: ['24/7 Support', 'Cloud Storage', 'Team Collaboration'],
    },
  },

  // About Sections
  {
    id: 'about-simple',
    name: 'Simple About',
    category: 'about',
    type: 'about-simple',
    thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Basic about section with image and text',
    defaultContent: {
      title: 'About Our Company',
      description: 'We are a team of passionate individuals dedicated to creating exceptional digital experiences. Our mission is to help businesses thrive in the digital age.',
      image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      features: ['10+ Years Experience', 'Expert Team', 'Proven Results'],
    },
  },
  {
    id: 'about-team',
    name: 'Team About',
    category: 'about',
    type: 'about-team',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'About section with team member cards',
    defaultContent: {
      title: 'Meet Our Team',
      subtitle: 'The people behind our success',
      teamMembers: [
        {
          name: 'John Doe',
          role: 'CEO & Founder',
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Visionary leader with 15+ years of experience',
        },
        {
          name: 'Jane Smith',
          role: 'CTO',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Technology expert driving innovation',
        },
        {
          name: 'Mike Johnson',
          role: 'Lead Designer',
          image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
          bio: 'Creative mind behind our beautiful designs',
        },
      ],
    },
  },

  // Services
  {
    id: 'services-grid',
    name: 'Services Grid',
    category: 'services',
    type: 'services-grid',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Grid layout showcasing your services',
    defaultContent: {
      title: 'Our Services',
      subtitle: 'Everything you need to succeed online',
      services: [
        {
          icon: '🎨',
          title: 'Web Design',
          description: 'Beautiful, responsive websites that convert visitors into customers.',
        },
        {
          icon: '💻',
          title: 'Development',
          description: 'Custom web applications built with modern technologies.',
        },
        {
          icon: '📱',
          title: 'Mobile Apps',
          description: 'Native and cross-platform mobile applications.',
        },
        {
          icon: '🚀',
          title: 'SEO Optimization',
          description: 'Improve your search rankings and online visibility.',
        },
        {
          icon: '📊',
          title: 'Analytics',
          description: 'Data-driven insights to grow your business.',
        },
        {
          icon: '🛡️',
          title: 'Security',
          description: 'Protect your digital assets with enterprise-grade security.',
        },
      ],
    },
  },

  // Features
  {
    id: 'features-list',
    name: 'Feature List',
    category: 'features',
    type: 'features-list',
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Detailed feature list with descriptions',
    defaultContent: {
      title: 'Why Choose Us',
      subtitle: 'Features that make the difference',
      features: [
        {
          icon: '⚡',
          title: 'Lightning Fast',
          description: 'Optimized for speed and performance.',
        },
        {
          icon: '🔒',
          title: 'Secure',
          description: 'Enterprise-grade security for your peace of mind.',
        },
        {
          icon: '📱',
          title: 'Mobile First',
          description: 'Designed to work perfectly on all devices.',
        },
        {
          icon: '🎨',
          title: 'Customizable',
          description: 'Tailor everything to match your brand.',
        },
      ],
    },
  },

  // Pricing
  {
    id: 'pricing-cards',
    name: 'Pricing Cards',
    category: 'pricing',
    type: 'pricing-cards',
    thumbnail: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Attractive pricing table with plans',
    defaultContent: {
      title: 'Choose Your Plan',
      plans: [
        {
          name: 'Starter',
          price: '$9',
          features: ['5 Projects', 'Basic Support', '10GB Storage', 'SSL Certificate'],
        },
        {
          name: 'Pro',
          price: '$29',
          features: ['Unlimited Projects', 'Priority Support', '100GB Storage', 'Advanced Analytics', 'Custom Domain'],
        },
        {
          name: 'Enterprise',
          price: '$99',
          features: ['Everything in Pro', 'Dedicated Manager', '1TB Storage', 'White Label', 'Custom Integrations'],
        },
      ],
    },
  },

  // Testimonials
  {
    id: 'testimonials-grid',
    name: 'Testimonials Grid',
    category: 'testimonials',
    type: 'testimonials-grid',
    thumbnail: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Customer testimonials in grid layout',
    defaultContent: {
      title: 'What Our Clients Say',
      subtitle: 'Don\'t just take our word for it',
      testimonials: [
        {
          name: 'Sarah Johnson',
          role: 'Marketing Director',
          company: 'TechCorp',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'This platform transformed how we build websites. The results speak for themselves.',
          rating: 5,
        },
        {
          name: 'David Chen',
          role: 'CEO',
          company: 'StartupXYZ',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'Incredible flexibility and ease of use. Our team loves working with this tool.',
          rating: 5,
        },
        {
          name: 'Emily Rodriguez',
          role: 'Designer',
          company: 'Creative Agency',
          avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          content: 'The design possibilities are endless. It\'s like having a superpower for web design.',
          rating: 5,
        },
      ],
    },
  },

  // Portfolio
  {
    id: 'portfolio-grid',
    name: 'Portfolio Grid',
    category: 'portfolio',
    type: 'portfolio-grid',
    thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Showcase your work with filterable portfolio',
    defaultContent: {
      title: 'Our Portfolio',
      subtitle: 'See what we\'ve been working on',
      categories: ['Web Design', 'Mobile Apps', 'Branding'],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Modern online store with advanced features',
          image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'Web Design',
          url: '#',
        },
        {
          title: 'Mobile Banking App',
          description: 'Secure and intuitive banking application',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'Mobile Apps',
          url: '#',
        },
        {
          title: 'Brand Identity',
          description: 'Complete brand redesign for tech startup',
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          category: 'Branding',
          url: '#',
        },
      ],
    },
  },

  // Contact
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'contact',
    type: 'contact-form',
    thumbnail: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Professional contact form with validation',
    defaultContent: {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, City, State 12345',
    },
  },

  // Footers
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    category: 'footers',
    type: 'footer-simple',
    thumbnail: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Clean footer with social links',
    defaultContent: {
      companyName: 'Your Company',
      description: 'Building amazing digital experiences since 2020.',
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: '📘' },
        { platform: 'Twitter', url: '#', icon: '🐦' },
        { platform: 'LinkedIn', url: '#', icon: '💼' },
        { platform: 'Instagram', url: '#', icon: '📷' },
      ],
      copyright: '© 2024 Your Company. All rights reserved.',
    },
  },
  {
    id: 'footer-detailed',
    name: 'Detailed Footer',
    category: 'footers',
    type: 'footer-detailed',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Comprehensive footer with multiple sections',
    defaultContent: {
      companyName: 'Your Company',
      description: 'Building amazing digital experiences since 2020.',
      sections: [
        {
          title: 'Product',
          links: ['Features', 'Pricing', 'Documentation', 'API'],
        },
        {
          title: 'Company',
          links: ['About', 'Blog', 'Careers', 'Press'],
        },
        {
          title: 'Support',
          links: ['Help Center', 'Contact', 'Status', 'Updates'],
        },
      ],
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: '📘' },
        { platform: 'Twitter', url: '#', icon: '🐦' },
        { platform: 'LinkedIn', url: '#', icon: '💼' },
        { platform: 'Instagram', url: '#', icon: '📷' },
      ],
      copyright: '© 2024 Your Company. All rights reserved.',
    },
  },

  // CTAs
  {
    id: 'cta-simple',
    name: 'Simple CTA',
    category: 'cta',
    type: 'cta-simple',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Compelling call-to-action section',
    defaultContent: {
      title: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers who have transformed their business with our platform.',
      ctaText: 'Start Free Trial',
      ctaLink: '#',
      secondaryCtaText: 'Schedule Demo',
    },
  },

  // Blog
  {
    id: 'blog-grid',
    name: 'Blog Grid',
    category: 'blog',
    type: 'blog-grid',
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
    description: 'Blog posts in grid layout',
    defaultContent: {
      title: 'Latest from Our Blog',
      subtitle: 'Insights, tips, and updates from our team',
      posts: [
        {
          title: 'The Future of Web Design',
          excerpt: 'Exploring upcoming trends and technologies that will shape web design.',
          image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'John Doe',
          date: '2024-01-15',
          category: 'Design',
          url: '#',
        },
        {
          title: 'Building Better User Experiences',
          excerpt: 'Key principles for creating interfaces that users love.',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'Jane Smith',
          date: '2024-01-12',
          category: 'UX',
          url: '#',
        },
        {
          title: 'Performance Optimization Tips',
          excerpt: 'Make your website faster with these proven techniques.',
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          author: 'Mike Johnson',
          date: '2024-01-10',
          category: 'Development',
          url: '#',
        },
      ],
    },
  },
];

export const getSectionsByCategory = (category: string) => {
  return sectionTemplates.filter(template => template.category === category);
};

export const getAllCategories = () => {
  const categories = [...new Set(sectionTemplates.map(template => template.category))];
  return categories.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    count: sectionTemplates.filter(template => template.category === category).length,
  }));
};