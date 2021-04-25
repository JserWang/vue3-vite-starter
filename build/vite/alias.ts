import path from 'path'
import type { Alias } from 'vite'

export function alias(alias: [string, string][]): Alias[] {
  return alias.map(item => {
    const [ find, replacement ] = item

    return {
      find,
      replacement: path.resolve(__dirname, replacement)
    }
  })
}
