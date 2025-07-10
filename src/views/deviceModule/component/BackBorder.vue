<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-22 09:34:03
 * @LastEditors: wys
 * @LastEditTime: 2022-07-22 11:06:41
-->
<template>
  <div>
    <div class="BackBorder"
         :style="`border:${parentBorderWidth}px solid ${parentBorderColor};background:${backColor}`">
      <span class="borderStyle"
            v-for="(item,index) in 4"
            :style="`width:${borderWidth}px;height:${borderWidth}px;border-color:${borderColor};border-width:${borderCoarse}px`"
            :key="index"></span>

      <slot class="borderStyle"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/* 
borderWidth: 上下左右脚边高宽
borderColor：脚边颜色
parentBorderColor：外层边框颜色
parentBorderWidth：外层边框宽度
borderCoarse：脚边边框厚度
*/
const { borderWidth, borderColor, parentBorderColor, parentBorderWidth,borderCoarse,backColor } =
  defineProps([
    "borderWidth",
    "borderColor",
    "parentBorderColor",
    "parentBorderWidth",
    "borderCoarse",
    "backColor"
  ]);
</script>

<style scoped lang="less">
.BackBorder {
  padding: 10px;
  // height: 100%;
  // width: 100%;
  position: relative;
  .borderStyle {
    position: absolute;
  }
  & > span:nth-of-type(1) {
    left: 0px;
    top: 0px;
    border-left: 1px solid;
    border-top: 1px solid;
  }
  & > span:nth-of-type(2) {
    right: 0px;
    top: 0px;
    border-right: 1px solid;
    border-top: 1px solid;
  }
  & > span:nth-of-type(3) {
    left: 0px;
    bottom: 0px;
    border-left: 1px solid;
    border-bottom: 1px solid;
  }
  & > span:nth-of-type(4) {
    right: 0px;
    bottom: 0px;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }
}
</style>
