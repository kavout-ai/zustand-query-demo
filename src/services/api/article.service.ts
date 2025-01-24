import { api } from '@/utils/api';
import { API_KEY } from '@/utils/config';
import { GetArticlesProps, GetArticleResponse, } from '@/types/article';

const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&domain=bbc`;

export const getArticles = async (params: GetArticlesProps): Promise<GetArticleResponse> => {
  const { search, page } = params;
  let newsUrl = API_URL;
  if (search) {
    newsUrl += `&q=${search}`;
  }
  if (page) {
    newsUrl += `&page=${page}`;
  }
  const { data } = await api.get<GetArticleResponse>(newsUrl);
  return data;
};
