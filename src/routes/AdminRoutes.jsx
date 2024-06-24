import { useRoutes } from "react-router-dom";
import RequireAuth from "../components/RequiredAuth";
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
import CreateAssignment from "../pages/assignments/CreateAssignment";
import CreateAsset from "../pages/assets/CreateAsset";
import EditAssignment from "../pages/assignments/EditAssignment";
import EditUser from "../pages/users/EditUser";
import EditAsset from "../pages/assets/EditAsset";

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
      element: <ManageAssetPage />,
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
