'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Fargment = Symbol('fragment');
const Text = Symbol('text');
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
    if ((vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) && typeof children === 'object') {
        vnode.shapeFlag |= 16 /* SLOTS_CHILDREN */;
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

function renderSlots(slots, name, props) {
    let slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            slot = slot(props);
        }
        // children is an array of slot objects
        return createVNode(Fargment, {}, slot);
    }
}

function renderText(str) {
    return createVNode(Text, {}, str);
}

const extend = Object.assign;
function isObject(obj) {
    return obj instanceof Object && obj !== null;
}
function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
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
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
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

function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 16 /* SLOTS_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        console.log(key);
        const value = children[key];
        slots[key] = (props) => normalizeSlotsValue(value(props));
    }
}
function normalizeSlotsValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    console.log(parent);
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        parent,
        provides: parent ? parent.provides : {},
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
    initSlots(instance, instance.vnode.children);
    //
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    // 设置代理对象
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handlerSetupResult(instance, setupResult);
        setCurrentInstance(null);
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
let currentInstance = null;
function setCurrentInstance(instance) {
    currentInstance = instance;
}
function getCurrentInstance() {
    return currentInstance;
}

function provide(key, value) {
    //
    const instance = getCurrentInstance();
    if (instance) {
        let { provides } = instance;
        const parentProvides = instance.parent.provides;
        if (provides == parentProvides) {
            provides = instance.provides = Object.create(parentProvides || {});
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    const instance = getCurrentInstance();
    if (instance) {
        const parentProvides = instance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(container) {
                let rootContainer = null;
                if (typeof container == 'string') {
                    rootContainer = document.querySelector(container);
                }
                else {
                    rootContainer = container;
                }
                if (!rootContainer) {
                    throw new Error(`找不到指定的dom元素: ${container}`);
                }
                // 先将根组件转化成虚拟节点
                const vnode = createVNode(rootComponent);
                // 渲染节点
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    const { createElement, pathProps, insert } = options;
    // 将虚拟节点渲染到真实dom
    function render(vnode, container, parentComponent = {}) {
        // patch
        path(vnode, container, parentComponent);
    }
    function path(vnode, container, parentComponent) {
        const { type, shapeFlag } = vnode;
        // 处理组件
        /**
         * 通过vnode.type判断是否是组件
         */
        switch (type) {
            case Fargment:
                processFargment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(vnode, container, parentComponent);
                }
                // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }
    function processFargment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent);
    }
    function processText(vnode, container) {
        const { children } = vnode;
        const el = document.createTextNode(children);
        container.appendChild(el);
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        // canvas
        const { type, props, children, shapeFlag } = vnode;
        const el = createElement(type);
        vnode.el = el;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        for (const key in props) {
            const val = props[key];
            // const isOn = (key: string) => /^on[A-Z]/.test(key)
            // if (isOn(key)) {
            //   const event = key.slice(2).toLowerCase()
            //   el.addEventListener(event, _key)
            // }
            // else {
            //   el.setAttribute(key, _key)
            // }
            pathProps(el, key, val);
        }
        insert(el, container);
        // container.appendChild(el)
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.map(v => path(v, container, parentComponent));
    }
    function processComponent(vnode, container, parentComponent) {
        // 挂载组件
        mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVnode, container, parentComponent) {
        const instance = createComponentInstance(initialVnode, parentComponent);
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
        path(subTree, container, instance);
        initialVnode.el = subTree.el;
    }
    return {
        createApp: createAppApi(render)
    };
}

function createElement(type) {
    return document.createElement(type);
}
function pathProps(el, key, value) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, value);
    }
    else {
        el.setAttribute(key, value);
    }
}
function insert(el, container) {
    container.appendChild(el);
}
const renderer = createRenderer({
    createElement,
    pathProps,
    insert, // 插入元素
});
function createApp(...args) {
    return renderer.createApp(...args);
}

class RefImpl {
    constructor(val) {
        this.__v_isRef = true;
        this.dep = new Set();
        this._rawValue = val;
        this._value = isObject(val) ? reactive(val) : val;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (hasChanged(this._rawValue, value)) {
            this._rawValue = value;
            this._value = value;
            triggerEffect(this.dep);
        }
    }
}
function ref(val) {
    return new RefImpl(val);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.ref = ref;
exports.renderSlots = renderSlots;
exports.renderText = renderText;
//# sourceMappingURL=simple-vue.esm.js.map
