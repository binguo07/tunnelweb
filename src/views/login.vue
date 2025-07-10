<!--
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-11 13:56:17
 * @LastEditors: wys
 * @LastEditTime: 2022-08-12 11:37:53
-->
<template>
  <div class="login"
       id="login">
    <div class="login_centent">
      <div class="bg_miglogin">
        <div class="logo">
          <img src="@/assets/image/login/logoone.png"
               alt="" />
        </div>
        <div class="name">
        </div>
        <div class="from_div">
          <div class="from_centent">
            <el-form :model="state.ruleForm"
                     :rules="state.rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
              <el-form-item prop="user"
                            class="item_div">
                <span> <img src="@/assets/image/login/user.png"
                       alt="" /></span>
                <el-input v-model="state.ruleForm.user"
                          placeholder="请输入账号"></el-input>
              </el-form-item>
              <el-form-item prop="password"
                            class="item_div">
                <span> <img src="@/assets/image/login/mima.png"
                       alt="" /></span>
                <el-input v-model="state.ruleForm.password"
                          placeholder="请输入密码"
                          @keyup.enter="handleLogin"
                          type="password"></el-input>
              </el-form-item>
            </el-form>

            <el-button type="primary"
                       style="width: 100%; margin-bottom: 30px; margin-top: 20px"
                       @click="handleLogin">登 录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { onMounted, reactive } from "vue-demi";
import { LoginFun } from "@/api/home/index";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ENCRYPT } from "@/utils/encryption";
// 暂时先跳转到主页
const state = reactive({
  rules: {
    user: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  },
  ruleForm: {
    user: "",
    password: "",
  },
  name: "",
  checked: false,
});
const ruleForm: Ref = ref(null);

const handleLogin = () => {
  ruleForm?.value.validate((valid: any) => {
    if (valid) {
      loginfn();
      // 跳转主页
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const router = useRouter();
// router.push("/index/home");
const loginfn = () => {
  var data = {
    loginId: ENCRYPT(state.ruleForm.user),
    userPass: ENCRYPT(state.ruleForm.password),
  };
  LoginFun(data).then((res: any) => {
    localStorage.setItem("userInfo", JSON.stringify(res));
    if (res.status == 0) {
      // store.commit()
      ElMessage.success("登录成功");
      router.push("/index/monitorConsole");
    } else {
      ElMessage.error(res.error);
    }
  });
};
</script>

<style scoped lang="less">
html,
body {
  width: 100%;
  height: 100%;
}

.login {
  width: 100%;
  height: 100%;
}
#login {
  :deep(.el-input__wrapper) {
    background: white !important;
  }
}

.login_centent {
  width: 100%;
  height: 100%;
}

.bg_miglogin {
  height: 100%;
  width: 100%;
  background-image: url("@/assets/image/login//bg.png");
  background-size: cover;
  background-color: black;
}
.logo {
  position: absolute;
  left: 101px;
  top: 50px;
}

.name {
  position: absolute;
  left: 101px;
  top: 50%;
  transform: translate(-10% -50%);
  color: #ffffff;
}

.name img {
  width: 500px;
}

.from_div {
  width: 300px;
  height: 280px;
  background: rgba(35, 38, 44, 0.6);
  position: absolute;
  right: 13%;
  top: 50%;
  margin-top: -50px;
}

.login_centent {
  :deep(.el-form-item__content) {
    display: flex;
    margin-left: 0 !important;
    align-items: center;
    display: flex;
    flex-wrap: inherit !important;

    span {
      display: inherit;
      margin: 0px 6px;
    }
  }
  :deep(.el-form-item) {
    border: 1px solid C7C7C8;
    background: #c7c7c8;
    border-radius: 5px;
    color: #454545;
    .el-input__inner {
      // background: #c7c7c8;
      color: #454545 !important;
      &::placeholder {
        color: #454545 !important;
      }
    }
  }
}
:deep(.el-input__wrapper) {
  .login_centent .el-input input {
    border: 0;
    padding: 4px 10px;
  }
  padding: 4px 10px;
}

.from_centent {
  width: 80%;
  height: 80%;
  margin: 10% 10%;
}
</style>