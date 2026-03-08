<!-- :disabled="isDisabledName" -->
<template>
  <div class="editor-container">
    <a-form ref="formRef" :model="entity" :rules="rules" class="editor-form">
      <a-form-item label="标题" name="title">
        <a-input v-model:value="entity.title" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item class="editor-quill-item">
        <QuillEditor class="editor-quill-content" ref="quillEditorRef" v-model:content="entity.content"
          contentType="html" :options="editorOption" @ready="handleEditorReady" />
      </a-form-item>

      <a-form-item label="文档类型" name="type">
        <a-select v-model:value="entity.type" style="width: 200px">
          <a-select-option v-for="(label, value) in DocTypeEnumMap" :key="value" :value="Number(value)">
            {{ label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="文档状态" name="status">
        <a-select v-model:value="entity.status" style="width: 200px">
          <a-select-option v-for="(label, value) in DocStatusEnumMap" :key="value" :value="Number(value)">
            {{ label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <div class="form-actions">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, defineEmits, defineExpose, onUnmounted } from "vue";
import { message, FormInstance } from "ant-design-vue";
import { QuillEditor, Quill } from "@vueup/vue-quill";
import quillTool from "./quillTool";
// https://quilljs.com/
import "@vueup/vue-quill/dist/vue-quill.core.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

import {
  DocTypeEnum,
  DocStatusEnum,
  DocTypeEnumMap,
  DocStatusEnumMap,
} from "@/enums/customEnum";
import ImageUploadHandler from "./ImageUploadHandler";

// 注册QuillEditor插件和模块
Quill.register(quillTool, true);
// 移除 ImageExtend 的注册
// Quill.register("modules/ImageExtend", ImageExtend);
const Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '36px', '40px', '48px']
Quill.register(Size, true)

// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ size: Size.whitelist }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["link", "image", "video"], // 链接、图片、视频
];

// 表单和编辑器引用
const formRef = ref<FormInstance>();
const quillEditorRef = ref();

// 表单数据
interface EntityType {
  id?: number;
  title: string | null;
  content: string | null;
  type: DocTypeEnum;
  status: DocStatusEnum;
}

const entity = reactive<EntityType>({
  id: undefined,
  title: null,
  content: null,
  type: DocTypeEnum.USER_MANUAL,
  status: DocStatusEnum.NORMAL,
});

// 其他状态
const submitLoading = ref(false);
const dialogTableVisible = ref(false);
const titleStatus = ref("create");
const isDisabledName = ref(false);

// 表单验证规则
const rules = {
  title: [
    { required: true, message: "请输入文档标题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在100个字符以内", trigger: "blur" },
  ],
  content: [{ required: true, message: "请输入文档内容", trigger: "blur" }],
  type: [{ required: true, message: "请选择文档类型", trigger: "change" }],
  status: [{ required: true, message: "请选择文档状态", trigger: "change" }],
};


// 编辑器配置
const editorOption = {
  theme: "snow",
  placeholder: "请输入",
  modules: {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: function (this: any) {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            const quill = this.quill;
            const uploadHandler = new ImageUploadHandler(quill);
            uploadHandler.uploadImage(file, {
              idPrefix: 'img-upload',
              loadingMessage: '图片上传中...',
              successMessage: '图片上传成功',
              showSuccessMessage: true,
              showErrorMessage: true
            });
          };
        },
        link: function (this: any, value: boolean) {
          if (value) {
            const href = prompt("请输入链接地址：");
            this.quill.format("link", href);
          } else {
            this.quill.format("link", false);
          }
        },
        video: function (this: any, value: boolean) {
          if (value) {
            const href = prompt("请输入视频地址：");
            this.quill.format("video", href);
          } else {
            this.quill.format("video", false);
          }
        },
      },
    },
  },
};



// 存储编辑器实例和监听器，用于清理
let editorInstance: any = null;
let pasteListener: ((event: ClipboardEvent) => void) | null = null;

// 编辑器就绪事件处理
const handleEditorReady = (editor: any) => {
  console.log("Editor实例:", editor);

  // 存储编辑器实例
  editorInstance = editor;

  // 添加粘贴事件监听器处理截图粘贴
  const quillEditor = editor.root;
  pasteListener = handlePaste;
  quillEditor.addEventListener('paste', pasteListener);
};

// 组件销毁时清理事件监听器
onUnmounted(() => {
  if (editorInstance && pasteListener) {
    editorInstance.root.removeEventListener('paste', pasteListener);
    editorInstance = null;
    pasteListener = null;
  }
});

// 处理粘贴事件
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  // 遍历粘贴板项目，查找图片
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 检查是否为图片类型
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault(); // 阻止默认粘贴行为

      const file = item.getAsFile();
      if (!file) continue;

      // 获取当前quill实例
      const quill = quillEditorRef.value?.getQuill();
      if (!quill) return;

      // 使用统一的图片上传处理器
      const uploadHandler = new ImageUploadHandler(quill);
      uploadHandler.uploadImage(file, {
        idPrefix: 'img-paste',
        showSuccessMessage: false, // 粘贴时不显示成功消息，避免过多提示
        showErrorMessage: true
      });

      break; // 只处理第一个图片
    }
  }
};



// 声明props和emits
const emit = defineEmits(["save", "cancel"]);
const record = ref<any>(null); // 添加record引用存储当前编辑的记录

// 打开编辑对话框
const openEditDialog = (data?: any) => {
  record.value = data; // 存储传入的记录
  dialogTableVisible.value = true;

  // 根据传入的isEdit标记或者判断数据存在性来决定是编辑还是创建模式
  const isEditMode = data?.isEdit === true || (data && data.id);

  if (isEditMode) {
    titleStatus.value = "update";
    isDisabledName.value = true;

    // 将记录数据复制到表单实体中
    entity.id = data.id;
    entity.title = data.title;
    entity.content = data.content;
    entity.type = data.type || DocTypeEnum.USER_MANUAL;
    entity.status = data.status || DocStatusEnum.NORMAL;

    // 设置编辑器内容
    nextTick(() => {
      if (quillEditorRef.value && entity.content) {
        quillEditorRef.value.setHTML(entity.content);
      }
      formRef.value?.clearValidate();
    });
  } else {
    titleStatus.value = "create";
    isDisabledName.value = false;
    cleanData();
  }
};

// 初始化表单数据
const initFormData = (recordData: any) => {
  record.value = recordData; // 存储传入的记录

  // 根据传入的isEdit标记或者判断数据存在性来决定是编辑还是创建模式
  const isEditMode =
    recordData?.isEdit === true || (recordData && recordData.id);

  if (recordData) {
    titleStatus.value = isEditMode ? "update" : "create";
    isDisabledName.value = isEditMode;

    // 将记录数据复制到表单实体中
    entity.id = recordData.id;
    entity.title = recordData.title;
    entity.content = recordData.content;
    entity.type = recordData.type;
    entity.status = recordData.status;

    // 设置编辑器内容
    nextTick(() => {
      if (quillEditorRef.value && entity.content) {
        quillEditorRef.value.setHTML(entity.content);
      }
      formRef.value?.clearValidate();
    });
  } else {
    // 创建模式
    titleStatus.value = "create";
    isDisabledName.value = false;
    cleanData();
  }
};

// 处理表单提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;
    // 提交数据
    console.log("提交数据:", entity);

    // 触发保存事件，将数据传递给父组件
    emit("save", {
      id: titleStatus.value === "update" ? record.value?.id : undefined,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      status: entity.status,
      isUpdate: titleStatus.value === "update", // 添加操作类型标识
    });

    message.success(`${titleStatus.value === "create" ? "新增" : "更新"}成功`);
    close();
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 清空数据
const cleanData = () => {
  entity.id = undefined;
  entity.title = null;
  entity.content = null;
  entity.type = DocTypeEnum.USER_MANUAL;
  entity.status = DocStatusEnum.NORMAL;
};

// 关闭对话框
const close = () => {
  dialogTableVisible.value = false;
  cleanData();
  titleStatus.value = "create";

  nextTick(() => {
    if (quillEditorRef.value) {
      quillEditorRef.value.setHTML("");
    }
    formRef.value?.clearValidate();
  });

  // 触发取消事件
  emit("cancel");
};

// 导出方法供外部使用
defineExpose({
  openEditDialog,
  close,
  initFormData,
});
</script>

<style scoped lang="less">


// Less 循环处理字体大小
each(@font-sizes, {
  @size: @value;

  :deep(.ql-picker.ql-size .ql-picker-label[data-value="@{size}"]::before),
  :deep(.ql-picker.ql-size .ql-picker-item[data-value="@{size}"]::before) {
    content: "@{size}";
  }
});

.flexcolumn(@flex: 1 1 0%) {
  display: flex;
  flex: @flex;
  flex-direction: column;
}

.title {
  margin: 0 0 20px 24px;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }
}

.editor-container {
  position: relative;
  .flexcolumn(1);

  margin: 16px 32px 0;
  background-color: #fff;
}

.editor-form {
  .flexcolumn();

  height: 100%;
  min-height: 0;
}

.editor-quill-item {
  .flexcolumn();

  height: 100%;
  margin-bottom: 16px;

  &:deep(.ant-row) {
    .flexcolumn();

    height: 100%;

    .ant-form-item-control-input {
      height: 100%;
      .flexcolumn();

      .ant-form-item-control-input-content {
        width: 100%;
        height: 100%;
        .flexcolumn();
      }
    }
  }

  &:deep(.ql-container) {
    // min-height: 200px !important;
    // max-height: 500px;
    overflow-y: auto;
  }
}



.editor-quill-item :deep(.quill-editor),
.editor-quill-item :deep(.ql-container) {
  .flexcolumn();

  height: 100%;
  min-height: 0;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

:deep(.el-form-item__content) {
  display: inline;
}

:deep(.el-dialog__footer) {
  margin-top: 10px;
}

:deep(.ql-container) {
  width: auto;
  height: 300px;
  margin-bottom: 20px;
  line-height: normal;
}

:deep(span.ql-size) {
  max-width: 80px !important;
}

:deep(.ql-tooltip[data-mode="link"]::before) {
  content: "请输入链接地址:";
}

:deep(.ql-tooltip.ql-editing a.ql-action::after) {
  padding-right: 0;
  content: "保存";
  border-right: 0;
}

:deep(.ql-tooltip[data-mode="video"]) {
  left: 0 !important;
}

:deep(.ql-tooltip[data-mode="video"]::before) {
  content: "请输入视频地址:";
}

:deep(.ql-picker.ql-size .ql-picker-label::before),
:deep(.ql-picker.ql-size .ql-picker-item::before) {
  content: "14px";
}

// :deep(.ql-picker.ql-size .ql-picker-label[data-value="small"]::before),
// :deep(.ql-picker.ql-size .ql-picker-item[data-value="small"]::before) {
//   content: "10px";
// }

// :deep(.ql-picker.ql-size .ql-picker-label[data-value="12px"]::before),
// :deep(.ql-picker.ql-size .ql-picker-item[data-value="12px"]::before) {
//   content: "12px";
// }


// :deep(.ql-picker.ql-size .ql-picker-label[data-value="large"]::before),
// :deep(.ql-picker.ql-size .ql-picker-item[data-value="large"]::before) {
//   content: "18px";
// }

// :deep(.ql-picker.ql-size .ql-picker-label[data-value="huge"]::before),
// :deep(.ql-picker.ql-size .ql-picker-item[data-value="huge"]::before) {
//   content: "32px";
// }

:deep(.ql-picker.ql-header .ql-picker-label::before),
:deep(.ql-picker.ql-header .ql-picker-item::before) {
  content: "文本";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="1"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="1"]::before) {
  content: "标题1";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="2"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="2"]::before) {
  content: "标题2";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="3"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="3"]::before) {
  content: "标题3";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="4"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="4"]::before) {
  content: "标题4";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="5"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="5"]::before) {
  content: "标题5";
}

:deep(.ql-picker.ql-header .ql-picker-label[data-value="6"]::before),
:deep(.ql-picker.ql-header .ql-picker-item[data-value="6"]::before) {
  content: "标题6";
}

:deep(.ql-picker.ql-font .ql-picker-label::before),
:deep(.ql-picker.ql-font .ql-picker-item::before) {
  content: "标准字体";
}

:deep(.ql-picker.ql-font .ql-picker-label[data-value="serif"]::before),
:deep(.ql-picker.ql-font .ql-picker-item[data-value="serif"]::before) {
  content: "衬线字体";
}

:deep(.ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before),
:deep(.ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before) {
  content: "等宽字体";
}// 字体大小循环配置
@font-sizes: '10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '36px', '40px', '48px';
</style>