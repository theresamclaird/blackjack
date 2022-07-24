import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';
import Card from './Card';
import HandValue from './HandValue';

const Player = ({
    sx = {},
    handValue,
    bankroll,
    bet,
    cards,
    incrementBet,
    decrementBet,
    hit,
    stand,
    surrender,
    double,
    acceptInsurance,
    declineInsurance,
    offerInsurance,
}) => (
    <Flex sx={{
        mt: '3rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1em',
        ...sx,
    }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
            {cards.map((card, index) => (
                <React.Fragment key={`player-card-seat-${index}`}>
                    <Card {...card} sx={{ position: 'absolute', left: `${index + 1}rem`, bottom: `${index * 1.1}rem` }} />
                </React.Fragment>
            ))}
        </Box>
        <HandValue label="Player" value={handValue} />
        <Box sx={{
            border: 'solid 2px',
            borderColor: 'white',
            borderRadius: '3rem',
            boxShadow: '0 0 10px #333',
        }}>
            <Flex sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '6rem',
                height: '6rem',
                borderRadius: '3rem',
                boxShadow: 'inset 0 0 3rem #003300',
            }}>
                <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <Box sx={{ fontFamily: 'default', color: 'white', fontWeight: '900', mx: 'sm' }}>{`¤ ${bet}`}</Box>
                </Flex>
            </Flex>
        </Box>
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                <Box onClick={decrementBet} as="button">- Bet</Box>
                <Box onClick={incrementBet} as="button">+ Bet</Box>
            </Flex>
            {offerInsurance && (
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                    <Box onClick={acceptInsurance} as="button">Accept</Box>
                    <Box onClick={declineInsurance} as="button">Decline</Box>
                </Flex>
            )}
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                <Box onClick={double} as="button">Double</Box>
                <Box onClick={surrender} as="button">Surrender</Box>
                <Box onClick={hit} as="button">Hit</Box>
                <Box onClick={stand} as="button">Stand</Box>
            </Flex>
        </Flex>
        <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤ ${bankroll}`}</Text>
    </Flex>
);

export default Player;