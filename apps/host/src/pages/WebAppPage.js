import { jsx as _jsx } from "react/jsx-runtime";
// host/src/pages/WebAppPage.tsx
import React, { Suspense } from 'react';
const WebApp = React.lazy(() => import('web/App'));
export default function WebAppPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { children: "Loading Web App..." }), children: _jsx(WebApp, {}) }));
}
