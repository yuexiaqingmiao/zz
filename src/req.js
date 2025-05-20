const axios = require('axios')
const json = require('./token.json')

const req = axios.create({
  baseURL: 'http://gitlab.mxbc-code.com/api/v4',
  timeout: 5000,
  headers: {
    'Private-Token': json.token,
  },
})

module.exports = {
  req,
}
