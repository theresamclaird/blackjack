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
 } from '../../utils/cards';
import { getRandomNumberInRange } from '../../utils/random';

const newHand = {
    bet: 0,
    cards: [],
    insuranceBet: 0,
    offerInsurance: false,
    complete: false,
    settled: false,
};

export const blackjackMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5QCMA2BDAxgawFZewDoBLCVMAYgBEBRAQQBlFQAHAe1mIBdi2A7ZiAAeiALQBGAJzjCANgBMAFgDM88fLXKAHOK3yANCACeYycpnjd8yZMWStABgDsT+QF83htAXw4SZSgBJADkAYQAlGgBZGmCAFQB9ACEaOMF2Th5+QREECQdHQgBWSVllIuUHcSKHIstDEzzLF0Jamy1FJVknSvdPEG8cXyJScmoaCOjYxJS0pBAM7l4BedzRaQdCcXNxWQcHWS0irWVFBrFmp1aS+w662RVFDy8MIYJ-MdCGenDk1PSOEtsqsxD1Ni5HDcdIoVOJzk1xC02rdFPdHs8Bq88O9RpQ6FQqAkABJ0YJUAGZZY5MTmeSEOySY67JxaVzVeESRF0+THcqORQHbpPfqDbF+XEUSJRADyADUaMTSeT5ossitQGs6spCPJZLtGTynLIijCOc1ubzDkUitYakUMaLhoQIGB0KgKBSgerhKZJPSSkVjZIeXUOhy9kVCE5BVUSrJJLGHVinWwAGapsAAJ0CfFgAFdM+g+Jg8aFQjQAApzViAtXUhDHSPKRmKDrxpytyROM3VP1FDu6WTtpyWWRJnzvNMZ7O5gtFkvjL4hGieusghBKP06e6M5QPHllHvG4rGvUHRTx6zicdvPxTrM5-OF4uUVdU9cX7VSWzacQMxySByLLaqcDhqEOF5VKyN5ikQLBgGA2AeiqtbvhqiAXk2n6qJuHZGrIZoHIQqhaF2DwHCaPJaDBTosBgRhZhQADKcRKm+wLoXkpyyDqsLSM2nTbFoHJXsU0bfta-aOD0NHvHR6AMZmzEAKrhJEZI0OE7Hems5R+gU8YqA4ML7gYxgXD0xRSGo0iojCGhjiKyZyfRjFEoE1YLKhHE+lxyhXPItRWgUurNmZjTrK0VH+WBl57Nssl+PJinUNKylJN82n1qI5SbFoxoHP5-lODc8LiLUrROF2tiKNUrbRk4iVwa5SlMRWDAeVl645Z0rR6rYRoGka4WIBoX6VMG2iMkO8h7k1hDJYxXWcRINQ6gcI7mCaPTWGc5kIHuVzWmYDwlbyNr2k5E5+C6bpLShlI+bkNRXNZ8g9H+zhVcJ+1DiBNVVf2li6MKLzXUQsBgFwXBjMtvmiKyMh1H+Wg6CyP7KPCejgrsSjlCD8jURifBsC68DzI6OIBHDawPDxVQODYhN7tYpEcgN9InNYJVCkOjlg7eRC3agNNiDC9L+e2VTmDoEbs+Luo2DUigdkOI7zfeM5PvOYCiwdjJbFInTDbqpGMuzOiG6yJx6FerjzfBiF6ya2rBkaYHqPsDw-RFdSKFG6OSwoqI6A7LV66IVWEDY0YnMo2iFWYHI2vSf6nNUhMmfH83C1mEfqPpJUqyOnSS-58JlDIVXbCZgb2DC82Q9D5B67H0d2DUlQnCUugV+YUb8QcOjvUGTX5+V-txuUlTVLU9T7RIm6tLVM-5boNpEx4QA */
createMachine({
  context: {
    bank: 0,
    bankroll: 0,
    shoe: [],
    hands: [{ ...newHand }],
    dealerCards: [],
  },
  id: "blackjack",
  initial: "idle",
  states: {
    idle: {
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
      ],
      on: {
        STAND: {
          actions: "standHand",
        },
        SURRENDER: {
          actions: "surrenderHand",
        },
        HIT: {
          actions: "hitHand",
        },
        DOUBLE: {
          actions: "doubleHand",
        },
        SPLIT: {
          actions: "splitHand",
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
        dealerShowsTen: ({ dealerCards }) => getUpCardValue(dealerCards) === 10,
        allHandsResponded: ({ hands }) => hands.filter(hand => hand.offerInsurance).length < 1,
        dealerHasBlackjack: ({ dealerCards }) => isBlackjack(dealerCards),
        allHandsComplete: ({ hands }) => hands.filter(hand => !hand.complete).length < 1,
        allHandsSettled: ({ hands }) => hands.filter(hand => !hand.settled).length < 1,
        maxHands: ({ hands }) => hands.length < 7,
        minHands: ({ hands }) => hands.length > 1,
    },
    actions: {
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

            const hands = [ ...context.hands ]
                .filter(hand => !hand.splitHand)
                .map(hand => ({
                    ...hand,
                    cards: [],
                    completed: false,
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
                configuration, // todo This is not ideal; I am adding this to give actions access to the configuration.
                shoe,
                hands,
                dealerCards,
            };
        }),
        offerInsurance: assign(context => ({
            ...context,
            hands: [ ...context.hands ].map(hand => ({ ...hand, offerInsurance: true })),
        })),
        acceptInsuranceBet: assign((context, event) => {
            const { handIndex } = event.payload;
            const insuranceBet = context.hands[handIndex].bet / 2;
            return {
                ...context,
                bankroll: context.bankroll - insuranceBet,
                hands: [ ...context.hands ].map((hand, index) => index === handIndex ? { ...hand, insuranceBet, offerInsurance: false } : hand),
            };
        }),
        declineInsuranceBet: assign((context, event) => {
            const { handIndex } = event.payload;
            return {
                ...context,
                hands: [ ...context.hands ].map((hand, index) => index === handIndex ? { ...hand, offerInsurance: false } : hand),
            };
        }),
        initializeHands: assign(context => ({
            ...context,
            hands: [ ...context.hands ].map(hand => ({ ...hand, complete: false, settled: false })),
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
            const hands = [ ...context.hands ].filter(hand => !hand.settled).map(hand => {

                if (isBlackjack(context.dealerCards)) {
                    if (isBlackjack(hand.cards)) {
                        return { ...hand, settled: true };
                    }
                    bank += hand.bet;
                    return { ...hand, bet: 0, settled: true };
                }

                if (isBusted(context.dealerCards) && !isBusted(hand.cards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon, settled: true };
                }

                if (getHandValue(context.dealerCards) === getHandValue(hand.cards)) {
                    return { ...hand, settled: true };
                }

                if (getHandValue(context.dealerCards) > getHandValue(hand.cards)) {
                    bank += hand.bet;
                    return { ...hand, bet: 0, settled: true };
                }

                if (getHandValue(hand.cards) > getHandValue(context.dealerCards)) {
                    const amountWon = hand.bet;
                    bank -= amountWon;
                    return { ...hand, bet: hand.bet + amountWon, settled: true };
                }

                throw new Error('A hand is in an invalid state.');
            });

            return {
                ...context,
                bank,
                hands,
            };
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
                        bet: bet + amountWon,
                        completed: true,
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
                    bet: bet - amount,
                    completed: true,
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
                        cards,
                        bet: 0,
                        completed: true,
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
                        cards,
                        bet: 0,
                        completed: true,
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

            const originalHand = { ...context.hands[handIndex] };
            originalHand.cards = [ ...originalHand.cards ];

            const splitHand = { ...originalHand, cards: [], splitHand: true };

            splitHand.cards.push(originalHand.cards.pop());

            const hands = context.hands.map((hand, index) => index === handIndex ? originalHand : hand);

            hands.splice(handIndex, 0, splitHand);

            return {
                ...context,
                hands,
                bankroll: context.bankroll - originalHand.bet,
            };
        }),
    },
});
