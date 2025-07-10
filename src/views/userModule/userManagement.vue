<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-14 15:22:47
 * @LastEditors: wys
 * @LastEditTime: 2022-08-15 16:29:31
-->
<template>
  <div class="userEquipment_box">
    <div class="userEquipment">
      <!-- 背景图片部分 -->
      <div class="tableimg">
        <div class="angle-border left-top-border"></div>
        <div class="angle-border right-top-border"></div>
        <div class="angle-border left-bottom-border"></div>
        <div class="angle-border right-bottom-border"></div>

        <!-- 查询部分 -->
        <div class="querydiv" v-show="data.isLoginAdmin">
          <div class="demo-input-suffix Moninput">
            <span class="myspan">用户名称：</span>
            <el-select
              v-model="data.user"
              placeholder=""
              clearable
              collapse-tags
            >
              <el-option
                v-for="item in data.users"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <div>
            <div class="chaxdiv" @click="initData()">
              <span>查询</span>
            </div>
          </div>
          <div>
            <div class="chaxdiv adddiv" @click="addbtn(1)">
              <span>新增</span>
            </div>
          </div>
        </div>

        <!-- 表格部分 -->
        <div class="tablesel" ref="tableseldiv">
          <el-table
            stripe
            ref="multipleTable"
            :data="data.tableData"
            empty-text=" "
            style="width: 100%"
            :header-cell-style="{ background: '#0FA1B2', color: '#FFFFFF' }"
            height="100%"
          >
            <el-table-column width="100" label="序号" prop="num">
            </el-table-column>
            <el-table-column label="用户名" prop="u_loginid"></el-table-column>
            <el-table-column
              label="用户类型"
              prop="role_name"
            ></el-table-column>
            <el-table-column label="邮箱" prop="u_email"> </el-table-column>
            <el-table-column label="操作" key="slot">
              <template #default="scope">
                <span @click="addbtn(2, scope.row)" class="seeDiv" v-if="data.isLoginAdmin&&scope.row.role_fk != 1"
                  ><i class="iconfont icon-bianji"></i>编辑</span
                >
                <span @click="addbtn(3, scope.row)" class="seeDiv"
                  ><i class="iconfont icon-mima"></i>重置密码</span
                >
                <span @click="addbtn(4, scope.row)" class="seeDiv" v-if="data.isLoginAdmin&&scope.row.role_fk != 1"
                  ><i class="iconfont icon-shanchu"></i>删除</span
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- <div
            v-if="tableloading"
            style="margin-top: -15vw; margin-left: 47vw; color: gray"
          >
            正在加载...
          </div>
          <div
            v-if="!tableloading && tableData.length == 0"
            style="margin-top: -15vw; margin-left: 47vw; color: gray"
          >
            暂无数据
          </div> -->
        </div>
        <!-- 弹框部分 -->
        <div class="gatewaydiv" v-show="userAdd_show">
          <div class="gatewaydiv_box">
            <!-- 头部部分 -->
            <div class="title">
              <h5>{{ data.titlenew }}</h5>
              <i class="el-icon-close" @click="cancleUser_btn"></i>
            </div>
            <!-- 中间部分 -->
            <div class="centent">
              <!-- 新增 -->
              <div
                class="adddiv"
                v-if="data.userState === 1 || data.userState === 2"
              >
                <div class="username">
                  <span class="myspan">用户身份：</span>
                  <el-select
                    class="my_station"
                    v-model="data.userIdentity"
                    placeholder="请选择用户身份"
                    collapse-tags
                    @change="changeIdentity()"
                  >
                    <el-option
                      v-for="item in data.userIdentitys"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="username">
                  <span class="myspan">用户名：</span>
                  <el-input
                    v-model="data.username"
                    style="width: 214px;"
                    placeholder="请输入用户名最大长度为20"
                    maxlength="20"
                  ></el-input>
                </div>
                <div class="username" v-if="data.isAdmin">
                  <span class="myspan">邮箱：</span>
                  <el-input
                    v-model="data.email"
                    style="width: 214px;"
                    placeholder="请输入邮箱最大长度为40"
                    maxlength="40"
                  ></el-input>
                </div>
                <p
                  style="font-size: 14px; margin-left: 88px"
                  v-if="data.email"
                  :style="
                    emailStrength(data.email).status
                      ? 'color: #52e752;'
                      : 'color:red'
                  "
                >
                  {{ emailStrength(data.email).msg }}
                </p>
                <div v-if="!data.isAditor">
                  <div class="username">
                    <span class="myspan">密码：</span>
                    <el-input
                      v-model="data.password"
                      type="password"
                      placeholder="请输入密码最大长度为20"
                      maxlength="20"
                    ></el-input>
                  </div>
                  <p
                    style="font-size: 14px; margin-left: 88px"
                    v-if="data.password"
                    :style="
                      proofStrength(data.password).status
                        ? 'color: #52e752;'
                        : 'color:red'
                    "
                  >
                    {{ proofStrength(data.password).msg }}
                  </p>
                </div>
                <div class="username" v-if="!data.isAditor">
                  <span class="myspan">确认密码：</span>
                  <el-input
                    v-model="data.passwordRepeat"
                    type="password"
                    placeholder="请输入确认密码最大长度为20"
                    maxlength="20"
                  ></el-input>
                </div>
              </div>
              <!-- 编辑 -->
              <!-- <div class="adddiv" v-if="data.userState === 2">
                <div class="username">
                  <span class="myspan">用户名：</span>
                  <el-input
                    v-model="name"
                    placeholder="请输入用户名"
                  ></el-input>
                </div>
              </div> -->
              <!-- 重置 -->
              <div class="adddiv" v-if="data.userState === 3">
                <div v-if="!data.isLoginAdmin">
                  <div class="username">
                    <span class="myspan">原密码：</span>
                    <el-input
                      v-model="data.oldPass"
                      type="password"
                      placeholder="请输入原密码最大长度为20"
                      maxlength="20"
                    ></el-input>
                  </div>
                </div>
                <div>
                  <div class="username">
                    <span class="myspan">新密码：</span>
                    <el-input
                      v-model="data.newPass"
                      type="password"
                      placeholder="请输入密码最大长度为20"
                      maxlength="20"
                    ></el-input>
                  </div>
                  <p
                    style="font-size: 14px; margin-left: 88px"
                    v-if="data.newPass"
                    :style="
                      proofStrength(data.newPass).status
                        ? 'color: #52e752;'
                        : 'color:red'
                    "
                  >
                    {{ proofStrength(data.newPass).msg }}
                  </p>
                </div>
                <div class="username">
                  <span class="myspan">确认密码：</span>
                  <el-input
                    v-model="data.passwordRepeat"
                    type="password"
                    placeholder="请输入确认密码最大长度为20"
                    maxlength="20"
                  ></el-input>
                </div>
              </div>
              <div class="deleteadddiv" v-if="data.userState === 4">
                <!-- <i
                  class="iconfont icon-tixingshixin"
                  style="color: #d79231"
                ></i> -->
                <span class="mydeletespan">
                  确认删除用户：{{ data.userId }}</span
                >
              </div>
            </div>
            <!-- 底部部分 -->
            <div class="footer">
              <span @click="cancleUser_btn">取消</span>
              <span @click="submitUser_btn">确定</span>
            </div>
          </div>
        </div>

        <!-- 分页部分 
          1.total是总条数，总数居
          2.page-总页数
          3.current-page当前页数
          4.每页显示多少条数据
          5.layout布局元素排列

        -->
        <!-- <div class="pagindiv paginsel">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" 
            :current-page="1"
          >
          </el-pagination>
        </div> -->
        <div class="demo-pagination-block">
          <el-pagination
            v-model:currentPage="data.currentPage"
            v-model:page-size="data.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="false"
            :disabled="false"
            :background="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { PROJECTID, TUNNELID ,DIVCIE_TYPE_FK,PROJECTNAME} from "@/utils/enumeration";
import { ElMessage } from "element-plus";
import { ENCRYPT } from "@/utils/encryption";
import {
  updateUserPass,
  editMessage,
  addUser,
  removeUser,
  AllUserLoginId,
  findUser,
  checkUserPass,
} from "@/api/user/index";
const routerName: string = "用户管理";
var userAdd_show = ref(false);
const data = reactive({
  list: [],
  titlenew: "",
  userState: 0,
  currentPage: 1,
  pageSize: 10,
  total: 100,
  user: "",
  users: [],
  tableData: [],
  password: "",
  username: "",
  oldUsername: "",
  passwordRepeat: "",
  email: "",
  loginId: "admin",//登陆用户
  userId:"",//需要处理的用户
  oldPass: "",
  newPass: "",
  isLoginAdmin:false,
  isAdmin: false,
  isAditor: false,
  userIdentitys: [
    {
      id: "4",
      name: "普通用户",
    },
    {
      id: "3",
      name: "专家",
    },
  ], //3为专家，4为普通用户
  userIdentity: "4",
});
data.list = [];
interface IObj {
  status: boolean;
  msg: string;
}
//校验密码
const proofStrength = function (val: string): IObj {
  let proofStatus =
      /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![!#$%^&*]+$)[\da-zA-z!.#$%^&*]{8,20}$/.exec(
        val
      ),
    obj: IObj = {
      status: false,
      msg: "",
    };
  if (proofStatus) {
    obj = {
      status: true,
      msg: "密码安全",
    };
  } else {
    obj = {
      status: false,
      msg: "要求密码长度8-20位，且包含大/小写字母、数字、特殊字符(.!#$%^&*)任意两种或以上",
    };
  }
  return obj;
};
//校验邮箱
const emailStrength = function (val: string): IObj {
  let emailStatus =
      /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(val),
    obj: IObj = {
      status: false,
      msg: "",
    };
  if (emailStatus) {
    obj = {
      status: true,
      msg: "邮箱格式正确",
    };
  } else {
    obj = {
      status: false,
      msg: "请输入正确的邮箱格式",
    };
  }
  return obj;
};
//根据用户身份修改弹框
const changeIdentity = () => {
  if (data.userIdentity === "3") {
    data.isAdmin = true;
  } else if (data.userIdentity === "4") {
    data.isAdmin = false;
    data.email = "";
  }
  console.log(
    data.userIdentity,
    "data.userIdentity",
    data.isAdmin,
    "data.isAdmin"
  );
};
//获取用户数据
const initData = () => {
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log("userInfo>>",userInfo)
  if(userInfo.loginId === "admin"){
    data.isLoginAdmin = true;
  }else{
    data.isLoginAdmin = false;
  }
  if (data.user === "全部") {
    data.user = "";
  }
  data.loginId = userInfo.loginId;
  var getData = {
    pageNumber: data.currentPage + "",
    pageSize: data.pageSize + "",
    loginUser: data.loginId,
    targetUser: data.user,
  };
  findUser(getData).then((res: any) => {
    console.log("res.data", res.data);
    if (res.status == 0) {
      data.total = res.pageTotal;
      data.tableData = res.data;
    }
  });
  //获取所有用户id
  var allUserLoginIdData = {
    loginId: data.loginId,
  };
  AllUserLoginId(allUserLoginIdData).then((res: any) => {
    data.users = res;
    let all = "全部";
    data.users.unshift(all);
    console.log(data.users, "this.users");
  });
};
//新增用户
const addUserInfo = () => {
  var addData = {
    loginId: data.username,
    password: data.password,
    email: data.email,
    project: PROJECTNAME,
  };
  addUser(addData).then((res: any) => {
    if (res.status == 0) {
      showErrorMessage(res.message, "success");
      userAdd_show.value = false;
      initData();

    } else {
      showErrorMessage(res.message, "error");
    }
  });
};
//删除用户
const deleteUser = () => {
  var deleteData = {
    loginId: data.userId,
    project: PROJECTNAME,
  };
  removeUser(deleteData).then((res: any) => {
    if (res.status == 0) {
      showErrorMessage(res.message, "success");
      userAdd_show.value = false;
      data.user = "";
      data.currentPage = 1;
      initData();
    } else {
      showErrorMessage(res.message, "error");
    }
  });
};
//编辑用户
const updateUser = () => {
  var updataMessage = {
    u_loginid: data.username,
    u_email: data.email,
    role_fk: data.userIdentity,
  };
  var updateData = {
    loginId: data.loginId,
    message: JSON.stringify(updataMessage),
    targetId: data.userId,
    project: PROJECTNAME,
  };
  editMessage(updateData).then((res: any) => {
    if (res.status == 0) {
      showErrorMessage(res.message, "success");
      userAdd_show.value = false;
      initData();
    } else {
      showErrorMessage(res.message, "error");
    }
    data.email ="";
  });
};
//重置用户密码
const updatePass = () => {
  var updatePassData = {
    targetUser: data.userId,
    oldPass: ENCRYPT(data.oldPass),
    newPass: ENCRYPT(data.newPass),
    project: PROJECTNAME,
    loginUser:data.loginId,
  };
  updateUserPass(updatePassData).then((res: any) => {
    if (res.status == 0) {
      showErrorMessage(res.message, "success");
      userAdd_show.value = false;
    } else {
      showErrorMessage(res.message, "error");
    }
  });
};
/**
 * 过滤首尾空白字符
 */
const trim = (str) => {
  str = str.replace(/(^\s*)|(\s*$)/g, ""); //用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
  //空格开头或者空格结尾
  // ^是开始
  // \s是空白
  // *表示0个或多个
  // |是或者
  // $是结尾
  // g表示全局
  return str;
};
//确定
const submitUser_btn = () => {
  if (data.newPass) {
    if (!proofStrength(data.newPass).status) {
      showErrorMessage("当前密码不安全", "error");
      return;
    }
  }
  if (data.password) {
    if (!proofStrength(data.password).status) {
      showErrorMessage("当前密码不安全", "error");
      return;
    }
  }

  if (data.userState === 1) {
    if (trim(data.username) === "") {
      showErrorMessage("用户名不能为空", "error");
    } else if (trim(data.password) === "") {
      showErrorMessage("密码不能为空", "error");
    } else if (data.password != data.passwordRepeat) {
      showErrorMessage("密码和确认密码不相同", "error");
    } else {
      if (data.isAdmin) {
        if (data.email === "") {
          showErrorMessage("邮箱不能为空", "error");
          return;
        } else {
          if (!emailStrength(data.email).status) {
            showErrorMessage("邮箱格式不正确", "error");
            return;
          }
        }
      }
      userAdd_show.value = false;
      addUserInfo();
    }
  } else if (data.userState === 2) {
    //编辑用户
    if (trim(data.username) === "") {
      showErrorMessage("用户名不能为空", "error");
      return;
    } else {
      if (data.isAdmin) {
        if (data.email === "") {
          showErrorMessage("邮箱不能为空", "error");
          return;
        }else {
          if (!emailStrength(data.email).status) {
            showErrorMessage("邮箱格式不正确", "error");
            return;
          }
        }
      }
    }
    updateUser();
    
  } else if (data.userState === 3) {
    //重置密码
    if (trim(data.oldPass) === ""&&!data.isLoginAdmin) {
      showErrorMessage("密码不能为空", "error");
    } else if (trim(data.newPass) === "") {
      showErrorMessage("新密码不能为空", "error");
    } else if (data.newPass != data.passwordRepeat) {
      showErrorMessage("密码和确认密码不相同", "error");
    } else {
      updatePass();
    }
  } else if (data.userState === 4) {
    //删除
    // console.log("data.userId>>",data.userId)
    deleteUser();
  }
};
//表格按钮
function addbtn(val: any, val2: any) {
  userAdd_show.value = val;
  data.userState = val;
  console.log("addbtn>>val2>>", val2);
  data.userId = val2 === undefined ? "" : val2.u_loginid;
  if (data.userState === 2) {
    data.isAditor = true;
    data.username = val2.u_loginid;
    if (val2.u_email === "") {
      data.isAdmin = false;
      data.userIdentity = "4";
    } else {
      data.isAdmin = true;
      data.userIdentity = "3";
      data.email = val2.u_email;
    }
    data.titlenew = "编辑用户";
  } else if (data.userState === 3) {
    // data.userId = val2 === undefined ? "" : val2.u_loginid;
    data.oldPass = "";
    data.newPass = "";
    data.passwordRepeat = "";
    data.titlenew = "重置密码";
  } else if (data.userState === 4) {
    // data.userId = val2 === undefined ? "" : val2.u_loginid;
    data.titlenew = "删除";
  } else if (data.userState === 1) {
    data.isAditor = false;
    data.titlenew = "新增用户";
    data.isAditor = false;
    data.passwordRepeat = "";
    data.password = "";
    data.email = "";
    data.username = "";
    data.userIdentity = "4";
    data.isAdmin = false;
  }
}
function handleSizeChange(val: any) {
  data.pageSize = val;
  initData();
}
function handleCurrentChange(val: any) {
  data.currentPage = val;
  initData();
}
//取消
const cancleUser_btn = () => {
  userAdd_show.value = false;
  data.email = "";
};

//消息提示
const open1 = () => {
  ElMessage("this is a message.");
};
const open2 = () => {
  ElMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  ElMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  ElMessage.error("Oops, this is a error message.");
};
const showErrorMessage = (msg: string, type: any) => {
  ElMessage({
    message: msg,
    type: type,
  });
};
onMounted(() => {
  initData();
});
</script>
<style lang="scss" scoped>
.userEquipment {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 90px);
  background-color: #040b1e;
  .tableimg {
    position: relative;
    width: calc(100vw - 40px);
    height: calc(100vh - 110px);
    background: linear-gradient(0deg, rgba(0, 149, 255, 0) 0%, #003164 100%);
    background-size: 100% 100%;
    top: 10px;
    margin: auto;
    font-weight: 400;
    color: white;
    border: 1px solid #090e26;
    .querydiv {
      display: flex;
      flex-wrap: wrap;
      width: 98.5%;
      background: rgba(0, 149, 255, 0.2);
      margin: auto;
      margin-top: 30px;

      > div {
        display: flex;
        margin-left: 20px;
        color: white;
        padding: 15px 0 15px 0;
        .myspan {
          margin-top: 5px;
          width: auto;
        }
      }
      > div:nth-child(2) {
        flex: 1;
      }
      //新增按钮
      .adddiv {
        margin-right: 150px;
      }
    }
    .chaxdiv {
      width: 64px;
      height: 32px;
      background: #0095ff;
      border-radius: 4px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      > span {
        text-align: center;
        flex: 1;
      }
    }

    .tablesel {
      margin: 20px 13px;
      height: calc(100vh - 300px);
      .seeDiv {
        margin: 10px 10px;
        cursor: pointer;
        color: #77c4ff;
      }
    }
    .gatewaydiv {
      position: absolute;
      left: 50%;
      top: 50%;
      min-height: 320px;
      width: 500px;
      transform: translate(-50%, -50%);
      z-index: 10;
      background: rgba(1, 36, 86, 1);
      .gatewaydiv_box {
        .title {
          border-bottom: 1px solid rgba(67, 154, 255, 0.3);
          display: flex;
          align-items: center;
          padding: 15px 40px;
          h5 {
            flex: 1;
            font-size: 24px;
            font-weight: 500;
            color: #ccf2ff;
          }
          i {
            color: rgba(0, 116, 186, 1);
            cursor: pointer;
            font-size: 18px;
          }
        }
        .centent {
          margin: 10px 40px;
          .username {
            display: flex;
            align-items: center;
            margin: 25px 10px;
            margin-bottom: 0px;
            margin-top: 20px;
            .myspan {
              width: 100px;
              text-align: right;
            }
          }
        }
        .footer {
          margin: 40px 40px;
          text-align: center;
          font-weight: 400;
          color: #ffffff;
          > span {
            border-radius: 4px;
            padding: 6px 25px;
            font-size: 14px;
            cursor: pointer;
          }
          > span:nth-child(1) {
            background: rgba(0, 149, 255, 0.3);
          }
          > span:nth-child(2) {
            background: rgba(0, 149, 255, 1);
            margin-left: 30px;
          }
        }
        .gatewaypadsel {
          display: none;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>

.mydeletespan {
  width: 100%;
  text-align: center;
  display: block;
}
.deleteadddiv {
  margin-top: 50px;
  margin-bottom: 80px;
}
.angle-border {
  position: absolute;
  width: 12px;
  height: 12px;
}
.left-top-border {
  top: 0;
  left: 0;
  border-left: 1px solid #0095ff;
  border-top: 1px solid #0095ff;
}

.right-top-border {
  top: 0;
  right: -1px;
  border-right: 1px solid #0095ff;
  border-top: 1px solid #0095ff;
}

.left-bottom-border {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid #0095ff;
  border-left: 1px solid #0095ff;
}

.right-bottom-border {
  bottom: 0;
  right: -1px;
  border-right: 1px solid #0095ff;
  border-bottom: 1px solid #0095ff;
}
.alarmpage {
  // 插件的样式部分
  .el-input__inner:hover {
    border: 1px solid #0095ff !important;
  }
}
// 多选择部分样式公共部分样式
.el-select-dropdown__list {
  padding: 20px 1px !important;
}
.el-scrollbar__view el-select-dropdown__list {
  padding: 20px 1px !important;
  width: 70% !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: 10px !important;
}
// 选中的颜色
.el-pager li.active {
  color: #409eff !important;
}

.el-input__suffix {
  top: 0 !important;
}
.querydiv .el-input__ico {
  height: 40px !important;
}
.el-select-dropdown__empty {
  background: rgba(6, 26, 59, 0.9) !important;
  color: #ffff;
}
.popper__arrow {
  border-bottom-color: rgba(6, 26, 59, 0) !important;
}
.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(6, 26, 59, 0) !important;
}
.el-popper {
  position: absolute;
  border-radius: var(--el-popper-border-radius);
  padding: 5px 11px;
  z-index: 20000 !important;
  font-size: 12px;
  line-height: 20px;
  min-width: 10px;
  word-wrap: break-word;
  visibility: visible;
}
.el-select .el-tag__close.el-icon-close {
  display: none !important;
}
.my_station {
  --el-input-height: var(--el-component-size);
  position: relative;
  font-size: var(--el-font-size-base);
  display: inline-flex;
  width: 100%;
  line-height: var(--el-input-height);
  box-sizing: border-box;
  flex-direction: column;
}
.el-table--border .el-table__inner-wrapper::after,
.el-table--border::after,
.el-table--border::before,
.el-table__inner-wrapper::before {
  content: "";
  position: absolute;
  background-color: #00000000;
  z-index: 3;
}
.el-pagination {
  --el-pagination-font-size: 14px;
  --el-pagination-bg-color: #00000000;
  --el-pagination-text-color: #999999;
  --el-pagination-border-radius: 3px;
  --el-pagination-button-color: var(--el-text-color-primary);
  --el-pagination-button-width: 32px;
  --el-pagination-button-height: 32px;
  --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
  --el-pagination-button-disabled-bg-color: #00000000;
  --el-pagination-button-bg-color: var(--el-fill-color);
  --el-pagination-hover-color: var(--el-color-primary);
  --el-pagination-height-extra-small: 24px;
  --el-pagination-line-height-extra-small: var(
    --el-pagination-height-extra-small
  );
  white-space: nowrap;
  padding: 2px 5px;
  color: #ffffff;
  font-weight: 400;
  display: flex;
  align-items: center;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
}
.el-input__wrapper {
  display: inline-flex;
  /* flex-grow: 1; */
  align-items: center;
  /* justify-content: center; */
  /* padding: 1px 11px; */
  background-color: rgba(0, 149, 255, 0.2);
  /* background-image: none;
  border-radius: var(--el-input-border-radius,var(--el-border-radius-base)); */
  transition: var(--el-transition-box-shadow);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
</style>