<template>
  <div class="loader">
    <div class="loader-spinner"></div>
    <div class="loader-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: String
});
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loader-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader-text {
  margin-top: 16px;
  font-size: 1.2em;
  color: #3498db;
}
</style>