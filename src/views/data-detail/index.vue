<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MyUserCard from '@/components/common/my-user-card.vue';
import { userDetailStore } from '@/store/modules/detail';

const { getDataDetail } = userDetailStore()
const dataDetail = ref(getDataDetail())
</script>

<template>
  <div class="min-h-500px ">
    <MyUserCard :userInfo="dataDetail.user" />
  </div>
</template>

<style scoped></style>
