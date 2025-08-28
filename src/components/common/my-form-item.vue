<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useVModel } from '@vueuse/core';
import { fetchUploadOss } from '@/service/api/common';
import { friendlyNumber, setBaseUrl } from '@/utils/utils';
import { $t } from '@/locales';

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
    type: [String, Number, Boolean, Object],
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
  options: {
    type: Array,
    default: () => []
  },
  isPrice: {
    type: Boolean,
    default: false
  },
  showPic: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*'
  }
});
// 接受祖先传入的参数，加入ts的标识
const parentInfo = inject('parentInfo');
const allRequired = computed(() => parentInfo.value?.allRequired);
const errorObj = computed(() => parentInfo.value?.errorObj);
const disabled = computed(() => parentInfo.value?.disabled || props.disabled);
const emit = defineEmits(['update:modelValue']);
const formData = useVModel(props, 'modelValue', emit);
const displayValue = ref('');
const uploading = ref(false);
const showPicNew = ref(props.showPic);
// 用于上传组件的文件列表
const fileList = ref([]);

// 监听输入值变化,处理千分位
watch(
  () => formData.value,
  newVal => {
    if (!newVal) {
      showPicNew.value = '';
      return;
    }
    if (newVal && props.formType === 'upload') {
      showPicNew.value = setBaseUrl(newVal);
    }
    if (props.isPrice) {
      // 允许负号和数字
      const numValue = newVal?.toString().replace(/[^\d-]/g, '') || '';
      // 确保负号只在开头出现一次
      const cleanValue = numValue.replace(/-/g, (match, index) => (index === 0 ? '-' : ''));
      // 更新实际值
      formData.value = cleanValue;
      // 更新显示值(添加千分位)
      displayValue.value = friendlyNumber(cleanValue);
    } else {
      displayValue.value = newVal;
    }
  },
  { immediate: true }
);

// 处理输入框输入事件
const handleInput = value => {
  if (props.isPrice) {
    // 允许负号和数字
    const numValue = value?.toString().replace(/[^\d-]/g, '') || '';
    // 确保负号只在开头出现一次
    const cleanValue = numValue.replace(/-/g, (match, index) => (index === 0 ? '-' : ''));
    formData.value = cleanValue;
  } else {
    formData.value = value;
  }
};

// 上传前拦截，调用后端接口
async function handleBeforeUpload({ file }) {
  if (uploading.value) return false;
  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file.file);
  try {
    const res = await fetchUploadOss(formData);
    const url = res.url || '';
    showPicNew.value = res.full_url || '';
    emit('update:modelValue', url);
    return false; // 阻止默认上传
  } catch (e) {
    uploading.value = false;
    return false;
  } finally {
    uploading.value = false;
  }
}

const selectList = computed(() => {
  return props.dataList.length > 0 ? props.dataList : props.options;
});
const inputRef = ref(null);
const focusInput = () => {
  inputRef.value?.focus();
};
defineExpose({
  focusInput
});
</script>

<template>
  <div class="my-form-item-box">
    <div v-if="label" class="form-label" :class="{ 'is-required': allRequired || isRequired }">
      {{ label }}
    </div>
    <div class="relative flex flex-auto items-center">
      <slot name="pre"></slot>
      <NInput
        v-if="formType === 'number'"
        ref="inputRef"
        v-model:value="formData"
        type="number"
        :disabled="disabled"
        v-bind="$attrs"
        :placeholder="`请输入${label}`"
      >
        <template #prefix>
          <slot name="prefix"></slot>
        </template>
        <template #suffix>
          <slot name="suffix"></slot>
        </template>
      </NInput>
      <NInput
        v-else-if="formType === 'input'"
        ref="inputRef"
        :value="isPrice ? displayValue : formData"
        :disabled="disabled"
        v-bind="$attrs"
        :placeholder="`请输入${label}`"
        @update:value="handleInput"
      >
        <template #prefix>
          <slot name="prefix"></slot>
        </template>
        <template #suffix>
          <slot name="suffix"></slot>
        </template>
      </NInput>
      <NDatePicker
        v-else-if="formType === 'datetimerange'"
        v-model:value="formData"
        type="datetimerange"
        :placeholder="`请选择${label}`"
        :disabled="disabled"
        v-bind="$attrs"
      />
      <NDatePicker
        v-else-if="formType === 'datetime'"
        v-model:value="formData"
        type="datetime"
        :placeholder="`请选择${label}`"
        :disabled="disabled"
        v-bind="$attrs"
      />
      <NDatePicker
        v-else-if="formType === 'date'"
        v-model:value="formData"
        type="date"
        :placeholder="`请选择${label}`"
        :disabled="disabled"
        v-bind="$attrs"
      />
      <NTimePicker
        v-else-if="formType === 'time'"
        v-model:value="formData"
        type="time"
        :placeholder="`请选择${label}`"
        :disabled="disabled"
        v-bind="$attrs"
      />
      <NSelect
        v-else-if="formType === 'select'"
        v-model:value="formData"
        :placeholder="`请选择${label}`"
        filterable
        :disabled="disabled"
        v-bind="$attrs"
        :options="selectList"
      ></NSelect>
      <!-- radio -->
      <NRadioGroup v-else-if="formType === 'radio'" v-model:value="formData" v-bind="$attrs" :disabled="disabled">
        <NSpace>
          <NRadio v-for="item in selectList" :key="item.value" :value="item.value">
            {{ item.label }}
          </NRadio>
        </NSpace>
      </NRadioGroup>
      <div v-else-if="formType === 'upload'" class="flex items-center gap-10px">
        <slot name="upload-file"></slot>
        <NImage v-if="showPicNew && accept === 'image/*'" :src="showPicNew" class="h-100px w-100px flex-shrink-0" />
        <NUpload
          :max="1"
          :file-list="fileList"
          :show-file-list="true"
          :on-before-upload="handleBeforeUpload"
          list-type="picture-card"
          :accept="accept"
          :default-upload="false"
          :disabled="disabled"
        >
          <div v-if="!showPicNew" class="text-icon">
            <icon-ic-round-upload />
          </div>
          <NButton v-else type="primary">重新上传</NButton>
        </NUpload>
      </div>

      <ObRichText v-else-if="formType === 'richText'" v-model="formData" v-bind="$attrs" :disabled="disabled" />
      <slot />
      <slot name="append"></slot>
    </div>
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
  width: 100%;
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
    line-height: 16px;
    margin-right: 16px;
    flex-shrink: 0;
    margin-bottom: 8px;
    color: rgb(var(--base-text-color));
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

  .n-date-picker,
  .el-date-editor.el-input,
  .el-date-editor.el-input__wrapper,
  .el-select {
    width: 100%;
    border-radius: 4px;
  }
}
.text-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
}
.n-time-picker {
  width: 100%;
}
</style>
