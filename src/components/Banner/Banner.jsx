import React from 'react';
import Text from '../Text';

const Banner = ({ message, sx }) => {
    return (
        <Text sx={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            transform: 'translate(50%, -50%)',
            color: 'yellow',
            px: 'lg',
            py: 'sm',
            border: 'solid 1px',
            borderColor: 'white',
            borderRadius: '0.25rem',
            textAlign: 'center',
            backgroundColor: '#030',
            boxShadow: '0 0 10px #000',
            ...sx,
        }}>
            {message}
        </Text>
    );
};

export default Banner;