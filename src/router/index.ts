import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { basicRoutes } from './routes'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
function getRouteNames(array: any[]) {
  return array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
}
getRouteNames(basicRoutes)

const isElectronFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:'

// app router
export const router = createRouter({
  // Electron file:// 场景下使用 hash 路由，避免刷新或直达路由时丢失页面
  history: isElectronFileProtocol ? createWebHashHistory() : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string))
      router.hasRoute(name) && router.removeRoute(name)
  })
}

// config router
export function setupRouter(app: App<Element>) {
  app.use(router)
}
