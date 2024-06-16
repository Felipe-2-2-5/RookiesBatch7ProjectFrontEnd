import { useRoutes } from "react-router-dom";
import {
  CreateUser,
  HomePage,
  LoginPage,
  ManageAssetPage,
  ManageAssignmentPage,
  ManageUserPage,
  NotFound,
  ReportPage,
  RequestForReturningPage,
} from "../pages";
import { path } from "./routeContants";

export const AdminRoutes = () => {
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
    {
      path: path.users,
      element: <ManageUserPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.userCreate,
      element: <CreateUser />,
      errorElement: <NotFound />,
    },
    {
      path: path.assets,
      element: <ManageAssetPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.assignments,
      element: <ManageAssignmentPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.requestForReturning,
      element: <RequestForReturningPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.report,
      element: <ReportPage />,
      errorElement: <NotFound />,
    },
  ]);
  return element;
};
