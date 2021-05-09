import { noop, now } from '@jserwang/utils'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import Canceler from './canceler'
import { ContentTypeEnum, HttpConfig, MethodEnum, RequestOptions, ResponseBody } from './types'
import { genUniqueReqKey } from './utils'

const appendUrl = (url: string, str: string): string => `${url}${url.includes('?') ? '&' : '?'}${str}`

export class Request {
  private pendingList: Map<string, unknown>
  private instance: AxiosInstance
  private options: RequestOptions

  constructor(options: RequestOptions) {
    this.pendingList = new Map<string, unknown>()
    this.options = options
    this.instance = axios.create(options?.config)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    const { options, instance } = this
    instance.interceptors.request.use((config: HttpConfig) => {
      Canceler.add(config)
      // GET 请求前追加时间戳，防止请求缓存
      if (config.method === MethodEnum.GET) {
        config.url = appendUrl(config.url!, `_t=${now()}`)
      }

      if (options.requestInterceptor) {
        config = options.requestInterceptor(config)
      }

      return config
    }, options.requestInterceptorCatch ?? noop)

    instance.interceptors.response.use((response: AxiosResponse) => {
      Canceler.remove(response.config)

      if (options.responseInterceptor) {
        response = options.responseInterceptor(response)
      }

      return response
    }, options.responseInterceptorCatch ?? noop)
  }

  private processForm(config: AxiosRequestConfig) {
    config.headers = config.headers || {}
    config.headers['Content-Type'] = ContentTypeEnum.FORM_URLENCODED
    config.data = qs.stringify(config.data)
  }

  private fetch<T, R=ResponseBody<T>>(options: HttpConfig): Promise<T> {
    options.form && this.processForm(options)

    const uniqueKey = genUniqueReqKey(options)

    if (this.pendingList.has(uniqueKey)) {
      return this.pendingList.get(uniqueKey) as Promise<T>
    }

    const promise = new Promise<T>((resolve, reject) => {
      this.instance.request<R>(options)
        .then((response) => {
          const resp = (response.data as unknown) as ResponseBody<T>
          if (this.options.responseCallback) {
            this.options.responseCallback(resp, resolve, reject, options)
          } else {
            resolve(resp.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          this.pendingList.delete(uniqueKey)
        })
    })

    this.pendingList.set(uniqueKey, promise)

    return promise
  }

  get<T>(url: string, options?: HttpConfig) {
    return this.fetch<T>({
      ...(options || {}),
      method: MethodEnum.GET,
      url,
      params: options ? options.data : {}
    })
  }

  post<T>(url: string, options?: HttpConfig) {
    return this.fetch<T>({
      ...(options || {}),
      url,
      method: MethodEnum.POST
    })
  }

  upload<T>(url: string, options?: HttpConfig) {
    const formData = new FormData()
    Object.keys(options?.data).forEach((key) => {
      formData.append(key, options?.data[key])
    })
    return this.fetch<T>({
      ...(options || {}),
      url,
      method: options?.method || MethodEnum.POST,
      headers: {
        ...options?.headers,
        'Content-Type': ContentTypeEnum.FORM_DATA
      },
      data: formData
    })
  }
}
