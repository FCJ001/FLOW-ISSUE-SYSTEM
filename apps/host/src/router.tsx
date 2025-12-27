// host/src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import WebAppPage from './pages/WebAppPage';

export const router = createBrowserRouter([
    {
        path: '/web/*', // 注意这里要加 *
        element: <WebAppPage />,
    },
    {
        path: '/',
        element: <div>Home</div>,
    },
]);