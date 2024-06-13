// pages/ManageAssetPage.js
import React from 'react';
import Layout from '../components/Layout';
import { Typography } from '@mui/material';

const ManageAssetPage = () => {
    return (
        <Layout title="-> Manage Asset">
            <Typography variant="h5" component="h2" style={{ color: '#D6001C', fontWeight: 'bold' }}>
                Manage Asset
            </Typography>
            <p>This is the Manage Asset page.</p>
        </Layout>
    );
};

export default ManageAssetPage;
