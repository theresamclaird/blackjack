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

class Hand {
    constructor(bet = 0, cards = []) {
        this.bet = bet;
        this.cards = cards;
    }
    addCard(card) {
        this.cards.push(card);
    }
    get value() {
        const hard = this.cards.reduce((p, c) => p + c.value, 0);
        const soft = this.cards.filter(card => card.value === 1).length > 0 ? hard + 10 : hard;
        return {
            hard,
            soft: soft > 21 ? hard : soft,
        };
    };
    get reportHandValue() {
        const { hard, soft } = this.value;
        return hard !== soft ? `${hard}/${soft}` : `${hard}`;
    }
}

class DealerHand extends Hand {
    constructor(cards = []) {
        super();
        this.bet = null;
        this.cards = cards;
    }
}

export const Table = () => {
    const [playerHands, setPlayerHands] = useState([new Hand(1)]);
    const [dealerHand, setDealerHand] = useState(new Hand());
    const [shoe, setShoe] = useState(createShoe(1));

    const shuffleCards = () => setShoe(randomizeArrayElements(shoe));
    const burnCard = () => shoe.pop();
    const cutCards = percent => {
        const location = Math.floor(shoe.length * percent / 100);
        setShoe([...shoe.slice(location), ...shoe.slice(0, location)]);
    };
    const dealCards = () => {
        const newPlayerHands = playerHands.map(hand => (new Hand(hand.bet)));
        const newDealerHand = new DealerHand();

        for (let i = 0; i < 2; i++) {
            newPlayerHands.map(hand => hand.addCard(shoe.pop()));
            newDealerHand.addCard(shoe.pop());
        }
        setPlayerHands(newPlayerHands);
        setDealerHand(newDealerHand);
    };
    const dealerAction = () => {
        const newHand = new DealerHand(dealerHand.cards);
        while (newHand.value.soft < 18 && newHand.value.hard < 17) {
            newHand.addCard(shoe.pop());
        }
        setDealerHand(newHand);
    };

    const start = () => {
        if (playerHands.filter(hand => hand.bet).length < 1) { return; }

        shuffleCards();
        cutCards(Math.random() * 60 + 20); // 80% - 20%
        burnCard();
        dealCards();
    };

    const addSeat = () => {
        if (playerHands.length >= configuration.numberOfSeats || dealerHand.length > 0) {
            return;
        }
        setPlayerHands([...playerHands, { bet: 0, cards: [] }]);
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

        hand.addCard(shoe.pop());
        setPlayerHands(playerHands.map((hand, index) => index === seatIndex ? new Hand(hand.bet, hand.cards) : hand));

        if (hand.value.hard > 21) {
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