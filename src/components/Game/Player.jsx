import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';
import Card from './Card';

const Player = ({ bankroll, bet, cards, hit, stand }) => (
    <Flex sx={{
        mt: '3rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1em',
    }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
            {cards.map((card, index) => (
                <React.Fragment key={`player-card-seat-${index}`}>
                    <Card {...card} sx={{ position: 'absolute', left: `${index + 1}rem`, bottom: `${index * 1.1}rem` }} />
                </React.Fragment>
            ))}
        </Box>
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
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Box>
                <Box onClick={hit} sx={{ width: '50%' }} as="button">Hit</Box>
                <Box onClick={stand} sx={{ width: '50%' }} as="button">Stand</Box>
            </Box>
            <Box>
                <Box as="button">Split</Box>
                <Box as="button">Double</Box>
            </Box>
            <Box>
                <Box sx={{ width: '100%' }} as="button">Surrender</Box>
            </Box>
        </Flex>
        <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤${bankroll}`}</Text>
    </Flex>
);

export default Player;