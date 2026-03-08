import type { App } from 'vue'
import { Button } from './Button'
// import AntDesignVue from 'ant-design-vue'
import { Card, Button as AntdButton } from 'ant-design-vue'
import * as Antd from 'ant-design-vue'
// export function registerGlobComp(app: App<Element>) {
//   app.use(AntDesignVue).use(Button)
// }
export function registerGlobComp(app: App<Element>) {
  // 注册所有组件
  Object.values(Antd).forEach(comp => {
    if (comp && comp.install) {
      app.use(comp)
    }
  })
  app.component(Card!.name!, Card)
  app.component(AntdButton!.name!, AntdButton)
  app.use(Button)
}