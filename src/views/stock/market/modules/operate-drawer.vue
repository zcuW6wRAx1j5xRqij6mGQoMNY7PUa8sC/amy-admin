<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { StockCreateMarket, StockUpdateMarket } from '@/service/api/stock';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'MarketOperateDrawer'
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
    add: '新增市场股票',
    edit: '编辑市场股票'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    change: 0,
    close: 0,
    country: '',
    exchange: '',
    high: 0,
    is_recommend: 0,
    isin: '',
    kline_query_path: '',
    logo: '',
    low: 0,
    market_cap: 0,
    name: '',
    open: 0,
    price: 0,
    quote_query_path: '',
    sort: 0,
    status: 0,
    symbol: '',
    volume: 0
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

const statusOptions = [
  { label: '禁用', value: 0 },
  { label: '启用', value: 1 }
];

const recommendOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 1 }
];

async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(ruleForm.value.change)) {
    errorObj.value.change = '请输入涨跌幅';
  }
  if (isEmpty(ruleForm.value.close)) {
    errorObj.value.close = '请输入收盘价';
  }
  if (isEmpty(ruleForm.value.country)) {
    errorObj.value.country = '请输入国家';
  }
  if (isEmpty(ruleForm.value.exchange)) {
    errorObj.value.exchange = '请输入交易所类型';
  }
  if (isEmpty(ruleForm.value.high)) {
    errorObj.value.high = '请输入最高价';
  }
  if (isEmpty(ruleForm.value.low)) {
    errorObj.value.low = '请输入最低价';
  }
  if (isEmpty(ruleForm.value.open)) {
    errorObj.value.open = '请输入开盘价';
  }
  if (isEmpty(ruleForm.value.name)) {
    errorObj.value.name = '请输入股票名称';
  }
  if (isEmpty(ruleForm.value.price)) {
    errorObj.value.price = '请输入当前价格';
  }
  if (isEmpty(ruleForm.value.sort)) {
    errorObj.value.sort = '请输入排序';
  }
  if (isEmpty(ruleForm.value.symbol)) {
    errorObj.value.symbol = '请输入股票代码';
  }
  if (isEmpty(ruleForm.value.volume)) {
    errorObj.value.volume = '请输入成交量';
  }
  if (isEmpty(ruleForm.value.market_cap)) {
    errorObj.value.market_cap = '请输入成交额';
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = ruleForm.value.id ? StockUpdateMarket : StockCreateMarket;
  action(ruleForm.value)
    .then(() => {
      window.$message?.success('操作成功');
      closeDrawer();
      emit('submitted');
    })
    .catch(error => {
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
        <MyFormItem v-model="ruleForm.symbol" label="股票代码" prop-name="symbol" />
        <MyFormItem v-model="ruleForm.name" label="股票名称" prop-name="name" />
        <MyFormItem v-model="ruleForm.exchange" label="交易所类型" prop-name="exchange" />
        <MyFormItem v-model="ruleForm.country" label="国家" prop-name="country" />
        <MyFormItem v-model="ruleForm.isin" label="国际证券识别码" prop-name="isin" />
        <MyFormItem v-model="ruleForm.price" label="当前价格" prop-name="price" />
        <MyFormItem v-model="ruleForm.change" label="涨跌幅" prop-name="change" />
        <MyFormItem v-model="ruleForm.open" label="开盘价" prop-name="open" />
        <MyFormItem v-model="ruleForm.close" label="收盘价" prop-name="close" />
        <MyFormItem v-model="ruleForm.high" label="最高价" prop-name="high" />
        <MyFormItem v-model="ruleForm.low" label="最低价" prop-name="low" />
        <MyFormItem v-model="ruleForm.volume" label="成交量" prop-name="volume" />
        <MyFormItem v-model="ruleForm.market_cap" label="成交额" prop-name="market_cap" />
        <MyFormItem v-model="ruleForm.logo" label="股票Logo" prop-name="logo" />
        <MyFormItem v-model="ruleForm.kline_query_path" label="K线查询路径" prop-name="kline_query_path" />
        <MyFormItem v-model="ruleForm.quote_query_path" label="行情查询路径" prop-name="quote_query_path" />
        <MyFormItem v-model="ruleForm.sort" label="排序" prop-name="sort" />
        <MyFormItem v-model="ruleForm.is_recommend" label="是否推荐" form-type="select" :data-list="recommendOptions" prop-name="is_recommend" />
        <MyFormItem v-model="ruleForm.status" label="状态" form-type="select" :data-list="statusOptions" prop-name="status" />
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
