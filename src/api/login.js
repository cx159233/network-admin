// 登录方法 - Mock 数据，任何人都可以登录
export function login(username, password, code, uuid) {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      message: '登录成功',
      data: 'mock-jwt-token-' + Date.now()
    })
  })
}

// 注册方法 - Mock 数据
export function register(data) {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      message: '注册成功',
      data: null
    })
  })
}

// 退出方法 - Mock 数据
export function logout() {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      message: '退出成功',
      data: null
    })
  })
}

// 获取验证码 - Mock 数据
export function getCodeImg() {
  return new Promise((resolve) => {
    // 生成一个模拟的 base64 图片数据（1x1 像素的透明 gif）
    resolve({
      code: 200,
      message: '操作成功',
      data: {
        captchaEnabled: false, // 关闭验证码
        img: '', // 不需要图片
        uuid: 'mock-uuid-' + Date.now()
      }
    })
  })
}

// cookie登录方法 - Mock 数据
export function codeLogin() {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      message: '登录成功',
      data: 'mock-jwt-token-' + Date.now()
    })
  })
}
