<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Редактировать пост</h2>
      <form @submit.prevent="handleSubmit">
        <Input label="Заголовок" placeholder="Введите заголовок..." v-model="title" required />
        <Input label="Текст" placeholder="Введите текст..." v-model="text" required />
        <div class="file-input">
          <input type="file" @change="handleFileChange" accept="image/*" />
          <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
        </div>
        <div>
          <Button type="submit">Сохранить</Button>
          <Button type="button" @click="onClose">Отмена</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Button, Input } from '@/components/UI';

const props = defineProps({
  post: Object,
  onUpdate: Function,
  onClose: Function
});

const title = ref('');
const text = ref('');
const imageFile = ref(null);
const previewUrl = ref(null);

watch(() => props.post, (newPost) => {
  if (newPost) {
    title.value = newPost.title;
    text.value = newPost.text;
    previewUrl.value = newPost.imageUrl || null;
    imageFile.value = null;
  }
}, { immediate: true });

const handleSubmit = () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('text', text.value);
  if (imageFile.value) formData.append('imageUrl', imageFile.value);

  props.onUpdate(formData);
  props.onClose();
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.file-input {
  margin-top: 10px;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
}
</style>