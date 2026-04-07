export function getStatMenuTreeData() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        menuId: 1,
        menuName: '百度统计',
        children: [
          { menuId: 11, menuName: '趋势分析' },
          { menuId: 12, menuName: '区域分布' },
          { menuId: 13, menuName: '来源分析' }
        ]
      },
      {
        menuId: 2,
        menuName: '内容统计',
        children: [
          { menuId: 21, menuName: '栏目统计' },
          { menuId: 22, menuName: '用户统计' }
        ]
      }
    ]
  })
}

export function getStatMenuTreeSelectorData() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { value: 1, label: '百度统计' },
      { value: 11, label: '趋势分析' },
      { value: 12, label: '区域分布' },
      { value: 13, label: '来源分析' },
      { value: 2, label: '内容统计' },
      { value: 21, label: '栏目统计' },
      { value: 22, label: '用户统计' }
    ]
  })
}
