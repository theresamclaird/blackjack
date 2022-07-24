import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../Box';
import Shoe from './Shoe';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import { getRandomNumberInRange } from '../../utils/random';

export const Game = () => {
    const [state, setState] = useState(() => ({
        shoe: [],
        player: { bankroll: 0, bet: 0, cards: [], insuranceBet: 0, isResolved: true },
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

    const betInsurance = player => {
        const { insuranceCost } = state.configuration;
        const amount = player.bet * insuranceCost;
        player.bankroll -= amount;
        player.insuranceBet += amount;
    };

    const winInsuranceBet = (player, dealer) => {
        dealer.bank -= player.insuranceBet;
        player.bankroll += player.insuranceBet; // Player gets the amount won.
        player.bankroll += player.insuranceBet; // Player takes back their original bet.
        player.insuranceBet = 0;
    };

    const loseInsuranceBet = (player, dealer) => {
        dealer.bank += player.insuranceBet;
        player.insuranceBet = 0;
    };

    const push = player => { player.isResolved = true; }

    const loseBet = (player, dealer) => {
        dealer.reveal = true;
        dealer.bank += player.bet;
        player.bet = 0;
        player.isResolved = true;
    };

    const winBet = (player, dealer) => {
        dealer.bank -= player.bet;
        player.bankroll += player.bet;
        player.isResolved = true;
    };

    const winBlackjack = (player, dealer) => {
        dealer.reveal = true;
        const { blackjackPays } = state.configuration;
        const amount = player.bet * blackjackPays;
        dealer.bank -= amount;
        player.bankroll += amount;
        player.isResolved = true;
    };

    const surrenderHand = (player, dealer) => {
        const { surrenderCost } = state.configuration;
        const amount = player.bet * surrenderCost;
        dealer.bank += amount;
        player.bankroll += player.bet - amount;
        player.bet = 0;
        player.isResolved = true;
    };

    const doubleBet = player => {
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

    const getDeck = () => {
        const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
        const ranks = [
            { value: 1, rank: 1 },
            { value: 2, rank: 2 },
            { value: 3, rank: 3 },
            { value: 4, rank: 4 },
            { value: 5, rank: 5 },
            { value: 6, rank: 6 },
            { value: 7, rank: 7 },
            { value: 8, rank: 8 },
            { value: 9, rank: 9 },
            { value: 10, rank: 10 },
            { value: 10, rank: 'jack' },
            { value: 10, rank: 'queen' },
            { value: 10, rank: 'king' },
        ];
        const cards = [];
        suits.forEach(suit => ranks.forEach(({ value, rank }) => cards.push({ suit, value, rank })));

        return cards;
    };
    
    const renewShoe = shoe => {
        const { numberOfDecks } = state.configuration;
        for (let i = 0; i < numberOfDecks; i++) {
            shoe.push(...getDeck());
        }
        return shoe;
    };
    
    const shuffle = shoe => {
        for (let index = shoe.length - 1; index > 0; index--) {
            const randomCardIndex = Math.floor(Math.random() * (index + 1));
            const temp = shoe[randomCardIndex];
            shoe[randomCardIndex] = shoe[index];
            shoe[index] = temp;
        }
    };

    const cut = shoe => {
        const { cutRange: { min, max } } = state.configuration;
        const percent = getRandomNumberInRange(min, max); // todo Allow the user to select the cut percent.
        const temp = [ ...shoe ];
        const location = Math.floor(temp.length * percent / 100);
        shoe = [ ...temp.slice(location), ...temp.slice(0, location) ];
    }
    
    const burn = shoe => { shoe.pop(); return; };

    const isPastCutCard = shoe => {
        const { numberOfDecks, penetration } = state.configuration;
        return shoe.length < 52 * numberOfDecks * (100 - penetration) / 100;
    };

    const dealCards = (player, dealer, shoe) => {
        for (let i = 0; i < 2; i++) {
            player.cards.push(shoe.pop());
            dealer.cards.push(shoe.pop());
        }
    };

    const isDealerShowingAce = dealer => dealer.cards?.[1].value === 1;

    const offerInsurance = dealer => dealer.offerInsurance = true;

    const revealDealerCards = dealer => dealer.reveal = true;

    const playDealerHand = (dealer, shoe) => {
        const cards = dealer.cards;

        const mustHit = cards => {
            const dealerHandValue = handValue(cards);
            const { dealerHitsSoft17 } = state.configuration;

            return dealerHitsSoft17 && isSoft(cards) ? dealerHandValue < 18 : dealerHandValue < 17;
        };

        while (mustHit(cards)) { cards.push(shoe.pop()); }
    };

    const resolveHand = (player, dealer) => {
        if (player.bet < 1 || player.resolveHand) { // todo Is this redundant?
            return;
        }

        if (isBusted(dealer.cards)) {
            winBet(player, dealer);
            return;
        }

        const playerHandValue = handValue(player.cards);
        const dealerHandValue = handValue(dealer.cards);

        if (playerHandValue > dealerHandValue) {
            winBet(player, dealer);
            return;
        }

        if (playerHandValue < dealerHandValue) {
            loseBet(player, dealer);
            return;
        }

        push(player);
    };

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

    const play = () => {
        if (state.player.bet < 1) { return; }

        return setState(previousState => {
            let player = { ...previousState.player, cards: [], isResolved: false };
            let dealer = { ...previousState.dealer, cards: [], reveal: false, offerInsurance: false, };
            let shoe = [ ...previousState.shoe ];

            if (isPastCutCard(shoe)) {
                renewShoe(shoe);
                shuffle(shoe);
                cut(shoe);
            }

            burn(shoe);
            dealCards(player, dealer, shoe);

            if (isDealerShowingAce(dealer)) {
                offerInsurance(dealer);
                return { ...previousState, player, dealer, shoe };
            }

            const dealerHasBlackjack = isBlackjack(dealer.cards);
            const playerHasBlackjack = isBlackjack(player.cards);

            if (dealerHasBlackjack) {
                revealDealerCards(dealer);

                if (playerHasBlackjack) {
                    push(player);
                    return { ...previousState, player, dealer, shoe };
                }

                loseBet(player, dealer);
                return { ...previousState, player, dealer, shoe };
            }

            if (playerHasBlackjack) {
                winBlackjack(player, dealer);
            }

            return { ...previousState, player, dealer, shoe };
        });
    };

    const placeInsuranceBet = () => setState(previousState => {
        const player = { ...previousState.player, cards: [...previousState.player.cards] };
        const dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], offerInsurance: false };

        betInsurance(player);

        if (isBlackjack(dealer.cards)) {
            revealDealerCards(dealer);
            winInsuranceBet(player, dealer);

            if (isBlackjack(player.cards)) {
                push(player);
                return { ...previousState, dealer, player };
            }

            loseBet(player, dealer);
            return { ...previousState, dealer, player };
        }

        loseInsuranceBet(player, dealer);

        return { ...previousState, dealer, player };
    });

    const declineInsuranceBet = () => setState(previousState => {
        const player = { ...previousState.player, cards: [...previousState.player.cards] };
        const dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], offerInsurance: false };

        if (isBlackjack(dealer.cards)) {
            dealer.reveal = true;

            if (isBlackjack(player.cards)) {
                push(player);
                return { ...previousState, dealer, player };
            }

            loseBet(player, dealer);
            return { ...previousState, dealer, player };
        }

        return { ...previousState, dealer, player };
    });

    const hit = () => setState(previousState => {
        let player = {...previousState.player, cards: [...previousState.player.cards]};
        let dealer = {...previousState.dealer, cards: [...previousState.dealer.cards]};
        let shoe = [...previousState.shoe];

        player.cards.push(shoe.pop());

        if (isBusted(player.cards)) { // Player busted.
            loseBet(player, dealer);
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

        surrenderHand(player, dealer);

        return { ...previousState, player, dealer };
    });

    const double = () => setState(previousState => {
        let player = { ...previousState.player, cards: [...previousState.player.cards] };
        let dealer = { ...previousState.dealer, cards: [...previousState.dealer.cards], reveal: true };
        let shoe = [ ...previousState.shoe ];

        doubleBet(player);

        player.cards.push(shoe.pop());

        if (isBusted(player.cards)) {
            loseBet(player, dealer);
            return { ...previousState, player, dealer, shoe };
        }

        playDealerHand(dealer, shoe);
        resolveHand(player, dealer);

        return { ...previousState, player, dealer, shoe };
    });

    const split = () => setState(previousState => {
        console.log('split');
        return previousState;
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
                play={play}
                incrementBet={incrementBet}
                decrementBet={decrementBet}
                hit={hit}
                stand={stand}
                surrender={surrender}
                double={double}
                split={split}
                placeInsuranceBet={placeInsuranceBet}
                declineInsurance={declineInsuranceBet}
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