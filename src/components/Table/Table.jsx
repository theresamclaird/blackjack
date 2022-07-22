import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { configuration } from '../../configuration';
import { Box, Flex } from '../Box';
import { Seats } from '../Seat';
import { TableText } from './TableText';
import { DealerCards } from './DealerCards';
import { Hand, DealerHand } from '../../classes/Hand';
import { Shoe } from '../../classes/Shoe';

export const Table = () => {
    const [playerHands, setPlayerHands] = useState([new Hand(1)]);
    const [dealerHand, setDealerHand] = useState(new Hand());
    const [shoe, setShoe] = useState(new Shoe(1));

    const dealCards = () => {
        const newPlayerHands = playerHands.map(hand => (new Hand(hand.bet)));
        const newDealerHand = new DealerHand();

        for (let i = 0; i < 2; i++) {
            newPlayerHands.map(hand => hand.addCard(shoe.draw));
            newDealerHand.addCard(shoe.draw);
        }
        setPlayerHands(newPlayerHands);
        setDealerHand(newDealerHand);
    };

    const dealerAction = () => {
        const newHand = new DealerHand(dealerHand.cards);
        newHand.showHiddenCard();
        while (newHand.value.soft < 18 && newHand.value.hard < 17) {
            newHand.addCard(shoe.draw);
        }
        setDealerHand(newHand);
    };

    const start = () => {
        if (playerHands.filter(hand => hand.bet).length < 1) { return; }

        setShoe(shoe.shuffle().cut(Math.random() * 60 + 20).burn());
        dealCards();
    };

    const addSeat = () => {
        if (playerHands.length >= configuration.numberOfSeats || dealerHand.length > 0) { return; }
        setPlayerHands([...playerHands, new Hand()]);
    };

    const removeSeat = () => {
        if (playerHands.length < 2 || dealerHand.length > 0) {
            return;
        }

        const newSeats = [...playerHands];
        newSeats.pop();
        setPlayerHands(newSeats);
    };

    const hit = seatIndex => {
        const hand = playerHands[seatIndex];
        if (hand.cards.length < 2 || hand.bet < 1) {
            return;
        }

        hand.addCard(shoe.draw);
        setPlayerHands(playerHands.map((hand, index) => index === seatIndex ? new Hand(hand.bet, hand.cards) : hand));

        if (hand.value.hard > 21) {
            dealerAction();
        }
    };

    const stand = seatIndex => {
        // todo Allow other seats to play their hands.
        dealerAction();
    };

    return (
        <Flex sx={{
            width: '100%',
            height: '100%',
            bg: 'feltGreen',
            px: '10vw',
            py: '5vh',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <Flex sx={{ mb: '1rem', gap: '1rem' }}>
                <Box onClick={removeSeat} as="button">- Seat</Box>
                <Box as="button" onClick={addSeat}>+ Seat</Box>
                <Box as="button" onClick={start}>Deal</Box>
            </Flex>
            <DealerCards hand={dealerHand} sx={{ mb: '20rem' }} />
            <TableText sx={{ width: '100%' }} />
            <Seats
                stand={stand}
                hit={hit}
                hands={playerHands}
                setHands={setPlayerHands}
                sx={{ mt: '1rem' }}
            />
        </Flex>
    );
};

Table.defaultProps = {
    sx: {},
};

Table.propTypes = {
    sx: PropTypes.objectOf(PropTypes.any),
};