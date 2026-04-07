// 查询部门列表
export function listDept(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        deptId: 100,
        deptName: '技术部',
        parentId: 0,
        orderNum: 1,
        leader: '张三',
        phone: '13800138000',
        email: 'tech@example.com',
        status: '0',
        createTime: '2024-01-15 10:00:00',
        children: [
          { deptId: 101, deptName: '前端组', parentId: 100, orderNum: 1, leader: '李四', phone: '13800138001', email: 'fe@example.com', status: '0', createTime: '2024-01-15 10:00:00' },
          { deptId: 102, deptName: '后端组', parentId: 100, orderNum: 2, leader: '王五', phone: '13800138002', email: 'be@example.com', status: '0', createTime: '2024-01-15 10:00:00' }
        ]
      },
      {
        deptId: 200,
        deptName: '市场部',
        parentId: 0,
        orderNum: 2,
        leader: '赵六',
        phone: '13800138003',
        email: 'market@example.com',
        status: '0',
        createTime: '2024-01-16 10:00:00'
      },
      {
        deptId: 300,
        deptName: '财务部',
        parentId: 0,
        orderNum: 3,
        leader: '钱七',
        phone: '13800138004',
        email: 'finance@example.com',
        status: '0',
        createTime: '2024-01-17 10:00:00'
      }
    ]
  })
}

// 查询部门详细
export function getDept(deptId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      deptId: deptId,
      deptName: '技术部',
      parentId: 0,
      orderNum: 1,
      leader: '张三',
      phone: '13800138000',
      email: 'tech@example.com',
      status: '0',
      createTime: '2024-01-15 10:00:00'
    }
  })
}

// 新增部门
export function addDept(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改部门
export function updateDept(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除部门
export function delDept(deptId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}
