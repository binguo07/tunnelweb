<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 15:05:10
 * @LastEditors: wys
 * @LastEditTime: 2022-08-15 13:58:08
-->
<template>
  <div>
    <!-- 告警信息部分 -->
    <div class="alarmDiv">
      <!-- 左边告警信息 -->
      <div class="alarmRight">
        <div class="alarmRight_box">
          <!-- 表格部分 -->
          <div class="tablesel">
            <el-table :data="tableData"
                      style="width: 100%"
                      height="100%"
                      :header-cell-style="{ background: '#0FA1B2', color: '#FFFFFF' }">
              <template v-for="(item, index) in tableHead"
                        :key="index">
                <el-table-column :prop="item.column_name"
                                 :label="item.column_comment"
                                 width="120"></el-table-column>
              </template>
            </el-table>
          </div>

          <!-- 分页部分 -->
          <div class="pagindiv paginsel">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="limitConfig.pageSize"
                           :pager-count="2"
                           small
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="limitConfig.total"
                           :current-page="limitConfig.pageNum">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { getDeviceError } from "@/api/home/index";
const $store = useStore();
import { onMounted, ref ,onBeforeUnmount} from "vue-demi";
import { reactive } from "vue-demi";
import { nextTick, watch } from "vue";
const tableHead = ref([]);
const tableData = ref([]);
const limitConfig = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
});
const total = ref(0);
const timer = ref(0);
const timeLong = 30 * 1000; //30秒
watch(
  () => $store.getters["Common/getIsOpenDrawer"],
  (newold) => {
    if (newold) {
      getDeviceErrors();
    } else {
      tableHead.value = [];
      tableData.value = [];
    }
  }
);
const deviceInfo = $store.getters["Common/getDeviceInfos"];
const handleSizeChange = (row: number) => {
  limitConfig.pageSize = row;
  getDeviceErrors();
};
const handleCurrentChange = (row: number) => {
  limitConfig.pageNum = row;
  getDeviceErrors();
};
onMounted(() => {
  getDeviceErrors();
  timer.value = window.setInterval(function logname() {
    getDeviceErrors();
  }, timeLong);
});
onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
const getDeviceErrors = () => {
  
  getDeviceError({
    pageNumber: limitConfig.pageNum,
    pageSize: limitConfig.pageSize,
    devId: deviceInfo.id,
  }).then((res: any) => {
    nextTick(() => {
      tableHead.value = res.tableHead;
      tableData.value = res.alarmList;
      limitConfig.total = res.totalRow;
      console.log("tableHead>>>",tableHead.value)
    });
  });
};
</script>

<style scoped lang="less">
.alarmRight {
  :deep(.el-table tr) {
    height: 30px !important;
    > th {
      color: #ffffff;
      font-size: 16px;
    }
    > td {
      padding: 10px 0 !important;
      height: 50px;
      border-bottom: 0.0625rem dashed #439bffa8;
    }
  }

  :deep(.el-table th.el-table__cell) {
    padding: 0.75rem 0;
    .cell {
      display: inline-block;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: relative;
      vertical-align: middle;
      padding-left: 0.625rem;
      padding-right: 0.625rem;
      width: 100%;
    }
  }
  .alarmRight_box {
    margin: 20px 42px;
    .tablesel {
      height: calc(100vh - 200px) !important;
      .el-table__body-wrapper {
        background: transparent !important;
      }
      :deep(.el-table__inner-wrapper::before) {
        background-color: transparent !important;
      }
    }
    //  插件分页
    .pagindiv {
      position: absolute !important;
      height: 40px !important;
      bottom: 10px !important;
    }
  }
}
</style>
