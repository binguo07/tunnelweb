<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-03 11:22:20
 * @LastEditors: wys
 * @LastEditTime: 2022-08-11 11:26:18
-->
<template>
  <div class="reportClass">
    <BackBorder
      borderWidth="14"
      borderColor="#0095ff"
      parentBorderWidth="1"
      parentBorderColor="rgb(12 58 126)"
      borderCoarse="2"
      backColor="linear-gradient(0deg, rgba(0, 149, 255, 0) 0%, #003164 100%);"
    >
      <header>
        <nav>
          <div>
            <span style="margin-top: 5px">报告时间：</span>
            <el-date-picker
              class="reportTime"
              style="width: 360px !important"
              clearable
              v-model="reportTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </div>
          <div style="margin-left: 60px">
            <span style="margin-top: 5px">报告状态：</span>
            <div>
              <el-select
                clearable
                v-model="pageObj.reportStatus"
                class="m-2"
                placeholder="全部"
              >
                <el-option
                  v-for="item in reportsSelect"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <div style="margin-left: 60px">
            <span style="margin-top: 5px">区域名称：</span>
            <div>
              <el-select v-model="data.tunnel_name" placeholder="" collapse-tags>
              <el-option
                v-for="item in data.tunnel_names"
                :key="item.tunnel_name"
                :label="item.tunnel_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            </div>
          </div>
        </nav>
        <nav>
          <el-button type="primary" @click="getReportList(true)"
            >查询</el-button
          >
        </nav>
      </header>

      <div
        class="tablesel"
        v-loading="isLoading"
        element-loading-svg="null"
        element-loading-background="rgba(255,255,255,0)"
        element-loading-text="正在加载..."
      >
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          height="650"
          :header-cell-style="{
            background: '#0FA1B2',
            color: '#FFFFFF',
            height: '30px',
          }"
        >
          >
          <template v-slot:empty><p></p></template>
          <el-table-column prop="number" label="编号" />
          <el-table-column prop="areaName" label="区域名称" />
          <el-table-column prop="report_time" label="报告时间" />
          <el-table-column prop="report_status" label="报告状态">
            <template #default="scope">
              <div>
                {{ scope.row.report_status == 1 ? "已评价" : "未评价" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <div
                style="color: #77c4ff; display: flex; justify-content: center"
                v-show="pageObj.isExpert"
              >
                <div @click="showReport(scope.row, 1)" class="leftRport">
                  <i class="iconfont icon-chakan" style="font-size: 14px"></i>
                  <span style="cursor: pointer; margin-left: 4px">查看</span>
                </div>
                <div
                  @click="showReport(scope.row, 2)"
                  style="margin-left: 20px"
                >
                  <i class="iconfont icon-bianji" style="font-size: 14px"></i>
                  <span style="cursor: pointer; margin-left: 4px">编辑</span>
                </div>
              </div>
              <div
                style="color: #77c4ff; display: flex; justify-content: center"
                v-show="pageObj.isExpert === false"
              >
                <div @click="showReport(scope.row, 1)" class="rport">
                  <i class="iconfont icon-chakan" style="font-size: 14px"></i>
                  <span style="cursor: pointer; margin-left: 4px">查看</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </BackBorder>
    <div class="demo-pagination-block">
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
  </div>
</template>

<script setup lang="ts">
import BackBorder from "@/views/deviceModule/component/BackBorder.vue";
import { IpageObj } from "@/api/report/interfece";
import { ref, onMounted, reactive, Ref, watch, onBeforeUnmount } from "vue";
import { getReportData } from "@/api/report/index";
import { PROJECTID,TUNNELID } from "@/utils/enumeration";
import { useRouter } from "vue-router";
import { formatDateTime } from "@/utils/tool";
import { truncate } from "fs/promises";
import { number } from "echarts";
import { useStore } from "vuex";
import {
  getMonitorArea,
} from "@/api/device/index";

const reportTime: Ref<any[]> = ref([]);
const tableData = ref([]);
const reporsStatus: Ref<string | null | undefined | number> = ref("");
const data = reactive({
  tunnel_name: "",
  tunnel_names: [],
});
const reportsSelect = ref([
  {
    id: "",
    name: "全部",
  },
  {
    id: "1",
    name: "已评价",
  },
  {
    id: "0",
    name: "未评价",
  },
]);
const pageObj = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10,
  reportStatus: "1",
  areaName_value:"",
  isAdmin: false,
  isExpert: false,
});
const router = useRouter();
const isLoading: Ref<boolean> = ref(false);
const store = useStore();
const timer = ref(null);
console.log("store>>");
onMounted(() => {
  //不是管理员需要隐藏用户板块
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log("data.routeLists>userInfo.role>", userInfo.role);
  if (userInfo.role === 1) {
    //role为1表示为超级管理员
    pageObj.isAdmin = true;
    pageObj.isExpert = false;
  } else if (userInfo.role === 3) {
    pageObj.isAdmin = false;
    pageObj.isExpert = true;
  } else {
    pageObj.isAdmin = false;
    pageObj.isExpert = false;
  }
  getDeviceClazzByProjectId();
  getReportList();
  timer.value = setInterval(() => {
    // getReportList();
  }, 2000);
});
isLoading.value = true;
onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
watch(
  () => store.getters["Common/getIsUpdateReportList"],
  (newValue, oldValue) => {
    if (newValue) {
      getReportList();
      store.commit("SET_STATE_VALUE", {
        name: isUpdateReportList,
        value: false,
      });
    }
  }
);
const getDeviceClazzByProjectId = () => {
  getMonitorArea({ projectId: PROJECTID }).then((res) => {
    data.tunnel_names = res;
    let all = {
      tunnel_name: "全部",
      id: "",
    };
    data.tunnel_names.unshift(all);
  });
}
const getReportList = (val: any) => {
  console.log("getReportList>>")
  if (val) {
    pageObj.currentPage = 1;
  }
  let obj: IpageObj = {
    tunnelFk: data.tunnel_name,
    pageSize: pageObj.pageSize,
    pageNumber: pageObj.currentPage,
    reportStatus: pageObj.reportStatus,
    startTime: "",
    endTime: "",
  };
  if (reportTime.value) {
    obj.startTime = formatDateTime(reportTime.value[0]);
    obj.endTime = formatDateTime(reportTime.value[1]);
  } else {
    obj.startTime = "";
    obj.endTime = "";
  }
  // console.log(reporsStatus.value);
  // if (
  //   (reporsStatus.value != "" && reporsStatus.value) ||
  //   reporsStatus.value == 0
  // ) {
  //   obj.reportStatus = reporsStatus.value == 0 ? 1 : 0;
  // }
  getReportData(obj).then((res) => {
    isLoading.value = false;
    tableData.value = res.list;
    pageObj.total = res.totalPage * res.totalRow;
  });
};
const showReport = (row: any, type: number) => {
  console.log("row>>>", row);
  const { href } = router.resolve({
    path: "/monitoringReport",
    query: {
      reportTime: row.report_time,
      id: row.id,
      comments: row.comments,
      types: type,
      report_status: row.report_status,
      areaName:row.areaName,
    },
  });
  window.open(href);
};

const handleSizeChange = (size: number) => {
  pageObj.pageSize = size;
  getReportList();
};
const handleCurrentChange = (size: number) => {
  pageObj.currentPage = size;
  getReportList();
};
</script>

<style scoped lang="scss">
header {
  nav {
    display: flex;
    font-size: 14px;
    color: #ccf2ff;
    div {
      display: flex;
    }
  }
  padding: 16px 24px;
  background: rgba(0, 149, 255, 0.2);
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.leftRport {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    right: -10px;
    height: 12px;
    top: 6px;
    width: 1px;
    background: #77c4ff;
  }
}
.rport {
  position: relative;
}
.reportClass {
  padding: 10px 20px;
}
.el-date-editor .el-range-separator {
  color: #77c4ff;
}
.el-date-editor .el-range-input {
  color: #77c4ff;
}
.el-select .el-input__inner {
  color: #77c4ff;
}
.el-date-editor.el-input {
  width: 250px !important;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
}

.el-date-editor .el-range__icon svg {
  color: #77c4ff;
}
</style>
<style lang="scss" scoped>
.tablesel {
  position: relative;
  width: calc(98.8vw - 40px);
  height: calc(100vh - 290px);
  top: 10px;
  margin: auto;
  font-weight: 400;
  color: white;
}
.pagination {
  background: #121e40;
  height: 80px;
  width: 100%;
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 100;
  display: flex;
  justify-content: center;
}
</style>
