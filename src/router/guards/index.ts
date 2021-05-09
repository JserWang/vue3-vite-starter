import { isFunction } from '@jserwang/utils'
import { Router } from 'vue-router'

const modules = import.meta.globEager('./*.ts')

export function setupGuards(router: Router) {
  Object.keys(modules).forEach((key) => {
    isFunction(modules[key].default) && modules[key].default.call(null, router)
  })
}
