// utils/mountVueComponent.ts
import { h, render, VNode, Component, ComponentPublicInstance } from "vue";

type MountOptions<T extends Component> = {
  container: HTMLElement;
  props?: InstanceType<T>["$props"];
  onReady?: (instance: InstanceType<T>) => void;
  replace?: boolean; // 是否替换原有组件（默认 true）
};

let activeVNodeMap = new WeakMap<HTMLElement, VNode>();

export function mountVueComponent<T extends Component>(
  component: T,
  options: MountOptions<T>
): InstanceType<T> | null {
  const { container, props = {}, onReady, replace = true } = options;

  // 卸载旧组件
  if (replace && activeVNodeMap.has(container)) {
    render(null, container);
    activeVNodeMap.delete(container);
  }

  let instance: ComponentPublicInstance | null = null;

  const vnode = h(component, {
    ...props,
    onVnodeMounted: (vnode: VNode) => {
      if (vnode.component?.proxy) {
        instance = vnode.component.proxy as InstanceType<T>;
        onReady?.(instance);
      }
    },
  });

  render(vnode, container);
  activeVNodeMap.set(container, vnode);

  return instance as InstanceType<T> | null;
}
