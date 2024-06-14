import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, currentUser } = useAuthContext();
  const { setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsAuthenticated(true);
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    navigate("/login");
    window.location.reload();
  };

  const formattedPathname = location.pathname
    .split("/")
    .filter((x) => x)
    .map((x) => x.replace(/-/g, " "))
    .map((x) => x.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" > ");

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "#D6001C", zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Breadcrumbs separator=" > ">
            {/* <Typography
              color="textPrimary"
              sx={{ fontSize: "1.2em", fontWeight: "bold", color: "#fff" }}>
              {currentUser.role.toUpperCase()}
            </Typography> */}
            <Typography
              color="textPrimary"
              sx={{ fontSize: "1.2em", fontWeight: "bold", color: "#fff" }}>
              {formattedPathname}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated && (
            <Typography
              variant="body1"
              color="inherit"
              sx={{ marginRight: 1 }}>
              Welcome, {currentUser.name}!
            </Typography>
          )}
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              href="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
