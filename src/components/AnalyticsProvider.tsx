import { usePageView } from '@/hooks/useAnalytics';

/**
 * Component that tracks page views on route changes
 * Must be placed inside BrowserRouter
 */
export const AnalyticsProvider = () => {
  usePageView();
  return null;
};
