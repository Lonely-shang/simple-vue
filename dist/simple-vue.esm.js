'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(obj) {
    return obj instanceof Object && obj !== null;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        if (key in instance.setupState) {
            return instance.setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        // 验证publicGetter是否存在
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    const { setup } = instance.type;
    // 设置代理对象
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function h(type, props, children) {
    // 创建虚拟节点
    const vnode = createVNode(type, props, children);
    return vnode;
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
    // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
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
    vnode.el = el;
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
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    // render函数
    const subTree = instance.render.bind(proxy)(h);
    // TODO
    // 可能是templete
    // vnode -> path
    // vnode -> element -> mountElement
    path(subTree, container);
    initialVnode.el = subTree.el;
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

exports.createApp = createApp;
exports.h = h;
//# sourceMappingURL=simple-vue.esm.js.map
