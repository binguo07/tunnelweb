<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-11 14:05:53
 * @LastEditors: wys
 * @LastEditTime: 2022-07-11 14:05:58
-->
<template>
  <div class="recordsCenterDiv">
    <!-- 背景图片 -->
    <div class="records_img">
      <!-- 查询条件 -->
      <div class="querydiv_new" :style="btnindex != 1  && `display:flex`">
        <div style="display: flex;width:100%">
          <!-- 区域名称 -->
          <div>
            区域名称：
            <el-select
              v-model="areaName_value"
              placeholder="请选择区域名称"
              @change="areaName_change"
            >
              <el-option
                v-for="item in areaName_options"
                :key="item.id"
                :label="item.tunnel_name"
                :value="item.id"
              />
            </el-select>
          </div>
          <!-- 设备类型 -->
          <div v-if="btnindex == 1">
            设备类型：
            <el-select
              v-model="equipmentType_value"
              placeholder="全部"
              @change="quipmentType_change"
            >
              <el-option
                v-for="item in equipmentType_options"
                :key="item.clazzId"
                :label="item.device_clazz_name"
                :value="item.clazzId"
              />
            </el-select>
          </div>
          <!--设备编号 -->
          <div v-if="btnindex == 1">
            设备编号：
            <el-select v-model="equipmentNumber_value" placeholder="">
              <el-option
                v-for="item in equipmentNumber_options"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </div>
          <!-- 时间选择 -->
          <div class="timeDiv_box" v-if="btnindex == 1">
            <span>时间范围：</span>
            <div class="timeDiv">
              <div class="block">
                <el-date-picker
                  v-model="start_dateTime"
                  ref="mytime"
                  :disabled="ablehappy"
                  style="width: 200px"
                  type="datetime"
                  placeholder="开始时间"
                  align="right"
                >
                </el-date-picker>
                <span
                  style="
                    left: 0px;
                    position: relative;
                    margin-left: 5px;
                    margin-right: 5px;
                  "
                  >至</span
                >
              </div>

              <div class="block">
                <el-date-picker
                  v-model="end_dateTime"
                  ref="mytimetwo"
                  :disabled="ablehappy"
                  type="datetime"
                  style="width: 200px"
                  placeholder="结束时间"
                  align="right"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <!-- 查看 -->
          <div class="querybtn" style="margin-left:20px">
            <span @click="query_btn(btnindex)">查询</span>
          </div>

          <!-- 时间按钮选择 -->
          <div class="time-box" v-if="btnindex == 1">
            <div
              v-for="(item, index) in timeOptions"
              :key="index"
              class="time-item"
              :class="{ active: timeIndex == index }"
              @click="changeTimeIndex(index, item.value)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <div style="width: 100%;position: relative;" :style="btnindex == 1  && `margin-bottom: 10px;`">
          <!-- 时间空间切换按钮 -->
          <div class="button_div" style="bottom: 16px;">
            <span :class="{ btnshow: btnindex == 0 }" @click="spaceTime_btn(0)"
              >空间域排序</span
            >
            <span :class="{ btnshow: btnindex == 1 }" @click="spaceTime_btn(1)"
              >时域排序</span
            >
          </div>
        </div>
      </div>
      <!-- 时域排序 -->
      <el-scrollbar class="echarts_height" v-if="btnindex == 1">
        <div class="timeDomain_div">
          <!--mems设备成德南-->
          <template v-if="TUNNELID == IS_CDN_ID">
            {{ deviceListMems.value }}
            <template v-for="(item, index) in deviceListMems" :key="index">
              <!-- 设备倾角（°） -->
              <p>{{ item.deviceName }}</p>
              <div
                class="echartsdiv_box"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <!-- 标题 -->
                <div class="titlebox">
                  <div class="title">{{ item2.yTitle }}</div>
                  <div class="tittle_bg">
                    <div class="unitdiv">
                      <span>单位：</span>
                      <span>{{ item2.unit }}</span>

                      <template v-if="item2.yTitle == '剩余电量'">
                        <div class="tittle_bg">
                          <div class="tittle_bg_box">
                            <div>
                              <span></span>
                              <span>安全</span>
                            </div>
                            <div>
                              <span></span>
                              <span>警戒</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- 曲线图 -->
                <template v-if="item2.yTitle == '偏移角度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_inclination' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '水平位移'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_horizontalDisplacement' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '沉降值'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_pavementSettlement' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>

                <template v-if="item2.yTitle == '剩余电量'">
                  <!-- 曲线图 -->
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_voltage' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
              </div>
            </template>
            {{ deviceListPlough.value }}
            <template v-for="(item, index) in deviceListPlough" :key="index">
              <!-- 设备倾角（°） -->
              <p>{{ item.deviceName }}</p>
              <div
                class="echartsdiv_box"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <!-- 标题 -->
                <div class="titlebox">
                  <div class="title">{{ item2.yTitle }}</div>
                  <div class="tittle_bg">
                    <div class="unitdiv">
                      <span>单位：</span>
                      <span>{{ item2.unit }}</span>
                    </div>
                  </div>
                </div>

                <template v-if="item2.yTitle == '北斗沉降'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_pavementSettlementBd' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '北斗水平位移'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_horizontalDisplacementBd' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
              </div>
            </template>
            {{ deviceListSoil.value }}
            <template v-for="(item, index) in deviceListSoil" :key="index">
              <!-- 设备倾角（°） -->
              <p>{{ item.deviceName }}</p>
              <div
                class="echartsdiv_box"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <!-- 标题 -->
                <div class="titlebox">
                  <div class="title">{{ item2.yTitle }}</div>
                  <div class="tittle_bg">
                    <div class="unitdiv">
                      <span>单位：</span>
                      <span>{{ item2.unit }}</span>
                    </div>
                  </div>
                </div>
                <!-- 曲线图 -->
                <template v-if="item2.yTitle == '土壤温度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_soilTemperature' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '土壤湿度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_soilMoisture' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
              </div>
            </template>
            {{ deviceListTear.value }}
            <template v-for="(item, index) in deviceListTear" :key="index">
              <!-- 设备倾角（°） -->
              <p>{{ item.deviceName }}</p>
              <div
                class="echartsdiv_box"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <!-- 标题 -->
                <div class="titlebox">
                  <div class="title">{{ item2.yTitle }}</div>
                  <div class="tittle_bg">
                    <div class="unitdiv">
                      <span>单位：</span>
                      <span>{{ item2.unit }}</span>
                    </div>
                  </div>
                </div>
                <!-- 曲线图 -->
                <template v-if="item2.yTitle == '裂缝方向'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_fractureDirection' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '裂缝长度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_fractureLength' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
              </div>
            </template>
            {{ deviceListWeather.value }}
            <template v-for="(item, index) in deviceListWeather" :key="index">
              <!-- 设备倾角（°） -->
              <p>{{ item.deviceName }}</p>
              <div
                class="echartsdiv_box"
                v-for="(item2, index2) in item.data"
                :key="index2"
              >
                <!-- 标题 -->
                <div class="titlebox">
                  <div class="title">{{ item2.yTitle }}</div>
                  <div class="tittle_bg">
                    <div class="unitdiv">
                      <span>单位：</span>
                      <span>{{ item2.unit }}</span>
                      <template v-if="item2.yTitle == '风速、风向'">
                        <div class="tittle_bg_arrow">
                          <div>
                            <i class="iconfont icon-jiantou"></i>

                            <span>微风</span>
                          </div>
                          <div>
                            <i class="iconfont icon-jiantou"></i>
                            <span>中风</span>
                          </div>
                          <div>
                            <i class="iconfont icon-jiantou"></i>
                            <span>大风</span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- 曲线图 -->
                <template v-if="item2.yTitle == '降雨量'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_rainfall' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '温度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_temperature' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '湿度'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_humidity' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '气压'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_pressure' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
                <template v-if="item2.yTitle == '风速、风向'">
                  <div
                    class="echartsdiv_line"
                    :ref="'echarts_wind' + item.deviceNo"
                    v-if="item2.upXArray && item2.upXArray?.length > 0"
                  ></div>
                  <div class="noData" v-else>
                    <span> 暂无数据</span>
                  </div>
                </template>
              </div>
            </template>
          </template>
          <template v-else>
            <!-- 设备倾角（°） -->
            <div
              class="echartsdiv_box"
              v-for="(item, index) in inclinationList"
              :key="index"
            >
              <!-- 标题 -->
              <div class="titlebox">
                <div class="title">{{ item.yTitle }}</div>
                <div class="tittle_bg">
                  <div class="unitdiv">
                    <span>单位：</span>
                    <span>{{ item.unit }}</span>
                  </div>
                </div>
              </div>
              <!-- 曲线图 -->
              <div
                class="echartsdiv_line"
                ref="echarts_inclination"
                v-if="item.upXArray.length > 0"
              ></div>
              <div class="noData" v-else>
                <span> 暂无数据</span>
              </div>
            </div>
            <!-- 沉降相应值 -->
            <div
              class="echartsdiv_box"
              v-for="(item, index) in settlementList"
              :key="index"
            >
              <!-- 标题 -->
              <div class="titlebox">
                <div class="title">{{ item.yTitle }}</div>
                <div class="tittle_bg">
                  <div class="unitdiv">
                    <span>单位：</span>
                    <span>{{ item.unit }}</span>
                  </div>
                </div>
              </div>
              <!-- 曲线图 -->
              <div
                class="echartsdiv_line"
                ref="echarts_pavementSettlement"
                v-if="item.upXArray.length > 0"
              ></div>
              <div class="noData" v-else>
                <span> 暂无数据</span>
              </div>
            </div>
            <!-- 标准曲线天气 -->
            <div class="echartsdiv_box" v-for="(item, index) in weatherList" :key="index">
              <!-- 标题 -->
              <div class="titlebox">
                <div class="title">
                  {{ item.title }}
                </div>
                <div class="tittle_bg">
                  <div class="unitdiv">
                    <span>单位：</span>
                    <span> {{ item.unit }}</span>
                  </div>
                </div>
              </div>
              <!-- 曲线图 -->
              <div
                class="echartsdiv_line"
                ref="echarts_weather"
                v-if="item.upXArray.length > 0"
              ></div>
              <div class="noData" v-else>
                <span> 暂无数据</span>
              </div>
            </div>
            <!-- 风速风向箭头图 -->
            <div
              class="echartsdiv_box"
              v-for="(item, index) in windSpeedList"
              :key="index"
            >
              <!-- 标题 -->
              <div class="titlebox">
                <div class="title">
                  {{ item.yTitle }}
                </div>
                <div class="tittle_bg">
                  <div class="unitdiv">
                    <span>单位：</span>
                    <span> {{ item.unit }}</span>
                  </div>
                  <div class="tittle_bg_arrow">
                    <div>
                      <i class="iconfont icon-jiantou"></i>

                      <span>微风</span>
                    </div>
                    <div>
                      <i class="iconfont icon-jiantou"></i>
                      <span>中风</span>
                    </div>
                    <div>
                      <i class="iconfont icon-jiantou"></i>
                      <span>大风</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 曲线图 -->
              <div
                class="echartsdiv_line"
                ref="myChart_windSpeed"
                v-if="item.upXArray.length > 0"
              ></div>
              <div class="noData" v-else>
                <span> 暂无数据</span>
              </div>
            </div>
            <!-- 设备剩余电量 -->
            <div class="echartsdiv_box" v-for="(item, index) in voltageList" :key="index">
              <!-- 标题 -->
              <div class="titlebox">
                <div class="title">
                  {{ item.title }}
                </div>
                <div class="tittle_bg">
                  <div class="unitdiv">
                    <span>单位：</span>
                    <span> {{ item.unit }}</span>
                  </div>
                  <div class="tittle_bg_box">
                    <div>
                      <span></span>
                      <span>安全</span>
                    </div>
                    <div>
                      <span></span>
                      <span>警戒</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 曲线图 -->
              <div
                class="echartsdiv_line"
                ref="echarts_voltage"
                v-if="item.upXArray.length > 0"
              ></div>
              <div class="noData" v-else>
                <span> 暂无数据</span>
              </div>
            </div>
          </template>
        </div>
        <div
          v-loading="timeSortLoad"
          element-loading-text="数据加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          style="height: 50px; width: 100%"
        />
        <div
          v-if="
            (!timeSortLoad &&
              inclinationList.length == 0 &&
              settlementList.length == 0 &&
              weatherList.length == 0 &&
              windSpeedList.length == 0 &&
              voltageList.length == 0 &&
              TUNNELID != 1) ||
            (!timeSortLoad &&
              TUNNELID == 1 &&
              deviceListMems.length == 0 &&
              deviceListSoil.length == 0 &&
              deviceListTear.length == 0 &&
              deviceListPlough.length == 0 &&
              deviceListWeather.length == 0)
          "
          class="noData"
        >
          <span>暂无数据</span>
        </div>
      </el-scrollbar>
      <!-- 空间域排序 -->
      <SpaceSort v-if="btnindex == 0" ref="childrenDom"> </SpaceSort>
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
import { ref } from "vue";
import { nextTick } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import SpaceSort from "./components/spaceSort.vue";
const { proxy } = getCurrentInstance();
import { PROJECTID, TUNNELID } from "@/utils/enumeration";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  getAreaRecords,
  getAllDeviceTypesRecords,
  getequipmentNumberRecords,
  getHealthTimingRecords,
  getHealthTimingCDNRecords,
} from "@/api/recordsCenter/index";
import {
  TimestampFn,
  TimesnewDateFn_two,
  TimesweekDateFn,
  TimesmonthDateFn,
} from "@/utils/tool";

// 时域排序
const dataList = ref({}); //请求回来数据
const btnindex = ref(0); //(空间0,时间1)时间空间按钮
const areaName_options = ref([]);
const equipmentType_options = ref([]);
const equipmentNumber_options = ref([]);
const start_dateTime = ref(""); //开始时间
const end_dateTime = ref(""); //结束时间
const IS_CDN_ID = 1;
const timeOptions = [
  {
    label: "今日",
    value: 0,
  },
  {
    label: "近7天",
    value: 1,
  },
  {
    label: "近30天",
    value: 2,
  },
]; // 快捷时间区域选项
// 变量
const data = reactive({
  timeIndex: 0,
  areaName_value: "",
  equipmentType_value: "",
  equipmentNumber_value: "",
});
const { timeIndex, areaName_value, equipmentType_value, equipmentNumber_value } = toRefs(
  data
);
const areaCode = ref(""); //判断隧道类型
//设备列表mems
const deviceListMems = ref([]);
//设备列表土壤检测
const deviceListSoil = ref([]);
//设备裂缝监测
const deviceListTear = ref([]);
//北斗设备检测
const deviceListPlough = ref([]);
//气象站检测
const deviceListWeather = ref([]);
//  时间值
//沉降值
const settlementList = ref([]);
//设备倾角（°）
const inclinationList = ref([]);
// 天气的相应值
const weatherList = ref([]);
//  风速风向
const windSpeedList = ref([]);
// 剩余电量
const voltageList = ref([]);
const timeSortLoad = ref(false); //加载状态
const childrenDom = ref(null);
const router = useRouter();
onMounted(() => {
  initFn(); //初始化
});
function initFn() {
  //空间域排序相应内容
  initTimeFn();
  //  联调接口部分
  getAreaRecordsFn();
}
function initTimeFn() {
  if (data.timeIndex == 0) {
    start_dateTime.value = TimesnewDateFn_two().b;
    end_dateTime.value = TimesnewDateFn_two().c;
  } else if (data.timeIndex == 1) {
    start_dateTime.value = TimesweekDateFn().b;
    end_dateTime.value = TimesweekDateFn().c;
  } else if (data.timeIndex == 2) {
    start_dateTime.value = TimesmonthDateFn().b;
    end_dateTime.value = TimesmonthDateFn().c;
  }
}

//时间默认
//  时间选择判断
function searchDiv_btn() {
  if (start_dateTime.value && end_dateTime.value) {
    var Timestamp_start = start_dateTime.value.getTime(); //开始时间
    var Timestamp_end = end_dateTime.value.getTime(); //开始时间
    if (Timestamp_start >= Timestamp_end) {
      ElMessage({
        message: "开始时间必须小于结束时间",
        type: "warning",
      });
      return true;
    }
  } else {
    ElMessage({
      message: "请选择时间",
      type: "warning",
    });
    return true;
  }
  if (TUNNELID == IS_CDN_ID) {
    getSpikeRecordsCDNFn();
  } else {
    getSpikeRecordsFn();
  }
}

// 查看按钮
function query_btn(val) {
  console.log("query_btn>>val>>", val);
  if (val === 1) {
    // 时间
    searchDiv_btn();
  } else {
    //空间
    if (childrenDom.value)
      console.log(
        "getAreaRecords>>" + areaName_options.value + ">areaCode>" + areaCode.value
      );
    childrenDom.value.btn(areaName_value.value, areaCode.value);
  }
}

// 初始化加载
function initQueryFn() {
  searchDiv_btn();
  getequipmentNumberRecordsFn();
}
//清空值
function emptyValueFn() {
  inclinationList.value = []; //清空值倾角
  settlementList.value = []; //沉降
  weatherList.value = []; //天气曲线
  windSpeedList.value = []; //风速风向
  voltageList.value = []; //剩余电量

  // deviceListMems.value = []; //MEMS设备
}
// 所有返回的值
const getSpikeRecordsFn = () => {
  let data = {
    deviceNo: equipmentNumber_value.value,
    startTime: TimestampFn(start_dateTime.value),
    endTime: TimestampFn(end_dateTime.value),
  };
  emptyValueFn();
  timeSortLoad.value = true;
  getHealthTimingRecords(data).then((res) => {
    timeSortLoad.value = false;
    dataList.value = res;
    spikeRecordsBack();
  });
};

//所有返回的值(成德南)
const getSpikeRecordsCDNFn = () => {
  let data = {
    deviceNo: equipmentNumber_value.value,
    startTime: TimestampFn(start_dateTime.value),
    endTime: TimestampFn(end_dateTime.value),
    tunnelId: TUNNELID,
  };
  emptyValueFn();
  timeSortLoad.value = true;
  getHealthTimingCDNRecords(data).then((res) => {
    timeSortLoad.value = false;
    dataList.value = res;
    spikeRecordsBack();
  });
};

function spikeRecordsBack() {
  let data = dataList.value;

  let memsData = data.MEMS;
  let soilData = data.Soil;
  let tearData = data.Tear;
  let ploughData = data.Plough;
  let weatherData = data.Weather;
  let spike = data.spike; //沉降值
  let weather = data.curve; //曲线
  let voltage = data.voltage; //设备剩余电量
  console.log("weatherData>>", weatherData);
  voltageList.value = voltage || [];
  //设备数据
  if (memsData && memsData.length > 0) {
    deviceListMems.value = memsData;
  } else {
    deviceListMems.value = [];
  }
  if (soilData && soilData.length > 0) {
    deviceListSoil.value = soilData;
  } else {
    deviceListSoil.value = [];
  }
  if (tearData && tearData.length) {
    deviceListTear.value = tearData;
  } else {
    deviceListTear.value = [];
  }
  if (ploughData && ploughData.length > 0) {
    deviceListPlough.value = ploughData;
  } else {
    deviceListPlough.value = [];
  }
  if (weatherData && weatherData.length > 0) {
    deviceListWeather.value = weatherData;
  } else {
    deviceListWeather.value = [];
  }

  //  沉降相应值
  if (spike && spike.length > 0) {
    settlementList.value = spike.filter((item) => {
      if (item.type && item.type === 1) {
        return true;
      }
    });

    inclinationList.value = spike.filter((item) => {
      if (!item.type) {
        return true;
      }
    });
  }

  //  天气曲线
  if (weather && weather.length > 0) {
    weatherList.value = weather.filter((item) => {
      if (!item.type) {
        return true;
      }
    });
    //风速风向
    windSpeedList.value = weather.filter((item) => {
      if (item.type && item.type === 1) {
        return true;
      }
    });
  }

  inclinationListBackFn();
  pavementSettlementBackFn(); //沉降值
  weatherListBackFn(); //天气
  windSpeedBackFn(); //风速风向
  voltageBackFn(); //剩余电量
  memsDatasBackFn(); //mems设备数据处理
  soilDatasBackFn(); //土壤检测设备数据处理
  tearDatasBackFn(); //裂缝监测设备数据处理
  ploughDatasBackFn(); //北斗检测设备数据处理
  weatherDatasBackFn(); //天气检测设备数据处理
}
//对返回的mems设备数据进行处理

function memsDatasBackFn() {
  let data = deviceListMems.value;
  nextTick(() => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (data[i].data[j].upXArray && data[i].data[j].upXArray?.length > 0) {
          if (data[i].data[j].yTitle == "沉降值") {
            let dom = "echarts_pavementSettlement" + data[i].deviceNo; //获取Dom元素
            let settlementData = [data[i].data[j]];
            settlementData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              if (chartDom) pavementSettlementCDNFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "水平位移") {
            let dom = "echarts_horizontalDisplacement" + data[i].deviceNo; //获取Dom元素
            let horizontalDisplacementData = [data[i].data[j]];
            horizontalDisplacementData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              pavementSettlementCDNFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "偏移角度") {
            let dom = "echarts_inclination" + data[i].deviceNo; //获取Dom元素
            let inclinationData = [data[i].data[j]];
            inclinationData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "剩余电量") {
            let dom = "echarts_voltage" + data[i].deviceNo; //获取Dom元素
            let voltageData = [data[i].data[j]];
            voltageData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              voltage_Chart(chartDom, item);
            });
          }
        }
      }
    }
  });
}

//对返回的土壤检测设备数据进行处理

function soilDatasBackFn() {
  let data = deviceListSoil.value;
  nextTick(() => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (data[i].data[j].upXArray && data[i].data[j].upXArray?.length > 0) {
          if (data[i].data[j].yTitle == "土壤温度") {
            let dom = "echarts_soilTemperature" + data[i].deviceNo; //获取Dom元素
            let soilTemperatureData = [data[i].data[j]];
            soilTemperatureData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "土壤湿度") {
            let dom = "echarts_soilMoisture" + data[i].deviceNo; //获取Dom元素
            let soilMoistureData = [data[i].data[j]];
            soilMoistureData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          }
        }
      }
    }
  });
}
//对返回的裂缝检测设备数据进行处理

function tearDatasBackFn() {
  let data = deviceListTear.value;
  nextTick(() => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (data[i].data[j].upXArray && data[i].data[j].upXArray?.length > 0) {
          if (data[i].data[j].yTitle == "裂缝方向") {
            let dom = "echarts_fractureDirection" + data[i].deviceNo; //获取Dom元素
            let fractureDirectionData = [data[i].data[j]];
            fractureDirectionData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "裂缝长度") {
            let dom = "echarts_fractureLength" + data[i].deviceNo; //获取Dom元素
            let fractureLengthData = [data[i].data[j]];
            fractureLengthData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          }
        }
      }
    }
  });
}
//对返回的北斗检测设备数据进行处理

function ploughDatasBackFn() {
  let data = deviceListPlough.value;
  nextTick(() => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (data[i].data[j].upXArray && data[i].data[j].upXArray?.length > 0) {
          if (data[i].data[j].yTitle == "北斗沉降") {
            let dom = "echarts_pavementSettlementBd" + data[i].deviceNo; //获取Dom元素
            let settlementBdData = [data[i].data[j]];
            settlementBdData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              if (chartDom) pavementSettlementCDNFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "北斗水平位移") {
            let dom = "echarts_horizontalDisplacementBd" + data[i].deviceNo; //获取Dom元素
            let horizontalDisplacementBdData = [data[i].data[j]];
            horizontalDisplacementBdData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              pavementSettlementCDNFn(chartDom, item);
            });
          }
        }
      }
    }
  });
}

//对返回的天气数据进行处理
function weatherDatasBackFn() {
  let data = deviceListWeather.value;
  nextTick(() => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (data[i].data[j].upXArray && data[i].data[j].upXArray?.length > 0) {
          if (data[i].data[j].yTitle == "降雨量") {
            let dom = "echarts_rainfall" + data[i].deviceNo; //获取Dom元素
            let rainfallData = [data[i].data[j]];
            rainfallData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "温度") {
            let dom = "echarts_temperature" + data[i].deviceNo; //获取Dom元素
            let temperatureData = [data[i].data[j]];
            temperatureData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "湿度") {
            let dom = "echarts_humidity" + data[i].deviceNo; //获取Dom元素
            let humidityData = [data[i].data[j]];
            humidityData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "气压") {
            let dom = "echarts_pressure" + data[i].deviceNo; //获取Dom元素
            let pressureData = [data[i].data[j]];
            pressureData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              echartsInclinationFn(chartDom, item);
            });
          } else if (data[i].data[j].yTitle == "风速、风向") {
            let dom = "echarts_wind" + data[i].deviceNo; //获取Dom元素
            let windData = [data[i].data[j]];
            windData?.forEach((item, index) => {
              const chartDom = proxy.$refs[dom][index];
              windSpeedFn(chartDom, item);
            });
          }
        }
      }
    }
  });
}

//对返回数据的处理(沉降值)
function pavementSettlementBackFn() {
  let data = settlementList.value;
  let dom = "echarts_pavementSettlement"; //获取Dom元素
  nextTick(() => {
    data.forEach((item, index) => {
      const chartDom = proxy.$refs[dom][index];
      pavementSettlementFn(chartDom, item);
    });
  });
}
//沉降图成德南
function pavementSettlementCDNFn(chartDom, itemValue) {
  let datanew = [];
  if (itemValue.upYArray && itemValue.upYArray.length > 0) {
    for (var i = 0; i < itemValue.upYArray.length; i++) {
      datanew.push(itemValue.upYArray[i]);
    }
  }
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(chartDom);
    let option = {
      grid: {
        top: "25%",
        left: "100px",
        bottom: "30px",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          minSpan: 5,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          minSpan: 1,
          bottom: "7px",
          height: 15, //下滑块手柄的高度调节
          xAxisIndex: [0], //选择的x轴
        },
      ],
      xAxis: {
        type: "category",
        data: itemValue.upXArray,
        name: itemValue.xTitle,
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

      yAxis: [
        {
          nameLocation: "middle",
          splitNumber: 5,
          axisLabel: {
            textStyle: {
              color: "rgba(119, 196, 255, 1)",
            },
          },
          name: itemValue.yTitle,
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
      ],
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
          let datanew = itemValue;
          let dataindex = params[0].dataIndex; //单前选中的项目
          let res = ""; //返回数据
          if (datanew.upYArray && datanew.upYArray.length > 0) {
            for (var i = 0; i < datanew.upYArray.length; i++) {
              if (i === dataindex) {
                if (datanew.yTitle == "水平位移" || datanew.yTitle == "北斗水平位移") {
                  res +=
                    params[0].marker +
                    params[0].name +
                    "<br/>" +
                    "水平位移:" +
                    datanew.upYArray[i] +
                    "mm";
                }
                if (datanew.yTitle == "沉降值" || datanew.yTitle == "北斗沉降") {
                  res +=
                    params[0].marker +
                    params[0].name +
                    "<br/>" +
                    "沉降值:" +
                    datanew.upYArray[i] +
                    "mm";
                }
              }
            }
          }
          return res;
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        show: false,
        inRange: {
          color: ["rgba(0, 149, 255, 1)"],
        },
      },
      series: [
        {
          data: datanew,
          type: "scatter",
        },
      ],
    };

    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    };
  });
}

// 沉降图
function pavementSettlementFn(chartDom, itemValue) {
  let datanew = [];
  if (itemValue.upYArray && itemValue.upYArray.length > 0) {
    for (var i = 0; i < itemValue.upYArray.length; i++) {
      datanew.push(itemValue.upYArray[i].settlement);
    }
  }
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(chartDom);
    let option = {
      grid: {
        top: "25%",
        left: "100px",
        bottom: "30px",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          minSpan: 5,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          minSpan: 1,
          bottom: "7px",
          height: 15, //下滑块手柄的高度调节
          xAxisIndex: [0], //选择的x轴
        },
      ],
      xAxis: {
        type: "category",
        data: itemValue.upXArray,
        name: itemValue.xTitle,
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

      yAxis: [
        {
          nameLocation: "middle",
          splitNumber: 5,
          axisLabel: {
            textStyle: {
              color: "rgba(119, 196, 255, 1)",
            },
          },
          name: itemValue.yTitle,
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
      ],
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
          let datanew = itemValue;
          let dataindex = params[0].dataIndex; //单前选中的项目
          let res = ""; //返回数据
          if (datanew.upYArray && datanew.upYArray.length > 0) {
            for (var i = 0; i < datanew.upYArray.length; i++) {
              if (i === dataindex) {
                res +=
                  params[0].marker +
                  params[0].name +
                  "<br/>" +
                  "沉降值:" +
                  datanew.upYArray[i].settlement +
                  "mm" +
                  "<br/>" +
                  "水平位移:" +
                  datanew.upYArray[i].hDisplacement +
                  "mm";
              }
            }
          }
          return res;
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        show: false,
        inRange: {
          color: ["rgba(0, 149, 255, 1)"],
        },
      },
      series: [
        {
          data: datanew,
          type: "scatter",
        },
      ],
    };

    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    };
  });
}

//对返回数据的处理(沉降值)
function inclinationListBackFn() {
  let data = inclinationList.value;
  let dom = "echarts_inclination"; //获取Dom元素
  nextTick(() => {
    data.forEach((item, index) => {
      const chartDom = proxy.$refs[dom][index];
      echartsInclinationFn(chartDom, item);
    });
  });
}

//  曲线图倾角
function echartsInclinationFn(chartDom, itemValue) {
  let myChart: echarts.ECharts = echarts.init(chartDom);
  let lineColor = 1; //总计有3种组合颜色
  lineColor = Math.floor(Math.random() * 3 + 1);
  // 默认颜色组合
  let colorArr = ["rgba(0, 149, 255, 1)"];
  let lineColor_one_up = "rgba(0, 149, 255, 1)";
  let lineColor_two_up = "rgba(0, 149, 255, 0)";
  let lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  if (lineColor === 1) {
    colorArr = ["rgba(0, 149, 255, 1)"];
    lineColor_one_up = "rgba(0, 149, 255, 1)";
    lineColor_two_up = "rgba(0, 149, 255, 0)";
    lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  } else if (lineColor === 2) {
    colorArr = ["rgba(218, 109, 152, 1)"];
    lineColor_one_up = "rgba(218, 109, 152, 1)";
    lineColor_two_up = "rgba(218, 109, 152, 0)";
    lineColor_three_up = "rgba(218, 109, 152, 0.6)";
  } else if (lineColor === 3) {
    colorArr = ["rgba(0, 149, 255, 1)"];
    lineColor_one_up = "rgba(0, 149, 255, 1)";
    lineColor_two_up = "rgba(0, 149, 255, 0)";
    lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  }

  let option = {
    color: colorArr,
    grid: {
      top: "25%",
      left: "100px",
      bottom: "30px",
      containLabel: true,
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
        let datanew = itemValue;
        let res = ""; //返回数据
        let paramsnew = params[0];
        res +=
          paramsnew.axisValue +
          "<br/>" +
          paramsnew.marker +
          datanew.yTitle +
          "：" +
          paramsnew.value +
          datanew.unit;
        return res;
      },
    },
    xAxis: {
      type: "category",
      data: itemValue.upXArray,
      name: itemValue.xTitle,
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
    yAxis: {
      nameLocation: "middle",
      splitNumber: 5,
      axisLabel: {
        textStyle: {
          color: "rgba(119, 196, 255, 1)",
        },
      },
      name: itemValue.yTitle,
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
    series: [
      {
        data: itemValue.upYArray,
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: lineColor_one_up,
              width: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: lineColor_two_up,
                },
                {
                  offset: 1,
                  color: lineColor_three_up,
                },
              ]),
            },
          },
        },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        minSpan: 5,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        minSpan: 1,
        bottom: "7px",
        height: 15, //下滑块手柄的高度调节
        xAxisIndex: [0], //选择的x轴
      },
    ],
  };

  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

// 天气的曲线图
function weatherListBackFn() {
  let data = weatherList.value;
  let dom = "echarts_weather"; //获取Dom元素
  nextTick(() => {
    data.forEach((item, index) => {
      const chartDom = proxy.$refs[dom][index];
      echartsWeatherFn(chartDom, item);
    });
  });
}

//  天气
function echartsWeatherFn(chartDom, itemValue) {
  let myChart: echarts.ECharts = echarts.init(chartDom);
  let lineColor = 1; //总计有3种组合颜色
  lineColor = Math.floor(Math.random() * 3 + 1);
  // 默认颜色组合
  let colorArr = ["rgba(0, 149, 255, 1)"];
  let lineColor_one_up = "rgba(0, 149, 255, 1)";
  let lineColor_two_up = "rgba(0, 149, 255, 0)";
  let lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  if (lineColor === 1) {
    colorArr = ["rgba(0, 149, 255, 1)"];
    lineColor_one_up = "rgba(0, 149, 255, 1)";
    lineColor_two_up = "rgba(0, 149, 255, 0)";
    lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  } else if (lineColor === 2) {
    colorArr = ["rgba(218, 109, 152, 1)"];
    lineColor_one_up = "rgba(218, 109, 152, 1)";
    lineColor_two_up = "rgba(218, 109, 152, 0)";
    lineColor_three_up = "rgba(218, 109, 152, 0.6)";
  } else if (lineColor === 3) {
    colorArr = ["rgba(0, 149, 255, 1)"];
    lineColor_one_up = "rgba(0, 149, 255, 1)";
    lineColor_two_up = "rgba(0, 149, 255, 0)";
    lineColor_three_up = "rgba(0, 149, 255, 0.6)";
  }
  let option = {
    color: colorArr,
    grid: {
      top: "25%",
      left: "100px",
      bottom: "30px",
      containLabel: true,
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
        let datanew = itemValue;
        let res = ""; //返回数据
        let paramsnew = params[0];
        res +=
          paramsnew.axisValue +
          "<br/>" +
          paramsnew.marker +
          datanew.yTitle +
          "：" +
          paramsnew.value +
          datanew.unit;
        return res;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: itemValue.upXArray,
      name: itemValue.xTitle,
      nameGap: 25,
      nameLocation: "middle",
      nameTextStyle: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 12,
        padding: [0, 0, 0, 0],
      },
      axisLabel: {
        color: "rgba(119, 196, 255, 1)",
        opacity: 1,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(67, 154, 255, 0.2)",
        },
      },
    },
    yAxis: {
      nameLocation: "middle",
      splitNumber: 5,
      axisLabel: {
        textStyle: {
          color: "rgba(119, 196, 255, 1)",
        },
      },
      name: itemValue.yTitle,
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
    series: [
      {
        data: itemValue.upYArray,
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: lineColor_one_up,
              width: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: lineColor_two_up,
                },
                {
                  offset: 1,
                  color: lineColor_three_up,
                },
              ]),
            },
          },
        },
      },
    ],
  };

  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

//  对返回数据的处理(风速风向)
function windSpeedBackFn() {
  let data = windSpeedList.value;
  let dom = "myChart_windSpeed"; //获取Dom元素
  nextTick(() => {
    data.forEach((item, index) => {
      const chartDom = proxy.$refs[dom][index];
      windSpeedFn(chartDom, item); //柱状图图
    });
  });
}
function windSpeedFn(chartDom: string, itemValue: any) {
  let data = itemValue;
  let dataY = [];
  if (itemValue.upYArray && itemValue.upYArray.length > 0) {
    for (var i = 0; i < itemValue.upYArray.length; i++) {
      dataY.push({
        symbolRotate: itemValue.upYArray[i].two,
        value: itemValue.upYArray[i].one,
      });
    }
  }

  const icon_topArrow =
    "path://M771.512499 514.290159 511.614214 64.132646 251.715929 514.290159 414.441057 514.290159 414.441057 959.653483 608.786347 959.653483 608.786347 514.290159Z";
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(chartDom);
    let option = {
      grid: {
        top: "25%",
        left: "100px",
        bottom: "30px",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: itemValue.upXArray,
        name: itemValue.xTitle,
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
      yAxis: {
        nameLocation: "middle",
        splitNumber: 5,
        axisLabel: {
          textStyle: {
            color: "rgba(119, 196, 255, 1)",
          },
        },
        name: itemValue.yTitle,
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
              if (i === dataindex) {
                res +=
                  params[0].marker +
                  params[0].name +
                  "<br/>" +
                  "风速:" +
                  datanew.upYArray[i].one +
                  datanew.upYArray[i].oneUnit +
                  "<br/>" +
                  "风向:" +
                  datanew.upYArray[i].fxDesc;
              }
            }
          }
          return res;
        },
      },
      series: [
        {
          data: dataY,
          type: "scatter",
          symbol: icon_topArrow,
          itemStyle: {
            borderWidth: 1,
            color: function (params: any) {
              let res = "rgba(39, 226, 179, 1)";
              let datanew = data;
              if (datanew.upYArray && datanew.upYArray.length > 0) {
                for (var i = 0; i < datanew.upYArray.length; i++) {
                  if (params.dataIndex === i) {
                    if (datanew.upYArray[i].fsLevel === 1) {
                      // 微风
                      res = "rgba(39, 226, 179, 1)";
                    } else if (datanew.upYArray[i].fsLevel === 2) {
                      //  中风
                      res = "rgba(247, 193, 89, 1)";
                    } else if (datanew.upYArray[i].fsLevel === 3) {
                      //大风
                      res = "rgba(238, 75, 153, 1)";
                    }
                  }
                }
              }
              return res;
            },

            borderColor: "rgba(39, 226, 179, 0)",
          },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          minSpan: 5,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          minSpan: 1,
          bottom: "7px",
          height: 15, //下滑块手柄的高度调节
          xAxisIndex: [0], //选择的x轴
        },
      ],
    };
    myChart.setOption(option);
    window.onresize = function () {
      myChart.resize();
    };
  });
}

// 剩余电量
function voltageBackFn() {
  let data = voltageList.value;
  let dom = "echarts_voltage"; //获取Dom元素
  nextTick(() => {
    data.forEach((item, index) => {
      const chartDom = proxy.$refs[dom][index];
      voltage_Chart(chartDom, item); //沉降值
    });
  });
}

function voltage_Chart(chartDom, itemValue) {
  let datay = []; //y轴的值
  if (itemValue.upYArray && itemValue.upYArray.length > 0) {
    for (var i = 0; i < itemValue.upYArray.length; i++) {
      if (itemValue.upYArray[i] >= 20) {
        datay.push({
          value: itemValue.upYArray[i],
        });
      } else {
        datay.push({
          value: itemValue.upYArray[i],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(241, 159, 40, 0.4)",
              },
              { offset: 1, color: "rgba(241, 159, 40, 1)" },
            ]),
          },
        });
      }
    }
  }
  nextTick(() => {
    let BridgeDetector: echarts.ECharts = echarts.init(chartDom);
    let option = {
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
          let datanew = itemValue;
          console.log(params, 4563);
          let dataindex = params[0].dataIndex; //单前选中的项目
          let res = ""; //返回数据
          if (datanew.upYArray && datanew.upYArray.length > 0) {
            for (var i = 0; i < datanew.upYArray.length; i++) {
              if (i === dataindex) {
                res +=
                  params[0].axisValue +
                  "<br/>" +
                  params[0].marker +
                  "电量剩余:" +
                  datanew.upYArray[i] +
                  "%";
              }
            }
          }
          return res;
        },
      },
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
      grid: {
        top: "25%",
        left: "100px",
        bottom: "30px",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: itemValue.upXArray,
          name: itemValue.xTitle,
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
          nameGap: 25,
          nameLocation: "middle",

          axisLabel: {
            color: "#78C4FF",
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
          type: "value",
          max: 100,
          axisLabel: {
            textStyle: {
              color: "#77C4FF", //坐标值得具体的颜色
            },
          },
          name: itemValue.yTitle,
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
          nameGap: 45,
          nameLocation: "middle",
          min: "dataMin",
          max: "dataMax",
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
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          minSpan: 1,
          start: 80,
          end: 100,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          minSpan: 1,
          bottom: "7px",
          height: 15, //下滑块手柄的高度调节
          xAxisIndex: [0], //选择的x轴
        },
        // {
        //   type: "inside",
        //   start: 0,
        //   end: 20,
        // },
        // {
        //   start: 0,
        //   end: 20,
        // },
      ],
      series: [
        {
          data: datay,
          type: "bar",
          barWidth: 10, //柱图
          barMaxWidth: 30, //柱图宽度
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(96, 229, 253, 0.4)",
                },
                { offset: 1, color: "rgba(96, 229, 253, 1)" },
              ]),
              borderWidth: 1,
            },
          },
          lineStyle: {
            width: 2,
            color: "rgba(96, 229, 253, 1)",
            shadowColor: "rgba(96, 229, 253, 1)",
            shadowBlur: 10,
            shadowOffsetY: 1,
            shadowOffsetx: 10,
          },
        },
      ],
    };

    BridgeDetector.setOption(option);

    setTimeout(() => {
      window.addEventListener("resize", () => BridgeDetector.resize(), false);
    }, 200);
  });
}

// 查询设备类型/区域名称
const getAreaRecordsFn = () => {
  // 查询区域列表
  if (TUNNELID == IS_CDN_ID) {
    areaCode.value = "Slope";
  }
  getAreaRecords({ projectId: PROJECTID }).then((res) => {
    areaName_options.value = res;
    if (areaName_options.value && areaName_options.value.length > 0) {
      areaName_value.value = areaName_options.value[0].id;
      if (childrenDom.value) childrenDom.value.btn(areaName_value.value, areaCode.value);
      areaCodeFn();
    }
  });
  // 设备类型
  getAllDeviceTypesRecords({ projectId: PROJECTID }).then((res) => {
    equipmentType_options.value = res.data;
    if (TUNNELID == IS_CDN_ID) {
      let all = {
        device_clazz_name: "全部",
        clazzId: "-1",
      };
      equipmentType_options.value.unshift(all);
      console.log(
        "getAllDeviceTypesRecords>equipmentType_options>",
        equipmentType_options.value
      );
    }
    if (equipmentType_options.value && equipmentType_options.value.length > 0) {
      equipmentType_value.value = equipmentType_options.value[0].clazzId;
    }

    // 调用设备编号接口
    getequipmentNumberRecordsFn();
  });
};

//  处理隧道类型
function areaCodeFn() {
  let data = areaName_options.value;
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == areaName_value.value) {
        areaCode.value = data[i].area_code;
      }
    }
  }
  // 重置设备编号参数
  equipmentNumber_value.value = "";
  // 刷新设备编号列表
  getequipmentNumberRecordsFn();
}

// 选择设备类型
function quipmentType_change() {
  getequipmentNumberRecordsFn();
}

//改变区域名称值
function areaName_change() {
  areaCodeFn();
}
// 设备编号
const getequipmentNumberRecordsFn = () => {
  let data = {
    field: "device_no",
    projectId: PROJECTID,
    tunnelId: areaName_value.value,
    clazzId: equipmentType_value.value,
  };
  getequipmentNumberRecords(data).then((res) => {
    equipmentNumber_options.value = res.data;
    equipmentNumber_value.value = "";
    if (equipmentNumber_options.value && equipmentNumber_options.value.length > 0) {
      equipmentNumber_value.value = equipmentNumber_options.value[0].value;
    }
  });
};

function changeTimeIndex(index) {
  timeIndex.value = index;
  if (btnindex.value === 1) {
    initTimeFn();
    initQueryFn();
  }
}

//  时间空间
function spaceTime_btn(index) {
  emptyValueFn();
  btnindex.value = index;
  if (index == 1) {
    //  时阈排序
    initQueryFn();
    // 空间域排序
  } else if (index === 0) {
    nextTick(() => {
      if (childrenDom.value) childrenDom.value.btn(areaName_value.value, areaCode.value);
    });
  }
}
function goToReport() {
  const { href } = router.resolve({
    path: "/monitoringReport",
    query: {
      reportTime: "",
      id: 1,
      comments: "",
      types: 1, //1为查看，2为编辑
      report_status: "",
      areaName: "",
    },
  });
  window.open(href);
}
</script>

<style lang="scss" scoped>
.recordsCenterDiv {
  .records_img {
    position: relative;
    width: calc(100vw - 40px);
    height: calc(100vh - 110px);
    background-size: 100% 100%;
    top: 10px;
    margin: auto;
    font-weight: 400;
    color: white;
    background: radial-gradient(circle, #06102c, #131f42);
    .querydiv_new {
      margin-right: 20px;
      width: calc(100vw - 20px);
      background: #062349;

      font-size: 14px;
      > div {
        display: flex;
        margin-left: 10px;
        color: white;
        padding: 15px 0 15px 0;
        align-items: center;
      }
      .timeDiv_box {
        display: flex;
        align-items: center;
        .timeDiv {
          display: flex;
          align-items: center;
        }
      }
      //时间选择器
      .time-box {
        display: flex;
        .time-item {
          width: 80px;
          padding: 5px;
          cursor: pointer;
          text-align: center;
          color: #ffffff;
          background: rgba(0, 149, 255, 0.5);
          margin-left: 10px;
          transform: skewX(-15deg);
          border-radius: 2px;
        }

        .warning-item {
          width: 24%;
        }

        .time-item:hover {
          background: rgba(0, 149, 255, 1);
        }
        .active {
          background: rgba(0, 149, 255, 1);
        }

        .time-item.notAllowed,
        .time-item.active.notAllowed {
          cursor: not-allowed;
        }
      }
      .button_div {
        position: absolute;
        right: 20px;
        > span {
          background: rgba(15, 161, 178, 0.2);
          border: 1px solid #016565;
          margin-left: 20px;
          font-size: 14px;
          cursor: pointer;
        }
        > span:nth-child(1) {
          padding: 7px 8px;
        }
        > span:nth-child(2) {
          padding: 7px 15px;
        }
        > span:nth-child(3) {
          padding: 7px 15px;
          margin-right: 10px;
        }
      }
      .btnshow {
        background: rgba(0, 234, 255, 0.2) !important;
        border: 1px solid #03d4d4 !important;
        color: rgba(0, 255, 255, 1) !important;
      }
    }

    // 公共样式
    .border_box {
      padding: 10px;
      position: relative;
      .borderStyle {
        position: absolute;
      }
      & > span:nth-of-type(1) {
        left: 0px;
        top: 0px;
        border-left: 1px solid;
        border-top: 1px solid;
      }
      & > span:nth-of-type(2) {
        right: 0px;
        top: 0px;
        border-right: 1px solid;
        border-top: 1px solid;
      }
      & > span:nth-of-type(3) {
        left: 0px;
        bottom: 0px;
        border-left: 1px solid;
        border-bottom: 1px solid;
      }
      & > span:nth-of-type(4) {
        right: 0px;
        bottom: 0px;
        border-right: 1px solid;
        border-bottom: 1px solid;
      }
    }
    //查询按钮
    .querybtn {
      > span {
        padding: 5px 10px;
        cursor: pointer;
        background: #0095ff;
        border-radius: 5px;
      }
    }

    //时域排序
    .timeDomain_div {
      .echartsdiv_box {
        width: calc(100% - 30px);
        height: 260px;
        border: 1px solid #003164;
        background: linear-gradient(0deg, #062349 0%, #062349 100%);
        margin: 20px 15px;
        position: relative;
        .echartsdiv_line {
          width: 100%;
          height: calc(100% - 60px);
        }
        .titlebox {
          display: flex;
          align-items: center;
          .title {
            width: 220px;
            background-image: url("../../assets/image/recordsModule/titleBc.png");
            padding: 15px 20px;
            background-size: 100% 100%;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
          }
          .tittle_bg {
            height: 28px;
            width: calc(100% - 50px);
            background: rgba(44, 176, 233, 0.1);
            margin: 0 25px;
            display: flex;
            font-size: 14px;
            align-items: center;
            //单位
            .unitdiv {
              color: #77c4ff;
              font-size: 14px;
              > span:nth-child(1) {
                margin-left: 20px;
              }
            }
            .tittle_bg_box {
              display: flex;
              font-size: 14px;
              align-items: center;

              > div {
                margin-left: 10px;
                > span {
                  margin-left: 5px;
                }
              }
              > div:nth-child(1) {
                > span:nth-child(1) {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: rgba(96, 229, 253, 1);
                }
              }

              > div:nth-child(2) {
                > span:nth-child(1) {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background: #f19f28;
                  border-radius: 50%;
                }
              }
            }

            // 风速风向
            .tittle_bg_arrow {
              display: flex;
              font-size: 14px;
              align-items: center;

              > div {
                margin-left: 10px;
                > span {
                  margin-left: 5px;
                }
              }
              > div:nth-child(1) {
                i {
                  color: rgba(39, 226, 179, 1);
                  font-size: 12px;
                }
              }

              > div:nth-child(2) {
                i {
                  color: rgba(247, 193, 89, 1);
                  font-size: 12px;
                }
              }

              > div:nth-child(3) {
                i {
                  color: rgba(238, 75, 153, 1);
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
  // 图表的高度
  .echarts_height {
    height: calc(100vh - 200px);
  }
  .noData {
    width: 100%;
    position: relative;
    > span {
      position: absolute;
      left: 50%;
      top: 50px;
    }
  }
}
</style>

<style lang="scss">
/* 以下是调组件样式部分后期放在公共样式中 */
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 190px !important;
}
.querydiv_new {
  .el-input {
    width: 140px;
    background-color: #062349 !important;
    color: #ffffff !important;
    border-radius: 4px !important;
  }
  .el-input__inner {
    height: 32px;
    color: #ffffff !important;
  }
  .el-input__icon {
    height: 32px !important;
    line-height: 32px !important;
  }
  .el-input__wrapper {
    background: rgba(255, 255, 255, 0) !important;
    border: none !important;
    border-radius: 4px !important;
    transition: none;
  }
}

//下拉框样式
.el-select-dropdown {
  background: rgba(10, 26, 53, 0.88) !important;
  border: 1px solid #5caaf3 !important;
}
//时间颜色配置
</style>
