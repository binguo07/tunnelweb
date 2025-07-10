<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-14 14:54:53
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 14:46:52
-->
<template>
  <div id="monitor">
    <!-- 边坡 -->
    <Slope v-if="showType == 1"
           :slopeList="data.monitorList"></Slope>
      <!-- 桥梁 -->
     <bridgeScene v-if="showType==2"></bridgeScene>
      <!-- 隧道 -->
    <tunnelScene v-if="showType==3"></tunnelScene>
  </div>
</template>

<script setup lang="ts">
import tunnelScene from "./components/tunnelScene.vue";
import bridgeScene from "./components/bridgeScene.vue";
import { onMounted, reactive, ref } from "vue-demi";
import { useRouter,Router } from "vue-router";
import Slope from "./components/slopeModel.vue";
import { queryDeviceTitle } from "@/api/monitor/index";
import { TUNNELID } from "@/utils/enumeration";
const moduleName: string = "监控台";
// 默认显示边坡
const showType: Ref<number> = ref(1);//(1边坡,2桥梁，3隧道)
const router: Router = useRouter();
const data = reactive({
  monitorList: [],
});
onMounted(() => {
  // 获取传过来的参数
  if (router?.currentRoute?.value.query.type) {
    showType.value = router?.currentRoute?.value.query.type;
  }
  console.log("showType.value>>",showType.value)
  getDeviceList();
});

// 获取监控台对应设备数据
const getDeviceList = () => {
  // 查询边坡数据
  if (showType.value == 1) {
    console.log('查看tunnelid，',TUNNELID," ----TUNNELID")
    queryDeviceTitle({
      tunnelId: TUNNELID,
    }).then((res) => {
      data.monitorList = res;
      console.log(    data.monitorList ," -----    data.monitorList ")
    });
  }
};
</script>

<style lang="less" scoped>
#monitor {
  height: calc(100% - 110px);
  color: white;
}
</style>
