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
    play,
    incrementBet,
    decrementBet,
    hit,
    stand,
    surrender,
    double,
    split,
    placeInsuranceBet,
    declineInsurance,
    offerInsurance,
    isResolved,
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
        <HandValue value={handValue} />
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
                <Box
                    onClick={decrementBet}
                    disabled={(!isResolved && cards.length > 1) || bet <= 0}
                    as="button"
                >- Bet</Box>
                <Box disabled={(bet < 1 && isResolved) || !isResolved} as="button" onClick={play}>Play</Box>
                <Box
                    onClick={incrementBet}
                    disabled={!isResolved && cards.length > 1}
                    as="button"
                >+ Bet</Box>
            </Flex>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                <Box onClick={hit} disabled={offerInsurance || cards.length < 2 || isResolved} as="button">Hit</Box>
                <Box onClick={stand} disabled={offerInsurance || cards.length < 2 || isResolved} as="button">Stand</Box>
            </Flex>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '0.5rem' }}>
                <Box onClick={split} disabled={offerInsurance || cards.length !== 2 || cards[0].value !== cards[1].value || isResolved} as="button">Split</Box>
                <Box onClick={double} disabled={offerInsurance || cards.length !== 2 || isResolved} as="button">Double</Box>
                <Box onClick={surrender} disabled={offerInsurance || cards.length !== 2 || isResolved} as="button">Surrender</Box>
            </Flex>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                <Box
                    onClick={placeInsuranceBet}
                    disabled={!offerInsurance || isResolved}
                    as="button"
                >Accept Insurance</Box>
                <Box
                    onClick={declineInsurance}
                    disabled={!offerInsurance || isResolved}
                    as="button"
                >Decline Insurance</Box>
            </Flex>
        </Flex>
        <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤ ${bankroll}`}</Text>
    </Flex>
);

export default Player;