import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { Flex } from './components/Box';
import { Table } from './components/Table';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Flex sx={{
          backgroundColor: 'gray',
          width: '100vw',
          height: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Table />
        </Flex>
      </ThemeProvider>
    </div>
  );
}

export default App;
