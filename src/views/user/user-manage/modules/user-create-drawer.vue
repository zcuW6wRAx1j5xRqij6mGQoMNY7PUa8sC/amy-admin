<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateUser } from '@/service/api/user';

defineOptions({
  name: 'UserCreateDrawer'
});

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => '创建新用户');

const ruleForm = ref(createDefaultModel());
const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

function createDefaultModel() {
  return {
    account_type: 'email' as 'email' | 'phone',
    email: '',
    phone: '',
    invite_code: '',
    password: '',
    confirm_password: ''
  };
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const accountTypeOptions = [
  { label: '邮箱注册', value: 'email' },
  { label: '手机号注册', value: 'phone' }
];

// 表单验证
function validateForm() {
  errorObj.value = {};

  if (ruleForm.value.account_type === 'email') {
    if (!ruleForm.value.email) {
      errorObj.value.email = '请输入邮箱地址';
      return false;
    }
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ruleForm.value.email)) {
      errorObj.value.email = '请输入正确的邮箱格式';
      return false;
    }
  } else if (!ruleForm.value.phone) {
    errorObj.value.phone = '请输入手机号码';
    return false;
  }

  if (!ruleForm.value.invite_code) {
    errorObj.value.invite_code = '请输入邀请码';
    return false;
  }

  if (!ruleForm.value.password) {
    errorObj.value.password = '请输入密码';
    return false;
  }

  if (ruleForm.value.password.length < 6) {
    errorObj.value.password = '密码长度不能少于6位';
    return false;
  }

  if (ruleForm.value.password !== ruleForm.value.confirm_password) {
    errorObj.value.confirm_password = '两次输入的密码不一致';
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  btnLoading.value = true;

  try {
    // 构建提交数据
    const submitData = {
      account_type: ruleForm.value.account_type,
      invite_code: ruleForm.value.invite_code,
      password: ruleForm.value.password
    };

    // 根据注册类型添加对应字段
    if (ruleForm.value.account_type === 'email') {
      submitData.email = ruleForm.value.email;
    } else {
      submitData.phone = ruleForm.value.phone;
    }

    await fetchCreateUser(submitData);
    window.$message?.success('创建用户成功');
    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    errorObj.value = error;
    console.error('创建用户失败:', error);
  } finally {
    btnLoading.value = false;
  }
}

// 监听抽屉显示状态，重置表单
watch(visible, isVisible => {
  if (isVisible) {
    ruleForm.value = createDefaultModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.account_type"
          label="注册类型"
          prop-name="account_type"
          form-type="select"
          :data-list="accountTypeOptions"
        />

        <MyFormItem
          v-if="ruleForm.account_type === 'email'"
          v-model="ruleForm.email"
          label="邮箱地址"
          prop-name="email"
          placeholder="请输入邮箱地址"
        />

        <MyFormItem
          v-if="ruleForm.account_type === 'phone'"
          v-model="ruleForm.phone"
          label="手机号码"
          prop-name="phone"
          form-type="number"
          placeholder="请输入手机号码"
        />

        <MyFormItem v-model="ruleForm.invite_code" label="邀请码" prop-name="invite_code" placeholder="请输入邀请码" />

        <MyFormItem
          v-model="ruleForm.password"
          label="密码"
          prop-name="password"
          type="password"
          placeholder="请输入密码，至少6位"
        />

        <MyFormItem
          v-model="ruleForm.confirm_password"
          label="确认密码"
          prop-name="confirm_password"
          type="password"
          placeholder="请再次输入密码"
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
