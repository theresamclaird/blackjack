import React from 'react';
import { Box, Flex } from '../Box';

export const Seat = ({ bet }) => {
    return (
        <Box sx={{
            border: 'solid 2px',
            borderColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 0 10px #333',
        }}>
            <Flex sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '8vw',
                height: '12vw',
                borderRadius: '20px',
                boxShadow: 'inset 0 0 5vw #003300',
            }}>{bet}</Flex>
        </Box>
    );
};