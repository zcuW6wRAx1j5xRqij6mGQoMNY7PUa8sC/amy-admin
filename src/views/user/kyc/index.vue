<script setup lang="tsx">
import { NButton, NImage, NPopconfirm, NTag, NText } from 'naive-ui';
import { UserKycAudit, UserKycList } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';
import KycSearch from './modules/kyc-search.vue';

const appStore = useAppStore();

// 审核状态映射
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '审核通过', type: 'success' },
  2: { label: '审核不通过', type: 'error' }
};

// 表格相关
const { columns, data, loading, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: UserKycList,
  apiParams: {
    page: 1,
    page_size: 20,
    filter: '',
    status: ''
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'uid', title: '用户ID', align: 'center', width: 100 },
    { key: 'user.nickname', title: '用户昵称', align: 'center', width: 120 },
    { key: 'user.email', title: '用户邮箱', align: 'center', width: 150 },
    { key: 'name', title: '真实姓名', align: 'center', width: 120 },
    { key: 'id_card_number', title: '证件号码', align: 'center', width: 150 },
    {
      key: 'photo_front',
      title: '证件正面照',
      align: 'center',
      width: 120,
      render: row => {
        return row.photo_front ? (
          <NImage
            src={setBaseUrl(row.photo_front)}
            width={100}
            height={80}
            object-fit="cover"
            preview-disabled={false}
            alt="证件正面"
          />
        ) : (
          '-'
        );
      }
    },
    {
      key: 'photo_back',
      title: '证件背面照',
      align: 'center',
      width: 120,
      render: row => {
        return row.photo_back ? (
          <NImage
            src={setBaseUrl(row.photo_back)}
            width={100}
            height={80}
            object-fit="cover"
            preview-disabled={false}
            alt="证件背面"
          />
        ) : (
          '-'
        );
      }
    },
    {
      key: 'status',
      title: '审核状态',
      align: 'center',
      width: 120,
      render: row => {
        const status = statusMap[row.status];
        return <NTag type={status?.type}>{status?.label}</NTag>;
      }
    },
    {
      key: 'reject_reason',
      title: '拒绝原因',
      align: 'center',
      width: 150,
      render: row => <span>{row.reject_reason || '-'}</span>
    },
    {
      key: 'verified_at',
      title: '审核时间',
      align: 'center',
      width: 160,
      render: row => <NText>{row.verified_at || '-'}</NText>
    },
    {
      key: 'admin_id',
      title: '审核管理员',
      align: 'center',
      width: 120,
      render: row => <span>{row.admin_id || '-'}</span>
    },
    {
      key: 'created_at',
      title: '申请时间',
      align: 'center',
      width: 160,
      render: row => <NText>{row.created_at}</NText>
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => {
        if (row.status === 0) {
          return (
            <div class="flex-center gap-12px">
              <NPopconfirm onPositiveClick={() => handleReview(row, 1)}>
                {{
                  default: () => '确认通过审核吗？',
                  trigger: () => (
                    <NButton type="success" ghost size="small">
                      通过
                    </NButton>
                  )
                }}
              </NPopconfirm>
              <NPopconfirm onPositiveClick={() => handleReview(row, 2)}>
                {{
                  default: () => '确认拒绝审核吗？',
                  trigger: () => (
                    <NButton type="error" ghost size="small">
                      拒绝
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </div>
          );
        }
        return '-';
      }
    }
  ]
});

// 审核操作
async function handleReview(item: any, status: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await UserKycAudit({
      id: item.id,
      status
    });
    window.$message?.success('操作成功');
    getDataByPage();
  } catch (error) {
    console.error('审核操作失败:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <KycSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="实名认证管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <NDataTable
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
    </NCard>
  </div>
</template>

<style scoped></style>
