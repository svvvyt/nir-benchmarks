<template>
  <button class="button" @click="onClick">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  onClick: Function
});
</script>

<style scoped>
.button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}
</style>