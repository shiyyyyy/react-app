import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';

export default class SharePage extends Component {

    constructor(props) {
        super();
        this.state = {
            scene: '',
            title: '',
            des: '',
            thumb: '',
            link: ''
        };

        this.shareRef = null;
        this.setShare = (ref) => this.shareRef = ref;
    }

    handleUpload(e){
        e.preventDefault();

        let file = e.target.files[0];
        const formdata = new FormData();
        formdata.append('file', file);

        for (var value of formdata.values()) {
            console.log(value);
        }

        let url = 'http://localhost/zs-front/';
        fetch(url, {
            method: 'POST',
            body: formdata,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => console.log(response))
        .catch(error => console.log(error));
    };


    render() {
        return (
            <Page 
            
            >
                {/* 分享 */}
                <div className="sharePage">
                    <div className="sharePage-cell-box">

                        <div className="sharePage-cell">
                            <div className="sharePage-cell-label">
                                内容标题 : 
                            </div>
                            <div className="sharePage-cell-input">
                                <input type="text" value={this.state.title} 
                                onChange={e=>this.changeTitle(e.target.value)} />
                            </div>
                        </div>

                        <div className="sharePage-cell">
                            <div className="sharePage-cell-label">
                                内容标题 :
                            </div>
                            <div className="sharePage-cell-input">
                                <input type="text" value={this.state.title} onChange={e => this.changeTitle(e.target.value)} />
                            </div>
                        </div>

                        <div className="sharePage-cell">
                            <div className="sharePage-cell-label">
                                内容标题 :
                            </div>
                            <div className="sharePage-cell-input">
                                <input type="text" value={this.state.title} onChange={e => this.changeTitle(e.target.value)} />
                            </div>
                        </div>

                        <div className="sharePage-cell">
                            <div className="sharePage-cell-label">
                                分享文件 : 
                            </div>
                            <div className="sharePage-cell-input">
                                <input type="file" ref={this.setShare} 
                                onChange={e => this.handleUpload(e)} 
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </Page>
        );
    }
}

