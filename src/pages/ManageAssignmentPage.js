// pages/ManageAssignmentPage.js
import React from 'react';
import Layout from '../components/Layout';
import { Typography } from '@mui/material';

const ManageAssignmentPage = () => {
    return (
        <Layout title="-> Manage Assignment">
            <Typography variant="h5" component="h2" style={{ color: '#D6001C', fontWeight: 'bold' }}>
                Manage Assignment
            </Typography>
            <p>This is the Manage Assignment page.</p>
        </Layout>
    );
};

export default ManageAssignmentPage;
