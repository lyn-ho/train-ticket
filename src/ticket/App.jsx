import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'

import './App.css'
import Header from '../common/Header'
import Nav from '../common/Nav'
import Detial from '../common/Detail'
import Candidate from './Candidate'
import Schedule from './Schedule'
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
} from './actions'

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
    if (!setSearchParsed) return

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
  }, [departDate, dispatch, trainNumber])

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(dispatch, departDate, prevDate, nextDate)

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
