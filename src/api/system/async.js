export function getTaskList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          taskId: 1,
          taskName: '数据同步任务',
          taskType: 'SYNC',
          status: 'running',
          progress: 65,
          createTime: '2024-01-15 10:30:00',
          completeTime: null
        },
        {
          taskId: 2,
          taskName: '索引重建任务',
          taskType: 'INDEX',
          status: 'completed',
          progress: 100,
          createTime: '2024-01-15 09:00:00',
          completeTime: '2024-01-15 09:15:30'
        },
        {
          taskId: 3,
          taskName: '缓存清理任务',
          taskType: 'CACHE',
          status: 'pending',
          progress: 0,
          createTime: '2024-01-15 11:00:00',
          completeTime: null
        },
        {
          taskId: 4,
          taskName: '日志归档任务',
          taskType: 'LOG',
          status: 'failed',
          progress: 45,
          createTime: '2024-01-15 08:00:00',
          completeTime: null
        }
      ],
      total: 4
    }
  })
}

export function getTaskInfo(taskId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      taskId: taskId,
      taskName: '数据同步任务',
      taskType: 'SYNC',
      status: 'running',
      progress: 65,
      createTime: '2024-01-15 10:30:00',
      startTime: '2024-01-15 10:30:05',
      completeTime: null,
      errorMsg: null,
      detail: '正在同步第 650/1000 条记录'
    }
  })
}

export function stopTask(taskIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      stoppedCount: taskIds?.length || 0
    }
  })
}

export function removeTask(taskIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      removedCount: taskIds?.length || 0
    }
  })
}
