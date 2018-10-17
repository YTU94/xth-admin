import axios from '@/libs/api.request'

export const getStoreList = (params) => {
  return axios.request({
    url: '/rest/store/listPagination',
    method: 'post',
    data: params
  })
}
// 新建场馆
export const createStore = (params) => {
  return axios.request({
    url: '/rest/store/create',
    method: 'post',
    data: params
  })
}

// 删除场馆
export const deleteStore = (params) => {
  return axios.request({
    url: '/rest/store/delete',
    method: 'get',
    params
  })
}

// 跟新场馆
export const updateStore = (data) => {
  return axios.request({
    url: '/rest/store/update',
    method: 'post',
    data
  })
}

// 跟新场馆
export const exportStore = (data) => {
  return axios.request({
    url: '/rest/store/export',
    method: 'post',
    data
  })
}
