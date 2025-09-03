<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { WalletLoanSet } from '@/service/api/flow';

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
const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

function createDefaultModel() {
  return {
    id: undefined,
    amount_total: 0,
    status: 'enabled'
  };
}

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.keys(ruleForm.value).forEach(key => {
      ruleForm.value[key] = props.rowData[key] || null;
    });
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

async function handleSubmit() {
  errorObj.value = {};
  if (!ruleForm.value.amount_total || ruleForm.value.amount_total <= 0) {
    errorObj.value.amount_total = '请输入有效的总额度';
    return;
  }

  btnLoading.value = true;

  try {
    await WalletLoanSet(ruleForm.value);
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
        <MyFormItem v-model="ruleForm.amount_total" label="总额度" prop-name="amount_total" form-type="number" />

        <MyFormItem
          v-model="ruleForm.status"
          label="状态"
          form-type="select"
          :data-list="[
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled' }
          ]"
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
