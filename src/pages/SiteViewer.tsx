import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  AlertCircle,
  Home,
  Zap
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { themeRegistry } from '../core/ThemeRegistry';
import SectionRenderer from '../components/SectionRenderer';
import { Project } from '../types';
import { optimizedStorage } from '../utils/optimizedStorage';
import { analyticsStorage } from '../utils/analyticsStorage';

const SiteViewer: React.FC = () => {
  const { websiteUrl } = useParams<{ websiteUrl: string }>();
  const { projects } = useProject();
  const { updateTheme, currentTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    const loadWebsite = async () => {
      if (!websiteUrl) {
        setError('No website URL provided');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Looking for website with URL:', websiteUrl);

      // First try to find in current projects
      let foundProject = projects.find(p => p.websiteUrl === websiteUrl);

      // If not found in current projects, try to load from optimized storage
      if (!foundProject) {
        const allStoredProjects = optimizedStorage.getAllProjects();
        foundProject = allStoredProjects.find(p => p.websiteUrl === websiteUrl);
      }

      if (foundProject) {
        console.log('✅ Found project:', foundProject);

        // Check if project is published or if we're in development mode
        const isDevelopment = import.meta.env.DEV;

        if (foundProject.isPublished || isDevelopment) {
          setProject(foundProject);

          // Apply project's theme
          if (foundProject.themeId) {
            const theme = themeRegistry.getTheme(foundProject.themeId);
            if (theme) {
              console.log('🎨 Applying theme:', theme.name);
              setActiveTheme(theme);
              updateTheme(foundProject.themeId);
            }
          }

          // Generate unique visitor ID
          const newVisitorId = generateVisitorId();
          setVisitorId(newVisitorId);

          // Track visit analytics in background
          trackVisit(foundProject.id, newVisitorId);

          // Initialize comprehensive analytics tracking
          initializeAdvancedAnalytics(foundProject.id, newVisitorId);

          setError(null);
        } else {
          console.log('❌ Website found but not published. isPublished:', foundProject.isPublished);
          setError('This website is not published yet');
        }
      } else {
        console.log('❌ Website not found');
        setError('Website not found');
      }

      setIsLoading(false);
    };

    loadWebsite();
  }, [websiteUrl, projects, updateTheme]);

  // Generate unique visitor ID
  const generateVisitorId = (): string => {
    let visitorId = localStorage.getItem('templates_uz_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('templates_uz_visitor_id', visitorId);
    }
    return visitorId;
  };

  // Initialize comprehensive analytics tracking
  const initializeAdvancedAnalytics = (projectId: string, visitorId: string) => {
    if (analyticsInitialized) return;
    
    try {
      console.log('📊 Initializing advanced analytics for project:', projectId);
      
      // Start analytics session
      analyticsStorage.startSession(projectId);
      
      // Track initial page view with detailed information
      analyticsStorage.trackPageView(projectId, window.location.pathname, document.title);
      
      // Track visitor information
      trackVisitorInfo(projectId, visitorId);
      
      // Track device and browser information
      trackDeviceInfo(projectId);
      
      // Track geographic information
      trackGeographicInfo(projectId);
      
      // Track referrer information
      trackReferrerInfo(projectId);
      
      // Track scroll interactions
      trackScrollBehavior(projectId);
      
      // Track click interactions
      trackClickBehavior(projectId);
      
      // Track form interactions
      trackFormInteractions(projectId);
      
      // Track time spent on page
      trackTimeSpent(projectId);
      
      // Track page performance
      trackPagePerformance(projectId);
      
      // Track user engagement
      trackUserEngagement(projectId);
      
      // Track conversion events
      trackConversions(projectId);
      
      setAnalyticsInitialized(true);
      console.log('✅ Advanced analytics tracking initialized');
      
    } catch (error) {
      console.error('❌ Error initializing analytics:', error);
    }
  };

  // Track detailed visitor information
  const trackVisitorInfo = (projectId: string, visitorId: string) => {
    const visitorInfo = {
      visitorId,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    };

    // Save visitor info to analytics
    optimizedStorage.trackAnalyticsEvent(projectId, 'visitor_info', visitorInfo);
  };

  // Track device information
  const trackDeviceInfo = (projectId: string) => {
    const userAgent = navigator.userAgent;
    
    // Detect device type
    let deviceType = 'desktop';
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    // Detect browser
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }

    // Detect operating system
    let os = 'Unknown';
    let osVersion = 'Unknown';
    if (userAgent.includes('Windows NT')) {
      os = 'Windows';
      const match = userAgent.match(/Windows NT (\d+\.\d+)/);
      osVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Mac OS X')) {
      os = 'macOS';
      const match = userAgent.match(/Mac OS X (\d+_\d+)/);
      osVersion = match ? match[1].replace('_', '.') : 'Unknown';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
      const match = userAgent.match(/Android (\d+\.\d+)/);
      osVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('iOS')) {
      os = 'iOS';
      const match = userAgent.match(/OS (\d+_\d+)/);
      osVersion = match ? match[1].replace('_', '.') : 'Unknown';
    }

    const deviceInfo = {
      deviceType,
      browser,
      browserVersion,
      os,
      osVersion,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      touchSupport: 'ontouchstart' in window,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || 'unknown',
    };

    optimizedStorage.trackAnalyticsEvent(projectId, 'device_info', deviceInfo);
  };

  // Track geographic information (simulated for demo)
  const trackGeographicInfo = (projectId: string) => {
    // In a real app, you would use a geolocation service like MaxMind or IP-API
    const geoData = getSimulatedGeoData();
    
    const geoInfo = {
      country: geoData.country,
      countryCode: geoData.countryCode,
      region: geoData.region,
      city: geoData.city,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      currency: geoData.currency,
      continent: geoData.continent,
    };

    optimizedStorage.trackAnalyticsEvent(projectId, 'geographic_info', geoInfo);
  };

  // Get simulated geographic data
  const getSimulatedGeoData = () => {
    const locations = [
      { country: 'United States', countryCode: 'US', region: 'New York', city: 'New York', currency: 'USD', continent: 'North America' },
      { country: 'United Kingdom', countryCode: 'GB', region: 'England', city: 'London', currency: 'GBP', continent: 'Europe' },
      { country: 'Germany', countryCode: 'DE', region: 'Berlin', city: 'Berlin', currency: 'EUR', continent: 'Europe' },
      { country: 'France', countryCode: 'FR', region: 'Île-de-France', city: 'Paris', currency: 'EUR', continent: 'Europe' },
      { country: 'Japan', countryCode: 'JP', region: 'Tokyo', city: 'Tokyo', currency: 'JPY', continent: 'Asia' },
      { country: 'Australia', countryCode: 'AU', region: 'New South Wales', city: 'Sydney', currency: 'AUD', continent: 'Oceania' },
      { country: 'Canada', countryCode: 'CA', region: 'Ontario', city: 'Toronto', currency: 'CAD', continent: 'North America' },
      { country: 'Brazil', countryCode: 'BR', region: 'São Paulo', city: 'São Paulo', currency: 'BRL', continent: 'South America' },
      { country: 'India', countryCode: 'IN', region: 'Maharashtra', city: 'Mumbai', currency: 'INR', continent: 'Asia' },
      { country: 'China', countryCode: 'CN', region: 'Shanghai', city: 'Shanghai', currency: 'CNY', continent: 'Asia' },
      { country: 'Uzbekistan', countryCode: 'UZ', region: 'Samarkand', city: 'Samarkand', currency: 'UZS', continent: 'Asia' },
      { country: 'Russia', countryCode: 'RU', region: 'Moscow', city: 'Moscow', currency: 'RUB', continent: 'Europe' },
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  };

  // Track referrer information
  const trackReferrerInfo = (projectId: string) => {
    const referrer = document.referrer;
    let referrerType = 'direct';
    let referrerDomain = '';
    let searchEngine = '';
    let socialPlatform = '';

    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        referrerDomain = referrerUrl.hostname;

        // Detect search engines
        if (referrerDomain.includes('google')) {
          referrerType = 'search';
          searchEngine = 'Google';
        } else if (referrerDomain.includes('bing')) {
          referrerType = 'search';
          searchEngine = 'Bing';
        } else if (referrerDomain.includes('yahoo')) {
          referrerType = 'search';
          searchEngine = 'Yahoo';
        } else if (referrerDomain.includes('duckduckgo')) {
          referrerType = 'search';
          searchEngine = 'DuckDuckGo';
        }
        // Detect social media
        else if (referrerDomain.includes('facebook')) {
          referrerType = 'social';
          socialPlatform = 'Facebook';
        } else if (referrerDomain.includes('twitter') || referrerDomain.includes('t.co')) {
          referrerType = 'social';
          socialPlatform = 'Twitter';
        } else if (referrerDomain.includes('linkedin')) {
          referrerType = 'social';
          socialPlatform = 'LinkedIn';
        } else if (referrerDomain.includes('instagram')) {
          referrerType = 'social';
          socialPlatform = 'Instagram';
        } else if (referrerDomain.includes('youtube')) {
          referrerType = 'social';
          socialPlatform = 'YouTube';
        } else if (referrerDomain.includes('telegram')) {
          referrerType = 'social';
          socialPlatform = 'Telegram';
        }
        // Other referrals
        else {
          referrerType = 'referral';
        }
      } catch (e) {
        referrerType = 'unknown';
      }
    }

    const referrerInfo = {
      referrer,
      referrerType,
      referrerDomain,
      searchEngine,
      socialPlatform,
      utmSource: new URLSearchParams(window.location.search).get('utm_source'),
      utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
      utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      utmTerm: new URLSearchParams(window.location.search).get('utm_term'),
      utmContent: new URLSearchParams(window.location.search).get('utm_content'),
    };

    optimizedStorage.trackAnalyticsEvent(projectId, 'referrer_info', referrerInfo);
  };

  // Track scroll behavior
  const trackScrollBehavior = (projectId: string) => {
    let maxScrollDepth = 0;
    let scrollEvents = 0;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      scrollEvents++;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }

      // Track scroll milestones
      if (scrollPercent >= 25 && maxScrollDepth < 25) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'scroll_milestone', { milestone: '25%', scrollDepth: scrollPercent });
      } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'scroll_milestone', { milestone: '50%', scrollDepth: scrollPercent });
      } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'scroll_milestone', { milestone: '75%', scrollDepth: scrollPercent });
      } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'scroll_milestone', { milestone: '90%', scrollDepth: scrollPercent });
      }

      lastScrollTime = Date.now();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track final scroll data when leaving
    const trackFinalScroll = () => {
      optimizedStorage.trackAnalyticsEvent(projectId, 'scroll_summary', {
        maxScrollDepth,
        scrollEvents,
        timeSpentScrolling: Date.now() - lastScrollTime,
      });
    };

    window.addEventListener('beforeunload', trackFinalScroll);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) trackFinalScroll();
    });
  };

  // Track click behavior
  const trackClickBehavior = (projectId: string) => {
    let clickCount = 0;
    const clickedElements = new Set();

    const handleClick = (event: MouseEvent) => {
      clickCount++;
      const target = event.target as HTMLElement;
      const elementInfo = getElementInfo(target);
      
      clickedElements.add(elementInfo.selector);

      const clickData = {
        clickCount,
        elementType: target.tagName.toLowerCase(),
        elementText: target.textContent?.trim().substring(0, 100) || '',
        elementSelector: elementInfo.selector,
        elementPosition: { x: event.clientX, y: event.clientY },
        pagePosition: { x: event.pageX, y: event.pageY },
        timestamp: new Date().toISOString(),
        isButton: target.tagName.toLowerCase() === 'button' || target.getAttribute('role') === 'button',
        isLink: target.tagName.toLowerCase() === 'a',
        hasHref: target.getAttribute('href') !== null,
        href: target.getAttribute('href'),
      };

      optimizedStorage.trackAnalyticsEvent(projectId, 'click_event', clickData);

      // Track specific click types
      if (clickData.isLink && clickData.href) {
        if (clickData.href.includes('mailto:')) {
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'email_click', value: 1 });
        } else if (clickData.href.includes('tel:')) {
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'phone_click', value: 1 });
        } else if (clickData.href.startsWith('http') && !clickData.href.includes(window.location.hostname)) {
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'external_link', value: 1, url: clickData.href });
        }
      }

      // Track social media clicks
      const elementText = clickData.elementText.toLowerCase();
      if (elementText.includes('facebook') || elementInfo.selector.includes('facebook')) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'social_click', platform: 'facebook' });
      } else if (elementText.includes('twitter') || elementInfo.selector.includes('twitter')) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'social_click', platform: 'twitter' });
      } else if (elementText.includes('linkedin') || elementInfo.selector.includes('linkedin')) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'social_click', platform: 'linkedin' });
      } else if (elementText.includes('instagram') || elementInfo.selector.includes('instagram')) {
        optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'social_click', platform: 'instagram' });
      }
    };

    document.addEventListener('click', handleClick);

    // Track click summary when leaving
    const trackClickSummary = () => {
      optimizedStorage.trackAnalyticsEvent(projectId, 'click_summary', {
        totalClicks: clickCount,
        uniqueElements: clickedElements.size,
        clickedElements: Array.from(clickedElements),
      });
    };

    window.addEventListener('beforeunload', trackClickSummary);
  };

  // Track form interactions
  const trackFormInteractions = (projectId: string) => {
    // Track form submissions
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const formInfo = {
        formId: form.id || 'unknown',
        formAction: form.action || window.location.href,
        formMethod: form.method || 'GET',
        fieldCount: form.elements.length,
        fields: Array.from(form.elements).map((element: any) => ({
          name: element.name,
          type: element.type,
          required: element.required,
          value: element.type === 'password' ? '[HIDDEN]' : element.value?.substring(0, 50),
        })),
      };

      optimizedStorage.trackAnalyticsEvent(projectId, 'form_submit', formInfo);
      optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', { type: 'form_submission', formId: formInfo.formId, value: 1 });
    };

    // Track form field interactions
    const handleFormFocus = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        optimizedStorage.trackAnalyticsEvent(projectId, 'form_field_focus', {
          fieldName: target.name,
          fieldType: target.type,
          fieldId: target.id,
          formId: target.form?.id || 'unknown',
        });
      }
    };

    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('focus', handleFormFocus, true);
  };

  // Track time spent on page
  const trackTimeSpent = (projectId: string) => {
    const startTime = Date.now();
    let isActive = true;
    let totalActiveTime = 0;
    let lastActiveTime = startTime;

    // Track when user becomes active/inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isActive) {
          totalActiveTime += Date.now() - lastActiveTime;
          isActive = false;
        }
      } else {
        if (!isActive) {
          lastActiveTime = Date.now();
          isActive = true;
        }
      }
    };

    // Track mouse movement to detect activity
    let lastMouseMove = Date.now();
    const handleMouseMove = () => {
      lastMouseMove = Date.now();
      if (!isActive) {
        lastActiveTime = Date.now();
        isActive = true;
      }
    };

    // Track keyboard activity
    const handleKeyPress = () => {
      if (!isActive) {
        lastActiveTime = Date.now();
        isActive = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keypress', handleKeyPress);

    // Check for inactivity every 30 seconds
    const inactivityCheck = setInterval(() => {
      if (isActive && Date.now() - lastMouseMove > 30000) { // 30 seconds of no mouse movement
        totalActiveTime += Date.now() - lastActiveTime;
        isActive = false;
      }
    }, 30000);

    // Track final time when leaving
    const trackFinalTime = () => {
      if (isActive) {
        totalActiveTime += Date.now() - lastActiveTime;
      }
      
      const timeData = {
        totalTime: Date.now() - startTime,
        activeTime: totalActiveTime,
        inactiveTime: (Date.now() - startTime) - totalActiveTime,
        engagementRate: (totalActiveTime / (Date.now() - startTime)) * 100,
      };

      optimizedStorage.trackAnalyticsEvent(projectId, 'time_spent', timeData);
      clearInterval(inactivityCheck);
    };

    window.addEventListener('beforeunload', trackFinalTime);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) trackFinalTime();
    });
  };

  // Track page performance
  const trackPagePerformance = (projectId: string) => {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          const resources = performance.getEntriesByType('resource');

          const performanceData = {
            // Navigation timing
            domainLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnect: navigation.connectEnd - navigation.connectStart,
            request: navigation.responseStart - navigation.requestStart,
            response: navigation.responseEnd - navigation.responseStart,
            domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,

            // Paint timing
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

            // Resource timing
            resourceCount: resources.length,
            totalResourceSize: resources.reduce((size, resource) => size + (resource.transferSize || 0), 0),
            imageCount: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)).length,
            scriptCount: resources.filter(r => r.name.match(/\.js$/i)).length,
            stylesheetCount: resources.filter(r => r.name.match(/\.css$/i)).length,

            // Memory usage (if available)
            memoryUsage: (performance as any).memory ? {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            } : null,

            // Connection information
            connectionType: (navigator as any).connection?.effectiveType || 'unknown',
            connectionSpeed: (navigator as any).connection?.downlink || 0,
          };

          optimizedStorage.trackAnalyticsEvent(projectId, 'page_performance', performanceData);
        }, 1000);
      });
    }
  };

  // Track user engagement
  const trackUserEngagement = (projectId: string) => {
    let engagementScore = 0;
    let interactions = 0;
    const startTime = Date.now();

    // Track various engagement signals
    const trackEngagement = (type: string, points: number) => {
      interactions++;
      engagementScore += points;
      
      optimizedStorage.trackAnalyticsEvent(projectId, 'engagement_signal', {
        type,
        points,
        totalScore: engagementScore,
        totalInteractions: interactions,
        timeOnPage: Date.now() - startTime,
      });
    };

    // Scroll engagement
    let scrollDepth = 0;
    const handleScroll = () => {
      const newScrollDepth = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (newScrollDepth > scrollDepth + 10) { // Every 10% scroll
        scrollDepth = newScrollDepth;
        trackEngagement('scroll', 1);
      }
    };

    // Click engagement
    const handleClick = () => trackEngagement('click', 2);

    // Hover engagement
    let hoverTimeout: NodeJS.Timeout;
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => trackEngagement('hover', 1), 1000);
      }
    };

    // Focus engagement
    const handleFocus = () => trackEngagement('focus', 1);

    // Copy text engagement
    const handleCopy = () => trackEngagement('copy', 3);

    // Right-click engagement
    const handleContextMenu = () => trackEngagement('context_menu', 1);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);

    // Track final engagement score
    const trackFinalEngagement = () => {
      const finalData = {
        totalScore: engagementScore,
        totalInteractions: interactions,
        timeOnPage: Date.now() - startTime,
        engagementRate: engagementScore / Math.max(1, (Date.now() - startTime) / 1000), // Score per second
      };

      optimizedStorage.trackAnalyticsEvent(projectId, 'engagement_summary', finalData);
    };

    window.addEventListener('beforeunload', trackFinalEngagement);
  };

  // Track conversions
  const trackConversions = (projectId: string) => {
    // Track email clicks
    const trackEmailClicks = () => {
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', {
            type: 'email_click',
            email: link.getAttribute('href')?.replace('mailto:', ''),
            value: 1,
          });
        });
      });
    };

    // Track phone clicks
    const trackPhoneClicks = () => {
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', {
            type: 'phone_click',
            phone: link.getAttribute('href')?.replace('tel:', ''),
            value: 1,
          });
        });
      });
    };

    // Track download clicks
    const trackDownloads = () => {
      document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".zip"]').forEach(link => {
        link.addEventListener('click', () => {
          const href = link.getAttribute('href') || '';
          optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', {
            type: 'download',
            fileName: href.split('/').pop() || 'unknown',
            fileType: href.split('.').pop() || 'unknown',
            value: 1,
          });
        });
      });
    };

    // Track external links
    const trackExternalLinks = () => {
      document.querySelectorAll('a[href^="http"]').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.includes(window.location.hostname)) {
          link.addEventListener('click', () => {
            optimizedStorage.trackAnalyticsEvent(projectId, 'conversion', {
              type: 'external_link',
              url: href,
              domain: new URL(href).hostname,
              value: 1,
            });
          });
        }
      });
    };

    // Initialize tracking after DOM is ready
    setTimeout(() => {
      trackEmailClicks();
      trackPhoneClicks();
      trackDownloads();
      trackExternalLinks();
    }, 1000);
  };

  // Get detailed element information
  const getElementInfo = (element: HTMLElement) => {
    const selector = element.id ? `#${element.id}` : 
                   element.className ? `.${element.className.split(' ')[0]}` : 
                   element.tagName.toLowerCase();
    
    return {
      selector,
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      textContent: element.textContent?.trim().substring(0, 100) || '',
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>),
    };
  };

  // Track visit analytics in background
  const trackVisit = (projectId: string, visitorId: string) => {
    try {
      // Update project view count
      const project = optimizedStorage.getProject(projectId);
      if (project) {
        if (!project.analytics) {
          project.analytics = { views: 0, performance: {} };
        }
        project.analytics.views = project.analytics.views + 1;
        project.analytics.lastViewed = new Date();
        optimizedStorage.saveProject(project);
      }
      
      // Track detailed visit information
      const visitData = {
        visitorId,
        projectId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        isNewVisitor: !localStorage.getItem(`templates_uz_returning_visitor_${projectId}`),
      };

      optimizedStorage.trackAnalyticsEvent(projectId, 'page_visit', visitData);
      
      // Mark as returning visitor
      localStorage.setItem(`templates_uz_returning_visitor_${projectId}`, 'true');
      
      console.log('📊 Visit tracked for project:', projectId);
    } catch (error) {
      console.error('❌ Error tracking visit:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Loading Website...</h2>
          <p className="text-gray-600 font-primary">Please wait while we load {websiteUrl}</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-12 h-12 text-red-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-4 font-heading"
          >
            Website Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-8 font-primary leading-relaxed"
          >
            {error === 'This website is not published yet'
              ? `The website "${websiteUrl}" exists but hasn't been published yet.`
              : `The website "${websiteUrl}" doesn't exist or has been removed.`
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium font-primary"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Go Home
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Create Your Website
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Website Content */}
      {project.sections.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-lg px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Globe className="w-10 h-10 text-gray-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-4 font-heading"
            >
              Website Under Construction
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-8 font-primary"
            >
              This website is currently being built. Check back soon!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              Create Your Own Website
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {project.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SectionRenderer
                  section={section}
                  isSelected={false}
                  onSelect={() => { }}
                  isPreview={true}
                  theme={activeTheme}
                  isEditing={false}
                  onEdit={() => { }}
                />
              </motion.div>
            ))}
        </div>
      )}

      {/* Powered By Templates.uz */}
      <section
        id="powered-by-templates"
        className="bg-gray-900 text-white h-[120px] flex items-center justify-center px-4"
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
          >
            {/* Left: Logo + Text */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading">Templates.uz</h3>
                <p className="text-sm text-gray-400 font-primary">
                  Build websites without coding — it's that easy!
                </p>
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
              <a
                href="/dashboard"
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary text-sm"
              >
                Create Website
              </a>
              <a
                href="/templates"
                className="px-5 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium font-primary text-sm"
              >
                Browse Templates
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SiteViewer;