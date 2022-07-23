import  React from 'react';
import { Flex } from '../Box';
import Card from './Card';

const Dealer = ({ sx = {}, reveal, cards = [] }) => (
    <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem', ...sx }}>
        {cards.map((card, index) => <React.Fragment key={`dealer-card-${index}`}><Card showBack={reveal && index === 0} {...card} /></React.Fragment>)}
    </Flex>
);

export default Dealer;