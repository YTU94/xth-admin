import axios from '@/libs/api.request'

export const getSessionId = () => {
  return axios.request({
    url: '/web/user/getAuthorization',
    method: 'get'
  })
}

export const login = (data) => {
  return axios.request({
    url: '/web/user/ajaxLogin',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: '/web/user/logout',
    method: 'get'
  })
}

// 获取用户list
export const getClientList = (data) => {
  return axios.request({
    url: '/rest/client/listPagination',
    method: 'post',
    data
  })
}

// 删除用户
export const deleteClient = (params) => {
  return axios.request({
    url: '/rest/client/delete',
    method: 'get',
    params
  })
}

// 跟新用户
export const updateClient = (data) => {
  return axios.request({
    url: '/rest/client/update',
    method: 'post',
    data
  })
}
