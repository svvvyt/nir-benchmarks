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

const route = useRoute();
const postItem = ref(null);
const isLoading = ref(true);
const isEditing = ref(false);

onMounted(async () => {
  try {
    const response = await apiClient.get(`/posts/${route.params.id}`);
    postItem.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
});

const handleUpdatePost = async (formData) => {
  try {
    const response = await apiClient.patch(`/posts/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    postItem.value = response.data;
    isEditing.value = false;
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

const handleDeletePost = async (id) => {
  try {
    await apiClient.delete(`/posts/${id}`);
  } catch (error) {
    console.error('Error deleting post:', error);
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