<template>
  <div id="videoP" class="tunnelvideo" loading="loading">
    <div v-if="!isError || !url">
      <video
        class="videosmall"
        ref="videosmall"
        preload="auto"
        muted
        autoplay
        type="rtmp/flv/fmp4"
      >
        {{ url }}
      </video>
    </div>
    <div class="centerClass" v-else>
      <p>暂无数据</p>
      <img
        class="backTaskClass"
        src="@/assets/image/login/logoone.png"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import flvjs from "flv.js";
import { onMounted, nextTick, ref, Ref, watch, onUnmounted, toRefs } from "vue";
import { useStore } from "vuex";
const player: Ref<flvjs.Player | null> = ref(null);
const loading = ref(true);
const props = defineProps<{
  url?: string;
  id?: number;
  title?: string;
  ip?: string;
  username?: string;
  pwd?: string;
}>();
const { url, id, title, ip, pwd, username } = toRefs(props); //深度监听
const videosmall: Ref<HTMLVideoElement | null> = ref(null); //获取视频节点
const isError = ref(false);
const $store = useStore();
watch(
  () => url?.value,
  (nval) => {
    if (nval) {
      // setTimeout(() => {
      init();
      // }, 800);
    }
  }
);

watch(
  () => $store.state.Common.isOpenContrlBox,
  (newold) => {
    if (player.value) {
      if (!newold) {
        player.value.play();
      } else {
        player.value.pause();
      }
    }
  }
);



onMounted(()=>{
  init()
})

function init() {
  console.log(url.value," ----url")
  var videoElement = videosmall.value;
  if (flvjs.isSupported()) {
    if (player.value) {
      player.value.pause();
      player.value.unload();
      player.value.detachMediaElement();
      player.value.destroy();
      player.value = null;
    }
    player.value = flvjs.createPlayer(
      // {
      //   // type: "fmp4",
      //   type: "flv",
      //   url: url, //你的url地址
      //   isLive: true, //数据源是否为直播流
      //   hasAudio: false, //数据源是否包含有音频
      //   hasVideo: true, //数据源是否包含有视频
      //   enableStashBuffer: true, //是否启用缓存区
      // },
      {
          type: "flv",
          // url: streamUrl, //你的url地址
          // url:"http://192.168.100.122:8088/test",
          url: "http://47.108.254.101:16661/rtp/3402000000132000000111_34020000001320000001.live.flv",
          isLive: true, //数据源是否为直播流
          hasAudio: false, //数据源是否包含有音频
          hasVideo: true, //数据源是否包含有视频
          // enableStashBuffer: true, //是否启用缓存区
        },
      {
          enableWorker: false, //不启用分离线程
          autoCleanupSourceBuffer: true, //自动清除缓存
          lazyLoad: false,
          enableStashBuffer: false, // 关闭IO隐藏缓冲区
          stashInitialSize: 128, // 减少首帧显示等待时长
        }
    );
    // if (videoElement) player.value.attachMediaElement(videoElement);
    player.value.load();
    player.value.play();
    loading.value = false;


    if (videoElement) {
        player.value.attachMediaElement(videoElement);
        videoElement.addEventListener("progress", () => {
          let end = player.value.buffered.end(0); // 获取当前buffered值(缓冲区末尾)
          let delta = end - player.value.currentTime; // 获取buffered与当前播放位置的差值
          if (delta > 10 || delta < 0) {
            player.value.currentTime = player.value.buffered.end(0) - 1;
            return;
          }
          if (delta > 1) {
            videoElement.playbackRate = 1.1;
          } else {
            videoElement.playbackRate = 1;
          }
        });
      }
      player.value.load();
      player.value.play();

      // player.value.on(flvjs.Events.ERROR, (val:any) => {
      //   console.log(val, " -----异常",player.value)
      //   player.value?.pause();
      //   player.value?.unload();
      //   player.value?.detachMediaElement();
      //   player.value?.destroy();
      //   player.value = null;
      //   player.value = [];
      //   init()
      // })


    handleDelay();
    player.value.on("load", (e) => {
      console.log(e, "-playerw-加载中");
    });
    // 监听流是否正常
    // player.value.on("error", (e) => {
    //   console.log(e, "-playerw-加载错误");
    //   isError.value = true;
    // });
    player.value.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
      console.log("-playerw-errorType:", errorType);
      console.log("-playerw-errorDetail:", errorDetail);
      console.log("-playerw-errorInfo:", errorInfo);
      //视频出错后销毁重新创建
      if (player.value) {
        player.value.pause();
        player.value.unload();
        player.value.detachMediaElement();
        player.value.destroy();
        player.value = null;
        if (videoElement) player.value.attachMediaElement(videoElement);
      }
    });
    // 网页重新激活后，更新视频
    window.onfocus = () => {
      if (!player.value || !player.value.buffered) return;
      if (player.value.buffered&&player.value.buffered.length) {
        if (player.value) {
          let end1 = player.value.buffered.end(0) - 1;
          player.value.currentTime = end1;
        }
        var videoElement2 = videosmall.value;
        let end = player.value.buffered.end(0); //获取当前buffered值
        let diff = end - player.value.currentTime; //获取buffered与currentTime的差值
        console.log("onfocus>>diff>>>", diff);
        if (player.value) {
          player.value.pause();
          player.value.unload();
          player.value.detachMediaElement();
          player.value.destroy();
          player.value = null;
        }
        player.value = flvjs.createPlayer(
          {
            // type: "fmp4",
            type: "flv",
            url: url, //你的url地址
            isLive: true, //数据源是否为直播流
            hasAudio: false, //数据源是否包含有音频
            hasVideo: true, //数据源是否包含有视频
            enableStashBuffer: true, //是否启用缓存区
          },
          {
            enableWorker: false, //不启用分离线程
            enableStashBuffer: false, //关闭IO隐藏缓冲区
            autoCleanupSourceBuffer: true, //自动清除缓存
            lazyLoad: false,
          }
        );
        if (videoElement2) player.value.attachMediaElement(videoElement2);
        player.value.load();
        player.value.play();
        loading.value = false;
      }
    };
    // player.value.on(flvjs.Events.ERROR, url);
  }
}

// 页面销毁
onUnmounted(() => {
  beforeUnmount();
});
//页面销毁
function beforeUnmount() {
  if (player.value) {
    player.value.pause();
    player.value.unload();
    player.value.detachMediaElement();
    player.value.destroy();
    player.value = null;
  }
}
const handleDelay = (): void => {
  let intervalId = window.setInterval(() => {
    if (!player.value || !(player.value.buffered)) return;
    if (player.value.buffered&&player.value.buffered.length) {
      var videoElement3 = videosmall.value;
      let end = player.value.buffered.end(0); //获取当前buffered值
      let diff = end - player.value.currentTime; //获取buffered与currentTime的差值
      if (diff >= 3.95 || diff < 0) {
        //如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
        player.value.currentTime = parseFloat(
          player.value.buffered.end(0) - 1.5
        ); //手动跳帧
        const end2 = player.value.currentTime;
      }
      if (diff > 60) {
        player.value.pause();
        player.value.unload();
        player.value.detachMediaElement();
        player.value.destroy();
        player.value = null;
        player.value = flvjs.createPlayer(
          {
            // type: "fmp4",
            type: "flv",
            url: url, //你的url地址
            isLive: true, //数据源是否为直播流
            hasAudio: false, //数据源是否包含有音频
            hasVideo: true, //数据源是否包含有视频
            enableStashBuffer: true, //是否启用缓存区
          },
          {
            enableWorker: false, //不启用分离线程
            enableStashBuffer: false, //关闭IO隐藏缓冲区
            autoCleanupSourceBuffer: true, //自动清除缓存
            lazyLoad: false,
          }
        );
        if (videoElement3) player.value.attachMediaElement(videoElement3);
        player.value.load();
        player.value.play();
        loading.value = false;
      }
      // 追帧
      // var videoElement = videosmall.value;
      // if (diff > 1) {
      //   videoElement.playbackRate = 1.1;
      // } else {
      //   videoElement.playbackRate = 1;
      // }
    }
  }, 200); //2000毫秒执行一次
};
</script>

<style lang="scss" scope>
.tunnelvideo {
  width: 100%;
  height: 100%;
  overflow: hidden;

  & > div {
    height: 100%;
  }

  .videosmall {
    width: 100%;
    height: 100%;
  }
}
.centerClass {
  text-align: center;
  p {
    margin-top: 10px;
  }
}
</style>
