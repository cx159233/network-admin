export function listLangOptions() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { value: 'zh_CN', label: '简体中文' },
      { value: 'zh_TW', label: '繁体中文' },
      { value: 'en_US', label: 'English' },
      { value: 'ja_JP', label: '日本語' },
      { value: 'ko_KR', label: '한국어' }
    ]
  })
}

export function listI18nDict(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          dictId: 1,
          langKey: 'common.submit',
          zh_CN: '提交',
          zh_TW: '提交',
          en_US: 'Submit',
          ja_JP: '送信',
          ko_KR: '제출',
          createTime: '2024-01-01 10:00:00'
        },
        {
          dictId: 2,
          langKey: 'common.cancel',
          zh_CN: '取消',
          zh_TW: '取消',
          en_US: 'Cancel',
          ja_JP: 'キャンセル',
          ko_KR: '취소',
          createTime: '2024-01-01 10:00:00'
        },
        {
          dictId: 3,
          langKey: 'common.save',
          zh_CN: '保存',
          zh_TW: '保存',
          en_US: 'Save',
          ja_JP: '保存',
          ko_KR: '저장',
          createTime: '2024-01-01 10:00:00'
        },
        {
          dictId: 4,
          langKey: 'common.delete',
          zh_CN: '删除',
          zh_TW: '刪除',
          en_US: 'Delete',
          ja_JP: '削除',
          ko_KR: '삭제',
          createTime: '2024-01-01 10:00:00'
        },
        {
          dictId: 5,
          langKey: 'common.edit',
          zh_CN: '编辑',
          zh_TW: '編輯',
          en_US: 'Edit',
          ja_JP: '編集',
          ko_KR: '편집',
          createTime: '2024-01-01 10:00:00'
        }
      ],
      total: 5
    }
  })
}

export function getI18nDict(dictId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      dictId: dictId,
      langKey: 'common.submit',
      zh_CN: '提交',
      zh_TW: '提交',
      en_US: 'Submit',
      ja_JP: '送信',
      ko_KR: '제출',
      createTime: '2024-01-01 10:00:00'
    }
  })
}

export function listI18nDictByKey(langKey) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        dictId: 1,
        langKey: langKey,
        zh_CN: '提交',
        zh_TW: '提交',
        en_US: 'Submit',
        ja_JP: '送信',
        ko_KR: '제출'
      }
    ]
  })
}

export function addI18nDict(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      dictId: 6
    }
  })
}

export function updateI18nDict(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

export function batchSaveI18nDicts(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      savedCount: data?.length || 0
    }
  })
}

export function delI18nDict(dictIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      deletedCount: dictIds?.length || 0
    }
  })
}

export function refreshCache() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}
