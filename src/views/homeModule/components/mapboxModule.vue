<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-18 11:30:10
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 17:25:58
-->
<template>
  <div>
    <div id="map" style="width: 100%">
      <div class="checkMap" @click="checkMapType">
        <img
          :src="`${
            data.mapType == 1
              ? require('@/assets/image/index/map2.png')
              : require('@/assets/image/index/map1.png')
          }`"
          alt=""
        />
      </div>
    </div>
    <!-- 设备信息 -->
    <div v-for="(item, index) in data.resultData" :key="index">
      <!--隧道弹框 -->
      <div
        class="clisite clisiteEq"
        :ref="clisitenew"
        @click="drawerfn_btn(item, index)"
      >
        <el-tooltip placement="top" popper-class="popperClass">
          <template #content>
            <div class="contentClass">
              <ul style="padding: 14px; color: #77c4ff">
                <li style="margin-bottom: 8px; display: flex">
                  <i
                    class="iconfont icon-wujiaoxing"
                    style="color: #77c4ff"
                  ></i>
                  <h4 style="margin-left: 6px">{{ item.point.device_name }}</h4>
                </li>
                <li
                  :style="index != 0 ? 'margin-top:2px;' : ''"
                  v-for="(items, index) in item.point.basicInfo"
                  :key="index"
                >
                  <span>{{ items.name }}：</span><span>{{ items.value }}</span>
                </li>
              </ul>
            </div>
          </template>
          <el-button type="text">
            <i
              :class="'iconfont ' +item.point.homeIcon+ ' iconfontEqSel'"
              style="
                font-size: 20px;
                position: absolute;
                top: -7px;
                left: 6px;
              "
              v-if="item.point.device_status === 0 && !item.error"
            ></i>
            <!-- 离线状态 -->
            <i
              :class="'iconfont ' +item.point.homeIcon + ' iconfontEqSel_offline'"
              style="
                font-size: 20px;
                position: absolute;
                top: -7px;
                left: 6px;
              "
              v-else-if="item.point.device_status === -1 && !item.error"
            ></i>
            <!-- 告警状态 -->
            <i
              v-else
              :class="'iconfont ' +item.point.homeIcon + ' iconfontEqSel_Err'"
              style="
                font-size: 20px;
                position: absolute;
                top: -7px;
                left: 6px;
              "
            ></i>
            <img
              style="width: 33px; height: 56px"
              :src="`${
                item.point.device_status == 0 && !item.error
                  ? require('@/assets/image/index/zhengchang.png')
                  : item.point.device_status > 0
                  ? require('@/assets/image/index/gaojing.png')
                  : require('@/assets/image/public/online_eq.png')
              }`"
              alt=""
            />
            <!-- 数据部分 -->
            <div class="countDiv" v-if="item.count > 1">
              <span>
                {{ (map.getZoom()<16&&item.count>20)?item.count-1:item.count }}
              </span>
            </div>
          </el-button>
        </el-tooltip>
        <!-- 设备图标-->
        <!-- 正常状态 -->
      </div>
      <!-- 设备弹框 -->
      <div
        :ref="infopanel1"
        :class="{
          infopanel1:
            item.point.device_status === 2 || item.point.device_status === 1,
        }"
      >
        <div
          class="errdiv"
          v-if="
            item.point.device_status === 2 || item.point.device_status === 1
          "
        >
          <div style="display: flex">
            <!-- <span class="iconfont icon-wujiaoxing"
                  style="color:#77C4FF"></span> -->
            <p>{{ item.point.error_des }}</p>
          </div>
        </div>
      </div>
      <!-- 报错或者异常信息 -->
      <!-- <div
        :ref="infopanel2"
        :class="{ infopanel2: item.point.device_status === 1 }"
      >
        <div class="errdiv" v-if="item.point.device_status === 1">
          <div style="display: flex">
          
            <p>{{ item.point.error_des }}</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ACCESS_TOKEN, PROJECTID, TUNNELID } from "@/utils/enumeration";
import { onMounted, reactive, onBeforeMount,onBeforeUnmount,defineExpose } from "vue-demi";
import { getDeviceList } from "@/api/home/index";
import { Ref, ref, nextTick, watch } from "vue";
import { decviceShortName } from "@/assets/js/map/eventMap";
import { useStore } from "vuex";
import { SamplingDatafn } from "@/mixins/common";
let map: any = null;
const timer = ref(0);
const timeLong = 30 * 1000; //30秒
const data = reactive({
  deviceList: [],
  deviceListDefault: [],
  // 地图默认缩放的比例
  radius: 15,
  // 处理之后的数据
  resultData: [],
  // 地图类型
  mapType: 1,
});
interface Ilonlat {
  lng: number;
  lat: number;
}
// 初始化地图;
const initMap = () => {
  mapboxgl.accessToken = ACCESS_TOKEN;
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/nanqiming/clprryscu018h01r5cff2d4ea",
    // center: [104.39609401673462, 30.792313355763188],
    center: [102.3779936758242, 27.06584616543269],
    zoom: 12.024691881952162,
    minZoom: 5,
  });
  map.setZoom(16); //设置缩放别
  data.radius = 60;
  map.on("zoom", function () {
    let zoom = map.getZoom();
    switch (true) {
      case zoom < 8: {
        data.radius = 1000;
        break;
      }
      case zoom >= 8 && zoom < 14: {
        data.radius = 500;
        break;
      }
      case zoom >= 14 && zoom < 15: {
        data.radius = 200;
        break;
      }
      case zoom >= 15 && zoom < 16: {
        data.radius = 200;
        break;
      }
      case zoom >= 16 && zoom < 17: {
        data.radius = 60;
        break;
      }
      case zoom >= 17 && zoom < 18: {
        data.radius = 10;
        break;
      }
      default: {
        data.radius = 1;
        break;
      }
    }

    console.log(data.radius, "------- ", zoom);
  });
  map.on("click", (e) => {
    console.log(e.lngLat, " ----- ");
  });
};
// 切换地图类型
const checkMapType = () => {
  data.mapType = data.mapType == 1 ? 2 : 1;
  nextTick(() => {
    if (data.mapType == 1) {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid2VpeWFuc2hlbmciLCJhIjoiY2tnaG9oOTllMDRiZTJxbnVlMGt1OXFkMCJ9.Bi7ieFL8-pPyyJK1iIqyow"; //wys
      map.setStyle("mapbox://styles/weiyansheng/ckgrb13te02dy1aodrc892pmv");
    } else {
      mapboxgl.accessToken =
        "pk.eyJ1IjoieGlhb25pdTQ1NiIsImEiOiJja25zYWR0NzMwZnplMndyb2t6YnlxeHV0In0.Vd0bMTiKB4GPJoAso6f6ew"; //yjl
      map.setStyle("mapbox://styles/xiaoniu456/ckp3onwm07l0518k8vewykgu9");
    }
  });
};
const clisitenews: Ref = ref<Element | []>([]);
let clisitenew = (el: Element) => {
  clisitenews.value.push(el);
};
const infopanel1s: Ref = ref<Element | []>([]);
const infopanel2s: Ref = ref<Element | []>([]);
const currentMarkers_new = ref([]);
let infopanel1 = (el: Element) => {
  infopanel1s.value.push(el);
};
// let infopanel2 = (el: Element) => {
//   infopanel2s.value.push(el);
// };
const $store = useStore();
// 刷新dom数据
const refreshData = () => {
  clisitenews.value = [];
  infopanel1s.value = [];
  // infopanel2s.value = [];
  clisitenew = (el: Element) => {
    if (el) clisitenews.value.push(el);
  };
  infopanel1 = (el: Element) => {
    if (el) infopanel1s.value.push(el);
  };
  // infopanel2 = (el: Element) => {
  //   if (el) infopanel2s.value.push(el);
  // };
};
watch(
  () => data.radius,
  (newValue: number, oldValue: number) => {
    if (newValue > 200) {
      return;
    }
    if (currentMarkers_new.value.length) {
      currentMarkers_new.value.forEach((item: any) => {
        item.remove();
      });
    } else {
      currentMarkers_new.value = [];
    }
    if (data.deviceList.length && data.deviceListDefault.length)
      selectDataFn(newValue);
  }
);

onMounted(() => {
  getDevice(true);
  timer.value = window.setInterval(function logname() {
    getDevice(false);
  }, timeLong);
});

onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
// 获取所有地图上的设备
const getDevice = (isfirst:boolean) => {
  
  console.log('盗用当前方法')
  getDeviceList({ projectId: PROJECTID }).then((res: any) => {
    data.deviceList = res;
    console.log("data.deviceList>>", data.deviceList);
    // 默认是收缩状态
    data.radius = 15;
    // 初始化设备采样字段
    SamplingDatafn(TUNNELID).then((ress) => {
      let arr = JSON.parse(JSON.stringify(res));
      for (var i = 0; i < arr.length; i++) {
        var devicePk = arr[i].id;
        var sampleArray = ress["device" + devicePk];
        if (sampleArray) {
          console.log(sampleArray, " -----sampleArray");
          arr[i].sampleData = sampleArray;
        } else {
          // 赋值初始值
          arr[i].sampleData = [];
        }
      }
      console.log(arr, " ----- ");
      data.deviceList = arr;
      //   // clone 当前数据，以免处理出问题
      data.deviceListDefault = JSON.parse(JSON.stringify(arr));
      if(isfirst){
// 初始化地图
      initMap();
      }
      data.radius = 60;//触发监听
      // 处理数据并显示到地图上
      selectDataFn(data.radius);
    });
  });
};

defineExpose({
  getDevice
})
// 对数据进行处理
const selectDataFn = (radius: number) => {
  let mockData: any = []; //把有坐标的值过滤出来
  data.deviceList = JSON.parse(JSON.stringify(data.deviceListDefault));
  data.deviceList.forEach(function (item: any, index) {
    if (item.device_gps != "" && item.device_gps) {
      mockData.push(item);
    }
  });
  //  如果坐标为空直接返回
  if (mockData.length == 0) {
    return;
  }
  mockData = mockData.map((sensor: any) => {
    const { device_gps } = sensor;
    let myarr = device_gps.split(",");
    if (!myarr) {
      return {
        ...sensor,
        longitude: 104.41448444773755,
        latitude: 30.800910944700107,
      };
    }
    let [x, y] = myarr;

    return {
      ...sensor,
      longitude: x,
      latitude: y,
    };
  });

  interface Ilonlat {
    lng: number | undefined;
    lat: number | undefined;
    x: number | undefined;
    y: number | undefined;
  }
  let lonlat: Ilonlat = getMercator({
    lng: mockData[0].longitude,
    lat: mockData[0].latitude,
  });

  let minX: number | undefined = lonlat.x;
  let minY: number | undefined = lonlat.y;
  let maxX: number | undefined = lonlat.x;
  let maxY: number | undefined = lonlat.y;
  let mathData = mockData.map((item: any) => {
    let lonlat = getMercator({ lng: item.longitude, lat: item.latitude });
    maxX = Math.max(maxX ?? 0, lonlat.x);
    maxY = Math.max(maxY ?? 0, lonlat.y);
    minX = Math.min(minX ?? 0, lonlat.x);
    minY = Math.min(minY ?? 0, lonlat.y);
    return {
      point: item,
      ...lonlat,
    };
  });
  var points = {};
  mathData.map((item) => {
    let i = Math.ceil((item.x - minX) / radius);
    let j = Math.ceil((item.y - minY) / radius);
    let tmpPoint = points[i + "_" + j];
    if (!tmpPoint) {
      tmpPoint = {
        data: [],
      };
      points[i + "_" + j] = tmpPoint;
    }
    tmpPoint.data.push(item);
  });
  for (let [key, tmpPoint] of Object.entries(points)) {
    tmpPoint.x =
      tmpPoint.data
        .map((x) => x.x)
        .reduce((total, value) => {
          return total + value;
        }, 0) / tmpPoint.data.length;
    tmpPoint.i = tmpPoint.x % radius > 0.5 * radius ? 1 : -1;
    tmpPoint.y =
      tmpPoint.data
        .map((x) => x.y)
        .reduce((total, value) => {
          return total + value;
        }, 0) / tmpPoint.data.length;
    tmpPoint.j = tmpPoint.y % radius > 0.5 * radius ? 1 : -1;
  }

  for (let [key, tmpPoint] of Object.entries(points)) {
    let attrs = key.split("_").map((x) => parseInt(x));
    _mathMerge(
      tmpPoint,
      points[attrs[0] + tmpPoint.i + "_" + attrs[1]],
      radius
    ) ||
      _mathMerge(
        tmpPoint,
        points[attrs[0] + "_" + (attrs[1] + tmpPoint.j)],
        radius
      ) ||
      _mathMerge(
        tmpPoint,
        points[attrs[0] + tmpPoint.i + "_" + (attrs[1] + tmpPoint.j)],
        radius
      );
  }
  let resultData = [];
  for (let [key, tmpPoint] of Object.entries(points)) {
    let obj = {
      red: 0,
      green: 0,
      gray: 0,
    };
    for (let n in tmpPoint.data) {
      if (tmpPoint.data[n].point.device_status == 0) {
        obj.green = 1;
      } else if (tmpPoint.data[n].point.device_status == 9) {
        obj.red = 9;
      } else {
        obj.gray = 1;
      }
    }
    let mycolor = "";
    if (obj.red == 1) {
      mycolor = "red";
    } else if (obj.gray == 1) {
      mycolor = "gray";
    } else {
      mycolor = "green";
    }
    if (!tmpPoint.isMath) {
      let lngLat = f_getLngLat(tmpPoint);
      resultData.push({
        count: tmpPoint.data.length,
        coordinates: [lngLat.lng, lngLat.lat],
        ...tmpPoint.data[0],
        cluster: tmpPoint,
        color: mycolor,
      });
    }
  }
  let arr = resultData[0].cluster.data || [];
  let index = 0;
  if (resultData.length) {
    resultData.forEach((devices) => {
      if (devices.count > 0) {
        let arr = devices.cluster.data;
        arr.forEach((item) => {
          item.point.device_status = item.point.device_status - 0; //格式转化
          if (item.point.device_status != 0 && item.point.device_status != -1) {
            devices.error = true;
          }
        });
      }
    });
  }

  data.resultData = resultData;
  // 刷新数据dom。防止重复渲染
  refreshData();
  equipmentListFn_test();
};
//计算点在哪边
const _mathMerge = (point1: number, point2: number, radius: number) => {
  if (
    point2 &&
    !point2.isMath &&
    Math.abs(point1.x - point2.x) < 0.5 * radius
  ) {
    var tmpData = [...point1.data, ...point2.data];
    var x =
      tmpData
        .map((x) => x.x)
        .reduce((total, value) => {
          return total + value;
        }, 0) / tmpData.length;
    var y =
      tmpData
        .map((x) => x.y)
        .reduce((total, value) => {
          return total + value;
        }, 0) / tmpData.length;
    var i = x % radius > 0.5 * radius ? 1 : -1;
    var j = y % radius > 0.5 * radius ? 1 : -1;
    if (i === point1.i && j === point1.j) {
      point2.isMath = true;
      Object.assign(point1, { data: tmpData, x, y, i, j });
      return false;
    } else {
      Object.assign(point2, { data: tmpData, x, y, i, j });
      point1.isMath = true;
      return true;
    }
  }
  return false;
};
// 聚合需要使用
const equipmentListFn_test = () => {
  var datas = data.resultData;
  nextTick(() => {
    if (datas && datas.length > 0) {
      for (var i = 0; i < datas.length; i++) {
        let e = datas[i]; //当前项
        // let arr = [];
        let csite = clisitenews.value[i];
        let mark = new mapboxgl.Marker({
          element: csite,
          scale: 1,
          draggable: false, //是否可以拖动
          offset: { x: 0, y: 0 },
        })
          .setLngLat(e.coordinates)
          .addTo(map);
        currentMarkers_new.value.push(mark);
        // 错误信息弹窗
        let mark2 = new mapboxgl.Marker({
          element: infopanel1s.value[i],
          scale: 1,
          draggable: false, //是否可以拖动
          offset: { x: 100, y: -100 },
        })
          .setLngLat(e.coordinates)
          .addTo(map);
        currentMarkers_new.value.push(mark2);
      }
    }
  });
};
// 对经纬度进行转换
const getMercator = function (poi: Ilonlat): object {
  //[114.32894, 30.585748]输入坐标
  var mercator = {};
  var earthRad = 6378137.0;
  mercator.x = ((poi.lng * Math.PI) / 180) * earthRad;
  var a = (poi.lat * Math.PI) / 180;
  mercator.y =
    (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
  return mercator;
};

//经纬度转换
const f_getLngLat = (poi: number) => {
  var lnglat: Ilonlat = {
    lng: 0,
    lat: 0,
  };
  lnglat.lng = (poi.x / 20037508.34) * 180;
  var mmy = (poi.y / 20037508.34) * 180;
  lnglat.lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
  return lnglat;
};
// 点击事件
const drawerfn_btn = (row: any, index: number) => {
  map.flyTo({ center: row.coordinates });
  console.log(row.point, " ---- row");
  // 将当前数据存放在仓库
  $store.commit("Common/SET_STATE_VALUE", {
    name: "deviceInfos",
    value: row.point,
  });
  // 最大化的时候不展开
  if (data.radius <= 10) {
    // 打开详细弹窗
    $store.commit("Common/SET_STATE_VALUE", {
      name: "isOpenDrawer",
      value: true,
    });
  }

  flyAreaClick(row.cluster.data);
};
// 点击聚合飞行
const flyAreaClick = (data: any) => {
  let xy = data[0].point.device_gps.split(",");
  let minX = xy[0];
  let minY = xy[1];
  let maxX = xy[0];
  let maxY = xy[1];
  data.map((item: any) => {
    //  xy = item.point.coordinate
    xy = item.point.device_gps.split(",");
    maxX = Math.max(maxX, xy[0]);
    maxY = Math.max(maxY, xy[1]);
    minX = Math.min(minX, xy[0]);
    minY = Math.min(minY, xy[1]);
  });
  map.fitBounds([
    [minX - (maxX - minX) / 2, maxY + (maxY - minY) / 2],
    [maxX + (maxX - minX) / 2, minY - (maxY - minY) / 2],
  ]); //西北，东南
};
</script>

<style scoped lang="less">
#map {
  color: white;
  height: calc(100% - 0px);
  .checkMap {
    position: absolute;
    right: 2%;
    bottom: 2%;
    z-index: 1000;
    cursor: pointer;
    border-radius: 1px;
    // border: 1px solid white;
    width: 86px;
    height: 62px;
    img {
    }
  }
}
// 隐藏mapbox的标签广告页
:deep(.mapboxgl-control-container) {
  display: none;
}

.contentClass {
  background-image: url("@/assets/image/index/zhengchangBG.png");
  background-size: 100% 100%;
  width: 200px;
}
//隧道样式
.clisite {
  position: absolute;
  // top: 500px;
  // left: 550px;
  width: 52px;
  height: 89px;
  background-size: 100% 100%;
  .framed_box {
    // width: 444px;
    // height: 225px;
    background-image: url(@/assets/image/index/zhengchang.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    color: #ffffff;
    bottom: 120px;
    z-index: 5999 !important;
    .title {
      text-align: left;
      margin-top: 35px;
      margin-left: 25px;
      > span {
        font-style: italic;
        color: #ccf2ff;
        font-size: 20px;
        font-weight: 400;
      }
    }
    .framed_boxcentent {
      display: flex;
      margin: 10px 24px;
      .left {
        > img {
          width: 52px;
          height: 89px;
        }
      }
      .right {
        margin-left: 10px;
        position: relative;
        > p:nth-child(1) {
          font-weight: bold;
          color: #63858e;
          font-size: 16px;
          > span {
            margin-left: 10px;
            color: #ffffff;
          }
        }
        > p:nth-child(2) {
          margin-top: 20px;
          font-weight: bold;
          color: #63858e;
          font-size: 16px;
          > span {
            margin-left: 10px;
            color: #ffffff;
          }
        }

        > p:nth-child(3) {
          position: absolute;
          bottom: 10px;
          > span {
            background: #0095ff;
            border: 1px solid #0095ff;
            border-radius: 4px;
            padding: 4px 15px;
            font-size: 14px;
          }
        }
      }
    }
  }
}

//  设备管理
.clisiteEq {
  > i {
    position: absolute;
    // top: -105px !important;
  }
  //  正常
  .iconfontEqSel {
    color: rgba(0, 234, 255, 1) !important;
  }
  // 红色
  .iconfontEqSel_Err {
    color: rgba(255, 51, 85, 1) !important;
  }
  // 离线
  .iconfontEqSel_offline {
    color: rgba(153, 153, 153, 1) !important;
  }
  //聚合总数
  .countDiv {
    position: absolute;
    top: 1px !important;
    right: 10px;
    > span {
      border-radius: 10px;
      background-color: rgba(0, 234, 255, 1) !important;
      display: inline-block;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
      text-align: center;
      white-space: nowrap;
      color: rgb(1, 11, 12) !important;
      font-size: 12px;
    }
  }
}

// 离线弹框
.infopanel1 {
  position: absolute;
  // top: 140px;
  // left: 110px;
  width: 172px;
  // background: rgba(153, 153, 153, 0.2);
  // border-image: linear-gradient(0deg, #999999, #999999) 10 10;
  background-size: 100% 100%;
  z-index: 50;
  background-image: url("@/assets/image/index/gaojingBg.png");
  color: #ffffff;
  padding: 10px;
  .errdiv {
    width: 172px;
    margin: 5px 10px;
  }
}
//错误弹框
.infopanel2 {
  position: absolute;
  top: 140px;
  left: 110px;
  width: 172px;

  // background: rgba(223, 75, 93, 0.2);
  background-image: url("@/assets/image/index/gaojingBg.png");
  // border-image: linear-gradient(0deg, #df4b5d, #df4b5d) 10 10;
  background-size: 100% 100%;
  padding: 10px;
  z-index: 50;
  color: #ffffff;
  .errdiv {
    width: 172px;
    margin: 5px 10px;
  }
}

.icon2 {
  position: absolute;
  left: -2px;
  top: 1px;
  cursor: grab;
  .icon {
    &-whole {
      position: absolute;
      left: -37px;
      top: -82px;
    }
    &-icon {
      position: absolute;
      left: 21px;
      top: 20px;
    }
    &-text {
      position: absolute;
      color: white;
      font-size: 25px;
      top: 27px;
      left: 0px;
      width: 96px;
    }
    &-num {
      position: absolute;
      left: 53px;
      background: #00ffff;
      /* margin: -14px; */
      height: 15px;
      line-height: 15px;
      top: 19px;
      padding: 2px 8px;
      border-radius: 16px;
      color: #041235;
      font-weight: bolder;
    }
    &-iconfont {
      color: #00ffff;
      margin-right: 10px;
      position: absolute;
      left: 38px;
      top: 35px;
      font-size: 20px;
    }
  }
}
</style>
