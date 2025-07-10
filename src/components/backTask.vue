<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-19 09:33:54
 * @LastEditors: wys
 * @LastEditTime: 2022-07-19 14:31:38
-->
<template>
  <div>
    <div :style="`width:${width}px;height:${height}px;`">
      <div class="headerClass">
        <i class="iconfont"
           :class="`icon-${iconName}`"
           :style="`color:${iconColor};font-size:${iconSize}px`"></i>
        <p>{{title}}</p>
      </div>
      <div class="backTack">
        <slot></slot>
        <img class="positionImg"
             src="@/assets/image/index/guangxiao.png"
             alt="">
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { width, height, iconName, title, iconColor, iconSize } = defineProps([
  "width",
  "height",
  "iconName",
  "title",
  "iconColor",
  "iconSize",
]);
</script>

<style scoped lang="less">
.headerClass {
  background-image: url("@/assets/image/index/bg-top.png");
  background-size: 100% 100%;
  width: 100%;
  height: 40px;
  display: flex;
  padding: 12px 30px;
  box-sizing: border-box;
  p {
    font-size: 16px;
    font-weight: Bold;
    color: #ffffff;
    font-family: "msyhl";
    // margin-top: -2px;
    margin-left: 18px;
  }
}
.backTack {
  height: 100%;
  width: 100%;
  background: #00306498;
  position: relative;
  box-shadow: 0px 0px 14px #0e4bad;
  border: 1px solid #0e4bad;
  .positionImg {
    position: absolute;
    bottom: -26px;
    left: 28%;
    height: 50px;
  }
}
</style>