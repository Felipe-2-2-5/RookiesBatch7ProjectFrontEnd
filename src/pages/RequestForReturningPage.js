// pages/RequestForReturningPage.js
import React from 'react';
import Layout from '../components/Layout';
import { Typography } from '@mui/material';

const RequestForReturningPage = () => {
    return (
        <Layout title="-> Request for Returning">
            <Typography variant="h5" component="h2" style={{ color: '#D6001C', fontWeight: 'bold' }}>
                Request for Returning
            </Typography>
            <p>This is the Request for Returning page.</p>
        </Layout>
    );
};

export default RequestForReturningPage;
