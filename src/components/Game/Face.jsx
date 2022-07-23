import React from 'react';
import { Box, Flex } from '../Box';
import Pip from './Pip';

import jackHearts from '../../images/jack-hearts.svg'
import queenHearts from '../../images/queen-hearts.svg';
import kingHearts from '../../images/king-hearts.svg';
import jackSpades from '../../images/jack-spades.svg';
import queenSpades from '../../images/queen-spades.svg';
import kingSpades from '../../images/king-spades.svg';
import jackDiamonds from '../../images/jack-diamonds.svg';
import queenDiamonds from '../../images/queen-diamonds.svg';
import kingDiamonds from '../../images/king-diamonds.svg';
import jackClubs from '../../images/jack-clubs.svg';
import queenClubs from '../../images/queen-clubs.svg';
import kingClubs from '../../images/king-clubs.svg';

const Face = ({ rank, suit, pip, color }) => {
    const imageSrc = {
        jack: { hearts: jackHearts, spades: jackSpades, diamonds: jackDiamonds, clubs: jackClubs },
        queen: { hearts: queenHearts, spades: queenSpades, diamonds: queenDiamonds, clubs: queenClubs },
        king: { hearts: kingHearts, spades: kingSpades, diamonds: kingDiamonds, clubs: kingClubs },
    }[rank][suit];

    const pipVerticalDistance = '0.7rem';
    const pipHorizontalDistance = '1.05rem';

    const topPipStyle = {
        jack: {
            hearts: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            spades: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            diamonds: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            clubs: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
        },
        queen: {
            hearts: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            spades: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            diamonds: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            clubs: {
                top: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
        },
        king: {
            hearts: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            spades: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            diamonds: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            clubs: {
                top: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
        },
    }[rank][suit];

    const bottomPipStyle = {
        jack: {
            hearts: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            spades: {
                bottom: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            diamonds: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            clubs: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
        },
        queen: {
            hearts: {
                bottom: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            spades: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            diamonds: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
            clubs: {
                bottom: pipVerticalDistance,
                left: pipHorizontalDistance,
            },
        },
        king: {
            hearts: {
                bottom: pipVerticalDistance,
                right: '1rem',
            },
            spades: {
                bottom: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            diamonds: {
                bottom: pipVerticalDistance,
                right: pipHorizontalDistance,
            },
            clubs: {
                bottom: pipVerticalDistance,
                right: pipHorizontalDistance,
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
                        borderRadius: '0.15rem',
                        height: '100%',
                    }}
                    as="img"
                    src={imageSrc}
                    alt=""
                />
            </Flex>
            <Pip pip={pip} sx={{ fontSize: '1.3rem', position: 'absolute', color, ...topPipStyle}} />
            <Pip pip={pip} sx={{ fontSize: '1.3rem', position: 'absolute', color, transform: 'rotate(180deg)', ...bottomPipStyle }} />
        </>
    );
};

export { Face, Face as default };