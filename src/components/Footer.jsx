import { Box, Link, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleClick = (message) => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "#D6001C",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        borderTop: "1px solid #fff",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1100,
      }}>
      <Typography
        variant="body1"
        align="center"
        color="white">
        © {currentYear} Asset Management System {" | "} All Rights Reserved{" "}
        {" | "}
        <Link
          href="#"
          color="inherit"
          underline="hover"
          onClick={() => handleClick("This is Terms of Service")}>
          Terms of Service
        </Link>{" "}
        {" | "}
        <Link
          href="#"
          color="inherit"
          underline="hover"
          onClick={() => handleClick("This is Privacy Policy")}>
          Privacy Policy
        </Link>
      </Typography>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <MuiAlert
          onClose={handleClose}
          severity="info"
          elevation={6}
          variant="filled"
          sx={{ bgcolor: "#D6001C" }}>
          {message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
