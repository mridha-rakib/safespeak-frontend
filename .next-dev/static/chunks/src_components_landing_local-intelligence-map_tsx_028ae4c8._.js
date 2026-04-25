(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/landing/local-intelligence-map.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocalIntelligenceMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const HOTSPOTS = [
    {
        left: "41%",
        top: "55%",
        size: "h-20 w-20"
    },
    {
        left: "56%",
        top: "38%",
        size: "h-16 w-16"
    },
    {
        left: "67%",
        top: "62%",
        size: "h-14 w-14"
    }
];
function Hotspot(param) {
    let { left, top, size } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "absolute ".concat(size, " -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#f29a1f]/85 shadow-[0_10px_24px_rgba(242,154,31,0.35)]"),
        style: {
            left,
            top
        },
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        }, void 0, false, {
            fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = Hotspot;
function MapLine(param) {
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "absolute rounded-full bg-white/40 ".concat(className)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c1 = MapLine;
function LocalIntelligenceMap() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#b9d4cc_0%,#d7e4df_45%,#b8c9c4_100%)]",
        "aria-label": "Stylized local intelligence map with active nearby zones",
        role: "img",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-70",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[-8%] top-[20%] h-7 w-[62%] rotate-12"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[34%] top-[18%] h-6 w-[80%] -rotate-[24deg]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[-6%] top-[70%] h-8 w-[74%] -rotate-[18deg]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[54%] top-[62%] h-7 w-[58%] rotate-[18deg]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[20%] top-[-10%] h-[120%] w-7 rotate-[18deg]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapLine, {
                        className: "left-[76%] top-[-8%] h-[118%] w-6 -rotate-[12deg]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:72px_72px]"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            HOTSPOTS.map((hotspot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Hotspot, {
                    left: hotspot.left,
                    top: hotspot.top,
                    size: hotspot.size
                }, "".concat(hotspot.left, "-").concat(hotspot.top), false, {
                    fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-[50%] top-[50%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#01579b] shadow-[0_8px_18px_rgba(1,87,155,0.35)]",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/local-intelligence-map.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c2 = LocalIntelligenceMap;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Hotspot");
__turbopack_context__.k.register(_c1, "MapLine");
__turbopack_context__.k.register(_c2, "LocalIntelligenceMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/local-intelligence-map.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/landing/local-intelligence-map.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_landing_local-intelligence-map_tsx_028ae4c8._.js.map