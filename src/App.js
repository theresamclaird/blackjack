import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { Table } from './components/Table';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Table />
      </ThemeProvider>
    </div>
  );
}

export default App;
