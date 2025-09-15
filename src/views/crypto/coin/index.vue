<script setup lang="tsx">
import { NButton, NImage, NPopconfirm, NTag, NText } from 'naive-ui';
import { CryptoCoinList, CryptoDelCoin } from '@/service/api/crypto';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

// 表格相关
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
  apiFn: CryptoCoinList,
  apiParams: {
    page: 1,
    page_size: 20,
    name: '',
    block: '',
    status: null
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
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
            alt="币种Logo"
          />
        ) : (
          '-'
        );
      }
    },
    { key: 'name', title: '名称', align: 'center', width: 120 },
    { key: 'full_name', title: '全称', align: 'center', width: 150 },
    { key: 'block', title: '链名称', align: 'center', width: 120 },
    {
      key: 'deposit_address',
      title: '充值地址',
      align: 'center',
      width: 200,
      render: row => <span>{row.deposit_address || '-'}</span>
    },
    {
      key: 'allow_deposit',
      title: '允许充值',
      align: 'center',
      width: 100,
      render: row => (
        <NTag type={row.allow_deposit === 1 ? 'success' : 'error'}>{row.allow_deposit === 1 ? '是' : '否'}</NTag>
      )
    },
    {
      key: 'allow_withdraw',
      title: '允许提现',
      align: 'center',
      width: 100,
      render: row => (
        <NTag type={row.allow_withdraw === 1 ? 'success' : 'error'}>{row.allow_withdraw === 1 ? '是' : '否'}</NTag>
      )
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => <NTag type={row.status === 1 ? 'success' : 'error'}>{row.status === 1 ? '正常' : '禁用'}</NTag>
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
    await CryptoDelCoin({ id });
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
    <NCard title="币种管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1200"
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
