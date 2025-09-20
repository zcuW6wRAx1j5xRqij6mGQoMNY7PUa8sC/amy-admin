<script setup lang="tsx">
import { NButton, NImage, NPopconfirm, NTag, NText } from 'naive-ui';
import { CryptoDelSymbol, CryptoSymbolList } from '@/service/api/crypto';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

// 表格相关
const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: CryptoSymbolList,
  apiParams: {
    page: 1,
    page_size: 20,
    name: '',
    symbol: '',
    status: null
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'coin_id', title: '货币ID', align: 'center', width: 100 },
    {
      key: 'logo',
      title: 'Logo',
      align: 'center',
      width: 80,
      render: row => {
        return row.logo ? (
          <NImage
            src={setBaseUrl(row.logo)}
            width={60}
            height={60}
            object-fit="cover"
            preview-disabled={false}
            alt="交易对Logo"
          />
        ) : (
          '-'
        );
      }
    },
    { key: 'name', title: '自定义名称', align: 'center', width: 150 },
    { key: 'symbol', title: '交易对名称', align: 'center', width: 120 },
    { key: 'base_asset', title: '交易货币', align: 'center', width: 120 },
    { key: 'quote_asset', title: '计价货币', align: 'center', width: 120 },
    {
      key: 'binance_symbol',
      title: '币安交易对别名',
      align: 'center',
      width: 150,
      render: row => <span>{row.binance_symbol || '-'}</span>
    },
    {
      key: 'digits',
      title: '结算小数位',
      align: 'center',
      width: 100,
      render: row => <span>{row.digits || '-'}</span>
    },
    {
      key: 'self_data',
      title: '自有行情',
      align: 'center',
      width: 100,
      render: row => <NTag type={row.self_data === 1 ? 'success' : 'error'}>{row.self_data === 1 ? '是' : '否'}</NTag>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => <NTag type={row.status === 1 ? 'success' : 'error'}>{row.status === 1 ? '开启' : '关闭'}</NTag>
    },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 170,
      render: row => <NText>{row.created_at}</NText>
    },

    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-12px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 删除
async function handleDelete(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await CryptoDelSymbol({ id });
    loading.value = false;
    onDeleted();
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    loading.value = false;
  }
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="交易对管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1800"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
