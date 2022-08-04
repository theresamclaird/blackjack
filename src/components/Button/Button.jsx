import React from 'react';
import { Box } from '../Box';

// todo add Variants.

const Button = ({ sx, children, ...props }) => (
  <Box
    sx={{
      fontFamily: 'Courier',
      color: 'white',
      fontWeight: '900',
      fontSize: '1.5rem',
      backgroundColor: 'transparent',
      border: 0,
      p: 'sm',
      m: 0,
      cursor: 'pointer',
      ...sx,
    }}
    as="button"
    {...props}
  >
    {children}
  </Box>
);

export default Button;