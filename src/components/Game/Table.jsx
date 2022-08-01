import React from 'react';
import { Flex } from '../Box';
import { Text } from '../Text';

const Table = () => {
    const commonTextStyle = {
        color: 'yellow',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: '600',
    };
    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Text sx={{ ...commonTextStyle, my: 'md' }}>Blackjack pays 3 to 2</Text>
            <Text sx={{ ...commonTextStyle, mb: 'md', color: 'white', }}>Dealer must hit soft 17</Text>
            <Flex sx={{
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
                    fontFamily: 'fancy',
                    fontWeight: '900',
                    fontSize: '1.6rem',
                    ...commonTextStyle,
                    letterSpacing: '0.6rem',
                }}>Insurance Pays 2 To 1</Text>
            </Flex>
        </Flex>
    );
};

export default Table;