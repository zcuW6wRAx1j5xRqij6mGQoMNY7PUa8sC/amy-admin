<script setup lang="ts">
defineOptions({
  name: 'SpotSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '挂单中', value: 'pending' },
  { label: '成交', value: 'success' },
  { label: '失败', value: 'failed' }
];

const sideOptions = [
  { label: '买入', value: 'buy' },
  { label: '卖出', value: 'sell' }
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
            <NFormItemGi span="24 s:12 m:8 l:6" label="订单编号" path="order_code" class="pr-24px">
              <NInput v-model:value="model.order_code" placeholder="请输入订单编号" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="用户ID" path="uid" class="pr-24px">
              <NInput v-model:value="model.uid" placeholder="请输入用户ID" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="交易方向" path="side" class="pr-24px">
              <NSelect v-model:value="model.side" placeholder="请选择交易方向" :options="sideOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="交易状态" path="trade_status" class="pr-24px">
              <NSelect v-model:value="model.trade_status" placeholder="请选择交易状态" :options="statusOptions" clearable />
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
