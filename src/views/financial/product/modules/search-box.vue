<script setup lang="ts">
const statusList = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

const categoryList = [
  { label: '活期', value: 'flexible' },
  { label: '定期', value: 'fixed' }
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
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="search">
        <NForm :model="model" label-placement="left" :label-width="120">
          <NGrid :cols="4" :x-gap="16">
            <NFormItemGi label="名称">
              <NInput v-model:value="model.name" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi label="分类">
              <NSelect v-model:value="model.category" :options="categoryList" placeholder="请选择" clearable />
            </NFormItemGi>
            <NFormItemGi label="状态">
              <NSelect v-model:value="model.status" :options="statusList" placeholder="请选择" clearable />
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
