import React from 'react';
import { Flex } from '../Box';
import { Seat } from './Seat';

const Seats = ({ sx = {}, seats, setSeats, hit, stand }) => {

    const increaseBet = seatIndex => setSeats(seats.map((seat, index) => index === seatIndex ? { ...seat, bet: seat.bet + 1 } : seat));
    const decreaseBet = seatIndex => setSeats(seats.map((seat, index) => index === seatIndex ? { ...seat, bet: seat.bet - 1 } : seat));

    return (
        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: '5rem', ...sx }}>
            <Flex sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4em',
                mb: 'xxl',
            }}>
                {seats.map((seat, index) => (
                    <React.Fragment key={`seat-${index}`}>
                        <Seat
                            hit={() => hit(index)}
                            stand={() => stand(index)}
                            increaseBet={() => increaseBet(index)}
                            decreaseBet={() => decreaseBet(index)}
                            {...seat}
                        />
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
};

export { Seats, Seats as default };