import React from 'react';
import { Text } from '../Text';

const HandValue = ({ label, soft, hard }) => (
    <Text sx={{ color: 'white' }}>
        {hard === soft ? `${label}: ${hard}` : `${label}: ${hard}/${soft}`}
    </Text>
);

export default HandValue;