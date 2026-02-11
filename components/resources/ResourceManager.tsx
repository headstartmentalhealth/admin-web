'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
  setPage,
} from '@/redux/slices/resourceSlice';
import { Resource, ResourceType } from '@/types/resource';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Edit2, Trash2, ExternalLink, Upload, Loader2, Music, Image as ImageIcon, Clock } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

interface ResourceManagerProps {
  type: ResourceType;
  title: string;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ type, title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { resources, loading, count, currentPage } = useSelector(
    (state: RootState) => state.resource
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_url: '',
    cover_image: '',
    category: '',
    age_range: '',
    topic: '',
    minutes: 0,
  });
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    dispatch(fetchResources({ page: currentPage, limit: 10, resource_type: type, q: searchQuery }));
  }, [dispatch, currentPage, type, searchQuery]);

  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        description: resource.description || '',
        content_url: resource.content_url || '',
        cover_image: resource.cover_image || '',
        category: resource.category || '',
        age_range: resource.age_range || '',
        topic: resource.topic || '',
        minutes: resource.minutes || 0,
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        content_url: '',
        cover_image: '',
        category: '',
        age_range: '',
        topic: '',
        minutes: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'content_url' | 'cover_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadLoading(true);
    const uploadData = new FormData();
    const isAudio = file.type.startsWith('audio/');
    const isImage = file.type.startsWith('image/');

    // Select endpoint based on file type
    let endpoint = '/multimedia-upload/document';
    if (isAudio) endpoint = '/multimedia-upload/audio';
    else if (isImage) endpoint = '/multimedia-upload/image';

    uploadData.append(isAudio ? 'audio' : isImage ? 'image' : 'document', file);

    try {
      const { data } = await api.post(endpoint, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = data.data.url;
      setFormData((prev) => ({ ...prev, [field]: uploadedUrl }));
      toast.success(`${field.replace('_', ' ')} uploaded successfully`);
    } catch (error: any) {
      console.error('Upload failed', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, resource_type: type };
    if (editingResource) {
      await dispatch(updateResource({ id: editingResource.id, dto: data }));
    } else {
      await dispatch(createResource(data));
    }
    handleCloseModal();
    dispatch(fetchResources({ page: currentPage, limit: 10, resource_type: type, q: searchQuery }));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      await dispatch(deleteResource(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            name="search"
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" /> Add {title}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-premium overflow-hidden">
        {loading && resources.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Cover</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Title</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Category</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Topic</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-center">Age</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-center">Mins</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      No {title.toLowerCase()} found.
                    </td>
                  </tr>
                ) : (
                  resources.map((resource) => (
                    <tr key={resource.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        {resource.cover_image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm bg-zinc-50 dark:bg-zinc-900">
                            <img src={resource.cover_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{resource.title}</div>
                        <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                          {resource.description ? resource.description.replace(/<[^>]*>/g, '') : 'No description'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                          {resource.category || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-zinc-100 dark:bg-gray-800 text-zinc-600 dark:text-gray-300">
                          {resource.topic || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-center text-zinc-600 dark:text-zinc-400 text-sm">
                        {resource.age_range || '-'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {resource.minutes || 0}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(resource)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(resource.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingResource ? `Edit ${title}` : `Add ${title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              name="title"
              type="text"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <div className="min-h-[300px] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                  skin: isDark ? 'oxide-dark' : 'oxide',
                  content_css: isDark ? 'dark' : 'default',
                }}
                value={formData.description}
                onEditorChange={(content: string) => setFormData({ ...formData, description: content })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                name="category"
                data={['Mental Health', 'Wellness', 'Motivation', 'Productivity', 'Relationships']}
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Focus Group</label>
              <Select
                name="topic"
                data={['Depressed', 'Anxious', 'Stressed', 'Trauma', 'Burnout', 'Grief', 'General']}
                value={formData.topic}
                onChange={(e: any) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range</label>
              <Select
                name="age_range"
                data={['Kids (5-12)', 'Teens (13-19)', 'Young Adults (20-30)', 'Adults (31-50)', 'Seniors (50+)', 'All Ages']}
                value={formData.age_range}
                onChange={(e: any) => setFormData({ ...formData, age_range: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Duration (Minutes)
              </label>
              <Input
                name="minutes"
                type="number"
                min="0"
                value={formData.minutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4" /> Audio Content / Resource URL
            </label>
            <div className="flex gap-2">
              <Input
                name="content_url"
                type="url"
                value={formData.content_url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, content_url: e.target.value })}
                placeholder="Enter URL or upload audio"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500"
              />
              <div className="relative">
                <input
                  type="file"
                  id="audio-upload"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'content_url')}
                  disabled={fileUploadLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('audio-upload')?.click()}
                  disabled={fileUploadLoading}
                  className="whitespace-nowrap gap-2 rounded-2xl h-full py-2.5 px-5 border-zinc-200 dark:border-gray-800 hover:bg-zinc-50 dark:hover:bg-gray-800"
                >
                  {fileUploadLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Music className="w-4 h-4" />
                  )}
                  Upload Audio
                </Button>
              </div>
            </div>
            {formData.content_url && (
              <p className="text-xs text-zinc-500 truncate px-2">
                Current Content: {formData.content_url}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Media Art / Cover Image
            </label>
            <div className="flex gap-2">
              <Input
                name="cover_image"
                type="url"
                value={formData.cover_image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="Enter image URL or upload"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500"
              />
              <div className="relative">
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'cover_image')}
                  disabled={fileUploadLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  disabled={fileUploadLoading}
                  className="whitespace-nowrap gap-2 rounded-2xl h-full py-2.5 px-5 border-zinc-200 dark:border-gray-800 hover:bg-zinc-50 dark:hover:bg-gray-800"
                >
                  {fileUploadLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  Upload Cover
                </Button>
              </div>
            </div>
            {formData.cover_image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 dark:border-gray-800 bg-zinc-50 dark:bg-gray-900/50 p-2 w-fit">
                <img
                  src={formData.cover_image}
                  alt="Cover Preview"
                  className="max-h-32 w-auto rounded-lg shadow-sm object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingResource ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceManager;
