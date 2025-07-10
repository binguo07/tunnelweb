<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 14:19:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-09 15:05:44
-->
<template>
  <div>
    <contentComt :title="chartName" v-if="TUNNELID==IS_CDN_ID" >
      <div class="chartClass">
        <div style="margin-top: 20px"
             v-for="(item, index) in 3"
             :key="index">
          <div :ref="chartList"
               style="width: 100%; height: 100%"></div>
        </div>
      </div>
    </contentComt>
    <contentComt title="变化最大点的时序图" v-else >
      <span>{{chartName}}</span>
      <div class="chartClass">
        <div style="margin-top: 20px"
             v-for="(item, index) in 2"
             :key="index">
          <div :ref="chartList"
               style="width: 100%; height: 100%"></div>
        </div>
      </div>
    </contentComt>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, onMounted, nextTick } from "vue-demi";
import contentComt from "./content.vue";
import { PROJECTID, TUNNELID } from "@/utils/enumeration";
import * as echarts from "echarts";
const chars: Ref = ref<Element | []>([]);
type EChartsOption = echarts.EChartsOption;
const { chartObj ,chartName} = defineProps(["chartObj","chartName"]);
const IS_CDN_ID = 1;
// const { chartName } = defineProps(["chartName"]);

const chartList = (el: Element) => {
  if (el) chars.value.push(el);
};
onMounted(() => {
  console.log("chartObj>>",chartObj)
  initChart();
});
const initChart = () => {
  // 设备倾角
  const deviceAngle = echarts.init(chars.value[0]);
  
  if (!chartObj) return;
  let deviceAngleOption: EChartsOption = {
    color: ["#06E8F2", "#0095FF"],
    title: {
      text: chartObj[0].name + chartObj[0].unit,
      left: "20",
      textStyle: {
        fontSize: 16,
        color: "#333333",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
      formatter: function (
        params: echarts.TooltipComponentFormatterCallbackParams
      ) {
        let str =
          params.length == 2
            ? `<div style="color:white">
        <div><span>最小:</span>${params[0].data}°</div>
        <div><span>最大:</span>${params[1].data}°</div>
          <div><span>时间:</span>${params[0].axisValue}</div>
                </div>`
            : `
                <div style="color:white">
        <div><span>倾角:</span>${params[0].data}°</div>
          <div><span>时间:</span>${params[0].axisValue}</div>
                </div>
                `;
        return str;
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: { color: "#333333", type: "dashed" },
      },
      type: "category",
      boundaryGap: false,
      data: chartObj[0].x,
      axisLabel: {
        borderType: "dashed",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
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
    legend: {
      data: [
        { name: "倾角", icon: "roundRect" },
        // { name: "max", icon: "roundRect" },
      ],
      width: 60,
      backgroundColor: "rgba(44,176,233,0.01)", //标题背景色
      // borderColor: "#2CB0E9", //边框颜色
      borderWidth: 1,
      padding: 6,
      right: 20,
      type: "plain",
      textStyle: {
        //图例文字的样式
        color: "gray",
        fontSize: 16,
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
        name: "倾角",
        data: chartObj[0].y,
        type: "line",
        symbol: "none",
        smooth: true,
        areaStyle: {
          color: "#cdfafc",
        },
        itemStyle: {
          normal: {
            borderWidth: 1, //拐点边框大小
          },
        },
      },
      // {
      //   name: "max",
      //   data: chartObj[0].y,
      //   type: "line",
      //   symbol: "none",

      //   smooth: true,
      //   areaStyle: {
      //     color: "#cceaff",
      //   },
      // },
    ],
  };
  // 设备位移(mm)
  const deviceSettling = echarts.init(chars.value[1]);
  const dims = {
    time: 0,
    windSpeed: 1,
    R: 2,
    waveHeight: 3,
    weatherIcon: 2,
    minTemp: 3,
    maxTemp: 4,
  };
  const arrowSize = 15;
  const datay = chartObj[1].y.map((item) => {
    return (item = { value: item });
  });
  for (let n = 0; n < datay.length; n++) {
    datay[n].offset = (Math.abs(datay[n].value) * 30) / 90;
    if (datay[n].offset < 0) {
      datay[n].offset = datay[n].value + 3.141592653589793;
    }
  }
  const renderArrow = function (param, api) {
    const point = api.coord([api.value(dims.time), api.value(dims.windSpeed)]);
    return {
      type: "path",
      shape: {
        // pathData: "M31 16l-15-15v9h-26v12h26v9z",
        pathData: "M 300,300 A 100,100 0 1 1 300,299 Z",
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize,
      },
      rotation: datay[param.dataIndex].offset,
      position: point,
      style: api.style({
        stroke: "#60E5FD",
        fill: "#15DAAA",
        lineWidth: 1,
      }),
    };
  };
  let deviceSettlingOption: EChartsOption = {
    title: {
      text: chartObj[1].name + chartObj[1].unit,
      left: "20",
      textStyle: {
        fontSize: 16,
        color: "#333333",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
      formatter: function (params) {
        console.log(params, " ---- ");
        return `<div style="color:white">
        <div>水平位移:${params[0].data.value}mm</div>
        </div>`;
      },
    },
    grid: {
      left: "4%",
      right: "3.8%",
    },
    legend: {
      // data: chartObj[1],
      padding: [0, 150, 0, 0],
      textStyle: {
        color: "#ccc",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        //  rotate: -45,//倾斜度 -90 至 90 默认为0
        textStyle: {
          color: "#333333", //坐标值得具体的颜色
        },
      },
      axisLine: {
        lineStyle: { color: "#333333", type: "dashed" },
      },
      data: chartObj[1].x,
      splitLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    yAxis: [
      {
        name: "",
        nameLocation: "middle",
        // nameGap: 35,
        // max: 40,
        // min: -40,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            color: "rgb(128, 128, 128,0)",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#333333",
          },
        },
        splitLine: {
          //  show: false,
          lineStyle: {
            color: "#CCCCCC",
            type: "dashed", // y轴分割线类型
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
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        minSpan: 5,
        // start: 80,
        // end: 100,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        minSpan: 5,
        bottom: 10,
      },
    ],
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

    // 设备沉降
  const deviceSettling2 = echarts.init(chars.value[2]);
  const dims2 = {
    time: 0,
    windSpeed: 1,
    R: 2,
    waveHeight: 3,
    weatherIcon: 2,
    minTemp: 3,
    maxTemp: 4,
  };
  const arrowSize2 = 15;
  const datay2 = chartObj[2].y.map((item) => {
    return (item = { value: item });
  });
  for (let n = 0; n < datay2.length; n++) {
    datay2[n].offset = (Math.abs(datay2[n].value) * 30) / 90;
    if (datay2[n].offset < 0) {
      datay2[n].offset = datay2[n].value + 3.141592653589793;
    }
  }
  const renderArrow2 = function (param, api) {
    const point = api.coord([api.value(dims2.time), api.value(dims2.windSpeed)]);
    return {
      type: "path",
      shape: {
        // pathData: "M 300,300 A 100,100 0 1 1 300,299 Z",
        pathData: "M 300,300 A 100,100 0 1 1 300,299 Z",
        x: -arrowSize2 / 2,
        y: -arrowSize2 / 2,
        width: arrowSize,
        height: arrowSize,
      },
      rotation: datay2[param.dataIndex].offset,
      position: point,
      style: api.style({
        stroke: "#60E5FD",
        fill: "#15DAAA",
        lineWidth: 1,
      }),
    };
  };
  let deviceSettling2Option: EChartsOption = {
    title: {
      text: chartObj[2].name + chartObj[2].unit,
      left: "20",
      textStyle: {
        fontSize: 16,
        color: "#333333",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
      formatter: function (params) {
        console.log(params, " ---- ");
        return `<div style="color:white">
        <div>沉降值:${params[0].data.offset}mm</div>
        </div>`;
      },
    },
    grid: {
      left: "4%",
      right: "3.8%",
    },
    legend: {
      // data: chartObj[1],
      padding: [0, 150, 0, 0],
      textStyle: {
        color: "#ccc",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        //  rotate: -45,//倾斜度 -90 至 90 默认为0
        textStyle: {
          color: "#333333", //坐标值得具体的颜色
        },
      },
      axisLine: {
        lineStyle: { color: "#333333", type: "dashed" },
      },
      data: chartObj[1].x,
      splitLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    yAxis: [
      {
        name: "",
        nameLocation: "middle",
        // nameGap: 35,
        // max: 40,
        // min: -40,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            color: "rgb(128, 128, 128,0)",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#333333",
          },
        },
        splitLine: {
          //  show: false,
          lineStyle: {
            color: "#CCCCCC",
            type: "dashed", // y轴分割线类型
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
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        minSpan: 5,
        // start: 80,
        // end: 100,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        minSpan: 5,
        bottom: 10,
      },
    ],
    series: [
      {
        type: "custom",
        renderItem: renderArrow2,
        encode: {
          x: dims2.time,
          y: dims2.windSpeed,
        },
        data: datay2,
        z: 10,
      },
    ],
  };

  // 设备剩余电量(%)
  // const deviceSoc = echarts.init(chars.value[2]);
  // let deviceSocOption: EChartsOption = {
  //   color: ["#06E8F2", "#0095FF"],
  //   title: {
  //     text: chartObj[1].name + chartObj[1].unit,
  //     left: "20",
  //     textStyle: {
  //       fontSize: 16,
  //       color: "#333333",
  //     },
  //   },
  //   legend: {
  //     data: [
  //       { name: "min", icon: "roundRect" },
  //       { name: "max", icon: "roundRect" },
  //     ],
  //     width: 60,
  //     backgroundColor: "rgba(44,176,233,0.01)", //标题背景色
  //     // borderColor: "#2CB0E9", //边框颜色
  //     borderWidth: 1,
  //     padding: 6,
  //     right: 20,
  //     type: "plain",
  //     textStyle: {
  //       //图例文字的样式
  //       color: "gray",
  //       fontSize: 16,
  //     },
  //   },
  //   tooltip: {
  //     trigger: "axis",
  //     backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
  //     formatter: function (params) {
  //       let str =
  //         params.length == 2
  //           ? `<div style="color:white">
  //       <div><span>最大:</span>${params[0].data}kwh</div>
  //       <div><span>最小:</span>${params[1].data}kwh</div>
  //       <div><span>时间:</span>${params[0].axisValue}</div>
  //             </div>`
  //           : `
  //               <div style="color:white">
  //       <div><span>数据:</span>${params[0].data}kwh</div>
  //        <div><span>时间:</span>${params[0].axisValue}</div>
  //               </div>
  //               `;
  //       return str;
  //     },
  //   },
  //   xAxis: {
  //     axisLine: {
  //       lineStyle: { color: "#333333", type: "dashed" },
  //     },
  //     type: "category",
  //     boundaryGap: false,
  //     data: chartObj[1].x,
  //     axisLabel: {
  //       borderType: "dashed",
  //     },
  //     splitLine: {
  //       lineStyle: {
  //         type: "dashed",
  //       },
  //     },
  //   },
  //   yAxis: {
  //     type: "value",
  //     axisLine: {
  //       lineStyle: { color: "#333333", type: "dashed", show: true },
  //     },
  //     splitLine: {
  //       lineStyle: {
  //         type: "dashed", //虚线
  //       },
  //       show: true, //隐藏
  //     },
  //   },
  //   grid: {
  //     left: "3%",
  //     right: "4%",
  //     bottom: "3%",
  //     containLabel: true,
  //   },
  //   series: [
  //     {
  //       data: chartObj[1].minY,
  //       type: "bar",
  //       name: "min",
  //       barWidth: "10%",
  //       itemStyle: {
  //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //           { offset: 0, color: "#0095FF" },
  //           { offset: 1, color: "rgba(0,149,255,0.5)" },
  //         ]),
  //       },
  //       areaStyle: {
  //         color: "#cdfafc",
  //       },
  //     },
  //     {
  //       data: chartObj[1].maxY,
  //       type: "bar",
  //       barWidth: "10%",
  //       name: "max",
  //       itemStyle: {
  //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //           { offset: 0, color: "#06E8F2" },
  //           { offset: 1, color: "rgba(0,149,255,0.5)" },
  //         ]),
  //       },
  //       areaStyle: {
  //         color: "#cdfafc",
  //       },
  //     },
  //   ],
  // };
  nextTick(() => {
    deviceAngle.setOption(deviceAngleOption);
    deviceSettling.setOption(deviceSettlingOption);
    deviceSettling2.setOption(deviceSettling2Option);
    // deviceSoc.setOption(deviceSocOption);
  });
};
</script>

<style scoped lang="scss">
.chartClass {
  & > div {
    border: 1px solid #dddddd;
    padding: 10px 0px;
    height: 270px;
  }
}
</style>
