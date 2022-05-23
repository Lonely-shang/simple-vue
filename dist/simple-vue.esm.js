'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(obj) {
    return obj instanceof Object && obj !== null;
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // 初始化props
    // 初始化slots
    //
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.vnode.type;
    if (setup) {
        const setupResult = setup();
        handlerSetupResult(instance, setupResult);
    }
}
function handlerSetupResult(instance, setupResult) {
    // 这里传过来的setupResult可能是个函数或对象
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    // TODO
    // 如果是函数，则当成render函数渲染
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    // if(Component.render) {
    instance.render = Component.render;
    // }
}

// 将虚拟节点渲染到真实dom
function render(vnode, container) {
    // patch
    path(vnode, container);
}
function path(vnode, container) {
    // 处理组件
    /**
     * 通过vnode.type判断是否是组件
     */
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    const el = document.createElement(type);
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    for (const key in props) {
        el.setAttribute(key, props[key]);
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.map(v => path(v, container));
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> path
    // vnode -> element -> mountElement
    path(subTree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(domId) {
            const rootContainer = document.querySelector(domId);
            if (!rootContainer) {
                throw new Error(`找不到指定的dom元素: ${domId}`);
            }
            // 先将根组件转化成虚拟节点
            const vnode = createVNode(rootComponent);
            // 渲染节点
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    // 创建虚拟节点
    const vnode = createVNode(type, props, children);
    return vnode;
}

exports.createApp = createApp;
exports.h = h;
//# sourceMappingURL=simple-vue.esm.js.map
