import axios from '@/libs/api.request'

// http://47.92.217.9:9090/rest/store/listPagination
export const getCityList = (data) => {
  return axios.request({
    url: '/rest/city/listPagination',
    method: 'post',
    data
  })
}

// 新建教练
export const createCity = (data) => {
  return axios.request({
    url: '/rest/city/create',
    method: 'post',
    data
  })
}

// 删除教练
export const deleteCity = (params) => {
  return axios.request({
    url: '/rest/city/delete',
    method: 'get',
    params
  })
}

// 跟新教练
export const updateCity = (data) => {
  return axios.request({
    url: '/rest/city/update',
    method: 'post',
    data
  })
}
