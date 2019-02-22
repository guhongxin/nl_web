import request from '@/utils/request'

// 获取健身房特色列表; 例如： {1： ‘游泳’}
export function getFeatures() {
  return request({
    url: '/v1/data/gym/features',
    method: 'get'
  })
}

// 获取健身房功能列表； 例如： {1: 'WIFI'}
export function getFacilities() {
  return request({
    url: '/v1/data/gym/facilities',
    method: 'get'
  })
}

// 获取健身房功岗位列表
export function getPosts() {
  return request({
    url: '/v1/data/gym/posts',
    method: 'get'
  })
}
