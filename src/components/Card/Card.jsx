import React from 'react';
import { Box, Flex } from '../Box';
import jackHearts from '../../faces/jack-hearts.svg';
import queenHearts from '../../faces/queen-hearts.svg';
import kingHearts from '../../faces/king-hearts.svg';
import jackSpades from '../../faces/jack-spades.svg';
import queenSpades from '../../faces/queen-spades.svg';
import kingSpades from '../../faces/king-spades.svg';
import jackDiamonds from '../../faces/jack-diamonds.svg';
import queenDiamonds from '../../faces/queen-diamonds.svg';
import kingDiamonds from '../../faces/king-diamonds.svg';
import jackClubs from '../../faces/jack-clubs.svg';
import queenClubs from '../../faces/queen-clubs.svg';
import kingClubs from '../../faces/king-clubs.svg';

const Pip = ({ sx, pip }) => (
    <Flex sx={{
        fontSize: '1.5em',
        gridRowEnd: 'span 2',
        width: '100%',
        height: '0.8em',
        aspectRatio: '1 / 1',
        ...sx,
    }}>
        <Flex sx={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            {pip}
        </Flex>
    </Flex>
);

const CornerNumber = ({ sx, color, rank, value, pip }) => {
    let symbol = value;
    switch (rank) {
        case 1:
            symbol = 'A';
            break;
        case 'jack':
            symbol = 'J';
            break;
        case 'queen':
            symbol = 'Q';
            break;
        case 'king':
            symbol = 'K';
            break;
        default:
            symbol = value;
            break;
    }
    return (
        <Flex sx={{
            color,
            fontSize: '0.7em',
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: '1em',
            '&::after': {
                content: `"${pip}"`,
                width: '0.5em',
                mt: '0.1em',
                lineHeight: '0.5em',
                display: 'block',
            },
            ...sx,
        }}><Box sx={{ color }}>{symbol}</Box></Flex>
    );
};

    const Face = ({ suit, rank }) => {
    const imageSrc = {
        hearts: {
            jack: jackHearts,
            queen: queenHearts,
            king: kingHearts,
        },
        spades: {
            jack: jackSpades,
            queen: queenSpades,
            king: kingSpades,
        },
        diamonds: {
            jack: jackDiamonds,
            queen: queenDiamonds,
            king: kingDiamonds,
        },
        clubs: {
            jack: jackClubs,
            queen: queenClubs,
            king: kingClubs,
        },
    }[suit][rank]
    return (
        <Flex sx={{
            m: 0,
            p: 0,
            gridRowStart: 2,
            gridRowEnd: 'span 14',
            gridColumnStart: 2,
            gridColumnEnd: 'span 4',
            justifyContent: 'center',
            alignItems: 'center',
            '& > img': { border: 'solid 1px #00f', m: 0, p: 0, height: '100%' },
        }}>
            <img src={imageSrc} />
        </Flex>
    );
};

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

    const applesauce = isFace ? {} : pipStyle;

    return (
        <Box sx={{
            boxShadow: '0 0 5px #000',
            position: 'relative',
            backgroundColor: 'white',
            border: 'solid 1px',
            borderColor: 'black',
            borderRadius: '0.25em',
            p: '0.3em',
        }}>
            <Box sx={{
                px: '0.6em',
                width: `${cardWidth}em`,
                height: `${cardHeight}em`,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(16, 1fr)',
                overflow: 'hidden',
                ...applesauce,
            }}>
                {rank === 'jack' || rank === 'queen' || rank === 'king' ? <Face suit={suit} rank={rank} /> : <Pips value={value} />}
                <CornerNumber rank={rank} value={value} pip={pip} color={color} sx={{ top: '0.25em', left: '0.25em' }} />
                <CornerNumber rank={rank} value={value} pip={pip} color={color} sx={{ bottom: '0.25em', right: '0.25em', transform: 'rotate(180deg)' }} />
            </Box>
        </Box>
    );
};