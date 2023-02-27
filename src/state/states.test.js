import mutations from './mutations';

// todo Add tests for removeHand.

describe('states', () => {

    const baseState = {
        bank: 0,
        bankroll: 0,
        shoe: [],
        hands: [
            {
                bet: 0,
                cards: [],
                insuranceBet: 0,
                completed: false,
                settled: true,
                offerInsurance: false,
            },
        ],
        dealerCards: [],
        reveal: false,
        dealerActionComplete: true,
        currentState: mutations.idle.label,
    };

    describe('incrementBet', () => {
        test('incrementBet subtracts 1 from bankroll and adds 1 to the bet', () =>{
            expect(mutations.incrementBet.mutate(baseState, 0)).toEqual({
                ...baseState,
                bankroll: -1,
                hands: [{ ...baseState.hands[0], bet: 1 }],
            });
        });
    });

    describe('decrementBet', () => {
        test('decrementBet subtracts 1 from the bet and increments the bankroll by 1', () =>{
            expect(mutations.decrementBet.mutate(baseState, 0)).toEqual({
                ...baseState,
                bankroll: 1,
                hands: [{ ...baseState.hands[0], bet: -1 }],
            });
        });
    });

    describe('clearBet', () => {
        test('clearBet subtracts the bet amount from the bet and increments the bankroll by the bet amount', () =>{
            const state = { ...baseState, hands: [{ ...baseState.hands[0], bet: 1 }] };

            expect(mutations.clearBet.mutate(state, 0)).toEqual({
                ...state,
                bankroll: 1,
                hands: [{ ...baseState.hands[0], bet: 0 }],
            });
        });
    });

    describe('stand', () => {
        test('stand sets the hand\'s completed flag to true and preserves existing values.', () => {
            const state = {
                ...baseState,
                hands: [{
                    ...baseState.hands[0],
                    bet: 1,
                    cards: [{ value: 10 }, { value: 4 }],
                }],
            };

            expect(mutations.stand.mutate(state, 0)).toEqual({
                ...baseState,
                hands: [{
                    ...baseState.hands[0],
                    bet: 1,
                    cards: [{ value: 10 },{ value: 4 }],
                    completed: true,
                }],
            });
        });
    });

    describe('surrender', () => {
        test('surrender should subtract the cost of surrender from the bet and add it to the bank', () => {
            const state = {
                ...baseState,
                hands: [{ ...baseState.hands[0], bet: 1 }],
            };

            expect(mutations.surrender.mutate(state, 0)).toEqual({
                ...baseState,
                bank: 1 / 2,
                hands: [{ ...baseState.hands[0], bet: 1 / 2, completed: true, settled: true },],
            });
        });
    });

    describe('hit', () => {

        test('hit should remove a card from the shoe and add it to the player\'s hand.', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 1 }],
            };

            expect(mutations.hit.mutate(state, 0)).toEqual({
                ...baseState,
                shoe: [],
                hands: [{ ...baseState.hands[0], cards: [{ value: 1 }] }],
            });
        });

        test('hit should add the bet amount to the bank and set the bet amount to 0 when the hand busts', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 10 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 10 }, { value: 10 }] }],
            };

            expect(mutations.hit.mutate(state, 0)).toEqual({
                ...baseState,
                bank: 1,
                shoe: [],
                hands: [{ ...baseState.hands[0], bet: 0, cards: [{ value: 10 }, { value: 10 }, { value: 10 }], completed: true, settled: true }],
            });
        });
    });

    describe('double', () => {
        test('double should subtract the bet amount from the bankroll, add one card to the hand and set the hand to completed', () => {
            const state = {
                ...baseState,
                bankroll: 1,
                shoe: [{ value: 1 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 9 }, { value: 2 }] }],
            };
            expect(mutations.double.mutate(state, 0)).toEqual({
                ...baseState,
                bankroll: 0,
                shoe: [],
                hands: [{ ...baseState.hands[0], bet: 2, cards: [{ value: 9 }, { value: 2 }, { value: 1 }], completed: true }],
            });
        });
    });

    describe('betInsurance should decrease the bankroll by the cost of insurance, add that to hand.insuranceBet, and flag offerInsurance to false', () => {
        const state = {
            ...baseState,
            hands: [{ ...baseState.hands[0], bet: 1, offerInsurance: true, }],
        };

        expect(mutations.betInsurance.mutate(state, 0)).toEqual({
            ...baseState,
            bankroll: - 1 / 2,
            hands: [{ ...baseState.hands[0], bet: 1, insuranceBet: 1 / 2, offerInsurance: false }],
        });
    });

    describe('declineInsurance', () => {
        const state = {
            ...baseState,
            hands: [{ ...baseState.hands[0], offerInsurance: true }],
        };
        expect(mutations.declineInsurance.mutate(state, 0)).toEqual({
            ...baseState,
            hands: [{ ...baseState.hands[0], offerInsurance: false }],
        });
    });

    describe('idle', () => {
        const state = {
            ...baseState,
            shoe: [{ value: 10 }],
            hands: [{
                ...baseState.hands[0],
                completed: true,
                settled: false,
                offerInsurance: true,
            }],
            reveal: true,
            dealerActionComplete: true,
            currentState: mutations.settleBets.label,
        };
        expect(mutations.idle.mutate(state)).toEqual({
            ...baseState,
            shoe: [{ value: 10 }],
            hands: [{
                ...baseState.hands[0],
                completed: false,
                settled: true,
                offerInsurance: false,
            }],
            reveal: true,
            dealerActionComplete: true,
            currentState: mutations.idle.label,
        });
    });

    describe('dealCards', () => {
        const state = {
            ...baseState,
            shoe: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 2 }, { value: 2 }, { value: 2 }, { value: 2 },
                { value: 3 }, { value: 3 }, { value: 3 }, { value: 3 },
                { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 },
                { value: 5 }, { value: 5 }, { value: 5 }, { value: 5 },
                { value: 6 }, { value: 6 }, { value: 6 }, { value: 6 },
                { value: 7 }, { value: 7 }, { value: 7 }, { value: 7 },
                { value: 8 }, { value: 8 }, { value: 8 }, { value: 8 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 6 },
                { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 },
            ],
        };
        expect(mutations.dealCards.mutate(state, { numberOfDecks: 1, penetration: 66, cutRange: { min: 20, max: 80 } })).toEqual({
            ...baseState,
            shoe: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 2 }, { value: 2 }, { value: 2 }, { value: 2 },
                { value: 3 }, { value: 3 }, { value: 3 }, { value: 3 },
                { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 },
                { value: 5 }, { value: 5 }, { value: 5 }, { value: 5 },
                { value: 6 }, { value: 6 }, { value: 6 }, { value: 6 },
                { value: 7 }, { value: 7 }, { value: 7 }, { value: 7 },
                { value: 8 }, { value: 8 }, { value: 8 }, { value: 8 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 },
                { value: 10 }, { value: 10 }, { value: 10 }
            ],
            hands: [{ ...baseState.hands[0], cards: [{ value: 9 }, { value: 7 }], settled: false }],
            dealerCards: [{ value: 8 }, { value: 6 }],
            dealerActionComplete: false,
            currentState: mutations.dealCards.label,
        });
    });

    describe('offerInsurance', () => {
        const state = {
            ...baseState,
            hands: [{ ...baseState.hands[0], offerInsurance: false }],
            currentState: mutations.dealCards.label,
        };
        expect(mutations.offerInsurance.mutate(state)).toEqual({
            ...baseState,
            hands: [{ ...baseState.hands[0], offerInsurance: true }],
            currentState: mutations.offerInsurance.label,
        });
    });

    describe('waitInsurance', () => {
        const state = {
            ...baseState,
            currentState: mutations.dealCards.label,
        };
        expect(mutations.waitInsurance.mutate(state)).toEqual({
            ...baseState,
            currentState: mutations.waitInsurance.label,
        });
    });

    describe('dealerPeek', () => {
        test('dealerPeek without dealer blackjack', () => {
            const state = {
                ...baseState,
                dealerCards: [{ value: 6 }, { value: 10 }],
                hands: [{ ...baseState.hands[0], cards: [{ value: 2 }, { value: 3 }] }],
            };
            expect(mutations.dealerPeek.mutate(state)).toEqual({
                ...state,
                currentState: mutations.dealerPeek.label,
            });
        });
        test('dealerPeek with dealer blackjack', () => {
            const state = {
                ...baseState,
                dealerCards: [{ value: 1 }, { value: 10 }],
                hands: [{ ...baseState.hands[0], cards: [{ value: 2 }, { value: 3 }] }],
            };
            expect(mutations.dealerPeek.mutate(state)).toEqual({
                ...state,
                reveal: true,
                currentState: mutations.dealerPeek.label,
            });
        });
        test('dealerPeek without dealer blackjack and insurance', () => {
            const state = {
                ...baseState,
                dealerCards: [{ value: 6 }, { value: 1 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 2 }, { value: 3 }], insuranceBet: 1 / 2 }],
            };
            expect(mutations.dealerPeek.mutate(state)).toEqual({
                ...baseState,
                bank: 1 / 2,
                dealerCards: [{ value: 6 }, { value: 1 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 2 }, { value: 3 }], insuranceBet: 0 }],
                currentState: mutations.dealerPeek.label,
            });
        });
        test('dealerPeek with dealer blackjack and insurance', () => {
            const state = {
                ...baseState,
                dealerCards: [{ value: 10 }, { value: 1 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 2 }, { value: 3 }], insuranceBet: 1 / 2 }],
            };
            expect(mutations.dealerPeek.mutate(state)).toEqual({
                ...baseState,
                bank: -1,
                bankroll: 1.5 ,
                dealerCards: [{ value: 10 }, { value: 1 }],
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 2 }, { value: 3 }], insuranceBet: 0 }],
                reveal: true,
                currentState: mutations.dealerPeek.label,
            });
        });
    });

    describe('playerPlay', () => {
        test('player has a blackjack', () => {
            const state = {
                ...baseState,
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 10 }, { value: 1 }] }],
                currentState: mutations.dealCards.label,
            };
            expect(mutations.playerPlay.mutate(state, { blackjackPays: 3 / 2 })).toEqual({
                ...baseState,
                bank: -1.5,
                hands: [{ ...state.hands[0], bet: 2.5, completed: true, settled: true }],
                currentState: mutations.playerPlay.label,
            });
        });
        test('player does not have a blackjack', () => {
            const state = {
                ...baseState,
                hands: [{ ...baseState.hands[0], bet: 1, cards: [{ value: 10 }, { value: 2 }] }],
                currentState: mutations.dealCards.label,
            };
            expect(mutations.playerPlay.mutate(state, { blackjackPays: 3 / 2 })).toEqual({
                ...state,
                currentState: mutations.playerPlay.label,
            });
        });
    });

    describe('dealerPlay', () => {
        test('dealer with hard 16 should hit', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 5 }],
                dealerCards: [{ value: 10 }, { value: 6 }],
                reveal: false,
                dealerActionComplete: false,
                currentState: mutations.playerPlay.label,
            };
            expect(mutations.dealerPlay.mutate(state, { dealerHitsSoft17: true })).toEqual({
                ...baseState,
                shoe: [],
                dealerCards: [{ value: 10 }, { value: 6 }, { value: 5 }],
                reveal: true,
                dealerActionComplete: true,
                currentState: mutations.dealerPlay.label,
            });
        });
        test('dealer with hard 17 should not hit', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 5 }],
                dealerCards: [{ value: 10 }, { value: 7 }],
                dealerActionComplete: false,
                currentState: mutations.playerPlay.label,
            };
            expect(mutations.dealerPlay.mutate(state, { dealerHitsSoft17: true })).toEqual({
                ...baseState,
                reveal: true,
                shoe: [{ value: 5 }],
                dealerCards: [{ value: 10 }, { value: 7 }],
                dealerActionComplete: true,
                currentState: mutations.dealerPlay.label,
            });
        });
        test('dealer with soft 17 should hit', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 4 }],
                dealerCards: [{ value: 1 }, { value: 6 }],
                dealerActionComplete: false,
                currentState: mutations.playerPlay.label,
            };
            expect(mutations.dealerPlay.mutate(state, { dealerHitsSoft17: true })).toEqual({
                ...baseState,
                reveal: true,
                shoe: [],
                dealerCards: [{ value: 1 }, { value: 6 }, { value: 4 }],
                dealerActionComplete: true,
                currentState: mutations.dealerPlay.label,
            });
        });
        test('dealer with hard 18 should not hit', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 5 }],
                dealerCards: [{ value: 10 }, { value: 8 }],
                dealerActionComplete: false,
                currentState: mutations.playerPlay.label,
            };
            expect(mutations.dealerPlay.mutate(state, { dealerHitsSoft17: true })).toEqual({
                ...baseState,
                reveal: true,
                shoe: [{ value: 5 }],
                dealerCards: [{ value: 10 }, { value: 8 }],
                dealerActionComplete: true,
                currentState: mutations.dealerPlay.label,
            });
        });
        test('dealer with soft 17 and !dealerHitsSoft17 should not hit', () => {
            const state = {
                ...baseState,
                shoe: [{ value: 4 }],
                dealerCards: [{ value: 1 }, { value: 6 }],
                dealerActionComplete: false,
                currentState: mutations.playerPlay.label,
            };
            expect(mutations.dealerPlay.mutate(state, { dealerHitsSoft17: false })).toEqual({
                ...baseState,
                reveal: true,
                shoe: [{ value: 4 }],
                dealerCards: [{ value: 1 }, { value: 6 }],
                dealerActionComplete: true,
                currentState: mutations.dealerPlay.label,
            });
        });
    });

    describe('settleBets', () => {

        test('hand is already settled', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, settled: true }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, settled: true }],
                currentState: mutations.settleBets.label,
            });
        });

        test('both dealer and player have blackjack', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 1 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 1 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 1 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 1 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });

        test('dealer has a blackjack and the player does not', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 6 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 1 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 2,
                bankroll: 1,
                hands: [{ bet: 0, cards: [{ value: 6 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 1 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });

        test('dealer has busted and the player did not', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 6 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 6 }, { value: 10 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 0,
                bankroll: 1,
                hands: [{ bet: 2, cards: [{ value: 6 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 6 }, { value: 10 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });

        test('player pushes', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 7 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 7 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 7 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 7 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });

        test('dealer wins', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 7 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 8 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 2,
                bankroll: 1,
                hands: [{ bet: 0, cards: [{ value: 7 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 8 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });

        test('player wins', () => {
            const state = {
                ...baseState,
                bank: 1,
                bankroll: 1,
                hands: [{ bet: 1, cards: [{ value: 8 }, { value: 10 }], settled: false }],
                dealerCards: [{ value: 7 }, { value: 10 }],
            };
            expect(mutations.settleBets.mutate(state)).toEqual({
                ...baseState,
                bank: 0,
                bankroll: 1,
                hands: [{ bet: 2, cards: [{ value: 8 }, { value: 10 }], settled: true }],
                dealerCards: [{ value: 7 }, { value: 10 }],
                currentState: mutations.settleBets.label,
            });
        });
    });
});