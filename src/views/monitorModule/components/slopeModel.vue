<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 10:07:42
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 17:04:19
-->
<template>
  <div id="slope" v-if="viewDataState === 1">
    <div class="header">
      <el-button type="text" class="showData" @click="view_btn"
        ><i
          style="font-size: 14px; color: white; margin-right: 6px"
          class="iconfont icon-chakanshuju"
        ></i>
        查看数据</el-button
      >
      <el-button type="text" class="showData" @click="manualAlarm">
        <i style="font-size: 14px; color: white; margin-right: 6px" class="iconfont icon-gaojingxiaoxi"></i>
        手动报警
      </el-button>
    </div>
    <div class="contentClass">
      <!-- 左边内容 -->
      <div>
        <div class="center_div" id="center_div" @click="center_btn()">
          <div class="cesium-container" id="cesiumContainer" />
          <div class="cesium-toolbar">
            <el-button type="primary" class="toolbar-button" @click="resetCameraView" title="初始视图">
              初始视角
            </el-button>
            <div class="toolbar-switch">
              <span>影像</span>
              <el-switch v-model="imageryLayerVisible" @change="toggleImageryLayer" />
            </div>
            <div class="toolbar-switch">
              <span>地形</span>
              <el-switch v-model="elevationLayerVisible" @change="toggleElevationLayer" />
            </div>
          </div>
          <div class="brand-logo">
            <img src="@/assets/image/public/brand_logo.png" alt="Brand Logo" />
          </div>
          <div id="cesium-info-container">
            <div
                class="cesium-entity-tooltip"
                v-if="hoveredDevice"
                :style="{
                left: hoveredPosition.x + 'px',
                top: hoveredPosition.y + 'px',
                display: hoveredDevice ? 'block' : 'none'
              }"
            >
              <div
                  v-if="hoveredDevice.device_status === 0"
                  class="tooltip-content normal-tooltip"
              >
                <div class="title">{{ hoveredDevice.device_name || hoveredDevice.title }}</div>
                <div
                    v-if="hoveredDevice.sampleData.length > 0"
                    class="frame_normal_box"
                    :key="index"
                    v-for="(sample, index) in hoveredDevice.sampleData"
                >
                  <p>
                    <span v-if="sample.sample_name">{{ sample.sample_name }}:</span>
                    <span>{{ sample.value }} {{ sample.sample_extra_info || '' }}</span>
                  </p>
                </div>
              </div>

              <div
                  v-else-if="hoveredDevice.device_status > 0"
                  class="tooltip-content error-tooltip"
              >
                <div class="frame_normal_box">
                  <p>
                    <span>{{ hoveredDevice.error_des || '设备异常' }}</span>
                  </p>
                </div>
              </div>

              <div
                  v-else
                  class="tooltip-content offline-tooltip"
              >
                <div class="frame_normal_box">
                  <p>
                    <span>{{ hoveredDevice.error_des || '设备离线' }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <!-- 自定义箭头 -->
          <div class="arrow_box">
            <div class="leftArrow" v-if="footerListnew.length > 6">
              <img
                src="@/assets/image/public/prev.png"
                v-if="footerListnew"
                @click="arrowClick('left')"
              />
            </div>
            <el-carousel
              class="checkTypeItem_box"
              height="100px"
              arrow="never"
              indicator-position="none"
              :autoplay="false"
              initial-index="0"
              v-if="footerListnew.length > 0"
              ref="cardShow"
            >
              <el-carousel-item v-for="(item, index) in footerListnew" :key="index">
                <div class="checkTypeItem_centent">
                  <div
                    class="checkTypeItem"
                    @click="onCheckType(index, itemSon)"
                    :class="{ checkStyle: checkType == index }"
                    :style="`${index != 0 ? 'margin-left:10px;' : ''}`"
                    v-for="(itemSon, index) in item"
                    :key="index"
                  >
                    <p>{{ itemSon.devs.length }}</p>
                    <div class="check_box">
                      <i :class="'iconfont' + ' ' + itemSon.icon"></i>
                      <p>{{ itemSon.typeName }}</p>
                    </div>
                    <img src="@/assets/image/index/guangxiao.png" alt="" />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="rightArrow" v-if="footerListnew.length > 6">
              <img src="@/assets/image/public/next.png" @click="arrowClick('right')" />
            </div>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div>
        <div>
          <BackTask
            title="摄像头实时视频"
            :width="360"
            :height="200"
            iconName="shexiangtou"
            iconColor="white"
            iconSize="20"
          >
            <div class="shexiangtou">
              <div class="shexiangtou-header">
                <p>{{ cameradata.device_location }}{{ cameradata.device_name }}</p>
                <i class="iconfont icon-quanping" @click="fullScreen"></i>
              </div>
              <div class="video_div">
                <!-- <canvas id="video" v-if="TunnelTd == 18"></canvas>
                <div class="noData" v-if="TunnelTd == 18">
                  <span>{{ videoHtml }}</span>
                </div> -->
                <!-- <videoPlayer url="https://sample-videos.com/video123/flv/720/big_buck_bunny_720p_1mb.flv"></videoPlayer> -->
                <!-- <videoPlayer url="ws://192.168.100.110:8888/rtsp/1/?url=rtsp://admin:dhlrw12345@192.168.0.101:554/h264/ch1/main/av_stream" v-else></videoPlayer> -->
                <!-- <canvas id="video" v-if="TunnelTd == 1">
                  
                </canvas> -->
                <!-- v-if="(TunnelTd == 1||TunnelTd == 18) && renderComponent" -->
                <!-- <videoPlayer
                  id="videoPl"
                  :url="videoUrl"
                  :key="videoPl"
           
                ></videoPlayer> -->
                <div id="videoEle" style="width: 360px; height: 200px"></div>
              </div>
            </div>
          </BackTask>
        </div>
        <div>
          <div class="continer right">
            <div>
              <BackTask
                :title="`告警消息  (${offlineList.length})`"
                :width="360"
                :height="458"
                iconName="gaojingxiaoxi"
                iconColor="white"
                iconSize="20"
              >
                <div class="ModelContentClass scorll-class">
                  <div class="" :style="`height:${400}px;`">
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
                      <i style="left: 22%; top: 20px" class="borderStyle borderTop"></i>
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
                    <div v-if="offlineList.length === 0 && !alarmload" class="noData">
                      <span>暂无数据</span>
                    </div>
                  </div>
                </div>
              </BackTask>
            </div>
          </div>
        </div>
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

    <!-- 手动报警弹框 -->
    <el-dialog
        title="手动报警确认"
        v-model="manualAlarmDialogVisible"
        :fullscreen="true"
        style="height: 220px !important;"
    >
      <div style="display: flex;justify-content: center;">
        <div style="width: 81%; margin-top: 20px;">
          <el-input
              type="password"
              v-model="confirmPassword"
              :clearable="true"
              maxlength="20"
              placeholder="请输入登录密码"
              show-password
          ></el-input>
        </div>
      </div>
      <div class="footer_box">
        <span @click="confirmManualAlarm(1)">取消</span>
        <span @click="confirmManualAlarm(2)">确定</span>
      </div>
    </el-dialog>

  </div>
  <!-- 查看数据 -->
  <ViewData
    v-if="viewDataState === 2"
    :viewDataState="viewDataState"
    @back_slope="back_slope"
  >
  </ViewData>
</template>
<script setup lang="ts">
import axios from "axios";
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  ref,
  Ref,
  onDeactivated,
} from "vue";
import {
  queryDeviceTitle,
  findDeviceSamplingData,
  getFireAlarmLates,
  resetFanErrorStatus,
  getCameraFLV,
  callManualAlarm,
} from "@/api/monitor/index";
import BackTask from "@/components/backTask.vue";
import { useStore } from "vuex";
import { Router, useRouter } from "vue-router";
import videoPlayer from "@/components/video.vue";
import { PROJECTID, TUNNELID, DIVCIE_TYPE_FK, PROJECTNAME } from "@/utils/enumeration";
import { LoginFun } from "@/api/home";
import { ENCRYPT } from "@/utils/encryption";

const store = useStore();
const { proxy } = getCurrentInstance();
// let TunnelTd: string = store.state.Home.tunnelId; //TunnelTd：18为德会高速
let TunnelTd: string | number = TUNNELID;
const router: Router = useRouter();
import ViewData from "./viewData.vue";
import { addTiandituWmtsLayer, addTiandituElevation } from "./cesiumUtils";

const normalIcon = require("@/assets/image/public/normal_eq.png");
const errorIcon = require("@/assets/image/public/error_eq.png");
const offlineIcon = require("@/assets/image/public/online_eq.png");

// 默认check的设备类型
const checkType: Ref<number> = ref(0);
const checkObj: any = ref(null);
const offlineList = ref([]); //告警列表
const alarmload = ref(true);
const alarmCount: Ref<number> = ref(0); //告警条数
const dialogVisible = ref(false);
const relieveList = ref({});
const valueDesc: Ref<string> = ref(""); //告警内容
const footerList = ref([]); //底部数据
let videoUrl: Ref<string> = ref(
  "ws://47.108.254.101:16661/rtp/44010200491320000001_44010200491320000001.live.flv"
); //直播流数据
const renderComponent = ref(true);
// const videoPl = ref(Date.now);
const equipmentList = ref([
  // 一级一排
  // {xnew:305,ynew:510,show_page:true,device_status:0,sampleData:[]},
  // {xnew:355,ynew:530,show_page:true,device_status:0,sampleData:[]},
  // {xnew:385,ynew:550,show_page:true,device_status:0,sampleData:[]},
  // {xnew:420,ynew:560,show_page:true,device_status:0,sampleData:[]},
  //   // 一级二排
  // {xnew:331,ynew:474,show_page:true,device_status:0,sampleData:[]},
  // {xnew:378,ynew:495,show_page:true,device_status:0,sampleData:[]},
  // {xnew:410,ynew:510,show_page:true,device_status:0,sampleData:[]},
  // {xnew:443,ynew:525,show_page:true,device_status:0,sampleData:[]},
  // // 二级一排
  // {xnew:345,ynew:455,show_page:true,device_status:0,sampleData:[]},
  // {xnew:390,ynew:468,show_page:true,device_status:0,sampleData:[]},
  // {xnew:465,ynew:497,show_page:true,device_status:0,sampleData:[]},
  // // {xnew:494,ynew:516,show_page:true,device_status:0,sampleData:[]},//太阳能
  // {xnew:523,ynew:528,show_page:true,device_status:0,sampleData:[]},
  // {xnew:583,ynew:556,show_page:true,device_status:0,sampleData:[]},
  // {xnew:649,ynew:591,show_page:true,device_status:0,sampleData:[]},
  // // 二级二排
  // {xnew:365,ynew:444,show_page:true,device_status:0,sampleData:[]},
  // {xnew:410,ynew:463,show_page:true,device_status:0,sampleData:[]},
  // {xnew:443,ynew:476,show_page:true,device_status:0,sampleData:[]},
  // {xnew:480,ynew:482,show_page:true,device_status:0,sampleData:[]},
  // {xnew:535,ynew:515,show_page:true,device_status:0,sampleData:[]},
  // {xnew:596,ynew:542,show_page:true,device_status:0,sampleData:[]},
  // {xnew:661,ynew:577,show_page:true,device_status:0,sampleData:[]},
  // {xnew:735,ynew:619,show_page:true,device_status:0,sampleData:[]},
  // // 二级三排
  // {xnew:399,ynew:388,show_page:true,device_status:0,sampleData:[]},
  // {xnew:442,ynew:408,show_page:true,device_status:0,sampleData:[]},
  // {xnew:478,ynew:421,show_page:true,device_status:0,sampleData:[]},
  // {xnew:513,ynew:433,show_page:true,device_status:0,sampleData:[]},
  // {xnew:570,ynew:455,show_page:true,device_status:0,sampleData:[]},
  // {xnew:630,ynew:476,show_page:true,device_status:0,sampleData:[]},
  // {xnew:703,ynew:504,show_page:true,device_status:0,sampleData:[]},
  // {xnew:786,ynew:533,show_page:true,device_status:0,sampleData:[]},
  // // 三级一排
  // {xnew:411,ynew:371,show_page:true,device_status:0,sampleData:[]},
  // {xnew:470,ynew:388,show_page:true,device_status:0,sampleData:[]},
  // {xnew:539,ynew:411,show_page:true,device_status:0,sampleData:[]},
  // {xnew:588,ynew:429,show_page:true,device_status:0,sampleData:[]},
  // {xnew:653,ynew:448,show_page:true,device_status:0,sampleData:[]},
  // {xnew:726,ynew:473,show_page:true,device_status:0,sampleData:[]},
  // // 三级二排
  // {xnew:483,ynew:372,show_page:true,device_status:0,sampleData:[]},
  // {xnew:515,ynew:386,show_page:true,device_status:0,sampleData:[]},
  // {xnew:551,ynew:396,show_page:true,device_status:0,sampleData:[]},
  // {xnew:600,ynew:416,show_page:true,device_status:0,sampleData:[]},
  // {xnew:668,ynew:433,show_page:true,device_status:0,sampleData:[]},
  // {xnew:742,ynew:458,show_page:true,device_status:0,sampleData:[]},
  // // 三级三排
  // {xnew:514,ynew:328,show_page:true,device_status:0,sampleData:[]},
  // {xnew:550,ynew:338,show_page:true,device_status:0,sampleData:[]},
  // {xnew:587,ynew:346,show_page:true,device_status:0,sampleData:[]},
  // {xnew:640,ynew:365,show_page:true,device_status:0,sampleData:[]},
  // {xnew:706,ynew:383,show_page:true,device_status:0,sampleData:[]},
  // {xnew:781,ynew:404,show_page:true,device_status:0,sampleData:[]},
  // // 四级一排
  // {xnew:533,ynew:311,show_page:true,device_status:0,sampleData:[]},
  // {xnew:601,ynew:326,show_page:true,device_status:0,sampleData:[]},
  // // {xnew:633,ynew:334,show_page:true,device_status:0,sampleData:[]},//太阳能
  // {xnew:660,ynew:343,show_page:true,device_status:0,sampleData:[]},
  // {xnew:725,ynew:359,show_page:true,device_status:0,sampleData:[]},
  // {xnew:801,ynew:380,show_page:true,device_status:0,sampleData:[]},
  // // 四级二排
  // {xnew:549,ynew:296,show_page:true,device_status:0,sampleData:[]},
  // {xnew:564,ynew:305,show_page:true,device_status:0,sampleData:[]},
  // {xnew:615,ynew:305,show_page:true,device_status:0,sampleData:[]},
  // {xnew:679,ynew:326,show_page:true,device_status:0,sampleData:[]},
  // {xnew:740,ynew:345,show_page:true,device_status:0,sampleData:[]},
  // {xnew:818,ynew:360,show_page:true,device_status:0,sampleData:[]},
  // //四级三排
  // {xnew:581,ynew:256,show_page:true,device_status:0,sampleData:[]},
  // {xnew:619,ynew:262,show_page:true,device_status:0,sampleData:[]},
  // {xnew:656,ynew:270,show_page:true,device_status:0,sampleData:[]},
  // {xnew:716,ynew:281,show_page:true,device_status:0,sampleData:[]},
  // {xnew:782,ynew:293,show_page:true,device_status:0,sampleData:[]},
  // // 五级一排
  // {xnew:603,ynew:237,show_page:true,device_status:0,sampleData:[]},
  // {xnew:679,ynew:249,show_page:true,device_status:0,sampleData:[]},
  // {xnew:740,ynew:257,show_page:true,device_status:0,sampleData:[]},
  // {xnew:807,ynew:268,show_page:true,device_status:0,sampleData:[]},
  // // 五级二排
  // {xnew:649,ynew:236,show_page:true,device_status:0,sampleData:[]},
  // {xnew:692,ynew:235,show_page:true,device_status:0,sampleData:[]},
  // {xnew:752,ynew:248,show_page:true,device_status:0,sampleData:[]},
  // {xnew:821,ynew:256,show_page:true,device_status:0,sampleData:[]},
  // // 五级三排
  // {xnew:672,ynew:212,show_page:true,device_status:0,sampleData:[]},
  // {xnew:710,ynew:216,show_page:true,device_status:0,sampleData:[]},
  // {xnew:770,ynew:223,show_page:true,device_status:0,sampleData:[]},
  // {xnew:838,ynew:223,show_page:true,device_status:0,sampleData:[]},
  // // 五级四排
  // {xnew:697,ynew:187,show_page:true,device_status:0,sampleData:[]},
  // {xnew:733,ynew:193,show_page:true,device_status:0,sampleData:[]},
  // {xnew:793,ynew:199,show_page:true,device_status:0,sampleData:[]},
  // {xnew:858,ynew:204,show_page:true,device_status:0,sampleData:[]},
  // // 六级一排
  // {xnew:746,ynew:174,show_page:true,device_status:0,sampleData:[]},
  // // {xnew:763,ynew:178,show_page:true,device_status:0,sampleData:[]},//太阳能
  // {xnew:810,ynew:176,show_page:true,device_status:0,sampleData:[]},
  // {xnew:881,ynew:180,show_page:true,device_status:0,sampleData:[]},
  // // 六级二排
  // {xnew:775,ynew:143,show_page:true,device_status:0,sampleData:[]},
  // {xnew:834,ynew:147,show_page:true,device_status:0,sampleData:[]},
  // {xnew:899,ynew:153,show_page:true,device_status:0,sampleData:[]},
  // // 六级三排
  // {xnew:809,ynew:117,show_page:true,device_status:0,sampleData:[]},
  // {xnew:859,ynew:126,show_page:true,device_status:0,sampleData:[]},
  // {xnew:914,ynew:126,show_page:true,device_status:0,sampleData:[]},
  // // 7级一排
  // {xnew:877,ynew:104,show_page:true,device_status:0,sampleData:[]},
  // {xnew:930,ynew:104,show_page:true,device_status:0,sampleData:[]},
  // // 7级二排
  // {xnew:898,ynew:82,show_page:true,device_status:0,sampleData:[]},
  // {xnew:951,ynew:84,show_page:true,device_status:0,sampleData:[]},
  // // 7级三排
  // {xnew:933,ynew:66,show_page:true,device_status:0,sampleData:[]},
  // {xnew:968,ynew:62,show_page:true,device_status:0,sampleData:[]},
  // // 7级四排
  // {xnew:993,ynew:39,show_page:true,device_status:0,sampleData:[]},
]); //所有的设备
const deviceClazzFn: Ref<string> = ref(""); //类型id
const activeimg = ref("null"); //设备弹框显示隐藏
const viewDataState: Ref<number> = ref(1); //1表示边坡,2表示查看数据
const footerListnew = ref([]); //最新数据
const currentPage = ref(1);
// const videoServer = ref("://chenyu:3000/"); //视频地址后期动态暂时写在这里
const videoServer = ref(process.env.VUE_APP_BASE); //视频地址后期动态暂时写在这里
const cameradata = ref({}); //视频数据
const playerArr = ref([]); //视频
const videoCanvas = ref(null); //视频
const videoHtml = ref("视频加载中"); //播放视频描述
const timer = ref(0);
const timeLong = 30 * 1000; //30秒
let pageNumberStr = ref("left"); //页码标记

// 设备位置数据，用于Cesium地图渲染
const deviceLocations = ref([]);

// cesium相关
const viewerRef = ref(null);
const goHomeRef = ref(null);
const imageryLayerVisible = ref(true);
const imageryLayer = ref(null);
const elevationLayerVisible = ref(true);
const elevationLayer = ref(null);

const hoveredDevice = ref(null);
const hoveredPosition = ref({ x: 0, y: 0 });

const manualAlarmDialogVisible = ref(false);
const confirmPassword = ref("");

onMounted(() => {
  innitCameraData();
  initCesium();
  slopeInitFn();
  timer.value = window.setInterval(function logname() {
    slopeInitFn();
  }, timeLong);
});
onDeactivated(() => {
  //离开当前组件的生命周期执行的方法
  window.clearInterval(timer.value);
});
onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
// 销毁视频流
const distroyVideo = () => {
  console.log("销毁视频流");
  if (Jessibuca.value) {
    Jessibuca.value.destroy();
    Jessibuca.value = null;
  }
};
const Jessibuca = ref();

//  获取坐标点
function center_btn() {
  let pos = document.getElementById("center_div");
  pos.onmouseup = function (ev) {
    console.log("x:", ev.offsetX - 12);
    console.log("y:", ev.offsetY - 30);
  };
}

const innitCameraData = () => {
  // videoEle
  console.log(
    window.Jessibuca,
    " ---window.Jessibuca",
    document.getElementById("videoEle")
  );
  if (window.Jessibuca) {
    Jessibuca.value = new window.Jessibuca({
      container: document.getElementById("videoEle"), //jessibuca需要容器
      videoBuffer: 0.2, // 缓存时长
      isResize: false,
      text: "",
      loadingText: "",
      useMSE: false,
      debug: false,
      showBandwidth: false, // 显示网速
      operateBtns: {
        fullscreen: true,
        screenshot: false,
        play: true,
        audio: false,
      },
      forceNoOffscreen: true,
      isNotMute: false,
      // decoder: "/public/js/decoder.js",
      decoder: "/cdnSlope/public/js/decoder.js", // 由于线上有层目录，故加了cdnSlope之后本地播放不了，如需调试，则删除那层目录即可
    });
    console.log(Jessibuca.value, " ----Jessibuca");

    Jessibuca.value.on("audioInfo", function (audioInfo) {
      console.log("audioInfo", audioInfo);
    });

    Jessibuca.value.on("videoInfo", function (videoInfo) {
      console.log("videoInfo", videoInfo);
    });
  }
};

const initCesium = async () => {
  try {
    const Cesium = window.Cesium;
    if (!Cesium) {
      console.error('Cesium is not loaded. Please make sure to include Cesium.js in your project.');
      return;
    }
    const viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayer: new Cesium.ImageryLayer(
          new Cesium.SingleTileImageryProvider({
            url: require("@/assets/image/cesiumViewer/GlobalBkLayer.jpg"),
          }),
      ),
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      timeline: false,
      infoBox: false,
      selectionIndicator: false,
      creditContainer: document.createElement('div'),
    });

    viewer.screenSpaceEventHandler.setInputAction((movement) => {
      const clickPosition = movement.position;
      const cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickPosition), viewer.scene);
      const pickedObject = viewer.scene.pick(movement.position);
      if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) &&
          Cesium.defined(pickedObject.id.properties) &&
          Cesium.defined(pickedObject.id.properties.deviceData)) {
        const deviceData = pickedObject.id.properties.deviceData.getValue();
        console.log('Device clicked:', deviceData);
        const equipment = equipmentList.value.find(item => item.id === deviceData.id);
        if (equipment) {
          showDetile(equipment);
        }
      }
      if (Cesium.defined(cartesian)) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        console.log('Clicked Position:', { longitude: lon, latitude: lat, height: height });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    function debounce(func, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    }

    viewer.screenSpaceEventHandler.setInputAction(debounce((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) &&
          Cesium.defined(pickedObject.id.properties) &&
          Cesium.defined(pickedObject.id.properties.deviceData)) {
        const deviceData = pickedObject.id.properties.deviceData.getValue();
        const equipment = equipmentList.value.find(item => item.id === deviceData.id);
        if (equipment) {
          hoveredDevice.value = equipment;
          hoveredPosition.value = {
            x: movement.endPosition.x + 20,
            y: movement.endPosition.y - 100
          };
        }
      } else {
        hoveredDevice.value = null;
      }
    }, 200), Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    viewer.camera.moveEnd.addEventListener(() => {
      console.log('Current Camera:', {
        heading: Cesium.Math.toDegrees(viewer.camera.heading),
        pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
        roll: Cesium.Math.toDegrees(viewer.camera.roll),
      });
    });

    viewer.scene.globe.depthTestAgainstTerrain = true;

    // imageryLayer.value = addTiandituWmtsLayer(viewer, 'img_w');
    // elevationLayer.value = addTiandituElevation(viewer);
    viewerRef.value = viewer;
    //
    console.log('影像图层配置:', window.imageryConfig);
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider(window.imageryConfig));
    //
    const tileset = await Cesium.Cesium3DTileset.fromUrl(
        'https://xuwei-slope-healthy.bimscodi.cn:8496/3dtiles/Scene/tileset.json',
        {
          maximumScreenSpaceError: 1,
        },
    );
    // 3d tiles 地形下降到海拔0
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, -1075.0);
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    //
    viewer.scene.primitives.add(tileset);
    const boundingRectangle = Cesium.Rectangle.fromBoundingSphere(tileset.boundingSphere);
    const goHome = () => {
      const lonDegrees = 105.53755104858234;
      const latDegrees = 27.964138933955483;
      const height = 120;
      const heading = 180.82332573189032;
      const pitch = -27.32307373725542;
      const roll = 0;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lonDegrees, latDegrees, height),
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          roll: Cesium.Math.toRadians(roll),
        },
        duration: 1.5,
      });
    };
    goHome();
    goHomeRef.value = goHome;
    renderDeviceLocations();
  } catch (error) {
    console.error('Error initializing Cesium:', error);
  }
}

const renderDeviceLocations = (device_clazz_fk = -1) => {
  if (!viewerRef.value || deviceLocations.value.length === 0) return;

  const viewer = viewerRef.value;
  const Cesium = window.Cesium;

  viewer.entities.removeAll();

  deviceLocations.value.forEach(device => {
    const deviceInfo = equipmentList.value.find(item => item.id === device.id) || {};

    if (device_clazz_fk > 0) {
      if (deviceInfo.device_clazz_fk !== device_clazz_fk) {
        return;
      }
    }

    let statusImageUrl;
    if (deviceInfo.device_status === 0) {
      statusImageUrl = normalIcon;
    } else if (deviceInfo.device_status > 0) {
      statusImageUrl = errorIcon;
    } else {
      statusImageUrl = offlineIcon;
    }

    const entity = viewer.entities.add({
      name: device.title,
      position: Cesium.Cartesian3.fromDegrees(device.lon, device.lat - 0.00001, device.alt - 353),
      billboard: {
        image: statusImageUrl,
        width: 52 * .6,
        height: 89 * .6,
        disableDepthTestDistance: 500,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.NONE,
      },
      label: {
        text: device.title,
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -60),
        heightReference: Cesium.HeightReference.NONE,
        disableDepthTestDistance: 500,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200)
      },
      properties: {
        deviceData: device
      }
    });

    viewer.entities.add({
      name: `${device.title}-logo`,
      position: Cesium.Cartesian3.fromDegrees(device.lon, device.lat - 0.00001, device.alt - 353),
      billboard: {
        image: require("@/assets/image/index/sensor.png"),
        width: 20,
        height: 20,
        disableDepthTestDistance: 100,
        pixelOffset: new Cesium.Cartesian2(0, -28),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.NONE,
      },
      properties: {
        deviceData: device
      }
    });
  });
};

//初始化加载
function slopeInitFn() {
  // if(TunnelTd != 1){
  //     TunnelTd = 18;
  store.commit("Home/TUNNEL_ID", 1);
  // }
  GetCameraFLVFn();
  // videoPl = Data.now();
  // forceRerender();
  getFireAlarmLatesFn();
  GetAueryDeviceTitleFn();
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

//  返回边坡
const back_slope = (value) => {
  viewDataState.value = value;
  nextTick(() => {
    innitCameraData();
    slopeInitFn();
  });
};

//  上一页下一页切换
function arrowClick(val) {
  pageNumberStr = val + "";
  if (val === "right") {
    proxy.$refs.cardShow.next();
  } else {
    proxy.$refs.cardShow.prev();
  }
}

//  查看数据
function view_btn() {
  viewDataState.value = 2;
  distroyVideo();
}

// 手动报警
function manualAlarm() {
  manualAlarmDialogVisible.value = true;
}

//底部设备类型
const GetAueryDeviceTitleFn = () => {
  let data = {
    tunnelId: TunnelTd,
  };
  queryDeviceTitle(data).then((res) => {
    const footerListOld = res;
    let allDataDevs = [];

    const locations = [];

    for (var i = 0; i < footerListOld.length; i++) {
      for (var j = 0; j < footerListOld[i].devs.length; j++) {
        allDataDevs.push(footerListOld[i].devs[j]);

        const device = footerListOld[i].devs[j];

        if (device.device_coordinate) {
          try {
            const coordinates = JSON.parse(device.device_coordinate);
            if (coordinates && typeof coordinates === 'object') {
              const lon = coordinates.lon || 0;
              const lat = coordinates.lat || 0;
              const alt = coordinates.alt || coordinates.height || 0;
              locations.push({
                id: device.id,
                lon: lon,
                lat: lat,
                alt: alt,
                title: device.device_name || `Device ${device.id}`
              });
            }
          } catch (error) {
            console.warn(`Invalid coordinate JSON for device ${device.id || 'unknown'}: ${device.device_coordinate}`);
          }
        }
      }
    }

    deviceLocations.value = locations;

    let allData = {
      device_clazz_fk: -1,
      icon: "icon-jiancedian",
      typeName: "全部",
      devs: allDataDevs,
    };
    footerList.value = res;
    footerList.value.unshift(allData);
    equipmentListBackFn();
    footerListFn();

    if (viewerRef.value) {
      renderDeviceLocations();
    }
  });
};
//K144隧道视频信息获取
const GetCameraFLVFn = () => {
};

//对页面显示的处理
function footerListFn() {
  let data = footerList.value;
  footerListnew.value = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i += 6) {
      footerListnew.value.push(data.slice(i, i + 6));
    }
  }
}
//对设备的处理
function equipmentListBackFn() {
  let data = footerList.value;
  equipmentList.value = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      data[i].show_page = true; //控制页面设备显示隐藏
      if (data[i].devs && data[i].devs.length > 0) {
        if (data[i].device_clazz_fk === 26) {
          cameradata.value = data[i].devs[0];
        }
        for (var j = 0; j < data[i].devs.length; j++) {
          let [x, y] = data[i].devs[j].coordinate;
          data[i].devs[j].xnew = x;
          data[i].devs[j].ynew = y;
          equipmentList.value.push(data[i].devs[j]);
        }
      }
    }
    if (pageNumberStr === "left") {
      deviceClazzFn.value = data[checkType.value].device_clazz_fk; //默认选中的项目
    } else if (pageNumberStr === "right") {
      deviceClazzFn.value = data[checkType.value + 6].device_clazz_fk; //默认选中的项目
    } else {
      deviceClazzFn.value = data[checkType.value].device_clazz_fk; //默认选中的项目
    }
    // checkType.value = index;
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
  renderDeviceLocations(item.device_clazz_fk);
  pageShowFn();
};

//设备显示隐藏处理
function pageShowFn() {
  let data = equipmentList.value;
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (deviceClazzFn.value == -1) {
        data[i].show_page = true;
      } else if (data[i].device_clazz_fk === deviceClazzFn.value) {
        data[i].show_page = true;
      } else {
        data[i].show_page = false;
      }
    }
  }
}

//  告警列表
const getFireAlarmLatesFn = () => {
  alarmload.value = true;
  offlineList.value = [];
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
      ElMessage({
        message: res.message,
        type: "success",
      });
      slopeInitFn();
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

//鼠标入事件
function infodataFn(val) {
  activeimg.value = val;
}

// 鼠标离开
function hideinfodataFn(val) {
  activeimg.value = val;
  // activeimg.value = "null";
}

const resetCameraView = () => {
  if (goHomeRef.value) {
    goHomeRef.value();
  }
};

const toggleImageryLayer = () => {
  if (viewerRef.value && imageryLayer.value) {
    imageryLayer.value.visible = imageryLayerVisible.value;
  }
};

const toggleElevationLayer = () => {
  if (viewerRef.value && elevationLayer.value) {
    elevationLayer.value.visible = elevationLayerVisible.value;
  }
};

const confirmManualAlarm = (val) => {
  // 取消
  if (val === 1) {
    manualAlarmDialogVisible.value = false;
    confirmPassword.value = "";
  }
  // 确定
  else if (val === 2) {
    // 调用登录接口验证密码
    if (!confirmPassword.value.trim()) {
      ElMessage({
        message: "请输入登录密码",
        type: "warning",
      });
      return;
    }
    // 构造请求参数，验证密码
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const loginData = {
      loginId: ENCRYPT(userInfo.loginId),
      userPass: ENCRYPT(confirmPassword.value),
    };
    confirmPassword.value = "";
    LoginFun(loginData).then((res) => {
      if (res.status === 0) {
        // 密码正确，提交手动报警
        submitManualAlarm();
        manualAlarmDialogVisible.value = false;
        ElMessage({
          message: "手动报警成功",
          type: "success",
        });
      } else {
        // 密码错误
        ElMessage({
          message: "密码验证失败，请重新输入",
          type: "error",
        });
      }
    }).catch(error => {
      ElMessage({
        message: "验证过程中出现错误，请重试",
        type: "error",
      });
      console.error(error);
    });
  }
};

const submitManualAlarm = () => {
  callManualAlarm({
    alarmType: 'red',
  });
}
</script>

<style scoped lang="less">
.iconfont {
  margin-left: 14px;
}
#slope {
  padding: 0px 60px 30px 60px;
  .noData {
    width: 100%;
    > span {
      position: absolute;
      left: 50%;
      top: 50px;
      transform: translateX(-50%);
    }
  }
  .header {
    text-align: right;
    .showData {
      border: 1px solid #0f68b9;
      border-radius: 4px;
      box-shadow: 0px 0px 10px #0f68b9 inset;
      padding: 12px;
      color: white;
      font-size: 14px;
    }
  }
  .contentClass {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      & > div:first-child {
        // img {
        //   // width: 85%;
        //   width: 1400px;
        //   height: 670px;
        // }
      }
      & > div {
        display: flex;
      }
      .arrow_box {
        width: 100%;
        position: relative;
        .leftArrow {
          position: absolute;
          z-index: 50;
          left: -30px;
          top: 30px;
          cursor: pointer;
        }
        .rightArrow {
          position: absolute;
          z-index: 50;
          right: -20px;
          top: 30px;
          cursor: pointer;
        }
      }
      .checkTypeItem_box {
        position: relative;
        width: 100%;
        .checkTypeItem_centent {
          display: flex;
        }
      }
      .checkTypeItem {
        margin-top: 20px;
        position: relative;
        padding: 2px 14px 14px 14px;
        background: #032254;
        border: 1px solid #00468f;
        cursor: pointer;
        width: 200px;
        box-shadow: 0px 0px 14px #0e4badbd;
        div {
          display: flex;
          justify-items: center;
          p {
            font-size: 16px;
            color: rgba(0, 149, 255, 0.5);
            font-family: SourceHanSansCN-Regular;
            margin-left: 10px;
            margin-top: 8px;
          }
        }
        p {
          text-align: right;
          color: rgba(0, 149, 255, 0.5);
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
          color: rgba(0, 149, 255, 1) !important;
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
            color: rgba(0, 149, 255, 1) !important;
          }
          i {
            color: rgba(0, 149, 255, 1) !important;
          }
        }
      }
    }
    & > div:last-child {
      .shexiangtou {
        .shexiangtou-header {
          display: flex;
          padding: 10px 20px;
          justify-content: space-between;
          height: 40px;
          justify-items: center;
          background: #00000000;
          position: relative;
          box-sizing: border-box;
          z-index: 1;
          p {
            color: #ffffffc7;
            font-family: SourceHanSansCN-Regular;
            font-size: 14px;
          }
          i {
            margin-top: 2px;
            cursor: pointer;
          }
        }
      }

      .continer {
        margin-top: 70px;
        .ModelContentClass {
          padding: 20px;
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
              width: 160px;
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
      }
      .right {
        right: 50px;
      }
    }
  }
  // 我是中间板块
  .center_div {
    position: relative;
    height: 670px;
    width: 1400px;
    z-index: 10;
    // background-image: url("../../../assets/image/monitorConsole/slope.jpg");
    background-size: 100% 100%;
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
          width: 20px;
          height: 20px;
          img {
            width: 30px;
            margin-top: 37px;
            margin-left: 11px;
          }
          .duspan {
            position: absolute;
            width: 24px;
            font-size: 10px;
            left: 2px;
            top: 29px;
            margin-top: 12px;
          }
          //  正常弹框样式
          .frame_normal {
            position: absolute;
            z-index: 100;
            width: 234px;
            min-height: 92px;
            top: 76px;
            left: 32px;
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
                width: 100%;
                word-break: break-all;
                word-wrap: break-word;
              }
            }
          }

          //设备异常弹框
          .frame_err {
            min-height: 50px;
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
  .cesium-container {
    position: absolute;
    inset: 0;
  }
  .cesium-toolbar {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background-color: rgba(3, 34, 84, 0.7);
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #00468f;
    box-shadow: 0px 0px 14px #0e4badbd;
    display: flex;
    align-items: center;
  }
  .toolbar-button {
    background: rgba(0, 149, 255, 0.7);
    border: none;
    color: white;
  }
  .toolbar-button:hover {
    background: rgba(0, 149, 255, 1);
    box-shadow: 0px 0px 10px #0062ff;
  }

  .toolbar-switch {
    //display: flex;
    display: none;
    align-items: center;
    margin-left: 16px;
    span {
      color: white;
      margin-right: 8px;
    }
  }

  .brand-logo {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1000;

    img {
      width: 180px;
      height: auto;
      filter: grayscale(0.6) opacity(0.7);
    }
  }

  //弹框
  .dialogCenter {
    display: flex;
    > div:nth-child(1) {
      margin-right: 20px;
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
  //视频
  .video_div {
    position: relative;
    height: 200px;
    margin-top: -40px;
    #video {
      height: 100%;
      width: 100%;
    }
  }
}

/* Add these styles at the end of your scoped style section */
.cesium-entity-tooltip {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  min-width: 234px;
  min-height: 92px;
}

.normal-tooltip {
  background-image: url("../../../assets/image/public/normal_bubblebox.png");
  background-size: 100% 100%;
  padding: 10px 0;

  .title {
    margin: 10px 20px 5px 30px;
    color: #77c4ff;
    font-size: 16px;
  }

  .frame_normal_box {
    color: #ffffff;
    font-size: 14px;
    margin: 10px 10px 10px 30px;

    p {
      color: #77c4ff;
      font-size: 14px;
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}

.error-tooltip, .offline-tooltip {
  background-image: url("../../../assets/image/public/error_bubblebox.png");
  background-size: 100% 100%;
  padding: 10px 0;

  .frame_normal_box {
    margin: 10px 10px 10px 30px;

    p {
      color: #ffffff;
      font-size: 14px;
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
