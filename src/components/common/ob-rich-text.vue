<script>
import { onMounted, ref, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const quillEditor = ref(null);
    let quill = null;

    onMounted(() => {
      // 初始化 Quill 编辑器
      quill = new Quill(quillEditor.value, {
        theme: 'snow',
        placeholder: 'Type something...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image']
          ]
        }
      });

      // 设置初始内容
      quill.root.innerHTML = props.modelValue;

      // 监听编辑器内容变化
      quill.on('text-change', () => {
        emit('update:modelValue', quill.root.innerHTML);
      });
    });

    // 监听 props 变化并同步到编辑器
    watch(
      () => props.modelValue,
      newValue => {
        if (quill && quill.root.innerHTML !== newValue) {
          quill.root.innerHTML = newValue;
        }
      }
    );

    return {
      quillEditor
    };
  }
};
</script>

<template>
  <div>
    <div ref="quillEditor" :style="{ height: height }" />
  </div>
</template>

<style>
/* 自定义 Quill 样式 */
.ql-container {
  border: 1px solid #ccc;
}
</style>
