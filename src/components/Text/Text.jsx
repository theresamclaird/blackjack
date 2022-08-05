import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';

const Text = forwardRef(({
    as, sx, children, ...props
}, ref) => (
    <Box
        as={as}
        ref={ref}
        tx="text"
        sx={{
            fontFamily: 'default',
            ...sx
        }}
        {...props}
    >
        {children}
    </Box>
));

Text.defaultProps = {
    as: 'p',
    sx: {},
};

Text.propTypes = {
    as: PropTypes.string,
    sx: PropTypes.objectOf(PropTypes.any),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

export default Text;