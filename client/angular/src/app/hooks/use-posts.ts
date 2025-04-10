// /client/src/app/hooks/use-posts.ts
import { PostItemProps, SortField, SortOrder } from '../types/index';

export function usePosts(
  posts: PostItemProps[],
  sortField: SortField,
  sortOrder: SortOrder,
  searchQuery: string
): PostItemProps[] {
  let filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortField) {
    filteredPosts = [...filteredPosts].sort((a, b) => {
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'id' || sortField === 'viewsCount') {
        const result =
          sortOrder === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        return result;
      }
      return 0;
    });
  }

  return filteredPosts;
}
