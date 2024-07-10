import React from "react";
import { useRoutes } from "react-router-dom";
import { path } from ".";
import { HomePage, LoginPage, NotFound } from "../pages";

export const BaseRoutes = () => {
  const element = useRoutes([
    {
      path: path.default,
      element: <LoginPage />,
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
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return element;
};
