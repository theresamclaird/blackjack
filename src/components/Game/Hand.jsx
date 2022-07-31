import React from 'react';
import Box, { Flex } from '../Box';
import HandValue from './HandValue';
import Card from './Card';

const Hand = ({
    active,
    currentState,
    getHandValue,
    removeHand,
    incrementBet,
    decrementBet,
    clearBet,
    acceptInsuranceBet,
    declineInsuranceBet,
    stand,
    hit,
    surrender,
    double,
    split,
    bet,
    cards,
    settled,
}) => {
    return (
        <Flex sx={{
            mt: '1rem',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '1em',
        }}>
            <Flex sx={{ justifyContent: 'center', gap: '10rem' }}>
                <Box disabled={currentState !== 'offerInsurance'} onClick={() => acceptInsuranceBet()} as="button">Accept</Box>
                <Box disabled={currentState !== 'offerInsurance'} onClick={() => declineInsuranceBet()} as="button">Decline</Box>
            </Flex>
            <Box sx={{ position: 'relative', width: '8rem' }}>
                {cards.map((card, index) => (
                    <React.Fragment key={`player-card-seat-${index}`}>
                        <Card {...card} sx={{ position: 'absolute', left: `${index + 1}rem`, bottom: `${index}rem` }} />
                    </React.Fragment>
                ))}
            </Box>
            <HandValue value={getHandValue(cards)} />
            <Box sx={{
                border: 'solid 2px',
                borderColor: active ? 'yellow' : 'white',
                borderRadius: '5rem',
                boxShadow: '0 0 10px #333',
            }}>
                <Flex sx={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '10rem',
                    height: '10rem',
                    borderRadius: '5rem',
                    backgroundColor: active ? '#040' : 'transparent',
                    boxShadow: active ? '' : 'inset 0 0 5rem #030',
                    p: '1rem',
                }}>
                    <Flex sx={{
                        height: '75%', // todo Rework this so that the +/- line is vertically centered within the bet circle.
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>

                        <Flex sx={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Box disabled={currentState !== 'idle'} onClick={decrementBet} as="button">-</Box>
                            <Box
                                sx={{
                                    fontFamily: 'default',
                                    fontSize: '1rem',
                                    color: 'white',
                                    fontWeight: '900',
                                    mx: 'sm',
                                }}>{`¤ ${bet}`}</Box>
                            <Box disabled={currentState !== 'idle'} onClick={incrementBet} as="button">+</Box>
                        </Flex>

                        <Box disabled={currentState !== 'idle'} as="button" onClick={clearBet}>Clear</Box>

                    </Flex>
                </Flex>
            </Box>
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box  onClick={double} as="button">Double</Box>
                    <Box  onClick={surrender} as="button">Surrender</Box>
                    <Box onClick={split} as="button">Split</Box>
                </Flex>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box onClick={hit} as="button">Hit</Box>
                    <Box onClick={stand} as="button">Stand</Box>
                </Flex>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box onClick={removeHand} as="button">- Hand</Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Hand;