import styled from '@emotion/styled';
import { variant } from 'styled-system'

const Button = styled('button')(
  {
    appearance: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  variant({
    variants: {
      primary: {
        fontSize: '2rem',
        backgroundColor: 'feltGreen',
        border: 0,
        color: 'white',
        p: 'sm',
    },
    }
  })
);

export default Button;