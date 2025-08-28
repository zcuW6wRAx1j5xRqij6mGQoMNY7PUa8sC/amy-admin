<script setup lang="ts">
import { defineProps } from 'vue';
import { setBaseUrl } from "@/utils/utils"
const props = defineProps({
  userInfo: {
    type: Object,
    default: {}
  },
  uid: {
    type: Number,
    default: null
  }
});

</script>

<template>
  <div class="gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="用户信息" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <n-descriptions label-placement="top" title="">
        <n-descriptions-item label="用户ID" :span="2">
          {{ userInfo.id }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱" :span="2">
          {{ userInfo.email }}
        </n-descriptions-item>
        <n-descriptions-item label="姓名" :span="2">
          {{ userInfo.name }}
        </n-descriptions-item>
        <n-descriptions-item label="昵称" :span="2">
          {{ userInfo.nickname }}
        </n-descriptions-item>
        <n-descriptions-item label="国际区号" :span="2">
          {{ userInfo.phone_code }}
        </n-descriptions-item>
        <n-descriptions-item label="手机号" :span="2">
          {{ userInfo.phone }}
        </n-descriptions-item>
        <n-descriptions-item label="邀请码" :span="2">
          {{ userInfo.invite_code }}
        </n-descriptions-item>
        <n-descriptions-item label="上级ID" :span="2">
          {{ userInfo.parent_id }}
        </n-descriptions-item>
        <n-descriptions-item label="角色ID" :span="2">
          {{ userInfo.role_id }}
        </n-descriptions-item>
        <n-descriptions-item label="用户等级ID" :span="2">
          {{ userInfo.level_id }}
        </n-descriptions-item>
        <n-descriptions-item label="信用分" :span="2">
          {{ userInfo.credit }}
        </n-descriptions-item>
        <n-descriptions-item label="是否实名认证" :span="2">
          {{ userInfo.is_kyc ? '是' : '否' }}
        </n-descriptions-item>
        <n-descriptions-item label="KYC数据" :span="2">
          {{ userInfo.kyc_data }}
        </n-descriptions-item>
        <n-descriptions-item label="头像" :span="2">
          <img :src="setBaseUrl(userInfo.avatar)" class="w-60px h-60px" alt="">
        </n-descriptions-item>
        <n-descriptions-item label="状态" :span="2">
          {{ userInfo.status ? '正常' : '禁用' }}
        </n-descriptions-item>
        <n-descriptions-item label="注册IP" :span="2">
          {{ userInfo.register_ip }}
        </n-descriptions-item>
        <n-descriptions-item label="注册设备" :span="2">
          {{ userInfo.regsiter_device }}
        </n-descriptions-item>
        <n-descriptions-item label="最后登录时间" :span="2">
          {{ userInfo.last_login_at }}
        </n-descriptions-item>
        <n-descriptions-item label="最后登录IP" :span="2">
          {{ userInfo.last_login_ip }}
        </n-descriptions-item>
        <n-descriptions-item label="最后登录设备" :span="2">
          {{ userInfo.last_login_device }}
        </n-descriptions-item>
        <n-descriptions-item label="备注" :span="2">
          {{ userInfo.remark }}
        </n-descriptions-item>
        <n-descriptions-item label="注册时间" :span="2">
          {{ userInfo.created_at }}
        </n-descriptions-item>
        <n-descriptions-item label="最近时间" :span="2">
          {{ userInfo.updated_at }}
        </n-descriptions-item>
      </n-descriptions>
    </NCard>
  </div>
</template>