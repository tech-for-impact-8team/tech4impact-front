import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@app/layouts/RootLayout.tsx';
import { DashboardPage } from '@dashboard/ui/DashboardPage.tsx';
import { StatisticsPage } from '@pages/statistics/ui/StatisticsPage.tsx';
import { HomePage } from '@pages/home/ui/HomePage.tsx';
// import MyPage from '@pages/my/ui/MyPage.tsx';
import EditPage from '@pages/my/ui/EditPage.tsx';
import { DataUploadPage } from '@pages/addData/ui/DataUploadPage.tsx';
import { LoginPage } from '@pages/auth/ui/LoginPage';
import { SignupPage } from '@pages/auth/ui/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'my',
        element: <EditPage />,
      },
      {
        path: '/my/edit',
        element: <EditPage />,
      },
      {
        path: '/upload',
        element: <DataUploadPage />,
      },
    ],
  },
]);
