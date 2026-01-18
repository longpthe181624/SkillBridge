'use client';

/**
 * Homepage Component
 * Main landing page for SkillBridge platform
 * Story-01: Guest Homepage Browsing
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EngineerCard } from '@/components/EngineerCard';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    getHomepageStatistics,
    getHomepageEngineers,
    type HomepageStatistics,
    type EngineerProfile
} from '@/services/homepageService';
import { Users, Building2, Search, CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function Homepage() {
    const { t } = useLanguage();
    const [statistics, setStatistics] = useState<HomepageStatistics | null>(null);
    const [engineerProfiles, setEngineerProfiles] = useState<EngineerProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHomepageData();
    }, []);

    const loadHomepageData = async () => {
        try {
            setLoading(true);

            // Load statistics and engineer profiles in parallel
            const [stats, profiles] = await Promise.all([
                getHomepageStatistics(),
                getHomepageEngineers()
            ]);

            setStatistics(stats);
            setEngineerProfiles(profiles);
        } catch (error) {
            console.error('Error loading homepage data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter engineers by category
    const getEngineersByCategory = (category: string) => {
        return engineerProfiles.filter(p => p.category === category).slice(0, 3);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header Section */}
            <AppHeader currentPage="home" />

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
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Main Content */}
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                {t('homepage.hero.title')}
                            </h1>
                            <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                                {t('homepage.hero.subtitle1')}
                            </p>
                            <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                                {t('homepage.hero.subtitle2')}
                            </p>
                            <p className="text-lg md:text-xl opacity-90">
                                {t('homepage.hero.description')}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/engineers">
                                    <button className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-lg hover:scale-105 transform">
                                        {t('homepage.hero.browseEngineers')}
                                    </button>
                                </Link>
                                <Link href="/contact">
                                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium text-lg hover:scale-105 transform">
                                        {t('homepage.hero.contactUs')}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-white/20 transition-all">
                                <Users className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-4xl md:text-5xl font-bold mb-2">
                                    {loading ? '...' : statistics?.totalEngineers || 350}
                                </p>
                                <p className="text-lg opacity-90">{t('homepage.statistics.engineers')}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-white/20 transition-all">
                                <Building2 className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-4xl md:text-5xl font-bold mb-2">
                                    {loading ? '...' : statistics?.totalCustomers || 30}
                                </p>
                                <p className="text-lg opacity-90">{t('homepage.statistics.customers')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Use Section */}
            <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('homepage.howToUse.title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 01 */}
                        <Card className="hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {t('homepage.howToUse.step1Title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('homepage.howToUse.step1Desc')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Step 02 */}
                        <Card className="hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {t('homepage.howToUse.step2Title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('homepage.howToUse.step2Desc')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Step 03 */}
                        <Card className="hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {t('homepage.howToUse.step3Title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('homepage.howToUse.step3Desc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Engineer Showcase Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="space-y-12">
                    {/* Web Development */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {t('homepage.categories.web')} <ArrowRight className="inline w-6 h-6 ml-2" />
                            </h2>
                            <Link href="/engineers?category=web" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                {t('homepage.categories.viewAll')}
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {loading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i}>
                                            <CardContent className="p-6">
                                                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                                                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                                                <Skeleton className="h-4 w-1/2 mx-auto" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            ) : (
                                getEngineersByCategory('web').map((profile) => (
                                    <EngineerCard key={profile.id} profile={profile} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Game Development */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {t('homepage.categories.game')} <ArrowRight className="inline w-6 h-6 ml-2" />
                            </h2>
                            <Link href="/engineers?category=game" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                {t('homepage.categories.viewAll')}
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {loading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i}>
                                            <CardContent className="p-6">
                                                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                                                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                                                <Skeleton className="h-4 w-1/2 mx-auto" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            ) : (
                                getEngineersByCategory('game').map((profile) => (
                                    <EngineerCard key={profile.id} profile={profile} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI/ML Development */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {t('homepage.categories.aiml')} <ArrowRight className="inline w-6 h-6 ml-2" />
                            </h2>
                            <Link href="/engineers?category=ai-ml" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                {t('homepage.categories.viewAll')}
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {loading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i}>
                                            <CardContent className="p-6">
                                                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                                                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                                                <Skeleton className="h-4 w-1/2 mx-auto" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            ) : (
                                getEngineersByCategory('ai-ml').map((profile) => (
                                    <EngineerCard key={profile.id} profile={profile} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <AppFooter />
        </div>
    );
}
