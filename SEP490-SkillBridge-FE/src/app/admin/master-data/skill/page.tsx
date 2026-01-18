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
    getAllParentSkills,
    getSubSkillsByParentId,
    createSkill,
    updateSkill,
    deleteSkill,
    createSubSkill,
    updateSubSkill,
    deleteSubSkill,
    Skill,
    SubSkill,
    CreateSkillRequest,
    UpdateSkillRequest
} from '@/services/adminSkillService';
import { useDebounce } from '@/hooks/useDebounce';
import CreateSkillModal from '@/components/admin/CreateSkillModal';
import EditSkillModal from '@/components/admin/EditSkillModal';
import CreateSubSkillModal from '@/components/admin/CreateSubSkillModal';
import EditSubSkillModal from '@/components/admin/EditSubSkillModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminMasterDataSkillPage() {
    const router = useRouter();
  const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [subSkills, setSubSkills] = useState<SubSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [subSkillsLoading, setSubSkillsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // Modal states
    const [createSkillModalOpen, setCreateSkillModalOpen] = useState(false);
    const [editSkillModalOpen, setEditSkillModalOpen] = useState(false);
    const [createSubSkillModalOpen, setCreateSubSkillModalOpen] = useState(false);
    const [editSubSkillModalOpen, setEditSubSkillModalOpen] = useState(false);
    const [editingSubSkill, setEditingSubSkill] = useState<SubSkill | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'skill' | 'subskill', id: number } | null>(null);

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

    // Fetch skills
    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllParentSkills(page, 20, debouncedSearch || undefined);
            setSkills(response.content);
            setTotalPages(response.page.totalPages);
            setTotalElements(response.page.totalElements);

            // If selected skill is no longer in the list, clear selection
            if (selectedSkill && !response.content.find(s => s.id === selectedSkill.id)) {
                setSelectedSkill(null);
                setSubSkills([]);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, selectedSkill]);

    useEffect(() => {
        if (user) {
            fetchSkills();
        }
    }, [user, fetchSkills]);

    // Fetch sub-skills when a skill is selected
    useEffect(() => {
        if (selectedSkill) {
            fetchSubSkills(selectedSkill.id);
        } else {
            setSubSkills([]);
        }
    }, [selectedSkill]);

    const fetchSubSkills = async (skillId: number) => {
        try {
            setSubSkillsLoading(true);
            const subSkillsData = await getSubSkillsByParentId(skillId);
            setSubSkills(subSkillsData);
        } catch (error) {
            console.error('Error fetching sub-skills:', error);
            setSubSkills([]);
        } finally {
            setSubSkillsLoading(false);
        }
    };

    const handleSkillRowClick = (skill: Skill) => {
        setSelectedSkill(skill);
    };

    const handleCreateSkill = async (request: CreateSkillRequest) => {
        try {
            await createSkill(request);
            setCreateSkillModalOpen(false);
            await fetchSkills();
        } catch (error: any) {
            alert(error.message || 'Failed to create skill');
            throw error;
        }
    };

    const handleUpdateSkill = async (skillId: number, request: UpdateSkillRequest) => {
        try {
            await updateSkill(skillId, request);
            setEditSkillModalOpen(false);
            await fetchSkills();
            // Refresh sub-skills if this skill is selected
            if (selectedSkill?.id === skillId) {
                await fetchSubSkills(skillId);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update skill');
            throw error;
        }
    };

    const handleDeleteSkill = async () => {
        if (!deleteTarget || deleteTarget.type !== 'skill') return;

        try {
            await deleteSkill(deleteTarget.id);
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
            if (selectedSkill?.id === deleteTarget.id) {
                setSelectedSkill(null);
                setSubSkills([]);
            }
            await fetchSkills();
        } catch (error: any) {
            alert(error.message || 'Failed to delete skill');
        }
    };

    const handleCreateSubSkill = async (request: { name: string }) => {
        if (!selectedSkill) return;

        try {
            await createSubSkill(selectedSkill.id, request);
            setCreateSubSkillModalOpen(false);
            await fetchSubSkills(selectedSkill.id);
        } catch (error: any) {
            alert(error.message || 'Failed to create sub-skill');
            throw error;
        }
    };

    const handleUpdateSubSkill = async (subSkillId: number, request: { name: string }) => {
        try {
            await updateSubSkill(subSkillId, request);
            setEditSubSkillModalOpen(false);
            if (selectedSkill) {
                await fetchSubSkills(selectedSkill.id);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update sub-skill');
            throw error;
        }
    };

    const handleDeleteSubSkill = async () => {
        if (!deleteTarget || deleteTarget.type !== 'subskill') return;

        try {
            await deleteSubSkill(deleteTarget.id);
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
            if (selectedSkill) {
                await fetchSubSkills(selectedSkill.id);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to delete sub-skill');
        }
    };

    const openDeleteDialog = (type: 'skill' | 'subskill', id: number) => {
        setDeleteTarget({ type, id });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === 'skill') {
            handleDeleteSkill();
        } else {
            handleDeleteSubSkill();
        }
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
        <AdminHeader title={t('admin.masterData.skill.title')} />

                {/* Main Content Area */}
                <main className="flex-1 p-6">

                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Panel - Skills Table */}
                        <div className="col-span-8 bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                      placeholder={t('admin.masterData.skill.search.placeholder')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button onClick={() => setCreateSkillModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                  {t('admin.masterData.skill.createSkill')}
                                </Button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                      <TableHead className="w-16">{t('admin.masterData.skill.table.no')}</TableHead>
                      <TableHead>{t('admin.masterData.skill.table.name')}</TableHead>
                      <TableHead>{t('admin.masterData.skill.table.description')}</TableHead>
                      <TableHead className="w-24">{t('admin.masterData.skill.table.action')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8">
                          {t('admin.masterData.skill.loading')}
                                                </TableCell>
                                            </TableRow>
                                        ) : skills.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          {t('admin.masterData.skill.empty')}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            skills.map((skill, index) => (
                                                <TableRow
                                                    key={skill.id}
                                                    onClick={() => handleSkillRowClick(skill)}
                                                    className={`cursor-pointer hover:bg-gray-50 ${
                                                        selectedSkill?.id === skill.id ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <TableCell>{page * 20 + index + 1}</TableCell>
                                                    <TableCell className="font-medium">{skill.name}</TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {skill.description || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedSkill(skill);
                                                                    setEditSkillModalOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openDeleteDialog('skill', skill.id);
                                                                }}
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
                                <div className="flex justify-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() => setPage(page - 1)}
                                    >
                    {t('admin.masterData.skill.pagination.previous')}
                                    </Button>
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(page + 1)}
                                    >
                    {t('admin.masterData.skill.pagination.next')}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Panel - Sub Skills */}
                        <div className="col-span-4 bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin.masterData.skill.subSkills.title')}</h2>
                            </div>

                            {!selectedSkill ? (
                                <div className="text-center py-8 text-gray-500">
                                    Select a skill to view sub-skills
                                </div>
                            ) : subSkillsLoading ? (
                                <div className="text-center py-8 text-gray-500">
                  {t('admin.masterData.skill.loading')}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                                        {subSkills.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                        {t('admin.masterData.skill.subSkills.empty')}
                                            </div>
                                        ) : (
                                            subSkills.map((subSkill) => (
                                                <div
                                                    key={subSkill.id}
                                                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                                                >
                                                    <span className="font-medium">{subSkill.name}</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setEditingSubSkill(subSkill);
                                                                setEditSubSkillModalOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog('subskill', subSkill.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setCreateSubSkillModalOpen(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                    {t('admin.masterData.skill.createSubSkill')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <CreateSkillModal
                open={createSkillModalOpen}
                onClose={() => setCreateSkillModalOpen(false)}
                onSubmit={handleCreateSkill}
            />

            {selectedSkill && (
                <EditSkillModal
                    open={editSkillModalOpen}
                    onClose={() => setEditSkillModalOpen(false)}
                    onSubmit={(request) => handleUpdateSkill(selectedSkill.id, request)}
                    skill={selectedSkill}
                    subSkills={subSkills}
                />
            )}

            {selectedSkill && (
                <CreateSubSkillModal
                    open={createSubSkillModalOpen}
                    onClose={() => setCreateSubSkillModalOpen(false)}
                    onSubmit={handleCreateSubSkill}
                    parentSkillName={selectedSkill.name}
                />
            )}

            <EditSubSkillModal
                open={editSubSkillModalOpen}
                onClose={() => {
                    setEditSubSkillModalOpen(false);
                    setEditingSubSkill(null);
                }}
                onSubmit={(subSkillId, request) => handleUpdateSubSkill(subSkillId, request)}
                subSkill={editingSubSkill}
                parentSkillName={selectedSkill?.name || ''}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={handleDeleteConfirm}
                title={deleteTarget?.type === 'skill' ? 'Delete Skill' : 'Delete Sub Skill'}
                message={
                    deleteTarget?.type === 'skill'
                        ? 'Are you sure you want to delete this skill? This will also delete all associated sub-skills.'
                        : 'Are you sure you want to delete this sub-skill?'
                }
            />
        </div>
    );
}

