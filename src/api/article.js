import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle() {
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
// 以上都没用

// 查询文章管理列表
export function articleList(query) {
  return request({
    url: '/v1/gym/articles',
    method: 'get',
    params: query
  })
}
// 添加文章
export function addArticle(query) {
  return request({
    url: '/v1/gym/articles',
    method: 'post',
    data: query
  })
}
// 删除文章
export function deleteArticle(id) {
  return request({
    url: '/v1/gym/articles/' + id,
    method: 'delete'
  })
}
// 编辑文章
export function editArticle(id, query) {
  return request({
    url: '/v1/gym/articles/' + id,
    method: 'put',
    data: query
  })
}
// 文章管理预览文章
export function viewArticleManage(id) {
  return request({
    url: '/v1/gym/articles/' + id,
    method: 'get'
  })
}
// 文章推送记录预览文章
export function viewArticle(id) {
  return request({
    url: '/v1/gym/push_articles/' + id,
    method: 'get'
  })
}
// 批量删除文章
export function deleteBatchArticle(query) {
  return request({
    url: '/v1/gym/articles/batch',
    method: 'post',
    data: { ids: query }
  })
}
// 查询文章推送记录列表
export function articleRecordList(query) {
  return request({
    url: '/v1/gym/record_articles',
    method: 'get',
    params: query
  })
}
// 文章推送
export function sendArticle(query) {
  return request({
    url: '/v1/gym/record_articles',
    method: 'post',
    data: query
  })
}
// 文章推送记录删除
export function delRecordArticle(id) {
  return request({
    url: '/v1/gym/record_articles/' + id,
    method: 'delete'
  })
}
// 文章推送记录批量删除
export function deleteBatchRecordArticle(query) {
  return request({
    url: '/v1/gym/record_articles/batch',
    method: 'post',
    data: { ids: query }
  })
}
// 本月文章推送次数
export function articlePushNum() {
  return request({
    url: '/v1/gym/articles/count',
    method: 'post'
  })
}
