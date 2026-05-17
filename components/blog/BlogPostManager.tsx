'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/redux/slices/blogPostSlice';
import { BlogPost } from '@/types/blog';
import { fetchUsers } from '@/redux/slices/userSlice';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Select from '@/components/ui/Select';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useTheme } from 'next-themes';

const BlogPostManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, count, loading, currentPage } = useSelector((state: RootState) => state.blogPost);
  const { users } = useSelector((state: RootState) => state.user);
  const { profile } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category: '',
    is_published: false,
    author_id: '',
  });

  useEffect(() => {
    dispatch(fetchBlogPosts({ page: currentPage, limit: 10, q: searchQuery }));
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch, currentPage, searchQuery]);

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        category: post.category || '',
        is_published: post.is_published,
        author_id: post.author_id,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        cover_image: '',
        category: '',
        is_published: false,
        author_id: profile?.id || '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadLoading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const { data } = await api.post('/multimedia-upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData((prev) => ({ ...prev, cover_image: data.data.url }));
      toast.success('Cover image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setFileUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingPost) {
        await dispatch(updateBlogPost({ id: editingPost.id, dto: formData })).unwrap();
        toast.success('Blog post updated successfully');
      } else {
        await dispatch(createBlogPost(formData)).unwrap();
        toast.success('Blog post created successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await dispatch(deleteBlogPost(id)).unwrap();
        toast.success('Blog post deleted successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to delete blog post');
      }
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
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" /> Add Blog Post
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-premium overflow-hidden">
        {loading && posts.length === 0 ? (
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
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Author</th>
                  <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        {post.cover_image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</div>
                        <div className="text-xs text-zinc-500 truncate max-w-[200px]">{post.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-gray-800 dark:text-white font-medium">
                          {post.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4">
                        {post.is_published ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                            <XCircle className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {post.author?.name || 'Unknown'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(post)}>
                          <Edit2 className="w-4 h-4 text-gray-800 dark:text-white" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-gray-800 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-gray-100">
              {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="The Future of Wellness"
                  required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input
                  type='text'
                  name="slug"
                  value={formData.slug}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="future-of-wellness"
                  required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  name="category"
                  data={['Wellness', 'Mental Health', 'Productivity', 'Relationships', 'Lifestyle', 'General']}
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  name="is_published"
                  data={[
                    { label: 'Draft', value: 'false' },
                    { label: 'Published', value: 'true' },
                  ]}
                  value={formData.is_published.toString()}
                  onChange={(e: any) => setFormData({ ...formData, is_published: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
                />
              </div>
            </div>


            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt (Short Summary)</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="A brief summary of your blog post..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100 resize-none outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content *</label>
              <div className="rounded-2xl border border-zinc-200 dark:border-gray-800 overflow-hidden">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={formData.content}
                  onEditorChange={(content: string) => setFormData({ ...formData, content })}
                  init={{
                    height: 400,
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
                    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: theme === 'dark' ? 'dark' : 'default',
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Cover Image
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type='url'
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-zinc-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-zinc-900 dark:text-gray-100"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="cover_image_upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={fileUploadLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[46px] gap-2 rounded-2xl border-dashed border-zinc-300 dark:border-gray-700 hover:bg-zinc-50 dark:hover:bg-gray-800"
                    onClick={() => document.getElementById('cover_image_upload')?.click()}
                    disabled={fileUploadLoading}
                  >
                    {fileUploadLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
              {formData.cover_image && (
                <div className="mt-2 relative w-full h-40 rounded-2xl overflow-hidden border border-zinc-100 dark:border-gray-800 bg-zinc-50 dark:bg-gray-900">
                  <img src={formData.cover_image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-gray-800">
              <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-2xl px-8">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingPost ? 'Save Changes' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPostManager;
