<template>
  <div class="my-apps-page">
    <PageHeader
      title="服务上架"
      description="管理已上架的服务，支持新增、修改、删除及提交审核"
    />

    <CloudCard class="my-apps-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="showTypeSelector = true">
            <template #icon><PlusOutlined /></template>
            新增服务
          </a-button>
        </template>
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 140px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
        <a-input v-model:value="filter.title" placeholder="服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="服务ID" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 130px">
          <a-select-option value="draft">草稿</a-select-option>
          <a-select-option value="pending_review">待审核</a-select-option>
          <a-select-option value="published">已上线使用</a-select-option>
          <a-select-option value="rejected">已驳回</a-select-option>
          <a-select-option value="offline">已下架</a-select-option>
        </a-select>
      </FilterBar>
      <div class="my-apps-page__divider"></div>

      <div class="my-apps-page__table-wrap">
        <a-table :scroll="{ x: 'max-content' }"
          :columns="columns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="id"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'title'" class="cell-name">
              <span class="cell-name__title">{{ record.title || '--' }}</span>
              <span class="cell-name__id">{{ record.appId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'createTime'">
              <span class="cell-mono">{{ formatTime(record.createTime) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="getStatusText(record.status)" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="goToDetail(record)">详情</a-button>
                <a-divider v-if="canEdit(record.status)" type="vertical" class="!mx-[2px]" />
                <a-button v-if="canEdit(record.status)" type="link" size="small" class="!p-0" @click="handleEdit(record)">修改</a-button>
                <a-divider v-if="canEdit(record.status)" type="vertical" class="!mx-[2px]" />
                <a-button v-if="canEdit(record.status)" type="link" size="small" danger class="!p-0" @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 服务类型选择弹窗 -->
    <a-modal :get-container="getDrawerContainer"
      v-model:open="showTypeSelector"
      title="选择服务类型"
      width="520px"
      :footer="null"
      :mask-closable="false"
    >
      <div class="type-selector-grid">
        <div
          v-for="opt in serviceTypeOptions"
          :key="opt.value"
          class="type-selector-card"
          @click="onSelectType(opt.value)"
        >
          <div class="type-selector-card__icon">
            <AppstoreOutlined v-if="opt.value === '数字应用'" />
            <SafetyOutlined v-else-if="opt.value === '安全服务'" />
            <BlockOutlined v-else-if="opt.value === '能力组件'" />
            <CloudServerOutlined v-else />
          </div>
          <div class="type-selector-card__title">{{ opt.label }}</div>
          <div class="type-selector-card__desc">{{ opt.desc }}</div>
        </div>
      </div>
    </a-modal>

    <a-modal :get-container="getDemoContainer"
      v-model:open="deleteDialogVisible"
      title="删除确认"
      width="420px"
      :ok-text="'确定'"
      :cancel-text="'取消'"
      ok-type="danger"
      @ok="confirmDelete"
    >
      <div class="delete-modal__body">
        <ExclamationCircleFilled class="delete-modal__icon" />
        <p class="delete-modal__text">是否确认删除该服务？删除后不可恢复。</p>
      </div>
    </a-modal>

    <!-- 应用详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
      v-model:open="drawer.visible"
      :title="drawerTitle"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon" :class="`drawer-header-icon--${getServiceTypeClass(drawer.record.serviceType)}`">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="drawer-header-logo" alt="" />
            <component :is="getServiceTypeIcon(drawer.record.serviceType)" v-else class="drawer-header-fallback" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.title || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>服务ID：{{ drawer.record.appId || drawer.record.contentId || '--' }}</span>
              <span class="drawer-header-sub__sep">·</span>
              <span>{{ drawer.record.serviceType || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="申报信息">
            <!-- 数字应用（按申报表单四步结构展示） -->
            <template v-if="drawer.record.serviceType === '数字应用'">
              <div class="detail-step-layout">
                <div class="detail-step-sidenav">
                  <div
                    v-for="opt in appStepOptions"
                    :key="opt.value"
                    class="detail-step-sidenav__item"
                    :class="{ 'is-active': drawer.appStepTab === opt.value }"
                    @click="drawer.appStepTab = opt.value"
                  >
                    {{ opt.label }}
                  </div>
                </div>
                <div class="detail-step-content">
                  <div v-show="drawer.appStepTab === 0">
                    <!-- Step 1: 企业基本情况 -->
                    <div class="overview-section">
                      <div class="overview-section__title">基本信息</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">单位（机构）名称</td>
                            <td colspan="3">{{ drawer.record.orgName || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">法定代表人</td>
                            <td>{{ drawer.record.legalPerson || '--' }}</td>
                            <td class="label-cell">统一社会信用代码</td>
                            <td>{{ drawer.record.creditCode || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">单位（机构）性质</td>
                            <td colspan="3">{{ drawer.record.orgNature || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">成立时间</td>
                            <td colspan="3">{{ drawer.record.establishDate || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">单位（机构）注册地</td>
                            <td colspan="3">{{ drawer.record.regAddress || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">单位（机构）地址</td>
                            <td colspan="3">{{ drawer.record.bizAddress || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">联系人</td>
                            <td colspan="3">{{ formatContact(drawer.record) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">详细信息</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">应用服务</td>
                            <td>{{ drawer.record.appServiceIntro || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">企业简介</td>
                            <td>{{ drawer.record.orgIntro || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">主要产品或服务介绍</td>
                            <td>{{ drawer.record.mainProductIntro || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">人力情况介绍</td>
                            <td>{{ drawer.record.hrIntro || '--' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">真实性承诺</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">《真实性承诺》</td>
                            <td><FileLinks :files="drawer.record.authenticityCommit" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-show="drawer.appStepTab === 1">
                    <!-- Step 2: 应用服务功能情况 -->
                    <div class="overview-section">
                      <div class="overview-section__title">系统基本情况</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">应用系统名称</td>
                            <td colspan="3">{{ drawer.record.systemName || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">建设厂商</td>
                            <td colspan="3">{{ drawer.record.builderVendor || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">联系人及联系方式1</td>
                            <td>{{ drawer.record.sysContactName ? `${drawer.record.sysContactName} ${drawer.record.sysContactPhone || ''}` : '--' }}</td>
                            <td class="label-cell">联系人及联系方式2</td>
                            <td>{{ drawer.record.sysContact2Name ? `${drawer.record.sysContact2Name} ${drawer.record.sysContact2Phone || ''}` : '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">应用服务资费</td>
                            <td colspan="3">{{ drawer.record.servicePricing || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">建设总投资（万元）</td>
                            <td>{{ drawer.record.totalInvestment != null ? drawer.record.totalInvestment : '--' }}</td>
                            <td class="label-cell">系统结构</td>
                            <td>{{ drawer.record.systemStructure || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">系统主要功能</td>
                            <td colspan="3">{{ drawer.record.systemMainFunc || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">系统地址</td>
                            <td colspan="3">{{ drawer.record.systemUrl || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">服务对象</td>
                            <td colspan="3">{{ formatArray(drawer.record.serviceTarget) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">应用覆盖范围</td>
                            <td colspan="3">
                              <div v-if="drawer.record.coverBase && drawer.record.coverBase.length" class="coverage-box">
                                <div class="coverage-box__title">基层应用覆盖范围</div>
                                <div class="coverage-box__value">{{ formatArray(drawer.record.coverBase) }}</div>
                              </div>
                              <div v-if="drawer.record.coverPublic && drawer.record.coverPublic.length" class="coverage-box">
                                <div class="coverage-box__title">公立应用覆盖范围</div>
                                <div class="coverage-box__value">{{ formatArray(drawer.record.coverPublic) }}</div>
                              </div>
                              <div v-if="drawer.record.coverTech && drawer.record.coverTech.length" class="coverage-box">
                                <div class="coverage-box__title">医技应用覆盖范围</div>
                                <div class="coverage-box__value">{{ formatArray(drawer.record.coverTech) }}</div>
                              </div>
                              <span v-if="!hasCoverage">--</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="label-cell">应用发布终端</td>
                            <td colspan="3">{{ formatArray(drawer.record.publishTerminal) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">系统集成情况</td>
                            <td>{{ drawer.record.systemIntegration || '--' }}</td>
                            <td class="label-cell">数据库类型</td>
                            <td>{{ drawer.record.databaseType || '--' }}</td>
                          </tr>
                          <tr v-if="drawer.record.systemIntegrationNote">
                            <td class="label-cell">集成说明</td>
                            <td colspan="3">{{ drawer.record.systemIntegrationNote }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">编程语言</td>
                            <td>{{ drawer.record.programLang || '--' }}</td>
                            <td class="label-cell">中间件类型</td>
                            <td>{{ drawer.record.middlewareType || '--' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">系统部署</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">部署方式</td>
                            <td>{{ drawer.record.deployMethod || '--' }}</td>
                            <td class="label-cell">部署机房所在地</td>
                            <td>{{ drawer.record.deployLocation || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">云服务商名称</td>
                            <td>{{ formatArray(drawer.record.cloudProviderName) }}</td>
                            <td class="label-cell">云服务方式</td>
                            <td>{{ formatArray(drawer.record.cloudServiceMode) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">主要设备</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">服务器</td>
                            <td>{{ formatDevice(drawer.record.serverName, drawer.record.serverConfig, drawer.record.serverDeployMode) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">存储设备</td>
                            <td>{{ formatDevice(drawer.record.storageName, drawer.record.storageDevice, drawer.record.storageDeployMode) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">备份设备</td>
                            <td>{{ formatDevice(drawer.record.backupName, drawer.record.backupDevice, drawer.record.backupDeployMode) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">网络设备</td>
                            <td>{{ formatDevice(drawer.record.networkName, drawer.record.networkDevice, drawer.record.networkDeployMode) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">其他设备</td>
                            <td>{{ formatDevice(drawer.record.otherName, drawer.record.otherDevice, drawer.record.otherDeployMode) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">系统互联</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">系统互联</td>
                            <td>{{ drawer.record.systemInterconnect || '--' }}</td>
                            <td class="label-cell">连接方式</td>
                            <td>{{ drawer.record.connectMethod || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">系统关联名称</td>
                            <td colspan="3">{{ drawer.record.relatedSystemName || '--' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">所属网络</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">所属网络</td>
                            <td colspan="3">{{ formatArray(drawer.record.networkScope) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">网络覆盖范围</td>
                            <td colspan="3">{{ formatArray(drawer.record.networkCoverage) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">网络拓扑及说明</td>
                            <td>{{ drawer.record.networkTopology || '--' }}</td>
                            <td class="label-cell">网络拓扑图</td>
                            <td><FileLinks :files="drawer.record.networkTopologyFile" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">系统安全</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">系统等级保护定级情况</td>
                            <td>{{ drawer.record.protectionLevel || '--' }}</td>
                            <td class="label-cell">等保备案情况</td>
                            <td>{{ drawer.record.protectionFiling || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">等保备案号</td>
                            <td>{{ drawer.record.filingNumber || '--' }}</td>
                            <td class="label-cell">系统分级保护定级情况</td>
                            <td>{{ drawer.record.classifiedProtection || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">分级保护备案情况</td>
                            <td>{{ drawer.record.classifiedFiling || '--' }}</td>
                            <td class="label-cell">分保备案号</td>
                            <td>{{ drawer.record.classifiedFilingNumber || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">安全测评及备案报告</td>
                            <td>{{ drawer.record.securityAssessment || '--' }}</td>
                            <td class="label-cell">测评报告</td>
                            <td><FileLinks :files="drawer.record.securityAssessmentFile" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">数据共享</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">是否能够接入市共享系统</td>
                            <td>{{ drawer.record.dataShareAccess || '--' }}</td>
                            <td class="label-cell">数据共享类型</td>
                            <td>{{ drawer.record.dataShareType || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">文件依据</td>
                            <td colspan="3">{{ drawer.record.dataShareBasis || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">数据共享方式</td>
                            <td>{{ drawer.record.dataShareMode || '--' }}</td>
                            <td class="label-cell">数据资源目录</td>
                            <td>{{ drawer.record.dataResourceCatalog || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">数据资源目录附件</td>
                            <td colspan="3"><FileLinks :files="drawer.record.dataResourceCatalogFile" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">密码应用与国产适配</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">系统使用的密码产品情况</td>
                            <td>{{ drawer.record.cipherProduct || '--' }}</td>
                            <td class="label-cell">国产适配</td>
                            <td>{{ drawer.record.domesticAdaptation || '--' }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">密码应用方案和密码应用安全性评估</td>
                            <td>{{ drawer.record.cipherAssessment || '--' }}</td>
                            <td class="label-cell">测评报告</td>
                            <td><FileLinks :files="drawer.record.cipherAssessmentFile" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">系统运维情况</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">运维模式</td>
                            <td>{{ drawer.record.opsMode || '--' }}</td>
                            <td class="label-cell">主要运维内容</td>
                            <td>{{ drawer.record.opsContent || '--' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="overview-section">
                      <div class="overview-section__title">建设预期指标</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">预期用户数</td>
                            <td>{{ formatIndicator(drawer.record.expectedUsersType, drawer.record.expectedUsers) }}</td>
                            <td class="label-cell">最大并发数</td>
                            <td>{{ formatIndicator(drawer.record.maxConcurrencyType, drawer.record.maxConcurrency) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">简单业务响应时间（秒）</td>
                            <td>{{ formatIndicator(drawer.record.responseTimeSimpleType, drawer.record.responseTimeSimple) }}</td>
                            <td class="label-cell">复杂业务响应时间（秒）</td>
                            <td>{{ formatIndicator(drawer.record.responseTimeComplexType, drawer.record.responseTimeComplex) }}</td>
                          </tr>
                          <tr>
                            <td class="label-cell">共享数据量</td>
                            <td colspan="3">{{ formatIndicator(drawer.record.sharedDataCountType, drawer.record.sharedDataCount) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-show="drawer.appStepTab === 2">
                    <!-- Step 3: 产品或服务的基本情况 -->
                    <table class="detail-table">
                      <tbody>
                        <tr>
                          <td class="label-cell">主要产品或服务详细功能介绍</td>
                          <td>{{ drawer.record.productDetailIntro || '--' }}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">性能指标</td>
                          <td>{{ drawer.record.performanceMetrics || '--' }}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">安全性介绍</td>
                          <td>{{ drawer.record.securityIntro || '--' }}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">可靠性介绍</td>
                          <td>{{ drawer.record.reliabilityIntro || '--' }}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">易用性介绍</td>
                          <td>{{ drawer.record.usabilityIntro || '--' }}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">可维护性介绍</td>
                          <td>{{ drawer.record.maintainabilityIntro || '--' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-show="drawer.appStepTab === 3">
                    <!-- Step 4: 相关附件 -->
                    <div class="overview-section">
                      <div class="overview-section__title">资质证明材料</div>
                      <table class="detail-table">
                        <tbody>
                          <tr>
                            <td class="label-cell">申报单位营业执照</td>
                            <td><FileLinks :files="drawer.record.bizLicense" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">企业资质证明材料</td>
                            <td><FileLinks :files="drawer.record.enterpriseQualification" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">典型案例企业证明材料</td>
                            <td><FileLinks :files="drawer.record.typicalCase" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">参与服务的团队能力及相关证明材料</td>
                            <td><FileLinks :files="drawer.record.teamAbility" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">《信息安全等级保护》相关证明材料</td>
                            <td><FileLinks :files="drawer.record.securityReport" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">商用密码产品认证能力相关证明材料</td>
                            <td><FileLinks :files="drawer.record.cipherCert" /></td>
                          </tr>
                          <tr>
                            <td class="label-cell">其他相关文件及需要说明的情况</td>
                            <td><FileLinks :files="drawer.record.otherFiles" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 安全服务 -->
            <template v-else-if="drawer.record.serviceType === '安全服务'">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="系统地址" :span="2">{{ drawer.record.systemUrl || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="付费方式参考" :span="2">{{ drawer.record.paymentMethodRef || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="应用描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="合作伙伴">{{ drawer.record.cooperativeEnterprise || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactName1 || '--' }} {{ drawer.record.contactPhone1 || '' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactName2 || '--' }} {{ drawer.record.contactPhone2 || '' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务对象" :span="2">{{ formatArray(drawer.record.targetObject) }}</a-descriptions-item>
                  <a-descriptions-item label="应用架构" :span="2">{{ formatArray(drawer.record.appArchitecture) }}</a-descriptions-item>
                  <a-descriptions-item label="部署云服务商" :span="2">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>

            <!-- 能力组件 -->
            <template v-else-if="drawer.record.serviceType === '能力组件'">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="付费方式参考" :span="2">{{ drawer.record.paymentMethodRef || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="组件描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactName1 || '--' }} {{ drawer.record.contactPhone1 || '' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactName2 || '--' }} {{ drawer.record.contactPhone2 || '' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="部署云服务商">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                  <a-descriptions-item label="开放范围">{{ drawer.record.coverView || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>

            <!-- 基础服务 -->
            <template v-else-if="drawer.record.serviceType === '基础服务'">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="付费方式参考" :span="2">{{ drawer.record.paymentMethodRef || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="服务描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactPhone1 || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactPhone2 || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务专区">{{ getServiceZoneLabel(drawer.record.serviceZone) }}</a-descriptions-item>
                  <a-descriptions-item label="部署云服务商">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                  <a-descriptions-item label="服务分类">{{ drawer.record.serviceSubType || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>
          </a-tab-pane>

          <a-tab-pane key="audit" tab="审核信息">
            <div class="overview-section__title">审核记录</div>
            <a-table :scroll="{ x: 'max-content' }"
              :columns="auditColumns"
              :data-source="auditVersionRows"
              row-key="versionKey"
              size="middle"
              :pagination="false"
              :expanded-row-keys="expandedRowKeys"
              @expand="onExpand"
            >
              <template #expandedRowRender="{ record }">
                <div class="audit-pipeline">
                  <div
                    v-for="(step, idx) in auditSteps"
                    :key="step.key"
                    class="pipeline-step"
                    :class="getPipelineStepClass(record, idx)"
                  >
                    <div class="pipeline-step__dot" :class="getPipelineDotClass(record, idx)">
                      <CheckOutlined v-if="getPipelineStepStatus(record, idx) === 'done'" />
                      <CloseOutlined v-else-if="getPipelineStepStatus(record, idx) === 'rejected'" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <div class="pipeline-step__content">
                      <div class="pipeline-step__title">阶段 {{ idx + 1 }}：{{ step.title }}</div>
                      <div class="pipeline-step__tag" :class="getPipelineTagClass(record, idx)">{{ getPipelineTagText(record, idx) }}</div>
                      <div v-if="getPipelineStepDetail(record, idx)" class="pipeline-step__detail">
                        <div class="pipeline-step__opinion">{{ getPipelineStepDetail(record, idx).opinion }}</div>
                        <div class="pipeline-step__meta">
                          <div class="pipeline-step__auditor">{{ getPipelineStepDetail(record, idx).auditor }}</div>
                          <div class="pipeline-step__audit-time">{{ getPipelineStepDetail(record, idx).auditTime }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="idx < auditSteps.length - 1" class="pipeline-step__connector" :class="getPipelineConnectorClass(record, idx)"></div>
                  </div>
                </div>
              </template>
              <template #bodyCell="{ column, record }">
                <span v-if="column.dataIndex === 'submittedAt'" class="cell-mono">{{ record.submittedAt || '--' }}</span>
                <template v-else-if="column.dataIndex === 'status'">
                  <StatusDot :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
                </template>
                <template v-else-if="column.dataIndex === 'auditTime'">
                  <span class="cell-mono">{{ record.auditTime || '--' }}</span>
                </template>
                <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane key="rating" tab="评价信息">
            <div class="overview-section">
              <div class="overview-section__title">评分概览</div>
              <div class="rating-overview">
                <div class="rating-overview__item">
                  <div class="rating-overview__label">平台评分</div>
                  <div class="rating-overview__body">
                    <span class="rating-overview__num">{{ drawer.record.platformRating || 0 }}</span>
                    <span class="rating-overview__unit">分</span>
                    <span class="rating-overview__stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= (drawer.record.platformRating || 0) }">★</span>
                    </span>
                  </div>
                </div>
                <div class="rating-overview__item">
                  <div class="rating-overview__label">用户评价</div>
                  <div class="rating-overview__body">
                    <span class="rating-overview__num">{{ drawer.record.usageRating || 0 }}</span>
                    <span class="rating-overview__unit">分</span>
                    <span class="rating-overview__stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= (drawer.record.usageRating || 0) }">★</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="overview-section">
              <div class="overview-section__head">
                <span class="overview-section__title">用户评价</span>
                <span class="overview-section__count">共 {{ drawerUsageRatings.length }} 条</span>
              </div>
              <div class="rating-list">
                <div v-for="(item, idx) in drawerUsageRatings" :key="idx" class="rating-card">
                  <div class="rating-card__body">
                    <div class="rating-card__row">
                      <span class="rating-card__org">{{ item.orgName || '--' }}</span>
                      <span class="rating-card__sep">·</span>
                      <span class="rating-card__order">{{ item.orderNo }}</span>
                    </div>
                    <div class="rating-card__dims">
                      <span v-for="d in dimLabels" :key="d" class="rating-card__dim">
                        <span class="rating-card__dim-label">{{ d }}</span>
                        <span class="rating-card__dim-stars">
                          <span v-for="i in 5" :key="i" class="star-sm" :class="{ full: i <= item.ratings[d] }">★</span>
                        </span>
                        <span class="rating-card__dim-num">{{ item.ratings[d] }}</span>
                      </span>
                    </div>
                    <div class="rating-card__content">{{ item.content }}</div>
                    <div class="rating-card__time">{{ item.time }}</div>
                    <div v-if="item.reply" class="rating-card__reply">
                      <strong>开发者回复：</strong>{{ item.reply }}
                    </div>
                  </div>
                </div>
                <div v-if="!drawerUsageRatings.length" class="rating-empty">暂无评价</div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import {
  PlusOutlined, ExclamationCircleFilled,
  AppstoreOutlined, SafetyOutlined,
  BlockOutlined, CloudServerOutlined,
  CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { h } from 'vue'

// 附件链接：蓝色可点击（演示环境提示下载）
const FileLinks = {
  name: 'FileLinks',
  props: {
    files: { type: [Array, String], default: null }
  },
  setup(props) {
    return () => {
      const arr = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : [])
      if (!arr.length) return h('span', '--')
      return h(
        'span',
        { class: 'file-links' },
        arr.reduce((acc, f, i) => {
          if (i > 0) acc.push('、')
          acc.push(h('a', {
            class: 'file-link',
            onClick: () => { message.info(`演示环境：《${f}》下载暂不可用`) }
          }, f))
          return acc
        }, [])
      )
    }
  }
}
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import { getContentList } from '@/api/contentcore/content'

const SERVICE_TYPE_ICONS = {
  '数字应用': AppstoreOutlined,
  '安全服务': SafetyOutlined,
  '能力组件': BlockOutlined,
  '基础服务': CloudServerOutlined
}

// 数字应用详情演示数据（字段与新增数字应用申报4步骤表单保持一致）
const DIGITAL_APP_DETAIL_MOCK = {
  // Step1: 企业基本情况
  orgName: '重庆卫生健康信息技术有限公司',
  legalPerson: '张三',
  creditCode: '91500000MA60XXXXXX',
  orgNature: '国有',
  establishDate: '2020-03-15',
  regAddress: '重庆市 渝北区 龙山街道XXX号',
  bizAddress: '重庆市 渝北区 龙山街道XXX号',
  contactPerson: '李四',
  contactPhone: '13800138000',
  contactPosition: '项目经理',
  contactEmail: 'lisi@cqhw.com',
  appServiceIntro: '云HIS、云LIS、云PACS、心电云、基本公共卫生服务、信息安全等，覆盖区域内各级医疗卫生机构。',
  orgIntro: '公司成立于2020年，专注于卫生健康信息化领域，主营业务涵盖区域卫生信息平台、医院信息化系统建设与运维，服务覆盖全市38个区县。',
  mainProductIntro: '主要产品为区域智慧医疗服务平台，面向基层医疗卫生机构与公立医院，提供诊疗、公卫、影像、心电等一体化应用场景。',
  hrIntro: '员工总数320人，研发人员150人，运维人员60人，服务人员40人，经营管理人员70人；核心技术人员均具备PMP、系统架构师等资质，人员结构稳定。',
  authenticityCommit: '真实性承诺书（法人签章）.pdf',

  // Step2: 应用服务功能情况
  systemName: '区域智慧医疗服务平台',
  builderVendor: '重庆卫生健康信息技术有限公司',
  sysContactName: '王五',
  sysContactPhone: '13900139000',
  sysContact2Name: '赵六',
  sysContact2Phone: '13700137000',
  servicePricing: '基于系统 20万元/年，基于功能模块 2万元/个/年',
  totalInvestment: 580,
  systemMainFunc: '提供门诊住院一体化诊疗、电子病历、检验检查报告共享、影像云PACS、心电远程诊断、家庭医生签约与慢病随访管理等核心功能。',
  systemUrl: 'https://medcloud.cqhw.example.com',
  systemStructure: 'B/S',
  serviceTarget: ['基层医疗卫生机构', '公立医院'],
  coverBase: ['基本公共卫生服务', '医院信息系统（HIS）', '家庭医生签约'],
  coverPublic: ['医院信息系统（HIS）', '影像归档和通信系统（PACS）'],
  publishTerminal: ['网页', '自建APP'],
  systemIntegration: '已集成',
  databaseType: 'MySQL 8.0、达梦DM8',
  programLang: 'Java、Vue、Python',
  middlewareType: '东方通TongWeb、Redis、Kafka',
  deployMethod: '通过云服务商部署',
  deployLocation: '重庆市 两江新区水土数据中心',
  cloudProviderName: ['浪潮云'],
  cloudServiceMode: ['行业云'],
  serverName: '20台/套 浪潮NF5280M6',
  serverConfig: '4路8核 AMD 6136，16G内存，2*300G',
  serverDeployMode: ['自有机房'],
  storageName: '5台/套 华为OceanStor 5310',
  storageDevice: '双控，64G缓存，2*480G SSD + 12*4T SAS',
  storageDeployMode: ['自有机房'],
  backupName: '2台/套 Veritas NetBackup一体机',
  backupDevice: '备份容量100TB，万兆光口',
  backupDeployMode: ['自有机房'],
  networkName: '4台/套 华为CE12800',
  networkDevice: '48口10GE光，6口40GE',
  networkDeployMode: ['自有机房'],
  otherName: '2台/套 GPU推理服务器',
  otherDevice: '4*NVIDIA T4，128G内存',
  otherDeployMode: ['自有机房'],
  systemInterconnect: '系统关联运行',
  relatedSystemName: '重庆市全民健康信息平台、区域影像云平台',
  connectMethod: '接口调用',
  networkScope: ['互联网', '业务专网'],
  networkCoverage: ['市级', '区县（开发区）'],
  networkTopology: '有',
  networkTopologyFile: '网络拓扑图.pdf',
  protectionLevel: '三级',
  protectionFiling: '已备案',
  filingNumber: '渝公网安备50011202000XXX号',
  classifiedProtection: '无涉密',
  classifiedFiling: '未备案',
  classifiedFilingNumber: '',
  securityAssessment: '有',
  securityAssessmentFile: '安全测评及备案报告.pdf',
  dataShareAccess: '是',
  dataShareType: '无条件共享',
  dataShareBasis: '',
  dataShareMode: 'API接口共享',
  dataResourceCatalog: '有',
  dataResourceCatalogFile: '数据资源目录.xlsx',
  cipherProduct: '商用密码',
  domesticAdaptation: '国产化产品',
  cipherAssessment: '有',
  cipherAssessmentFile: '密码应用安全性评估报告.pdf',
  opsMode: '统一运维',
  opsContent: '7×24小时系统监控、故障响应、数据备份、版本升级与安全加固。',
  expectedUsers: '5000',
  expectedUsersType: '≥',
  responseTimeSimple: '1',
  responseTimeSimpleType: '≤',
  responseTimeComplex: '3',
  responseTimeComplexType: '≤',
  maxConcurrency: '2000',
  maxConcurrencyType: '≥',
  sharedDataCount: '100',
  sharedDataCountType: '≥',

  // Step3: 产品或服务的基本情况
  productDetailIntro: '平台采用微服务架构，包含门诊医生工作站、住院管理、电子病历、检验检查、影像归档与传输、心电远程诊断、家庭医生签约、慢病随访管理等模块，支持区域协同与数据互通。',
  performanceMetrics: '服务性能：简单业务响应时间≤1秒，复杂业务响应时间≤3秒；网络性能：出口带宽≥1Gbps；云性能：可用性≥99.9%。',
  securityIntro: '建立安全管理制度，支持访问控制、身份认证、数据加密传输与存储，通过三级等保测评，具备完善的用户隐私保护机制。',
  reliabilityIntro: '两地三中心容灾备份架构，RPO≤15分钟，RTO≤2小时，核心数据库主备双活。',
  usabilityIntro: '界面遵循医疗行业设计规范，支持快捷键操作、模板化录入，主要功能操作不超过3步。',
  maintainabilityIntro: '提供统一日志管理与监控告警，支持灰度发布与版本回滚，故障排查工具齐全。',

  // Step4: 相关附件
  bizLicense: '营业执照.pdf',
  enterpriseQualification: '软件企业证书.pdf、ISO27001认证证书.pdf',
  typicalCase: 'XX医院合作合同.pdf、用户使用反馈报告.pdf',
  teamAbility: '团队资质证明材料.pdf',
  securityReport: '等级保护测评报告.pdf',
  cipherCert: '商用密码产品认证证书.pdf',
  otherFiles: '第三方产品授权函.pdf'
}

export default {
  name: 'OrderMyApps',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot,
    PlusOutlined, ExclamationCircleFilled,
    AppstoreOutlined, SafetyOutlined,
    BlockOutlined, CloudServerOutlined,
    CheckOutlined, CloseOutlined, FileLinks
  },
  data() {
    return {
      loading: false,
      filter: { title: '', serviceId: '', serviceType: undefined, status: undefined },
      applied: { title: '', serviceId: '', serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      showTypeSelector: false,
      serviceTypeOptions: [
        { value: '数字应用', label: '数字应用', desc: '面向基层医疗的数字应用服务' },
        { value: '安全服务', label: '安全服务', desc: '数据加密、安全审计等安全服务' },
        { value: '能力组件', label: '能力组件', desc: '可复用的技术能力组件' },
        { value: '基础服务', label: '基础服务', desc: '云基础资源与服务' }
      ],
      columns: [
        { title: '服务名称/ID', dataIndex: 'title', key: 'title', width: 240 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 100 },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', width: 180, ellipsis: true },
        { title: '部署云服务商', dataIndex: 'cloudProvider', key: 'cloudProvider', width: 130, ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' }
      ],
      appList: [],
      deleteDialogVisible: false,
      deleteTargetId: null,
      drawer: { visible: false, record: null, activeTab: 'info', appStepTab: 0 },
      appStepOptions: [
        { label: '企业基本情况', value: 0 },
        { label: '应用服务功能情况', value: 1 },
        { label: '产品或服务的基本情况', value: 2 },
        { label: '相关附件', value: 3 }
      ],
      expandedRowKeys: [],
      auditColumns: [
        { title: '提交审核时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
        { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 140 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
        { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 120 },
        { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', width: 160 },
        { title: '审核意见', dataIndex: 'opinion', key: 'opinion', ellipsis: true }
      ],
      auditSteps: [
        { key: 1, title: '申报材料评估' },
        { key: 2, title: '应用技术测评' },
        { key: 3, title: '现场演示答辩' },
        { key: 4, title: '评估结果公示' }
      ],
      // 版本审核流水数据（按阶段记录最终审核结果）
      versionAuditMock: {
        V1: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-01-02 15:30', opinion: '材料完整、信息有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-01-05 14:00', opinion: '功能完整性、性能指标、安全合规均达到标准' },
          3: { statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-01-10 16:00', opinion: '核心功能演示完整，数据同步逻辑清晰，答辩通过' },
          4: { statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-01-12 10:00', opinion: '服务信息完整，发布至服务目录' }
        },
        V2: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-02-11 10:00', opinion: '修改后的材料完整合规，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-02-13 16:00', opinion: '功能完整、性能达标，技术测评通过' },
          3: { statusKey: 'processing', statusText: '进行中' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V3: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-02-16 09:30', opinion: '申报材料齐全、资质真实有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-02-18 11:00', opinion: '应用功能完整、性能指标达标，技术测评通过' },
          3: { statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-02-20 15:00', opinion: '现场演示未能体现核心业务闭环，数据安全方案存在明显缺陷' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V4: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '刘经理', auditTime: '2026-03-02 10:00', opinion: '材料齐全，资质审核通过' },
          2: { statusKey: 'rejected', statusText: '已驳回', auditor: '陈工程师', auditTime: '2026-03-05 14:00', opinion: '应用性能测试不达标，并发处理能力不足，需优化后重新提交' },
          3: { statusKey: 'pending', statusText: '未开始' },
          4: { statusKey: 'pending', statusText: '未开始' }
        }
      },
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      ratingKeys: ['准确性', '稳定性', '响应时效', '业务适配性']
    }
  },
  computed: {
    hasCoverage() {
      const r = this.drawer.record
      if (!r) return false
      return !!(r.coverBase?.length || r.coverPublic?.length || r.coverTech?.length)
    },
    drawerTitle() {
      const type = this.drawer.record?.serviceType
      return type ? `${type}详情` : '服务详情'
    },
    filteredData() {
      const f = this.applied
      const list = this.appList.filter(item => {
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.serviceId && !(item.appId || '').includes(f.serviceId)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        if (f.status && String(item.status) !== f.status && this.getStatusText(item.status) !== this.getStatusText(f.status)) return false
        return true
      })
      return list.map(i => ({ key: i.id, ...i }))
    },
    drawerUsageRatings() {
      const rec = this.drawer.record
      if (!rec) return []
      const svc = rec.title || '服务'
      return [
        { ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: svc, orderNo: '#202608100089', orgName: '重庆医科大学附属第一医院', userName: '张三', content: '服务运行稳定，功能齐全，整体体验很好。', time: '2026-03-15 14:32', reply: '感谢您的认可与支持！' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: svc, orderNo: '#202608100090', orgName: '重庆市人民医院', userName: '李四', content: '集成方便，文档完善，基本满足需求。', time: '2026-03-12 09:15' }
      ]
    },
    auditVersionRows() {
      if (!this.drawer.record) return []
      const s = (key) => this.versionAuditMock[key][4] || {}
      const submitter = this.drawer.record.serviceProvider || '服务提供商'
      return [
        { versionKey: 'V1', versionLabel: 'V1', submittedAt: '2026-01-01 10:00:00', submitter, status: '已通过', auditor: s('V1').auditor || '', auditTime: s('V1').auditTime || '', opinion: s('V1').opinion || '' },
        { versionKey: 'V2', versionLabel: 'V2', submittedAt: '2026-02-10 09:00:00', submitter, status: '审核中', auditor: s('V2').auditor || '', auditTime: s('V2').auditTime || '', opinion: s('V2').opinion || '' },
        { versionKey: 'V3', versionLabel: 'V3', submittedAt: '2026-02-15 11:00:00', submitter, status: '已驳回', auditor: s('V3').auditor || '', auditTime: s('V3').auditTime || '', opinion: s('V3').opinion || '' },
        { versionKey: 'V4', versionLabel: 'V4', submittedAt: '2026-03-01 14:00:00', submitter, status: '已驳回', auditor: s('V4').auditor || '', auditTime: s('V4').auditTime || '', opinion: s('V4').opinion || '' }
      ]
    },
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.filteredData.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  created() {
    this.loadAppList()
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    formatCover(val) {
      if (!val) return '--'
      if (Array.isArray(val)) return val.join('、')
      return val
    },
    formatArray(arr) {
      if (Array.isArray(arr)) return arr.join('、') || '--'
      return arr || '--'
    },
    formatContact(record) {
      if (!record || !record.contactPerson) return '--'
      const parts = [record.contactPerson, record.contactPhone].filter(Boolean)
      const extras = [record.contactPosition, record.contactEmail].filter(Boolean)
      let text = parts.join(' ')
      if (extras.length) text += `（${extras.join(' / ')}）`
      return text
    },
    formatDevice(name, config, deployMode) {
      const parts = []
      if (name) parts.push(name)
      if (config) parts.push(config)
      if (deployMode && deployMode.length) parts.push(`部署方式：${Array.isArray(deployMode) ? deployMode.join('、') : deployMode}`)
      return parts.length ? parts.join('；') : '--'
    },
    formatIndicator(type, val) {
      if (val == null || val === '') return '--'
      return `${type || ''} ${val}`
    },
    getServiceZoneLabel(zone) {
      const map = { X86Zone: 'X86专区', XinChuangZone: '信创专区', CipherZone: '密码服务专区', SuperComputeZone: '超算、智算专区' }
      return map[zone] || zone || '--'
    },
    loadAppList() {
      this.loading = true
      getContentList({ pageNum: 1, pageSize: 50, catalogId: '603612031287365' }).then((response) => {
        this.appList = (response.data.rows || []).slice(0, 8).map((item, idx) => ({
          ...item,
          serviceType: ['数字应用', '安全服务', '能力组件', '基础服务'][idx % 4],
          orderNo: this.generateOrderNo(idx),
          createTime: '2026-0' + (3 + idx % 3) + '-' + (10 + idx) + ' 10:00',
          platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1))
        }))
        this.loading = false
      }).catch(() => {
        this.appList = [
          { id: '1', title: '智慧医院信息管理系统', appId: 'APP001', orderNo: '202608100001', serviceType: '数字应用', status: 'published', serviceProvider: '北京健康科技有限公司', cloudProvider: '浪潮云', createTime: '2026-03-10 10:00', platformRating: 4.5, usageRating: 4.3 },
          { id: '2', title: '数据加密传输组件', appId: 'APP002', orderNo: '202608100002', serviceType: '安全服务', status: 'published', serviceProvider: '上海安全技术有限公司', cloudProvider: '电信云', createTime: '2026-03-09 14:00', platformRating: 4.2, usageRating: 4.6 },
          { id: '3', title: '统一身份认证组件', appId: 'APP003', orderNo: '202608100003', serviceType: '能力组件', status: 'draft', serviceProvider: '广州智慧健康科技有限公司', cloudProvider: '移动云', createTime: '2026-03-08 09:00', platformRating: 4.8, usageRating: 4.1 },
          { id: '4', title: '云数据库服务', appId: 'APP004', orderNo: '202608100004', serviceType: '基础服务', status: 'offline', serviceProvider: '深圳云计算有限公司', cloudProvider: '联通云', createTime: '2026-03-07 16:00', platformRating: 4.0, usageRating: 3.9 },
          { id: '5', title: '医学影像处理系统', appId: 'APP005', orderNo: '202608100005', serviceType: '数字应用', status: 'pending_review', serviceProvider: '杭州医学影像科技有限公司', cloudProvider: '影像云', createTime: '2026-03-06 11:00', platformRating: 4.6, usageRating: 4.5 },
          { id: '6', title: '安全审计平台', appId: 'APP006', orderNo: '202608100006', serviceType: '安全服务', status: 'published', serviceProvider: '深圳安全科技有限公司', cloudProvider: '紫光云', createTime: '2026-03-05 08:00', platformRating: 4.3, usageRating: 4.2 }
        ]
        this.loading = false
      })
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { title: '', serviceId: '', serviceType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    onSelectType(type) {
      const routeMap = {
        '数字应用': '/portal/service/digitalAppForm',
        '安全服务': '/portal/service/securityServiceForm',
        '能力组件': '/portal/service/componentForm',
        '基础服务': '/portal/service/serviceCatalogForm'
      }
      const path = routeMap[type]
      this.showTypeSelector = false
      if (path) {
        // 弹窗挂载在 .app-overlay（与路由容器分离），可直接立即跳转，不会产生 DOM 冲突
        this.$router.push({ path, query: { cid: '603612031287365', mode: 'shelf' } })
      }
    },
    handleEdit(row) {
      const type = row.serviceType || '数字应用'
      const id = row.id || row.contentId
      const routeMap = {
        '数字应用': '/portal/service/digitalAppForm',
        '安全服务': '/portal/service/securityServiceForm',
        '能力组件': '/portal/service/componentForm',
        '基础服务': '/portal/service/serviceCatalogForm'
      }
      const path = routeMap[type]
      if (path) {
        this.$router.push({ path, query: { id, cid: '603612031287365', mode: 'shelf' } })
      }
    },
    handleDelete(row) {
      this.deleteTargetId = row.id || row.contentId
      this.deleteDialogVisible = true
    },
    confirmDelete() {
      this.deleteDialogVisible = false
      message.success('删除成功')
      this.loadAppList()
    },
    canEdit(status) {
      return status !== 'pending_review' && status !== 20
    },
    getStatusKey(status) {
      const map = {
        0: 'default', 10: 'done', 20: 'processing', 30: 'rejected', 40: 'cancelled',
        draft: 'default', pending_review: 'processing', published: 'done', rejected: 'rejected', offline: 'cancelled'
      }
      return map[status] || 'default'
    },
    getStatusText(status) {
      const map = {
        0: '草稿', 10: '已上线使用', 20: '待审核', 30: '已驳回', 40: '已下架',
        draft: '草稿', pending_review: '待审核', published: '已上线使用', rejected: '已驳回', offline: '已下架'
      }
      return map[status] || status
    },
    goToDetail(row) {
      // 数字应用详情演示数据（字段与4步骤申报表单一致）
      this.drawer.record = row.serviceType === '数字应用'
        ? { ...row, ...DIGITAL_APP_DETAIL_MOCK }
        : row
      this.drawer.activeTab = 'overview'
      this.drawer.appStepTab = 0
      this.drawer.visible = true
    },
    getAuditStatusKey(status) {
      const map = { '已通过': 'done', '已驳回': 'rejected', '审核中': 'processing', approved: 'done', rejected: 'rejected', pending: 'processing' }
      return map[status] || 'default'
    },
    getAuditStatusText(status) {
      const map = { '已通过': '已通过', '已驳回': '已驳回', '审核中': '审核中', approved: '已通过', rejected: '已驳回', pending: '待审核' }
      return map[status] || '未知'
    },
    // ===== 审核流水展开方法 =====
    onExpand(expanded, record) {
      this.expandedRowKeys = expanded ? [record.versionKey] : []
    },
    getPipelineStepStatus(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      return stepData ? stepData.statusKey : 'pending'
    },
    getPipelineStepClass(record, idx) {
      return `pipeline-step--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineDotClass(record, idx) {
      return `pipeline-step__dot--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineTagClass(record, idx) {
      return `pipeline-step__tag--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineTagText(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      return stepData ? stepData.statusText : '待审核'
    },
    getPipelineStepDetail(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      if (!stepData || !stepData.auditor) return null
      return stepData
    },
    getPipelineConnectorClass(record, idx) {
      return this.getPipelineStepStatus(record, idx) === 'done' ? 'pipeline-step__connector--done' : ''
    },
    getServiceTypeClass(type) {
      const map = { '数字应用': 'digital', '安全服务': 'security', '能力组件': 'component', '基础服务': 'basic' }
      return map[type] || 'default'
    },
    getServiceTypeIcon(type) {
      return SERVICE_TYPE_ICONS[type] || AppstoreOutlined
    },
    formatTime(time) {
      if (!time) return '--'
      const d = new Date(time)
      if (isNaN(d.getTime())) return time
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    generateOrderNo(seq) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
      const seqPart = String(seq + 1).padStart(4, '0')
      return `${datePart}${seqPart}`
    },
  }
}
</script>

<style scoped>
.my-apps-page {
  padding: 4px 0;
}

.my-apps-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-apps-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell-name__title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
}

.cell-name__id {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.service-type-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 3px;
  border: 1px solid;
  vertical-align: middle;
}

.service-type-tag--digital { color: #165DFF; background: #E8F3FF; border-color: rgba(22, 93, 255, 0.20); }
.service-type-tag--security { color: #F53F3F; background: #FFF0ED; border-color: rgba(245, 63, 63, 0.20); }
.service-type-tag--component { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--basic { color: #16A34A; background: rgba(22, 163, 74, 0.10); border-color: rgba(22, 163, 74, 0.20); }

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-text {
  font-size: 14px;
  color: #4E5969;
}


.delete-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0 8px;
}

.delete-modal__icon {
  font-size: 40px;
  color: #F59E0B;
}

.delete-modal__text {
  margin: 0;
  font-size: 14px;
  color: #4E5969;
  text-align: center;
}

/* Drawer 样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
}

.drawer-header-info {
  flex: 1;
  min-width: 0;
}

.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.drawer-header-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.drawer-header-sub__sep {
  color: #C9CDD4;
}

.info-section {
  margin-bottom: 18px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section__title {
  font-size: 13px;
  font-weight: 600;
  color: #4E5969;
  margin-bottom: 10px;
}

.muted {
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}


/* 评价评分概览 */
.overview-section {
  margin-bottom: 16px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 10px;
  line-height: 1.4;
}

/* 详情字段表格（与申报表单一致，固定列宽保证对齐） */
.detail-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
}

.detail-table td {
  border: 1px solid #E5E6EB;
  padding: 8px 12px;
  word-break: break-word;
  vertical-align: top;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.detail-table .label-cell {
  width: 170px;
  background: #F7F8FA;
  color: rgba(0, 0, 0, 0.45);
  font-weight: 500;
}

/* 详情描述表格：字段名过长时限宽换行，不撑破抽屉 */
.drawer-desc :deep(.ant-descriptions-item-label) {
  width: 170px;
  min-width: 170px;
  max-width: 220px;
  white-space: normal;
  word-break: break-word;
}

.drawer-desc :deep(.ant-descriptions-item-content) {
  white-space: normal;
  word-break: break-word;
}

/* 数字应用详情：极简二级导航（选中项小胶囊，其余纯文字） */
.detail-step-layout {
  margin-top: 4px;
}

.detail-step-sidenav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.detail-step-sidenav__item {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  padding: 4px 14px;
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.detail-step-sidenav__item:hover {
  color: #1677FF;
}

.detail-step-sidenav__item.is-active {
  color: #1677FF;
  background: rgba(22, 119, 255, 0.06);
  border-color: rgba(22, 119, 255, 0.35);
  font-weight: 600;
}

.detail-step-content {
  min-width: 0;
}

/* 应用覆盖范围分组（同新增表单样式） */
.coverage-box {
  padding: 8px 12px;
  border: 1px solid #E5E6EB;
  border-radius: 8px;
  margin-bottom: 8px;
}

.coverage-box:last-child {
  margin-bottom: 0;
}

.coverage-box__title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.coverage-box__value {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.overview-section__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.overview-section__head .overview-section__title {
  margin-bottom: 0;
}

.overview-section__count {
  font-size: 12px;
  color: #86909C;
}

.rating-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rating-overview__item {
  padding: 16px 20px;
  background: linear-gradient(135deg, #FFF7E6 0%, #FFFBF2 100%);
  border: 1px solid #FFE7BA;
  border-radius: 8px;
}

.rating-overview__label {
  font-size: 13px;
  color: #4E5969;
  margin-bottom: 8px;
}

.rating-overview__body {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.rating-overview__num {
  font-size: 28px;
  font-weight: 400;
  color: #FA8C16;
  line-height: 1;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
}

.rating-overview__unit {
  font-size: 13px;
  color: #86909C;
}

.rating-overview__stars {
  display: inline-flex;
  gap: 2px;
  margin-left: 8px;
}

.rating-overview__stars .star {
  color: #E5E6EB;
  font-size: 16px;
  line-height: 1;
}

.rating-overview__stars .star.full {
  color: #FAAD14;
}

/* 用户评价卡片 */
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-card {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #FAFBFC;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
}

.rating-card__body {
  flex: 1;
  min-width: 0;
}

.rating-card__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rating-card__org {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
}

.rating-card__dims {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin-bottom: 8px;
}

.rating-card__dim {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-card__dim-label {
  font-size: 11px;
  color: #8c8c8c;
}

.rating-card__dim-stars {
  display: inline-flex;
  gap: 1px;
}

.star-sm {
  font-size: 13px;
  color: #E5E6EB;
  line-height: 1;
}

.star-sm.full {
  color: #FAAD14;
}

.rating-card__dim-num {
  font-size: 11px;
  font-weight: 600;
  color: #FAAD14;
  min-width: 12px;
}

.rating-card__sep {
  color: #C9CDD4;
}

.rating-card__order {
  font-size: 13px;
  color: #86909C;
}

.rating-card__content {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.6;
  margin-bottom: 6px;
}

.rating-card__time {
  font-size: 12px;
  color: #C9CDD4;
}

.rating-card__reply {
  margin-top: 8px;
  padding: 6px 10px;
  border-left: 2px solid rgba(22, 93, 255, 0.4);
  font-size: 12px;
  color: #86909C;
  line-height: 1.5;
}

.rating-card__reply strong {
  color: #165DFF;
}

.rating-empty {
  padding: 40px 0;
  text-align: center;
  color: #C9CDD4;
  font-size: 13px;
}

/* 类型选择器 */
.type-selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.type-selector-card {
  padding: 20px;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.type-selector-card:hover {
  border-color: #165DFF;
  background: rgba(22, 93, 255, 0.04);
}

.type-selector-card__icon {
  font-size: 32px;
  color: #165DFF;
  margin-bottom: 10px;
}

.type-selector-card__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.type-selector-card__desc {
  font-size: 12px;
  color: #86909C;
}

/* 抽屉头部图标 */
.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: #fff;
}

.drawer-header-icon--digital { background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%); }
.drawer-header-icon--security { background: linear-gradient(135deg, #F53F3F 0%, #ff7a7a 100%); }
.drawer-header-icon--component { background: linear-gradient(135deg, #D97000 0%, #ffa940 100%); }
.drawer-header-icon--basic { background: linear-gradient(135deg, #16A34A 0%, #52c41a 100%); }
.drawer-header-icon--default { background: linear-gradient(135deg, #86909C 0%, #a0a4ab 100%); }

.drawer-header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-header-fallback {
  font-size: 28px;
  color: #fff;
}

.drawer-header-sub__sep {
  color: #C9CDD4;
  margin: 0 4px;
}

/* ===== 审核流水面板 ===== */
.audit-pipeline {
  display: flex;
  gap: 0;
  padding: 16px 20px;
  background: #FAFBFC;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
  overflow-x: auto;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 140px;
  position: relative;
  padding: 0 6px;
}

.pipeline-step__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s;
  color: #86909C;
  background: #FFFFFF;
  border: 1.5px solid #C9CDD4;
  z-index: 1;
}

.pipeline-step__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.pipeline-step__dot--processing {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.pipeline-step__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.pipeline-step__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border-color: #C9CDD4;
}

.pipeline-step__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  gap: 4px;
}

.pipeline-step__title {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.pipeline-step--processing .pipeline-step__title {
  font-weight: 600;
  color: #165DFF;
}

.pipeline-step__tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  margin: 2px 0;
}

.pipeline-step__tag--pending { background: #F2F3F5; color: #86909C; }
.pipeline-step__tag--processing { background: #E8F3FF; color: #165DFF; }
.pipeline-step__tag--done { background: #E9F9EF; color: #16A34A; }
.pipeline-step__tag--rejected { background: #FFEDEC; color: #EF4444; }

.pipeline-step__detail {
  background: #F2F3F5;
  border-radius: 6px;
  padding: 10px 12px;
  max-width: 200px;
  margin-top: 4px;
}

.pipeline-step__opinion {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pipeline-step__meta {
  margin-top: 6px;
  text-align: center;
  line-height: 1.6;
}

.pipeline-step__auditor,
.pipeline-step__audit-time {
  font-size: 12px;
  color: #86909C;
  white-space: nowrap;
}

.pipeline-step__connector {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #E5E6EB;
  z-index: 0;
}

.pipeline-step__connector--done {
  background: #16A34A;
}

</style>

<style>
/* 附件链接：蓝色可点击下载（unscoped，FileLinks 为独立组件，scoped 选择器作用不到） */
.file-links .file-link,
.file-link {
  color: #1677FF;
  cursor: pointer;
  word-break: break-all;
}

.file-link:hover {
  text-decoration: underline;
}

/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child,
.ant-drawer .ant-descriptions,
.ant-drawer .ant-descriptions-bordered,
.ant-drawer .ant-descriptions-view,
.ant-drawer .ant-descriptions-view table,
.ant-drawer .ant-descriptions-row,
.ant-drawer .ant-descriptions-row > td,
.ant-drawer .ant-descriptions-row > th,
.ant-drawer .ant-descriptions-item-container,
.ant-drawer .ant-descriptions-item-label,
.ant-drawer .ant-descriptions-item-content {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.ant-drawer .ant-descriptions-item-label {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}

.ant-drawer .ant-descriptions-item-content {
  width: auto;
}

/* MVP 详情抽屉描述列表：表头/表体与 a-table 规范统一 */
.mvp-detail-tabs .ant-descriptions-item-label {
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-tabs-nav {
  margin-bottom: 16px;
}

.mvp-detail-tabs .ant-tabs-tab {
  padding: 8px 0;
}
</style>
