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
        <div v-for="(item, index) in graph3D" :key="index">
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
const { graph3D } = defineProps(["graph3D"]);
import * as echarts from "echarts";
import "echarts-gl";
const dataContrastDom: Ref<Element[]> = ref([]);
const graphDom = (el: Element) => {
  dataContrastDom.value.push(el);
};
onMounted(() => {
  if (graph3D) initChart();
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
  console.log("graph3D>>", graph3D);
  dataContrastDom.value.forEach((el, index) => {
    let chartOBj: IchartInter = {
      maxY: graph3D[index].maxY,
      maxX: graph3D[index].maxX,
      xnew: [],
      ynew: [],
      znew: [],
      zpos: [],
      lineObj: [],
    };
    console.log("graph3D>index>", graph3D[index].data);
    graph3D[index].data.forEach((datas: any) => {
      chartOBj.ynew.push(datas.y - 0);
      chartOBj.xnew.push(datas.x - 0);
      chartOBj.znew.push(datas.z - 0);
      chartOBj.zpos.push(datas.y - 0);
      chartOBj.lineObj.push(datas);
    });
    myChartBridgeFn(echarts.init(el as HTMLElement), chartOBj);
  });
};

//  沉降及偏移
function myChartBridgeFn(myChart: echarts.ECharts, itemValue: any) {
  nextTick(() => {
    let datanew = itemValue;
    itemValue.xnew.forEach((item: number, index: number) => {
      if (datanew["znew"][index] == 0) {
        datanew["zpos"][index] = datanew["ynew"][index] + 0.05;
      } else {
        datanew["zpos"][index] =
          datanew["ynew"][index] + datanew["znew"][index] + 0.05;
      }
    });

    let dataDian: any[] = [];
    //回调后处理
    console.log("itemValue.xnew>>", datanew);
    itemValue.xnew.forEach((item: number, index: number) => {
      let iniarr = [];
      iniarr.push(datanew["xnew"][index]);
      iniarr.push(datanew["ynew"][index]);
      iniarr.push(datanew["zpos"][index]);
      dataDian.push(iniarr);
    });
    myChart.setOption({
      // title: {
      //   id: myChart.id,
      // },
      tooltip: {
        backgroundColor: "rgba(0, 149, 255, 0.8)", // 背景色
        borderColor: "rgba(0, 149, 255, 0.8)",
        textStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        formatter: function (params: any) {
          let str: string = "";
          dataDian.forEach((item, index) => {
            if (
              dataDian[index][0] == params.value[0] &&
              dataDian[index][1] == params.value[1] &&
              dataDian[index][2] == params.value[2]
            ) {
              let lineObj = itemValue.lineObj[index];
              console.log("lineObj>>>", lineObj);
              if (lineObj.settlement) {
                str = `
              <div>
              <p>设备名称：${lineObj.name?lineObj.name:""}</p>
              <p>倾角：${lineObj.offset?lineObj.offset:"0"} °</p>
              <p>位移：${lineObj.hDisplacement?lineObj.hDisplacement:"0"} mm</p>
              <p>沉降值：${lineObj.settlement?lineObj.settlement:"0"} mm</p>
              <p>剩余电量：${lineObj.batteryVoltage?lineObj.batteryVoltage:"0"}%</p>
              </div>
              `;
              } else {
                str = `
              <div>
              <p>设备名称：${lineObj.name?lineObj.name:""}</p>
              <p>倾角：${lineObj.offset?lineObj.offset:"0"} °</p>
              <p>位移：${lineObj.hDisplacement?lineObj.hDisplacement:"0"} mm</p>
              <p>沉降值：${lineObj.settlement?lineObj.settlement:"0"} mm</p>
              <p>剩余电量：${lineObj.batteryVoltage?lineObj.batteryVoltage:"0"}%</p>
              </div>
              `;
              }
              // str =(lineObj.newTime ? lineObj.newTime + "<br/>" : "") +
              //     (lineObj.device_name
              //       ? "设备名称：" + lineObj.device_name + "<br/>"
              //       : "") +
              //     (lineObj.offset
              //       ? "倾角：" + lineObj.offset + "°" + "<br/>"
              //       : "") +
              //     (lineObj.hDisplacement
              //       ? "位移：" + lineObj.hDisplacement + "mm" + "<br/>"
              //       : "") +
              //     (lineObj.settlement
              //       ? "沉降值：" + lineObj.settlement + "mm" + "<br/>"
              //       : "") +
              //     (lineObj.value
              //       ? "剩余电量：" + lineObj.value + "%" + "<br/>"
              //       : "");
            }
          });
          return str;

          // let [x, y, z] = params.value;
          // let arr = x.toString() + "," + y.toString();
          // let res = ""; //返回数据
          // if (datanew && datanew.length > 0) {
          //   for (var i = 0; i < datanew.length; i++) {
          //     let posStr =
          //       datanew[i].xnew.toString() + "," + datanew[i].ynew.toString();
          //     if (arr === posStr) {
          //       res +=
          //         datanew[i].newTime +
          //         "<br/>" +
          //         "桩号：" +
          //         datanew[i].device_location +
          //         "<br/>" +
          //         "倾角：" +
          //         datanew[i].offset +
          //         "°" +
          //         "<br/>" +
          //         "位移：" +
          //         datanew[i].hDisplacement +
          //         "mm" +
          //         "<br/>" +
          //         "沉降值：" +
          //         datanew[i].znew +
          //         "mm" +
          //         "<br/>" +
          //         "剩余电量：" +
          //         datanew[i].value +
          //         "%" +
          //         "<br/>";
          //       return res;
          //     }
          //   }
          // }
        },
      },
      backgroundColor: {},
      // visualMap: {
      //   show: false,
      //   dimension: 2,
      //   min: 0,
      //   max:100,
      //   inRange: {
      //     color: ["#50c7fc",],
      //   },
      // },
      xAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      yAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      zAxis3D: {
        type: "value",
        axisLabel: {
          color: "rgba(119, 196, 255, 1)",
          opacity: 1,
        },
        axisLine: {
          lineStyle: {
            type: "",
            color: "rgba(35, 90, 178, 1)",
          },
        },
        splitLine: {
          lineStyle: {
            width: 0.1,
            color: "rgba(80, 199, 255, 0.9)",
            type: "dashed", // y轴分割线类型
          },
        },
        axisPointer: {
          //坐标指示器的线
          type: "line",
          lineStyle: {
            color: "rgba(0, 149, 255, 1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      grid3D: {
        viewControl: {
          // projection: 'orthographic'
        },
      },
      series: [
        {
          type: "surface",
          wireframe: {
            // show: false
          },
          equation: {
            x: {
              min: 0,
              max: itemValue.maxX,
              step: 1,
            },
            y: {
              min: 0,
              max: itemValue.maxY,
              step: 1,
            },
            z: function (x, y) {
              let arr = x.toString() + "," + y.toString();
              if (itemValue.xnew && itemValue.xnew.length > 0) {
                for (var i = 0; i < itemValue.xnew.length; i++) {
                  let posStr =
                    datanew["xnew"][i].toString() +
                    "," +
                    datanew["ynew"][i].toString();
                  if (arr === posStr) {
                    if (datanew["znew"][i] == 0) {
                      return y - 0.1;
                    } else {
                      return y + datanew["znew"][i];
                    }
                  }
                }
              }
              return y;
            },
          },
          itemStyle: {
            color: "rgba(80, 199, 255, 0.9)",
          },
          wireframe: {
            lineStyle: {
              width: 0.2,
              color: "#50c7fc",
              type: "dashed", // y轴分割线类型
            },
          },
        },
        {
          type: "scatter3D",
          wireframe: {
            // show: false
          },
          data: dataDian,
          color: "rgba(0, 149, 255, 1)",
        },
      ],
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