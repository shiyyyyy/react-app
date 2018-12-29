import React from 'react';
import ReactDOM from 'react-dom';

import 'onsenui/css/onsenui.css';
import './zs-onsen-css-components.css';
import './index.css';
import './util/init';

import App from './App';
import EnterPage from './EnterPage';
// import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import {store} from './util/core';


ReactDOM.render(<Provider store={store}><EnterPage /></Provider>, document.getElementById('root'));
// registerServiceWorker();
