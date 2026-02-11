import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { BlogPost, BlogPostResponse } from '@/types/blog';

interface BlogPostState {
  posts: BlogPost[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: BlogPostState = {
  posts: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

export const fetchBlogPosts = createAsyncThunk(
  'blogPosts/fetch',
  async (
    {
      page,
      limit,
      q,
      category,
      is_published,
    }: {
      page?: number;
      limit?: number;
      q?: string;
      category?: string;
      is_published?: boolean;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};
    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (category !== undefined) params['category'] = category;
    if (is_published !== undefined) params['is_published'] = is_published;

    try {
      const { data } = await api.get<BlogPostResponse>('/blog-posts', { params });
      return {
        posts: Array.isArray(data.data) ? data.data : [],
        count: data.count || 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog posts');
    }
  }
);

export const createBlogPost = createAsyncThunk(
  'blogPosts/create',
  async (dto: Partial<BlogPost>, { rejectWithValue }) => {
    try {
      const { data } = await api.post<BlogPostResponse>('/blog-posts', dto);
      return data.data as BlogPost;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog post');
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blogPosts/update',
  async ({ id, dto }: { id: string; dto: Partial<BlogPost> }, { rejectWithValue }) => {
    try {
      const { data } = await api.put<BlogPostResponse>(`/blog-posts/${id}`, dto);
      return data.data as BlogPost;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog post');
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blogPosts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/blog-posts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog post');
    }
  }
);

const blogPostSlice = createSlice({
  name: 'blogPosts',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearBlogPostError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.count = action.payload.count;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.count += 1;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        state.count -= 1;
      });
  },
});

export const { setPage, clearBlogPostError } = blogPostSlice.actions;
export default blogPostSlice.reducer;
