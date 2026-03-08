import message from "ant-design-vue/es/message";
import { uploadImage, imageToBase64 } from "./index";

// 统一的图片上传处理类
export default class ImageUploadHandler {
  private quill: any;
  private loadingIconUrl: string;

  constructor(quill: any) {
    this.quill = quill;
    this.loadingIconUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAzOCAzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNlNjFmNDIiPg0KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+DQogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMSkiIHN0cm9rZS13aWR0aD0iMiI+DQogICAgICAgICAgICA8Y2lyY2xlIHN0cm9rZS1vcGFjaXR5PSIuNSIgY3g9IjE4IiBjeT0iMTgiIHI9IjE4Ii8+DQogICAgICAgICAgICA8cGF0aCBkPSJNMzYgMThjMC05Ljk0LTguMDYtMTgtMTgtMTgiPg0KICAgICAgICAgICAgICAgIDxhbmltYXRlVHJhbnNmb3JtDQogICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSINCiAgICAgICAgICAgICAgICAgICAgdHlwZT0icm90YXRlIg0KICAgICAgICAgICAgICAgICAgICBmcm9tPSIwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICB0bz0iMzYwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICBkdXI9IjFzIg0KICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPg0KICAgICAgICAgICAgPC9wYXRoPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+";
  }

  /**
   * 创建加载占位符
   */
  private createLoadingPlaceholder(insertIndex: number, idPrefix: string): string {
    this.quill.insertEmbed(insertIndex, "image", this.loadingIconUrl);
    
    const placeholderId = `${idPrefix}-${Date.now()}`;
    const imgNode = this.quill.root.querySelector(`img[src="${this.loadingIconUrl}"]`);
    if (imgNode) {
      imgNode.setAttribute("id", placeholderId);
    }
    
    this.quill.setSelection(insertIndex + 1, 0);
    return placeholderId;
  }

  /**
   * 替换占位符为实际图片
   */
  private replacePlaceholderWithImage(imageUrl: string, placeholderId: string, successMessage: string): void {
    const loadingImg = this.quill.root.querySelector(`#${placeholderId}`);
    if (loadingImg) {
      loadingImg.setAttribute("src", imageUrl);
      loadingImg.removeAttribute("id");
      if (successMessage) {
        message.success(successMessage);
      }
    } else {
      const currentRange = this.quill.getSelection();
      const index = currentRange ? currentRange.index : this.quill.getLength() - 1;
      this.quill.insertEmbed(index, "image", imageUrl);
      if (successMessage) {
        message.success(successMessage);
      }
    }
  }

  /**
   * 处理上传失败 - 显示裂图
   */
  private handleUploadError(placeholderId: string, errorMessage: string): void {
    const brokenImageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1IiBzdHJva2U9IiNEOUQ5RDkiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMjAgMjBMMzIgMzJNMzIgMzJMNDQgNDRNMzIgMzJMNDQgMjBNMzIgMzJMMjAgNDQiIHN0cm9rZT0iI0ZGNEQyOCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2Zz4K";
    this.replacePlaceholderWithImage(brokenImageUrl, placeholderId, errorMessage);
  }

  /**
   * 统一的图片上传处理方法
   */
  async uploadImage(file: File, options: {
    idPrefix: string;
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    loadingMessage?: string;
    successMessage?: string;
  }): Promise<void> {
    // 检查文件大小
    if (file.size > 1024 * 1024) {
      message.error("图片大小不能超过1MB!");
      return;
    }

    const range = this.quill.getSelection(true);
    const insertIndex = range ? range.index : this.quill.getLength() - 1;
    const placeholderId = this.createLoadingPlaceholder(insertIndex, options.idPrefix);

    let loadingMsg: any = null;
    if (options.loadingMessage) {
      loadingMsg = message.loading(options.loadingMessage, 0);
    }

    try {
      const result = await uploadImage(file);
      
      if (loadingMsg) {
        loadingMsg();
      }

      const successMessage = options.showSuccessMessage !== false ? (options.successMessage || "图片上传成功") : '';
      this.replacePlaceholderWithImage(result.url, placeholderId, successMessage);

    } catch (error) {
      if (loadingMsg) {
        loadingMsg();
      }

      // 上传失败，显示裂图（错误图标）
      const brokenImageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1IiBzdHJva2U9IiNEOUQ5RDkiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMjAgMjBMMzIgMzJNMzIgMzJMNDQgNDRNMzIgMzJMNDQgMjBNMzIgMzJMMjAgNDQiIHN0cm9rZT0iI0ZGNEQyOCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2Zz4K";
      
      const errorMessage = options.showErrorMessage !== false ? "图片上传失败" : '';
      this.replacePlaceholderWithImage(brokenImageUrl, placeholderId, errorMessage);
    }
  }
}
