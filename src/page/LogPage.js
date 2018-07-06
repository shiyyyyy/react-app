import React, { Component } from 'react';

export default class LogPage extends Component{

	render(){
		return (
			<ons-page>
			  	<ons-toolbar>
			  	  <div className='left'><ons-back-button></ons-back-button></div>
			      <div className="center">日志</div>
			      <div className="right">
			      	<ons-toolbar-button onClick={_=>{localStorage.log=''}}>清空</ons-toolbar-button>
		      	  </div>
			  	</ons-toolbar>
			  	<pre>
			  		{localStorage.log}
			  	</pre>
		  </ons-page>
		);
	}
};
