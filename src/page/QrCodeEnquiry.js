import React, { Component, Fragment } from 'react';

import { Page } from 'react-onsenui';

import { AppCore, goTo, goBack, shareImage } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, shareWith } from '../util/com';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';

class QrCodeEnquiry extends Component {

    constructor(props) {
        super(props);
        this.item = this.props.p.item
        this.state = { state: 'initial', c_w: 0, c_h: 0 };
        this.state.url = AppCore.SHARE_HOST + '?user=' + this.props.s.user.employee_id;
        // 二维码 背景色
        // this.bgColor = 'RGBA(0,0,0,.1)';
        this.bgColor = '#FFFFFF';
        this.text = '发放询单';

    }
    componentDidMount() {
        // 获取屏幕宽度高度
        let width = window.innerWidth
        let height = window.innerHeight
        if (AppCore.os === 'ios') {
            height = height - 44
        } else {
            height = height - 56
        }


        this.setState({ c_w: width, c_h: height })
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext('2d');
        let BGimage = new Image();
        BGimage.src = 'img/QRcode_bg.png'
        BGimage.onload = function () {
            context.drawImage(BGimage, 0, 0, width * 2, height * 2);

            let QRcanvas = document.getElementById("QRc");
            let QRimage = new Image();
            QRimage.src = QRcanvas.toDataURL();

            // 在把图片放进canvas里
            QRimage.onload = function () {
                let w = (width * 2 - 360) / 2;
                let h = (height * 2 - 360) / 2 - 80;
                context.drawImage(QRimage, w, h, 360, 360);
            }
        };

        canvas.style.cssText = `transform: scale(.5) translate(-${width}px, -${height}px)`;
    };

    share(scene) {
        this.setState({ shareWithOpen: false });
        let canvas = document.getElementById('canvas');
        let img = canvas.toDataURL();

        let argv = [
            scene, '我的二维码',
            '北青' + this.props.s.user.employee_name,
            img
        ];
        shareImage(...argv);
    }

    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.text}</div>
                <div className="right">{
                    <ons-toolbar-button onClick={_ => this.setState({ shareWithOpen: true })}>分享</ons-toolbar-button>
                }
                </div>
            </ons-toolbar>
        )
    }


    render() {
        return (
            <Page
                renderToolbar={_ => this.renderToolbar()}
                renderModal={_ => shareWith(this)} >
                {
                    this.props.s.user.sid &&
                    // <div className="QRcode">
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        <QRCode id="QRc" value={this.state.url} bgColor={this.bgColor}
                            style={{ width: '0', height: '0', display: 'block' }} />

                        {/* <canvas id="canvas" width={this.state.c_w} height={this.state.c_h}> */}
                        <canvas id="canvas" width={this.state.c_w * 2} height={this.state.c_h * 2}>
                        </canvas>
                    </div>
                }

            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(QrCodeEnquiry)

