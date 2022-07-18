import React from 'react';
import PropTypes from 'prop-types';
import { configuration } from '../../configuration';
import { Flex } from '../Box';
import { Text } from '../Text';
import { Seat } from '../Seat';
import { Card } from '../Card';

export const Table = ({ sx, seats = [...Array(configuration.numberOfSeats).keys(() => ({ bet: 0 }))] }) => {
    const commonTextStyle = {
        color: 'yellow',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: '600',
    };

    const hearts = [];
    for (let i = 1 ; i <= 10; i++) {
        hearts.push(<React.Fragment key={`card-${i}-hearts`}><Card rank={i} suit="hearts" value={i} /></React.Fragment>);
    }
    hearts.push(<React.Fragment key={`card-jack-hearts`}><Card suit="hearts" rank="jack" value={10} /></React.Fragment>)
    hearts.push(<React.Fragment key={`card-queen-hearts`}><Card suit="hearts" rank="queen" value={10} /></React.Fragment>)
    hearts.push(<React.Fragment key={`card-king-hearts`}><Card suit="hearts" rank="king" value={10} /></React.Fragment>)

    const spades = [];
    for (let i = 1 ; i <= 10; i++) {
        spades.push(<React.Fragment key={`card-${i}-spades`}><Card rank={i} suit="spades" value={i} /></React.Fragment>);
    }
    spades.push(<React.Fragment key={`card-jack-spades`}><Card suit="spades" rank="jack" value={10} /></React.Fragment>)
    spades.push(<React.Fragment key={`card-queen-spades`}><Card suit="spades" rank="queen" value={10} /></React.Fragment>)
    spades.push(<React.Fragment key={`card-king-spades`}><Card suit="spades" rank="king" value={10} /></React.Fragment>)

    const diamonds = [];
    for (let i = 1 ; i <= 10; i++) {
        diamonds.push(<React.Fragment key={`card-${i}-diamonds`}><Card rank={i} suit="diamonds" value={i} /></React.Fragment>);
    }
    diamonds.push(<React.Fragment key={`card-jack-diamonds`}><Card suit="diamonds" rank="jack" value={10} /></React.Fragment>)
    diamonds.push(<React.Fragment key={`card-queen-diamonds`}><Card suit="diamonds" rank="queen" value={10} /></React.Fragment>)
    diamonds.push(<React.Fragment key={`card-king-diamonds`}><Card suit="diamonds" rank="king" value={10} /></React.Fragment>)

    const clubs = [];
    for (let i = 1 ; i <= 10; i++) {
        clubs.push(<React.Fragment key={`card-${i}-clubs`}><Card rank={i} suit="clubs" value={i} /></React.Fragment>);
    }
    clubs.push(<React.Fragment key={`card-jack-clubs`}><Card suit="clubs" rank="jack" value={10} /></React.Fragment>)
    clubs.push(<React.Fragment key={`card-queen-clubs`}><Card suit="clubs" rank="queen" value={10} /></React.Fragment>)
    clubs.push(<React.Fragment key={`card-king-clubs`}><Card suit="clubs" rank="king" value={10} /></React.Fragment>)

    return (
        <Flex sx={{
            minWidth: '90vw',
            minHeight: '90vh',
            bg: 'feltGreen',
            p: 'xxl',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            border: 'solid 2px',
            borderColor: 'black',
            borderRadius: '20px',
            boxShadow: '0 0 60px #444',
            ...sx,
        }}>
            <Flex sx={{ width: '100%', m: 'sm', flexDirection: 'row', justifyContent: 'center', gridGap: 'sm' }}>{hearts}</Flex>
            <Flex sx={{ width: '100%', m: 'sm', flexDirection: 'row', justifyContent: 'center', gridGap: 'sm' }}>{spades}</Flex>
            <Flex sx={{ width: '100%', m: 'sm', flexDirection: 'row', justifyContent: 'center', gridGap: 'sm' }}>{diamonds}</Flex>
            <Flex sx={{ width: '100%', m: 'sm', flexDirection: 'row', justifyContent: 'center', gridGap: 'sm' }}>{clubs}</Flex>
            <Text sx={{
                ...commonTextStyle,
                mb: 'md',
            }}>Blackjack pays 3 to 2</Text>
            <Text sx={{
                ...commonTextStyle,
                color: 'white',
            }}>Dealer must hit soft 17</Text>
            <Text sx={{
                width: '100%',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'white',
                fontFamily: 'fancy',
                fontWeight: '900',
                fontSize: '1.6rem',
                ...commonTextStyle,
                letterSpacing: '0.6rem',
                my: 'lg',
                p: 'sm',
            }}>Insurance Pays 2 To 1</Text>
            <Flex sx={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 'lg',
            }}>
                {seats.map((seat, index) => (
                    <React.Fragment key={`seat-${index}`}>
                        <Seat {...seat} />
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
};

Table.defaultProps = {
    sx: {},
};

Table.propTypes = {
    sx: PropTypes.objectOf(PropTypes.any),
};