import { useState, useEffect } from 'react';
import { PostList, PostOptions, PostForm } from '../../components';
import { Loader, Modal } from '../../components/UI';
import { PostItemProps, SortField, SortOrder } from '../../types';
import apiClient from '../../api/client';
import { usePosts } from '../../hooks/usePosts';
import { useApiCache } from '../../hooks/useApiCache';
import performanceLogger from '../../utils/performanceLogger';
import './PostListPage.css';

const PostListPage = () => {
  const [postList, setPostList] = useState<PostItemProps[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<PostItemProps | null>(null);
  const { fetchData, isLoading, invalidateCache } = useApiCache();

  useEffect(() => {
    fetchPosts();
  }, [fetchData]);

  const fetchPosts = async () => {
    try {
      const data = await fetchData<PostItemProps[]>('/posts');
      setPostList(data);
    } catch (error) {
      performanceLogger.logError(
        'APIResponseTime',
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  };

  const handleEditPost = (id: number) => {
    const postToEdit = postList.find((post) => post.id === id);
    if (postToEdit) {
      setEditingPost(postToEdit);
    }
  };

  const handleUpdatePost = async (formData: FormData) => {
    try {
      const response = await apiClient.patch(
        `/posts/${editingPost?.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setPostList((prev) =>
        prev.map((post) => (post.id === editingPost?.id ? response.data : post))
      );
      invalidateCache('/posts'); // Инвалидация кэша
      setEditingPost(null);
    } catch (error) {
      performanceLogger.logError(
        'APIResponseTime',
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  };

  const handleCreatePost = async (post: {
    title: string;
    text: string;
    imageUrl?: File | null;
  }) => {
    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('text', post.text);
      if (post.imageUrl) {
        formData.append('imageUrl', post.imageUrl);
      }
      const response = await apiClient.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPostList((prev) => [response.data, ...prev]);
      invalidateCache('/posts'); // Инвалидация кэша
    } catch (error) {
      performanceLogger.logError(
        'APIResponseTime',
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await apiClient.delete(`/posts/${id}`);
      setPostList((prev) => prev.filter((post) => post.id !== id));
      invalidateCache('/posts'); // Инвалидация кэша
    } catch (error) {
      performanceLogger.logError(
        'APIResponseTime',
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  };

  const sortedAndSearchedPosts = usePosts(
    postList,
    selectedSort,
    sortOrder,
    searchQuery
  );

  const stopReRender = performanceLogger.start('ReRenderPerformance');
  stopReRender();

  return (
    <div className='post-list-container'>
      {isLoading ? (
        <Loader text='post-list' />
      ) : (
        <>
          <PostForm onCreate={handleCreatePost} />
          <PostOptions
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            selectedSort={selectedSort}
            onSortChange={(e) => setSelectedSort(e.target.value as SortField)}
            sortOrder={sortOrder}
            onOrderChange={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          />
          <PostList
            data={sortedAndSearchedPosts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
          {editingPost && (
            <Modal
              post={editingPost}
              onUpdate={handleUpdatePost}
              onClose={() => setEditingPost(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostListPage;
