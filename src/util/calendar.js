import React from 'react'

export default class Calendar extends React.Component {
  constructor(props) {
    //继承React.Component
    super(props)
    this.pre_view = this.props.view
    this.groups = this.props.groups
    let now = new Date()
    this.state = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
    }
    this.state.weeks = this.getWeeks()
  }


  getWeeks () {
    var year = this.state.year
    var month = this.state.month
    var _date = new Date()

    // console.log(year + "-" + month + "-" + date)
    var day = _date.getDay() // 周几 返回几就是周几, 0 是周日

    // 这个月的第一天 是周几
    var firstDay = new Date(year - 0, month - 1, 1).getDay()
    // console.log('本月第一天是周 :' + firstDay)

    // 上个月在本月显示的天数的数组
    var lastMonthDays = [];
    for (var i = firstDay - 1; i >= 0; i--) {
      // 可以用 负的 天 来从本月算到上个月
      // console.log(new Date(year - 0, month - 1, -i).getDate())

      // 上个月的 天 倒序
      lastMonthDays.push({
      // 注意: 数组里面不只有天,还有月份,可以用月分可以判断样式,例如字体颜色
      'date': new Date(year - 0, month - 1, -i).getDate(),
      'month': month - 1 < 10 ? "0" + (month - 1) : '' + (month - 1),
      "year": year
      })
    }
    // 本月 天数 数组
    var currentMonthDays = [];
    // console.log(new Date(year, month, 0).getDate()) //判断天数(用下个月的0天 返回本月最后一天)
    for (var i = 1, len = new Date(year, month, 0).getDate(); i <= len; i++) {
      currentMonthDays.push({
      'date': i < 10 ? "0" + i : "" + i,
      'month': month < 10 ? "0" + month : month,
      "year": year
      })
    }
    // 下月 天数 数组
    var nextMonthDays = []
    var endDay = new Date(year, month, 0).getDay(); //判断本月最后一天星期几
    // console.log('本月 最后一天 星期几:' + endDay)
    for (var i = 1; i < 7 - endDay; i++) {
      nextMonthDays.push({
      'date': "0" + i,
      'month': month - 0 + 1 < 10 ? "0" + (month + 1) : '' + (month + 1),
      "year": year
      })
    }

    var calendar = []
    calendar = calendar.concat(lastMonthDays, currentMonthDays, nextMonthDays)
    var weeks = []

    for (var i = 0; i < calendar.length; i++) {
      if (i % 7 == 0) {
      // 7个一组 分开总数组
      weeks[parseInt(i / 7)] = new Array(7);
      }
      // 用 parseInt来直接实现自动添加分组数据
      weeks[parseInt(i / 7)][i % 7] = calendar[i]
    }
    return weeks;
  }

  setWeeks() {
    this.setState({
      weeks: this.getWeeks()
    })
  }

  prevMonth(){
    let month = this.state.month
    if(month == 1){
      month = 12
      this.setState({year:this.state.year-1,month:month},this.setWeeks)
    }else{
      month = month - 1      
      this.setState({month:month},this.setWeeks)
    }
  }
  nextMonth(){
    let month = this.state.month
    if(month == 12){
      month = 1
      this.setState({year:this.state.year+1,month:month},this.setWeeks)
    }else{
      month = month + 1
      this.setState({month:month},this.setWeeks)
    }
  }

  prevMonthDisp(){
    return (this.state.month === 1 ? (this.state.year -1) : this.state.year)+'年'+
          (this.state.month === 1 ? 12 : (this.state.month - 1))+'月'
  }

  nextMonthDisp(){
    return (this.state.month === 12 ? (this.state.year + 1): this.state.year)+'年'+
          (this.state.month === 12 ? 1 : (this.state.month + 1))+'月'
  }

  cellClass(cell){
    let dep_date = cell.year +"-"+ cell.month +"-"+ cell.date;
    let match = this.groups.find(i=>i.dep_date===dep_date);
    return 'week-item-date'+" "+ 
          (this.state.month === (cell.month-0) ? '' : 'not-cur-month')+' '+
          (match ? 'active-week-item-date':'')
  }

  seatClass(cell){
    return 'main-seat-surplus' +' '+ 
          (this.state.month === (cell.month-0) ? '':'hide')
          // (this.state.cur_date === (cell.year+'-'+cell.month+'-'+cell.date) ? 'active-main-seat-surplus':'')
  }

  zkClass(cell){
    return 'main-zk-price' +' '+ 
        (this.state.month === (cell.month-0) ? '':'hide')
        // (this.state.cur_date === (cell.year+'-'+cell.month+'-'+cell.date) ? 'active-main-zk-price':'')
  }
  
  curGroup(cell){
    let date = cell.year +"-"+ cell.month +"-"+ cell.date;
    let cur_date = this.state.cur_date

    // let cur_group = this.pre_view.state.data.select_group
    // let group = 
    return "calender-body-date-week-item" + " " +
    ( date === cur_date ?'active-exist':'')
  }
  renderCell(cell){
    let dep_date = cell.year +"-"+ cell.month +"-"+ cell.date;
    let group_i;
    let match = this.groups.find( i => {
      if(i.dep_date===dep_date){
        group_i = i.id;
        return true
      }else{
        return false
      }
    });
    if(!match){
      return;
    }
    return (
        <div onClick={_=>this.selectGroup(cell,group_i)} className='exist'>
            <span className={this.seatClass(cell)}>余 {match.seat_surplus}</span><br />
            <span className={this.zkClass(cell)}>￥{match.zk_price * 1 || 0}</span>
        </div>
    );
  }

  selectGroup(cell,group_i){
    if(!group_i) return

    let date = cell.year+'-'+cell.month+'-'+cell.date
    this.setState({cur_date: date})
    this.pre_view.setState({selected_group:group_i})
  }

  render() {
    return (
            <div className="calendar">
                <div className="calendar-panel">
                  <div className="prevImg" onClick={_=>this.prevMonth()}>
                    <img src="img/prev.png" />
                  </div>
                  <div className="time-other">{this.prevMonthDisp()}</div>
                    <div className="time">{this.state.year}年{this.state.month}月</div>
                  <div className="time-other">{this.nextMonthDisp()}</div>
                  <div className="nextImg" onClick={_=>this.nextMonth()}>
                  <img src="img/next.png" />
                  </div>
                </div>
                <div className="calendar-header">
                  <div>日</div>
                  <div>一</div>
                  <div>二</div>
                  <div>三</div>
                  <div>四</div>
                  <div>五</div>
                  <div>六</div>
                </div>
                <div className="calendar-body">
                {
                  this.state.weeks.map( (row,i) =>
                      <div className="calender-body-date-week" key={row[0].year+row[0].month+'-'+i}>
                      {
                        row.map( cell =>
                          <div className={this.curGroup(cell)} key={cell.year+'-'+cell.month+'-'+cell.date}>
                            <div className={this.cellClass(cell)}>{cell.date}</div>
                            {
                              this.renderCell(cell)
                            }
                          </div>
                        )
                      }
                      </div>
                  )
                }
                </div>
              </div>
    )
  }
}
