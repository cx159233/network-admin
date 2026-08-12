<template>
  <div class="login-page">
    <div class="login-page__bg"></div>
    <div class="login-page__panel">
      <div class="login-page__header">
        <div class="login-page__logo">云</div>
        <div class="login-page__titles">
          <div class="login-page__title">云网管理中枢</div>
          <div class="login-page__subtitle">管理后台</div>
        </div>
      </div>

      <a-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        layout="vertical"
        class="login-form"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="loginForm.username"
            size="large"
            :placeholder="$t('Login.Account')"
            allow-clear
          >
            <template #prefix><UserOutlined class="login-form__icon" /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="loginForm.password"
            size="large"
            :placeholder="$t('Login.Password')"
            @pressEnter="handleLogin"
          >
            <template #prefix><LockOutlined class="login-form__icon" /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item v-if="captchaEnabled" name="code">
          <div class="login-form__code-row">
            <a-input
              v-model:value="loginForm.code"
              size="large"
              :placeholder="$t('Login.Captcha')"
              @pressEnter="handleLogin"
            >
              <template #prefix><SafetyOutlined class="login-form__icon" /></template>
            </a-input>
            <div class="login-form__code" @click="getCode">
              <img v-if="codeUrl" :src="codeUrl" class="login-form__code-img" />
              <span v-else class="login-form__code-placeholder">点击获取</span>
            </div>
          </div>
        </a-form-item>
        <div class="login-form__options">
          <a-checkbox v-model:checked="loginForm.rememberMe">{{ $t('Login.RememberMe') }}</a-checkbox>
        </div>
        <a-button
          type="primary"
          size="large"
          block
          :loading="loading"
          class="login-form__submit"
          @click="handleLogin"
        >
          {{ loading ? $t('Login.Logining') : $t('Login.Login') }}
        </a-button>
      </a-form>

      <div class="login-page__footer">
        Copyright © 2022-2024 ChestnutCMS (1000mz.com) All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  components: { UserOutlined, LockOutlined, SafetyOutlined },
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: this.$t('Login.AccountRuleTip') }],
        password: [{ required: true, trigger: 'blur', message: this.$t('Login.PasswordRuleTip') }],
        code: [{ required: true, trigger: 'change', message: this.$t('Login.CaptchaRuleTip') }]
      },
      loading: false,
      captchaEnabled: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    getCode() {
      getCodeImg().then(() => {
        this.captchaEnabled = false
      }).catch(() => {
        this.captchaEnabled = false
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: '',
        uuid: ''
      }
    },
    handleLogin() {
      this.$refs.loginFormRef.validate().then(() => {
        this.loading = true
        if (this.loginForm.rememberMe) {
          Cookies.set('username', this.loginForm.username, { expires: 30 })
          Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
          Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
        } else {
          Cookies.remove('username')
          Cookies.remove('password')
          Cookies.remove('rememberMe')
        }
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.$router.push({ path: this.redirect || process.env.VUE_APP_PATH }).catch(() => {})
        }).catch(() => {
          this.loading = false
          if (this.captchaEnabled) {
            this.getCode()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.login-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0B1120 0%, #1E293B 100%);
  overflow: hidden;
}

.login-page__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(22, 93, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.12) 0%, transparent 40%);
  pointer-events: none;
}

.login-page__panel {
  position: relative;
  width: 420px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 40px 36px 28px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.30);
  z-index: 1;
}

.login-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.login-page__logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #165DFF;
  color: #FFFFFF;
  font-size: 22px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(22, 93, 255, 0.35);
}

.login-page__title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
}

.login-page__subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: #86909C;
}

.login-form__icon {
  color: #86909C;
}

.login-form__code-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.login-form__code {
  flex-shrink: 0;
  width: 120px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #E5E6EB;
  background: #F7F8FA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s;
}

.login-form__code:hover {
  border-color: #165DFF;
}

.login-form__code-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form__code-placeholder {
  font-size: 12px;
  color: #86909C;
}

.login-form__options {
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form__submit {
  height: 44px !important;
  font-size: 15px;
  font-weight: 500;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.30);
}

.login-page__footer {
  margin-top: 28px;
  text-align: center;
  font-size: 12px;
  color: #86909C;
}
</style>
