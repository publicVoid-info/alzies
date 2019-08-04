import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Header from './components/paperbase/Header';
import Content from './components/paperbase/Content';
import Navigator from './components/paperbase/Navigator';
import Paperbase from './components/paperbase/Paperbase';


function App() {

  const theme = createMuiTheme({
    palette: {
      type: 'dark'
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Paperbase></Paperbase>
          <Navigator>
          </Navigator>
        </React.Fragment>
      </ThemeProvider>
    </div>
  );
}

export default App;
