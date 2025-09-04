<script setup lang="ts">
defineOptions({
  name: 'LoanOrderSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '全部', value: null },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已取消', value: 'cancelled' },
  { label: '已完成', value: 'completed' }
];

const repaymentStatusOptions = [
  { label: '全部', value: null },
  { label: '未还款', value: 'unpaid' },
  { label: '部分还款', value: 'partial' },
  { label: '已还清', value: 'paid' },
  { label: '逾期', value: 'overdue' },
  { label: '已取消', value: 'cancelled' },
  { label: '已核销', value: 'written_off' }
];

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="control-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8 l:6" label="用户ID" path="uid" class="pr-24px">
              <NInput v-model:value="model.uid" placeholder="请输入用户ID" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="订单状态" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择订单状态" :options="statusOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="还款状态" path="repayment_status" class="pr-24px">
              <NSelect v-model:value="model.repayment_status" placeholder="请选择还款状态" :options="repaymentStatusOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 m:6" class="pr-24px">
              <NSpace class="w-full">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  重置
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  搜索
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
