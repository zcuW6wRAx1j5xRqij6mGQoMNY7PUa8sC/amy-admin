<script setup lang="tsx">
import { NCollapse, NCollapseItem, NGrid, NGridItem, NInput, NSelect, NSpace, NButton } from 'naive-ui';
import { $t } from '@/locales';

interface Props {
  model: {
    symbol_id?: number | null;
    status?: number | null;
  };
}

interface Emits {
  (e: 'update:model', value: Props['model']): void;
  (e: 'search'): void;
  (e: 'reset'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const model = defineModel<Props['model']>('model', { default: () => ({ symbol_id: null, status: null }) });

// 状态选项
const statusOptions = [
  { label: '全部', value: null },
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 }
];

function handleSearch() {
  emit('search');
}

function handleReset() {
  model.value = { symbol_id: null, status: null };
  emit('reset');
}
</script>

<template>
  <NCollapse>
    <NCollapseItem title="搜索条件" name="search">
      <NGrid responsive="screen" item-responsive>
        <NGridItem span="24 400:12 600:8 800:6">
          <NInput
            v-model:value="model.symbol_id"
            placeholder="搜索交易对ID"
            clearable
            @keyup.enter="handleSearch"
          />
        </NGridItem>
        <NGridItem span="24 400:12 600:8 800:6">
          <NSelect
            v-model:value="model.status"
            :options="statusOptions"
            placeholder="选择状态"
            clearable
          />
        </NGridItem>
        <NGridItem span="24 400:12 600:8 800:6">
          <NSpace>
            <NButton type="primary" @click="handleSearch">
              {{ $t('common.search') }}
            </NButton>
            <NButton @click="handleReset">
              {{ $t('common.reset') }}
            </NButton>
          </NSpace>
        </NGridItem>
      </NGrid>
    </NCollapseItem>
  </NCollapse>
</template>

<style scoped></style>
