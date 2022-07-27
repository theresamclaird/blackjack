import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';
import Hand from './Hand';

const Player = ({
    handValue,
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
    const activeHandIndex = hands.findIndex(hand => hand.action);
    return (
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: '1rem' }}>
                {hands.map((hand, index) => (
                    <React.Fragment key={`${index}-${JSON.stringify(hand)}`}>
                        <Hand
                            active={index === activeHandIndex}
                            handValue={handValue}
                            incrementBet={() => incrementBet(index)}
                            decrementBet={() => decrementBet(index)}
                            clearBet={() => clearBet(index)}
                            stand={() => stand(index)}
                            hit={() => hit(index)}
                            surrender={() => surrender(index)}
                            double={() => double(index)}
                            {...hand}
                        />
                    </React.Fragment>
                ))}
            </Flex>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                <Box as="button" onClick={deal}>Deal</Box>
            </Flex>
            <Text sx={{ color: 'yellow' }}>{`Bankroll: ¤ ${bankroll}`}</Text>
        </Flex>
    );
};

export default Player;