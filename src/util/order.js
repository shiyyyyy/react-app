import React from 'react'

import {goTo,Enum} from './core'
import { shareWith } from './com';
import {Page,Button,Input,Dialog,Select} from 'react-onsenui';

// 产品详情
export  class ProDetail extends React.Component {
    constructor() {
      super()
      this.state = {}
      console.log(this)
    }
  
    render() {
      return (
        <div className="ord-edit-ord-detail">
            {/* 订单页面 HTML */}
            <div className="order-item" style={{paddingBottom: '1.013333rem'}}>
                <div className="order-number">
                    <span style={{fontSize:'.373333rem'}}>订单号: D012334324</span>
                    <span style={{color:'#9E9E9E', fontSize:'.32rem'}}>门管中心-潘家园门市-李阿斯蒂芬</span>
                </div>
                <div className="order-main">
                {/* 以下为 group 里面拿过来的,应该可以放在函数里,但是HTML里面的东西不太一样 */}
                <div className="pro-item"
                style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
                    <div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
                        <img className="img-size" src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530677101117&di=5ada5f831c0373638a3f7c56dd683750&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb7003af33a87e95053e42ae21c385343faf2b449.jpg'} />
                    </div>
                    <div className="pro-item-right">
                        <div className="pro-item-name">张家界无敌自由行,不包吃不包住不包机票,给我钱你自己去玩</div>
                        <div className="pro-item-dep_city flex-j-sb">
                            <span>团期: 2018-10-01</span>
                            <span>亚美运通</span>
                        </div>
                        <div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
                            <span>客户: 张全蛋</span>
                            <span>人数: 2</span>
                            {/* <span className={'active-order-state'+(order.state*1)}>{this.state.ord_state[order.state*1]}</span> */}
                            <span>已支付</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      )
    }
}





// 产品信息
export  class ProInfo extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="pro-header-info">
			    <div className="pro-name">南亚风情自由行</div>
			    <div className="pro-price">
			    	<div className="pro-price-zk_price">￥68888 <span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起</span></div>
			    	<div className="pro-price-dep_city">北京出发</div>
			    </div>
			    <div className="pro-sale">
			    	<div className="pro-sale-price">2018-09-08</div>
			    	<div className="pro-sale-supplier">供应商: 亚美运通</div>
			    </div>
		    </div>
      )
    }
}





// 客户信息
export  class CustomerInfo extends React.Component {
  constructor() {
    super()
    this.state = {}
    console.log(this)
  }

  render() {
    return (
        <div className="model-box">
			<div className="box-title">
				<div className="box-title-text">客户信息</div>
				<div className={(this.props.check ? 'hide': '')+" box-title-operate"}>
					<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>选择客户</div>
					<div className="box-title-operate-item">新增客户</div>
				</div>
			</div>
			<div className="model-main">
			{this.props.view['接单人'].map( (item,i) => 
				<div className="model-main-box" key={i}>
					<div className="model-main-item">
						<span>姓名: </span>
						<input type="text" value={this.props.view.client.name} disabled={this.props.check ? 'disabled': ''}
						onChange={ e=>this.props.view.setState({'client.name':e.target.value}) } /></div>
					<div className="model-main-item">
						<span>电话: </span>
						<input type='number' value={this.props.view.client.mobile} disabled={this.props.check ? 'disabled': ''}
						onChange={ e => this.props.view.setState({'client.mobile':e.target.value}) }/></div>						
					</div>
			)}
			</div>
		</div>
    )
  }
}


// 接单人
export  class PickSingle extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="model-box">
            <div className="box-title">
                <div className="box-title-text">接单人</div>
                <div className={(this.props.check ? 'hide': '')+" box-title-operate"}>
                    <div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>选择客户</div>
                </div>
            </div>
            <div className="model-main">
            {this.props.view['接单人'].map( (item,i) =>
                <div className="model.main-item-box" key={i}>
                    <div className="model-main-item">
                        <span>姓名: </span>
                        <input type="text" value={this.props.view['接单人'].name} disabled={this.props.check ? 'disabled': ''}
                        onChange={ e => this.setState({'接单人["name"]': e.target.value})} /></div>
                </div>
            )}
            </div>
        </div>
      )
    }
}



// 游客名单
export  class ToursList extends React.Component {
    constructor() {
      super()
      this.state = {}
    }

    componentWillMount(){
        let data = Object.assign({},this.props.view) 
        this.setState(data,_=>console.log(this.state))
    }
    addYK(){
		if(!this.props.view['游客名单'][this.props.view['游客名单'].length - 1].name) return
		this.props.view['游客名单'].push({})
		this.setState({ '游客名单': this.props.view['游客名单'] },_=>console.log(this.props.view))
	}
  
    render() {
      return (
        <div className="model-box">
			<div className="box-title">
				<div className="box-title-text">游客名单</div>
				<div className={(this.props.check ? 'hide': '')+" box-title-operate"}>
					<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}
					onClick={this.addYK.bind(this)}>添加游客</div>
				</div>
			</div>
			<div className="model-main">
			{this.props.view['游客名单'].map( (item,i) => 
				<div className="model-main-item-box" onClick={_=>goTo('录入游客名单',item)} key={i}>
					<div className="model-main-item">
						<span>{i+1}</span> 
						<span>{item.name}</span> 
						<span>{item.gender}</span> 
						<span>{item.birthday}</span>
						<span>{item.ID_card_type}</span> 
						<span>{item.ID_num}</span>
						<i></i>
					</div>
				</div>
			)}
			</div>
		</div>
      )
    }
}




// 订单应收
export  class OrderReceivable extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="model-box">
			<div className="box-title">
				<div className="box-title-text">订单应收</div>
				<div className={(this.props.check ? 'hide': '')+" box-title-operate"}>
					<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>录入明细</div>
				</div>
			</div>
			<div className="model-main">
				<div className="model-main-item-box">
					<div className="model-main-item flex-j-sb">
					{Object.keys(this.props.view['订单应收']).map( (item,i) => 
						<strong key={i}>
						{item === 'receivable' ? '应收':''}
						{item === 'receivad' ? '已收':''}
						{item === 'uncollected' ? '未收':''}
						: <i>{this.props.view['订单应收'][item]}</i></strong>
					)}
						{/* <strong>已收: <i>{item.received}</i></strong>
						<strong>未收: <i>{item.uncollected}</i></strong> */}
					</div>
				</div>
			</div>
		</div>
      )
    }
}




// 订单应转
export  class OrderShould extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="model-box">
            <div className="box-title">
                <div className="box-title-text">订单应转</div>
                <div className={(this.props.check ? 'hide': '')+" box-title-operate"}>
                    <div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>录入明细</div>
                </div>
            </div>
            <div className="model-main">
                <div className="model-main-item-box">
                    <div className="model-main-item flex-j-sb">
                    {Object.keys(this.props.view['订单应转']).map( (item,i) => 
                        <strong key={i}>
                        {item === 'receivable' ? '应转':''}
                        {item === 'receivad' ? '已转':''}
                        {item === 'uncollected' ? '未转':''}
                        : <i>{this.props.view['订单应转'][item]}</i></strong>
                    )}
                    </div>
                </div>
            </div>
        </div>
      )
    }
}




// 订单利润
export  class OrderProfits extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="model-box">
            <div className="box-title">
                <div className="box-title-text">订单利润</div>
            </div>
            <div className="model-main">
                <div className="model-main-item-box">
                    <div className="model-main-item flex-j-sb over-x-auto">
                    {Object.keys(this.props.view['订单应转']).map( (item,i) => 
                        <strong key={i}>
                        {item === 'receivable' ? '应转':''}
                        {item === 'receivad' ? '已转':''}
                        {item === 'uncollected' ? '未转':''}
                        : <i>{this.props.view['订单应转'][item]}</i></strong>
                    )}
                    </div>
                </div>
            </div>
        </div>
      )
    }
}




// 订单备注
export  class OrderNote extends React.Component {
    constructor() {
      super()
      this.state = {}
    }
  
    render() {
      return (
        <div className="model-box" style={{marginBottom: '1.493333rem'}}>
			<div className="box-title">
				<div className="box-title-text">订单备注</div>
			</div>
			<div className="model-main">
				<div className="model-main-item-box">
					<div className="model-main-item">
                        <input type="text" value={this.props.view['订单备注'].name} disabled={this.props.check ? 'disabled': ''}
                        onChange={ e => this.setState({'接单人["name"]': e.target.value})} />   
					</div>
				</div>
			</div>
		</div>
      )
    }
}

// add row
export function addRowDialog(view,block_cfg,is_open,block){
    return (
    <Dialog
    isOpen={is_open}
    isCancelable={true}
    onCancel={_=>view.CancelAddRow(block)}>
      <div className="zs-popup" style={{paddingTop: '40px'}}>
          {/* <div className="zs-popup-avatar">
            <img src="img/avatar.png" />
          </div><br /> */}
          <div className="zs-popup-info">
              {
                Object.keys(block_cfg.list).map( key => 
                  (!block_cfg.list[key]['type'] || !Enum[block_cfg.list[key]['type']]) &&(!block_cfg.list[key]['ro']) &&
                  <div className="model-box" key={key}>
                    <div className="model-main">
                      <div className="model-main-box">
                        <div className="model-main-item" style={{backgroundColor: '#f9f9f9'}}>
                          <span>{block_cfg.list[key]['text']}</span>
                          <input value={view.state.data['row']?view.state.data['row'][key]:''} onChange={ e => view.setNewValue(e.target.value,key)}
                          type={block_cfg.list[key]['type']?block_cfg.list[key]['type']:'text'} /></div>       
                      </div>
                    </div>
                  </div>
                )
              }
              {
                Object.keys(block_cfg.list).map( key => 
                    (block_cfg.list[key]['type'] && Enum[block_cfg.list[key]['type']]) && (!block_cfg.list[key]['ro']) &&
                    <div className="model-box" key={key}>
                      <div className="model-main">
                        <div className="model-main-box">
                          <div className="model-main-item" style={{backgroundColor: '#f9f9f9'}}>
                            <span>{block_cfg.list[key]['text']}</span>
                            <Select id={key} style={{width: '3.466667rem'}}
                            onChange={e => view.setNewValue(e.target.value,key)} value = {view.state.data['row'][key]?view.state.data['row'][key]:''}>
                              {
                                Object.keys(Enum[block_cfg.list[key]['type']]).map( _k =>
                                  <option  key = {_k} value = {_k}>{Enum[block_cfg.list[key]['type']][_k]}</option>
                                )
                              }
                                  </Select>     
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              }
            </div><br />
            <div className="zs-popup-btn">
              <span onClick={_=>view.addRowDone(block)}>确定</span>
            </div>
        </div>
    </Dialog>
    )
}

export function editRowDialog(view,block_cfg,is_edit,edit_index,block){
    return (
    <Dialog
    isOpen={is_edit}
    isCancelable={true}
    onCancel={_=>view.CancelEditRow(block)}>
      <div className="zs-popup">
          <div className="zs-popup-avatar">
            <img src="img/avatar.png" />
          </div><br />
          <div className="zs-popup-info">
              {
                Object.keys(block_cfg.list).map( key => 
                 (!block_cfg.list[key]['type'] || !Enum[block_cfg.list[key]['type']]) && (!block_cfg.list[key]['ro']) &&
                  <div className="model-box" key={key}>
                    <div className="model-main">
                      <div className="model-main-box">
                        <div className="model-main-item">
                          <span>{block_cfg.list[key]['text']}</span>
                          <input value={view.state.data['row']?view.state.data['row'][key]:''} onChange={ e => view.setNewValue(e.target.value,key)}
                          type={block_cfg.list[key]['type']?block_cfg.list[key]['type']:'text'} /></div>      
                      </div>
                    </div>
                  </div>
                )
              }
              {
                Object.keys(block_cfg.list).map( key => 
                    (block_cfg.list[key]['type'] && Enum[block_cfg.list[key]['type']]) && (!block_cfg.list[key]['ro']) &&
                    <div className="model-box" key={key}>
                      <div className="model-main">
                        <div className="model-main-box">
                          <div className="model-main-item">
                            <span>{block_cfg.list[key]['text']}</span>
                            <Select id={key} onChange={e => view.setNewValue(e.target.value,key)} value = {view.state.data['row'][key]?view.state.data['row'][key]:''}>
                              {
                                Object.keys(Enum[block_cfg.list[key]['type']]).map( _k =>
                                  <option  key = {_k} value = {_k}>{Enum[block_cfg.list[key]['type']][_k]}</option>
                                )
                              }
                                  </Select>     
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              }
            </div><br />
            <div className="zs-popup-btn">
              <button onClick={_=>view.EditRowDone(block,edit_index)}>确定</button>
            </div>
        </div>
    </Dialog>
    )
}