<template>
  <div class="spaceSort_div">
    <!-- 边坡 -->
    <div class="sideSlope_div">
      <!-- 左边 -->
      <!-- 边坡监测 -->
      <div class="left border_box" v-if="area_code == 'Slope'">
        <span
          class="borderStyle"
          v-for="(item, index) in 4"
          :key="index"
        ></span>
        <!-- 头部部分 -->
        <div class="title_box">
          <p>边坡监测数据</p>
        </div>
        <div class="myChart_sideSlope" id="myChart_sideSlope"></div>
        <div
          v-loading="slopLoad"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="
            height: 50px;
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
          "
        />
        <div class="noData" v-if="!slopLoad && !slopesettleList.data">
          <span>暂无数据</span>
        </div>
      </div>

      <!-- 桥梁监测 -->
      <div class="left border_box" v-if="area_code == 'Bridge'">
        <span
          class="borderStyle"
          v-for="(item, index) in 4"
          :key="index"
        ></span>
        <!-- 头部部分 -->
        <div class="title_box">
          <p>桥墩监测数据</p>
        </div>
        <div class="myChart_sideSlope" id="myChart_Bridge"></div>
        <div
          v-loading="slopLoad"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="
            height: 50px;
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
          "
        />
        <div
          class="noData"
          v-if="
            !slopLoad &&
            (!settleBridgeList.upXArray ||
              settleBridgeList.upXArray.length == 0)
          "
        >
          <span>暂无数据</span>
        </div>
      </div>

      <!-- 右边 -->
      <!-- 边坡桥梁 -->
      <div class="right" v-if="area_code == 'Slope' || area_code == 'Bridge'">
        <!-- 气象信息 -->
        <div class="meteorological_div border_box">
          <span
            class="borderStyle"
            v-for="(item, index) in 4"
            :key="index"
          ></span>
          <!-- 头部部分 -->
          <div class="title_box">
            <p>基础数据</p>
          </div>
          <!-- 用来循环的div -->
          <div class="meteorological_boxSel">
            <el-carousel
              height="180px"
              arrow="never"
              initial-index="0"
              v-if="gasListnew.length > 0"
              ref="cardShow"
              class="checkTypeItem_box"
              trigger="click"
              indicator-position="outside"
            >
              <el-carousel-item v-for="item in gasListnew" :key="item">
                <div class="checkTypeItem_centent">
                  <!-- 用来循环的div -->
                  <div
                    class="meteorological_box"
                    v-for="(itemSon, index) in item"
                    :key="index"
                  >
                    <div class="meteoricon_div">
                      <img
                        src="../../../assets/image/public/meteorological_bg.png"
                        alt=""
                      />
                      <i :class="'iconfont' + ' ' + itemSon.icon"></i>
                    </div>
                    <div>
                      <p>{{ itemSon.value }} {{ itemSon.unit }}</p>
                      <p>{{ itemSon.sample_name }}</p>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div
              v-loading="slopLoad"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
              style="height: 50px; width: 100%"
            />
            <div v-if="gasListnew.length === 0 && !slopLoad" class="noData">
              <span>暂无数据</span>
            </div>
          </div>
        </div>

        <!-- 微电站剩余电量（%） -->
        <div class="meteorological_div pier_divSel border_box" v-if="TunnelTd != 1">
          <span
            class="borderStyle"
            v-for="(item, index) in 4"
            :key="index"
          ></span>
          <!-- 头部部分 -->
          <div class="title_box">
            <p>微电站剩余电量（%）</p>
          </div>
          <div class="meteorological_boxSel">
            <div class="alarm_title">
              <p>
                <span></span>
                <span>安全</span>
              </p>
              <p>
                <span></span>
                <span>警戒</span>
              </p>
            </div>
            <div class="equipmentPower" id="myChart_powerStation"></div>
            <!-- <div
              v-loading="slopLoad"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
              style="
                height: 50px;
                position: absolute;
                width: 100%;
                left: 50%;
                top: 50px;
                transform: translateX(-50%);
              "
            /> -->
            <div
              class="noData"
              v-if="
                !slopLoad &&
                (micSupplyList?.upXArray?.length === 0 ||
                  micSupplyList?.length === 0)
              "
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <!-- 设备信息 -->
        <div class="meteorological_div pier_divSel border_box" v-if="TunnelTd == 1">
          <span
            class="borderStyle"
            v-for="(item, index) in 4"
            :key="index"
          ></span>
          <!-- 头部部分 -->
          <div class="title_box">
            <p>设备数据</p>
          </div>
          <!-- 用来循环的div -->
          <div class="meteorological_boxSel">
            <el-carousel
              height="180px"
              arrow="never"
              initial-index="0"
              v-if="deviceListnew.length > 0"
              ref="cardShow"
              class="checkTypeItem_box"
              trigger="click"
              indicator-position="outside"
            >
              <el-carousel-item v-for="item in deviceListnew" :key="item">
                <div class="checkTypeItem_centent">
                  <!-- 用来循环的div -->
                  <div
                    class="meteorological_box"
                    v-for="(itemSon, index) in item"
                    :key="index"
                  >
                    <div class="meteoricon_div">
                      <p class="deviceName">
                        {{ itemSon.device_name }}
                      </p>
                      <!-- <img
                        src="../../../assets/image/public/meteorological_bg.png"
                        alt=""
                        class="deviceDataImg"
                      /> -->
                      <!-- aaaa{{itemSon.icon}} -->
                      <div
                        class="deviceDiv"
                        v-for="(itemDevice, index2) in itemSon.samples"
                        :key="index2"
                      >
                        <i
                          :class="'iconfont' + ' ' + itemDevice.icon"
                          style="
                            margin-top: 2px;
                            width: 10px;
                            height: 10px;
                            padding-right: 12px;
                          "
                        ></i>
                        <p class="deviceValue">
                          {{itemDevice.sample_name}}:{{ itemDevice.value }} {{ itemDevice.unit }}
                        </p>
                      </div>
                    </div>
                    <!-- <div>
                      
                      <p>{{ itemSon.sample_name }}</p>
                    </div> -->
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div
              v-loading="slopLoad"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
              style="height: 50px; width: 100%"
            />
            <div v-if="!slopLoad && gasListnew.length === 0" class="noData">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <!-- MEMS设备剩余电量（%） -->
        <div class="meteorological_div pier_divSel border_box">
          <span
            class="borderStyle"
            v-for="(item, index) in 4"
            :key="index"
          ></span>
          <!-- 头部部分 -->
          <div class="title_box">
            <p>MEMS设备剩余电量（%）</p>
          </div>
          <div class="meteorological_boxSel">
            <div class="alarm_title">
              <p>
                <span></span>
                <span>安全</span>
              </p>
              <p>
                <span></span>
                <span>警戒</span>
              </p>
            </div>
            <div class="equipmentPower" id="myChart_memsPower"></div>
            <div
              v-loading="slopLoad"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
              style="
                height: 50px;
                position: absolute;
                width: 100%;
                left: 50%;
                top: 50px;
                transform: translateX(-50%);
              "
            />
            <div
              class="noData"
              v-if="!slopLoad && memsList.upXArray.length === 0"
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 隧道监测 -->
      <div class="left border_box" v-if="area_code == 'Tunnel'">
        <span
          class="borderStyle"
          v-for="(item, index) in 4"
          :key="index"
        ></span>
        <!-- 头部部分 -->
        <div class="title_box">
          <p>拱顶监测数据{{ areaName_value }}</p>
        </div>
        <div class="myChart_sideSlope" id="myChart_tunnelTop"></div>
        <div
          v-loading="slopLoad"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="
            height: 50px;
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
          "
        />
        <div
          class="noData"
          v-if="
            !slopLoad &&
            (!tunnelTopList.upXArray || tunnelTopList.upXArray.length == 0)
          "
        >
          <span>暂无数据</span>
        </div>
      </div>
      <div class="left border_box" v-if="area_code == 'Tunnel'">
        <span
          class="borderStyle"
          v-for="(item, index) in 4"
          :key="index"
        ></span>
        <!-- 头部部分 -->
        <div class="title_box">
          <p>拱腰监测数据</p>
        </div>
        <div class="myChart_sideSlope" id="myChart_tunnelSide"></div>
        <div
          v-loading="slopLoad"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="
            height: 50px;
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
          "
        />
        <div
          class="noData"
          v-if="
            !slopLoad &&
            (!tunnelSideList.upXArray || tunnelSideList.upXArray.length == 0)
          "
        >
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  toRefs,
  getCurrentInstance,
  defineExpose,
} from "vue";
import { ref, nextTick, watch, Ref } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { PROJECTID, TUNNELID } from "@/utils/enumeration";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getHealthRealSpaceSort,
  getHealthRealSpaceSortCDN,
} from "@/api/recordsCenter/index";
import { useStore, useContext } from "vuex";
const store = useStore();
// const TunnelTd: string = store.state.Home.tunnelId;
const TunnelTd: string =TUNNELID;
const gasList = ref([]); //原来的数据
const gasListnew = ref([]); //处理后
// MEMS设备剩余电量
const memsList: Ref<any[] | object> = ref([]);

//设备数据
const deviceList = ref([]); //原来的设备数据
const deviceListnew = ref([]); //处理后设备数据

//微电站剩余电量
const micSupplyList: Ref<any[] | object> = ref([]);
const settleBridgeList = ref({}); //桥沉降
const tunnelTopList = ref({}); //隧道顶
const tunnelSideList = ref({}); //隧道腰
const slopesettleList = ref({}); //边坡图
const area_code: Ref<string | number> = ref("Tunnel"); //Tunnel,Slope,Bridge
const btnindex = ref(0);
const slopLoad = ref(true); //数据加载
const timeLong = 60 * 1000*5; //30秒
const timer = ref(0);
const btn = function (val: any, type: number | string) {
  if (val) {
    getHealthRealSpaceSortFn(val);
    timer.value = window.setInterval(function logname() {
    getHealthRealSpaceSortFn(val);
  }, timeLong);
  }
  if (type) {
    area_code.value = type;
  }
};
defineExpose({
  btn,
});

onMounted(() => {
  init_spaceSortFn();
});
function init_spaceSortFn() {
  //边坡
  gasList.value = {}; //气象信息
  memsList.value = {};
  micSupplyList.value = {};
  tunnelTopList.value = {};
  tunnelSideList.value = {};
  slopesettleList.value = {};
  console.log("创建当前组件");
}
//销毁
onBeforeUnmount(() => {
  let arr = [
    "myChart_memsPower",
    "myChart_powerStation",
    "myChart_sideSlope",
    "myChart_Bridge",
    "myChart_tunnelTop",
    "myChart_tunnelSide",
  ];
  for (let i = 0; i < arr.length; i++) {
    const dom = document.getElementById(arr[i]);
    if (dom) {
      const myChart = echarts.init(dom);
      myChart.dispose();
    }
  }
});

// 接口请求
// 边坡
const getHealthRealSpaceSortFn = (tunnelIdnew: number) => {
  let data = {
    tunnelId: tunnelIdnew,
  };
  emptyValueFn();
  slopLoad.value = true;
  if (tunnelIdnew == "1") {
    getHealthRealSpaceSortCDN(data).then((res: any) => {
      slopLoad.value = false;
      gasList.value = res.env; //气象信息
      memsList.value = res.mems; //MEMS设备剩余电量
      let deviceList1 = res.tear;
      deviceList.value = deviceList1?.concat(res.soil);
      micSupplyList.value = res.micSupply;
      tunnelTopList.value = res.top;
      tunnelSideList.value = res.side;
      slopesettleList.value = res.slopesettle;
      gasListFn();
      deviceListFn();
      //  MEMS设备剩余电量
      if (memsList.value) {
        equipmentPowerFn("myChart_memsPower", memsList.value);
        console.log("MEMS设备剩余电量");
      }
      //  剩余电量
      if (res.micSupply) {
        equipmentPowerFn("myChart_powerStation", micSupplyList.value);
        console.log("剩余电量");
      }

      //  桥沉降
      if (res.settle) {
        settleBridgeList.value = res.settle;
        myChartBridgeFn("myChart_Bridge", settleBridgeList.value);
        console.log("渲染桥梁数据");
      }
      // 隧道
      if (tunnelTopList.value) {
        myChartBridgeFn("myChart_tunnelTop", tunnelTopList.value);
        console.log("隧道");
      }
      if (tunnelSideList.value) {
        myChartBridgeFn("myChart_tunnelSide", tunnelSideList.value);
      }
      //边坡
      if (slopesettleList.value) {
        myChart_pierFn("myChart_sideSlope", slopesettleList.value);
        console.log("边坡");
      }
    });
  } else {
    getHealthRealSpaceSort(data).then((res: any) => {
      slopLoad.value = false;
      gasList.value = res.env; //气象信息
      memsList.value = res.mems; //MEMS设备剩余电量
      micSupplyList.value = res.micSupply;
      tunnelTopList.value = res.top;
      tunnelSideList.value = res.side;
      slopesettleList.value = res.slopesettle;
      gasListFn();
      //  MEMS设备剩余电量
      if (memsList.value) {
        equipmentPowerFn("myChart_memsPower", memsList.value);
        console.log("MEMS设备剩余电量");
      }
      //  剩余电量
      if (res.micSupply) {
        equipmentPowerFn("myChart_powerStation", micSupplyList.value);
        console.log("剩余电量");
      }

      //  桥沉降
      if (res.settle) {
        settleBridgeList.value = res.settle;
        myChartBridgeFn("myChart_Bridge", settleBridgeList.value);
        console.log("渲染桥梁数据");
      }
      // 隧道
      if (tunnelTopList.value) {
        myChartBridgeFn("myChart_tunnelTop", tunnelTopList.value);
        console.log("隧道");
      }
      if (tunnelSideList.value) {
        myChartBridgeFn("myChart_tunnelSide", tunnelSideList.value);
      }
      //边坡
      if (slopesettleList.value) {
        myChart_pierFn("myChart_sideSlope", slopesettleList.value);
        console.log("边坡");
      }
    });
  }
};

//对基础数据的处理
function gasListFn() {
  let data = gasList.value;
  gasListnew.value = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i += 6) {
      gasListnew.value.push(data.slice(i, i + 6));
    }
  }
}
//对设备数据进行处理
function deviceListFn() {
  let data = deviceList.value;
  deviceListnew.value = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i += 6) {
      deviceListnew.value.push(data.slice(i, i + 6));
    }
  }
}
//undefined和null转化为""
function changeNull(str) {
  if (str == undefined || str == null) {
    return "";
  } else {
    return str;
  }
}

function emptyValueFn() {
  gasList.value = [];
  memsList.value = {};
  micSupplyList.value = {};
  slopesettleList.value = {};
  settleBridgeList.value = {};
}

//空间域排序相应内容
function equipmentPowerFn(dom: string, itemValue: any) {
  nextTick(() => {
    const chartDom: HTMLElement = document.getElementById(dom) as HTMLElement;
    let myChart: echarts.ECharts = echarts.init(chartDom);
    let option = {
      grid: {
        top: "20%",
        left: "10px",
        bottom: "10px",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: itemValue.upXArray,
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          textStyle: {
            color: "rgba(119, 196, 255, 1)", //坐标值得具体的颜色
          },
        },
        splitLine: {
          //  show: false,
          lineStyle: {
            color: "rgba(35, 90, 178, 0.5)",
            type: "dashed", // y轴分割线类型
          },
        },
        //y轴线
        axisLine: {
          show: true,
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
            opacity: 0.3,
          },
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        backgroundColor: "rgba(0, 149, 255, 0.8)", // 背景色
        borderColor: "rgba(0, 149, 255, 0.8)",
        textStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        formatter: function (params: any) {
          let datanew = itemValue;
          let dataindex = params[0].dataIndex; //单前选中的项目
          let res = ""; //返回数据
          if (datanew.upYArray && datanew.upYArray.length > 0) {
            for (var i = 0; i < datanew.upYArray.length; i++) {
              let issecurity = "";
              if (params[0].value >= 20) {
                issecurity = "安全";
              } else {
                issecurity = "警戒";
              }
              if (i === dataindex) {
                res +=
                  params[0].marker +
                  datanew.upYArray[i].sampling_time +
                  "<br/>" +
                  "编号：" +
                  datanew.upYArray[i].device_name +
                  "<br/>" +
                  "电量指标：" +
                  issecurity +
                  "<br/>" +
                  datanew.upYArray[i].sample_name +
                  "：" +
                  datanew.upYArray[i].value +
                  datanew.upYArray[i].unit;
              }
            }
          }
          return res;
        },
      },
      visualMap: {
        min: 20,
        max: 100,
        show: false,
        inRange: {
          color: ["rgba(241, 159, 40, 1)", "rgba(0, 149, 255, 1)"],
        },
      },
      series: [
        {
          data: itemValue.upYArray,
          type: "scatter",
          symbolSize: 5,
        },
      ],
    };

    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    };
  });
}

//边坡数据
function myChart_pierFn(dom: string, itemValue: any) {
  nextTick(() => {
    const chartDom: HTMLElement = document.getElementById(dom) as HTMLElement;
    let myChart: echarts.ECharts = echarts.init(chartDom);
    let dataold = itemValue;
    let datanew = dataold.data;
    if (datanew && datanew.length > 0) {
      for (var i = 0; i < datanew.length; i++) {
        let [x, y, z] = datanew[i].coordinate;
        datanew[i].xnew = x;
        datanew[i].ynew = y;
        datanew[i].znew = z;
        if (datanew[i].znew == 0) {
          datanew[i].zpos = y + 0.05;
        } else {
          datanew[i].zpos = y + z + 0.05;
        }
      }
    }
    let dataDian = [];
    //回调后处理
    if (datanew && datanew.length > 0) {
      for (var j = 0; j < datanew.length; j++) {
        let iniarr = [];
        iniarr.push(datanew[j].xnew);
        iniarr.push(datanew[j].ynew);
        iniarr.push(datanew[j].zpos);
        iniarr.push(datanew[j].device_status)
        dataDian.push(iniarr);
      }
    }
    myChart.setOption({
      tooltip: {
        backgroundColor: "rgba(0, 149, 255, 0.8)", // 背景色
        borderColor: "rgba(0, 149, 255, 0.8)",
        textStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        formatter: function (params: any) {
          let [x, y, z] = params.value;
          let arr = x.toString() + "," + y.toString();
          let res = ""; //返回数据
          console.log("formatter>>datanew>>",arr);
          if (datanew && datanew.length > 0) {
            for (var i = 0; i < datanew.length; i++) {
              let posStr =
                datanew[i].xnew.toString() + "," + datanew[i].ynew.toString();
                console.log("formatter>>arr>>",arr);
                console.log("formatter>>posStr>>",posStr);
              if (arr === posStr) {
                if (!datanew[i].settlement && TunnelTd == 18) {
                  res +=
                    changeNull(datanew[i].newTime) +
                    "<br/>" +
                    "设备名称：" +
                    changeNull(datanew[i].device_name) +
                    "<br/>" +
                    "倾角：" +
                    changeNull(datanew[i].offset) +
                    "°" +
                    "<br/>" +
                    "剩余电量：" +
                    changeNull(datanew[i].value) +
                    "%" +
                    "<br/>" +
                    "设备状态：" +
                    isOnLine(datanew[i].device_status) +
                    "<br/>";
                } else {
                  res +=
                    changeNull(datanew[i].newTime) +
                    "<br/>" +
                    "设备名称：" +
                    changeNull(datanew[i].device_name) +
                    "<br/>" +
                    "倾角：" +
                    changeNull(datanew[i].offset) +
                    "°" +
                    "<br/>" +
                    "位移：" +
                    changeNull(datanew[i].hDisplacement) +
                    "mm" +
                    "<br/>" +
                    "沉降值：" +
                    changeNull(datanew[i].settlement) +
                    "mm" +
                    "<br/>" +
                    "剩余电量：" +
                    changeNull(datanew[i].value) +
                    "%" +
                    "<br/>" +
                    "设备状态：" +
                    isOnLine(datanew[i].device_status) +
                    "<br/>";
                }

                return res;
              }
            }
          }
        },
      },
      backgroundColor: {},
      // visualMap: {
      //   show: false,
      //   dimension: 2,
      //   min: 0,
      //   max:100,
      //   inRange: {
      //     color: ["#50c7fc",],
      //   },
      // },
      xAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      yAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      zAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      grid3D: {
        viewControl: {
          // projection: 'orthographic'
        },
      },
      series: [
        {
          type: "scatter3D",
          wireframe: {
            // show: false
          },
          data: dataDian,
          itemStyle:{
              color: function (params) {
                var datanew = params;
                console.log("itemStyle>>>>>",datanew.data[3])
                if(datanew.data[3]==0){
                   return 'rgba(0, 149, 255, 1)';
                }else if(datanew.data[3]>0){
                   return 'red';
                }else if(datanew.data[3]<0){
                  return 'rgba(85, 85, 85, 1)';
                }
                  
              },
          }
        },
      ],
    });

    window.onresize = function () {
      myChart.resize();
    };
  });
}
//判断是否在线
function isOnLine(deviceStatus) {
  if (deviceStatus < 0) {
    return "离线";
  } else if (deviceStatus == 0) {
    return "正常";
  } else if (deviceStatus > 0) {
    return "告警";
  } else {
    return "";
  }
}
//  沉降及偏移
function myChartBridgeFn(dom: string, itemValue: any) {
  const chartDom: HTMLElement = document.getElementById(dom) as HTMLElement;
  let myChart: echarts.ECharts = echarts.init(chartDom);
  let datay = itemValue.upYArray;
  for (let n in datay) {
    datay[n].offsetnew = (Math.abs(datay[n].offset) * 30) / 90;
    datay[n].value = datay[n].settlement;
    if (datay[n].offset < 0) {
      datay[n].offsetnew = datay[n].offset + 3.141592653589793;
    }
  }
  const dims = {
    time: 0,
    windSpeed: 1,
    R: 2,
    waveHeight: 3,
    weatherIcon: 2,
    minTemp: 3,
    maxTemp: 4,
  };
  const arrowSize = 12;
  const renderArrow = function (param: any, api: any) {
    const point = api.coord([api.value(dims.time), api.value(dims.windSpeed)]);
    return {
      type: "path",
      shape: {
        pathData: "M31 16l-15-15v9h-26v12h26v9z",
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize,
      },
      rotation: datay[param.dataIndex].offsetnew,
      position: point,
      style: api.style({
        stroke: "#60E5FD",
        fill: "#15DAAA",
        lineWidth: 1,
      }),
    };
  };
  let option = {
    legend: {
      orient: "vertical",
      right: "20px",
      y: "10px",
      textStyle: {
        fontWeight: "normal",
        fontSize: 12,
        color: "rgba(255,255,255,1)",
        textAlign: "auto",
      },
      borderWidth: 0.5,
      borderColor: "rgba(44, 176, 233, 0.2)",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      backgroundColor: "rgba(0, 149, 255, 0.8)", // 背景色
      borderColor: "rgba(0, 149, 255, 0.8)",
      textStyle: {
        color: "rgba(255, 255, 255, 0.8)",
      },
      formatter: function (params: any) {
        var color = "rgba(96, 229, 253, 1)"; //图例颜色
        console.log(color, 896);
        var htmlStr = "<div>";
        htmlStr +=
          '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
          color +
          ';"></span>';
        htmlStr += params[0].data.newTime + "<br>";
        htmlStr += "编号：" + params[0].data.device_name + "<br>";
        let py = parseFloat(params[0].data.offset);
        htmlStr += "偏移：" + py.toFixed(2) + "°" + "<br>";
        let hd = parseFloat(params[0].data.hDisplacement);
        htmlStr += "水平位移：" + hd.toFixed(2) + "mm" + "<br>";
        let aab = parseFloat(params[0].data.settlement);
        htmlStr += "沉降值：" + aab.toFixed(2) + "mm";
        htmlStr += "</div>";
        return htmlStr;
      },
    },
    grid: {
      top: "25%",
      left: "100px",
      bottom: "40px",
      containLabel: true,
    },

    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: itemValue.upXArray,
        name: itemValue.xTitle ? itemValue.xTitle : "时间",
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 12,
          padding: [0, 0, 0, 0],
        },
        nameGap: 25,
        nameLocation: "middle",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        //x轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(67, 154, 255, 0.2)",
          },
        },
      },
    ],
    yAxis: [
      {
        nameLocation: "middle",
        splitNumber: 5,
        axisLabel: {
          textStyle: {
            color: "rgba(119, 196, 255, 1)",
          },
        },
        name: itemValue.yTitle ? itemValue.yTitle : "设备沉降值",
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 12,
          padding: [0, 0, 0, 0],
        },
        nameGap: 45,
        splitLine: {
          // show: false,
          lineStyle: {
            type: "dashed",
            color: "rgba(67, 154, 255, 0.15)",
          },
        },
        //y轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(67, 154, 255, 0.2)",
          },
        },
        // y轴刻度线
        axisTick: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#00A5FF",
            opacity: 0.5,
          },
        },
      },

      {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],

    // dataZoom: [
    //   {
    //     type: "inside",
    //     xAxisIndex: 0,
    //     minSpan: 5,
    //   },
    //   {
    //     type: "slider",
    //     xAxisIndex: 0,
    //     minSpan: 5,
    //     bottom: 60,
    //   },
    // ],
    series: [
      {
        type: "custom",
        renderItem: renderArrow,
        encode: {
          x: dims.time,
          y: dims.windSpeed,
        },
        data: datay,
        z: 10,
      },
    ],
  };
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}
</script>

<style lang="scss" scoped>
// 空间域排序
.spaceSort_div {
  //  基础数据
  .checkTypeItem_box {
    position: relative;
    width: 100%;
    .checkTypeItem_centent {
      display: flex;
      align-items: center;
      width: calc(100% - 40px);
      padding-left: 20px;
      flex-flow: wrap;
    }
  }
  margin-top: 20px;
  .noData {
    width: 100%;
    > span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .sideSlope_div {
    display: flex;
    .left {
      flex: 1;
      height: 720px;
      border: 1px solid #003164;
      background: linear-gradient(0deg, rgba(0, 149, 255, 0) 0%, #003164 100%);
      position: relative;
      .myChart_sideSlope {
        width: 100%;
        height: calc(100% - 100px);
      }
      margin-right: 20px;
    }
    //右边部分
    .right {
      .meteorological_div {
        position: relative;
        width: 412px;
        height: 225px;
        border: 1px solid #003164;
        background: linear-gradient(
          0deg,
          rgba(0, 149, 255, 0) 0%,
          #003164 100%
        );
        .meteorological_boxSel {
          display: flex;
          align-items: center;
          width: calc(100% - 40px);
          padding-left: 20px;
          flex-flow: wrap;
          .meteorological_box {
            display: flex;
            align-items: center;
            width: 50%;
            > div:nth-child(2) {
              > p:nth-child(1) {
                color: #ffffff;
                font-size: 18px;
              }
              > p:nth-child(2) {
                font-size: 14px;
                color: #77c4ff;
              }
            }
            .meteoricon_div {
              position: relative;
              > i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              .deviceDataImg {
                width: 30px;
                height: 30px;
              }
              .deviceName {
                margin-bottom: 2px;
                margin-top: 0px;
                font-size: 15px;
                color: #77c4ff;
              }
              .deviceDiv {
                display: flex;
              }
              .deviceValue {
                font-size: 12px !important;
              }
            }
          }
          .equipmentPower {
            width: 100%;
            height: 180px;
            z-index: 5000;
          }
        }
      }
      .pier_divSel {
        margin-top: 20px;
      }
    }
  }

  // 公共头部分
  .title_box {
    margin: 10px 10px 0px 20px;
    font-weight: 500;
    > p {
      color: #ffffff;
      font-size: 18px;
    }
  }
  //安全告警
  .alarm_title {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 50px;
    top: 25px;
    > p {
      > span:nth-child(1) {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #0095ff;
        border-radius: 50%;
        margin-right: 10px;
      }
      > span:nth-child(2) {
        font-weight: 400;
        color: #ffffff;
        font-size: 14px;
      }
    }
    > p:nth-child(1) {
      > span:nth-child(1) {
        background: #0095ff;
      }
    }
    > p:nth-child(2) {
      margin-left: 20px;
      > span:nth-child(1) {
        background: rgba(241, 159, 40, 1);
      }
    }
  }

  //   边框公共样式
  .border_box {
    .borderStyle {
      position: absolute;
      width: 16px;
      height: 16px;
    }
    & > span:nth-of-type(1) {
      left: 0px;
      top: 0px;
      border-left: 1px solid #0095ff;
      border-top: 1px solid #0095ff;
    }
    & > span:nth-of-type(2) {
      right: 0px;
      top: 0px;
      border-right: 1px solid #0095ff;
      border-top: 1px solid #0095ff;
    }
    & > span:nth-of-type(3) {
      left: 0px;
      bottom: 0px;
      border-left: 1px solid #0095ff;
      border-bottom: 1px solid #0095ff;
    }
    & > span:nth-of-type(4) {
      right: 0px;
      bottom: 0px;
      border-right: 1px solid #0095ff;
      border-bottom: 1px solid #0095ff;
    }
  }
}
</style>
