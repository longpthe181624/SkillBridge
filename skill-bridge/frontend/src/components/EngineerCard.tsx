/**
 * Engineer Card Component
 * Displays engineer profile information on the homepage
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import type { EngineerProfile } from '@/services/homepageService';

interface EngineerCardProps {
  profile: EngineerProfile;
}

export const EngineerCard: React.FC<EngineerCardProps> = ({ profile }) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format salary
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('ja-JP').format(salary);
  };

  return (
    <Link href={`/engineers/${profile.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image */}
          <Avatar className="w-24 h-24">
            <AvatarImage 
              src={profile.profileImageUrl || '/images/default-engineer.jpg'} 
              alt={profile.fullName}
            />
            <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(profile.fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Engineer Name */}
          <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
            {profile.fullName}
          </h3>

          {/* Seniority & Primary Skill Badges */}
          <div className="flex gap-2 flex-wrap justify-center">
            {profile.seniority && (
              <Badge variant="outline" className="text-xs">
                {profile.seniority}
              </Badge>
            )}
            <Badge variant="secondary" className="text-sm">
              {profile.primarySkill || 'Developer'}
            </Badge>
          </div>

          {/* Summary (if available) */}
          {profile.summary && (
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-2 w-full">
              {profile.summary}
            </p>
          )}

          {/* Engineer Details */}
          <div className="w-full space-y-2 text-sm">
            {/* Salary */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Salary:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ¥{formatSalary(profile.salaryExpectation || 0)}
              </span>
            </div>

            {/* Experience */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Experience:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile.yearsExperience} {profile.yearsExperience === 1 ? 'year' : 'years'}
              </span>
            </div>

            {/* Location */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Location:</span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                {profile.location?.toLowerCase().includes('vietnam') || 
                 profile.location?.toLowerCase().includes('việt nam') ? (
                  <span className="text-lg">🇻🇳</span>
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {profile.location || 'Remote'}
              </span>
            </div>

            {/* Language Summary (if available) */}
            {profile.languageSummary && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                <span className="font-semibold text-gray-900 dark:text-white text-xs">
                  {profile.languageSummary}
                </span>
              </div>
            )}

            {/* Status Badge */}
            {profile.status && (
              <div className="pt-2 text-center">
                <Badge 
                  variant={profile.status === 'AVAILABLE' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {profile.status === 'AVAILABLE' ? '✓ Available' : 'Not Available'}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default EngineerCard;

