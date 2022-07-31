import  React from 'react';
import Box, { Flex } from '../Box';
import Card from './Card';
import HandValue from './HandValue';
import { getHandValue, isBlackjack } from '../../utils/cards';

const Dealer = ({ dealerCards, currentState }) => (
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
                {currentState === 'idle' && getHandValue(dealerCards) > 21 && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '50%',
                        transform: 'translate(50%, -50%)',
                        color: 'yellow',
                        px: 'xxl',
                        py: 'sm',
                        border: 'solid 1px yellow',
                        borderRadius: '0.25rem',
                        textAlign: 'center',
                        backgroundColor: '#030',
                        boxShadow: '0 0 10px #000',
                    }}>
                        BUSTED
                    </Box>
                )}
                {currentState === 'idle' && isBlackjack(dealerCards) && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '50%',
                        transform: 'translate(50%, -50%)',
                        color: 'yellow',
                        px: 'xxl',
                        py: 'sm',
                        border: 'solid 1px yellow',
                        borderRadius: '0.25rem',
                        textAlign: 'center',
                        backgroundColor: '#030',
                        boxShadow: '0 0 10px #000',
                    }}>
                        BLACKJACK
                    </Box>
                )}
            </Flex>
        </Box>
        <HandValue cards={currentState !== 'idle' ? [ dealerCards[1] ] : dealerCards} />
    </Flex>
);

export default Dealer;