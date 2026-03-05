module.exports = [
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDisplayName",
    ()=>getDisplayName,
    "hasLoadedNamespace",
    ()=>hasLoadedNamespace,
    "isObject",
    ()=>isObject,
    "isString",
    ()=>isString,
    "loadLanguages",
    ()=>loadLanguages,
    "loadNamespaces",
    ()=>loadNamespaces,
    "warn",
    ()=>warn,
    "warnOnce",
    ()=>warnOnce
]);
const warn = (i18n, code, msg, rest)=>{
    const args = [
        msg,
        {
            code,
            ...rest || {}
        }
    ];
    if (i18n?.services?.logger?.forward) {
        return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
    }
    if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
    if (i18n?.services?.logger?.warn) {
        i18n.services.logger.warn(...args);
    } else if (console?.warn) {
        console.warn(...args);
    }
};
const alreadyWarned = {};
const warnOnce = (i18n, code, msg, rest)=>{
    if (isString(msg) && alreadyWarned[msg]) return;
    if (isString(msg)) alreadyWarned[msg] = new Date();
    warn(i18n, code, msg, rest);
};
const loadedClb = (i18n, cb)=>()=>{
        if (i18n.isInitialized) {
            cb();
        } else {
            const initialized = ()=>{
                setTimeout(()=>{
                    i18n.off('initialized', initialized);
                }, 0);
                cb();
            };
            i18n.on('initialized', initialized);
        }
    };
const loadNamespaces = (i18n, ns, cb)=>{
    i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
const loadLanguages = (i18n, lng, ns, cb)=>{
    if (isString(ns)) ns = [
        ns
    ];
    if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
    ns.forEach((n)=>{
        if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
    });
    i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
const hasLoadedNamespace = (ns, i18n, options = {})=>{
    if (!i18n.languages || !i18n.languages.length) {
        warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
            languages: i18n.languages
        });
        return true;
    }
    return i18n.hasLoadedNamespace(ns, {
        lng: options.lng,
        precheck: (i18nInstance, loadNotPending)=>{
            if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
        }
    });
};
const getDisplayName = (Component)=>Component.displayName || Component.name || (isString(Component) && Component.length > 0 ? Component : 'Unknown');
const isString = (obj)=>typeof obj === 'string';
const isObject = (obj)=>typeof obj === 'object' && obj !== null;
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/unescape.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unescape",
    ()=>unescape
]);
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
    '&nbsp;': ' ',
    '&#160;': ' ',
    '&copy;': '©',
    '&#169;': '©',
    '&reg;': '®',
    '&#174;': '®',
    '&hellip;': '…',
    '&#8230;': '…',
    '&#x2F;': '/',
    '&#47;': '/'
};
const unescapeHtmlEntity = (m)=>htmlEntities[m];
const unescape = (text)=>text.replace(matchHtmlEntity, unescapeHtmlEntity);
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaults",
    ()=>getDefaults,
    "setDefaults",
    ()=>setDefaults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$unescape$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/unescape.js [app-ssr] (ecmascript)");
;
let defaultOptions = {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transWrapTextNodes: '',
    transKeepBasicHtmlNodesFor: [
        'br',
        'strong',
        'i',
        'p'
    ],
    useSuspense: true,
    unescape: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$unescape$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unescape"],
    transDefaultProps: undefined
};
const setDefaults = (options = {})=>{
    defaultOptions = {
        ...defaultOptions,
        ...options
    };
};
const getDefaults = ()=>defaultOptions;
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getI18n",
    ()=>getI18n,
    "setI18n",
    ()=>setI18n
]);
let i18nInstance;
const setI18n = (instance)=>{
    i18nInstance = instance;
};
const getI18n = ()=>i18nInstance;
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/TransWithoutContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trans",
    ()=>Trans,
    "nodesToString",
    ()=>nodesToString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/i18next@25.8.14_typescript@5.9.3/node_modules/i18next/dist/esm/i18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$html$2d$parse$2d$stringify$40$3$2e$0$2e$1$2f$node_modules$2f$html$2d$parse$2d$stringify$2f$dist$2f$html$2d$parse$2d$stringify$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/html-parse-stringify@3.0.1/node_modules/html-parse-stringify/dist/html-parse-stringify.module.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$unescape$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/unescape.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const hasChildren = (node, checkLength)=>{
    if (!node) return false;
    const base = node.props?.children ?? node.children;
    if (checkLength) return base.length > 0;
    return !!base;
};
const getChildren = (node)=>{
    if (!node) return [];
    const children = node.props?.children ?? node.children;
    return node.props?.i18nIsDynamicList ? getAsArray(children) : children;
};
const hasValidReactChildren = (children)=>Array.isArray(children) && children.every(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"]);
const getAsArray = (data)=>Array.isArray(data) ? data : [
        data
    ];
const mergeProps = (source, target)=>{
    const newTarget = {
        ...target
    };
    newTarget.props = {
        ...target.props,
        ...source.props
    };
    return newTarget;
};
const getValuesFromChildren = (children)=>{
    const values = {};
    if (!children) return values;
    const getData = (childs)=>{
        const childrenArray = getAsArray(childs);
        childrenArray.forEach((child)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(child)) return;
            if (hasChildren(child)) getData(getChildren(child));
            else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(child) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child)) Object.assign(values, child);
        });
    };
    getData(children);
    return values;
};
const nodesToString = (children, i18nOptions, i18n, i18nKey)=>{
    if (!children) return '';
    let stringNode = '';
    const childrenArray = getAsArray(children);
    const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
    childrenArray.forEach((child, childIndex)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(child)) {
            stringNode += `${child}`;
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child)) {
            const { props, type } = child;
            const childPropsCount = Object.keys(props).length;
            const shouldKeepChild = keepArray.indexOf(type) > -1;
            const childChildren = props.children;
            if (!childChildren && shouldKeepChild && !childPropsCount) {
                stringNode += `<${type}/>`;
                return;
            }
            if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
                stringNode += `<${childIndex}></${childIndex}>`;
                return;
            }
            if (shouldKeepChild && childPropsCount === 1 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(childChildren)) {
                stringNode += `<${type}>${childChildren}</${type}>`;
                return;
            }
            const content = nodesToString(childChildren, i18nOptions, i18n, i18nKey);
            stringNode += `<${childIndex}>${content}</${childIndex}>`;
            return;
        }
        if (child === null) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(i18n, 'TRANS_NULL_VALUE', `Passed in a null value as child`, {
                i18nKey
            });
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(child)) {
            const { format, ...clone } = child;
            const keys = Object.keys(clone);
            if (keys.length === 1) {
                const value = format ? `${keys[0]}, ${format}` : keys[0];
                stringNode += `{{${value}}}`;
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(i18n, 'TRANS_INVALID_OBJ', `Invalid child - Object should only have keys {{ value, format }} (format is optional).`, {
                i18nKey,
                child
            });
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(i18n, 'TRANS_INVALID_VAR', `Passed in a variable like {number} - pass variables for interpolation as full objects like {{number}}.`, {
            i18nKey,
            child
        });
    });
    return stringNode;
};
const escapeLiteralLessThan = (str, keepArray = [], knownComponentsMap = {})=>{
    if (!str) return str;
    const knownNames = Object.keys(knownComponentsMap);
    const allValidNames = [
        ...keepArray,
        ...knownNames
    ];
    let result = '';
    let i = 0;
    while(i < str.length){
        if (str[i] === '<') {
            let isValidTag = false;
            const closingMatch = str.slice(i).match(/^<\/(\d+|[a-zA-Z][a-zA-Z0-9_-]*)>/);
            if (closingMatch) {
                const tagName = closingMatch[1];
                if (/^\d+$/.test(tagName) || allValidNames.includes(tagName)) {
                    isValidTag = true;
                    result += closingMatch[0];
                    i += closingMatch[0].length;
                }
            }
            if (!isValidTag) {
                const openingMatch = str.slice(i).match(/^<(\d+|[a-zA-Z][a-zA-Z0-9_-]*)(\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*(\/)?>/);
                if (openingMatch) {
                    const tagName = openingMatch[1];
                    if (/^\d+$/.test(tagName) || allValidNames.includes(tagName)) {
                        isValidTag = true;
                        result += openingMatch[0];
                        i += openingMatch[0].length;
                    }
                }
            }
            if (!isValidTag) {
                result += '&lt;';
                i += 1;
            }
        } else {
            result += str[i];
            i += 1;
        }
    }
    return result;
};
const renderNodes = (children, knownComponentsMap, targetString, i18n, i18nOptions, combinedTOpts, shouldUnescape)=>{
    if (targetString === '') return [];
    const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
    const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map((keep)=>`<${keep}`).join('|')).test(targetString);
    if (!children && !knownComponentsMap && !emptyChildrenButNeedsHandling && !shouldUnescape) return [
        targetString
    ];
    const data = knownComponentsMap ?? {};
    const getData = (childs)=>{
        const childrenArray = getAsArray(childs);
        childrenArray.forEach((child)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(child)) return;
            if (hasChildren(child)) getData(getChildren(child));
            else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(child) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child)) Object.assign(data, child);
        });
    };
    getData(children);
    const escapedString = escapeLiteralLessThan(targetString, keepArray, data);
    const ast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$html$2d$parse$2d$stringify$40$3$2e$0$2e$1$2f$node_modules$2f$html$2d$parse$2d$stringify$2f$dist$2f$html$2d$parse$2d$stringify$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].parse(`<0>${escapedString}</0>`);
    const opts = {
        ...data,
        ...combinedTOpts
    };
    const renderInner = (child, node, rootReactNode)=>{
        const childs = getChildren(child);
        const mappedChildren = mapAST(childs, node.children, rootReactNode);
        return hasValidReactChildren(childs) && mappedChildren.length === 0 || child.props?.i18nIsDynamicList ? childs : mappedChildren;
    };
    const pushTranslatedJSX = (child, inner, mem, i, isVoid)=>{
        if (child.dummy) {
            child.children = inner;
            mem.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
                key: i
            }, isVoid ? undefined : inner));
        } else {
            mem.push(...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].map([
                child
            ], (c)=>{
                const INTERNAL_DYNAMIC_MARKER = 'data-i18n-is-dynamic-list';
                const override = {
                    key: i,
                    [INTERNAL_DYNAMIC_MARKER]: undefined
                };
                if (c && c.props) {
                    Object.keys(c.props).forEach((k)=>{
                        if (k === 'ref' || k === 'children' || k === 'i18nIsDynamicList' || k === INTERNAL_DYNAMIC_MARKER) return;
                        override[k] = c.props[k];
                    });
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(c, override, isVoid ? null : inner);
            }));
        }
    };
    const mapAST = (reactNode, astNode, rootReactNode)=>{
        const reactNodes = getAsArray(reactNode);
        const astNodes = getAsArray(astNode);
        return astNodes.reduce((mem, node, i)=>{
            const translationContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
            if (node.type === 'tag') {
                let tmp = reactNodes[parseInt(node.name, 10)];
                if (!tmp && knownComponentsMap) tmp = knownComponentsMap[node.name];
                if (rootReactNode.length === 1 && !tmp) tmp = rootReactNode[0][node.name];
                if (!tmp) tmp = {};
                const props = {
                    ...node.attrs
                };
                if (shouldUnescape) {
                    Object.keys(props).forEach((p)=>{
                        const val = props[p];
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(val)) {
                            props[p] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$unescape$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unescape"])(val);
                        }
                    });
                }
                const child = Object.keys(props).length !== 0 ? mergeProps({
                    props
                }, tmp) : tmp;
                const isElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child);
                const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
                const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(child) && child.dummy && !isElement;
                const isKnownComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(knownComponentsMap) && Object.hasOwnProperty.call(knownComponentsMap, node.name);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(child)) {
                    const value = i18n.services.interpolator.interpolate(child, opts, i18n.language);
                    mem.push(value);
                } else if (hasChildren(child) || isValidTranslationWithChildren) {
                    const inner = renderInner(child, node, rootReactNode);
                    pushTranslatedJSX(child, inner, mem, i);
                } else if (isEmptyTransWithHTML) {
                    const inner = mapAST(reactNodes, node.children, rootReactNode);
                    pushTranslatedJSX(child, inner, mem, i);
                } else if (Number.isNaN(parseFloat(node.name))) {
                    if (isKnownComponent) {
                        const inner = renderInner(child, node, rootReactNode);
                        pushTranslatedJSX(child, inner, mem, i, node.voidElement);
                    } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
                        if (node.voidElement) {
                            mem.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(node.name, {
                                key: `${node.name}-${i}`
                            }));
                        } else {
                            const inner = mapAST(reactNodes, node.children, rootReactNode);
                            mem.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(node.name, {
                                key: `${node.name}-${i}`
                            }, inner));
                        }
                    } else if (node.voidElement) {
                        mem.push(`<${node.name} />`);
                    } else {
                        const inner = mapAST(reactNodes, node.children, rootReactNode);
                        mem.push(`<${node.name}>${inner}</${node.name}>`);
                    }
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(child) && !isElement) {
                    const content = node.children[0] ? translationContent : null;
                    if (content) mem.push(content);
                } else {
                    pushTranslatedJSX(child, translationContent, mem, i, node.children.length !== 1 || !translationContent);
                }
            } else if (node.type === 'text') {
                const wrapTextNodes = i18nOptions.transWrapTextNodes;
                const unescapeFn = typeof i18nOptions.unescape === 'function' ? i18nOptions.unescape : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaults"])().unescape;
                const content = shouldUnescape ? unescapeFn(i18n.services.interpolator.interpolate(node.content, opts, i18n.language)) : i18n.services.interpolator.interpolate(node.content, opts, i18n.language);
                if (wrapTextNodes) {
                    mem.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(wrapTextNodes, {
                        key: `${node.name}-${i}`
                    }, content));
                } else {
                    mem.push(content);
                }
            }
            return mem;
        }, []);
    };
    const result = mapAST([
        {
            dummy: true,
            children: children || []
        }
    ], ast, getAsArray(children || []));
    return getChildren(result[0]);
};
const fixComponentProps = (component, index, translation)=>{
    const componentKey = component.key || index;
    const comp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"])(component, {
        key: componentKey
    });
    if (!comp.props || !comp.props.children || translation.indexOf(`${index}/>`) < 0 && translation.indexOf(`${index} />`) < 0) {
        return comp;
    }
    function Componentized() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], null, comp);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(Componentized, {
        key: componentKey
    });
};
const generateArrayComponents = (components, translation)=>components.map((c, index)=>fixComponentProps(c, index, translation));
const generateObjectComponents = (components, translation)=>{
    const componentMap = {};
    Object.keys(components).forEach((c)=>{
        Object.assign(componentMap, {
            [c]: fixComponentProps(components[c], c, translation)
        });
    });
    return componentMap;
};
const generateComponents = (components, translation, i18n, i18nKey)=>{
    if (!components) return null;
    if (Array.isArray(components)) {
        return generateArrayComponents(components, translation);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(components)) {
        return generateObjectComponents(components, translation);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])(i18n, 'TRANS_INVALID_COMPONENTS', `<Trans /> "components" prop expects an object or array`, {
        i18nKey
    });
    return null;
};
const isComponentsMap = (object)=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(object)) return false;
    if (Array.isArray(object)) return false;
    return Object.keys(object).reduce((acc, key)=>acc && Number.isNaN(Number.parseFloat(key)), true);
};
function Trans({ children, count, parent, i18nKey, context, tOptions = {}, values, defaults, components, ns, i18n: i18nFromProps, t: tFromProps, shouldUnescape, ...additionalProps }) {
    const i18n = i18nFromProps || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    if (!i18n) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])(i18n, 'NO_I18NEXT_INSTANCE', `Trans: You need to pass in an i18next instance using i18nextReactModule`, {
            i18nKey
        });
        return children;
    }
    const t = tFromProps || i18n.t.bind(i18n) || ((k)=>k);
    const reactI18nextOptions = {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaults"])(),
        ...i18n.options?.react
    };
    let namespaces = ns || t.ns || i18n.options?.defaultNS;
    namespaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(namespaces) ? [
        namespaces
    ] : namespaces || [
        'translation'
    ];
    const { transDefaultProps } = reactI18nextOptions;
    const mergedTOptions = transDefaultProps?.tOptions ? {
        ...transDefaultProps.tOptions,
        ...tOptions
    } : tOptions;
    const mergedShouldUnescape = shouldUnescape ?? transDefaultProps?.shouldUnescape;
    const mergedValues = transDefaultProps?.values ? {
        ...transDefaultProps.values,
        ...values
    } : values;
    const mergedComponents = transDefaultProps?.components ? {
        ...transDefaultProps.components,
        ...components
    } : components;
    const nodeAsString = nodesToString(children, reactI18nextOptions, i18n, i18nKey);
    const defaultValue = defaults || mergedTOptions?.defaultValue || nodeAsString || reactI18nextOptions.transEmptyNodeValue || (typeof i18nKey === 'function' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyFromSelector"])(i18nKey) : i18nKey);
    const { hashTransKey } = reactI18nextOptions;
    const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
    if (i18n.options?.interpolation?.defaultVariables) {
        values = mergedValues && Object.keys(mergedValues).length > 0 ? {
            ...mergedValues,
            ...i18n.options.interpolation.defaultVariables
        } : {
            ...i18n.options.interpolation.defaultVariables
        };
    } else {
        values = mergedValues;
    }
    const valuesFromChildren = getValuesFromChildren(children);
    if (valuesFromChildren && typeof valuesFromChildren.count === 'number' && count === undefined) {
        count = valuesFromChildren.count;
    }
    const interpolationOverride = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children ? mergedTOptions.interpolation : {
        interpolation: {
            ...mergedTOptions.interpolation,
            prefix: '#$?',
            suffix: '?$#'
        }
    };
    const combinedTOpts = {
        ...mergedTOptions,
        context: context || mergedTOptions.context,
        count,
        ...values,
        ...interpolationOverride,
        defaultValue,
        ns: namespaces
    };
    let translation = key ? t(key, combinedTOpts) : defaultValue;
    if (translation === key && defaultValue) translation = defaultValue;
    const generatedComponents = generateComponents(mergedComponents, translation, i18n, i18nKey);
    let indexedChildren = generatedComponents || children;
    let componentsMap = null;
    if (isComponentsMap(generatedComponents)) {
        componentsMap = generatedComponents;
        indexedChildren = children;
    }
    const content = renderNodes(indexedChildren, componentsMap, translation, i18n, reactI18nextOptions, combinedTOpts, mergedShouldUnescape);
    const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
    return useAsParent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(useAsParent, additionalProps, content) : content;
}
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/initReactI18next.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initReactI18next",
    ()=>initReactI18next
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
;
;
const initReactI18next = {
    type: '3rdParty',
    init (instance) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaults"])(instance.options.react);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setI18n"])(instance);
    }
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nContext",
    ()=>I18nContext,
    "ReportNamespaces",
    ()=>ReportNamespaces,
    "composeInitialProps",
    ()=>composeInitialProps,
    "getInitialProps",
    ()=>getInitialProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/initReactI18next.js [app-ssr] (ecmascript)");
;
;
;
;
;
const I18nContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
class ReportNamespaces {
    constructor(){
        this.usedNamespaces = {};
    }
    addUsedNamespaces(namespaces) {
        namespaces.forEach((ns)=>{
            if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
        });
    }
    getUsedNamespaces() {
        return Object.keys(this.usedNamespaces);
    }
}
const composeInitialProps = (ForComponent)=>async (ctx)=>{
        const componentsInitialProps = await ForComponent.getInitialProps?.(ctx) ?? {};
        const i18nInitialProps = getInitialProps();
        return {
            ...componentsInitialProps,
            ...i18nInitialProps
        };
    };
const getInitialProps = ()=>{
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    const namespaces = i18n.reportNamespaces?.getUsedNamespaces() ?? [];
    const ret = {};
    const initialI18nStore = {};
    i18n.languages.forEach((l)=>{
        initialI18nStore[l] = {};
        namespaces.forEach((ns)=>{
            initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
        });
    });
    ret.initialI18nStore = initialI18nStore;
    ret.initialLanguage = i18n.language;
    return ret;
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/Trans.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trans",
    ()=>Trans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$TransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/TransWithoutContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
;
;
;
;
function Trans({ children, count, parent, i18nKey, context, tOptions = {}, values, defaults, components, ns, i18n: i18nFromProps, t: tFromProps, shouldUnescape, ...additionalProps }) {
    const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["I18nContext"]) || {};
    const i18n = i18nFromProps || i18nFromContext || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    const t = tFromProps || i18n?.t.bind(i18n);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$TransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trans"])({
        children,
        count,
        parent,
        i18nKey,
        context,
        tOptions,
        values,
        defaults,
        components,
        ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
        i18n,
        t: tFromProps,
        shouldUnescape,
        ...additionalProps
    });
}
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/TranslationParserError.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranslationParserError",
    ()=>TranslationParserError
]);
class TranslationParserError extends Error {
    constructor(message, position, translationString){
        super(message);
        this.name = 'TranslationParserError';
        this.position = position;
        this.translationString = translationString;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TranslationParserError);
        }
    }
}
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/htmlEntityDecoder.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeHtmlEntities",
    ()=>decodeHtmlEntities
]);
const commonEntities = {
    '&nbsp;': '\u00A0',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&sbquo;': '\u201A',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&bdquo;': '\u201E',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&bull;': '•',
    '&prime;': '′',
    '&Prime;': '″',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
    '&sect;': '§',
    '&para;': '¶',
    '&middot;': '·',
    '&ensp;': '\u2002',
    '&emsp;': '\u2003',
    '&thinsp;': '\u2009',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&curren;': '¤',
    '&times;': '×',
    '&divide;': '÷',
    '&minus;': '−',
    '&plusmn;': '±',
    '&ne;': '≠',
    '&le;': '≤',
    '&ge;': '≥',
    '&asymp;': '≈',
    '&equiv;': '≡',
    '&infin;': '∞',
    '&int;': '∫',
    '&sum;': '∑',
    '&prod;': '∏',
    '&radic;': '√',
    '&part;': '∂',
    '&permil;': '‰',
    '&deg;': '°',
    '&micro;': 'µ',
    '&larr;': '←',
    '&uarr;': '↑',
    '&rarr;': '→',
    '&darr;': '↓',
    '&harr;': '↔',
    '&crarr;': '↵',
    '&lArr;': '⇐',
    '&uArr;': '⇑',
    '&rArr;': '⇒',
    '&dArr;': '⇓',
    '&hArr;': '⇔',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&zeta;': 'ζ',
    '&eta;': 'η',
    '&theta;': 'θ',
    '&iota;': 'ι',
    '&kappa;': 'κ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&nu;': 'ν',
    '&xi;': 'ξ',
    '&omicron;': 'ο',
    '&pi;': 'π',
    '&rho;': 'ρ',
    '&sigma;': 'σ',
    '&tau;': 'τ',
    '&upsilon;': 'υ',
    '&phi;': 'φ',
    '&chi;': 'χ',
    '&psi;': 'ψ',
    '&omega;': 'ω',
    '&Alpha;': 'Α',
    '&Beta;': 'Β',
    '&Gamma;': 'Γ',
    '&Delta;': 'Δ',
    '&Epsilon;': 'Ε',
    '&Zeta;': 'Ζ',
    '&Eta;': 'Η',
    '&Theta;': 'Θ',
    '&Iota;': 'Ι',
    '&Kappa;': 'Κ',
    '&Lambda;': 'Λ',
    '&Mu;': 'Μ',
    '&Nu;': 'Ν',
    '&Xi;': 'Ξ',
    '&Omicron;': 'Ο',
    '&Pi;': 'Π',
    '&Rho;': 'Ρ',
    '&Sigma;': 'Σ',
    '&Tau;': 'Τ',
    '&Upsilon;': 'Υ',
    '&Phi;': 'Φ',
    '&Chi;': 'Χ',
    '&Psi;': 'Ψ',
    '&Omega;': 'Ω',
    '&Agrave;': 'À',
    '&Aacute;': 'Á',
    '&Acirc;': 'Â',
    '&Atilde;': 'Ã',
    '&Auml;': 'Ä',
    '&Aring;': 'Å',
    '&AElig;': 'Æ',
    '&Ccedil;': 'Ç',
    '&Egrave;': 'È',
    '&Eacute;': 'É',
    '&Ecirc;': 'Ê',
    '&Euml;': 'Ë',
    '&Igrave;': 'Ì',
    '&Iacute;': 'Í',
    '&Icirc;': 'Î',
    '&Iuml;': 'Ï',
    '&ETH;': 'Ð',
    '&Ntilde;': 'Ñ',
    '&Ograve;': 'Ò',
    '&Oacute;': 'Ó',
    '&Ocirc;': 'Ô',
    '&Otilde;': 'Õ',
    '&Ouml;': 'Ö',
    '&Oslash;': 'Ø',
    '&Ugrave;': 'Ù',
    '&Uacute;': 'Ú',
    '&Ucirc;': 'Û',
    '&Uuml;': 'Ü',
    '&Yacute;': 'Ý',
    '&THORN;': 'Þ',
    '&szlig;': 'ß',
    '&agrave;': 'à',
    '&aacute;': 'á',
    '&acirc;': 'â',
    '&atilde;': 'ã',
    '&auml;': 'ä',
    '&aring;': 'å',
    '&aelig;': 'æ',
    '&ccedil;': 'ç',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&ecirc;': 'ê',
    '&euml;': 'ë',
    '&igrave;': 'ì',
    '&iacute;': 'í',
    '&icirc;': 'î',
    '&iuml;': 'ï',
    '&eth;': 'ð',
    '&ntilde;': 'ñ',
    '&ograve;': 'ò',
    '&oacute;': 'ó',
    '&ocirc;': 'ô',
    '&otilde;': 'õ',
    '&ouml;': 'ö',
    '&oslash;': 'ø',
    '&ugrave;': 'ù',
    '&uacute;': 'ú',
    '&ucirc;': 'û',
    '&uuml;': 'ü',
    '&yacute;': 'ý',
    '&thorn;': 'þ',
    '&yuml;': 'ÿ',
    '&iexcl;': '¡',
    '&iquest;': '¿',
    '&fnof;': 'ƒ',
    '&circ;': 'ˆ',
    '&tilde;': '˜',
    '&OElig;': 'Œ',
    '&oelig;': 'œ',
    '&Scaron;': 'Š',
    '&scaron;': 'š',
    '&Yuml;': 'Ÿ',
    '&ordf;': 'ª',
    '&ordm;': 'º',
    '&macr;': '¯',
    '&acute;': '´',
    '&cedil;': '¸',
    '&sup1;': '¹',
    '&sup2;': '²',
    '&sup3;': '³',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&spades;': '♠',
    '&clubs;': '♣',
    '&hearts;': '♥',
    '&diams;': '♦',
    '&loz;': '◊',
    '&oline;': '‾',
    '&frasl;': '⁄',
    '&weierp;': '℘',
    '&image;': 'ℑ',
    '&real;': 'ℜ',
    '&alefsym;': 'ℵ'
};
const entityPattern = new RegExp(Object.keys(commonEntities).map((entity)=>entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
const decodeHtmlEntities = (text)=>text.replace(entityPattern, (match)=>commonEntities[match]).replace(/&#(\d+);/g, (_, num)=>String.fromCharCode(parseInt(num, 10))).replace(/&#x([0-9a-fA-F]+);/g, (_, hex)=>String.fromCharCode(parseInt(hex, 16)));
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/tokenizer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tokenize",
    ()=>tokenize
]);
const tokenize = (translation)=>{
    const tokens = [];
    let position = 0;
    let currentText = '';
    const flushText = ()=>{
        if (currentText) {
            tokens.push({
                type: 'Text',
                value: currentText,
                position: position - currentText.length
            });
            currentText = '';
        }
    };
    while(position < translation.length){
        const char = translation[position];
        if (char === '<') {
            const tagMatch = translation.slice(position).match(/^<(\d+)>/);
            if (tagMatch) {
                flushText();
                tokens.push({
                    type: 'TagOpen',
                    value: tagMatch[0],
                    position,
                    tagNumber: parseInt(tagMatch[1], 10)
                });
                position += tagMatch[0].length;
            } else {
                const closeTagMatch = translation.slice(position).match(/^<\/(\d+)>/);
                if (closeTagMatch) {
                    flushText();
                    tokens.push({
                        type: 'TagClose',
                        value: closeTagMatch[0],
                        position,
                        tagNumber: parseInt(closeTagMatch[1], 10)
                    });
                    position += closeTagMatch[0].length;
                } else {
                    currentText += char;
                    position += 1;
                }
            }
        } else {
            currentText += char;
            position += 1;
        }
    }
    flushText();
    return tokens;
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/renderTranslation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "renderTranslation",
    ()=>renderTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$TranslationParserError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/TranslationParserError.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/tokenizer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$htmlEntityDecoder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/htmlEntityDecoder.js [app-ssr] (ecmascript)");
;
;
;
;
const renderDeclarationNode = (declaration, children, childDeclarations)=>{
    const { type, props = {} } = declaration;
    if (props.children && Array.isArray(props.children) && childDeclarations) {
        const { children: _childrenToRemove, ...propsWithoutChildren } = props;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(type, propsWithoutChildren, ...children);
    }
    if (children.length === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(type, props);
    }
    if (children.length === 1) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(type, props, children[0]);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(type, props, ...children);
};
const renderTranslation = (translation, declarations = [])=>{
    if (!translation) {
        return [];
    }
    const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tokenize"])(translation);
    const result = [];
    const stack = [];
    const literalTagNumbers = new Set();
    const getCurrentDeclarations = ()=>{
        if (stack.length === 0) {
            return declarations;
        }
        const parentFrame = stack[stack.length - 1];
        if (parentFrame.declaration.props?.children && Array.isArray(parentFrame.declaration.props.children)) {
            return parentFrame.declaration.props.children;
        }
        return parentFrame.declarations;
    };
    tokens.forEach((token)=>{
        switch(token.type){
            case 'Text':
                {
                    const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$htmlEntityDecoder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeHtmlEntities"])(token.value);
                    const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
                    targetArray.push(decoded);
                }
                break;
            case 'TagOpen':
                {
                    const { tagNumber } = token;
                    const currentDeclarations = getCurrentDeclarations();
                    const declaration = currentDeclarations[tagNumber];
                    if (!declaration) {
                        literalTagNumbers.add(tagNumber);
                        const literalText = `<${tagNumber}>`;
                        const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
                        targetArray.push(literalText);
                        break;
                    }
                    stack.push({
                        tagNumber,
                        children: [],
                        position: token.position,
                        declaration,
                        declarations: currentDeclarations
                    });
                }
                break;
            case 'TagClose':
                {
                    const { tagNumber } = token;
                    if (literalTagNumbers.has(tagNumber)) {
                        const literalText = `</${tagNumber}>`;
                        const literalTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
                        literalTargetArray.push(literalText);
                        literalTagNumbers.delete(tagNumber);
                        break;
                    }
                    if (stack.length === 0) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$TranslationParserError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TranslationParserError"](`Unexpected closing tag </${tagNumber}> at position ${token.position}`, token.position, translation);
                    }
                    const frame = stack.pop();
                    if (frame.tagNumber !== tagNumber) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$TranslationParserError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TranslationParserError"](`Mismatched tags: expected </${frame.tagNumber}> but got </${tagNumber}> at position ${token.position}`, token.position, translation);
                    }
                    const element = renderDeclarationNode(frame.declaration, frame.children, frame.declarations);
                    const elementTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
                    elementTargetArray.push(element);
                }
                break;
        }
    });
    if (stack.length > 0) {
        const unclosed = stack[stack.length - 1];
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$TranslationParserError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TranslationParserError"](`Unclosed tag <${unclosed.tagNumber}> at position ${unclosed.position}`, unclosed.position, translation);
    }
    return result;
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$TranslationParserError$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/TranslationParserError.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$htmlEntityDecoder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/htmlEntityDecoder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/tokenizer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$renderTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/renderTranslation.js [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransWithoutContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IcuTransWithoutContext",
    ()=>IcuTransWithoutContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$renderTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransUtils/renderTranslation.js [app-ssr] (ecmascript)");
;
;
;
;
function IcuTransWithoutContext({ i18nKey, defaultTranslation, content, ns, values = {}, i18n: i18nFromProps, t: tFromProps }) {
    const i18n = i18nFromProps || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    if (!i18n) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])(i18n, 'NO_I18NEXT_INSTANCE', `IcuTrans: You need to pass in an i18next instance using i18nextReactModule`, {
            i18nKey
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {}, defaultTranslation);
    }
    const t = tFromProps || i18n.t?.bind(i18n) || ((k)=>k);
    let namespaces = ns || t.ns || i18n.options?.defaultNS;
    namespaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(namespaces) ? [
        namespaces
    ] : namespaces || [
        'translation'
    ];
    let mergedValues = values;
    if (i18n.options?.interpolation?.defaultVariables) {
        mergedValues = values && Object.keys(values).length > 0 ? {
            ...values,
            ...i18n.options.interpolation.defaultVariables
        } : {
            ...i18n.options.interpolation.defaultVariables
        };
    }
    const translation = t(i18nKey, {
        defaultValue: defaultTranslation,
        ...mergedValues,
        ns: namespaces
    });
    try {
        const rendered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransUtils$2f$renderTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderTranslation"])(translation, content);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {}, ...rendered);
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(i18n, 'ICU_TRANS_RENDER_ERROR', `IcuTrans component error for key "${i18nKey}": ${error.message}`, {
            i18nKey,
            error
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {}, translation);
    }
}
IcuTransWithoutContext.displayName = 'IcuTransWithoutContext';
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTrans.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IcuTrans",
    ()=>IcuTrans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransWithoutContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
;
;
;
function IcuTrans({ i18nKey, defaultTranslation, content, ns, values = {}, i18n: i18nFromProps, t: tFromProps }) {
    const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["I18nContext"]) || {};
    const i18n = i18nFromProps || i18nFromContext || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    const t = tFromProps || i18n?.t.bind(i18n);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IcuTransWithoutContext"])({
        i18nKey,
        defaultTranslation,
        content,
        ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
        values,
        i18n,
        t: tFromProps
    });
}
IcuTrans.displayName = 'IcuTrans';
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTranslation",
    ()=>useTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.1/node_modules/use-sync-external-store/shim/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)");
;
;
;
;
const notReadyT = (k, optsOrDefaultValue)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(optsOrDefaultValue)) return optsOrDefaultValue;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(optsOrDefaultValue) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
    return Array.isArray(k) ? k[k.length - 1] : k;
};
const notReadySnapshot = {
    t: notReadyT,
    ready: false
};
const dummySubscribe = ()=>()=>{};
const useTranslation = (ns, props = {})=>{
    const { i18n: i18nFromProps } = props;
    const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["I18nContext"]) || {};
    const i18n = i18nFromProps || i18nFromContext || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReportNamespaces"]();
    if (!i18n) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warnOnce"])(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next');
    }
    const i18nOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaults"])(),
            ...i18n?.options?.react,
            ...props
        }), [
        i18n,
        props
    ]);
    const { useSuspense, keyPrefix } = i18nOptions;
    const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
    const unstableNamespaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(nsOrContext) ? [
        nsOrContext
    ] : nsOrContext || [
        'translation'
    ];
    const namespaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>unstableNamespaces, unstableNamespaces);
    i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);
    const revisionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const subscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>{
        if (!i18n) return dummySubscribe;
        const { bindI18n, bindI18nStore } = i18nOptions;
        const wrappedCallback = ()=>{
            revisionRef.current += 1;
            callback();
        };
        if (bindI18n) i18n.on(bindI18n, wrappedCallback);
        if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
        return ()=>{
            if (bindI18n) bindI18n.split(' ').forEach((e)=>i18n.off(e, wrappedCallback));
            if (bindI18nStore) bindI18nStore.split(' ').forEach((e)=>i18n.store.off(e, wrappedCallback));
        };
    }, [
        i18n,
        i18nOptions
    ]);
    const snapshotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!i18n) {
            return notReadySnapshot;
        }
        const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every((n)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasLoadedNamespace"])(n, i18n, i18nOptions));
        const currentLng = props.lng || i18n.language;
        const currentRevision = revisionRef.current;
        const lastSnapshot = snapshotRef.current;
        if (lastSnapshot && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.keyPrefix === keyPrefix && lastSnapshot.revision === currentRevision) {
            return lastSnapshot;
        }
        const calculatedT = i18n.getFixedT(currentLng, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
        const newSnapshot = {
            t: calculatedT,
            ready: calculatedReady,
            lng: currentLng,
            keyPrefix,
            revision: currentRevision
        };
        snapshotRef.current = newSnapshot;
        return newSnapshot;
    }, [
        i18n,
        namespaces,
        keyPrefix,
        i18nOptions,
        props.lng
    ]);
    const [loadCount, setLoadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const { t, ready } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getSnapshot);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (i18n && !ready && !useSuspense) {
            const onLoaded = ()=>setLoadCount((c)=>c + 1);
            if (props.lng) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadLanguages"])(i18n, props.lng, namespaces, onLoaded);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadNamespaces"])(i18n, namespaces, onLoaded);
            }
        }
    }, [
        i18n,
        props.lng,
        namespaces,
        ready,
        useSuspense,
        loadCount
    ]);
    const finalI18n = i18n || {};
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wrapperLangRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const createI18nWrapper = (original)=>{
        const descriptors = Object.getOwnPropertyDescriptors(original);
        if (descriptors.__original) delete descriptors.__original;
        const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);
        if (!Object.prototype.hasOwnProperty.call(wrapper, '__original')) {
            try {
                Object.defineProperty(wrapper, '__original', {
                    value: original,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (_) {}
        }
        return wrapper;
    };
    const ret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const original = finalI18n;
        const lang = original?.language;
        let i18nWrapper = original;
        if ("TURBOPACK compile-time truthy", 1) {
            if (wrapperRef.current && wrapperRef.current.__original === original) {
                if (wrapperLangRef.current !== lang) {
                    i18nWrapper = createI18nWrapper(original);
                    wrapperRef.current = i18nWrapper;
                    wrapperLangRef.current = lang;
                } else {
                    i18nWrapper = wrapperRef.current;
                }
            } else {
                i18nWrapper = createI18nWrapper(original);
                wrapperRef.current = i18nWrapper;
                wrapperLangRef.current = lang;
            }
        }
        const arr = [
            t,
            i18nWrapper,
            ready
        ];
        arr.t = t;
        arr.i18n = i18nWrapper;
        arr.ready = ready;
        return arr;
    }, [
        t,
        finalI18n,
        ready,
        finalI18n.resolvedLanguage,
        finalI18n.language,
        finalI18n.languages
    ]);
    if (i18n && useSuspense && !ready) {
        throw new Promise((resolve)=>{
            const onLoaded = ()=>resolve();
            if (props.lng) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadLanguages"])(i18n, props.lng, namespaces, onLoaded);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadNamespaces"])(i18n, namespaces, onLoaded);
            }
        });
    }
    return ret;
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/withTranslation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withTranslation",
    ()=>withTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)");
;
;
;
const withTranslation = (ns, options = {})=>function Extend(WrappedComponent) {
        function I18nextWithTranslation({ forwardedRef, ...rest }) {
            const [t, i18n, ready] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])(ns, {
                ...rest,
                keyPrefix: options.keyPrefix
            });
            const passDownProps = {
                ...rest,
                t,
                i18n,
                tReady: ready
            };
            if (options.withRef && forwardedRef) {
                passDownProps.ref = forwardedRef;
            } else if (!options.withRef && forwardedRef) {
                passDownProps.forwardedRef = forwardedRef;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(WrappedComponent, passDownProps);
        }
        I18nextWithTranslation.displayName = `withI18nextTranslation(${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDisplayName"])(WrappedComponent)})`;
        I18nextWithTranslation.WrappedComponent = WrappedComponent;
        const forwardRef = (props, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(I18nextWithTranslation, Object.assign({}, props, {
                forwardedRef: ref
            }));
        return options.withRef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(forwardRef) : I18nextWithTranslation;
    };
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/Translation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Translation",
    ()=>Translation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
;
const Translation = ({ ns, children, ...options })=>{
    const [t, i18n, ready] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])(ns, options);
    return children(t, {
        i18n,
        lng: i18n.language
    }, ready);
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/I18nextProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nextProvider",
    ()=>I18nextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
;
;
function I18nextProvider({ i18n, defaultNS, children }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            i18n,
            defaultNS
        }), [
        i18n,
        defaultNS
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["I18nContext"].Provider, {
        value
    }, children);
}
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useSSR.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSSR",
    ()=>useSSR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
;
;
const useSSR = (initialI18nStore, initialLanguage, props = {})=>{
    const { i18n: i18nFromProps } = props;
    const { i18n: i18nFromContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["I18nContext"]) || {};
    const i18n = i18nFromProps || i18nFromContext || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getI18n"])();
    if (i18n.options?.isClone) return;
    if (initialI18nStore && !i18n.initializedStoreOnce) {
        i18n.services.resourceStore.data = initialI18nStore;
        i18n.options.ns = Object.values(initialI18nStore).reduce((mem, lngResources)=>{
            Object.keys(lngResources).forEach((ns)=>{
                if (mem.indexOf(ns) < 0) mem.push(ns);
            });
            return mem;
        }, i18n.options.ns);
        i18n.initializedStoreOnce = true;
        i18n.isInitialized = true;
    }
    if (initialLanguage && !i18n.initializedLanguageOnce) {
        i18n.changeLanguage(initialLanguage);
        i18n.initializedLanguageOnce = true;
    }
};
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/withSSR.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withSSR",
    ()=>withSSR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useSSR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useSSR.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/utils.js [app-ssr] (ecmascript)");
;
;
;
;
const withSSR = ()=>function Extend(WrappedComponent) {
        function I18nextWithSSR({ initialI18nStore, initialLanguage, ...rest }) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useSSR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSSR"])(initialI18nStore, initialLanguage);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(WrappedComponent, {
                ...rest
            });
        }
        I18nextWithSSR.getInitialProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["composeInitialProps"])(WrappedComponent);
        I18nextWithSSR.displayName = `withI18nextSSR(${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDisplayName"])(WrappedComponent)})`;
        I18nextWithSSR.WrappedComponent = WrappedComponent;
        return I18nextWithSSR;
    };
}),
"[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "date",
    ()=>date,
    "number",
    ()=>number,
    "plural",
    ()=>plural,
    "select",
    ()=>select,
    "selectOrdinal",
    ()=>selectOrdinal,
    "time",
    ()=>time
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$Trans$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/Trans.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$TransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/TransWithoutContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTrans$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTrans.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$IcuTransWithoutContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/IcuTransWithoutContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$withTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/withTranslation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$Translation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/Translation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$I18nextProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/I18nextProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$withSSR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/withSSR.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useSSR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/useSSR.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/initReactI18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$defaults$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/defaults.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$i18nInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/i18nInstance.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$i18next$40$16$2e$5$2e$4_i18next$40$25$2e$8$2e$14_typescript$40$5$2e$9$2e$3_$5f$react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-i18next@16.5.4_i18next@25.8.14_typescript@5.9.3__react-dom@19.2.1_react@19.2.1__react@19.2.1_typescript@5.9.3/node_modules/react-i18next/dist/es/context.js [app-ssr] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const date = ()=>'';
const time = ()=>'';
const number = ()=>'';
const select = ()=>'';
const plural = ()=>'';
const selectOrdinal = ()=>'';
}),
];

//# sourceMappingURL=37322_react-i18next_dist_es_e84a7f3f._.js.map