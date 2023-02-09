import { render, h } from 'vue'

const createElement = () =>
  typeof document !== 'undefined' && document.createElement('div')

const mount = (component: any, { props, children, element, app }: any = {}) => {
  let el = element ? element : createElement()

  let vNode: any = h(component, props, children)
  if (app && app._context) {
    vNode.appContext = app._context
  }

  render(vNode, el)

  const destroy = () => {
    if (el) {
      render(null, el)
    }
    el = null
    vNode = null
  }

  return { vNode, destroy, el }
}

export default mount
