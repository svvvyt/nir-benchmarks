import { computed } from 'vue';

export function usePosts(posts, sortField, sortOrder, searchQuery) {
  const sortedAndSearchedPosts = computed(() => {
    let filteredPosts = posts.value.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    if (sortField.value) {
      filteredPosts.sort((a, b) => {
        if (a[sortField.value] < b[sortField.value])
          return sortOrder.value === 'asc' ? -1 : 1;
        if (a[sortField.value] > b[sortField.value])
          return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredPosts;
  });

  return sortedAndSearchedPosts;
}
