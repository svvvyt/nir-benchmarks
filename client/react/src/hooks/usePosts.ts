import { useMemo } from 'react';
import { PostItemProps, SortField, SortOrder } from '../types';

export const usePosts = (
  posts: PostItemProps[],
  sortField: SortField,
  sortOrder: SortOrder,
  searchQuery: string
) => {
  const sortedAndSearchedPosts = useMemo(() => {
    let filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortField) {
      filteredPosts.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredPosts;
  }, [searchQuery, sortField, sortOrder, posts]);

  return sortedAndSearchedPosts;
};
