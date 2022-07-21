import React from 'react';
import { Flex } from '../Box';
import { Text } from '../Text';

const TableText = ({ sx = {} }) => {
    const commonTextStyle = {
        color: 'yellow',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: '600',
    };
    return (
        <Flex sx={{ flexDirection: 'column', justifyContent: 'center', ...sx }}>
            <Text sx={{ ...commonTextStyle, my: 'md' }}>Blackjack pays 3 to 2</Text>
            <Text sx={{ ...commonTextStyle, mb: 'md', color: 'white', }}>Dealer must hit soft 17</Text>
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
                mb: 'xl',
                py: 'sm',
                px: 'xl',
            }}>Insurance Pays 2 To 1</Text>
        </Flex>
    );
};

export { TableText, TableText as default };