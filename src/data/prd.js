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
    content: `<h3 id="prd-3.1.1">3.1.1 工作台</h3>
<p><strong>入口页面：</strong>服务管理 / 工作台</p>
<p><strong>页面描述：</strong>机构用户的服务开通申请入口，快速发起常用服务申请，或从全部服务目录中查找所需服务。</p>

<h3 id="prd-3.1.1.1">3.1.1.1 工作台</h3>
<p><strong>模块描述：</strong>服务管理 / 工作台 / 工作台</p>
<p><strong>功能描述：</strong>展示常用服务与全部服务，支持按服务名称搜索，点击服务卡片跳转至多云管理系统发起服务开通申请。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>全部服务数据来源于服务目录管理中状态为"已上线使用"的服务，按服务类型分组展示。</p>
<p><strong>详细设计：</strong></p>
<p>1、常用服务</p>
<p>展示常用服务卡片列表，点击服务卡片即可快速发起服务申请。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>常用服务</td><td></td><td>一期固定写死，由上线时确定具体服务ID；点击服务卡片跳转至多云管理系统发起服务开通申请</td></tr>
<tr><td>服务LOGO</td><td></td><td>展示服务图标</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示</td></tr>
</table>
<p>2、全部服务</p>
<p>1）数据范围为服务目录管理中状态为"已上线使用"的服务数据，按服务类型分组展示。</p>
<p>2）支持按服务名称模糊搜索，无匹配结果时显示"未找到匹配的服务"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>按服务类型分组展示，枚举：数字应用、安全服务、能力组件、基础服务，以服务类型标签样式展示</td></tr>
<tr><td>服务数量</td><td></td><td>展示当前服务类型分组下的服务数量，格式："N 个服务"</td></tr>
<tr><td>服务LOGO</td><td></td><td>展示服务图标</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示</td></tr>
</table>
<p>3、操作-点击服务</p>
<p>点击服务卡片，跳转至多云管理系统，判断逻辑如下：</p>
<p>1）若用户已登录，门户免登（SSO）跳转至多云管理系统并携带serviceId，用户在多云管理系统填写完整服务申请，提交即创建工单</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>

<h3 id="prd-3.1.2">3.1.2 服务管理</h3>
<p><strong>入口页面：</strong>服务管理</p>
<p><strong>页面描述：</strong>开发者与机构用户的服务管理核心入口，涵盖服务上架、开通管理、需求管理等核心功能。</p>

<h3 id="prd-3.1.2.1">3.1.2.1 服务上架</h3>
<p><strong>入口页面：</strong>服务管理 / 服务上架</p>
<p><strong>页面描述：</strong>对本机构提供的服务进行全生命周期管理，支持新增、修改、删除及提交审核。</p>

<h3 id="prd-3.1.2.1.1">3.1.2.1.1 服务列表</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 服务列表</p>
<p><strong>功能描述：</strong>展示本机构提交的服务列表，支持按服务类型、服务名称、服务ID和状态筛选，可进行新增服务、编辑服务、服务详情、删除服务操作。</p>
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
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，ID系统自动生成，格式：拼音缩写+YYYYMMDD+4位序号（数字应用：SZYY、安全服务：AQFW、能力组件：NLZJ、基础服务：JCFW，如 SZYY202608100001），唯一标识，为空时显示"--"</td></tr>
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
<tr><td>草稿</td><td></td><td>服务详情、编辑服务、删除服务</td></tr>
<tr><td>待审核</td><td></td><td>服务详情</td></tr>
<tr><td>已上线使用</td><td></td><td>服务详情、编辑服务、删除服务</td></tr>
<tr><td>已驳回</td><td></td><td>服务详情、编辑服务、删除服务</td></tr>
<tr><td>已下架</td><td></td><td>服务详情、编辑服务、删除服务</td></tr>
</table>
<p>注：下架操作仅由管理员在服务目录管理中执行。</p>

<h3 id="prd-3.1.2.1.2">3.1.2.1.2 新增服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增服务</p>
<p><strong>功能描述：</strong>新增服务统一入口。点击服务列表页【新增服务-按钮】弹出"选择服务类型"弹窗，展示四种服务类型的卡片网格：数字应用、安全服务、能力组件、基础服务。优先选择服务类型，再根据所选服务类型打开对应的新增页面。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【新增服务-按钮】，点击打开选择服务类型弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、选择服务类型弹窗</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型卡片</td><td>type</td><td>枚举：数字应用、安全服务、能力组件、基础服务；2×2 卡片网格布局，每张卡片包含图标、服务类型名称、说明文案，鼠标悬停高亮</td></tr>
<tr><td>操作-确定</td><td></td><td>点击【确定-按钮】，关闭弹窗，跳转至对应服务类型的新增页面</td></tr>
<tr><td>操作-取消</td><td></td><td>点击【取消-按钮】，关闭弹窗，停留当前页面</td></tr>
</table>
<p>2、服务类型映射</p>
<table>
<tr><th style="white-space:nowrap">服务类型</th><th style="white-space:nowrap">新增页面</th><th>说明</th></tr>
<tr><td>数字应用</td><td>新增数字应用</td><td>见 3.1.2.1.2.1 新增数字应用</td></tr>
<tr><td>安全服务</td><td>新增安全服务</td><td>见 3.1.2.1.2.2 新增安全服务</td></tr>
<tr><td>能力组件</td><td>新增能力组件</td><td>见 3.1.2.1.2.3 新增能力组件</td></tr>
<tr><td>基础服务</td><td>新增基础服务</td><td>见 3.1.2.1.2.4 新增基础服务</td></tr>
</table>

<h3 id="prd-3.1.2.1.2.1">3.1.2.1.2.1 新增数字应用</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增数字应用</p>
<p><strong>功能描述：</strong>新增数字应用，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表上方【新增服务-按钮】，选择服务类型后打开弹窗，标题"新增数字应用"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>应用描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入</td></tr>
<tr><td>系统地址</td><td>address</td><td>非必填，有效URL格式</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>服务对象</td><td>数据拉取字典管理 dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
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
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>b.系统自动生成ID，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成ID，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识</p>
<p>c.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.2.2">3.1.2.1.2.2 新增安全服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增安全服务</p>
<p><strong>功能描述：</strong>新增安全服务，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表上方【新增服务-按钮】，选择服务类型后打开弹窗，标题"新增安全服务"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>必填，限制40字符，超出不可输入，占位提示"请输入安全服务名称"</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>非必填，文本输入，占位提示"请输入系统地址"</td></tr>
<tr><td>LOGO</td><td>logo</td><td>非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内，建议 640×640；上传超过 1MB 时提示"LOGO 文件不能超过 1MB"；点击替换或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>非必填，多选框组，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，多选框组，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
</table>
<p>4、操作-保存草稿</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
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
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>b.系统自动生成ID，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
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
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成ID，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</p>
<p>c.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.2.3">3.1.2.1.2.3 新增能力组件</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增能力组件</p>
<p><strong>功能描述：</strong>新增能力组件，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表上方【新增服务-按钮】，选择服务类型后打开弹窗，标题"新增能力组件"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>必填，限制20汉字，超出不可输入，占位提示"请输入能力组件名称"，右下角显示字数统计</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>组件描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入，占位提示"请输入组件描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>必填，枚举：不限、市级、区（县）域</td></tr>
</table>
<p>4、操作-保存草稿</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>b.系统自动生成ID，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成ID，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识</p>
<p>c.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.2.4">3.1.2.1.2.4 新增基础服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 新增基础服务</p>
<p><strong>功能描述：</strong>新增基础服务，可设置基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表上方【新增服务-按钮】，选择服务类型后打开弹窗，标题"新增基础服务"，表单为空。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td>serviceName</td><td>必填，限制40字符，超出不可输入，占位提示"请输入基础服务名称"，右下角显示字数统计</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>服务描述</td><td>description</td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>非必填，文本输入，占位提示"请输入服务商名称"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填，包含联系人姓名和联系电话</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，包含联系人姓名和联系电话</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>必填，单选，枚举：X86专区、信创专区、密码服务专区、超算、智算专区；选择后联动下方"服务分类"选项</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>必填，支持多选，按所选服务专区联动展示对应字典项：<br>· X86专区（ServiceType_X86Zone）：机房云托管服务、计算服务、存储服务、网络服务、安全服务、大数据服务、备份容灾服务、数据库服务<br>· 信创专区（ServiceType_XinChuangZone）：机房云托管服务、计算服务、存储服务、网络服务、软件服务<br>· 密码服务专区（ServiceType_CipherZone）：密码服务<br>· 超算、智算专区（ServiceType_SuperComputeZone）：超算服务、智算服务</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云，支持多选</td></tr>
</table>
<p>4、操作-保存草稿</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>b.系统自动生成ID，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识</p>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成ID，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识</p>
<p>c.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>6、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.3">3.1.2.1.3 编辑服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑服务</p>
<p><strong>功能描述：</strong>编辑服务统一入口。点击服务列表页操作栏【修改-按钮】，根据记录的服务类型打开对应的编辑页面，字段规则与新增一致，并预填当前数据。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当服务状态为"草稿/已驳回/已上线使用/已下架"时，操作栏显示【修改-按钮】，点击打开编辑服务弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、服务类型映射</p>
<table>
<tr><th style="white-space:nowrap">服务类型</th><th style="white-space:nowrap">子节</th><th>说明</th></tr>
<tr><td>数字应用</td><td>3.1.2.1.3.1 编辑数字应用</td><td>回显原数字应用数据</td></tr>
<tr><td>安全服务</td><td>3.1.2.1.3.2 编辑安全服务</td><td>回显原安全服务数据</td></tr>
<tr><td>能力组件</td><td>3.1.2.1.3.3 编辑能力组件</td><td>回显原能力组件数据</td></tr>
<tr><td>基础服务</td><td>3.1.2.1.3.4 编辑基础服务</td><td>回显原基础服务数据</td></tr>
</table>

<h3 id="prd-3.1.2.1.3.1">3.1.2.1.3.1 编辑数字应用</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑数字应用，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击操作栏【修改-按钮】后打开弹窗，标题"修改数字应用"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原应用名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
<tr><td>应用描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原应用描述，可修改</td></tr>
<tr><td>系统地址</td><td>address</td><td>1.非必填，有效URL格式；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>1.非必填，多个用;分隔；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>服务对象</td><td>数据拉取字典管理 dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原服务对象，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
</table>
<p>2、操作-保存草稿</p>
<p>仅状态为草稿时可点击【保存草稿-按钮】，其余状态按钮置灰不可点击。</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>3、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">应用名称为空：请输入应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>4、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.3.2">3.1.2.1.3.2 编辑安全服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑安全服务</p>
<p><strong>功能描述：</strong>编辑安全服务，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击操作栏【修改-按钮】后打开弹窗，标题"修改安全服务"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原服务名称，可修改</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>1.非必填，文本输入；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>1.必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>1.非必填，文本输入；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，多选框组；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，多选框组；<br>2.回显原部署云服务商，可修改</td></tr>
</table>
<p>2、操作-保存草稿</p>
<p>仅状态为草稿时可点击【保存草稿-按钮】，其余状态按钮置灰不可点击。</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
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
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>3、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
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
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>4、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.3.3">3.1.2.1.3.3 编辑能力组件</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑能力组件</p>
<p><strong>功能描述：</strong>编辑能力组件，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击操作栏【修改-按钮】后打开弹窗，标题"修改能力组件"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原能力组件名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>组件描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原组件描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>非必填；回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填；回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填；回显原联系方式2，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填；回显原部署云服务商，可修改</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>必填；回显原开放范围，可修改</td></tr>
</table>
<p>2、操作-保存草稿</p>
<p>仅状态为草稿时可点击【保存草稿-按钮】，其余状态按钮置灰不可点击。</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>3、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>4、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.3.4">3.1.2.1.3.4 编辑基础服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 编辑基础服务</p>
<p><strong>功能描述：</strong>编辑基础服务，可修改基本信息、联系信息和分类标签，支持保存草稿或提交审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击操作栏【修改-按钮】后打开弹窗，标题"修改基础服务"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td>serviceName</td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原基础服务名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>1.非必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>1.必填，单选，枚举：X86专区、信创专区、密码服务专区、超算、智算专区；<br>2.回显原服务专区，可修改</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>1.必填，支持多选，按所选服务专区联动展示对应字典项；<br>2.回显原服务分类，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选；<br>2.回显原部署云服务商，可修改</td></tr>
</table>
<p>2、操作-保存草稿</p>
<p>仅状态为草稿时可点击【保存草稿-按钮】，其余状态按钮置灰不可点击。</p>
<p>点击【保存草稿-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='草稿' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：草稿已保存</p>
<p>3、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.以 status='待审核' 提交，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：已提交审核</p>
<p>b.系统自动生成一条审核记录，字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取当前时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前登录用户</td></tr>
<tr><td>审核状态</td><td></td><td>固定为"待审核"</td></tr>
<tr><td>审核人</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核时间</td><td></td><td>待审核阶段暂无，为空</td></tr>
<tr><td>审核意见</td><td></td><td>待审核阶段暂无，为空</td></tr>
</table>
<p>4、操作-关闭</p>
<p>点击【关闭-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.2.1.4">3.1.2.1.4 服务详情</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 服务详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看服务的完整信息，包括概览、审核信息和评价信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击根据服务类型打开对应详情抽屉；概览字段随服务类型不同而不同，审核信息、评价信息各类型通用。</p>
<p><strong>详细设计：</strong></p>
<p>1、概览-数字应用</p>
<p>展示数字应用的概览信息，包括基本信息、联系信息、分类标签。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>系统自动生成，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已上线使用、已驳回、已下架</td></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>LOGO</td><td>logo</td><td>显示LOGO图片，为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出3行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>2、概览-安全服务</p>
<p>展示安全服务的概览信息，包括基本信息、联系信息、分类标签。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>安全服务名称</td><td>title</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：草稿、待审核、已上线使用、已驳回、已下架</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>cooperativeEnterprise</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人和联系电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人和联系电话，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
</table>
<p>3、概览-能力组件</p>
<p>展示能力组件的概览信息，包括基本信息、联系信息、分类标签。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件ID</td><td>componentId</td><td>系统自动生成，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>组件名称</td><td>name</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：草稿、待审核、已上线使用、已驳回、已下架</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、概览-基础服务</p>
<p>展示基础服务的概览信息，包括基本信息、联系信息、分类标签。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td></td><td>系统自动生成，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>附件材料</td><td></td><td>显示附件名称列表，点击下载</td></tr>
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
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，返回服务上架列表页。</p>

<h3 id="prd-3.1.2.1.5">3.1.2.1.5 删除服务</h3>
<p><strong>模块描述：</strong>服务管理 / 服务上架 / 删除服务</p>
<p><strong>功能描述：</strong>删除操作适用于所有服务类型（数字应用、安全服务、能力组件、基础服务），为该功能通用操作，不针对特定服务类型。删除后不可恢复，仅草稿、已驳回、已上线使用、已下架状态可删除。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>当服务状态为"草稿/已驳回/已上线使用/已下架"时，操作栏显示【删除-按钮】，点击弹出删除确认框。</p>
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
    content: `<h3 id="prd-3.1.3">3.1.3 开通管理</h3>

<h3 id="prd-3.1.3.1">3.1.3.1 服务开通</h3>
<p><strong>入口页面：</strong>服务管理 / 开通管理 / 服务开通</p>
<p><strong>页面描述：</strong>查看本机构发起的服务订单，支持查看订单详情并对已完成订单进行评价。</p>

<h3 id="prd-3.1.3.1.1">3.1.3.1.1 服务开通列表</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务开通 / 列表</p>
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
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，ID系统自动生成，格式：拼音缩写+YYYYMMDD+4位序号（数字应用：SZYY、安全服务：AQFW、能力组件：NLZJ、基础服务：JCFW，如 SZYY202608100001），唯一标识，为空时显示"--"</td></tr>
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
<h3 id="prd-3.1.3.1.2">3.1.3.1.2 服务开通详情</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务开通 / 详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看订单完整信息，包括基本信息和流程进度，支持跳转关联工单。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td>serviceName</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>服务单号</td><td>orderNo</td><td>灰色小字，展示于服务名称下方，为空时显示"--"</td></tr>
</table>
<p>2、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td>serviceId</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，为空时显示"--"；点击"跳转工单"按钮，以URL参数形式携带工单ID（workorderId，如 /workorder/detail?workorderId=TK-0245）跳转至多云管理系统工单详情页，用于定位并展示该工单的详细信息</td></tr>
</table>
<p>3、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：用户点击服务后经统一认证SSO跳转至多云管理系统填写服务申请，系统创建服务订单（绑定serviceId），以订单创建时间记录为提交申请节点时间<br>2、系统派发工单：多云管理系统创建工单后，调用工单回调接口回传workOrderId及工单创建时间（eventType=CREATED），系统接收回调后记录为系统派发工单节点时间，订单状态默认流转为工单流转中<br>3、工单流转中：接收工单创建回调（eventType=CREATED）后订单进入的默认状态，节点时间取系统派发工单的回调时间<br>4、服务交付完成：多云管理系统回传工单通过事件及时间（eventType=APPROVED），系统接收回调后记录为服务交付完成节点时间<br>5、服务评价：用户提交服务评价后，以评价提交时间记录为服务评价节点时间<br>6、订单驳回：多云管理系统回传工单驳回事件及时间（eventType=REJECTED，备注含驳回原因），系统接收回调后记录为订单驳回节点时间<br>7、订单取消：用户取消订单后，以取消操作时间记录为订单取消节点时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.1.3.1.3">3.1.3.1.3 操作-评价</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务开通 / 评价</p>
<p><strong>功能描述：</strong>机构用户对已完成订单进行满意度评价。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"已完成"时，操作栏显示【评价-按钮】，点击打开评价弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>准确性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>稳定性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>响应时效评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>业务适配性评分</td><td></td><td>必填，5星评分</td></tr>
<tr><td>评价内容</td><td></td><td>必填，多行文本</td></tr>
</table>
<p>2、操作-提交评价</p>
<p>点击【提交评价-按钮】，判断逻辑如下：</p>
<p>1）若评价内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请填写评价内容</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，订单状态变更为已评价，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：评价提交成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存评价内容，停留当前页面。</p>

<h3 id="prd-3.1.3.1.4">3.1.3.1.4 操作-查看评价</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 服务开通 / 查看评价</p>
<p><strong>功能描述：</strong>查看已评价订单的评价明细和开发者回复。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"已评价"时，操作栏显示【查看评价-按钮】，点击打开评价查看弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、展示内容</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>展示准确性评分、稳定性评分、响应时效评分、业务适配性评分四维度5星评分</td></tr>
<tr><td>评价内容</td><td></td><td>展示用户填写的评价内容，为空时显示"--"</td></tr>
<tr><td>开发者回复</td><td></td><td>开发者已回复时展示回复内容；未回复时不显示开发者回复</td></tr>
</table>

<h3 id="prd-3.1.3.2">3.1.3.2 开通记录</h3>
<p><strong>入口页面：</strong>服务管理 / 开通管理 / 开通记录</p>
<p><strong>页面描述：</strong>查看机构订阅本开发者服务的订单记录，支持查看订单详情、评价及回复。</p>

<h3 id="prd-3.1.3.2.1">3.1.3.2.1 开通记录列表</h3>
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
<tr><td>状态</td><td></td><td>枚举：已完成、已评价，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为其他机构订阅本开发者服务（匹配服务ID）的所有状态（已完成、已评价）的订单数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务单号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务名称/ID</td><td></td><td>展示服务名称及服务ID，ID系统自动生成，格式：拼音缩写+YYYYMMDD+4位序号（数字应用：SZYY、安全服务：AQFW、能力组件：NLZJ、基础服务：JCFW，如 SZYY202608100001），唯一标识，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已完成、已评价</td></tr>
<tr><td>关联工单</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>已完成</td><td></td><td>详情</td></tr>
<tr><td>已评价</td><td></td><td>详情、查看评价、回复</td></tr>
</table>
<h3 id="prd-3.1.3.2.2">3.1.3.2.2 开通记录详情</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 开通记录 / 详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看订单完整信息，包括基本信息和流程进度。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td>serviceName</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已完成、已评价</td></tr>
<tr><td>服务单号</td><td>orderNo</td><td>灰色小字，展示于服务名称下方，为空时显示"--"</td></tr>
</table>
<p>2、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td>serviceId</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>3、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：用户点击服务后经统一认证SSO跳转至多云管理系统填写服务申请，系统创建服务订单（绑定serviceId），以订单创建时间记录为提交申请节点时间<br>2、系统派发工单：多云管理系统创建工单后，调用工单回调接口回传workOrderId及工单创建时间（eventType=CREATED），系统接收回调后记录为系统派发工单节点时间，订单状态默认流转为工单流转中<br>3、工单流转中：接收工单创建回调（eventType=CREATED）后订单进入的默认状态，节点时间取系统派发工单的回调时间<br>4、服务交付完成：多云管理系统回传工单通过事件及时间（eventType=APPROVED），系统接收回调后记录为服务交付完成节点时间<br>5、服务评价：用户提交服务评价后，以评价提交时间记录为服务评价节点时间<br>6、订单驳回：多云管理系统回传工单驳回事件及时间（eventType=REJECTED，备注含驳回原因），系统接收回调后记录为订单驳回节点时间<br>7、订单取消：用户取消订单后，以取消操作时间记录为订单取消节点时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.1.3.2.3">3.1.3.2.3 操作-查看评价</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 开通记录 / 查看评价</p>
<p><strong>功能描述：</strong>查看已评价订单的评价明细和开发者回复。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"已评价"时，操作栏显示【查看评价-按钮】，点击打开评价查看弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、展示内容</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>展示准确性评分、稳定性评分、响应时效评分、业务适配性评分四维度5星评分</td></tr>
<tr><td>评价内容</td><td></td><td>展示用户填写的评价内容，为空时显示"--"</td></tr>
<tr><td>开发者回复</td><td></td><td>开发者已回复时展示回复内容；未回复时不显示开发者回复</td></tr>
</table>

<h3 id="prd-3.1.3.2.4">3.1.3.2.4 操作-回复评价</h3>
<p><strong>模块描述：</strong>服务管理 / 开通管理 / 开通记录 / 回复评价</p>
<p><strong>功能描述：</strong>开发者对已评价订单进行回复。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"已评价"时，操作栏显示【回复-按钮】，点击打开回复弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>回复内容</td><td></td><td>必填，多行文本</td></tr>
</table>
<p>2、操作-提交回复</p>
<p>点击【提交回复-按钮】，判断逻辑如下：</p>
<p>1）若回复内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请填写回复内容</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，保存回复内容，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：回复成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存回复内容，停留当前页面。</p>

<h3 id="prd-3.1.4">3.1.4 需求管理</h3>

<h3 id="prd-3.1.4.1">3.1.4.1 需求发起</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求发起</p>
<p><strong>页面描述：</strong>管理本机构发起的需求，支持新增、查看详情、确认响应和关闭操作。</p>

<h3 id="prd-3.1.4.1.1">3.1.4.1.1 需求发起列表</h3>
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
<tr><td>需求说明</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，以标签样式展示</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>响应机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
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

<h3 id="prd-3.1.4.1.4">3.1.4.1.4 需求发起详情</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 需求详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看本机构发起的需求详细信息，包括需求信息和响应信息（如有）。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>方案名称</td><td></td><td>大号加粗展示</td></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，前缀"需求编号："，如"需求编号：DM-20260810-0012"</td></tr>
<tr><td>状态</td><td></td><td>以状态标签（StatusDot组件）展示</td></tr>
</table>
<p>2）需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>以服务类型标签样式展示，枚举：数字应用、能力组件、安全服务、基础服务，为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>需求说明</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3）响应信息</p>
<p>仅当需求存在响应内容时展示响应信息。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>

<h3 id="prd-3.1.4.1.2">3.1.4.1.2 新增需求</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 新增需求</p>
<p><strong>功能描述：</strong>跳转到渝康云门户网站发起需求。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【新增需求-按钮】，点击打开新增需求弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>点击【新增需求-按钮】，跳转至渝康云门户网站发起需求，需求详情见门户网站PRD。</p>

<h3 id="prd-3.1.4.1.3">3.1.4.1.3 关闭需求</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求发起 / 关闭需求</p>
<p><strong>功能描述：</strong>关闭一条待响应状态的需求，关闭后不可恢复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>当需求状态为"待响应"时，操作栏显示【关闭-按钮】，点击弹出关闭确认框。</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行关闭，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为已关闭，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：需求已关闭</p>

<h3 id="prd-3.1.4.2">3.1.4.2 需求响应</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求响应</p>
<p><strong>页面描述：</strong>查看平台所有待响应需求并对需求进行响应，支持查看需求和响应详情。</p>

<h3 id="prd-3.1.4.2.1">3.1.4.2.1 所有待响应需求</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求响应 / 所有待响应需求</p>
<p><strong>页面描述：</strong>查看平台所有待响应需求，支持响应需求、查看详情。</p>

<h3 id="prd-3.1.4.2.1.1">3.1.4.2.1.1 所有待响应需求列表</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 所有待响应需求 / 列表</p>
<p><strong>功能描述：</strong>展示平台所有待响应需求，支持按需求编号、申请机构、服务类型筛选，可响应需求、查看详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>默认展示"所有待响应需求"标签页，列表数据来源于平台所有机构发起的待响应需求。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）发布的状态为待响应的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按发布时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip）</td></tr>
<tr><td>方案名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>需求说明</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，以标签样式展示</td></tr>
<tr><td>状态</td><td></td><td>固定为"待响应"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
待响应 --(响应)----> 已响应 --(确认响应)----> 已完成
  ┆
  └┄┄(关闭)┄┄-> 已关闭
</pre>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>待响应</td><td></td><td>响应、详情</td></tr>
</table>

<h3 id="prd-3.1.4.2.1.2">3.1.4.2.1.2 所有待响应需求详情</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 所有待响应需求 / 需求详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看需求详细信息，包括需求基本信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>方案名称</td><td></td><td>大号加粗展示</td></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，如"DM-20260810-0012"</td></tr>
<tr><td>状态</td><td></td><td>以状态标签（StatusDot组件）展示</td></tr>
</table>
<p>2、需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，以标签样式展示</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>以列表形式展示每个服务项的详细信息，每项包含：服务项名称（加粗展示）、服务项描述（灰色文字，超出2行显示省略号，鼠标悬停展示全部内容），为空时显示"--"</td></tr>
<tr><td>需求说明</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>

<h3 id="prd-3.1.4.2.1.3">3.1.4.2.1.3 操作-响应</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 所有待响应需求 / 响应需求</p>
<p><strong>功能描述：</strong>以弹窗形式对待响应状态的需求提交响应方案，包括响应内容、预估报价和预计工期，不展示需求信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当需求状态为"待响应"时，操作栏显示【响应-按钮】，点击打开响应弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应内容</td><td>responseContent</td><td>必填，多行文本，描述解决方案、技术方案和交付计划</td></tr>
<tr><td>预估报价</td><td>estimatedPrice</td><td>必填，数字输入，单位为元</td></tr>
<tr><td>预计工期</td><td>estimatedDuration</td><td>非必填，文本输入</td></tr>
</table>
<p>3、操作-提交响应</p>
<p>点击【提交响应-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">响应内容为空：请输入响应内容</p>
<p style="font-style:italic; color:#999">预估报价为空：请输入预估报价</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件，状态变更为已响应，关闭弹窗，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：响应提交成功</p>
<p>4、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，不保存修改，停留当前页面。</p>

<h3 id="prd-3.1.4.2.2">3.1.4.2.2 我的响应</h3>
<p><strong>入口页面：</strong>服务管理 / 需求管理 / 需求响应 / 我的响应</p>
<p><strong>页面描述：</strong>查看本机构响应的需求记录，支持查看详情。</p>

<h3 id="prd-3.1.4.2.2.1">3.1.4.2.2.1 我的响应需求列表</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 我的响应 / 列表</p>
<p><strong>功能描述：</strong>展示本机构响应的需求记录，支持按需求编号、申请机构、服务类型筛选，可查看详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击"我的响应"标签页，列表数据来源于本机构响应的需求。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，默认不筛选</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构（匹配统一社会信用代码）响应的所有状态（已响应、已完成、已关闭）的需求数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按响应时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>需求编号</td><td></td><td>系统自动生成，格式：DM-YYYYMMDD-NNNN（如 DM-20260810-0012），超出1行显示省略号，鼠标悬停展示全部内容（Tooltip）</td></tr>
<tr><td>需求描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、能力组件、安全服务、基础服务，以标签样式展示</td></tr>
<tr><td>需求状态</td><td></td><td>枚举：已响应、已完成、已关闭</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>响应机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、操作-状态流转与按钮</p>
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

<h3 id="prd-3.1.4.2.2.2">3.1.4.2.2.2 我的响应需求详情</h3>
<p><strong>模块描述：</strong>服务管理 / 需求管理 / 需求响应 / 我的响应 / 响应详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看本机构对需求的响应详情，包括需求信息和响应信息。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>方案名称</td><td></td><td>大号加粗展示</td></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，前缀"需求编号："，如"需求编号：DM-20260810-0012"</td></tr>
<tr><td>状态</td><td></td><td>以状态标签（StatusDot组件）展示</td></tr>
</table>
<p>2）需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>以服务类型标签样式展示，枚举：数字应用、安全服务、能力组件、基础服务，为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>需求说明</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3）响应信息</p>
<p>仅当需求存在响应内容时展示响应信息。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
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
<p><strong>功能描述：</strong>展示平台数字应用列表，支持按数字应用名称、数字应用ID、服务商名称、应用覆盖范围、服务对象和状态筛选，可进行新增、修改、删除、发布、下线操作。</p>
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
<tr><td>服务对象</td><td>target</td><td>枚举：基层医疗卫生机构、公立医院、医技护人员，默认不筛选</td></tr>
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
<tr><td>数字应用名称/ID</td><td>name, applicationId</td><td>展示应用名称及ID，ID系统自动生成，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用覆盖范围</td><td>cover 数组各value，用;分割</td><td>多值以分号分隔展示，超出换行，为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作企业</td><td>partnerName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
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
<p><strong>输入/前置条件：</strong>列表上方显示【新增-按钮】，点击跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称</td><td>name</td><td>必填，限制20汉字，超出不可输入</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>应用描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入</td></tr>
<tr><td>系统地址</td><td>address</td><td>非必填，有效URL格式</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>服务对象</td><td>数据拉取字典管理 dict表 Client</td><td>必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>勾选"基层医疗卫生机构"时联动显示，支持多选，枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>勾选"公立医院"时联动显示，支持多选，枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>勾选"医技护人员"时联动显示，支持多选，暂无可选项</td></tr>
</table>
<p>4、管理信息</p>
<p>仅管理员在服务目录管理中可见；其中"显示顺序"、"服务征集得分"编辑提交时无需审核，即时生效。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"</td></tr>
</table>
<p>5、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">数字应用名称为空：请输入数字应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">系统地址格式错误：请输入https://或http://开头的地址形式</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成ID，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识</p>
<p>c.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>6、操作-返回</p>
<p>点击顶部【返回-按钮】，返回数字应用列表页，不保存修改。</p>

<h3 id="prd-3.2.1.1.3">3.2.1.1.3 编辑数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 编辑数字应用</p>
<p><strong>功能描述：</strong>编辑已有数字应用的基本信息、联系信息和分类标签，直接发布后管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【修改-按钮】，选中一条记录后点击跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>数字应用名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原数字应用名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，Toast 提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"；<br>5.回显原LOGO，可修改</td></tr>
<tr><td>应用描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原应用描述，可修改</td></tr>
<tr><td>系统地址</td><td>address</td><td>1.非必填，有效URL格式；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>partnerName</td><td>1.非必填，多个用;分隔；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>服务对象</td><td>数据拉取字典管理 dict表 Client</td><td>1.必填，支持多选，枚举：基层医疗卫生机构、公立医院、医技护人员；<br>2.回显原服务对象，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，支持多选，枚举：B/S、C/S架构、B/S+C/S、单机、其他；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>基层应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_PrimaryHospital</td><td>1.勾选"基层医疗卫生机构"时联动显示，支持多选；<br>2.回显原基层应用覆盖范围，可修改。枚举：基本公共卫生服务、医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、智慧管理平台（HRP）、心电、家庭医生签约、村卫生室管理、药店应用管理、智能外呼、辅助诊疗、临床专病库、区域综合、基本公共卫生服务绩效评价、妇幼健康</td></tr>
<tr><td>公立应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_Hospital</td><td>1.勾选"公立医院"时联动显示，支持多选；<br>2.回显原公立应用覆盖范围，可修改。枚举：医院信息系统（HIS）、实验室信息管理系统（LIS）、影像归档和通信系统（PACS）、心电、医养结合一体化、智慧管理平台（HRP）、药店应用管理、智能外呼、临床专病库、医共体信息平台、妇幼健康</td></tr>
<tr><td>医技应用覆盖范围</td><td>数据拉取字典管理 dict表 AppScope_MedicalPersonnel</td><td>1.勾选"医技护人员"时联动显示，支持多选；<br>2.回显原医技应用覆盖范围，可修改，暂无可选项</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>1.非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"；<br>2.回显原服务征集得分，可修改</td></tr>
</table>
<p>注："显示顺序"、"服务征集得分"属于管理信息，仅管理员在服务目录管理中可见，编辑提交时无需审核，即时生效。</p>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">数字应用名称为空：请输入数字应用名称</p>
<p style="font-style:italic; color:#999">应用描述为空：请输入应用描述</p>
<p style="font-style:italic; color:#999">服务商名称为空：请输入服务商名称</p>
<p style="font-style:italic; color:#999">联系方式1为空：请输入联系人姓名和手机号</p>
<p style="font-style:italic; color:#999">服务对象为空：请选择服务对象</p>
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
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回数字应用列表页，不保存修改。</p>

<h3 id="prd-3.2.1.1.4">3.2.1.1.4 数字应用详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 数字应用详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用的完整信息，包括基本信息、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示应用Logo图片，若无则显示默认图标</td></tr>
<tr><td>数字应用名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已上线使用、已下架</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识</td></tr>
</table>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
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
<tr><td>服务对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>基层应用覆盖范围</td><td></td><td>仅当服务对象含"基层医疗卫生机构"时显示，多值以分号分隔展示</td></tr>
<tr><td>公立应用覆盖范围</td><td></td><td>仅当服务对象含"公立医院"时显示，多值以分号分隔展示</td></tr>
<tr><td>医技应用覆盖范围</td><td></td><td>仅当服务对象含"医技护人员"时显示，多值以分号分隔展示</td></tr>
</table>
<p>5、概览-管理信息</p>
<p>仅管理员在服务目录管理中可见。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示"0"</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>数字展示，为空时显示"--"</td></tr>
</table>
<p>6、审核信息</p>
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
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
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
<p><strong>输入/前置条件：</strong>列表上方显示【发布-按钮】，勾选一条或多条状态为"已下架"的记录后点击，弹出发布确认框。</p>
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
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>

<h3 id="prd-3.2.1.1.6">3.2.1.1.6 下线数字应用</h3>
<p><strong>模块描述：</strong>服务目录管理 / 数字应用管理 / 下线数字应用</p>
<p><strong>功能描述：</strong>将已上线使用的数字应用下线，下线后应用状态变更为已下架。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【下线-按钮】，勾选一条或多条状态为"已上线使用"的记录后点击，弹出下线确认框。</p>
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
<p><strong>输入/前置条件：</strong>列表上方显示【删除-按钮】，勾选一条或多条记录后点击，弹出删除确认框。</p>
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
<tr><td>安全服务名称/ID</td><td></td><td>展示服务名称及ID，ID系统自动生成，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>合作伙伴</td><td>cooperativeEnterprise</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
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
<p>b.系统自动生成ID，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</p>
<p>c.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>6、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.2">3.2.1.2.2 新增安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 新增安全服务</p>
<p><strong>功能描述：</strong>新增一个安全服务，设置基本信息、联系信息、分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【新增-按钮】，点击跳转至新增安全服务表单页。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>必填，限制40字符，超出不可输入，占位提示"请输入安全服务名称"</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>非必填，文本输入，占位提示"请输入系统地址"</td></tr>
<tr><td>LOGO</td><td>logo</td><td>非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内，建议 640×640；上传超过 1MB 时提示"LOGO 文件不能超过 1MB"；点击替换或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>非必填，多选框组，枚举：B/S、C/S架构、B/S+C/S、单机、其他</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，多选框组，枚举：电信云、移动云、联通云、浪潮云、紫光云、影像云</td></tr>
</table>
<p>4、管理信息</p>
<p>仅管理员在服务目录管理中可见；其中"显示顺序"、"服务征集得分"编辑提交时无需审核，即时生效。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"</td></tr>
</table>
<p>5、操作-直接发布</p>
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
<p>b.系统自动生成ID，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</p>
<p>c.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>6、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.3">3.2.1.2.3 编辑安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 编辑安全服务</p>
<p><strong>功能描述：</strong>编辑已有安全服务的基本信息、联系信息和分类标签，支持直接发布。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【修改-按钮】，选中一条记录后点击跳转至编辑安全服务表单页，标题"编辑安全服务"，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增表单相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>安全服务名称</td><td></td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原服务名称，可修改</td></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>1.非必填，文本输入；<br>2.回显原系统地址，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 PNG、JPG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>1.必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>1.非必填，文本输入；<br>2.回显原合作伙伴名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.必填，联系人姓名 + 手机号，以"-"分隔；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，格式同联系方式1；<br>2.回显原联系方式2，可修改</td></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>1.非必填，多选框组；<br>2.回显原应用架构，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，多选框组；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>1.非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"；<br>2.回显原服务征集得分，可修改</td></tr>
</table>
<p>注："显示顺序"、"服务征集得分"属于管理信息，仅管理员在服务目录管理中可见，编辑提交时无需审核，即时生效。</p>
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
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击【返回-按钮】，返回安全服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.2.4">3.2.1.2.4 安全服务详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 安全服务详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看安全服务的完整信息，包括概览（基本信息、联系信息、分类标签）、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>安全服务名称</td><td>title</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已上线使用、已下架</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</td></tr>
</table>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
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
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
</table>
<p>5、概览-管理信息</p>
<p>仅管理员在服务目录管理中可见。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示"0"</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>数字展示，为空时显示"--"</td></tr>
</table>
<p>6、审核信息</p>
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
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.2.5">3.2.1.2.5 发布安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 发布安全服务</p>
<p><strong>功能描述：</strong>将已下架状态的安全服务发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【发布-按钮】，勾选一条或多条状态为"已下架"的记录后点击，弹出发布确认框。</p>
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
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>

<h3 id="prd-3.2.1.2.6">3.2.1.2.6 下线安全服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 安全服务管理 / 下线安全服务</p>
<p><strong>功能描述：</strong>将已上线使用的安全服务下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【下线-按钮】，勾选一条或多条状态为"已上线使用"的记录后点击，弹出下线确认框。</p>
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
<p><strong>输入/前置条件：</strong>列表上方显示【删除-按钮】，勾选一条或多条记录后点击，弹出删除确认框。</p>
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
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>枚举：不限、市级、区（县）域，默认不筛选</td></tr>
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
<tr><td>能力组件名称/ID</td><td>name, componentId</td><td>展示组件名称及ID，ID系统自动生成，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
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
<p><strong>输入/前置条件：</strong>列表上方显示【新增-按钮】，点击跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>必填，限制20汉字，超出不可输入，占位提示"请输入能力组件名称"，右下角显示字数统计</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>组件描述</td><td>description</td><td>必填，限制1000汉字，超出不可输入，占位提示"请输入组件描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
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
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>必填，枚举：不限、市级、区（县）域</td></tr>
</table>
<p>4、管理信息</p>
<p>仅管理员在服务目录管理中可见；其中"显示顺序"、"服务征集得分"编辑提交时无需审核，即时生效。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"</td></tr>
</table>
<p>5、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p style="font-style:italic; color:#999">开放范围为空：请选择开放范围</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成ID，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识</p>
<p>c.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>6、操作-返回</p>
<p>点击顶部【返回-按钮】，返回能力组件列表页，不保存修改。</p>

<h3 id="prd-3.2.1.3.3">3.2.1.3.3 编辑能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 编辑能力组件</p>
<p><strong>功能描述：</strong>编辑已有能力组件的基本信息、联系信息和分类标签。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【修改-按钮】，选中一条记录后点击跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>能力组件名称</td><td>name</td><td>1.必填，限制20汉字，超出不可输入；<br>2.回显原能力组件名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>组件描述</td><td>description</td><td>1.必填，限制1000汉字，超出不可输入；<br>2.回显原组件描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>非必填；回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填；回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填；回显原联系方式2，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填；回显原部署云服务商，可修改</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>必填；回显原开放范围，可修改</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>1.非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"；<br>2.回显原服务征集得分，可修改</td></tr>
</table>
<p>注："显示顺序"、"服务征集得分"属于管理信息，仅管理员在服务目录管理中可见，编辑提交时无需审核，即时生效。</p>
<p>2、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">能力组件名称为空：请输入能力组件名称</p>
<p style="font-style:italic; color:#999">组件描述为空：请输入组件描述</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
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
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>3、操作-返回</p>
<p>点击顶部【返回-按钮】，返回能力组件列表页，不保存修改。</p>

<h3 id="prd-3.2.1.3.4">3.2.1.3.4 能力组件详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 能力组件详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看能力组件的完整信息，包括基本信息、分类标签、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示组件Logo图片，若无则显示默认图标</td></tr>
<tr><td>组件名称</td><td>name</td><td>加粗大号字体展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已上线使用、已下架</td></tr>
<tr><td>组件ID</td><td>componentId</td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识</td></tr>
</table>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、概览-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人1</td><td>contactName1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话1</td><td>contactPhone1</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人2</td><td>contactName2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话2</td><td>contactPhone2</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、概览-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>5、概览-管理信息</p>
<p>仅管理员在服务目录管理中可见。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示"0"</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>数字展示，为空时显示"--"</td></tr>
</table>
<p>6、审核信息</p>
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
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.3.5">3.2.1.3.5 发布能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 发布能力组件</p>
<p><strong>功能描述：</strong>将已下架状态的能力组件发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【发布-按钮】，勾选一条或多条状态为"已下架"的记录后点击，弹出发布确认框。</p>
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
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>

<h3 id="prd-3.2.1.3.6">3.2.1.3.6 下线能力组件</h3>
<p><strong>模块描述：</strong>服务目录管理 / 能力组件管理 / 下线能力组件</p>
<p><strong>功能描述：</strong>将已上线使用的能力组件下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【下线-按钮】，勾选一条或多条状态为"已上线使用"的记录后点击，弹出下线确认框。</p>
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
<p><strong>输入/前置条件：</strong>列表上方显示【删除-按钮】，勾选一条或多条记录后点击，弹出删除确认框。</p>
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
<tr><td>服务专区</td><td></td><td>枚举：X86专区、信创专区、密码服务专区、超算、智算专区，默认不筛选</td></tr>
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
<tr><td>基础服务名称/ID</td><td></td><td>展示服务名称及ID，ID系统自动生成，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务专区</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务分类</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用、已下架</td></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
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
<p><strong>功能描述：</strong>新增一个基础服务，设置基本信息、联系信息和分类标签后直接发布，管理员默认通过审核。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【新增-按钮】，点击跳转至新增页面。</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td>serviceName</td><td>必填，限制40字符，超出不可输入，占位提示"请输入基础服务名称"，右下角显示字数统计</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.上传图片超过 1MB 时，提示"图片大小已超过1M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>服务描述</td><td>description</td><td>必填，限制500字符，超出不可输入，占位提示"请输入服务描述"，右下角显示字数统计</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>非必填，字符串输入，限制200字，超出不可输入，占位提示"请输入付费方式参考"，右下角显示字数统计</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>非必填，文本输入，占位提示"请输入服务商名称"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>非必填，包含联系人姓名和联系电话</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>非必填，包含联系人姓名和联系电话</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>必填，单选，枚举：X86专区、信创专区、密码服务专区、超算、智算专区；选择后联动下方"服务分类"选项</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>必填，支持多选，按所选服务专区联动展示对应字典项：<br>· X86专区（ServiceType_X86Zone）：机房云托管服务、计算服务、存储服务、网络服务、安全服务、大数据服务、备份容灾服务、数据库服务<br>· 信创专区（ServiceType_XinChuangZone）：机房云托管服务、计算服务、存储服务、网络服务、软件服务<br>· 密码服务专区（ServiceType_CipherZone）：密码服务<br>· 超算、智算专区（ServiceType_SuperComputeZone）：超算服务、智算服务</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>必填，枚举：影像云、电信云、移动云、联通云、浪潮云，支持多选</td></tr>
</table>
<p>4、管理信息</p>
<p>仅管理员在服务目录管理中可见；其中"显示顺序"、"服务征集得分"编辑提交时无需审核，即时生效。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"</td></tr>
</table>
<p>5、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
<p style="font-style:italic; color:#999">部署云服务商为空：请选择部署云服务商</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为"已上线使用"，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成ID，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识</p>
<p>c.系统自动生成审核记录：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交时间</td><td></td><td>取创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>提交人</td><td></td><td>取当前管理员</td></tr>
<tr><td>审核状态</td><td></td><td>取自末尾阶段审核状态，即"已通过"</td></tr>
<tr><td>审核人</td><td></td><td>取自末尾阶段审核人，即当前管理员</td></tr>
<tr><td>审核时间</td><td></td><td>取自末尾阶段审核时间，即创建时间，格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>审核意见</td><td></td><td>取自末尾阶段审核意见，即"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>
<p>6、操作-返回</p>
<p>点击顶部【返回-按钮】，返回基础服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.4.3">3.2.1.4.3 编辑基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 编辑基础服务</p>
<p><strong>功能描述：</strong>编辑已有基础服务的基本信息、联系信息和分类标签。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【修改-按钮】，选中一条记录后点击跳转至编辑页面，预填当前数据。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<p>字段与新增页面相同，在新增规则基础上增加回显描述：</p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>基础服务名称</td><td>serviceName</td><td>1.必填，限制40字符，超出不可输入；<br>2.回显原基础服务名称，可修改</td></tr>
<tr><td>LOGO</td><td>logo</td><td>1.非必填，支持 JPG、PNG、JPEG、SVG 格式，大小限制 1MB 以内；<br>2.回显原LOGO，可修改或删除</td></tr>
<tr><td>服务描述</td><td>description</td><td>1.必填，限制500字符，超出不可输入；<br>2.回显原服务描述，可修改</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>1.非必填，字符串输入，限制200字，超出不可输入；<br>2.回显原付费方式参考，可修改</td></tr>
</table>
<p>2、联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>1.非必填，文本输入；<br>2.回显原服务商名称，可修改</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式1，可修改</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>1.非必填，包含联系人姓名和联系电话；<br>2.回显原联系方式2，可修改</td></tr>
</table>
<p>3、分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>1.必填，单选，枚举：X86专区、信创专区、密码服务专区、超算、智算专区；<br>2.回显原服务专区，可修改</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>1.必填，支持多选，按所选服务专区联动展示对应字典项；<br>2.回显原服务分类，可修改</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>1.必填，支持多选；<br>2.回显原部署云服务商，可修改</td></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>1.非必填，数字输入，默认0，值越小越靠前，支持上下图标点击±1调整；<br>2.回显原显示顺序，可修改；<br>a.删除更新：删除每条应用数据后，系统自动递减后续排序，E.g：删除排序为5的数据后，排序6及之后的数据排序减少1；<br>b.重复排序处理：如果两条记录的"显示排序"值相同，则根据更新时间进行次级排序</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>1.非必填，数值输入，支持小数点（步进0.1），默认空，占位提示"请输入服务征集得分"；<br>2.回显原服务征集得分，可修改</td></tr>
</table>
<p>注："显示顺序"、"服务征集得分"属于管理信息，仅管理员在服务目录管理中可见，编辑提交时无需审核，即时生效。</p>
<p>4、操作-直接发布</p>
<p>点击【直接发布-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">基础服务名称为空：请输入基础服务名称</p>
<p style="font-style:italic; color:#999">服务描述为空：请输入服务描述</p>
<p style="font-style:italic; color:#999">服务专区为空：请选择服务专区</p>
<p style="font-style:italic; color:#999">服务分类为空：请选择服务分类</p>
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
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员编辑后重新提交，即时生效"</td></tr>
</table>
<p>5、操作-返回</p>
<p>点击顶部【返回-按钮】，返回基础服务列表页，不保存修改。</p>

<h3 id="prd-3.2.1.4.4">3.2.1.4.4 基础服务详情</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 基础服务详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看基础服务的完整信息，包括基本信息、审核信息和评价信息，支持查看用户评分详情。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开右侧详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>基础服务名称</td><td>serviceName</td><td>加粗大号字体展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：已上线使用、已下架</td></tr>
<tr><td>服务ID</td><td>serviceId</td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识</td></tr>
</table>
<p>2、概览-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、概览-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactPhone1</td><td>展示联系电话，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactPhone2</td><td>展示联系电话，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、概览-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务分类</td><td>数据拉取字典管理 dict表 ServiceType_X86Zone / ServiceType_XinChuangZone / ServiceType_CipherZone / ServiceType_SuperComputeZone</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>5、概览-管理信息</p>
<p>仅管理员在服务目录管理中可见。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>显示顺序</td><td>sortOrder</td><td>数字展示，为空时显示"0"</td></tr>
<tr><td>服务征集得分</td><td>recruitScore</td><td>数字展示，为空时显示"--"</td></tr>
</table>
<p>6、审核信息</p>
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
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>6、评价信息</p>
<p>1）评分概览</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>显示评分数值，由平台管理员在质量评价管理中手动设置，保留1位小数</td></tr>
<tr><td>用户评分</td><td></td><td>显示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) ÷ 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4</td></tr>
</table>
<p>2）用户评价</p>
<p>显示"用户评价（共 N 条）"，点击后在下方展开显示所有用户评价，10条分页，滚动加载更多。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
<tr><td>评价机构/服务单号</td><td></td><td>展示评价机构名称和服务单号</td></tr>
<tr><td>评价内容</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>评价时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>回复内容</td><td></td><td>当状态为已回复时显示回复内容，完整展示；状态为待回复时不显示</td></tr>
</table>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉。</p>

<h3 id="prd-3.2.1.4.5">3.2.1.4.5 发布基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 发布基础服务</p>
<p><strong>功能描述：</strong>将已下架状态的基础服务发布上线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【发布-按钮】，勾选一条或多条状态为"已下架"的记录后点击，弹出发布确认框。</p>
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
<p>四阶段审核流水均即时通过，各阶段审核意见默认为"管理员直接发布，默认通过审核"，各阶段字段取值如下：</p>
<table>
<tr><th style="white-space:nowrap">阶段名称</th><th style="white-space:nowrap">审核状态</th><th style="white-space:nowrap">审核人</th><th style="white-space:nowrap">审核时间</th><th style="white-space:nowrap">审核意见</th></tr>
<tr><td>申报材料评估</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>应用技术测评</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>现场演示答辩</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
<tr><td>服务目录发布</td><td>已通过</td><td>取当前管理员</td><td>取创建时间</td><td>取"管理员直接发布，默认通过审核"</td></tr>
</table>

<h3 id="prd-3.2.1.4.6">3.2.1.4.6 下线基础服务</h3>
<p><strong>模块描述：</strong>服务目录管理 / 基础服务管理 / 下线基础服务</p>
<p><strong>功能描述：</strong>将已上线使用的基础服务下线。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表上方显示【下线-按钮】，勾选一条或多条状态为"已上线使用"的记录后点击，弹出下线确认框。</p>
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
<p><strong>输入/前置条件：</strong>列表上方显示【删除-按钮】，勾选一条或多条记录后点击，弹出删除确认框。</p>
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

<h3 id="prd-3.2.2.1">3.2.2.1 机构入驻审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 机构入驻审核</p>
<p><strong>页面描述：</strong>审核机构提交的资质认证申请，支持审核通过或驳回操作。</p>

<h3 id="prd-3.2.2.1.1">3.2.2.1.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构入驻审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示机构入驻资质审核列表，支持按提交审核时间、审核状态、机构名称和统一社会信用代码筛选，可进行审核和查看详情操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于机构提交的资质认证申请。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>提交审核时间</td><td></td><td>时间区间选择器，选择起止日期后按提交审核时间范围筛选，默认不筛选</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：待审核、已通过、已驳回，默认不选中</td></tr>
<tr><td>机构名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>支持模糊搜索</td></tr>
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
<tr><td>机构角色</td><td></td><td>以标签样式展示，枚举：服务提供方、服务使用方，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构注册地</td><td></td><td>机构注册地编码+机构注册地详细地址拼装展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系人</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>联系电话</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>E-mail/邮箱</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构简介</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、状态流转与按钮</p>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>待审核</td><td></td><td>审核</td></tr>
<tr><td>已通过</td><td></td><td>详情</td></tr>
<tr><td>已驳回</td><td></td><td>详情</td></tr>
</table>

<h3 id="prd-3.2.2.1.2">3.2.2.1.2 审核操作</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构入驻审核 / 审核操作</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看机构入驻申请的详细资质信息，对待审核状态的申请进行审核通过或驳回操作。左侧展示机构资质详情，右侧展示审核操作区。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"待审核"时，操作栏显示【审核-按钮】，点击打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td>unitName</td><td>加粗大号字体展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>审核状态</td><td>auditStatus</td><td>使用状态标签展示，枚举：待审核、已通过、已驳回</td></tr>
<tr><td>统一社会信用代码</td><td>creditCode</td><td>灰色小字，等宽字体展示，为空时显示"--"</td></tr>
</table>
<p>2、左侧-机构基本情况</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构角色</td><td></td><td>以标签样式展示，枚举：服务提供方、服务使用方</td></tr>
<tr><td>法定代表人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>机构性质</td><td></td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>成立时间</td><td></td><td>格式：yyyy-MM-dd，等宽字体展示</td></tr>
<tr><td>机构注册地</td><td></td><td>机构注册地编码+机构注册地详细地址拼装展示</td></tr>
<tr><td>机构居住地</td><td></td><td>机构居住地编码+机构居住地详细地址拼装展示</td></tr>
</table>
<p>3、左侧-服务介绍</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构简介</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>主要产品或服务介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>人力情况介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、左侧-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>真实姓名</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>登录账号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>身份证号</td><td></td><td>等宽字体展示，脱敏处理后显示</td></tr>
<tr><td>联系方式</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>职务</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>E-mail/微信号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
</table>
<p>5、左侧-资质材料</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>材料名称</td><td></td><td>以列表形式展示机构提交的资质文件，每条包含文件图标与材料名称，完整展示，为空时显示"--"</td></tr>
<tr><td>文件大小</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>下载按钮</td><td></td><td>每条材料右侧展示【下载-按钮】，点击下载对应文件</td></tr>
</table>
<p>6、右侧-审核操作</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>审核通过按钮</td><td></td><td>点击【审核通过-按钮】，弹出确认框"确定要通过该机构的入驻审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，状态变更为已通过，进行消息提示（Tip：审核通过）并刷新列表。<br><span style="color:red">审核通过后，系统调用用户中心接口进行数据同步，同步完成后调用多云管理系统的接口进行同步，详情需求见【8、数据同步用户中心】。</span></td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该机构的入驻申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，状态变更为已驳回，进行消息提示（Tip：驳回成功）并刷新列表。</td></tr>
</table>
<p>7、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>
<p>8、数据同步用户中心</p>
<p>若满足条件并且【审批意见=审批通过】，按流程图执行：</p>
<img src="data:image/png;base64,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4j0AAMcHCR84Ru7cufP6669vuxTYjocffvjll19++OGHt10QYB9NyLfW/sd//McPf/hD4j0AAMcH4/CBY+TatWvf+973tl0KbMdwOHzrrbe2XQpgHx988MGFCxfOnz//p3/6p//7v//75S9/+Tvf+c6dO3e2XS4AACC04QPHzhNPPBFC2HYpsAUffvjhtosAbHTnzp1r1669+eabd+7ceemll957771HHnlERG7cuHHlypUY4zPPPHPu3Dnm2wMAYLtowwcAABvduHHj/Pnzjz/++Lvvvnvx4sX333//5ZdfbuK9iJw5c+bb3/72z372s6eeeirG+Oijj37jG9+4ffv2tksNAMAJRcIHAADLbt++/Y1vfOPRRx+9cOHCU0899bOf/ezSpUtnzpxZu/HDDz/84osvvvPOO++8884vf/nLJ5988vnnn2fUCQAADx4JHwAAzL311lsvvPDCk08++ctf/vKdd9754Q9/+OKLLx5wDsjTp0+/9tprH3300blz5773ve999rOfvXDhwgcffHD/Sw0AAISEDwAApJlC79VXX/3sZz/7ve9979lnn/3oo49ee+2106dP39vRnnvuuatXr7733nuf+9znnn/++S984QuXL19mQj4AAO43Ej4AACfX3bt3L1++/IUvfOH555//9Kc//d577129evUrX/nKkRz8kUceefnll99///2LFy++++67jz/++Pnz52/cuHEkBwcAAKuYSx8AgJPoxo0bb7755rVr15577rmLFy9uGmN/JM6cOXPmzJm7d+++9dZbFy5cuHPnzrlz51588cXZjH0AAOBI0IYPAMAJ0kyh9/jjjzdT6H300Ud7TKF3tJoJ+X74wx++/fbbzYR8L7zwAhPyAQBwhEj4AACcCO0p9N5+++1DTaF3tB577LFmQr5nn322mZDv1VdfZUI+AAA+ORI+AABdduvWrdUp9B577LFtl0tE5Ctf+UozId+nP/3p2YR8d+/e3Xa5AADYVSR8AAA6aDaF3tNPP33kU+gdrUceeeSVV16ZTcj32c9+lgn5AAC4NyR8AAA65caNG+fPn3/00Ufffffdixcv/uxnP3vllVd2Yk67M2fOXLp06aOPPnrqqacuXLjw+OOPv/7667dv3952uQAA2BkkfAAAuuD27duvv/76bAq9999//4FNoXe02hPyffjhh82EfNeuXdt2uQAA2AEkfAAAdtu1a9eaKfQ+/PDD2RR6p06d2na5PqnHHnvs4sWLzYR8V65caSbku3Xr1rbLBQDA8UXCB3aAxphWHip7pVt+tPVnV5ZRD/4UyZVl60mSK3subdhfVae7uCSi2myoKcao6/fRFN1hirNQsl5v35ei0a28GxrLvXZc/rOm6A5Sxn0Ou7p9cr3e5v+p4+q+vO0Lb4VqWmfhE5RibH8KNZblxo/lSTSbQu/KlSvNFHoXL148JlPoHa2vfOUrb7/9djMh39NPP82EfAAAbPLQtgsAYF86SiFoMa7s/DHjhyGVMar1Zu1OWWX2B41lGea5yFYLh5puJFLMfs5Zrbfrj6yjQTmwdd03IlKIjgZO/biyOYUghZe1e+WUtBAxIsmtzbvzQuliLUHhgylDTH1fLO5hTPuZ8kruM31rQholb1Zf7IYiZutFo4uFrza8eJGsKsWGN31d+aUwVkKMWvT3Kv/WPfC3PUfn0uq7UHhbTR7SGEMoitkHMcWgEuZFPWbv4INz9+7dt956680337x9+/ZLL7303nvv7cQY+0+umZDvlVdeuXHjxptvvvnqq68+99xz586d28WRCAAA3CckfOD4M76utOfKWA8ltlpHC1todG6+WbVH8LRV7QuRPBq4fdtAUwxqrKS0kMSLwhozKY64rE1g1awSvBXRnMX6A4VpE+q6XVSNZamznwft2ojZJq5cqhZYPsis8K6MebaRpFim2JTf15UVjW7U3+uNMn2Ty9JNKxw0loOFZ1YVkViWcWk/O6y9EUmudGkWPVVVxBhjJJRlaGVSVV1f0bIl9/ttX6MwRmTTH6Wp2VJb1dO/Nz1ZTIqD1Lyxx+oNfECaZPv973//mWeeuXjx4olNtmfOnDlz5sydO3feeuutCxcu3Llz5+///u+fe+65E1LTAQDAHkj4wE6wVV2rMaLWFiIiOUU13i40rza/aNMdPquoRKcixvomizfpcrR0ZI1ukLKoiqRBmaTwtU1JxOQYWyF2kkhN0x9AjJE0UFUZDIyIlKVUNqlIcrP2eWO9t0Y0pdw09eacUhLJsq/l6KYp5cK2WtU1ltPkqU1H7qwi0blkrPfe56ZJXmz7HSomP+dQumJcLTVNzxlfV+pERYyImL5vtWLnFFVNqLykGHIRWv8FhZmWfSyimsRYI8n1ohnW3khyPSdVXVlVPaZtz/fxbU+ujLkoJItIdC5msUO/T3FSDBJa+X4QZpUiGsvyoNVJnXD79u1r16698cYbp06deumlly5evNiBMfaf3KlTp/72b//2b//2bz/44IM33ngjxnj27Nlz584988wz2y4aAABbQ8IHdkSTCk3TjJ6c02wK+//Zu58QuY4sX/wnh/dADA9GvfOyDIaRIy60et5GO5d31TAP25AnUs1bqIQHZK80vWqbWUTEyrPTaOX2StZikDJOgt0w0Oa3scwMjDeD1XBPWDALFcOD0WKgq+E9WosZ8reIezNv/q0sqaqyVPp+FlL+uX8ib2UmeSJOnCgRNHWjMOozG8pRxBrLbIiMXRdVauXHKgAAIABJREFU274f9inHyuXgh31DOQ5kYXR0Ospu/bDuE41iFZRs2YWIaDQIlhNzSb8WTmxsyfcX0SabW8SQtUQaBgtDw52YcD781VF0wjV34mLDzKtCdMtsSWMlYjh5JhWl6b5NQoSTujwySU4v1yirEpHxniYhfufqinNqQ+3ZEpP2Is0EwFMSKyecxmnxGVc54VSvngWwNad52Q17T0Q5ihK378rRpNeHumcou4hzOdSpmdZBIZAJ7Xi/xKCc6nN3BU/DN998c//+/UePHr3//vtfffXVhZxj//KuXLny+eeff/755w8fPrx79+7Nmzf39/dv3bq1s7Oz7aYBAACcufF4PB6PP/zww+vXr4+Pz3v/zjvvvMCOL+/evXv7+/tbOTXAemWE7QV2XPKuTlyyvK3lNH3M2lCPx+PxuA62DBvPqoMlarcpd5uNOjeXb98cPAUOqZ7ZYLJbndiSDSlYGwITcZppx7JTdB5LPG1Z4iWNGY/HdWDbQUTtVWiuRagXDt89Uh0m12vFFSpP2JCmZ6K50yx7DWSnl6U5cr3swO1LnL7YxE0z6mBp6X77+/v37t1bcjXOzKlf9slFaDexlqe679mZDiZO84/MPnUBTVaw39vbe/Dgwbab84r593//988++2xnZ2d3d/fevXt//OMft92i03X58uU7d+5suxUAW/Dhhx++9dZb224FwDlSonuM4QOcb5zqWjuz51XcwGUTOItkyhLUhuF87KMjUSKrIxdz2iCXWWJotncjn+qaSFwllBaHoMsgdDaprjm7oOTrOrgYY9am7JolIrJ22UhvFldFy2YyVN60dnJ7GmYbUuPrJj0+jwZOeJIt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m21S5w9Io4tLZsxb9puU24fjKAX5Dg4OHj58+O677165cmUwGLy2BfkmJfSuXr1648YNlNADAAAoEOEDvO7sUUuIW2tpJqJfNf/d2iNj+/aMa+dLH9mil9p8+SEQjb4gu6awHZyGMob/ySeffPPNN8PhsBTku3Xr1tWrV7fdtLNQSugNh8MnT56ghB4AAMCiP9l2AwAAAODY9vb27t279+OPP/70pz+9efPm22+//etf//rw8HDb7Totjx8//vjjj998883vvvvu9u3bT58+/eSTTxDeAwAAzEGEDwAA8KoqBfl++OGHr7766ne/+92bb775i1/84ptvvtl2u07M4eHhr3/967fffvvmzZs//elPf/zxx3v37qHcIAAAwCqI8AEAAF55V65c+fzzz3//+9+/9957d+/effPNNz/99NODg4Ntt+vFffPNN7/4xS/efPPN3/3ud1999dUPP/zw0UcfoUI+AADAeojwAQAALo7r16//9re//fbbb//sz/7s3Xff/fnPf/7ll18+f/582+3a1MHBQQjhzTffvHv37nvvvff73//+888/v3LlyrbbBQAA8GpAhA8AAHDRTBbVu3379nfffffmm29+/PHHT5482Xa7Viol9H7+85+/++67RPTtt9+WZfC23S4AAIBXDGrpAwAAXFh7e3t7e3uHh4cPHz784IMPiOj27dvXr18/P+nuT548uXv37tdff727u3v79m3MsQcAAHgZGMMHAAC44EpBvh9//LEU5Hv77be3XpBvUkLvgw8+KCX0Hjx4gPAeAADgJSHCBwAAeF2UgnxPnz6dFOQLIZxxQb5SQu/tt98uJfR+/PFHlNADAAA4KYjwAQAAXi+XLl2aFOQjolKQ7+HDh6dakO/g4OBv//ZvJyX0nj59ihJ6AAAAJw4RPgAAwGtqZ2cnhFAK8v3mN785pYJ8kxJ6f/jDHyYl9C5dunSyZwEAAABE+AAAAEB7e3sPHjz48ccff/rTn37wwQdvv/32r3/968PDw5c55pMnTz7++OOf/OQnv/nNb27fvv306dPPPvtsZ2fn5FoNAAAA8xDhAwAAAC0tyHfz5s3jFuQrJfR+9rOflRJ6T58+RQk9AACAM4MIHwAAAGZMCvK98847pSDf3/7t3x5ZkO/Ro0c3b94sJfTu3buHEnoAAABnDxE+AAAALHHp0qX9/f1SkO8P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" style="max-width:100%;margin:12px 0" />
<p>1）步骤1：门户管理后台本地，创建用户/机构以及关联关系</p>
<p>使用下方信息创建用户、创建机构、创建用户及机构关联关系；审核通过后，关闭抽屉，此时机构审核状态变为"审批通过"。</p>
<p>用户信息参数：</p>
<table>
<tr><th style="white-space:nowrap">字段名称（门户）</th><th style="white-space:nowrap">字段代码（门户）</th><th>字段逻辑（门户）</th></tr>
<tr><td>真实姓名</td><td>name</td><td>必填</td></tr>
<tr><td>登录账号</td><td>username</td><td>必填</td></tr>
<tr><td>身份证号</td><td>id_card</td><td></td></tr>
<tr><td>联系方式</td><td>phone</td><td></td></tr>
<tr><td>职务</td><td></td><td></td></tr>
<tr><td>E-mail/微信号</td><td>email</td><td></td></tr>
<tr><td>密码</td><td>Password</td><td></td></tr>
<tr><td>状态</td><td>state</td><td>枚举：1 启用（取这个值）、2 禁用</td></tr>
<tr><td>统一社会信用代码</td><td>org_code</td><td></td></tr>
<tr><td>数据来源</td><td>source_type</td><td>与用户中心沟通新增一个枚举为"门户自主注册"</td></tr>
</table>
<p>机构信息参数：</p>
<table>
<tr><th style="white-space:nowrap">字段名称（门户）</th><th style="white-space:nowrap">字段代码（门户）</th><th>字段逻辑（门户）</th></tr>
<tr><td>机构名称</td><td>org_name</td><td>必填</td></tr>
<tr><td>社会统一信用代码</td><td>org_code</td><td>必填，限制18位</td></tr>
<tr><td>机构角色</td><td>merchant_role</td><td>枚举为服务使用方、服务提供方，可多选</td></tr>
<tr><td>法定代表人</td><td></td><td>必填</td></tr>
<tr><td>机构性质</td><td></td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>成立时间</td><td></td><td>格式：yyyy-MM-dd，等宽字体展示</td></tr>
<tr><td>机构注册地</td><td>region_code</td><td>机构注册地编码+机构注册地详细地址拼装展示</td></tr>
<tr><td>机构注册地详细地址</td><td></td><td></td></tr>
<tr><td>机构现居地</td><td></td><td>机构居住地编码+机构居住地详细地址拼装展示</td></tr>
<tr><td>机构现居地详细地址</td><td></td><td></td></tr>
<tr><td>机构简介</td><td></td><td>1.必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td></tr>
<tr><td>主要产品或服务介绍</td><td></td><td>1.非必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td></tr>
<tr><td>人力情况介绍</td><td></td><td>1.非必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td></tr>
<tr><td>资质材料附件</td><td></td><td>必填，支持PDF、JPG、PNG格式，大小不超过10MB</td></tr>
<tr><td>机构状态</td><td>merchant_state</td><td>枚举：1 开启（取这个值）、2 关闭</td></tr>
<tr><td>组织数据来源</td><td>source</td><td>与用户中心沟通新增一个枚举为"门户自主注册"</td></tr>
</table>
<p>2）步骤2：调用用户中心API，创建用户/机构以及关联关系（若机构已存在，则创建用户并关联该机构）；用户默认访问鉴权（门户管理后台）</p>
<p>a.身份证不存在+统一社会信用代码不存在：</p>
<p>使用下方信息创建用户、创建机构、创建用户及机构关联关系、赋予该用户访问鉴权（云网门户管理后台）。</p>
<p>用户信息参数：</p>
<table>
<tr><th style="white-space:nowrap">字段名称（门户）</th><th style="white-space:nowrap">字段代码（门户）</th><th>字段逻辑（门户）</th><th style="white-space:nowrap">字段名称（用户中心）</th><th style="white-space:nowrap">字段代码（用户中心）</th></tr>
<tr><td>真实姓名</td><td>name</td><td>必填</td><td>姓名</td><td>name</td></tr>
<tr><td>登录账号</td><td>username</td><td>必填</td><td>用户登录名</td><td>username</td></tr>
<tr><td>身份证号</td><td>id_card</td><td></td><td>身份证号</td><td>id_card</td></tr>
<tr><td>联系方式</td><td>phone</td><td></td><td>联系方式</td><td>phone</td></tr>
<tr><td>职务</td><td></td><td></td><td></td><td></td></tr>
<tr><td>E-mail/微信号</td><td>email</td><td></td><td>用户邮箱</td><td>email</td></tr>
<tr><td>密码</td><td>Password</td><td></td><td>用户登录密码</td><td>password</td></tr>
<tr><td>状态</td><td>state</td><td>枚举：1 启用（取这个值）、2 禁用</td><td></td><td></td></tr>
<tr><td>统一社会信用代码</td><td>org_code</td><td></td><td>组织机构代码</td><td>org_code</td></tr>
<tr><td>数据来源</td><td>source_type</td><td>与用户中心沟通新增一个枚举为"门户自主注册"</td><td>数据来源</td><td>source_type</td></tr>
<tr><td></td><td></td><td></td><td>用户类应用访问鉴权</td><td>Permissions=2</td></tr>
</table>
<p>机构信息参数：</p>
<table>
<tr><th style="white-space:nowrap">字段名称（门户）</th><th style="white-space:nowrap">字段代码（门户）</th><th>字段逻辑（门户）</th><th style="white-space:nowrap">字段名称（用户中心）</th><th style="white-space:nowrap">字段代码（用户中心）</th></tr>
<tr><td>机构名称</td><td>org_name</td><td>必填</td><td>组织机构名称</td><td>org_name</td></tr>
<tr><td>社会统一信用代码</td><td>org_code</td><td>必填，限制18位</td><td>组织机构代码</td><td>org_code</td></tr>
<tr><td>机构角色</td><td>merchant_role</td><td>枚举为服务使用方、服务提供方，可多选</td><td></td><td></td></tr>
<tr><td>法定代表人</td><td></td><td>必填</td><td></td><td></td></tr>
<tr><td>机构性质</td><td></td><td>多值以顿号分隔展示，为空时显示"--"</td><td></td><td></td></tr>
<tr><td>成立时间</td><td></td><td>格式：yyyy-MM-dd，等宽字体展示</td><td></td><td></td></tr>
<tr><td>机构注册地</td><td>region_code</td><td>机构注册地编码+机构注册地详细地址拼装展示</td><td>组织所属区域编码（区编码）</td><td>region_code</td></tr>
<tr><td>机构注册地详细地址</td><td></td><td></td><td></td><td></td></tr>
<tr><td>机构现居地</td><td></td><td>机构居住地编码+机构居住地详细地址拼装展示</td><td></td><td></td></tr>
<tr><td>机构现居地详细地址</td><td></td><td></td><td></td><td></td></tr>
<tr><td>机构简介</td><td></td><td>1.必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td><td></td><td></td></tr>
<tr><td>主要产品或服务介绍</td><td></td><td>1.非必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td><td></td><td></td></tr>
<tr><td>人力情况介绍</td><td></td><td>1.非必填，最多400字，超出不可输入；<br>2.显示字数统计（当前字数/400）</td><td></td><td></td></tr>
<tr><td>资质材料附件</td><td></td><td>必填，支持PDF、JPG、PNG格式，大小不超过10MB</td><td></td><td></td></tr>
<tr><td>机构状态</td><td>merchant_state</td><td>枚举：1 开启（取这个值）、2 关闭</td><td></td><td></td></tr>
<tr><td>组织数据来源</td><td>source</td><td>与用户中心沟通新增一个枚举为"门户自主注册"</td><td>组织数据来源</td><td>source</td></tr>
</table>
<p>b.身份证不存在+统一社会信用代码已存在：</p>
<p>使用下方信息创建用户、创建用户及机构关联关系、赋予该用户访问鉴权（云网门户管理后台）。</p>
<p>用户信息参数：</p>
<table>
<tr><th style="white-space:nowrap">字段名称（门户）</th><th style="white-space:nowrap">字段代码（门户）</th><th>字段逻辑（门户）</th><th style="white-space:nowrap">字段名称（用户中心）</th><th style="white-space:nowrap">字段代码（用户中心）</th></tr>
<tr><td>真实姓名</td><td>name</td><td>必填</td><td>姓名</td><td>name</td></tr>
<tr><td>登录账号</td><td>username</td><td>必填</td><td>用户登录名</td><td>username</td></tr>
<tr><td>身份证号</td><td>id_card</td><td></td><td>身份证号</td><td>id_card</td></tr>
<tr><td>联系方式</td><td>phone</td><td></td><td>联系方式</td><td>phone</td></tr>
<tr><td>职务</td><td></td><td></td><td></td><td></td></tr>
<tr><td>E-mail/微信号</td><td>email</td><td></td><td>用户邮箱</td><td>email</td></tr>
<tr><td>密码</td><td>Password</td><td></td><td>用户登录密码</td><td>password</td></tr>
<tr><td>状态</td><td>state</td><td>枚举：1 启用（取这个值）、2 禁用</td><td></td><td></td></tr>
<tr><td>统一社会信用代码</td><td>org_code</td><td></td><td>组织机构代码</td><td>org_code</td></tr>
<tr><td>数据来源</td><td>source_type</td><td>与用户中心沟通新增一个枚举为"门户自主注册"</td><td>数据来源</td><td>source_type</td></tr>
<tr><td></td><td></td><td></td><td>用户类应用访问鉴权</td><td>Permissions=2</td></tr>
</table>
<p>3）步骤3：用户中心创建成功后，返回应答结果</p>
<p>a.用户中心创建成功</p>
<p>创建与用户中心的关联关系，清空门户管理后台本地密码。</p>
<p>b.用户中心创建失败</p>
<p>刚才创建的用户、机构、审批记录回退，可重新发起审核动作。</p>

<h3 id="prd-3.2.2.1.3">3.2.2.1.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 机构入驻审核 / 审核详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看机构入驻申请的详细资质信息，只读展示审核结果记录。左侧展示机构资质详情，右侧展示审核结果记录。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"已通过/已驳回"时，操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核结果记录</p>
<p>展示审核结果记录信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号），使用StatusDot组件展示</td></tr>
<tr><td>审核人</td><td></td><td>该次审核审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该次审核审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该次审核审核意见，超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.2">3.2.2.2 数字应用审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 数字应用审核</p>
<p><strong>页面描述：</strong>审核机构提交的数字应用上架申请，支持多阶段审核操作。</p>

<h3 id="prd-3.2.2.2.1">3.2.2.2.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 数字应用审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示数字应用审核列表，支持按提交审核时间、审核状态、审核阶段、应用名称、应用ID和服务商名称筛选，可进行审核和查看详情操作。</p>
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
<tr><td>数字应用名称/ID</td><td>name, applicationId</td><td>上方展示应用名称，下方展示应用ID（小号字体），ID系统自动生成，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识，为空时显示"--"</td></tr>
<tr><td>服务对象</td><td>targetView</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
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
<p><strong>输入/前置条件：</strong>当申请状态为"待审核"时，操作栏显示【审核-按钮】，点击打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>LOGO</td><td>logo</td><td>展示应用Logo图片，若无则显示默认图标</td></tr>
<tr><td>应用名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>应用ID</td><td>applicationId</td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：SZYY+YYYYMMDD+4位序号（如 SZYY202608100001），唯一标识</td></tr>
</table>
<p>2、左侧-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>address</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>应用描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
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
<tr><td>服务对象</td><td>targetView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>应用架构</td><td>architectureView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>基层应用覆盖范围</td><td></td><td>仅当服务对象含"基层医疗卫生机构"时显示，多值以分号分隔展示</td></tr>
<tr><td>公立应用覆盖范围</td><td></td><td>仅当服务对象含"公立医院"时显示，多值以分号分隔展示</td></tr>
<tr><td>医技应用覆盖范围</td><td></td><td>仅当服务对象含"医技护人员"时显示，多值以分号分隔展示</td></tr>
</table>
<p>5、右侧-审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。<br><span style="color:red">整体审核通过后，系统调用多云管理系统的接口进行同步数据。</span></td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
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
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.2.3">3.2.2.2.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 数字应用审核 / 审核详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看数字应用备案的详细信息，只读展示四阶段审核流水。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"已通过/已驳回"时，操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

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
<tr><td>安全服务名称/ID</td><td></td><td>上方展示服务名称（加粗），下方展示服务ID（灰色小字），ID系统自动生成，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识，为空时显示"--"</td></tr>
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
<p><strong>输入/前置条件：</strong>当申请状态为"待审核"时，操作栏显示【审核-按钮】，点击打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>服务名称</td><td></td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：AQFW+YYYYMMDD+4位序号（如 AQFW202608100001），唯一标识</td></tr>
</table>
<p>2、左侧-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>系统地址</td><td>systemUrl</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>3、左侧-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProvider</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>合作伙伴名称</td><td>cooperativeEnterprise</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人姓名和电话，为空时显示"--"</td></tr>
</table>
<p>4、左侧-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>应用架构</td><td>数据拉取字典管理 dict表 SoftwareArchitecture</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>数据拉取字典管理 dict表 CloudProvider</td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>5、右侧-审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。<br><span style="color:red">整体审核通过后，系统调用多云管理系统的接口进行同步数据。</span></td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
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
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.3.3">3.2.2.3.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 安全服务审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看安全服务备案的详细信息，只读展示四阶段审核流水。左侧展示应用概览信息，右侧展示四阶段审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"已通过/已驳回"时，操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

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
<tr><td>能力组件名称/ID</td><td>name, componentId</td><td>上方展示组件名称（加粗），下方展示组件ID（灰色小字），ID系统自动生成，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识，为空时显示"--"</td></tr>
<tr><td>组件描述</td><td>description</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>枚举：不限、市级、区（县）域</td></tr>
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
<p><strong>输入/前置条件：</strong>当申请状态为"待审核"时，操作栏显示【审核-按钮】，点击打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示组件Logo图片，若无则显示默认图标</td></tr>
<tr><td>组件名称</td><td>name</td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>组件ID</td><td>componentId</td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：NLZJ+YYYYMMDD+4位序号（如 NLZJ202608100001），唯一标识</td></tr>
</table>
<p>2、左侧-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>组件描述</td><td>description</td><td>多行文本展示，为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>3、左侧-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td>serviceProviderName</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td>contactName1, contactPhone1</td><td>展示联系人姓名+电话，格式"姓名 电话"，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td>contactName2, contactPhone2</td><td>展示联系人姓名+电话，格式"姓名 电话"，为空时显示"--"</td></tr>
</table>
<p>4、左侧-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>部署云服务商</td><td>deployServiceProviderView</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>开放范围</td><td>数据拉取字典管理 dict表 OpenRange</td><td>枚举：不限、市级、区（县）域</td></tr>
</table>
<p>5、右侧-审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。<br><span style="color:red">整体审核通过后，系统调用多云管理系统的接口进行同步数据。</span></td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
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
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.4.3">3.2.2.4.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 能力组件审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看能力组件备案的详细信息，只读展示四阶段审核流水。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"已通过/已驳回"时，操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.5">3.2.2.5 基础服务审核</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务审核管理 / 基础服务审核</p>
<p><strong>页面描述：</strong>审核云服务商提交的基础服务上架申请，支持四阶段审核与通过或驳回操作。</p>

<h3 id="prd-3.2.2.5.1">3.2.2.5.1 审核列表</h3>
<p><strong>模块描述：</strong>服务审核管理 / 基础服务审核 / 审核列表</p>
<p><strong>功能描述：</strong>展示云服务商提交的基础服务审核列表，支持按提交审核时间、审核状态、审核阶段、基础服务名称、基础服务ID和服务商名称筛选，可进行审核和查看详情操作。</p>
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
<tr><td>基础服务名称/ID</td><td></td><td>上方展示服务名称（加粗），下方展示服务ID（灰色小字），ID系统自动生成，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识，为空时显示"--"</td></tr>
<tr><td>服务专区</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务分类</td><td></td><td>完整展示，为空时显示"--"</td></tr>
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
<p><strong>输入/前置条件：</strong>当申请状态为"待审核"时，操作栏显示【审核-按钮】，点击打开审核抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>Logo图标</td><td></td><td>展示服务Logo图片，若无则显示默认图标</td></tr>
<tr><td>服务名称</td><td></td><td>加粗大号字体展示</td></tr>
<tr><td>审核状态</td><td></td><td>使用StatusDot组件展示当前审核状态</td></tr>
<tr><td>服务ID</td><td></td><td>灰色小字，格式"ID：XXX"，系统自动生成，格式：JCFW+YYYYMMDD+4位序号（如 JCFW202608100001），唯一标识</td></tr>
</table>
<p>2、左侧-基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务描述</td><td></td><td>多行文本展示，为空时显示"--"</td></tr>
<tr><td>付费方式参考</td><td>paymentMethodRef</td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
<p>3、左侧-联系信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务商名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系方式1</td><td></td><td>展示联系电话，为空时显示"--"</td></tr>
<tr><td>联系方式2</td><td></td><td>展示联系电话，为空时显示"--"</td></tr>
</table>
<p>4、左侧-分类标签</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务专区</td><td>数据拉取字典管理 dict表 ServiceZone</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>部署云服务商</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务分类</td><td></td><td>使用服务类型标签展示（如计算服务、存储服务、数据库、网络服务）</td></tr>
</table>
<p>5、右侧-审核操作（四阶段纵向步骤条）</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>审核意见</td><td></td><td>多行文本输入框（textarea），最多200字，右下角显示字数统计"0/200"，占位提示"请输入审核意见"</td></tr>
<tr><td>阶段通过按钮</td><td></td><td>点击当前阶段【通过-按钮】，弹出确认框"确定要通过该服务的审核吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写审核意见）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已通过，更新步骤条状态并记录审核流水：阶段1/2/3通过后进入下一阶段；阶段4通过后整体审核通过，进行消息提示（Tip：审核通过）并刷新列表。<br><span style="color:red">整体审核通过后，系统调用多云管理系统的接口进行同步数据。</span></td></tr>
<tr><td>驳回按钮</td><td></td><td>点击【驳回-按钮】，弹出确认框"确定要驳回该服务的申请吗？"。<br>1）若审核意见为空，进行表单校验提示（Tip：请填写驳回原因）；<br>2）若网络异常/超时/宕机，进行消息提示，停留当前页面；<br>3）若满足条件，当前阶段变更为已驳回，审核记录终止，记录审核流水，进行消息提示（Tip：审核已驳回）。</td></tr>
</table>
<p>记录各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
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
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.2.5.3">3.2.2.5.3 审核详情</h3>
<p><strong>模块描述：</strong>服务审核管理 / 基础服务审核 / 审核详情</p>
<p><strong>功能描述：</strong>查看基础服务备案的详细信息，只读展示四阶段审核流水。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当申请状态为"已通过/已驳回"时，操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、左侧字段</p>
<p>同审核操作，此处不赘述。</p>
<p>2、右侧-审核记录（四阶段纵向步骤条）</p>
<p>展示各阶段审核流水信息：</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>阶段名称</td><td></td><td>以纵向步骤条展示：阶段1 申报材料评估 → 阶段2 应用技术测评 → 阶段3 现场演示答辩 → 阶段4 服务目录发布</td></tr>
<tr><td>审核状态</td><td></td><td>枚举：已通过（绿色对勾）、已驳回（红色叉号）、待审核（当前阶段蓝色高亮、未开始灰色）</td></tr>
<tr><td>审核人</td><td></td><td>该阶段审核人，完整展示，为空时显示"--"</td></tr>
<tr><td>审核时间</td><td></td><td>该阶段审核时间，格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>审核意见</td><td></td><td>该阶段审核意见，完整展示，为空时显示"--"</td></tr>
</table>
<p>3、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.3">3.2.3 服务开通管理</h3>

<h3 id="prd-3.2.3.1">3.2.3.1 服务开通列表</h3>
<p><strong>入口页面：</strong>运营管理后台 / 服务开通管理 / 服务开通列表</p>
<p><strong>页面描述：</strong>管理平台所有服务订单，支持查看订单详情、取消订单、查看评价。</p>

<h3 id="prd-3.2.3.1.2">3.2.3.1.2 服务开通列表</h3>
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

<h3 id="prd-3.2.3.1.3">3.2.3.1.3 服务开通详情</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表 / 服务开通详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看订单完整信息，包括基本信息和流程进度，支持跳转关联工单。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务名称</td><td>serviceName</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td>status</td><td>使用状态标签展示，枚举：工单流转中、已完成、已评价、已驳回、已取消</td></tr>
<tr><td>服务单号</td><td>orderNo</td><td>灰色小字，展示于服务名称下方，为空时显示"--"</td></tr>
</table>
<p>2、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务ID</td><td>serviceId</td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务商名称</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>关联工单</td><td></td><td>完整展示，为空时显示"--"；点击"跳转工单"按钮，以URL参数形式携带工单ID（workorderId，如 /workorder/detail?workorderId=TK-0245）跳转至多云管理系统工单详情页，用于定位并展示该工单的详细信息</td></tr>
</table>
<p>3、流程进度</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>节点名称</td><td></td><td>进度节点名称，枚举：<br>1、提交申请：用户点击服务后经统一认证SSO跳转至多云管理系统填写服务申请，系统创建服务订单（绑定serviceId），以订单创建时间记录为提交申请节点时间<br>2、系统派发工单：多云管理系统创建工单后，调用工单回调接口回传workOrderId及工单创建时间（eventType=CREATED），系统接收回调后记录为系统派发工单节点时间，订单状态默认流转为工单流转中<br>3、工单流转中：接收工单创建回调（eventType=CREATED）后订单进入的默认状态，节点时间取系统派发工单的回调时间<br>4、服务交付完成：多云管理系统回传工单通过事件及时间（eventType=APPROVED），系统接收回调后记录为服务交付完成节点时间<br>5、服务评价：用户提交服务评价后，以评价提交时间记录为服务评价节点时间<br>6、订单驳回：多云管理系统回传工单驳回事件及时间（eventType=REJECTED，备注含驳回原因），系统接收回调后记录为订单驳回节点时间<br>7、订单取消：用户取消订单后，以取消操作时间记录为订单取消节点时间</td></tr>
<tr><td>节点时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>节点状态</td><td></td><td>枚举：已完成、进行中、待处理。当前所处节点状态为进行中，已通过节点状态为已完成，未到达节点状态为待处理。</td></tr>
</table>
<p>4、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，返回服务开通列表页。</p>

<h3 id="prd-3.2.3.1.4">3.2.3.1.4 取消订单</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表 / 取消订单</p>
<p><strong>功能描述：</strong>取消处于"工单流转中"状态的服务订单，取消后订单状态变更为"已取消"。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"工单流转中"时，操作栏显示【取消-按钮】，点击弹出取消确认框。</p>
<p><strong>详细设计：</strong></p>
<p>点击【取消-按钮】，弹出二次确认框，标题"取消服务单"，提示内容："确定要取消服务单{服务单号}吗？取消后无法恢复。"（如：确定要取消服务单202608100095吗？取消后无法恢复。）</p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行取消操作，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，订单状态变更为"已取消"，关闭此对话框，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：取消成功</p>

<h3 id="prd-3.2.3.1.4">3.2.3.1.4 操作-查看评价</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表 / 查看评价</p>
<p><strong>功能描述：</strong>查看已评价订单的用户评价明细。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当订单状态为"已评价"时，操作栏显示【查看评价-按钮】，点击打开评价查看弹窗。</p>
<p><strong>详细设计：</strong></p>
<p>1、展示内容</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>评分明细</td><td>ratings</td><td>展示准确性评分、稳定性评分、响应时效评分、业务适配性评分四维度5星评分（只读）</td></tr>
<tr><td>综合评分</td><td></td><td>四维度评分的算术平均值，保留1位小数</td></tr>
<tr><td>评价内容</td><td>content</td><td>展示用户填写的评价内容，为空时显示"--"</td></tr>
<tr><td>评价信息</td><td>orgName, time</td><td>展示评价机构名称和评价时间，以"·"分隔，为空时显示"--"</td></tr>
</table>
<p>2、操作-关闭弹窗</p>
<p>点击右上角【关闭按钮】，关闭评价查看弹窗，停留当前页面。</p>

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
<tr><td>服务类型</td><td></td><td>使用服务类型标签展示，枚举：数字应用、能力组件、安全服务、基础服务，不同类别使用不同颜色标签；取自服务目录中该服务的类型分类，为空时显示"--"</td></tr>
<tr><td>平均准确性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户准确性评分) / 评价人数，大于等于4.5显示绿色，大于等于阈值显示橙色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均稳定性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户稳定性评分) / 评价人数，大于等于4.0显示绿色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均响应时效</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户响应时效评分) / 评价人数，大于等于4.5显示绿色，大于等于阈值显示橙色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>平均业务适配性</td><td></td><td>展示数值（保留1位小数）= Σ(所有用户业务适配性评分) / 评价人数，大于等于4.0显示绿色，低于阈值显示红色，为空时显示"--"</td></tr>
<tr><td>用户评分</td><td></td><td>以环形进度条展示所有用户综合评分的算数平均值（保留1位小数）。<br>计算公式：用户评分 = Σ(每位用户综合评分) / 评价人数，其中综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4<br>鼠标悬停提示"所有用户的平均分值"，为空时显示"--"</td></tr>
<tr><td>平台评分</td><td></td><td>以环形进度条展示平台管理员在质量评价管理中手动设置的评分（保留1位小数），鼠标悬停提示"平台管理员赋分"，为空时显示"--"</td></tr>
</table>
<h3 id="prd-3.2.3.3.2">3.2.3.3.2 查看明细操作</h3>
<p><strong>模块描述：</strong>质量评价管理 / 查看明细操作</p>
<p><strong>功能描述：</strong>查看某个服务下的用户评分明细列表，支持按评分和状态筛选，可对评价进行回复。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>操作栏显示【查看明细-按钮】，点击进入评价明细页面，顶部显示当前服务名称和ID。</p>
<p><strong>详细设计：</strong></p>
<p>1、页面头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>返回按钮</td><td></td><td>显示【返回-按钮】，点击返回质量评价列表</td></tr>
<tr><td>页面标题</td><td></td><td>显示"评价明细"，加粗展示</td></tr>
<tr><td>服务名称</td><td>serviceName</td><td>显示"服务名称：XXX"，取自当前选中服务，完整展示</td></tr>
<tr><td>服务ID</td><td>serviceId</td><td>显示"ID：XXX"，取自当前选中服务，等宽字体展示</td></tr>
</table>
<p>2、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>综合评分</td><td></td><td>枚举：5星、4星、3星及以下，默认不选中</td></tr>
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
<tr><td>评分明细</td><td></td><td>以"准确性、稳定性、响应时效、业务适配性"四个维度横向排列展示各维度分数</td></tr>
<tr><td>综合评分</td><td></td><td>展示该用户四个维度的算数平均分，综合评分 = (准确性 + 稳定性 + 响应时效 + 业务适配性) / 4（保留1位小数），鼠标悬停提示"准确性、稳定性、响应时效、业务适配性的平均分值"</td></tr>
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
<p><strong>输入/前置条件：</strong>当评价状态为"待回复"时，操作栏显示【回复-按钮】，点击打开回复弹窗。</p>
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
<p><strong>功能描述：</strong>平台管理员对服务进行综合评分和评价；已评分的服务再次打开时回显已有评分数据，支持编辑后重新提交，提交后覆盖原评分。</p>
<p><strong>优先级：</strong>P2</p>
<p><strong>输入/前置条件：</strong>操作栏显示【平台评分-按钮】，点击打开平台评分弹窗；若该服务已有平台评分，弹窗回显已有评分星级和评价内容。</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>平台评分</td><td></td><td>星级评分组件，点击选择1-5星，右侧同步显示当前选中星数；已评分时默认选中已有评分星级，可修改</td></tr>
<tr><td>评价内容</td><td></td><td>多行文本，必填，占位提示"请输入平台评分内容..."，最多500字；已评分时回显已有评价内容，可修改</td></tr>
</table>
<p>2、操作-提交评价</p>
<p>点击【提交评价-按钮】，判断逻辑如下：</p>
<p>1）若未选择评分，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请选择评分</p>
<p>2）若评价内容为空，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：请输入平台评分内容</p>
<p>3）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p>4）若满足条件，提交平台评分（已评分服务覆盖原评分及评价内容），关闭弹窗，进行消息提示，刷新汇总列表</p>
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
<tr><td>需求说明</td><td></td><td>超出2行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>服务类型</td><td></td><td>枚举：数字应用、安全服务、能力组件、基础服务，以标签样式展示</td></tr>
<tr><td>状态</td><td></td><td>枚举：待响应、已响应、已完成、已关闭</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>响应机构</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
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
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>方案名称</td><td></td><td>大号加粗展示</td></tr>
<tr><td>需求编号</td><td></td><td>等宽字体展示，前缀"需求编号："，如"需求编号：DM-20260810-0012"</td></tr>
<tr><td>状态</td><td></td><td>以状态标签（StatusDot组件）展示</td></tr>
</table>
<p>2）需求信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>服务类型</td><td></td><td>以服务类型标签样式展示，枚举：数字应用、安全服务、能力组件、基础服务，为空时显示"--"</td></tr>
<tr><td>方案类型</td><td></td><td>枚举：政务信创、金融合规、安全可控、科研提算、通用商用</td></tr>
<tr><td>服务项</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>需求说明</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>发布时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3）响应信息</p>
<p>仅当需求有响应内容时展示响应信息；无响应时不展示。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>响应机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>预估报价</td><td></td><td>显示金额，前缀¥，为空时显示"--"</td></tr>
<tr><td>预计工期</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>响应内容</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
</table>
`
  },
  {
    id: 6,
    title: '',
    content: `<h3 id="prd-3.2.5">3.2.5 机构协同管理</h3>

<h3 id="prd-3.2.5.1">3.2.5.1 机构列表</h3>
<p><strong>入口页面：</strong>运营管理后台 / 机构协同管理 / 机构列表</p>
<p><strong>页面描述：</strong>管理注册的服务使用方与服务提供方机构，支持按机构信息筛选，可查看机构详情、进入账户列表及启用停用机构。</p>

<h3 id="prd-3.2.5.1.1">3.2.5.1.1 机构列表</h3>
<p><strong>模块描述：</strong>机构协同管理 / 机构列表 / 机构列表</p>
<p><strong>功能描述：</strong>展示已注册的机构列表，支持按机构名称、统一社会信用代码、机构角色和状态筛选，可进行查看详情、进入账户列表、启用停用操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>列表数据来源于通过"机构入驻审核"审核通过的注册机构。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>机构角色</td><td></td><td>枚举：服务提供方、服务使用方，默认不选中</td></tr>
<tr><td>状态</td><td></td><td>枚举：启用、停用，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为所有机构（不区分机构）的所有状态（启用、停用）的注册机构数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按注册时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>序号</td><td></td><td>显示当前页的行号，每页从1开始</td></tr>
<tr><td>机构名称</td><td></td><td>加粗展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构角色</td><td></td><td>以标签样式展示，一个机构可同时具有多个角色（如：服务提供方、服务使用方），为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构注册地</td><td></td><td>机构注册地编码+机构注册地详细地址拼装展示，超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>机构简介</td><td></td><td>超出限宽显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>注册时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：启用、停用，以徽标样式展示</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
启用 --(停用)---→ 停用
停用 --(启用)---→ 启用
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>启用</td><td></td><td>详情、账户列表、停用</td></tr>
<tr><td>停用</td><td></td><td>详情、账户列表、启用</td></tr>
</table>

<h3 id="prd-3.2.5.1.2">3.2.5.1.2 机构详情</h3>
<p><strong>模块描述：</strong>机构协同管理 / 机构列表 / 机构详情</p>
<p><strong>功能描述：</strong>以右侧抽屉形式查看机构的详细信息，包括机构基本情况、服务介绍和资质材料。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>操作栏显示【详情-按钮】，点击打开机构详情抽屉。</p>
<p><strong>详细设计：</strong></p>
<p>1、抽屉头部</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构名称</td><td>unitName</td><td>加粗大号字体展示</td></tr>
<tr><td>状态</td><td></td><td>以徽标样式展示，枚举：启用、停用</td></tr>
<tr><td>统一社会信用代码</td><td>creditCode</td><td>灰色小字展示，前缀"ID："</td></tr>
</table>
<p>2、概览-机构基本情况</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构角色</td><td></td><td>以标签样式展示，一个机构可同时具有多个角色（如：服务提供方、服务使用方），为空时显示"--"</td></tr>
<tr><td>法定代表人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>机构性质</td><td></td><td>多值以顿号分隔展示，为空时显示"--"</td></tr>
<tr><td>成立时间</td><td></td><td>格式：yyyy-MM-dd，等宽字体展示</td></tr>
<tr><td>机构注册地</td><td></td><td>机构注册地编码+机构注册地详细地址拼装展示</td></tr>
<tr><td>机构居住地</td><td></td><td>机构居住地编码+机构居住地详细地址拼装展示</td></tr>
</table>
<p>3、概览-服务介绍</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>机构简介</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>主要产品或服务介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>人力情况介绍</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
</table>
<p>4、概览-资质材料</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>材料名称</td><td></td><td>以列表形式展示机构提交的资质文件，每条包含文件图标与材料名称，完整展示，为空时显示"--"</td></tr>
<tr><td>文件大小</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>下载按钮</td><td></td><td>每条材料右侧展示【下载-按钮】，点击下载对应文件</td></tr>
</table>
<p>5、操作-关闭抽屉</p>
<p>点击抽屉右上角【关闭按钮】，关闭详情抽屉，停留当前页面。</p>

<h3 id="prd-3.2.5.1.3">3.2.5.1.3 操作-停用/启用</h3>
<p><strong>模块描述：</strong>机构协同管理 / 机构列表 / 操作-停用/启用</p>
<p><strong>功能描述：</strong>对机构进行启用或停用操作，停用后该机构下所有账户无法登录。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当机构状态为"启用"时，操作栏显示【停用-按钮】；当机构状态为"停用"时，操作栏显示【启用-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>点击【停用-按钮】，弹出确认框"确定要停用该机构吗？"；点击【启用-按钮】，弹出确认框"确定要启用该机构吗？"，判断逻辑如下：</p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行操作，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为对应状态，关闭此对话框，进行消息提示，刷新列表。机构停用后，该机构下所有账户无法登录。</p>
<p style="font-style:italic; color:#999">Tip：机构已停用 / 机构已启用</p>

<h3 id="prd-3.2.5.2">3.2.5.2 账户列表</h3>
<p><strong>入口页面：</strong>运营管理后台 / 机构协同管理 / 账户列表（从机构列表进入）</p>
<p><strong>页面描述：</strong>查看指定机构下的账户信息，展示账户的联系信息，支持按真实姓名和状态筛选，可进行启用停用操作。</p>

<h3 id="prd-3.2.5.2.1">3.2.5.2.1 账户列表</h3>
<p><strong>模块描述：</strong>机构协同管理 / 账户列表 / 账户列表</p>
<p><strong>功能描述：</strong>展示指定机构的账户列表，支持按真实姓名和状态筛选，可进行启用停用操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>在机构列表点击【账户列表-按钮】，跳转至账户列表页面，页面顶部显示所属机构名称，支持返回机构列表。</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>真实姓名</td><td></td><td>支持模糊搜索</td></tr>
<tr><td>状态</td><td></td><td>枚举：启用、停用，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空搜索框，重置列表为全部数据</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为当前机构（从机构列表进入，匹配所选机构）的所有状态（启用、停用）的账户数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按创建时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑与交互说明</th></tr>
<tr><td>序号</td><td></td><td>显示当前页的行号，每页从1开始</td></tr>
<tr><td>真实姓名</td><td></td><td>加粗展示，为空时显示"--"</td></tr>
<tr><td>登录账号</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>身份证号</td><td></td><td>等宽字体展示，脱敏处理后显示</td></tr>
<tr><td>联系方式</td><td></td><td>等宽字体展示，为空时显示"--"</td></tr>
<tr><td>职务</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>E-mail/微信号</td><td></td><td>超出1行显示省略号，鼠标悬停展示全部内容（Tooltip），为空时显示"--"</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>启停状态</td><td></td><td>枚举：启用、停用，以徽标样式展示</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
启用 --(停用)---→ 停用
停用 --(启用)---→ 启用
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>启用</td><td></td><td>停用</td></tr>
<tr><td>停用</td><td></td><td>启用</td></tr>
</table>
<p>4、操作-返回</p>
<p>点击页面顶部【返回-按钮】，返回机构列表页面。</p>

<h3 id="prd-3.2.5.2.2">3.2.5.2.2 操作-停用/启用</h3>
<p><strong>模块描述：</strong>机构协同管理 / 账户列表 / 操作-停用/启用</p>
<p><strong>功能描述：</strong>对账户进行启用或停用操作，停用后该账户无法登录。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>当账户状态为"启用"时，操作栏显示【停用-按钮】；当账户状态为"停用"时，操作栏显示【启用-按钮】。</p>
<p><strong>详细设计：</strong></p>
<p>点击【停用-按钮】，弹出确认框"确定要停用该账户吗？"；点击【启用-按钮】，弹出确认框"确定要启用该账户吗？"，判断逻辑如下：</p>
<p>1、操作-取消</p>
<p>点击【取消-按钮】，关闭确认弹窗，不执行操作，停留当前页面。</p>
<p>2、操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，关闭此对话框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，状态变更为对应状态，关闭此对话框，进行消息提示，刷新列表。账户停用后，该账户无法登录。</p>
<p style="font-style:italic; color:#999">Tip：账户已停用 / 账户已启用</p>
`
  }
]

// ── 路由映射 ──────────────────────────────────────────────

const routePrdMap = {
  // 3.1.1 工作台
  '/workorder/serviceDesk': { anchor: 'prd-3.1.1', pageName: '工作台' },

  // 3.1.2 服务管理 - 服务上架
  '/workorder/myApps':                  { anchor: 'prd-3.1.2.1', pageName: '服务上架' },
  '/workorder/myAppsDetail':            { anchor: 'prd-3.1.2.1.4', pageName: '数字应用详情' },

  // 3.1.3 开通管理 - 服务开通 / 开通记录
  '/workorder/order/mySubscriptions':       { anchor: 'prd-3.1.3', pageName: '服务开通' },
  '/workorder/order/myInitiated':       { anchor: 'prd-3.1.3.2', pageName: '开通记录' },
  '/workorder/order/myInitiatedDetail': { anchor: 'prd-3.1.3.1.2', pageName: '订单详情' },

  // 3.1.4 需求管理 - 需求发起 / 需求响应
  '/workorder/myDemand/initiate':       { anchor: 'prd-3.1.4', pageName: '我发起的需求' },
  '/workorder/myDemand/initiateDetail': { anchor: 'prd-3.1.4.1.4', pageName: '需求详情' },
  '/workorder/myDemand/response':       { anchor: 'prd-3.1.4.2', pageName: '我响应的需求' },
  '/workorder/myDemand/allDetail':      { anchor: 'prd-3.1.4.2.1.2', pageName: '需求详情' },
  '/workorder/myDemand/responseDetail': { anchor: 'prd-3.1.4.2.2.2', pageName: '响应详情' },

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
  '/portal/auditCenter/qualificationAudit':       { anchor: 'prd-3.2.2', pageName: '机构入驻审核' },
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
  '/portal/order/detail':      { anchor: 'prd-3.2.3.1.3',   pageName: '订单详情' },
  '/portal/order/review':      { anchor: 'prd-3.2.3.3',   pageName: '质量评价管理' },
  '/workorder/order/list':     { anchor: 'prd-3.2.3',   pageName: '服务管理' },
  '/workorder/order/detail':   { anchor: 'prd-3.2.3.1.3',   pageName: '订单详情' },
  '/workorder/order/review':   { anchor: 'prd-3.2.3.3',   pageName: '质量评价管理' },

  // 3.2.4 需求管理
  '/portal/demand/all':      { anchor: 'prd-3.2.4',     pageName: '需求管理' },
  '/portal/demand/detail':   { anchor: 'prd-3.2.4.1.2', pageName: '需求详情' },

  // 3.2.5 机构协同管理
  '/portal/orgCollaboration/list':      { anchor: 'prd-3.2.5',   pageName: '机构列表' },
  '/portal/orgCollaboration/accounts':  { anchor: 'prd-3.2.5.2', pageName: '账户列表' },
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
