<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
defineOptions({
  name: 'SpotWithdrawSearchBox'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel('model', { required: true });

const auditStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核驳回', value: 2 }
];

const rangeShortcuts = ref({
  今日: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
  昨日: [dayjs().subtract(1, 'day').startOf('day').toDate(), dayjs().subtract(1, 'day').endOf('day').toDate()],
  最近7天: [dayjs().subtract(7, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
  最近30天: [dayjs().subtract(30, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
});

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
            <NFormItemGi span="24 s:12 m:8 l:6" label="审核状态" path="audit_status" class="pr-24px">
              <NSelect v-model:value="model.audit_status" placeholder="请选择审核状态" :options="auditStatusOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8 l:6" label="申请时间" path="created_at" class="pr-24px">
              <NDatePicker 
              v-model:value="model.range.created_at" type="datetimerange"
              clearable
              :shortcuts="rangeShortcuts"
              :default-time="['00:00:00', '23:59:59']" 
              placeholder="申请时间" />
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
