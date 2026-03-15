<template>
  <!-- AI助手浮动按钮 -->
  <FloatButton
    v-bind="floatButtonProps"
    @click="toggleWindow"
  >
    <template #icon>
      <RobotOutlined />
    </template>
  </FloatButton>

  <!-- AI悬浮窗口 -->
  <div
    v-if="windowVisible"
    ref="floatingWindowRef"
    class="floating-window"
    :style="{
      left: `${windowLeft}px`,
      top: `${windowTop}px`,
      width: `${windowWidth}px`,
      height: `${windowHeight}px`,
      display: windowMinimized ? 'none' : 'flex',
    }"
  >
    <!-- 标题栏（用于拖拽） -->
    <div class="floating-window-header" ref="headerRef" @mousedown="startDrag">
      <div class="header-title">
        <RobotOutlined class="title-icon" />
        <span>AI助手</span>
      </div>
      <div class="header-actions">
        <a-button
          type="text"
          size="small"
          class="action-btn"
          @click="toggleMinimize"
        >
          <template #icon>
            <MinusOutlined />
          </template>
        </a-button>
        <a-button
          type="text"
          size="small"
          class="action-btn"
          @click="closeWindow"
        >
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="floating-window-body">
      <div class="chat-container">
        <!-- 消息列表 -->
        <div class="message-list" ref="messageListRef">
          <div v-if="messages.length === 0" class="empty-state">
            <MessageOutlined class="empty-icon" />
            <p class="empty-text">您好！我是AI助手，有什么可以帮您的吗？</p>
          </div>

          <div v-else class="messages">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message-item', msg.sender === 'user' ? 'message-user' : 'message-ai']"
            >
              <div class="message-avatar">
                <UserOutlined v-if="msg.sender === 'user'" />
                <RobotOutlined v-else />
              </div>
              <div class="message-content">
                {{ msg.content }}
              </div>
            </div>

            <!-- 加载指示器 -->
            <div v-if="loading" class="loading-indicator">
              <a-spin size="small" />
              <span class="loading-text">AI正在思考中...</span>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <a-textarea
            v-model:value="inputValue"
            placeholder="请输入您的问题..."
            :rows="2"
            :maxlength="500"
            auto-size
            @press-enter="handleSendMessage"
            :disabled="loading"
          />
          <div class="input-actions">
            <a-button
              type="primary"
              size="small"
              :loading="loading"
              :disabled="!inputValue.trim() || loading"
              @click="handleSendMessage"
            >
              <template #icon>
                <SendOutlined />
              </template>
              发送
            </a-button>
          </div>
          <div class="input-hint">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>
    </div>

    <!-- 调整大小句柄（右下角） -->
    <div
      class="resize-handle"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import {
  FloatButton,
  message as antMessage
} from 'ant-design-vue'
import {
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  SendOutlined,
  MinusOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'
import sendMessageToAI from './api'

// 类型定义
interface ChatMessage {
  sender: 'user' | 'ai'
  content: string
}

// 响应式状态
const windowVisible = ref(false)
const windowMinimized = ref(false)
const windowLeft = ref(100)
const windowTop = ref(100)
const windowWidth = ref(400)
const windowHeight = ref(500)
const inputValue = ref('')
const messages = ref<ChatMessage[]>([])
const loading = ref(false)
const messageListRef = ref<HTMLElement>()
const floatingWindowRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()

// 拖拽状态
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartLeft = ref(0)
const dragStartTop = ref(0)

// 调整大小状态
const isResizing = ref(false)
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)

// 浮动按钮属性
const floatButtonProps = computed(() => ({
  shape: 'circle' as const,
  type: 'primary' as const,
  tooltip: 'AI助手',
  style: {
    right: '120px',
    bottom: '24px',
  }
}))

// 方法
const toggleWindow = () => {
  windowVisible.value = !windowVisible.value
  if (windowVisible.value) {
    windowMinimized.value = false
  }
}

const closeWindow = () => {
  windowVisible.value = false
}

const toggleMinimize = () => {
  windowMinimized.value = !windowMinimized.value
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const handleSendMessage = async () => {
  const content = inputValue.value.trim()
  if (!content || loading.value) return

  // 添加用户消息
  const userMessage: ChatMessage = { sender: 'user', content }
  messages.value.push(userMessage)
  inputValue.value = ''

  // 滚动到底部
  scrollToBottom()

  // 发送到AI
  loading.value = true
  try {
    const aiResponse = await sendMessageToAI(content)

    // 添加AI回复
    const aiMessage: ChatMessage = { sender: 'ai', content: aiResponse }
    messages.value.push(aiMessage)
  } catch (error: any) {
    console.error('发送消息失败:', error)
    antMessage.error(`发送失败: ${error.message || '网络错误'}`)

    // 可以添加错误消息
    const errorMessage: ChatMessage = {
      sender: 'ai',
      content: `抱歉，出现错误: ${error.message || '请稍后重试'}`
    }
    messages.value.push(errorMessage)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// 拖拽和调整大小方法
const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragStartLeft.value = windowLeft.value
  dragStartTop.value = windowTop.value
}

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  resizeStartX.value = e.clientX
  resizeStartY.value = e.clientY
  resizeStartWidth.value = windowWidth.value
  resizeStartHeight.value = windowHeight.value
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    const deltaX = e.clientX - dragStartX.value
    const deltaY = e.clientY - dragStartY.value
    let newLeft = dragStartLeft.value + deltaX
    let newTop = dragStartTop.value + deltaY

    // 边界检测：防止拖出可视区域
    const maxLeft = window.innerWidth - windowWidth.value
    const maxTop = window.innerHeight - windowHeight.value
    newLeft = Math.max(0, Math.min(newLeft, maxLeft))
    newTop = Math.max(0, Math.min(newTop, maxTop))

    windowLeft.value = newLeft
    windowTop.value = newTop
  }

  if (isResizing.value) {
    const deltaX = e.clientX - resizeStartX.value
    const deltaY = e.clientY - resizeStartY.value
    let newWidth = resizeStartWidth.value + deltaX
    let newHeight = resizeStartHeight.value + deltaY

    // 最小尺寸限制
    const minWidth = 300
    const minHeight = 400
    newWidth = Math.max(minWidth, newWidth)
    newHeight = Math.max(minHeight, newHeight)

    // 最大尺寸限制（不超过视口）
    const maxWidth = window.innerWidth - windowLeft.value
    const maxHeight = window.innerHeight - windowTop.value
    newWidth = Math.min(newWidth, maxWidth)
    newHeight = Math.min(newHeight, maxHeight)

    windowWidth.value = newWidth
    windowHeight.value = newHeight
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
}

// 全局事件监听
// 加载保存的窗口状态
const loadWindowState = () => {
  try {
    const saved = localStorage.getItem('aiAssistantWindowState')
    if (saved) {
      const state = JSON.parse(saved)
      windowLeft.value = state.left ?? 100
      windowTop.value = state.top ?? 100
      windowWidth.value = state.width ?? 400
      windowHeight.value = state.height ?? 500
    }
  } catch (e) {
    console.error('Failed to load window state', e)
  }
}

// 保存窗口状态
const saveWindowState = () => {
  try {
    const state = {
      left: windowLeft.value,
      top: windowTop.value,
      width: windowWidth.value,
      height: windowHeight.value,
    }
    localStorage.setItem('aiAssistantWindowState', JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save window state', e)
  }
}

onMounted(() => {
  loadWindowState()
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

// 监听窗口位置和尺寸变化，自动保存
watch([windowLeft, windowTop, windowWidth, windowHeight], () => {
  saveWindowState()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped lang="less">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  margin-bottom: 16px;
  border-radius: 8px;
  max-height: 400px;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      color: #1890ff;
      opacity: 0.3;
    }

    .empty-text {
      font-size: 14px;
      color: #666;
    }
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message-item {
    display: flex;
    gap: 8px;
    animation: fadeIn 0.3s ease;

    &.message-user {
      flex-direction: row-reverse;

      .message-avatar {
        background: #1890ff;
        color: white;
      }

      .message-content {
        background: #1890ff;
        color: white;
        border-radius: 12px 12px 0 12px;
      }
    }

    &.message-ai {
      .message-avatar {
        background: #e61f42;
        color: white;
      }

      .message-content {
        background: white;
        border: 1px solid #e8e8e8;
        border-radius: 12px 12px 12px 0;
      }
    }

    .message-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .message-content {
      max-width: 70%;
      padding: 8px 12px;
      line-height: 1.5;
      word-break: break-word;
      white-space: pre-wrap;
    }
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    gap: 8px;
    color: #999;

    .loading-text {
      font-size: 14px;
    }
  }
}

.input-area {
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;

  :deep(.ant-input) {
    resize: none;
  }

  .input-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .input-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}

/* 悬浮窗口样式 */
.floating-window {
  position: fixed;
  z-index: 2000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  resize: none; /* 禁用浏览器默认调整大小 */
}

.floating-window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #e61f42;
  color: white;
  cursor: move;
  user-select: none;
  flex-shrink: 0;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;

    .title-icon {
      font-size: 16px;
    }
  }

  .header-actions {
    display: flex;
    gap: 4px;

    .action-btn {
      color: white;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.floating-window-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .chat-container {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #fafafa;
      margin-bottom: 16px;
      border-radius: 8px;
      max-height: none; /* 覆盖原有 max-height */
    }

    .input-area {
      border-top: 1px solid #e8e8e8;
      padding-top: 16px;
      flex-shrink: 0;
    }
  }
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, #e61f42 50%);
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
