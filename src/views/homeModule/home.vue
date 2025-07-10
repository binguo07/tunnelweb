<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-05 10:03:05
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 15:50:10
-->

<template>
  <div>
    <div id="home">
      <div class="mapClass">
      </div>

      <div class="continer left">
        <div>
          <BackTask
            title="今日数据"
            :width="360"
            :height="270"
            iconName="jinrishuju"
            iconColor="white"
            iconSize="20"
          >
            <div class="ModelContentClass">
              <div class="todayClass deviceNum">
                <div>
                  <img src="@/assets/image/index/jainceshebei.png" alt="" />
                </div>
                <div>
                  <p>设备总数</p>
                  <p>{{ TodayData.total }}</p>
                </div>
              </div>
              <div class="todayClass alarmNum" style="margin-top: 20px">
                <div>
                  <img src="@/assets/image/index/alarm.png" alt="" />
                </div>
                <div>
                  <p>告警数</p>
                  <p>{{ TodayData.alarmCount }}</p>
                </div>
              </div>
              <div class="todayClass offlineNum" style="margin-top: 20px">
                <div>
                  <img src="@/assets/image/index/offline.png" alt="" />
                </div>
                <div>
                  <p>设备离线率</p>
                  <p>
                    {{
                      TodayData.offRatio == null
                        ? ""
                        : parseFloat(TodayData.offRatio * 100).toFixed(2)
                    }}%（{{ TodayData.offCount }}）
                  </p>
                </div>
              </div>
            </div>
          </BackTask>
        </div>
        <div style="margin-top: 80px">
          <BackTask
            title="区域列表"
            :width="360"
            :height="400"
            iconName="quyuliebiao"
            iconColor="white"
            iconSize="20"
          >
            <div
              class="ModelContentClass"
              :class="{ 'scorll-class': monitorSubareaList.length > 3 }"
            >
              <div :style="`height:${360}px;`">
                <div
                  class="zoneList"
                  :style="`${index != 0 ? 'margin-top:10px' : ''}`"
                  v-for="(item, index) in monitorSubareaList"
                  :key="index"
                  @click="toMonitor(item)"
                >
                  <div>
                    <p>
                      {{ item.tunnel_name }}
                      <i class="iconfont icon-dingwei"></i>
                    </p>
                  </div>
                  <div>
                    <div>
                      <p>{{ item.tunnel_length }}</p>
                      <p>区域全程({{ item.unit }})</p>
                    </div>
                    <i class="borderStyle borderTop"></i>
                    <i class="borderStyle borderBottom"></i>
                    <div>
                      <p>{{ item.sensorCount }}</p>
                      <p>传感器(个)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BackTask>
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
        <!-- 确定按钮 -->
        <div class="footer_box">
          <span @click="confirmCancel_btn(1)">取消</span>
          <span @click="confirmCancel_btn(2)">确定</span>
        </div>
      </el-dialog>
      <div class="continer right">
        <div v-if="offlineObj.offlineList && offlineObj.offlineList.length > 0">
          <BackTask
            :title="`告警消息总数 (${offlineObj.alarmTotal})`"
            :width="360"
            :height="500"
            iconName="gaojingxiaoxi"
            iconColor="white"
            iconSize="20"
          >
            <div
              class="ModelContentClass"
              :class="{
                'scorll-class':
                  offlineObj.offlineList && offlineObj.offlineList.length > 8,
              }"
            >
              <div class="" :style="`height:${460}px;`">
                <div
                  class="offlineClass"
                  v-for="(item, index) in offlineObj.offlineList"
                  :key="index"
                  :style="`margin-top:${index != 0 ? '10' : '0'}px`"
                >
                  <div>
                    <img src="@/assets/image/index/offlineimg.png" alt="" />
                    <p>告警</p>
                  </div>
                  <i
                    style="left: 22%; top: 26%"
                    class="borderStyle borderTop"
                  ></i>
                  <i
                    class="borderStyle borderBottom"
                    style="left: 22%; top: 46%"
                  ></i>
                  <div class="border2Px"></div>
                  <div>
                    <div>
                      <p>{{ item.event_time }}</p>
                      <p>{{ item.desc }}</p>
                    </div>
                    <div>
                      <p @click="relieveDevice(item)">解除</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BackTask>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { resetFanErrorStatus } from "@/api/monitor/index";
import { useStore } from "vuex";
import { ref } from "vue";
import BackTask from "@/components/backTask.vue";
import { useRouter } from "vue-router";
const store = useStore();
const mapboxModel = ref(null);
const HomeName: string = store.state.Home.HomeName;
import { PROJECTID, PROJECTNAME } from "@/utils/enumeration";
import { removeDeviceErrorFunc } from "@/mixins/common";
import {
  getMonitorSubarea,
  getProjectAlarmLatest,
  removeDeviceError,
} from "@/api/home/index";
const offlineObj = ref({});
// 今日数据
const TodayData = ref({
  deviceNum: 325,
  alarmNum: 4,
  offlineNum: "0.3% (1)",
});
const valueDesc: Ref<string> = ref(""); //告警内容
const timer = ref(0);
const timeLong = 30 * 1000; //30秒
// 区域列表
const monitorSubareaList = ref([]);
const dialogVisible = ref(false);
const relieveList = ref({});
const TunnelTd: string = store.state.Home.tunnelId; //TunnelTd：18为德会高速
const IS_CDN_ID = 1; 
onMounted(() => {
  initData();
  timer.value = window.setInterval(function logname() {
    initData();
  }, timeLong);
  
});
onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
const initData = () => {
  // 获取今日数据和区域列表数据
  getMonitorSubarea({ projectId: PROJECTID }).then((res) => {
    TodayData.value = res.today;
    monitorSubareaList.value = res.monitorSubarea;
    store.commit("Home/TUNNEL_ID", monitorSubareaList.value[0].id);
    if(PROJECTID == IS_CDN_ID){
    router.push("/index/monitorConsole");
  }
  });
  // 获取告警信息
  getProjectAlarmLatest({ projectId: PROJECTID, count: 10 }).then((res) => {
    offlineObj.value = {
      offlineList: res.data,
      alarmTotal: res.alarmTotal,
    };
  });
};
const router: Router = useRouter();
const toMonitor = (item) => {
  console.log("toMonitorssss>>",item.id);
  let index = "";
  if (item.area_code === "Slope") {
    index = 1;
  } else if (item.area_code === "Bridge") {
    index = 2;
  } else if (item.area_code === "Tunnel") {
    index = 3;
  }
  store.commit("Home/TUNNEL_ID", item.id);
  router.push({
    path: "/index/monitorConsole",
    query: {
      type: index,
    },
  });
};

// 解除告警
const resetDevice = (row: object) => {
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  removeDeviceErrorFunc(row.recordId, row.deviceNo, "", userInfo).then(
    (res) => {
      if (res == 1) {
        initData();
      }
    }
  );
};
const resetFanErrorStatusFn = () => {
  var userInfonew = JSON.parse(localStorage.getItem("userInfo"));
  let data = {
    recordId: relieveList.value.recordId,
    device_no: relieveList.value.deviceNo,
    reason: valueDesc.value + "",
    loginId: userInfonew.loginId,
    project: PROJECTNAME,
  };

  resetFanErrorStatus(data).then((res) => {
    dialogVisible.value = false;
    if (res.code == -1) {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    } else {
      console.log(mapboxModel.value," -----")
      if (mapboxModel.value) {
        console.log(  mapboxModel.value,"----  mapboxModel.value")
        mapboxModel.value.getDevice(false)
      }
      initData();

      ElMessage({
        message: res.message,
        type: "success",
      });
      // getFireAlarmLatesFn();
    }
  });
};

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

const initOption = () => {
  const chartDom: HTMLElement = document.getElementById("home") as HTMLElement;
  console.log(chartDom, " -- ");
  let myChart: echarts.ECharts = echarts.init(chartDom);

  var sin = Math.sin;
  var cos = Math.cos;
  var pow = Math.pow;
  var sqrt = Math.sqrt;
  var cosh = Math.cosh;
  var sinh = Math.sinh;
  var PI = Math.PI;
  var aa = 0.4;
  var r = 1 - aa * aa;
  var w = sqrt(r);
  myChart.setOption({
    tooltip: {},
    backgroundColor: "#fff",
    visualMap: {
      show: false,
      dimension: 2,
      min: -1,
      max: 1,
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
    },
    xAxis3D: {
      type: "value",
    },
    yAxis3D: {
      type: "value",
    },
    zAxis3D: {
      type: "value",
    },
    grid3D: {
      viewControl: {
        // projection: 'orthographic'
      },
    },
    series: [
      {
        type: "surface",
        wireframe: {
          // show: false
        },
        equation: {
          x: {
            step: 0.03,
          },
          y: {
            step: 0.03,
          },
          z: function (x: number, y: number) {
            if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
              return "-";
            }
            return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
          },
        },
      },
    ],
  });
};
</script>

<style scoped lang="less">
#home {
  position: relative;
  width: 100%;
  height: calc(100% - 0px);
  .mapClass {
    position: relative;
    left: 0px;
    height: 0px;
    width: 100%;
    height: 100%;
    & > div {
      height: 100%;
    }
  }
  .continer {
    position: absolute;
    top: 10px;
    z-index: 51;
  }
  .left {
    left: 50px;
  }
  .right {
    right: 50px;
  }
  .ModelContentClass {
    padding: 20px;
  }
  .ModelContentClass::-webkit-scrollbar-track-piece{
    background: #012456;
  }
  .ModelContentClass::-webkit-scrollbar-thumb{
    background: #0455c5;
  }
  .todayClass {
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-items: center;
    img {
      width: 80px;
      height: 60px;
    }
    & > div:last-child {
      margin-left: 10px;
      p:first-child {
        margin-top: 4px;
        font-size: 16px;
        color: #ffffff;
      }
      p:last-child {
        font-size: 24px;
        font-family: msyh;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bold;
      }
    }
  }
  .todayClass:hover {
    background-image: url("@/assets/image/index/todayData.png");
  }

  .deviceNum {
    & > div:last-child {
      p:last-child {
        background-image: linear-gradient(#00ffee, #0095ff);
      }
    }
  }
  .alarmNum {
    & > div:last-child {
      p:last-child {
        background-image: linear-gradient(#fbcf34, #ff9b58);
      }
    }
  }
  .offlineNum {
    & > div:last-child {
      p:last-child {
        background-image: linear-gradient(#00ffee, #0095ff);
      }
    }
  }

  .zoneList {
    cursor: pointer;
    user-select: none;
    background-image: url("@/assets/image/index/zoneList.png");
    background-size: 100% 100%;
    opacity: 0.9;
    &:hover {
      opacity: 1;
    }
    padding: 16px 24px;
    p {
      font-family: msyh;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bold;
    }
    & > div:first-child {
      p {
        font-size: 16px;
        color: white;
      }
      i {
        color: #2b8aff;
        margin-left: 4px;
        font-size: 20px;
        // background-image: linear-gradient(142deg, #28b1ff 0%, #2b8aff 100%);
      }
    }
    & > div:last-child {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      div {
        color: white;
        p:first-child {
          font-size: 24px;
        }
        p:last-child {
          color: #77c4ff;
          font-size: 14px;
          margin-top: 4px;
        }
      }
      div:first-child {
        p:first-child {
          background-image: linear-gradient(45deg, #00ffee 0%, #0095ff 100%);
        }
      }
      div:last-child {
        p:first-child {
          background-image: linear-gradient(180deg, #0095ff 0%, #00ffee 100%);
        }
      }
      position: relative;
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
        width: 86%;
        p:first-child {
          color: white;
          font-size: 14px;
        }
        p:last-child {
          margin-top: 4px;
          color: #77c4ff;
          font-size: 15px;
          width: 180px;
        }
      }
      & > div:last-child {
        width: 14%;
        margin-right: 2px;
        margin-top: 20px;
        margin-left: 4px;
        p {
          width: 50px;
          display: none;
          cursor: pointer;
          color: #17e271;
          font-size: 14px;
          
          padding-bottom: 4px;
          border-bottom: 1px solid #17e271;
          width: 100%;
          text-align: right;
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
  //弹框
  .dialogCenter {
    display: flex;
    > div:nth-child(1) {
      margin-right: 20px;
    }
  }
:deep(.is-fullscreen){
      top: 30%;
    height: 400px !important;
    width: 500px !important;
    background: #012456 !important;
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
}
</style>
