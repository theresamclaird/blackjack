import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from '../Box';
import Shoe from './Shoe';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import { createShoe, shuffleCards, cutCards } from '../../utils/cards';
import { getRandomNumberInRange } from '../../utils/random';

export const Game = () => {
    const [state, setState] = useState(() => ({
        shoe: [],
        player: { bankroll: -1, bet: 1, cards: [] },
        dealer: { bank: 0, reveal: false, cards: [] },
    }));

    const deal = () => setState(prev => {
        let shoe = [...prev.shoe];
        let player = { ...prev.player };
        let dealer = { ...prev.dealer };

        if (shoe.length < 52) { // todo If configuration.numberOfDecks > 1, set a cut card.
            shoe = createShoe(1);
            shoe = shuffleCards(shoe);
            shoe = cutCards(shoe, getRandomNumberInRange(20, 80)); // 20-80%
            shoe.pop(); // burn
        }

        player.cards = [];
        dealer.cards = [];
        dealer.reveal = false;

        for (let i = 0; i < 2; i++) {
            player.cards.push(shoe.pop());
            dealer.cards.push(shoe.pop());
        }
        return { ...prev, player, dealer, shoe };
    });

    const calculateHandValue = cards => {
        const hard = cards.reduce((sum, card) => sum + card.value, 0);
        const soft = cards.filter(card => card.value === 1).length > 0 ? hard + 10 : hard;
        return {
            hard,
            soft: soft > 21 ? hard : soft,
        };
    };

    const isBusted = cards => {
        const { hard } = calculateHandValue(cards);
        return (hard > 21);
    };

    const hit = () => setState(prev => {
        let shoe = [...prev.shoe];
        let cards = [...prev.player.cards];

        cards.push(shoe.pop());

        if (isBusted(cards)) {
            console.log('player busted');
            const bet = prev.player.bet;
            return {
                ...prev,
                dealer: { ...prev.dealer, reveal: true, bank: prev.dealer.bank + bet },
                player: { ...prev.player, cards: [], bankroll: prev.player.bankroll - bet },
                shoe,
            };
        }

        return { ...prev, player: { ...prev.player, cards }, shoe };
    });

    const stand = () => {
        setState(prev => {
            let shoe = [...prev.shoe];
            let cards = [...prev.dealer.cards];
            let bankroll = prev.player.bankroll;
            let bank = prev.dealer.bank;

            const shouldDraw = cards => {
                const { soft, hard } = calculateHandValue(cards);
                return soft < 18 && hard < 17;
            };

            while (shouldDraw(cards)) { cards.push(shoe.pop()); }

            const dealerHandValue = calculateHandValue(cards);
            const bet = prev.player.bet;
            if (dealerHandValue.hard > 21) {
                console.log('dealer busted; player won');
                bankroll += bet;
                bank -= bet;
            } else {
                // todo Refactor this nightmare.
                const playerHandValue = calculateHandValue(prev.player.cards);
                if (dealerHandValue.hard > playerHandValue.hard) {
                    console.log('player lost');
                    bankroll -= bet;
                    bank += bet;
                } else if (dealerHandValue.hard < playerHandValue.hard) {
                    console.log('player won')
                    bankroll += bet;
                    bank -= bet;
                } else {
                    console.log('player pushes');
                }
            }

            return {
                ...prev,
                dealer: { ...prev.dealer, reveal: true, cards, bank },
                player: { ...prev.player, bankroll },
                shoe,
            };
        });
    };

    return (
        <Flex sx={{
            width: '100vw',
            height: '100vh',
            bg: 'feltGreen',
            p: '2rem',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <Flex sx={{ mb: '1rem', width: '100%', justifyContent: 'space-between' }}>
                <Shoe cards={state.shoe} />
                <Box as="button" onClick={deal}>Deal</Box>
            </Flex>
            <Dealer {...state.dealer} />
            <Table sx={{ width: '100%', height: '10rem' }} />
            <Player
                hit={hit}
                stand={stand}
                {...state.player}
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