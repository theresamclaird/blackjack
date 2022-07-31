import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import { Flex } from '../Box';
import { Text } from '../Text';
import Player from './Player';
import Table from './Table';
import Dealer from './Dealer';
import Configuration from './Configuration';
import { blackjackMachine } from './machine';
import { getHandValue } from '../../utils/cards';

/*
    todo:
        - Indicate which hand is being offered insurance.
        - Find a better place/way? to render the "Accept" and "Decline" buttons for insurance.
        - Add unit tests.
        - Add "double" array to configuration panel.
*/

export const Game = () => {
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
    const [machine, send] = useMachine(blackjackMachine);

    const totalBets = machine.context.hands.reduce((sum, hand) => sum + hand.bet + hand.insuranceBet, 0);
    if (machine.context.bank + machine.context.bankroll + totalBets !== 0) {
        console.error('Accounting error.', { bank: machine.context.bank, bankroll: machine.context.bankroll, totalBets });
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
                    <Text sx={{ textShadow: '0 0 10px #333', cursor: 'pointer', color: 'white' }} onClick={() => setShowConfiguration(!showConfiguration)}>⚙️</Text>
                    <Flex sx={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '1rem' }}>
                    <Text sx={{ color: 'yellow' }}>{`Bank: ¤ ${machine.context.bank}`}</Text>
                        <Text sx={{ color: 'yellow' }}>{`Shoe: ${machine.context.shoe.length} cards`}</Text>
                    </Flex>
                </Flex>
                <Dealer getHandValue={getHandValue} dealerCards={machine.context.dealerCards} currentState={machine.value} />
                <Table />
                <Player
                    getHandValue={getHandValue}
                    currentState={machine.value}
                    deal={() => send({ type: 'DEAL', payload: { configuration } })}
                    addHand={() => send({ type: 'ADD_HAND' })}
                    removeHand={handIndex => send({ type: 'REMOVE_HAND', payload: { handIndex } })}
                    incrementBet={handIndex => send({ type: 'INCREMENT_BET', payload: { handIndex, configuration } })}
                    decrementBet={handIndex => send({ type: 'DECREMENT_BET', payload: { handIndex, configuration } })}
                    clearBet={handIndex => send({ type: 'CLEAR_BET', payload: { handIndex, configuration } })}
                    acceptInsuranceBet={handIndex => send({ type: 'ACCEPT', payload: { handIndex, configuration } })}
                    declineInsuranceBet={handIndex => send({ type: 'DECLINE', payload: { handIndex, configuration } })}
                    stand={handIndex => send({ type: 'STAND', payload: { handIndex } })}
                    hit={handIndex => send({ type: 'HIT', payload: { handIndex } })}
                    surrender={handIndex => send({ type:'SURRENDER', payload: { handIndex, configuration } })}
                    double={handIndex => send({ type: 'DOUBLE', payload: { handIndex } })}
                    split={handIndex => send({ type: 'SPLIT', payload: { handIndex } })}
                    machine={machine}
                />
            </Flex>
            {showConfiguration && (
                <Configuration
                    configuration={configuration}
                    toggle={() => setShowConfiguration(!showConfiguration)}
                    setConfiguration={setConfiguration}
                />
            )}
        </>
    );
};