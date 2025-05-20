const { req } = require('./req')

function getProjectId(projectName) {
  return req({ url: `/projects?search=${projectName}` })
    .then(res => {
      return res.data.find(el => el.name === projectName)?.id
    })
    .catch(err => {
      console.log('项目id获取失败', err)
    })
}

module.exports = {
  getProjectId,
}
