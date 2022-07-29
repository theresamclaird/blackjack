import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';
import Hand from './Hand';

const Player = ({
    handValue,
    addHand,
    incrementBet,
    decrementBet,
    clearBet,
    deal,
    stand,
    hit,
    surrender,
    double,
    split,
    bankroll,
    hands,
}) => {
    const activeHandIndex = hands.findLastIndex(hand => !hand.completed);
    return (
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5rem' }}>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: '5rem' }}>
                {hands.map((hand, handIndex) => (
                    <React.Fragment key={`${handIndex}-${JSON.stringify(hand)}`}>
                        <Hand
                            active={handIndex === activeHandIndex}
                            handValue={handValue}
                            incrementBet={() => incrementBet(handIndex)}
                            decrementBet={() => decrementBet(handIndex)}
                            clearBet={() => clearBet(handIndex)}
                            stand={() => stand(handIndex)}
                            hit={() => hit(handIndex)}
                            surrender={() => surrender(handIndex)}
                            double={() => double(handIndex)}
                            {...hand}
                        />
                    </React.Fragment>
                ))}
            </Flex>
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <Flex sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <Box as="button" onClick={deal}>Deal</Box>
                    <Box as="button" onClick={addHand}>+ Hand</Box>
                </Flex>
                <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤ ${bankroll}`}</Text>
            </Flex>
        </Flex>
    );
};

export default Player;