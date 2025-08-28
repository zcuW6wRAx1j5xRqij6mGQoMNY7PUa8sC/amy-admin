<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { StockCreateOtc, StockUpdateOtc, StockOtcInfo } from '@/service/api/stock';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'OtcOperateDrawer'
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
    add: '新增OTC股票',
    edit: '编辑OTC股票'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    apply_max_quantity: 0,
    apply_min_quantity: 0,
    apply_price: 0,
    close_fee: 0,
    close_price: 0,
    open_fee: 0,
    status: 0,
    stock_id: 0
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      btnLoading.value = true;
      const detailData = await StockOtcInfo({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error: any) {
      window.$message?.error('获取详情失败');
      console.error('获取OTC详情失败:', error);
    } finally {
      btnLoading.value = false;
    }
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

const statusOptions = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(ruleForm.value.apply_max_quantity)) {
    errorObj.value.apply_max_quantity = '请输入申请最大量';
  }
  if (isEmpty(ruleForm.value.apply_min_quantity)) {
    errorObj.value.apply_min_quantity = '请输入申请最小量';
  }
  if (isEmpty(ruleForm.value.apply_price)) {
    errorObj.value.apply_price = '请输入申请价格';
  }
  if (isEmpty(ruleForm.value.close_fee)) {
    errorObj.value.close_fee = '请输入平仓手续费%';
  }
  if (isEmpty(ruleForm.value.close_price)) {
    errorObj.value.close_price = '请输入平仓价格';
  }
  if (isEmpty(ruleForm.value.open_fee)) {
    errorObj.value.open_fee = '请输入开仓手续费%';
  }
  if (isEmpty(ruleForm.value.stock_id)) {
    errorObj.value.stock_id = '请输入股票ID';
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = ruleForm.value.id ? StockUpdateOtc : StockCreateOtc;
  action(ruleForm.value)
    .then(() => {
      window.$message?.success('操作成功');
      closeDrawer();
      emit('submitted');
    })
    .catch((error: any) => {
      errorObj.value = error;
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.stock_id" label="股票ID" prop-name="stock_id" />
        <MyFormItem v-model="ruleForm.apply_price" label="申请价格" prop-name="apply_price" />
        <MyFormItem v-model="ruleForm.close_price" label="平仓价格" prop-name="close_price" />
        <MyFormItem v-model="ruleForm.apply_min_quantity" label="申请最小量" prop-name="apply_min_quantity" />
        <MyFormItem v-model="ruleForm.apply_max_quantity" label="申请最大量" prop-name="apply_max_quantity" />
        <MyFormItem v-model="ruleForm.open_fee" label="开仓手续费%" prop-name="open_fee" />
        <MyFormItem v-model="ruleForm.close_fee" label="平仓手续费%" prop-name="close_fee" />
        <MyFormItem
          v-model="ruleForm.status"
          label="状态"
          form-type="select"
          :data-list="statusOptions"
          prop-name="status"
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
