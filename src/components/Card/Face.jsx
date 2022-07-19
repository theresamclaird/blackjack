import React from 'react';
import { Box, Flex } from '../Box';
import Pip from './Pip';

import jackHearts from './faces/jack-hearts.svg';
import queenHearts from './faces/queen-hearts.svg';
import kingHearts from './faces/king-hearts.svg';
import jackSpades from './faces/jack-spades.svg';
import queenSpades from './faces/queen-spades.svg';
import kingSpades from './faces/king-spades.svg';
import jackDiamonds from './faces/jack-diamonds.svg';
import queenDiamonds from './faces/queen-diamonds.svg';
import kingDiamonds from './faces/king-diamonds.svg';
import jackClubs from './faces/jack-clubs.svg';
import queenClubs from './faces/queen-clubs.svg';
import kingClubs from './faces/king-clubs.svg';

const Face = ({ rank, suit, pip, color }) => {
    const imageSrc = {
        jack: { hearts: jackHearts, spades: jackSpades, diamonds: jackDiamonds, clubs: jackClubs },
        queen: { hearts: queenHearts, spades: queenSpades, diamonds: queenDiamonds, clubs: queenClubs },
        king: { hearts: kingHearts, spades: kingSpades, diamonds: kingDiamonds, clubs: kingClubs },
    }[rank][suit];

    const topPipStyle = {
        jack: {
            hearts: {
                top: '0.6em',
                right: '0.8em',
            },
            spades: {
                top: '0.6em',
                left: '0.8em',
            },
            diamonds: {
                top: '0.6em',
                right: '0.8em',
            },
            clubs: {
                top: '0.6em',
                right: '0.8em',
            },
        },
        queen: {
            hearts: {
                top: '0.6em',
                left: '0.8em',
            },
            spades: {
                top: '0.6em',
                right: '0.8em',
            },
            diamonds: {
                top: '0.6em',
                right: '0.8em',
            },
            clubs: {
                top: '0.6em',
                right: '0.8em',
            },
        },
        king: {
            hearts: {
                top: '0.6em',
                left: '0.8em',
            },
            spades: {
                top: '0.6em',
                left: '0.8em',
            },
            diamonds: {
                top: '0.6em',
                left: '0.8em',
            },
            clubs: {
                top: '0.6em',
                left: '0.8em',
            },
        },
    }[rank][suit];

    const bottomPipStyle = {
        jack: {
            hearts: {
                bottom: '0.6em',
                left: '0.8em',
            },
            spades: {
                bottom: '0.6em',
                right: '0.8em',
            },
            diamonds: {
                bottom: '0.6em',
                left: '0.8em',
            },
            clubs: {
                bottom: '0.6em',
                left: '0.8em',
            },
        },
        queen: {
            hearts: {
                bottom: '0.6em',
                right: '0.8em',
            },
            spades: {
                bottom: '0.6em',
                left: '0.8em',
            },
            diamonds: {
                bottom: '0.6em',
                left: '0.8em',
            },
            clubs: {
                bottom: '0.6em',
                left: '0.8em',
            },
        },
        king: {
            hearts: {
                bottom: '0.6em',
                right: '0.8em',
            },
            spades: {
                bottom: '0.6em',
                right: '0.8em',
            },
            diamonds: {
                bottom: '0.6em',
                right: '0.8em',
            },
            clubs: {
                bottom: '0.6em',
                right: '0.8em',
            },
        },
    }[rank][suit];

    return (
        <>
            <Flex sx={{
                gridRowStart: 2,
                gridRowEnd: 'span 14',
                gridColumnStart: 2,
                gridColumnEnd: 'span 4',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box
                    sx={{
                        border: 'solid 1px #00f',
                        borderRadius: '0.15em',
                        height: '100%',
                    }}
                    as="img"
                    src={imageSrc}
                    alt=""
                />
            </Flex>
            <Pip pip={pip} sx={{ fontSize: '1.3em', position: 'absolute', color, ...topPipStyle}} />
            <Pip pip={pip} sx={{ fontSize: '1.3em', position: 'absolute', color, transform: 'rotate(180deg)', ...bottomPipStyle }} />
        </>
    );
};

export { Face, Face as default };