#!/usr/bin/env node
const process = require('process')
const path = require('path')
const { writeFile } = require('fs')
const { exec } = require('child_process')

const { createMr } = require('./mr')
const { getProjectId } = require('./projects')
const tokenJson = require('./token.json')

const workDir = process.cwd()

function commonCall(cmd, path, cb) {
  return new Promise((resolve, reject) => {
    const option = {}
    if (path) {
      option.cwd = path
    }
    const p = exec(cmd, option, cb)
    p.on('error', reject)
    p.on('close', resolve)
  })
}

async function runCmd(path, cmd) {
  let res = ''
  const cb = (error, stdOut) => {
    res = stdOut
  }
  await commonCall(cmd, path, cb)
  return res
}

async function getCurrentBranch(path = workDir) {
  return await runCmd(path, 'git branch --show-current')
}

async function getCurrentProjectName(path = workDir) {
  const url = await runCmd(path, 'git config --get remote.origin.url')
  return url.split('/').pop().replace(/\.git/g, '').trim()
}

function setToken(token) {
  writeFile(
    path.resolve(__dirname, 'token.json'),
    JSON.stringify({ token }, null, 2) + '\r\n',
    err => {
      if (err) {
        console.log('token设置失败', err)
      } else {
        console.log('token设置成功')
      }
    }
  )
}

async function handle() {
  const [branchA, branchB] = process.argv.slice(2)

  // 设置token
  if (branchA === 'setToken') {
    if (branchB) {
      setToken(branchB)
    } else {
      console.log('请输入token值')
    }
    return
  }

  if (!tokenJson.token) {
    console.log(
      `
      请先运行 mr setToken xxx, 设置 gitlab access token
      http://gitlab.mxbc-code.com/-/profile/personal_access_tokens  
      `
    )
    return
  }

  const prjName = await getCurrentProjectName()
  const projectId = await getProjectId(prjName)
  if (!projectId) {
    console.log('无法通过当前项目远程url，获取到项目id')
    return
  }

  // 两个输入分支
  if (branchA && branchB) {
    createMr(projectId, branchA.trim(), branchB.trim())
    return
  }

  const currentBranch = await getCurrentBranch()
  // 一个输入分支
  if (branchA && currentBranch) {
    createMr(projectId, currentBranch.trim(), branchA.trim())
    return
  }
  console.log('输入不做处理')
}

handle()
