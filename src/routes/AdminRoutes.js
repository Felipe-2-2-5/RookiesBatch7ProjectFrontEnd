import { useRoutes } from "react-router-dom";
import {
  CreateUser,
  HomePage,
  LoginPage,
  ManageAssetPage,
  ManageAssignmentPage,
  ManageUserPage,
  ReportPage,
  RequestForReturningPage,
} from "../pages";
import { path } from "./routeContants";

export const AdminRoutes = () => {
  const element = useRoutes([
    {
      path: path.home,
      element: <HomePage />,
    },
    {
      path: path.login,
      element: <LoginPage />,
    },
    {
      path: path.users,
      element: <ManageUserPage />,
    },
    {
      path: path.userCreate,
      element: <CreateUser />,
    },
    {
      path: path.assets,
      element: <ManageAssetPage />,
    },
    {
      path: path.assignments,
      element: <ManageAssignmentPage />,
    },
    {
      path: path.requestForReturning,
      element: <RequestForReturningPage />,
    },
    {
      path: path.report,
      element: <ReportPage />,
    },
  ]);
  return element;
};
