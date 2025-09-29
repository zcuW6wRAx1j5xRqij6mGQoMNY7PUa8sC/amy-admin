<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import { NButton, NCard, NDataTable, NDrawer, NDrawerContent, NPopconfirm, NText } from 'naive-ui';
import dayjs from 'dayjs';
import {
  UserBankCardAdd,
  UserBankCardDelete,
  UserBankCardList,
  UserBankCardUpdate,
  type bankCardReq
} from '@/service/api/user';
import { useTable } from '@/hooks/common/table';

interface Props {
  userId?: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

// 表单数据
const formData = reactive<bankCardReq>({
  bank_name: '',
  card_holder_name: '',
  card_number: '',
  chve_pix: '',
  cpf: '',
  uid: 0
});

// 表单验证错误
const errorObj = reactive({
  bank_name: '',
  card_holder_name: '',
  card_number: '',
  chve_pix: '',
  cpf: ''
});

// 编辑状态
const isEdit = ref(false);
const editingId = ref<number>();

// 表格相关
const { columns, data, loading, getData, searchParams, updateSearchParams } = useTable({
  apiFn: UserBankCardList,
  apiParams: {
    uid: props.userId,
    page: 1,
    page_size: 10
  },
  immediate: false,
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80 },
    { key: 'bank_name', title: '银行名称', align: 'center', width: 120 },
    { key: 'card_holder_name', title: '持卡人姓名', align: 'center', width: 120 },
    { key: 'card_number', title: '银行卡号', align: 'center', width: 150 },
    { key: 'chve_pix', title: 'ChvePix', align: 'center', width: 120 },
    { key: 'cpf', title: 'CPF', align: 'center', width: 120 },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 170,
      render: row => <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton size="small" type="primary" onClick={() => handleEdit(row)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除这张银行卡吗？',
              trigger: () => (
                <NButton size="small" type="error">
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

// 监听抽屉显示状态
watch(visible, newVisible => {
  if (newVisible) {
    updateSearchParams({ uid: props.userId });
    formData.uid = props.userId;
    resetForm();
    // 确保有用户ID才获取数据
    if (props.userId) {
      getData();
    }
  }
});

// 重置表单
function resetForm() {
  Object.assign(formData, {
    bank_name: '',
    card_holder_name: '',
    card_number: '',
    chve_pix: '',
    cpf: '',
    uid: props.userId || 0
  });
  Object.keys(errorObj).forEach(key => {
    errorObj[key as keyof typeof errorObj] = '';
  });
  isEdit.value = false;
  editingId.value = undefined;
}

// 表单验证
function validateForm() {
  let isValid = true;

  if (!formData.bank_name) {
    errorObj.bank_name = '请输入银行名称';
    isValid = false;
  }

  if (!formData.card_holder_name) {
    errorObj.card_holder_name = '请输入持卡人姓名';
    isValid = false;
  }

  if (!formData.card_number) {
    errorObj.card_number = '请输入银行卡号';
    isValid = false;
  }

  if (!formData.chve_pix) {
    errorObj.chve_pix = '请输入ChvePix';
    isValid = false;
  }

  if (!formData.cpf) {
    errorObj.cpf = '请输入CPF';
    isValid = false;
  }

  return isValid;
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  try {
    if (isEdit.value && editingId.value) {
      await UserBankCardUpdate({ ...formData, id: editingId.value });
      window.$message?.success('更新成功');
    } else {
      await UserBankCardAdd(formData);
      window.$message?.success('添加成功');
    }

    resetForm();
    getData();
  } catch {
    // console.error('提交失败:', error);
  }
}

// 编辑
function handleEdit(row: any) {
  Object.assign(formData, {
    bank_name: row.bank_name,
    card_holder_name: row.card_holder_name,
    card_number: row.card_number,
    chve_pix: row.chve_pix,
    cpf: row.cpf,
    uid: row.uid
  });
  isEdit.value = true;
  editingId.value = row.id;
}

// 删除
async function handleDelete(id: number) {
  try {
    await UserBankCardDelete({ id });
    window.$message?.success('删除成功');
    getData();
  } catch {
    // console.error('删除失败:', error);
  }
}

// 取消
function handleCancel() {
  resetForm();
  visible.value = false;
}
</script>

<template>
  <NDrawer v-model:show="visible" width="1100px" placement="right">
    <NDrawerContent title="银行卡信息管理" closable>
      <div class="flex-col-stretch gap-16px">
        <!-- 表单 -->
        <NCard title="添加/编辑银行卡" size="small">
          <MyForm all-required :error-obj="errorObj">
            <div class="grid grid-cols-2 gap-16px">
              <MyFormItem v-model="formData.bank_name" label="银行名称" prop-name="bank_name" />
              <MyFormItem v-model="formData.card_holder_name" label="持卡人姓名" prop-name="card_holder_name" />
              <MyFormItem v-model="formData.card_number" label="银行卡号" prop-name="card_number" />
              <MyFormItem v-model="formData.chve_pix" label="ChvePix" prop-name="chve_pix" />
              <MyFormItem v-model="formData.cpf" label="CPF" prop-name="cpf" />
            </div>
            <div class="mt-16px flex justify-end gap-12px">
              <NButton @click="handleCancel">取消</NButton>
              <NButton type="primary" @click="handleSubmit">
                {{ isEdit ? '更新' : '添加' }}
              </NButton>
            </div>
          </MyForm>
        </NCard>

        <!-- 银行卡列表 -->
        <NCard title="银行卡列表" size="small">
          <NDataTable
            :columns="columns"
            :data="data"
            :loading="loading"
            size="small"
            :scroll-x="1000"
            :row-key="row => row.id"
          />
        </NCard>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
