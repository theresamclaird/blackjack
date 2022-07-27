import React from 'react';
import Box, { Flex } from '../Box';
import HandValue from './HandValue';
import Card from './Card';

const Hand = ({
    active,
    handValue,
    incrementBet,
    decrementBet,
    clearBet,
    stand,
    hit,
    surrender,
    double,
    bet,
    cards,
}) => {
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
                    boxShadow: 'inset 0 0 5rem #003300',
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
                            <Box onClick={decrementBet} as="button">-</Box>
                            <Box
                                sx={{
                                    fontFamily: 'default',
                                    fontSize: '1rem',
                                    color: 'white',
                                    fontWeight: '900',
                                    mx: 'sm',
                                }}>{`¤ ${bet}`}</Box>
                            <Box onClick={incrementBet} as="button">+</Box>
                        </Flex>

                        <Box as="button" onClick={clearBet}>Clear</Box>

                    </Flex>
                </Flex>
            </Box>
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                    {/* <Box onClick={split} as="button">Split</Box> */}
                    <Box onClick={double} as="button">Double</Box>
                    <Box onClick={surrender} as="button">Surrender</Box>
                    <Box onClick={hit} as="button">Hit</Box>
                    <Box onClick={stand} as="button">Stand</Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Hand;