import React, { Component,Fragment } from 'react';

import { Navigator } from 'react-onsenui';

import {setNav} from './util/core';
import pages from './page';

import {Progress,ForceUpdate,Alert} from './util/com';


class App extends Component {
  renderPage(route, navigator) {
    setNav(navigator);
    return (
      <route.page key={route.key} p={route.p} />
    );
  }


  render() {
    return (
      <Fragment>
        <Navigator
          swipeable
          renderPage={this.renderPage.bind(this)}
          initialRoute={{
            page: pages['底栏菜单'],
            key: '底栏菜单'
          }}
        />
        <Progress/>
        <ForceUpdate/>
        <Alert/>
      </Fragment>
    );
  }
}


export default App;

