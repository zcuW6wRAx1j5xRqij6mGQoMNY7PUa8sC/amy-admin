<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { EtfProductCreate, EtfProductDetail, EtfProductUpdate } from '@/service/api/etf';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'EtfProductOperateDrawer'
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
    add: '新增AI7.0产品',
    edit: '编辑AI7.0产品'
  };
  return titles[props.operateType];
});

const statusOptions = ref([
  { value: '0', label: '关闭' },
  { value: '1', label: '开启' }
]);

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    name: '',
    desc: '',
    order_start_at: null,
    order_end_at: null,
    status: '1',
    trade_code: '',
    duration: null
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await EtfProductDetail({ id: props.rowData.id });
      Object.keys(ruleForm.value).forEach(key => {
        ruleForm.value[key] = detailData[key] || null;
      });
    } catch (error) {
      console.error('获取产品详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.keys(ruleForm.value).forEach(key => {
        ruleForm.value[key] = props.rowData[key] || null;
      });
    }
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
  if (isEmpty(ruleForm.value.name)) {
    errorObj.value.name = '请输入产品名称';
  }
  if (isEmpty(ruleForm.value.desc)) {
    errorObj.value.desc = '请输入详细介绍';
  }
  if (isEmpty(ruleForm.value.order_start_at)) {
    errorObj.value.order_start_at = '请选择开始时间';
  }
  if (isEmpty(ruleForm.value.order_end_at)) {
    errorObj.value.order_end_at = '请选择结束时间';
  }
  if (ruleForm.value.duration !== null && ruleForm.value.duration !== '' && (isNaN(Number(ruleForm.value.duration)) || Number(ruleForm.value.duration) <= 0)) {
    errorObj.value.duration = '持仓时长必须为正整数';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;

  try {
    const action = props.operateType === 'add' ? EtfProductCreate : EtfProductUpdate;
    const params = { ...ruleForm.value };
    if (params.order_start_at) {
      params.order_start_at = dayjs(params.order_start_at).format('YYYY-MM-DD HH:mm:ss');
    }
    if (params.order_end_at) {
      params.order_end_at = dayjs(params.order_end_at).format('YYYY-MM-DD HH:mm:ss');
    }
    // 确保duration为数字类型
    if (params.duration !== null && params.duration !== '') {
      params.duration = Number(params.duration);
    } else {
      params.duration = null;
    }
    await action(params);

    window.$message?.success('操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    errorObj.value = error;
  } finally {
    btnLoading.value = false;
  }
}

watch(visible, async () => {
  if (visible.value) {
    await handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.name" label="产品名称" prop-name="name" isRequired />
        <MyFormItem v-model="ruleForm.desc" label="详细介绍" prop-name="desc" type="textarea" isRequired />
        <MyFormItem v-model="ruleForm.trade_code" label="交易码" prop-name="trade_code" />
        <MyFormItem v-model="ruleForm.duration" label="持仓时长(分钟)" prop-name="duration" form-type="number" />
        <MyFormItem
          v-model="ruleForm.order_start_at"
          label="开始时间"
          prop-name="order_start_at"
          form-type="datetime"
          isRequired
        />
        <MyFormItem v-model="ruleForm.order_end_at" label="结束时间" prop-name="order_end_at" form-type="datetime" isRequired />
        <MyFormItem v-model="ruleForm.status" label="状态" form-type="select" :data-list="statusOptions" isRequired />
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
