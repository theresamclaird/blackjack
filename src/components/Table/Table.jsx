import React from 'react';
import { Flex } from '../Box';
import Text from '../Text';

const Table = ({ player, dealer, configuration }) => {
    const commonTextStyle = {
        color: 'yellow',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: '600',
    };
    const blackjackPay = {
        1.2: 'Blackjack Pays 6 to 5',
        1.5: 'Blackjack Pays 3 to 2',
    }[configuration.blackjackPays];
    const dealerStrategy = {
        true: 'Dealer Hits Soft 17',
        false: 'Dealer Stands On 17',
    }[configuration?.dealerHitsSoft17];

    return (
        <Flex sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgb(0,51,0)',
            background: 'linear-gradient(180deg, rgba(0,51,0,1) 0%, rgba(53,101,77,1) 33%, rgba(0,51,0,1) 100%)',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            {dealer}
            <Flex sx={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Text sx={{ ...commonTextStyle, my: 'md' }}>{blackjackPay}</Text>
                <Text sx={{ ...commonTextStyle, mb: 'md', color: 'white', }}>{dealerStrategy}</Text>
                <Flex sx={{
                    backgroundColor: 'darkGreen',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'white',
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    py: 'sm',
                    px: 'lg',
                }}>
                    <Text sx={{
                        fontWeight: '900',
                        fontSize: '1.6rem',
                        ...commonTextStyle,
                        letterSpacing: '0.6rem',
                    }}>Insurance Pays 2 To 1</Text>
                </Flex>
            </Flex>
            {player}
        </Flex>
    );
};

export default Table;