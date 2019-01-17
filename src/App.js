import React, { Component,Fragment } from 'react';

import { Navigator, Carousel, CarouselItem, Icon } from 'react-onsenui';


import {setNav} from './util/core';
import pages from './page';

import { getCache } from './util/db';

import { Progress, ForceUpdate, Alert, nonBlockLoading} from './util/com';


class App extends Component {

  constructor() {
    super();
    this.state = {
      EnterPrev: true,
      Enter: true,
      EnterIndex: 0,
      data: [0, 1, 2]
    }
  }

  componentWillMount(){
    getCache('user_cache', v => {
      v ? this.setState({ Enter: false, EnterPrev: false }) : this.setState({ Enter: true, EnterPrev: false })  
    })
  }

  changeIndex(e) {
    let index = e.activeIndex
    this.setState({ EnterIndex: index })
  }
  closeEnter() {
    this.setState({ Enter: false })
  }


  renderPage(route, navigator) {
    setNav(navigator);
    return (
      <route.page key={route.key} p={route.p} />
    );
  }


  render() {
    return (
      <Fragment>
        {this.state.EnterPrev && 
          <div className="App-EnterPrev text-center">
            <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
          </div>
        }
        {this.state.Enter && !this.state.EnterPrev && 
          <div className="EnterPage">
            <Carousel
              onPostChange={e => this.changeIndex(e)}
              index={this.state.EnterIndex}
              swipeable
              autoScroll
              fullscreen
              autoScrollRatio={0.25}
            >
              {this.state.data.map((item, index) =>
                <CarouselItem >
                  {/* <img src={AppCore.HOST + '/' + item.img} className="EnterPage-img" /> */}
                  <img src={'/img/QRcode_bg.png'} className="EnterPage-img img-size" />
                  <div className={'EnterPage-btn-box ' + (this.state.data.length - 1 === index ? '' : 'hide')}>
                    <div className='EnterPage-btn' onClick={_ => this.closeEnter()}>
                      立即体验
                    </div>
                  </div>
                </CarouselItem>
              )}
            </Carousel>
          </div>
        }
        {!this.state.Enter && !this.state.EnterPrev &&
          <Navigator
            animation="none"
            swipeable
            renderPage={this.renderPage.bind(this)}
            initialRoute={{
              page: pages['底栏菜单'],
              key: '底栏菜单'
            }}
          />
        }
        <Progress/>
        <ForceUpdate/>
        <Alert/>
      </Fragment>
    );
  }
}


export default App;

