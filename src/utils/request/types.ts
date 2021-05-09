import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ResponseBody<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestOptions {
  config?: AxiosRequestConfig
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
  responseCallback?: <T>(response: any, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, options: AxiosRequestConfig) => void
}

interface RequestConfig {
  data?: Record<string, any>
  form?: boolean
  loading?: boolean
  errorTips?: boolean
}

export type HttpConfig = RequestConfig & AxiosRequestConfig

export enum MethodEnum {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  PURGE = 'PURGE',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
}

export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
