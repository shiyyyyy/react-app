import React from 'react'
import ReactDOM from 'react'
import {render} from 'react-dom'



// CalendarHeader CalendarHeader CalendarHeader
class CalendarHeader extends React.Component {
    render() {
      return (
        <div className="calendarHeader">
          <span className="prev"
                onClick={this.props.prevMonth}>
            《
          </span>
          <span className="next"
                onClick={this.props.nextMonth}>
            》
          </span>
          <span className="dateInfo">
            {this.props.year}年{this.props.month + 1}月
          </span>
        </div>
      )
    }
  }
  
// CalendarMain CalendarMain CalendarMain CalendarMain
class CalendarMain extends React.Component {

    //处理日期选择事件，如果是当月，触发日期选择；如果不是当月，切换月份
    handleDatePick(index, styleName) {
      switch (styleName) {
        case 'thisMonth':
          let month = this.props.viewData[this.props.month]
          this.props.datePick(month[index])
          break
        case 'prevMonth':
          this.props.prevMonth()
          break
        case 'nextMonth':
          this.props.nextMonth()
          break
      }
    }
  
    //处理选择时选中的样式效果
    //利用闭包保存上一次选择的元素，
    //在月份切换和重新选择日期时重置上一次选择的元素的样式
    changeColor() {
      let previousEl = null
      return function (event) {
        let name = event.target.nodeName.toLocaleLowerCase()
        if (previousEl && (name === 'i' || name === 'td')) {
          previousEl.style = ''
        }
        if (event.target.className === 'thisMonth') {
          event.target.style = 'background:#F8F8F8;color:#000'
          previousEl = event.target
        }
      }
    }
  
    //绑定颜色改变事件
    componentDidMount() {
      let changeColor = this.changeColor()
      document.getElementById('calendarContainer')
        .addEventListener('click', changeColor, false);
  
    }
  
    render() {
      //确定当前月数据中每一天所属的月份，以此赋予不同className
      let month = this.props.viewData[this.props.month],
        rowsInMonth = [],
        i = 0,
        styleOfDays = (()=> {
          let i = month.indexOf(1),
            j = month.indexOf(1, i + 1),
            arr = new Array(42)
          arr.fill('prevMonth', 0, i)
          arr.fill('thisMonth', i, j)
          arr.fill('nextMonth', j)
          return arr
        })()
  
      //把每一个月的显示数据以7天为一组等分
      month.forEach((day, index)=> {
        if (index % 7 === 0) {
          rowsInMonth.push(month.slice(index, index + 7))
        }
      })
  
      return (
        <table className="calendarMain">
          <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
          </thead>
          <tbody>
          {
            rowsInMonth.map((row, rowIndex)=> {
              return (
                <tr key={rowIndex}>
                  {
                    row.map((day)=> {
                      return (
                        <td className={styleOfDays[i]}
                            onClick={
                              this.handleDatePick.bind
                              (this, i, styleOfDays[i])}
                            key={i++}>
                          {day}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
          </tbody>
        </table>
      )
    }
  }



// CalendarFooter CalendarFooter CalendarFooter
class CalendarFooter extends React.Component {

    handlePick() {
      this.props.datePickerToggle()
      this.props.picked()
    }
  
    render() {
      return (
        <div className="calendarFooter">
          <button onClick={this.handlePick.bind(this)}>
            确定
          </button>
        </div>
      )
    }
  }
  


// -------------------------------------------------
const displayDaysPerMonth = (year)=> {

  //定义每个月的天数，如果是闰年第二月改为29天
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29
  }

  //以下为了获取一年中每一个月在日历选择器上显示的数据，
  //从上个月开始，接着是当月，最后是下个月开头的几天

  //定义一个数组，保存上一个月的天数
  let daysInPreviousMonth = [].concat(daysInMonth)
  daysInPreviousMonth.unshift(daysInPreviousMonth.pop())

  //获取每一个月显示数据中需要补足上个月的天数
  let addDaysFromPreMonth = new Array(12)
    .fill(null)
    .map((item, index)=> {
      let day = new Date(year, index, 1).getDay()
      if (day === 0) {
        return 6
      } else {
        return day - 1
      }
    })

  //已数组形式返回一年中每个月的显示数据,每个数据为6行*7天
  return new Array(12)
    .fill([])
    .map((month, monthIndex)=> {
      let addDays = addDaysFromPreMonth[monthIndex],
        daysCount = daysInMonth[monthIndex],
        daysCountPrevious = daysInPreviousMonth[monthIndex],
        monthData = []
      //补足上一个月
      for (; addDays > 0; addDays--) {
        monthData.unshift(daysCountPrevious--)
      }
      //添入当前月
      for (let i = 0; i < daysCount;) {
        monthData.push(++i)
      }
      //补足下一个月
      for (let i = 42 - monthData.length, j = 0; j < i;) {
        monthData.push(++j)
      }
      return monthData
    })
}

export default class Calendar extends React.Component {
  constructor() {
    //继承React.Component
    super()
    let now = new Date()
    this.state = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      picked: false
    }
  }

  //切换到下一个月
  nextMonth() {
    if (this.state.month === 11) {
      this.setState({
        year: ++this.state.year,
        month: 0
      })
    } else {
      this.setState({
        month: ++this.state.month
      })
    }
  }
  //切换到上一个月
  prevMonth() {
    if (this.state.month === 0) {
      this.setState({
        year: --this.state.year,
        month: 11
      })
    } else {
      this.setState({
        month: --this.state.month
      })
    }
  }
  //选择日期
  datePick(day) {
    this.setState({day})
  }
  //切换日期选择器是否显示
  datePickerToggle() {
    this.refs.main.style.height =
      this.refs.main.style.height === '460px' ?
        '0px' : '460px'
  }
  //标记日期已经选择
  picked() {
    this.state.picked = true
  }

  render() {
    let props = {
      viewData: displayDaysPerMonth(this.state.year),
      datePicked: `${this.state.year} 年
                   ${this.state.month + 1} 月
                   ${this.state.day} 日`
    }
    return (
      <div className="output">
        <div className="star1"></div>
        <div className="star2"></div>
        <div className="star3"></div>
        <p className="datePicked"
           onClick={this.datePickerToggle.bind(this)}>
          {props.datePicked}
        </p>
        <div className="main" ref="main">
          <CalendarHeader prevMonth={this.prevMonth.bind(this)}
                          nextMonth={this.nextMonth.bind(this)}
                          year={this.state.year}
                          month={this.state.month}
                          day={this.state.day}/>
          <CalendarMain {...props}
                        prevMonth={this.prevMonth.bind(this)}
                        nextMonth={this.nextMonth.bind(this)}
                        datePick={this.datePick.bind(this)}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day}/>
          <CalendarFooter
            picked={this.picked.bind(this)}
            datePickerToggle={this.datePickerToggle.bind(this)}/>
        </div>
      </div>
    )
  }
}


//将calender实例添加到window上以便获取日期选择数据
// window.calendar = render(
//   <Calendar/>,
//   document.getElementById('calendar')
// )
