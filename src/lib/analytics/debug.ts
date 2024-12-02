import { AnalyticsBrowserAPI } from "@/types/analytics";

declare global {
  interface Window {
    analytics: AnalyticsBrowserAPI;
  }
}

export const debugAnalytics = () => {
  console.log('Initializing Segment Analytics debugging...');
  
  // Wait for analytics to be available
  const checkAnalytics = () => {
    if (!window.analytics) {
      console.error('❌ Segment analytics not initialized! Retrying in 1s...');
      setTimeout(checkAnalytics, 1000);
      return false;
    }

    console.log('✅ Segment analytics object found');
    console.log(`Write Key: ${window.analytics._writeKey}`);

    // Enable debug mode in all environments
    window.analytics.debug();

    // Test event tracking
    try {
      window.analytics.track("Debug Event", {
        timestamp: new Date().toISOString(),
        debug: true,
        source: 'web_app'
      });
      console.log('✅ Event tracking test successful');
    } catch (error) {
      console.error('❌ Event tracking test failed:', error);
    }

    return true;
  };

  return checkAnalytics();
};

export const validateSegmentCall = (eventName: string, properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error(`Failed to track "${eventName}": analytics not initialized`);
    return false;
  }

  try {
    window.analytics.track(eventName, {
      ...properties,
      validated: true,
      timestamp: new Date().toISOString(),
      source: 'web_app'
    });
    return true;
  } catch (error) {
    console.error(`Failed to track "${eventName}":`, error);
    return false;
  }
};