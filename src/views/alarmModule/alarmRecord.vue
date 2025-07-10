
<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-11 14:06:56
 * @LastEditors: wys
 * @LastEditTime: 2022-07-11 14:07:01
-->
<template>
  <div class="deviceList_box">
    <div class="devicelist">
      <div class="tableimg">
        <div class="angle-border left-top-border"></div>
        <div class="angle-border right-top-border"></div>
        <div class="angle-border left-bottom-border"></div>
        <div class="angle-border right-bottom-border"></div>

        <!-- 查询部分 -->
        <div class="querydiv">
          <div class="demo-input-suffix Moninput">
            <span class="myspan">设备编号：</span>
            <el-select v-model="data.deviceId" placeholder="" collapse-tags>
              <el-option
                v-for="item in data.deviceIds"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- <div class="demo-input-suffix Moninput">
            <span class="myspan">所属网关：</span>
            <el-select
              v-model="portalEntry"
              placeholder=""
              clearable
              collapse-tags
            >
              <el-option
                v-for="item in portalEntryOptions"
                :key="item.portalEntryId"
                :label="item.portalEntryName"
                :value="item.portalEntryName"
              >
              </el-option>
            </el-select>
          </div>-->
          <div class="demo-input-suffix Moninput">
            <span class="myspan">区域：</span>
            <el-select v-model="data.tunnel_name" placeholder="" collapse-tags>
              <el-option
                v-for="item in data.tunnel_names"
                :key="item.tunnel_name"
                :label="item.tunnel_name"
                :value="item.tunnel_name"
              >
              </el-option>
            </el-select>
          </div>
          <div class="demo-input-suffix Moninput">
            <span class="myspan">是否解除：</span>
            <el-select v-model="data.isRemove" placeholder="" collapse-tags>
              <el-option
                v-for="item in data.isRemoves"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="block">
            <span class="myspan">故障时间：</span>
            <el-date-picker
              class="reportTime"
              style="width: 360px !important"
              clearable
              v-model="data.reportTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </div>
          <!-- <div class="demo-input-suffix Moninput">
            <div class="block">
              <span class="demonstration">故障时间：</span>
              <el-date-picker
                v-model="data.startTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 338px"
                class="startpicker"
                @change="timeChange"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="demo-input-suffix Moninput">
            <div class="block">
              <span class="demonstration"
                >至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
              >
              <el-date-picker
                v-model="data.endTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 338px"
                class="endpicker"
                @change="timeChange"
              >
              </el-date-picker>
            </div>
          </div> -->
          <div>
            <div class="chaxdiv" @click="query_btn(true)">
              <span>查询</span>
            </div>
          </div>
        </div>
        <!-- 表格部分 -->
        <div class="tablesel" ref="tableseldiv">
          <el-table
            stripe
            ref="multipleTable"
            :data="data.list"
            empty-text=" "
            style="width: 100%"
            :header-cell-style="{ background: '#0FA1B2', color: '#FFFFFF' }"
            height="100%"
          >
            <el-table-column label="序号" prop="index"></el-table-column>
            <!-- <el-table-column label="设备类型" prop="device_clazz_name"></el-table-column> -->
            <el-table-column
              label="设备编号"
              prop="device_no"
            ></el-table-column>
            <el-table-column label="区域" prop="tunnel_name"></el-table-column>
            <el-table-column label="方向" prop="subareaName">
              <!-- <template #default="scope">
                <div v-show="scope.row.direction === 1">
                  <span>左侧</span>
                </div>
                <div v-show="scope.row.direction === 2">
                  <span>右侧</span>
                </div> 
               </template> -->
            </el-table-column>
            <el-table-column
              label="桩号"
              prop="device_location"
            ></el-table-column>
            <el-table-column
              label="报警原因"
              prop="event_title"
            ></el-table-column>
            <el-table-column
              label="解除告警原因"
              prop="reason"
            ></el-table-column>
            <el-table-column
              label="故障时间"
              prop="event_time"
            ></el-table-column>
            <el-table-column
              label="解除时间"
              prop="resume_time"
            ></el-table-column>
            <el-table-column label="解除告警">
              <template #default="scope">
                <div class="gaojin" v-show="scope.row.resume_time === ''">
                  <span
                    v-show="scope.row.resume_time === ''"
                    style="color: #ffffff; cursor: pointer"
                    @click="relieveF(scope.row)"
                    >解除</span
                  >
                </div>
                <span
                  v-show="scope.row.resume_time != ''"
                  style="color: #ffffff; padding-left: 22px"
                  @click="relieveF(scope.row)"
                  >已解除</span
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="data.tableloading"
            style="margin-top: -15vw; margin-left: 47vw; color: gray"
          >
            正在加载...
          </div>
          <div
            v-if="!data.tableloading && data.list.length == 0"
            style="margin-top: -15vw; margin-left: 47vw; color: gray"
          >
            暂无数据
          </div>
        </div>

        <!-- 弹框部分 -->
        <!-- 解除告警弹框 -->
        <el-dialog
          title="是否要解除当前设备异常告警"
          v-model="data.dialogVisible"
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
                v-model="data.valueDesc"
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
        <!--分页部分-->
        <div class="demo-pagination-block">
          <el-pagination
            v-model:currentPage="data.currentPage"
            v-model:page-size="data.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="false"
            :disabled="false"
            :background="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  PROJECTID,
  TUNNELID,
  DIVCIE_TYPE_FK,
  PROJECTNAME,
} from "@/utils/enumeration";
import {
  getProjectEventRecords,
  resetFanErrorStatus,
  keywordSerch,
} from "@/api/alarmRecord/index";
import { getAllDeviceClazzByProjectId } from "@/api/operationModule/index";
import {
  getMonitorArea,
} from "@/api/device/index";
// import { watch } from "fs";
const routerName: string = "用户管理";
var userAdd_show = ref(false);
const data = reactive({
  reportTime: "",
  list: [],
  titlenew: "",
  userState: 0,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  orderParam: [],
  deviceType: "全部",
  deviceTypes: [],
  deviceId: "全部",
  deviceIds: [],
  startTime: "",
  endTime: "",
  isRelieve: false, //解除弹框
  tunnel_name: "全部",
  tunnel_names: [],
  isRemove: "全部",
  isRemoves: ["全部", "是", "否"],
  direction: "-1",
  status: "",
  valueDesc: "",
  dialogVisible: false,
  tableloading: false, //是否正在获取数据
  directions: [
    {
      name: "全部",
      id: "-1",
    },
    {
      name: "左侧",
      id: "1",
    },
    {
      name: "右侧",
      id: "2",
    },
  ],
  recordId: "",
  device_no: "",
});
/**
 * 监听开始时间
 */
watch(
  () => data.startTime,
  (curr, old) => {
    if (curr === null) {
      data.startTime = "";
    }
    console.log("watch>>", data.startTime);
  }
);
watch(
  () => data.endTime,
  (curr, old) => {
    if (curr === null) {
      data.endTime = "";
    }
  }
);
//获取告警记录
const initData = () => {
  data.list = [];
  data.tableloading = true;
  var getDateparameter = {
    pageNumber: data.currentPage + "",
    pageSize: data.pageSize + "",
    orderParam: "",
    order: "",
    projectId: PROJECTID,
    status: data.status,
    queryParam: JSON.stringify(data.queryParamArray),
  };
  getProjectEventRecords(getDateparameter).then((res: any) => {
    console.log("getEventRecords", res.data);
    data.list = res.records;
    data.total = res.totalRow;
    data.tableloading = false;
  });
  querySearchDeviceId();
};

//解除告警方法
const relieveF = (val: any) => {
  data.valueDesc = "";
  if (val.resume_time === "") {
    data.dialogVisible = true;
    console.log("relieveF", val);
    data.recordId = val.recordId;
    data.device_no = val.device_no;
  } else {
    showErrorMessage("该条目已经解除", "error");
  }
};
// 查询区域列表
// const getMonitorArea = () => {
  
// };
//获取项目下所有设备类别
const getDeviceClazzByProjectId = () => {
  var getDateparameter = {
    projectId: PROJECTID,
  };
  getAllDeviceClazzByProjectId(getDateparameter).then((res: any) => {
    if (res.code === 0) {
      data.deviceTypes = res.data;
      let all = {
        device_clazz_name: "全部",
        clazzId: "",
      };
      data.deviceTypes.unshift(all);
    }
  });
  getMonitorArea({ projectId: PROJECTID }).then((res) => {
    data.tunnel_names = res;
    let all = {
      tunnel_name: "全部",
      id: "",
    };
    data.tunnel_names.unshift(all);
    console.log("data.tunnel_names>>",data.tunnel_names)
  });
};
//模糊查询
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
/**
 * 空数据和全部数据判断
 */
const conditional = (val) => {
  return val == null || val == "" || val == "全部" ? "0" : val;
};
//查询设备编号
const querySearchDeviceId = () => {
  //模糊查询
  let fuzzydata = {
    field: "device_no",
    value: "",
    projectId: PROJECTID,
  };
  keywordSerch(fuzzydata).then((res) => {
    let results = res.data;
    let all = {
      value: "全部",
    };
    results.unshift(all);
    data.deviceIds = results;
    console.log("data.deviceIds", data.deviceIds);
  });
};
/**
 * 清空起始查询时间
 */
const changeStartTime = (startVal: any, endVal: any) => {
  data.startTime = startVal;
  data.endTime = endVal;
};

/**
 * 监听事件改变
 */
const timeChange = () => {
  console.log("timeChange>>", data.startTime, data.endTime);
};
/**
 * 查询按钮
 */
const query_btn = (val: any) => {
  if (val) {
    data.currentPage = 1;
  }
  if (data.reportTime) {
    data.startTime = filterTime(data.reportTime[0]);
    data.endTime = filterTime(data.reportTime[1]);
  } else {
    data.startTime = "";
    data.endTime = "";
  }
  data.queryParamArray = [];
  if (isUnll()) {
    data.status = "";
    initData();
  } else {
    if (data.isRemove != "全部") {
      if (data.isRemove === "否") {
        data.status = "0";
      } else if (data.isRemove === "是") {
        data.status = "1";
      }else{
        data.status = "";
      }
    } else {
      data.status = "";
    }
    if (data.deviceId != "全部") {
      var object = {
        field: "device_no",
        value: `'${data.deviceId}'`,
        type: "equals",
      };
      data.queryParamArray.unshift(object);
    }
    if (data.tunnel_name != "全部") {
      var object = {
        field: "tunnel_name",
        value: `'${data.tunnel_name}'`,
        type: "equals",
      };
      data.queryParamArray.unshift(object);
    }
    // if (data.startTime === null) {
    //   data.startTime = "";
    // }
    // if (data.endTime === null) {
    //   data.endTime = "";
    // }
    if (data.startTime != "" && data.endTime != "") {
      var timeObject = {
        field: "event_time",
        value: `${data.startTime + "," + data.endTime}`,
        type: "between",
      };
      data.queryParamArray.unshift(timeObject);
    } else if (data.startTime == "" && data.endTime == "") {
    } else {
      showErrorMessage("故障时间，开始和结束必须完整", "error");
      return;
    }
    console.log("data.queryParamArray", data.queryParamArray);
    initData();
  }
};
//  告警确定取消
function confirmCancel_btn(val) {
  if (val === 1) {
    data.dialogVisible = false;
  } else if (val === 2) {
    // 确定告警
    resetFanErrorStatusFn();
  }
}
//确定告警
const resetFanErrorStatusFn = () => {
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  var parameter = {
    recordId: data.recordId,
    device_no: data.device_no,
    reason: data.valueDesc,
    loginId: userInfo.loginId,
    project: PROJECTNAME,
  };
  resetFanErrorStatus(parameter).then((res: any) => {
    console.log("resetFanErrorStatus", res.data);
    if (res.code === 200) {
      showErrorMessage(res.message, "success");
      initData();
      //获取设备类型
      getDeviceClazzByProjectId();
      // getMonitorArea();
      data.dialogVisible = false;
    } else {
      showErrorMessage(res.message, "error");
    }
  });
};
const showErrorMessage = (msg: string, type: any) => {
  ElMessage({
    message: msg,
    type: type,
  });
};
/**
 * 中国标准时间转化
 */
const filterTime = (time: any) => {
  var date = new Date(time);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
};
const isUnll = () => {
  if (
    data.deviceId === "全部" &&
    data.isRemove === "全部" &&
    data.tunnel_name === "全部" &&
    data.startTime === "" &&
    data.endTime === ""
  ) {
    return true;
  } else {
    return false;
  }
};
function handleSizeChange(val: any) {
  data.pageSize = val;
  initData();
}
function handleCurrentChange(val: any) {
  data.currentPage = val;
  initData();
}
onMounted(() => {
  initData();
  //获取设备类型
  getDeviceClazzByProjectId();
  // getMonitorArea();
});
</script>
<style lang="scss" scoped>
.devicelist {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 90px);
  background-color: #040b1e;
  .tableimg {
    position: relative;
    width: calc(100vw - 40px);
    height: calc(100vh - 110px);
    background: linear-gradient(0deg, rgba(0, 149, 255, 0) 0%, #003164 100%);
    background-size: 100% 100%;
    top: 10px;
    margin: auto;
    font-weight: 400;
    color: white;
    border: 1px solid #090e26;
    .querydiv {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      background: rgba(0, 149, 255, 0.2);
      margin: auto;
      margin-top: 30px;
      margin-right: 10px;

      > div {
        display: flex;
        margin-left: 10px;
        color: white;
        padding: 15px 0 15px 0;
        .myspan {
          margin-top: 5px;
          width: auto;
          text-align: right;
          font-size: 15px;
        }
        .startpicker {
          width: 214px !important;
        }
        .endpicker {
          width: 214px !important;
        }
        .selectTime {
          width: 300px;
          .optionTime {
            width: 300px;
          }
        }
      }

      /*新增按钮*/
      .adddiv {
        width: 76px;
        margin-right: 20px;
        font-size: 10px;
        background: #d79231;
      }
      .exportdiv {
        margin-right: 20px;
      }
      .deletediv {
        margin-right: 20px;
      }
      .iconfont {
        margin-left: 4px;
        display: flex;
        width: 20%;
        line-height: 20px;
      }
    }
    .chaxdiv {
      width: 64px;
      height: 32px;
      background: #0095ff;
      border-radius: 4px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      > span {
        text-align: center;
        flex: 1;
      }
    }

    .tablesel {
      margin: 20px 13px;
      height: calc(100vh - 300px);
      .seeDiv {
        // margin: 10px 10px;
        display: flex;
        span {
        }
        cursor: pointer;
        .iconfont {
          margin-right: 20px;
          // margin-left: 4px;
          display: flex;
          width: 10%;
          line-height: 20px;
        }
      }
    }
    .gatewaydiv {
      position: absolute;
      left: 50%;
      top: 50%;
      min-height: 320px;
      width: 500px;
      transform: translate(-50%, -50%);
      z-index: 1000;
      background: rgba(1, 36, 86, 1);
      .gatewaydiv_box {
        .title {
          border-bottom: 1px solid rgba(67, 154, 255, 0.3);
          display: flex;
          align-items: center;
          padding: 15px 40px;

          h5 {
            flex: 1;
            font-size: 24px;
            font-weight: 500;
            color: #ccf2ff;
          }
          i {
            color: rgba(0, 116, 186, 1);
            cursor: pointer;
            font-size: 18px;
          }
        }
        .centent {
          margin: 40px 40px;
          .adddiv {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .username {
              display: flex;
              align-items: center;
              margin: 25px 10px;
              width: 100%;
              justify-content: space-between;
              align-items: flex-start;
              .myspan {
                width: 120px;
                text-align: left;
              }
            }
            .lookOver {
              display: flex;
              align-items: center;
              margin: 25px 10px;
              width: 100%;
              justify-content: center;
              align-items: flex-start;
              .fieldName {
                font-size: 14px;
                color: #ccf2ff;
                text-align: right;
                margin-left: 20px;
                width: 100px;
              }
              .fieldValue {
                font-size: 14px;
                color: #ffffff;
                text-align: left;
                margin-left: 20px;
                width: 252px;
              }
            }
            // .el-select {
            //   width: 100%;
            //   // background: rgba(0,149,255,0.2000);
            // }
          }
        }
        .footer {
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
        .gatewaypadsel {
          display: none;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.gaojin {
  background-image: url(~@/assets/image/deviceManagement/xiazai.png);
  width: 62px;
  height: 26px;
  margin-left: 75px;
  background-size: 62px 26px;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 200px !important;
}
// .querydiv {
//   display: flex;
//   flex-wrap: wrap;
//   width: 100%;
//   background: rgba(0, 149, 255, 0.2);
//   margin: auto;
//   margin-top: 30px;
//   margin-right: 10px;
//   > div {
//     display: flex;
//     margin-left: 20px;
//     color: white;
//     padding: 15px 0 15px 0;
//     .myspan {
//       margin-top: 5px;
//       width: 180px;
//     }
//   }
// }

.querydiv .el-input__ico {
  height: 40px !important;
}
.chaxdiv {
  width: 64px;
  height: 32px;
  background: #0095ff;
  border-radius: 4px; /*圆角*/
  background-size: 100% 100%;
  display: flex; /*设置弹性布局*/
  align-items: center; /*设置子元素居中*/
  cursor: pointer;
  > span {
    text-align: center;
    flex: 1; /*根据父控件实现等分效果*/
  }
}

// .el-input {
//   --el-input-height: var(--el-component-size);
//   position: relative;
//   font-size: var(--el-font-size-base);
//   display: inline-flex;
//   width: 100%;
//   line-height: var(--el-input-height);
//   box-sizing: border-box;
// }

// .deviceList_box{
//         background-color: rgba(0, 0, 0, .3);
//         position: absolute;
//         width:100%;
//         height:100%;
//         z-index: 999;
//         display: none;
// }
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
//  弹框
.el-dialog.is-fullscreen {
  top: 30%;
  height: 400px !important;
  width: 500px !important;
  background: rgba(1, 36, 86, 1) !important;
}
.el-dialog__title {
  font-weight: 500;
  color: #ccf2ff;
  font-size: 20px;
}
</style>
<style scoped>
</style>