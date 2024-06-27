import { ArrowDropDown } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { ChangePasswordDialog } from "./";
import PopupNotificationExtra from "./PopupNotifycationExtra";

const Header = () => {
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const { isAuthenticated, currentUser, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleOpenChangePassword = () => {
    setAnchorEl(null);
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelConfirm = () => {
    setOpenCancelPopup(false);
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    localStorage.removeItem("location");
    setIsAuthenticated(false);
    navigate("/login");
    window.location.reload();
  };

  const handleCancelClose = () => {
    setOpenCancelPopup(false);
  };

  const handleLogout = () => {
    setOpenCancelPopup(true);
  };

  const formattedPathname = location.pathname
    .split("/")
    .filter((x) => x)
    .filter((x) => !/^\d+$/.test(x))
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
            {isAuthenticated ? (
              <div>
                <Button
                  color="inherit"
                  onClick={handleClick}>
                  {currentUser.name}
                  <ArrowDropDown />
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}>
                  <MenuItem onClick={handleOpenChangePassword}>
                    Change Password
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                <ChangePasswordDialog
                  open={changePasswordOpen}
                  handleClose={handleCloseChangePassword}
                />
              </div>
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
