<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NInputNumber, NModal, NSelect, NSpace } from 'naive-ui';
import { LoanRepayment } from '@/service/api/order';

interface Props {
  visible: boolean;
  order: any;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const repaymentForm = ref({
  amount: 0
});

// 监听订单变化，初始化表单
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      repaymentForm.value = {
        amount: newOrder.due_amount || 0
      };
    }
  },
  { immediate: true }
);

// 关闭弹窗
function closeModal() {
  emit('update:visible', false);
  repaymentForm.value = {
    amount: 0
  };
}

// 处理还款
async function handleSubmit() {
  if (!props.order) return;

  try {
    await LoanRepayment({
      id: props.order.id,
      amount: repaymentForm.value.amount
    });

    window.$message?.success(`还款成功，金额：${repaymentForm.value.amount}`);
    closeModal();
    emit('success');
  } catch (error: any) {
    console.error('还款失败:', error);
  }
}
</script>

<template>
  <NModal
    :show="visible"
    title="还款"
    preset="dialog"
    style="width: 400px"
    @update:show="emit('update:visible', $event)"
  >
    <NForm
      :model="repaymentForm"
      label-placement="left"
      label-width="100px"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="还款金额" path="amount">
        <NInputNumber
          v-model:value="repaymentForm.amount"
          :min="0"
          :max="order?.due_amount || 0"
          placeholder="请输入还款金额"
          style="width: 100%"
        />
      </NFormItem>
    </NForm>
    <template #action>
      <NSpace>
        <NButton @click="closeModal">取消</NButton>
        <NButton type="primary" @click="handleSubmit">
          确定
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>
