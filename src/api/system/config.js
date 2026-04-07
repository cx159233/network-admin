/*
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2024-10-24 15:42:30
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-02-17 14:22:55
 * @FilePath: /cq-network-admin-view/src/api/system/config.js
 * @Description:
 *
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved.
 */

// 查询参数列表
export function listConfig(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { configId: 1, configName: '系统名称', configKey: 'sys.name', configValue: '后台管理系统', configType: 'Y', createTime: '2024-01-15 10:00:00' },
        { configId: 2, configName: '版权信息', configKey: 'sys.copyright', configValue: 'Copyright 2024', configType: 'Y', createTime: '2024-01-15 10:00:00' },
        { configId: 3, configName: '上传路径', configKey: 'sys.upload.path', configValue: '/upload', configType: 'Y', createTime: '2024-01-15 10:00:00' },
        { configId: 4, configName: '上传大小限制', configKey: 'sys.upload.maxSize', configValue: '10485760', configType: 'Y', createTime: '2024-01-15 10:00:00' },
        { configId: 5, configName: '验证码开关', configKey: 'sys.captcha.enabled', configValue: 'true', configType: 'Y', createTime: '2024-01-15 10:00:00' }
      ],
      total: 5
    }
  })
}

// 查询参数详细
export function getConfig(configId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      configId: configId,
      configName: '系统名称',
      configKey: 'sys.name',
      configValue: '后台管理系统',
      configType: 'Y',
      remark: '系统显示名称',
      createTime: '2024-01-15 10:00:00'
    }
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return Promise.resolve({
    code: 200,
    data: 500 * 1024 * 1024,
    msg: 'success'
  })
}

// 新增参数配置
export function addConfig(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改参数配置
export function updateConfig(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除参数配置
export function delConfig(configIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 刷新参数缓存
export function refreshCache() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}
