<template>
  <div class="post-list-container">
    <Loader v-if="isLoading" text="post-list" />
    <template v-else>
      <PostForm :on-create="handleCreatePost" />
      <PostOptions v-model:search-query="searchQuery" v-model:selected-sort="selectedSort" :sort-order="sortOrder"
        @order-change="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" />
      <PostList :data="sortedAndSearchedPosts" :on-edit="handleEditPost" :on-delete="handleDeletePost" />
      <Modal v-if="editingPost" :post="editingPost" :on-update="handleUpdatePost" :on-close="() => editingPost = null" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PostList, PostOptions, PostForm } from '@/components';
import { Loader, Modal } from '@/components/UI';
import { apiClient } from '@/api/client';
import { usePosts } from '@/hooks/usePosts';

const postList = ref([]);
const isLoading = ref(true);
const selectedSort = ref('id');
const sortOrder = ref('asc');
const searchQuery = ref('');
const editingPost = ref(null);

onMounted(() => fetchPosts());

const fetchPosts = async () => {
  try {
    const response = await apiClient.get('/posts');
    postList.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleEditPost = (id) => {
  const postToEdit = postList.value.find(post => post.id === id);
  if (postToEdit) editingPost.value = postToEdit;
};

const handleUpdatePost = async (formData) => {
  try {
    const postId = editingPost.value.id;
    const response = await apiClient.patch(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    postList.value = postList.value.map(post =>
      post.id === postId ? response.data : post
    );
    editingPost.value = null;
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

const handleCreatePost = async (post) => {
  try {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('text', post.text);
    if (post.imageUrl) formData.append('imageUrl', post.imageUrl);

    const response = await apiClient.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    postList.value = [response.data, ...postList.value];
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

const handleDeletePost = async (id) => {
  try {
    await apiClient.delete(`/posts/${id}`);
    postList.value = postList.value.filter(post => post.id !== id);
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const sortedAndSearchedPosts = usePosts(postList, selectedSort, sortOrder, searchQuery);
</script>

<style scoped>
.post-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>