/**
 * App Footer Component
 * Shared footer component for all pages
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const AppFooter: React.FC = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            SKILL BRIDGE
                        </h3>
                        <p className="text-gray-400">
                            {t('footer.brand.description')}
                        </p>
                    </div>

                    {/* Links Column 1 - Legal */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('footer.section.legal')}</h4>
                        <div className="flex flex-col space-y-2">
                            <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.links.faq')}
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.links.terms')}
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.links.privacy')}
                            </Link>
                        </div>
                    </div>

                    {/* Links Column 2 - Navigation */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('footer.section.navigation')}</h4>
                        <div className="flex flex-col space-y-2">
                            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.services.home')}
                            </Link>
                            <Link href="/engineers" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.services.engineers')}
                            </Link>
                            <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.services.services')}
                            </Link>
                            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                {t('footer.services.contact')}
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('footer.section.contact')}</h4>
                        <p className="text-gray-400">
                            {t('footer.contact.email')}: contact@skillbridge.com
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="w-full">
                                {t('footer.contact.button')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SkillBridge. {t('footer.copyright')}.</p>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;

