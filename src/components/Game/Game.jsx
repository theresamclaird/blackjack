import React, { useEffect, useState } from 'react';
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
        player: { bet: 1, cards: [] },
        dealer: { reveal: false, cards: [] },
    }));

    useEffect(() => console.log('useEffect'), []);
    useEffect(() => console.log('state changed', state), [state]);

    const deal = () => setState(prev => {
        let { player, dealer, shoe } = { ...prev };

        if (shoe.length < 52 / 2) {
            shoe = createShoe(1);
            shoe = shuffleCards(shoe);
            shoe = cutCards(shoe, getRandomNumberInRange(20, 80)); // 20-80%
            shoe.pop(); // burn
        }

        player.cards = [];
        dealer.cards = [];

        for (let i = 0; i < 2; i++) {
            player.cards.push(shoe.pop());
            dealer.cards.push(shoe.pop());
        }
        return { ...prev, player, dealer, shoe };
    });

    const hit = () => setState(prev => {
        let { player, shoe } = { ...prev };
        const cards = [...player.cards];
        cards.push(shoe.pop());
        return { ...prev, player: { ...player, cards }, shoe };
    });

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
            <Dealer {...state.dealer} sx={{ mb: '5rem' }} />
            <Table sx={{ width: '100%' }} />
            <Player
                hit={hit}
                {...state.player}
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