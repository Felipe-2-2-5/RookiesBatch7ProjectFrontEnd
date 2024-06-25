import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ color: "#D6001C", fontWeight: "bold", mt: 3 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ color: "#D6001C", fontWeight: "bold" }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          Return to <a href="/">Home</a>
        </Typography>
      </Box>
    </Paper>
  );
};

export default NotFound;
