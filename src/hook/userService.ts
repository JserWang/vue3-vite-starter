interface ServiceModule {
  key: string
  path: string
  module: any
}

const modules = import.meta.globEager('../api/services/*.ts')

const serviceModules: ServiceModule[] = []

Object.keys(modules).forEach((key) => {
  const module = modules[key].default || {}
  serviceModules.push({
    key: key.substring(key.lastIndexOf('/') + 1, key.length - 3),
    path: key,
    module
  })
})

export function useService<T>(serviceName: string) {
  const target = serviceModules.find(item => item.key === serviceName)
  if (target) {
    return target.module as T
  }
  throw new Error(
    `找不到名为 ${serviceName} 的Service，请确保 ${serviceName} 存在于 '/api/services' 中.`
  )
}
