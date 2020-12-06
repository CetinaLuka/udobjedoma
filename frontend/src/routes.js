import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';

import LuciView  from 'src/views/luci';
import PivoView  from 'src/views/pivo';
import ZvocnikiView from 'src/views/zvocniki';
import ObvestilaView from 'src/views/zvocniki';

const routes = [
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'luci', element: <LuciView /> },
      { path: 'pivo', element: <PivoView /> },
      { path: 'zvocniki', element: <ZvocnikiView /> },
      { path: 'racun', element: <AccountView /> },
      { path: 'nastavitve', element: <SettingsView /> },
      { path: 'obvestila', element: <ObvestilaView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
