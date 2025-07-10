<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 14:19:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-04 14:44:18
-->
<template>
  <div>
    <contentComt title="数据对比">
      <div class="chartClass">
        <div v-for="(item, index) in graph2D" :key="index">
          <div>{{ item.name }}</div>
          <div style="width: 100%; height: 100%" :ref="graphDom"></div>
        </div>
      </div>
    </contentComt>
  </div>
</template>

<script setup lang="ts">
import contentComt from "./content.vue";
import { defineProps, ref, Ref, onMounted, nextTick, Component } from "vue";
const { graph2D } = defineProps(["graph2D"]);
import * as echarts from "echarts";
import "echarts-gl";
import { useStore } from "vuex";
const $store = useStore();
const dataContrastDom: Ref<Element[]> = ref([]);
const graphDom = (el: Element) => {
  dataContrastDom.value.push(el);
};
onMounted(() => {
  if (graph2D) initChart();
});
interface IchartInter {
  xnew: number[];
  ynew: number[];
  znew: number[];
  maxY: number;
  maxX: number;
  zpos: number[];
  lineObj: object[];
}
const initChart = () => {
  dataContrastDom.value.forEach((el, index) => {
    myChartBridgeFn(el, graph2D[index].data);
  });
};

//  沉降及偏移
function myChartBridgeFn(dom, itemValue) {
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(dom);
    console.log(myChart, 88888);
    let datay = itemValue.yArray;
    for (let n in datay) {
      datay[n].offsetnew = (Math.abs(datay[n].offset) * 30) / 90;
      datay[n].value = datay[n].settlement;
      if (datay[n].offset < 0) {
        datay[n].offsetnew = datay[n].offset + 3.141592653589793;
      }
    }
    const dims = {
      time: 0,
      windSpeed: 1,
      R: 2,
      waveHeight: 3,
      weatherIcon: 2,
      minTemp: 3,
      maxTemp: 4,
    };
    const arrowSize = 6;
    const renderArrow = function (param, api) {
      const point = api.coord([
        api.value(dims.time),
        api.value(dims.windSpeed),
      ]);
      return {
        type: "path",
        shape: {
          pathData: "M31 16l-15-15v9h-26v12h26v9z",
          x: -arrowSize / 2,
          y: -arrowSize / 2,
          width: arrowSize,
          height: arrowSize,
        },
        rotation: datay[param.dataIndex].offsetnew,
        position: point,
        style: api.style({
          stroke: "#60E5FD",
          fill: "#15DAAA",
          lineWidth: 1,
        }),
      };
    };
    let option = {
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
          var color = "rgba(96, 229, 253, 1)"; //图例颜色
          console.log(color, 896);
          var htmlStr = "<div>";
          htmlStr +=
            '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
            color +
            ';"></span>';
          // htmlStr += params[0].data.newTime + "<br>";
          // htmlStr += "编号：" + params[0].data.device_name + "<br>";
          let py = parseFloat(params[0].data.offset);
          htmlStr += "偏移：" + py.toFixed(2) + "°" + "<br>";
          let hd = parseFloat(params[0].data.hDisplacement);
          htmlStr += "水平位移：" + hd.toFixed(2) + "mm" + "<br>";
          let aab = parseFloat(params[0].data.settlement);
          htmlStr += "沉降值：" + aab.toFixed(2) + "mm";
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      grid: {
        top: "10%",
        bottom: "50px",
        containLabel: true,
      },

      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: itemValue.xArray,
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
          nameLocation: "middle",
          axisLabel: {
            color: "rgba(0, 0, 0, 1)",
            opacity: 1,
          },
          //x轴线
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 0, 0, 0.2)",
            },
          },
        },
      ],
      yAxis: [
        {
          nameLocation: "middle",
          splitNumber: 5,
          axisLabel: {
            textStyle: {
              color: "rgba(0, 0, 0, 1)",
            },
          },
          nameTextStyle: {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
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
              color: "rgba(0, 0, 0, 0.2)",
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

        {
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],

      // dataZoom: [
      //   {
      //     type: "inside",
      //     xAxisIndex: 0,
      //     minSpan: 5,
      //   },
      //   {
      //     type: "slider",
      //     xAxisIndex: 0,
      //     minSpan: 5,
      //     bottom: 60,
      //   },
      // ],
      series: [
        {
          type: "custom",
          renderItem: renderArrow,
          encode: {
            x: dims.time,
            y: dims.windSpeed,
          },
          data: datay,
          z: 10,
        },
      ],
    };

    myChart.setOption(option);
    let canvasList = $store.getters["Common/getCanvasList"];
    canvasList.push(myChart);
    store.commit("SET_STATE_VALUE", {
        name: canvasList,
        value: canvasList,
      });
    window.onresize = function () {
      myChart.resize();
    };
  });
}


</script>

<style scoped lang="scss">
.chartClass {
  display: flex;
  justify-content: space-between;
  & > div {
    border: 1px solid #dddddd;
    padding: 20px 2px 2px 2px;
    height: 360px;
    width: 360px;
    p {
      text-align: center;
      color: #333333;
      font-size: 14px;
    }
  }
}
</style>