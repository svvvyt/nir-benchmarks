<template>
  <div class="post-list-container">
    <Loader v-if="isLoading" text="post-list" />
    <template v-else>
      <PostForm :on-create="handleCreatePost" />
      <PostOptions v-model:search-query="searchQuery" v-model:selected-sort="selectedSort" :sort-order="sortOrder"
        @order-change="handleOrderChange" />
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
import performanceLogger from '@/utils/performanceLogger';

const postList = ref([]);
const isLoading = ref(true);
const selectedSort = ref('id');
const sortOrder = ref('asc');
const searchQuery = ref('');
const editingPost = ref(null);

onMounted(() => {
  fetchPosts();
  performanceLogger.measureFPS(() => { }); // Измерение FPS при скроллинге
  setInterval(() => performanceLogger.getMemoryUsage(), 5000);
});

const fetchPosts = async () => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    const response = await apiClient.get('/posts');
    postList.value = response.data;
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  } finally {
    isLoading.value = false;
  }
};

const handleEditPost = (id) => {
  const stop = performanceLogger.start('EventHandlingLatency');
  const postToEdit = postList.value.find(post => post.id === id);
  if (postToEdit) editingPost.value = postToEdit;
  stop();
};

const handleUpdatePost = async (formData) => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    const postId = editingPost.value.id;
    const response = await apiClient.patch(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    postList.value = postList.value.map(post =>
      post.id === postId ? response.data : post
    );
    editingPost.value = null;
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  }
};

const handleCreatePost = async (post) => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('text', post.text);
    if (post.imageUrl) formData.append('imageUrl', post.imageUrl);

    const response = await apiClient.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    postList.value = [response.data, ...postList.value];
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  }
};

const handleDeletePost = async (id) => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    await apiClient.delete(`/posts/${id}`);
    postList.value = postList.value.filter(post => post.id !== id);
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  }
};

const handleOrderChange = () => {
  const stop = performanceLogger.start('ReRenderPerformance');
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  stop();
};

const sortedAndSearchedPosts = usePosts(postList, selectedSort, sortOrder, searchQuery);
</script>

<style scoped>
.post-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>