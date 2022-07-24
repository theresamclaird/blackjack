import React from 'react';
import { Text } from '../Text';

const HandValue = ({ label, value }) => <Text sx={{ color: 'white' }}>{`${label}: ${value}`}</Text>;

export default HandValue;