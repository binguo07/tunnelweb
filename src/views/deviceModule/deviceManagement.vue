<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-11 14:03:06
 * @LastEditors: wys
 * @LastEditTime: 2022-08-15 13:53:51
-->
<template>
  <div class="tableimg">
    <div id="diviceManagemengt">
      <BackBorder
        borderWidth="14"
        borderColor="#0095ff"
        parentBorderWidth="1"
        parentBorderColor="rgb(12 58 126)"
        borderCoarse="2"
        backColor="linear-gradient(0deg, rgba(0, 149, 255, 0) 0%, #003164 100%);"
      >
        <div>
          <div class="headerTitle">
            <div v-for="(item, index) in deviceTypes" :key="index">
              <BackBorder
                v-if="index <= 9"
                borderWidth="14"
                borderColor="#00EAFF"
                parentBorderWidth="1"
                parentBorderColor="#0095FF"
                borderCoarse="2"
                backColor="#0b3160"
              >
                <div class="titleClass">
                  <div>
                    <img
                      style="width: 44px; height: 44px"
                      :src="item.imaUrl"
                      alt=""
                    />
                  </div>
                  <div>
                    <p  >
                      <span>{{ item.devs.length || 0 }}</span
                      >套&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                    
                    <p>{{ item.deviceTypeName }}</p>
                  </div>
                </div>
              </BackBorder>
            </div>
          </div>
        </div>
        <div style="margin-top: 12px" class="tablesel">
          <div class="serchStyle">
            
            <el-form-item label="区域名称：" style="margin-left: -10px">
              <el-select
                clearable
                v-model="form.areaName"
                placeholder="请选择区域名称"
              >
                <el-option
                  v-for="(item, index) in areaList"
                  :key="index"
                  :label="item.tunnel_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型：">
              <el-select
                v-model="form.deviceType"
                clearable
                placeholder="请选择设备类型"
              >
                <el-option
                  v-for="(item, index) in deviceTypeList"
                  :key="index"
                  :label="item.device_clazz_name"
                  :value="item.clazzId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编号：" label-width="70px">
              <el-autocomplete
                class="inline-input"
                v-model.trim="form.deviceId"
                clearable
                :fetch-suggestions="querySearchDeviceId"
                placeholder="请输入设备编号"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="桩号："  label-width="70px">
              <el-autocomplete
                class="inline-input"
                v-model.trim="form.deviceNum"
                clearable
                :fetch-suggestions="querySearchDeviceNum"
                placeholder="请输入桩号"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属网关：" label-width="70px">
              <el-autocomplete
                class="inline-input"
                v-model.trim="form.gateway"
                clearable
                :fetch-suggestions="querySearchGateway"
                placeholder="请输入所属网关"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>

            <div
              style="display: flex; width: 34%; justify-content: space-between"
            >
              <el-button
                @click="DeviceList(true)"
                style="margin-left: 50px"
                type="primary"
                >查询</el-button
              >

              <div>
                <span class="drwnloadClass" @click="drwnload"> 下载</span>
                <span
                  class="drwnloadClass"
                  :style="`background-image: url(${require('@/assets/image/deviceManagement/qunkong.png')});`"
                  @click="isShow = true"
                >
                  群控</span
                >
              </div>
            </div>
          </div>
          <div
            v-loading="isLoading"
            element-loading-svg="null"
            element-loading-background="rgba(255,255,255,0)"
            element-loading-text="正在加载..."
          >
            <el-table
              :data="tableData"
              style="width: 100%"
              height="500"
              stripe
              :header-cell-style="{
                background: '#0FA1B2',
                color: '#FFFFFF',
                height: '30px',
              }"
            >
              <template v-slot:empty><p></p></template>
              <el-table-column type="selection" width="80" />
              <el-table-column prop="device_no" label="设备编号" width="180" />
              <el-table-column
                prop="tunnel_name"
                label="区域名称"
                width="180"
              />
              <el-table-column prop="device_clazz_name" label="设备类型" />
              <el-table-column prop="device_location" label="桩号" />
              <el-table-column prop="parent_no" label="所属网关" />
              <el-table-column label="操作">
                <template #default="scope">
                  <div>
                    <el-button type="text" @click="showDetile(scope.row)"
                      >查看
                      <i
                        class="iconfont icon-you"
                        style="font-size: 12px; margin-left: 6px"
                      ></i>
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </BackBorder>
    </div>
    <GroupControl
      v-if="isShow"
      :isShow="isShow"
      @closeGroup="closeGroup"
    ></GroupControl>
  </div>
  <div style="display: flex; justify-content: center;" class="pagindiv paginsel">
    <el-pagination
      class="pagination"
      v-model:currentPage="pageObj.currentPage"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :small="false"
      :disabled="false"
      :background="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageObj.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, Ref } from "vue-demi";
import BackBorder from "./component/BackBorder.vue";
import {
  PROJECTID,
  TUNNELID,
  DIVCIE_TYPE_FK,
  PROJECTNAME,
} from "@/utils/enumeration";
import { SamplingDatafn } from "@/mixins/common";
import GroupControl from "./component/groupControl.vue";
import {
  keywordSerch,
  getAllDeviceTypes,
  getDeviceList,
  getMonitorArea,
  getProjectDevicesInfo,
} from "@/api/device/index";
import { useStore } from "vuex";
import axios from "axios";
const $store = useStore();
const tableData = ref();
const areaList = ref([]);
const deviceTypes = ref([]);
const isLoading: Ref<boolean> = ref(false);
// 控制群控显隐
const isShow = ref(false);
const deviceTypeList = ref([]);
const form = reactive({
  areaName: "",
  deviceType: "",
  deviceId: "",
  deviceNum: "",
  gateway: "",
});

watch(
  () => $store.getters["Common/getIsOpenDrawer"],
  (newold) => {
    // 监听弹窗关闭状态，更新数据
    if (!newold) {
      DeviceList();
    }
  }
);

const closeGroup = (value: any) => {
  console.log(value, "查看传过来的值");
  isShow.value = value;
};

const pageObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10,
});

// 查看设备详细信息
const showDetile = (row: any) => {
  // 存储数据到仓库
  $store.commit("Common/SET_STATE_VALUE", {
    name: "deviceInfos",
    value: row,
  });
  // 打开详细弹窗
  $store.commit("Common/SET_STATE_VALUE", {
    name: "isOpenDrawer",
    value: true,
  });
};
// 根据设备类型获取对应图标
const getDeviceImgByType = function (typeName: string): string {
  console.log("DIVCIE_TYPE_FK", typeName);
  let str = "";
  switch (typeName) {
    case DIVCIE_TYPE_FK.CAMERA:
      str = require("@/assets/image/deviceManagement/shexiangtou.png");
      break;
    case DIVCIE_TYPE_FK.SOIL:
      str = require("@/assets/image/deviceManagement/turangchuanganqi.png");
      break;
    case DIVCIE_TYPE_FK.WEATHER:
      str = require("@/assets/image/deviceManagement/weiqixiangzhan.png");
      break;
    case DIVCIE_TYPE_FK.PERAMBULATOR:
      str = require("@/assets/image/deviceManagement/jiguangceju.png");
      break;
    case DIVCIE_TYPE_FK.MEMS:
      str = require("@/assets/image/deviceManagement/mems.png");
      break;
    case DIVCIE_TYPE_FK.MICRO_POWER_STATION:
      str = require("@/assets/image/deviceManagement/weidianzhan.png");
      break;
    case DIVCIE_TYPE_FK.PLOUGH:
      str = require("@/assets/image/deviceManagement/beidou.png");
      break;
    case DIVCIE_TYPE_FK.TEAR_INSPECT:
      str = require("@/assets/image/deviceManagement/bianpoliefengjiance.png");
      break;
    case DIVCIE_TYPE_FK.STRESS_INSPECT:
      str = require("@/assets/image/deviceManagement/yingbianji.png");
      break;
    case DIVCIE_TYPE_FK.PLATFORMMEMS:
      str = require("@/assets/image/deviceManagement/mems.png");
      break;
    case DIVCIE_TYPE_FK.DISTANCE:
      str = require("@/assets/image/deviceManagement/mems.png");
      break;
  }
  return str;
};
const getDeviceTypes = () => {
  getProjectDevicesInfo({ projectId: PROJECTID }).then((res) => {
    res.forEach((item: any) => {
      item.imaUrl = getDeviceImgByType(item.deviceTypeId);
    });
    deviceTypes.value = res;
    document.body.style.setProperty('--titleWidth',`${100/deviceTypes.value.length}%`);//动态设置菜单长度
    console.log("deviceTypes.value>>", deviceTypes.value);
  });
};
// 设备编号模糊查询
const querySearchDeviceId = function (queryString: any, cb: Function) {
  //模糊查询
  let fuzzydata = {
    field: "device_no",
    value: form.deviceId,
    projectId: PROJECTID,
  };
  keywordSerch(fuzzydata).then((res) => {
    console.log("results1>>", res);
    console.log("results1>queryString>", res);
    let results = JSON.parse(
      JSON.stringify(
        // queryString ? res.data.filter(createFilter(queryString)) :
        res.data
      )
    );
    console.log("results11>>", results);
    let all = {
      value: "全部",
    };
    results.unshift(all);
    console.log("results2>>", results);
    cb(results);
  });
};
// 桩号模糊查询
const querySearchDeviceNum = (queryString: any, cb: Function) => {
  //模糊查询
  let fuzzydata = {
    field: "device_location",
    value: form.deviceNum,
    projectId: PROJECTID,
  };
  keywordSerch(fuzzydata).then((res) => {
    let results = JSON.parse(
      JSON.stringify(
        // queryString ? res.data.filter(createFilter(queryString)) :
        res.data
      )
    );
    let all = {
      value: "全部",
    };
    results.unshift(all);
    cb(results);
  });
};
// 网关模糊查询
const querySearchGateway = (queryString: any, cb: Function) => {
  //模糊查询
  let fuzzydata = {
    field: "parent_no",
    value: form.gateway,
    projectId: PROJECTID,
  };
  keywordSerch(fuzzydata).then((res) => {
    let results = JSON.parse(
      JSON.stringify(
        // queryString ? res.data.filter(createFilter(queryString)) :
        res.data
      )
    );
    let all = {
      value: "全部",
    };
    results.unshift(all);
    cb(results);
  });
};
// 查询设备类型
const getDeviceTypeList = () => {
  getAllDeviceTypes({ projectId: PROJECTID }).then((res) => {
    deviceTypeList.value = res.data;
    let all = {
      clazzId: "",
      device_clazz_name: "全部",
    };
    deviceTypeList.value.unshift(all);
  });
  // 查询区域列表
  getMonitorArea({ projectId: PROJECTID }).then((res) => {
    areaList.value = res;
    let all = {
      tunnel_name: "全部",
      id: "",
    };
    areaList.value.unshift(all);
  });
};
/**
 * 空数据和全部数据判断
 */
const conditional = (val) => {
  return val == null || val == "" || val == "全部" ? "" : val;
};
//查询
const DeviceList = (val: any) => {
  if (val) {
    pageObj.currentPage = 1;
  }
  let parmas = [];
  if (form.deviceId) {
    parmas.push({
      field: "device_no",
      type: "like",
      value: conditional(form.deviceId),
    });
  }
  if (conditional(form.deviceNum)) {
    parmas.push({
      field: "device_location",
      type: "like",
      value: conditional(form.deviceNum),
    });
  }
  if (conditional(form.gateway)) {
    parmas.push({
      field: "parent_no",
      type: "like",
      value: conditional(form.gateway),
    });
  }
  if (conditional(form.areaName)) {
    parmas.push({
      field: "tunnel_fk",
      type: "equals",
      value: conditional(form.areaName),
    });
  }
  if (conditional(form.deviceType)) {
    parmas.push({
      field: "device_clazz_fk",
      type: "like",
      value: conditional(form.deviceType),
    });
  }
  console.log("parmas>>>",parmas);
  parmas = parmas.length ? JSON.stringify(parmas) : "";
  isLoading.value = true;
  getDeviceList({
    pageNumber: pageObj.currentPage,
    pageSize: pageObj.pageSize,
    orderParam: "",
    order: "",
    queryParam: parmas,
    projectId: PROJECTID,
  }).then((res) => {
    console.log(res.records);
    SamplingDatafn(conditional(form.areaName),conditional(PROJECTID)).then((data) => {
      isLoading.value = false;
      let arr = res.records;
      for (var i = 0; i < arr.length; i++) {
        var devicePk = arr[i].id;
        var sampleArray = data["device" + devicePk];
        console.log(devicePk, data["device" + devicePk]);
        if (sampleArray) {
          arr[i].sampleData = sampleArray;
        } else {
          // 赋值初始值
          arr[i].sampleData = [];
        }
      }
      tableData.value = arr;
    });
    pageObj.total = res.totalRow;
  });
};
const drwnload = () => {
  window.open(
    `${process.env.VUE_APP_BASE}/auth/monitor/queryProjectDevicesInfo?isDownload=true&projectId=${PROJECTID}`
  );
};
onMounted(() => {
  document.body.style.setProperty('--titleWidth',`13%`);//初始化菜单长度
  getDeviceTypeList();
  DeviceList();
  getDeviceTypes();
});

const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSizeChange = (size: number) => {
  pageObj.pageSize = size;
  DeviceList();
};
const handleCurrentChange = (size: number) => {
  pageObj.currentPage = size;
  DeviceList();
};
</script>

<style scoped lang="less">
.drwnloadClass {
  background-image: url("@/assets/image/deviceManagement/xiazai.png");
  margin-left: 50px;
  padding: 8px 22px;
  font-size: 14px;
  color: white;
  background-size: 100% 100%;
  cursor: pointer;
}
#diviceManagemengt {
  padding: 10px 20px;
  .headerTitle {
    display: flex;
    width: 1800px;
    & > div {
      .titleClass {
        display: flex;
        user-select: none;
        padding: 0px 0px;
        justify-items: center;
        justify-content: center;
        color: white;
        flex-direction: row;
        & > div {
          margin-left: 10px;
          display: flex;
          flex-wrap: wrap;
          // width: 86px;
          width: 90px;
          height: 45px;
          flex-direction: row;
          & > p:first-child {
            span {
              font-family: "pangmen";
              font-size: 24px;
            }
          }
          & > p:last-child {
            font-size: 14px;
            font-family: "SourceHanSansCN-Regular";
            width: 100px;
          }
        }
      }
      margin-left: 20px;
      width: var(--titleWidth);
    }
  }
  .tablesel {
    padding: 20px;
    .serchStyle {
      display: flex;
      background: rgba(0, 149, 255, 0.2);
      padding: 16px 20px;
      margin-bottom: 20px;
      .el-form-item {
        margin-bottom: 0px;
      }
      :deep(.el-form-item__label) {
        color: white;
        font-size: 14px;
        padding: 0px;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.el-loading-spinner .el-loading-text {
  color: #9ba0a3 !important;
}
.tableimg {
  position: relative;
  width: calc(100vw - 40px);
  height: calc(100vh - 180px);
  top: 10px;
  margin: auto;
  font-weight: 400;
  color: white;
}
.pagination {
  background: #121e40;
  height:80px;
  width: 100%;
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 100;
  display: flex;
  justify-content: center;
}
</style>
