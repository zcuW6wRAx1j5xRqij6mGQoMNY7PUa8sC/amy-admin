<script setup lang="ts">
import { NCollapse, NCollapseItem, NGrid, NGridItem, NInput, NSelect, NSpace, NButton, NCard, NForm, NFormItemGi } from 'naive-ui';
import { $t } from '@/locales';
import { useForm } from 'naive-ui';
import { ref } from 'vue';
import { icon } from '@iconify/vue';

defineOptions({
  name: 'SearchBox'
});

interface Props {
  model: {
    symbol_id?: number | null;
    status?: number | null;
    is_recommend?: number | null;
  };
}

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

// 状态选项
const statusOptions = [
  { label: '全部', value: null },
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 }
];

// 推荐选项
const recommendOptions = [
  { label: '全部', value: null },
  { label: '是', value: 1 },
  { label: '否', value: 0 }
];

const formRef = ref(null);

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
            <NFormItemGi span="24 s:12 m:8 l:6" label="交易对ID" path="symbol_id" class="pr-24px">
              <NInput v-model:value="model.symbol_id" placeholder="请输入交易对ID" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="状态" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择状态" :options="statusOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="推荐状态" path="is_recommend" class="pr-24px">
              <NSelect v-model:value="model.is_recommend" placeholder="请选择推荐状态" :options="recommendOptions" clearable />
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
