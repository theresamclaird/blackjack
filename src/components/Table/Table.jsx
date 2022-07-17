import React from 'react';
import Box from '../Box';

const Table = ({ children }) => {
    return (
        <Box sx={{ bg: 'feltGreen', width: '100vw', height: '100vh' }}>
            {children}
        </Box>
    );
};

export default Table;