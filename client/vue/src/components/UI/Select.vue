<template>
  <div class="select">
    <label v-if="label" class="label">{{ label }}</label>
    <select class="dropdown" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  error: String,
  modelValue: [String, Number]
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.select {
  margin-bottom: 16px;
}

.dropdown {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>