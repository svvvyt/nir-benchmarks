import { Pipe, PipeTransform } from '@angular/core';
import { PostItemProps, SortField, SortOrder } from '../types/index';
import { PerformanceLoggerService } from '../services/performance-logger.service';

@Pipe({
  name: 'sortPosts',
  pure: true,
})
export class SortPostsPipe implements PipeTransform {
  constructor(private performanceLogger: PerformanceLoggerService) {}

  transform(
    posts: PostItemProps[],
    sortField: SortField,
    sortOrder: SortOrder,
    searchQuery: string
  ): PostItemProps[] {
    const stop = this.performanceLogger.start('ReRenderPerformance');

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
        if (sortField === 'viewsCount') {
          return sortOrder === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
        return 0;
      });
    }

    stop();
    return filteredPosts;
  }
}
