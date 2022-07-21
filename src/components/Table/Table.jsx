import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { configuration } from '../../configuration';
import { Box, Flex } from '../Box';
import { Seats } from '../Seat';
import { TableText } from './TableText';
import { DealerCards } from './DealerCards';

const createDeck = () => {
    const cards = [];
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];

    suits.forEach(suit => {
        for (let value = 1; value <= 10; value++) {
            cards.push({ suit, value, rank: value });
        }
        cards.push({ suit, value: 10, rank: 'jack' });
        cards.push({ suit, value: 10, rank: 'queen' });
        cards.push({ suit, value: 10, rank: 'king' });
    });
    return cards;
};

const createShoe = numberOfDecks => {
    const cards = [];
    for (let i = 0; i < numberOfDecks; i++) {
        cards.push(...createDeck());
    }
    return cards;
};

const randomizeArrayElements = (elements = []) => {
    const randomizedArray = elements;
    for (let index = randomizedArray.length - 1; index > 0; index--) {
        const randomCardLocation = Math.floor(Math.random() * (index + 1));
        const temp = randomizedArray[randomCardLocation];
        randomizedArray[randomCardLocation] = randomizedArray[index];
        randomizedArray[index] = temp;
    }
    return randomizedArray;
  };


export const Table = () => {
    const [seats, setSeats] = useState([{ bet: 1, cards: [] }]);
    const [dealerCards, setDealerCards] = useState([]);
    const [shoe, setShoe] = useState(createShoe(1));

    const shuffleCards = () => setShoe(randomizeArrayElements(shoe));
    const burnCard = () => { shoe.pop(); };
    const cutCards = () => {
        const percent = Math.random() * 60 + 20; // 80 - 20 percent
        const location = Math.floor(shoe.length * percent / 100);
        setShoe([...shoe.slice(location), ...shoe.slice(0, location)]);
    };
    const dealCards = () => {
        const players = [...seats];
        const dealerHand = [];

        for (let i = 0; i < 2; i++) {
            players.map(player => player.bet > 0 && player.cards.push(shoe.pop()));
            dealerHand.push(shoe.pop());
        }
        setSeats(players);
        setDealerCards(dealerHand);
    };
    const getHandValue = cards => {
        const hard = cards.reduce((p, c) => p + c.value, 0);
        const soft = cards.filter(card => card.value === 1).length ? hard + 10 : hard;
        return {
            hard,
            soft: soft > 21 ? hard : soft,
        };
    };

    const dealerAction = () => {
        const cards = [...dealerCards];
        while (getHandValue(cards).hard < 18) {
            console.log(cards);
            cards.push(shoe.pop());
        }
        setDealerCards(cards);
    };

    const start = () => {
        if (seats.filter(seat => seat.bet).length < 1) {
            return;
        }

        reset();
        shuffleCards();
        cutCards();
        burnCard();
        dealCards();
    };

    const reset = () => {
        setSeats([{ bet: 1, cards: [] }]);
        setDealerCards([]);
        setShoe(createShoe(1));
    };

    const addSeat = () => {
        if (seats.length >= configuration.numberOfSeats || dealerCards.length > 0) {
            return;
        }
        setSeats([...seats, { bet: 0, cards: [] }]);
    };

    const removeSeat = () => {
        if (seats.length < 2 || dealerCards.length > 0) {
            return;
        }

        const newSeats = [...seats];
        newSeats.pop();
        setSeats(newSeats);
    };

    const hit = seatIndex => {
        const seat = seats[seatIndex];
        if (seat.cards.length < 2 || seat.bet < 1) {
            return;
        }

        const cards = [...seats[seatIndex].cards, shoe.pop()];
        setSeats(seats.map((seat, index) => index === seatIndex ? { ...seat, cards } : seat));

        if (getHandValue(cards).hard > 21) {
            dealerAction();
        }
    };

    const stand = seatIndex => {
        // todo Allow other seats to play their hands.
        console.log('stand');
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
                <Box sx={{ height: '2rem' }} onClick={removeSeat} as="button">- Seat</Box>
                <Box sx={{ height: '2rem' }} as="button" onClick={addSeat}>+ Seat</Box>
                <Box sx={{ height: '2rem' }} as="button" onClick={start}>Deal</Box>
                <Box sx={{ height: '2rem' }} as="button" onClick={reset}>Reset</Box>
            </Flex>
            <DealerCards cards={dealerCards} sx={{ mb: '20rem' }} />
            <TableText sx={{ width: '100%' }} />
            <Seats
                stand={stand}
                hit={hit}
                seats={seats}
                setSeats={setSeats}
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