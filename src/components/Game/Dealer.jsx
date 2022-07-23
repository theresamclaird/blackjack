import  React from 'react';
import Box, { Flex } from '../Box';
import Card from './Card';

const Dealer = ({ sx = {}, reveal, cards = [] }) => (
    <Box sx={{
        minWidth: '14rem',
        minHeight: '9rem',
        border: 'solid 2px',
        borderColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 0 3rem #003300',
        p: '1rem',
        ...sx,
    }}>
        <Flex sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '0.5rem',
        }}>
            {cards.map((card, index) => <React.Fragment key={`dealer-card-${index}`}><Card showBack={!reveal && index === 0} {...card} /></React.Fragment>)}
        </Flex>
    </Box>
);

export default Dealer;