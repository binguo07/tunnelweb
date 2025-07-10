<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 11:49:29
 * @LastEditors: wys
 * @LastEditTime: 2022-08-01 15:11:40
-->
<template>
  <div style="margin:30px 0px">
    <div class="titleClass">
      <span></span>
      <h3>{{title}}</h3>
    </div>

    <div class="contentClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const { title } = defineProps(['title'])
</script>

<style lang="scss" scoped>
.titleClass {
  background: #f3f8ff;
  padding: 10px;
  display: flex;
  justify-items: center;
  span {
    display: inline-block;
    background: #0352cf;
    width: 4px;
    height: 20px;
    margin-top: 5px;
    margin-right: 10px;
  }
}
.contentClass {
  padding: 40px 20px;
}
</style>