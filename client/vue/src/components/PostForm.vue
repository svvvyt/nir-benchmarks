<template>
  <form @submit.prevent="handleSubmit" class="post-form">
    <Input label="Заголовок" placeholder="Введите заголовок..." v-model="title" required />
    <Input label="Текст" placeholder="Введите текст..." v-model="text" required />
    <div class="file-input">
      <input type="file" @change="handleFileChange" accept="image/*" />
    </div>
    <Button type="submit">Создать пост</Button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { Input, Button } from '@/components/UI';

const props = defineProps({
  onCreate: {
    type: Function,
    required: true
  }
});

const title = ref('');
const text = ref('');
const imageUrl = ref(null);

const handleSubmit = () => {
  props.onCreate({ title: title.value, text: text.value, imageUrl: imageUrl.value });
  title.value = '';
  text.value = '';
  imageUrl.value = null;
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    imageUrl.value = e.target.files[0];
  }
};
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
}

.post-form .input {
  margin-bottom: 10px;
}

.post-form .file-input {
  margin-bottom: 10px;
}

.post-form .file-input label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.post-form .button {
  margin-top: 10px;
}
</style>