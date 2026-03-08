<template>
  <template v-if="type === 1 || type === 2">
    <div
      class="template-container"
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        lineHeight: '1.5',
      }"
    >
      <img :src="cover?.fileList[0]" style="width: 100%; height: 100%" />
      <div
        style="
          position: absolute;
          top: 150px;
          right: 100px;
          left: 90px;
          color: #FFF;
          text-align: right;
        "
      >
        <img :src="unitLogo?.fileList[0]" style="width: 200px; height: 200px" />
        <div
          v-if="reportName?.value"
          style="
            margin-top: 10px;
            font-size: 32px;
            color: #FFF;
            text-align: right;
            font-family: '文泉驿微米黑'
          "
        >
          {{ reportName?.value ? `${reportName?.value}` : type == 1 ? `一步法病原体微生物靶向基因检测(109种)` : `“一步法”MTB+NTM鉴定及耐药基因`}} <br />检测报告
        </div>
        <div v-else style="height: 106px;"></div>
        <div
          v-if="reportEnglishName?.value"
          style="
            margin-top: 10px;
            font-size: 32px;
            color: #FFF;
            text-align: right;
            font-family: '文泉驿微米黑'
          "
        >
          {{ reportEnglishName?.value }}
        </div>

        <div style="width: 100%; margin-top: 300px">
          <ul style="color: #05243b">
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                受检者姓名：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.examinee?.name || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                送检医院：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.subHospital || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                送检科室：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.subRoom || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                床号：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.examinee?.bed || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                样本类型：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ SampleTypeEnumMap[props.report.sample?.sampleType] || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                报告日期：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ new Date().toISOString().slice(0, 10) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  <template v-if="type === 3">
    <div
      class="template-container"
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        lineHeight: '1.5',
      }"
    >
      <img :src="cover?.fileList[0]" style="width: 100%; height: 100%" />
      <div
        style="
          position: absolute;
          top: 150px;
          right: 100px;
          left: 90px;
          text-align: right;
        "
      >
        <img
          :src="unitLogo?.fileList[0]"
          style="width: 200px; height: 200px; visibility: hidden"
        />
        <div
          v-if="reportName?.value"
          style="
            margin-top: 10px;
            font-size: 32px;
            color: #FFF;
            text-align: right;
            visibility: hidden;
          "
        >
          一步法病原体微生物靶向基因检测(109种) <br />检测报告
        </div>

        <div style="width: 100%; margin-top: 300px">
          <ul style="color: #05243b">
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                受检者姓名：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  min-height: 40px;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.examinee?.name || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                送检医院：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.subHospital || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  min-height: 40px;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                送检科室：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.subRoom || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                床号：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  min-height: 40px;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ report.sample?.examinee?.bed || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                样本类型：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ SampleTypeEnumMap[props.report.sample?.sampleType] || '--' }}
              </div>
            </li>
            <li style="line-height: 40px">
              <div
                style="
                  float: left;
                  width: 49.9%;
                  font-size: 20px;
                  color: #FFF;
                  text-align: right;
                "
              >
                报告日期：
              </div>
              <div
                style="
                  float: right;
                  width: 49.9%;
                  min-height: 40px;
                  font-size: 20px;
                  color: #FFF;
                  text-align: left;
                "
              >
                {{ new Date().toISOString().slice(0, 10) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";
import { ref } from "vue";
import { SampleTypeEnumMap } from "@/enums/customEnum";
import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";

const props = defineProps({
  itemsData: {
    type: Array<inputDomeModel>,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  report: {
    type: Object as PropType<AnalysisReportDownloadRespVO>,
    required: true,
  },
});

const cover = ref(props.itemsData.find((item) => item.fields === "cover"));

const unitLogo = ref(
  props.itemsData.find((item) => item.fields === "unitLogo")
);

const reportName = ref(props.itemsData.find((item) => item.fields === "reportName"));

const reportEnglishName = ref(props.itemsData.find((item) => item.fields === "reportEnglishName"));

</script>
