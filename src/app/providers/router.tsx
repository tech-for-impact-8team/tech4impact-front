import { createBrowserRouter } from 'react-router';
import RootLayout from '@app/layouts/RootLayout.tsx';
import DashboardPage from '@dashboard/ui/DashboardPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
]);
