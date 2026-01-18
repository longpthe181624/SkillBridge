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
  getAllProjectTypes, 
  createProjectType,
  updateProjectType,
  deleteProjectType,
  ProjectType,
  CreateProjectTypeRequest,
  UpdateProjectTypeRequest
} from '@/services/adminProjectTypeService';
import { useDebounce } from '@/hooks/useDebounce';
import CreateProjectTypeModal from '@/components/admin/CreateProjectTypeModal';
import EditProjectTypeModal from '@/components/admin/EditProjectTypeModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminMasterDataProjectTypePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

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

  // Fetch project types
  const fetchProjectTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllProjectTypes(page, 20, debouncedSearch || undefined);
      setProjectTypes(response.content);
      setTotalPages(response.page.totalPages);
      setTotalElements(response.page.totalElements);
    } catch (error) {
      console.error('Error fetching project types:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (user) {
      fetchProjectTypes();
    }
  }, [user, fetchProjectTypes]);

  const handleCreateProjectType = async (request: CreateProjectTypeRequest) => {
    try {
      await createProjectType(request);
      setCreateModalOpen(false);
      await fetchProjectTypes();
    } catch (error: any) {
      alert(error.message || 'Failed to create project type');
      throw error;
    }
  };

  const handleUpdateProjectType = async (projectTypeId: number, request: UpdateProjectTypeRequest) => {
    try {
      await updateProjectType(projectTypeId, request);
      setEditModalOpen(false);
      setEditingProjectType(null);
      await fetchProjectTypes();
    } catch (error: any) {
      alert(error.message || 'Failed to update project type');
      throw error;
    }
  };

  const handleDeleteProjectType = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteProjectType(deleteTarget);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await fetchProjectTypes();
    } catch (error: any) {
      alert(error.message || 'Failed to delete project type');
    }
  };

  const openDeleteDialog = (projectTypeId: number) => {
    setDeleteTarget(projectTypeId);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (projectType: ProjectType) => {
    setEditingProjectType(projectType);
    setEditModalOpen(true);
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
        <AdminHeader title={t('admin.masterData.projectType.title')} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('admin.masterData.projectType.search.placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => setCreateModalOpen(true)} variant="outline" className="border-black">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.masterData.projectType.createNew')}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('admin.masterData.projectType.table.no')}</TableHead>
                    <TableHead>{t('admin.masterData.projectType.table.name')}</TableHead>
                    <TableHead>{t('admin.masterData.projectType.table.description')}</TableHead>
                    <TableHead className="w-24">{t('admin.masterData.projectType.table.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        {t('admin.masterData.projectType.loading')}
                      </TableCell>
                    </TableRow>
                  ) : projectTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        {t('admin.masterData.projectType.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectTypes.map((projectType, index) => (
                      <TableRow key={projectType.id}>
                        <TableCell>{page * 20 + index + 1}</TableCell>
                        <TableCell className="font-medium">{projectType.name}</TableCell>
                        <TableCell className="text-gray-600">
                          {projectType.description || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(projectType)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(projectType.id)}
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
      <CreateProjectTypeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProjectType}
      />

      {editingProjectType && (
        <EditProjectTypeModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingProjectType(null);
          }}
          onSubmit={(request) => handleUpdateProjectType(editingProjectType.id, request)}
          projectType={editingProjectType}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteProjectType}
        title={t('admin.masterData.projectType.table.delete')}
        message={`${t('admin.user.delete.confirm')} ${t('admin.masterData.projectType.table.name')}?`}
      />
    </div>
  );
}

