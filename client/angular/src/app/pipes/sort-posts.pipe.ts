import { Pipe, PipeTransform } from '@angular/core';
import { PostItemProps, SortField, SortOrder } from '../types/index';

@Pipe({
  name: 'sortPosts',
  pure: true,
})
export class SortPostsPipe implements PipeTransform {
  transform(
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
          return sortOrder === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
        return 0;
      });
    }

    return filteredPosts;
  }
}
