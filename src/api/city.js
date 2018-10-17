import axios from '@/libs/api.request'

export const getCityList = (data) => {
  return axios.request({
    url: '/rest/city/listPagination',
    method: 'post',
    data
  })
}

// 新建城市
export const createCity = (data) => {
  return axios.request({
    url: '/rest/city/create',
    method: 'post',
    data: data
  })
}

// 删除城市
export const deleteCity = (params) => {
  return axios.request({
    url: '/rest/city/delete',
    method: 'get',
    params
  })
}

// 跟新城市
export const updateCity = (data) => {
  return axios.request({
    url: '/rest/city/update',
    method: 'post',
    data
  })
}
