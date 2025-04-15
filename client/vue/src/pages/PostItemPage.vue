<template>
  <div class="post-item-container">
    <Loader v-if="isLoading" text="post-item" />
    <template v-else>
      <PostItem v-if="postItem" v-bind="postItem" :on-edit="() => isEditing = true" :on-delete="handleDeletePost" />
      <Modal v-if="isEditing && postItem" :post="postItem" :on-update="handleUpdatePost"
        :on-close="() => isEditing = false" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PostItem } from '@/components';
import { Loader, Modal } from '@/components/UI';
import { apiClient } from '@/api/client';
import performanceLogger from '@/utils/performanceLogger';

const route = useRoute();
const postItem = ref(null);
const isLoading = ref(true);
const isEditing = ref(false);

onMounted(async () => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    const response = await apiClient.get(`/posts/${route.params.id}`);
    postItem.value = response.data;
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  } finally {
    isLoading.value = false;
  }
  setInterval(() => performanceLogger.getMemoryUsage(), 5000);
});

const handleUpdatePost = async (formData) => {
  const stop = performanceLogger.start('APIResponseTime');
  try {
    const response = await apiClient.patch(`/posts/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    postItem.value = response.data;
    isEditing.value = false;
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
    stop();
  } catch (error) {
    stop();
    performanceLogger.logError('APIResponseTime', error);
  }
};
</script>

<style scoped>
.post-item-container {
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;
}
</style>