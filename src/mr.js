const { req } = require('./req')

async function createMr(id, sourceBranch, targetBranch) {
  console.log(`创建合并请求, 分支 ${sourceBranch} 合入 ${targetBranch}`)

  req({
    url: `/projects/${id}/merge_requests`,
    method: 'post',
    data: {
      source_branch: sourceBranch,
      target_branch: targetBranch,
      title: `mr - ${sourceBranch} 合入 ${targetBranch}`,
      remove_source_branch: false,
    },
  })
    .then(res => {
      const { web_url, merge_status } = res.data
      console.log('url\n', web_url)
      console.log('合并状态\n', merge_status)
    })
    .catch(err => {
      // 409 好像是那种存在已有的mr返回的。http状态码含义也是冲突
      if (err.status === 409) {
        console.log('尝试在已有mr中寻找是否存在对应的mr')
        return getMr(id, sourceBranch, targetBranch)
      }
      console.log('创建mr失败\n', err.message)
    })
}

function getMr(id, sourceBranch, targetBranch) {
  req({
    url: `/projects/${id}/merge_requests?source_branch=${sourceBranch}&target_branch=${targetBranch}&state=opened`,
  })
    .then(res => {
      if (res.data.length === 1) {
        const { web_url, merge_status } = res.data[0]
        console.log('url\n', web_url)
        console.log('合并状态\n', merge_status)
        return
      }
      console.log('未找到对应mr')
    })
    .catch(err => {
      console.log('获取项目mr失败', err.message)
    })
}

module.exports = {
  createMr,
}
