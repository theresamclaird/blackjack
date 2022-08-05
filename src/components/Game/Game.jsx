import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import { Flex } from '../Box';
import Player from '../Player';
import Hand from '../Hand';
import Table from '../Table';
import Dealer from '../Dealer';
import StatusBar from '../StatusBar';
import blackjackMachine from '../../state/blackjackMachine';
import { getHandValue } from '../../utils/cards';

/*
    todo:
        - bug: split aces and get a ten and it will be counted as a blackjack.
        - Add unit tests.
        - Hook up configuration to game logic.
        - Fix accounting bug?
        - Allow the player to scroll horizontally to see all hands.
*/

// const surrenderOptions = {
//     late: 'late',
//     early: 'early',
//     false: 'false,'
// };

// const doubleOptions = {
//     any: 'any',
//     tenEleven: 'tenEleven',
//     nineTenEleven: 'nineTenEleven',
// };

const Game = () => {
    const [configuration, setConfiguration] = useState(() => ({
        numberOfDecks: 1,
        penetration: 66,
        cutRange: { min: 20, max: 80 },
        dealerPeek: true,
        dealerHitsSoft17: true,
        doubleAfterSplit: true,
        surrender: 'late', // Can be false, 'early', or 'late'.
        blackjackPays: 3 / 2,
        double: 'any', // Can be 'any', 'tenEleven', or 'nineTenEleven'.
    }));
    const [machine, send] = useMachine(blackjackMachine);

    const totalBets = machine.context.hands.reduce((sum, hand) => sum + hand.bet + hand.insuranceBet, 0);
    if (machine.context.bank + machine.context.bankroll + totalBets !== 0) {
        console.error('Accounting error.', { bank: machine.context.bank, bankroll: machine.context.bankroll, totalBets });
    }

    return (
        <Flex sx={{
            width: '100vw',
            height: '100vh',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <StatusBar
                context={machine.context}
                configuration={configuration}
                setConfiguration={setConfiguration}
            />
            <Table
                configuration={configuration}
                dealer={<Dealer dealerCards={machine?.context?.dealerCards} currentState={machine?.value} />}
                player={
                    <Player
                        currentHandIndex={machine?.context?.currentHandIndex}
                        getHandValue={getHandValue}
                        currentState={machine.value}
                        deal={() => send({ type: 'DEAL', payload: { configuration } })}
                        addHand={() => send({ type: 'ADD_HAND' })}
                        bankroll={machine?.context?.bankroll}
                        hands={machine?.context?.hands}
                        renderHand={handIndex => (
                            <Hand
                                canRemoveHand={machine?.context?.hands.length > 1}
                                active={handIndex === machine?.context?.currentHandIndex}
                                currentState={machine?.value}
                                hand={machine?.context?.hands?.[handIndex]}
                                removeHand={() => send({ type: 'REMOVE_HAND', payload: { handIndex } })}
                                incrementBet={() => send({ type: 'INCREMENT_BET', payload: { handIndex, configuration } })}
                                decrementBet={() => send({ type: 'DECREMENT_BET', payload: { handIndex, configuration } })}
                                clearBet={() => send({ type: 'CLEAR_BET', payload: { handIndex, configuration } })}
                                acceptInsuranceBet={() => send({ type: 'ACCEPT', payload: { handIndex, configuration } })}
                                declineInsuranceBet={() => send({ type: 'DECLINE', payload: { handIndex, configuration } })}
                                stand={() => send({ type: 'STAND', payload: { handIndex } })}
                                hit={() => send({ type: 'HIT', payload: { handIndex } })}
                                surrender={() => send({ type:'SURRENDER', payload: { handIndex, configuration } })}
                                double={() => send({ type: 'DOUBLE', payload: { handIndex } })}
                                split={() => send({ type: 'SPLIT', payload: { handIndex } })}
                            />
                        )}
                    />
                }
            />
        </Flex>
    );
};

export default Game;