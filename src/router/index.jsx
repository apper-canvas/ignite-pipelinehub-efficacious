import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";
import Root from "@/layouts/Root";

// Lazy load page components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Companies = lazy(() => import('@/components/pages/Companies'));
const Contacts = lazy(() => import('@/components/pages/Contacts'));
const Pipeline = lazy(() => import('@/components/pages/Pipeline'));
const Activities = lazy(() => import('@/components/pages/Activities'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const Callback = lazy(() => import('@/components/pages/Callback'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'));
// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

// createRoute helper function
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};
// Main application routes
const mainRoutes = [
  createRoute({
    index: true,
    element: <Dashboard />,
    title: 'Dashboard'
  }),
  createRoute({
    path: 'companies',
    element: <Companies />,
    title: 'Companies'
  }),
  createRoute({
    path: 'contacts', 
    element: <Contacts />,
    title: 'Contacts'
  }),
  createRoute({
    path: 'pipeline',
    element: <Pipeline />,
    title: 'Pipeline'
  }),
  createRoute({
    path: 'activities',
    element: <Activities />,
    title: 'Activities'
  }),
  createRoute({
    path: '*',
    element: <NotFound />,
    title: 'Page Not Found'
  })
];

// Authentication routes
const authRoutes = [
  createRoute({
    path: 'login',
    element: <Login />,
    title: 'Login'
  }),
  createRoute({
    path: 'signup', 
    element: <Signup />,
    title: 'Sign Up'
  }),
  createRoute({
    path: 'callback',
    element: <Callback />,
    title: 'Authentication Callback'
  }),
  createRoute({
    path: 'error',
    element: <ErrorPage />,
    title: 'Error'
  }),
  createRoute({
    path: 'reset-password/:appId/:fields',
    element: <ResetPassword />,
    title: 'Reset Password'
  }),
  createRoute({
    path: 'prompt-password/:appId/:emailAddress/:provider',
    element: <PromptPassword />,
    title: 'Prompt Password'
  })
];

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Authentication routes (public)
      ...authRoutes,
      
      // Main application (protected by RLS)
      {
        path: '',
        element: <Layout />,
        children: mainRoutes
      }
    ]
  }
]);