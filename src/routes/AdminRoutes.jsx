import { useRoutes } from "react-router-dom";
import {
  CreateUser,
  LoginPage,
  ManageAssetPage,
  ManageAssignmentPage,
  ManageUserPage,
  MyAssignmentPage,
  NotFound,
  RequestForReturningPage,
} from "../pages";
import CreateAsset from "../pages/assets/CreateAsset";
import EditAsset from "../pages/assets/EditAsset";
import CreateAssignment from "../pages/assignments/CreateAssignment";
import EditAssignment from "../pages/assignments/EditAssignment";
import ReportPage from "../pages/reports/ReportPage";
import EditUser from "../pages/users/EditUser";
import { path } from "./routeContants";

export const AdminRoutes = () => {
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
      path: path.userEdit,
      element: <EditUser />,
      errorElement: <NotFound />,
    },
    {
      path: path.assignmentCreate,
      element: <CreateAssignment />,
      errorElement: <NotFound />,
    },
    {
      path: path.assignmentEdit,
      element: <EditAssignment />,
      errorElement: <NotFound />,
    },
    {
      path: path.assets,
      element: <ManageAssetPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.assetCreate,
      element: <CreateAsset />,
      errorElement: <NotFound />,
    },
    {
      path: path.assetEdit,
      element: <EditAsset />,
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
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return element;
};
