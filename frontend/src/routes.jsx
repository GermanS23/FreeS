import React from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './components/login/Login';
import Dashboard from './components/Dashboard';

const routes = (isLoggedIn, setIsLoggedIn) => [
  {
    path: '/',
    element: isLoggedIn ? <AppLayout setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      // Add more routes here for components within AppLayout
    ],
  },
  {
    path: '/login',
    element: isLoggedIn ? (
      <Navigate to="/" />
    ) : (
      <Login setIsLoggedIn={setIsLoggedIn} />
    ),
  },
];

export default routes;

