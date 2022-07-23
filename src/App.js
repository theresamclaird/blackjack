import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { Game } from './components/Game/Game';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Game />
      </ThemeProvider>
    </div>
  );
}

export default App;
