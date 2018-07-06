import React from 'react';
import ReactDOM from 'react-dom';

import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './index.css';
import './util/init';

import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import {store} from './util/core';


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
// registerServiceWorker();
