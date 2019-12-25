import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import URI from 'urijs'
import dayjs from 'dayjs'

import './App.css'
import Header from '../common/Header'
import Nav from '../common/Nav'
import Detail from '../common/Detail'
import Candidate from './Candidate'
// import Schedule from './Schedule'
import { h0 } from '../common/utils'
import useNav from '../common/useNav'
import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setDepartDate,
  setSearchParsed,
  prevDate,
  nextDate,
  setDepartTimeStr,
  setArriveTimeStr,
  setArriveDate,
  setDurationStr,
  setTickets,
  toggleIsScheduleVisible,
} from './actions'
import { TrainContext } from './context'

const Schedule = lazy(() => import('./Schedule'))

function App(props) {
  const {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,

    dispatch,
  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)

    const { aStation, dStation, date, trainNumber } = queries

    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))

    dispatch(setSearchParsed(true))
  }, [dispatch])

  useEffect(() => {
    document.title = trainNumber
  }, [trainNumber])

  useEffect(() => {
    if (!searchParsed) return

    const url = new URI('/rest/ticket')
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('trainNumber', trainNumber)
      .toString()

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        const { detail, candidates } = result

        const { departTimeStr, arriveTimeStr, arriveDate, durationStr } = detail

        dispatch(setDepartTimeStr(departTimeStr))
        dispatch(setArriveTimeStr(arriveTimeStr))
        dispatch(setArriveDate(arriveDate))
        dispatch(setDurationStr(durationStr))
        dispatch(setTickets(candidates))
      })
  }, [departDate, dispatch, searchParsed, trainNumber])

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(dispatch, departDate, prevDate, nextDate)

  const detailCbs = useMemo(() => bindActionCreators({ toggleIsScheduleVisible }, dispatch), [dispatch])

  if (!setSearchParsed) return null

  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title={trainNumber} onBack={onBack} />
      </div>
      <div className="nav-wrapper">
        <Nav
          date={departDate}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          prev={prev}
          next={next}
        />
      </div>
      <div className="detail-wrapper">
        <Detail
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber}
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
          {...detailCbs}
        />
      </div>
      <TrainContext.Provider value={{ trainNumber, departStation, arriveStation, departDate }}>
        <Candidate tickets={tickets} />
      </TrainContext.Provider>
      {isScheduleVisible && (
        <div className="mask" onClick={() => dispatch(toggleIsScheduleVisible())}>
          <Suspense fallback={<div>loading</div>}>
            <Schedule
              date={departDate}
              trainNumber={trainNumber}
              departStation={departStation}
              arriveStation={arriveStation}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  },
)(App)
