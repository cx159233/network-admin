import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })
  return new Promise((resolve)=>{
    resolve({
      "code": 200,
      "msg": "SUCCESS",
      "data": [
          {
              "path": "/configs",
              "hidden": false,
              "redirect": "noRedirect",
              "component": "Layout",
              "alwaysShow": true,
              "meta": {
                  "title": "内容管理",
                  "icon": "documentation",
                  "noCache": false
              },
              "children": [
                  {
                      "name": "CmsContentcoreSite",
                      "path": "site",
                      "hidden": false,
                      "component": "cms/contentcore/site",
                      "meta": {
                          "title": "站点管理",
                          "icon": "cascader",
                          "noCache": false
                      }
                  },
                  {
                      "name": "CmsContentcoreCatalog",
                      "path": "catalog",
                      "hidden": false,
                      "component": "cms/contentcore/catalog",
                      "meta": {
                          "title": "栏目管理",
                          "icon": "tree-table",
                          "noCache": false
                      }
                  },
                  {
                      "name": "CmsContentcoreContent",
                      "path": "content",
                      "hidden": false,
                      "component": "cms/contentcore/content",
                      "meta": {
                          "title": "内容管理",
                          "icon": "list",
                          "noCache": false
                      }
                  },
                  {
                      "name": "CmsContentcoreResource",
                      "path": "resource",
                      "hidden": false,
                      "component": "cms/contentcore/resource",
                      "meta": {
                          "title": "数字应用管理",
                          "icon": "list",
                          "noCache": false
                      }
                  },
                  {
                    "name": "CmsContentcoreComponent",
                    "path": "component",
                    "hidden": false,
                    "component": "cms/contentcore/component-list",
                    "meta": {
                        "title": "能力组件管理",
                        "icon": "list",
                        "noCache": false
                    }
                }
              ]
          },
          {
              "path": "/operations",
              "hidden": false,
              "redirect": "noRedirect",
              "component": "Layout",
              "alwaysShow": true,
              "meta": {
                  "title": "互动运营",
                  "icon": "example",
                  "noCache": false
              },
              "children": [
                  {
                      "name": "CmsLinkLinkGroup",
                      "path": "link",
                      "hidden": false,
                      "component": "cms/link/linkGroup",
                      "meta": {
                          "title": "友链管理",
                          "icon": "link",
                          "noCache": false
                      }
                  }
              ]
          }
      ]
  })
  })
}
