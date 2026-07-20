/**
 * PRD 数据定义 — 运营管理后台 (cq-network-admin-view)
 *
 * 四个导出函数被 App.vue 引用，缺一不可：
 *   getAllPrdHtml()      → 拼接所有章节 HTML
 *   shouldShowPrd(path)   → 当前路由是否显示 PRD 分隔条
 *   getPrdAnchor(path)    → 当前页面对应的锚点 ID
 *   getPrdPageName(path)  → 当前页面对应的 PRD 页面名称
 */

// ── 章节数据 ──────────────────────────────────────────────

export const prdChapters = [
  {
    id: 0,
    title: '',
    content: `<h3 id="prd-3.1">3.1 控制台</h3>
<p><strong>入口页面：</strong>控制台</p>
<p><strong>页面描述：</strong>运营管理后台核心入口，包含我的应用、订单管理、工单管理等模块。</p>

<h3 id="prd-3.1.1">3.1.1 我的应用</h3>
<p><strong>入口页面：</strong>控制台 / 我的应用</p>
<p><strong>页面描述：</strong>对数字应用进行全生命周期管理，包括新增、修改、发布、下线、删除等操作。</p>

<h3 id="prd-3.1.1.1">3.1.1.1 应用列表</h3>
<p><strong>模块描述：</strong>我的应用 / 应用列表</p>
<p><strong>功能描述：</strong>展示数字应用列表，支持按应用名称、覆盖范围、面向对象和状态筛选，可进行新增、修改、发布、下线、删除操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康、基本公共卫生服务、家庭医生签约、村卫生室管理、辅助诊疗、区域综合、基本公共卫生服务绩效评价，默认不筛选</td></tr>
<tr><td>面向对象</td><td>target</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已发布、已驳回、已下线，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构提交的所有状态的应用数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover 数组各value，用;分割</td><td>完整展示，完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已发布、已驳回、已下线</td></tr>
<tr><td>应用服务商</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>平台评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
<tr><td>用户评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;font-family:Courier,monospace;white-space:pre;">
草稿 ------------(提交审核)---------→ 待审核 ------(审核通过)---------→ 已发布 ------------(下线)------------→ 已下线
 │                                    │                              │                                    │
 ├──(修改·提交审核)──→ 待审核            └──(审核驳回)──→ 已驳回        ├──(修改·提交审核)──→ 待审核            ├──(修改·提交审核)──→ 待审核
 ├──(修改·保存草稿)──→ 草稿                              │             └──(删除)                             └──(删除)
 └──(删除)                                             │
                                                      ├──(修改·提交审核)→ 待审核
                                                      └──(删除)
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>草稿</td><td></td><td>详情、修改、删除</td></tr>
<tr><td>待审核</td><td></td><td>详情</td></tr>
<tr><td>已发布</td><td></td><td>详情、修改、删除</td></tr>
<tr><td>已驳回</td><td></td><td>详情、修改、删除</td></tr>
<tr><td>已下线</td><td></td><td>详情、修改、删除</td></tr>
</table>
<p>注：下线仅由管理里通过数字应用管理可操作。</p>

<h3 id="prd-3.1.1.2">3.1.1.2 新增数字应用</h3>
<p><strong>模块描述：</strong>我的应用 / 新增数字应用</p>
<p><strong>功能描述：</strong>新增数字应用，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增】打开弹窗，标题"新增数字应用"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、BMP 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>应用描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入</td></tr>
<tr><td>系统地址</td><td>address</td><td>非必填，有效URL格式</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>非必填，多个用;分隔</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>必填，联系人姓名 + 手机号，以"-"分隔</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，格式同联系方式1</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>面向对象</td><td>dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
<tr><td>应用架构</td><td>dict表 SoftwareArchitecture</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>dict表 CloudProvider</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>基层应用覆盖范围</td><td>dict表 AppScope_PrimaryHospital</td><td>勾选"基层医疗卫生机构"时联动显示，支持多选，枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
	<tr><td>公立应用覆盖范围</td><td>dict表 AppScope_Hospital</td><td>勾选"公立医院"时联动显示，支持多选，枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
	<tr><td>医技应用覆盖范围</td><td>dict表 AppScope_MedicalPersonnel</td><td>勾选"医技护人员"时联动显示，支持多选，暂无可选项</td></tr>
</table>
<p>4、操作-保存草稿</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.1.3">3.1.1.3 编辑数字应用</h3>
<p><strong>模块描述：</strong>我的应用 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑数字应用，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【修改】打开弹窗，标题"修改数字应用"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原应用名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、BMP 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
<tr><td>应用描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原应用描述，可修改</td></tr>
<tr><td>系统地址</td><td>address</td><td>1.非必填，有效URL格式；<br>2.回显原系统地址，可修改</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>1.非必填，多个用;分隔；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>面向对象</td><td>dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原面向对象，可修改</td></tr>
<tr><td>应用架构</td><td>dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
	<tr><td>公立应用覆盖范围</td><td>dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
	<tr><td>医技应用覆盖范围</td><td>dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
</table>
<p>4、操作-保存草稿</p>
<p>仅状态为草稿时可点击【保存草稿-按钮】，其余状态按钮置灰不可点击。</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.1.4">3.1.1.4 数字应用详情</h3>
<p><strong>模块描述：</strong>我的应用 / 数字应用详情</p>
<p><strong>功能描述：</strong>查看数字应用的完整信息，包括基本信息、联系信息、分类标签、审核记录和评价信息，支持查看用户评价详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表页【详情】或评价链接，跳转至应用详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已发布、已驳回、已下线</td></tr>
<tr><td>系统地址</td><td>address</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用LOGO</td><td>logo</td><td>显示LOGO图片，为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出3行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>用户评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>评价数量</td><td></td><td>显示总条数，点击打开用户评价列表弹窗</td></tr>
</table>
<p id="prd-3.1.1.4.3.1">1）操作-用户评价列表</p>
<p>点击评价数量链接打开弹窗，展示所有用户评价，支持分页。</p>
<p>数据范围：该数字应用关联的所有评价数据。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>5星展示</td></tr>
<tr><td>服务/订单号</td><td></td><td>显示服务名称和订单号</td></tr>
<tr><td>评价机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已回复、待回复</td></tr>
<tr><td>回复内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>2）操作-关闭</p>
<p>点击弹窗右上角【关闭按钮】，关闭用户评价列表弹窗，停留当前页面。</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.1.1.5">3.1.1.5 删除数字应用</h3>
<p><strong>模块描述：</strong>我的应用 / 删除数字应用</p>
<p><strong>功能描述：</strong>删除数字应用，删除后不可恢复。仅草稿、已驳回、已发布、已下线状态可删除。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>草稿/已驳回/已发布/已下线状态，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭确认弹窗，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若存在关联数据，例如该数字应用已有关联订单，则不允许删除，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>
`
  },
  {
    id: 1,
    title: '',
    content: `<h3 id="prd-3.1.2">3.1.2 我的订单</h3>

<h3 id="prd-3.1.2.1">3.1.2.1 我发起的</h3>
<p><strong>入口页面：</strong>控制台 / 我的订单 / 我发起的</p>
<p><strong>页面描述：</strong>查看本机构发起的订单，支持按订单号、申请机构、服务名称、服务类型和状态筛选，跟踪订单执行流程。</p>

<h3 id="prd-3.1.2.1.1">3.1.2.1.1 我发起的列表</h3>
<p><strong>模块描述：</strong>我的订单 / 我发起的 / 我发起的列表</p>
<p><strong>功能描述：</strong>展示本机构发起的订单列表，支持按订单号、申请机构、服务名称、服务类型和状态筛选，可查看订单详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载当前机构订单列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>订单状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有状态为工单流转中、已完成、已评价、已驳回、已取消的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按申请时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
工单流转中 --(工单完成)---→ 已完成 --(评价)---→ 已评价
  ┆
  ├┄┄(驳回)┄┄→ 已驳回
  ┆
  └┄┄(取消)┄┄→ 已取消
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单流转中</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
<tr><td>已取消</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.2.1.2">3.1.2.1.2 我发起的详情</h3>
<p><strong>模块描述：</strong>我的订单 / 我发起的 / 我发起的详情</p>
<p><strong>功能描述：</strong>查看订单的完整信息，包括基本信息、流程进度和满意度评价，支持对已完成订单新增满意度评价。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击我发起的列表【详情】跳转至详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、订单基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>申请备注</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>3、关联工单</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单编号</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>工单标题</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>负责人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>查看工单</td><td></td><td>点击跳转至多云管理系统工单详情页，携带当前订单ID</td></tr>
</table>
<p>4、满意度评价</p>
<p>【新增满意度评价-按钮】始终展示。仅当来源为"我发起的"且订单状态为"已完成"且未评价时按钮可点击，其余情况（来源为"我收到的"、订单状态非"已完成"、已评价）按钮置灰不可点击。评价字段始终展示，为空时显示"--"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>满意度评分</td><td></td><td>5星评分，为空时显示"--"</td></tr>
<tr><td>评价描述</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
</table>
<p>5、操作-新增满意度评价</p>
<p>仅当来源为"我发起的"且订单状态为"已完成"且未评价时【新增满意度评价-按钮】可点击，点击打开满意度评价弹窗；其余情况按钮置灰不可点击。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>满意度评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>评价描述</td><td></td><td>非必填，多行文本</td></tr>
</table>
<p>1）操作-提交评价</p>
<p>点击【提交评价-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请选择满意度评分</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，订单状态变更为已评价，关闭弹窗，进行消息提示，刷新页面</p>
<p style="font-style:italic; color:#999">Tip：评价提交成功</p>
<p>2）操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存评价内容，停留当前页面。</p>
<p>6、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.1.2.2">3.1.2.2 我收到的</h3>
<p><strong>入口页面：</strong>控制台 / 我的订单 / 我收到的</p>
<p><strong>页面描述：</strong>查看指派给本机构的订单，支持按订单号、申请机构、服务名称、服务类型和状态筛选，对收到的订单进行处理。</p>

<h3 id="prd-3.1.2.2.1">3.1.2.2.1 我收到的列表</h3>
<p><strong>模块描述：</strong>我的订单 / 我收到的 / 我收到的列表</p>
<p><strong>功能描述：</strong>展示本机构收到的订单列表，支持按订单号、申请机构、服务名称、服务类型和状态筛选，可查看订单详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载当前机构收到的订单列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>订单状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有状态为工单流转中、已完成、已评价、已驳回、已取消的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按申请时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
工单流转中 --(工单完成)---→ 已完成 --(评价)---→ 已评价
  ┆
  ├┄┄(驳回)┄┄→ 已驳回
  ┆
  └┄┄(取消)┄┄→ 已取消
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单流转中</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
<tr><td>已取消</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.2.2.2">3.1.2.2.2 我收到的详情</h3>
<p><strong>模块描述：</strong>我的订单 / 我收到的 / 我收到的详情</p>
<p><strong>功能描述：</strong>查看订单的完整信息，包括基本信息、流程进度和满意度评价。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击我收到的列表【详情】跳转至详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、订单基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>申请备注</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>3、关联工单</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单编号</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>工单标题</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>负责人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>查看工单</td><td></td><td>点击跳转至多云管理系统工单详情页，携带当前订单ID</td></tr>
</table>
<p>4、满意度评价</p>
<p>【新增满意度评价-按钮】始终展示但置灰不可点击（来源为"我收到的"，仅"我发起的"且状态为"已完成"且未评价时可点击）。评价字段始终展示，为空时显示"--"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>满意度评分</td><td></td><td>5星评分，为空时显示"--"</td></tr>
<tr><td>评价描述</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
</table>
<p>5、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.1.3">3.1.3 我的需求</h3>

<h3 id="prd-3.1.3.1">3.1.3.1 发起需求</h3>
<p><strong>入口页面：</strong>控制台 / 我的需求 / 发起需求</p>
<p><strong>页面描述：</strong>管理本机构发起的需求，支持新增需求、查看详情和关闭需求操作。</p>

<h3 id="prd-3.1.3.1.1">3.1.3.1.1 发起需求列表</h3>
<p><strong>模块描述：</strong>我的需求 / 发起需求 / 发起需求列表</p>
<p><strong>功能描述：</strong>展示本机构发起的需求列表，支持按需求编号、申请机构、服务类型和状态筛选。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载需求列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构发起的所有状态的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：#DM-YYYY-序号，完整展示，超出换行</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)---→ 已响应 --(完成)---→ 已完成
  ┆                   ┆
  └┄┄(关闭)           └┄┄(关闭)┄┄→ 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>详情、关闭</td></tr>
<tr><td>已响应</td><td></td><td>详情、关闭</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.3.1.2">3.1.3.1.2 新增需求</h3>
<p><strong>模块描述：</strong>我的需求 / 发起需求 / 新增需求</p>
<p><strong>功能描述：</strong>新增一条需求，设置服务类型、需求描述和期望时间后发布。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增需求-按钮】打开新增需求弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>申请机构</td><td></td><td>必填，默认带入当前登录用户所属机构，只读不可修改</td></tr>
<tr><td>服务类型</td><td></td><td>必填，枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>需求描述</td><td></td><td>必填，多行文本</td></tr>
<tr><td>期望时间</td><td></td><td>非必填，日期选择，格式：yyyy-MM-dd</td></tr>
</table>
<p>2、操作-发布</p>
<p>点击【发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">申请机构名称为空：请输入申请机构名称</p>
<p style="font-style:italic; color:#999">服务类型为空：请选择服务类型</p>
<p style="font-style:italic; color:#999">需求描述为空：请输入需求描述</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，状态变更为已发布，系统自动生成需求编号（格式：#DM-YYYY-序号），关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：需求发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.3.1.3">3.1.3.1.3 关闭需求</h3>
<p><strong>模块描述：</strong>我的需求 / 发起需求 / 关闭需求</p>
<p><strong>功能描述：</strong>关闭一条待响应状态的需求，关闭后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>仅待响应状态可操作关闭，点击列表操作栏【关闭-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行关闭，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为已关闭，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：需求已关闭</p>

<h3 id="prd-3.1.3.1.4">3.1.3.1.4 发起需求-详情</h3>
<p><strong>模块描述：</strong>我的需求 / 发起需求 / 发起需求-详情</p>
<p><strong>功能描述：</strong>查看本机构发起的需求详细信息，包括需求信息和响应信息（如有）。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在发起需求列表中点击【详情-按钮】跳转至发起需求详情页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>申请人</td><td></td><td>完整展示</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求描述</td><td></td><td>完整展示，超出换行</td></tr>
</table>
<p>2、响应信息</p>
<p>仅当需求状态为已响应、已完成时展示响应信息；待响应、已关闭状态时不展示。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>

<h3 id="prd-3.1.3.2">3.1.3.2 响应需求</h3>
<p><strong>入口页面：</strong>控制台 / 我的需求 / 响应需求</p>
<p><strong>页面描述：</strong>查看平台所有需求和本机构的响应记录，可对需求进行响应，查看需求详情和响应详情。</p>

<h3 id="prd-3.1.3.2.1">3.1.3.2.1 响应需求列表</h3>
<p><strong>模块描述：</strong>我的需求 / 响应需求 / 响应需求列表</p>
<p><strong>功能描述：</strong>展示所有需求和本机构的响应记录，支持按需求编号、申请机构、服务类型筛选。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载需求列表，默认展示"所有需求"标签页。</p>
<p><strong>详细设计：</strong></p>
<p>1、标签页切换</p>
<p>页面顶部提供两个标签页：所有需求、我的响应。点击标签切换对应列表，筛选条件共用。</p>
<p>2、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>3、所有需求-列表展示</p>
<p>1）数据范围为所有机构发布的状态为待响应的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：#DM-YYYY-序号，完整展示，超出换行</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>固定为"待响应"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>5）操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)----> 已响应 --(完成)----> 已完成
  ┆                   ┆
  └┄┄(关闭)           └┄┄(关闭)┄┄-> 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>响应、详情</td></tr>
</table>
<p>4、我的响应-列表展示</p>
<p>1）数据范围为当前机构响应的状态为已响应、已完成、已关闭的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按响应时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：#DM-YYYY-序号，完整展示，超出换行</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：已响应、已完成、已关闭</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>5）操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)----> 已响应 --(完成)----> 已完成
  ┆                   ┆
  └┄┄(关闭)           └┄┄(关闭)┄┄-> 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>已响应</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.3.2.2">3.1.3.2.2 响应需求</h3>
<p><strong>模块描述：</strong>我的需求 / 响应需求 / 响应需求</p>
<p><strong>功能描述：</strong>对待响应状态的需求提交响应方案，包括响应内容、预估报价和预计工期。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表中仅待响应状态展示【响应-按钮】，点击打开响应弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>只读，回显当前需求编号</td></tr>
<tr><td>服务类型</td><td></td><td>只读，回显当前需求服务类型</td></tr>
<tr><td>申请机构</td><td></td><td>只读，回显当前需求申请机构</td></tr>
<tr><td>申请人</td><td></td><td>只读，回显当前需求申请人</td></tr>
<tr><td>发布时间</td><td></td><td>只读，回显当前需求发布时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求描述</td><td></td><td>只读，回显当前需求描述，多行文本</td></tr>
<tr><td>响应内容</td><td></td><td>必填，多行文本，描述解决方案、技术方案和交付计划</td></tr>
<tr><td>预估报价</td><td></td><td>必填，数字输入，单位为元</td></tr>
<tr><td>预计工期</td><td></td><td>非必填，文本输入</td></tr>
</table>
<p>2、操作-提交响应</p>
<p>点击【提交响应-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">响应内容为空：请输入响应内容</p>
<p style="font-style:italic; color:#999">预估报价为空：请输入预估报价</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，状态变更为已响应，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：响应提交成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.3.2.3">3.1.3.2.3 所有需求-详情</h3>
<p><strong>模块描述：</strong>我的需求 / 响应需求 / 所有需求 / 所有需求-详情</p>
<p><strong>功能描述：</strong>查看需求详细信息，包括需求基本信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在"所有需求"标签页中点击【详情-按钮】跳转至所有需求详情页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>申请人</td><td></td><td>完整展示</td></tr>
<tr><td>状态</td><td></td><td>固定为"待响应"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求描述</td><td></td><td>完整展示，超出换行</td></tr>
</table>

<h3 id="prd-3.1.3.2.4">3.1.3.2.4 我的响应-详情</h3>
<p><strong>模块描述：</strong>我的需求 / 响应需求 / 我的响应 / 我的响应-详情</p>
<p><strong>功能描述：</strong>查看本机构对需求的响应详情，包括需求信息和响应信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在"我的响应"标签页中点击【详情-按钮】跳转至我的响应详情页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>申请人</td><td></td><td>完整展示</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求描述</td><td></td><td>完整展示，超出换行</td></tr>
</table>
<p>2、响应信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>`
  },
  {
    id: 2,
    title: '',
    content: `<h3 id="prd-3.2">3.2 服务目录管理</h3>

<h3 id="prd-3.2.1">3.2.1 数字应用管理</h3>
<p><strong>入口页面：</strong>门户管理 / 服务目录管理 / 数字应用管理</p>
<p><strong>页面描述：</strong>管理平台数字应用的全生命周期，支持按应用名称、覆盖范围、面向对象和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>

<h3 id="prd-3.2.1.1">3.2.1.1 数字应用列表</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 数字应用列表</p>
<p><strong>功能描述：</strong>展示平台数字应用列表，支持按应用名称、覆盖范围、面向对象和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载应用列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康、基本公共卫生服务、家庭医生签约、村卫生室管理、辅助诊疗、区域综合、基本公共卫生服务绩效评价，默认不筛选</td></tr>
<tr><td>面向对象</td><td>target</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已发布、已下线，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的状态为已发布、已下线的数据</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover 数组各value，用;分割</td><td>完整展示，完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已发布、已下线</td></tr>
<tr><td>应用服务商</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>平台评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
<tr><td>用户评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已发布 --(下线)----------------------------------------→ 已下线
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已发布</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下线</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.1.2">3.2.1.2 新增数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 新增数字应用</p>
<p><strong>功能描述：</strong>新增一个数字应用，设置基本信息、联系信息、分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】打开新增弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、BMP 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>应用描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入</td></tr>
<tr><td>系统地址</td><td>address</td><td>非必填，有效URL格式</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>非必填，多个用;分隔</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>必填，联系人姓名 + 手机号，以"-"分隔</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，格式同联系方式1</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>面向对象</td><td>dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
<tr><td>应用架构</td><td>dict表 SoftwareArchitecture</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>dict表 CloudProvider</td><td>必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
<tr><td>基层应用覆盖范围</td><td>dict表 AppScope_PrimaryHospital</td><td>勾选"基层医疗卫生机构"时联动显示，支持多选，枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>dict表 AppScope_Hospital</td><td>勾选"公立医院"时联动显示，支持多选，枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>dict表 AppScope_MedicalPersonnel</td><td>勾选"医技护人员"时联动显示，支持多选，暂无可选项</td></tr>
</table>
<p>4、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>5、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.1.3">3.2.1.3 编辑数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑已有数字应用的基本信息、联系信息和分类标签，直接发布后管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】打开编辑弹窗，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增弹窗相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原应用名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、BMP 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
<tr><td>应用描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原应用描述，可修改</td></tr>
<tr><td>系统地址</td><td>address</td><td>1.非必填，有效URL格式；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>1.非必填，多个用;分隔；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>面向对象</td><td>dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原面向对象，可修改</td></tr>
<tr><td>应用架构</td><td>dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>
<p>4、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.1.4">3.2.1.4 数字应用详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 数字应用详情</p>
<p><strong>功能描述：</strong>查看数字应用的完整信息，包括基本信息、审核记录和评价信息，支持查看用户评价详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】或应用名称跳转至详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已发布、已下线</td></tr>
<tr><td>系统地址</td><td>address</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用LOGO</td><td>logo</td><td>显示LOGO图片，为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出3行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>用户评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>评价数量</td><td></td><td>显示总条数，点击打开用户评价列表弹窗</td></tr>
</table>
<p id="prd-3.2.1.4.3.1">1）操作-用户评价列表</p>
<p>点击评价数量链接打开弹窗，展示所有用户评价，支持分页。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>5星展示</td></tr>
<tr><td>服务/订单号</td><td></td><td>显示服务名称和订单号</td></tr>
<tr><td>评价机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已回复、待回复</td></tr>
<tr><td>回复内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>2）操作-关闭</p>
<p>点击弹窗右上角【关闭按钮】，关闭用户评价列表弹窗，停留当前页面。</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.2.1.5">3.2.1.5 发布数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 发布数字应用</p>
<p><strong>功能描述：</strong>将已下线状态的数字应用发布上线，发布后应用状态变更为发布。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下线状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-发布</p>
<p>点击【发布-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>

<h3 id="prd-3.2.1.6">3.2.1.6 下线数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 下线数字应用</p>
<p><strong>功能描述：</strong>将已发布的数字应用下线，下线后应用状态变更为下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已发布状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-下线</p>
<p>点击【下线-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，以 status='已下线' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.1.7">3.2.1.7 删除数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 删除数字应用</p>
<p><strong>功能描述：</strong>删除数字应用，删除后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>选中一条或多条记录，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若存在关联数据，例如该数字应用已有关联订单，则不允许删除，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.2">3.2.2 能力组件管理</h3>
<p><strong>入口页面：</strong>门户管理 / 服务目录管理 / 能力组件管理</p>
<p><strong>页面描述：</strong>管理平台能力组件的全生命周期，支持按组件名称、开放范围和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>

<h3 id="prd-3.2.2.1">3.2.2.1 能力组件列表</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 能力组件列表</p>
<p><strong>功能描述：</strong>展示平台能力组件列表，支持按组件名称、开放范围和状态筛选，可进行新增、修改、删除、发布、下线、同步数据操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载组件列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已发布、已下线，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的状态为已发布、已下线的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>能力组件ID</td><td>componentId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已发布、已下线</td></tr>
<tr><td>组件服务商</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>平台评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
<tr><td>用户评价</td><td></td><td>显示评分数值，点击跳转应用详情页</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已发布 --(下线)----------------------------------------→ 已下线
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已发布</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下线</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.2.2">3.2.2.2 新增能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 新增能力组件</p>
<p><strong>功能描述：</strong>新增一个能力组件，设置基本信息、联系信息和分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】打开新增弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件名称</td><td>name</td><td>必填，文本输入</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>非必填，支持 JPG、PNG、JPEG、BMP 格式，大小限制 1MB 以内；<br>上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>重复上传覆盖之前图片，自动删除前一个图片</td></tr>
<tr><td>组件描述</td><td>description</td><td>必填，多行文本</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>非必填，文本输入</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填，包含联系人姓名和联系电话</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，包含联系人姓名和联系电话</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>必填，枚举：不限、市级、区（县）域</td></tr>
</table>
<p>4、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">组件名称为空：请输入组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>5、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.2.3">3.2.2.3 编辑能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 编辑能力组件</p>
<p><strong>功能描述：</strong>编辑已有能力组件的基本信息、联系信息和分类标签。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】打开编辑弹窗，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增弹窗相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件名称</td><td>name</td><td>必填，文本输入；回显原组件名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>非必填；回显原LOGO，可修改；<br>重复上传覆盖之前图片，自动删除前一个图片</td></tr>
<tr><td>组件描述</td><td>description</td><td>必填，多行文本；回显原组件描述，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前；回显原显示顺序，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>非必填；回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填；回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填；回显原联系方式2，可修改</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>必填；回显原云服务商，可修改</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>必填；回显原开放范围，可修改</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">组件名称为空：请输入组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.2.4">3.2.2.4 能力组件详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 能力组件详情</p>
<p><strong>功能描述：</strong>查看能力组件的完整信息，包括基本信息、分类标签、审核记录和评价信息，支持查看用户评价详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】或组件名称跳转至详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件ID</td><td>componentId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>组件名称</td><td>name</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已发布、已下线</td></tr>
<tr><td>显示顺序</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>用户评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>评价数量</td><td></td><td>显示总条数，点击打开用户评价列表弹窗</td></tr>
</table>
<p><p id="prd-3.2.2.4.3.1">1）操作-用户评价列表</p>
<p>点击评价数量链接打开弹窗，展示所有用户评价，支持分页。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>5星展示</td></tr>
<tr><td>服务/订单号</td><td></td><td>显示服务名称和订单号</td></tr>
<tr><td>评价机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已回复、待回复</td></tr>
<tr><td>回复内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>2）操作-关闭</p>
<p>点击弹窗右上角【关闭按钮】，关闭用户评价列表弹窗，停留当前页面。</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.2.2.5">3.2.2.5 发布能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 发布能力组件</p>
<p><strong>功能描述：</strong>将已下线状态的能力组件发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下线状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-发布</p>
<p>点击【发布-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>

<h3 id="prd-3.2.2.6">3.2.2.6 下线能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 下线能力组件</p>
<p><strong>功能描述：</strong>将已发布的能力组件下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已发布状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-下线</p>
<p>点击【下线-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为已下线，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.2.7">3.2.2.7 删除能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 删除能力组件</p>
<p><strong>功能描述：</strong>删除能力组件，删除后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>选中一条或多条记录，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.3">3.2.3 基础服务管理</h3>
<p><strong>入口页面：</strong>门户管理 / 服务目录管理 / 基础服务管理</p>
<p><strong>页面描述：</strong>管理平台基础服务的全生命周期，支持按服务名称、云服务商和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>

<h3 id="prd-3.2.3.1">3.2.3.1 基础服务列表</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 基础服务列表</p>
<p><strong>功能描述：</strong>展示平台基础服务列表，支持按服务名称、云服务商和状态筛选，可进行新增、修改、删除、发布、下线、同步数据操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载服务列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>云服务商</td><td></td><td>枚举：影像云、电信云、移动云、联通云、浪潮云，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：已发布、已下线，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的状态为已发布、已下线的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务ID</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>区域</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已发布、已下线</td></tr>
<tr><td>平台评价</td><td></td><td>显示评分分值，可点击打开评价弹窗</td></tr>
<tr><td>用户评价</td><td></td><td>显示评分分值，可点击打开评价弹窗</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已发布 --(下线)----------------------------------------→ 已下线
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已发布（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已发布</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下线</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.3.2">3.2.3.2 新增基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 新增基础服务</p>
<p><strong>功能描述：</strong>新增一个基础服务，设置基本信息后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】打开新增弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>必填，文本输入</td></tr>
<tr><td>服务描述</td><td></td><td>必填，多行文本</td></tr>
<tr><td>服务类型</td><td></td><td>必填，枚举：计算服务、存储服务、网络服务、安全服务、大数据服务、数据库服务、备份容灾服务、软件与应用服务、机房托管服务</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云</td></tr>
<tr><td>区域</td><td></td><td>必填，枚举：华东、华北、华南、西南</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">服务名称为空：请输入服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务类型为空：请选择服务类型</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">区域为空：请选择区域</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.3.3">3.2.3.3 编辑基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 编辑基础服务</p>
<p><strong>功能描述：</strong>编辑已有基础服务的基本信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】打开编辑弹窗，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增弹窗相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>必填，文本输入；回显原服务名称，可修改</td></tr>
<tr><td>服务描述</td><td></td><td>必填，多行文本；回显原服务描述，可修改</td></tr>
<tr><td>服务类型</td><td></td><td>必填；回显原服务类型，可修改</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>必填；回显原云服务商，可修改</td></tr>
<tr><td>区域</td><td></td><td>必填；回显原区域，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前；回显原显示顺序，可修改</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">服务名称为空：请输入服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务类型为空：请选择服务类型</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">区域为空：请选择区域</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.3.4">3.2.3.4 基础服务详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 基础服务详情</p>
<p><strong>功能描述：</strong>查看基础服务的完整信息，包括基本信息、审核记录和评价信息，支持查看用户评价详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】或服务名称跳转至详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>区域</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>附件材料</td><td></td><td>显示附件名称列表，点击下载</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>用户评价</td><td></td><td>5星评分，显示评分数值</td></tr>
<tr><td>评价数量</td><td></td><td>显示总条数，点击打开用户评价列表弹窗</td></tr>
</table>
<p><p id="prd-3.2.3.4.3.1">1）操作-用户评价列表</p>
<p>点击评价数量链接打开弹窗，展示所有用户评价，支持分页。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>5星展示</td></tr>
<tr><td>服务/订单号</td><td></td><td>显示服务名称和订单号</td></tr>
<tr><td>评价机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已回复、待回复</td></tr>
<tr><td>回复内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>2）操作-关闭</p>
<p>点击弹窗右上角【关闭按钮】，关闭用户评价列表弹窗，停留当前页面。</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.2.3.5">3.2.3.5 发布基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 发布基础服务</p>
<p><strong>功能描述：</strong>将已下线状态的基础服务发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下线状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-发布</p>
<p>点击【发布-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，以 status='已发布' 提交，管理员默认通过审核，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>

<h3 id="prd-3.2.3.6">3.2.3.6 下线基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 下线基础服务</p>
<p><strong>功能描述：</strong>将已发布的基础服务下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已发布状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-下线</p>
<p>点击【下线-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为已下线，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.3.7">3.2.3.7 删除基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 删除基础服务</p>
<p><strong>功能描述：</strong>删除基础服务，删除后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>选中一条或多条记录，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.3">3.3 服务备案审核</h3>

<h3 id="prd-3.3.1">3.3.1 机构入驻审核</h3>
<p><strong>入口页面：</strong>门户管理 / 服务备案审核 / 机构入驻审核</p>
<p><strong>页面描述：</strong>审核机构的入驻资质申请，可查看机构提交的资质信息并进行审核通过或驳回操作。</p>

<h3 id="prd-3.3.1.1">3.3.1.1 机构入驻审核列表</h3>
<p><strong>模块描述：</strong>服务备案审核 / 机构入驻审核 / 机构入驻审核列表</p>
<p><strong>功能描述：</strong>展示待审核的机构入驻申请列表，支持按机构名称、机构代码和审核状态筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载审核列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td>orgName</td><td>支持模糊搜索</td></tr>
<tr><td>机构代码</td><td>orgCode</td><td>支持模糊搜索</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的审核状态为待审核、已通过、已拒绝的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>法人代表</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝</td></tr>
</table>

<h3 id="prd-3.3.1.2">3.3.1.2 审核详情</h3>
<p><strong>模块描述：</strong>服务备案审核 / 机构入驻审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看机构入驻申请的详细资质信息，进行审核通过或驳回操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】或【详情-按钮】跳转至审核详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>法人代表</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>机构类型</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>所属区域</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>机构地址</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>资质材料</td><td></td><td>显示资质文件名称列表，点击下载</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-审核</p>
<p>点击【审核-按钮】，跳转至审核详情页面。</p>
<p>1）操作-审核通过</p>
<p>点击【审核通过-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：审核通过</p>
<p>2）操作-驳回申请</p>
<p>点击【驳回申请-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：驳回成功</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回机构入驻审核列表页。</p>

<h3 id="prd-3.3.2">3.3.2 数字应用审核</h3>
<p><strong>入口页面：</strong>门户管理 / 服务备案审核 / 数字应用审核</p>
<p><strong>页面描述：</strong>审核平台数字应用的备案申请，支持按应用名称、覆盖范围、面向对象和审核状态筛选，可进行审核通过或驳回操作。</p>

<h3 id="prd-3.3.2.1">3.3.2.1 数字应用审核列表</h3>
<p><strong>模块描述：</strong>服务备案审核 / 数字应用审核 / 数字应用审核列表</p>
<p><strong>功能描述：</strong>展示待审核的数字应用列表，支持按应用名称、覆盖范围、面向对象和审核状态筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载审核列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>枚举：基本公共卫生服务、医院信息系统（HIS）、家庭医生签约、实验室信息管理系统（LIS）、影像归档和通信系统（PACS），默认不筛选</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的审核状态为待审核、已通过、已拒绝的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover 数组各value，用;分割</td><td>多值以分号分隔展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝</td></tr>
<tr><td>应用服务商</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>

<h3 id="prd-3.3.2.2">3.3.2.2 审核详情</h3>
<p><strong>模块描述：</strong>服务备案审核 / 数字应用审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看数字应用备案的详细信息，进行审核通过或驳回操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】或【详情-按钮】跳转至审核详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>系统地址</td><td>address</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用LOGO</td><td>logo</td><td>显示缩略图，未上传时显示"未上传"</td></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>应用描述</td><td>description</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-审核</p>
<p>点击【审核-按钮】，跳转至审核详情页面。</p>
<p>1）操作-审核通过</p>
<p>点击【审核通过-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：审核通过</p>
<p>2）操作-驳回申请</p>
<p>点击【驳回申请-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：驳回成功</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回数字应用审核列表页。</p>

<h3 id="prd-3.3.3">3.3.3 能力组件审核</h3>
<p><strong>入口页面：</strong>门户管理 / 服务备案审核 / 能力组件审核</p>
<p><strong>页面描述：</strong>审核平台能力组件的备案申请，支持按组件名称、开放范围和审核状态筛选，可进行审核通过或驳回操作。</p>

<h3 id="prd-3.3.3.1">3.3.3.1 能力组件审核列表</h3>
<p><strong>模块描述：</strong>服务备案审核 / 能力组件审核 / 能力组件审核列表</p>
<p><strong>功能描述：</strong>展示待审核的能力组件列表，支持按组件名称、开放范围和审核状态筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载审核列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的审核状态为待审核、已通过、已拒绝的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>能力组件ID</td><td>componentId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝</td></tr>
<tr><td>组件服务商</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>

<h3 id="prd-3.3.3.2">3.3.3.2 审核详情</h3>
<p><strong>模块描述：</strong>服务备案审核 / 能力组件审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看能力组件备案的详细信息，进行审核通过或驳回操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】跳转至审核详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件名称</td><td>name</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>组件ID</td><td>componentId</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>组件描述</td><td>description</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<!-- <tr><td>附件材料</td><td></td><td>显示附件名称列表，点击下载</td></tr> -->
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-审核</p>
<p>点击【审核-按钮】，跳转至审核详情页面。</p>
<p>1）操作-审核通过</p>
<p>点击【审核通过-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：审核通过</p>
<p>2）操作-驳回申请</p>
<p>点击【驳回申请-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：驳回成功</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回能力组件审核列表页。</p>

<h3 id="prd-3.3.4">3.3.4 基础服务审核</h3>
<p><strong>入口页面：</strong>门户管理 / 服务备案审核 / 基础服务审核</p>
<p><strong>页面描述：</strong>审核平台基础服务的备案申请，支持按服务名称、云服务商和审核状态筛选，可进行审核通过或驳回操作。</p>

<h3 id="prd-3.3.4.1">3.3.4.1 基础服务审核列表</h3>
<p><strong>模块描述：</strong>服务备案审核 / 基础服务审核 / 基础服务审核列表</p>
<p><strong>功能描述：</strong>展示待审核的基础服务列表，支持按服务名称、云服务商和审核状态筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载审核列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>云服务商</td><td></td><td>枚举：影像云、电信云、移动云、联通云、浪潮云，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的审核状态为待审核、已通过、已拒绝的数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务ID</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>区域</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已拒绝</td></tr>
</table>

<h3 id="prd-3.3.4.2">3.3.4.2 审核详情</h3>
<p><strong>模块描述：</strong>服务备案审核 / 基础服务审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看基础服务备案的详细信息，进行审核通过或驳回操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】或【详情-按钮】跳转至审核详情页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务ID</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>服务范围</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务等级</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<!-- <tr><td>附件材料</td><td></td><td>显示附件名称列表，点击下载</td></tr> -->
</table>
<p>2、审核记录</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-审核</p>
<p>点击【审核-按钮】，跳转至审核详情页面。</p>
<p>1）操作-审核通过</p>
<p>点击【审核通过-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：审核通过</p>
<p>2）操作-驳回申请</p>
<p>点击【驳回申请-按钮】，判断逻辑如下：</p>
<p>a.若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">审核意见为空：请填写审核意见</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，状态变更为已通过，进行消息提示，返回审核列表</p>
<p style="font-style:italic; color:#999">Tip：驳回成功</p>
<p>4、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回基础服务审核列表页。</p>

<h3 id="prd-3.4">3.4 订单管理</h3>

<h3 id="prd-3.4.1">3.4.1 所有订单</h3>
<p><strong>入口页面：</strong>门户管理 / 订单管理 / 所有订单</p>
<p><strong>页面描述：</strong>管理平台所有订单，支持按订单号、机构名称、服务名称、服务类型和状态筛选，可查看订单详情。</p>

<h3 id="prd-3.4.1.1">3.4.1.1 订单列表</h3>
<p><strong>模块描述：</strong>订单管理 / 所有订单 / 订单列表</p>
<p><strong>功能描述：</strong>展示平台全部订单列表，支持按订单号、机构名称、服务名称、服务类型和状态筛选，可查看订单详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载订单列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有状态为工单流转中、已完成、已评价、已驳回、已取消的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按申请时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>订单号</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
提交申请 --(系统派发)---→ 工单流转中 --(服务交付)---→ 已完成 --(用户评价)---→ 已评价
                                  ┆                       ┆
                                  └┄┄(驳回)┄┄→ 已驳回       └┄┄(取消)┄┄→ 已取消
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单流转中</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
<tr><td>已取消</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.4.2">3.4.2 订单详情</h3>
<p><strong>模块描述：</strong>订单管理 / 所有订单 / 订单详情</p>
<p><strong>功能描述：</strong>查看订单的完整信息，包括基本信息、流程进度、满意度评价、关联工单和订单操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】跳转至订单详情页。</p>
<p><strong>详细设计：</strong></p>
<p>详情页分为左右两栏，左侧展示订单信息和流程进度，右侧展示关联工单和订单操作。</p>
<p>1、订单基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务规格</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>申请备注</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>2、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
<tr><td>处理人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>3、满意度评价</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>满意度评分</td><td></td><td>5星评分，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
</table>
<p>4、关联工单</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单编号</td><td></td><td>完整展示，可点击跳转工单详情</td></tr>
<tr><td>工单标题</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>负责人</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>查看工单</td><td></td><td>点击跳转至多云管理系统工单详情页，携带当前订单ID</td></tr>
</table>
<!--
<p>5、操作-取消订单</p>
<p>1）操作-取消</p>
<p>点击【取消-按钮】，关闭对话框，停留当前页面。</p>
<p>2）操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>a.若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>b.若满足条件，状态变更为已取消，关闭此对话框，进行消息提示，刷新页面</p>
<p style="font-style:italic; color:#999">Tip：订单已取消</p>
-->
<p>6、操作-返回列表</p>
<p>点击【返回列表-按钮】，返回订单列表页。</p>

<h3 id="prd-3.4.3">3.4.3 服务评价</h3>
<p><strong>模块描述：</strong>订单管理 / 所有订单 / 服务评价</p>
<p><strong>功能描述：</strong>展示平台所有服务评价列表，支持按关键字、服务、评分、状态筛选，可对评价进行回复或查看回复详情。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载评价列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>机构名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>评分</td><td></td><td>枚举：所有评分、5星、4星、3星及以下，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：所有状态、待回复、已回复，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的所有服务评价数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按评价时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>5星展示，为空时显示"--"</td></tr>
<tr><td>服务/订单号</td><td></td><td>展示服务名称和订单号，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，为空时显示"--"</td></tr>
<tr><td>评价机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：待回复、已回复</td></tr>
<tr><td>回复内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm，为空时显示"--"</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待回复</td><td></td><td>回复</td></tr>
<tr><td>已回复</td><td></td><td>查看</td></tr>
</table>
<p>4、操作-回复</p>
<p>仅状态为"待回复"时展示【回复-按钮】，点击打开回复弹窗。</p>
<p>弹窗包含两部分：</p>
<p>1）评价信息（只读）：评价人、所属部门、评价机构、服务名称、订单号、评分、评价内容</p>
<p>2）回复信息（可编辑）：回复内容，多行文本，必填</p>
<p>点击【提交回复-按钮】，判断逻辑如下：</p>
<p>1）若回复内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请输入回复内容</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，状态变更为已回复，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：回复成功</p>
<p>5、操作-查看</p>
<p>仅状态为"已回复"时展示【查看-按钮】，点击打开评价详情弹窗。</p>
<p>弹窗包含两部分：</p>
<p>1）评价信息（只读）：评价人、所属部门、评价机构、服务名称、订单号、评分、评价内容</p>
<p>2）客服回复（只读）：回复内容、回复时间</p>
<p>6、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.5">3.5 需求管理</h3>

<h3 id="prd-3.5.1">3.5.1 所有需求</h3>
<p><strong>入口页面：</strong>门户管理 / 需求管理 / 所有需求</p>
<p><strong>页面描述：</strong>管理平台所有需求，支持按需求编号、机构名称、服务类型和状态筛选，可查看需求详情。</p>

<h3 id="prd-3.5.1.1">3.5.1.1 需求列表</h3>
<p><strong>模块描述：</strong>需求管理 / 所有需求 / 需求列表</p>
<p><strong>功能描述：</strong>展示平台全部需求列表，支持按需求编号、机构名称、服务类型和状态筛选，可查看需求详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面自动加载需求列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭，默认不筛选</td></tr>
<tr><td>搜索按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构的所有状态的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：#DM-YYYY-序号，完整展示，超出换行</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)---→ 已响应 --(完成)---→ 已完成
  ┆                   ┆
  └┄┄(关闭)           └┄┄(关闭)┄┄→ 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>详情</td></tr>
<tr><td>已响应</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>
<p>4、操作-查看详情</p>
	<p>点击列表【详情-按钮】，跳转至需求详情页面。</p>

<h3 id="prd-3.5.1.2">3.5.1.2 需求详情</h3>
<p><strong>模块描述：</strong>需求管理 / 所有需求 / 需求详情</p>
<p><strong>功能描述：</strong>查看需求详细信息，包括需求信息和响应信息（如有）。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在所有需求列表中点击【详情-按钮】跳转至需求详情页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用服务、能力组件服务、安全服务、基础资源服务</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>申请人</td><td></td><td>完整展示</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求描述</td><td></td><td>完整展示，超出换行</td></tr>
</table>
<p>2、响应信息</p>
<p>仅当需求状态为已响应、已完成时展示响应信息；待响应、已关闭状态时不展示。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，超出换行</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
`
  }
]

// ── 路由映射 ──────────────────────────────────────────────

const routePrdMap = {
  // 3.1 控制台 - 我的应用
  '/workorder/myApps':                  { anchor: 'prd-3.1.1', pageName: '我的应用' },
  '/workorder/myAppsDetail':            { anchor: 'prd-3.1.1.4', pageName: '数字应用详情' },

  // 3.1 控制台 - 我的订单
  '/workorder/order/myInitiated':       { anchor: 'prd-3.1.2', pageName: '我的订单' },
  '/workorder/order/myReceived':        { anchor: 'prd-3.1.2.2', pageName: '我的订单' },
  '/workorder/order/myInitiatedDetail': { anchor: 'prd-3.1.2.1.2', pageName: '订单详情' },

  // 3.1 控制台 - 我的需求
  '/workorder/myDemand/initiate':       { anchor: 'prd-3.1.3', pageName: '我的需求' },
  '/workorder/myDemand/initiateDetail': { anchor: 'prd-3.1.3.1.4', pageName: '需求详情' },
  '/workorder/myDemand/response':       { anchor: 'prd-3.1.3.2', pageName: '我的需求' },
  '/workorder/myDemand/allDetail':      { anchor: 'prd-3.1.3.2.3', pageName: '需求详情' },
  '/workorder/myDemand/responseDetail': { anchor: 'prd-3.1.3.2.4', pageName: '响应详情' },

  // 3.2 服务目录管理
  '/portal/service/digitalApp':          { anchor: 'prd-3.2', pageName: '数字应用管理' },
  '/portal/service/digitalAppDetail':    { anchor: 'prd-3.2.1.4', pageName: '数字应用详情' },
  '/portal/service/component':           { anchor: 'prd-3.2.2', pageName: '能力组件管理' },
  '/portal/service/componentDetail':     { anchor: 'prd-3.2.2.4', pageName: '组件详情' },
  '/portal/service/serviceCatalog':      { anchor: 'prd-3.2.3', pageName: '基础服务管理' },
  '/portal/service/serviceCatalogDetail':{ anchor: 'prd-3.2.3.4', pageName: '服务详情' },

  // 3.3 服务备案审核
  '/portal/auditCenter/qualificationAudit':       { anchor: 'prd-3.3.1', pageName: '机构入驻审核' },
  '/portal/auditCenter/qualificationDetail':      { anchor: 'prd-3.3.1.2', pageName: '审核详情' },
  '/portal/auditCenter/digitalAppAudit':          { anchor: 'prd-3.3.2', pageName: '数字应用审核' },
  '/portal/auditCenter/digitalAppAuditDetail':    { anchor: 'prd-3.3.2.2', pageName: '审核详情' },
  '/portal/auditCenter/componentAudit':           { anchor: 'prd-3.3.3', pageName: '能力组件审核' },
  '/portal/auditCenter/componentAuditDetail':     { anchor: 'prd-3.3.3.2', pageName: '审核详情' },
  '/portal/auditCenter/basicServiceAudit':        { anchor: 'prd-3.3.4', pageName: '基础服务审核' },
  '/portal/auditCenter/basicServiceAuditDetail':  { anchor: 'prd-3.3.4.2', pageName: '审核详情' },

  // 3.4 订单管理
  '/portal/order/list':        { anchor: 'prd-3.4',   pageName: '订单管理' },
  '/portal/order/detail':      { anchor: 'prd-3.4.2',   pageName: '订单详情' },
  '/portal/order/review':      { anchor: 'prd-3.4.3',   pageName: '服务评价' },
  '/workorder/order/list':     { anchor: 'prd-3.4',   pageName: '订单管理' },
  '/workorder/order/detail':   { anchor: 'prd-3.4.2',   pageName: '订单详情' },
  '/workorder/order/review':   { anchor: 'prd-3.4.3',   pageName: '服务评价' },

  // 3.5 需求管理
  '/portal/demand/all':      { anchor: 'prd-3.5',     pageName: '需求管理' },
  '/portal/demand/detail':   { anchor: 'prd-3.5.1.2', pageName: '需求详情' },
}

// ── 导出函数 ──────────────────────────────────────────────

/**
 * 拼接所有章节 HTML，返回完整 PRD 文档
 */
export function getAllPrdHtml() {
  return `<h1>产品需求文档</h1>
<h2>3. 功能详述</h2>
${prdChapters.map(c => c.content).join('\n')}`
}

/**
 * 判断当前路由是否显示 PRD 分隔条
 */
export function shouldShowPrd(path) {
  return path in routePrdMap
}

/**
 * 返回当前页面对应的锚点 ID
 */
export function getPrdAnchor(path) {
  const entry = routePrdMap[path]
  return entry ? entry.anchor : ''
}

/**
 * 返回当前页面对应的 PRD 页面名称
 */
export function getPrdPageName(path) {
  const entry = routePrdMap[path]
  return entry ? entry.pageName : ''
}
