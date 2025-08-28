<script setup lang="ts">
defineOptions({
  name: 'SearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '等待认购', value: 'wait_subscription' },
  { label: '待处理', value: 'pending' },
  { label: '开放', value: 'open' },
  { label: '锁定', value: 'locked' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已平仓', value: 'closed' }
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
              <NInput v-model:value="model.order_code" placeholder="请输入订单编号" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="用户ID" path="uid" class="pr-24px">
              <NInput v-model:value="model.uid" placeholder="请输入用户ID" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="状态" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择状态" :options="statusOptions" clearable />
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
