<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 14:19:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-09 15:05:36
-->
<template>
  <div>
    <contentComt title="北斗设备时序图">
      <div class="chartClass">
        <div style="margin-top: 20px" v-for="(item, index) in 2" :key="index">
          <div style="height: 100%; width: 100%" :ref="digDipperDom"></div>
        </div>
      </div>
    </contentComt>
    <!-- 土壤湿度时序图 -->
    <contentComt title="土壤湿度时序图" v-show="false">
      <div class="chartClass">
        <div style="margin-top: 20px">
          <div ref="soilMoisture" style="height: 100%; width: 100%"></div>
        </div>
      </div>
    </contentComt>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, onMounted, nextTick, defineProps } from "vue-demi";
import contentComt from "./content.vue";
import * as echarts from "echarts";
const { chartObj, Soil } = defineProps(["chartObj", "Soil"]);
const digRefList = ref<Element | []>([]);
const digDipperDom = (el: Element) => {
  if (el) digRefList.value.push(el);
};

// 土壤湿度时序图
const soilMoisture = ref<Element | null>(null);
interface Idata {
  x: Array;
  y: Array;
  name: string;
  unit: string;
}
onMounted(() => {
  initChart(
    {
      x: chartObj[0].x,
      y: chartObj[0].y,
      name: chartObj[0].name + chartObj[0].unit,
      unit: chartObj[0].unit,
    },
    1,
    echarts.init(digRefList.value[0])
  );
  initChart(
    {
      x: chartObj[1].x,
      y: chartObj[1].y,
      name: chartObj[1].name + chartObj[1].unit,
      unit: chartObj[1].unit,
    },
    2,
    echarts.init(digRefList.value[1])
  );
  initChart(
    // { name: Soil.name + Soil.unit, x: Soil.x, y: Soil.y, unit: Soil.unit },
    { name: "" },
    3,
    echarts.init(soilMoisture.value)
  );
});
const initChart = (data: Idata, type: number, chartDom: echarts.ECharts) => {
  let commonOptions: echarts.EChartsOption = {
    color: type == 2 ? "#7cc9ff" : type == 1 ? "#ff98c4" : "#c657ff",
    title: {
      text: data.name,
      left: "20",
      textStyle: {
        fontSize: 16,
        color: "#333333",
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: { color: "#333333", type: "dashed" },
      },
      type: "category",
      boundaryGap: false,
      data: data.x,
      axisLabel: {
        borderType: "dashed",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
      formatter: function (
        params: echarts.TooltipComponentFormatterCallbackParams
      ) {
        console.log("params>>type>>", type);
        let str = `
                <div style="color:white">
                <p><span>${
                  type == 1
                    ? "水平位移"
                    : type == 2
                    ? "沉降"
                    : type == 3
                    ? "土壤检测"
                    : "数据"
                }:</span>${params[0].data}${data.unit}</p>
                <p><span>时间:</span>${params[0].axisValue}</p>
                </div>
                `;
        return str;
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: { color: "#333333", type: "dashed" },
      },
      splitLine: {
        lineStyle: {
          type: "dashed", //虚线
        },
        show: true, //隐藏
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        data: data.y,
        type: "line",
        symbol: "none",
        smooth: true,
        areaStyle: {
          color: type == 2 ? "#cceaff" : type == 1 ? "#ffe2ef" : "#efcfff",
        },
      },
    ],
  };
  nextTick(() => {
    chartDom.setOption(commonOptions);
  });
};
</script>

<style scoped lang="scss">
.chartClass {
  & > div {
    border: 1px solid #dddddd;
    padding: 20px;
    height: 270px;
  }
}
</style>