<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-08-01 14:19:57
 * @LastEditors: wys
 * @LastEditTime: 2022-08-11 11:41:17
-->
<template>
  <div v-show="true">
    <contentComt title="结论">
      <div v-if="!isPrint">
        <!-- :disabled="!(data.isExpert && data.isEditor) && !data.isPrint" -->
        <!-- :style="{
            border: isPrint ? true : false,
            resize: isPrint ? true : false,
          }" -->
        <el-input
          v-model="conclusion"
          placeholder="限2000字"
          show-word-limit
          :rows="10"
          ref="selftext"
          maxlength="2000"
          type="textarea"
        />
      </div>
      <p v-else v-html="conclusion.replaceAll('\n', '<br/>')"></p>
    </contentComt>

    <div class="footer">
      <div>
        <el-button
          type="primary"
          style="padding: 14px 50px"
          @click="submit"
          v-show="data.isExpert && data.isEditor && !data.isPrint"
        >
          提交</el-button
        >
        <el-button
          type="warning"
          @click="PDF"
          style="padding: 14px 32px"
          v-show="!data.isEditor && !data.isPrint"
          >PDF下载</el-button
        >
      </div>
      <!-- <div style="margin-top:40px">
        <el-button type="primary"
                   style="padding:14px 50px" @click="PDF">打印</el-button>
        <el-button type="warning"
                   @click="PDF"
                   style="padding:14px 32px">转换PDF</el-button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSteps } from "element-plus";
import { da } from "element-plus/es/locale";
import { type } from "os";
import { Ref } from "vue";
import { reactive, ref, defineEmits, onMounted } from "vue-demi";
import {
  useRoute,
  RouteLocationNormalizedLoaded,
  RouteParams,
} from "vue-router";
import contentComt from "./content.vue";
const conclusion = ref("");
const emis = defineEmits<{ (e: "print" | "submit", value: string): void }>();
const selftext: Ref = ref<Element | null>(null);
const isPrint = ref(false);
const route = useRoute();
const data = reactive({
  isExpert: true, //专家
  isAdmin: true, //管理员
  isEditor: true, //修改
  isPrint: false, //打印
});
//修改按钮显示
const changeIsPrint = (value: any) => {
  data.isPrint = value;
};

const PDF = () => {
  if (
    selftext.value &&
    selftext.value.scrollHeight > selftext.value.clientHeight
  ) {
    selftext.value.style.height = selftext.value.scrollHeight + 3500 + "px";
  }
  isPrint.value = true;
  emis("print", "");
};
const setConclusion = (values) => {
  console.log("setConclusion>>",values)
  conclusion.value = values;
};
defineExpose({ changeIsPrint ,setConclusion });
const submit = () => {
  emis("submit", conclusion.value);
};
onMounted(() => {
  const route = useRoute();
  // conclusion.value = route.query.comments + "";
  console.log(conclusion.value, " -------conclusion");
  //不是管理员需要隐藏用户板块
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo.role === 3) {
    //判断是否是管理员或专家
    data.isExpert = true;
  } else {
    data.isExpert = false;
  }
  if (userInfo.role === 1) {
    data.isAdmin = true;
  } else {
    data.isAdmin = false;
  }
  if (route.query.types == 2) {
    data.isEditor = true;
  } else {
    data.isEditor = false;
  }
  console.log("isEditor>>", data);
});
</script>

<style scoped lang="scss">
.el-textarea {
  --el-input-bg-color: #ffffff !important;
}
.footer {
  width: 300px;
  margin: 50px auto;
  div {
    text-align: center;
  }
  & > div:nth-child(2) {
    display: flex;
    justify-content: space-between;
  }
}
</style>