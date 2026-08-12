import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import clipboard from './module/clipboard'

const install = function (app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('clipboard', clipboard)
  // dialogDrag 系列指令基于 Element UI el-dialog，迁移到 Ant Design Vue 后不再需要
}

export default install
