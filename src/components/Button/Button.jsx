import React from 'react';
import { Box } from '../Box';

// todo add Variants.

const Button = ({ sx, children, ...props }) => (
  <Box
    sx={{
      fontFamily: 'Courier',
      color: 'white',
      fontWeight: '900',
      p: '0.33rem',
      px: '0.66rem',
      backgroundColor: 'darkGreen',
      border: 'solid 1px',
      borderColor: 'darkGreen',
      borderRadius: '0.25rem',
      boxShadow: '0 0 5px #000',
      cursor: 'pointer',
      ':disabled': {
        color: 'feltGreen',
        backgroundColor: 'transparent',
        borderColor: 'feltGreen',
        boxShadow: 'none',
        cursor: 'default',
        ':hover': { color: 'feltGreen' },
      },
      ':hover': { color: '#fff' },
      ...sx,
    }}
    as="button"
    {...props}
  >
    {children}
  </Box>
);

export default Button;