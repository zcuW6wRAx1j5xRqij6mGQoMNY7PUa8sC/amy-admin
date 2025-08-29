<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchResetPassword, fetchResetTradePassword } from '@/service/api/user';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'ResetPasswordDrawer'
});

interface Props {
  /** 用户ID */
  userId?: number;
  /** 重置类型：password-登录密码，trade-password-交易密码 */
  resetType?: 'password' | 'trade-password';
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
  const titles = {
    password: '重置登录密码',
    'trade-password': '重置交易密码'
  };
  return titles[props.resetType || 'password'];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    password: '',
    confirmPassword: ''
  };
}

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

async function handleSubmit() {
  errorObj.value = {};

  if (isEmpty(ruleForm.value.password)) {
    errorObj.value.password = '请输入新密码';
    return;
  }

  if (ruleForm.value.password.length < 6) {
    errorObj.value.password = '密码长度不能少于6位';
    return;
  }

  if (isEmpty(ruleForm.value.confirmPassword)) {
    errorObj.value.confirmPassword = '请确认新密码';
    return;
  }

  if (ruleForm.value.password !== ruleForm.value.confirmPassword) {
    errorObj.value.confirmPassword = '两次输入的密码不一致';
    return;
  }

  if (!props.userId) {
    window.$message?.error('用户ID不能为空');
    return;
  }

  btnLoading.value = true;

  try {
    const apiFn = props.resetType === 'trade-password' ? fetchResetTradePassword : fetchResetPassword;
    await apiFn({ id: props.userId, password: ruleForm.value.password });

    const successMsg = props.resetType === 'trade-password' ? '交易密码重置成功' : '登录密码重置成功';
    window.$message?.success(successMsg);
    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    const errorMsg = props.resetType === 'trade-password' ? '交易密码重置失败' : '登录密码重置失败';
    if (error?.message) {
      window.$message?.error(error.message);
    } else {
      window.$message?.error(errorMsg);
    }
    console.error('重置密码失败:', error);
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
  <NDrawer v-model:show="visible" display-directive="show" :width="400">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.password"
          label="新密码"
          prop-name="password"
          type="password"
          placeholder="请输入新密码"
        />
        <MyFormItem
          v-model="ruleForm.confirmPassword"
          label="确认密码"
          prop-name="confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
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
