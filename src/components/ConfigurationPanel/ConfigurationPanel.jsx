import React from 'react';
import { Box, Flex } from '../Box';
import Text from '../Text';

const ConfigurationPanel = ({ configuration, setConfiguration, hide, show = false }) => {
    const handleChangeNumberOfDecks = e => {
        const numberOfDecks = e.target.value;
        if (numberOfDecks < 1) {
            return;
        }

        setConfiguration({ ...configuration, numberOfDecks });
    };

    const handleChangePenetration = e => {
        const penetration = e.target.value;
        if (penetration < 0 || penetration > 100) {
            return;
        }

        setConfiguration({ ...configuration, penetration });
    };

    const handleChangeMinCutRange = e => {
        const min = e.target.value;
        if (min >= configuration.cutRange.max || min < 0 || min > 100) {
            return;
        }

        setConfiguration({ ...configuration, cutRange: { ...configuration.cutRange, min } })
    };

    const handleChangeMaxCutRange = e => {
        const max = e.target.value;
        if (max <= configuration.cutRange.min || max < 0 || max > 100) {
            return;
        }

        setConfiguration({ ...configuration, cutRange: { ...configuration.cutRange, max } })
    };

    return show && (
        <>
            <Box onClick={hide} sx={{ zIndex: '100', position: 'absolute', width: '100vw', height: '100vh', backgroundColor: '#333', opacity: '0.66' }} />
            <Box sx={{
                zIndex: '200',
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translate(-50%)',
            }}>
                <Box sx={{
                    backgroundColor: 'darkGreen',
                    border: 'solid 1px',
                    borderColor: 'black',
                    borderRadius: '0.25rem',
                    boxShadow: '2px 2px 20px #333',
                    p: 'md',
                }}>
                    <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', py: '0.1rem', mb: '0.5rem' }}>
                        <Text sx={{ color: 'white' }}>Configuration</Text>
                        <Text sx={{ fontSize: '0.66rem', cursor: 'pointer' }} onClick={hide}>❌</Text>
                    </Flex>

                    <Box
                        as="form"
                        sx={{
                            p: 'lg',
                            border: 'solid 1px #000',
                            backgroundColor: 'feltGreen',
                        }}
                    >
                        <Flex as="fieldset" sx={{ flexDirection: 'column', gap: '1rem', minWidth: '15rem' }}>

                            <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between', gap: '2rem' }}>
                                <Text>Number of Decks:</Text>
                                <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.numberOfDecks} onChange={handleChangeNumberOfDecks} />
                            </Flex>

                            <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Penetration:</Text>
                                <Box sx={{ width: '3rem' }} as="input" type="number" value={configuration.penetration} onChange={handleChangePenetration} />
                            </Flex>

                            <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Min Cut Range:</Text>
                                <Box
                                    sx={{ width: '3rem' }}
                                    as="input"
                                    type="number"
                                    value={configuration.cutRange.min}
                                    onChange={handleChangeMinCutRange}
                                />
                            </Flex>

                            <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Max Cut Range:</Text>
                                <Box
                                    sx={{ width: '3rem' }}
                                    as="input"
                                    type="number"
                                    value={configuration.cutRange.max}
                                    onChange={handleChangeMaxCutRange}
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
                                <Text>Double after split:</Text>
                                <Box
                                    disabled
                                    as="input"
                                    type="checkbox"
                                    checked={configuration.doubleAfterSplit}
                                    onChange={e => setConfiguration({
                                        ...configuration,
                                        doubleAfterSplit: e.target.checked,
                                    })}
                                />
                            </Flex>

                            <Flex as="label" sx={{ justifyContent: 'space-between' }}>
                                <Text>Double on:</Text>
                                <Box
                                    as="select"
                                    name="double"
                                    value={configuration.double}
                                    onChange={e => setConfiguration({
                                        ...configuration,
                                        double: e.target.value,
                                    })}
                                >
                                    <Box as="option" value="any">Any</Box>
                                    <Box as="option" value="tenEleven">10,11</Box>
                                    <Box as="option" value="nineTenEleven">9,10,11</Box>
                                </Box>
                            </Flex>

                            <Flex as="label" sx={{ justifyContent: 'space-between' }}>
                                <Text>Draw after split Aces:</Text>
                                <Box
                                    disabled
                                    as="input"
                                    type="checkbox"
                                    value={configuration.drawAfterSplitAces}
                                    onChange={e => setConfiguration({
                                        ...configuration,
                                        drawAfterSplitAces: e.target.checked,
                                    })}
                                />
                            </Flex>

                            <Flex as="label" sx={{ justifyContent: 'space-between' }}>
                                <Text>Resplit Split Aces:</Text>
                                <Box
                                    disabled
                                    as="input"
                                    type="checkbox"
                                    value={configuration.drawAfterSplitAces}
                                    onChange={e => setConfiguration({
                                        ...configuration,
                                        resplitAces: e.target.checked,
                                    })}
                                />
                            </Flex>

                            <Flex as="label" sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Surrender:</Text>
                                <Box
                                    disabled
                                    as="select"
                                    name="surrender"
                                    value={configuration.surrender}
                                    onChange={e => setConfiguration({
                                        ...configuration,
                                        surrender: e.target.value,
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
                                        blackjackPays: e.target.value,
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
        </>
    );
};

export default ConfigurationPanel;