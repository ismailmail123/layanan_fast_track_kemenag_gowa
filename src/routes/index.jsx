// import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/Homepage';
import Service from '../pages/PageRegistService';
// import NotFound from "../pages/404";
const Index = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: 
          <HomePage />
      
    },    
    {
      path: '/register-service',
      element: 
          <Service />
      
    },    
    
    // {
    //   path: '/notfound',
    //   element: (
    //       <NotFound />
    //   ),
    // },
    // {
    //   path: '*', 
    //   element: <NotFound />,
    // },
  ]);

  return <RouterProvider router={router} />;
};

export default Index;