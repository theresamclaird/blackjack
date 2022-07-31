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
/** @xstate-layout N4IgpgJg5mDOIC5QCMA2BDAxgawFZewDoBLCVMAYgBEBRAQQBlFQAHAe1mIBdi2A7ZiAAeiALQBGACzjCAZgAMAVgDsk+QE5V62ZIAcAJgA0IAJ5i1iwov3KAbOJULZ1yQF9XxtAXw4SZSgCSAHIAwgBKNACyNEEAKgD6AEI0sYLsnDz8giIIoir6cuqKira66vry4uXGZrmStrKE4rqS+uKyNopSyrKy7p4YOD5EpOTUNOFRMQnJqUgg6dy8AvM5eapWUvq2tvI6iq01YnYFkrLq6rrntkUG-SBeQwR+YyEM9GFJKWkcS1mrYmKp1srWU6nENhaGiOuVs+l0hF0JV0VVkDl0ygO90eeGeEDA6FQFB+GWW2TE+h0hHhNz2EJ0aPUMIk4nkhGk+m0HWuKKU2MGuN8bAAZsKwAAnAJ8WAAV3F6D4mEos3iwQAygBVMJ0UI0El-FagNas0pyeHiEGyOHqSRnZn6RSNdR7BqSZRXZRSaz87zPEViyXSuUKpXjN7BGiqoKa7W6-WZQ3CMSsnpNM7FWw9BrtGFnRFulFqKRSTO2H1PIWiiVS2XyxWUEIAeUiAAV3rE9fNFgnybkwZJqb0draqpS3TC0YQitJFAZ4RpJBny4KiCwwGBsMSu78ewC+wZEdndPYug5nLnnYR3fIUR0pPJ5MoHcvhoQWBgTBQ1bEdVR42S9zHRF2jsXpKV6c4jFMClmkIHZHwfYoykxR8X2ed90E-GMIiCWgwn-f4jUQK1Th6Zx9FtWRdEfJloNyVk2UzfROQXZpbEdMsPAeAVXwwz8AAkAjmVgdwAoiEEkG1CAfL0bHEZRMQU2QYRsAcSiKFxym0eRtjQ3w+OoRsNUSd4CMTHJpDZAxykk9RdmtRcYVZBFmK6OyLV0K4Gj01cPy-NshLM3tOQKKEoQZNzVBUywbRBcpH22DpXJ8t8-KCvcHBkEELVnWLHQ0XQJzUORemKBlNFaRcUvxQkJS3ETSUIpNcmsJodO2S4qJ6JRaNqdjlDg+Q9B0B1rF2RQUtgMAuC4MZ0vExRykRJEFDKNFmOUC82WvW82jUR8+nuPg2HxeB5hxV9RjAebmokeorHY1kzjheRssUZlJMsOwLhaHZtG0N1qoJVAbuNC5ETGuEURBTyczo0Q0W2oadKUC12h0FL-WrIM6yVUGxBaGRbXBK07OYjFmXaApFFe3Z2j2axNH0FK1w3fG+xuKwFLhJTWgXFShsROx7CuZwye9LiLvQj92YkK52VUGn2ih5RH02ui2nUM0WPa900VtIHavFWWSwerohpI16ZwvGRKgxG9zRPPZJum2bru3RrzOTe6SnN56KjemFMVsaT3TaKRele84fJNjQBojjMszRZT4auAdWnpH6zg0Q73CAA */
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
        DEAL: { target: "deal" },
        INCREMENT_BET: { actions: "incrementBet" },
        DECREMENT_BET: { actions: "decrementBet" },
        CLEAR_BET: { actions: "clearBet" },
        ADD_HAND: { cond: "maxHands", actions: "addHand" },
        REMOVE_HAND: { cond: "minHands", actions: "removeHand" },
      },
    },
    deal: {
      entry: "deal",
      always: [
        { cond: "dealerShowsAce", target: "offerInsurance" },
        { cond: "dealerShowsTen", target: "peek" },
        { target: "player" },
      ],
    },
    offerInsurance: {
      entry: "offerInsurance",
      on: {
        ACCEPT: { actions: "acceptInsuranceBet" },
        DECLINE: { actions: "declineInsuranceBet" },
      },
      always: [{ cond: "allHandsResponded", target: "peek" }],
    },
    peek: {
      always: [
        { cond: "dealerHasBlackjack", target: "settle" },
        { target: "player" },
      ],
    },
    player: {
      entry: "initializeHands",
      on: {
        STAND: { actions: "standHand" },
        SURRENDER: { actions: "surrenderHand" },
        HIT: { actions: "hitHand" },
        DOUBLE: { actions: "doubleHand" },
        SPLIT: { actions: "splitHand" },
      },
      always: [
        { cond: "allHandsSettled", target: "idle" },
        { cond: "allHandsComplete", target: "dealer" },
      ],
    },
    dealer: {
      entry: "playDealerHand",
      always: [{ target: "settle" }],
    },
    settle: {
      entry: "settleBets",
      always: [{ target: "idle" }],
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
