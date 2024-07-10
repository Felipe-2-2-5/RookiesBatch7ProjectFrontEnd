import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingSpinner = ({ loading }) => {
    if (!loading) return null;

    return (
        <div style={{
            position: 'fixed', // Overlay and spinner are fixed to cover the whole screen
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(211, 211, 211, 0.5)', // Light gray overlay with some transparency
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000 // Ensures it is on top of other content
        }}>
            <CircularProgress sx={{ color: '#D32F2F' }} />
        </div>
    );
};

export default LoadingSpinner;