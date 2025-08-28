<script setup lang="tsx">
import { NButton, NCollapse, NCollapseItem, NGrid, NGridItem, NInput, NSelect, NSpace } from 'naive-ui';
import { $t } from '@/locales';

interface Props {
  model: {
    filter?: string;
    status?: string;
  };
}

interface Emits {
  (e: 'update:model', value: Props['model']): void;
  (e: 'search'): void;
  (e: 'reset'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const model = defineModel<Props['model']>('model', { default: () => ({ filter: '', status: '' }) });

// 审核状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: '0' },
  { label: '审核通过', value: '1' },
  { label: '审核不通过', value: '2' }
];

function handleSearch() {
  emit('search');
}

function handleReset() {
  model.value = { filter: '', status: '' };
  emit('reset');
}
</script>

<template>
  <NCollapse>
    <NCollapseItem title="搜索条件" name="search">
      <NGrid responsive="screen" item-responsive>
        <NGridItem span="24 400:12 600:8 800:6">
          <NInput
            v-model:value="model.filter"
            placeholder="搜索用户邮箱、姓名、证件号码"
            clearable
            @keyup.enter="handleSearch"
          />
        </NGridItem>
        <NGridItem span="24 400:12 600:8 800:6">
          <NSelect
            v-model:value="model.status"
            :options="statusOptions"
            placeholder="选择审核状态"
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
