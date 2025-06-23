/*
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2025-06-20 13:52:20
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-06-20 13:53:18
 * @FilePath: /cq-network-admin-view/src/views/cms/element/components/IconSelect/requireIcons.js
 * @Description: 
 * 
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved. 
 */

const req = require.context('../svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const icons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default icons
