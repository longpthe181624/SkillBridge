'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { 
  getAllEngineers, 
  deleteEngineer,
  Engineer
} from '@/services/adminEngineerService';
import { useDebounce } from '@/hooks/useDebounce';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminEngineerListPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteEngineerName, setDeleteEngineerName] = useState<string>('');

  const debouncedSearch = useDebounce(search, 500);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                if (userData.role !== 'ADMIN') {
                    router.push('/admin/login');
                }
            } catch (e) {
                console.error('Error parsing user:', e);
                router.push('/admin/login');
            }
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    // Fetch engineers
    const fetchEngineers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllEngineers(page, 20, debouncedSearch || undefined);
            setEngineers(response.content);
            setTotalPages(response.page.totalPages);
            setTotalElements(response.page.totalElements);
        } catch (error) {
            console.error('Error fetching engineers:', error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        if (user) {
            fetchEngineers();
        }
    }, [user, fetchEngineers]);

  // Reset to page 0 when search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setPage(0);
    }
  }, [debouncedSearch]);


  const handleDeleteEngineer = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteEngineer(deleteTarget);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setDeleteEngineerName('');
      await fetchEngineers();
    } catch (error: any) {
      alert(error.message || 'Failed to delete engineer');
    }
  };

  const openDeleteDialog = (engineer: Engineer) => {
    setDeleteTarget(engineer.id);
    setDeleteEngineerName(engineer.fullName);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (engineer: Engineer) => {
    router.push(`/admin/engineer/${engineer.id}/edit`);
  };

  // Format experience
  const formatExperience = (years: number | null | undefined): string => {
    if (years === null || years === undefined) {
      return '0 yrs';
    }
    return `${years} yrs`;
  };

  // Format salary expectation
  const formatSalary = (salary: number | null | undefined): string => {
    if (salary === null || salary === undefined) {
      return 'N/A';
    }
    // Format as Japanese Yen: ¥ X,XXX,XXX
    return `¥ ${salary.toLocaleString('ja-JP')}`;
  };

  // Format main skill
  const formatMainSkill = (skill: string | null | undefined): string => {
    if (!skill || skill.trim() === '') {
      return 'N/A';
    }
    return skill;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <AdminHeader title={t('admin.engineer.title')} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('admin.engineer.search.placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => router.push('/admin/engineer/new')} variant="outline" className="border-black">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.engineer.createNew')}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('admin.engineer.table.no')}</TableHead>
                    <TableHead>{t('admin.engineer.table.name')}</TableHead>
                    <TableHead>{t('admin.engineer.table.mainSkill')}</TableHead>
                    <TableHead>{t('admin.engineer.table.experience')}</TableHead>
                    <TableHead>{t('admin.engineer.table.salaryExpectation')}</TableHead>
                    <TableHead className="w-24">{t('admin.engineer.table.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {t('admin.engineer.loading')}
                      </TableCell>
                    </TableRow>
                  ) : engineers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {t('admin.engineer.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    engineers.map((engineer, index) => (
                      <TableRow key={engineer.id}>
                        <TableCell>{page * 20 + index + 1}</TableCell>
                        <TableCell className="font-medium">{engineer.fullName}</TableCell>
                        <TableCell className="text-gray-600">
                          {formatMainSkill(engineer.primarySkill)}
                        </TableCell>
                        <TableCell>{formatExperience(engineer.yearsExperience)}</TableCell>
                        <TableCell>{formatSalary(engineer.salaryExpectation)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(engineer)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(engineer)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
          setDeleteEngineerName('');
        }}
        onConfirm={handleDeleteEngineer}
        title={t('admin.engineer.table.delete')}
        message={`${t('admin.engineer.delete.confirm')} ${deleteEngineerName}${t('admin.engineer.delete.question')}`}
      />
    </div>
  );
}

