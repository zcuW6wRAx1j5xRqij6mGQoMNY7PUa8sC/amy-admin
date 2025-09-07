<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';

const statusList = [
  { label: '进行中', value: 'pending' },
  { label: '已结算', value: 'settled' }
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
