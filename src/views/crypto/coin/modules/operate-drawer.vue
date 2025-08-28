<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { CryptoCreateCoin, CryptoUpdateCoin, type CryptoPostCoinPlader } from '@/service/api/crypto';
import { statusList, depositList } from '@/constants/business';
import { isEmpty } from '@/utils/is';
defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: CryptoPostCoinPlader | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

onMounted(() => {

});
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增',
    edit: '编辑'
  };
  return titles[props.operateType];
});


const model = ref(createDefaultModel());

function createDefaultModel(): CryptoPostCoinPlader {
  return {
    logo: "",
    name: "",
    block: "",
    id: undefined,
    full_name: "",
    deposit_address: "",
    allow_deposit: 0,
    allow_withdraw: 1,
    status: 0
  }
}

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  errorObj.value = {};
  model.value = createDefaultModel();
  console.log(model.value)
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}
const btnLoading = ref(false);
async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(model.value.logo)) {
    errorObj.value.logo = '请上传logo';
  }
  if (isEmpty(model.value.name)) {
    errorObj.value.name = '请输入货币名称';
  }
  if (isEmpty(model.value.block)) {
    errorObj.value.block = '请输入链名称';
  }
  if (isEmpty(model.value.status)) {
    errorObj.value.status = '请选择状态';
  }
  if (isEmpty(model.value.full_name)) {
    errorObj.value.full_name = '请输入全称';
  }
  if (isEmpty(model.value.deposit_address)) {
    errorObj.value.deposit_address = '请输入充值地址';
  }
  if (isEmpty(model.value.allow_deposit)) {
    errorObj.value.allow_deposit = '请选择是否允许充值';
  }
  if (isEmpty(model.value.allow_withdraw)) {
    errorObj.value.allow_withdraw = '请选择是否允许提现';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? CryptoUpdateCoin : CryptoCreateCoin;
  if(model.value.index)  model.value.index = undefined
  action(model.value)
    .then(() => {
      // request
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
const errorObj = ref<Record<string, string>>({});
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    errorObj.value = {};
  }
});
const handleFileChange = (options: { file: UploadFileInfo }) => {
  const file = options.file.file;
  if (file) {
    model.value.logo = URL.createObjectURL(file);
  }
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <!-- <MyFormItem v-model="model.logo" label="logo" prop-name="logo" /> -->
        <n-upload v-model="model.logo" :max="1" accept="image/*" @change="handleFileChange">
          <n-button>上传logo</n-button>
        </n-upload>

        <!-- 显示进度和预览 -->
        <n-image v-if="model.logo" :src="model.logo" width="50" />
        <MyFormItem v-model="model.name" label="货币名称" prop-name="name" />
        <MyFormItem v-model="model.block" label="链名称" prop-name="block" />
        <MyFormItem v-model="model.full_name" label="全称" prop-name="full_name" />
        <MyFormItem v-model="model.deposit_address" label="充值地址" prop-name="deposit_address" />
        <MyFormItem v-model="model.allow_deposit" label="是否允许充值" form-type="select" :data-list="depositList"
          prop-name="allow_deposit" />
        <MyFormItem v-model="model.allow_withdraw" label="是否允许提现" form-type="select" :data-list="depositList"
          prop-name="allow_withdraw" />
        <MyFormItem v-model="model.status" label="状态" form-type="select" :data-list="statusList" prop-name="status" />
        <!-- <MyFormItem v-model="model.role_id" label="角色" form-type="select" :data-list="roleList" prop-name="role_id" /> -->
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
