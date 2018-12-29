import React, { Component, Fragment } from 'react';

import { Carousel, CarouselItem } from 'react-onsenui';

import { AppCore } from './util/core';

import App from './App';

import './css/EnterPage.css';

class EnterPage extends Component {
    constructor(){
        super();
        this.state = {
            Enter: true,
            EnterIndex: 0,
            data:[0]
        }
        this.color = ['hotpink','gold','green','red','blue','tomato','black']
    }

    changeIndex(e){
        let index = e.activeIndex
        this.setState({EnterIndex: index})
    }
    closeEnter(){
        console.log(this)
        this.setState({Enter: false})
    }

    render() {
        return (
            <Fragment>
                {this.state.Enter && 
                    <div className="EnterPage">
                        <Carousel
                            onPostChange={e => this.changeIndex(e)}
                            index={this.state.EnterIndex}
                            swipeable
                            autoScroll
                            fullscreen
                            autoScrollRatio={0.25}
                        >
                            {this.state.data.map((item,index) =>
                                <CarouselItem style={{ backgroundColor: this.color[item] }} >
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
                { 
                    < App />
                }

            </Fragment>
            
        );
    }
}


export default EnterPage;

