'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' }
    ];

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    const handleLanguageChange = (languageCode: 'en' | 'ja') => {
        setLanguage(languageCode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${className}`}>
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                    <span className="sm:hidden">{currentLanguage.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as 'en' | 'ja')}
                        className={`flex items-center gap-2 ${
                            language === lang.code ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                    >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
                            <span className="ml-auto text-blue-600">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
