import React, { useState } from 'react';
import { Flex } from '../Box';
import Text from '../Text';
import ConfigurationPanel from '../ConfigurationPanel';

const StatusBar = ({ context, configuration, setConfiguration }) => {
    const [showConfiguration, setShowConfiguration] = useState(false);

    return (
        <>
            <Flex
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    backgroundColor: '#020',
                    color: 'white',
                    p: '0.5rem',
                    width: '100%',
                    borderBottom: 'solid 1px',
                    borderColor: 'white',
                }}>
                <Text
                    sx={{
                        textShadow: '0 0 10px #333',
                        cursor: 'pointer',
                        color: 'white',
                    }}
                    onClick={() => setShowConfiguration(!showConfiguration)}>⚙️</Text>
                <Text sx={{ color: 'yellow' }}>{`${context.bank}/${context.bankroll}`}</Text>
            </Flex>
            <ConfigurationPanel
                show={showConfiguration}
                configuration={configuration}
                hide={() => setShowConfiguration(false)}
                setConfiguration={setConfiguration}
            />
        </>
    );
};

export default StatusBar;