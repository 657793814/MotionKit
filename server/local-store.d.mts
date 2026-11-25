import type { Plugin } from 'vite'

export interface LocalConfigStoreOptions {
  /** 配置文件路径，相对项目根目录，默认 `.motionkit/config.json` */
  file?: string
  /** 中间件路由，默认 `/api/config` */
  route?: string
}

export default function localConfigStore(options?: LocalConfigStoreOptions): Plugin
