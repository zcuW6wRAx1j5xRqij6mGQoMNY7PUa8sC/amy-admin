<script setup lang="ts">
import { ref } from 'vue';
const props = withDefaults(
  defineProps<{
    confirmText?: string;
    cancelText?: string;
    selfFooter?: boolean;
    width?: string | number;
    loading?: boolean;
    disabled?: boolean;
    handleConfirm?: () => void;
  }>(),
  {
    confirmText: '确定',
    cancelText: '取消',
    selfFooter: false,
    width: '472px',
    loading: false,
    disabled: false,
    handleConfirm: () => {}
  }
);
const visible = defineModel<boolean>('visible', {
  default: true
});
const emit = defineEmits(['handleCancel', 'handleConfirm']);
// 取消函数
const handleCancel = () => {
  visible.value = false;
  emit('handleCancel');
};
const loading = ref(false);
// 确认函数
const handleConfirm = async () => {
  if (props.disabled) {
    return;
  }
  if (loading.value) return;
  if (props.handleConfirm) {
    loading.value = true;
    Promise.resolve(props.handleConfirm())
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <NModal
    v-model:show="visible"
    v-bind="$attrs"
    preset="dialog"
    :style="{ width: width }"
    :before-close="handleCancel"
    :close-on-esc="false"
    :mask-closable="false"
  >
    <slot />
    <template #action>
      <span v-if="!selfFooter" class="dialog-footer">
        <NButton :loading="loading" @click="handleCancel">{{ cancelText }}</NButton>
        <NButton type="primary" class="ml-2" :loading="loading" :disabled="disabled" @click="handleConfirm">
          {{ confirmText }}
        </NButton>
      </span>
      <slot name="footer" />
    </template>
  </NModal>
</template>

<style scope></style>
