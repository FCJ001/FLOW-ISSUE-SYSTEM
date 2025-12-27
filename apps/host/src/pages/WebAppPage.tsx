// host/src/pages/WebAppPage.tsx
import React, { Suspense } from 'react';

const WebApp = React.lazy(() => import('web/App'));

export default function WebAppPage() {
    return (
        <Suspense fallback={<div>Loading Web App...</div>}>
            <WebApp />
        </Suspense>
    );
}