<script setup lang="tsx">
import { ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetProductList } from '@/service/api/financial';
import { setBaseUrl } from '@/utils/utils';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetProductList,
  apiParams: {
    status: null,
    name: '',
    category: ''
  },
  columns: () => [
    {
      key: 'logo',
      title: 'Logo',
      align: 'center',
      width: 100,
      render: row => (
        <NImage width={60} src={setBaseUrl(row.logo)} previewSrc={setBaseUrl(row.logo)} objectFit="cover" />
      )
    },
    {
      key: 'name',
      title: '名称',
      align: 'center'
    },
    {
      key: 'category',
      title: '分类',
      align: 'center',
      render: row => {
        const type = row.category === 'flexible' ? 'success' : 'warning';
        const text = row.category === 'flexible' ? '活期' : '定期';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'min_amount',
      title: '最小金额',
      align: 'center'
    },
    {
      key: 'max_amount',
      title: '最大金额',
      align: 'center'
    },
    {
      key: 'min_daily_rate',
      title: '最小日收益率',
      align: 'center',
      render: row => `${row.min_daily_rate}%`
    },
    {
      key: 'max_daily_rate',
      title: '最大日收益率',
      align: 'center',
      render: row => `${row.max_daily_rate}%`
    },
    {
      key: 'penalty_rate',
      title: '赎回手续费',
      align: 'center',
      render: row => `${row.penalty_rate}%`
    },
    {
      key: 'sort',
      title: '排序',
      align: 'center'
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: row => {
        const type = row.status === 0 ? 'error' : 'success';
        const text = row.status === 0 ? '关闭' : '开启';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 80,
      render: row => (
        <NButton text type="primary" onClick={() => handleEdit(row.id)}>
          编辑
        </NButton>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" /> -->
    <NCard title="理财产品管理" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <NSpace>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData" @add="handleAdd" />
        </NSpace>
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1200"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>

    <OperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getData"
    />
  </div>
</template>

<style scoped></style>
