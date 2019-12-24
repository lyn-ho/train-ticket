import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import leftPad from 'left-pad'
import URI from 'urijs'
import dayjs from 'dayjs'

import './Schedule.css'

const ScheduleRow = memo(function ScheduleRow(props) {
  const {
    index,
    station,
    arriveTime,
    departTime,
    stay,
    isStartStation,
    isEndStation,
    isDepartStation,
    isArriveStation,
    beforeDepartStation,
    afterArriveStation,
  } = props

  return (
    <li>
      <div className={classnames('icon', { 'icon-red': isDepartStation || isArriveStation })}>
        {isDepartStation ? '出' : isArriveStation ? '到' : leftPad(index, 2, 0)}
      </div>
      <div className={classnames('row', { grey: beforeDepartStation || afterArriveStation })}>
        <span className={classnames('station', { red: isArriveStation || isDepartStation })}>{station}</span>
        <span className={classnames('arrtime', { red: isArriveStation })}>
          {isStartStation ? '始发站' : arriveTime}
        </span>
        <span className={classnames('deptime', { red: isDepartStation })}>{isEndStation ? '终到站' : departTime}</span>
        <span className="stoptime">{isStartStation || isEndStation ? '-' : `${stay}分`}</span>
      </div>
    </li>
  )
})

ScheduleRow.propTypes = {
  index: PropTypes.number.isRequired,
  station: PropTypes.string.isRequired,
  arriveTime: PropTypes.string,
  departTime: PropTypes.string,
  stay: PropTypes.number,

  isStartStation: PropTypes.bool.isRequired,
  isEndStation: PropTypes.bool.isRequired,
  isDepartStation: PropTypes.bool.isRequired,
  isArriveStation: PropTypes.bool.isRequired,
  beforeDepartStation: PropTypes.bool.isRequired,
  afterArriveStation: PropTypes.bool.isRequired,
}

const Schedule = memo(function Schedule(props) {
  const { date, trainNumber, departStation, arriveStation } = props

  const [scheduleList, setScheduleList] = useState([])

  useEffect(() => {
    const url = new URI('/rest/schedule')
      .setSearch('trainNumber', trainNumber)
      .setSearch('departStation', departStation)
      .setSearch('arriveStation', arriveStation)
      .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
      .toString()

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        let departRow
        let arriveRow

        for (let i = 0; i < result.length; ++i) {
          if (!departRow) {
            if (result[i].station === departStation) {
              departRow = Object.assign(result[i], {
                beforeDepartStation: false,
                isDepartStation: true,
                afterArriveStation: false,
                isArriveStation: false,
              })
            } else {
              Object.assign(result[i], {
                beforeDepartStation: true,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false,
              })
            }
          } else if (!arriveRow) {
            if (result[i].station === arriveStation) {
              arriveRow = Object.assign(result[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: true,
              })
            } else {
              Object.assign(result[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false,
              })
            }
          } else {
            Object.assign(result[i], {
              beforeDepartStation: false,
              isDepartStation: false,
              afterArriveStation: true,
              isArriveStation: false,
            })
          }

          Object.assign(result[i], {
            isStartStation: i === 0,
            isEndStation: i === result.length - 1,
          })
        }

        console.log(result)

        setScheduleList(result)
      })
  }, [arriveStation, date, departStation, trainNumber])

  return (
    <div className="schedule">
      <div className="dialog">
        <h1>列车时刻表</h1>
        <div className="head">
          <div className="station">车站</div>
          <div className="deptime">到达</div>
          <div className="arrtime">发车</div>
          <div className="stoptime">停留时间</div>
        </div>
        <ul>
          {scheduleList.map((schedule, index) => (
            <ScheduleRow key={schedule.station} {...schedule} index={index + 1} />
          ))}
        </ul>
      </div>
    </div>
  )
})

Schedule.propTypes = {
  date: PropTypes.number.isRequired,
  trainNumber: PropTypes.string.isRequired,
  departStation: PropTypes.string.isRequired,
  arriveStation: PropTypes.string.isRequired,
}

export default Schedule
