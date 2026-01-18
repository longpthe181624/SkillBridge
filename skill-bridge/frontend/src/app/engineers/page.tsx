'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import EngineerCard from '@/components/EngineerCard';
import {
  searchEngineers,
  getAvailableSkills,
  getAvailableLocations,
  getAvailableSeniorities,
  SearchFilters,
  EngineerSearchResult,
} from '@/services/engineerSearchService';

export default function EngineersPage() {
  const { t } = useLanguage();
  
  // Search state
  const [searchResults, setSearchResults] = useState<EngineerSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Filter state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    skills: [],
    experienceMin: undefined,
    experienceMax: undefined,
    seniority: [],
    location: [],
    salaryMin: undefined,
    salaryMax: undefined,
    availability: true,
    page: 0,
    size: 20,
    sortBy: 'relevance',
  });

  // Available options for filters
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableSeniorities, setAvailableSeniorities] = useState<string[]>([]);

  // Load available filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      const [skills, locations, seniorities] = await Promise.all([
        getAvailableSkills(),
        getAvailableLocations(),
        getAvailableSeniorities(),
      ]);
      
      setAvailableSkills(skills);
      setAvailableLocations(locations);
      setAvailableSeniorities(seniorities);
    };
    
    loadFilterOptions();
  }, []);

  // Perform search with debounce and smooth transition
  const performSearch = useCallback(async () => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Start fade out transition
    setIsTransitioning(true);
    
    // Debounce: wait 500ms before searching
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      
      try {
        // Add small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await searchEngineers({ ...filters, page: currentPage });
        
        setSearchResults(response.results);
        setTotalResults(response.totalResults);
        setTotalPages(response.totalPages);
        
        // Fade in transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      } catch (error) {
        console.error('Search error:', error);
        setIsTransitioning(false);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [filters, currentPage]);

  // Trigger search when filters or page change
  useEffect(() => {
    performSearch();
    
    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [performSearch]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      query: '',
      skills: [],
      experienceMin: undefined,
      experienceMax: undefined,
      seniority: [],
      location: [],
      salaryMin: undefined,
      salaryMax: undefined,
      availability: true,
      page: 0,
      size: 20,
      sortBy: 'relevance',
    });
    setCurrentPage(0);
  };

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...(prev.skills || []), skill],
    }));
    setCurrentPage(0);
  };

  // Toggle seniority selection
  const toggleSeniority = (level: string) => {
    setFilters(prev => ({
      ...prev,
      seniority: prev.seniority?.includes(level)
        ? prev.seniority.filter(s => s !== level)
        : [...(prev.seniority || []), level],
    }));
    setCurrentPage(0);
  };

  // Toggle location selection
  const toggleLocation = (loc: string) => {
    setFilters(prev => ({
      ...prev,
      location: prev.location?.includes(loc)
        ? prev.location.filter(l => l !== loc)
        : [...(prev.location || []), loc],
    }));
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader currentPage="engineers" />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('engineerSearch.pageTitle')}</h1>
          <p className="text-gray-600">{t('engineerSearch.pageDescription')}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('engineerSearch.searchPlaceholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.query}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, query: e.target.value }));
                setCurrentPage(0);
              }}
            />
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>🔍</span>
              {showAdvancedSearch ? t('engineerSearch.hideFilters') : t('engineerSearch.advancedSearch')}
            </button>
          </div>
        </div>

        {/* Advanced Search Filters */}
        {showAdvancedSearch && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t('engineerSearch.filters.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('engineerSearch.filters.skills')}</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {availableSkills.map(skill => (
                    <label key={skill} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.skills?.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="mr-2"
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seniority Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('engineerSearch.filters.seniority')}</label>
                <div className="space-y-2">
                  {availableSeniorities.map(level => (
                    <label key={level} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.seniority?.includes(level)}
                        onChange={() => toggleSeniority(level)}
                        className="mr-2"
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('engineerSearch.filters.location')}</label>
                <div className="space-y-2">
                  {availableLocations.map(loc => (
                    <label key={loc} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location?.includes(loc)}
                        onChange={() => toggleLocation(loc)}
                        className="mr-2"
                      />
                      <span className="text-sm">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('engineerSearch.filters.experience')}: {filters.experienceMin || 0} - {filters.experienceMax || 20}+
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.experienceMin || 0}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, experienceMin: parseInt(e.target.value) }));
                      setCurrentPage(0);
                    }}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.experienceMax || 20}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, experienceMax: parseInt(e.target.value) }));
                      setCurrentPage(0);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('engineerSearch.filters.salary')}: {(filters.salaryMin || 0).toLocaleString()} - {(filters.salaryMax || 1000000).toLocaleString()}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.salaryMin || 0}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, salaryMin: parseInt(e.target.value) }));
                      setCurrentPage(0);
                    }}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.salaryMax || 1000000}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, salaryMax: parseInt(e.target.value) }));
                      setCurrentPage(0);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, availability: e.target.checked }));
                      setCurrentPage(0);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">{t('engineerSearch.filters.availableOnly')}</span>
                </label>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('engineerSearch.filters.resetAll')}
              </button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {loading ? t('engineerSearch.results.searching') : `${totalResults} ${t('engineerSearch.results.found')}`}
          </h2>
        </div>

        {/* Search Results Grid with Smooth Transition */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('engineerSearch.loading')}</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {searchResults.map((engineer) => (
              <EngineerCard key={engineer.id} profile={engineer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('engineerSearch.results.noResults')}</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('engineerSearch.results.clearFilters')}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('engineerSearch.pagination.previous')}
            </button>
            
            <span className="text-gray-700">
              {t('engineerSearch.pagination.page')} {currentPage + 1} {t('engineerSearch.pagination.of')} {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('engineerSearch.pagination.next')}
            </button>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}

