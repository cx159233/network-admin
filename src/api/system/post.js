// 查询岗位列表
export function listPost(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { postId: 1, postCode: 'ceo', postName: '董事长', postSort: 1, status: '0', createTime: '2024-01-15 10:00:00' },
        { postId: 2, postCode: 'cto', postName: '技术总监', postSort: 2, status: '0', createTime: '2024-01-15 10:00:00' },
        { postId: 3, postCode: 'cfo', postName: '财务总监', postSort: 3, status: '0', createTime: '2024-01-15 10:00:00' },
        { postId: 4, postCode: 'manager', postName: '部门经理', postSort: 4, status: '0', createTime: '2024-01-15 10:00:00' },
        { postId: 5, postCode: 'developer', postName: '开发工程师', postSort: 5, status: '0', createTime: '2024-01-15 10:00:00' },
        { postId: 6, postCode: 'tester', postName: '测试工程师', postSort: 6, status: '0', createTime: '2024-01-15 10:00:00' }
      ],
      total: 6
    }
  })
}

// 查询岗位详细
export function getPost(postId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      postId: postId,
      postCode: 'developer',
      postName: '开发工程师',
      postSort: 5,
      status: '0',
      remark: '负责软件研发工作',
      createTime: '2024-01-15 10:00:00'
    }
  })
}

// 新增岗位
export function addPost(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改岗位
export function updatePost(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除岗位
export function delPost(postIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}
