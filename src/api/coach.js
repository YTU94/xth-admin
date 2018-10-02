import axios from '@/libs/api.request'

// http://47.92.217.9:9090/rest/store/listPagination
export const getCoachList = (params) => {
  return axios.request({
    url: '/rest/coach/listPagination',
    method: 'post',
    params
  })
}

// 新建教练
export const createCoach = (data) => {
  return axios.request({
    url: '/rest/coach/create',
    method: 'post',
    data
  })
}

// 删除教练
export const deleteCoach = (params) => {
  return axios.request({
    url: '/rest/coach/delete',
    method: 'get',
    params
  })
}

// 跟新教练
export const updateCoach = (data) => {
  return axios.request({
    url: '/rest/coach/update',
    method: 'post',
    data
  })
}
