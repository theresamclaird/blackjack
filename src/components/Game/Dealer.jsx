import  React from 'react';
import Box, { Flex } from '../Box';
import Card from './Card';
import HandValue from './HandValue';

const Dealer = ({ handValue, reveal, dealerCards }) => {
    const upCardValue = dealerCards.length > 1 ? dealerCards?.[1].value : 0;
    return (
        <Flex sx={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            height: '15rem',
        }}>
            <Box sx={{
                width: '100%',
                height: '9rem',
                border: 'solid 2px',
                borderLeft: 0,
                borderRight: 0,
                borderColor: 'white',
                boxShadow: 'inset 0 0 3rem #003300',
                p: '1rem',
            }}>
                <Flex sx={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '1rem',
                }}>
                    {dealerCards.map((card, index) => (
                        <React.Fragment key={`dealer-card-${index}`}>
                            <Card showBack={!reveal && index === 0} {...card} />
                        </React.Fragment>
                    ))}
                </Flex>
            </Box>
            <HandValue value={reveal ? handValue(dealerCards) : upCardValue === 1 ? '1/11' : upCardValue} />
        </Flex>
    );
};

export default Dealer;