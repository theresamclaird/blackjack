import React from 'react';
import { Flex } from '../Box';
import Button from '../Button';

const Player = ({
    currentState,
    addHand,
    deal,
    hands,
    renderHand,
}) => (
    <Flex sx={{
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '1rem',
        height: '100%',
    }}>
        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-around', gap: '5rem' }}>
            {hands.map((hand, handIndex) => (
                <React.Fragment key={`${handIndex}-${JSON.stringify(hand)}`}>{renderHand(handIndex)}</React.Fragment>
            ))}
        </Flex>
        <Flex sx={{
            width: '100vw',
            backgroundColor: '#020',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <Flex sx={{
                borderTop: 'solid 1px',
                borderColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                py: '1rem',
                width: '100%',
            }}>
                <Button disabled={currentState !== 'idle'} as="button" onClick={deal}>Deal</Button>
                <Button disabled={currentState !== 'idle'} as="button" onClick={addHand}>+ Hand</Button>
            </Flex>
        </Flex>
    </Flex>
);

export default Player;