<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 14:19:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-09 15:43:58
-->
<template>
  <div>
    <contentComt title="气象时序图">
      <div class="chartClass">
        <div style="margin-top:20px;"
             v-for="(item,index) in 5"
             :key="index">
          <div v-if="index == 0"
               style="text-align: right;display: flex; width: 100%;justify-content: right;position: relative;right: 10px;top: 20px;">
            <div>
              <i style="color: rgba(39,226,179,0.4000);font-size:12px"
                 class="iconfont icon-jiantou"></i>
              <span style="color:#666666;font-size:14px;margin-left:4px;">微风</span>
            </div>
            <div style="margin-left:20px;">
              <i style="color:  rgba(247,193,89,0.4000);font-size:12px"
                 class="iconfont icon-jiantou"></i>
              <span style="color:#666666;font-size:14px;margin-left:4px;">中风</span>
            </div>
            <div style="margin-left:20px;">
              <i style="color: rgba(238,75,153,0.4000);font-size:12px"
                 class="iconfont icon-jiantou"></i>
              <span style="color:#666666;font-size:14px;margin-left:4px;">大风</span>
            </div>
          </div>
          <div style="width:100%;height:100%"
               :ref="weatherChatDom"></div>
        </div>
      </div>
    </contentComt>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, onMounted, nextTick } from "vue-demi";
import contentComt from "./content.vue";
import * as echarts from "echarts";

const { weather } = defineProps(["weather"]);
console.log(weather," ------ ")
// 默认图表图后期会更换
const chartData = ref({
  x: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
  y: [820, 932, 901, 934, 1290, 1330, 1320],
  name: "土壤湿度(%RH)",
});
// 获取所有图表dom
const weatherChat = ref<Element | []>([]);
const weatherChatDom = (el: Element) => {
  if (el) weatherChat.value.push(el);
};
interface Idata {
  x: Array<any>;
  y: Array<any>;
  name: string;
  unit: string;
}

onMounted(() => {
  initChart(
    {
      x: weather[0].x,
      y: weather[0].y,
      name: weather[0].name + weather[0].unit,
      unit: weather[0].unit,
    },
    1,
    echarts.init(weatherChat.value[1])
  );
  initChart(
    {
      x: weather[1].x,
      y: weather[1].y,
      name: weather[1].name + weather[1].unit,
      unit: weather[1].unit,
    },
    2,
    echarts.init(weatherChat.value[2])
  );
  initChart(
    {
      x: weather[2].x,
      y: weather[2].y,
      name: weather[2].name + weather[2].unit,
      unit: weather[2].unit,
    },
    3,
    echarts.init(weatherChat.value[3])
  );
  initChart(
    {
      x: weather[3].x,
      y: weather[3].y,
      name: weather[3].name + weather[3].unit,
      unit: weather[3].unit,
    },
    4,
    echarts.init(weatherChat.value[4])
  );
  // 初始化风速、风向图表
  initwindDirectionChart();
});

const initChart = (data: Idata, type: number, chartDom: echarts.ECharts) => {
  let commonOptions: echarts.EChartsOption = {
    color:
      type == 1
        ? "#67c0ff"
        : type == 2
        ? "#cd6dff"
        : type == 3
        ? "#87f5ff"
        : "#ff94c2",
    title: {
      text: data.name,
      left: "20",
      textStyle: {
        fontSize: 16,
        color: "#333333",
      },
    },
    //   <p><span>time:</span>${params[0].axisValue}</p>
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 149, 255, 0.8)", //通过设置rgba调节背景颜色与透明度
      formatter: function (
        params: echarts.TooltipComponentFormatterCallbackParams
      ) {
        let str = `
                <div style="color:white">
        <p><span>${type == 1?"降雨量":type == 2?"温度":type == 3?"湿度":type == 4?"气压":"数据"}:</span>${params[0].data}${data.unit}</p>
          <p><span>时间:</span>${params[0].axisValue}</p>
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
          color:
            type == 1
              ? "#cceaff"
              : type == 2
              ? "#efcfff"
              : type == 3
              ? "#ccfbff"
              : "#ffe2ef",
        },
      },
    ],
  };
  nextTick(() => {
    chartDom.setOption(commonOptions);
  });
};
//风向单位转化
const getWindDirection = (dirValue :any,fwCount :any) =>{
  let result = "";
  if (fwCount == 16)
            {
                if (dirValue == 360)
                {
                    result = "不定向风";
                }
                else if (348.75 <= dirValue && dirValue < 360)
                {
                    result = "东";
                }
                else if (0 <= dirValue && dirValue <= 11.25)
                {
                    result = "东";
                }
                else if (11.25 < dirValue && dirValue <= 33.75)
                {
                    result = "东北东";
                }
                else if (33.75 < dirValue && dirValue <= 56.25)
                {
                    result = "东北";
                }
                else if (56.25 < dirValue && dirValue <= 78.75)
                {
                    result = "东北北";
                }
                else if (78.75 < dirValue && dirValue <= 101.25)
                {
                    result = "北";
                }
                else if (101.25 < dirValue && dirValue <= 123.75)
                {
                    result = "西北北";
                }
                else if (123.75 < dirValue && dirValue <= 146.25)
                {
                    result = "西北";
                }
                else if (146.25 < dirValue && dirValue <= 168.75)
                {
                    result = "西北西";
                }
                else if (168.75 < dirValue && dirValue <= 191.25)
                {
                    result = "西";
                }
                else if (191.25 < dirValue && dirValue <= 213.75)
                {
                    result = "西西南";
                }
                else if (213.75 < dirValue && dirValue <= 236.25)
                {
                    result = "西南";
                }
                else if (236.25 < dirValue && dirValue <= 258.75)
                {
                    result = "西南南";
                }
                else if (258.75 < dirValue && dirValue <= 281.25)
                {
                    result = "南";
                }
                else if (281.25 < dirValue && dirValue <= 303.75)
                {
                    result = "东南南";
                }
                else if (303.75 < dirValue && dirValue <= 326.25)
                {
                    result = "东南";
                }
                else if (326.25 < dirValue && dirValue < 348.75)
                {
                    result = "东南东";
                }
            }
            else
            {
                if (dirValue == 360)
                {
                    result = "不定向风";
                }
                else if (360 - 22.5 <= dirValue || dirValue <= 22.5)
                {
                    result = "东";
                }

                else if (22.5 < dirValue && dirValue <= 45 + 22.5)
                {
                    result = "东北";
                }
                else if (90 - 22.5 < dirValue && dirValue <= 90 + 22.5)
                {
                    result = "北";
                }

                else if (135 - 22.5 < dirValue && dirValue <= 135 + 22.5)
                {
                    result ="西北";
                }
                else if (180 - 22.5 < dirValue && dirValue <= 180 + 22.5)
                {
                    result = "西";
                }

                else if (225 - 22.5 < dirValue && dirValue <= 225 + 22.5)
                {
                    result = "西南";
                }
                else if (270 - 22.5 < dirValue && dirValue <= 270 + 22.5)
                {
                    result = "南";
                }
                else if (315 - 22.5 < dirValue && dirValue <= 315 + 22.5)
                {
                    result = "东南";
                }

            }
            return result+dirValue+"°";

}
//获取图表偏移数值
const getoffsetChart = (value:any) =>{
  return (6.3*value)/360
}
// 初始化风速风向图表;
const initwindDirectionChart = () => {
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
  const datay = weather[4].weatherSpeed.map((item: any) => {
    return {
      value: item,
    };
  });
      console.log("--datay>>",datay);
  for (let n = 0; n < datay.length; n++) {

    datay[n].newOffset = (Math.abs(weather[4].weatherDirection[n]) * 30) / 90;
    datay[n].direction = weather[4].weatherDirection[n];
    if (datay[n].newOffset < 0) {
      datay[n].newOffset =
        Math.abs(weather[4].weatherDirection[n]) + 3.14;
    }
  }
  let limit = weather[4].limite;
  const renderArrow = function (param, api) {
    const point = api.coord([api.value(dims.time), api.value(dims.windSpeed)]);
    let value = datay[param.dataIndexInside].value;
    let strokeColor =
      value < limit[0]
        ? "#5de9c6"
        : value >= limit[0] && value < limit[1]
        ? "#fad693"
        : "#f274b0";
    let fillColor =
      value < limit[0]
        ? "#a9f3e1"
        : value >= limit[0] && value < limit[1]
        ? "#fce4b8"
        : "#f8b7d6";
    return {
      type: "path",
      shape: {
        pathData: "M31 16l-15-15v9h-26v12h26v9z",
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize,
      },
      rotation: getoffsetChart(datay[param.dataIndex].direction),
      position: point,
      style: api.style({
        stroke: strokeColor,
        fill: fillColor,
        lineWidth: 1,
      }),
    };
  };
  let windDirectionOption: echarts.EChartsOption = {
    title: {
      text: weather[4].name + weather[4].unit,
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
        console.log("--params>>",params[0].data.offset);
        return `<div style="color:white">
        <p>风速：${params[0].data.value}m/s</p>
        <p>风向：${getWindDirection(params[0].data.direction,8)}</p>
         <p>时间：${params[0].axisValue}</p>
        </div>`;
      },
    },
    grid: {
      left: "4%",
      right: "3.8%",
    },
    legend: {
      data: [1, 2, 3, 5, 4, 6, 7],
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
      data: weather[4].x,
      splitLine: {
        lineStyle: {
          color: "#333333",
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
  echarts.init(weatherChat.value[0]).setOption(windDirectionOption);
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