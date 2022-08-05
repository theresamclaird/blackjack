import React from 'react';
import Box, { Flex } from '../Box';
import Text from '../Text';
import Card from '../Card';
import Button from '../Button';
import Banner from '../Banner';
import { getHandValue, isSoft } from '../../utils/cards';

const EmojiButton = ({ disabled, onClick, children, sx={} }) => (
    <Button
    disabled={disabled} 
    onClick={onClick}
    sx={{
        fontSize: '1.25rem',
        background: 'transparent',
        border: 0,
        boxShadow: 0,
        textShadow: '0 0 10px #000',
        ':hover': {
            color: '#f00',
            ':disabled': {
                color: 'feltGreen',
                textShadow: 'none',
            },
        },
        ':disabled': {
            color: 'feltGreen',
            textShadow: 'none',
            cursor: 'default',
        },
        ...sx,
    }}>{children}</Button>
);

const Bet = ({ amount, sx }) => (
    <Flex
        sx={{
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'default',
            fontWeight: '900',
            fontSize: '1rem',
            height: '4rem',
            width: '4rem',
            color: 'white',
            backgroundColor: 'red',
            outline: 'inset 5px',
            outlineOffset: '-8px',
            outlineColor: '#ccc',
            border: 'solid 1px',
            borderColor: 'black',
            borderRadius: '2rem',
            boxShadow: '1px 1px  10px #000',
            ...sx,
        }}>{amount}</Flex>
);

const Hand = ({
    canRemoveHand,
    active,
    currentState,
    hand,
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
}) => {
    const isInitial = hand.cards.length === 2 && !hand.isSplit;
    const canSplit = isInitial && hand.cards[0].value === hand.cards[1].value;
    const handValue = getHandValue(hand.cards);

    return (
        <Flex sx={{
            mt: '1rem',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '1em',
        }}>
            <Box sx={{
                position: 'relative',
                border: 'solid 1px',
                borderColor: active ? 'yellow' : 'white',
                borderRadius: '0.25rem',
                boxShadow: '0 0 10px #333',
            }}>
                {hand.cards.map((card, index) => (
                    <React.Fragment key={`player-card-seat-${index}`}>
                        <Card {...card} sx={{
                            position: 'absolute',
                            left: `${2 + index}rem`,
                            top: `${-1.5 + (-1 * index)}rem`,
                        }} />
                    </React.Fragment>
                ))}
                <EmojiButton
                    sx={{
                        color: 'red',
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        position: 'absolute',
                        left: '-0.4rem',
                        top: '-0.2em',
                    }}
                    disabled={!hand.split && (!canRemoveHand || currentState !== 'idle')} 
                    onClick={removeHand}>X</EmojiButton>
                <Flex sx={{
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '10rem',
                    height: '15rem',
                    borderRadius: '0.25rem',
                    backgroundColor: active ? '#040' : 'transparent',
                    boxShadow: active ? '' : 'inset 0 0 5rem #030',
                    p: '1rem',
                    gap: '0.5rem',
                }}>
                    <Flex sx={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Bet amount={hand.bet} />
                        <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                            <EmojiButton
                                disabled={currentState !== 'idle'}
                                onClick={decrementBet}>-</EmojiButton>
                            <EmojiButton
                                disabled={currentState !== 'idle'}
                                onClick={incrementBet}>+</EmojiButton>
                        </Flex>
                    </Flex>

                    <Button
                        disabled={currentState !== 'idle'}
                        onClick={clearBet}>Retrieve</Button>
                </Flex>
                <Text sx={{
                    fontSize: '0.66rem',
                    color: 'white',
                    position: 'absolute',
                    left: '0.2rem',
                    top: '4.4rem',
                    width: '1.7rem',
                    textAlign: 'right',
                }}>{isSoft(hand.cards) ? `${handValue - 10}/${handValue}` : handValue}</Text>
                {hand.status && hand.settled && <Banner message={hand.status} sx={{ top: '16%', width: '120%' }} />}
            </Box>
            <Flex sx={{ justifyContent: 'center', gap: '1rem' }}>
                <Button
                    disabled={!active || (currentState !== 'offerInsurance' && !hand.offerInsurance)}
                    onClick={() => acceptInsuranceBet()}
                    as="button">Accept</Button>
                <Button
                    disabled={!active || (currentState !== 'offerInsurance' && !hand.offerInsurance)}
                    onClick={() => declineInsuranceBet()}
                    as="button">Decline</Button>
            </Flex>
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                    <Button
                        disabled={!isInitial || !active || currentState !== 'player'}
                        onClick={double}
                        as="button">Double</Button>
                    <Button
                        disabled={!isInitial || !active || currentState !== 'player'}
                        onClick={surrender}
                        as="button">Surrender</Button>
                    <Button
                        disabled={!canSplit || !active || currentState !== 'player'}
                        onClick={split}
                        as="button">Split</Button>
                </Flex>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                    <Button  disabled={!active || currentState !== 'player'} onClick={hit} as="button">Hit</Button>
                    <Button  disabled={!active || currentState !== 'player'} onClick={stand} as="button">Stand</Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Hand;