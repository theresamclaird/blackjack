import { createMachine, assign } from 'xstate';
import {
    getShoe,
    getUpCardValue,
    isBlackjack,
    getHandValue,
    isSoft,
    isBusted,
    shuffle,
    cut,
 } from '../utils/cards';
import { getRandomNumberInRange } from '../utils/random';

const newHand = {
    bet: 0,
    cards: [],
    insuranceBet: 0,
    status: '',
    offerInsurance: false,
    complete: false,
    settled: false,
    split: false,
};

const blackjackMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5QCMA2BDAxgawFZewDoBLCVMAYgBEBRAQQBlFQAHAe1mIBdi2A7ZiAAeiALQBGAOyTCATgDMsqQBZx4gBwKADACZ5AGhABPMZpmSArBfmTZW8dZ2SAvs8NoC+HCTKUAkgByAMIASjQAsjQBACoA+gBCNNGC7Jw8-IIiCBJaAGy5cmo6WhZKOqWyuYYm2WrK8oS5spJ5NrmK6q7uGDheRKTk1DShEVFxiclIIKncvAJTWaKaBcrKufY6lbni8hrVYnUNTS25trnqmvI6XSAevQQ+g0EM9CEJSSkcsxkLYpJShC0sk24h06kkmiUFn2tXE9UazTyZwuCmubluPTwDwGlDoVCosQAEnQAlRPmk5pkxJt1IR1HD6soLJJcjomrIYRIdrTNBZ6pZmUp-jc7ljvDiKGFwgB5ABqNCJJLJUxm6XmoEWylkskIzNyfPpVmKYIMxgO3Lpsj5ynUWhaxV0IsxfUIEDA6FQFHJ33VwlMFkI0lWGnUejy53EnOZOkI8nqEbqDlBTs8DzYADN02AAE5+PiwACu2fQfEwuKCQRoAAVJqwvmqqQgKoDbe0pNrZKpTTUuWzCDoivkB1rtsoU-dvBms7n80WS2Whs9AjRvQ3fgg2Q0LFotLt8vILtIdJy1Fd+7omvZcqoIbJx2KiFOc3nC8XS5RV5T18oWXT1Ez1AscodHqcplE5SQtTkI9KnEdo2X-e8XRYMAwGwL0VXrL8NUQH8dV3OFbHkIDxG1bs-hjLYSlKPRbD0cQkIeFgMCMHMKAAZWiJVPx+HDsnkM8rFtVYQRZHRjzNbJylpYpJCcOxJHkXctDWRjvGY9BWOzDiAFUQjCUkaBCHjfUWOMA2UexbFKZQBzsdoT0swgHFZWR1CHJo0W6VN1JYtjCT8Wtpiw3i-X4vRdWKaxbFtDQWRhEDYxsLR1HMixQ1sixcjUogNK06hpR0+IXhMxtRAEmR2yUfdrBS8iEAtET-htNzaLjHLCDytj2KrBhAtK9dyrBWMWVtEpgQyqpJPKFYFH-fl-1BdoOq67SBr4iR5AKEisvWICwR2cDJMsrQ5HEsEgIPdKrA6t0PTY9awqA07wUg41QN2I6aiaApLEgncSgPc4XHRUUXVgMAuC4QZHsWQCZFDdpVDta9qphQDlEBWw4JOtQITRdE+DYN14CmMHsV8WGxHg2NpKZRSDx-CSeyUTHQV3aQUp-OD5Fu91UCp-jTssMDtXEO0lPsTklFOhTdA7Ui4M6UHnTTTNn1nN8y0FyyeRU5kmYsOEHGln9AyE9o4yvJoVtQ7BBasGRticLVzqN69ORtcRCFUdYpHbFoIWylWfNyvzs0F0R8ljNQFFZYjnbjE98KN2zxaZH68j5+6I8wilQsWNQA0UXdJcUYEf3UGF8gDBxbP1HZmjjEHvInIgIah8hBbkmMkf1ex3JU4jq-1Zy+XEuSrXdryMVDyPxbsQp2dKUEKimntQQcBEWh2PltAsVxXCAA */
createMachine({
  context: {
    bank: 0,
    bankroll: 0,
    shoe: [],
    hands: [{ ...newHand }],
    dealerCards: [],
    currentHandIndex: -1,
  },
  id: "blackjack",
  initial: "idle",
  states: {
    idle: {
      entry: "reset",
      on: {
        DEAL: {
          target: "deal",
        },
        INCREMENT_BET: {
          actions: "incrementBet",
        },
        DECREMENT_BET: {
          actions: "decrementBet",
        },
        CLEAR_BET: {
          actions: "clearBet",
        },
        ADD_HAND: {
          actions: "addHand",
          cond: "maxHands",
        },
        REMOVE_HAND: {
          actions: "removeHand",
          cond: "minHands",
        },
      },
    },
    deal: {
      entry: "deal",
      always: [
        {
          cond: "dealerShowsAce",
          target: "offerInsurance",
        },
        {
          cond: "dealerShowsTen",
          target: "peek",
        },
        {
          target: "player",
        },
      ],
    },
    offerInsurance: {
      entry: "offerInsurance",
      always: {
        cond: "allHandsResponded",
        target: "peek",
      },
      on: {
        ACCEPT: {
          actions: "acceptInsuranceBet",
        },
        DECLINE: {
          actions: "declineInsuranceBet",
        },
      },
    },
    peek: {
      always: [
        {
          cond: "dealerHasBlackjack",
          target: "settle",
        },
        {
          target: "player",
        },
      ],
    },
    player: {
      entry: "initializeHands",
      always: [
        {
          cond: "allHandsSettled",
          target: "idle",
        },
        {
          cond: "allHandsComplete",
          target: "dealer",
        },
        {
          actions: ["addCardToHandAfterSplit", "setCurrentHandIndex"],
          cond: "handNeedsSecondCard",
        },
      ],
      on: {
        STAND: {
          actions: ["standHand", "setCurrentHandIndex"],
        },
        SURRENDER: {
          actions: ["surrenderHand", "setCurrentHandIndex"],
        },
        HIT: {
          actions: ["hitHand", "setCurrentHandIndex"],
        },
        DOUBLE: {
          actions: ["doubleHand", "setCurrentHandIndex"],
        },
        SPLIT: {
          actions: ["splitHand", "setCurrentHandIndex"],
        },
      },
    },
    dealer: {
      entry: "playDealerHand",
      always: {
        target: "settle",
      },
    },
    settle: {
      entry: "settleBets",
      always: {
        target: "idle",
      },
    },
  },
},
{
    guards: {
        dealerShowsAce: ({ dealerCards }) => getUpCardValue(dealerCards) === 1,
        dealerShowsTen: ({ dealerCards, configuration }) => configuration.dealerPeek && getUpCardValue(dealerCards) === 10,
        allHandsResponded: ({ hands }) => hands.filter(hand => hand.offerInsurance).length < 1,
        dealerHasBlackjack: ({ dealerCards }) => isBlackjack(dealerCards),
        allHandsComplete: ({ hands }) => hands.filter(hand => !hand.complete).length < 1,
        allHandsSettled: ({ hands }) => hands.filter(hand => !hand.settled).length < 1,
        maxHands: ({ hands }) => hands.length < 7,
        minHands: ({ hands }) => hands.length > 1,
        handNeedsSecondCard: ({ currentHandIndex, hands }) => hands[currentHandIndex].cards.length === 1,
    },
    actions: {
        reset: assign(context => ({
            ...context,
            currentHandIndex: -1,
        })),
        addHand: assign(context => {
            const hands = [ ...context.hands ];
            hands.push({ ...newHand });
            return { ...context, hands };
        }),
        removeHand: assign((context, { payload: { handIndex } }) => ({
            ...context,
            hands: [ ...context.hands ].filter((hand, index) => index !== handIndex),
        })),
        incrementBet: assign({
            bankroll: context => context.bankroll - 1,
            hands: (context, event) => context.hands.map((hand, index) => event.payload.handIndex === index ? { ...hand, bet: hand.bet + 1 } : hand),
        }),
        decrementBet: assign({
            bankroll: context => context.bankroll + 1,
            hands: (context, event) => context.hands.map((hand, index) => event.payload.handIndex === index ? { ...hand, bet: hand.bet - 1 } : hand),
        }),
        clearBet: assign((context, { payload: { handIndex } }) => {
            const betAmount = context.hands[handIndex].bet;
            return {
                ...context,
                bankroll: context.bankroll + betAmount,
                hands: context.hands.map((hand, index) => index === handIndex ? { ...hand, bet: 0 } : hand),
            };
        }),
        deal: assign((context, { payload: { configuration } }) => {
            const { numberOfDecks, penetration, cutRange } = configuration;
            let shoe = [ ...context.shoe ];

            if (shoe.length < 52 * numberOfDecks * (100 - penetration) / 100) {
                shoe = getShoe(numberOfDecks);
                shoe = shuffle(shoe);
                shoe = cut(shoe, getRandomNumberInRange(cutRange.min, cutRange.max));
            }

            // Automatically retrieve bets from hands added due to split.
            let bankroll = context.bankroll;
            let hands = [ ...context.hands ];
            for (let i = 0; i < hands.length; i++) {
              if (hands[i]?.split && hands?.[i + 1]?.split) { // Two consecutive split hands.

                if (hands[i].bet === 0) {
                  hands[i + 1].split = false;
                } else {
                  bankroll += hands[i + 1].bet;
                  hands[i].split = false;
                }

              } else {
                hands[i].split = false;
              }
            }

            // Filter out hands still marked as split and reset attributes.
            hands = hands.filter(hand => !hand.split).map(hand => ({
              ...hand,
              cards: [],
              complete: false,
              settled: false,
            }));

            shoe.pop(); // Burn a card.
            let dealerCards = [];
            for (let i = 0; i < 2; i++) {
                hands.forEach(hand => hand.cards.push(shoe.pop()));
                dealerCards.push(shoe.pop());
            }

            return {
                ...context,
                bankroll,
                configuration, // todo This is not ideal; I am adding this to give actions access to the configuration.
                shoe,
                hands,
                dealerCards,
            };
        }),
        offerInsurance: assign(context => ({
            ...context,
            currentHandIndex: context.hands.length - 1,
            hands: [ ...context.hands ].map(hand => ({ ...hand, offerInsurance: true })),
        })),
        acceptInsuranceBet: assign((context, event) => {
            const { handIndex } = event.payload;
            const insuranceBet = context.hands[handIndex].bet / 2;
            return {
                ...context,
                bankroll: context.bankroll - insuranceBet,
                currentHandIndex: handIndex - 1,
                hands: [ ...context.hands ].map((hand, index) => index === handIndex ? { ...hand, insuranceBet, offerInsurance: false } : hand),
            };
        }),
        declineInsuranceBet: assign((context, event) => {
            const { handIndex } = event.payload;
            return {
                ...context,
                currentHandIndex: handIndex - 1,
                hands: [ ...context.hands ].map((hand, index) => index === handIndex ? { ...hand, offerInsurance: false } : hand),
            };
        }),
        initializeHands: assign(context => ({
            ...context,
            currentHandIndex: [ ...context.hands ].findLastIndex(hand => !hand.complete && !hand.settled),
            hands: [ ...context.hands ].map(hand => ({ ...hand, complete: false, settled: false })),
        })),
        setCurrentHandIndex: assign(context => ({
            ...context,
            currentHandIndex: [ ...context.hands ].findLastIndex(hand => !hand.complete),
        })),
        playDealerHand: assign(context => {
            const { dealerHitsSoft17 } = context.configuration;

            const shoe = [ ...context.shoe ];
            const dealerCards = [ ...context.dealerCards ];
            const mustHit = cards => {
                const dealerHandValue = getHandValue(cards);
                return dealerHitsSoft17 && isSoft(cards) ? dealerHandValue < 18 : dealerHandValue < 17;
            };
            while (mustHit(dealerCards)) { dealerCards.push(shoe.pop()); }

            return {
                ...context,
                shoe,
                dealerCards,
            };
        }),
        settleBets: assign(context => {
            let bank = context.bank;
            const hands = [ ...context.hands ].map(hand => {
                if (hand.settled) {
                    return hand;
                }

                if (isBlackjack(context.dealerCards)) {
                    if (isBlackjack(hand.cards)) {
                        return { ...hand, status: 'PUSH', settled: true };
                    }
                    bank += hand.bet;
                    return { ...hand, bet: 0, status: 'LOSE', settled: true };
                }

                if (isBusted(context.dealerCards) && !isBusted(hand.cards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon, status: 'WIN', settled: true };
                }

                if (getHandValue(context.dealerCards) === getHandValue(hand.cards)) {
                    return { ...hand, status: 'PUSH', settled: true };
                }

                if (getHandValue(context.dealerCards) > getHandValue(hand.cards)) {
                    bank += hand.bet;
                    return { ...hand, bet: 0, status: 'LOSE', settled: true };
                }

                if (getHandValue(hand.cards) > getHandValue(context.dealerCards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon, status: 'WIN', settled: true };
                }

                throw new Error('A hand is in an invalid state.');
            });

            return { ...context, bank, hands };
        }),
        standHand: assign((context, { payload: { handIndex } }) => {
            let hand = context.hands[handIndex];

            if (isBlackjack(hand.cards)) {
                const bet = hand.bet;
                const amountWon = bet * context.configuration.blackjackPays;
                return {
                    ...context,
                    bank: context.bank - amountWon,
                    hands: [ ...context.hands ].map((hand, index) => index === handIndex ? {
                        ...hand,
                        status: 'BLACKJACK',
                        bet: bet + amountWon,
                        complete: true,
                        settled: true,
                    } : hand),
                };
            }

            return {
                ...context,
                hands: [ ...context.hands ].map((hand, index) => index === handIndex ? { ...hand, complete: true } : hand),
            };
        }),
        surrenderHand: assign((context, { payload: { handIndex } }) => {
            const bet = context.hands[handIndex].bet;
            const amount = bet / 2;

            return {
                ...context,
                bank: context.bank + amount,
                hands: context.hands.map((hand, index) => index === handIndex ? {
                    ...hand,
                    status: 'SURRENDER',
                    bet: bet - amount,
                    complete: true,
                    settled: true,
                } : hand),
            };
        }),
        hitHand: assign((context, { payload: { handIndex } }) => {
            const shoe = [ ...context.shoe ];
            const cards = [ ...context.hands[handIndex].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) { // todo Can this ben an action/guard?
                const { bet } = context.hands[handIndex];
                return {
                    ...context,
                    shoe,
                    bank: context.bank + bet,
                    hands: context.hands.map((hand, index) => index === handIndex ? {
                        ...hand,
                        status: 'BUST',
                        cards,
                        bet: 0,
                        complete: true,
                        settled: true,
                    } : hand),
                };
            }
            
            return {
                ...context,
                shoe,
                hands: context.hands.map((hand, index) => index === handIndex ? { ...hand, cards } : hand),
            };
        }),
        addCardToHandAfterSplit: assign(context => {
            const shoe = [ ...context.shoe ];
            const { currentHandIndex } = context;
            const cards = [ ...context.hands[currentHandIndex].cards ];
            cards.push(shoe.pop());

            return {
                ...context,
                shoe,
                hands: context.hands.map((hand, index) => index === currentHandIndex ? {
                  ...hand,
                  cards,
                  complete: hand.cards[0].value === 1,
                } : hand),
            };
        }),
        doubleHand: assign((context, { payload: { handIndex } }) => {

            const betAmount = context.hands[handIndex].bet;
            const bankroll = context.bankroll - betAmount;

            const hands = context.hands.map((hand, index) => index === handIndex ? {
                ...hand,
                bet: hand.bet + betAmount,
            } : hand);

            // todo This is duplicated in hitHand above.
            const shoe = [ ...context.shoe ];
            const cards = [ ...hands[handIndex].cards ];
            cards.push(shoe.pop());

            if (isBusted(cards)) {
                const { bet } = hands[handIndex];
                return {
                    ...context,
                    bank: context.bank + bet,
                    bankroll,
                    hands: hands.map((hand, index) => index === handIndex ? {
                        ...hand,
                        status: 'BUST',
                        cards,
                        bet: 0,
                        complete: true,
                        settled: true,
                    } : hand),
                    shoe,
                };
            }
            
            return {
                ...context,
                bankroll,
                hands: hands.map((hand, index) => index === handIndex ? { ...hand, cards, complete: true } : hand),
                shoe,
            };

        }),
        splitHand: assign((context, event) => {
            const { handIndex } = event.payload;
            const bet = context.hands[handIndex].bet;

            console.log('splitHand', bet);

            const originalHand = { ...context.hands[handIndex], split: true, bet };
            originalHand.cards = [ ...originalHand.cards ];

            const splitHand = { ...originalHand, cards: [], split: true, bet };
            splitHand.cards.push(originalHand.cards.pop());

            const hands = context.hands;
            hands[handIndex] = originalHand;
            hands.splice(handIndex, 0, splitHand);

            return {
              ...context,
              hands,
              bankroll: context.bankroll - bet,
            };
        }),
    },
});

export default blackjackMachine;