import React from 'react';
import Box, { Flex } from '../Box';
import HandValue from './HandValue';
import Card from './Card';
import mutations from './mutations';

const Hand = ({
    active,
    handValue,
    removeHand,
    incrementBet,
    decrementBet,
    clearBet,
    stand,
    hit,
    surrender,
    double,
    split,
    bet,
    cards,
    currentState,
    numberOfHands,
    settled,
}) => {
    const disableActionButtons =  !active || currentState === mutations.waitInsurance.label || settled;
    const disableInitialActionButtons = disableActionButtons || cards.length !== 2;
    return (
        <Flex sx={{
            mt: '3rem',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1em',
        }}>
            <Box sx={{ position: 'relative', width: '8rem' }}>
                {cards.map((card, index) => (
                    <React.Fragment key={`player-card-seat-${index}`}>
                        <Card {...card} sx={{ position: 'absolute', left: `${index + 1}rem`, bottom: `${index}rem` }} />
                    </React.Fragment>
                ))}
            </Box>
            <HandValue value={handValue(cards)} />
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
                            <Box disabled={currentState !== mutations.idle.label} onClick={decrementBet} as="button">-</Box>
                            <Box
                                sx={{
                                    fontFamily: 'default',
                                    fontSize: '1rem',
                                    color: 'white',
                                    fontWeight: '900',
                                    mx: 'sm',
                                }}>{`¤ ${bet}`}</Box>
                            <Box disabled={currentState !== mutations.idle.label} onClick={incrementBet} as="button">+</Box>
                        </Flex>

                        <Box disabled={currentState !== mutations.idle.label} as="button" onClick={clearBet}>Clear</Box>

                    </Flex>
                </Flex>
            </Box>
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box disabled={disableInitialActionButtons} onClick={double} as="button">Double</Box>
                    <Box disabled={disableInitialActionButtons} onClick={surrender} as="button">Surrender</Box>
                    <Box disabled={disableInitialActionButtons || cards.length !== 2 || cards[0].value !== cards[1].value} onClick={split} as="button">Split</Box>
                </Flex>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box disabled={disableActionButtons} onClick={hit} as="button">Hit</Box>
                    <Box disabled={disableActionButtons} onClick={stand} as="button">Stand</Box>
                </Flex>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    <Box disabled={currentState !== mutations.idle.label || numberOfHands < 2} onClick={removeHand} as="button">- Hand</Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Hand;