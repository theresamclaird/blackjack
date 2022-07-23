import React from 'react';
import { Text } from '../Text';

const Shoe = ({ cards }) => <Text sx={{ color: 'yellow' }}>{`Cards Remaining: ${cards.length}`}</Text>

export default Shoe;