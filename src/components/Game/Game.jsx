import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../Box';
import { Text } from '../Text';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import { getRandomNumberInRange } from '../../utils/random';
import { getDeck } from '../../utils/cards';

const isSoft = cards => cards.reduce((sum, card) => sum + card.value, 0) < 12 && cards.filter(card => card.value === 1).length > 0;
const isBusted = cards => handValue(cards) > 21;
const getUpCardValue = cards => cards?.[1]?.value;
const isBlackjack = cards => cards.length === 2 && handValue(cards) === 21;
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

const states = {
    idle: 'idle',
    deal: 'deal',
    insurance: 'insurance',
    peek: 'peek',
    play: 'play',
    dealer: 'dealer',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'incrementBet': {
            const { index } = action.payload;
            return {
                ...state,
                bankroll: state.bankroll - 1,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, bet: hand.bet + 1 } : hand),
            };
        }
        case 'decrementBet': {
            const { index } = action.payload;
            return {
                ...state,
                bankroll: state.bankroll + 1,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, bet: hand.bet - 1 } : hand),
            };
        }
        case 'clearBet': {
            const { index } = action.payload;
            return {
                ...state,
                bankroll: state.bankroll + state.hands[index].bet,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, bet: 0 } : hand),
            };
        }
        case 'stand': { // Mark the hand as completed by setting action = false. todo Maybe rename this to "completed"?
            const { index } = action.payload;

            return {
                ...state,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, action: false } : hand),
            };
        }
        case 'hit': {
            const { index } = action.payload;

            const shoe = [ ...state.shoe ];
            const cards = [ ...state.hands[index].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) {
                console.log('The player busted.');
                const { bet } = state.hands[index];
                return {
                    ...state,
                    shoe,
                    bank: state.bank + bet,
                    hands: state.hands.map((hand, handIndex) => handIndex === index ? {
                        ...hand,
                        cards,
                        bet: 0,
                        action: false,
                        settled: true, // Busted hands are settled immediately.
                    } : hand),
                };
            }
            
            return {
                ...state,
                shoe,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, cards } : hand),
            };
        }
        case 'surrender': {
            console.log('The player surrendered.');
            const { index, configuration: { surrenderCost } } = action.payload;
            const bet = state.hands[index].bet;
            const amount = bet * surrenderCost;
            const bank = state.bank + amount;

            return {
                ...state,
                bank,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? {
                    ...hand,
                    bet: bet - amount,
                    action: false,
                    settled: true, // Surrendered hands are settled immediately.
                } : hand),
            };
        }
        case 'double': {
            const { index } = action.payload;

            const amount = state.hands[index].bet;
            const bankroll = state.bankroll - amount;
            const hands = [ ...state.hands ].map((hand, handIndex) => handIndex === index ? {
                ...hand,
                bet: hand.bet + amount,
            } : hand);

            const shoe = [ ...state.shoe ];
            const cards = [ ...state.hands[index].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) {
                console.log('The player busted.');
                const { bet } = state.hands[index];
                return {
                    ...state,
                    bank: state.bank + bet,
                    bankroll,
                    hands: hands.map((hand, handIndex) => handIndex === index ? {
                        ...hand,
                        cards,
                        bet: 0,
                        action: false,
                        settled: true,
                    } : hand),
                    shoe,
                };
            }
            
            return {
                ...state,
                bankroll,
                hands: hands.map((hand, handIndex) => handIndex === index ? { ...hand, cards, action: false } : hand),
                shoe,
            };
        }
        case 'betInsurance': {
            const { index } = action.payload;
            const { configuration: { insuranceCost } } = action.payload;
            const amount = state.hands[index].bet * insuranceCost;
            const bankroll = state.bankroll - amount;

            return {
                ...state,
                bankroll,
                hands: [ ...state.hands ].map((hand, handIndex) => handIndex === index ? {
                    ...hand,
                    insuranceBet: amount,
                    offerInsurance: false,
                } : hand),
            };
        }
        case 'declineInsurance': {
            const { index } = action.payload;

            return {
                ...state,
                hands: state.hands.map((hand, handIndex) => handIndex === index ? { ...hand, offerInsurance: false } : hand),
            };
        }
        case 'idle': { // Reset relevant state variables.

            // Settle all outstanding bets.
            let bank = state.bank;
            const hands = [ ...state.hands ].map(hand => {
                if (hand.settled) {
                    return hand;
                }

                if (isBlackjack(state.dealerCards)) {
                    if (isBlackjack(hand.cards)) {
                        console.log('The player pushed.');
                        return hand; // The player pushes with a blackjack.
                    }
                    console.log('The dealer has a blackjack and the player did not. The player lost the bet.');
                    bank += hand.bet;
                    return { ...hand, bet: 0 }; // The player lost the bet.
                }

                // The Dealer busted and the player did not so the player won the bet.
                if (isBusted(state.dealerCards) && !isBusted(hand.cards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    console.log(`The Dealer busted and the player won ${amountWon}.`);
                    return { ...hand, bet: hand.bet + amountWon };
                }

                // The value of the player's hand is equal to the value of the dealer's hand so the player pushes.
                if (handValue(state.dealerCards) === handValue(hand.cards)) {
                    console.log('The player pushed.');
                    return hand;
                }

                // The value of the dealer's hand is greater than the value of the player's hand so the player lost the bet.
                if (handValue(state.dealerCards) > handValue(hand.cards)) {
                    console.log('The player lost.');
                    bank += hand.bet;
                    return { ...hand, bet: 0 };
                }

                // The value of the player's hand is greater than the value of the dealer's hand, so the player wins.
                if (handValue(hand.cards) > handValue(state.dealerCards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    console.log(`The player won ${amountWon}.`);
                    return { ...hand, bet: hand.bet + amountWon };
                }

                // No other outcomes are possible; busted, surrendered, and blackjack hands are settled immediately.
                throw new Error('A hand is in an invalid state.');
            });

            return {
                ...state,
                bank,
                hands: hands.map(hand => ({
                    ...hand,
                    insuranceBet: 0,
                    offerInsurance: false,
                    action: false,
                    settled: true,
                })),
                dealerActionComplete: false,
                currentState: states.idle,
            };
        }
        case 'deal': { // Deal two cards to each player and the dealer.
            const { configuration } = action.payload;

            let shoe = [ ...state.shoe ];
            const { numberOfDecks, penetration, cutRange } = configuration;
            if (shoe.length < 52 * numberOfDecks * (100 - penetration) / 100) {

                shoe = []; // Generate a new shoe.
                for (let i = 0; i < numberOfDecks; i++) {
                    shoe.push(...getDeck());
                }

                // Shuffle the cards in the shoe.
                for (let index = shoe.length - 1; index > 0; index--) {
                    const randomCardIndex = Math.floor(Math.random() * (index + 1));
                    const temp = shoe[randomCardIndex];
                    shoe[randomCardIndex] = shoe[index];
                    shoe[index] = temp;
                }

                // Cut the cards.
                const percent = getRandomNumberInRange(cutRange.min, cutRange.max); // todo Allow the user to select the cut percent.
                const temp = [ ...shoe ];
                const location = Math.floor(temp.length * percent / 100);
                shoe = [ ...temp.slice(location), ...temp.slice(0, location) ];
            }

            shoe.pop(); // Burn a card.

            // Deal two cards to each player and the dealer.
            const hands = state.hands.map(hand => ({ ...hand, cards: [], offerInsurance: false, settled: false }));
            let dealerCards = [];
            for (let i = 0; i < 2; i++) {
                hands.forEach(hand => hand.cards.push(shoe.pop()));
                dealerCards.push(shoe.pop());
            }
    
            return {
                ...state,
                shoe,
                hands,
                dealerCards,
                reveal: false,
                dealerActionComplete: false,
                currentState: states.deal
            };
        }
        case 'insurance': { // Offer insurance to each player.
            return {
                ...state,
                hands: state.hands.map(hand => ({ ...hand, offerInsurance: true })),
                currentState: states.insurance,
            };
        }
        case 'peek': { // Peek at the dealer's down card and settle all outstanding insurance bets.

            const dealerHasBlackjack = isBlackjack(state.dealerCards); // Peek
            console.log('peek', dealerHasBlackjack);

            // Settle all outstanding insurance bets.
            let bank = state.bank;
            let bankroll = state.bankroll;
            const { insurancePays } = action.payload.configuration;
            let hands = [ ...state.hands ];

            if (getUpCardValue(state.dealerCards) === 1) { // Dealer is showing an Ace.
                hands = hands.map(hand => {
                    if (dealerHasBlackjack) {
                        console.log('The player won the insurance bet.');
                        const amountWon = hand.insuranceBet * insurancePays;
                        bank -= amountWon;
                        bankroll += amountWon;
                        bankroll += hand.insuranceBet;
                        return {
                            ...hand,
                            insuranceBet: 0,
                        };
                    }
    
                    console.log('The player lost the insurance bet.');
                    bank += hand.insuranceBet;
                    return {
                        ...hand,
                        insuranceBet: 0,
                    };
                });
            }

            return {
                ...state,
                bank,
                bankroll,
                hands,
                reveal: dealerHasBlackjack,
                currentState: states.peek,
            };
        }
        case 'play': { // Allow players to act on their hands.
            const { blackjackPays } = action.payload.configuration;
            let bank = state.bank;
            const hands = [ ...state.hands ].map(hand => {
                if (isBlackjack(hand.cards)) {
                    console.log('The player has a blackjack.');
                    const bet = hand.bet;
                    const amountWon = bet * blackjackPays;
                    bank -= amountWon;
                    return { ...hand, bet: bet + amountWon, settled: true };
                }
                return hand;
            });

            return {
                ...state,
                bank,
                hands: hands.map(hand => ({ ...hand, action: true })),
                currentState: states.play,
            };
        }
        case 'dealer': {
            if (state.hands.filter(hand => !hand.settled).length < 1) {
                return {
                    ...state,
                    reveal: true,
                    currentState: states.dealer,
                };
            }

            // Play out the dealer's hand.
            const shoe = [ ...state.shoe ];
            const dealerCards = [ ...state.dealerCards ];
            if (!state.dealerActionComplete) {
                const { dealerHitsSoft17 } = action.payload.configuration;
                const mustHit = cards => {
                    const dealerHandValue = handValue(cards);
                    return dealerHitsSoft17 && isSoft(cards) ? dealerHandValue < 18 : dealerHandValue < 17;
                };
                while (mustHit(dealerCards)) { dealerCards.push(shoe.pop()); }
            }

            return {
                ...state,
                shoe,
                dealerCards,
                reveal: true,
                dealerActionComplete: true,
                currentState: states.dealer,
            };
        }
        default:
            throw new Error(`Unhandled state: ${action.type}`);
    }
};

export const Game = () => {
    const [state, dispatch] = useReducer(reducer, {
        bank: 0,
        bankroll: 0,
        shoe: [],
        hands: [{
            bet: 0,
            cards: [],
            insuranceBet: 0,
            action: false,
            offerInsurance: false,
            settled: true,
        }],
        dealerCards: [],
        reveal: false,
        dealerActionComplete: true,
        currentState: states.idle,
    });
    const [configuration] = useState(() => ({
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
        insurancePays: 2,
    }));

    const totalBets = state.hands.reduce((sum, hand) => sum + hand.bet + hand.insuranceBet, 0);
    if (state.bank + state.bankroll + totalBets !== 0) {
        console.error('Accounting error.', { bank: state.bank, bankroll: state.bankroll, totalBets });
    }

    // Implicit State Transitions
    switch (state.currentState) {
        case states.deal: {
            const upCardValue = getUpCardValue(state.dealerCards);
            if (upCardValue === 1) { // Transition from deal to insurance when dealer shows ace.
                dispatch({ type: states.insurance, payload: { configuration } });
                break;
            };
            
            if (upCardValue === 10) { // Transition from deal to peek when dealer shows 10.
                dispatch({ type: states.peek, payload: { configuration } });
                break;
            }
    
            dispatch({ type: states.play, payload: { configuration } }); // Transition from deal to play when dealer shows 2 - 9.
            break;
        }
        case states.play: {
            // Transition from play to idle when all players are finished with all hands.
            if (state.hands.filter(hand => hand.action).length < 1) {
                dispatch({ type: states.dealer, payload: { configuration } });
            }
            break;
        }
        case states.insurance: {
            // Transition from insurance to peek when all players have been offered insurance for each hand.
            if (state.hands.filter(hand => hand.offerInsurance).length < 1) {
                dispatch({ type: states.peek, payload: { configuration } });
            }
            break;
        }
        case states.peek: {
            // Transition from peek to idle when the dealer has a blackjack.
            if (isBlackjack(state.dealerCards)) {
                dispatch({ type: states.idle, payload: { configuration } });
                break;
            }

            // Transition from peek to play when the dealer does not have a blackjack.
            dispatch({ type: states.play, payload: { configuration } });
            break;
        }
        case states.dealer: {
            // Transition from dealer to idle after the dealer has finished playing.
            dispatch({ type: states.idle, payload: { configuration } });
            break;
        }
        default: {
            break;
        }
    }

    return (
        <Flex sx={{
            width: '100vw',
            height: '100vh',
            bg: 'feltGreen',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <Flex sx={{ justifyContent: 'space-between', p: '1rem', width: '100%' }}>
                <Text sx={{ color: 'yellow' }}>{`Decks: ${configuration.numberOfDecks}`}</Text>
                <Text sx={{ color: 'yellow' }}>{`Bank: ¤ ${state.bank}`}</Text>
                <Text sx={{ color: 'yellow' }}>{`Shoe: ${state.shoe.length} cards`}</Text>
            </Flex>
            <Dealer handValue={handValue} {...state} />
            <Table
                placeInsuranceBet={index => dispatch({ type: 'betInsurance', payload: { index, configuration } })}
                declineInsurance={index => dispatch({ type: 'declineInsurance', payload: { index, configuration } })}
                {...state}
            />
            <Player
                handValue={handValue}
                incrementBet={index => dispatch({ type: 'incrementBet', payload: { index } })}
                decrementBet={index => dispatch({ type: 'decrementBet', payload: { index } })}
                clearBet={index => dispatch({ type: 'clearBet', payload: { index } })}
                deal={() => dispatch({ type: 'deal', payload: { configuration } })}
                stand={index => dispatch({ type: 'stand', payload: { index } })}
                hit={index => dispatch({ type: 'hit', payload: { index } })}
                surrender={index => dispatch({ type: 'surrender', payload: { index, configuration } })}
                double={index => dispatch({ type: 'double', payload: { index } })}
                // split={split}
                {...state}
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