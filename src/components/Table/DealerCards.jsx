import  React from 'react';
import Box, { Flex } from '../Box';
import { Card } from '../Card';

const DealerCards = ({ sx = {}, hand }) => (
    <Box sx={{ height: '30rem' }}>
        <Flex sx={{ justifyContent: 'center' }}>{hand.reportHandValue}</Flex>
        <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem', ...sx }}>
            {hand.cards.map((card, index) => <React.Fragment key={`dealer-card-${index}`}><Card showBack={hand.hide && index === 0} {...card} /></React.Fragment>)}
        </Flex>
    </Box>
);

export { DealerCards, DealerCards as default };