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
        dealer: { bank: 0, reveal: false, cards: [], offerInsurance: false },
    }));

    const incrementBet = () => setState(previousState => ({
        ...previousState,
        player: {
            ...previousState.player,
            bankroll: previousState.player.bankroll - 1,
            bet: previousState.player.bet + 1,
        },
    }));

    const decrementBet = () => {
        if (state.player.bet < 1) {
            return;
        }

        return setState(previousState => ({
            ...previousState,
            player: {
                ...previousState.player,
                bankroll: previousState.player.bankroll + 1,
                bet: previousState.player.bet - 1,
            },
        }));
    };

    const calculateHandValue = cards => {
        const hard = cards.reduce((sum, card) => sum + card.value, 0);
        const soft = cards.filter(card => card.value === 1).length > 0 ? hard + 10 : hard;
        return {
            hard,
            soft: soft > 21 ? hard : soft,
        };
    };

    const deal = () => {
        if (state.player.bet < 1) {
            return;
        }

        return setState(previousState => {
            let shoe = [ ...previousState.shoe ];
            let player = { ...previousState.player, cards: [] };
            let dealer = { ...previousState.dealer, cards: [], reveal: false };

            if (shoe.length < 52 / 3) { // todo Add configuration for penetration.
                shoe = createShoe(1);
                shoe = shuffleCards(shoe);
                shoe = cutCards(shoe, getRandomNumberInRange(20, 80)); // todo Add configuration for cut range.
                shoe.pop(); // burn
            }

            for (let i = 0; i < 2; i++) {
                player.cards.push(shoe.pop());
                dealer.cards.push(shoe.pop());
            }

            // todo Insurance if the dealer is showing an Ace.
            if (dealer.cards[1].value === 1) {
                console.log('dealer is showing an ace');
                dealer.offerInsurance = true;
                return { ...previousState, player, dealer, shoe }; // todo Left off here.
            }

            const playerHandValue = calculateHandValue(player.cards);
            const dealerHandValue = calculateHandValue(dealer.cards);

            if (dealerHandValue.soft === 21) {
                console.log('dealer has a blackjack');
                dealer.reveal = true;
                if (playerHandValue.soft < 21) {
                    console.log('player loses');
                    player.bet = 0;
                    dealer.bank += player.bet;

                    return { ...previousState, player, dealer, shoe };
                }
                
                console.log('player also has a blackjack and pushes');
                return { ...previousState, player, dealer, shoe };
            }

            if (playerHandValue.soft === 21) {
                console.log('player has a blackjack');
                dealer.reveal = true;
                const amount = player.bet * 3 / 2;
                player.bankroll += amount;
                dealer.bank -= amount;
            }

            return { ...previousState, player, dealer, shoe };
        });
    };

    const playerBust = (player, dealer) => {
        dealer.reveal = true;
        dealer.bank += player.bet;
        player.bet = 0;
    };

    const playDealerHand = (cards, shoe) => {
        const shouldDraw = cards => {
            const { soft, hard } = calculateHandValue(cards);
            return soft < 18 && hard < 17;
        };

        while (shouldDraw(cards)) { cards.push(shoe.pop()); }
    };

    const determineWinner = (player, dealer) => {
        const dealerHandValue = calculateHandValue(dealer.cards);
        if (dealerHandValue.hard > 21) {
            console.log('dealer busted; player won');
            dealer.bank -= player.bet;
            player.bankroll += player.bet;
        } else {
            const playerHandValue = calculateHandValue(player.cards);
            if (dealerHandValue.soft > playerHandValue.soft) {
                console.log('player lost');
                dealer.bank += player.bet;
                player.bet = 0;
            } else if (dealerHandValue.hard < playerHandValue.hard) {
                console.log('player won')
                dealer.bank -= player.bet;
                player.bankroll += player.bet;
            } else {
                console.log('player pushes');
            }
        }
    };

    const hit = () => setState(previousState => {
        let shoe = [...previousState.shoe];
        let player = {...previousState.player, cards: [...previousState.player.cards]};
        let dealer = {...previousState.dealer, cards: [...previousState.dealer.cards]};

        player.cards.push(shoe.pop());

        const { hard } = calculateHandValue(player.cards);
        if (hard > 21) {
            console.log('player busted');
            playerBust(player, dealer);
        }

        return { ...previousState, player, dealer, shoe };
    });

    const stand = () => setState(previousState => {
        let shoe = [ ...previousState.shoe ];
        let player = { ...previousState.player, cards: [...previousState.player.cards] };
        let dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], reveal: true };

        playDealerHand(dealer.cards, shoe);
        determineWinner(player, dealer);

        return { ...previousState, dealer, player, shoe };
    });

    const surrender = () => setState(previousState => {
        let player = { ...previousState.player, cards: [] };
        let dealer = { ...previousState.dealer, reveal: true };

        const amount = player.bet / 2;
        dealer.bank += amount;
        player.bankroll += amount;
        player.bet = 0;

        return { ...previousState, player, dealer };
    });

    const double = () => setState(previousState => {
        let shoe = [ ...previousState.shoe ];
        let player = { ...previousState.player, cards: [...previousState.player.cards] };
        let dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], reveal: true };

        player.bankroll -= player.bet;
        player.bet += player.bet;
        player.cards.push(shoe.pop());

        const { hard } = calculateHandValue(player.cards);
        if (hard > 21) {
            console.log('player busted');
            playerBust(player, dealer);
            return { ...previousState, player, dealer, shoe };
        }

        playDealerHand(dealer.cards, shoe);
        determineWinner(player, dealer);

        return { ...previousState, player, dealer, shoe };
    });

    const acceptInsurance = () => setState(previousState => {
        console.log('player accepts insurance');
        return { ...previousState };
    });

    const declineInsurance = () => setState(previousState => {
        console.log('player declines insurance');
        return { ...previousState };
    });

    return (
        <Flex sx={{
            width: '100vw',
            height: '100vh',
            bg: 'feltGreen',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <Flex sx={{ m: '1rem', px: '1rem', width: '100%', justifyContent: 'space-between' }}>
                <Shoe cards={state.shoe} />
                <Box as="button" onClick={deal}>Deal</Box>
            </Flex>
            <Dealer
                handValue={calculateHandValue(state.dealer.cards)}
                {...state.dealer}
            />
            <Table sx={{ px: '1rem', width: '100%', height: '10rem' }} />
            <Player
                sx={{ px: '1rem' }}
                handValue={calculateHandValue(state.player.cards)}
                incrementBet={incrementBet}
                decrementBet={decrementBet}
                hit={hit}
                stand={stand}
                surrender={surrender}
                double={double}
                acceptInsurance={acceptInsurance}
                declineInsurance={declineInsurance}
                offerInsurance={state.dealer.offerInsurance}
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