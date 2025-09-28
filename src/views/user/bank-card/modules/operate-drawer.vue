<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { UserBankCardAdd, type bankCardReq, UserBankCardUpdate } from '@/service/api/user';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'UserLevelOperateDrawer'
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
    add: '新增用户等级',
    edit: '编辑用户等级'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel(): bankCardReq {
  return {
    id: undefined,
    uid: undefined,
    bank_name: '',
    card_holder_name: '',
    card_number: '',
    chve_pix: '',
    cpf: ''
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await UserLevelDetail({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error) {
      console.error('获取用户等级详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.assign(ruleForm.value, props.rowData);
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
  if (isEmpty(ruleForm.value.uid)) {
    errorObj.value.uid = '请输入用户ID';
  }
  if (isEmpty(ruleForm.value.card_holder_name)) {
    errorObj.value.card_holder_name = '请输入持卡人姓名';
  }
  if (isEmpty(ruleForm.value.bank_name)) {
    errorObj.value.bank_name = '请输入银行卡名称';
  }
  if (isEmpty(ruleForm.value.card_number)) {
    errorObj.value.card_number = '请输入银行卡号';
  }
  if (isEmpty(ruleForm.value.chve_pix)) {
    errorObj.value.chve_pix = '请输入ChvePix';
  }
  if (isEmpty(ruleForm.value.cpf)) {
    errorObj.value.cpf = '请输入CPF';
  }
    
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = props.operateType === 'add' ? UserBankCardAdd : UserBankCardUpdate;
  action({
    uid: Number(ruleForm.value.uid),
    bank_name: ruleForm.value.bank_name,
    card_holder_name: ruleForm.value.card_holder_name,
    card_number: ruleForm.value.card_number,
    chve_pix: ruleForm.value.chve_pix,
    cpf: ruleForm.value.cpf,
    id: props.operateType === 'edit' ? props.rowData.id : undefined,
  })
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

watch(visible, async () => {
  if (visible.value) {
    await handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.uid"
          label="用户ID"
          :disabled="props.operateType === 'edit'"
          prop-name="uid"
          placeholder="请输入用户ID"
          form-type="number"
        />
        <MyFormItem v-model="ruleForm.card_holder_name" label="持卡人姓名" prop-name="card_holder_name" placeholder="请输入持卡人姓名" />
        <MyFormItem v-model="ruleForm.bank_name" label="银行卡名称" prop-name="bank_name" placeholder="请输入银行卡名称" />
        <MyFormItem v-model="ruleForm.card_number" label="银行卡号" prop-name="card_number" placeholder="请输入银行卡号" />
        <MyFormItem v-model="ruleForm.chve_pix" label="ChvePix" prop-name="chve_pix" placeholder="请输入ChvePix" />
        <MyFormItem v-model="ruleForm.cpf" label="CPF" prop-name="cpf" placeholder="请输入CPF" />
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
