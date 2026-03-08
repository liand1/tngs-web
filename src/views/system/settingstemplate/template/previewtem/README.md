# 模板预览组件

这个组件用于预览模板内容，支持多页面预览、翻页、自动播放和PDF导出等功能。模板内容会根据纸张尺寸自动分页，并提供友好的交互体验。

## 文件结构

```
previewtem/
├── components/             # 子组件目录
│   ├── PaginationControl.vue    # 分页控制组件
│   ├── AutoplayControl.vue      # 自动播放控制组件
│   ├── PdfExportButton.vue      # PDF导出按钮组件
│   └── PageArrows.vue           # 页面侧边翻页箭头组件
├── index.ts                # 核心工具函数
├── index.vue               # 主组件
├── htmltopdf.ts            # HTML导出PDF相关功能
├── pdfmerge.ts             # PDF合并相关功能
├── model.ts                # 类型定义
└── README.md               # 说明文档
```

## 各文件作用

1. **index.vue**：组件主文件，提供模板预览的UI和交互逻辑
2. **index.ts**：提供DPI计算、页面尺寸转换、页数计算等核心工具函数
3. **htmltopdf.ts**：HTML转PDF的相关功能实现
4. **pdfmerge.ts**：提供将多个PDF文件合并为一个的功能
5. **model.ts**：所有类型定义和接口声明
6. **components/**：包含所有子组件
   - **PaginationControl.vue**：分页控制组件，提供页码显示、上一页/下一页按钮
   - **AutoplayControl.vue**：自动播放控制，提供开始/暂停自动翻页功能
   - **PdfExportButton.vue**：导出PDF按钮组件，提供PDF导出功能
   - **PageArrows.vue**：页面两侧的翻页箭头组件

## 参数说明

### 主组件属性(Props)

组件的props通过对象组织，便于管理和扩展：

1. **templateInfo**：模板基本信息

   ```typescript
   templateInfo: {
     id: number;      // 模板ID
     title: string;   // 模板标题
     code: string;    // 模板代码
   }
   ```

2. **pagination**：分页控制相关配置

   ```typescript
   pagination: {
     show: boolean;      // 是否显示翻页功能
     showPageInfo: boolean; // 是否在页面底部显示页码信息
   }
   ```

3. **autoplay**：自动播放控制配置

   ```typescript
   autoplay: {
     show: boolean;      // 是否显示自动播放按钮
     interval: number;   // 自动播放间隔（毫秒）
   }
   ```

4. **pageArrows**：页面箭头相关配置

   ```typescript
   pageArrows: {
     show: boolean;       // 是否显示页面两侧翻页箭头
     size: number;        // 翻页箭头大小
     edgeDistance: number; // 翻页箭头距离边缘距离
     iconSize: number;     // 翻页箭头图标大小
   }
   ```

5. **pageStyle**：页面样式相关配置

   ```typescript
   pageStyle: {
     paperSize: "A3" | "A4" | "B3" | "B4";  // 纸张类型
     orientation: "portrait" | "landscape";  // 纸张方向
   }
   ```

### 暴露的方法

组件通过 `defineExpose` 暴露以下方法：

1. **初始化和内容控制**
   - `init(params: InitParamsType)`: 初始化组件
   - `setContent(content: string)`: 设置HTML内容
   - `setTemplateInfo(info: {id?: number; title?: string; code?: string})`: 设置模板信息

2. **PDF导出**
   - `exportPdf()`: 导出PDF文档

3. **页面导航**
   - `prevPage()`: 上一页
   - `nextPage()`: 下一页
   - `setCurrentPage(page: number)`: 设置当前页
   - `getCurrentPage()`: 获取当前页码
   - `getTotalPages()`: 获取总页数

4. **自动播放控制**
   - `startAutoplay()`: 开始自动播放
   - `stopAutoplay()`: 停止自动播放

5. **配置获取**
   - `getConfig()`: 获取当前配置

## 核心功能说明

### 页面尺寸计算

根据纸张类型和方向计算像素尺寸，支持A3、A4、B3、B4纸张。

```typescript
// 计算纸张像素尺寸
const size = pageSizeInPixels('A4', 'portrait');
console.log(size); // { width: 595, height: 842 }
```

### 页数计算

根据HTML内容和页面尺寸自动计算所需页数。

```typescript
// 计算HTML内容需要的页数
calculateContentPageCount(htmlContent, pageSize)
  .then(pageCount => console.log(`需要 ${pageCount} 页`));
```

### PDF导出功能

提供多种导出选项，包括页面大小、方向、字体等。

```typescript
// 导出HTML为PDF
exportElementToPdf(contentElement, { 
  title: '测试文档', 
  code: 'TEST-001' 
});
```

### PDF合并功能

支持将多个PDF文件合并为一个PDF文件，使用pdf-lib库实现。

```typescript
// 合并多个PDF文件
import { mergePDFs, saveMergedPDF } from '@/views/system/settingstemplate/template/previewtem';

async function mergePdfFiles() {
  // 可以是URL或二进制数据
  const pdfSources = [
    '/path/to/file1.pdf',  // URL路径
    pdfBinaryData,         // Uint8Array 数据
    blobUrl                // Blob URL
  ];
  
  // 合并PDF
  const result = await mergePDFs(pdfSources, { 
    filename: '合并文档'   // 可选，指定文件名（不含扩展名）
  });
  
  // 保存合并后的PDF
  saveMergedPDF(result.data, result.filename);
}
```

#### 将HTML内容转为PDF后合并

```typescript
// 将多个HTML内容转为PDF后合并
import { htmlToPdfAndMerge } from '@/views/system/settingstemplate/template/previewtem';

async function convertHtmlAndMergePdf() {
  // HTML内容数组
  const htmlContents = [
    document.getElementById('content1'),  // DOM元素
    '<div><h1>第二页内容</h1><p>这是内容</p></div>'  // HTML字符串
  ];
  
  // 转换并合并
  const result = await htmlToPdfAndMerge(htmlContents, {
    exportOptions: {
      title: '合并文档',
      orientation: 'portrait',
      footer: { enabled: true }
    },
    filename: '合并的HTML文档'
  });
  
  // 保存合并后的PDF
  saveMergedPDF(result.data, result.filename);
}
```

## 使用示例

### 基本使用

```vue
<template>
  <div>
    <a-button @click="showPreview">预览模板</a-button>
    <div v-if="isPreviewVisible">
      <PreviewTem ref="previewRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import PreviewTem from '@/views/system/settingstemplate/template/previewtem/index.vue'

const previewRef = ref()
const isPreviewVisible = ref(false)

// 显示预览
const showPreview = () => {
  isPreviewVisible.value = true
  
  // 使用 nextTick 确保组件已渲染
  nextTick(() => {
    previewRef.value.init({
      id: 123, // 模板ID（可选）
      title: '测试模板', // 模板标题（可选）
      code: 'TEST-001', // 模板代码（可选）
      htmlContent: `
        <style>
          .section { margin-bottom: 20px; }
          .title { font-size: 18px; font-weight: bold; }
        </style>
        <div>
          <div class="page-section">
            <div class="title">第一部分内容</div>
            <p>这是测试内容</p>
          </div>
          <div class="page-section">
            <div class="title">第二部分内容</div>
            <p>这是另一部分测试内容</p>
          </div>
        </div>
      `
    })
  })
}
</script>
```

### 自定义配置

```vue
<template>
  <PreviewTem
    :templateInfo="{ id: 123, title: '自定义模板', code: 'CUSTOM-001' }"
    :pagination="{ show: true, showPageInfo: true }"
    :autoplay="{ show: true, interval: 3000 }"
    :pageArrows="{ show: true, size: 40, edgeDistance: 15, iconSize: 24 }"
    :pageStyle="{ paperSize: 'A4', orientation: 'landscape' }"
    ref="previewRef"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import PreviewTem from '@/views/system/settingstemplate/template/previewtem/index.vue'

const previewRef = ref()

onMounted(() => {
  // 设置HTML内容
  previewRef.value.setContent(`
    <h1>自定义配置示例</h1>
    <p>这是一个使用自定义配置的预览模板示例</p>
  `)
  
  // 开始自动播放
  previewRef.value.startAutoplay()
})

// 导出PDF
const exportToPdf = () => {
  previewRef.value.exportPdf()
}
</script>
```

## HTML内容的特殊处理

为了更好地支持分页和导出，HTML内容中可以使用以下特殊类名：

1. `.page-section`：表示一个可能需要分页的内容区块
2. `.avoid-break`：表示不希望在其中间分页的元素
3. `.section-title`：表示章节标题，会尽量在其前面进行分页

例如：

```html
<div class="page-section">
  <h2 class="section-title">第一章</h2>
  <p>这是第一章的内容...</p>
  
  <div class="avoid-break">
    <!-- 此元素不会在内部分页 -->
    <img src="example.jpg" />
    <p>图片说明</p>
  </div>
</div>
```

## 分页逻辑

模板预览组件使用以下策略进行内容分页：

1. 计算内容区域的实际高度
2. 根据页面可用高度（减去页眉页脚和边距）计算可容纳的内容量
3. 使用CSS columns属性进行内容分列，实现分页效果
4. 特殊处理图片和表格等元素，确保它们不会被分页拆分
