import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

interface RequestOptions {
  baseURL: string
  timeout: number
  token?: string | (() => string)
  successCallback?: (data: any) => void
  errorCallback?: (error: any) => void
  loginExpired?: () => void
  wrongCallback?: (msg: string) => void
}
// 接口返回数据接口类型
export interface ResponseData {
  result: string
  data: any
  msg: string
  meta?: any
}

// 扩展请求参数接口
export interface RequestConfig extends AxiosRequestConfig {
  successNotice?: boolean
  errNotice?: boolean
}

class Request {
  instance: AxiosInstance

  $options: RequestOptions

  public request: (config: RequestConfig) => Promise<ResponseData>

  constructor(options: RequestOptions) {
    const { baseURL, timeout } = options
    this.instance = axios.create({
      baseURL,
      timeout,
      withCredentials: true
    })
    this.request = async (config: RequestConfig): Promise<ResponseData> => {
      const { data } = await this.instance(config)
      return data
    }
    this.$options = options
    this.init(options)
  }

  init(options: RequestOptions): void {
    // 请求拦截
    this.instance.interceptors.request.use(
      (config: RequestConfig) => {
        if (config.method === 'post') {
          if (config.headers && !config.headers['Content-Type']) {
            config.data = qs.stringify(config.data)
          }
          config.headers['Content-Type'] = 'application/json'
        }
        return config
      },
      error => {
        return this.err(error)
      }
    )

    // 响应拦截
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { config } = response
        const code = response.data.result
        if (response.data) {
          if (code === 'ok') {
            if (config && config.successNotice) {
              this.$options.successCallback && this.$options.successCallback(response.data)
            }
          } else if (config && config.errNotice) {
            this.$options.errorCallback && this.$options.errorCallback(response.data)
          }
          // 登录过期
          const errCode = [102, 401, 402, 403, 14]
          if (errCode.includes(code)) {
            this.$options.loginExpired && this.$options.loginExpired()
          }
          return response || {}
        }
        return response
      },
      error => {
        return this.err(error)
      }
    )
  }

  getTokenAndId(): { token: string; uid: string } {
    let user: any = localStorage.getItem('user') || ''
    if (user) {
      user = JSON.parse(user) as any
      return {
        token: user.token,
        uid: user.uid
      }
    }
    return { token: '', uid: '' }
  }

  err(error: any) {
    if (error.message.includes('timeout')) {
      this.$options.wrongCallback && this.$options.wrongCallback(error.message)
    }
    return { data: { code: 500, msg: error.message || '网络错误' }, status: 500 }
  }

  public get(
    url: string,
    params: Record<string, unknown>,
    errNotice = true,
    successNotice = false
  ): Promise<ResponseData> {
    return this.request({
      url,
      method: 'get',
      params,
      errNotice,
      successNotice
    })
  }

  public post(
    url: string,
    data: Record<string, unknown>,
    errNotice = true,
    successNotice = false
  ): Promise<ResponseData> {
    return this.request({
      url,
      method: 'post',
      data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      errNotice,
      successNotice
    })
  }

  public put(
    url: string,
    data: Record<string, unknown>,
    errNotice = true,
    successNotice = false
  ): Promise<ResponseData> {
    return this.request({
      url,
      method: 'put',
      data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      errNotice,
      successNotice
    })
  }

  public delete(
    url: string,
    data: Record<string, unknown>,
    errNotice = true,
    successNotice = false
  ): Promise<ResponseData> {
    return this.request({
      url,
      method: 'delete',
      data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      errNotice,
      successNotice
    })
  }
}

export default Request
