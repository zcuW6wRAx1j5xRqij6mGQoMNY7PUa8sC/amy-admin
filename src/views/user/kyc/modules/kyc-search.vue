<script setup lang="ts">
import {
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NForm,
  NFormItemGi,
  NGrid,
  NGridItem,
  NInput,
  NSelect,
  NSpace
} from 'naive-ui';
import { icon } from '@iconify/vue';
import { $t } from '@/locales';

defineOptions({
  name: 'KycSearch'
});

interface Props {
  model: {
    filter?: string;
    status?: string;
  };
}

interface Emits {
  (e: 'update:model', value: Props['model']): void;
  (e: 'reset'): void;
  (e: 'search'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

// 审核状态选项
const statusOptions = [
  { label: '待审核', value: '0' },
  { label: '审核通过', value: '1' },
  { label: '审核不通过', value: '2' }
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
            <NFormItemGi span="24 s:12 m:8 l:6" label="审核状态" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择审核状态" :options="statusOptions" clearable />
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
