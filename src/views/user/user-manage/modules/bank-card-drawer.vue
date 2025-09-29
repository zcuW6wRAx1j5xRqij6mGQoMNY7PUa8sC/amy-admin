<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import { NButton, NCard, NDrawer, NDrawerContent, NPopconfirm, NSpin } from 'naive-ui';
import dayjs from 'dayjs';
import { UserBankCardAdd, UserBankCardDelete, UserBankCardList, UserBankCardUpdate } from '@/service/api/user';

interface Props {
  userId?: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

// 表单数据
const formData = reactive({
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

// 银行卡数据
const bankCards = ref<any[]>([]);
const loading = ref(false);

// 获取银行卡数据
async function getBankCards() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const response = await UserBankCardList({
      uid: props.userId,
      page: 1,
      page_size: 10
    });
    bankCards.value = response.rows || [];
  } catch {
    // 获取银行卡数据失败
  } finally {
    loading.value = false;
  }
}

// 监听抽屉显示状态
watch(visible, newVisible => {
  if (newVisible) {
    formData.uid = props.userId || 0;
    resetForm();
    // 确保有用户ID才获取数据
    if (props.userId) {
      getBankCards();
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

  return isValid;
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  // 检查是否超过2张银行卡限制
  if (!isEdit.value && bankCards.value.length >= 2) {
    window.$message?.error('最多只能添加2张银行卡');
    return;
  }

  try {
    if (isEdit.value && editingId.value) {
      await UserBankCardUpdate({ ...formData, id: editingId.value } as any);
      window.$message?.success('更新成功');
    } else {
      await UserBankCardAdd(formData as any);
      window.$message?.success('添加成功');
    }

    resetForm();
    getBankCards();
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
    getBankCards();
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
          <div v-if="!isEdit && bankCards.length >= 2" class="py-20px text-center text-orange-500">
            最多只能添加2张银行卡，请先删除现有银行卡再添加新的
          </div>
          <MyForm v-else :error-obj="errorObj">
            <div class="grid grid-cols-2 gap-16px">
              <MyFormItem v-model="formData.bank_name" label="银行名称" prop-name="bank_name" is-required />
              <MyFormItem
                v-model="formData.card_holder_name"
                label="持卡人姓名"
                prop-name="card_holder_name"
                is-required
              />
              <MyFormItem v-model="formData.card_number" label="银行卡号" prop-name="card_number" is-required />
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

        <!-- 银行卡信息 -->
        <NCard title="银行卡信息" size="small">
          <div v-if="loading" class="flex justify-center py-20px">
            <NSpin size="medium" />
          </div>
          <div v-else-if="bankCards.length === 0" class="py-20px text-center text-gray-500">暂无银行卡信息</div>
          <div v-else class="grid grid-cols-1 gap-16px">
            <div
              v-for="(card, index) in bankCards"
              :key="card.id"
              class="border border-gray-200 rounded-lg bg-gray-50 p-16px"
            >
              <div class="mb-12px flex items-start justify-between">
                <h4 class="text-lg text-gray-800 font-medium">银行卡 {{ index + 1 }}</h4>
                <div class="flex gap-8px">
                  <NButton size="small" type="primary" @click="handleEdit(card)">编辑</NButton>
                  <NPopconfirm @positive-click="handleDelete(card.id)">
                    <template #trigger>
                      <NButton size="small" type="error">删除</NButton>
                    </template>
                    确认删除这张银行卡吗？
                  </NPopconfirm>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-12px text-sm">
                <div>
                  <span class="text-gray-600">银行名称：</span>
                  <span class="font-medium">{{ card.bank_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-600">持卡人：</span>
                  <span class="font-medium">{{ card.card_holder_name || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-600">银行卡号：</span>
                  <span class="font-medium">{{ card.card_number || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-600">ChvePix：</span>
                  <span class="font-medium">{{ card.chve_pix || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-600">CPF：</span>
                  <span class="font-medium">{{ card.cpf || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-600">创建时间：</span>
                  <span class="font-medium">
                    {{ card.created_at ? dayjs(card.created_at).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NCard>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
