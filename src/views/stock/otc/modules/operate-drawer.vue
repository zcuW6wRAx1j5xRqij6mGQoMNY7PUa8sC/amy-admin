<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { StockCreateOtc, StockMarketList, StockOtcInfo, StockUpdateOtc } from '@/service/api/stock';
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
const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});
const stockOptions = ref<Array<{ label: string; value: number }>>([]);

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
    stock_id: null,
    discount_status: 0,
    discount: 1.0,
    discount_start: null,
    discount_end: null
  };
}

// 获取股票列表数据
async function loadStockOptions() {
  try {
    const response = await StockMarketList({ page: 1, size: 1000 });
    const stocks = response.items || response.rows || [];
    stockOptions.value = stocks.map((stock: any) => ({
      label: `${stock.name} (${stock.symbol})`,
      value: stock.id
    }));
  } catch (error) {
    console.error('获取股票列表失败:', error);
  }
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();

  // 加载股票选项
  await loadStockOptions();

  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      btnLoading.value = true;
      const detailData = await StockOtcInfo({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);

      // 处理折扣时间显示，只显示时分秒部分
      if (detailData.discount_start) {
        const startDate = new Date(detailData.discount_start);
        ruleForm.value.discount_start = startDate;
      } else {
        ruleForm.value.discount_start = null;
      }
      if (detailData.discount_end) {
        const endDate = new Date(detailData.discount_end);
        ruleForm.value.discount_end = endDate;
      } else {
        ruleForm.value.discount_end = null;
      }
      Reflect.deleteProperty(ruleForm.value, 'stock');
      console.log(ruleForm.value);
    } catch (error: any) {
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

const statusOptions = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

const discountStatusOptions = [
  { label: '禁用', value: 0 },
  { label: '启用', value: 1 }
];

function validateBasicFields() {
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
}

function validateDiscountFields() {
  if (ruleForm.value.discount_status === 1) {
    if (isEmpty(ruleForm.value.discount) || ruleForm.value.discount <= 0 || ruleForm.value.discount > 1) {
      errorObj.value.discount = '请输入有效的折扣比例(0-1之间)';
    }
    if (isEmpty(ruleForm.value.discount_start)) {
      errorObj.value.discount_start = '请输入折扣开始时间';
    }
    if (isEmpty(ruleForm.value.discount_end)) {
      errorObj.value.discount_end = '请输入折扣结束时间';
    }
    if (ruleForm.value.discount_start && ruleForm.value.discount_end) {
      if (ruleForm.value.discount_start >= ruleForm.value.discount_end) {
        errorObj.value.discount_end = '折扣结束时间必须大于开始时间';
      }
    }
  }
}

function processDiscountTime(submitData: any) {
  if (submitData.discount_start) {
    const timePart = dayjs(submitData.discount_start).format('HH:mm:ss');
    submitData.discount_start = `${dayjs().format('YYYY-MM-DD')} ${timePart}`;
  }
  if (submitData.discount_end) {
    const timePart = dayjs(submitData.discount_end).format('HH:mm:ss');
    submitData.discount_end = `${dayjs().format('YYYY-MM-DD')} ${timePart}`;
  }
  return submitData;
}

async function handleSubmit() {
  errorObj.value = {};

  validateBasicFields();
  validateDiscountFields();

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  // 处理折扣时间，拼接当天日期
  const submitData = processDiscountTime({ ...ruleForm.value });

  btnLoading.value = true;
  const action = submitData.id ? StockUpdateOtc : StockCreateOtc;
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
        <MyFormItem
          v-model="ruleForm.stock_id"
          label="股票"
          form-type="select"
          :data-list="stockOptions"
          prop-name="stock_id"
        />
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

        <!-- 折扣相关字段 -->
        <MyFormItem
          v-model="ruleForm.discount_status"
          label="折扣状态"
          form-type="select"
          :data-list="discountStatusOptions"
          prop-name="discount_status"
        />
        <MyFormItem
          v-model="ruleForm.discount"
          label="折扣比例"
          prop-name="discount"
          :disabled="ruleForm.discount_status === 0"
          placeholder="请输入折扣比例，如8折输入0.8"
        />
        <MyFormItem
          v-model="ruleForm.discount_start"
          label="折扣开始时间"
          form-type="time"
          prop-name="discount_start"
          :disabled="ruleForm.discount_status === 0"
          placeholder="请选择折扣开始时间"
        />
        <MyFormItem
          v-model="ruleForm.discount_end"
          label="折扣结束时间"
          form-type="time"
          prop-name="discount_end"
          :disabled="ruleForm.discount_status === 0"
          placeholder="请选择折扣结束时间"
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
