<script setup lang="ts">
import { computed, provide } from 'vue';

const props = defineProps({
  errorObj: {
    type: Object,
    default: () => ({}),
  },
  allRequired: {
    type: Boolean,
    default: false,
  },
})
const parentInfo = computed(() => {
  return {
    errorObj: props.errorObj,
    allRequired: props.allRequired,
  }
})
provide('parentInfo', parentInfo)
</script>

<template>
  <NForm class="my-form-box">
    <template #default>
      <slot />
    </template>
  </NForm>
</template>

<style lang="scss" scoped></style>
