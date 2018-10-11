import axios from '@/libs/api.request'

// http://47.92.217.9:9090/rest/store/listPagination
export const getArticleList = (params) => {
  return axios.request({
    url: '/rest/article/listPagination',
    method: 'post',
    data: params
  })
}

// 新建文章
export const createArticle = (data) => {
  return axios.request({
    url: '/rest/article/create',
    method: 'post',
    data
  })
}

// 删除文章
export const deleteArticle = (params) => {
  return axios.request({
    url: '/rest/article/delete',
    method: 'get',
    params
  })
}

// 跟新文章
export const updateArticle = (data) => {
  return axios.request({
    url: '/rest/article/update',
    method: 'post',
    data
  })
}
