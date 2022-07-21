import React from 'react';
import { Flex } from '../Box';
import { Seat } from './Seat';

const Seats = ({ sx = {}, hands, setHands, hit, stand }) => {

    const increaseBet = handIndex => setHands(hands.map((hand, index) => index === handIndex ? { ...hand, bet: hand.bet + 1 } : hand));
    const decreaseBet = handIndex => setHands(hands.map((hand, index) => index === handIndex ? { ...hand, bet: hand.bet - 1 } : hand));

    return (
        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: '5rem', ...sx }}>
            <Flex sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4em',
                mb: 'xxl',
            }}>
                {hands.map((hand, index) => (
                    <React.Fragment key={`hand-${index}`}>
                        <Seat
                            hit={() => hit(index)}
                            stand={() => stand(index)}
                            increaseBet={() => increaseBet(index)}
                            decreaseBet={() => decreaseBet(index)}
                            hand={hand}
                        />
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
};

export { Seats, Seats as default };