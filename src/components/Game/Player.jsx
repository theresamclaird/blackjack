import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';

const Player = ({
    currentState,
    addHand,
    deal,
    hands,
    bankroll,
    renderHand,
}) => (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5rem' }}>
        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: '5rem' }}>
            {hands.map((hand, handIndex) => (
                <React.Fragment key={`${handIndex}-${JSON.stringify(hand)}`}>{renderHand(handIndex)}</React.Fragment>
            ))}
        </Flex>
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <Box disabled={currentState !== 'idle'} as="button" onClick={deal}>Deal</Box>
                <Box disabled={currentState !== 'idle'} as="button" onClick={addHand}>+ Hand</Box>
            </Flex>
            <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤ ${bankroll}`}</Text>
        </Flex>
    </Flex>
);

export default Player;