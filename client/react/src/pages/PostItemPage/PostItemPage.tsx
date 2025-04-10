import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { PostItem } from '../../components';
import { Loader, Modal } from '../../components/UI';

import { PostItemProps } from '../../types';

import apiClient from '../../api/client';

import { useApiCache } from '../../hooks/useApiCache';

import performanceLogger from '../../utils/performanceLogger';

import './PostItemPage.css';

const PostItemPage = () => {
  const [postItem, setPostItem] = useState<PostItemProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const { fetchData, isLoading, invalidateCache } = useApiCache();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchData]);

  const fetchPost = async () => {
    try {
      const data = await fetchData<PostItemProps>(`/posts/${id}`);
      setPostItem(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdatePost = async (formData: FormData) => {
    try {
      const response = await apiClient.patch(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPostItem(response.data);
      invalidateCache(`/posts/${id}`); // Инвалидация кэша
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await apiClient.delete(`/posts/${id}`);
      invalidateCache(`/posts/${id}`); // Инвалидация кэша
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className='post-item-container'>
      {isLoading ? (
        <Loader text='post-item' />
      ) : (
        <>
          {postItem && (
            <PostItem
              {...postItem}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePost}
            />
          )}
          {isEditing && postItem && (
            <Modal
              post={postItem}
              onUpdate={handleUpdatePost}
              onClose={() => setIsEditing(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostItemPage;
