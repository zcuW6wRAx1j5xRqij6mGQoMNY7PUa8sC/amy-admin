<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NForm, NFormItem, NModal, NSelect, NSpace } from 'naive-ui';
import { LoanRepaymentStatusUpdate } from '@/service/api/order';

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

const statusForm = ref({
  status: 'paid' as 'paid' | 'overdue' | 'cancelled' | 'written_off'
});

// 还款状态选项
const statusOptions = [
  { label: '全额还款', value: 'paid' },
  { label: '逾期未还', value: 'overdue' },
  { label: '已取消', value: 'cancelled' },
  { label: '已核销', value: 'written_off' }
];

// 监听订单变化，初始化表单
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      statusForm.value = {
        status: 'paid'
      };
    }
  },
  { immediate: true }
);

// 关闭弹窗
function closeModal() {
  emit('update:visible', false);
  statusForm.value = {
    status: 'paid'
  };
}

// 处理状态更新
async function handleSubmit() {
  if (!props.order) return;

  try {
    await LoanRepaymentStatusUpdate({
      id: props.order.id,
      status: statusForm.value.status
    });

    const statusMap = {
      paid: '全额还款',
      overdue: '逾期未还',
      cancelled: '已取消',
      written_off: '已核销'
    };

    window.$message?.success(`还款状态已更新为：${statusMap[statusForm.value.status]}`);
    closeModal();
    emit('success');
  } catch (error: any) {
    console.error('还款状态更新失败:', error);
  }
}
</script>

<template>
  <NModal
    :show="visible"
    title="更改还款状态"
    preset="dialog"
    style="width: 400px"
    @update:show="emit('update:visible', $event)"
  >
    <NForm
      :model="statusForm"
      label-placement="left"
      label-width="100px"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="还款状态" path="status">
        <NSelect
          v-model:value="statusForm.status"
          :options="statusOptions"
          placeholder="请选择还款状态"
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
