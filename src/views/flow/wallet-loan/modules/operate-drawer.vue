<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { setBaseUrl } from "@/utils/utils";

defineOptions({
  name: 'LoanOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: any;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增',
    edit: '编辑'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    uid: '',
    amount_frozen: 0,
    amount_total: 0,
    amount_unused: 0,
    amount_used: 0,
    status: '启用',
    user: {
      nickname: '',
      email: '',
      phone: '',
      avatar: '',
      is_kyc: 0,
      credit: 0
    }
  };
}

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(ruleForm.value, props.rowData);
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

async function handleSubmit() {
  errorObj.value = {};
  btnLoading.value = true;

  try {
    // 这里可以添加实际的提交逻辑
    window.$message?.success('操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    errorObj.value = error as any;
  } finally {
    btnLoading.value = false;
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.uid" label="用户ID" prop-name="uid" />

        <NCard title="钱包信息" size="small" class="mb-16px">
          <NGrid :cols="2" :x-gap="16">
            <NFormItemGi label="冻结金额" prop-name="amount_frozen">
              <NInputNumber v-model:value="ruleForm.amount_frozen" placeholder="请输入冻结金额" />
            </NFormItemGi>
            <NFormItemGi label="总贷款金额" prop-name="amount_total">
              <NInputNumber v-model:value="ruleForm.amount_total" placeholder="请输入总贷款金额" />
            </NFormItemGi>
            <NFormItemGi label="未用金额" prop-name="amount_unused">
              <NInputNumber v-model:value="ruleForm.amount_unused" placeholder="请输入未用金额" />
            </NFormItemGi>
            <NFormItemGi label="已用金额" prop-name="amount_used">
              <NInputNumber v-model:value="ruleForm.amount_used" placeholder="请输入已用金额" />
            </NFormItemGi>
          </NGrid>
        </NCard>

        <NCard title="用户信息" size="small" class="mb-16px">
          <NGrid :cols="2" :x-gap="16">
            <NFormItemGi label="昵称" prop-name="user.nickname">
              <NInput v-model:value="ruleForm.user.nickname" placeholder="请输入昵称" />
            </NFormItemGi>
            <NFormItemGi label="邮箱" prop-name="user.email">
              <NInput v-model:value="ruleForm.user.email" placeholder="请输入邮箱" />
            </NFormItemGi>
            <NFormItemGi label="手机号" prop-name="user.phone">
              <NInput v-model:value="ruleForm.user.phone" placeholder="请输入手机号" />
            </NFormItemGi>
            <NFormItemGi label="信用分" prop-name="user.credit">
              <NInputNumber v-model:value="ruleForm.user.credit" placeholder="请输入信用分" />
            </NFormItemGi>
            <NFormItemGi label="是否实名认证" prop-name="user.is_kyc">
              <NSelect
                v-model:value="ruleForm.user.is_kyc"
                :options="[
                  { label: '否', value: 0 },
                  { label: '是', value: 1 }
                ]"
                placeholder="请选择"
              />
            </NFormItemGi>
            <NFormItemGi label="头像" prop-name="user.avatar">
              <NInput v-model:value="ruleForm.user.avatar" placeholder="请输入头像URL" />
            </NFormItemGi>
          </NGrid>
          <div v-if="ruleForm.user.avatar" class="mt-16px">
            <img :src="setBaseUrl(ruleForm.user.avatar)" class="w-80px h-80px rounded" alt="头像" />
          </div>
        </NCard>

        <MyFormItem v-model="ruleForm.status" label="状态" form-type="select" :data-list="[
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' }
        ]" />
      </MyForm>
      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
          <NButton type="primary" :loading="btnLoading" @click="handleSubmit">确定</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
