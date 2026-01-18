'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

// Types for the Services page

// Interfaces removed as data is now loaded from i18n


// Merits data will be loaded from i18n

// Data is now loaded from i18n translations

// Merit Card Component
const MeritCard: React.FC<{ meritKey: string; t: (key: string) => string }> = ({ meritKey, t }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600">{t(`merits.${meritKey}.title`)}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-600 mb-4">{t(`merits.${meritKey}.description`)}</p>
            <div className="space-y-2">
                <p className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    {t(`merits.${meritKey}.benefits`)}
                </p>
            </div>
        </CardContent>
    </Card>
);

// Challenge Card Component
const ChallengeCard: React.FC<{ title: string; description: string; solution: string }> = ({ title, description, solution }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="text-xl font-bold text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Challenge:</h4>
                    <p className="text-gray-600">{description}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-green-600 mb-2">Solution (SKILL BRIDGE):</h4>
                    <p className="text-gray-700">{solution}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Solution Card Component
const SolutionCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => {
    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'gear-icon':
                return '⚙️';
            case 'mobile-icon':
                return '📱';
            case 'chart-icon':
                return '📊';
            case 'handshake-icon':
                return '🤝';
            case 'clock-icon':
                return '🕐';
            case 'checklist-icon':
                return '✅';
            default:
                return '🔧';
        }
    };

    return (
        <Card className="h-full text-center">
            <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{getIcon(icon)}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </CardContent>
        </Card>
    );
};

export default function ServicesPage() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <AppHeader currentPage="services" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-500 text-white py-24 overflow-hidden min-h-[600px] flex items-center">
                {/* Background Graphics */}
                <div className="absolute inset-0">
                    {/* Left column of dots */}
                    <div className="absolute left-8 top-1/4 space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white opacity-60 rounded-sm"></div>
                        ))}
                    </div>

                    {/* Top right diamond pattern */}
                    <div className="absolute top-12 right-12">
                        <div className="grid grid-cols-4 gap-1.5">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-white opacity-40 rounded-sm"></div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom right chevron pattern */}
                    <div className="absolute bottom-12 right-12">
                        <div className="space-y-1.5">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-0.5 bg-white opacity-30"
                                    style={{
                                        width: `${24 + i * 12}px`,
                                        transform: `translateX(${i * 6}px)`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-4xl">
                        <p className="text-xl mb-3 opacity-90 font-medium">{t('hero.whatWeDo')}</p>
                        <h1 className="text-7xl font-bold mb-10 leading-tight">{t('hero.ourService')}</h1>
                        <div className="space-y-3 mb-10">
                            <p className={`font-bold leading-relaxed ${language === 'ja' ? 'text-4xl' : 'text-2xl'} ${language === 'en' ? 'whitespace-nowrap' : ''}`}>
                                {language === 'ja' ? t('hero.japaneseText1') : t('hero.englishText1')}
                            </p>
                            <p className={`font-bold leading-relaxed ${language === 'ja' ? 'text-4xl' : 'text-2xl'} ${language === 'en' ? 'whitespace-nowrap' : ''}`}>
                                {language === 'ja' ? t('hero.japaneseText2') : t('hero.englishText2')}
                            </p>
                        </div>
                        <button className="border-2 border-white text-white px-10 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-lg hover:scale-105 transform">
                            {t('hero.ctaButton')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('introduction.title')}</h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6">{t('introduction.subtitle')}</h2>
                        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600">
                            <p>{t('introduction.description1')}</p>
                            <p>{t('introduction.description2')}</p>
                            <p>{t('introduction.description3')}</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Merits Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('merits.title')}</h2>
                        <h3 className="text-xl text-gray-700 mb-6">{t('merits.subtitle')}</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <MeritCard meritKey="merit1" t={t} />
                        <MeritCard meritKey="merit2" t={t} />
                        <MeritCard meritKey="merit3" t={t} />
                    </div>
                </div>
            </section>

            {/* Challenges & Solutions Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('challenges.title')}</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ChallengeCard
                            title={t('challenges.challenge1.title')}
                            description={t('challenges.challenge1.description')}
                            solution={t('challenges.challenge1.solution')}
                        />
                        <ChallengeCard
                            title={t('challenges.challenge2.title')}
                            description={t('challenges.challenge2.description')}
                            solution={t('challenges.challenge2.solution')}
                        />
                        <ChallengeCard
                            title={t('challenges.challenge3.title')}
                            description={t('challenges.challenge3.description')}
                            solution={t('challenges.challenge3.solution')}
                        />
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('solutions.title')}</h2>
                        <h3 className="text-xl text-gray-700 mb-2">{t('solutions.subtitle')}</h3>
                        <h4 className="text-lg text-gray-600 mb-6">{t('solutions.subSubtitle')}</h4>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                            {t('solutions.description')}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <SolutionCard
                            title={t('solutions.solution1.title')}
                            description={t('solutions.solution1.description')}
                            icon="gear-icon"
                        />
                        <SolutionCard
                            title={t('solutions.solution2.title')}
                            description={t('solutions.solution2.description')}
                            icon="mobile-icon"
                        />
                        <SolutionCard
                            title={t('solutions.solution3.title')}
                            description={t('solutions.solution3.description')}
                            icon="chart-icon"
                        />
                        <SolutionCard
                            title={t('solutions.solution4.title')}
                            description={t('solutions.solution4.description')}
                            icon="handshake-icon"
                        />
                        <SolutionCard
                            title={t('solutions.solution5.title')}
                            description={t('solutions.solution5.description')}
                            icon="clock-icon"
                        />
                        <SolutionCard
                            title={t('solutions.solution6.title')}
                            description={t('solutions.solution6.description')}
                            icon="checklist-icon"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <AppFooter />
        </div>
    );
}
