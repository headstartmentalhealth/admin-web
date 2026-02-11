export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  business_id: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
  };
}

export interface BlogPostResponse {
  statusCode: number;
  message: string;
  data: BlogPost[] | BlogPost;
  count?: number;
}
