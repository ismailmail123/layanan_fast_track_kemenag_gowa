// import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/Homepage';
// import NotFound from "../pages/404";
const Index = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: 
          <HomePage />
      
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