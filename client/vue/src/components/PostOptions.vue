<template>
  <div class="post-options">
    <Input label="Поиск по заголовку" placeholder="Введите текст..." :model-value="searchQuery"
      @update:model-value="$emit('update:searchQuery', $event)" />
    <Select label="Сортировать по" :model-value="selectedSort" @update:model-value="$emit('update:selectedSort', $event)" :options="sortOptions" />
    <Button @click="onOrderChange">
      {{ sortOrder === 'asc' ? 'По убыванию' : 'По возрастанию' }}
    </Button>
  </div>
</template>

<script setup>
import { Input, Button, Select } from '@/components/UI';

defineProps({
  searchQuery: String,
  selectedSort: String,
  sortOrder: String,
  onOrderChange: Function
});

defineEmits(['update:searchQuery', 'update:selectedSort']);

const sortOptions = [
  { value: 'id', label: 'ID' },
  { value: 'createdAt', label: 'Дата создания' },
  { value: 'updatedAt', label: 'Дата обновления' },
  { value: 'viewsCount', label: 'Просмотры' }
];
</script>

<style scoped>
.post-options {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>