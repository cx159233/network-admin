export function listSecurityConfigs(params) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: {
      rows: [
        {
          configId: 1,
          configName: "密码最小长度",
          configKey: "security.password.minLength",
          configValue: "8",
          status: "0",
          createTime: "2024-01-15 10:00:00"
        },
        {
          configId: 2,
          configName: "密码复杂度要求",
          configKey: "security.password.complexity",
          configValue: "true",
          status: "0",
          createTime: "2024-01-15 10:00:00"
        },
        {
          configId: 3,
          configName: "登录失败锁定次数",
          configKey: "security.login.maxRetry",
          configValue: "5",
          status: "0",
          createTime: "2024-01-15 10:00:00"
        },
        {
          configId: 4,
          configName: "会话超时时间",
          configKey: "security.session.timeout",
          configValue: "30",
          status: "0",
          createTime: "2024-01-15 10:00:00"
        },
        {
          configId: 5,
          configName: "IP白名单启用",
          configKey: "security.ip.whitelist.enabled",
          configValue: "false",
          status: "0",
          createTime: "2024-01-15 10:00:00"
        }
      ],
      total: 5
    }
  });
}

export function getSecurityConfig(configId) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: {
      configId: configId,
      configName: "密码最小长度",
      configKey: "security.password.minLength",
      configValue: "8",
      status: "0",
      remark: "设置用户密码的最小长度要求",
      createTime: "2024-01-15 10:00:00"
    }
  });
}

export function currentSecurityConfig(configId) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: {
      configId: 1,
      configName: "密码最小长度",
      configKey: "security.password.minLength",
      configValue: "8",
      status: "0",
      createTime: "2024-01-15 10:00:00"
    }
  });
}

export function addSecurityConfig(data) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: true
  });
}

export function saveSecurityConfig(data) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: true
  });
}

export function deleteSecurityConfig(configIds) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: true
  });
}

export function changeConfigStatus(configId) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: true
  });
}

export function checkSecurityConfig(configId) {
  return Promise.resolve({
    code: 200,
    message: "操作成功",
    data: {
      valid: true,
      message: "配置检查通过"
    }
  });
}
