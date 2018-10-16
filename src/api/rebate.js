import axios from '@/libs/api.request'

export const getRebateList = (data) => {
  return axios.request({
    url: '/rest/rebate/listPagination',
    method: 'post',
    data
  })
}

// 新建返利订单
export const createRebate = (data) => {
  return axios.request({
    url: '/rest/rebate/create',
    method: 'post',
    data: data
  })
}

// 删除返利订单
export const deleteRebate = (params) => {
  return axios.request({
    url: '/rest/rebate/delete',
    method: 'get',
    params
  })
}

// 跟新返利订单
export const updateRebate = (data) => {
  return axios.request({
    url: '/rest/rebate/update',
    method: 'post',
    data
  })
}
