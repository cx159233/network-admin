<template>
  <div class="top-nav">
    <div class="nav-left">
      <div class="logo" @click="openFlowDialog" style="cursor: pointer;">
        <span>云网管理中枢管理后台</span>
      </div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#ffffff"
        text-color="#333333"
        active-text-color="#409EFF"
      >
        <el-menu-item index="portal">
          <span>门户管理</span>
        </el-menu-item>
        <el-menu-item index="workorder">
          <span>控制台</span>
        </el-menu-item>
        <el-menu-item index="system">
          <span>系统管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="nav-right">
      <div class="user-info">
        <span>admin</span>
      </div>
    </div>

    <!-- 流程弹窗 -->
    <el-dialog
      title="机构服务流转全视图"
      :visible.sync="flowDialogVisible"
      width="90%"
      :fullscreen="false"
      append-to-body
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
            <span style="color:#94a3b8; font-size:0.75rem;">[ 外部请求 ]</span>
            <span style="color:#3b82f6; font-size:0.75rem;">[ 门户核心 ]</span>
            <span style="color:#22c55e; font-size:0.75rem;">[ 审核/对接 ]</span>
          </div>
          <div class="diag-wrapper">
            <div class="diag-actor"><div class="diag-actor-box">机构用户</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#3b82f6">门户前端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#3b82f6">门户后端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#22c55e">运维管理员</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#ef4444">北京CA</div><div class="diag-life-line"></div></div>

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
              <div class="diag-arrow-line" style="background:#94a3b8"><div class="diag-arrow-head" style="border-left-color:#94a3b8"></div></div>
            </div>
            <div class="diag-msg reverse" style="top:340px; left:50%; width:20%;">
              <div class="diag-msg-label">4. 提交审批结论 (通过)</div>
              <div class="diag-arrow-line" style="background:#22c55e"><div class="diag-arrow-head" style="border-left-color:#22c55e"></div></div>
            </div>

            <div class="diag-critical-box">
              <span style="color:#ef4444; font-weight:bold; font-size:0.8rem;">⚠️ 关键点：是否同步北京CA？</span>
              <p style="font-size:0.7rem; color:#64748b;">同步：调用接口申领证书 | 不同步：仅更新数据库</p>
              <div style="display:flex; align-items:center; margin-top:10px;">
                <div class="diag-msg-label" style="position:static; font-size:0.7rem; margin-right:10px;">5. [可选] 对接第三方 CA</div>
                <div class="diag-arrow-line" style="background:#ef4444"><div class="diag-arrow-head" style="border-left-color:#ef4444"></div></div>
              </div>
            </div>
            
            <div class="diag-msg reverse" style="top:600px; left:10%; width:40%;">
              <div class="diag-msg-label" style="color:#22c55e">6. 异步发送通知 (短信/邮件)</div>
              <div class="diag-arrow-line" style="border-top: 2px dashed #22c55e; background:none;"><div class="diag-arrow-head" style="border-left-color:#22c55e"></div></div>
            </div>
          </div>
        </div>

        <!-- 2. 服务订阅 (优化布局版) -->
        <div id="subscription" class="flow-content">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 0 20px;">
            <span style="color:#94a3b8; font-size:0.75rem;">[ 申请方 ]</span>
            <span style="color:#3b82f6; font-size:0.75rem;">[ 门户核心 ]</span>
            <span style="color:#ef4444; font-size:0.75rem;">[ 外部工单系统 ]</span>
          </div>
          <div class="diag-wrapper">
            <div class="diag-actor"><div class="diag-actor-box">机构用户</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#3b82f6">门户前端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#3b82f6">门户后端</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#22c55e">运维管理员</div><div class="diag-life-line"></div></div>
            <div class="diag-actor"><div class="diag-actor-box" style="border-color:#ef4444">工单/多云系统</div><div class="diag-life-line"></div></div>

            <!-- Step 0: 目录同步 -->
            <div class="diag-msg s-0 reverse">
              <div class="diag-msg-label" style="color:#ef4444">0. [前置] 服务目录同步 (定时/推送)</div>
              <div class="diag-arrow-line" style="border-top: 2px dashed #ef4444; background:none;"><div class="diag-arrow-head" style="border-left-color:#ef4444"></div></div>
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
              <b style="color:#f59e0b">讨论点：</b> 是否需要后台人工审批？
            </div>

            <div class="diag-msg s-3 reverse">
              <div class="diag-msg-label" style="color:#22c55e">3. 运维审批通过</div>
              <div class="diag-arrow-line" style="background:#22c55e"><div class="diag-arrow-head" style="border-left-color:#22c55e"></div></div>
            </div>

            <!-- Step 4-5: 工单系统握手 -->
            <div class="diag-msg s-4">
              <div class="diag-msg-label">4. 调用接口同步工单</div>
              <div class="diag-arrow-line" style="background:#ef4444"><div class="diag-arrow-head" style="border-left-color:#ef4444"></div></div>
            </div>
            <div class="diag-msg s-5 reverse">
              <div class="diag-msg-label">5. 返回工单 ID 并关联订单</div>
              <div class="diag-arrow-line" style="background:#ef4444"><div class="diag-arrow-head" style="border-left-color:#ef4444"></div></div>
            </div>

            <!-- Step 6: 状态追踪 -->
            <div class="diag-msg s-6 reverse">
              <div class="diag-msg-label">6. 主动查询工单实时状态</div>
              <div class="diag-arrow-line" style="background:#94a3b8"><div class="diag-arrow-head" style="border-left-color:#94a3b8"></div></div>
            </div>

            <!-- Step 7-9: 评价闭环 -->
            <div class="diag-msg s-7">
              <div class="diag-msg-label">7. 完成服务后提交评价</div>
              <div class="diag-arrow-line" style="border-top:2px dashed #3b82f6; background:none;"><div class="diag-arrow-head" style="border-left-color:#3b82f6"></div></div>
            </div>
            <div class="diag-msg s-8 reverse">
              <div class="diag-msg-label">8. 管理员审批评价内容</div>
              <div class="diag-arrow-line" style="background:#22c55e"><div class="diag-arrow-head" style="border-left-color:#22c55e"></div></div>
            </div>
            <div class="diag-msg s-9">
              <div class="diag-msg-label">9. 打包评分模型并展示</div>
              <div class="diag-arrow-line" style="background:#22c55e"><div class="diag-arrow-head" style="border-left-color:#22c55e"></div></div>
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
export default {
  data() {
    return {
      activeIndex: this.getActiveIndexFromRoute(),
      flowDialogVisible: false
    };
  },
  watch: {
    $route: {
      handler() {
        this.activeIndex = this.getActiveIndexFromRoute();
      },
      immediate: true
    }
  },
  methods: {
    getActiveIndexFromRoute() {
      const path = this.$route.path;
      if (path.startsWith('/portal')) {
        return 'portal';
      } else if (path.startsWith('/workorder')) {
        return 'workorder';
      } else if (path.startsWith('/system')) {
        return 'system';
      }
      return 'portal';
    },
    handleSelect(key) {
      this.activeIndex = key;
      // 根据选择的菜单项跳转到相应的路由
      if (key === 'portal') {
        // 跳转到门户管理页面，默认显示站点管理
        this.$router.push('/portal/content/site');
      } else if (key === 'workorder') {
        // 跳转到工单中心页面，默认显示服务台
        this.$router.push('/workorder/serviceDesk');
      } else if (key === 'system') {
        // 跳转到系统管理页面
        this.$router.push('/system');
      }
    },
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
    }
  }
};
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 21, 41, 0.1);
  position: relative;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 40px;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.el-menu-demo {
  border-bottom: none !important;
  height: 50px;
  line-height: 50px;
}

.el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
  margin: 0;
  padding: 0 20px !important;
  font-size: 14px;
  border-bottom: none !important;
}

/* 移除 Element UI 菜单的底部边框线 */
.el-menu--horizontal {
  border-bottom: none !important;
}

/* 确保菜单项内部span垂直居中 */
.el-menu-item span {
  vertical-align: middle;
}

.nav-right {
  display: flex;
  align-items: center;
  margin-left: 40px;
}

.user-info {
  font-size: 14px;
  color: #333333;
}

/* 流程组件样式 */
/* 颜色变量 */
.flow-component-container {
  --primary-color: #3b82f6;
  --success-color: #22c55e;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --neutral-color: #94a3b8;
  --text-main: #1e293b;
  --border-line: #cbd5e1;
  --bg-light: #f8fafc;
}

.flow-component-container {
  max-width: 1100px;
  margin: 20px auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow-x: auto;
}

.flow-header {
  text-align: center;
  margin-bottom: 30px;
}

.flow-header h1 {
  font-size: 1.5rem;
  color: #0f172a;
  margin: 0;
}

.flow-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}

.flow-tab-btn {
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

.flow-tab-btn:hover {
  background: #f1f5f9;
}

.flow-tab-btn.active {
  background: var(--primary-color);
  color: #ffffff;
}

.flow-content {
  display: none;
  min-width: 900px;
}

.flow-content.active {
  display: block;
}

.diag-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  min-height: 780px;
  margin-top: 30px;
}

.diag-actor {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.diag-actor-box {
  width: 120px;
  padding: 12px 0;
  background: #fff;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
  z-index: 30;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.diag-life-line {
  position: absolute;
  top: 45px;
  bottom: 0;
  width: 2px;
  background-image: linear-gradient(to bottom, #cbd5e1 50%, transparent 50%);
  background-size: 2px 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.diag-msg {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 20;
}

.diag-arrow-line {
  height: 2px;
  background: #3b82f6;
  flex-grow: 1;
  position: relative;
  z-index: 20;
}

.diag-arrow-head {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #3b82f6;
  position: absolute;
  right: -8px;
  top: -4px;
  z-index: 21;
}

.reverse .diag-arrow-head {
  transform: rotate(180deg);
  left: -8px;
  right: auto;
}

.diag-msg-label {
  position: absolute;
  width: 100%;
  text-align: center;
  top: -24px;
  font-size: 0.75rem;
  white-space: nowrap;
  font-weight: 500;
}

/* 步骤间距调整 - 优化遮挡的关键 */
.s-0 { top: 80px; left: 50%; width: 40%; flex-direction: row-reverse; }
.s-1 { top: 140px; left: 10%; width: 20%; }
.s-2 { top: 190px; left: 30%; width: 20%; }
.s-3 { top: 260px; left: 50%; width: 20%; flex-direction: row-reverse; }
.s-4 { top: 320px; left: 50%; width: 40%; }
.s-5 { top: 370px; left: 50%; width: 40%; flex-direction: row-reverse; }
.s-6 { top: 440px; left: 10%; width: 40%; flex-direction: row-reverse; }
.s-7 { top: 510px; left: 10%; width: 40%; }
.s-8 { top: 580px; left: 50%; width: 20%; flex-direction: row-reverse; }
.s-9 { top: 640px; left: 50%; width: 20%; }

/* 讨论点与警告框 */
.diag-note-box {
  position: absolute;
  border: 2px dashed #f59e0b;
  background: rgba(245, 158, 11, 0.05);
  border-radius: 8px;
  padding: 10px;
  font-size: 0.7rem;
  z-index: 15;
}

.diag-critical-box {
  position: absolute;
  top: 420px;
  left: 50%;
  width: 40%;
  height: 150px;
  border: 2px dashed #ef4444;
  background: rgba(239, 68, 68, 0.02);
  border-radius: 12px;
  padding: 15px;
  z-index: 15;
}

.flow-footer {
  margin-top: 40px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #475569;
}
</style>