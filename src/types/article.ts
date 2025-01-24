export interface GetArticlesProps {
  search?: string;
  page?: string;
}

export interface GetArticleResponse {
  status: string;
  totalResults: number;
  results: Article[];
  nextPage?: string;
}

export interface Article {
  title: string;
  link: string;
  keywords: string[];
  creator: string[];
  video_url?: string;
  description: string;
  content: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  country: string[];
  category: string[];
}
