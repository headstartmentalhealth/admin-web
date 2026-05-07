export type ResourceType = 'AFFIRMATIVE' | 'LIBRARY' | 'PODCAST';

export interface Resource {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  resource_type: ResourceType;
  content_url: string | null;
  cover_image: string | null;
  category: string | null;
  age_range: string | null;
  topic: string | null;
  minutes: number | null;
  business_id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface ResourceResponse {
  statusCode: number;
  message: string;
  data: Resource[] | Resource;
  count?: number;
}
