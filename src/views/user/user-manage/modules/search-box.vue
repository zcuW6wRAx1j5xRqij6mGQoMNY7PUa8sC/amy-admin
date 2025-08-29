<script setup lang="ts">
defineOptions({
  name: 'UserSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const statusOptions = [
  { label: '关闭', value: 0 },
  { label: '开启', value: 1 }
];

const identityOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 1 }
];

const roleTypeOptions = [
  { label: '普通账号', value: 1 },
  { label: '内部账号', value: 2 },
  { label: '测试账号', value: 3 }
];

const fundsLockOptions = [
  { label: '未锁定', value: 0 },
  { label: '已锁定', value: 1 }
];

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="control-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8 l:6" label="用户ID" path="uid" class="pr-24px">
              <NInput v-model:value="model.uid" placeholder="请输入用户ID" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="姓名" path="name" class="pr-24px">
              <NInput v-model:value="model.name" placeholder="请输入姓名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="邮箱" path="email" class="pr-24px">
              <NInput v-model:value="model.email" placeholder="请输入邮箱" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="手机号" path="phone" class="pr-24px">
              <NInput v-model:value="model.phone" placeholder="请输入手机号" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="邀请码" path="invite_code" class="pr-24px">
              <NInput v-model:value="model.invite_code" placeholder="请输入邀请码" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="状态" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择状态" :options="statusOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="角色类型" path="role_type" class="pr-24px">
              <NSelect v-model:value="model.role_type" placeholder="请选择角色类型" :options="roleTypeOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="是否实名" path="is_verified_identity" class="pr-24px">
              <NSelect v-model:value="model.is_verified_identity" placeholder="请选择是否实名" :options="identityOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="资金锁定" path="funds_lock" class="pr-24px">
              <NSelect v-model:value="model.funds_lock" placeholder="请选择资金锁定" :options="fundsLockOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 m:6" class="pr-24px">
              <NSpace class="w-full">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  重置
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  搜索
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
