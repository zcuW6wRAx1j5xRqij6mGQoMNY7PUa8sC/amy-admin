<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { StockCreateIpo, StockIpoInfo, StockUpdateIpo } from '@/service/api/stock';
import { isEmpty } from '@/utils/is';
import type { IpoStock, IpoStockRequest } from '@/typings/stock';

defineOptions({
  name: 'IpoOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: IpoStock;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增IPO股票',
    edit: '编辑IPO股票'
  };
  return titles[props.operateType];
});

const ruleForm = ref<IpoStockRequest>(createDefaultModel());

function createDefaultModel(): IpoStockRequest {
  return {
    id: undefined,
    company_id: '',
    company_name: '',
    buy_price: 0,
    apply_price: 0,
    apply_min_quantity: 0,
    apply_max_quantity: 0,
    issue_quantity: 0,
    open_fee: 0,
    close_fee: 0,
    apply_start_at: null,
    apply_end_at: null,
    published_at: null,
    status: 0
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      btnLoading.value = true;
      const detailData = await StockIpoInfo({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
      Reflect.deleteProperty(ruleForm.value, 'stock');
    } catch (error: any) {
      console.error('获取IPO详情失败:', error);
    } finally {
      btnLoading.value = false;
    }
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const statusOptions = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

function validateForm() {
  const errors: Record<string, string> = {};
  const requiredFields = [
    { key: 'buy_price', message: '请输入购买价格' },
    { key: 'apply_max_quantity', message: '请输入申请最大量' },
    { key: 'apply_min_quantity', message: '请输入申请最小量' },
    { key: 'apply_price', message: '请输入申请价格' },
    { key: 'close_fee', message: '请输入平仓手续费%' },
    { key: 'open_fee', message: '请输入开仓手续费%' },
    { key: 'company_id', message: '请输入股票代码' },
    { key: 'company_name', message: '请输入企业名称' },
    { key: 'issue_quantity', message: '请输入发行数量' }
  ];

  requiredFields.forEach(({ key, message }) => {
    if (isEmpty(ruleForm.value[key as keyof IpoStockRequest])) {
      errors[key] = message;
    }
  });

  return errors;
}

async function handleSubmit() {
  errorObj.value = validateForm();

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = ruleForm.value.id ? StockUpdateIpo : StockCreateIpo;

  // 准备提交数据，确保必填字段不为undefined
  const submitData = {
    ...ruleForm.value,
    apply_price: ruleForm.value.apply_price || 0,
    apply_min_quantity: ruleForm.value.apply_min_quantity || 0,
    apply_max_quantity: ruleForm.value.apply_max_quantity || 0,
    open_fee: ruleForm.value.open_fee || 0,
    close_fee: ruleForm.value.close_fee || 0,
    issue_quantity: ruleForm.value.issue_quantity || 0,
    status: ruleForm.value.status || 0,
    apply_start_at: ruleForm.value.apply_start_at || '',
    apply_end_at: ruleForm.value.apply_end_at || '',
    published_at: ruleForm.value.published_at || ''
  };

  if (submitData.apply_end_at) {
    submitData.apply_end_at = dayjs(submitData.apply_end_at).format('YYYY-MM-DD HH:mm:ss');
  }
  if (submitData.apply_start_at) {
    submitData.apply_start_at = dayjs(submitData.apply_start_at).format('YYYY-MM-DD HH:mm:ss');
  }
  if (submitData.published_at) {
    submitData.published_at = dayjs(submitData.published_at).format('YYYY-MM-DD HH:mm:ss');
  }
  action(submitData)
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
        <MyFormItem v-model="ruleForm.buy_price" label="购买价格" prop-name="buy_price" />
        <MyFormItem v-model="ruleForm.company_id" label="股票代码" prop-name="company_id" />
        <MyFormItem v-model="ruleForm.company_name" label="企业名称" prop-name="company_name" />
        <MyFormItem v-model="ruleForm.apply_price" label="申请价格" prop-name="apply_price" />
        <MyFormItem v-model="ruleForm.apply_min_quantity" label="申请最小量" prop-name="apply_min_quantity" />
        <MyFormItem v-model="ruleForm.apply_max_quantity" label="申请最大量" prop-name="apply_max_quantity" />
        <MyFormItem v-model="ruleForm.issue_quantity" label="发行数量" prop-name="issue_quantity" />
        <MyFormItem v-model="ruleForm.open_fee" label="开仓手续费%" prop-name="open_fee" />
        <MyFormItem v-model="ruleForm.close_fee" label="平仓手续费%" prop-name="close_fee" />
        <MyFormItem
          v-model="ruleForm.apply_start_at"
          label="开始时间"
          prop-name="apply_start_at"
          form-type="datetime"
        />
        <MyFormItem v-model="ruleForm.published_at" label="上市时间" prop-name="published_at" form-type="datetime" />
        <MyFormItem v-model="ruleForm.apply_end_at" label="结束时间" prop-name="apply_end_at" form-type="datetime" />
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
