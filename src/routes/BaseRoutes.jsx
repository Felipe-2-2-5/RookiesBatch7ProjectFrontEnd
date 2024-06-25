import React from "react";
import { useRoutes } from "react-router-dom";
import { HomePage, LoginPage, NotFound } from "../pages";
import { path } from ".";

export const BaseRoutes = () => {
  const element = useRoutes([
    {
      path: path.default,
      element: <HomePage />,
      errorElement: <NotFound />,
    },
    {
      path: path.home,
      element: <HomePage />,
      errorElement: <NotFound />,
    },
    {
      path: path.login,
      element: <LoginPage />,
      errorElement: <NotFound />,
    },
  ]);
  return element;
};
