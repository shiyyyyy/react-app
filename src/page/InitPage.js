import React, { Component } from 'react';

import {ProgressCircular} from 'react-onsenui';

import {trigger} from '../util/core';


export default class InitPage extends Component{
  constructor(props) {
    super(props);
    trigger('初始化',this);
  }

  render(){
    return (
      <ons-page>
        <ProgressCircular indeterminate />
      </ons-page>
    );
  }
};
