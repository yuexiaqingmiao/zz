# 快速创建mr

## 命令

`mr setToken xxx`  设置gitlab Access Token

`mr develop` 假如运行命令的工作区分支为feature-a，则会创建 feature-a 到 develop 的mr

`mr develop qa` 创建 develop 到 qa 的mr


## 大体实现

gitlab提供了创建mr的http请求(https://archives.docs.gitlab.com/16.11/ee/api/merge_requests.html#create-mr)

必传参数有三个，项目id，源分支，目标分支

通过git命令获取到当前项目的远程地址，进而截取到项目名，通过项目名搜到到项目id