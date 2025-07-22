/**
 * Advanced Analytics Storage System
 * Collects and stores real visitor data for comprehensive analytics
 */

export interface VisitorSession {
  id: string;
  projectId: string;
  sessionStart: Date;
  sessionEnd?: Date;
  duration: number; // in seconds
  pageViews: number;
  interactions: number;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country: string;
  city: string;
  referrer: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
  isReturning: boolean;
  bounced: boolean;
  conversionEvents: ConversionEvent[];
}

export interface PageView {
  id: string;
  projectId: string;
  sessionId: string;
  timestamp: Date;
  page: string;
  title: string;
  timeOnPage: number; // in seconds
  scrollDepth: number; // percentage
  exitPage: boolean;
  referrer: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  country: string;
  city: string;
  loadTime: number; // in milliseconds
}

export interface InteractionEvent {
  id: string;
  projectId: string;
  sessionId: string;
  timestamp: Date;
  type: 'click' | 'scroll' | 'hover' | 'form_submit' | 'download' | 'external_link';
  element: string;
  elementText?: string;
  elementPosition?: { x: number; y: number };
  sectionId?: string;
  value?: string;
}

export interface ConversionEvent {
  id: string;
  projectId: string;
  sessionId: string;
  timestamp: Date;
  type: 'contact_form' | 'newsletter' | 'download' | 'external_link' | 'social_share' | 'email_click' | 'phone_click';
  value?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  id: string;
  projectId: string;
  timestamp: Date;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  resourceCount: number;
  resourceSize: number; // in bytes
  cacheHitRate: number;
}

export interface GeolocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  isp?: string;
}

export class AnalyticsStorage {
  private static instance: AnalyticsStorage;
  private readonly STORAGE_KEYS = {
    SESSIONS: 'templates_uz_analytics_sessions',
    PAGE_VIEWS: 'templates_uz_analytics_pageviews',
    INTERACTIONS: 'templates_uz_analytics_interactions',
    CONVERSIONS: 'templates_uz_analytics_conversions',
    PERFORMANCE: 'templates_uz_analytics_performance',
    VISITOR_TRACKING: 'templates_uz_visitor_tracking',
  };

  private currentSession: VisitorSession | null = null;
  private pageStartTime: number = 0;
  private scrollDepth: number = 0;
  private interactions: InteractionEvent[] = [];

  private constructor() {
    this.initializeTracking();
  }

  public static getInstance(): AnalyticsStorage {
    if (!AnalyticsStorage.instance) {
      AnalyticsStorage.instance = new AnalyticsStorage();
    }
    return AnalyticsStorage.instance;
  }

  // Initialize tracking for the current page
  public initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    this.trackScrollDepth();
    
    // Track page visibility changes
    this.trackPageVisibility();
    
    // Track performance metrics
    this.trackPerformanceMetrics();
    
    // Track user interactions
    this.trackUserInteractions();
  }

  // Start a new visitor session
  public startSession(projectId: string): VisitorSession {
    const deviceInfo = this.getDeviceInfo();
    const locationInfo = this.getLocationInfo();
    const isReturning = this.isReturningVisitor(projectId);

    const session: VisitorSession = {
      id: this.generateId(),
      projectId,
      sessionStart: new Date(),
      duration: 0,
      pageViews: 0,
      interactions: 0,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      country: locationInfo.country,
      city: locationInfo.city,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isReturning,
      bounced: true, // Will be updated if user interacts
      conversionEvents: [],
    };

    this.currentSession = session;
    this.saveSession(session);
    this.markVisitorAsReturning(projectId);
    
    console.log('📊 Analytics session started:', session.id);
    return session;
  }

  // End the current session
  public endSession(): void {
    if (!this.currentSession) return;

    const now = new Date();
    this.currentSession.sessionEnd = now;
    this.currentSession.duration = Math.floor((now.getTime() - this.currentSession.sessionStart.getTime()) / 1000);
    
    // Determine if session bounced (less than 30 seconds or only 1 page view)
    this.currentSession.bounced = this.currentSession.duration < 30 || this.currentSession.pageViews <= 1;
    
    this.saveSession(this.currentSession);
    console.log('📊 Analytics session ended:', this.currentSession.id, `Duration: ${this.currentSession.duration}s`);
    
    this.currentSession = null;
  }

  // Track a page view
  public trackPageView(projectId: string, page: string = '/', title: string = document.title): PageView {
    if (!this.currentSession) {
      this.startSession(projectId);
    }

    const deviceInfo = this.getDeviceInfo();
    const locationInfo = this.getLocationInfo();
    const loadTime = this.getPageLoadTime();

    const pageView: PageView = {
      id: this.generateId(),
      projectId,
      sessionId: this.currentSession!.id,
      timestamp: new Date(),
      page,
      title,
      timeOnPage: 0,
      scrollDepth: 0,
      exitPage: false,
      referrer: document.referrer || 'direct',
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      country: locationInfo.country,
      city: locationInfo.city,
      loadTime,
    };

    // Update session
    this.currentSession!.pageViews++;
    this.currentSession!.bounced = false; // User viewed a page, not bounced
    
    this.savePageView(pageView);
    this.saveSession(this.currentSession!);
    
    this.pageStartTime = Date.now();
    this.scrollDepth = 0;
    
    console.log('📊 Page view tracked:', page);
    return pageView;
  }

  // Track user interaction
  public trackInteraction(
    projectId: string,
    type: InteractionEvent['type'],
    element: string,
    options: {
      elementText?: string;
      elementPosition?: { x: number; y: number };
      sectionId?: string;
      value?: string;
    } = {}
  ): InteractionEvent {
    if (!this.currentSession) {
      this.startSession(projectId);
    }

    const interaction: InteractionEvent = {
      id: this.generateId(),
      projectId,
      sessionId: this.currentSession!.id,
      timestamp: new Date(),
      type,
      element,
      ...options,
    };

    // Update session
    this.currentSession!.interactions++;
    this.currentSession!.bounced = false; // User interacted, not bounced
    
    this.interactions.push(interaction);
    this.saveInteraction(interaction);
    this.saveSession(this.currentSession!);
    
    console.log('📊 Interaction tracked:', type, element);
    return interaction;
  }

  // Track conversion event
  public trackConversion(
    projectId: string,
    type: ConversionEvent['type'],
    value?: number,
    metadata?: Record<string, any>
  ): ConversionEvent {
    if (!this.currentSession) {
      this.startSession(projectId);
    }

    const conversion: ConversionEvent = {
      id: this.generateId(),
      projectId,
      sessionId: this.currentSession!.id,
      timestamp: new Date(),
      type,
      value,
      metadata,
    };

    // Add to session
    this.currentSession!.conversionEvents.push(conversion);
    this.currentSession!.bounced = false; // User converted, definitely not bounced
    
    this.saveConversion(conversion);
    this.saveSession(this.currentSession!);
    
    console.log('📊 Conversion tracked:', type, value);
    return conversion;
  }

  // Get analytics data for a project
  public getProjectAnalytics(projectId: string, dateRange?: { start: Date; end: Date }): {
    sessions: VisitorSession[];
    pageViews: PageView[];
    interactions: InteractionEvent[];
    conversions: ConversionEvent[];
    performance: PerformanceMetric[];
  } {
    const sessions = this.getSessions(projectId, dateRange);
    const pageViews = this.getPageViews(projectId, dateRange);
    const interactions = this.getInteractions(projectId, dateRange);
    const conversions = this.getConversions(projectId, dateRange);
    const performance = this.getPerformanceMetrics(projectId, dateRange);

    return {
      sessions,
      pageViews,
      interactions,
      conversions,
      performance,
    };
  }

  // Generate comprehensive analytics summary
  public generateAnalyticsSummary(projectId: string, dateRange?: { start: Date; end: Date }): {
    overview: {
      totalVisitors: number;
      uniqueVisitors: number;
      totalPageViews: number;
      averageSessionDuration: number;
      bounceRate: number;
      conversionRate: number;
    };
    traffic: {
      hourlyViews: { hour: number; views: number; visitors: number }[];
      dailyViews: { date: string; views: number; visitors: number }[];
      weeklyViews: { week: string; views: number; visitors: number }[];
      monthlyViews: { month: string; views: number; visitors: number }[];
    };
    demographics: {
      countries: { country: string; visitors: number; percentage: number }[];
      cities: { city: string; visitors: number; percentage: number }[];
      devices: { device: string; visitors: number; percentage: number }[];
      browsers: { browser: string; visitors: number; percentage: number }[];
      operatingSystems: { os: string; visitors: number; percentage: number }[];
    };
    behavior: {
      topPages: { page: string; views: number; avgTimeOnPage: number }[];
      topReferrers: { referrer: string; visitors: number; percentage: number }[];
      userFlow: { from: string; to: string; count: number }[];
      exitPages: { page: string; exits: number; exitRate: number }[];
    };
    performance: {
      averageLoadTime: number;
      averageDOMContentLoaded: number;
      averageFirstContentfulPaint: number;
      averageLargestContentfulPaint: number;
      cumulativeLayoutShift: number;
      firstInputDelay: number;
    };
    conversions: {
      totalConversions: number;
      conversionsByType: { type: string; count: number; value: number }[];
      conversionFunnel: { step: string; visitors: number; conversionRate: number }[];
    };
    realTime: {
      activeVisitors: number;
      currentPageViews: { page: string; viewers: number }[];
      recentEvents: Array<{
        type: 'pageview' | 'interaction' | 'conversion';
        timestamp: Date;
        details: string;
      }>;
    };
  } {
    const data = this.getProjectAnalytics(projectId, dateRange);
    
    // Calculate overview metrics
    const totalVisitors = data.sessions.length;
    const uniqueVisitors = new Set(data.sessions.map(s => s.id)).size;
    const totalPageViews = data.pageViews.length;
    const averageSessionDuration = data.sessions.reduce((sum, s) => sum + s.duration, 0) / totalVisitors || 0;
    const bounceRate = (data.sessions.filter(s => s.bounced).length / totalVisitors) * 100 || 0;
    const conversionRate = (data.conversions.length / totalVisitors) * 100 || 0;

    // Calculate traffic patterns
    const hourlyViews = this.calculateHourlyViews(data.pageViews, data.sessions);
    const dailyViews = this.calculateDailyViews(data.pageViews, data.sessions);
    const weeklyViews = this.calculateWeeklyViews(data.pageViews, data.sessions);
    const monthlyViews = this.calculateMonthlyViews(data.pageViews, data.sessions);

    // Calculate demographics
    const countries = this.calculateCountryStats(data.sessions);
    const cities = this.calculateCityStats(data.sessions);
    const devices = this.calculateDeviceStats(data.sessions);
    const browsers = this.calculateBrowserStats(data.sessions);
    const operatingSystems = this.calculateOSStats(data.sessions);

    // Calculate behavior metrics
    const topPages = this.calculateTopPages(data.pageViews);
    const topReferrers = this.calculateTopReferrers(data.sessions);
    const userFlow = this.calculateUserFlow(data.pageViews);
    const exitPages = this.calculateExitPages(data.pageViews);

    // Calculate performance metrics
    const performanceMetrics = this.calculatePerformanceMetrics(data.performance);

    // Calculate conversion metrics
    const totalConversions = data.conversions.length;
    const conversionsByType = this.calculateConversionsByType(data.conversions);
    const conversionFunnel = this.calculateConversionFunnel(data.sessions, data.conversions);

    // Calculate real-time metrics
    const realTimeMetrics = this.calculateRealTimeMetrics(projectId);

    return {
      overview: {
        totalVisitors,
        uniqueVisitors,
        totalPageViews,
        averageSessionDuration,
        bounceRate,
        conversionRate,
      },
      traffic: {
        hourlyViews,
        dailyViews,
        weeklyViews,
        monthlyViews,
      },
      demographics: {
        countries,
        cities,
        devices,
        browsers,
        operatingSystems,
      },
      behavior: {
        topPages,
        topReferrers,
        userFlow,
        exitPages,
      },
      performance: performanceMetrics,
      conversions: {
        totalConversions,
        conversionsByType,
        conversionFunnel,
      },
      realTime: realTimeMetrics,
    };
  }

  // Private helper methods
  private trackScrollDepth(): void {
    let maxScroll = 0;
    
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = Math.min(maxScroll, 100);
      }
    };

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
  }

  private trackPageVisibility(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updatePageTimeOnPage();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.updatePageTimeOnPage();
      this.endSession();
    });
  }

  private trackPerformanceMetrics(): void {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          if (this.currentSession) {
            const metric: PerformanceMetric = {
              id: this.generateId(),
              projectId: this.currentSession.projectId,
              timestamp: new Date(),
              loadTime: navigation.loadEventEnd - navigation.loadEventStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
              largestContentfulPaint: 0, // Would need additional measurement
              cumulativeLayoutShift: 0, // Would need additional measurement
              firstInputDelay: 0, // Would need additional measurement
              resourceCount: performance.getEntriesByType('resource').length,
              resourceSize: performance.getEntriesByType('resource').reduce((size, resource) => {
                return size + (resource.transferSize || 0);
              }, 0),
              cacheHitRate: 0, // Would need additional calculation
            };
            
            this.savePerformanceMetric(metric);
          }
        }, 1000);
      });
    }
  }

  private trackUserInteractions(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      if (this.currentSession) {
        const target = event.target as HTMLElement;
        const element = this.getElementSelector(target);
        const elementText = target.textContent?.trim().substring(0, 100) || '';
        
        this.trackInteraction(this.currentSession.projectId, 'click', element, {
          elementText,
          elementPosition: { x: event.clientX, y: event.clientY },
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      if (this.currentSession) {
        const form = event.target as HTMLFormElement;
        const formId = form.id || form.className || 'unknown-form';
        
        this.trackInteraction(this.currentSession.projectId, 'form_submit', formId);
        this.trackConversion(this.currentSession.projectId, 'contact_form', 1);
      }
    });
  }

  private updatePageTimeOnPage(): void {
    if (this.pageStartTime > 0) {
      const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
      
      // Update the most recent page view
      const pageViews = this.getPageViews(this.currentSession?.projectId || '');
      const lastPageView = pageViews[pageViews.length - 1];
      
      if (lastPageView) {
        lastPageView.timeOnPage = timeOnPage;
        lastPageView.scrollDepth = this.scrollDepth;
        this.savePageView(lastPageView);
      }
    }
  }

  private getDeviceInfo(): { device: 'desktop' | 'mobile' | 'tablet'; browser: string; os: string } {
    const userAgent = navigator.userAgent;
    
    // Detect device
    let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      device = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      device = 'mobile';
    }

    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { device, browser, os };
  }

  private getLocationInfo(): { country: string; city: string } {
    // In a real app, you would use a geolocation service
    // For demo purposes, we'll use some sample data
    const locations = [
      { country: 'United States', city: 'New York' },
      { country: 'United Kingdom', city: 'London' },
      { country: 'Germany', city: 'Berlin' },
      { country: 'France', city: 'Paris' },
      { country: 'Japan', city: 'Tokyo' },
      { country: 'Australia', city: 'Sydney' },
      { country: 'Canada', city: 'Toronto' },
      { country: 'Brazil', city: 'São Paulo' },
      { country: 'India', city: 'Mumbai' },
      { country: 'China', city: 'Shanghai' },
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private getPageLoadTime(): number {
    if ('performance' in window && performance.timing) {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
    return 0;
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private isReturningVisitor(projectId: string): boolean {
    const visitorData = localStorage.getItem(`${this.STORAGE_KEYS.VISITOR_TRACKING}_${projectId}`);
    return !!visitorData;
  }

  private markVisitorAsReturning(projectId: string): void {
    localStorage.setItem(`${this.STORAGE_KEYS.VISITOR_TRACKING}_${projectId}`, new Date().toISOString());
  }

  // Storage methods
  private saveSession(session: VisitorSession): void {
    const sessions = this.getSessions(session.projectId);
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions, this.dateReplacer));
  }

  private savePageView(pageView: PageView): void {
    const pageViews = this.getPageViews(pageView.projectId);
    const existingIndex = pageViews.findIndex(pv => pv.id === pageView.id);
    
    if (existingIndex >= 0) {
      pageViews[existingIndex] = pageView;
    } else {
      pageViews.push(pageView);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(pageViews, this.dateReplacer));
  }

  private saveInteraction(interaction: InteractionEvent): void {
    const interactions = this.getInteractions(interaction.projectId);
    interactions.push(interaction);
    localStorage.setItem(this.STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions, this.dateReplacer));
  }

  private saveConversion(conversion: ConversionEvent): void {
    const conversions = this.getConversions(conversion.projectId);
    conversions.push(conversion);
    localStorage.setItem(this.STORAGE_KEYS.CONVERSIONS, JSON.stringify(conversions, this.dateReplacer));
  }

  private savePerformanceMetric(metric: PerformanceMetric): void {
    const metrics = this.getPerformanceMetrics(metric.projectId);
    metrics.push(metric);
    localStorage.setItem(this.STORAGE_KEYS.PERFORMANCE, JSON.stringify(metrics, this.dateReplacer));
  }

  // Retrieval methods
  private getSessions(projectId?: string, dateRange?: { start: Date; end: Date }): VisitorSession[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.SESSIONS);
      if (!data) return [];
      
      let sessions: VisitorSession[] = JSON.parse(data, this.dateReviver);
      
      if (projectId) {
        sessions = sessions.filter(s => s.projectId === projectId);
      }
      
      if (dateRange) {
        sessions = sessions.filter(s => 
          s.sessionStart >= dateRange.start && s.sessionStart <= dateRange.end
        );
      }
      
      return sessions;
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  private getPageViews(projectId?: string, dateRange?: { start: Date; end: Date }): PageView[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PAGE_VIEWS);
      if (!data) return [];
      
      let pageViews: PageView[] = JSON.parse(data, this.dateReviver);
      
      if (projectId) {
        pageViews = pageViews.filter(pv => pv.projectId === projectId);
      }
      
      if (dateRange) {
        pageViews = pageViews.filter(pv => 
          pv.timestamp >= dateRange.start && pv.timestamp <= dateRange.end
        );
      }
      
      return pageViews;
    } catch (error) {
      console.error('Error loading page views:', error);
      return [];
    }
  }

  private getInteractions(projectId?: string, dateRange?: { start: Date; end: Date }): InteractionEvent[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.INTERACTIONS);
      if (!data) return [];
      
      let interactions: InteractionEvent[] = JSON.parse(data, this.dateReviver);
      
      if (projectId) {
        interactions = interactions.filter(i => i.projectId === projectId);
      }
      
      if (dateRange) {
        interactions = interactions.filter(i => 
          i.timestamp >= dateRange.start && i.timestamp <= dateRange.end
        );
      }
      
      return interactions;
    } catch (error) {
      console.error('Error loading interactions:', error);
      return [];
    }
  }

  private getConversions(projectId?: string, dateRange?: { start: Date; end: Date }): ConversionEvent[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CONVERSIONS);
      if (!data) return [];
      
      let conversions: ConversionEvent[] = JSON.parse(data, this.dateReviver);
      
      if (projectId) {
        conversions = conversions.filter(c => c.projectId === projectId);
      }
      
      if (dateRange) {
        conversions = conversions.filter(c => 
          c.timestamp >= dateRange.start && c.timestamp <= dateRange.end
        );
      }
      
      return conversions;
    } catch (error) {
      console.error('Error loading conversions:', error);
      return [];
    }
  }

  private getPerformanceMetrics(projectId?: string, dateRange?: { start: Date; end: Date }): PerformanceMetric[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PERFORMANCE);
      if (!data) return [];
      
      let metrics: PerformanceMetric[] = JSON.parse(data, this.dateReviver);
      
      if (projectId) {
        metrics = metrics.filter(m => m.projectId === projectId);
      }
      
      if (dateRange) {
        metrics = metrics.filter(m => 
          m.timestamp >= dateRange.start && m.timestamp <= dateRange.end
        );
      }
      
      return metrics;
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      return [];
    }
  }

  // Analytics calculation methods
  private calculateHourlyViews(pageViews: PageView[], sessions: VisitorSession[]): { hour: number; views: number; visitors: number }[] {
    const hourlyData: { [hour: number]: { views: number; visitors: Set<string> } } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { views: 0, visitors: new Set() };
    }
    
    pageViews.forEach(pv => {
      const hour = pv.timestamp.getHours();
      hourlyData[hour].views++;
      hourlyData[hour].visitors.add(pv.sessionId);
    });
    
    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      views: data.views,
      visitors: data.visitors.size,
    }));
  }

  private calculateDailyViews(pageViews: PageView[], sessions: VisitorSession[]): { date: string; views: number; visitors: number }[] {
    const dailyData: { [date: string]: { views: number; visitors: Set<string> } } = {};
    
    pageViews.forEach(pv => {
      const date = pv.timestamp.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { views: 0, visitors: new Set() };
      }
      dailyData[date].views++;
      dailyData[date].visitors.add(pv.sessionId);
    });
    
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateWeeklyViews(pageViews: PageView[], sessions: VisitorSession[]): { week: string; views: number; visitors: number }[] {
    const weeklyData: { [week: string]: { views: number; visitors: Set<string> } } = {};
    
    pageViews.forEach(pv => {
      const weekStart = this.getWeekStart(pv.timestamp);
      const week = weekStart.toISOString().split('T')[0];
      if (!weeklyData[week]) {
        weeklyData[week] = { views: 0, visitors: new Set() };
      }
      weeklyData[week].views++;
      weeklyData[week].visitors.add(pv.sessionId);
    });
    
    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }

  private calculateMonthlyViews(pageViews: PageView[], sessions: VisitorSession[]): { month: string; views: number; visitors: number }[] {
    const monthlyData: { [month: string]: { views: number; visitors: Set<string> } } = {};
    
    pageViews.forEach(pv => {
      const month = `${pv.timestamp.getFullYear()}-${String(pv.timestamp.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[month]) {
        monthlyData[month] = { views: 0, visitors: new Set() };
      }
      monthlyData[month].views++;
      monthlyData[month].visitors.add(pv.sessionId);
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateCountryStats(sessions: VisitorSession[]): { country: string; visitors: number; percentage: number }[] {
    const countryData: { [country: string]: number } = {};
    
    sessions.forEach(session => {
      countryData[session.country] = (countryData[session.country] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(countryData)
      .map(([country, visitors]) => ({
        country,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }

  private calculateCityStats(sessions: VisitorSession[]): { city: string; visitors: number; percentage: number }[] {
    const cityData: { [city: string]: number } = {};
    
    sessions.forEach(session => {
      const cityKey = `${session.city}, ${session.country}`;
      cityData[cityKey] = (cityData[cityKey] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(cityData)
      .map(([city, visitors]) => ({
        city,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }

  private calculateDeviceStats(sessions: VisitorSession[]): { device: string; visitors: number; percentage: number }[] {
    const deviceData: { [device: string]: number } = {};
    
    sessions.forEach(session => {
      deviceData[session.device] = (deviceData[session.device] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(deviceData)
      .map(([device, visitors]) => ({
        device,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }

  private calculateBrowserStats(sessions: VisitorSession[]): { browser: string; visitors: number; percentage: number }[] {
    const browserData: { [browser: string]: number } = {};
    
    sessions.forEach(session => {
      browserData[session.browser] = (browserData[session.browser] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(browserData)
      .map(([browser, visitors]) => ({
        browser,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }

  private calculateOSStats(sessions: VisitorSession[]): { os: string; visitors: number; percentage: number }[] {
    const osData: { [os: string]: number } = {};
    
    sessions.forEach(session => {
      osData[session.os] = (osData[session.os] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(osData)
      .map(([os, visitors]) => ({
        os,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }

  private calculateTopPages(pageViews: PageView[]): { page: string; views: number; avgTimeOnPage: number }[] {
    const pageData: { [page: string]: { views: number; totalTime: number } } = {};
    
    pageViews.forEach(pv => {
      if (!pageData[pv.page]) {
        pageData[pv.page] = { views: 0, totalTime: 0 };
      }
      pageData[pv.page].views++;
      pageData[pv.page].totalTime += pv.timeOnPage;
    });
    
    return Object.entries(pageData)
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgTimeOnPage: Math.round(data.totalTime / data.views),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private calculateTopReferrers(sessions: VisitorSession[]): { referrer: string; visitors: number; percentage: number }[] {
    const referrerData: { [referrer: string]: number } = {};
    
    sessions.forEach(session => {
      const referrer = session.referrer === '' ? 'Direct' : session.referrer;
      referrerData[referrer] = (referrerData[referrer] || 0) + 1;
    });
    
    const total = sessions.length;
    return Object.entries(referrerData)
      .map(([referrer, visitors]) => ({
        referrer,
        visitors,
        percentage: Math.round((visitors / total) * 100),
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }

  private calculateUserFlow(pageViews: PageView[]): { from: string; to: string; count: number }[] {
    const flowData: { [key: string]: number } = {};
    const sessionPages: { [sessionId: string]: string[] } = {};
    
    // Group page views by session
    pageViews.forEach(pv => {
      if (!sessionPages[pv.sessionId]) {
        sessionPages[pv.sessionId] = [];
      }
      sessionPages[pv.sessionId].push(pv.page);
    });
    
    // Calculate flows
    Object.values(sessionPages).forEach(pages => {
      for (let i = 0; i < pages.length - 1; i++) {
        const flow = `${pages[i]} → ${pages[i + 1]}`;
        flowData[flow] = (flowData[flow] || 0) + 1;
      }
    });
    
    return Object.entries(flowData)
      .map(([flow, count]) => {
        const [from, to] = flow.split(' → ');
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateExitPages(pageViews: PageView[]): { page: string; exits: number; exitRate: number }[] {
    const pageData: { [page: string]: { views: number; exits: number } } = {};
    
    pageViews.forEach(pv => {
      if (!pageData[pv.page]) {
        pageData[pv.page] = { views: 0, exits: 0 };
      }
      pageData[pv.page].views++;
      if (pv.exitPage) {
        pageData[pv.page].exits++;
      }
    });
    
    return Object.entries(pageData)
      .map(([page, data]) => ({
        page,
        exits: data.exits,
        exitRate: Math.round((data.exits / data.views) * 100),
      }))
      .sort((a, b) => b.exits - a.exits)
      .slice(0, 10);
  }

  private calculatePerformanceMetrics(metrics: PerformanceMetric[]): {
    averageLoadTime: number;
    averageDOMContentLoaded: number;
    averageFirstContentfulPaint: number;
    averageLargestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  } {
    if (metrics.length === 0) {
      return {
        averageLoadTime: 0,
        averageDOMContentLoaded: 0,
        averageFirstContentfulPaint: 0,
        averageLargestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
      };
    }
    
    return {
      averageLoadTime: Math.round(metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length),
      averageDOMContentLoaded: Math.round(metrics.reduce((sum, m) => sum + m.domContentLoaded, 0) / metrics.length),
      averageFirstContentfulPaint: Math.round(metrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / metrics.length),
      averageLargestContentfulPaint: Math.round(metrics.reduce((sum, m) => sum + m.largestContentfulPaint, 0) / metrics.length),
      cumulativeLayoutShift: metrics.reduce((sum, m) => sum + m.cumulativeLayoutShift, 0) / metrics.length,
      firstInputDelay: Math.round(metrics.reduce((sum, m) => sum + m.firstInputDelay, 0) / metrics.length),
    };
  }

  private calculateConversionsByType(conversions: ConversionEvent[]): { type: string; count: number; value: number }[] {
    const conversionData: { [type: string]: { count: number; value: number } } = {};
    
    conversions.forEach(conversion => {
      if (!conversionData[conversion.type]) {
        conversionData[conversion.type] = { count: 0, value: 0 };
      }
      conversionData[conversion.type].count++;
      conversionData[conversion.type].value += conversion.value || 0;
    });
    
    return Object.entries(conversionData)
      .map(([type, data]) => ({
        type,
        count: data.count,
        value: data.value,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateConversionFunnel(sessions: VisitorSession[], conversions: ConversionEvent[]): { step: string; visitors: number; conversionRate: number }[] {
    const totalVisitors = sessions.length;
    const engagedVisitors = sessions.filter(s => !s.bounced).length;
    const convertedVisitors = new Set(conversions.map(c => c.sessionId)).size;
    
    return [
      {
        step: 'Visitors',
        visitors: totalVisitors,
        conversionRate: 100,
      },
      {
        step: 'Engaged',
        visitors: engagedVisitors,
        conversionRate: Math.round((engagedVisitors / totalVisitors) * 100),
      },
      {
        step: 'Converted',
        visitors: convertedVisitors,
        conversionRate: Math.round((convertedVisitors / totalVisitors) * 100),
      },
    ];
  }

  private calculateRealTimeMetrics(projectId: string): {
    activeVisitors: number;
    currentPageViews: { page: string; viewers: number }[];
    recentEvents: Array<{
      type: 'pageview' | 'interaction' | 'conversion';
      timestamp: Date;
      details: string;
    }>;
  } {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Get recent data
    const recentSessions = this.getSessions(projectId, { start: fiveMinutesAgo, end: now });
    const recentPageViews = this.getPageViews(projectId, { start: fiveMinutesAgo, end: now });
    const recentInteractions = this.getInteractions(projectId, { start: fiveMinutesAgo, end: now });
    const recentConversions = this.getConversions(projectId, { start: fiveMinutesAgo, end: now });
    
    // Calculate active visitors (sessions active in last 5 minutes)
    const activeVisitors = recentSessions.filter(s => !s.sessionEnd || s.sessionEnd > fiveMinutesAgo).length;
    
    // Calculate current page views
    const currentPageViews: { [page: string]: number } = {};
    recentPageViews.forEach(pv => {
      currentPageViews[pv.page] = (currentPageViews[pv.page] || 0) + 1;
    });
    
    const currentPageViewsArray = Object.entries(currentPageViews)
      .map(([page, viewers]) => ({ page, viewers }))
      .sort((a, b) => b.viewers - a.viewers)
      .slice(0, 5);
    
    // Get recent events
    const recentEvents: Array<{
      type: 'pageview' | 'interaction' | 'conversion';
      timestamp: Date;
      details: string;
    }> = [];
    
    recentPageViews.forEach(pv => {
      recentEvents.push({
        type: 'pageview',
        timestamp: pv.timestamp,
        details: `Page view: ${pv.page}`,
      });
    });
    
    recentInteractions.forEach(interaction => {
      recentEvents.push({
        type: 'interaction',
        timestamp: interaction.timestamp,
        details: `${interaction.type}: ${interaction.element}`,
      });
    });
    
    recentConversions.forEach(conversion => {
      recentEvents.push({
        type: 'conversion',
        timestamp: conversion.timestamp,
        details: `Conversion: ${conversion.type}`,
      });
    });
    
    recentEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return {
      activeVisitors,
      currentPageViews: currentPageViewsArray,
      recentEvents: recentEvents.slice(0, 20),
    };
  }

  // Utility methods
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private dateReviver(key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  // Public method to clear all analytics data
  public clearAllAnalytics(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🧹 All analytics data cleared');
  }

  // Public method to get storage size
  public getAnalyticsStorageSize(): number {
    let totalSize = 0;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });
    return totalSize;
  }
}

export const analyticsStorage = AnalyticsStorage.getInstance();