import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'DE', fullLabel: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const LanguageSwitcher = ({ variant = 'default', className = '' }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            className="px-2 py-1 h-8 text-xs"
            aria-label={`${t('language.switchTo')} ${lang.fullLabel}`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
          aria-label={t('language.switchTo')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span>{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${
              i18n.language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.fullLabel}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
