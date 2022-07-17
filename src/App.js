import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Text from './components/Text';
import { Table } from './components/Table';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Table>
          <Text sx={{ color: 'yellow', textTransform: 'uppercase' }}>Blackjack pays 3 to 2</Text>
        </Table>
      </ThemeProvider>
    </div>
  );
}

export default App;
