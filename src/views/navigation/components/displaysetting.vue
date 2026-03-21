<template>
  <template>
  <a-modal v-model:open="open" title="子系统设置" @ok="handleOk" :width="820">
    <a-row :gutter="[16, 16]" class="display-setting-container">
      <a-col :span="24">
        <a-row class="display-setting-header">
          <a-col :span="14" class="header-title">子系统名称</a-col>
          <a-col :span="3" class="header-actions">
            <div class="action-item">修改配置</div>
          </a-col>
          <a-col :span="3" class="header-actions">
            <div class="action-item">操作</div>
          </a-col>
          <a-col :span="2" class="header-actions">
            <div class="action-item">显示</div>
          </a-col>
          <a-col :span="2" class="header-actions">
            <div class="action-item">置顶</div>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="24">
        <div class="system-list">
          <template v-for="(item, index) in gData">
            <a-row v-if="item.id !== 4" :key="item.id" class="system-item">
              <a-col :span="14" class="system-info">
                <div :class="['icon-wrapper', item.iconClass]">
                  <img :src="`${item.iconSrc}`" v-if="item.iconSrc?.startsWith('http')"/>
                  <img :src="`/public/resource/img/${item.iconSrc}.png`" v-else/>
                </div>

                <div class="system-title">{{ item.title }}</div>
              </a-col>
              <a-col :span="3" class="op-info">
                <a @click="showProject(item)">编辑</a>
              </a-col>
              <a-col :span="3" class="delete-info">
                <a-popconfirm ok-text="确定"
                  title="您确定删除该应用码?"
                    cancel-text="取消"
                    placement="topRight"
                    @confirm="confirmDelete(item.id)">
                  <a v-if="item.id !== 1">删除</a>
                </a-popconfirm>
              </a-col>
              <a-col :span="2" class="system-switch">
                <a-switch
                  v-model:checked="item.visible"
                  :disabled="!item.isSwitch"
                />
              </a-col>
              <a-col :span="2" class="system-pin">
                <a-button
                  v-if="!item.pinned"
                  type="link"
                  class="pin-button"
                  @click="togglePin(index)"
                >
                  <VerticalAlignTopOutlined class="pin-icon" />
                </a-button>
              </a-col>
            </a-row>
          </template>
        </div>
      </a-col>

      <div class="add-div">
        <a-button danger @click="showProject(null)" :disabled="gData.length >= 18 ? true : false">
          <template #icon><PlusOutlined /></template>
          新增应用
        </a-button>
        <div class="add-des" v-if="gData.length >= 18">最多添加16个应用</div>
      </div>
    </a-row>
  </a-modal>
  <CreateProjectModal ref="crRef"
      @success="updateSuccess"></CreateProjectModal>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { VerticalAlignTopOutlined, PlusOutlined } from "@ant-design/icons-vue";
import CreateProjectModal from "./CreateProjectModal.vue";
import { ExternalLink, SystemItem } from "./data";
import { message } from "ant-design-vue";
const crRef = ref<typeof CreateProjectModal>();
// 定义组件间的通信
const emit = defineEmits(["setExternalLinks"]);

const open = ref(false);
const gData = ref<SystemItem[]>([]);

// 组件属性，从外部接收externalLinks进行初始化
// const props = defineProps<{
//   externalLinks: ExternalLink[];
// }>();

// setData(props.externalLinks);

onMounted(() => {
  //   debugger;
  //   if (nextPinned) {
  //     item.pinned = true;
  //     return;
  //   }
  //   if (item.id === 1) {
  //     nextPinned = true;
  //   }
  // });
  // sortItems();
});

async function setData(externalLinks: ExternalLink[]) {
  gData.value = externalLinks.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    iconClass: link.iconClass,
    iconSrc: link.iconSrc,
    visible: link.hidden !== true, // 如果hidden为true，则visible为false
    // pinned: link.id === 1 ? true : link.pinned === true, // ID为1的项始终置顶
    pinned: link.pinned, // ID为1的项始终置顶
    isSwitch: link.isSwitch,
    type: link.type,
  }));

  let nextPinned = false;
  //初始化指定 因为ID为1的项始终在第一位， 所以需要把ID为1后面那个初始化置顶
  for (const element of gData.value) {
    const item = element;
    if (nextPinned) {
      item.pinned = true;
      break;
    }

    // if (item.id === 1) {
    //   nextPinned = true;
    // }
  }
  sortItems();
}

const show = () => {
  open.value = true;
};

const showProject = (data:SystemItem) => {
  crRef?.value.showModal(data);
}

const handleOk = () => {
  open.value = false;
  updateGdata();
};

// 切换置顶状态并排序
const togglePin = (index: number) => {
  // 不允许修改ID为1的项的置顶状态
  // if (gData.value[index].id === 1) {
  //   return;
  // }

  // 如果该项已经置顶，取消置顶
  if (gData.value[index].pinned) {
    gData.value[index].pinned = false;
    return;
  }

  // 将除ID为1的项以外的所有项目重置为非置顶
  gData.value.forEach((item) => {
    // if (item.id !== 1) {
      item.pinned = false;
    // }
  });

  // 设置当前项目为置顶
  gData.value[index].pinned = true;

  // 重新排序，将置顶的项目移到最前面
  sortItems();
};

// 根据置顶状态排序项目
const sortItems = () => {
  // 创建新数组避免直接修改原数组
  const sortedData = [...gData.value];

  // 进行排序，ID为1的项排在最前面，然后是置顶的项目
  sortedData.sort((a, b) => {
    // if (a.id === 1) return -1;
    // if (b.id === 1) return 1;
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  // 更新数据
  gData.value = sortedData;
};

const updateSuccess = (data:SystemItem) => {
  if(!data.id) {
    const maxId = gData.value.reduce((max, item) => Math.max(max, item.id), -Infinity);
    data.id = maxId + 1;
    gData.value.push(data);
  } else {
    let moreId = gData.value.findIndex(item => item.id === data.id);
    if(moreId > -1) {
      gData.value.splice(moreId, 1, {...data});
    }
  }
  updateGdata();
}

const updateGdata = () => {
// 将内部数据格式转换回父组件期望的格式
  const updatedLinks = gData.value.map((item) => ({
    id: item.id,
    url: item.url,
    iconClass: item.iconClass,
    iconSrc: item.iconSrc,
    title: item.title,
    hidden: !item.visible, // 注意这里是取反，将visible转为hidden
    pinned: item.pinned,
    isSwitch: item.isSwitch,
    type: item.type,
  }));
  // console.log(updatedLinks);
  // 更新父组件数据
  emit("setExternalLinks", [...updatedLinks]);
}

const confirmDelete = async (id: number) => {
  try {
    let moreId = gData.value.findIndex(item => item.id === id);
    if(moreId > -1) {
      gData.value.splice(moreId, 1);
    }
    message.success(
      `成功删除应用`
    );
    updateGdata();
  } catch (error) {
    console.log(error);
    // message.error("删除失败");
  } 

};

defineExpose({
  show,
  setData,
});
</script>

<style scoped lang="less">
.display-setting-container {
  padding: 48px 16px;
}

.display-setting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  padding-bottom: 15px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;

  .header-title {
    font-size: 14px;
    font-weight: normal;
  }

  .header-actions {
    display: flex;
    // gap: 30px;

    .action-item {
      // margin-right: 20px;
      font-size: 14px;
      color: #909399;
      text-align: center;
    }
  }
}

.add-des {
  margin-left: 4px;
  font-size: 13px;
  color: #ff6757;
}

.add-div {
  padding-left: 24px;
}

@icon_size: 64px;

.icon-wrapper img {
  width: @icon_size;
  height: @icon_size;
  border-radius: 16px; 
}

.system-list {
  .system-item {
    display: flex;
    align-items: center;
    height: 88px;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f5f5;
    }

    .system-info {
      display: flex;
      gap: 12px;
      align-items: center;

      .system-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        overflow: hidden;
        background-color: #ff4757;
        border-radius: 8px;

        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }

      .system-title {
        font-size: 14px;
        font-weight: 500;
      }

      
    }

    .system-switch,
    .system-pin {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pin-button {
      height: auto;
      padding: 0;

      .pin-active {
        color: #1890ff;
      }

      .pin-icon {
        color: rgb(0 0 0 / 45%);
        &:hover {
          color: #e61f42;
        }
      }

      :deep(svg) {
        font-size: 18px;
      }
    }

    .delete-info {
      a {
        color: #e61f42;
      }
      a:hover {
        color: #ff6757;
      }
    }

  }
}
</style>