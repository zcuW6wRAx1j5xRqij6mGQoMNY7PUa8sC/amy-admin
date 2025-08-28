<script setup lang="jsx">
import { WebsiteBannerList } from '@/service/api/website';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  mobilePagination,
} = useTable({
  apiFn: WebsiteBannerList,
  apiParams: {
    page: 1,
    page_size: 20,
  },
  columns: () => []
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

function edit(id) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="banner列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" no-add @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
        </NCard>
    </div>
</template>

<style scoped></style>
