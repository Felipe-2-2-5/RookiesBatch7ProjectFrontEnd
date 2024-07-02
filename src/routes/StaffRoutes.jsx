import React from "react";
import { useRoutes } from "react-router-dom";
import { LoginPage, MyAssignmentPage, NotFound } from "../pages";
import { path } from "./";

export const StaffRoutes = () => {
  const element = useRoutes([
    {
      path: path.default,
      element: <MyAssignmentPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.home,
      element: <MyAssignmentPage />,
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
    {
      path: path.staffAssignment,
      element: <MyAssignmentPage />,
      errorElement: <NotFound />,
    }
  ]);
  return element;
};
