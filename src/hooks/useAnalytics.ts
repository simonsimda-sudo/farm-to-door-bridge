import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track page views on route changes for SPA
 */
export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname, location.search]);
};

/**
 * Track CTA click events
 * @param ctaName - Name of the CTA (no PII)
 */
export const trackCtaClick = (ctaName: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', {
      cta_name: ctaName,
      page_path: window.location.pathname + window.location.search,
    });
  }
};

/**
 * Track form submission events
 * @param formName - Name of the form (no PII)
 */
export const trackFormSubmit = (formName: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', `${formName}_submit`, {
      page_path: window.location.pathname + window.location.search,
    });
  }
};
