import React, { useReducer, useState } from 'react';
import { Box, Flex } from '../Box';
import { Text } from '../Text';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import mutations from './mutations';
import { getUpCardValue, isBlackjack, handValue } from '../../utils/cards';

/*
    todo:
        - Indicate which hand is being offered insurance.
        - Add unit tests for new functionality.
        - Allow blackjack hands to act (e.g. double) before settling.
        - Add "double" array to configuration panel.
        - Make the configuration panel a component.
*/

const reducer = (state, action) => {
    switch (action.type) {
        case mutations.addHand.label: {
            return mutations.addHand.mutate(state);
        }
        case mutations.removeHand.label: {
            return mutations.removeHand.mutate(state, action.payload.handIndex);
        }
        case mutations.incrementBet.label: {
            return mutations.incrementBet.mutate(state, action.payload.handIndex);
        }
        case mutations.decrementBet.label: {
            return mutations.decrementBet.mutate(state, action.payload.handIndex);
        }
        case mutations.clearBet.label: {
            return mutations.clearBet.mutate(state, action.payload.handIndex);
        }
        case mutations.stand.label: {
            return mutations.stand.mutate(state, action.payload.handIndex);
        }
        case mutations.surrender.label: {
            return mutations.surrender.mutate(state, action.payload.handIndex, action.payload.configuration);
        }
        case mutations.hit.label: {
            return mutations.hit.mutate(state, action.payload.handIndex);
        }
        case mutations.double.label: {
            return mutations.double.mutate(state, action.payload.handIndex);
        }
        case mutations.split.label: {
            return mutations.split.mutate(state, action.payload.handIndex);
        }
        case mutations.betInsurance.label: {
            return mutations.betInsurance.mutate(state, action.payload.handIndex, action.payload.configuration);
        }
        case mutations.declineInsurance.label: {
            return mutations.declineInsurance.mutate(state, action.payload.handIndex);
        }
        case mutations.idle.label: {
            return mutations.idle.mutate(state);
        }
        case mutations.dealCards.label: {
            return mutations.dealCards.mutate(state, action.payload.configuration);
        }
        case mutations.offerInsurance.label: {
            return mutations.offerInsurance.mutate(state);
        }
        case mutations.waitInsurance.label: {
            return mutations.waitInsurance.mutate(state);
        }
        case mutations.dealerPeek.label: {
            return mutations.dealerPeek.mutate(state, action.payload.configuration);
        }
        case mutations.playerPlay.label: {
            return mutations.playerPlay.mutate(state, action.payload.configuration);
        }
        case mutations.dealerPlay.label: {
            return mutations.dealerPlay.mutate(state, action.payload.configuration);
        }
        case mutations.settleBets.label: {
            return mutations.settleBets.mutate(state);
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
        currentState: mutations.idle.label,
    });
    const [configuration, setConfiguration] = useState(() => ({
        numberOfDecks: 1,
        penetration: 66,
        cutRange: { min: 20, max: 80 },
        dealerPeek: true,
        dealerHitsSoft17: true,
        doubleAfterSplit: true,
        surrender: 'late', // Can be false, 'early', or 'late'.
        blackjackPays: 3 / 2,
        double: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    }));
    const [showConfiguration, setShowConfiguration] = useState(false);

    const totalBets = state.hands.reduce((sum, hand) => sum + hand.bet + hand.insuranceBet, 0);
    if (state.bank + state.bankroll + totalBets !== 0) {
        console.error('Accounting error.', { bank: state.bank, bankroll: state.bankroll, totalBets });
    }

    // console.log('state', state.currentState, state);
    // Implicit State Transitions
    switch (state.currentState) {

        case mutations.dealCards.label: {
            const upCardValue = getUpCardValue(state.dealerCards);

            // Transition from dealCards to offerInsurance when dealer shows ace.
            if (upCardValue === 1) {
                dispatch({ type: mutations.offerInsurance.label, payload: { configuration } });
                break;
            };
            
            // Transition from dealCards to dealerPeek when dealer shows 10.
            if (upCardValue === 10) {
                dispatch({ type: mutations.dealerPeek.label, payload: { configuration } });
                break;
            }
    
            dispatch({ type: mutations.playerPlay.label, payload: { configuration } }); // Transition from deal to play when dealer shows 2 - 9.
            break;
        }

        case mutations.playerPlay.label: {

            const activeHandIndex = state.hands.findLastIndex(hand => !hand.completed);
            if (activeHandIndex >= 0 && state.hands[activeHandIndex].cards.length < 2) {
                dispatch({ type: mutations.hit.label, payload: { handIndex: activeHandIndex } });
            }

            // Transition from playerPlay to idle when all hands are settled.
            if (state.hands.filter(hand => !hand.settled).length < 1) {
                dispatch({ type: mutations.idle.label });
            }

            // Transition from playerPlay to dealerPlay when all hands are completed.
            if (state.hands.filter(hand => !hand.completed).length < 1) {
                dispatch({ type: mutations.dealerPlay.label, payload: { configuration } });
            }
         
            break;
        }

        case mutations.offerInsurance.label: {

            // Transition from offerInsurance to waitInsurance automatically.
            dispatch({ type: mutations.waitInsurance.label, payload: { configuration } });
            break;

        }

        case mutations.waitInsurance.label: {

            // Transition from waitInsurance to dealerPeek when all hands have been offered insurance.
            if (state.hands.filter(hand => hand.offerInsurance).length < 1) {
                dispatch({ type: mutations.dealerPeek.label, payload: { configuration } });
            }
            break;

        }

        case mutations.dealerPeek.label: {

            // Transition from dealerPeek to settleBets when the dealer has a blackjack.
            if (isBlackjack(state.dealerCards)) {
                dispatch({ type: mutations.settleBets.label, payload: { configuration } });
                break;
            }

            // Transition from dealerPeek to playerPlay when the dealer does not have a blackjack.
            dispatch({ type: mutations.playerPlay.label, payload: { configuration } });
            break;

        }

        case mutations.dealerPlay.label: {

            // Transition from dealer to idle after the dealer has finished playing.
            dispatch({ type: mutations.settleBets.label });
            break;

        }

        case mutations.settleBets.label: {
            if (state.hands.filter(hand => !hand.settled).length < 1) {
                dispatch({ type: mutations.idle.label });
            }
            break;
        }

        default: {
            break;
        }
    }

    return (
        <>
            <Flex sx={{
                width: '100vw',
                height: '100vh',
                bg: 'feltGreen',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-start', p: '1rem', width: '100%' }}>
                    <Text sx={{ textShadow: '0 0 10px #333', cursor: 'pointer', color: 'white' }} onClick={() => setShowConfiguration(!showConfiguration)}>☰</Text>
                    <Flex sx={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '1rem' }}>
                    <Text sx={{ color: 'yellow' }}>{`Bank: ¤ ${state.bank}`}</Text>
                        <Text sx={{ color: 'yellow' }}>{`Shoe: ${state.shoe.length} cards`}</Text>
                    </Flex>
                </Flex>
                <Dealer handValue={handValue} {...state} />
                <Table
                    placeInsuranceBet={handIndex => dispatch({ type: mutations.betInsurance.label, payload: { handIndex, configuration } })}
                    declineInsurance={handIndex => dispatch({ type: mutations.declineInsurance.label, payload: { handIndex, configuration } })}
                    {...state}
                />
                <Player
                    handValue={handValue}
                    addHand={() => dispatch({ type: mutations.addHand.label })}
                    removeHand={handIndex => dispatch({ type: mutations.removeHand.label, payload: { handIndex } })}
                    incrementBet={handIndex => dispatch({ type: mutations.incrementBet.label, payload: { handIndex } })}
                    decrementBet={handIndex => dispatch({ type: mutations.decrementBet.label, payload: { handIndex } })}
                    clearBet={handIndex => dispatch({ type: mutations.clearBet.label, payload: { handIndex } })}
                    deal={() => dispatch({ type: mutations.dealCards.label, payload: { configuration } })}
                    stand={handIndex => dispatch({ type: mutations.stand.label, payload: { handIndex } })}
                    hit={handIndex => dispatch({ type: mutations.hit.label, payload: { handIndex } })}
                    surrender={handIndex => dispatch({ type: mutations.surrender.label, payload: { handIndex, configuration } })}
                    double={handIndex => dispatch({ type: mutations.double.label, payload: { handIndex } })}
                    split={handIndex => dispatch({ type: mutations.split.label, payload: { handIndex } })}
                    {...state}
                />
            </Flex>
            {showConfiguration && (
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%)',
                }}>
                    <Box sx={{
                        backgroundColor: 'feltGreen',
                        border: 'solid 1px black',
                        borderRadius: '0.5rem',
                        color: 'white',
                        boxShadow: '2px 2px 20px #333',
                        p: 'md',
                    }}>
                        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', px: '0.4rem', pt: '0.4rem' }}>
                            <Text>Configuration</Text>
                            <Text sx={{ fontSize: '0.66rem', cursor: 'pointer' }} onClick={() => setShowConfiguration(!showConfiguration)}>❌</Text>
                        </Flex>

                        <Box as="form" sx={{ p: 'xl' }}>
                            <Flex as="fieldset" sx={{ flexDirection: 'column', gap: '1rem', minWidth: '15rem' }}>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: '2rem' }}>
                                    <Text>Number of Decks:</Text>
                                    <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.numberOfDecks} onChange={e => setConfiguration({ ...configuration, numberOfDecks: e.target.value })} />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Penetration:</Text>
                                    <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.penetration} onChange={e => setConfiguration({ ...configuration, penetration: e.target.value })} />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Min Cut Range:</Text>
                                    <Box
                                        sx={{ width: '3rem' }}
                                        as="input"
                                        type="number"
                                        value={configuration.cutRange.min}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                            cutRange: {
                                                ...configuration.cutRange,
                                                min: e.target.value,
                                            },
                                        })}
                                    />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Max Cut Range:</Text>
                                    <Box
                                        sx={{ width: '3rem' }}
                                        as="input"
                                        type="number"
                                        value={configuration.cutRange.max}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                            cutRange: {
                                                ...configuration.cutRange,
                                                max: e.target.value,
                                            },
                                        })}
                                    />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Dealer Peek:</Text>
                                    <Box
                                        as="input"
                                        type="checkbox"
                                        checked={configuration.dealerPeek}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                            dealerPeek: e.target.checked,
                                        })}
                                    />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Dealer hits soft 17:</Text>
                                    <Box
                                        as="input"
                                        type="checkbox"
                                        checked={configuration.dealerHitsSoft17}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                            dealerHitsSoft17: e.target.checked,
                                        })}
                                    />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Double after split allowed:</Text>
                                    <Box
                                        as="input"
                                        type="checkbox"
                                        checked={configuration.doubleAfterSplit}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                            doubleAfterSplit: e.target.checked,
                                        })}
                                    />
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Surrender:</Text>
                                    <Box
                                        as="select"
                                        name="surrender"
                                        value={configuration.surrender}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                        })}
                                    >
                                        <Box as="option" value="late">Late</Box>
                                        <Box as="option" value="early">Early</Box>
                                        <Box as="option" value="false">Not Allowed</Box>
                                    </Box>
                                </Flex>

                                <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Blackjack Pays:</Text>
                                    <Box
                                        as="select"
                                        name="blackjackPays"
                                        value={configuration.blackjackPays}
                                        onChange={e => setConfiguration({
                                            ...configuration,
                                        })}
                                    >
                                        <Box as="option" value={1.5}>3 / 2</Box>
                                        <Box as="option" value={1.2}>6 / 5</Box>
                                    </Box>
                                </Flex>

                            </Flex>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
};