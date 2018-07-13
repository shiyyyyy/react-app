// 日历渲染函数
export default function calendar (year, month, date) {
  var _date = new Date()

  console.log(year + "-" + month + "-" + date)
  var day = _date.getDay() // 周几 返回几就是周几, 0 是周日

  // 这个月的第一天 是周几
  var firstDay = new Date(year - 0, month - 1, 1).getDay()
  console.log('本月第一天是周 :' + firstDay)

  // 上个月在本月显示的天数的数组
  var lastMonthDays = [];
  for (var i = firstDay - 1; i >= 0; i--) {
    // 可以用 负的 天 来从本月算到上个月
    console.log(new Date(year - 0, month - 1, -i).getDate())

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
  console.log(new Date(year, month, 0).getDate()) //判断天数(用下个月的0天 返回本月最后一天)
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
  console.log('本月 最后一天 星期几:' + endDay)
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

  console.log(weeks)

  this.setState({
    year: year,
    month: month,
    date: date,
    weeks: weeks
  },()=>{console.log(this)})
  

  }