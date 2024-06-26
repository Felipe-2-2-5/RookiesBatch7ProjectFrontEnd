import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import PopupNotificationExtra from "./PopupNotifycationExtra";

const Header = () => {
  const { isAuthenticated, currentUser } = useAuthContext();
  const { setIsAuthenticated } = useAuthContext();
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCancelConfirm = () => {
    setOpenCancelPopup(false);
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    window.location.reload();
    navigate("/login");
  };

  const handleCancelClose = () => {
    setOpenCancelPopup(false);
  };

  const handleLogout = () => {
    setOpenCancelPopup(true);
    setIsAuthenticated(true);
  };

  const formattedPathname = location.pathname
    .split("/")
    .filter((x) => x)
    .map((x) => x.replace(/-/g, " "))
    .map((x) => x.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" > ");

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ bgcolor: "#D6001C", zIndex: 1100 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Breadcrumbs separator=" > ">
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

      <PopupNotificationExtra
        open={openCancelPopup}
        title="Are you sure?"
        content="Do you want to log out?"
        Okbutton="Log out"
        handleClose={handleCancelClose}
        handleConfirm={handleCancelConfirm}
      />

    </>
  );
};

export default Header;
