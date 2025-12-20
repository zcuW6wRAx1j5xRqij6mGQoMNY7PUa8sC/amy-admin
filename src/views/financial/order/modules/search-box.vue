<script setup lang="ts">
import { watch } from 'vue';
import dayjs from 'dayjs';

const orderValue = 'order_'
const isSuccess = 'approved'
const statusList = [
  { label: '待审核', value: 'pending' },
  // { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: `待处理`, value: `${orderValue}pending` },
  { label: `进行中`, value: `${orderValue}processing` },
  { label: `已结算`, value: `${orderValue}settled` },
  { label: `订单已拒绝`, value: `${orderValue}rejected` }
];

defineOptions({
  name: 'SearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}

const changeStatus = (val: string) => {
  if (!val) return
  const isOrder = val.indexOf(orderValue) !== -1
  const name = val.replace(orderValue, '')
  model.value.audit_status = isOrder ? isSuccess : name
  model.value.status = isOrder ? name : null
}

watch(() => model.value.audit_status, (val)=>{
  if (!val) model.value.currentStatus = null
})

</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="search">
        <NForm :model="model" label-placement="left" :label-width="120">
          <NGrid :cols="4" :x-gap="16">
            <NFormItemGi label="用户ID">
              <NInput v-model:value="model.uid" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi label="用户Email">
              <NInput v-model:value="model.email" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi label="用户手机号">
              <NInput v-model:value="model.phone" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi label="状态">
              <NSelect v-model:value="model.currentStatus" @change="changeStatus" :options="statusList"
                placeholder="请选择" clearable />
            </NFormItemGi>
            <NFormItemGi>
              <NSpace class="w-full" justify="end">
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
