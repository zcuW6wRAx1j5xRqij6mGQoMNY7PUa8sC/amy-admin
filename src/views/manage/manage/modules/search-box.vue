<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  roleList: {
    type: Array as PropType<Api.SystemManage.Role[]>,
    required: true
  }
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
            <NFormItemGi label="角色">
              <NSelect v-model:value="model.role_id" :options="roleList" placeholder="请选择" clearable />
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
