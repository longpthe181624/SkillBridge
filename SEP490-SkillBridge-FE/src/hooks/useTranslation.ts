'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
    const { t, i18n } = useI18nTranslation('common');

    return {
        t,
        i18n,
        currentLanguage: i18n.language,
        isJapanese: i18n.language === 'ja',
        isEnglish: i18n.language === 'en',
    };
}

