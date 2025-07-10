<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-20 13:58:01
 * @LastEditors: wys
 * @LastEditTime: 2022-08-11 09:29:29
-->
<template>
  <div>
    <div class="drawerRight">
      <el-scrollbar>
        <el-drawer ref="drawerRef"
                   v-model.sync="dialog"
                   :before-close="handleClose"
                   direction="rtl"
                   :with-header="false"
                   :show-close="false"
                   custom-class="drawerRight">
          <div class="rightClass">
            <div class="headerClass">
              <div class="headerdiv_img">
                <span>{{ data.deviceInfo.device_name }}({{ data.deviceInfo.device_location }})</span>
              </div>
            </div>
            <!-- 菜单切换部分 -->
            <div class="switchMenu">
              <div class="switchMenu_box">
                <div v-for="(item, index) in data.menuList"
                     :key="index"
                     :class="{ MenuSel: item.value === data.menuActive }"
                     @click="menu_btn(item.value)">
                  <img src="@/assets/image/common/basic.png"
                       alt=""
                       v-if="item.value === 1" />
                  <img src="@/assets/image/common/jinggao.png"
                       alt=""
                       v-if="item.value === 2" />
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </div>
            <div class="drawerContent">
              <LeftContent v-if=" data.menuActive == 1"></LeftContent>
              <RightContent v-else></RightContent>
            </div>
          </div>
        </el-drawer>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { ref } from "vue-demi";
import { useStore } from "vuex";
// import LeftContent from "./leftContent.vue";
// import RightContent from "./rightContent.vue";

import { TUNNELID } from "@/utils/enumeration";
const $store = useStore();
watch(
  () => $store.getters["Common/getIsOpenDrawer"],
  (newold) => {
    if (newold) {
      dialog.value = newold;
      data.deviceInfo = $store.getters["Common/getDeviceInfos"];
    }
  }
);
onMounted(() => {
  console.log("创建当前组件");
  // data.menuActive = 1;
});
const data = reactive({
  // 设备对象
  deviceInfo: {},
  menuList: [
    {
      label: "基础数据",
      value: 1,
    },
    {
      label: "告警信息",
      value: 2,
    },
  ],
  // 控制状态切换的变量
  menuActive: 1,
});
const dialog = ref(false);
// 获取当前元素的ref
const drawerRef = ref(null);

// 菜单切换
const menu_btn = (index: number) => {
  data.menuActive = index;
  console.log("menu_btn>>",index)
};

// 关闭弹窗
const handleClose = () => {
  console.log("关闭弹窗");
  data.menuActive = 1;
  dialog.value = false;
  $store.commit("Common/SET_STATE_VALUE", {
    name: "isOpenDrawer",
    value: false,
  });
};
</script>

<style scoped lang="less">
:deep(.drawerRight) {
  background: #0e2949;
  box-shadow: 0 0 2.5rem 0 rgb(12 21 48 / 67%);
  border-left: 0.125rem solid #59a3f8;
  .el-drawer__body {
    padding: 0px;
  }
  .headerClass {
    width: 100%;
    margin-top: 1vw;
    .headerdiv_img {
      display: flex;
      height: 32px;
      width: 80%;
      background-image: url(@/assets/image/common/tantitle.png);
      background-size: 100% 100%;
      margin-left: 55px;
      > span {
        color: rgba(255, 255, 255, 1);
        font-size: 18px;
        text-align: center;
        width: 100%;
      }
    }
  }
  //基础数据和告警信息切换
  .switchMenu {
    margin: 10px 0;
    .switchMenu_box {
      display: flex;
      align-items: center;
      background: rgba(0, 149, 255, 0.3);
      > div {
        flex: 1;
        padding: 13px 0;
        justify-content: center;
        cursor: pointer;
        font-weight: 400;
        color: #ffffff;
        font-size: 16px;
        display: flex;
        align-items: center;
        > span {
          margin-left: 13px;
        }
      }
      .MenuSel {
        background: rgba(0, 149, 255, 1);
      }
    }
  }

  // 正文内容
  .drawerContent {
  }
}
</style>