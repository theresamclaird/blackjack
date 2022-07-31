import React from 'react';
import { Box, Flex } from '../Box';
import { Text } from '../Text';

const Configuration = ({ configuration, setConfiguration, toggle }) => (
    <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%)',
    }}>
        <Box sx={{
            backgroundColor: 'feltGreen',
            border: 'solid 2px',
            borderColor: 'darkGreen',
            borderRadius: '0.5rem',
            color: 'white',
            boxShadow: '2px 2px 20px #333',
            p: 'md',
        }}>
            <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', px: '0.4rem', pt: '0.4rem' }}>
                <Text>Configuration</Text>
                <Text sx={{ fontSize: '0.66rem', cursor: 'pointer' }} onClick={toggle}>❌</Text>
            </Flex>

            <Box as="form" sx={{ p: 'xl' }}>
                <Flex as="fieldset" sx={{ flexDirection: 'column', gap: '1rem', minWidth: '15rem' }}>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: '2rem' }}>
                        <Text>Number of Decks:</Text>
                        <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.numberOfDecks} onChange={e => setConfiguration({ ...configuration, numberOfDecks: e.target.value })} />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Penetration:</Text>
                        <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.penetration} onChange={e => setConfiguration({ ...configuration, penetration: e.target.value })} />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Min Cut Range:</Text>
                        <Box
                            sx={{ width: '3rem' }}
                            as="input"
                            type="number"
                            value={configuration.cutRange.min}
                            onChange={e => setConfiguration({
                                ...configuration,
                                cutRange: {
                                    ...configuration.cutRange,
                                    min: e.target.value,
                                },
                            })}
                        />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Max Cut Range:</Text>
                        <Box
                            sx={{ width: '3rem' }}
                            as="input"
                            type="number"
                            value={configuration.cutRange.max}
                            onChange={e => setConfiguration({
                                ...configuration,
                                cutRange: {
                                    ...configuration.cutRange,
                                    max: e.target.value,
                                },
                            })}
                        />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Dealer Peek:</Text>
                        <Box
                            as="input"
                            type="checkbox"
                            checked={configuration.dealerPeek}
                            onChange={e => setConfiguration({
                                ...configuration,
                                dealerPeek: e.target.checked,
                            })}
                        />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Dealer hits soft 17:</Text>
                        <Box
                            as="input"
                            type="checkbox"
                            checked={configuration.dealerHitsSoft17}
                            onChange={e => setConfiguration({
                                ...configuration,
                                dealerHitsSoft17: e.target.checked,
                            })}
                        />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Double after split allowed:</Text>
                        <Box
                            as="input"
                            type="checkbox"
                            checked={configuration.doubleAfterSplit}
                            onChange={e => setConfiguration({
                                ...configuration,
                                doubleAfterSplit: e.target.checked,
                            })}
                        />
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Surrender:</Text>
                        <Box
                            as="select"
                            name="surrender"
                            value={configuration.surrender}
                            onChange={e => setConfiguration({
                                ...configuration,
                            })}
                        >
                            <Box as="option" value="late">Late</Box>
                            <Box as="option" value="early">Early</Box>
                            <Box as="option" value="false">Not Allowed</Box>
                        </Box>
                    </Flex>

                    <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Blackjack Pays:</Text>
                        <Box
                            as="select"
                            name="blackjackPays"
                            value={configuration.blackjackPays}
                            onChange={e => setConfiguration({
                                ...configuration,
                            })}
                        >
                            <Box as="option" value={1.5}>3 / 2</Box>
                            <Box as="option" value={1.2}>6 / 5</Box>
                        </Box>
                    </Flex>

                </Flex>
            </Box>
        </Box>
    </Box>
);

export default Configuration;