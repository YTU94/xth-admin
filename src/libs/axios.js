import axios from 'axios'
// import { Message } from 'iview'
// import { Spin } from 'iview'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        'content-type': 'application/json;charset=UTF-8'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加token获取
      if (localStorage.getItem('token')) {
        config.headers['Authorization'] = localStorage.getItem('token')
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      // const { data, status } = res
      return res.data

      // if (res.data.success) {
      //   return res.data
      // } else {
      // if (res.config.method === 'get' || res.config.method === 'post') {
      //   Message.error(res.data.message)
      // }
      // this.$Message.error(res.data.message || '系统出错')
      // return Promise.reject(new Error(res.data.message))
      // }
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
