<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NCollapse, NCollapseItem, NForm, NFormItemGi, NGrid, NInput, NSelect, NSpace } from 'naive-ui';

interface SearchParams {
  order_code?: string;
  uid?: string;
  apply_status?: number;
  status?: string;
}

interface Props {
  searchParams: SearchParams;
}

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = ref<HTMLElement & { validate: () => void }>();

const model = defineModel('model', { required: true });

const applyStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '已中签', value: 1 },
  { label: '未中签', value: 2 },
  { label: '已拒绝', value: 3 }
];

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '锁定', value: 'locked' },
  { label: '已平仓', value: 'closed' }
];

const rules = {};

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
            <NFormItemGi span="24 s:12 m:8 l:6" label="申请状态" path="apply_status" class="pr-24px">
              <NSelect
                v-model:value="model.apply_status"
                placeholder="请选择申请状态"
                :options="applyStatusOptions"
                clearable
              />
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
