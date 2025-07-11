<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 15:04:55
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 16:42:29
-->
<template>
  <div>
    <div class="leftContent">
      <div class="baseimg_box">
        <el-image
          style="width: 100%; height: 100%"
          fit="contain"
          :src="data.deviceImgUrl"
          :preview-src-list="[data.deviceImgUrl]"
        >
          <template #error>
            <div class="image-slot">暂无图片</div>
          </template>
        </el-image>
      </div>
      <div>
        <div class="checkHeader">
          <p
            @click="onCheckType(index)"
            v-for="(item, index) in data.checkLists"
            :class="{
              checkStyle: data.checkType == index,
              twoStyle: 1 == index,
            }"
            :key="index"
          >
            {{ item }}
          </p>
        </div>

        <!-- 基本信息 -->
        <div class="basicInformation" v-if="data.checkType == 0">
          <div style="display: flex;">
            <div class="infotitle_img">
              <i
                class="iconfont icon-jibenxinxi"
                style="height: 18px; margin-top: 4px"
              ></i>
            </div>
            <h5 style="color: white; font-size: 16px; margin-left: 8px">
              基本信息
            </h5>
          </div>

          <div class="info_centent">
            <ul>
              <li
                v-for="(item, index) in data.deviceInfos.basicInfo"
                :key="index"
              >
                <span>{{ item.name }}</span
                ><span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 运行状态 -->
      <div class="information_normal" v-if="data.checkType == 1">
        <div v-if="data.deviceAttrs.length > 0" class="information_title">
          <div class="infotitle_img">
            <i class="iconfont icon-shezhikongzhi"></i>
          </div>
          <h5>控制</h5>
        </div>
        <div
          v-for="(item, index) in data.deviceAttrs"
          :key="index"
          style="display: flex; margin-top: 6px"
        >
          <span
            style="
              color: #77c4ff;
              font-size: 14px;
              width: 160px;
              display: block;
              margin-top: 6px;
            "
            v-if="data.electricityScope == item.attr_name"
            >{{ item.attr_name + "(0-100)" }}</span
          >
          <span
            style="
              color: #77c4ff;
              font-size: 14px;
              width: 160px;
              display: block;
              margin-top: 6px;
            "
            v-else
            >{{ item.attr_name }}</span
          >
          <el-input-number
            v-if="
              data.airPressureUpper == item.attr_name ||
              data.airPressureLower == item.attr_name
            "
            v-model="item.value"
            controls-position="right"
            :precision="2"
            :step="0.1"
            min="1"
            class="mx-4"
            :controls="false"
          />
          <el-input-number
            v-else-if="data.electricityScope == item.attr_name"
            v-model="item.value"
            controls-position="right"
            :precision="2"
            :step="0.1"
            min="0"
            max="100"
            class="mx-4"
            :controls="false"
          />
          <el-input-number
            v-else
            v-model="item.value"
            controls-position="right"
            :precision="2"
            :step="0.1"
            min="-500"
            max="500"
            class="mx-4"
            :controls="false"
          />
          <span
            style="
              color: rgb(64 158 255 / 82%);
              margin-top: 10px;
              margin-left: 6px;
            "
            >{{ item.attr_unit }}
          </span>
          <span style="color: #fff"> </span
          ><!-- 这里需要添加提示信息-->
          <!-- :min="item.attr_min" -->
          <!-- :max="item.attr_max"  -->
        </div>
        <div>
          <el-button
            type="primary"
            @click="onSetAttrs"
            style="background: #00a5ff; margin: 10px 0px"
            v-if="data.deviceInfos.device_clazz_fk != 26"
            >确定</el-button
          >
        </div>
        <div class="information_title" style="margin-top: 10px">
          <div class="infotitle_img">
            <i class="iconfont icon-yunhangzhuangtai"></i>
          </div>
          <h5>运行状态</h5>
        </div>
        <div class="info_centent">
          <!-- 循环采样值分到运行状态中-->
          <ul>
            <li v-for="(item, index) in data.baseSamplingList" :key="index">
              <span>{{ item.sampleName }}</span>
              <span>{{ item.sampleValue }}</span>
              <span>{{ item.attr_unit }} </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 数据图表   device_clazz_fk!=26表示不是摄像头，摄像头没有图表信息-->
      <div
        class="curvelineDiv"
        v-if="data.checkType == 2 && data.deviceInfos.device_clazz_fk != 26"
      >
        <!-- 时间选择 -->
        <div class="timeDiv">
          <div class="block">
            <el-date-picker
              v-model="data.start_dateTime"
              ref="mytime"
              :disabled="data.ablehappy"
              style="width: 188px; height: 100%"
              type="datetime"
              placeholder="开始时间"
              align="right"
            >
            </el-date-picker>
            <span style="left: 26px; position: relative; color: white">至</span>
          </div>
          <div class="block">
            <el-date-picker
              v-model="data.end_dateTime"
              ref="mytimetwo"
              :disabled="data.ablehappy"
              type="datetime"
              style="width: 188px; height: 100%"
              placeholder="结束时间"
              align="right"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="searchDiv">
          <span @click="searchDiv_btn">搜索</span>
        </div>
        <!-- 时间按钮选择 -->
        <div class="timeBtn">
          <p
            v-for="(item, index) in data.timeList"
            :key="index"
            @click="timeTitle_btn(item)"
            :class="{ timeTitle_spansel: data.timeActive == item.id }"
          >
            {{ item.name }}
          </p>
        </div>
        <!-- 曲线值 -->
        <div class="echartsDiv_box">
          <el-scrollbar class="table_device heightsel_base">
            <div class="eacharts_div">
              <div
                class="eacharts"
                v-for="(item, index) in data.charDataList"
                :key="index"
              >
                <div :ref="BridgeDetector" class="eachartsList"></div>
              </div>
              <div></div>
            </div>
            <div
              v-loading="data.dwsdata"
              element-loading-text="拼命加载中"
              element-loading-background="rgba(0, 0, 0, 0)"
              style="height: 50px; margin-top: 60px"
            />
            <!-- 暂无数据 -->
            <div
              style="text-align: center; margin-top: 20px; color: white"
              v-if="data.charDataList.length == 0 && !data.dwsdata"
            >
              暂无数据
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue-demi";
import { nextTick, onMounted, watch, ref, Ref } from "vue";
import { useStore } from "vuex";
const $store = useStore();
import * as $echarts from "echarts";
import {
  PROJECTNAME,
} from "@/utils/enumeration";
import {
  getSamplingValues,
  getChartData,
  loadDeviceAttrs,
} from "@/api/home/index";
import { setDeviceAttr } from "@/api/device/index";
import {
  TimesnewDateFn_two,
  TimesmonthDateFn,
  Times_halfayearDateFn,
  Times_ayearDateFn,
  TimestampFn,
  TimesweekDateFn,
} from "@/utils/tool";
import { ElMessage } from "element-plus";
import { json } from "node:stream/consumers";
interface Idata {
  deviceInfos: object;
  imgUrl: string | undefined;
  deviceImgUrl: string | undefined;
  checkLists: string[];
  checkType: number;
  baseSamplingList: object[];
  timeList: object[];
  start_dateTime: null | undefined | Date;
  ablehappy: boolean;
  end_dateTime: null | undefined | Date;
  charDataList: object[];
  dwsdata: boolean;
  timeActive: number; //时间高亮
  deviceAttrs: object[];
  deviceAttrsClone: obj[];
  bestTimeinterval: number;
}
const data: Idata = reactive({
  deviceInfos: $store.getters["Common/getDeviceInfos"],
  imgUrl: process.env.VUE_APP_IMGURL,
  deviceImgUrl: '',
  checkLists: ["基本信息", "运行状态", "数据图表"],
  checkType: 0,
  baseSamplingList: [],
  electricityScope: "电量下限阈值",
  airPressureUpper: "气压上限阈值",
  airPressureLower: "气压下限阈值",
  timeList: [
    { name: "实时", id: 1 },
    { name: "近7天", id: 2 },
    { name: "近30天", id: 3 },
    // { name: "近半年", id: 4 },
    // { name: "近一年", id: 5 },
  ],
  start_dateTime: null,
  ablehappy: false,
  end_dateTime: null,
  charDataList: [],
  dwsdata: false,
  timeActive: 1, //时间高亮
  // 设置设备属性
  deviceAttrs: [],
  bestTimeinterval: 2678400000, //查询时最大的时间跨度
});

let BridgeDetectors: Ref<Element[]> = ref([]);
let BridgeDetector = (el: Element) => {
  if (el) BridgeDetectors.value.push(el);
};
watch(
  () => $store.getters["Common/getIsOpenDrawer"],
  (newold) => {
    if (newold) {
      data.deviceInfos = $store.getters["Common/getDeviceInfos"];
      initData();
    } else {
      data.baseSamplingList = [];
    }
  }
);
const onCheckType = (index: number) => {
  data.checkType = index;
  if (index == 2) {
    initTimeFn();
    getChartDataFn();
  }
};

const onSetAttrs = () => {
  let isNull: boolean = false,
    obj: any = {},
    logStrObj: any = {};

  console.log("点击确定");
  data.deviceAttrs.forEach((item: any) => {
    console.log("data.deviceAttrs>>item>>", item);
    if (item.value === null || item.value === "") {
      isNull = true;
    } else {
      obj[item.id] = item.value;
    }
  });
  data.deviceAttrsClone.forEach((item: any) => {
    if (!item.value) {
      // console.log("data.deviceAttrsClone>>item>>",item.value)
      // isNull = true;
    } else {
      logStrObj[item.attr_name] = item.value;
    }
  });
  console.log(
    "data.deviceAttrs>>",
    data.deviceAttrs,
    ">>>",
    data.deviceAttrsClone,
    ">>",
    isNull
  );
  if (isNull) {
    ElMessage.error("请完善未填属性");
    return;
  }

  setDeviceAttr({
    deviceId: data.deviceInfos.id,
    attrs: JSON.stringify(obj),
    type: 0,
    dealer: 0,
    logStr: JSON.stringify(logStrObj),
    project:PROJECTNAME,
  }).then((res) => {
    if (res.status == 1) {
      ElMessage.error(res.error);
    } else {
      ElMessage.success("修改成功！");
    }
  });
  console.log(obj);
};

const initData = () => {
  console.log("data.deviceInfos>>", data.deviceInfos.device_type_pic);
    if (data.deviceInfos && data.deviceInfos.id) {
    console.log('data.deviceInfos',data.deviceInfos);
    data.deviceImgUrl = `/public/picture/${data.deviceInfos.id}.png`;
  } else if (data.deviceInfos.device_type_pic) {
    data.deviceImgUrl =
      process.env.VUE_APP_IMGURL + data.deviceInfos.device_type_pic;
  }
  console.log(">data.deviceImgUrl>>" + data.deviceImgUrl);
  data.checkType = 0;
  data.checkLists = ["基本信息", "运行状态", "数据图表"];
  if (data.deviceInfos.device_clazz_fk === 26) {
    let index = data.checkLists.indexOf("数据图表");
    if (index != -1) {
      data.checkLists.splice(index, 1);
    }
  } else {
    let index = data.checkLists.indexOf("数据图表");
    if (index === -1) {
      data.checkLists.unshift("数据图表");
    }
  }
  getSampling();
  loadDeviceAttrs({ deviceId: data.deviceInfos.id }).then((res: any) => {
    res.forEach((item: any) => {
      if (item.value === null || item.value === "") {
        item.value = item.default_value - 0;
      } else {
        item.value = item.value - 0;
      }
      // item.value = item.value - 0 || item.default_value - 0;
    });
    data.deviceAttrs = res;
    data.deviceAttrsClone = JSON.parse(JSON.stringify(res)); //克隆一份数据
  });
};
onMounted(() => {
  initData();
});
// 获取设备运行状态
const getSampling = () => {
  getSamplingValues({ deviceId: data.deviceInfos.id }).then((res) => {
    data.baseSamplingList = res.data;
  });
};
// 选择时间事件
const timeTitle_btn = (item: any) => {
  data.timeActive = item.id;
  initTimeFn();
  getChartDataFn(); //获取采样曲线
};
// 初始化时间
const initTimeFn = () => {
  if (data.timeActive == 1) {
    data.start_dateTime = TimesnewDateFn_two().b;
    data.end_dateTime = TimesnewDateFn_two().c;
  } else if (data.timeActive == 2) {
    data.start_dateTime = TimesweekDateFn().b;
    data.end_dateTime = TimesweekDateFn().c;
  } else if (data.timeActive == 3) {
    data.start_dateTime = TimesmonthDateFn().b;
    data.end_dateTime = TimesmonthDateFn().c;
  } else if (data.timeActive == 4) {
    data.start_dateTime = Times_halfayearDateFn().b;
    data.end_dateTime = Times_halfayearDateFn().c;
  } else if (data.timeActive == 5) {
    data.start_dateTime = Times_ayearDateFn().b;
    data.end_dateTime = Times_ayearDateFn().c;
  }
};
//获取设备曲线图
const getChartDataFn = () => {
  console.log("getChartDataFn>>data>>", data);
  let samples: string = "",
    length = data.deviceInfos.sampleData.length - 1;

  if (data.deviceInfos.sampleData === "foo") {
    data.deviceInfos.sampleData = [];
  }
  data.deviceInfos.sampleData.forEach((item, index) => {
    samples += `${index < length ? item.sample_code + "," : item.sample_code}`;
  });
  data.dwsdata = true;
  data.charDataList = []; //清空曲线
  let dtaas = {
    startTime: TimestampFn(data.start_dateTime),
    endTime: TimestampFn(data.end_dateTime),
    deviceId: data.deviceInfos.id,
    sampleId: samples,
  };
  getChartData(dtaas).then((res) => {
    data.charDataList = res;
    // 刷新dom数据
    BridgeDetectors = ref([]);
    BridgeDetector = (el) => {
      if (el) BridgeDetectors.value.push(el);
    };
    BridgeListFN(); //画图部分
    data.dwsdata = false;
  });
};

//画曲线图部分
const BridgeListFN = () => {
  console.log("data.charDataList>>", data.charDataList);
  nextTick(() => {
    data.charDataList.forEach((item, index) => {
      const data = item.data ?? item.data;
      let colordata = 2;
      if (index == 0) {
        colordata = 1;
      } else if (index == 1) {
        colordata = 2;
      }
      getBridge_Chart(
        BridgeDetectors.value[index],
        data,
        item.name,
        item.x,
        colordata
      );
    });
  });
};

//  桥梁多条曲线echart部分
const getBridge_Chart = (
  chartDiv,
  charDataList,
  textname,
  xvalue,
  typedata
) => {
  const echartsDom = $echarts.init(chartDiv);
  const seriesdata = [];
  const legenddata = [];
  const xAxisdata = []; // x数据
  let xAxisdatay = xvalue; //坐标X的值
  for (let i = 0; i < charDataList.length; i++) {
    legenddata.push(charDataList[i].name);
    seriesdata.push({
      type: "line",
      // stack: "总量",
      name: charDataList[i].name,

      data: charDataList[i].y,
      symbol: "none",
      smooth: true,
      // 设置折线图颜色
      itemStyle: {
        normal: {
          lineStyle: {
            color:
              i == 0 && typedata == 1
                ? "#00A6FF"
                : i == 1 && typedata == 1
                ? "#06E8F2"
                : i == 0 && typedata == 2
                ? "#DA6D98"
                : i == 1 && typedata == 2
                ? "#06E8F2"
                : i == 0 && typedata == 3
                ? "#DA6D98"
                : i == 1 && typedata == 3
                ? "#00A6FF"
                : "#06E8F2",
            width: 1,
          },
          areaStyle: {
            color: new $echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color:
                  i == 0 && typedata == 1
                    ? "rgba(0, 165, 255, 0)"
                    : i == 1 && typedata == 1
                    ? "rgba(6, 232, 242, 0)"
                    : i == 0 && typedata == 2
                    ? "rgba(218, 109, 152, 0)"
                    : i == 1 && typedata == 2
                    ? "rgba(6, 232, 242, 0)"
                    : i == 0 && typedata == 3
                    ? "rgba(218, 109, 152, 0)"
                    : i == 1 && typedata == 3
                    ? "rgba(0, 165, 255, 0)"
                    : "rgba(6, 232, 242, 0)",
              },
              {
                offset: 1,
                color:
                  i == 0 && typedata == 1
                    ? "rgba(0, 165, 255, 0.6)"
                    : i == 1 && typedata == 1
                    ? "rgba(6, 232, 242, 0.6)"
                    : i == 0 && typedata == 2
                    ? "rgba(218, 109, 152, 0.6)"
                    : i == 1 && typedata == 2
                    ? "rgba(6, 232, 242, 0.6)"
                    : i == 0 && typedata == 3
                    ? "rgba(218, 109, 152, 0.6)"
                    : i == 1 && typedata == 3
                    ? "rgba(0, 165, 255, 0.6)"
                    : "rgba(6, 232, 242, 0.6)",
              },
            ]),
          },
        },
      },
      markLine: {
        symbol: "none",
        symbol: ["none", "none"],
        position: "insideTopCenter",
        itemStyle: {
          normal: {
            lineStyle: {
              type: "dotted",
              color: "#FFF",
            },
            label: {
              show: true,
              position: "middle",
            },
          },
        },
        large: true,
        effect: {
          show: false,
          loop: true,
          period: 0,
          scaleSize: 2,
          color: null,
          shadowColor: null,
          shadowBlur: null,
        },
        // data: [
        //   { type: "average", name: "平均值" },
        // ],
      },
    });
  }

  // y数据
  if (xAxisdatay && xAxisdatay.length > 0) {
    xAxisdatay.forEach((item, index) => {
      xAxisdata.push(item);
    });
  }
  const option = {
    color:
      typedata == 1
        ? ["#00A6FF", "#06E8F2", "#E67715"]
        : typedata == 2
        ? ["#DA6D98", "#06E8F2", "#E67715"]
        : typedata == 3
        ? ["#DA6D98", "#00A6FF", "#E67715"]
        : ["#06E8F2", "#06E8F2", "#06E8F2"],
    toolbox: {
      // feature: {
      //   saveAsImage: {
      //     show: true,
      //     excludeComponents: ["toolbox"],
      //     pixelRatio: 2,
      //     backgroundColor: "#29314C",
      //   },
      // },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    title: {
      text: textname,
      textStyle: {
        fontWeight: "normal",
        fontSize: 14,
        color: "rgba(255,255,255,1)",
        textAlign: "auto",
        fontFamily: "Noto Sans SC,微软雅黑",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      itemWidth: 6, // 设置宽度
      itemHeight: 6, // 设置高度
      data: legenddata,
      icon: "circle",
      x: "right", //居右显示
      textStyle: {
        fontWeight: "normal",
        fontSize: 12,
        color: "rgba(255,255,255,1)",
        textAlign: "auto",
      },
    },
    grid: {
      top: "20%",
      left: "10%",
      right: "10%",
      bottom: "10%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisdata,
      // show: false,
      axisLabel: {
        color: "#77C4FF",
        // opacity: 0,
      },
    },
    yAxis: {
      type: "value",
      min: "dataMin",
      max: "dataMax",
      axisLabel: {
        formatter(value, index) {
          return value.toFixed(2);
        },
        textStyle: {
          color: "#77C4FF",
        },
      },
      splitLine: {
        // 网格线
        show: false,
      },
    },

    series: seriesdata,
  };

  echartsDom.setOption(option);
};

//点击查询
const searchDiv_btn = function (): boolean {
  if (data.start_dateTime && data.end_dateTime) {
    let Timestamp_start: number = data.start_dateTime.getTime(); //开始时间
    let Timestamp_end: number = data.end_dateTime.getTime(); //结束时间
    console.log("data.bestTimeinterval>>", data.bestTimeinterval);
    if (Timestamp_start >= Timestamp_end) {
      ElMessage({
        message: "开始时间必须小于结束时间",
        type: "error",
      });
      return false;
    } else if (Timestamp_end - Timestamp_start > data.bestTimeinterval) {
      //31天为2678400000
      ElMessage({
        message: "时间跨度不能超过一个月",
        type: "error",
      });
      return false;
    }
  }
  getChartDataFn(); //获取采样曲线
  return true;
};
</script>

<style scoped lang="less">
.leftContent {
  padding: 10px 50px;
  .baseimg_box {
    width: 100%;
    height: 208px;
    background: rgba(12, 21, 48, 0.5);
    border: 1px solid #2a466e;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }
    .image-slot {
      color: #fff;
      text-align: center;
    }
  }
  .checkHeader {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    .checkStyle {
      background: rgba(0, 234, 255, 0.2);
      border: 1px solid #03d4d4;
      color: #00ffff;
    }
    .twoStyle {
      margin-left: 30px;
      margin-right: 30px;
    }
    p {
      width: 25%;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      background: rgba(15, 161, 178, 0.2);
      border: 1px solid #016565;
      text-align: center;
      padding: 4px 10px;
      // margin-left: 16px;
      // margin-right: 16px;
    }
  }
  .basicInformation {
    margin-top: 30px;
    .infotitle_img {
      background: #06e8f2;
      display: flex;
      align-items: center;
      width: 17px;
      height: 16px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 2px;
      margin-top: 4px;
      padding-top: 1px;
    }
    .info_centent {
      ul > li {
        padding: 0.625rem 0;
        border-image: -webkit-linear-gradient(#59a3f8, #000) 30 30;
        border-image: -moz-linear-gradient(#59a3f8, #000) 30 30;
        border-image: linear-gradient(#59a3f8, #000) 30 30;
        border-bottom: 0.125rem solid #59a3f8;
        font-size: 0.875rem;
        text-align: left;
        & > span:first-child {
          color: #77c4ff;
        }
        & > span:last-child {
          color: white;
          margin-left: 1.875rem;
        }
      }
    }
  }
  .runningState {
    margin-top: 30px;
  }
  .information_normal {
    width: 100%;
    margin-top: 40px;
    .information_title {
      font-size: 20px;
      color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      .infotitle_img {
        width: 34px;
        height: 16px;
        background: rgba(6, 232, 242, 1);
        display: flex;
        align-items: center;
        > i {
          flex: 1;
          color: #050d21;
          font-size: 13px;
          text-align: center;
        }
      }
      > h5 {
        margin-left: 8px;
        font-size: 16px;
      }
    }
    .info_centent ul li {
      padding: 10px 0;
      border-image: -webkit-linear-gradient(#59a3f8, #000) 30 30;
      border-image: -moz-linear-gradient(#59a3f8, #000) 30 30;
      border-image: linear-gradient(#59a3f8, #000) 30 30;
      border-bottom: 2px solid rgba(89, 163, 248, 1);
      font-size: 14px;
      text-align: left;
      > span:nth-child(1) {
        color: rgba(119, 196, 255, 1);
      }
      > span:nth-child(2) {
        color: rgba(255, 255, 255, 1);
        margin-left: 30px;
      }
      > span:nth-child(3) {
        color: rgba(255, 255, 255, 1);
        margin-left: 30px;
      }
    }
  }

  //曲线值
  .curvelineDiv {
    margin-top: 20px;
    // 时间选择
    .timeDiv {
      display: flex;
      align-items: center;
      > div:nth-child(1) {
        flex: 1;
      }
      > div:nth-child(2) {
        flex: 1;
      }
      > div:nth-child(2) {
        margin-left: 30px;
        text-align: left;
      }
    }

    :deep(.el-input__wrapper) {
      line-height: 36px;
      height: 36px;
      color: rgba(97, 130, 190, 1);
      border: 1px solid rgba(0, 149, 255, 1);
      background: #012456;
      box-shadow: 0px 0px 40px 0px rgba(12, 21, 48, 0.67);
    }
    :deep(.el-input__inner) {
      color: white;
    }
    .searchDiv {
      margin-top: 10px;
      margin-left: -10px;
      text-align: left;
      color: white;
      > span {
        background: #00a5ff;
        border-radius: 2px;
        cursor: pointer;
        padding: 4px 20px;
        font-size: 14px;
        margin-left: 10px;
      }
    }
    //  时间按钮
    .timeBtn {
      margin: 10px 0;
      display: flex;
      align-items: center;
      > p {
        flex: 1;
        background: rgba(15, 161, 178, 0.2);
        border: 1px solid #016565;
        font-size: 14px;
        margin-left: 20px;
        text-align: center;
        cursor: pointer;
        padding: 6px 0;
        color: white;
      }
      > p:nth-child(1) {
        margin-left: 0px;
      }
      > p:hover {
        background: rgba(0, 234, 255, 0.2);
        border: 1px solid #03d4d4;
        color: rgba(0, 255, 255, 1);
      }
      .timeTitle_spansel {
        background: rgba(0, 234, 255, 0.2);
        border: 1px solid #03d4d4;
        color: rgba(0, 255, 255, 1);
      }
    }

    //曲线值
    .echartsDiv_box {
      height: 380px;
      .eacharts_div {
        .eacharts {
          margin-top: 10px;
          .eachartsList {
            text-align: center;
            padding-top: 20px !important;
            height: 220px;
            width: 95%;
          }
        }
      }
    }
  }
}
.el-date-editor.el-input__wrapper {
  width: 200px !important;
}
</style>