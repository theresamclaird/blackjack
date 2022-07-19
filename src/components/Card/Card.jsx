import React from 'react';
import { Box, Flex } from '../Box';
import Pip from './Pip';
import Corner from './Corner';
import Face from './Face';

export const Card = ({ suit, rank, value }) => {
    const pip = { hearts: '♥', diamonds: '♦️', clubs: '♣️', spades: '♠' }[suit];
    const color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';

    const pipStyle = {
        1: {
            '& > :first-of-type': {
                gridRowStart: 5,
                gridRowEnd: 'span 8',
                gridColumnStart: 2,
                gridColumnEnd: 'span 4',
                fontSize: '3em',
            },
        },
        2: {
            '& > :first-of-type': {
                gridRowStart: 2,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2'
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 12,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
        },
        3: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
        },
        4: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
        },
        5: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnEnd: 'span 2',
                gridColumnStart: 1,
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnEnd: 'span 2',
                gridColumnStart: 5,
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(5)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
        },
        6: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(5)': {
                gridRowStart:  13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(6)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
        },
        7: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(5)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(6)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(7)': {
                gridRowStart: 4,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
        },
        8: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(5)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(6)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)',
            },
            '& > :nth-of-type(7)': {
                gridRowStart: 4,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(8)': {
                gridRowStart: 10,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
        },
        9: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 5,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 5,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(5)': {
                gridRowStart: 9,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(6)': {
                gridRowStart: 9,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(7)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(8)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(9)': {
                gridRowStart: 7,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
        },
        10: {
            '& > :first-of-type': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(2)': {
                gridRowStart: 1,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(3)': {
                gridRowStart: 5,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(4)': {
                gridRowStart: 5,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(5)': {
                gridRowStart: 9,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(6)': {
                gridRowStart: 9,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(7)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 1,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(8)': {
                gridRowStart: 13,
                gridRowEnd: 'span 4',
                gridColumnStart: 5,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
            '& > :nth-of-type(9)': {
                gridRowStart: 3,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
            },
            '& > :nth-of-type(10)': {
                gridRowStart: 11,
                gridRowEnd: 'span 4',
                gridColumnStart: 3,
                gridColumnEnd: 'span 2',
                transform: 'rotate(180deg)'
            },
        },
    }[value];

    const Pips = ({ value }) => {
        const pipsArray = [];
        for (let i = 0; i < value; i++) {
            pipsArray.push(
                <React.Fragment key={`pip-${i}`}>
                    <Pip pip={pip} sx={{ color }} />
                </React.Fragment>
            );
        }
        return pipsArray;
    };

    const cardWidth = 4;
    const cardHeight = cardWidth * 1.4;
    const isFace = rank === 'jack' || rank === 'queen' || rank === 'king';
    const applesauce = isFace ? {} : pipStyle; // todo fix this.

    return (
        <Box sx={{
            boxShadow: '0 0 2px #666',
            position: 'relative',
            backgroundColor: 'white',
            border: 'solid 1px',
            borderColor: 'black',
            borderRadius: '0.25em',
            p: '0.5em',
        }}>
            <Box sx={{
                px: '0.5em',
                width: `${cardWidth}em`,
                height: `${cardHeight}em`,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(16, 1fr)',
                overflow: 'hidden',
                ...applesauce,
            }}>
                {isFace ? <Face suit={suit} rank={rank} pip={pip} color={color} /> : <Pips value={value} />}
                <Corner rank={rank} pip={pip} sx={{ top: '0.25em', left: '0.25em', color }} />
                <Corner rank={rank} pip={pip} sx={{ bottom: '0.25em', right: '0.25em', transform: 'rotate(180deg)', color }} />
            </Box>
        </Box>
    );
};