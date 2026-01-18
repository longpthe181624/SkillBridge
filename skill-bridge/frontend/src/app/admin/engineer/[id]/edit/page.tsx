'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus, Trash2, Upload } from 'lucide-react';
import { 
  updateEngineer,
  getEngineerDetailById,
  CertificateRequest,
  UpdateEngineerRequest,
  EngineerDetail,
  Certificate,
  uploadProfileImage
} from '@/services/adminEngineerService';
import { useToast } from '@/components/ui/use-toast';
import { getAllParentSkills, Skill } from '@/services/adminSkillService';
import { getAllProjectTypes, ProjectType } from '@/services/adminProjectTypeService';
import { useLanguage } from '@/contexts/LanguageContext';

interface CertificateFormData {
  id?: number; // For existing certificates
  name: string;
  issuedBy?: string;
  issuedDate?: string;
  expiryDate?: string;
}

export default function EditEngineerPage() {
  const router = useRouter();
  const params = useParams();
  const engineerId = parseInt(params.id as string);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Date validation helpers
  const getDOBMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 70);
    return date.toISOString().split('T')[0];
  };

  const getDOBMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  const getCertIssuedMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    return date.toISOString().split('T')[0];
  };

  const getCertIssuedMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getCertExpiryMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getCertExpiryMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 20);
    return date.toISOString().split('T')[0];
  };

  // Form data
  const [formData, setFormData] = useState<UpdateEngineerRequest>({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    seniority: '',
    introduction: '',
    yearsExperience: 0,
    primarySkill: '',
    otherSkills: [],
    projectTypeExperience: '',
    languageSummary: '',
    salaryExpectation: undefined,
    interestedInJapan: undefined,
    location: '',
    status: 'AVAILABLE',
    summary: '',
    profileImageUrl: '',
    certificates: []
  });

  // Original data for dirty state tracking
  const [originalData, setOriginalData] = useState<EngineerDetail | null>(null);

  // Certificate list
  const [certificates, setCertificates] = useState<CertificateFormData[]>([]);

  // Image upload
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Dropdown options
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Load engineer data on mount
  useEffect(() => {
    if (user && engineerId) {
      loadEngineerData();
      loadSkills();
      loadProjectTypes();
    }
  }, [user, engineerId]);

  const loadEngineerData = async () => {
    try {
      setLoading(true);
      const engineer = await getEngineerDetailById(engineerId);
      setOriginalData(engineer);
      
      // Pre-fill form with engineer data
      setFormData({
        fullName: engineer.fullName || '',
        email: engineer.email || '',
        phone: engineer.phone || '',
        gender: engineer.gender || '',
        dateOfBirth: engineer.dateOfBirth ? engineer.dateOfBirth.split('T')[0] : '',
        seniority: engineer.seniority || '',
        introduction: engineer.introduction || '',
        yearsExperience: engineer.yearsExperience || 0,
        primarySkill: engineer.primarySkill || '',
        otherSkills: engineer.otherSkills || [],
        projectTypeExperience: engineer.projectTypeExperience || '',
        languageSummary: engineer.languageSummary || '',
        salaryExpectation: engineer.salaryExpectation,
        interestedInJapan: engineer.interestedInJapan,
        location: engineer.location || '',
        status: engineer.status || 'AVAILABLE',
        summary: engineer.summary || '',
        profileImageUrl: engineer.profileImageUrl || '',
        certificates: []
      });

      // Load certificates
      if (engineer.certificates && engineer.certificates.length > 0) {
        const certs: CertificateFormData[] = engineer.certificates.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuedBy: cert.issuedBy,
          issuedDate: cert.issuedDate ? cert.issuedDate.split('T')[0] : '',
          expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : ''
        }));
        setCertificates(certs);
      }

      // Load image preview if exists
      if (engineer.profileImageUrl) {
        setImagePreview(engineer.profileImageUrl);
      }

      setHasChanges(false);
    } catch (error: any) {
      console.error('Error loading engineer:', error);
      alert(error.message || 'Failed to load engineer data');
      router.push('/admin/engineer');
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const response = await getAllParentSkills(0, 1000);
      setSkills(response.content);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const loadProjectTypes = async () => {
    try {
      const response = await getAllProjectTypes(0, 1000);
      setProjectTypes(response.content);
    } catch (error) {
      console.error('Error loading project types:', error);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle certificate management
  const handleAddCertificate = () => {
    setCertificates(prev => [...prev, { name: '', issuedBy: '', issuedDate: '', expiryDate: '' }]);
    setHasChanges(true);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleCertificateChange = (index: number, field: string, value: string) => {
    setCertificates(prev => prev.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    ));
    setHasChanges(true);
  };

  // Handle image upload
  const processImageFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file' }));
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }
    setImageFile(file);
    setHasChanges(true);
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to S3
    try {
      setLoading(true);
      const { s3Key, presignedUrl } = await uploadProfileImage(file);
      // Store S3 key in formData (for database)
      handleFieldChange('profileImageUrl', s3Key);
      // Use presigned URL for preview
      setImagePreview(presignedUrl);
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, image: error.message || 'Failed to upload image' }));
      setImageFile(null);
      setImagePreview(formData.profileImageUrl || null);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setHasChanges(true);
    handleFieldChange('profileImageUrl', '');
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.yearsExperience && formData.yearsExperience !== 0) {
      newErrors.yearsExperience = 'Year of experience is required';
    }
    if (!formData.seniority) {
      newErrors.seniority = 'Level is required';
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 70);
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 18);
      
      if (dob > maxDate) {
        newErrors.dateOfBirth = 'Date of birth must be at least 18 years ago';
      } else if (dob < minDate) {
        newErrors.dateOfBirth = 'Date of birth cannot be more than 70 years ago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Convert certificates to request format
      const certificateRequests: CertificateRequest[] = certificates
        .filter(cert => cert.name.trim())
        .map(cert => ({
          name: cert.name,
          issuedBy: cert.issuedBy || undefined,
          issuedDate: cert.issuedDate || undefined,
          expiryDate: cert.expiryDate || undefined
        }));

      // Convert project type experience to comma-separated string
      let projectTypeExpStr = '';
      if (formData.projectTypeExperience) {
        projectTypeExpStr = typeof formData.projectTypeExperience === 'string' 
          ? formData.projectTypeExperience 
          : (formData.projectTypeExperience as any[]).join(', ');
      }

      // Ensure required fields are properly set
      const request: UpdateEngineerRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        gender: formData.gender?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        seniority: formData.seniority,
        introduction: formData.introduction?.trim() || undefined,
        yearsExperience: formData.yearsExperience ?? 0,
        primarySkill: formData.primarySkill?.trim() || undefined,
        otherSkills: formData.otherSkills && formData.otherSkills.length > 0 ? formData.otherSkills : undefined,
        projectTypeExperience: projectTypeExpStr || undefined,
        languageSummary: formData.languageSummary?.trim() || undefined,
        salaryExpectation: formData.salaryExpectation,
        interestedInJapan: formData.interestedInJapan,
        location: formData.location?.trim() || undefined,
        status: formData.status,
        summary: formData.summary?.trim() || undefined,
        profileImageUrl: formData.profileImageUrl?.trim() || undefined,
        certificates: certificateRequests.length > 0 ? certificateRequests : undefined
      };

      await updateEngineer(engineerId, request);
      toast({
        title: 'Success',
        description: t('admin.engineer.success.update'),
        variant: 'success',
      });
      router.push('/admin/engineer');
    } catch (error: any) {
      console.error('Error updating engineer:', error);
      toast({
        title: 'Error',
        description: error.message || t('admin.engineer.error.update'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (confirm(t('admin.engineer.error.unsavedChanges'))) {
        router.push('/admin/engineer');
      }
    } else {
      router.push('/admin/engineer');
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader title={t('admin.engineer.title')} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-gray-600">{t('admin.engineer.loading')}</div>
          </main>
        </div>
      </div>
    );
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
            {/* Breadcrumbs */}
            <div className="mb-4 text-sm text-gray-600">
              <Link href="/admin/engineer" className="hover:text-gray-900">
                {t('admin.engineer.breadcrumb.engineerManagement')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{t('admin.engineer.breadcrumb.edit')}</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit engineer</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Basic Info Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full name <span className="text-red-500">*</span></Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="nguyen van A"
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="abc@gmail.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numbers and hyphens
                        if (/^[0-9-]*$/.test(value)) {
                          handleFieldChange('phone', value);
                        }
                      }}
                      placeholder="123456789"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender || ''} onValueChange={(value) => handleFieldChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">DOB</Label>
                    <div className="relative">
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                        min={getDOBMinDate()}
                        max={getDOBMaxDate()}
                        className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                      />
                      <CalendarIcon 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          const input = document.getElementById('dateOfBirth') as HTMLInputElement;
                          if (input) {
                            input.showPicker ? input.showPicker() : input.click();
                          }
                        }}
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="seniority">Level <span className="text-red-500">*</span></Label>
                    <Select value={formData.seniority || ''} onValueChange={(value) => handleFieldChange('seniority', value)}>
                      <SelectTrigger className={errors.seniority ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.seniority && (
                      <p className="text-red-500 text-sm mt-1">{errors.seniority}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="introduction">Introduce</Label>
                  <Textarea
                    id="introduction"
                    value={formData.introduction || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= 500) {
                        handleFieldChange('introduction', newValue);
                      }
                    }}
                    placeholder="Lorem Ipsum is simply dummy text"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {(formData.introduction || '').length}/500 characters
                  </div>
                </div>
              </div>

              {/* 2. Professional Info Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Professional Info</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsExperience">Year Of Experience <span className="text-red-500">*</span></Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.yearsExperience || ''}
                      onChange={(e) => handleFieldChange('yearsExperience', parseInt(e.target.value) || 0)}
                      placeholder="6"
                      className={errors.yearsExperience ? 'border-red-500' : ''}
                    />
                    {errors.yearsExperience && (
                      <p className="text-red-500 text-sm mt-1">{errors.yearsExperience}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="primarySkill">Primary Skills</Label>
                    <Input
                      id="primarySkill"
                      value={formData.primarySkill || ''}
                      onChange={(e) => handleFieldChange('primarySkill', e.target.value)}
                      placeholder="Backend, Cloud"
                    />
                  </div>

                  <div>
                    <Label htmlFor="otherSkills">Other Skill</Label>
                    <Select 
                      value="" 
                      onValueChange={(value) => {
                        const skillId = parseInt(value);
                        if (skillId && !formData.otherSkills?.includes(skillId)) {
                          handleFieldChange('otherSkills', [...(formData.otherSkills || []), skillId]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id.toString()}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.otherSkills && formData.otherSkills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.otherSkills.map((skillId) => {
                          const skill = skills.find(s => s.id === skillId);
                          return skill ? (
                            <span
                              key={skillId}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                            >
                              {skill.name}
                              <button
                                type="button"
                                onClick={() => {
                                  handleFieldChange('otherSkills', formData.otherSkills?.filter(id => id !== skillId) || []);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="projectTypeExperience">Project Type experience</Label>
                    <Select 
                      value="" 
                      onValueChange={(value) => {
                        const projectTypeId = parseInt(value);
                        const projectType = projectTypes.find(pt => pt.id === projectTypeId);
                        if (projectType) {
                          const current = formData.projectTypeExperience ? 
                            (typeof formData.projectTypeExperience === 'string' ? 
                              formData.projectTypeExperience.split(',').map(s => s.trim()).filter(Boolean) : 
                              []) : [];
                          if (!current.includes(projectType.name)) {
                            handleFieldChange('projectTypeExperience', [...current, projectType.name].join(', '));
                          }
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((pt) => (
                          <SelectItem key={pt.id} value={pt.id.toString()}>
                            {pt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.projectTypeExperience && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.projectTypeExperience.split(',').map((name, index) => {
                          const trimmedName = name.trim();
                          if (!trimmedName) return null;
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                            >
                              {trimmedName}
                              <button
                                type="button"
                                onClick={() => {
                                  const current = formData.projectTypeExperience?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                  const newList = current.filter(n => n !== trimmedName);
                                  handleFieldChange('projectTypeExperience', newList.join(', ') || '');
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Foreign Language Summary Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Foreign Language summary</h2>
                <Textarea
                  value={formData.languageSummary || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 500) {
                      handleFieldChange('languageSummary', newValue);
                    }
                  }}
                  placeholder="English (Fluent), Japanese (Basic)"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-sm text-gray-500">
                  {(formData.languageSummary || '').length}/500 characters
                </div>
              </div>

              {/* 4. Other Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Other</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryExpectation">Salary Expectation</Label>
                    <Input
                      id="salaryExpectation"
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.01"
                      value={formData.salaryExpectation || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 999999999)) {
                          handleFieldChange('salaryExpectation', value ? parseFloat(value) : undefined);
                        }
                      }}
                      placeholder="3500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interestedInJapan">Interested in Working in Japan</Label>
                    <Select 
                      value={formData.interestedInJapan === undefined ? '' : formData.interestedInJapan ? 'Yes' : 'No'} 
                      onValueChange={(value) => handleFieldChange('interestedInJapan', value === 'Yes')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 5. Certificate Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Certificate</h2>
                {certificates.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Certificate {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCertificate(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`certName-${index}`}>Certificate Name</Label>
                        <Input
                          id={`certName-${index}`}
                          value={cert.name}
                          onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                          placeholder="eg. AWS Certified Cloud Practitioner"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`certIssuedBy-${index}`}>Issued by</Label>
                        <Input
                          id={`certIssuedBy-${index}`}
                          value={cert.issuedBy || ''}
                          onChange={(e) => handleCertificateChange(index, 'issuedBy', e.target.value)}
                          placeholder="eg. Amazon Web Service"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`certIssuedDate-${index}`}>Issued date</Label>
                        <div className="relative">
                          <Input
                            id={`certIssuedDate-${index}`}
                            type="date"
                            value={cert.issuedDate || ''}
                            onChange={(e) => handleCertificateChange(index, 'issuedDate', e.target.value)}
                            min={getCertIssuedMinDate()}
                            max={getCertIssuedMaxDate()}
                            className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                          <CalendarIcon 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" 
                            onClick={() => {
                              const input = document.getElementById(`certIssuedDate-${index}`) as HTMLInputElement;
                              if (input) {
                                input.showPicker ? input.showPicker() : input.click();
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`certExpiryDate-${index}`}>Expiry_date</Label>
                        <div className="relative">
                          <Input
                            id={`certExpiryDate-${index}`}
                            type="date"
                            value={cert.expiryDate || ''}
                            onChange={(e) => handleCertificateChange(index, 'expiryDate', e.target.value)}
                            min={getCertExpiryMinDate()}
                            max={getCertExpiryMaxDate()}
                            className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                          <CalendarIcon 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600" 
                            onClick={() => {
                              const input = document.getElementById(`certExpiryDate-${index}`) as HTMLInputElement;
                              if (input) {
                                input.showPicker ? input.showPicker() : input.click();
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCertificate}
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              </div>

              {/* 6. Avatar Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Avatar</h2>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-48 h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDrop={handleImageDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('imageInput')?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click or Drag & Drop image here</p>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {submitting ? 'Saving...' : 'Save engineer'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

