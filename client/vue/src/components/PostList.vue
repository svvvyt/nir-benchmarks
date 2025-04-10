<template>
  <div>
    <PostItem v-for="item in data" :key="item.id" v-bind="item" :on-edit="onEdit" :on-delete="onDelete" />
  </div>
</template>

<script setup>
import { PostItem } from '@/components';

defineProps({
  data: {
    type: Array,
    required: true
  },
  onEdit: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
});
</script>

<style scoped>
</style>