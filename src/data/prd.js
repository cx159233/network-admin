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
    content: `<h3 id="prd-3.1.1">3.1.1 服务管理</h3>
<p><strong>入口页面：</strong>服务管理</p>
<p><strong>页面描述：</strong>开发者与机构用户的服务管理核心入口，涵盖服务上架、开通管理、需求管理等核心功能。</p>

<h3 id="prd-3.1.1.1">3.1.1.1 服务上架</h3>
<p><strong>入口页面：</strong>服务管理 / 服务上架</p>
<p><strong>页面描述：</strong>对本机构提供的服务进行全生命周期管理，支持新增、修改、删除及提交审核。</p>

<h3 id="prd-3.1.1.1.1">3.1.1.1.1 服务列表</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 服务列表</p>
<p><strong>功能描述：</strong>展示本机构提交的服务列表，支持按服务类型、服务名称、服务ID和状态筛选，可进行新增、修改、删除、提交审核操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于本机构通过"服务上架"提交的服务。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，默认不筛选</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已上线使用、已驳回、已下架，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构（匹配统一社会信用代码）提交的所有状态（草稿、待审核、已上线使用、已驳回、已下架）的服务数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：草稿、待审核、已上线使用、已驳回、已下架</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;font-family:Courier,monospace;white-space:pre;">
草稿 ------------(提交审核)---------→ 待审核 ------(审核通过)---------→ 已上线使用 ------------(下线)------------→ 已下架
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
<tr><td>已上线使用</td><td></td><td>详情、修改、删除</td></tr>
<tr><td>已驳回</td><td></td><td>详情、修改、删除</td></tr>
<tr><td>已下架</td><td></td><td>详情、修改、删除</td></tr>
</table>
<p>注：下架操作仅由管理员在服务目录管理中执行。</p>
<p>4、操作-新增</p>
<p>点击【新增-按钮】，弹出"选择服务类型"弹窗（宽度520px），展示四种服务类型的卡片网格：数字应用、安全服务、能力组件、基础服务。开发者选择服务类型后，跳转至对应服务的表单页：</p>
<table>
<tr><th style="white-space:nowrap">服务类型</th><th style="white-space:nowrap">跳转页面</th><th>说明</th></tr>
<tr><td>数字应用</td><td>新增数字应用页</td><td>见 3.1.1.1.3 新增数字应用</td></tr>
<tr><td>安全服务</td><td>新增安全服务页</td><td>见 3.1.1.1.6 新增安全服务</td></tr>
<tr><td>能力组件</td><td>新增能力组件页</td><td>见 3.1.1.1.9 新增能力组件</td></tr>
<tr><td>基础服务</td><td>新增基础服务页</td><td>见 3.1.1.1.12 新增基础服务</td></tr>
</table>
<p>5、操作-删除</p>
<p>删除操作适用于所有服务类型，为该功能通用操作。</p>
<p>点击列表操作列的【删除-按钮】，弹出确认弹窗"是否确认删除该服务？删除后不可恢复。"，判断逻辑如下：</p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>
<p>6、操作-查看详情</p>
<p>点击列表【详情-按钮】，打开右侧详情抽屉（宽度860px），展示当前服务的完整信息。详情内容根据服务类型动态渲染对应的详情模板：</p>
<table>
<tr><th style="white-space:nowrap">服务类型</th><th style="white-space:nowrap">详情模板</th><th>说明</th></tr>
<tr><td>数字应用</td><td>数字应用详情</td><td>包含概览（基本信息+联系信息+分类标签）、审核信息、评价信息三个Tab</td></tr>
<tr><td>安全服务</td><td>安全服务详情</td><td>包含概览（基本信息+联系信息+分类标签）、审核信息、评价信息三个Tab</td></tr>
<tr><td>能力组件</td><td>能力组件详情</td><td>包含概览（基本信息+联系信息+分类标签）、审核信息、评价信息三个Tab</td></tr>
<tr><td>基础服务</td><td>基础服务详情</td><td>包含概览（基本信息+分类标签）、审核信息、评价信息三个Tab</td></tr>
</table>

<h3 id="prd-3.1.1.1.2">3.1.1.1.2 新增数字应用</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增数字应用</p>
<p><strong>功能描述：</strong>新增数字应用，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增】打开弹窗，标题"新增数字应用"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
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
<tr><td>面向对象</td><td>数据拉取字典管理 dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>勾选"基层医疗卫生机构"时联动显示，支持多选，枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
	<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>勾选"公立医院"时联动显示，支持多选，枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
	<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>勾选"医技护人员"时联动显示，支持多选，暂无可选项</td></tr>
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

<h3 id="prd-3.1.1.1.3">3.1.1.1.3 编辑数字应用</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑数字应用，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【修改】打开弹窗，标题"修改数字应用"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原应用名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
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
<tr><td>面向对象</td><td>数据拉取字典管理 dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原面向对象，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
	<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
	<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
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

<h3 id="prd-3.1.1.1.4">3.1.1.1.4 数字应用详情</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 数字应用详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用的完整信息，包括概览（基本信息、联系信息、分类标签）、审核记录和评价信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表页【详情】打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已上线使用、已驳回、已下架</td></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用LOGO</td><td>logo</td><td>显示LOGO图片，为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出3行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>2、审核信息</p>
<p>以可展开表格形式展示审核记录。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>每条审核记录支持展开查看完整四阶段审核流水，展开后以横向步骤条展示各阶段审核状态：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，按阶段顺序展示</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色）、已驳回（红色）、待审核（当前阶段蓝色、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<p>数据范围：该数字应用关联的所有评价数据。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>展示四维度分值（准确性、稳定性、响应时效、业务适配性）</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，返回服务上架列表页。</p>

<h3 id="prd-3.1.1.1.5">3.1.1.1.5 删除数字应用</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 删除数字应用</p>
<p><strong>功能描述：</strong>删除数字应用，删除后不可恢复。仅草稿、已驳回、已上线使用、已下架状态可删除。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>草稿/已驳回/已上线使用/已下架状态，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭确认弹窗，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若存在关联数据，例如该数字应用已有关联服务开通记录，则不允许删除，关闭此对话框，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>
`
  },
  {
    id: 1,
    title: '',
    content: `<h3 id="prd-3.1.2">3.1.2 开通管理</h3>

<h3 id="prd-3.1.2.1">3.1.2.1 服务订阅</h3>
<p><strong>入口页面：</strong>服务管理 / 开通管理 / 服务订阅</p>
<p><strong>页面描述：</strong>查看本机构发起的服务订单，支持查看订单详情并对已完成订单进行评价。</p>

<h3 id="prd-3.1.2.1.1">3.1.2.1.1 服务订阅列表</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务订阅 / 列表</p>
<p><strong>功能描述：</strong>展示本机构发起的订单列表，支持按服务单号、服务名称、服务ID、申请机构、服务类型和状态筛选，可按状态执行详情、评价、查看评价等操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于本机构发起的服务订单。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构（匹配统一社会信用代码）发起的所有状态（工单流转中、已完成、已评价、已驳回、已取消）的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
提交申请 --(系统派发)---→ 工单流转中 --(工单完成)---→ 已完成 --(评价)---→ 已评价
  ┆
  ├┄┄(驳回)┄┄→ 已驳回
  ┆
  └┄┄(取消)┄┄→ 已取消
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单流转中</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情、评价</td></tr>
<tr><td>已评价</td><td></td><td>详情、查看评价</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
<tr><td>已取消</td><td></td><td>详情</td></tr>
</table>
<p>4、操作-评价</p>
<p>仅当订单状态为"已完成"时，操作栏显示【评价-按钮】，点击打开评价弹窗。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>准确性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>稳定性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>响应时效评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>业务适配性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>评价内容</td><td></td><td>必填，多行文本</td></tr>
</table>
<p>1）操作-提交评价</p>
<p>点击【提交评价-按钮】，判断逻辑如下：</p>
<p>a.若评价内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请填写评价内容</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，订单状态变更为已评价，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：评价提交成功</p>
<p>2）操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存评价内容，停留当前页面。</p>
<p>5、操作-查看评价</p>
<p>当订单状态为已评价时，操作栏显示【查看评价-按钮】，点击打开评价查看弹窗，展示评分明细、评价内容及开发者回复（如有）。</p>
<h3 id="prd-3.1.2.1.2">3.1.2.1.2 服务订阅详情</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务订阅 / 详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式展示订单完整信息，包括基本信息和流程进度。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击服务订阅列表【详情】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>2、流程进度</p>
<p>以时间轴形式展示订单处理进度，包含以下节点：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.1.2.2">3.1.2.2 开通记录</h3>
<p><strong>入口页面：</strong>服务管理 / 开通管理 / 开通记录</p>
<p><strong>页面描述：</strong>查看机构订阅本开发者服务的订单记录，支持查看订单详情、评价及回复。</p>

<h3 id="prd-3.1.2.2.1">3.1.2.2.1 开通记录列表</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 开通记录 / 列表</p>
<p><strong>功能描述：</strong>展示本开发者收到的订单记录，支持按服务单号、服务名称、服务ID、申请机构、服务类型和状态筛选，可查看订单详情、查看评价和回复评价。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构订阅本开发者服务的订单记录。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：处理中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为其他机构（匹配统一社会信用代码）订阅本开发者服务的所有状态（已完成、已评价）的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：处理中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情、查看评价、回复</td></tr>
</table>
<p>4、操作-查看评价</p>
<p>当订单状态为已评价时，操作栏显示【查看评价-按钮】，点击打开评价查看弹窗，展示评分明细、评价内容及开发者回复（如有）。</p>
<p>5、操作-回复评价</p>
<p>仅当订单状态为已评价时，操作栏显示【回复-按钮】，点击打开回复弹窗。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>回复内容</td><td></td><td>必填，多行文本</td></tr>
</table>
<p>1）操作-提交回复</p>
<p>点击【提交回复-按钮】，判断逻辑如下：</p>
<p>a.若回复内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请填写回复内容</p>
<p>b.若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>c.若满足条件，保存回复内容，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：回复成功</p>
<p>2）操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存回复内容，停留当前页面。</p>

<h3 id="prd-3.1.2.2.2">3.1.2.2.2 开通记录详情</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 开通记录 / 详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式展示订单完整信息，包括基本信息和流程进度。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击开通记录列表【详情】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>2、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.1.3">3.1.3 需求管理</h3>

<h3 id="prd-3.1.3.1">3.1.3.1 需求发起</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求发起</p>
<p><strong>页面描述：</strong>管理本机构发起的需求，支持新增、查看详情、确认响应和关闭操作。</p>

<h3 id="prd-3.1.3.1.1">3.1.3.1.1 需求发起列表</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 列表</p>
<p><strong>功能描述：</strong>展示本机构发起的需求列表，支持按需求编号、申请机构、方案类型、服务类型和状态筛选。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于本机构发起的需求。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用，默认不筛选</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构（匹配统一社会信用代码）发起的所有状态（待响应、已响应、已完成、已关闭）的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip）</td></tr>
<tr><td>方案名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)---→ 已响应 --(确认响应)---→ 已完成
  ┆
  └┄┄(关闭)┄┄→ 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>详情、关闭</td></tr>
<tr><td>已响应</td><td></td><td>详情、确认响应</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.3.1.2">3.1.3.1.2 新增需求</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 新增需求</p>
<p><strong>功能描述：</strong>新增一条需求，设置服务类型、需求描述和期望时间后发布。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增需求-按钮】打开新增需求弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>申请机构</td><td></td><td>必填，默认带入当前登录用户所属机构，只读不可修改</td></tr>
<tr><td>服务类型</td><td></td><td>必填，枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
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
<p>3）若满足条件，状态变更为待响应，系统自动生成需求编号（格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012）），关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：需求发布成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.3.1.3">3.1.3.1.3 关闭需求</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 关闭需求</p>
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

<h3 id="prd-3.1.3.1.4">3.1.3.1.4 需求发起-详情</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 需求详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看本机构发起的需求详细信息，包括需求信息和响应信息（如有）。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在需求发起列表中点击【详情-按钮】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<p>顶部展示需求编号（等宽字体，大号加粗），右侧展示状态标签（StatusDot组件）。头部不显示方案类型和服务类型标签。</p>
<p>2、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，如"DM-20260810-0012"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>方案名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务项</td><td></td><td>以列表形式展示每个服务项的详细信息，每项包含：服务项名称（加粗展示）、服务项描述（灰色文字，超出2行显示省略号，鼠标悬停展示全部内容），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>需求描述</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、响应信息</p>
<p>仅当需求状态为已响应、已完成时展示响应信息；待响应、已关闭状态时不展示。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>

<h3 id="prd-3.1.3.2">3.1.3.2 需求响应</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求响应</p>
<p><strong>页面描述：</strong>查看平台所有需求并对需求进行响应，支持查看需求和响应详情。</p>

<h3 id="prd-3.1.3.2.1">3.1.3.2.1 需求响应列表</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 列表</p>
<p><strong>功能描述：</strong>展示所有需求和本机构的响应记录，支持按需求编号、申请机构、服务类型筛选。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>默认展示"所有需求"标签页，列表数据来源于平台所有机构发起的需求。</p>
<p><strong>详细设计：</strong></p>
<p>1、标签页切换</p>
<p>页面顶部提供两个标签页：所有需求、我的响应。点击标签切换对应列表，筛选条件共用。</p>
<p>2、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>3、所有需求-列表展示</p>
<p>1）数据范围为所有机构（不区分机构）发布的状态为待响应的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip）</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>状态</td><td></td><td>固定为"待响应"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>5）操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)----> 已响应 --(确认响应)----> 已完成
  ┆
  └┄┄(关闭)┄┄-> 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>响应、详情</td></tr>
</table>
<p>4、我的响应-列表展示</p>
<p>1）数据范围为当前机构（匹配统一社会信用代码）响应的所有状态（已响应、已完成、已关闭）的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按响应时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip）</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：已响应、已完成、已关闭</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>5）操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)----> 已响应 --(确认响应)----> 已完成
  ┆
  └┄┄(关闭)┄┄-> 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>已响应</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.1.3.2.2">3.1.3.2.2 需求响应</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 响应需求</p>
<p><strong>功能描述：</strong>以右侧抽屉形式对待响应状态的需求提交响应方案，包括响应内容、预估报价和预计工期。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表中仅待响应状态展示【响应-按钮】，点击打开响应抽屉。</p>
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
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 所有需求 / 需求详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看需求详细信息，包括需求基本信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在"所有需求"标签页中点击【详情-按钮】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<p>顶部展示需求编号（等宽字体，大号加粗）。头部不显示方案类型和服务类型标签。</p>
<p>2、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，如"DM-20260810-0012"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>方案名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务项</td><td></td><td>以列表形式展示每个服务项的详细信息，每项包含：服务项名称（加粗展示）、服务项描述（灰色文字，超出2行显示省略号，鼠标悬停展示全部内容），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>需求描述</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>固定为"待响应"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>

<h3 id="prd-3.1.3.2.4">3.1.3.2.4 我的响应-详情</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 我的响应 / 响应详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看本机构对需求的响应详情，包括需求信息和响应信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在"我的响应"标签页中点击【详情-按钮】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<p>顶部展示需求编号（等宽字体，大号加粗），右侧展示状态标签（StatusDot组件）。头部不显示方案类型和服务类型标签。</p>
<p>2、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，如"DM-20260810-0012"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>方案名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务项</td><td></td><td>以列表形式展示每个服务项的详细信息，每项包含：服务项名称（加粗展示）、服务项描述（灰色文字，超出2行显示省略号，鼠标悬停展示全部内容），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务</td></tr>
<tr><td>需求描述</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、响应信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>`
  },
  {
    id: 2,
    title: '',
    content: `<h3 id="prd-3.2.1">3.2.1 服务目录管理</h3>

<h3 id="prd-3.2.1.1">3.2.1.1 数字应用管理</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务目录管理 / 数字应用管理</p>
<p><strong>页面描述：</strong>管理平台数字应用的上架与全生命周期，支持发布、下线及删除等操作。</p>

<h3 id="prd-3.2.1.1.1">3.2.1.1.1 数字应用列表</h3>
<p><strong>模块描述：</strong>运营管理后台 / 服务目录管理 / 数字应用管理</p>
<p><strong>功能描述：</strong>展示平台数字应用列表，支持按数字应用名称、数字应用ID、服务商名称、应用覆盖范围、面向对象和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于服务提供方通过"服务上架"上架的数字应用或者管理员代为上架的数字应用。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>数字应用ID</td><td>applicationId</td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>支持模糊搜索</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康、基本公共卫生服务、家庭医生签约、村卫生室管理、辅助诊疗、区域综合、基本公共卫生服务绩效评价，默认不筛选</td></tr>
<tr><td>面向对象</td><td>target</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的状态为已上线使用、已下架的数字应用数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称/ID</td><td>name, applicationId</td><td>展示应用名称及ID，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover 数组各value，用;分割</td><td>多值以分号分隔展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已上线使用 --(下线)----------------------------------------→ 已下架
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已上线使用</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下架</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.1.1.2">3.2.1.1.2 新增数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 新增数字应用</p>
<p><strong>功能描述：</strong>新增一个数字应用，设置基本信息、联系信息、分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>应用描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入</td></tr>
<tr><td>系统地址</td><td>address</td><td>非必填，有效URL格式</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
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
<tr><td>面向对象</td><td>数据拉取字典管理 dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>勾选"基层医疗卫生机构"时联动显示，支持多选，枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>勾选"公立医院"时联动显示，支持多选，枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>勾选"医技护人员"时联动显示，支持多选，暂无可选项</td></tr>
</table>
<p>4、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">数字应用名称为空：请输入数字应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>
<p>5、操作-返回</p>
<p>点击顶部【返回-按钮】，返回数字应用列表页，不保存修改。</p>

<h3 id="prd-3.2.1.1.3">3.2.1.1.3 编辑数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑已有数字应用的基本信息、联系信息和分类标签，直接发布后管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原数字应用名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
<tr><td>应用描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原应用描述，可修改</td></tr>
<tr><td>系统地址</td><td>address</td><td>1.非必填，有效URL格式；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>1.非必填，多个用;分隔；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>面向对象</td><td>数据拉取字典管理 dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原面向对象，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">数字应用名称为空：请输入数字应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">面向对象为空：请选择面向对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：修改成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回数字应用列表页，不保存修改。</p>

<h3 id="prd-3.2.1.1.4">3.2.1.1.4 数字应用详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 数字应用详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用的完整信息，包括基本信息、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用LOGO</td><td>logo</td><td>展示应用Logo图片，若无则显示默认图标</td></tr>
<tr><td>数字应用名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已上线使用、已下架</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>灰色小字，格式"ID：XXX"</td></tr>
</table>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出3行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、概览-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、概览-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>面向对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>基层应用覆盖范围</td><td></td><td>仅当面向对象含"基层医疗卫生机构"时显示，多值以分号分隔展示</td></tr>
<tr><td>公立应用覆盖范围</td><td></td><td>仅当面向对象含"公立医院"时显示，多值以分号分隔展示</td></tr>
<tr><td>医技应用覆盖范围</td><td></td><td>仅当面向对象含"医技护人员"时显示，多值以分号分隔展示</td></tr>
</table>
<p>5、审核信息</p>
<p>以可展开表格形式展示审核记录。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>每条审核记录支持展开查看完整四阶段审核流水，展开后以横向步骤条展示各阶段审核状态：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，按阶段顺序展示</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色）、已驳回（红色）、待审核（当前阶段蓝色、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>展示四维度分值（准确性、稳定性、响应时效、业务适配性）</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.1.5">3.2.1.1.5 发布数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 发布数字应用</p>
<p><strong>功能描述：</strong>将已下架状态的数字应用发布上线，发布后应用状态变更为已上线使用。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下架状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行发布，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态变更为"已上线使用"，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>

<h3 id="prd-3.2.1.1.6">3.2.1.1.6 下线数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 下线数字应用</p>
<p><strong>功能描述：</strong>将已上线使用的数字应用下线，下线后应用状态变更为已下架。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已上线使用状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行下线，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为"已下架"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.1.1.7">3.2.1.1.7 删除数字应用</h3>
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
<p>2）若存在关联数据，例如该数字应用已有关联服务开通记录，则不允许删除，关闭此对话框，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.1.2">3.2.1.2 安全服务管理</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务目录管理 / 安全服务管理</p>
<p><strong>页面描述：</strong>管理平台安全服务的上架与全生命周期，支持发布、下线及删除等操作。</p>

<h3 id="prd-3.2.1.2.1">3.2.1.2.1 安全服务列表</h3>
<p><strong>模块描述：</strong>运营管理后台 / 服务目录管理 / 安全服务管理</p>
<p><strong>功能描述：</strong>展示平台安全服务列表，支持按安全服务名称、安全服务ID、服务商名称、部署云服务商和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于服务提供方通过"服务上架"上架的安全服务或者管理员代为上架的安全服务。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>安全服务ID</td><td>appId</td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td>cloud</td><td>枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的状态为已上线使用、已下架的安全服务数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称/ID</td><td></td><td>展示服务名称及ID，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>cooperativeEnterprise</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>cloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已上线使用 --(下线)----------------------------------------→ 已下架
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已上线使用</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下架</td><td></td><td>详情、修改、删除</td></tr>
</table>

<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>
<p>5、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.2">3.2.1.2.2 新增安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 新增安全服务</p>
<p><strong>功能描述：</strong>新增一个安全服务，设置基本信息、联系信息、分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】跳转至新增安全服务表单页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>必填，限制40字符，超出不可输入，占位提示"请输入安全服务名称"</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>非必填，文本输入，占位提示"请输入系统地址"</td></tr>
<tr><td>LOGO</td><td>logo</td><td>非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内，建议 640×640；上传超过 1MB 时提示"LOGO 文件不能超过 1MB"；点击替换或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>必填，文本输入，占位提示"请输入服务商名称"</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>非必填，文本输入，占位提示"多个合作伙伴请通过；分隔"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>必填，联系人姓名 + 手机号，以"-"分隔，姓名占位提示"请输入联系人姓名"，手机号占位提示"请输入联系人手机号"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，格式同联系方式1</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用架构</td><td>appArchitecture</td><td>非必填，多选框组，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>cloudProvider</td><td>必填，多选框组，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
</table>
<p>4、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">安全服务名称为空：请输入安全服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>
<p>5、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.3">3.2.1.2.3 编辑安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 编辑安全服务</p>
<p><strong>功能描述：</strong>编辑已有安全服务的基本信息、联系信息和分类标签，支持直接发布。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】跳转至编辑安全服务表单页，标题"编辑安全服务"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原服务名称，可修改</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>1.非必填，文本输入；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>1.必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>1.非必填，文本输入；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>应用架构</td><td>appArchitecture</td><td>1.非必填，多选框组；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>cloudProvider</td><td>1.必填，多选框组；<br>2.回显原部署云服务商，可修改</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">安全服务名称为空：请输入安全服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：修改成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.4">3.2.1.2.4 安全服务详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 安全服务详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看安全服务的完整信息，包括概览（基本信息、联系信息、分类标签）、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<p>展示服务LOGO（或默认图标）、服务名称及ID、状态标签（已上线使用/已下架）。</p>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>完整展示，为空时显示"0"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、概览-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>cooperativeEnterprise</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人和联系电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人和联系电话，为空时显示"--"</td></tr>
</table>
<p>4、概览-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用架构</td><td>appArchitecture</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>cloudProvider</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
</table>
<p>5、审核信息</p>
<p>以可展开表格形式展示各版本的审核记录。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>每条审核记录支持展开查看完整四阶段审核流水，展开后以横向步骤条展示各阶段审核状态：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，按阶段顺序展示</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色）、已驳回（红色）、待审核（当前阶段蓝色、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.2.5">3.2.1.2.5 发布安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 发布安全服务</p>
<p><strong>功能描述：</strong>将已下架状态的安全服务发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下架状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行发布，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态变更为"已上线使用"，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>

<h3 id="prd-3.2.1.2.6">3.2.1.2.6 下线安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 下线安全服务</p>
<p><strong>功能描述：</strong>将已上线使用的安全服务下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已上线使用状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行下线，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为"已下架"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.1.2.7">3.2.1.2.7 删除安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 删除安全服务</p>
<p><strong>功能描述：</strong>删除安全服务，删除后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>选中一条或多条记录，点击【删除-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行删除，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若存在关联数据，例如该安全服务已有关联服务开通记录，则不允许删除，关闭此对话框，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.1.3">3.2.1.3 能力组件管理</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务目录管理 / 能力组件管理</p>
<p><strong>页面描述：</strong>管理平台能力组件的上架与全生命周期，支持发布、下线及删除等操作。</p>

<h3 id="prd-3.2.1.3.1">3.2.1.3.1 能力组件列表</h3>
<p><strong>模块描述：</strong>运营管理后台 / 服务目录管理 / 能力组件管理</p>
<p><strong>功能描述：</strong>展示平台能力组件列表，支持按能力组件名称、能力组件ID、服务商名称、部署云服务商、开放范围和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于服务提供方通过"服务上架"上架的能力组件或者管理员代为上架的能力组件。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>能力组件ID</td><td>componentId</td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云，默认不筛选</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域，默认不筛选</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的状态为已上线使用、已下架的能力组件数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称/ID</td><td>name, componentId</td><td>展示组件名称及ID，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已上线使用 --(下线)----------------------------------------→ 已下架
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已上线使用</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下架</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.1.3.2">3.2.1.3.2 新增能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 新增能力组件</p>
<p><strong>功能描述：</strong>新增一个能力组件，设置基本信息、联系信息和分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>必填，限制20汉字，超出不可输入，占位提示"请输入能力组件名称"，右下角显示字数统计</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>组件描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入，占位提示"请输入组件描述"，右下角显示字数统计</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
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
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>
<p>5、操作-返回</p>
<p>点击顶部【返回-按钮】，返回能力组件列表页，不保存修改。</p>

<h3 id="prd-3.2.1.3.3">3.2.1.3.3 编辑能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 编辑能力组件</p>
<p><strong>功能描述：</strong>编辑已有能力组件的基本信息、联系信息和分类标签。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原能力组件名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>组件描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原组件描述，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
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
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：修改成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回能力组件列表页，不保存修改。</p>

<h3 id="prd-3.2.1.3.4">3.2.1.3.4 能力组件详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 能力组件详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看能力组件的完整信息，包括基本信息、分类标签、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件ID</td><td>componentId</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>组件名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>显示顺序</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>2、审核信息</p>
<p>以可展开表格形式展示审核记录。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>每条审核记录支持展开查看完整四阶段审核流水，展开后以横向步骤条展示各阶段审核状态：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，按阶段顺序展示</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色）、已驳回（红色）、待审核（当前阶段蓝色、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>展示四维度分值（准确性、稳定性、响应时效、业务适配性）</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.3.5">3.2.1.3.5 发布能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 发布能力组件</p>
<p><strong>功能描述：</strong>将已下架状态的能力组件发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下架状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行发布，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态变更为"已上线使用"，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>

<h3 id="prd-3.2.1.3.6">3.2.1.3.6 下线能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 下线能力组件</p>
<p><strong>功能描述：</strong>将已上线使用的能力组件下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已上线使用状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行下线，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为"已下架"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.1.3.7">3.2.1.3.7 删除能力组件</h3>
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
<p>2）若存在关联数据，例如该能力组件已有关联服务开通记录，则不允许删除，关闭此对话框，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.1.4">3.2.1.4 基础服务管理</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务目录管理 / 基础服务管理</p>
<p><strong>页面描述：</strong>管理平台基础服务的上架与全生命周期，支持发布、下线及删除等操作。</p>

<h3 id="prd-3.2.1.4.1">3.2.1.4.1 基础服务列表</h3>
<p><strong>模块描述：</strong>运营管理后台 / 服务目录管理 / 基础服务管理</p>
<p><strong>功能描述：</strong>展示平台基础服务列表，支持按基础服务名称、基础服务ID、服务商名称、部署云服务商和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于服务提供方通过"服务上架"上架的基础服务或者管理员代为上架的基础服务。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>基础服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td></td><td>枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用、已下架，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的状态为已上线使用、已下架的基础服务数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称/ID</td><td></td><td>展示服务名称及ID，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务子类</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已上线使用 --(下线)----------------------------------------→ 已下架
  ┆                                                     ┆
  └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）    ┆
                                                        ┆
                                                        └┄┄(修改·直接发布)┄┄→ 已上线使用（管理员默认通过审核）
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已上线使用</td><td></td><td>详情、修改、删除、下线</td></tr>
<tr><td>已下架</td><td></td><td>详情、修改、删除</td></tr>
</table>

<h3 id="prd-3.2.1.4.2">3.2.1.4.2 新增基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 新增基础服务</p>
<p><strong>功能描述：</strong>新增一个基础服务，设置基本信息后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击【新增-按钮】跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td></td><td>必填，限制40字符，超出不可输入，占位提示"请输入基础服务名称"，右下角显示字数统计</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>服务描述</td><td></td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>服务类型</td><td></td><td>必填，枚举：计算服务、存储服务、网络服务、安全服务、大数据服务、数据库服务、备份容灾服务、软件与应用服务、机房托管服务，支持多选</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云，支持多选</td></tr>
<tr><td>区域</td><td></td><td>必填，枚举：华东、华北、华南、西南，支持多选</td></tr>
<tr><td>服务商名称</td><td></td><td>非必填，文本输入，占位提示"请输入服务商名称"</td></tr>
<tr><td>联系方式1</td><td></td><td>非必填，包含联系人姓名和联系电话</td></tr>
<tr><td>联系方式2</td><td></td><td>非必填，包含联系人姓名和联系电话</td></tr>
<tr><td>显示顺序</td><td></td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务类型为空：请选择服务类型</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">区域为空：请选择区域</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回基础服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.4.3">3.2.1.4.3 编辑基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 编辑基础服务</p>
<p><strong>功能描述：</strong>编辑已有基础服务的基本信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条记录，点击【修改-按钮】跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td></td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原基础服务名称，可修改</td></tr>
<tr><td>上传LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td></td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>服务类型</td><td></td><td>1.必填，支持多选；<br>2.回显原服务类型，可修改</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>1.必填，支持多选；<br>2.回显原云服务商，可修改</td></tr>
<tr><td>区域</td><td></td><td>1.必填，支持多选；<br>2.回显原区域，可修改</td></tr>
<tr><td>服务商名称</td><td></td><td>1.非必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td></td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td></td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>显示顺序</td><td></td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
</table>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务类型为空：请选择服务类型</p>
<p style="font-style:italic; color:#999">云服务商为空：请选择云服务商</p>
<p style="font-style:italic; color:#999">区域为空：请选择区域</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：修改成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员编辑后重新提交，即时生效</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回基础服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.4.4">3.2.1.4.4 基础服务详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 基础服务详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看基础服务的完整信息，包括基本信息、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>区域</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>附件材料</td><td></td><td>显示附件名称列表，点击下载</td></tr>
</table>
<p>2、审核信息</p>
<p>以可展开表格形式展示审核记录。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>每条审核记录支持展开查看完整四阶段审核流水，展开后以横向步骤条展示各阶段审核状态：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，按阶段顺序展示</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色）、已驳回（红色）、待审核（当前阶段蓝色、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) ÷ 评价人数，其中四维均分 = (准确性＋稳定性＋响应时效＋业务适配性) ÷ 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分</td><td></td><td>展示四维度分值（准确性、稳定性、响应时效、业务适配性）</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.4.5">3.2.1.4.5 发布基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 发布基础服务</p>
<p><strong>功能描述：</strong>将已下架状态的基础服务发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已下架状态的记录，点击【发布-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行发布，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态变更为"已上线使用"，关闭确认弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：发布成功</p>
<p>b.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>管理员直接发布，默认通过审核</td></tr>
</table>

<h3 id="prd-3.2.1.4.6">3.2.1.4.6 下线基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 下线基础服务</p>
<p><strong>功能描述：</strong>将已上线使用的基础服务下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>选中一条或多条已上线使用状态的记录，点击【下线-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行下线，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为"已下架"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：下线成功</p>

<h3 id="prd-3.2.1.4.7">3.2.1.4.7 删除基础服务</h3>
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
<p>2）若存在关联数据，例如该基础服务已有关联服务开通记录，则不允许删除，关闭此对话框，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：该数据已有关联记录，暂不允许删除</p>
<p>3）若满足条件，软删除数据，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：删除成功</p>

<h3 id="prd-3.2.2">3.2.2 服务审核管理</h3>

<h3 id="prd-3.2.2.1">3.2.2.1 机构资质审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 机构资质审核</p>
<p><strong>页面描述：</strong>审核机构提交的资质认证申请，支持审核通过或驳回操作。</p>

<h3 id="prd-3.2.2.1.1">3.2.2.1.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构资质审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示机构入驻资质审核列表，支持按机构名称、统一社会信用代码、机构类型和审核状态筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构提交的资质认证申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>机构类型</td><td></td><td>枚举：政府机关、事业单位、国有企业、私营企业，默认不选中</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已驳回，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）提交的审核状态为待审核、已通过、已驳回的资质认证数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交审核时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已驳回</td></tr>
<tr><td>机构名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构类型</td><td></td><td>以标签样式展示，枚举：政府机关、事业单位、国有企业、私营企业，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>单位注册地</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>E-mail/邮箱</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>企业简介</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.1.2">3.2.2.1.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构资质审核 / 审核操作</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看机构入驻申请的详细资质信息，对待审核状态的申请进行审核通过或驳回操作。左侧展示机构资质详情，右侧展示审核操作区。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】（待审核状态）打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧-企业基本情况</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构类型</td><td></td><td>以标签样式展示，枚举：政府机关、事业单位、国有企业、私营企业</td></tr>
<tr><td>法定代表人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>单位性质</td><td></td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>成立时间</td><td></td><td>格式：yyyy-MM-dd，等宽字体展示</td></tr>
<tr><td>单位注册地</td><td></td><td>省/市/区/详细地址拼接展示</td></tr>
<tr><td>单位地址</td><td></td><td>省/市/区/详细地址拼接展示</td></tr>
<tr><td>联系人</td><td></td><td>展示姓名，若有职务以"/"分隔展示（如：张三 / 经理）</td></tr>
<tr><td>联系电话</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>E-mail/微信号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
</table>
<p>2、左侧-服务介绍</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>企业简介</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>主要产品或服务介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>人力情况介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、左侧-管理员信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>管理员姓名</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>身份证号</td><td></td><td>等宽字体展示，脱敏处理后显示</td></tr>
<tr><td>手机号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
</table>
<p>4、左侧-资质材料</p>
<p>以列表形式展示机构提交的资质文件，每条包含文件图标、材料名称、文件大小，支持点击【下载-按钮】下载文件。</p>
<p>5、右侧-审核操作</p>
<p>显示审核意见输入框（多行文本，最多200字，显示字数统计，占位提示"请输入审核意见"）、【审核通过-按钮】和【驳回-按钮】。</p>
<p>6、操作-审核通过</p>
<p>点击【审核通过-按钮】，判断逻辑如下：</p>
<p>1）若审核意见为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：审核意见为空：请填写审核意见</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p>3）若满足条件，状态变更为已通过，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：审核通过</p>
<p>7、操作-驳回</p>
<p>点击【驳回-按钮】，判断逻辑如下：</p>
<p>1）若审核意见为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：审核意见为空：请填写审核意见</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p>3）若满足条件，状态变更为已驳回，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：驳回成功</p>
<p>8、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.1.3">3.2.2.1.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构资质审核 / 审核详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看机构入驻申请的详细资质信息，只读展示审核结果记录。左侧展示机构资质详情，右侧展示审核结果记录。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】（已通过/已驳回状态）打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核结果记录</p>
<p>展示审核结果记录（审核意见 + 审核人 + 审核时间）。</p>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.2">3.2.2.2 数字应用审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 数字应用审核</p>
<p><strong>页面描述：</strong>审核机构提交的数字应用上架申请，支持多阶段审核操作。</p>

<h3 id="prd-3.2.2.2.1">3.2.2.2.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 数字应用审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示数字应用审核列表，支持按提交审核时间、审核状态、审核阶段、应用名称、应用ID、服务商名称、应用覆盖范围和面向对象筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构提交的数字应用上架申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>日期范围选择器，占位提示"提交审核时间"，格式yyyy-MM-dd</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：待审核、已通过、已驳回，默认不选中</td></tr>
<tr><td>审核阶段</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，默认不选中</td></tr>
<tr><td>数字应用名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>数字应用ID</td><td>applicationId</td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>支持模糊搜索</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>枚举：基本公共卫生服务、医院信息系统（HIS）、家庭医生签约、实验室信息管理系统（LIS）、影像归档和通信系统（PACS），默认不选中</td></tr>
<tr><td>面向对象</td><td>target</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）提交的审核状态为待审核、已通过、已驳回的数字应用审核数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交审核时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核阶段</td><td></td><td>显示当前所处审核阶段名称</td></tr>
<tr><td>数字应用名称/ID</td><td>name, applicationId</td><td>上方展示应用名称，下方展示应用ID（小号字体），为空时显示"--"</td></tr>
<tr><td>面向对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待审核 --(进入审核)---→ 申报材料评估 --(通过)---→ 应用技术测评 --(通过)---→ 现场演示答辩 --(通过)---→ 服务目录发布 --(通过)---→ 已通过
                            ┆                        ┆                        ┆                        ┆
                            └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.2.2">3.2.2.2.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 数字应用审核 / 审核操作</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用备案的详细信息，对待审核状态的服务进行四阶段审核操作。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】（待审核状态）打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用LOGO</td><td>logo</td><td>展示应用Logo图片，若无则显示默认图标</td></tr>
<tr><td>应用名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>灰色小字，格式"ID：XXX"</td></tr>
</table>
<p>2、左侧-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示0</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、左侧-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
</table>
<p>4、左侧-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>面向对象</td><td>targetView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>基层应用覆盖范围</td><td></td><td>仅当面向对象含"基层医疗卫生机构"时显示，多值以分号分隔展示</td></tr>
<tr><td>公立应用覆盖范围</td><td></td><td>仅当面向对象含"公立医院"时显示，多值以分号分隔展示</td></tr>
<tr><td>医技应用覆盖范围</td><td></td><td>仅当面向对象含"医技护人员"时显示，多值以分号分隔展示</td></tr>
</table>
<p>5、右侧——审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。</td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>最终审核记录取末尾阶段审核数据，在审核列表中展示：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.2.3">3.2.2.2.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 数字应用审核 / 审核详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用备案的详细信息，只读展示四阶段审核流水。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】（已通过/已驳回状态）打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧——审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.3">3.2.2.3 安全服务审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 安全服务审核</p>
<p><strong>页面描述：</strong>审核机构提交的安全服务上架申请，支持四阶段审核与通过或驳回操作。</p>

<h3 id="prd-3.2.2.3.1">3.2.2.3.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 安全服务审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示所有机构提交的安全服务审核列表，展示审核状态和审核阶段，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构提交的安全服务上架申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>时间区间选择器，选择起止日期后按提交审核时间范围筛选，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：待审核、已通过、已驳回，默认不筛选</td></tr>
<tr><td>审核阶段</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，默认不筛选</td></tr>
<tr><td>安全服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>安全服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td></td><td>枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云，默认不筛选</td></tr>
<tr><td>列设置按钮</td><td></td><td>点击可自定义显示/隐藏列表列</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）提交的所有审核状态（待审核、已通过、已驳回）的安全服务审核数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交审核时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核，使用StatusDot组件展示</td></tr>
<tr><td>审核阶段</td><td></td><td>显示当前所处的审核阶段名称（申报材料评估/应用技术测评/现场演示答辩/服务目录发布）</td></tr>
<tr><td>安全服务名称/ID</td><td></td><td>上方展示服务名称（加粗），下方展示服务ID（灰色小字），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待审核 --(进入审核)---→ 申报材料评估 --(通过)---→ 应用技术测评 --(通过)---→ 现场演示答辩 --(通过)---→ 服务目录发布 --(通过)---→ 已通过
                            ┆                        ┆                        ┆                        ┆
                            └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.3.2">3.2.2.3.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 安全服务审核 / 审核操作</p>
<p><strong>功能描述：</strong>查看安全服务备案的详细信息，对待审核状态的服务进行四阶段审核操作。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】（待审核状态）打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>服务名称</td><td></td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"</td></tr>
</table>
<p>2、左侧——基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示0</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、左侧——联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
</table>
<p>4、左侧——分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用架构</td><td>appArchitecture</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>cloudProvider</td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>5、右侧——审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。</td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>最终审核记录取末尾阶段审核数据，在审核列表中展示：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.3.3">3.2.2.3.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 安全服务审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看安全服务备案的详细信息，只读展示四阶段审核流水。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】（已通过/已驳回状态）打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧——审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.4">3.2.2.4 能力组件审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 能力组件审核</p>
<p><strong>页面描述：</strong>审核机构提交的能力组件上架申请，支持四阶段审核与通过或驳回操作。</p>

<h3 id="prd-3.2.2.4.1">3.2.2.4.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 能力组件审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示所有机构提交的能力组件审核列表，展示审核状态和审核阶段，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构提交的能力组件上架申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>时间区间选择器，选择起止日期后按提交审核时间范围筛选，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：待审核、已通过、已驳回，默认不筛选</td></tr>
<tr><td>审核阶段</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，默认不筛选</td></tr>
<tr><td>组件名称</td><td>name</td><td>支持模糊搜索</td></tr>
<tr><td>组件ID</td><td>componentId</td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云，默认不筛选</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域，默认不筛选</td></tr>
<tr><td>列设置按钮</td><td></td><td>点击可自定义显示/隐藏列表列</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）提交的所有审核状态（待审核、已通过、已驳回）的能力组件审核数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交审核时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核，使用StatusDot组件展示</td></tr>
<tr><td>审核阶段</td><td></td><td>显示当前所处的审核阶段名称（申报材料评估/应用技术测评/现场演示答辩/服务目录发布）</td></tr>
<tr><td>能力组件名称/ID</td><td>name, componentId</td><td>上方展示组件名称（加粗），下方展示组件ID（灰色小字），为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待审核 --(进入审核)---→ 申报材料评估 --(通过)---→ 应用技术测评 --(通过)---→ 现场演示答辩 --(通过)---→ 服务目录发布 --(通过)---→ 已通过
                            ┆                        ┆                        ┆                        ┆
                            └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.4.2">3.2.2.4.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 能力组件审核 / 审核操作</p>
<p><strong>功能描述：</strong>查看能力组件备案的详细信息，对待审核状态的服务进行四阶段审核操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】（待审核状态）打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示组件Logo图片，若无则显示默认图标</td></tr>
<tr><td>组件名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>组件ID</td><td>componentId</td><td>灰色小字，格式"ID：XXX"</td></tr>
</table>
<p>2、左侧——基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td></td><td>数字，默认为0</td></tr>
<tr><td>组件描述</td><td>description</td><td>多行文本展示，为空时显示"--"</td></tr>
</table>
<p>3、左侧——联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人姓名+电话，格式"姓名 电话"，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人姓名+电话，格式"姓名 电话"，为空时显示"--"</td></tr>
</table>
<p>4、左侧——分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>coverView</td><td>枚举：不限、市级、区（县）域</td></tr>
</table>
<p>5、右侧——审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。</td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>最终审核记录取末尾阶段审核数据，在审核列表中展示：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.4.3">3.2.2.4.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 能力组件审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看能力组件备案的详细信息，只读展示四阶段审核流水。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】（已通过/已驳回状态）打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧——审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.5">3.2.2.5 基础服务审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 基础服务审核</p>
<p><strong>页面描述：</strong>审核云服务商提交的基础服务上架申请，支持四阶段审核与通过或驳回操作。</p>

<h3 id="prd-3.2.2.5.1">3.2.2.5.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 基础服务审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示云服务商提交的基础服务审核列表，展示审核状态和审核阶段，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于云服务商提交的基础服务上架申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>时间区间选择器，选择起止日期后按提交审核时间范围筛选，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：待审核、已通过、已驳回，默认不筛选</td></tr>
<tr><td>审核阶段</td><td></td><td>枚举：申报材料评估、应用技术测评、现场演示答辩、服务目录发布，默认不筛选</td></tr>
<tr><td>基础服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>基础服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务商名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>部署云服务商</td><td></td><td>枚举：影像云、电信云、移动云、联通云、浪潮云，默认不筛选</td></tr>
<tr><td>列设置按钮</td><td></td><td>点击可自定义显示/隐藏列表列</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有云服务商（不区分机构）提交的所有审核状态（待审核、已通过、已驳回）的基础服务审核数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按提交审核时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核，使用StatusDot组件展示</td></tr>
<tr><td>审核阶段</td><td></td><td>显示当前所处的审核阶段名称（申报材料评估/应用技术测评/现场演示答辩/服务目录发布）</td></tr>
<tr><td>基础服务名称/ID</td><td></td><td>上方展示服务名称（加粗），下方展示服务ID（灰色小字），为空时显示"--"</td></tr>
<tr><td>服务子类</td><td></td><td>使用服务类型标签展示（如计算服务、存储服务、数据库、网络服务），不同类别使用不同颜色标签</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待审核 --(进入审核)---→ 申报材料评估 --(通过)---→ 应用技术测评 --(通过)---→ 现场演示答辩 --(通过)---→ 服务目录发布 --(通过)---→ 已通过
                            ┆                        ┆                        ┆                        ┆
                            └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回        └┄┄(驳回)┄┄→ 已驳回
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.5.2">3.2.2.5.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 基础服务审核 / 审核操作</p>
<p><strong>功能描述：</strong>查看基础服务备案的详细信息，对待审核状态的服务进行四阶段审核操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【审核-按钮】（待审核状态）打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>服务名称</td><td></td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"</td></tr>
</table>
<p>2、左侧——基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td></td><td>数字，默认为0</td></tr>
<tr><td>服务描述</td><td></td><td>多行文本展示，为空时显示"--"</td></tr>
</table>
<p>3、左侧——联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td></td><td>展示联系电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td></td><td>展示联系电话，为空时显示"--"</td></tr>
</table>
<p>4、左侧——分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>部署云服务商</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务子类</td><td></td><td>使用服务类型标签展示（如计算服务、存储服务、数据库、网络服务）</td></tr>
<tr><td>区域</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>5、右侧——审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。</td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>最终审核记录取末尾阶段审核数据，在审核列表中展示：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td>createTime</td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td>createBy</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，枚举：已通过、已驳回、待审核</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.5.3">3.2.2.5.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 基础服务审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看基础服务备案的详细信息，只读展示四阶段审核流水。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】（已通过/已驳回状态）打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧——审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.3">3.2.3 服务开通管理</h3>

<h3 id="prd-3.2.3.1">3.2.3.1 服务开通列表</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务开通管理 / 服务开通列表</p>
<p><strong>页面描述：</strong>管理平台所有服务订单，支持查看订单详情、取消订单、查看评价。</p>

<h3 id="prd-3.2.3.1.1">3.2.3.1.1 服务开通列表</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表</p>
<p><strong>功能描述：</strong>展示平台全部订单列表，支持按服务单号、服务名称、服务ID、服务商名称、申请机构、服务类型和状态筛选，可按状态执行详情、取消、查看评价等操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong><span style="color:red">医疗机构发起订阅后，在多云管理系统创建工单，工单回传时在本系统创建服务订单。</span></p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>支持模糊搜索；服务单号按"时间+序号"规则生成（格式：yyyyMMdd + 4位序号，如 202608100093）</td></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索；取自被订阅的服务的信息</td></tr>
<tr><td>服务ID</td><td></td><td>支持模糊搜索；取自被订阅的服务的信息</td></tr>
<tr><td>服务商名称</td><td></td><td>支持模糊搜索；取自被订阅的服务的信息</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索；取自发起订阅的医疗机构名称</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，默认不筛选；取自服务目录中该服务的类型分类</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的所有状态（工单流转中、已完成、已评价、已驳回、已取消）的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<p>5）支持列设置，可自定义显示/隐藏列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>服务单号按"时间+序号"规则生成（格式：yyyyMMdd + 4位序号，如 202608100093），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，取自被订阅的服务的信息，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务；取自服务目录中该服务的类型分类</td></tr>
<tr><td>服务商名称</td><td></td><td>取自被订阅的服务的信息，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>取自发起订阅的医疗机构名称，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>关联工单</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
提交申请 --(系统派发)---→ 工单流转中 --(服务交付)---→ 已完成 --(用户评分)---→ 已评价
                                  ┆                       ┆
                                  └┄┄(驳回)┄┄→ 已驳回       └┄┄(取消)┄┄→ 已取消
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>工单流转中</td><td></td><td>详情、取消</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情、查看评价</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
<tr><td>已取消</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.3.1.2">3.2.3.1.2 服务开通详情</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表 / 服务开通详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看订单完整信息，包括基本信息和流程进度，支持跳转关联工单。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表【详情-按钮】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，可点击跳转至多云管理系统工单详情页</td></tr>
</table>
<p>2、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：跳转到多云系统时记录为提交申请时间<br>2、系统派发工单：多云系统创建工单后回传创建时间记录为系统派发工单，同时默认进入工单流转中<br>3、工单流转中：系统派发工单后默认进入工单流转中状态<br>4、服务交付完成：多云系统回传服务交付完成状态及时间<br>5、服务评价：用户完成服务评价后记录评价时间<br>6、订单驳回：工单驳回后记录驳回时间<br>7、订单取消：用户取消订单后记录取消时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】或遮罩层，关闭详情抽屉，返回服务开通列表页。</p>

<h3 id="prd-3.2.3.1.3">3.2.3.1.3 取消订单</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表 / 取消订单</p>
<p><strong>功能描述：</strong>取消处于"工单流转中"状态的服务订单，取消后订单状态变更为"已取消"。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>在服务开通列表中，对"工单流转中"状态的订单点击【取消-按钮】弹出确认框。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行取消操作，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，订单状态变更为"已取消"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：订单已取消</p>

<h3 id="prd-3.2.3.3">3.2.3.3 质量评价管理</h3>
<p><strong>入口页面：</strong>服务开通管理 / 质量评价管理</p>
<p><strong>页面描述：</strong>查看平台服务的评价汇总与用户评分明细。评价汇总按服务维度汇总展示用户评分数据，支持查看评价明细和进行平台评分；评价明细查看某个服务下的用户评分明细，支持对评价进行回复。</p>

<h3 id="prd-3.2.3.3.1">3.2.3.3.1 质量评价列表</h3>
<p><strong>模块描述：</strong>质量评价管理 / 质量评价列表</p>
<p><strong>功能描述：</strong>按服务维度汇总展示用户评分数据，包括四个评分维度的平均值、用户评分和平台评分，支持按服务名称、服务ID和服务类型筛选，可查看评价明细和进行平台评分。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>列表数据来源于用户对已完成服务订单的评分数据，按服务维度汇总。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务ID</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的已评价服务的评价汇总数据，按服务维度聚合。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按用户评分降序排列。</p>
<p>3）默认加载10条数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称/ID</td><td></td><td>上方展示服务名称（加粗），下方展示服务ID（小号等宽字体），为空时显示"--"</td></tr>
<tr><td>平均准确性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户准确性评分) / 评价人数，大于等于4.5显示绿色，大于等于阈值显示橙色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均稳定性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户稳定性评分) / 评价人数，大于等于4.0显示绿色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均响应时效</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户响应时效评分) / 评价人数，大于等于4.5显示绿色，大于等于阈值显示橙色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均业务适配性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户业务适配性评分) / 评价人数，大于等于4.0显示绿色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>用户评分</td><td></td><td>以环形进度条展示所有用户四维均分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户四维均分) / 评价人数，其中四维均分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4<br>鼠标悬停提示"所有用户的平均分值"，为空时显示"--"</td></tr>
<tr><td>平台评分</td><td></td><td>以环形进度条展示平台管理员在质量评价管理中手动设置的评分（保留1位小数），鼠标悬停提示"平台管理员赋分"，为空时显示"--"</td></tr>
</table>
<h3 id="prd-3.2.3.3.2">3.2.3.3.2 查看明细操作</h3>
<p><strong>模块描述：</strong>质量评价管理 / 查看明细操作</p>
<p><strong>功能描述：</strong>查看某个服务下的用户评分明细列表，支持按评分和状态筛选，可对评价进行回复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在质量评价列表中点击【查看明细-按钮】进入，顶部显示当前服务名称和ID。</p>
<p><strong>详细设计：</strong></p>
<p>1、页面头部</p>
<p>显示【返回-按钮】，点击返回质量评价列表；右侧显示当前服务名称和服务ID。</p>
<p>2、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>四维均分</td><td></td><td>枚举：5星、4星、3星及以下，默认不选中</td></tr>
<tr><td>状态</td><td></td><td>枚举：待回复、已回复，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>3、列表展示</p>
<p>1）数据范围为当前选中服务（不区分机构）的所有用户评分数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按评价时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分维度</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
<tr><td>四维均分</td><td></td><td>展示该用户四个维度的算数平均分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4（保留1位小数），鼠标悬停提示"准确性、稳定性、响应时效、业务适配性的平均分值"</td></tr>
<tr><td>服务单号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>评价机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>评价内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm</td></tr>
<tr><td>回复内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），无回复时显示"--"</td></tr>
<tr><td>回复人</td><td></td><td>完整展示，无回复时显示"--"</td></tr>
<tr><td>回复时间</td><td></td><td>格式：yyyy-MM-dd hh:mm，无回复时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：待回复、已回复</td></tr>
</table>
<p>4、状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待回复</td><td></td><td>回复</td></tr>
<tr><td>已回复</td><td></td><td>--</td></tr>
</table>

<h3 id="prd-3.2.3.3.2.1">3.2.3.3.2.1 回复评价</h3>
<p><strong>模块描述：</strong>质量评价管理 / 回复评价弹窗</p>
<p><strong>功能描述：</strong>对用户评分进行回复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在查看明细列表中，仅状态为"待回复"的评价展示【回复-按钮】，点击打开回复弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>回复内容</td><td></td><td>多行文本，必填，占位提示"请输入回复内容..."</td></tr>
</table>
<p>2、操作-提交回复</p>
<p>点击【提交回复-按钮】，判断逻辑如下：</p>
<p>1）若回复内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请输入回复内容</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p>3）若满足条件，状态变更为已回复，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：回复成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.3.3.3">3.2.3.3.3 平台评分操作</h3>
<p><strong>模块描述：</strong>质量评价管理 / 平台评分操作</p>
<p><strong>功能描述：</strong>平台管理员对服务进行综合评分和评价。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在质量评价列表中，点击【平台评分-按钮】打开弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>星级评分组件，点击选择1-5星，右侧同步显示当前选中星数</td></tr>
<tr><td>评价内容</td><td></td><td>多行文本，必填，占位提示"请输入平台评分内容..."，最多500字</td></tr>
</table>
<p>2、操作-提交评价</p>
<p>点击【提交评价-按钮】，判断逻辑如下：</p>
<p>1）若未选择评分，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请选择评分</p>
<p>2）若评价内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请输入平台评分内容</p>
<p>3）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p>4）若满足条件，提交平台评分，关闭弹窗，进行消息提示，刷新汇总列表</p>
<p style="font-style:italic; color:#999">Tip：平台评分提交成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.2.4">3.2.4 需求管理</h3>

<h3 id="prd-3.2.4.1">3.2.4.1 所有需求</h3>
<p><strong>入口页面：</strong>运营管理后台 / 需求管理 / 所有需求</p>
<p><strong>页面描述：</strong>查看平台所有需求信息，支持查看需求详情。</p>

<h3 id="prd-3.2.4.1.1">3.2.4.1.1 需求列表</h3>
<p><strong>模块描述：</strong>需求管理 / 所有需求 / 需求列表</p>
<p><strong>功能描述：</strong>展示平台全部需求列表，支持按需求编号、申请机构、方案类型、服务类型和状态筛选，可查看需求详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构发起的需求。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用，默认不筛选</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，默认不筛选</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的所有状态（待响应、已响应、已完成、已关闭）的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>方案名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>需求描述</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)---→ 已响应 --(确认响应)---→ 已完成
  ┆
  └┄┄(关闭)┄┄→ 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>详情</td></tr>
<tr><td>已响应</td><td></td><td>详情</td></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已关闭</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.4.1.2">3.2.4.1.2 需求详情</h3>
<p><strong>模块描述：</strong>需求管理 / 所有需求 / 需求详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看需求详细信息，包括需求信息和响应信息（如有）。展示全量需求数据，供管理员查看所有机构提交的需求。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>在需求列表中点击【详情-按钮】打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>等宽字体，大号加粗展示，如"DM-20260810-0012"</td></tr>
<tr><td>方案类型</td><td></td><td>灰色文字，展示在需求编号右侧</td></tr>
<tr><td>方案名称</td><td></td><td>展示在头部副标题行</td></tr>
<tr><td>服务类型</td><td></td><td>以服务类型标签展示，与方案名称并排，中间以"·"分隔</td></tr>
</table>
<p>2、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，如"DM-20260810-0012"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>方案名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务项</td><td></td><td>以列表形式展示每个服务项的详细信息，每项包含：服务项名称（加粗展示）、服务项描述（灰色文字，超出2行显示省略号，鼠标悬停展示全部内容），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>需求描述</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>申请人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
</table>
<p>3、响应信息</p>
<p>仅当需求有响应内容时展示"响应信息"标签页；无响应时不显示该标签页。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应内容</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
`
  }
]

// ── 路由映射 ──────────────────────────────────────────────

const routePrdMap = {
  // 3.1.1 服务管理 - 服务上架
  '/workorder/myApps':                  { anchor: 'prd-3.1.1.1', pageName: '服务上架' },
  '/workorder/myAppsDetail':            { anchor: 'prd-3.1.1.1.4', pageName: '数字应用详情' },

  // 3.1.1 服务管理 - 开通管理
  '/workorder/order/mySubscriptions':       { anchor: 'prd-3.1.2', pageName: '服务订阅' },
  '/workorder/order/myInitiated':       { anchor: 'prd-3.1.2.2', pageName: '开通记录' },
  '/workorder/order/myInitiatedDetail': { anchor: 'prd-3.1.2.1.2', pageName: '订单详情' },

  // 工作台
  '/workorder/serviceDesk': { anchor: 'prd-3.1.1', pageName: '工作台' },

  // 3.1.1 服务管理 - 需求管理
  '/workorder/myDemand/initiate':       { anchor: 'prd-3.1.3', pageName: '我发起的需求' },
  '/workorder/myDemand/initiateDetail': { anchor: 'prd-3.1.3.1.4', pageName: '需求详情' },
  '/workorder/myDemand/response':       { anchor: 'prd-3.1.3.2', pageName: '我响应的需求' },
  '/workorder/myDemand/allDetail':      { anchor: 'prd-3.1.3.2.3', pageName: '需求详情' },
  '/workorder/myDemand/responseDetail': { anchor: 'prd-3.1.3.2.4', pageName: '响应详情' },

  // 3.2.1 服务目录管理
  '/portal/service/digitalApp':          { anchor: 'prd-3.2.1', pageName: '数字应用管理' },
  '/portal/service/digitalAppDetail':    { anchor: 'prd-3.2.1.1.4', pageName: '数字应用详情' },
  '/portal/service/component':           { anchor: 'prd-3.2.1.3', pageName: '能力组件管理' },
  '/portal/service/componentDetail':     { anchor: 'prd-3.2.1.3.4', pageName: '组件详情' },
  '/portal/service/serviceCatalog':      { anchor: 'prd-3.2.1.4', pageName: '基础服务管理' },
  '/portal/service/serviceCatalogDetail':{ anchor: 'prd-3.2.1.4.4', pageName: '服务详情' },
  '/portal/service/securityService':          { anchor: 'prd-3.2.1.2', pageName: '安全服务管理' },
  '/portal/service/securityServiceDetail':    { anchor: 'prd-3.2.1.2.4', pageName: '安全服务详情' },
  '/portal/service/securityServiceForm':      { anchor: 'prd-3.2.1.2.2', pageName: '新增安全服务' },
  '/portal/service/digitalAppForm':            { anchor: 'prd-3.2.1.1.2', pageName: '新增数字应用' },
  '/portal/service/componentForm':             { anchor: 'prd-3.2.1.3.2', pageName: '新增能力组件' },
  '/portal/service/serviceCatalogForm':        { anchor: 'prd-3.2.1.4.2', pageName: '新增基础服务' },

  // 3.2.2 服务审核管理
  '/portal/auditCenter/qualificationAudit':       { anchor: 'prd-3.2.2.1', pageName: '机构资质审核' },
  '/portal/auditCenter/qualificationDetail':      { anchor: 'prd-3.2.2.1.3', pageName: '审核详情' },
  '/portal/auditCenter/digitalAppAudit':          { anchor: 'prd-3.2.2.2', pageName: '数字应用审核' },
  '/portal/auditCenter/digitalAppAuditDetail':    { anchor: 'prd-3.2.2.2.3', pageName: '审核详情' },
  '/portal/auditCenter/componentAudit':           { anchor: 'prd-3.2.2.4', pageName: '能力组件审核' },
  '/portal/auditCenter/componentAuditDetail':     { anchor: 'prd-3.2.2.4.3', pageName: '审核详情' },
  '/portal/auditCenter/basicServiceAudit':        { anchor: 'prd-3.2.2.5', pageName: '基础服务审核' },
  '/portal/auditCenter/basicServiceAuditDetail':  { anchor: 'prd-3.2.2.5.3', pageName: '审核详情' },
  '/portal/auditCenter/securityServiceAudit':      { anchor: 'prd-3.2.2.3', pageName: '安全服务审核' },
  '/portal/auditCenter/securityServiceAuditDetail': { anchor: 'prd-3.2.2.3.3', pageName: '审核详情' },

  // 3.2.3 服务开通管理
  '/portal/order/list':        { anchor: 'prd-3.2.3',   pageName: '服务开通管理' },
  '/portal/order/detail':      { anchor: 'prd-3.2.3.1.2',   pageName: '订单详情' },
  '/portal/order/review':      { anchor: 'prd-3.2.3.3',   pageName: '质量评价管理' },
  '/workorder/order/list':     { anchor: 'prd-3.2.3',   pageName: '服务管理' },
  '/workorder/order/detail':   { anchor: 'prd-3.2.3.1.2',   pageName: '订单详情' },
  '/workorder/order/review':   { anchor: 'prd-3.2.3.3',   pageName: '质量评价管理' },

  // 3.2.4 需求管理
  '/portal/demand/all':      { anchor: 'prd-3.2.4',     pageName: '需求管理' },
  '/portal/demand/detail':   { anchor: 'prd-3.2.4.1.2', pageName: '需求详情' },
}

// ── 导出函数 ──────────────────────────────────────────────

/**
 * 拼接所有章节 HTML，返回完整 PRD 文档
 */
export function getAllPrdHtml() {
  return `<h1>产品需求文档</h1>
<h2>3. 功能详述</h2>
<h2 id="prd-3.1">3.1 机构端（开发者、医疗机构）</h2>
${prdChapters.slice(0, 2).map(c => c.content).join('\n')}
<h2 id="prd-3.2">3.2 管理端（运营用户）</h2>
${prdChapters.slice(2).map(c => c.content).join('\n')}`
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

/**
 * 提取 PRD 文档目录结构（所有 h3 标题及其层级）
 * @returns {Array<{id: string, num: string, text: string, level: number}>}
 */
export function getPrdToc() {
  const html = getAllPrdHtml()
  const headingRegex = /<(h[23])\s+id="(prd-[\d.]+)"[^>]*>([\s\S]*?)<\/\1>/g
  const items = []
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1]
    const id = match[2]
    const text = match[3].replace(/<[^>]*>/g, '').trim()
    const num = id.replace('prd-', '')
    const segments = num.split('.').length
    items.push({ id, num, text, level: segments })
  }
  return items
}
