<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { UserBankCardDelete, UserBankCardList } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';
const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination,searchParams,
  resetSearchParams,getDataByPage } = useTable({
  apiFn: UserBankCardList,
  apiParams: {
    page: 1,
    size: 20,
    uid:''
  },
  columns: () => [
    // { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 120,
    },
    {
      key: 'user.nickname',
      title: '用户信息',
      align: 'left',
      width: '220px',
      render: row => <div>
        <div>用户昵称:{row.user?.nickname || '-'}</div>
        <div>用户ID:{row.user?.id || '-'}</div>
        <div>用户手机号:{row.user?.mobile || '-'}</div>
      </div>
    },
    {
      key:'card_holder_name',
      title:'银行卡信息',
      align: 'left',
      width: "300px",
      render: row => <div>
        <div>持卡人姓名:{row.card_holder_name || '-'}</div>
        <div>银行名称{row.bank_name || '-'}</div>
        <div>银行卡号:{row.card_number || '-'}</div>
        <div>chve pix:{row.chve_pix || '-'}</div>
        <div>cpf:{row.cpf || '-'}</div>
      </div>
    },
    {
      key: 'updated_at',
      title: '更新时间',
      align: 'center',
      width: 160,
    },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 160,
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
    await UserBankCardDelete({ id });
    loading.value = false;
    onDeleted();
  } catch {
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
    <NCard title="用户银行卡管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1400"
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
