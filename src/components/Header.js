// components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

const Header = ({ title }) => {
  return (
    <AppBar position="sticky" sx={{ bgcolor: '#D6001C', zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Asset Management System {title}
        </Typography>
        <Box>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
