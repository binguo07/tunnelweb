<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-03-31 09:40:27
 * @LastEditors: wys
 * @LastEditTime: 2022-08-10 14:24:28
-->
<template>
  <div style="height: 100%" id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";
onMounted(() => {
  // 修改element主题颜色
  document.body.style.setProperty("--el-fill-color-light", "transparent");
  document.body.style.setProperty("--el-text-color-regular", "#77C4FF");
  document.body.style.setProperty("--el-fill-color-blank", "#0095ff00");
  // document.body.style.setProperty("--el-text-color-regular", "white");
  document.body.style.setProperty(
    "--el-input-hover-border-color",
    "transparent"
  );
  document.body.style.setProperty("--el-bg-color-overlay", "#022353");
  document.body.style.setProperty("--el-text-color-placeholder", "#77C4FF");
  document.body.style.setProperty("--el-border-color-light", "#022353");
  document.body.style.setProperty("--el-disabled-border-color", "#022353");
  document.body.style.setProperty("--el-border-color-extra-light", "#104eac");
  document.body.style.setProperty("--el-text-color-primary", "white");
  document.body.style.setProperty("--el-text-color-regular", "#6182BE");
  document.body.style.setProperty("--el-border-color-lighter", "transparent");
  document.body.style.setProperty("--el-border-color", "transparent");
   document.body.style.setProperty("--el-color-info", "rgba(0,149,255,0.3000)");
  document.body.style.setProperty("--el-border-color-hover", "#3764cd");
  document.body.style.setProperty("--el-color-primary", "#409eff");
  document.body.style.setProperty("--el-border-color", "#00409eff");
  document.body.style.setProperty("--el-bg-color", "#012456");
  // document.body.style.setProperty("--el-text-color-placeholder", "#606266");
  // document.body.style.setProperty("--el-text-color-regular", "#ccced4");
  document.body.style.setProperty("--el-text-color-placeholder", "#dde0e6");
  // document.body.style.setProperty("--el-border-color-extra-light", "#104eac");
  // document.body.style.setProperty("--el-fill-color-blank", "#013c70");
  // document.body.style.setProperty("--el-disabled-bg-color", "#00013c70");
  document.body.style.setProperty("--el-disabled-bg-color", "#fff");
  // document.body.style.setProperty("--el-fill-color-light", "#4974b5");
  // document.body.style.setProperty("--el-color-primary", "#7d8087");
    document.body.style.setProperty("--el-checkbox-disabled-border-color", "gray !important");
  document.body.style.setProperty("--el-mask-color", "#c0c4cc00");
  document.body.style.setProperty("--el-color-primary-light-9", "#0095ff4d");
  document.body.style.setProperty("--el-color-primary-light-7", "#0095ff4d");
  document.body.style.setProperty("--el-color-primary-light-3", "#409eff");
  document.body.style.setProperty("--el-text-color-regular", "#ffffff");
});
</script>


<style lang="scss">

.myspan{
  width: 120px !important;
}

.el-select{
  width: 214px !important;
  border: 1px solid #409eff;
    border-radius: 4px;
}

#app {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: Noto Sans SC, 微软雅黑;
  font-style: bold;
  font-weight: 400;
  font-size: 1rem;
  background: radial-gradient(circle, #06102c, #131f42);
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.scorll-class {
  overflow-y: scroll;
}

.scorll-class:hover {
  overflow-y: auto;
}

/* 定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸 */
.scorll-class::-webkit-scrollbar {
  width: 6px; /* 对垂直滚动条有效 */
  // height: 10px;  /* 对水平滚动条有效 */
}

/* 定义滚动条的轨道颜色、内阴影及圆角 */
.scorll-class::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ececec;
  border-radius: 5px;
}

/* 定义滑块颜色、内阴影及圆角 */
.scorll-class::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}

/* 光标移到滚动滑块上样式颜色变深 */
.scorll-class::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 定义右下角汇合处的样式 */
.scorll-class::-webkit-scrollbar-corner {
  background: khaki;
}

.el-scrollbar {
  // background: rgba(6, 26, 59, 0.9) !important;
  // box-shadow: 0px 10px 14px 0px rgba(0, 0, 0, 0.7) !important;
}
.el-select-dropdown__item {
  color: #bad9ff !important;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: rgba(245, 247, 250, 0) !important;
  color: rgba(77, 219, 253, 1) !important;
}

/* 表格公共样式部分 */
.tablesel {
  .el-table tbody tr:hover > td {
    background: rgba(75, 185, 255, 0.4) !important;
  }
  .el-table {
    tr {
      background-color: transparent !important;
    }
  }
  .el-table td,
  .el-table th {
    text-align: center !important;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(112, 213, 255, 0.06);
  }

  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-right: 1px solid #62b3ff;
    color: #bad9ff;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #15294a;
    color: #bad9ff !important;
  }

  /* 整个表格背景的颜色 */
  .el-table,
  .el-table__expanded-cell {
    background: #040b1e !important;
  }

  /* 调整滚动条部分的样式
     滚动条的宽度 */
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  /* 滚动条的滑块 */
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    // background-color: #00a5ff;
    border-radius: 3px;
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: rgba(98, 179, 255, 1) !important;
  }

  .el-table td.gutter,
  .el-table th.gutter {
    background-color: #15294a !important;
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #62b3ff !important;
  }

  .el-table .sort-caret.descending {
    border-top-color: #62b3ff !important;
  }

  .el-table .descending .sort-caret.descending {
    border-top-color: #82fff9 !important;
  }

  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #82fff9 !important;
  }

  .el-checkbox__inner {
    background-color: rgba(4, 11, 30, 0) !important;
    border: 1px solid #439eff !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409eff !important;
  }
  .el-input__inner {
    color: rgba(98, 179, 255, 1) !important;
    background: rgba(98, 179, 255, 0) !important;
    // border: 1px solid rgba(51, 187, 255, 0.2) !important;
  }
}
//  表格底部边框调整部分
.tablesel .el-table--border::after,
.tablesel .el-table--group::after,
.tablesel .el-table::before {
  background: rgba(23, 63, 127, 0) !important;
}

/* 分页的公共样式 */
.paginsel {
  .el-pagination {
    margin-left: 22px;
  }
  // :deep(.el-input__inner) {
  //   background: rgba(245, 247, 250, 0) !important;
  //   color: rgba(255, 255, 255, 1) !important;
  //   border: 1px solid #59a3f8 !important;
  // }

  .el-pagination button:disabled {
    background: rgba(245, 247, 250, 0) !important;
  }

  .el-pagination .btn-next,
  .el-pagination .btn-prev {
    background: rgba(245, 247, 250, 0) !important;
    color: rgba(255, 255, 255, 1) !important;
  }

  .el-pagination .btn-next:hover,
  .el-pagination .btn-prev:hover {
    color: rgba(49, 180, 247, 1) !important;
  }

  .el-pager,
  .el-pager li {
    // background: rgba(245, 247, 250, 0) !important;
    color: rgba(255, 255, 255, 1) !important;
  }
  .el-pager li.is-active {
    border-radius: 50%;
    background: #0095ff;
  }

  .el-pager,
  .el-pager li:hover {
    // background: rgba(245, 247, 250, 0) !important;
    color: rgba(49, 180, 247, 1);
  }

  .el-pagination__jump {
    color: rgba(255, 255, 255, 1) !important;
  }

  .el-pagination__total {
    color: rgba(255, 255, 255, 1) !important;
  }
}

.el-select .el-input .el-select__caret {
  color: #31b4f7 !important;
}
// 模糊背景层
.addFuzzy {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background: #000;
  z-index: 2;
}
// 以下是多选框公共部分
.el-select__tags {
  flex-wrap: nowrap !important;
}
.el-tag.el-tag--info {
  overflow: hidden !important;
}
.el-select .el-tag {
  background: rgba(51, 187, 255, 0.2) !important;
  border: 0;
  color: #62b3ff;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background: rgba(51, 187, 255, 0) !important;
  border: 0;
}
//  去掉横向滚动条
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.table_device .el-scrollbar__thumb {
  background: rgba(0, 165, 255, 0.6) !important;
}
.el-popper {
  background: transparent !important;
  border: none !important;
}
.popperClass > .el-popper__arrow {
  display: none;
}
</style>
