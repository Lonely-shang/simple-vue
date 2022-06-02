'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
function isObject(obj) {
    return obj instanceof Object && obj !== null;
}
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (all, letter) => {
        return letter ? letter.toUpperCase() : '';
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (key) => {
    return `on${capitalize(key)}`;
};

const refectMap = new Map();
// 触发依赖
function trigger(target, key, value) {
    const depsMap = refectMap === null || refectMap === void 0 ? void 0 : refectMap.get(target);
    const dep = depsMap === null || depsMap === void 0 ? void 0 : depsMap.get(key);
    if (dep)
        triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const item of dep) {
        if (item.scheduler) {
            item.scheduler();
        }
        else {
            item.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
// 创建get方法 通过传入isReadonly参数判断是否只读
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        // 如果传入的的key是`ReactiveFlags.IS_READONLY`则返回传入的isReadonly
        if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        const res = Reflect.get(target, key);
        // 如果是shallow包装的类型 直接返回 
        if (shallow) {
            return res;
        }
        // res如果是对象，则将循环嵌套
        if (isObject(res)) {
            // 根据isreadonly判断是否是只读
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
// 创建set函数
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
function mutableHandlers() {
    return {
        get,
        set
    };
}
/**
 * 处理readonly包装返回proxy的option
 * @returns {}
 */
function readonlyHandlers() {
    return {
        get: readonlyGet,
        set(target, key, value) {
            console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
            return true;
        }
    };
}
function shallowReadonlyHandlers() {
    return extend(readonlyHandlers(), {
        get: shallowReadonlyGet
    });
}

/**
 * 将传入的对象包装成响应式的
 * @param raw
 * @returns
 */
function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers());
}
// 将传入的对象包装成只读的对象
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers());
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers());
}
function createReactiveObject(raw, baseHandler) {
    if (!isObject(raw)) {
        console.warn(`[vue-reactivity] value cannot be made reactive: ${raw}`);
        return raw;
    }
    return new Proxy(raw, baseHandler);
}

function emit(instance, event, ...args) {
    const { props } = instance;
    const handlerKey = toHandlerKey(camelize(event));
    const handler = props[handlerKey];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
        props: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    // 初始化props
    initProps(instance, instance.vnode.props);
    // 初始化slots
    //
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    // 设置代理对象
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
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
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ?
        1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
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
    const { shapeFlag } = vnode;
    // 处理组件
    /**
     * 通过vnode.type判断是否是组件
     */
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children, shapeFlag } = vnode;
    const el = document.createElement(type);
    vnode.el = el;
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    for (const key in props) {
        const _key = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, _key);
        }
        else {
            el.setAttribute(key, _key);
        }
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
