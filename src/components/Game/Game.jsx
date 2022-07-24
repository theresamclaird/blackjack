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
        player: { bankroll: 0, bet: 0, cards: [], insuranceBet: 0, isResolved: false },
        dealer: { bank: 0, reveal: false, cards: [], offerInsurance: false },
        configuration: {
            numberOfDecks: 1,
            penetration: 66,
            cutRange: { min: 20, max: 80 },
            dealerPeek: true,
            dealerHitsSoft17: true,
            doubleAfterSplit: true,
            surrender: 'late', // Can be false, 'early', or 'late'.
            double: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            blackjackPays: 3 / 2,
            surrenderCost: 1 / 2,
            insuranceCost: 1 / 2,
        },
    }));

    if (state.dealer.bank + state.player.bankroll + state.player.bet !== 0) {
        console.error('Accounting error.', { bank: state.dealer.bank, bankroll: state.player.bankroll, bet: state.player.bet });
    }

    const playerIncrementBet = () => setState(previousState => ({
        ...previousState,
        player: {
            ...previousState.player,
            bankroll: previousState.player.bankroll - 1,
            bet: previousState.player.bet + 1,
        },
    }));

    const playerDecrementBet = () => {
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

    const playerBetsInsurance = player => {
        const { insuranceCost } = state.configuration;
        const amount = player.bet * insuranceCost;
        player.bankroll -= amount;
        player.insuranceBet += amount;
    };

    const playerWinInsurance = (player, dealer) => {
        dealer.bank -= player.insuranceBet;
        player.bankroll += player.insuranceBet; // Player gets the amount won.
        player.bankroll += player.insuranceBet; // Player takes back their original bet.
        player.insuranceBet = 0;
    };

    const playerLoseInsurance = (player, dealer) => {
        dealer.bank += player.insuranceBet;
        player.insuranceBet = 0;
    };

    const playerPush = player => player.isResolved = true;

    const playerLoseBet = (player, dealer) => {
        dealer.reveal = true;
        dealer.bank += player.bet;
        player.bet = 0;
        player.isResolved = true;
    };

    const playerWinBet = (player, dealer) => {
        dealer.bank -= player.bet;
        player.bankroll += player.bet;
        player.isResolved = true;
    };

    const playerWinBlackjack = (player, dealer) => {
        dealer.reveal = true;
        const { blackjackPays } = state.configuration;
        const amount = player.bet * blackjackPays;
        dealer.bank -= amount;
        player.bankroll += amount;
        player.isResolved = true;
    };

    const playerSurrender = (player, dealer) => {
        const { surrenderCost } = state.configuration;
        const amount = player.bet * surrenderCost;
        dealer.bank += amount;
        player.bankroll += player.bet - amount;
        player.bet = 0;
        player.isResolved = true;
    };

    const playerDoubleBet = player => {
        const amount = player.bet;
        player.bankroll -= amount;
        player.bet += amount;
        player.isResolved = true;
    };

    const handValue = cards => {
        const sum = cards.reduce((sum, card) => sum + card.value, 0); // Aces are counted as 1.

        if (sum > 11) {
            return sum;
        }

        if (cards.filter(card => card.value === 1).length > 0) { // Hand contains >= 1 Ace.
            return sum + 10;
        }
        
        return sum;
    };

    const isSoft = cards => cards.reduce((sum, card) => sum + card.value, 0) < 12 && cards.filter(card => card.value === 1).length > 0;

    const isBlackjack = cards => cards.length === 2 && handValue(cards) === 21;

    const isBusted = cards => handValue(cards) > 21;

    const deal = () => {
        if (state.player.bet < 1) {
            return;
        }

        return setState(previousState => {
            let player = { ...previousState.player, cards: [], isResolved: false };
            let dealer = { ...previousState.dealer, cards: [], reveal: false, offerInsurance: false, };
            let shoe = [ ...previousState.shoe ];

            const { numberOfDecks, penetration, cutRange } = state.configuration;

            if (shoe.length < 52 * numberOfDecks * (100 - penetration) / 100) {
                shoe = createShoe(numberOfDecks);
                shoe = shuffleCards(shoe);
                shoe = cutCards(shoe, getRandomNumberInRange(cutRange.min, cutRange.max));
                shoe.pop(); // burn
            }

            for (let i = 0; i < 2; i++) {
                player.cards.push(shoe.pop());
                dealer.cards.push(shoe.pop());
            }

            if (dealer.cards[1].value === 1) { // Dealer is showing an Ace.
                dealer.offerInsurance = true;
                return { ...previousState, player, dealer, shoe }; // todo Left off here.
            }

            const playerHasBlackjack = isBlackjack(player.cards);

            if (isBlackjack(dealer.cards)) {
                dealer.reveal = true;

                if (playerHasBlackjack) { // push
                    playerPush(player);
                    return { ...previousState, player, dealer, shoe };
                }

                playerLoseBet(player, dealer);
                return { ...previousState, player, dealer, shoe };
            }

            if (playerHasBlackjack) { // The player has a blackjack.
                playerWinBlackjack(player, dealer);
            }

            return { ...previousState, player, dealer, shoe };
        });
    };

    const playDealerHand = (dealer, shoe) => {
        const cards = dealer.cards;

        const dealerMustHit = cards => {
            const dealerHandValue = handValue(cards);
            const { dealerHitsSoft17 } = state.configuration;

            return dealerHitsSoft17 && isSoft(cards) ? dealerHandValue < 18 : dealerHandValue < 17;
        };

        while (dealerMustHit(cards)) { cards.push(shoe.pop()); }
    };

    const resolveHand = (player, dealer) => {
        if (player.bet < 1 || player.resolveHand) { // todo Is this redundant?
            return;
        }

        if (isBusted(dealer.cards)) {
            playerWinBet(player, dealer);
            return;
        }

        const playerHandValue = handValue(player.cards);
        const dealerHandValue = handValue(dealer.cards);

        if (playerHandValue > dealerHandValue) {
            playerWinBet(player, dealer);
            return;
        }

        if (playerHandValue < dealerHandValue) {
            playerLoseBet(player, dealer);
            return;
        }
    };

    const hit = () => setState(previousState => {
        let player = {...previousState.player, cards: [...previousState.player.cards]};
        let dealer = {...previousState.dealer, cards: [...previousState.dealer.cards]};
        let shoe = [...previousState.shoe];

        player.cards.push(shoe.pop());

        if (isBusted(player.cards)) { // Player busted.
            playerLoseBet(player, dealer);
        }

        return { ...previousState, player, dealer, shoe };
    });

    const stand = () => setState(previousState => {
        let player = { ...previousState.player, cards: [...previousState.player.cards] };
        let dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], reveal: true };
        let shoe = [ ...previousState.shoe ];

        playDealerHand(dealer, shoe);
        resolveHand(player, dealer);

        return { ...previousState, dealer, player, shoe };
    });

    const surrender = () => setState(previousState => {
        let player = { ...previousState.player };
        let dealer = { ...previousState.dealer, reveal: true };

        playerSurrender(player, dealer);

        return { ...previousState, player, dealer };
    });

    const double = () => setState(previousState => {
        let player = { ...previousState.player, cards: [...previousState.player.cards] };
        let dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], reveal: true };
        let shoe = [ ...previousState.shoe ];

        playerDoubleBet(player);

        player.cards.push(shoe.pop());

        if (isBusted(player.cards)) {
            playerLoseBet(player, dealer);
            return { ...previousState, player, dealer, shoe };
        }

        playDealerHand(dealer, shoe);
        resolveHand(player, dealer);

        return { ...previousState, player, dealer, shoe };
    });

    const acceptInsurance = () => setState(previousState => {
        const player = { ...previousState.player, cards: [...previousState.player.cards] };
        const dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], offerInsurance: false };

        playerBetsInsurance(player);

        if (isBlackjack(dealer.cards)) {
            dealer.reveal = true;
            playerWinInsurance(player, dealer);

            if (isBlackjack(player.cards)) {
                playerPush(player);
                return { ...previousState, dealer, player };
            }

            playerLoseBet(player, dealer);
            return { ...previousState, dealer, player };
        }

        playerLoseInsurance(player, dealer);

        return { ...previousState, dealer, player };
    });

    const declineInsurance = () => setState(previousState => {
        const player = { ...previousState.player, cards: [...previousState.player.cards] };
        const dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], offerInsurance: false };

        if (isBlackjack(dealer.cards)) {
            dealer.reveal = true;

            if (isBlackjack(player.cards)) { // push
                playerPush(player);
                return { ...previousState, dealer, player };
            }

            playerLoseBet(player, dealer);
            return { ...previousState, dealer, player };
        }

        return { ...previousState, dealer, player };
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
            <Flex sx={{ m: '1rem', px: '1rem', width: '100%', justifyContent: 'flex-start' }}>
                <Shoe cards={state.shoe} />
            </Flex>
            <Dealer
                handValue={handValue(state.dealer.cards)}
                {...state.dealer}
            />
            <Table sx={{ px: '1rem', width: '100%', height: '10rem' }} insuranceBet={state.player.insuranceBet} />
            <Player
                sx={{ px: '1rem' }}
                handValue={handValue(state.player.cards)}
                incrementBet={playerIncrementBet}
                decrementBet={playerDecrementBet}
                hit={hit}
                stand={stand}
                surrender={surrender}
                double={double}
                acceptInsurance={acceptInsurance}
                declineInsurance={declineInsurance}
                offerInsurance={state.dealer.offerInsurance}
                {...state.player}
            />
            <Flex sx={{ m: '1rem', px: '1rem', width: '100%', justifyContent: 'center' }}>
                <Box as="button" onClick={deal}>Deal</Box>
            </Flex>
        </Flex>
    );
};

Table.defaultProps = {
    sx: {},
};

Table.propTypes = {
    sx: PropTypes.objectOf(PropTypes.any),
};