<template>
  <div>
    <PostItem v-for="item in data" :key="item.id" v-bind="item" :on-edit="onEdit" :on-delete="onDelete" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { PostItem } from '@/components';
import performanceLogger from '@/utils/performanceLogger';

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

onMounted(() => {
  performanceLogger.measureFPS(() => { });
});
</script>

<style scoped></style>