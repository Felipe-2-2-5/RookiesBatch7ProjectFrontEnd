// pages/ReportPage.js
import React from 'react';
import Layout from '../components/Layout';
import { Typography } from '@mui/material';

const ReportPage = () => {
    return (
        <Layout title="-> Report">
            <Typography variant="h5" component="h2" style={{ color: '#D6001C', fontWeight: 'bold' }}>
                Report
            </Typography>
            <p>This is the Report page.</p>
        </Layout>
    );
};

export default ReportPage;
