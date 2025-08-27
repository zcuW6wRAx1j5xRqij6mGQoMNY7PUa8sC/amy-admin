<script setup lang="ts">
const categoryList = [
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 }
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
            <NFormItemGi label="菜单名称">
              <NInput v-model:value="model.name" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi label="类型">
              <NSelect v-model:value="model.category" :options="categoryList" placeholder="请选择" clearable />
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
