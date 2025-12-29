// host/src/router.tsx
import { createHashRouter } from 'react-router-dom';

import WebAppPage from './pages/WebAppPage';

export const router = createHashRouter([
  {
    path: '/web/*',
    element: <WebAppPage />,
  },
  {
    path: '/',
    element: <div>Home</div>,
  },
]);
