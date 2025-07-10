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
            <span class="myspan">账号：</span>
            <el-select
              v-model="data.account"
              placeholder=""
              clearable
              collapse-tags
            >
              <el-option
                v-for="item in data.users"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="demo-input-suffix Moninput">
            <span class="myspan">设备类型：</span>
            <el-select
              v-model="data.deviceType"
              placeholder=""
              clearable
              collapse-tags
            >
              <el-option
                v-for="item in data.deviceTypes"
                :key="item.clazzId"
                :label="item.device_clazz_name"
                :value="item.device_clazz_name"
              >
              </el-option>
            </el-select>
          </div>
          <div class="block">
            <span class="myspan">选择时间：</span>
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
              <span class="demonstration">开始时间：</span>
              <el-date-picker
                v-model="data.startTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 338px"
                class="startpicker"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="demo-input-suffix Moninput">
            <div class="block">
              <span class="demonstration">结束时间：</span>
              <el-date-picker
                v-model="data.endTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 338px"
                class="endpicker"
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
            <el-table-column type="selection" width="120"> </el-table-column>
            <el-table-column label="序号" prop="serialNum"></el-table-column>
            <el-table-column label="账号" prop="u_loginid"></el-table-column>
            <el-table-column label="时间" prop="log_time"></el-table-column>
            <el-table-column label="区域" prop="area"></el-table-column>
            <el-table-column
              label="设备类型"
              prop="device_type"
            ></el-table-column>
            <el-table-column
              label="操作类型"
              prop="action_type"
            ></el-table-column>
            <el-table-column
              label="操作内容"
              prop="action_content"
            ></el-table-column>
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
        <div class="gatewaydiv" v-if="userAdd_show">
          <div class="gatewaydiv_box">
            <!-- 头部部分 -->
            <div class="title">
              <h5>{{ titlenew }}</h5>
              <i class="el-icon-close" @click="cancleUser_btn"></i>
            </div>
            <!-- 中间部分 -->
            <div class="centent">
              <!-- 新增 -->
              <div class="adddiv" v-if="userState === 1 || userState === 3">
                <div class="username">
                  <span class="myspan">设备编号:</span>
                  <el-input
                    v-model="addDeviceId"
                    placeholder="请输入"
                  ></el-input>
                </div>
                <div class="username">
                  <span class="myspan">对应车牌号:</span>
                  <el-input
                    v-model="addLicensePlateNum"
                    placeholder="请输入"
                  ></el-input>
                </div>
                <div class="username">
                  <span class="myspan">车型：</span>
                  <el-select
                    v-model="addCarType"
                    placeholder="请选择"
                    clearable
                    collapse-tags
                  >
                    <el-option
                      v-for="item in addCarTypes"
                      :key="item.typeId"
                      :label="item.typeName"
                      :value="item.typeId"
                      @change="test"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div></div>
                <div class="username">
                  <span class="myspan">车身颜色：</span>
                  <el-select
                    v-model="addCarColor"
                    placeholder="请选择"
                    clearable
                    collapse-tags
                  >
                    <el-option
                      v-for="item in addCarColors"
                      :key="item.colorId"
                      :label="item.colorName"
                      :value="item.colorId"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="username">
                  <span class="myspan">使用人：</span>
                  <el-input
                    v-model="addUserName"
                    placeholder="请输入"
                  ></el-input>
                </div>
                <div class="username">
                  <span class="myspan">备注:</span>
                  <el-input
                    v-model="addNote"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                  ></el-input>
                </div>
              </div>
              <!-- 查看 -->
              <div class="adddiv" v-if="userState === 2">
                <div class="lookOver">
                  <div class="fieldName">设备编号:</div>
                  <div class="fieldValue">设备编号信息</div>
                </div>
                <div class="lookOver">
                  <div class="fieldName">对应车牌:</div>
                  <div class="fieldValue">信息</div>
                </div>
                <div class="lookOver">
                  <div class="fieldName">车型:</div>
                  <div class="fieldValue">信息</div>
                </div>
                <div class="lookOver">
                  <div class="fieldName">车身颜色:</div>
                  <div class="fieldValue">信息</div>
                </div>
                <div class="lookOver">
                  <div class="fieldName">使用人:</div>
                  <div class="fieldValue">信息</div>
                </div>
                <div class="lookOver">
                  <div class="fieldName">备注:</div>
                  <div class="fieldValue">
                    信息信息信息信息信息信息信息信息信息信息信息信息信息
                  </div>
                </div>
              </div>
              <!-- 删除 -->
            </div>
            <div class="adddiv" v-if="userState === 4">
              <div>确定删除？</div>
            </div>
            <!-- 底部部分 -->
            <div class="footer">
              <span @click="cancleUser_btn">取消</span>
              <span @click="submitUser_btn">确定</span>
            </div>
          </div>
        </div>
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
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  querySettingLog,
  getAllDeviceClazzByProjectId,
} from "@/api/operationModule/index";
import {
  PROJECTID,
  TUNNELID,
  DIVCIE_TYPE_FK,
  PROJECTNAME,
} from "@/utils/enumeration";
import { AllUserLoginId } from "@/api/user/index";
const routerName: string = "用户管理";
var userAdd_show = ref(false);
const data = reactive({
  reportTime:"",
  list: [],
  titlenew: "",
  userState: 0,
  users: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  account: "全部",
  deviceType: "全部",
  deviceTypes: [],
  startTime: "",
  endTime: "",
  tableloading: false, //是否正在获取数据
  queryParamArray: [
    // {
    //   field:"device_type",
    //   value:"",
    //   type:"equals"
    // },
    // {
    //   field:"u_name",
    //   value:"",
    //   type:"equals"
    // },
    // {
    //   field:"log_time",
    //   value:"",
    //   type:"between"
    // },
  ],
});
//获取日志
const initData = () => {
  data.list = [];
  data.tableloading = true;
  var getDateparameter = {
    pageNumber: data.currentPage + "",
    pageSize: data.pageSize + "",
    queryParam: JSON.stringify(data.queryParamArray),
    project: PROJECTNAME,
  };
  querySettingLog(getDateparameter).then((res: any) => {
    console.log("querySettingLog", res.data);
    if (res.code == 0) {
      data.list = res.data.records;
      data.total = res.data.totalRow;
      data.tableloading = false;
    }
  });
};
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
};
//获取所有用户ID
const getUserId = () => {
  //获取所有用户id
  var allUserLoginIdData = {
    loginId: "admin",
  };
  AllUserLoginId(allUserLoginIdData).then((res: any) => {
    data.users = res;
    let all = "全部";
    data.users.unshift(all);
    console.log(data.users, "this.users");
  });
};
//时间转化
const formatDateTime = (date: Date) => {
  if (!date) {
    return "";
  }
  let y = date.getFullYear();
  let m: number | string = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d: number | string = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h: number | string = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute: number | string = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let second: number | string = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
};
/**
 * 查询按钮
 */
const query_btn = (val:any) => {
  if(val){
    data.currentPage = 1;
  }
  if (data.reportTime) {
    data.startTime = formatDateTime(data.reportTime[0]);
    data.endTime = formatDateTime(data.reportTime[1]);
  }else {
    data.startTime = "";
    data.endTime = "";
  }
  data.queryParamArray = [];
  if (isUnll() && data.startTime === "" && data.endTime === "") {
    data.queryParamArray = [];
    initData();
  } else {
    if (data.account != "" && data.account != "全部") {
      var accountObject = {
        field: "u_loginid",
        value: `'${data.account}'`,
        type: "equals",
      };
      data.queryParamArray.unshift(accountObject);
    }
    if (data.deviceType != "" && data.deviceType != "全部") {
      var deviceTypeObject = {
        field: "device_type",
        value: `'${data.deviceType}'`,
        type: "equals",
      };
      data.queryParamArray.unshift(deviceTypeObject);
    }
    if (data.startTime != "" && data.endTime != "") {
      var timeObject = {
        field: "log_time",
        value: `${data.startTime + "," + data.endTime}`,
        type: "between",
      };
      data.queryParamArray.unshift(timeObject);
    }
    initData();
  }
};
const isUnll = () => {
  if (data.account === "" && data.deviceType === "") {
    return true;
  } else if (data.account === "全部" && data.deviceType === "") {
    return true;
  } else if (data.account === "" && data.deviceType === "全部") {
    return true;
  } else if (data.account === "全部" && data.deviceType === "全部") {
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
  //获取所有用户id
  getUserId();
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
      width: 98.5%;
      background: rgba(0, 149, 255, 0.2);
      margin: auto;
      margin-top: 30px;

      > div {
        display: flex;
        margin-left: 20px;
        color: white;
        padding: 15px 0 15px 0;
        .myspan {
          margin-top: 5px;
          width: 80px;
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

<style lang="scss">
.demo-pagination-block {
  display: flex;
  justify-content: center;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 220px;
}
.querydiv {
  display: flex;
  flex-wrap: wrap;
  width: 98.5%;
  background: rgba(0, 149, 255, 0.2);
  margin: auto;
  margin-top: 30px;

  > div {
    display: flex;
    margin-left: 20px;
    color: white;
    padding: 15px 0 15px 0;
    .myspan {
      margin-top: 5px;
      width: 180px;
    }
  }
}

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
</style>