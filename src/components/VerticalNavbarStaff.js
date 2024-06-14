import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/nashTech-logo-red.svg";
import { useAuthContext } from "../context/AuthContext";

const VerticalNavbarStaff = () => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  return (
    <Box
      sx={{ bgcolor: "grey.300", position: "sticky", top: 64, width: "300px" }}>
      <Box
        sx={{
          bgcolor: "white",
          padding: "1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}>
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "100px", height: "100px" }}
        />
        <Typography
          variant="h6"
          style={{ color: "#D6001C" }}>
          <b>Online Asset Management</b>
        </Typography>
      </Box>
      <List component="nav">
        <ListItem
          button
          component={Link}
          to="/"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/home") && "#D6001C",
            color:
              location.pathname.startsWith("/home") && "white",
          }}>
          <ListItemText primary={<b>Home</b>} />
        </ListItem>
      </List>
    </Box>
  );
};

export default VerticalNavbarStaff;
