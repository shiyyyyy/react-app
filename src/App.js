import React, { Component } from 'react';

import { Navigator } from 'react-onsenui';

import {setNav} from './util/core';
import pages from './page';


class App extends Component {
  renderPage(route, navigator) {
    setNav(navigator);
    return (
      <route.page key={route.key} />
    );
  }


  render() {
    return (
      <Navigator
        swipeable
        renderPage={this.renderPage.bind(this)}
        initialRoute={{
          page: pages['底栏菜单'],
          key: '底栏菜单'
        }}
      />
    );
  }
}


export default App;

