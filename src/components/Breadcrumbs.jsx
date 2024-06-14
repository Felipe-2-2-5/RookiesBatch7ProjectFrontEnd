import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Breadcrumbs = () => {
  const location = useLocation();
  const { currentUser } = useAuthContext();
  const pathnames = location.pathname.split("/").filter((x) => x);
  console.log(pathnames);
  console.log(currentUser.role);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      <Typography color="textPrimary">{currentUser?.role}</Typography>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Typography
            color="textPrimary"
            key={to}>
            {value}
          </Typography>
        ) : (
          <RouterLink
            color="inherit"
            to={to}
            key={to}>
            {value}
          </RouterLink>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
