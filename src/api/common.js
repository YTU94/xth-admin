import axios from '@/libs/api.request'

export const uploadImg = (data) => {
  return axios.request({
    url: '/rest/common/uploadImg',
    method: 'post',
    data
  })
}
