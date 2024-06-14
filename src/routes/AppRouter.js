import { useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ManageAssetPage from "../pages/ManageAssetPage";
import ManageAssignmentPage from "../pages/ManageAssignmentPage";
import ManageUserPage from "../pages/ManageUserPage";
import ReportPage from "../pages/ReportPage";
import RequestForReturningPage from "../pages/RequestForReturningPage";
import CreateUser from "../pages/users/CreateUser";
import { path } from "./routeContants";

export const AppRouter = () => {
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
