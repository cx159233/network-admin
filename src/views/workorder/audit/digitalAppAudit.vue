﻿﻿﻿﻿<template>
  <div class="digital-app-audit-page">
    <PageHeader
      title="数字应用审核"
      description="审核机构提交的数字应用上架申请，支持按应用名称、服务对象和审核状态筛选"
    />

    <CloudCard class="digital-app-audit-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-range-picker v-model:value="filter.submitTimeRange" :placeholder="['提交时间', '提交时间']" allow-clear style="width: 240px" value-format="YYYY-MM-DD" />
        <a-select v-model:value="filter.status" placeholder="审核状态" allow-clear style="width: 130px">
          <a-select-option value="10">待审核</a-select-option>
          <a-select-option value="20">已通过</a-select-option>
          <a-select-option value="30">已拒绝</a-select-option>
        </a-select>
        <a-select v-model:value="filter.step" placeholder="审核阶段" allow-clear style="width: 150px">
          <a-select-option :value="1">申报材料评估</a-select-option>
          <a-select-option :value="2">应用技术测评</a-select-option>
          <a-select-option :value="3">现场演示答辩</a-select-option>
          <a-select-option :value="4">评估结果公示</a-select-option>
        </a-select>
        <a-input v-model:value="filter.title" placeholder="数字应用名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="数字应用ID" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceProvider" placeholder="服务商名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="digital-app-audit-page__divider"></div>

      <div class="digital-app-audit-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          :scroll="{ x: 'max-content' }"
          row-key="submissionId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'title'" class="cell-name">
              <span class="cell-name__title">{{ record.title || '--' }}</span>
              <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'auditStatus'">
              <StatusDot :type="getAuditStatusKey(record.auditStatus)" :text="getAuditStatusText(record.auditStatus)" />
            </template>
            <span v-else-if="column.dataIndex === 'submitTime'" class="cell-default">{{ record.submitTime || '--' }}</span>
         
            <span v-else-if="column.dataIndex === 'currentStep'" class="cell-default">{{ getStepName(record.currentStep) }}</span>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="String(record.auditStatus) === '10'" type="link" size="small" class="!p-0" @click="startAudit(record)">审核</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="viewDetails(record)">详情</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
      v-model:open="drawer.visible"
      title="审核详情"
      :width="1100"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="drawer-header-logo" alt="" />
            <RobotOutlined v-else class="drawer-header-fallback" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.title }}</span>
              <StatusDot :type="getAuditStatusKey(drawer.record.auditStatus)" :text="getAuditStatusText(drawer.record.auditStatus)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.serviceId || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="drawer-split">
          <!-- 左侧：申报信息（按4步骤申报表单结构展示） -->
          <div class="drawer-split__left">
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

          <!-- 分割线 -->
          <div class="drawer-split__divider"></div>

          <!-- 右侧：审核进度 -->
          <div class="drawer-split__right">
            <div class="split-section">
              <div class="split-section__title">审核操作</div>

              <!-- 纵向步骤列表 -->
              <div class="step-list">
                <div
                  v-for="(step, idx) in auditSteps"
                  :key="step.key"
                  class="step-node"
                  :class="{
                    'step-node--done': isStepApproved(idx),
                    'step-node--rejected': isStepRejected(idx),
                    'step-node--active': isStepCurrent(idx)
                  }"
                >
                  <div class="step-node__indicator">
                    <div class="step-node__dot" :class="getStepIndexClass(idx)">
                      <CheckOutlined v-if="isStepApproved(idx)" />
                      <CloseOutlined v-else-if="isStepRejected(idx)" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <div v-if="idx < auditSteps.length - 1" class="step-node__line" :class="isStepApproved(idx) ? 'step-node__line--done' : ''"></div>
                  </div>

                  <div class="step-node__body">
                    <div class="step-node__header">
                      <span class="step-node__title">阶段 {{ idx + 1 }}：{{ step.title }}</span>
                      <span class="step-node__tag" :class="getStepTagClass(idx)">{{ getStepTagText(idx) }}</span>
                    </div>

                    <!-- 当前阶段 + 待审核：操作区 -->
                    <div v-if="isStepCurrent(idx) && isAuditing" class="step-node__action">
                      <div class="audit-textarea-wrap">
                        <a-textarea v-model:value="auditForm.opinion" :rows="3" :maxlength="200" placeholder="请输入审核意见" />
                        <span class="audit-textarea-count">{{ auditForm.opinion.length }}/200</span>
                      </div>
                      <div class="step-node__btns">
                        <a-button type="primary" size="small" @click="approve">
                          <template #icon><CheckOutlined /></template>
                          {{ getApproveText(idx) }}
                        </a-button>
                        <a-button size="small" @click="reject">驳回</a-button>
                      </div>
                    </div>

                    <!-- 已完成/已驳回：审核记录 -->
                    <div v-else-if="getStepRecord(idx)" class="step-node__record">
                      <div v-if="getStepRecord(idx).opinion" class="step-node__opinion">{{ getStepRecord(idx).opinion }}</div>
                      <div class="step-node__meta">
                        <span>{{ getStepRecord(idx).auditor }}</span>
                        <span>{{ formatTime(getStepRecord(idx).auditTime) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'
import AuditResultCard from './components/AuditResultCard.vue'
import PendingTip from './components/PendingTip.vue'
import AuditActionBox from './components/AuditActionBox.vue'
import {
  CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined, RobotOutlined,
  FileTextOutlined, PaperClipOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { h } from 'vue'

const FileLinks = {
  name: 'FileLinks',
  props: { files: { type: [Array, String], default: null } },
  setup(props) {
    return () => {
      const arr = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : [])
      if (!arr.length) return h('span', '--')
      return h('span', { class: 'file-links' },
        arr.reduce((acc, f, i) => {
          if (i > 0) acc.push('、')
          acc.push(h('a', { class: 'file-link', onClick: () => { message.info(`演示环境：《${f}》下载暂不可用`) } }, f))
          return acc
        }, []))
    }
  }
}

// 数字应用申报信息演示数据（字段与新增数字应用申报4步骤表单保持一致）
const APP_FORM_MOCK = {
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
  name: 'DigitalAppAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    AuditResultCard, PendingTip, AuditActionBox,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined, RobotOutlined,
    FileTextOutlined, PaperClipOutlined, FileLinks
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { title: '', serviceId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] },
      applied: { title: '', serviceId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] },
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 110 },
        { title: '审核阶段', dataIndex: 'currentStep', key: 'currentStep', width: 140 },
        { title: '数字应用名称/ID', dataIndex: 'title', key: 'title', width: 240 },
        { title: '服务对象', dataIndex: 'targetObjectStr', key: 'targetObjectStr', width: 130 },
        { title: '应用覆盖范围', dataIndex: 'appScope', key: 'appScope', width: 200 },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', ellipsis: true, width: 150 },
        { title: '合作企业', dataIndex: 'cooperativeEnterprise', key: 'cooperativeEnterprise', ellipsis: true, width: 150 },
        { title: '部署云服务商', dataIndex: 'cloudProviderStr', key: 'cloudProviderStr', width: 120 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      // 每条 = 一次提交工单，版本号只是展示字段
      appList: [
        { submissionId: 'SZYY202410220001-V1', serviceGroup: 'GRP_SYNC', serviceId: 'SZYY202410220001', title: '同步远方医疗服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '全国', description: '提供远程会诊、远程教学、远程培训等多种远程医疗服务模式。', auditStatus: 30, currentStep: 3, cloudProviderStr: '影像云', serviceProvider: '影像云科技有限公司', cooperativeEnterprise: '中科软科技、华为技术', submitTime: '2026-02-10 09:05' },
        { submissionId: 'SZYY202410220001-V2', serviceGroup: 'GRP_SYNC', serviceId: 'SZYY202410220001', title: '同步远方医疗服务', versionNo: 2, targetObjectStr: '公立医院', appScope: '全国', description: '提供远程会诊、远程教学、远程培训等多种远程医疗服务模式。', auditStatus: 10, currentStep: 2, cloudProviderStr: '影像云', serviceProvider: '影像云科技有限公司', cooperativeEnterprise: '中科软科技、华为技术', submitTime: '2026-05-15 14:20' },
        { submissionId: 'SZYY202410230001-V1', serviceGroup: 'GRP_ZHYL', serviceId: 'SZYY202410230001', title: '智慧住院服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '省级', description: '涵盖住院流程管理、床位管理、费用结算等全流程住院服务。', auditStatus: 10, currentStep: 2, cloudProviderStr: '电信云', serviceProvider: '东软集团', cooperativeEnterprise: '中科软科技、浪潮', submitTime: '2026-10-23 09:15:32' },
        { submissionId: 'SZYY202410240001-V1', serviceGroup: 'GRP_YLTC', serviceId: 'SZYY202410240001', title: '久远康嘉医联体一体化服务', versionNo: 1, targetObjectStr: '基层医疗卫生机构', appScope: '省级', description: '实现医联体内部诊疗协同、检查检验互认、双向转诊等服务。', auditStatus: 20, currentStep: 4, cloudProviderStr: '移动云', serviceProvider: '久远康嘉医疗科技有限公司', cooperativeEnterprise: '华为技术、阿里云', submitTime: '2026-10-24 14:59:25' },
        { submissionId: 'SZYY202410240002-V1', serviceGroup: 'GRP_ZYFZ', serviceId: 'SZYY202410240002', title: '中医智能辅助服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '全国', description: '基于中医药知识库，提供智能辨证、方剂推荐、针灸穴位定位等辅助服务。', auditStatus: 20, currentStep: 4, cloudProviderStr: '联通云', serviceProvider: '九州通医药集团', cooperativeEnterprise: '科大讯飞', submitTime: '2026-10-24 15:00:03' },
        { submissionId: 'SZYY202410240003-V1', serviceGroup: 'GRP_MBGL', serviceId: 'SZYY202410240003', title: '智慧慢病管理一体化服务', versionNo: 1, targetObjectStr: '基层医疗卫生机构', appScope: '市级', description: '面向高血压、糖尿病等慢性病患者，提供全周期健康管理服务。', auditStatus: 30, currentStep: 3, cloudProviderStr: '浪潮云', serviceProvider: '万达信息', cooperativeEnterprise: '腾讯医疗、丁香园', submitTime: '2026-10-24 15:00:21' },
        { submissionId: 'SZYY202410240004-V1', serviceGroup: 'GRP_JZJJ', serviceId: 'SZYY202410240004', title: '急诊急救指挥调度服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '市级', description: '为急诊、急救场景提供资源调度、路线规划、多方协同指挥等功能。', auditStatus: 10, currentStep: 1, cloudProviderStr: '电信云', serviceProvider: '卫宁健康', cooperativeEnterprise: '华为技术', submitTime: '2026-10-24 15:00:40' },
        { submissionId: 'SZYY202410240005-V1', serviceGroup: 'GRP_ZHGL', serviceId: 'SZYY202410240005', title: '智慧医疗综合管理服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '省级', description: '面向医疗机构的综合管理平台，涵盖运营、质控、人力等多维度管理。', auditStatus: 20, currentStep: 4, cloudProviderStr: '移动云', serviceProvider: '东华软件', cooperativeEnterprise: 'IBM、Oracle', submitTime: '2026-03-10 08:00:00' },
        { submissionId: 'SZYY202410240005-V2', serviceGroup: 'GRP_ZHGL', serviceId: 'SZYY202410240005', title: '智慧医疗综合管理服务', versionNo: 2, targetObjectStr: '公立医院', appScope: '省级', description: '面向医疗机构的综合管理平台，涵盖运营、质控、人力等多维度管理。', auditStatus: 10, currentStep: 1, cloudProviderStr: '移动云', serviceProvider: '东华软件', cooperativeEnterprise: 'IBM、Oracle', submitTime: '2026-06-01 09:30:00' }
      ],
      drawer: { visible: false, record: null, appStepTab: 0 },
      auditForm: { opinion: '' },
      activeStepIdx: 0,
      appStepOptions: [
        { label: '企业基本情况', value: 0 },
        { label: '应用服务功能情况', value: 1 },
        { label: '产品或服务的基本情况', value: 2 },
        { label: '相关附件', value: 3 }
      ],
      appDetailMock: {
        logo: 'https://img.alicdn.com/imgextra/i3/O1CN01Wr5Kxq1NqSGZXMKBf_!!6000000001620-2-tps-120-120.png'
      },
      // 每个提交的审核步骤数据（key: submissionId → stageKey → stage data）
      submissionAuditData: {
        // 同步远方医疗服务 V1 — 被驳回于步骤3
        'SZYY202410220001-V1': {
          1: {
            id: 'v1s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-03-18 15:30',
            _records: [
              { id: 1, nodeType: 'submit', submitTime: '2026-02-10 09:05', remark: '机构提交申报材料' },
              { id: 2, nodeType: 'audit', status: 'rejected', auditTime: '2026-02-12 11:20', auditor: '李主管', opinion: '安全报告缺少数据加密章节，请补充后重新提交' },
              { id: 3, nodeType: 'submit', submitTime: '2026-02-20 14:30', remark: '机构补齐安全报告并重新提交' },
              { id: 4, nodeType: 'audit', status: 'approved', auditTime: '2026-03-18 15:30', auditor: '李主管', opinion: '材料完整、信息有效，本阶段通过' }
            ]
          },
          2: {
            id: 'v1s2', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '王工程师', auditTime: '2026-03-21 14:00',
            _records: [
              { id: 5, nodeType: 'submit', submitTime: '2026-03-19 10:00', remark: '材料评估通过后自动进入技术测评' },
              { id: 6, nodeType: 'audit', status: 'approved', auditTime: '2026-03-21 14:00', auditor: '王工程师', opinion: '功能完整性、性能指标、安全合规均达到标准，技术测评通过' }
            ]
          },
          3: {
            id: 'v1s3', status: 'rejected', statusKey: 'rejected', statusText: '已驳回',
            auditor: '张主任', auditTime: '2026-03-25 17:30',
            _records: [
              { id: 7, nodeType: 'submit', submitTime: '2026-03-22 09:00', remark: '技术测评通过，预约现场演示' },
              { id: 8, nodeType: 'audit', status: 'rejected', auditTime: '2026-03-25 17:30', auditor: '张主任', opinion: '核心功能演示不完整，缺少数据同步演示环节' }
            ]
          },
          4: { id: 'v1s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 同步远方医疗服务 V2 — 待审核，当前在步骤2
        'SZYY202410220001-V2': {
          1: {
            id: 'v2s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-05-20 10:00',
            _records: [
              { id: 21, nodeType: 'submit', submitTime: '2026-05-15 14:20', remark: '机构修改后重新提交申报材料' },
              { id: 22, nodeType: 'audit', status: 'approved', auditTime: '2026-05-20 10:00', auditor: '李主管', opinion: '修改后的材料完整合规，本阶段通过' }
            ]
          },
          2: {
            id: 'v2s2', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 23, nodeType: 'submit', submitTime: '2026-05-21 09:00', remark: '材料评估通过，进入技术测评' }
            ]
          },
          3: { id: 'v2s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'v2s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 智慧住院服务 V1
        'SZYY202410230001-V1': {
          1: {
            id: 's3s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-10-25 10:00',
            _records: [
              { id: 51, nodeType: 'submit', submitTime: '2026-10-23 09:15', remark: '机构提交申报材料' },
              { id: 52, nodeType: 'audit', status: 'approved', auditTime: '2026-10-25 10:00', auditor: '李主管', opinion: '材料完整合规，通过评估' }
            ]
          },
          2: {
            id: 's3s2', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 53, nodeType: 'submit', submitTime: '2026-10-26 09:00', remark: '材料通过，进入技术测评' }
            ]
          },
          3: { id: 's3s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's3s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 久远康嘉医联体一体化服务 V1 — 已通过
        'SZYY202410240001-V1': {
          1: { id: 's4s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主管', auditTime: '2026-11-01 10:00', _records: [{ id: 61, nodeType: 'submit', submitTime: '2026-10-24 14:59', remark: '机构提交申报材料' }, { id: 62, nodeType: 'audit', status: 'approved', auditTime: '2026-11-01 10:00', auditor: '刘主管', opinion: '材料完整合规' }] },
          2: { id: 's4s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈工程师', auditTime: '2026-11-05 14:00', _records: [{ id: 63, nodeType: 'submit', submitTime: '2026-11-02 09:00', remark: '进入技术测评' }, { id: 64, nodeType: 'audit', status: 'approved', auditTime: '2026-11-05 14:00', auditor: '陈工程师', opinion: '架构合理、性能达标' }] },
          3: { id: 's4s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '周主任', auditTime: '2026-11-10 16:00', _records: [{ id: 65, nodeType: 'submit', submitTime: '2026-11-06 10:00', remark: '预约现场答辩' }, { id: 66, nodeType: 'audit', status: 'approved', auditTime: '2026-11-10 16:00', auditor: '周主任', opinion: '演示完整、答辩通过' }] },
          4: { id: 's4s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-11-15 09:00', _records: [{ id: 67, nodeType: 'submit', submitTime: '2026-11-11 14:00', remark: '提交发布申请' }, { id: 68, nodeType: 'audit', status: 'approved', auditTime: '2026-11-15 09:00', auditor: '赵管理员', opinion: '发布至服务目录' }] }
        },
        // 中医智能辅助服务 V1 — 已通过
        'SZYY202410240002-V1': {
          1: { id: 's5s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主管', auditTime: '2026-11-02 09:00', _records: [{ id: 71, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }, { id: 72, nodeType: 'audit', status: 'approved', auditTime: '2026-11-02 09:00', auditor: '刘主管', opinion: '材料齐全' }] },
          2: { id: 's5s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-06 11:00', _records: [{ id: 73, nodeType: 'submit', submitTime: '2026-11-03 09:00', remark: '进入技术测评' }, { id: 74, nodeType: 'audit', status: 'approved', auditTime: '2026-11-06 11:00', auditor: '王工程师', opinion: '技术测评通过' }] },
          3: { id: 's5s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-11-12 15:00', _records: [{ id: 75, nodeType: 'submit', submitTime: '2026-11-07 10:00', remark: '预约答辩' }, { id: 76, nodeType: 'audit', status: 'approved', auditTime: '2026-11-12 15:00', auditor: '张主任', opinion: '答辩通过' }] },
          4: { id: 's5s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-11-16 10:00', _records: [{ id: 77, nodeType: 'submit', submitTime: '2026-11-13 14:00', remark: '发布申请' }, { id: 78, nodeType: 'audit', status: 'approved', auditTime: '2026-11-16 10:00', auditor: '赵管理员', opinion: '已发布' }] }
        },
        // 智慧慢病管理一体化服务 V1 — 被驳回于步骤3
        'SZYY202410240003-V1': {
          1: { id: 's6s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-11-03 10:00', _records: [{ id: 81, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }, { id: 82, nodeType: 'audit', status: 'approved', auditTime: '2026-11-03 10:00', auditor: '李主管', opinion: '材料完整' }] },
          2: { id: 's6s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-07 14:00', _records: [{ id: 83, nodeType: 'submit', submitTime: '2026-11-04 09:00', remark: '进入技术测评' }, { id: 84, nodeType: 'audit', status: 'approved', auditTime: '2026-11-07 14:00', auditor: '王工程师', opinion: '技术测试通过' }] },
          3: { id: 's6s3', status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-11-14 16:00', _records: [{ id: 85, nodeType: 'submit', submitTime: '2026-11-08 10:00', remark: '预约答辩' }, { id: 86, nodeType: 'audit', status: 'rejected', auditTime: '2026-11-14 16:00', auditor: '张主任', opinion: '慢病管理闭环流程不完整，缺少患者随访跟踪环节' }] },
          4: { id: 's6s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 急诊急救指挥调度服务 V1 — 待审核，步骤1
        'SZYY202410240004-V1': {
          1: {
            id: 's7s1', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 91, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }
            ]
          },
          2: { id: 's7s2', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's7s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's7s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 智慧医疗综合管理服务 V1 — 已通过
        'SZYY202410240005-V1': {
          1: { id: 's8s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-03-15 14:00', _records: [{ id: 101, nodeType: 'submit', submitTime: '2026-03-10 08:00', remark: '机构提交申报材料' }, { id: 102, nodeType: 'audit', status: 'approved', auditTime: '2026-03-15 14:00', auditor: '李主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 's8s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-03-20 10:00', _records: [{ id: 103, nodeType: 'submit', submitTime: '2026-03-16 09:00', remark: '进入技术测评' }, { id: 104, nodeType: 'audit', status: 'approved', auditTime: '2026-03-20 10:00', auditor: '王工程师', opinion: '技术架构合理，性能达标' }] },
          3: { id: 's8s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-03-28 15:00', _records: [{ id: 105, nodeType: 'submit', submitTime: '2026-03-21 10:00', remark: '预约答辩' }, { id: 106, nodeType: 'audit', status: 'approved', auditTime: '2026-03-28 15:00', auditor: '张主任', opinion: '演示流畅，功能完备' }] },
          4: { id: 's8s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-04-02 09:00', _records: [{ id: 107, nodeType: 'submit', submitTime: '2026-03-29 14:00', remark: '提交发布申请' }, { id: 108, nodeType: 'audit', status: 'approved', auditTime: '2026-04-02 09:00', auditor: '赵管理员', opinion: '已发布至数字应用目录' }] }
        },
        // 智慧医疗综合管理服务 V2 — 待审核，步骤1
        'SZYY202410240005-V2': {
          1: {
            id: 's9s1', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 111, nodeType: 'submit', submitTime: '2026-06-01 09:30', remark: '机构修改应用架构后重新提交V2' }
            ]
          },
          2: { id: 's9s2', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's9s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's9s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        }
      },
      auditSteps: [
        { key: 1, title: '申报材料评估' },
        { key: 2, title: '应用技术测评' },
        { key: 3, title: '现场演示答辩' },
        { key: 4, title: '评估结果公示' }
      ]
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    isAuditing() {
      return this.drawer.record && String(this.drawer.record.auditStatus) === '10'
    },
    hasCoverage() {
      const r = this.drawer.record
      if (!r) return false
      return !!(r.coverBase?.length || r.coverPublic?.length || r.coverTech?.length)
    },
    filteredData() {
      const f = this.applied
      const list = this.appList.filter(item => {
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return false
        if (f.submitTimeRange && f.submitTimeRange.length === 2) {
          const itemDate = (item.submitTime || '').slice(0, 10)
          if (itemDate < f.submitTimeRange[0] || itemDate > f.submitTimeRange[1]) return false
        }
        if (f.status && String(item.auditStatus) !== String(f.status)) return false
        if (f.step && Number(item.currentStep) !== Number(f.step)) return false
        return true
      })
      list.sort((a, b) => {
        const aPending = String(a.auditStatus) === '10' ? 0 : 1
        const bPending = String(b.auditStatus) === '10' ? 0 : 1
        if (aPending !== bPending) return aPending - bPending
        return a.submitTime < b.submitTime ? 1 : -1
      })
      return list.map(i => ({ key: i.submissionId, ...i }))
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
    },
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { title: '', serviceId: '', serviceProvider: '', appScope: undefined, targetObjectStr: undefined, status: undefined, step: undefined, submitTimeRange: [] }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    getAuditStatusKey(status) {
      const map = { 10: 'processing', 20: 'done', 30: 'rejected' }
      return map[String(status)] || 'default'
    },
    getAuditStatusText(status) {
      const map = { 10: '待审核', 20: '已通过', 30: '已拒绝' }
      return map[String(status)] || ''
    },
    getStepName(step) {
      const names = { 1: '申报材料评估', 2: '应用技术测评', 3: '现场演示答辩', 4: '评估结果公示' }
      return names[step] || '--'
    },
    // ===== 步骤条相关方法（基于record.currentStep判断） =====
    // 当前应用的审核进度：currentStep 表示正在进行的阶段（1~4）
    isStepApproved(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 整体已通过：所有步骤都已完成
      if (status === '20') return true
      // 整体已拒绝：驳回步骤之前的算已通过
      if (status === '30') return idx < cur - 1
      // 待审核：当前步骤之前的算已通过
      return idx < cur - 1
    },
    isStepRejected(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 整体已拒绝：当前步骤为驳回步骤
      return status === '30' && idx === cur - 1
    },
    isStepCurrent(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 待审核状态：当前步骤为进行中
      return status === '10' && idx === cur - 1
    },
    // 获取该步骤的审核记录（从当前提交的审核数据中查找）
    getStepRecord(idx) {
      const record = this.drawer.record
      if (!record || !record.submissionId) return null
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return null
      const stageData = subData[this.auditSteps[idx].key]
      if (!stageData || !stageData._records || stageData._records.length === 0) return null
      const auditRecords = stageData._records.filter(r => r.nodeType === 'audit')
      if (auditRecords.length === 0) return null
      const last = auditRecords[auditRecords.length - 1]
      return {
        status: last.status,
        auditor: last.auditor,
        auditTime: last.auditTime,
        opinion: last.opinion,
        submitTime: last.submitTime
      }
    },
    getPriorSteps(currentIdx) {
      const prior = []
      for (let i = 0; i < currentIdx; i++) {
        const rec = this.getStepRecord(i)
        if (rec && rec.opinion) {
          prior.push({ idx: i, ...rec })
        }
      }
      return prior
    },
    getStepTabClass(idx) {
      const classes = []
      if (idx === this.activeStepIdx) classes.push('step-tab--active')
      if (this.isStepApproved(idx)) classes.push('step-tab--done')
      if (this.isStepRejected(idx)) classes.push('step-tab--rejected')
      return classes
    },
    getStepIndexClass(idx) {
      if (this.isStepApproved(idx)) return 'step-node__dot--done'
      if (this.isStepRejected(idx)) return 'step-node__dot--rejected'
      if (this.isStepCurrent(idx)) return 'step-node__dot--active'
      return 'step-node__dot--pending'
    },
    getStepTagClass(idx) {
      if (this.isStepApproved(idx)) return 'step-node__tag--done'
      if (this.isStepRejected(idx)) return 'step-node__tag--rejected'
      if (this.isStepCurrent(idx)) return 'step-node__tag--active'
      return 'step-node__tag--pending'
    },
    getStepTagText(idx) {
      if (this.isStepApproved(idx)) return '已通过'
      if (this.isStepRejected(idx)) return '已驳回'
      if (this.isStepCurrent(idx)) return '审核中'
      return '待审核'
    },
    getStepCardClass(idx) {
      if (this.isStepApproved(idx)) return 'done'
      if (this.isStepRejected(idx)) return 'rejected'
      if (this.isStepCurrent(idx)) return 'processing'
      return 'wait'
    },
    getAttachmentsForStep(idx) {
      return []
    },
    formatTime(time) {
      if (!time) return '--'
      if (/\d{2}:\d{2}:\d{2}/.test(time)) return time
      return time + ':00'
    },
    formatArray(arr) {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return '--'
      return arr.join('、')
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
    getCurrentStepNumber() {
      return this.drawer.record ? (this.drawer.record.currentStep || 1) : 1
    },
    getCurrentStepStatusClass() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return ''
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return ''
      const cur = record.currentStep || 1
      const stage = subData[cur]
      if (!stage) return ''
      return stage.status === 'rejected' ? 'rejected' : 'done'
    },
    getCurrentStepRecord() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return null
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return null
      const cur = record.currentStep || 1
      const stage = subData[cur]
      if (!stage) return null
      return {
        auditor: stage.auditor || '',
        auditTime: stage.auditTime || '',
        opinion: (stage._records || []).filter(r => r.nodeType === 'audit').slice(-1)[0]?.opinion || ''
      }
    },
    getHistorySteps() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return []
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return []
      const cur = record.currentStep || 1
      const history = []
      for (let i = 0; i < cur - 1; i++) {
        const stage = subData[this.auditSteps[i].key]
        if (stage && (stage.status === 'approved' || stage.status === 'rejected')) {
          const lastAudit = (stage._records || []).filter(r => r.nodeType === 'audit').slice(-1)[0]
          history.push({
            idx: i,
            status: stage.status === 'rejected' ? 'rejected' : 'done',
            auditor: stage.auditor || '',
            auditTime: stage.auditTime || '',
            opinion: lastAudit ? lastAudit.opinion : ''
          })
        }
      }
      return history
    },
    getApproveText(idx) {
      const texts = [
        '通过材料评估，进入技术测评',
        '通过技术测评，进入现场答辩',
        '通过答辩评审，进入发布环节',
        '确认发布至服务目录'
      ]
      return texts[idx] || '审核通过'
    },
    // ===== 抽屉操作 =====
    startAudit(app) {
      this.openDrawer(app)
    },
    viewDetails(app) {
      this.openDrawer(app)
    },
    openDrawer(app) {
      this.drawer.record = {
        ...APP_FORM_MOCK,
        ...this.appDetailMock,
        submissionId: app.submissionId,
        title: app.title,
        serviceId: app.serviceId,
        submitTime: app.submitTime,
        auditStatus: app.auditStatus,
        currentStep: app.currentStep || 1
      }
      this.auditForm.opinion = ''
      this.activeStepIdx = (app.currentStep || 1) - 1
      this.drawer.appStepTab = 0
      this.drawer.visible = true
    },
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('审核意见为空：请填写审核意见')
        return
      }
      const isLastStage = this.activeStepIdx === this.auditSteps.length - 1
      const stepName = this.auditSteps[this.activeStepIdx]?.title || ''
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: isLastStage
          ? `当前为第 ${this.activeStepIdx + 1} 阶段（${stepName}），通过后将完成全部审核流程，确定通过吗？`
          : `通过后将从「${stepName}」进入下一阶段，确定通过吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: async () => {
          try {
            // TODO 实际接口调用：await api.approve({ id, step: activeStepIdx + 1, opinion })
            this.recordApproveLog()
            message.success('审核通过')
            this.drawer.visible = false
            this.fetchList()
          } catch (e) {
            message.error('网络异常，请稍后再试')
          }
        }
      })
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('审核意见为空：请填写审核意见')
        return
      }
      const stepName = this.auditSteps[this.activeStepIdx]?.title || ''
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认驳回',
        content: `驳回后当前阶段（${stepName}）状态将变更为"已驳回"并终止审核流程，确定驳回吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            // TODO 实际接口调用：await api.reject({ id, step: activeStepIdx + 1, opinion })
            this.recordRejectLog()
            message.success('驳回成功')
            this.drawer.visible = false
            this.fetchList()
          } catch (e) {
            message.error('网络异常，请稍后再试')
          }
        }
      })
    },
    // 记录审核通过流水
    recordApproveLog() {
      const record = this.drawer.record
      if (!record) return
      const idx = this.activeStepIdx
      if (!record.auditFlow) record.auditFlow = {}
      record.auditFlow[`step${idx + 1}`] = {
        status: 'approved',
        opinion: this.auditForm.opinion,
        auditor: '当前审核人',
        auditTime: this.formatTime(new Date())
      }
      // 阶段1/2/3 通过则进入下一阶段；阶段4 通过则完成
      if (idx < this.auditSteps.length - 1) {
        record.currentStep = (record.currentStep || 1) + 1
      } else {
        record.auditStatus = '审核通过'
        record.currentStep = this.auditSteps.length
      }
      this.auditForm.opinion = ''
    },
    // 记录驳回流水
    recordRejectLog() {
      const record = this.drawer.record
      if (!record) return
      const idx = this.activeStepIdx
      if (!record.auditFlow) record.auditFlow = {}
      record.auditFlow[`step${idx + 1}`] = {
        status: 'rejected',
        opinion: this.auditForm.opinion,
        auditor: '当前审核人',
        auditTime: this.formatTime(new Date())
      }
      // 任意阶段驳回都终止流程
      record.auditStatus = '审核驳回'
      this.auditForm.opinion = ''
    },
  }
}
</script>

<style scoped>
.digital-app-audit-page {
  padding: 4px 0;
}

.digital-app-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.digital-app-audit-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
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

/* ===== 抽屉头部 ===== */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  border-bottom: 1px solid #F2F3F5;
  margin-bottom: 20px;
}

.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.drawer-header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.drawer-header-fallback {
  font-size: 28px;
  color: #fff;
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

/* ===== 左右分栏 ===== */
.drawer-split {
  display: flex;
  gap: 0;
  min-height: 0;
}

.drawer-split__left {
  flex: 3;
  min-width: 0;
  padding-right: 24px;
  overflow-y: auto;
}

.drawer-split__divider {
  width: 1px;
  background: #E5E6EB;
  flex-shrink: 0;
  align-self: stretch;
}

.drawer-split__right {
  flex: 2;
  min-width: 0;
  padding-left: 24px;
  overflow-y: auto;
}

/* ===== 分区区块 ===== */
.split-section {
  margin-bottom: 20px;
}

.split-section:last-child {
  margin-bottom: 0;
}

.split-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

/* ===== 申报信息：极简二级导航（选中项小胶囊，其余纯文字） ===== */
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

/* ===== 申报信息分区 ===== */
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

/* ===== 纵向步骤列表 ===== */
.step-list {
  display: flex;
  flex-direction: column;
}

.step-node {
  display: flex;
  gap: 12px;
}

.step-node__indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.step-node__dot {
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
}

.step-node__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border-color: #C9CDD4;
}

.step-node__dot--active {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.step-node__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.step-node__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.step-node__line {
  width: 2px;
  flex: 1;
  min-height: 16px;
  background: #E5E6EB;
  margin: 4px 0;
}

.step-node__line--done {
  background: #16A34A;
}

.step-node__body {
  flex: 1;
  min-width: 0;
  padding-bottom: 20px;
}

.step-node__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.step-node__header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.step-node__title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.step-node--active .step-node__title {
  font-weight: 600;
  color: #165DFF;
}

.step-node__tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  flex-shrink: 0;
}

.step-node__tag--pending {
  background: #F2F3F5;
  color: #86909C;
}

.step-node__tag--active {
  background: #E8F3FF;
  color: #165DFF;
}

.step-node__tag--done {
  background: #E9F9EF;
  color: #16A34A;
}

.step-node__tag--rejected {
  background: #FFEDEC;
  color: #EF4444;
}

.step-node__action {
  background: #F2F7FF;
  border: 1px solid #D6E4FF;
  border-radius: 6px;
  padding: 12px;
}

.audit-textarea-wrap {
  position: relative;
  margin-bottom: 10px;
}

.audit-textarea-count {
  position: absolute;
  right: 8px;
  bottom: 4px;
  font-size: 12px;
  color: #C9CDD4;
  pointer-events: none;
}

.step-node__btns {
  display: flex;
  gap: 8px;
}

.step-node__record {
  background: #F2F3F5;
  border-radius: 6px;
  padding: 10px 12px;
}

.step-node__opinion {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.step-node__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 12px;
  color: #86909C;
}
</style>

<style>
/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
}

/* 附件链接（FileLinks 为独立组件，scoped 不生效，需全局样式） */
.file-links {
  word-break: break-all;
}

.file-link {
  color: #1677FF;
  cursor: pointer;
  word-break: break-all;
}

.file-link:hover {
  text-decoration: underline;
}
</style>