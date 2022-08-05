import React from 'react';
import Text from '../Text';
import { getHandValue } from '../../utils/cards';

const HandValue = ({ cards = [] }) => {
    const handValue = getHandValue(cards);
    return <Text sx={{ color: 'white' }}>{cards.length > 0 ? handValue : '0'}</Text>;
}

export default HandValue;