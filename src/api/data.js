import axios from '@/libs/api.request'

// http://47.92.217.9:9090/rest/store/listPagination
export const getTableData = (params) => {
  return axios.request({
    url: 'rest/store/listPagination',
    method: 'post',
    params: params
  })
}

export const getDragList = (params) => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get',
    params: params
  })
}
