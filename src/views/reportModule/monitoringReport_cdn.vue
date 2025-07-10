<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 09:50:18
 * @LastEditors: wys
 * @LastEditTime: 2022-08-23 16:48:10
-->
<template>
  <div id="report" v-loading="isLoading" element-loading-text="加载中...">
    <div style="min-width: 1200px; width: 1800px; margin: 0px auto">
      <header>
        <nav>
          <img
            style="width: 160px; height: 40px"
            src="@/assets/image/public/jtlogo.png"
            alt=""
          />
        </nav>
        <nav style="text-align: center; margin-top: 30px">
          <h2>{{ reportData.title }}</h2>
          <div style="margin-top: 20px">
            {{ reportData.time }}
            <!-- 时间：2022.10.01 00:00:00至2022.11.31 23:59:59 -->
          </div>
        </nav>
      </header>

      <contentComt title="设备概览">
        <div class="deviceSurvey">
          <div
            v-for="(item, index) in chartObj.totalDevice"
            :key="index"
            :style="`${index != 0 && index != 6 ? 'margin-left:20px;' : ''} ${
              index >= 6 ? '' : ''
            } `"
          >
            <i
              :class="iconClass(item.name)"
              style="font-size: 34px; color: #0095ff; margin-top: 16px"
            ></i>
            <div style="margin-left: 10px">
              <div style="color: #0095ff; font-size: 16px">
                {{ item.size }}
              </div>
              <div style="color: #333333; font-size: 14px; margin-top: 10px">
                {{ item.typeName }}
              </div>
            </div>
          </div>
        </div>
      </contentComt>
      <!-- 数据对比模块 -->
      <p>
        <dataContrast
          v-if="isShow && chartObj.graph3D"
          :graph3D="chartObj.graph3D"
        ></dataContrast>
      </p>
      <!-- 变化最大点的时序图 -->

      <template v-for="item in chartObj.MEMS" :key="item.name">
        <p>
          <maxSequentialChart
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.name"
          ></maxSequentialChart>
        </p>
      </template>

      <template v-for="item in chartObj.Soil" :key="item.name">
        <p>
          <!--土壤监测时序图-->
          <soilSequential
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.device_name"
          ></soilSequential>
        </p>
      </template>
      <template v-for="item in chartObj.Tear" :key="item.name">
        <p>
          <!--裂缝监测时序图-->
          <crackSequential
            v-if="isShow && item.data"
            :chartObj="item.data"
            :chartName="item.device_name"
          ></crackSequential>
        </p>
      </template>
      <p>
        <!-- 北斗设备时序图 -->
        <bigDipperSequential
          v-if="isShow && chartObj.plough"
          :chartObj="chartObj.plough"
        ></bigDipperSequential>
      </p>
      <p>
        <!-- 气象时序图 -->
        <weatherChart
          :weather="chartObj.weather"
          v-if="isShow && chartObj.weather"
        ></weatherChart>
      </p>
      <p>
        <!-- 结论 -->
        <conclusion
          @print="print"
          :isPrint="isPrint"
          @submit="submit"
          ref="changeIsPrint"
        ></conclusion>
      </p>

      <!-- <img :src="canvasSrc"
           ref="imgDom"
           alt="" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, onMounted, computed, nextTick } from "vue-demi";
import contentComt from "./components/content.vue";
// 数据对比模块
import dataContrast from "./components/dataContrast.vue";
import jsPDF from "jspdf"
// 变化最大点的时序图
import maxSequentialChart from "@/views/reportModule/components/maxSequentialChart.vue";
// 北斗设备时序图
import bigDipperSequential from "@/views/reportModule/components/bigDipperSequential.vue";
// 土壤监测时序图
import soilSequential from "@/views/reportModule/components/soil.vue";
//裂缝监测
import crackSequential from "@/views/reportModule/components/crack.vue";
// 结论
import conclusion from "@/views/reportModule/components/conclusion.vue";
// 气象时序图
import weatherChart from "@/views/reportModule/components/weatherChart.vue";
// 操作日志列表
import monitoringReportList from "@/views/reportModule/monitoringReportList.vue";
import { getDataByTunnel, editReport } from "@/api/report/index";
import {
  useRoute,
  RouteLocationNormalizedLoaded,
  RouteParams,
} from "vue-router";
import { useStore } from "vuex";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

import { TUNNELID } from "@/utils/enumeration";
import { ElMessage } from "element-plus";
const reportData = reactive({
  title: "监测报告",
  time: "",
  reportStatus: "",
});

const chartObj = ref({});
const isLoading = ref(false);
const isShow = ref(false);
const changeIsPrint = ref();
const $store = useStore();
const iconClass = computed(() => (name: string) => {
  let str = "";
  switch (name) {
    case "Camera":
      str = "iconfont icon-shexiangtou";
      break;
    case "Plough":
      str = "iconfont icon-beidoushebei";
      break;
    case "Soil":
      str = "iconfont icon-turangshiduchuanganqi";
      break;
    case "Weather":
      str = "iconfont icon-weiqixiangzhan";
      break;
    case "TearInspect":
      str = "iconfont icon-bianpoliefengchuanganqi";
      break;
    case "StressInspect":
      str = "iconfont icon-yingbian";
      break;
    case "MicroPowerStation":
      str = "iconfont icon-weidianzhan";
      break;
    case "Spike":
      str = "iconfont icon-MEMS";
      break;
    default:
      str = "iconfont icon-weidianzhan";
      break;
  }
  return str;
});

const route = useRoute();

onMounted(() => {
  isLoading.value = true;
  let date = (route.query.reportTime + "").split(" ");
  reportData.reportStatus = route.query.report_status + "";
  console.log("reportStatus>>", date);
  let dateYYR = date[0].split("-");
  reportData.time =
    "时间：" +
    dateYYR[0] +
    "." +
    dateYYR[1] +
    ".01    00:00:00至" +
    dateYYR[0] +
    "." +
    dateYYR[1] +
    "." +
    dateYYR[2] +
    "    23:59:59";
  getDataByTunnelFun(route.query.reportTime, route.query.id);
});
const getDataByTunnelFun = (report_time: any, reportId: string) => {
  getDataByTunnel({
    tunnelFk: TUNNELID,
    reportTime: report_time,
    reportId: reportId,
    // tunnelFk: "1",
    // reportTime: "2022-10-15+10:47:24",
    // reportId: "2",
  }).then((res) => {
    isLoading.value = false;
    chartObj.value = res.data;
    isShow.value = true;
    let comments = res.comments;
    changeIsPrint.value.setConclusion(comments);
    if (chartObj.value.status == "-1") {
      ElMessage.error(chartObj.value.message + "");
      return;
    }
  });
};

const submit = (value: string) => {
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // uploadPdf();
  if (!value) ElMessage.error("请填写内容");
  else {
    editReport({
      id: route.query.id,
      comments: value,
      loginId: userInfo.loginId,
    }).then((res) => {
      if (res === 1) {
        ElMessage.success("提交成功");
        $store.commit("Common/SET_STATE_VALUE", {
          name: "isUpdateReportList",
          value: true,
        });
      } else {
        if (res.message) {
          ElMessage.error(res.message);
          return;
        }
        ElMessage.error("提交失败");
      }
    });
  }
};
const canvasSrc: Ref<string | null> = ref("");
const imgDom = ref(null);
const isPrint: Ref<Boolean> = ref(false);

const isSplit = (nodes, index, pageHeight) => {
  // 计算当前这块dom是否跨越了a4大小，以此分割
  if (
    nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight &&
    nodes[index + 1] &&
    nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
  ) {
    return true;
  }
  return false;
};
const get_H = (pageHeight, i, lableListID) => {
  let height = 0;
  for (var j = i; j >= 0; j--) {
    height = height + lableListID[j].offsetTop + lableListID[j].offsetHeight;
    if (height > pageHeight) {
      height =
        height - (lableListID[j].offsetTop + lableListID[j].offsetHeight);
      return pageHeight - height + 150;
    }
  }
};
var loading = null;
//加载提示框
const openFullScreen = () => {
  loading = ElLoading.service({
    lock: true,
    text: "下载中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  // setTimeout(() => {
  //   loading.close()
  // }, 2000)
};
const print = () => {
  openFullScreen();
  changeIsPrint.value.changeIsPrint(true);
  let that = this;
  // if (that.$refs.selftext.scrollHeight > that.$refs.selftext.clientHeight) {
  //   that.$refs.selftext.style.height =
  //     that.$refs.selftext.scrollHeight + 3500 + "px";
  // }
  // console.log();
  // that.borderstyle = "none";
  // that.resizestyle = "none";
  // window.scrollTo(0.1, 0.1);
  window.pageYoffset = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  setTimeout(() => {
    var targetDom = document.getElementById("report");; //你的目标元素id
    html2canvas(targetDom, {
      logging: false,
      background: "#fff",
      allowTaint: true,
      taintTest: false,
      // height: document.body.scrollHeight,
      // width: window.document.body.scrollWidth,
      WindowWidth: document.body.scrollWidth,
      windowHeight: document.body.scrollHeight,
      // x: 0,
      //  y:window.pageYOffset,
      async: false,
      scale: 1,
      dpi: 500, //导出pdf清晰度
      useCORS: true, // 【重要】开启跨域配置
    }).then(function (canvas) {
      var pageData = canvas.toDataURL("image/png", 1.0);
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;
      console.log("contentHeight>>",contentHeight)
      // var f = "p";
      // var imgWidth = 595.28;
      // var imgHeight = 592.28/contentWidth * contentHeight;
    //页面偏移
      var position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28;
      var imgHeight = (592.28 / contentWidth) * contentHeight;
      var pageHeight = (contentWidth /imgWidth) * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
  

      var pdf = new jsPDF("", "pt", "a4");
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      // setTimeout(() => {
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "PNG", 0, 0, imgWidth, imgHeight);
          //  pdf.addImage(dataurl, 'JPEG', 0, 0);
        } else {
          // 分页
          while (leftHeight > 0) {
            pdf.addImage(pageData, "PNG", 0, position, imgWidth, imgHeight);

            leftHeight -= pageHeight;
            position -= 841.89;
            console.log(leftHeight, position, pageHeight);
            // position += 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save(reportData.title + "节能分析报告.pdf");
        loading.close();
        changeIsPrint.value.changeIsPrint(false);
        isPrint.value = false;
      // }, 20000);

      // contentHeight > contentWidth ? f = 'p' : f = 'l';
      // var pageData = canvas.toDataURL('image/png', 1.0);
      // _this.aaa = canvas.toDataURL();
      // var pdf = new jsPDF(f, 'px', [imgWidth, imgHeight]);
      // pdf.addImage(pageData, 'png', 0, 0, imgWidth, imgHeight);

      // copyDom.remove();
    });
    // loading.close();
  }, 2000);
  
};
// const print = () => {
//   console.log("print>>");
//   openFullScreen();
//   changeIsPrint.value.changeIsPrint(true);
//   let ST = document.documentElement.scrollTop || document.body.scrollTop;
//   let SL = document.documentElement.scrollLeft || document.body.scrollLeft;
//   window.pageYoffset = 0;
//   document.documentElement.scrollTop = 0;
//   document.documentElement.scrollLeft = 0;
//   document.body.scrollTop = 0;
//   document.body.scrollLeft = 0;
//   //获取滚动条的位置并赋值为0，因为是el-dialog弹框，并且内容较多出现了纵向的滚动条,截图出来的效果只能截取到视图窗口显示的部分,超出窗口部分则无法生成。所以先将滚动条置顶
//   const A4_WIDTH = 595.28;
//   const A4_HEIGHT = 841.89;
//   let domElement = document.getElementById("report"); // 获取DOM

//   let pageHeight = (domElement.scrollWidth / A4_WIDTH) * A4_HEIGHT;

//   // let pageHeight = 800;
//   let lableListID = domElement.querySelectorAll("p");
//   console.log("lableListID>>", lableListID);
//   console.log("lableListID>scrollWidth>", domElement.scrollWidth);
//   // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
//   for (let i = 0; i < lableListID.length; i++) {
//     let multiple = Math.ceil(
//       (lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight
//     );
//     console.log("lableListID>multiple>", multiple);
//     if (isSplit(lableListID, i, multiple * pageHeight)) {
//       console.log("进行分页.....",multiple * pageHeight);
//       let divParent = lableListID[i].parentNode; // 获取该div的父节点
//       let newNode = document.createElement("div");
//       newNode.className = "emptyDiv";
//       newNode.style.background = "#ffffff";
//       let _H = get_H(A4_HEIGHT, i, lableListID);
//       // multiple * pageHeight -
//       // (lableListID[i].offsetTop + lableListID[i].offsetHeight);
//       //留白
//       newNode.style.height = _H + "px";
//       newNode.style.width = "100%";
//       let next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
//       // 判断兄弟节点是否存在
//       if (next) {
//         // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
//         divParent.insertBefore(newNode, next);
//       } else {
//         // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
//         divParent.appendChild(newNode);
//       }
//     }
//   }
//   //接下来开始截图
//   nextTick(() => {
//     // nexttick可以保证要截图的部分全部执行完毕，具体用法自行百度...
//     html2canvas(domElement, {
//       allowTaint: true,
//       taintTest: false,
//       // x: domElement.getBoundingClientRect().left + 13, // 绘制的dom元素相对于视口的位置
//       // y: domElement.getBoundingClientRect().top,
//       // y: window.pageYOffset + 100,//滚动条高度修复
//       // width: domElement.offsetWidth - 15, // 因为多出的需要剪裁掉，
//       // height: domElement.offsetHeight,
//       // windowHeight:domElement.offsetHeight + 24 + 100,//获取y方向页面包含滚动条的高度，24和100为padding,margin
//       WindowWidth: document.body.scrollWidth,
//       windowHeight: document.body.scrollHeight,
//       backgroundColor: "#FFF", //一定要设置北京颜色，否则有的浏览器就会变花~，比如Edge
//       useCORS: true,
//       async: false,
//       scale: 2, // 图片模糊
//       // dpi: 350, //z
//     }).then((canvas) => {
//       const img = canvas.toDataURL("image/png", 1.0);
//       canvasSrc.value = img;
//       let pdf = new jsPdf("p", "mm", "a4"); //A4纸，纵向
//       let ctx = canvas.getContext("2d"),
//         a4w = 190,
//         a4h = 277, //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
//         imgHeight = Math.floor((a4h * canvas.width) / a4w), //按A4显示比例换算一页图像的像素高度
//         renderedHeight = 0;
//       console.log(
//         "renderedHeight>canvas.height>",
//         renderedHeight,
//         canvas.height
//       );
//       while (renderedHeight < canvas.height) {
//         let page = document.createElement("canvas");
//         page.width = canvas.width;
//         page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
//         //用getImageData剪裁指定区域，并画到前面创建的canvas对象中
//         page
//           .getContext("2d")
//           .putImageData(
//             ctx.getImageData(
//               0,
//               renderedHeight,
//               canvas.width,
//               Math.min(imgHeight, canvas.height - renderedHeight)
//             ),
//             0,
//             0
//           );
//         pdf.addImage(
//           page.toDataURL("image/jpeg", 0.2),
//           "JPEG",
//           10,
//           10,
//           a4w,
//           Math.min(a4h + 20, (a4w * page.height) / page.width)
//         ); //添加图像到页面，保留10mm边距
//         renderedHeight += imgHeight;
//         console.log(
//           "renderedHeight>canvas.height>",
//           renderedHeight,
//           canvas.height
//         );
//         if (renderedHeight < canvas.height) pdf.addPage(); //如果后面还有内容，添加一个空页
//       }
//       pdf.save(reportData.title + ".pdf");
//       changeIsPrint.value.changeIsPrint(false);
//       //恢复原始title
//       window.document.getElementsByTagName("title")[0].innerHTML =
//         reportData.title;
//       isPrint.value = false;
//       // if (loading != NULL) {
//         loading.close();
//       // }

//       // location.reload();
//       // let uploadPdf = pdf.output("datauristring"); //转成Base64
//       // let arr = uploadPdf.split(",");
//       // let mime = arr[0].match(/:(.*?);/)[1];
//       // let suffix = mime.split("/")[1];
//       // let bstr = window.atob(arr[1]); //自行百度新大陆
//       // let n = bstr.length;
//       // let u8arr = new Uint8Array(n);
//       // let filename = "temp_img";
//       // while (n--) {
//       //   u8arr[n] = bstr.charCodeAt(n);
//       // }
//       // let file = new File([u8arr], `${filename}.${suffix}`, { type: mime });
//       // let formdata = new FormData();
//       // formdata.append("uploadfile", file);
//       // console.log("formdata",file)
//       // let params = { project: this.pid, courseid: this.id };
//       // this.$axios({
//       //   url: `vueindex/UploadWord/uploadpdf`,
//       //   method: "post",
//       //   headers: { "Content-Type": "multipart/form-data " },
//       //   data: formdata,
//       //   params: params,
//       // }).then((res) => {
//       //   if (res.data.code == 0) {
//       //     //上传成功，刷新页面，打完收工
//       //   }
//       // });
//     });
//   });
// };
</script>

<style scoped lang="scss" >
#report {
  padding: 30px;
  background: white;
  .deviceSurvey {
    display: flex;
    flex-wrap: wrap;
    & > div {
      display: flex;
      width: 170px;
    }
  }
  :deep(.el-textarea__inner) {
    color: black !important;
    &::placeholder {
      color: gray;
    }
  }
}
</style>