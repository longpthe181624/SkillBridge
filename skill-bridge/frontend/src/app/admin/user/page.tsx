'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { 
  getUsers, 
  deleteUser,
  User
} from '@/services/adminUserService';
import { useDebounce } from '@/hooks/useDebounce';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import CreateUserModal from '@/components/admin/user/CreateUserModal';
import EditUserModal from '@/components/admin/user/EditUserModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminUserListPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteUserName, setDeleteUserName] = useState<string>('');

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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        pageSize,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await getUsers(params);
      setUsers(response.users);
      setTotalPages(response.page.totalPages);
      setTotal(response.page.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  // Reset to page 0 when search or filter changes
  useEffect(() => {
    if (debouncedSearch !== search || roleFilter !== 'all' || statusFilter !== 'all') {
      setPage(0);
    }
  }, [debouncedSearch, roleFilter, statusFilter]);

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteUser(deleteTarget);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setDeleteUserName('');
      await fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const openDeleteDialog = (user: User) => {
    setDeleteTarget(user.id);
    setDeleteUserName(user.fullName);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    fetchUsers();
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  // Format role display
  const formatRole = (role: string): string => {
    if (role === 'SALES_MANAGER') return t('admin.user.filter.role.salesManager');
    if (role === 'SALES_REP') return t('admin.user.filter.role.salesRep');
    return role;
  };

  // Format status display
  const formatStatus = (isActive: boolean): string => {
    return isActive ? t('admin.user.filter.status.active') : t('admin.user.filter.status.deleted');
  };

  // Get status color
  const getStatusColor = (isActive: boolean): string => {
    return isActive ? 'text-green-600' : 'text-red-600';
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
        <AdminHeader title={t('admin.user.title')} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('admin.user.search.placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[160px] pl-10">
                      <SelectValue placeholder={t('admin.user.filter.role.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('admin.user.filter.role.all')}</SelectItem>
                      <SelectItem value="SALES_MANAGER">{t('admin.user.filter.role.salesManager')}</SelectItem>
                      <SelectItem value="SALES_REP">{t('admin.user.filter.role.salesRep')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('admin.user.filter.status.all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.user.filter.status.all')}</SelectItem>
                    <SelectItem value="active">{t('admin.user.filter.status.active')}</SelectItem>
                    <SelectItem value="deleted">{t('admin.user.filter.status.deleted')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setCreateModalOpen(true)} variant="outline" className="border-black">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.user.createNew')}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('admin.user.table.no')}</TableHead>
                    <TableHead>{t('admin.user.table.name')}</TableHead>
                    <TableHead>{t('admin.user.table.role')}</TableHead>
                    <TableHead>{t('admin.user.table.phoneNumber')}</TableHead>
                    <TableHead>{t('admin.user.table.status')}</TableHead>
                    <TableHead className="w-24">{t('admin.user.table.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {t('admin.user.loading')}
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {t('admin.user.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{page * pageSize + index + 1}</TableCell>
                        <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                        <TableCell className="text-gray-600">{formatRole(user.role)}</TableCell>
                        <TableCell className="text-gray-600">{user.phone || 'N/A'}</TableCell>
                        <TableCell className={getStatusColor(user.isActive)}>
                          {formatStatus(user.isActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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
              <div className="flex justify-end items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  {t('admin.user.pagination.previous')}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="min-w-[40px]"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  {t('admin.user.pagination.next')}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        userId={editingUser?.id || null}
        onClose={() => {
          setEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
          setDeleteUserName('');
        }}
        onConfirm={handleDeleteUser}
        title={t('admin.user.table.delete')}
        message={`${t('admin.user.delete.confirm')} ${deleteUserName}${t('admin.user.delete.question')}`}
      />
    </div>
  );
}

