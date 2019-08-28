import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
