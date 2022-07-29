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

/*
    todo:
        Add disabled to buttons.
        Hands are played in reverse order.
        Add a button to each hand to remove it.

*/

const states = {
    addHand: {
        label: 'addHand',
        mutate: state => {
            const hands = [ ...state.hands ];
            if (hands.length > 6) {
                return state;
            }

            hands.push({
                bet: 0,
                cards: [],
                insuranceBet: 0,
                completed: false,
                settled: true,
                offerInsurance: false,
            });
            return {
                ...state,
                hands,
            };
        },
    },
    incrementBet: {
        label: 'incrementBet',
        mutate: (state, handIndex) => {
            return {
                ...state,
                bankroll: state.bankroll - 1,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, bet: hand.bet + 1 } : hand),
            };
        },
    },
    decrementBet: {
        label: 'decrementBet',
        mutate: (state, handIndex) => {
            return {
                ...state,
                bankroll: state.bankroll + 1,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, bet: hand.bet - 1 } : hand),
            };
        },
    },
    clearBet: {
        label: 'clearBet',
        mutate: (state, handIndex) => {
            return {
                ...state,
                bankroll: state.bankroll + state.hands[handIndex].bet,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, bet: 0 } : hand),
            };
        },
    },
    stand: {
        label: 'stand',
        mutate: (state, handIndex) => {
            return {
                ...state,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, completed: true } : hand),
            };
        },
    },
    surrender: {
        label: 'surrender',
        mutate: (state, handIndex, configuration) => {
            const { surrenderCost } = configuration;
            const bet = state.hands[handIndex].bet;
            const amount = bet * surrenderCost;

            return {
                ...state,
                bank: state.bank + amount,
                hands: state.hands.map((hand, index) => index === handIndex ? {
                    ...hand,
                    bet: bet - amount,
                    completed: true,
                    settled: true,
                } : hand),
            };
        },
    },
    hit: {
        label: 'hit',
        mutate: (state, handIndex) => {
            const shoe = [ ...state.shoe ];
            const cards = [ ...state.hands[handIndex].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) {
                const { bet } = state.hands[handIndex];
                return {
                    ...state,
                    shoe,
                    bank: state.bank + bet,
                    hands: state.hands.map((hand, index) => index === handIndex ? {
                        ...hand,
                        cards,
                        bet: 0,
                        completed: true,
                        settled: true,
                    } : hand),
                };
            }
            
            return {
                ...state,
                shoe,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, cards } : hand),
            };
        },
    },
    double: {
        label: 'double',
        mutate: (state, handIndex) => {

            // Double the bet.
            const betAmount = state.hands[handIndex].bet;
            const bankroll = state.bankroll - betAmount;

            const hands = state.hands.map((hand, index) => index === handIndex ? {
                ...hand,
                bet: hand.bet + betAmount,
            } : hand);

            // todo This is duplicated in playerActions.hit above.
            const shoe = [ ...state.shoe ];
            const cards = [ ...hands[handIndex].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) {
                const { bet } = hands[handIndex];
                return {
                    ...state,
                    bank: state.bank + bet,
                    bankroll,
                    hands: hands.map((hand, index) => index === handIndex ? {
                        ...hand,
                        cards,
                        bet: 0,
                        completed: true,
                        settled: true,
                    } : hand),
                    shoe,
                };
            }
            
            return {
                ...state,
                bankroll,
                hands: hands.map((hand, index) => index === handIndex ? { ...hand, cards, completed: true } : hand),
                shoe,
            };
        },
    },
    betInsurance: {
        label: 'betInsurance',
        mutate: (state, handIndex, configuration) => {
            const amount = state.hands[handIndex].bet * configuration.insuranceCost;
            return {
                ...state,
                bankroll: state.bankroll - amount,
                hands: [ ...state.hands ].map((hand, index) => index === handIndex ? {
                    ...hand,
                    insuranceBet: amount,
                    offerInsurance: false,
                } : hand),
            };
        },
    },
    declineInsurance: {
        label: 'declineInsurance',
        mutate: (state, handIndex) => {
            return {
                ...state,
                hands: state.hands.map((hand, index) => index === handIndex ? { ...hand, offerInsurance: false } : hand),
            };
        },
    },
    idle: {
        label: 'idle',
        mutate: state => ({
            ...state,
            hands: [...state.hands].map(hand => ({
                ...hand,
                completed: false,
                settled: true,
                offerInsurance: false,
            })),
            reveal: false,
            dealerActionComplete: true,
            currentState: states.idle.label,
        }),
    },
    dealCards: {
        label: 'dealCards',
        mutate: (state, configuration) => {
            const { numberOfDecks, penetration, cutRange } = configuration;

            let shoe = [ ...state.shoe ];
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
                const location = Math.floor(shoe.length * percent / 100);
                shoe = [ ...shoe.slice(location), ...shoe.slice(0, location) ];
            }

            shoe.pop(); // Burn a card.

            // Deal two cards to each player and the dealer.
            const hands = [ ...state.hands ].map(hand => ({ ...hand, cards: [], completed: false, settled: false}));
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
                currentState: states.dealCards.label
            };
        },
    },
    offerInsurance: {
        label: 'offerInsurance',
        mutate: state => ({
            ...state,
            hands: [ ...state.hands ].map(hand => ({ ...hand, offerInsurance: true })),
            currentState: states.offerInsurance.label,
        }),
    },
    waitInsurance: {
        label: 'waitInsurance',
        mutate: state => ({
            ...state,
            currentState: states.waitInsurance.label,
        }),
    },
    dealerPeek: {
        label: 'dealerPeek',
        mutate: (state, configuration) => {
            const dealerHasBlackjack = isBlackjack(state.dealerCards); // Peek

            // Settle all outstanding insurance bets.
            let bank = state.bank;
            let bankroll = state.bankroll;
            const { insurancePays } = configuration;
            let hands = [ ...state.hands ];

            if (getUpCardValue(state.dealerCards) === 1) { // Dealer is showing an Ace.
                hands = hands.map(hand => {
                    if (hand.insuranceBet === 0) {
                        return hand;
                    }

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
                currentState: states.dealerPeek.label,
            };
        },
    },
    playerPlay: {
        label: 'playerPlay',
        mutate: (state, configuration) => {
            const { blackjackPays } = configuration;
            let bank = state.bank;
            const hands = [ ...state.hands ].map(hand => {
                if (isBlackjack(hand.cards)) {
                    const bet = hand.bet;
                    const amountWon = bet * blackjackPays;
                    bank -= amountWon;
                    return { ...hand, bet: bet + amountWon, completed: true, settled: true };
                }
                return hand;
            });

            return {
                ...state,
                bank,
                hands: hands.map(hand => ({ ...hand })),
                currentState: states.playerPlay.label,
            };
        },
    },
    dealerPlay: {
        label: 'dealerPlay',
        mutate: (state, configuration) => {

            // Play out the dealer's hand.
            const shoe = [ ...state.shoe ];
            const dealerCards = [ ...state.dealerCards ];
            if (!state.dealerActionComplete) {
                const { dealerHitsSoft17 } = configuration;
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
                currentState: states.dealerPlay.label,
            };
        },
    },
    settleBets: {
        label: 'settleBets',
        mutate: state => {
            let bank = state.bank;
            const hands = [ ...state.hands ].map(hand => {
                if (hand.settled) {
                    return hand;
                }

                if (isBlackjack(state.dealerCards)) {
                    if (isBlackjack(hand.cards)) {
                        return hand;
                    }
                    bank += hand.bet;
                    return { ...hand, bet: 0 };
                }

                if (isBusted(state.dealerCards) && !isBusted(hand.cards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon };
                }

                if (handValue(state.dealerCards) === handValue(hand.cards)) {
                    return hand;
                }

                if (handValue(state.dealerCards) > handValue(hand.cards)) {
                    bank += hand.bet;
                    return { ...hand, bet: 0 };
                }

                if (handValue(hand.cards) > handValue(state.dealerCards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon };
                }

                throw new Error('A hand is in an invalid state.');
            });

            return {
                ...state,
                bank,
                hands,
                currentState: states.settleBets.label,
            };
        },
    },
};

export default states;