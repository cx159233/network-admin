<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <div
      class="sidebar-logo-link"
      style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;"
    >
      <transition name="sidebarLogoFade">
        <div v-if="collapse" key="collapse">
          <img v-if="logo" :src="logo" class="sidebar-logo" />
          <h1
            class="sidebar-title"
            :style="{
              color:
                sideTheme === 'theme-dark'
                  ? variables.logoTitleColor
                  : variables.logoLightTitleColor,
            }"
            @click="openFlowDialog"
            style="cursor: pointer;"
          >
            {{ title }}
          </h1>
        </div>
        <div v-else key="expand">
          <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
          <h1
            class="sidebar-title"
            :style="{
              color:
                sideTheme === 'theme-dark'
                  ? variables.logoTitleColor
                  : variables.logoLightTitleColor,
            }"
            @click="openFlowDialog"
            style="cursor: pointer;"
          >
            {{ title }}
          </h1>
        </div>
      </transition>
    </div>

    <!-- 流程弹窗 -->
    <el-dialog
      title="机构服务流转全视图"
      :visible.sync="flowDialogVisible"
      width="90%"
      :fullscreen="false"
    >
      <div class="flow-component-container">
        <div class="flow-header">
          <h1>机构服务流转全视图</h1>
        </div>

        <div class="flow-tabs">
          <button class="flow-tab-btn active" @click="toggleFlow('enrollment')">机构入驻流程</button>
          <button class="flow-tab-btn" @click="toggleFlow('subscription')">服务订阅流程</button>
        </div>

        <!-- 1. 机构入驻 (保持原样逻辑) -->
        <div id="enrollment" class="flow-content active">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 20px;">
            <span style="color:var(--neutral-color); font-size:0.75rem;">[ 外部请求 ]</span>
            <span style="color:var(--primary-color); font-size:0.75rem;">[ 门户核心 ]</span>
            <span style="color:var(--success-color); font-size:0.75rem;">[ 审核/对接 ]</span>
          </div>
          <div class="diag-wrapper">
            <div class="diag-actor"><div class="diag-actor-box">机构用户</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--primary-color)">门户前端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--primary-color)">门户后端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--success-color)">运维管理员</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--danger-color)">北京CA</div><div class="diag-life-line"></div></div>

            <div class="diag-msg" style="top:100px; left:10%; width:20%;">
              <div class="diag-msg-label">1. 填写入驻资料并提交</div>
              <div class="diag-arrow-line"><div class="diag-arrow-head"></div></div>
            </div>
            <div class="diag-msg" style="top:150px; left:30%; width:20%;">
              <div class="diag-msg-label">2. 提交注册申请 (API)</div>
              <div class="diag-arrow-line"><div class="diag-arrow-head"></div></div>
            </div>
            <div class="diag-msg reverse" style="top:220px; left:50%; width:20%;">
              <div class="diag-msg-label">3. 登录后台获取待审记录</div>
              <div class="diag-arrow-line" style="background:var(--neutral-color)"><div class="diag-arrow-head" style="border-left-color:var(--neutral-color)"></div></div>
            </div>
            <div class="diag-msg reverse" style="top:340px; left:50%; width:20%;">
              <div class="diag-msg-label">4. 提交审批结论 (通过)</div>
              <div class="diag-arrow-line" style="background:var(--success-color)"><div class="diag-arrow-head" style="border-left-color:var(--success-color)"></div></div>
            </div>

            <div class="diag-critical-box">
              <span style="color:var(--danger-color); font-weight:bold; font-size:0.8rem;">⚠️ 关键点：是否同步北京CA？</span>
              <p style="font-size:0.7rem; color:#64748b;">同步：调用接口申领证书 | 不同步：仅更新数据库</p>
              <div style="display:flex; align-items:center; margin-top:10px;">
                <div class="diag-msg-label" style="position:static; font-size:0.7rem; margin-right:10px;">5. [可选] 对接第三方 CA</div>
                <div class="diag-arrow-line" style="background:var(--danger-color)"><div class="diag-arrow-head" style="border-left-color:var(--danger-color)"></div></div>
              </div>
            </div>
            
            <div class="diag-msg reverse" style="top:600px; left:10%; width:40%;">
              <div class="diag-msg-label" style="color:var(--success-color)">6. 异步发送通知 (短信/邮件)</div>
              <div class="diag-arrow-line" style="border-top: 2px dashed var(--success-color); background:none;"><div class="diag-arrow-head" style="border-left-color:var(--success-color)"></div></div>
            </div>
          </div>
        </div>

        <!-- 2. 服务订阅 (优化布局版) -->
        <div id="subscription" class="flow-content">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 20px;">
            <span style="color:var(--neutral-color); font-size:0.75rem;">[ 申请方 ]</span>
            <span style="color:var(--primary-color); font-size:0.75rem;">[ 门户核心 ]</span>
            <span style="color:var(--danger-color); font-size:0.75rem;">[ 外部工单系统 ]</span>
          </div>
          <div class="diag-wrapper">
            <div class="diag-actor"><div class="diag-actor-box">机构用户</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--primary-color)">门户前端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--primary-color)">门户后端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--success-color)">运维管理员</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:var(--danger-color)">工单/多云系统</div><div class="diag-life-line"></div></div>

            <!-- Step 0: 目录同步 -->
            <div class="diag-msg s-0 reverse">
              <div class="diag-msg-label" style="color:var(--danger-color)">0. [前置] 服务目录同步 (定时/推送)</div>
              <div class="diag-arrow-line" style="border-top: 2px dashed var(--danger-color); background:none;"><div class="diag-arrow-head" style="border-left-color:var(--danger-color)"></div></div>
            </div>

            <!-- Step 1-2: 申请与落单 -->
            <div class="diag-msg s-1">
              <div class="diag-msg-label">1. 浏览目录并提交申请</div>
              <div class="diag-arrow-line"><div class="diag-arrow-head"></div></div>
            </div>
            <div class="diag-msg s-2">
              <div class="diag-msg-label">2. 创建订单 (待处理)</div>
              <div class="diag-arrow-line"><div class="diag-arrow-head"></div></div>
            </div>

            <!-- 讨论点 A -->
            <div class="diag-note-box" style="top: 165px; left: 45%; width: 220px;">
              <b style="color:var(--warning-color)">讨论点：</b> 是否需要后台人工审批？
            </div>

            <div class="diag-msg s-3 reverse">
              <div class="diag-msg-label" style="color:var(--success-color)">3. 运维审批通过</div>
              <div class="diag-arrow-line" style="background:var(--success-color)"><div class="diag-arrow-head" style="border-left-color:var(--success-color)"></div></div>
            </div>

            <!-- Step 4-5: 工单系统握手 -->
            <div class="diag-msg s-4">
              <div class="diag-msg-label">4. 调用接口同步工单</div>
              <div class="diag-arrow-line" style="background:var(--danger-color)"><div class="diag-arrow-head" style="border-left-color:var(--danger-color)"></div></div>
            </div>
            <div class="diag-msg s-5 reverse">
              <div class="diag-msg-label">5. 返回工单 ID 并关联订单</div>
              <div class="diag-arrow-line" style="background:var(--danger-color)"><div class="diag-arrow-head" style="border-left-color:var(--danger-color)"></div></div>
            </div>

            <!-- Step 6: 状态追踪 -->
            <div class="diag-msg s-6 reverse">
              <div class="diag-msg-label">6. 主动查询工单实时状态</div>
              <div class="diag-arrow-line" style="background:var(--neutral-color)"><div class="diag-arrow-head" style="border-left-color:var(--neutral-color)"></div></div>
            </div>

            <!-- Step 7-9: 评价闭环 -->
            <div class="diag-msg s-7">
              <div class="diag-msg-label">7. 完成服务后提交评价</div>
              <div class="diag-arrow-line" style="border-top:2px dashed var(--primary-color); background:none;"><div class="diag-arrow-head"></div></div>
            </div>
            <div class="diag-msg s-8 reverse">
              <div class="diag-msg-label">8. 管理员审批评价内容</div>
              <div class="diag-arrow-line" style="background:var(--success-color)"><div class="diag-arrow-head" style="border-left-color:var(--success-color)"></div></div>
            </div>
            <div class="diag-msg s-9">
              <div class="diag-msg-label">9. 打包评分模型并展示</div>
              <div class="diag-arrow-line" style="background:var(--success-color)"><div class="diag-arrow-head"></div></div>
            </div>
          </div>
        </div>

        <div class="flow-footer">
          <strong>📌 系统说明：</strong><br/>
          - <b>机构入驻：</b> 解决“我是谁”的问题，通过身份认证开启权限。<br/>
          - <b>服务订阅：</b> 解决“我要做什么”的问题，与外部工单系统深度解耦并建立评价反馈。
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logoImg from "@/assets/logo/logo.png";
import variables from "@/assets/styles/variables.scss";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    },
  },
  data() {
    return {
      title: this.$t("APP.TITLE"),
      logo: logoImg,
      flowDialogVisible: false,
    };
  },
  methods: {
    openFlowDialog() {
      console.log('点击事件被触发了');
      console.log('flowDialogVisible 当前值:', this.flowDialogVisible);
      this.flowDialogVisible = true;
      console.log('flowDialogVisible 设置为 true 后:', this.flowDialogVisible);
    },
    toggleFlow(id) {
      document.querySelectorAll('.flow-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.flow-content').forEach(content => content.classList.remove('active'));
      
      const activeBtn = Array.from(document.querySelectorAll('.flow-tab-btn'))
                            .find(btn => btn.textContent.includes(id === 'enrollment' ? '机构入驻流程' : '服务订阅流程'));
      if (activeBtn) activeBtn.classList.add('active');
      document.getElementById(id).classList.add('active');
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}

/* 流程组件样式 */
:root {
  --primary-color: #3b82f6;
  --success-color: #22c55e;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --neutral-color: #94a3b8;
  --text-main: #1e293b;
  --border-line: #cbd5e1;
  --bg-light: #f8fafc;
}

:deep(.flow-component-container) {
  max-width: 1100px;
  margin: 20px auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow-x: auto;
}

:deep(.flow-header) {
  text-align: center;
  margin-bottom: 30px;
}

:deep(.flow-header h1) {
  font-size: 1.5rem;
  color: #0f172a;
  margin: 0;
}

:deep(.flow-tabs) {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}

:deep(.flow-tab-btn) {
  padding: 8px 24px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  background: none;
}

:deep(.flow-tab-btn:hover) {
  background: #f1f5f9;
}

:deep(.flow-tab-btn.active) {
  background: var(--primary-color);
  color: #ffffff;
}

:deep(.flow-content) {
  display: none;
  min-width: 900px;
}

:deep(.flow-content.active) {
  display: block;
}

:deep(.diag-wrapper) {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  min-height: 780px;
  margin-top: 30px;
}

:deep(.diag-actor) {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

:deep(.diag-actor-box) {
  width: 120px;
  padding: 12px 0;
  background: #fff;
  border: 2px solid var(--border-line);
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
  z-index: 30;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

:deep(.diag-life-line) {
  position: absolute;
  top: 45px;
  bottom: 0;
  width: 2px;
  background-image: linear-gradient(to bottom, var(--border-line) 50%, transparent 50%);
  background-size: 2px 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

:deep(.diag-msg) {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 20;
}

:deep(.diag-arrow-line) {
  height: 2px;
  background: var(--primary-color);
  flex-grow: 1;
  position: relative;
}

:deep(.diag-arrow-head) {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid var(--primary-color);
  position: absolute;
  right: -2px;
  top: -4px;
}

:deep(.reverse .diag-arrow-head) {
  transform: rotate(180deg);
  left: -2px;
  right: auto;
}

:deep(.diag-msg-label) {
  position: absolute;
  width: 100%;
  text-align: center;
  top: -24px;
  font-size: 0.75rem;
  white-space: nowrap;
  font-weight: 500;
}

:deep(.s-0) { top: 80px; left: 50%; width: 40%; flex-direction: row-reverse; }
:deep(.s-1) { top: 140px; left: 10%; width: 20%; }
:deep(.s-2) { top: 190px; left: 30%; width: 20%; }
:deep(.s-3) { top: 260px; left: 50%; width: 20%; flex-direction: row-reverse; }
:deep(.s-4) { top: 320px; left: 50%; width: 40%; }
:deep(.s-5) { top: 370px; left: 50%; width: 40%; flex-direction: row-reverse; }
:deep(.s-6) { top: 440px; left: 10%; width: 40%; flex-direction: row-reverse; }
:deep(.s-7) { top: 510px; left: 10%; width: 40%; }
:deep(.s-8) { top: 580px; left: 50%; width: 20%; flex-direction: row-reverse; }
:deep(.s-9) { top: 640px; left: 50%; width: 20%; }

:deep(.diag-note-box) {
  position: absolute;
  border: 2px dashed var(--warning-color);
  background: rgba(245, 158, 11, 0.05);
  border-radius: 8px;
  padding: 10px;
  font-size: 0.7rem;
  z-index: 15;
}

:deep(.diag-critical-box) {
  position: absolute;
  top: 420px;
  left: 50%;
  width: 40%;
  height: 150px;
  border: 2px dashed var(--danger-color);
  background: rgba(239, 68, 68, 0.02);
  border-radius: 12px;
  padding: 15px;
  z-index: 15;
}

:deep(.flow-footer) {
  margin-top: 40px;
  padding: 15px;
  background: var(--bg-light);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #475569;
}
</style>
