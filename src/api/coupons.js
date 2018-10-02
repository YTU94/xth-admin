import axios from '@/libs/api.request'

// http://47.92.217.9:9090/rest/store/listPagination
export const getCouponsList = (params) => {
  return axios.request({
    url: '/rest/coupon/listPagination',
    method: 'post',
    params: params
  })
}
// 新建优惠卷
export const createCoupon = (data) => {
  return axios.request({
    url: '/rest/coupon/create',
    method: 'post',
    data
  })
}

// 删除优惠卷
export const deleteCoupon = (params) => {
  return axios.request({
    url: '/rest/coupon/delete',
    method: 'get',
    params
  })
}

// 跟新优惠卷
export const updateCoupon = (data) => {
  return axios.request({
    url: '/rest/coupon/update',
    method: 'post',
    data
  })
}
