import React from 'react';
import { Flex } from '../Box';

const Pip = ({ sx, pip }) => (
    <Flex sx={{ fontSize: '1.5em', justifyContent: 'center', alignItems: 'center', ...sx }}>
        {pip}
    </Flex>
);

export { Pip, Pip as default };