// components/Layout.js
import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import VerticalNavbar from './VerticalNavbar';

const Layout = ({ children, title }) => { // Add a title prop
    return (
        <div>
            <CssBaseline />
            <Header title={title} />
            <Box display="flex" paddingTop={2} paddingLeft={2}>
                <Box>
                    <VerticalNavbar />
                </Box>
                <main>
                    {children}
                </main>
            </Box>
            <Footer />
        </div>
    );
};

export default Layout;
