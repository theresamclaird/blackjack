import  React from 'react';
import Box, { Flex } from '../Box';
import { Card } from '../Card';

const DealerCards = ({ sx = {}, cards = [] }) => (
    <Box sx={{ height: '30rem' }}>
        <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem', ...sx }}>
            {cards.map((card, index) => <React.Fragment key={`dealer-card-${index}`}><Card {...card} /></React.Fragment>)}
        </Flex>
    </Box>
);

export { DealerCards, DealerCards as default };