<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 09:50:18
 * @LastEditors: wys
 * @LastEditTime: 2022-08-23 16:48:10
-->
<template>
  <div id="report" v-loading="isLoading" element-loading-text="加载中...">
    <div style="min-width: 1200px; width: 1800px; margin: 0px auto">
      <header>
        <nav>
          <img
            style="width: 160px; height: 40px"
            src="@/assets/image/public/jtlogo.png"
            alt=""
          />
          <div class="block_time" v-show="!isPrint">
            <div class="timeDiv">
              <div class="block">
                <el-date-picker
                  v-model="start_dateTime"
                  ref="mytime"
                  style="width: 200px"
                  type="datetime"
                  placeholder="开始时间"
                  align="right"
                >
                </el-date-picker>
              </div>
              <span style="left: 0px; position: relative">至</span>
              <div class="block">
                <el-date-picker
                  v-model="end_dateTime"
                  ref="mytimetwo"
                  type="datetime"
                  style="width: 200px"
                  placeholder="结束时间"
                  align="right"
                >
                </el-date-picker>
              </div>
              <span class="query" @click="viewfullreport"> 查询 </span>
            </div>
          </div>
        </nav>
        <nav style="text-align: center; margin-top: 30px">
          <h2>{{ areaName }}</h2>
          <div style="margin-top: 20px">
            <!-- {{ reportData.time }} -->
            <!-- 时间：2022.10.01 00:00:00至2022.11.31 23:59:59 -->
          </div>
        </nav>
      </header>
      <div class="one">
        <h4><span class="blogo"></span>工程概况</h4>
        <p>
          成德南高速公路巴中至成都方向K144+850处高边坡在斜坡上展线，该段上覆
          3～6m
          的崩坡积粉质黏土夹块、碎石，下伏基岩为泥灰岩，该段以挖方路堑形式通过，设有桩板墙对路堑坡脚进行支挡。受降雨影响，本处高边坡存在滑移崩塌风险，已开始进行边坡加固整治。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;由于现场地质情况较为复杂，且坡顶有通信铁塔，为保证边坡的安全，需要在运营期间对边坡进行自动化实时监测，建立坡表位移、坡体位移、结构物变形、环境等监测体系，实现自动化数据采集及实时预警等功能。
        </p>
      </div>
      <div class="two">
        <h4><span class="blogo"></span>主要监测内容</h4>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据本项目特点，基于异构感知、融合分析，达到对边坡监测的目的，主要进行以下内容监测：
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（1）地表位移监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;包括绝对位移监测与动态位移监测。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;依托GNSS设备，监测边坡水平绝对位移与沉降绝对位移。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;依托网格化布设的MEMS数字监测器（位移）阵列，实现对边坡相对位移的监测。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（2）地裂缝监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;利用高精度裂缝传感器对边坡主断面的变形进行监测，在没有明显裂缝时可在坡表布设一条自上而下的监测设备组，首尾传感器布设于边坡变形区域外的相对固定点上，实现对整个坡表变形情况的掌握。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（3）结构物倾斜状态监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;建筑物、支挡等结构物变形观测，在建筑物、支挡结构物上部或顶部安装固定式MEMS数字监测器（倾角）阵列，监测结构物倾斜状态变化趋势，同时也反应了支挡结构物支挡效果。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（4）边坡环境监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;土质边坡和二元混质边坡受雨水影响较大，一方面会降低土体力学性能，另一方面对提高自重和降低岩土交界面摩擦系数，因此需要监测雨水等对其他监测参数的影响，以更全面地动态掌握边坡安全情况。同时引入气象局实时气象预报预警信息，
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基于该点位历史/实时气象数据以及气象局预报预警信息，利用AI融合分析预警算法，可实现对边坡区域内致灾气象的提前预警，防止因强降雨强降雪强风等致灾气象引起如边坡滑坡、泥石流等次生灾害。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（5）土壤湿度监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过测量土壤的介电常数，稳定反应各种土壤的真实水分含量，实现土壤含水量测量与温度测量功能，以达到监测边坡隐患致灾因素的目的。
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（6）视频图像监测
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基于机器视觉算法的监控视频，对行人、滑移、落石等异常事件第一时间告警，同时作为人工确认边坡健康状态提供支撑。
        </p>
        <h4><span class="blogo"></span>设备选型</h4>
        <table
          class="tablediv"
          border="1"
          cellpadding="0"
          cellspacing="3"
          width="90%"
        >
          <tbody>
            <tr style="font-weight: bold; text-align: center">
              <td>序号</td>
              <td>类目</td>
              <td>单位</td>
              <td>数量</td>
            </tr>
            <tr
              style="font-weight: bold; text-align: center"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.deviceType }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <h4><span class="blogo"></span>边坡监测</h4>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据公路滑坡防治设计规范（JTG/T
        3334—2018）8.4.3中描述，公路滑坡防治工程预测预报与预警的目的是对施工中滑坡过大的变形进行预警，及时采取应急抢险工程措施，控制滑坡变形发展，防止滑坡体进入临界失稳状态，保证工程安全。
        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据国内外滑坡部分滑坡破坏前的变形速率的统计分析，从工程安全出发，滑坡预报的预警值采用深部位移10mm/d、滑坡前缘剪出裂缝的危险位移量10mm/d较为合适。
        <h4><span class="blogo"></span>MEMS</h4>
        <div class="tablediv">
          <!-- 数据时间 -->
          <table border="1" cellpadding="0" cellspacing="0" width="90%">
            <tbody v-loading="tableIsLoading">
              <tr style="font-weight: bold; text-align: center">
                <td colspan="1"></td>
                <td
                  colspan="3"
                  v-for="(item, index) in deviceTableDatas?.mems?.timeTitles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr>
              <tr style="font-weight: bold; text-align: center">
                <td valign="top">设备:</td>
                <td
                  v-for="(item, index) in deviceTableDatas?.mems?.titles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td></td>
              </tr>
              <tr
                v-for="(item, index) in deviceTableDatas?.mems?.reportData"
                :key="index"
              >
                <td>{{ item.deviceNo }}</td>
                <td>{{ item.x1.toFixed(2) + "°" }}</td>
                <td>{{ item.y1.toFixed(2) + "mm" }}</td>
                <td>{{ item.z1.toFixed(2) + "mm" }}</td>
                <td>{{ item.x2.toFixed(2) + "°" }}</td>
                <td>{{ item.y2.toFixed(2) + "mm" }}</td>
                <td>{{ item.z2.toFixed(2) + "mm" }}</td>
                <td>{{ item.x3.toFixed(2) + "°" }}</td>
                <td>{{ item.y3.toFixed(2) + "mm" }}</td>
                <td>{{ item.z3.toFixed(2) + "mm" }}</td>
                <td class="errorTd" style="padding: 8px" v-if="item.safeDesc">
                  <p
                    style="font-size: 14px"
                    v-for="(item, index) in item.safeDesc"
                    :key="index"
                  >
                    {{ index + 1 }}、{{ item }}
                  </p>
                </td>
                <td v-else>未超出阈值</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4><span class="blogo"></span>北斗</h4>
        <div class="tablediv">
          <!-- 数据时间 -->
          <table border="1" cellpadding="0" cellspacing="0" width="90%">
            <tbody v-loading="tableIsLoading">
              <tr style="font-weight: bold; text-align: center">
                <td colspan="1"></td>
                <td
                  colspan="2"
                  v-for="(item, index) in deviceTableDatas?.plough?.timeTitles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr>
              <tr style="font-weight: bold; text-align: center">
                <td valign="top">设备:</td>
                <td
                  v-for="(item, index) in deviceTableDatas?.plough?.titles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td></td>
              </tr>
              <tr
                v-for="(item, index) in deviceTableDatas?.plough?.reportData"
                :key="index"
              >
                <td>{{ item.deviceNo }}</td>
                <td>{{ item.x1.toFixed(2) + "mm" }}</td>
                <td>{{ item.y1.toFixed(2) + "mm" }}</td>
                <td>{{ item.x2.toFixed(2) + "mm" }}</td>
                <td>{{ item.y2.toFixed(2) + "mm" }}</td>
                <td>{{ item.x3.toFixed(2) + "mm" }}</td>
                <td>{{ item.y3.toFixed(2) + "mm" }}</td>
                <td class="errorTd" style="padding: 8px" v-if="item.safeDesc">
                  <p
                    style="font-size: 14px"
                    v-for="(item, index) in item.safeDesc"
                    :key="index"
                  >
                    {{ index + 1 }}、{{ item }}
                  </p>
                </td>
                <td v-else>未超出阈值</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4><span class="blogo"></span>裂缝</h4>
        <div class="tablediv">
          <!-- 数据时间 -->
          <table border="1" cellpadding="0" cellspacing="0" width="90%">
            <tbody v-loading="tableIsLoading">
              <tr style="font-weight: bold; text-align: center">
                <td colspan="1"></td>
                <td
                  colspan="1"
                  v-for="(item, index) in deviceTableDatas?.tear?.timeTitles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr>
              <tr style="font-weight: bold; text-align: center">
                <td valign="top">设备:</td>
                <td
                  v-for="(item, index) in deviceTableDatas?.tear?.titles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td></td>
              </tr>
              <tr
                v-for="(item, index) in deviceTableDatas?.tear?.reportData"
                :key="index"
              >
                <td>{{ item.deviceNo }}</td>
                <td>{{ item.x1.toFixed(2) + "mm" }}</td>
                <td>{{ item.x2.toFixed(2) + "mm" }}</td>
                <td>{{ item.x3.toFixed(2) + "mm" }}</td>
                <td class="errorTd" style="padding: 8px" v-if="item.safeDesc">
                  <p
                    style="font-size: 14px"
                    v-for="(item, index) in item.safeDesc"
                    :key="index"
                  >
                    {{ index + 1 }}、{{ item }}
                  </p>
                </td>
                <td v-else>未超出阈值</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4><span class="blogo"></span>土壤温湿度</h4>
        <div class="tablediv">
          <!-- 数据时间 -->
          <table border="1" cellpadding="0" cellspacing="0" width="90%">
            <tbody v-loading="tableIsLoading">
              <tr style="font-weight: bold; text-align: center">
                <td colspan="1"></td>
                <td
                  colspan="2"
                  v-for="(item, index) in deviceTableDatas?.soil?.timeTitles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr>
              <tr style="font-weight: bold; text-align: center">
                <td valign="top">设备:</td>
                <td
                  v-for="(item, index) in deviceTableDatas?.soil?.titles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td></td>
              </tr>
              <tr
                v-for="(item, index) in deviceTableDatas?.soil?.reportData"
                :key="index"
              >
                <td>{{ item.deviceNo }}</td>
                <td>{{ item.x1.toFixed(2) + "°C" }}</td>
                <td>{{ item.y1.toFixed(2) + "%RH" }}</td>
                <td>{{ item.x2.toFixed(2) + "°C" }}</td>
                <td>{{ item.y2.toFixed(2) + "%RH" }}</td>
                <td>{{ item.x3.toFixed(2) + "°C" }}</td>
                <td>{{ item.y3.toFixed(2) + "%RH" }}</td>
                <td class="errorTd" style="padding: 8px" v-if="item.safeDesc">
                  <p
                    style="font-size: 14px"
                    v-for="(item, index) in item.safeDesc"
                    :key="index"
                  >
                    {{ index + 1 }}、{{ item }}
                  </p>
                </td>
                <td v-else>未超出阈值</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4><span class="blogo"></span>气象</h4>
        <div class="tablediv">
          <!-- 数据时间 -->
          <table border="1" cellpadding="0" cellspacing="0" width="90%">
            <tbody v-loading="tableIsLoading">
              <!-- <tr style="font-weight: bold; text-align: center">
                <td colspan="1"></td>
                <td
                  colspan="2"
                  v-for="(item, index) in deviceTableDatas?.weather?.timeTitles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr> -->
              <tr style="font-weight: bold; text-align: center">
                <td valign="top">
                  设备:{{ deviceTableDatas?.weather?.deviceNo }}
                </td>
                <td
                  v-for="(item, index) in deviceTableDatas?.weather?.titles"
                  :key="index"
                >
                  {{ item }}
                </td>
                <td style="width: 200px" colspan="1">超阈值情况</td>
              </tr>
              <tr
                v-for="(item, index) in deviceTableDatas?.weather?.reportData"
                :key="index"
              >
                <td>{{ item.deviceNo }}</td>
                <td>{{ item.x1.toFixed(2) + "m/s" }}</td>
                <td>{{ item.y1.toFixed(2) + "°" }}</td>
                <td>{{ item.z1.toFixed(2) + "mm" }}</td>
                <td>{{ item.u1.toFixed(2) + "°C" }}</td>
                <td>{{ item.v1.toFixed(2) + "%RH" }}</td>
                <td>{{ item.w1.toFixed(2) + "h·Pa" }}</td>
                <td class="errorTd" style="padding: 8px" v-if="item.safeDesc">
                  <p
                    style="font-size: 14px"
                    v-for="(item, index) in item.safeDesc"
                    :key="index"
                  >
                    {{ index + 1 }}、{{ item }}
                  </p>
                </td>
                <td v-else>未超出阈值</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- <contentComt title="设备概览">
        <div class="deviceSurvey">
          <div
            v-for="(item, index) in chartObj.totalDevice"
            :key="index"
            :style="`${index != 0 && index != 6 ? 'margin-left:20px;' : ''} ${
              index >= 6 ? '' : ''
            } `"
          >
            <i
              :class="iconClass(item.name)"
              style="font-size: 34px; color: #0095ff; margin-top: 16px"
            ></i>
            <div style="margin-left: 10px">
              <div style="color: #0095ff; font-size: 16px">
                {{ item.size }}
              </div>
              <div style="color: #333333; font-size: 14px; margin-top: 10px">
                {{ item.typeName }}
              </div>
            </div>
          </div>
        </div>
      </contentComt> -->
      <!-- 数据对比模块3D -->
      <!-- <p>
        <dataContrast
          v-if="isShow && chartObj.graph3D"
          :graph3D="chartObj.graph3D"
        ></dataContrast>
      </p> -->
      <!-- 数据对比模块箭头 -->
      <p>
        <dataContrast2d
          v-if="isShow && chartObj?.graph2D"
          :graph2D="chartObj?.graph2D"
        ></dataContrast2d>
      </p>
      <!-- 变化最大点的时序图 -->

      <template v-for="item in chartObj?.MEMS" :key="item.name">
        <p>
          <maxSequentialChart
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.name"
          ></maxSequentialChart>
        </p>
      </template>

      <template v-for="item in chartObj?.Soil" :key="item.name">
        <p>
          <!--土壤监测时序图-->
          <soilSequential
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.device_name"
          ></soilSequential>
        </p>
      </template>
      <template v-for="item in chartObj?.Tear" :key="item.name">
        <p>
          <!--裂缝监测时序图-->
          <crackSequential
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.device_name"
          ></crackSequential>
        </p>
      </template>
      <p>
        <!-- 北斗设备时序图 -->
        <bigDipperSequential
          v-if="isShow && chartObj?.plough"
          :chartObj="chartObj.plough"
        ></bigDipperSequential>
      </p>
      <p>
        <!-- 气象时序图 -->
        <weatherChart
          :weather="chartObj?.weather"
          v-if="isShow && chartObj?.weather"
        ></weatherChart>
      </p>
      <p>
        <!-- 结论 -->
        <conclusion
          @print="print"
          :isPrint="isPrint"
          @submit="submit"
          ref="changeIsPrint"
        ></conclusion>
      </p>

      <!-- <img :src="canvasSrc"
           ref="imgDom"
           alt="" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, onMounted, computed, nextTick } from "vue-demi";
import contentComt from "./components/content.vue";
// 数据对比模块
import dataContrast from "./components/dataContrast.vue";
import dataContrast2d from "./components/dataContrast2d.vue";
import jsPDF from "jspdf";
// 变化最大点的时序图
import maxSequentialChart from "@/views/reportModule/components/maxSequentialChart.vue";
// 北斗设备时序图
import bigDipperSequential from "@/views/reportModule/components/bigDipperSequential.vue";
// 土壤监测时序图
import soilSequential from "@/views/reportModule/components/soil.vue";
//裂缝监测
import crackSequential from "@/views/reportModule/components/crack.vue";
// 结论
import conclusion from "@/views/reportModule/components/conclusion.vue";
// 气象时序图
import weatherChart from "@/views/reportModule/components/weatherChart.vue";
// 操作日志列表
import monitoringReportList from "@/views/reportModule/monitoringReportList.vue";
import {
  getDataByTunnel,
  editReport,
  getK144ReportData,
  getMonitorReportChart,
} from "@/api/report/index";
import {
  useRoute,
  RouteLocationNormalizedLoaded,
  RouteParams,
} from "vue-router";
import { TimesnewDateFn_two, formatDateTime } from "@/utils/tool";
import { useStore } from "vuex";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

import { ElMessage } from "element-plus";
import { PROJECTID, TUNNELID } from "@/utils/enumeration";
const reportData = reactive({
  title:
    PROJECTID == 3
      ? "德会监测报告"
      : PROJECTID == 1
      ? "k144边坡监测报告"
      : "监测报告",
  time: "",
  reportStatus: "",
});
const areaName = ref("");
const chartObj = ref({});
const isLoading = ref(false);
const isShow = ref(false);
const changeIsPrint = ref();
const $store = useStore();
const deviceTableDatas = ref({});
const tableIsLoading = ref(false);
const start_dateTime = ref(new Date()); //开始时间
const end_dateTime = ref(new Date()); //结束时间
const canvasList = ref([]); //图表数组
const tableData = ref([
  {
    deviceType: "MEMS数字监测器（倾角）",
    unit: "只",
    quantity: 5,
  },
  {
    deviceType: "MEMS数字监测器（位移）",
    unit: "只",
    quantity: 15,
  },
  {
    deviceType: "绝对位移监测设备",
    unit: "套",
    quantity: 1,
  },
  {
    deviceType: "地裂缝监测设备",
    unit: "套",
    quantity: 3,
  },
  {
    deviceType: "土壤湿度监测设备",
    unit: "只",
    quantity: 2,
  },
  {
    deviceType: "AI视频监控摄像机",
    unit: "套",
    quantity: 1,
  },
  {
    deviceType: "边坡监测专用气象站",
    unit: "套",
    quantity: 1,
  },
  {
    deviceType: "太阳能供电系统",
    unit: "套",
    quantity: 2,
  },
  {
    deviceType: "边缘数据计算传输系统",
    unit: "套",
    quantity: 2,
  },
]);
const iconClass = computed(() => (name: string) => {
  let str = "";
  switch (name) {
    case "Camera":
      str = "iconfont icon-shexiangtou";
      break;
    case "Plough":
      str = "iconfont icon-beidoushebei";
      break;
    case "Soil":
      str = "iconfont icon-turangshiduchuanganqi";
      break;
    case "Weather":
      str = "iconfont icon-weiqixiangzhan";
      break;
    case "TearInspect":
      str = "iconfont icon-bianpoliefengchuanganqi";
      break;
    case "StressInspect":
      str = "iconfont icon-yingbian";
      break;
    case "MicroPowerStation":
      str = "iconfont icon-weidianzhan";
      break;
    case "Spike":
      str = "iconfont icon-MEMS";
      break;
    case "MEMS":
      str = "iconfont icon-MEMS";
      break;
    case "PlatformMEMS":
      str = "iconfont icon-MEMS";
      break;
    default:
      str = "iconfont icon-weidianzhan";
      break;
  }
  return str;
});

const route = useRoute();

onMounted(() => {
  isLoading.value = true;
  let date = (route.query.reportTime + "").split(" ");
  areaName.value = "K144边坡监测报告";
  reportData.reportStatus = route.query.report_status + "";
  let dateYYR = date[0].split("-");
  reportData.time =
    "时间：" +
    dateYYR[0] +
    "." +
    dateYYR[1] +
    ".01    00:00:00至" +
    dateYYR[0] +
    "." +
    dateYYR[1] +
    "." +
    dateYYR[2] +
    "    23:59:59";
  start_dateTime.value = TimesnewDateFn_two().b;
  end_dateTime.value = TimesnewDateFn_two().c;
  // getDataByTunnelFun(route.query.reportTime, route.query.id);
  // getK144ReportDataFun(1, "2023-07-01 00:00:00", "2023-07-07 00:00:00");
  // getMonitorReportChartFun(1, "2023-05-01 00:00:00", "2023-05-07 00:00:00");
  getK144ReportDataFun(
    1,
    formatDateTime(start_dateTime.value),
    formatDateTime(end_dateTime.value)
  );
  getMonitorReportChartFun(
    1,
    formatDateTime(start_dateTime.value),
    formatDateTime(end_dateTime.value)
  );
});

//查询
const viewfullreport = () => {
  getK144ReportDataFun(
    1,
    formatDateTime(start_dateTime.value),
    formatDateTime(end_dateTime.value)
  );
  getMonitorReportChartFun(
    1,
    formatDateTime(start_dateTime.value),
    formatDateTime(end_dateTime.value)
  );
};
const getDataByTunnelFun = (report_time: any, reportId: string) => {
  getDataByTunnel({
    tunnelFk: TUNNELID,
    reportTime: report_time,
    reportId: reportId,
    // tunnelFk: "1",
    // reportTime: "2022-10-15+10:47:24",
    // reportId: "2",
  }).then((res) => {
    isLoading.value = false;
    chartObj.value = res.data;
    isShow.value = true;
    let comments = res.comments;
    changeIsPrint.value.setConclusion(comments);
    if (chartObj?.value?.status == "-1") {
      ElMessage.error(chartObj.value.message + "");
      return;
    }
  });
};
//查询图表数据2023.7.7改
const getMonitorReportChartFun = (
  tunnelFk: number,
  startTime: any,
  endTime: any
) => {
  nextTick(() => {
    tableIsLoading.value = true;
    chartObj.value = {};
    if (endTime && startTime) {
      getMonitorReportChart({
        tunnelFk: tunnelFk,
        startTime: startTime,
        endTime: endTime,
      }).then((res) => {
        isLoading.value = false;
        chartObj.value = res.data;
        isShow.value = true;
        let comments = res.comments;
        changeIsPrint.value.setConclusion(comments);
        if (chartObj?.value?.status == "-1") {
          ElMessage.error(chartObj.value.message + "");
          return;
        }
      });
    }
  });
};
//查询表格数据
const getK144ReportDataFun = (
  tunnelFk: number,
  startTime: any,
  endTime: any
) => {
  deviceTableDatas.value = {};
  nextTick(() => {
    tableIsLoading.value = true;
    if (endTime && startTime) {
      getK144ReportData({
        tunnelFk: tunnelFk,
        startTime: startTime,
        endTime: endTime,
      }).then((res) => {
        deviceTableDatas.value = res;
        tableIsLoading.value = false;
      });
    }
  });
};

const submit = (value: string) => {
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // uploadPdf();
  if (!value) ElMessage.error("请填写内容");
  else {
    editReport({
      id: route.query.id,
      comments: value,
      loginId: userInfo.loginId,
    }).then((res) => {
      if (res === 1) {
        ElMessage.success("提交成功");
        $store.commit("Common/SET_STATE_VALUE", {
          name: "isUpdateReportList",
          value: true,
        });
      } else {
        if (res.message) {
          ElMessage.error(res.message);
          return;
        }
        ElMessage.error("提交失败");
      }
    });
  }
};
const canvasSrc: Ref<string | null> = ref("");
const imgDom = ref(null);
const isPrint: Ref<Boolean> = ref(false);

const isSplit = (nodes, index, pageHeight) => {
  // 计算当前这块dom是否跨越了a4大小，以此分割
  if (
    nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight &&
    nodes[index + 1] &&
    nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
  ) {
    return true;
  }
  return false;
};
const get_H = (pageHeight, i, lableListID) => {
  let height = 0;
  for (var j = i; j >= 0; j--) {
    height = height + lableListID[j].offsetTop + lableListID[j].offsetHeight;
    if (height > pageHeight) {
      height =
        height - (lableListID[j].offsetTop + lableListID[j].offsetHeight);
      return pageHeight - height + 150;
    }
  }
};
var loading = null;
//加载提示框
const openFullScreen = () => {
  loading = ElLoading.service({
    lock: true,
    text: "下载中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  // setTimeout(() => {
  //   loading.close()
  // }, 2000)
};
const print = () => {
  openFullScreen();
  changeIsPrint.value.changeIsPrint(true);
  isPrint.value = true;
  let that = this;
  // if (that.$refs.selftext.scrollHeight > that.$refs.selftext.clientHeight) {
  //   that.$refs.selftext.style.height =
  //     that.$refs.selftext.scrollHeight + 3500 + "px";
  // }
  // that.borderstyle = "none";
  // that.resizestyle = "none";
  // window.scrollTo(0.1, 0.1);
  window.pageYoffset = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  setTimeout(() => {
    //设置一定时间进行渲染不然报错： Incomplete or corrupt PNG file
    var targetDom = document.getElementById("report"); //你的目标元素id
    html2canvas(targetDom, {
      logging: false,
      background: "#fff",
      allowTaint: true,
      taintTest: false,
      // height: document.body.scrollHeight,
      // width: window.document.body.scrollWidth,
      WindowWidth: document.body.scrollWidth,
      windowHeight: document.body.scrollHeight,
      // x: 0,
      //  y:window.pageYOffset,
      async: false,
      scale: 1,
      dpi: 1000, //导出pdf清晰度
      useCORS: true, // 【重要】开启跨域配置
    }).then(function (canvas) {
      var pageData = canvas.toDataURL("png", 1.0);
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;
      // var f = "p";
      // var imgWidth = 595.28;
      // var imgHeight = 592.28/contentWidth * contentHeight;
      //页面偏移
      var position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28;
      var imgHeight = (592.28 / contentWidth) * contentHeight;
      var pageHeight = (contentWidth / imgWidth) * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;

      var pdf = new jsPDF("", "pt", "a4");
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      // setTimeout(() => {
      // const reader = new FileReader();
      // reader.addEventListener('load',()=>{

      // });
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, "PNG", 0, 0, imgWidth, imgHeight);
        //  pdf.addImage(dataurl, 'JPEG', 0, 0);
      } else {
        // 分页
        while (leftHeight > 0) {
          pdf.addImage(pageData, "PNG", 0, position, imgWidth, imgHeight);

          leftHeight -= pageHeight;
          position -= 841.89;
          // position += 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(reportData.title + ".pdf");
      loading.close();
      changeIsPrint.value.changeIsPrint(false);
      isPrint.value = false;
      // }, 20000);

      // contentHeight > contentWidth ? f = 'p' : f = 'l';
      // var pageData = canvas.toDataURL('image/png', 1.0);
      // _this.aaa = canvas.toDataURL();
      // var pdf = new jsPDF(f, 'px', [imgWidth, imgHeight]);
      // pdf.addImage(pageData, 'png', 0, 0, imgWidth, imgHeight);

      // copyDom.remove();
    });
    // loading.close();
  }, 3000);

};
// const print = () => {
//   openFullScreen();
//   changeIsPrint.value.changeIsPrint(true);
//   let ST = document.documentElement.scrollTop || document.body.scrollTop;
//   let SL = document.documentElement.scrollLeft || document.body.scrollLeft;
//   window.pageYoffset = 0;
//   document.documentElement.scrollTop = 0;
//   document.documentElement.scrollLeft = 0;
//   document.body.scrollTop = 0;
//   document.body.scrollLeft = 0;
//   //获取滚动条的位置并赋值为0，因为是el-dialog弹框，并且内容较多出现了纵向的滚动条,截图出来的效果只能截取到视图窗口显示的部分,超出窗口部分则无法生成。所以先将滚动条置顶
//   const A4_WIDTH = 595.28;
//   const A4_HEIGHT = 841.89;
//   let domElement = document.getElementById("report"); // 获取DOM

//   let pageHeight = (domElement.scrollWidth / A4_WIDTH) * A4_HEIGHT;

//   // let pageHeight = 800;
//   let lableListID = domElement.querySelectorAll("p");
//   // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
//   for (let i = 0; i < lableListID.length; i++) {
//     let multiple = Math.ceil(
//       (lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight
//     );
//     if (isSplit(lableListID, i, multiple * pageHeight)) {
//       let divParent = lableListID[i].parentNode; // 获取该div的父节点
//       let newNode = document.createElement("div");
//       newNode.className = "emptyDiv";
//       newNode.style.background = "#ffffff";
//       let _H = get_H(A4_HEIGHT, i, lableListID);
//       // multiple * pageHeight -
//       // (lableListID[i].offsetTop + lableListID[i].offsetHeight);
//       //留白
//       newNode.style.height = _H + "px";
//       newNode.style.width = "100%";
//       let next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
//       // 判断兄弟节点是否存在
//       if (next) {
//         // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
//         divParent.insertBefore(newNode, next);
//       } else {
//         // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
//         divParent.appendChild(newNode);
//       }
//     }
//   }
//   //接下来开始截图
//   nextTick(() => {
//     // nexttick可以保证要截图的部分全部执行完毕，具体用法自行百度...
//     html2canvas(domElement, {
//       allowTaint: true,
//       taintTest: false,
//       // x: domElement.getBoundingClientRect().left + 13, // 绘制的dom元素相对于视口的位置
//       // y: domElement.getBoundingClientRect().top,
//       // y: window.pageYOffset + 100,//滚动条高度修复
//       // width: domElement.offsetWidth - 15, // 因为多出的需要剪裁掉，
//       // height: domElement.offsetHeight,
//       // windowHeight:domElement.offsetHeight + 24 + 100,//获取y方向页面包含滚动条的高度，24和100为padding,margin
//       WindowWidth: document.body.scrollWidth,
//       windowHeight: document.body.scrollHeight,
//       backgroundColor: "#FFF", //一定要设置北京颜色，否则有的浏览器就会变花~，比如Edge
//       useCORS: true,
//       async: false,
//       scale: 2, // 图片模糊
//       // dpi: 350, //z
//     }).then((canvas) => {
//       const img = canvas.toDataURL("image/png", 1.0);
//       canvasSrc.value = img;
//       let pdf = new jsPdf("p", "mm", "a4"); //A4纸，纵向
//       let ctx = canvas.getContext("2d"),
//         a4w = 190,
//         a4h = 277, //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
//         imgHeight = Math.floor((a4h * canvas.width) / a4w), //按A4显示比例换算一页图像的像素高度
//         renderedHeight = 0;
//       while (renderedHeight < canvas.height) {
//         let page = document.createElement("canvas");
//         page.width = canvas.width;
//         page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
//         //用getImageData剪裁指定区域，并画到前面创建的canvas对象中
//         page
//           .getContext("2d")
//           .putImageData(
//             ctx.getImageData(
//               0,
//               renderedHeight,
//               canvas.width,
//               Math.min(imgHeight, canvas.height - renderedHeight)
//             ),
//             0,
//             0
//           );
//         pdf.addImage(
//           page.toDataURL("image/jpeg", 0.2),
//           "JPEG",
//           10,
//           10,
//           a4w,
//           Math.min(a4h + 20, (a4w * page.height) / page.width)
//         ); //添加图像到页面，保留10mm边距
//         renderedHeight += imgHeight;
//         if (renderedHeight < canvas.height) pdf.addPage(); //如果后面还有内容，添加一个空页
//       }
//       pdf.save(reportData.title + ".pdf");
//       changeIsPrint.value.changeIsPrint(false);
//       //恢复原始title
//       window.document.getElementsByTagName("title")[0].innerHTML =
//         reportData.title;
//       isPrint.value = false;
//       // if (loading != NULL) {
//         loading.close();
//       // }

//       // location.reload();
//       // let uploadPdf = pdf.output("datauristring"); //转成Base64
//       // let arr = uploadPdf.split(",");
//       // let mime = arr[0].match(/:(.*?);/)[1];
//       // let suffix = mime.split("/")[1];
//       // let bstr = window.atob(arr[1]); //自行百度新大陆
//       // let n = bstr.length;
//       // let u8arr = new Uint8Array(n);
//       // let filename = "temp_img";
//       // while (n--) {
//       //   u8arr[n] = bstr.charCodeAt(n);
//       // }
//       // let file = new File([u8arr], `${filename}.${suffix}`, { type: mime });
//       // let formdata = new FormData();
//       // formdata.append("uploadfile", file);
//       // let params = { project: this.pid, courseid: this.id };
//       // this.$axios({
//       //   url: `vueindex/UploadWord/uploadpdf`,
//       //   method: "post",
//       //   headers: { "Content-Type": "multipart/form-data " },
//       //   data: formdata,
//       //   params: params,
//       // }).then((res) => {
//       //   if (res.data.code == 0) {
//       //     //上传成功，刷新页面，打完收工
//       //   }
//       // });
//     });
//   });
// };
</script>

<style scoped lang="scss" >
.block_time {
  margin-top: 20px;
  margin-left: 5%;
  // 时间选择
  .timeDiv {
    display: flex;
    align-items: center;
    .query {
      cursor: pointer;
      margin-left: 20px;
      border: 1px solid #0e9cff;
      background: radial-gradient(circle, #93b5e9 0%);
      border-radius: 4px;
      padding: 5px 20px;
    }
  }
}
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset !important;
  background: #adc5e9 !important;
}
.one,
.two,
.three,
.four,
.five,
.seven,
.eight,
.six {
  width: 100%;
  margin-left: 0;
  text-indent: 1em;
  p {
    margin-left: 1%;
  }
  .blogo {
    display: inline-block;
    width: 4px;
    height: 20px;
    margin-right: 7px;
    background: rgba(3, 101, 255, 1);
  }
  .tablediv {
    margin-left: 20px;
    td {
      text-align: center;
    }
    .errorTd {
      text-align: left;
    }
  }
  h4 {
    background: rgba(243, 248, 255, 1);
    padding: 10px;
    padding-left: 0px;
    font-size: 1.17em;
    margin-bottom: 15px;
    margin-top: 15px;
  }
}
.one {
  p {
    padding: 27px;
  }
}
#report {
  padding: 30px;
  background: white;
  .deviceSurvey {
    display: flex;
    flex-wrap: wrap;
    & > div {
      display: flex;
      width: 170px;
    }
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;
  }
  :deep(.el-textarea__inner) {
    color: black !important;
    &::placeholder {
      color: gray;
    }
  }
}
// :deep(.el-loading-mask) {
//   display: none !important;
// }
</style>