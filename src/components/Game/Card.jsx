import React from 'react';
import { Box } from '../Box';
import Pip from './Pip';
import Corner from './Corner';
import Face from './Face';

const Card = ({ sx, suit, rank, value, showBack = false }) => {
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

    const isFace = rank === 'jack' || rank === 'queen' || rank === 'king';
    const applesauce = isFace ? {} : pipStyle; // todo fix this.

    const Front = () => (
        <Box sx={{
            width: '4rem',
            height: `${4 * 1.4}rem`,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(16, 1fr)',
            overflow: 'hidden',
            ...applesauce,
        }}>
            {isFace ? <Face suit={suit} rank={rank} pip={pip} color={color} /> : <Pips value={value} />}
            <Corner rank={rank} pip={pip} sx={{ top: '0.25rem', left: '0.25rem', color }} />
            <Corner rank={rank} pip={pip} sx={{ bottom: '0.25rem', right: '0.25rem', transform: 'rotate(180deg)', color }} />
        </Box>
    );

    const Back = () => (
        <Box sx={{
            width: '4rem',
            height: `${4 * 1.4}rem`,
            border: 'solid 2px',
            borderColor: '#6666ff',
            borderRadius: '0.25em',
            backgroundColor: '#e5e5f7',
            opacity: '0.8',
            backgroundImage: 'linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(30deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(150deg, #444cf7 12%, transparent 12.5%, transparent 87%, #444cf7 87.5%, #444cf7), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777), linear-gradient(60deg, #444cf777 25%, transparent 25.5%, transparent 75%, #444cf777 75%, #444cf777)',
            backgroundSize: '8px 14px',
            backgroundPosition: '0 0, 0 0, 4px 7px, 4px 7px, 0 0, 4px 7px',
        }} />
    );

    return (
        <Box sx={{
            boxShadow: '0 0 2px #666',
            position: 'relative',
            backgroundColor: 'white',
            border: 'solid 1px',
            borderColor: 'black',
            borderRadius: '0.25rem',
            p: '0.5rem',
            ...sx,
        }}>
            {showBack ? <Back /> : <Front />}
        </Box>
    );
};

export default Card;