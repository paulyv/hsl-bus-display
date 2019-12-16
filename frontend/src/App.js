import React, { Component } from "react";
import moment from "moment";
import './App.css';
import {timetable_weekdays, timetable_saturdays, timetable_sundays} from './timetable';


class App extends Component {
  constructor(props) {
  super(props);
  this.state = {};

}

componentDidMount() {
  this.setState({
    currentTime : moment()
  })

  setInterval( () => {
    this.setState({
      currentTime : moment()
    })
  },1000)
}

parseSchelude = (schedule) => {
  let _this = this;
  let busses = '';
  let counter = 0;

  busses = schedule.map((item, key) => {
  if(moment(item.time, 'HH:mm').isAfter()) {
    let item_time = moment(item.time, 'HH:mm');
    let current_time = moment(_this.state.currentTime ,"HH:mm");
    let dur = moment.duration(item_time.diff(current_time));
    let mins = (dur.hours() * 60) + dur.minutes();
    if(Number(mins) < 20 || counter < 5) {
      counter++;
      if(Number(mins) < 20) {
        return <><div className="bus-number">{item.line}</div> <div className="bus-destination">{item.destination}</div> <div className="bus-arrival">{mins}</div></>
      }
        return <><div className="bus-number">{item.line}</div> <div className="bus-destination">{item.destination}</div> <div className="bus-arrival">{item.time}</div></>
    }
  } else {
    return '';
  }
})
  return busses;
}

render() {
let _this = this;

  const Buslines = function() {
    let current_time = moment(_this.state.currentTime ,"HH:mm");
    let weekday = current_time.day();

    // SUNDAY
    if(weekday === 0) {
      return _this.parseSchelude(timetable_sundays);
    }
    // WEEKDAYs
    if((weekday > 0) && (weekday <= 5)) {
      return _this.parseSchelude(timetable_weekdays);
    }
    // SATURDAY
    if(weekday === 6 ) {
      return _this.parseSchelude(timetable_saturdays);
    }
    return '';
  }

  return (
    <div className="whole-page-wrapper">

      <div className="top-section-left">
        <img src="./hsl-logo.png" alt="hsl-logo"></img>
      </div>
      <div className="top-fill-middle"></div>
      <div className="top-section-right">
        <div className="current-time">{moment(this.state.currentTime).format('HH:mm')}</div>
      </div>
      <div className="fill-empty-row"></div>


      <div className="bus-line-title">Linja</div>
      <div className="bus-destination-title">Määränpää</div>
      <div className="bus-arrival-title">Aika | Min</div>
      <Buslines />

    </div>
  );
  }

}

export default App;
