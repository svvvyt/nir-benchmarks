<template>
  <div class="post-item">
    <h2 @click="handleClick">{{ title }}</h2>
    <p>{{ text }}</p>
    <img v-if="imageUrl" :src="fullImageUrl" :alt="title" class="post-image" @error="handleImageError" />
    <div class="post-meta">
      <span>Post ID: {{ id }}</span><br />
      <span>Created at: {{ new Date(createdAt).toLocaleString() }}</span><br />
      <span>Updated at: {{ new Date(updatedAt).toLocaleString() }}</span><br />
      <span>Views count: {{ viewsCount }}</span>
    </div>
    <div class="post-actions">
      <Button @click="onEdit(id)">Редактировать</Button>
      <Button @click="onDelete(id)">Удалить</Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/UI';
import { apiClient } from '@/api/client';

const props = defineProps({
  id: Number,
  title: String,
  text: String,
  imageUrl: String,
  createdAt: String,
  updatedAt: String,
  viewsCount: Number,
  onEdit: Function,
  onDelete: Function
});

const router = useRouter();

const fullImageUrl = computed(() =>
  props.imageUrl ? `${apiClient.defaults.baseURL}${props.imageUrl}` : null
);

const handleClick = () => {
  router.push(`/posts/${props.id}`);
};

const handleImageError = (e) => {
  console.error('Error loading image:', props.imageUrl);
  e.target.style.display = 'none';
};
</script>

<style scoped>
.post-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 20px;
}

.post-item h2 {
  cursor: pointer;
}

.post-meta {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.post-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.post-image {
  width: 500px;
  height: 400px;
  border-radius: 8px;
}
</style>