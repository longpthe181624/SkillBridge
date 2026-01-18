'use client';

/**
 * Engineer Detail Page
 * Displays comprehensive information about a specific engineer
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import Breadcrumb from '@/components/Breadcrumb';
import { getEngineerById, EngineerDetail, EngineerSkill, Certificate } from '@/services/engineerDetailService';
import { Globe, Briefcase, Award, Calendar, DollarSign, MapPin } from 'lucide-react';

export default function EngineerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const engineerId = Number(params.id);
    const { t } = useLanguage();

    const [engineer, setEngineer] = useState<EngineerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEngineerDetail();
    }, [engineerId]);

    const loadEngineerDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEngineerById(engineerId);
            setEngineer(data);
        } catch (err) {
            setError(t('engineerDetail.notFound'));
            console.error('Error loading engineer:', err);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <AppHeader currentPage="engineers" />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">{t('engineerDetail.loading')}</p>
                    </div>
                </main>
                <AppFooter />
            </div>
        );
    }

    // Error state
    if (error || !engineer) {
        return (
            <div className="min-h-screen flex flex-col">
                <AppHeader currentPage="engineers" />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-6">{t('engineerDetail.notFound')}</p>
                        <button
                            onClick={() => router.push('/engineers')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('engineerDetail.backToList')}
                        </button>
                    </div>
                </main>
                <AppFooter />
            </div>
        );
    }

    // Format salary
    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('ja-JP').format(salary);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-100 text-green-800';
            case 'BUSY':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status text
    const getStatusText = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return t('engineerDetail.status.available');
            case 'BUSY':
                return t('engineerDetail.status.busy');
            default:
                return t('engineerDetail.status.notAvailable');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AppHeader currentPage="engineers" />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: t('engineerDetail.listEngineer'), href: '/engineers' },
                        { label: t('engineerDetail.detail') }
                    ]}
                />

                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('engineerDetail.title')}</h1>

                {/* Engineer Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Profile Image */}
                        <div className="w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={engineer.profileImageUrl || '/images/default-engineer.jpg'}
                                    alt={engineer.fullName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/default-engineer.jpg';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-3 text-gray-900">{engineer.fullName}</h2>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{engineer.location}</span>
                                </div>

                                {engineer.languageSummary && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span>{engineer.languageSummary}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className="mt-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(engineer.status)}`}>
                  {getStatusText(engineer.status)}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {t('engineerDetail.overview')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                {t('engineerDetail.salaryExpectation')}
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                ¥{formatSalary(engineer.salaryExpectation)}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {t('engineerDetail.yearsExperience')}
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {engineer.yearsExperience} {t('engineerDetail.years')}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-sm mb-1">
                                {t('engineerDetail.seniority')}
                            </p>
                            <p className="text-xl font-bold text-gray-900">{engineer.seniority}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-sm mb-1">
                                {t('engineerDetail.primarySkill')}
                            </p>
                            <p className="text-lg font-semibold text-blue-600">{engineer.primarySkill}</p>
                        </div>

                        {engineer.languageSummary && (
                            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                <p className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    {t('engineerDetail.languages')}
                                </p>
                                <p className="text-lg font-semibold text-gray-900">{engineer.languageSummary}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                {engineer.skills && engineer.skills.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            {t('engineerDetail.skills')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {engineer.skills.map((skill: EngineerSkill) => (
                                <div
                                    key={skill.id}
                                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                                >
                                    {skill.name}
                                    {skill.level && (
                                        <span className="ml-2 text-xs opacity-75">({skill.level})</span>
                                    )}
                                    {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                                        <span className="ml-2 text-xs opacity-75">• {skill.yearsOfExperience}y</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Introduction Section */}
                {engineer.introduction && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900">
                            {t('engineerDetail.introduction')}
                        </h3>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {engineer.introduction}
                            </p>
                        </div>
                    </div>
                )}

                {/* Certificates Section */}
                {engineer.certificates && engineer.certificates.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            {t('engineerDetail.certificates')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {engineer.certificates.map((cert: Certificate) => (
                                <div
                                    key={cert.id}
                                    className="px-4 py-3 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                                >
                                    <div className="font-semibold">{cert.name}</div>
                                    {cert.issuedBy && (
                                        <div className="text-xs opacity-75 mt-1">{cert.issuedBy}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to List Button */}
                <div className="mt-8">
                    <button
                        onClick={() => router.push('/engineers')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        ← {t('engineerDetail.backToList')}
                    </button>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}

