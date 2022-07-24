import React from 'react';
import Box, { Flex } from '../Box';
import { Text } from '../Text';

const Table = ({ sx = {}, insuranceBet = 0 }) => {
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
            <Box sx={{
                position: 'relative',
                width: '100%',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'white',
                mb: 'xl',
                py: 'sm',
                px: 'xl',
            }}>
                <Text sx={{
                    fontFamily: 'fancy',
                    fontWeight: '900',
                    fontSize: '1.6rem',
                    ...commonTextStyle,
                    letterSpacing: '0.6rem',
                }}>Insurance Pays 2 To 1</Text>
                {insuranceBet > 0 && <Text sx={{ color: 'white', position: 'absolute', right: '1rem', top: '0.5rem' }}>{`Insurance: ¤ ${insuranceBet}`}</Text>}
            </Box>
        </Flex>
    );
};

export default Table;