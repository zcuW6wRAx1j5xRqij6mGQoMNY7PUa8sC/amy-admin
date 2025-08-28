<script setup lang="ts">
defineOptions({
  name: 'FuturesSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '等待', value: 'pending' },
  { label: '持仓中', value: 'open' },
  { label: '平仓中', value: 'closeing' },
  { label: '已平仓', value: 'closed' }
];

const sideOptions = [
  { label: '买入', value: 'buy' },
  { label: '卖出', value: 'sell' }
];

const marginTypeOptions = [
  { label: '逐仓', value: 'isolated' },
  { label: '全仓', value: 'crossed' }
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
            <NFormItemGi span="24 s:12 m:8 l:6" label="保证金类型" path="margin_type" class="pr-24px">
              <NSelect v-model:value="model.margin_type" placeholder="请选择保证金类型" :options="marginTypeOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="持仓状态" path="trade_status" class="pr-24px">
              <NSelect v-model:value="model.trade_status" placeholder="请选择持仓状态" :options="statusOptions" clearable />
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
