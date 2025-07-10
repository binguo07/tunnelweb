<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-11 13:54:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 15:14:09
-->
<template>
  <div class="main">
    <!-- :class="headerClass" -->
    <header>
      <nav style="width: 25%; text-align: left; line-height: 110px; margin-left: 5px">
        <img
          src="@/assets/image/index/cjbg.png"
          alt=""
          style="height: 48px; margin-left: 24px"
        />
      </nav>
      <nav style="width: 5%; margin-top: 20px; text-align: center">
        <h1 style="font-size: 18px" class="title" v-if="PROJECTID == 1">隧道监测预警</h1>
        <!-- <h1 style="font-size: 20px" class="title" v-else-if="TunnelTd == 18">德会高速</h1>
        <h1 style="font-size: 20px" class="title" v-else>德会高速</h1> -->
        <h1 style="font-size: 16px" class="title" >叙威高速</h1>
        <!-- <p style="margin-top:4px">3.84公里</p> -->
      </nav>
      <nav style="width: 53%">
        <div class="nativeClass">
          <ul>
            <template v-for="(item, index) in data.routeLists" :key="index">
              <template v-if="PROJECTID == IS_CDN_ID">
                <li
                  v-if="item.name != '首页'"
                  :class="{ topselect_sel: defaultClickIndex == index }"
                  @click="toRoute(item, index)"
                >
                  {{ item.name }}
                </li>
              </template>
              <template v-else>
                <li
                  :class="{ topselect_sel: defaultClickIndex == index }"
                  @click="toRoute(item, index)"
                >
                  {{ item.name }}
                </li>
              </template>
            </template>

            <!-- <img style="width:22px;height:24px;margin-top: 30px;"
                 src="@/assets/image/index/jia@2x.png"
                 alt=""> -->
            <img
              class="iconfont icon-wode"
              src="@/assets/image/index/usertop.png"
              alt=""
              style="
                width: 15%;
                margin-left: 15px;
                margin-top: 35px;
                width: 25px;
                height: 25px;
              "
            />
            <div style="width: 10%; font-size: 3px; display: flex">
              <span
                style="
                  display: flex;
                  align-items: center;
                  margin-left: 6px;
                  font-size: 16px;
                "
              >
                {{ data.user.name ? data.user.name : data.user.loginId }}
              </span>
            </div>

            <el-tooltip
              content="退出"
              style="
                width: 15%;
                margin-left: 15px;
                margin-top: 35px;
                width: 25px;
                height: 25px;
              "
            >
              <img
                class="iconfont icon-wode"
                src="@/assets/image/index/tuichu.png"
                alt=""
                style="
                  width: 10%;
                  margin-left: 1px;
                  margin-top: 35px;
                  width: 25px;
                  height: 25px;
                  cursor: pointer;
                "
                @click="outLogin"
              />
            </el-tooltip>
            <li style="margin-right: 10px; min-width: 10px">
              <div
                @click="toggleFullScreen"
                class="screenspan"
                style="margin-top: 32px; display: flex; justify-content: center"
              >
                <p>
                  <i class="iconfont icon-quanping fullIcon" v-if="!isFullScreen">
                    <span style="width: 100%">全屏</span>
                  </i>
                  <i class="iconfont icon-tuichuquanping fullIcon" v-if="isFullScreen">
                    <span style="width: 100%">窗口</span>
                  </i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <div class="contentClass">
      <!-- 二级导航出口 -->
      <router-view />
    </div>
    <DrawerRight></DrawerRight>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import { reactive, Ref, watch } from "vue";
import { onMounted, ref } from "vue-demi";
import { useStore } from "vuex";
import { Router, useRoute, useRouter } from "vue-router";
import { PROJECTID, PROJECTNAME } from "@/utils/enumeration";
import DrawerRight from "@/components/deviceInfo/drawerRight.vue";
interface route {
  name: string;
  url: string;
}
const store0 = useStore();
const data = reactive({
  user: {},
  routeLists: [
    // {
    //   name: "首页",
    //   url: "/index/home",
    // },
    {
      name: "监控台",
      url: "/index/monitorConsole",
    },
    {
      name: "设备管理",
      url: "/index/deviceManagement",
    },
    {
      name: "用户管理",
      url: "/index/userManagement",
    },
    {
      name: "告警记录",
      url: "/index/alarmRecord",
    },
    {
      name: "数据中心",
      url: "/index/recordsCenter",
    },
    // {
    //   name: "监测报告",
    //   url: "/index/monitoringReportList",
    // },
    {
      name: "操作日志",
      url: "/index/operationLog",
    },
  ],
});
// 默认选中首页
const defaultClickIndex: Ref = ref(0);
// 是否全屏
const isFullScreen: Ref = ref(false);
const TunnelTd: string = store0.state.Home.tunnelId; //TunnelTd：18为德会高速

const router: Router = useRouter();
const userInfo: object = store.getters;
let isRomoveRouteIndex: Ref<number | null> = ref(null);
const IS_CDN_ID = 1;
const routePath: string[] = [
  // "/index/home",
  "/index/monitorConsole",
  "/index/deviceManagement",
  "/index/userManagement",
  "/index/alarmRecord",
  "/index/recordsCenter",
  // "/index/monitoringReportList",
  "/index/operationLog",
];
onMounted(() => {
  //不是管理员需要隐藏用户板块
  // var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // if (userInfo.role != 1) {
  //   //role为1表示为超级管理员
  //   isRomoveRouteIndex.value = data.routeLists.findIndex((item) => {
  //     if (item.name == "用户管理") {
  //       return true;
  //     }
  //   });
  //   if (isRomoveRouteIndex.value != null) {
  //     data.routeLists.splice(isRomoveRouteIndex.value, 1);
  //     routePath.splice(isRomoveRouteIndex.value, 1);
  //   }
  // }
  console.log("TunnelTd>>", TunnelTd);

  // 默认进入首页
  initRouteActive();
  data.user = JSON.parse(localStorage.getItem("userInfo")) || {};
});
watch(
  () => router?.currentRoute?.value?.path,
  (newold) => {
    initRouteActive();
  }
);

const initRouteActive = () => {
  // if(TunnelTd == IS_CDN_ID){
  // routeLists.slice(1);//删除首页
  // }
  // if (router?.currentRoute?.value?.name == "index") {
  //   router.push(data.routeLists[defaultClickIndex.value].url);
  // }
  let path = router.currentRoute.value.path;
  routePath.forEach((item, index) => {
    if (item == path) {
      defaultClickIndex.value = index;
    }
  });
};

// 跳转导航
const toRoute = (row: route, index: number) => {
  console.log(row, index);
  defaultClickIndex.value = index;
  router.push(row.url);
};
// 切换全屏
const toggleFullScreen = () => {
  console.log(document.documentElement, " ----   document.documentElement");
  if (!document.documentElement) return;
  isFullScreen.value = !isFullScreen.value;
  if (!isFullScreen.value) {
    document.exitFullscreen();
  } else {
    document.documentElement?.requestFullscreen();
  }
};
const outLogin = () => {
  // 退出登录，清除session
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  min-height: calc(100vh);
  background: radial-gradient(circle, #06102c, #131f42);
}
header {
  width: 100vw;
  height: 90px;
  background-repeat: no-repeat;
  background-image: url("@/assets/image/index/headerTop.png");
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  color: white;
  justify-items: center;
  user-select: none;
}
@font-face {
  font-family: "msyhbd";
  src: url("@/assets/fonts/msyhbd.ttf") format("truetype");
}
.title {
  font-family: "msyhbd";
  width: 170px;
}
.nativeClass {
  height: 100%;
  ul {
    height: 100%;
    display: flex;
    justify-content: space-around;
    li {
      font-style: italic;
      height: 100%;
      width: 100px;
      line-height: 90px;
      font-size: 18px;
      cursor: pointer;
      text-align: center;
    }
  }
  .topselect_sel {
    height: 80px;
    width: 100px;
    background-image: url(@/assets/image/index/topselect.png);
    color: rgba(0, 149, 255, 1);
    text-shadow: 5px 5px 5px rgba(0, 149, 255, 1);
    background-size: 120% 100%;
    background-repeat: no-repeat;
    background-position-x: -10px;
  }
}
.contentClass {
  height: calc(100% - 90px);
  div {
    height: 100%;
  }
}
.screenspan {
  // border: 1px solid #154a6e;
  // border-radius: 17px;
  margin-left: 1px;
  cursor: pointer;
  padding: 5px 5px;
  p {
    width: 50px;
    height: 25px;
    display: flex;
    justify-content: center;
    padding-top: 3px;
    padding-left: 4px;
    border: 1px solid #154a6e; // 设置边框颜色
    border-radius: 8px;
    margin-top: -4px;
    i {
      color: rgba(51, 187, 255, 1);
      margin-right: 1px;
    }
  }
}
.fullIcon {
  display: flex;
  justify-items: center;
  width: 100%;
  line-height: 20px;
  font-size: 14px;
  p {
    color: white;
    width: 100%;
  }
}
</style>
