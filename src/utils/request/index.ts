import axios from 'axios'
import { Request as Http } from './http'
import { ContentTypeEnum, HttpConfig, ResponseBody } from './types'

enum RES_CODE {
  CANCEL = -1,
  SUCCESS = 0
}

// TODO: 将Http抽到utils中，前置条件是修改 ts-mock-generator
export const Request = new Http({
  config: {
    withCredentials: true,
    headers: {
      'Content-Type': ContentTypeEnum.JSON
    },
    timeout: 10000
  },
  requestInterceptor: (config: HttpConfig) => {
    // if (config.loading) {
    //   config.loading
    // }
    return config
  },
  responseInterceptorCatch: (error: any) => {
    if (axios.isCancel(error)) {
      return Promise.resolve({ code: RES_CODE.CANCEL })
    }
    return Promise.reject(error)
  },
  responseCallback: <T>(response: ResponseBody<T>, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, options: HttpConfig) => {
    const { code, data, message } = response
    switch (code) {
      case RES_CODE.SUCCESS:
        resolve(data)
        break
      case RES_CODE.CANCEL:
        reject({})
        break
      default:
        reject(response)
    }

    if (code !== RES_CODE.SUCCESS && options.errorTips && message) {
      console.log(message)
    }
  }
})
