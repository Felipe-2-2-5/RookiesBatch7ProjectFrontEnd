import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const HomePage = () => {
  return (
    <Paper
      elevation={3}
      sx={{ p: 3, mt: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{ color: "#D6001C", fontWeight: "bold", mt: 3 }}>
          Welcome to the <br />
          Asset Management System
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 2 }}>
          Experience the power of efficient and effective asset management with
          our state-of-the-art, user-friendly interface.
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2 }}>
          Our system is designed to provide a comprehensive solution for
          tracking and managing your assets. Leveraging real-time data and
          insightful analytics, we empower you to make informed decisions that
          optimize your asset utilization and performance. Experience the
          difference with our robust and reliable asset management platform.
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2 }}>
          Join the ranks of our satisfied customers who trust us for their asset
          management needs. Let's redefine asset management together.
        </Typography>
      </Box>
    </Paper>
  );
};

export default HomePage;
