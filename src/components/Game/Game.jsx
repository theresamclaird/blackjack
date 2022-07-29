import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '../Box';
import { Text } from '../Text';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import states from './states';

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

const reducer = (state, action) => {
    switch (action.type) {
        case states.addHand.label: {
            return states.addHand.mutate(state);
        }
        case states.incrementBet.label: {
            return states.incrementBet.mutate(state, action.payload.handIndex);
        }
        case states.decrementBet.label: {
            return states.decrementBet.mutate(state, action.payload.handIndex);
        }
        case states.clearBet.label: {
            return states.clearBet.mutate(state, action.payload.handIndex);
        }
        case states.stand.label: {
            return states.stand.mutate(state, action.payload.handIndex);
        }
        case states.surrender.label: {
            return states.surrender.mutate(state, action.payload.handIndex, action.payload.configuration);
        }
        case states.hit.label: {
            return states.hit.mutate(state, action.payload.handIndex);
        }
        case states.double.label: {
            return states.double.mutate(state, action.payload.handIndex);
        }
        case states.betInsurance.label: {
            return states.betInsurance.mutate(state, action.payload.handIndex, action.payload.configuration);
        }
        case states.declineInsurance.label: {
            return states.declineInsurance.mutate(state, action.payload.handIndex);
        }
        case states.idle.label: {
            return states.idle.mutate(state);
        }
        case states.dealCards.label: {
            return states.dealCards.mutate(state, action.payload.configuration);
        }
        case states.offerInsurance.label: {
            return states.offerInsurance.mutate(state);
        }
        case states.waitInsurance.label: {
            return states.waitInsurance.mutate(state);
        }
        case states.dealerPeek.label: {
            return states.dealerPeek.mutate(state, action.payload.configuration);
        }
        case states.playerPlay.label: {
            return states.playerPlay.mutate(state, action.payload.configuration);
        }
        case states.dealerPlay.label: {
            return states.dealerPlay.mutate(state, action.payload.configuration);
        }
        case states.settleBets.label: {
            return states.settleBets.mutate(state);
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
            completed: false,
            settled: true,
            offerInsurance: false,
        }],
        dealerCards: [],
        reveal: false,
        dealerActionComplete: true,
        currentState: states.idle.label,
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

        case states.dealCards.label: {
            const upCardValue = getUpCardValue(state.dealerCards);

            // Transition from dealCards to offerInsurance when dealer shows ace.
            if (upCardValue === 1) {
                dispatch({ type: states.offerInsurance.label, payload: { configuration } });
                break;
            };
            
            // Transition from dealCards to dealerPeek when dealer shows 10.
            if (upCardValue === 10) {
                dispatch({ type: states.dealerPeek.label, payload: { configuration } });
                break;
            }
    
            dispatch({ type: states.playerPlay.label, payload: { configuration } }); // Transition from deal to play when dealer shows 2 - 9.
            break;
        }

        case states.playerPlay.label: {

            // Transition from playerPlay to idle when all hands are settled.
            if (state.hands.filter(hand => !hand.settled).length < 1) {
                dispatch({ type: states.idle.label });
            }

            // Transition from playerPlay to dealerPlay when all hands are completed.
            if (state.hands.filter(hand => !hand.completed).length < 1) {
                dispatch({ type: states.dealerPlay.label, payload: { configuration } });
            }
            break;

        }

        case states.offerInsurance.label: {

            // Transition from offerInsurance to waitInsurance automatically.
            dispatch({ type: states.waitInsurance.label, payload: { configuration } });
            break;

        }

        case states.waitInsurance.label: {

            // Transition from waitInsurance to dealerPeek when all hands have been offered insurance.
            if (state.hands.filter(hand => hand.offerInsurance).length < 1) {
                dispatch({ type: states.dealerPeek.label, payload: { configuration } });
            }
            break;

        }

        case states.dealerPeek.label: {

            // Transition from dealerPeek to settleBets when the dealer has a blackjack.
            if (isBlackjack(state.dealerCards)) {
                dispatch({ type: states.settleBets.label, payload: { configuration } });
                break;
            }

            // Transition from dealerPeek to playerPlay when the dealer does not have a blackjack.
            dispatch({ type: states.playerPlay.label, payload: { configuration } });
            break;

        }

        case states.dealerPlay.label: {

            // Transition from dealer to idle after the dealer has finished playing.
            dispatch({ type: states.settleBets.label });
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
                placeInsuranceBet={handIndex => dispatch({ type: states.betInsurance.label, payload: { handIndex, configuration } })}
                declineInsurance={handIndex => dispatch({ type: states.declineInsurance.label, payload: { handIndex, configuration } })}
                {...state}
            />
            <Player
                handValue={handValue}
                addHand={() => dispatch({ type: states.addHand.label })}
                incrementBet={handIndex => dispatch({ type: states.incrementBet.label, payload: { handIndex } })}
                decrementBet={handIndex => dispatch({ type: states.decrementBet.label, payload: { handIndex } })}
                clearBet={handIndex => dispatch({ type: states.clearBet.label, payload: { handIndex } })}
                deal={() => dispatch({ type: states.dealCards.label, payload: { configuration } })}
                stand={handIndex => dispatch({ type: states.stand.label, payload: { handIndex } })}
                hit={handIndex => dispatch({ type: states.hit.label, payload: { handIndex } })}
                surrender={handIndex => dispatch({ type: states.surrender.label, payload: { handIndex, configuration } })}
                double={handIndex => dispatch({ type: states.double.label, payload: { handIndex } })}
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