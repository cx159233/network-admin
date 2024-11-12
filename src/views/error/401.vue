<template>
  <div class="errPage-container">
    <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          {{ Error.Err401 }}
        </h1>
        <h2>{{ Error.NoPermission }}</h2>
        <h6>{{ Error.NoPermissionTip }}</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/">
              {{ Error.GoHome }}
            </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from "@/assets/401_images/401.gif";

export default {
  name: "Page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
      Error: {
        Err401: "401 Error!",
        NoPermission: "Permission denied!",
        NoPermissionTip:
          "Sorry, you do not have access rights. Please do not engage in illegal operations! You can return to the main page.",
        GoHome: "Back Home",
        Err404: "404 Error!",
        Err404Tip:
          "Sorry, the page you are looking for does not exist. Try checking for errors in the URL, then press the refresh button on the browser or try to find other content in our application.",
        PageNotFound: "Page not found!",
      },
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
