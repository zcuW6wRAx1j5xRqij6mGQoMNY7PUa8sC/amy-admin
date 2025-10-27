<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { EtfProductList } from '@/service/api/etf';

defineOptions({
  name: 'EtfOrderSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '全部', value: null },
  { label: '待审核', value: 0 },
  { label: '已拒绝', value: 1 },
  { label: '已通过', value: 2 },
  { label: '已结清', value: 3 }
];

const productOptions = ref<Array<{ label: string; value: number }>>([]);

// 获取产品列表
async function getProductOptions() {
  try {
    const response = await EtfProductList({ page: 1, size: 1000 });
    if (response && Array.isArray(response.rows)) {
      productOptions.value = response.rows.map(item => ({
        label: item.name || `产品${item.id}`,
        value: item.id
      }));
    }
  } catch (error) {
    console.error('获取产品列表失败:', error);
  }
}

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}

onMounted(() => {
  getProductOptions();
});
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
            <NFormItemGi span="24 s:12 m:8 l:6" label="产品" path="product_id" class="pr-24px">
              <NSelect v-model:value="model.product_id" placeholder="请选择产品" :options="productOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="备注" path="remark" class="pr-24px">
              <NInput v-model:value="model.filter['user.remark']" placeholder="请输入备注" />
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
