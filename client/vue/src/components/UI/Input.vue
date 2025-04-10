<template>
  <div>
    <label v-if="label" class="label">{{ label }}</label>
    <input class="textbox" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder" />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  error: String,
  modelValue: String,
  placeholder: String
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.textbox {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}
</style>