'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    if (Component.render) {
        instance.render = Component.render;
    }
}

// 将虚拟节点渲染到真实dom
function render(vnode, container) {
    // patch
    path(vnode);
}
function path(vnode, container) {
    // 处理组件
    // 判断是否是 element
    processComponent(vnode);
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> path
    // vnode -> element -> mountElement
    path(subTree);
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
            render(vnode);
        }
    };
}

exports.createApp = createApp;
//# sourceMappingURL=simple-vue.esm.js.map
