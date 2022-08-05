import  React from 'react';
import Box, { Flex } from '../Box';
import Card from '../Card';
import Banner from '../Banner';
import { getHandValue, isBlackjack } from '../../utils/cards';

const DealerStatus = ({ cards }) => {
    const sx={ px: 'xxl' };

    if (isBlackjack(cards)) {
        return <Banner message="BLACKJACK" sx={sx} />;
    }

    const handValue = getHandValue(cards);
    if (handValue > 21) {
        return <Banner message={`${handValue} (BUST)`} sx={sx} />;
    }

    return <Banner message={`${handValue}`} sx={sx} />;
};

const Dealer = ({ dealerCards, currentState }) => (
    <Flex sx={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        height: '12rem',
    }}>
        <Box sx={{ width: '100%', p: '1rem' }}>
            <Flex sx={{
                position: 'relative',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '1rem',
            }}>
                {dealerCards.map((card, index) => (
                    <React.Fragment key={`dealer-card-${index}`}>
                        <Card showBack={index === 0 && currentState !== 'idle'} {...card} />
                    </React.Fragment>
                ))}
                {currentState === 'offerInsurance' && <Banner message="Insurance?" />}
                {currentState === 'idle' && dealerCards.length > 0 && <DealerStatus cards={dealerCards} />}
            </Flex>
        </Box>
    </Flex>
);

export default Dealer;