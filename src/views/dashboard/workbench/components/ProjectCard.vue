<script lang="ts" setup>
import { Card } from "ant-design-vue";
import { ref, onMounted } from "vue";
import ProjectCardSample from "@/assets/images/ProjectCardSample.png";
import ProjectCardAudit from "@/assets/images/ProjectCardAudit.png";
import ProjectCardTask from "@/assets/images/ProjectCardTask.png";
import {findAllStats} from "@/api/lims/console";

// 统计数据接口
interface StatCardData {
  title: string;
  value: number | string;
  subValue?: number | string;
  color: string;
}

// 模拟数据，真实项目中应通过API获取
const statCards = ref<StatCardData[]>([
  {
    title: "历史样本数",
    value: 0,
    subValue: "0",
    color: "linear-gradient(180deg, #FFF6F7 0%, #FFE3E7 100%)",
  },
  {
    title: "历史任务数",
    value: 0,
    subValue: "0%",
    color: "linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)",
  },
  {
    title: "历史审核通过",
    value: "119/121",
    subValue: "0%",
    color: "linear-gradient(180deg, #F2F9FE 0%, #E6F4FE 100%)",
  },
]);

// 加载数据
const loading = ref(true);

onMounted(async () => {
  const res = await findAllStats();

  statCards.value[0].value = res.sampleBatchs || 0;
  statCards.value[0].subValue = res.samples || 0;

  statCards.value[1].value = res.tasks || 0;
  statCards.value[1].subValue = parseInt(((res.taskQcPassRate || 0) * 100)) + "%";

  statCards.value[2].value =
    (res.reportPassed || 0) + "/" + (res.reports || 0);
  statCards.value[2].subValue = parseInt(((res.reportPassRate || 0) * 100)) + "%";

  loading.value = false;
});
</script>

<template>
  <Card title="您的数据" v-bind="$attrs">
    <template #extra>
      <!-- <a-button type="link">
        更多
      </a-button> -->
    </template>

    <div class="tdata">
      <a-spin :spinning="loading">
        <div class="stat-cards">
          <div
            v-for="(card, index) in statCards"
            :key="index"
            class="stat-card"
            :style="{ background: card.color }"
          >
            <div class="card-header">{{ card.title }}</div>
            <div class="card-content">
              <div class="card-value">
                <template v-if="index === 0">
                  <span>{{ card.value }}</span
                  >批次
                </template>
                <template v-else-if="index === 1">
                  <span>{{ card.value }}</span
                  >条
                </template>
                <template v-else-if="index === 2">
                  <span>{{ card.value }}</span
                  >份
                </template>
              </div>
              <div class="card-chart">
                <template v-if="index === 0">
                  <a-image
                    :width="100"
                    :height="115"
                    :src="ProjectCardSample"
                    :preview="false"
                  />
                </template>
                <template v-else-if="index === 1">
                  <a-image
                    :width="100"
                    :height="115"
                    :src="ProjectCardTask"
                    :preview="false"
                  />
                </template>

                <template v-else-if="index === 2">
                  <a-image
                    :width="100"
                    :height="115"
                    :src="ProjectCardAudit"
                    :preview="false"
                /></template>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-subvalue" v-if="index === 0">
                共计单条样本<span
                  style="margin-left: 4px; color: rgb(0 0 0 / 85%)"
                  >{{ card.subValue }}条</span
                >
              </div>
              <div class="card-subvalue" v-if="index === 1">
                质控合格率<span
                  style="margin-left: 4px; color: rgb(230 31 66 / 100%)"
                  >{{ card.subValue }}</span
                >
              </div>
              <div class="card-subvalue" v-if="index === 2">
                审核通过<span
                  style="margin-left: 4px; color: rgb(56 158 13 / 100%)"
                  >{{ card.subValue }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </Card>
</template>

<style lang="less" scoped>
.tdata {
  margin: 8px 0;
}

.stat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 1460px) {
    flex-direction: column;
  }

  .stat-card {
    position: relative;
    flex: 1;
    min-width: 250px;
    min-height: 150px;
    padding: 16px;
    overflow: hidden;
    border-radius: 8px;

    .card-header {
      margin-bottom: 12px;
      font-size: 14px;
      color: rgb(0 0 0 / 85%);
    }

    .card-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .card-value {
        position: absolute;
        bottom: 40px;
        line-height: 1;

        span {
          font-size: 28px;
          font-weight: bold;
        }
      }

      .card-chart {
        position: absolute;
        right: 0;
        bottom: 35px;
        width: 115px;
        height: 100px;

        .trend-line {
          position: absolute;
          width: 100%;
          height: 100%;

          &.up {
            background: linear-gradient(
              to top right,
              transparent,
              transparent 40%,
              #ff4d4f 40%,
              #ff4d4f 60%,
              transparent 60%,
              transparent
            );
          }

          &.down {
            background: linear-gradient(
              to bottom right,
              transparent,
              transparent 40%,
              #52c41a 40%,
              #52c41a 60%,
              transparent 60%,
              transparent
            );
          }

          &.flat {
            background: linear-gradient(
              to right,
              transparent,
              transparent 40%,
              #faad14 40%,
              #faad14 60%,
              transparent 60%,
              transparent
            );
          }
        }
      }
    }

    .card-footer {
      position: absolute;
      bottom: 16px;

      .card-subvalue {
        font-size: 12px;
        color: rgb(0 0 0 / 45%);
      }

      .card-progress {
        height: 8px;
        overflow: hidden;
        background-color: rgb(255 255 255 / 60%);
        border-radius: 4px;
      }
    }
  }
}

@media (max-width: 768px) {
  .stat-cards {
    flex-direction: column;
  }
}
</style>
