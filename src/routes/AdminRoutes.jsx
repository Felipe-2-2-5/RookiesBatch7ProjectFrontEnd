import { useRoutes } from "react-router-dom";
import RequireAuth from "../components/RequiredAuth";
import {
  CreateUser,
  HomePage,
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
      element: <HomePage />,
      errorElement: <NotFound />,
    },
    {
      path: path.home,
      element: (
        <RequireAuth>
          <MyAssignmentPage />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.login,
      element: <LoginPage />,
      errorElement: <NotFound />,
    },
    {
      path: path.users,
      element: (
        <RequireAuth>
          <ManageUserPage />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.userCreate,
      element: (
        <RequireAuth>
          <CreateUser />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.userEdit,
      element: (
        <RequireAuth>
          <EditUser />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assignmentCreate,
      element: (
        <RequireAuth>
          <CreateAssignment />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assignmentEdit,
      element: (
        <RequireAuth>
          <EditAssignment />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assets,
      element: (
        <RequireAuth>
          <ManageAssetPage />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assetCreate,
      element: (
        <RequireAuth>
          <CreateAsset />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assetEdit,
      element: (
        <RequireAuth>
          <EditAsset />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
    },
    {
      path: path.assignments,
      element: (
        <RequireAuth>
          <ManageAssignmentPage />
        </RequireAuth>
      ),
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
