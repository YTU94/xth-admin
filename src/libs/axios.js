import axios from 'axios'
// import { Spin } from 'iview'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = 'http://47.92.217.9:9090'
    this.data = {}
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 9000,
      //   auth: {
      //     username: 'mikeymike',
      //     password: 'rapunz3l'
      //   }
      // },
      headers: {
        //
        'X-Tag': 'admin',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: this.data
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
