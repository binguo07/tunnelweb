<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-25 10:53:31
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 16:31:35
-->
<template>
  <div id="groupControl"
       v-loading="data.isSubmit"
       element-loading-text="正在执行中，请稍等..."
       element-loading-background="rgba(122, 122, 122, 0.8)"
       v-if="isShow">
    <div class="content">
      <div>
        <img src="@/assets/image/deviceManagement/qunktitle.png"
             alt="" />
      </div>
      <div>
        <div style="width: 20%">
          <div class="deviceList scorll-class">
            <p>
              <i class="iconfont icon-jiancedian"></i> <span>设备列表</span><span style="font-size: 3px">&nbsp;&nbsp;(注意：只能设置同种设备)</span>
            </p>
            <div style="margin-top: 30px">
              <el-tree class="treeClass"
                       ref="qunktree"
                       :data="data.groupdata"
                       show-checkbox
                       node-key="id"
                       :default-expanded-keys="[2, 3]"
                       :default-checked-keys="qunkdefault"
                       @node-expand="onExpand"
                       @check="handleNodeClick(data.groupdata)">
                <template #default="{ node }">
                  <el-tooltip effect="dark"
                              :content="node.disabled"
                              placement="right">
                    <span></span>
                  </el-tooltip>
                  <span class="span_ellipsis">
                    <span :title="node.label"> {{ node.label }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="contentRight" >
          <div style="width: 680px">
            <div class="contentImg" v-show="data.selectDeviceList.length>0">
              <img :src="getDeviceImg(data.deviceImg)"
                   alt="" />
            </div>
            <div v-show="data.selectDeviceList.length>0">
              <el-form :label-position="'top'"
                       label-width="100px"
                       :model="form"
                       style="max-width: 680px">
                <div style="display: flex; flex-wrap: wrap; width: 100%"
                     class="formStyle">
                  <div style="width: 200px"
                       :style="
                      index != 0 || index % 2 == 0 ? 'margin-left:20px' : ''
                    "
                       v-for="(item, index) in data.qunktypeList"
                       :key="index">
                    <el-form-item :label="item.attr_name">
                      <el-input v-model="item.value"
                                type="number">
                        <template #suffix>{{
                          item.attr_unit.length < 4 ? item.attr_unit : ""
                        }}</template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <!-- <el-form-item label="倾角阀值">
                    <el-input v-model="form.region">
                      <template #suffix>°</template>
                    </el-input>
                  </el-form-item> -->
                </div>
                <!-- <div style="display:flex"
                     class="formStyle">
                  <el-form-item label="沉降值阀值">
                    <el-input v-model="form.type">
                      <template #suffix>mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="位移阀值">
                    <el-input v-model="form.type">
                      <template #suffix>mm</template>
                    </el-input>
                  </el-form-item>
                </div> -->
              </el-form>
            </div>
          </div>
          <div class="footer">
            <el-button style="background: #00a5ff; color: white; border: none"
                       @click="closeGroup"
                       :disabled="data.isSubmit">取消</el-button>
            <el-button type="text"
                       style="border: 1px solid #0276b5; padding: 4px 8px; color: white"
                       @click="perform"
                       :disabled="data.isSubmit">执行此设置</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getAllDeviceTypeByTunnelId,
  getDevicesByType,
  getBatchAttrValue,
  getAllDevicesTree,
  setDeviceAttr,
} from "@/api/device/index";
import { PROJECTID, TUNNELID ,PROJECTNAME} from "@/utils/enumeration";
import { isNumber } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { da } from "element-plus/es/locale";
import { nextTick } from "process";
import {
  reactive,
  onMounted,
  onBeforeUnmount,
  defineEmits,
  defineProps,
  watch,
  ref,
  Ref,
} from "vue-demi";
const form = reactive({});
const data = reactive({
  dataDeviceList: [],
  Device_value: "",
  groupdata: [],
  qunktypeList: [],
  devicepic: "",
  qunkdefault: [],
  deviceTypeName: "",
  deviceTypeObj: {},
  selectDeviceList: [],
  // 用户是否提交
  isSubmit: false,
  // 当前轮询下标
  currentIndex: 0,
  deviceImg: "weiqixiangGroup.png",
});
const { isShow } = defineProps(["isShow"]);
const isShowRef = ref(isShow);
const qunktree: Ref<Element | null> = ref(null);

// 监听数据改变
watch(
  () => qunktree?.value?.getCheckedKeys(),
  (newold) => {
    let arr = newold.filter((item: number | undefined) => {
      if (item) return item;
    });
    data.selectDeviceList = arr;
    // 在没有筛选时增加筛选条件，如果有则需要将现在选择的数据删除再重置
    getDeviceIdFoo(data.groupdata, arr[0]);
    data.groupdata = foo(data.groupdata, data.deviceTypeName);
    getDeviceSetAttrs();
  }
);
//获取设备动态图片
const getDeviceImg = (src) => {
  if (src != null && src != "") {
    return require("@/assets/image/deviceManagement/" + src);
  } else {
    return require("@/assets/image/deviceManagement/beidouGroup.png");
  }
};

// 过滤无用ID并将设备ID存放起来
const foo = function (arr: any, deviceType: string | null): any {
  arr.forEach((item: any) => {
    if (!isNumber(item.id)) delete item.id;
    //  只能选择一种类型
    if (deviceType) {
      console.log(item," ------ ")
      if (
        (item.children &&
          item?.label != deviceType &&
          !item.device_clazz_name) ||
        (item.device_clazz_name && item.device_clazz_name != deviceType)
      ) {
        item.disabled = true;
      }
      // 如果没有数据，则放出禁用
    } else {
      item.disabled = false;
    }
    // 禁用父级，并保留最后一级的全选
    if (item.children) {
      item.disabled = true;
      if (
        (!item.children[0]?.children && item?.label == deviceType) ||
        (!item.children[0]?.children && !deviceType)
      ) {
        item.disabled = false;
      }
    }
    if (item.children) foo(item.children, deviceType);
  });
  return arr;
};
// 过滤选择设备类型
const getDeviceIdFoo = function (arr: any, deviceId: number): string {
  let deviceTypeName = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == deviceId) {
      deviceTypeName = arr[i].device_clazz_name;
      // 将匹配到的设备类型存放起来
      data.deviceTypeName = arr[i].device_clazz_name;
      data.deviceTypeObj = arr[i];
      break;
    } else {
      if (arr[i].children) getDeviceIdFoo(arr[i].children, deviceId);
    }
  }
  return deviceTypeName;
};
const getDeviceSetAttrs = () => {
  // deviceTypeObj
  getBatchAttrValue({ deviceTypeId: data.deviceTypeObj?.device_type_fk }).then(
    (res) => {
      data.qunktypeList = res.data;
      let deviceTypeFk = data.deviceTypeObj?.device_type_fk;
      if (deviceTypeFk === 111||deviceTypeFk === 112) {
        //mems设备
        data.deviceImg = "MEMSGroup.png";
      } else if (deviceTypeFk === 105) {
        //微电站
        data.deviceImg = "weidianzhanGroup.png";
      } else if (deviceTypeFk === 106) {
        //北斗
        data.deviceImg = "beidouGroup.png";
      } else if (deviceTypeFk === 104) {
        //微气象站
        data.deviceImg = "weiqixiangGroup.png";
      } else if (deviceTypeFk === 110) {
        //测距仪
        data.deviceImg = "cejuyi.png";
      } else if (deviceTypeFk === 109) {
        //应变监测仪
        data.deviceImg = "yibian.png";
      } else if (deviceTypeFk === 108) {
        //裂缝监测
        data.deviceImg = "liefeng.png";
      } else if (deviceTypeFk === 107) {
        //土壤监测
        data.deviceImg = "turan.png";
      } else if (deviceTypeFk === 13) {
        //视频监控
        data.deviceImg = "shexiangjiGroup.png";
      } else {
        data.deviceImg = "weiqixiangGroup.png";
      }
    }
  );
};
// 节点展开事件
const onExpand = (e) => {
  initTreeEvent();
};
const handleNodeClick = (data: any) => {
  initTreeEvent();
};
const emis = defineEmits<{ (e: "closeGroup", value: boolean): void }>();
// 关闭弹窗
const closeGroup = () => {
  emis("closeGroup", false);
};
onMounted(() => {
  initData();
});
onBeforeUnmount(() => {
  if (timer.value) {
    window.clearInterval(timer.value);
  }
});
const perform = () => {
  let errorName = "",
    obj: any = {};
  data.qunktypeList.forEach((item: any) => {
    if (!item.value) errorName = item.attr_name;
    obj[item.id] = item.value;
  });
  if (errorName) {
    ElMessage.error(`请填写：${errorName}`);
    return;
  }
  if (!data.selectDeviceList.length) {
    ElMessage.error("请选择群控设备");
    return;
  }
  data.isSubmit = true;

  setDeviceAttrFun(obj);
};
// 设置设备属性
const setDeviceAttrFun = function (attr: string) {
  setDeviceAttr({
    attrs: attr,
    type: 0,
    dealer: 0,
    deviceId: data.selectDeviceList[data.currentIndex],
    project:PROJECTNAME,
  })
    .then((res) => {
      data.currentIndex += 1;
      if (res.status == 1) {
        ElMessage.error(res.error);
      } else {
        ElMessage.success(`${res.device_name}设置成功`);
      }
      // 当小于选择设备时才进行轮询
      if (data.currentIndex < data.selectDeviceList.length) {
        setDeviceAttrFun(attr);
      } else {
        data.isSubmit = false;
        data.currentIndex = 0;
      }
    })
    .catch((err) => {});
};

//获取当前隧道所有设备类型
const initData = () => {
  getAllDeviceTypeByTunnelId({ tunnelId: TUNNELID }).then((res) => {
    data.dataDeviceList = res.data;
    data.Device_value = data.dataDeviceList[0]?.typeId;
    groupcontrolbtn();
  });
};

// 获取树形图
const groupcontrolbtn = () => {
  getAllDevicesTree({ projectId: PROJECTID }).then((res: any) => {
    console.log(res, " ---- ");
    data.groupdata = foo(res, null);
    // nextTick(() => {
    //   initTreeEvent();
    // });
    qunktypefn(); //群控
  });
};
const qunktypefn = () => {
  getBatchAttrValue({
    deviceTypeId: data.Device_value,
  }).then((res) => {
    data.qunktypeList = res.data;
    var attrPic = res.pic; //获取图片部分
    data.devicepic = ""; //清空值

    compressfn(attrPic);
  });
};
// 图片替换
const compressfn = (attrPic: string) => {
  if (attrPic && attrPic.indexOf("|") > 0) {
    var attrPicArray = attrPic.split("|");
    for (var i = 0; i < attrPicArray.length; i++) {
      if (attrPicArray[i].indexOf(".compress.") < 0) {
        attrPic = attrPicArray[i];
        break;
      }
    }
  }
  //有图片才替换
  if (attrPic) {
    data.devicepic = process.env.VUE_APP_IMGURL + attrPic;
  }
};
const timeLength = 500;
let timer = ref(null);
const initTreeEvent = () => {
  nextTick(() => {
    let ele = document.querySelectorAll(".el-tree-node__content>.is-disabled");
    ele.forEach((eleItem, index) => {
      eleItem.addEventListener("click", (e) => {
        let elePrents = document.getElementsByClassName(
          "el-tree-node__content"
        );
        if (eleItem.getAttribute("class") != "el-checkbox is-disabled") {
          return;
        }
        for (let i = 0; i < elePrents.length; i++) {
          // 获取父元素
          let parentDom = elePrents[i].parentElement;
          let parentIsdisabled = parentDom?.getAttribute("aria-disabled");
          if (data.selectDeviceList.length > 0) {
            msgShow("只能设置同种设备");
            return;
          }
          if (parentIsdisabled) {
            msgShow("请展开并选择子项");
            return;
          }
        }
      });
    });
  });
};
const msgShow = (msg) => {
  if (!timer.value) {
    ElMessage.warning(msg);
  }
  timer.value = setTimeout(() => {
    timer.value = null;
  }, timeLength);
};
</script>
<style scoped lang="less">
#groupControl {
  :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
    border-color: #56565694 !important;
  }

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  .formStyle {
    display: flex;
    justify-content: space-between;
    :deep(.el-input__wrapper) {
      width: 130px;
    }
  }
  & > div {
    position: absolute;
    bottom: 0px;
    height: calc(100% - 300px);
    width: 100%;
  }
  .content > div:first-child {
    text-align: center;
  }
  .content > div:last-child {
    height: 85%;
    background: #0e2949a5;
    padding: 30px 20px;
    border-top: 1px solid #59a3f8;
    display: flex;
    .deviceList {
      border: 1px solid #3566a0;
      height: 86%;
      padding: 36px 24px;
      background: #0e2949a5;
      border-radius: 4px;
      p {
        color: #5caaf3;
        font-size: 18px;
      }
    }
  }
  .treeClass {
    background: transparent;
    font-size: 14px;
    :deep(.el-tree__empty-text) {
      color: white;
    }
  }
  .contentRight {
    width: 80%;
    margin-top: 40px;
    display: flex;
    justify-content: center;
    justify-items: center;
    .contentImg {
      margin: 0px auto;
      background-image: url("@/assets/image/deviceManagement/qunkguan.png");
      background-size: 100% 100%;
      width: 300px;
      height: 260px;
      text-align: center;
    }
    .footer {
      position: absolute;
      bottom: 30px;
      right: 30px;
    }
  }
}
</style>