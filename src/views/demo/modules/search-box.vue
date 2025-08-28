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

const typeOptions = [
  { label: '合约', value: 'futures' },
  { label: '现货', value: 'spot' }
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
            <NFormItemGi span="24 s:12 m:8 l:6" label="类型" path="symbol_type" class="pr-24px">
              <NSelect v-model:value="model.symbol_type" placeholder="请选择类型" :options="typeOptions" clearable />
            </NFormItemGi>
            <NFormItemGi label="交易对" span="24 m:6" class="pr-24px">
              <NInput v-model:value="model.symbol" placeholder="请输入" />
            </NFormItemGi>
            <NFormItemGi span="24 m:6" class="pr-24px">
              <NSpace class="w-full" >
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
