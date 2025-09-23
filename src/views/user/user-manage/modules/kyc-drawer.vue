<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchCreateKyc } from '@/service/api/user';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'KycDrawer'
});

interface Props {
  /** 用户ID */
  userId?: number;
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

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    name: '',
    id_card_number: '',
    photo_front: '',
    photo_back: ''
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

async function handleSubmit() {
  if (!props.userId) {
    window.$message?.error('用户ID不能为空');
    return;
  }

  errorObj.value = {};

  if (isEmpty(ruleForm.value.name)) {
    errorObj.value.name = '请输入姓名';
  }
  if (isEmpty(ruleForm.value.id_card_number)) {
    errorObj.value.id_card_number = '请输入身份证号';
  }
  if (isEmpty(ruleForm.value.photo_front)) {
    errorObj.value.photo_front = '请上传身份证正面';
  }
  if (isEmpty(ruleForm.value.photo_back)) {
    errorObj.value.photo_back = '请上传身份证背面';
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;

  const submitData = {
    uid: props.userId,
    name: ruleForm.value.name,
    id_card_number: ruleForm.value.id_card_number,
    photo_front: ruleForm.value.photo_front,
    photo_back: ruleForm.value.photo_back
  };

  fetchCreateKyc(submitData)
    .then(() => {
      window.$message?.success('实名认证提交成功');
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

watch(visible, async () => {
  if (visible.value) {
    await handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent title="用户实名认证" :native-scrollbar="false" closable>
      <MyForm :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.name" is-required label="姓名" prop-name="name" placeholder="请输入姓名" />
        <MyFormItem
          v-model="ruleForm.id_card_number"
          is-required
          label="身份证号"
          prop-name="id_card_number"
          placeholder="请输入身份证号"
        />

        <MyFormItem
          v-model="ruleForm.photo_front"
          is-required
          label="身份证正面"
          prop-name="photo_front"
          form-type="upload"
          accept="image/*"
        />

        <MyFormItem
          v-model="ruleForm.photo_back"
          is-required
          label="身份证背面"
          prop-name="photo_back"
          form-type="upload"
          accept="image/*"
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
