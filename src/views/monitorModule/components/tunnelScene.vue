<template>
  <div class="tunnelSceneDiv">
    <div class="header">
      <el-button type="text" class="showData" @click="back_home"
        ><i
          style="font-size: 14px; color: white; margin-right: 6px"
          class="iconfont icon-fanhui"
        ></i>
        返回</el-button
      >
    </div>
    <!-- 隧道背景 -->
    <div class="tunnel_bg" id="center_div">
      <div class="center_div_box">
        <!-- 安装在桥上的设备 -->
        <div
          class="equipment_div"
          v-for="(item, index) in equipmentList"
          :key="index"
          :style="{ left: item.xnew + 'px', top: item.ynew + 'px' }"
        >
          <!--没有坐标数据隐藏图标-->
          <div
            class="temperatureDiv"
            v-if="item.show_page && item.xnew && item.ynew"
            @click="showDetile(item)"
          >
            <!-- 正常设备 -->
            <img
              src="../../../assets/image/public/normal_eq.png"
              alt=""
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn(index)"
              v-if="item.device_status === 0"
            />
            <!-- 异常设备 -->
            <img
              src="../../../assets/image/public/error_eq.png"
              alt=""
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn(index)"
              v-if="item.device_status > 0"
            />
            <!--离线-->
            <img
              src="../../../assets/image/public/online_eq.png"
              alt=""
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn(index)"
              v-if="item.device_status < 0"
            />
            <!-- 图标 -->
            <span class="duspan">
              <i :class="'iconfont' + ' ' + item.chart_icon"></i>
            </span>
            <!-- 异常设备 -->
            <!-- 正常弹框 -->
            <div
              class="frame_normal"
              :class="{ frame_show: activeimg === index }"
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn('null')"
              v-if="item.device_status === 0"
            >
              <div class="title">{{ item.device_name }}</div>
              <div
                class="frame_normal_box"
                v-for="(itemSon, index) in item.sampleData"
                :key="index"
              >
                <p>
                  <span v-if="itemSon.sample_name"
                    >{{ itemSon.sample_name }}:</span
                  >
                  <span
                    >{{ itemSon.value }} {{ itemSon.sample_extra_info }}</span
                  >
                </p>
              </div>
            </div>
            <!-- 异常弹框 -->
            <div
              class="frame_normal frame_err"
              :class="{ frame_show: activeimg === index }"
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn('null')"
              v-if="item.device_status > 0"
            >
              <div class="frame_normal_box">
                <p>
                  <span>{{ item.error_des }}</span>
                </p>
              </div>
            </div>
            <!-- 离线弹框 -->
            <div
              class="frame_normal frame_err"
              :class="{ frame_show: activeimg === index }"
              @mouseover="infodataFn(index)"
              @mouseout="hideinfodataFn('null')"
              v-if="item.device_status < 0"
            >
              <div class="frame_normal_box">
                <p>
                  <span>{{ item.error_des }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 左边 -->
    <div class="left_div">
      <div class="centent_box">
        <div class="pier_div">
          <!-- 公共头部分 -->
          <div class="title_box">
            <p>
              <i class="iconfont icon-gongdingjianceshuju"></i>
              <span>拱顶监测数据</span>
            </p>
          </div>
          <div class="pier_div_centent backCententSel">
            <img
              class="positionImg"
              src="@/assets/image/index/guangxiao.png"
              alt=""
            />
            <div class="equipmentPower" id="myChart_tunnelTop"></div>

            <div
              v-loading="bridgLoad"
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
                !bridgLoad &&
                (!topList.upXArray || topList.upXArray.length == 0)
              "
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="pier_div">
          <!-- 公共头部分 -->
          <div class="title_box">
            <p>
              <i class="iconfont icon-gongdingjianceshuju"></i>
              <span>拱腰监测数据</span>
            </p>
          </div>
          <div class="pier_div_centent backCententSel">
            <img
              class="positionImg"
              src="@/assets/image/index/guangxiao.png"
              alt=""
            />
            <div class="equipmentPower" id="myChart_tunnelSide"></div>
            <div
              v-loading="bridgLoad"
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
                !bridgLoad &&
                (!sideList.upXArray || sideList.upXArray.length == 0)
              "
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右边 -->
    <div class="right_div">
      <div class="centent_box">
        <!-- 告警列表 -->
        <div class="alarm_div">
          <!-- 公共头部分 -->
          <div class="title_box">
            <p>
              <i class="iconfont icon-gaojingxiaoxi"></i>
              <span>告警列表（{{ alarmCount }}）</span>
            </p>
          </div>
          <!-- 告警列表内容 -->
          <div class="alarm_div_centent backCententSel">
            <img
              class="positionImg"
              src="@/assets/image/index/guangxiao.png"
              alt=""
            />
            <div class="cententClass scorll-class">
              <div class="heightSel_alarm">
                <div
                  class="offlineClass"
                  v-for="(item, index) in offlineList"
                  :key="index"
                  :style="`margin-top:${index != 0 ? '10' : '0'}px`"
                >
                  <div>
                    <img src="@/assets/image/index/offlineimg.png" alt="" />
                    <p>告警</p>
                  </div>
                  <i
                    style="left: 22%; top: 20px"
                    class="borderStyle borderTop"
                  ></i>
                  <i
                    class="borderStyle borderBottom"
                    style="left: 22%; top: 40px"
                  ></i>
                  <div class="border2Px"></div>
                  <div>
                    <div>
                      <p>{{ item.event_time }}</p>
                      <p>{{ JSON.parse(item.field_records).desc }}</p>
                    </div>
                    <div>
                      <p @click="relieveDevice(item)">解除</p>
                    </div>
                  </div>
                </div>

                <div
                  v-loading="alarmload"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0)"
                  style="height: 50px"
                />
                <div
                  v-if="offlineList.length === 0 && !alarmload"
                  class="noData"
                >
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部部分 -->
    <div class="footer_div">
      <div
        class="checkTypeItem"
        @click="onCheckType(index, item)"
        :class="{ checkStyle: checkType == index }"
        :style="`${index != 0 ? 'margin-left:10px;' : ''}`"
        v-for="(item, index) in footerList"
        :key="index"
      >
        <p>{{ item.devs.length }}</p>
        <div class="check_box">
          <i :class="'iconfont' + ' ' + item.icon"></i>
          <p>{{ item.typeName }}</p>
        </div>
        <img src="@/assets/image/index/guangxiao.png" alt="" />
      </div>
    </div>
    <!-- 解除告警弹框 -->
    <el-dialog
      title="是否要解除当前设备异常告警"
      v-model="dialogVisible"
      :fullscreen="true"
      :before-close="handleClose"
      @opened="opened"
      @close="closing"
    >
      <div class="line_top"></div>
      <div class="dialogCenter">
        <div>原因</div>
        <div style="width: 81%">
          <el-input
            type="textarea"
            :rows="8"
            v-model="valueDesc"
            :clearable="true"
            maxlength="300"
            placeholder="请输入解除原因"
          ></el-input>
        </div>
      </div>
      <div class="line_bottom"></div>
      <!-- 确定按钮 -->
      <div class="footer_box">
        <span @click="confirmCancel_btn(1)">取消</span>
        <span @click="confirmCancel_btn(2)">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted,onBeforeUnmount, onDeactivated } from "vue";
import { ref } from "vue";
import { nextTick } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// const TunnelTd: string = "17";
import {
  getHealthRealBridge,
  queryDeviceTitle,
  findDeviceSamplingData,
  getFireAlarmLates,
  resetFanErrorStatus,
} from "@/api/monitor/index";
import { TUNNELID } from "@/utils/enumeration";
const router: Router = useRouter();
const store = useStore();
// let TunnelTd: string = store.state.Home.tunnelId;
let TunnelTd: string|number = TUNNELID
const offlineList = ref([]); //告警列表
const equipmentList = ref([
  //   //  一组
  //  {xnew:250,ynew:400,show_page:true,device_status:0,sampleData:[]},
  //  {xnew:300,ynew:450,show_page:true,device_status:0,sampleData:[]},
  //  {xnew:355,ynew:550,show_page:true,device_status:0,sampleData:[]},
  //   //  二组
  //   {xnew:645,ynew:229,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:679,ynew:289,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:733,ynew:355,show_page:true,device_status:0,sampleData:[]},
  //    //  三组
  //   {xnew:855,ynew:138,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:891,ynew:190,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:924,ynew:251,show_page:true,device_status:0,sampleData:[]},
  //    //四组
  //   {xnew:1067,ynew:52,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:1108,ynew:104,show_page:true,device_status:0,sampleData:[]},
  //   {xnew:1128,ynew:153,show_page:true,device_status:0,sampleData:[]},
]);
const activeimg = ref("null"); //设备弹框显示隐藏
const alarmload = ref(true);
const bridgLoad = ref(true); //状态
const alarmCount: number = ref(0); //告警条数
const dialogVisible = ref(false);
const valueDesc: string = ref(""); //告警内容
const relieveList = ref({});
const topList = ref({}); //拱顶沉
const sideList = ref({}); //拱腰沉降
const footerList = ref([]); //底部数据
const checkType: number = ref(0);
const deviceClazzFn: string = ref(""); //类型id
const timer = ref(0);
const timeLong = 30 * 1000; //30秒
//销毁
onBeforeUnmount(() => {
  let arr = ["myChart_tunnelTop", "myChart_tunnelSide"];
  for (let i = 0; i < arr.length; i++) {
    const dom = document.getElementById(arr[i]);
    if (dom) {
      const myChart = echarts.init(dom);
      myChart.dispose();
    }
  }
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});

onMounted(() => {
  initFn(); //初始化
});
onUnmounted(() => {
  // if(TunnelTd != 1){
  //     TunnelTd = 18;
  //     store.commit("Home/TUNNEL_ID", TunnelTd);
  // }
});
onDeactivated(() => {
  //离开当前组件的生命周期执行的方法
  window.clearInterval(timer.value);
});
function initFn() {
  getFireAlarmLatesFn();
  timer.value = window.setInterval(function logname() {
    getFireAlarmLatesFn();
  }, timeLong);
  getHealthRealBridgeFn(); //图表接口
  GetAueryDeviceTitleFn(); //设备
}
//  获取坐标点
function center_btn() {
  let pos = document.getElementById("center_div");
  pos.onmouseup = function (ev) {
    console.log("x:", ev.offsetX - 12);
    console.log("y:", ev.offsetY - 30);
  };
}

// 返回首页
function back_home() {
  router.push({
    path: "/index/home",
  });
}
// 查看设备详细信息
const showDetile = (row) => {
  // 存储数据到仓库
  store.commit("Common/SET_STATE_VALUE", {
    name: "deviceInfos",
    value: row,
  });
  // 打开详细弹窗
  store.commit("Common/SET_STATE_VALUE", {
    name: "isOpenDrawer",
    value: true,
  });
};

//底部设备类型
const GetAueryDeviceTitleFn = () => {
  let data = {
    tunnelId: TunnelTd,
  };
  queryDeviceTitle(data).then((res) => {
    footerList.value = res;
    equipmentListBackFn();
  });
};

//对设备的处理
function equipmentListBackFn() {
  let data = footerList.value;
  equipmentList.value = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      data[i].show_page = true; //控制页面设备显示隐藏
      if (data[i].devs && data[i].devs.length > 0) {
        for (var j = 0; j < data[i].devs.length; j++) {
          let [x, y] = data[i].devs[j].coordinate;
          data[i].devs[j].xnew = x;
          data[i].devs[j].ynew = y;
          equipmentList.value.push(data[i].devs[j]);
        }
      }
    }

    deviceClazzFn.value = data[0].device_clazz_fk; //默认选中的项目
    pageShowFn();
  }

  getFindDeviceSamplingDataFn();
}

//获取所有设备采样后期可能定时刷新
function getFindDeviceSamplingDataFn() {
  let data = {
    tunnelId: TunnelTd,
  };
  findDeviceSamplingData(data).then((res) => {
    let datanew = equipmentList.value;
    if (datanew && datanew.length > 0) {
      for (var i = 0; i < datanew.length; i++) {
        var devicePk = datanew[i].id;
        var sampleArray = res["device" + devicePk];
        if (sampleArray) {
          datanew[i].sampleData = sampleArray;
        }
      }
    }
  });
}

//底部按钮
const onCheckType = (index: number, item: object) => {
  checkType.value = index;
  deviceClazzFn.value = item.device_clazz_fk;
  pageShowFn();
};

//设备显示隐藏处理
function pageShowFn() {
  let data = equipmentList.value;
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].device_clazz_fk === deviceClazzFn.value) {
        data[i].show_page = true;
      } else {
        data[i].show_page = false;
      }
    }
  }
}

//解除告警
const relieveDevice = (row: object) => {
  relieveList.value = {};
  dialogVisible.value = true;
  relieveList.value = row;
};

//  告警确定取消
function confirmCancel_btn(val) {
  if (val === 1) {
    dialogVisible.value = false;
  } else if (val === 2) {
    // 确定告警
    resetFanErrorStatusFn();
  }
}

const resetFanErrorStatusFn = () => {
  var userInfonew = JSON.parse(localStorage.getItem("userInfo"));
  let data = {
    recordId: relieveList.value.recordId,
    device_no: relieveList.value.device_no,
    reason: valueDesc.value,
    loginId: userInfonew.loginId,
  };
  resetFanErrorStatus(data).then((res) => {
    dialogVisible.value = false;
    if (res.code == -1) {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    } else {
      initFn(); //初始化
      ElMessage({
        message: res.message,
        type: "success",
      });

      // getFireAlarmLatesFn();
    }
  });
};

//  告警列表
const getFireAlarmLatesFn = () => {
  alarmload.value = true;
  let data = {
    tunnelId: TunnelTd,
    pageNumber: 1,
    pageSize: 10,
    status: 0, //(0未解除的设备)
  };
  getFireAlarmLates(data).then((res) => {
    alarmload.value = false;
    let resdata = res.data;
    offlineList.value = resdata.records;
    alarmCount.value = resdata.totalRow; //总条数量
  });
};

const getHealthRealBridgeFn = () => {
  emptyFn();
  let data = {
    tunnelId: TunnelTd,
  };
  bridgLoad.value = true;
  getHealthRealBridge(data).then((res) => {
    bridgLoad.value = false;
    topList.value = res.top; //拱顶沉降
    sideList.value = res.side; //拱腰沉降
     console.log("graph2D>topList>",topList.value)
    nextTick(() => {
      if (topList.value.upXArray && topList.value.upXArray.length > 0) {
       
        myChartBridgeFn("myChart_tunnelTop", topList.value); //桥沉降
      }
      if (sideList.value.upXArray && sideList.value.upXArray.length > 0) {
        myChartBridgeFn("myChart_tunnelSide", sideList.value); //剩余电量
      }
    });
  });
};

//清空值
function emptyFn() {
  topList.value = {};
  sideList.value = {};
}

//  沉降及偏移
function myChartBridgeFn(dom, itemValue) {
  nextTick(() => {
    const chartDom: HTMLElement = document.getElementById(dom) as HTMLElement;
    let myChart: echarts.ECharts = echarts.init(chartDom);
    console.log(myChart, 88888);
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
    const arrowSize = 6;
    const renderArrow = function (param, api) {
      const point = api.coord([
        api.value(dims.time),
        api.value(dims.windSpeed),
      ]);
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
        formatter: function (params) {
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
        bottom: "30px",
        containLabel: true,
      },

      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: itemValue.upXArray,
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
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
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
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
  });
}

//鼠标入事件
function infodataFn(val) {
  activeimg.value = val;
}

// 鼠标离开
function hideinfodataFn(val) {
  activeimg.value = val;
  // activeimg.value = "null";
}
</script>

<style lang="scss" scoped>
.tunnelSceneDiv {
  color: #ffffff;
  z-index: 1;
  position: relative;
  height: calc(100vh - 90px);
  background-image: url("../../../assets/image/monitorModule/tunnel_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .header {
    z-index: 20;
    position: absolute;
    right: 20px;
    cursor: pointer;
    .showData {
      border: 1px solid #0f68b9;
      border-radius: 4px;
      box-shadow: 0px 0px 10px #0f68b9 inset;
      padding: 12px;
      color: white;
      font-size: 14px;
    }
  }
  .noData {
    width: 100%;
    > span {
      position: absolute;
      left: 50%;
      top: 50px;
      transform: translateX(-50%);
    }
  }
  //隧道背景
  .tunnel_bg {
    position: absolute;
    z-index: 3;
    height: 780px;
    width: calc(100% - 610px);
    margin-left: 186px;
    margin-top: 55px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("../../../assets/image/monitorModule/tunnel_img.png");
    .center_div_box {
      position: relative;
      .equipment_div {
        position: absolute;
        left: 0px;
        top: 0px;
        //  设备部分
        .temperatureDiv {
          position: relative;
          cursor: pointer;
          .duspan {
            position: absolute;
            width: 50px;
            font-size: 14px;
            left: 11px;
            top: 15px;
          }

          //  正常弹框样式
          .frame_normal {
            position: absolute;
            z-index: 100;
            width: 160px;
            min-height: 92px;
            top: 10px;
            left: 60px;
            display: none;
            background-image: url("../../../assets/image/public/normal_bubblebox.png");
            background-size: 100% 100%;
            .title {
              margin: 10px 20px 5px 30px;
              color: #77c4ff;
              font-size: 16px;
            }
            .frame_normal_box {
              color: #ffffff;
              font-size: 14px;
              margin: 10px 10px 10px 30px;
              > p {
                color: #77c4ff;
                font-size: 14px;
              }
            }
          }
          //设备异常弹框
          .frame_err {
            min-height: 50px;
            width: 160px;
            background-image: url("../../../assets/image/public/error_bubblebox.png") !important;
            display: none;
            .frame_normal_box {
              > p {
                color: #ffffff;
                font-size: 14px;
                width: 100%;

                word-break: break-all;
                word-wrap: break-word;
              }
            }
          }
          //弹框显示
          .frame_show {
            display: block;
          }
        }
      }
    }
  }

  // 公共头部
  .title_box {
    width: 360px;
    background-image: url("../../../assets/image/monitorModule/title_bg.png");
    background-size: 100% 100%;
    padding: 8px 0px;
    > p {
      display: flex;
      align-items: center;
      margin-left: 18px;
      > span {
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        margin-left: 14px;
      }
      i {
        font-size: 20px;
        color: #ffffff;
      }
    }
  }
  //公共背景
  .backCententSel {
    width: 360px;
    background: rgba(3, 34, 84, 0.7);
    position: relative;
    box-shadow: 0px 0px 14px #0e4bad;
    border: 1px solid #0e4bad;
    .positionImg {
      position: absolute;
      bottom: -26px;
      height: 50px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .cententClass {
    padding: 20px;
  }

  //  告警部分
  .offlineClass {
    user-select: none;
    padding: 10px 0px 10px 0px;
    display: flex;
    position: relative;
    background: #015aa35f;
    & > div:first-child {
      img {
        width: 64px;
        height: 64px;
      }
      p {
        color: #77c4ff;
        font-size: 12px;
        text-align: center;
        margin-top: -10px;
      }
    }
    & > div:last-child {
      margin-left: 26px;
      display: flex;
      & > div:first-child {
        width: 80%;
        p:first-child {
          color: white;
          font-size: 14px;
        }
        p:last-child {
          margin-top: 4px;
          color: #77c4ff;
          font-size: 15px;
        }
      }
      & > div:last-child {
        p {
          display: none;
          cursor: pointer;
          color: #17e271;
          font-size: 14px;
          padding-bottom: 4px;
          border-bottom: 1px solid #17e271;
        }
      }
    }
  }
  .border2Px {
    position: absolute;
    background: #1b60cc;
    width: 6px;
    height: 100%;
    left: -10px;
    top: 0px;
    display: none;
  }
  .offlineClass:hover {
    & > div:last-child {
      & > div:last-child {
        p {
          display: block;
        }
      }
    }
    .border2Px {
      display: block;
    }
  }
  .borderStyle {
    display: block;
    position: absolute;
    height: 24px;
    left: 50%;
    width: 2px;
  }
  .borderTop {
    top: -6px;
    background: linear-gradient(0deg, #0095ff 0%, rgba(0, 149, 255, 0) 100%);
  }
  .borderBottom {
    top: 18px;
    background: linear-gradient(180deg, #0095ff 0%, rgba(0, 149, 255, 0) 100%);
  }

  //气象信息
  .equipmentPower {
    height: 100%;
    z-index: 5000;
  }

  //  左边展板
  .left_div {
    z-index: 3;
    position: absolute;
    min-width: 412px;
    height: calc(100vh - 90px);
    .centent_box {
      margin-left: 3px;
      margin-right: 3px;
      height: calc(100vh - 120px);
      > div {
        height: 330px;
        margin-top: 20px;
        .pier_div_centent {
          height: 290px;
        }
      }
    }
  }

  // 右边板块
  .right_div {
    position: absolute;
    min-width: 412px;
    z-index: 3;
    right: 0;
    margin-top: 20px;
    height: calc(100vh - 90px);
    .centent_box {
      margin-left: 50px;
      margin-right: 3px;
      height: calc(100vh - 120px);
      > div {
        height: calc(33vh - 60px);
        margin-top: 20px;
        .alarm_div_centent {
          height: calc(62vh - 100px);
          .heightSel_alarm {
            height: calc(62vh - 160px);
          }
        }
      }
    }
  }

  //弹框按钮
  .footer_box {
    margin: 40px 40px;
    text-align: center;
    font-weight: 400;
    color: #ffffff;
    > span {
      border-radius: 4px;
      padding: 6px 25px;
      font-size: 14px;
      cursor: pointer;
    }
    > span:nth-child(1) {
      background: rgba(0, 149, 255, 0.3);
    }
    > span:nth-child(2) {
      background: rgba(0, 149, 255, 1);
      margin-left: 30px;
    }
  }

  // 底部部分
  .footer_div {
    position: absolute;
    bottom: 30px;
    left: 420px;
    display: flex;
    min-width: 1096px;
    z-index: 4;
    justify-content: center;
    .checkTypeItem {
      position: relative;
      padding: 14px;
      background: #032254;
      border: 1px solid #00468f;
      cursor: pointer;
      width: 190px;
      box-shadow: 0px 0px 14px #0e4badbd;

      div {
        display: flex;
        justify-items: center;
        p {
          font-size: 16px;
          color: rgba(0, 149, 255, 0.6);
          font-family: SourceHanSansCN-Regular;
          margin-left: 10px;
          margin-top: 8px;
        }
      }
      p {
        text-align: right;
        color: rgba(119, 196, 255, 0.6);
        font-size: 14px;
      }
      i {
        font-size: 28px;
        color: rgba(0, 149, 255, 0.5);
      }
      img {
        display: none;
      }
    }
    .checkStyle {
      box-shadow: 0px 0px 14px #0062ff;
      > p {
        color: rgba(0, 149, 255, 1);
      }
      img {
        position: absolute;
        position: absolute;
        left: 14%;
        bottom: -23px;
        display: block;
        width: 70%;
      }
      .check_box {
        > p {
          color: rgba(0, 149, 255, 1);
        }
        i {
          color: rgba(0, 149, 255, 1);
        }
      }
    }
  }

  //告警弹框
  .line_top {
    border-top: 1px solid rgba(67, 154, 255, 0.3);
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0;
  }
  .line_bottom {
    border-top: 1px solid rgba(67, 154, 255, 0.3);
    width: 100%;
    position: absolute;
    bottom: 90px;
    left: 0;
  }
  .dialogCenter {
    display: flex;
    > div:nth-child(1) {
      margin-right: 20px;
      color: #ccf2ff;
    }
  }
}
</style>



