import i18n from './index';

/**
 * Format a date according to the current locale
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a date with time according to the current locale
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format currency (EUR) according to the current locale
 * de-DE: 4,99 €
 * en-US: €4.99
 */
export const formatCurrency = (amount: number): string => {
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format a number according to the current locale
 * de-DE: 1.234,56
 * en-US: 1,234.56
 */
export const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, options).format(num);
};

/**
 * Get the current locale string for Intl APIs
 */
export const getCurrentLocale = (): string => {
  return i18n.language === 'de' ? 'de-DE' : 'en-US';
};
