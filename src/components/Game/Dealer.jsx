import  React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';
import Card from './Card';
import HandValue from './HandValue';

const Dealer = ({ sx = {}, handValue, bank, reveal, cards = [] }) => {
    const upCardValue = cards.length === 2 ? cards?.[1].value : 0;

    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <Text sx={{ color: 'yellow' }}>{`Bank: ¤ ${bank}`}</Text>
            <Box sx={{
                width: '100%',
                minHeight: '9rem',
                border: 'solid 2px',
                borderLeft: 0,
                borderRight: 0,
                borderColor: 'white',
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
            {<HandValue value={reveal ? handValue : upCardValue} />}
        </Flex>
    );
};

export default Dealer;