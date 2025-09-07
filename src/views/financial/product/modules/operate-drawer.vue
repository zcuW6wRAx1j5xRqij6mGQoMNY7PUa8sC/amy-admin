<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchAddProduct, fetchUpdateProduct } from '@/service/api/financial';
import { isEmpty } from '@/utils/is';
import useUpload from '@/hooks/business/useUpload';
import { setBaseUrl } from '@/utils/utils';

defineOptions({
  name: 'ProductOperateDrawer'
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
    add: '新增产品',
    edit: '编辑产品'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());
const btnLoading = ref(false);
const errorObj = ref({});

const statusList = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

const categoryList = [
  { label: '活期', value: 'flexible' },
  { label: '定期', value: 'fixed' }
];

const durationList = [
  { label: '1天', value: 1 },
  { label: '3天', value: 3 },
  { label: '5天', value: 5 },
  { label: '7天', value: 7 },
  { label: '10天', value: 10 },
  { label: '15天', value: 15 },
  { label: '30天', value: 30 },
  { label: '60天', value: 60 },
  { label: '120天', value: 120 }
];

watch(
  () => visible.value,
  newVal => {
    if (!newVal) return;
    handleInitModel();
  }
);

function createDefaultModel() {
  return {
    id: null,
    name: '',
    category: null,
    logo: '',
    min_amount: '',
    max_amount: '',
    min_daily_rate: '',
    max_daily_rate: '',
    penalty_rate: '',
    duration: null,
    sort: 0,
    status: 1
  };
}

async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(ruleForm.value.name)) {
    errorObj.value.name = '请输入名称';
  }
  if (isEmpty(ruleForm.value.category)) {
    errorObj.value.category = '请输入分类';
  }
  if (isEmpty(ruleForm.value.logo)) {
    errorObj.value.logo = '请上传Logo';
  }
  if (isEmpty(ruleForm.value.min_amount)) {
    errorObj.value.min_amount = '请输入最小金额';
  }
  if (isEmpty(ruleForm.value.max_amount)) {
    errorObj.value.max_amount = '请输入最大金额';
  }
  if (isEmpty(ruleForm.value.min_daily_rate)) {
    errorObj.value.min_daily_rate = '请输入最小日收益率';
  }
  if (isEmpty(ruleForm.value.max_daily_rate)) {
    errorObj.value.max_daily_rate = '请输入最大日收益率';
  }
  if (isEmpty(ruleForm.value.penalty_rate)) {
    errorObj.value.penalty_rate = '请输入赎回利息';
  }
  if (isEmpty(ruleForm.value.duration)) {
    errorObj.value.duration = '请选择可购买天数';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;
  const apiFn = props.operateType === 'edit' ? fetchUpdateProduct : fetchAddProduct;
  return apiFn(ruleForm.value)
    .then(() => {
      window.$message?.success(props.operateType === 'edit' ? '编辑成功' : '新增成功');
      visible.value = false;
      emit('submitted');
    })
    .catch(error => {
      errorObj.value = error;
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

function closeDrawer() {
  visible.value = false;
}

const uploadFile = useUpload();
const uploading = ref(false);

const handleLogoSuccess = ({ file }) => {
  uploading.value = true;
  uploadFile(file)
    .then(data => {
      ruleForm.value.logo = data;
    })
    .finally(() => {
      uploading.value = false;
    });
  return false;
};

function handleInitModel() {
  if (props.operateType === 'edit') {
    ruleForm.value = { ...props.rowData };
  } else {
    ruleForm.value = createDefaultModel();
  }
}
</script>

<template>
  <NDrawer v-model:show="visible" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.name" label="名称" prop-name="name" />
        <MyFormItem
          v-model="ruleForm.category"
          label="分类"
          form-type="select"
          :data-list="categoryList"
          prop-name="category"
        />
        <MyFormItem v-model="ruleForm.logo" label="Logo" form-type="upload" prop-name="logo">
          <NUpload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            accept="image/*"
            :limit="1"
            @before-upload="handleLogoSuccess"
          >
            <NButton v-if="uploading" disabled type="primary">{{ uploading ? '上传中' : '点击上传' }}</NButton>
            <NImage v-else-if="ruleForm.logo" :src="setBaseUrl(ruleForm.logo)" object-fit="cover" />
            <NButton v-else type="primary">{{ uploading ? '上传中' : '点击上传' }}</NButton>
          </NUpload>
        </MyFormItem>
        <MyFormItem v-model="ruleForm.min_amount" label="最小金额" type="number" prop-name="min_amount" />
        <MyFormItem v-model="ruleForm.max_amount" label="最大金额" type="number" prop-name="max_amount" />
        <MyFormItem v-model="ruleForm.min_daily_rate" label="最小日收益率%" type="number" prop-name="min_daily_rate" />
        <MyFormItem v-model="ruleForm.max_daily_rate" label="最大日收益率%" type="number" prop-name="max_daily_rate" />
        <MyFormItem v-model="ruleForm.penalty_rate" label="赎回利息%" type="number" prop-name="penalty_rate" />
        <MyFormItem
          v-model="ruleForm.duration"
          label="可购买天数"
          form-type="select"
          :data-list="durationList"
          prop-name="duration"
          multiple
        />
        <MyFormItem v-model="ruleForm.sort" label="排序" type="number" prop-name="sort" />
        <MyFormItem
          v-if="operateType === 'edit'"
          v-model="ruleForm.status"
          label="状态"
          form-type="select"
          :data-list="statusList"
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
