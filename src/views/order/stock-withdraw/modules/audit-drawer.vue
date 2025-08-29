<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { StockWithdrawAudit } from '@/service/api/order';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'StockWithdrawAuditDrawer'
});

interface Props {
  /** 提现记录ID */
  withdrawId?: number;
  /** 审核类型：approved-通过，rejected-拒绝 */
  auditType?: 'approved' | 'rejected';
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
  const titles = {
    approved: '审核通过',
    rejected: '审核拒绝'
  };
  return titles[props.auditType || 'approved'];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    remark: ''
  };
}

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

async function handleSubmit() {
  errorObj.value = {};

  if (isEmpty(ruleForm.value.remark)) {
    errorObj.value.remark = '请输入备注信息';
    return;
  }

  if (!props.withdrawId) {
    window.$message?.error('提现记录ID不能为空');
    return;
  }

  if (!props.auditType) {
    window.$message?.error('审核类型不能为空');
    return;
  }

  btnLoading.value = true;

  try {
    await StockWithdrawAudit({
      id: props.withdrawId,
      status: props.auditType,
      remark: ruleForm.value.remark
    });

    const successMsg = props.auditType === 'approved' ? '审核通过成功' : '审核拒绝成功';
    window.$message?.success(successMsg);
    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    const errorMsg = props.auditType === 'approved' ? '审核通过失败' : '审核拒绝失败';
    if (error?.message) {
      window.$message?.error(error.message);
    } else {
      window.$message?.error(errorMsg);
    }
    console.error('审核失败:', error);
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
  <NDrawer v-model:show="visible" display-directive="show" :width="400">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.remark"
          label="备注信息"
          prop-name="remark"
          type="textarea"
          placeholder="请输入备注信息"
        />
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
