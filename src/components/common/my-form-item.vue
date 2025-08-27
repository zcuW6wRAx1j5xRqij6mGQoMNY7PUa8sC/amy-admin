<script setup>
import { computed, inject } from 'vue';
import { useVModel } from '@vueuse/core';
const props = defineProps({
  propName: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  formType: {
    // date/input/select
    type: String,
    default: 'input'
  },
  dataList: {
    type: Array,
    default: () => []
  },
  onInput: {
    type: Function,
    default:()=>{}
  }
});

// 接受祖先传入的参数，加入ts的标识
const parentInfo = inject('parentInfo');
const allRequired = computed(() => parentInfo.value.allRequired);
const errorObj = computed(() => parentInfo.value.errorObj);
const emit = defineEmits(['update:modelValue']);
const formData = useVModel(props, 'modelValue', emit);
</script>

<template>
  <div class="my-form-item-box">
    <div v-if="label" class="form-label" :class="{ 'is-required': allRequired || isRequired }">
      {{ label }}
    </div>
    <NInput v-if="formType === 'input'" @input="onInput" v-model:value="formData" v-bind="$attrs" :placeholder="`请输入${label}`" />
    <NDatePicker
      v-else-if="formType === 'date'"
      v-model:value="formData"
      value-format="yyyy-MM-dd'T'HH:mm:ss"
      type="datetime"
      :placeholder="`请选择${label}`"
      v-bind="$attrs"
    />
    <NSelect
      v-else-if="formType === 'select'"
      v-model:value="formData"
      :placeholder="`请选择${label}`"
      filterable
      v-bind="$attrs"
      :options="dataList"
    ></NSelect>
    <slot />
    <div v-if="errorObj[propName]" class="my-input-error">
      {{ errorObj[propName] }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-input-error {
  color: var(--Danger-Hover, #bd251c);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  /* 133.333% */
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.my-form-item-box {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .form-label {
    font-size: 14px;
    font-family: 'PingFang SC-Regular', 'PingFang SC';
    font-weight: 400;
    color: var(--n-th-text-color);
    line-height: 16px;
    margin-bottom: 8px;
  }

  .is-required::before {
    content: '*';
    display: inline-block;
    position: relative;
    width: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #ff4c38;
    margin-right: 4px;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__wrapper,
  .el-select {
    width: 100%;
    border-radius: 4px;
  }
}
</style>
