import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/nashTech-logo-red.svg"; // replace with your logo path
import { useAuthContext } from "../context/AuthContext";

const VerticalNavbarAdmin = () => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  return (
    <Box
      sx={{ bgcolor: "grey.300", position: "sticky", top: 64, width: "300px" }}
    >
      <Box
        sx={{
          bgcolor: "white",
          padding: "1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "100px", height: "100px" }} />
        <Typography variant="h6" style={{ color: "#D6001C" }}>
          <b>Online Asset Management</b>
        </Typography>
      </Box>
      <List component="nav">
        <ListItem
          button
          component={Link}
          to="/home"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/home") && "#D6001C",
            color:
              location.pathname.startsWith("/home") && "white",
          }}
        >
          <ListItemText primary={<b>Home</b>} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/manage-user"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/manage-user") && "#D6001C",
            color:
              location.pathname.startsWith("/manage-user") && "white",
          }}
        >
          <ListItemText primary={<b>Manage User</b>} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/manage-asset"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/manage-asset") && "#D6001C",
            color: location.pathname.startsWith("/manage-asset") && "white",
          }}
        >
          <ListItemText primary={<b>Manage Asset</b>} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/manage-assignment"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/manage-assignment") && "#D6001C",
            color: location.pathname.startsWith("/manage-assignment") && "white",
          }}
        >
          <ListItemText primary={<b>Manage Assignment</b>} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/request-for-returning"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/request-for-returning") && "#D6001C",
            color: location.pathname.startsWith("/request-for-returning") && "white",
          }}
        >
          <ListItemText primary={<b>Request for Returning</b>} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/report"
          sx={{
            "&:hover": {
              bgcolor: "#D6001C",
              "& .MuiListItemText-primary": { color: "white" },
            },
            backgroundColor:
              location.pathname.startsWith("/report") && "#D6001C",
            color: location.pathname.startsWith("/report") && "white",
          }}
        >
          <ListItemText primary={<b>Report</b>} />
        </ListItem>
      </List>
    </Box>
  );
};

export default VerticalNavbarAdmin;
